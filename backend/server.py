"""P-Nice — FastAPI backend.

Handles: product catalog, Stripe Checkout (hosted) sessions, secure server-side
pricing, payment status polling, Stripe webhook, order creation + confirmation
email, contact form and newsletter signup.

Payments use the official Stripe Python SDK (Checkout Sessions). No raw card
data is ever collected or stored — Stripe handles all payment data.
"""

import os
import asyncio
import logging
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Annotated

import stripe
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, BeforeValidator, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from products_data import PRODUCTS, COSMETIC_DISCLAIMER

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(ROOT_DIR, ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pnice")

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
# Prefer an explicit MONGO_URL (e.g. local .env); fall back to MONGODB_URI, which
# the Vercel ↔ MongoDB Atlas integration injects and keeps in sync automatically.
MONGO_URL = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URI")
if not MONGO_URL:
    raise RuntimeError("Set MONGO_URL or MONGODB_URI to the MongoDB connection string")
DB_NAME = os.environ["DB_NAME"]
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
SUPPORT_EMAIL = os.environ.get("SUPPORT_EMAIL", "support@p-nice.com")
STATEMENT_DESCRIPTOR = os.environ.get("STORE_STATEMENT_DESCRIPTOR", "P-Nice")

stripe.api_key = STRIPE_API_KEY

# Fast lookup of products by id (server is source of truth for price)
PRODUCT_INDEX: Dict[str, dict] = {p["id"]: p for p in PRODUCTS}

FREE_SHIPPING_THRESHOLD = 50.0
SHIPPING_FLAT_RATE = 5.95

# ---------------------------------------------------------------------------
# Pydantic helpers
# ---------------------------------------------------------------------------
PyObjectId = Annotated[str, BeforeValidator(str)]


class CartItemIn(BaseModel):
    product_id: str
    quantity: int = 1
    variant: Optional[str] = None


class CheckoutRequest(BaseModel):
    items: List[CartItemIn]
    origin_url: str
    email: Optional[EmailStr] = None


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str


class NewsletterIn(BaseModel):
    email: EmailStr
    consent: bool = False


# ---------------------------------------------------------------------------
# App / router
# ---------------------------------------------------------------------------
app = FastAPI(title="P-Nice API")
api = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------
@api.get("/")
async def root():
    return {"status": "ok", "store": "P-Nice"}


@api.get("/products")
async def list_products(category: Optional[str] = None):
    items = PRODUCTS
    if category and category.lower() != "all":
        items = [p for p in PRODUCTS if category.lower() in p["category"].lower()]
    return {"products": items, "disclaimer": COSMETIC_DISCLAIMER}


@api.get("/products/{slug}")
async def get_product(slug: str):
    product = next((p for p in PRODUCTS if p["slug"] == slug), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    related = [p for p in PRODUCTS if p["slug"] != slug]
    return {"product": product, "related": related}


@api.get("/config")
async def store_config():
    return {
        "free_shipping_threshold": FREE_SHIPPING_THRESHOLD,
        "shipping_flat_rate": SHIPPING_FLAT_RATE,
        "currency": "usd",
        "statement_descriptor": STATEMENT_DESCRIPTOR,
        "support_email": SUPPORT_EMAIL,
        "disclaimer": COSMETIC_DISCLAIMER,
    }


# ---------------------------------------------------------------------------
# Stripe Checkout
# ---------------------------------------------------------------------------
def _compute_order(items: List[CartItemIn]):
    """Server-side authoritative pricing. Never trust amounts from client."""
    line_items = []
    subtotal = 0.0
    for it in items:
        product = PRODUCT_INDEX.get(it.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Invalid product: {it.product_id}")
        qty = max(1, int(it.quantity))
        line_total = round(product["price"] * qty, 2)
        subtotal += line_total
        line_items.append(
            {
                "product_id": product["id"],
                "name": product["name"],
                "variant": it.variant or product["variants"][0],
                "unit_price": product["price"],
                "quantity": qty,
                "line_total": line_total,
            }
        )
    subtotal = round(subtotal, 2)
    shipping = 0.0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FLAT_RATE
    total = round(subtotal + shipping, 2)
    return line_items, subtotal, shipping, total


def _to_cents(amount: float) -> int:
    return int(round(amount * 100))


@api.post("/checkout/session")
async def create_checkout_session(req: CheckoutRequest, request: Request):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=503, detail="Payments are not configured.")

    line_items, subtotal, shipping, total = _compute_order(req.items)

    origin = req.origin_url.rstrip("/")
    success_url = f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/cart"

    stripe_line_items = [
        {
            "price_data": {
                "currency": "usd",
                "product_data": {"name": f"{li['name']} ({li['variant']})"},
                "unit_amount": _to_cents(li["unit_price"]),
            },
            "quantity": li["quantity"],
        }
        for li in line_items
    ]

    shipping_options = [
        {
            "shipping_rate_data": {
                "type": "fixed_amount",
                "fixed_amount": {"amount": _to_cents(shipping), "currency": "usd"},
                "display_name": "Free shipping" if shipping == 0 else "Standard shipping",
            }
        }
    ]

    metadata = {
        "source": "pnice_web",
        "item_count": str(sum(li["quantity"] for li in line_items)),
        "subtotal": f"{subtotal:.2f}",
        "shipping": f"{shipping:.2f}",
    }
    if req.email:
        metadata["email"] = req.email

    try:
        session = await asyncio.to_thread(
            stripe.checkout.Session.create,
            mode="payment",
            line_items=stripe_line_items,
            shipping_options=shipping_options,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            customer_email=req.email or None,
        )
    except stripe.error.StripeError as exc:  # noqa: BLE001
        logger.error("Stripe session creation failed: %s", exc)
        raise HTTPException(status_code=502, detail="Could not start checkout. Please try again.")

    # MANDATORY: record transaction BEFORE returning, status pending
    txn = {
        "session_id": session.id,
        "amount": total,
        "subtotal": subtotal,
        "shipping": shipping,
        "currency": "usd",
        "line_items": line_items,
        "email": req.email,
        "metadata": metadata,
        "payment_status": "pending",
        "status": "initiated",
        "order_email_sent": False,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.payment_transactions.insert_one(txn)

    return {"url": session.url, "session_id": session.id}


@api.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str):
    txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not txn:
        raise HTTPException(status_code=404, detail="Session not found")

    # If already finalized, return cached result (idempotent — no double processing)
    if txn.get("payment_status") == "paid":
        return _status_payload(txn)

    try:
        session = await asyncio.to_thread(stripe.checkout.Session.retrieve, session_id)
    except stripe.error.StripeError as exc:  # noqa: BLE001
        logger.error("Stripe status retrieve failed: %s", exc)
        raise HTTPException(status_code=502, detail="Could not check payment status.")

    update = {
        "payment_status": session.get("payment_status"),
        "status": session.get("status"),
        "updated_at": now_iso(),
    }
    await db.payment_transactions.update_one(
        {"session_id": session_id}, {"$set": update}
    )
    txn.update(update)

    if session.get("payment_status") == "paid":
        await _finalize_order(session_id)
        txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})

    return _status_payload(txn)


def _status_payload(txn: dict) -> dict:
    return {
        "session_id": txn["session_id"],
        "payment_status": txn.get("payment_status"),
        "status": txn.get("status"),
        "amount": txn.get("amount"),
        "currency": txn.get("currency", "usd"),
        "line_items": txn.get("line_items", []),
        "subtotal": txn.get("subtotal"),
        "shipping": txn.get("shipping"),
        "order_number": txn.get("order_number"),
        "email": txn.get("email"),
    }


async def _finalize_order(session_id: str):
    """Create the order exactly once and send confirmation email."""
    txn = await db.payment_transactions.find_one({"session_id": session_id})
    if not txn or txn.get("order_email_sent"):
        return

    # Atomically claim the finalize step to avoid duplicate orders/emails
    claim = await db.payment_transactions.update_one(
        {"session_id": session_id, "order_email_sent": {"$ne": True}},
        {"$set": {"order_email_sent": True}},
    )
    if claim.modified_count == 0:
        return

    order_number = f"PN-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(ObjectId())[-6:].upper()}"
    order = {
        "order_number": order_number,
        "session_id": session_id,
        "email": txn.get("email"),
        "line_items": txn.get("line_items", []),
        "subtotal": txn.get("subtotal"),
        "shipping": txn.get("shipping"),
        "amount": txn.get("amount"),
        "currency": txn.get("currency", "usd"),
        "status": "paid",
        "created_at": now_iso(),
    }
    await db.orders.insert_one(order)
    await db.payment_transactions.update_one(
        {"session_id": session_id}, {"$set": {"order_number": order_number}}
    )

    if txn.get("email"):
        await _send_order_email(txn.get("email"), order_number, order)


async def _send_order_email(to_email: str, order_number: str, order: dict):
    if not RESEND_API_KEY:
        logger.info("RESEND_API_KEY not set — skipping confirmation email (order %s)", order_number)
        return
    try:
        import resend

        resend.api_key = RESEND_API_KEY
        rows = "".join(
            f"<tr><td style='padding:6px 0;color:#2B2B2B'>{li['quantity']} × {li['name']}</td>"
            f"<td style='padding:6px 0;text-align:right;color:#2B2B2B'>${li['line_total']:.2f}</td></tr>"
            for li in order["line_items"]
        )
        html = f"""
        <div style="font-family:Georgia,serif;background:#F5F1E8;padding:32px">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
            <div style="background:#1F3D2E;color:#F5F1E8;padding:28px 32px;text-align:center;letter-spacing:4px">P-NICE</div>
            <div style="padding:32px">
              <h2 style="color:#1F3D2E;font-weight:normal">Thank you for your order</h2>
              <p style="color:#2B2B2B">Order <strong>{order_number}</strong> is confirmed and being prepared with care. A free sample is included in every order.</p>
              <table style="width:100%;border-top:1px solid #9C9B91;border-bottom:1px solid #9C9B91;margin:16px 0">{rows}</table>
              <table style="width:100%;color:#2B2B2B">
                <tr><td>Subtotal</td><td style="text-align:right">${order['subtotal']:.2f}</td></tr>
                <tr><td>Shipping</td><td style="text-align:right">{'Free' if order['shipping']==0 else f"${order['shipping']:.2f}"}</td></tr>
                <tr><td style="padding-top:8px"><strong>Total</strong></td><td style="text-align:right;padding-top:8px"><strong>${order['amount']:.2f} USD</strong></td></tr>
              </table>
              <p style="color:#9C9B91;font-size:12px;margin-top:24px">Payments are securely processed by Stripe. Statement descriptor: {STATEMENT_DESCRIPTOR}.</p>
              <p style="color:#9C9B91;font-size:11px;font-style:italic;margin-top:16px">{COSMETIC_DISCLAIMER}</p>
            </div>
          </div>
        </div>
        """
        params = {
            "from": SENDER_EMAIL,
            "to": [to_email],
            "subject": f"Your P-Nice order {order_number} is confirmed",
            "html": html,
        }
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Confirmation email sent for %s", order_number)
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to send confirmation email: %s", exc)


@api.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    if not STRIPE_WEBHOOK_SECRET:
        logger.error("STRIPE_WEBHOOK_SECRET not set — rejecting webhook")
        raise HTTPException(status_code=503, detail="Webhook not configured")
    try:
        event = stripe.Webhook.construct_event(body, signature, STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError) as exc:
        logger.error("Webhook verification failed: %s", exc)
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    if event["type"] in ("checkout.session.completed", "checkout.session.async_payment_succeeded"):
        session = event["data"]["object"]
        session_id = session.get("id")
        if session_id and session.get("payment_status") == "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid", "status": "complete", "updated_at": now_iso()}},
            )
            await _finalize_order(session_id)

    return {"received": True}


# ---------------------------------------------------------------------------
# Contact & Newsletter
# ---------------------------------------------------------------------------
@api.post("/contact")
async def submit_contact(payload: ContactIn):
    doc = payload.model_dump()
    doc["created_at"] = now_iso()
    await db.contact_messages.insert_one(doc)
    return {"success": True, "message": "Thanks for reaching out — we'll reply within 1–2 business days."}


@api.post("/newsletter")
async def subscribe_newsletter(payload: NewsletterIn):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required to subscribe.")
    await db.newsletter.update_one(
        {"email": payload.email},
        {"$set": {"email": payload.email, "consent": True, "updated_at": now_iso()}},
        upsert=True,
    )
    return {"success": True, "message": "Welcome to the ritual — please check your inbox."}


# ---------------------------------------------------------------------------
# Admin dashboard (aggregated store metrics)
# ---------------------------------------------------------------------------
_RANGE_CONFIG = {
    "1d": ("hour", 24),
    "7d": ("day", 7),
    "30d": ("day", 30),
    "16m": ("month", 16),
    "max": ("month", 12),
}


def _to_dt(value) -> Optional[datetime]:
    """Coerce a stored created_at (ISO string or datetime) to an aware datetime."""
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    if isinstance(value, str):
        try:
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except ValueError:
            return None
    return None


def _build_buckets(now: datetime, unit: str, count: int):
    """Return ordered (label, start, end) windows ending at `now`."""
    edges = []
    if unit == "hour":
        base = now.replace(minute=0, second=0, microsecond=0)
        for i in range(count - 1, -1, -1):
            s = base - timedelta(hours=i)
            edges.append((s.strftime("%H:00"), s, s + timedelta(hours=1)))
    elif unit == "day":
        base = now.replace(hour=0, minute=0, second=0, microsecond=0)
        for i in range(count - 1, -1, -1):
            s = base - timedelta(days=i)
            edges.append((s.strftime("%b %d"), s, s + timedelta(days=1)))
    else:  # month
        for i in range(count - 1, -1, -1):
            mm, yy = now.month - i, now.year
            while mm <= 0:
                mm += 12
                yy -= 1
            s = datetime(yy, mm, 1, tzinfo=timezone.utc)
            nm, ny = (mm + 1, yy) if mm < 12 else (1, yy + 1)
            edges.append((s.strftime("%b"), s, datetime(ny, nm, 1, tzinfo=timezone.utc)))
    return edges


def _pct(curr: float, prev: float) -> float:
    if prev > 0:
        return round((curr - prev) / prev * 100, 1)
    return 100.0 if curr > 0 else 0.0


def _mask_email(email: Optional[str]) -> str:
    """Privacy-preserving display of a customer email (dashboard is unauthenticated)."""
    if not email or "@" not in email:
        return "—"
    name, _, domain = email.partition("@")
    head = name[0] if name else ""
    return f"{head}{'•' * max(2, len(name) - 1)}@{domain}"


def _item_summary(line_items) -> str:
    if not line_items:
        return "—"
    first = line_items[0].get("name", "Item")
    return f"{first} +{len(line_items) - 1} more" if len(line_items) > 1 else first


@api.get("/dashboard/summary")
async def dashboard_summary(range: str = "7d"):
    """Aggregated metrics for the admin dashboard. `range` drives the sales chart."""
    rng = range if range in _RANGE_CONFIG else "7d"
    unit, count = _RANGE_CONFIG[rng]
    now = datetime.now(timezone.utc)

    orders = await db.orders.find({}, {"_id": 0}).to_list(length=20000)
    txns = await db.payment_transactions.find({}, {"_id": 0}).to_list(length=20000)

    # Pre-parse order datetimes once.
    dated_orders = [(o, _to_dt(o.get("created_at"))) for o in orders]

    # Units / revenue per product.
    units_by_product: Dict[str, int] = defaultdict(int)
    revenue_by_product: Dict[str, float] = defaultdict(float)
    for o in orders:
        for li in o.get("line_items", []):
            pid = li.get("product_id")
            units_by_product[pid] += int(li.get("quantity", 0) or 0)
            revenue_by_product[pid] += float(li.get("line_total", 0) or 0)

    canceled_orders = sum(
        1 for t in txns
        if t.get("payment_status") in ("expired", "canceled") or t.get("status") == "canceled"
    )
    pending_orders = sum(
        1 for t in txns
        if t.get("payment_status") != "paid" and t.get("status") != "canceled"
    )

    # Sales series for the selected window + delta vs the preceding window.
    edges = _build_buckets(now, unit, count)
    window_start, window_end = edges[0][1], edges[-1][2]
    prev_start = window_start - (window_end - window_start)

    series = [{"label": label, "value": 0.0} for (label, _, _) in edges]
    curr_total = prev_total = 0.0
    curr_orders = prev_orders = 0
    for o, dt in dated_orders:
        if dt is None:
            continue
        amt = float(o.get("amount", 0) or 0)
        if window_start <= dt < window_end:
            curr_total += amt
            curr_orders += 1
            for idx, (_, s, e) in enumerate(edges):
                if s <= dt < e:
                    series[idx]["value"] = round(series[idx]["value"] + amt, 2)
                    break
        elif prev_start <= dt < window_start:
            prev_total += amt
            prev_orders += 1

    # Top products: real catalog enriched with sales, best sellers first.
    top_products_list = sorted(
        (
            {
                "id": p["id"],
                "name": p["name"],
                "slug": p["slug"],
                "category": p.get("category", ""),
                "size": p.get("size", ""),
                "price": p["price"],
                "image": (p.get("images") or [None])[0],
                "units_sold": units_by_product.get(p["id"], 0),
                "revenue": round(revenue_by_product.get(p["id"], 0.0), 2),
            }
            for p in PRODUCTS
        ),
        key=lambda x: (x["units_sold"], x["revenue"]),
        reverse=True,
    )

    # Most recent orders for the transactions table.
    recent = sorted(
        dated_orders,
        key=lambda pair: pair[1] or datetime.min.replace(tzinfo=timezone.utc),
        reverse=True,
    )[:6]
    transactions = []
    for o, dt in recent:
        lis = o.get("line_items", [])
        item = lis[0].get("name") if lis else "—"
        if len(lis) > 1:
            item = f"{item} +{len(lis) - 1} more"
        transactions.append({
            "order_id": o.get("order_number", "—"),
            "item": item,
            "date": dt.strftime("%d/%m/%Y") if dt else "—",
            "price": round(float(o.get("amount", 0) or 0), 2),
            "platform": "P-Nice Store",
            "status": o.get("status", "paid"),
        })

    all_time_sales = round(sum(float(o.get("amount", 0) or 0) for o in orders), 2)
    completed = len(orders)

    return {
        "owner": os.environ.get("STORE_OWNER", "P-Nice"),
        "currency": "usd",
        "range": rng,
        "stats": {
            "total_products": {"value": len(PRODUCTS), "delta_pct": 0.0},
            "completed_orders": {"value": completed, "delta_pct": _pct(curr_orders, prev_orders)},
            "canceled_orders": {"value": canceled_orders, "delta_pct": 0.0},
            "top_products": {"value": sum(units_by_product.values()), "delta_pct": _pct(curr_total, prev_total)},
        },
        "sales": {
            "total": round(curr_total, 2),
            "delta_amount": round(curr_total - prev_total, 2),
            "delta_pct": _pct(curr_total, prev_total),
            "series": series,
        },
        "analytics": {
            "revenue_total": all_time_sales,
            "avg_order_value": round(all_time_sales / completed, 2) if completed else 0.0,
            "status_breakdown": {
                "completed": completed,
                "pending": pending_orders,
                "canceled": canceled_orders,
            },
        },
        "pending_orders": pending_orders,
        "transactions": transactions,
        "top_products_list": top_products_list,
    }


@api.get("/dashboard/orders")
async def dashboard_orders():
    """All orders (paid) plus open/pending checkouts, newest first."""
    orders = await db.orders.find({}, {"_id": 0}).to_list(20000)
    txns = await db.payment_transactions.find({}, {"_id": 0}).to_list(20000)

    paid_rows = []
    for o in sorted(orders, key=lambda o: _to_dt(o.get("created_at")) or datetime.min.replace(tzinfo=timezone.utc), reverse=True):
        d = _to_dt(o.get("created_at"))
        paid_rows.append({
            "order_id": o.get("order_number", "—"),
            "item": _item_summary(o.get("line_items", [])),
            "items_count": sum(int(li.get("quantity", 0) or 0) for li in o.get("line_items", [])),
            "customer": _mask_email(o.get("email")),
            "date": d.strftime("%d/%m/%Y") if d else "—",
            "amount": round(float(o.get("amount", 0) or 0), 2),
            "status": o.get("status", "paid"),
            "platform": "P-Nice Store",
        })

    pending_rows = []
    for t in sorted(txns, key=lambda t: _to_dt(t.get("created_at")) or datetime.min.replace(tzinfo=timezone.utc), reverse=True):
        if t.get("payment_status") == "paid":
            continue
        d = _to_dt(t.get("created_at"))
        pending_rows.append({
            "order_id": (t.get("session_id", "")[:14] + "…") if t.get("session_id") else "—",
            "item": _item_summary(t.get("line_items", [])),
            "customer": _mask_email(t.get("email")),
            "date": d.strftime("%d/%m/%Y") if d else "—",
            "amount": round(float(t.get("amount", 0) or 0), 2),
            "status": t.get("payment_status") or "pending",
        })

    return {
        "orders": paid_rows,
        "pending": pending_rows,
        "counts": {"paid": len(paid_rows), "pending": len(pending_rows)},
    }


@api.get("/dashboard/customers")
async def dashboard_customers():
    """Customers aggregated from paid orders, plus newsletter lead count."""
    orders = await db.orders.find({}, {"_id": 0}).to_list(20000)
    agg: Dict[str, dict] = {}
    for o in orders:
        email = o.get("email") or ""
        if not email:
            continue
        d = _to_dt(o.get("created_at"))
        row = agg.setdefault(email, {"orders": 0, "total_spent": 0.0, "last_order": None})
        row["orders"] += 1
        row["total_spent"] += float(o.get("amount", 0) or 0)
        if d and (row["last_order"] is None or d > row["last_order"]):
            row["last_order"] = d

    customers = sorted(
        (
            {
                "customer": _mask_email(email),
                "orders": v["orders"],
                "total_spent": round(v["total_spent"], 2),
                "last_order": v["last_order"].strftime("%d/%m/%Y") if v["last_order"] else "—",
            }
            for email, v in agg.items()
        ),
        key=lambda x: x["total_spent"],
        reverse=True,
    )
    subscriber_count = await db.newsletter.count_documents({})
    return {"customers": customers, "total": len(customers), "subscriber_leads": subscriber_count}


@api.get("/dashboard/marketing")
async def dashboard_marketing():
    """Newsletter subscribers and contact-form messages for marketing."""
    subs = await db.newsletter.find({}, {"_id": 0}).to_list(20000)
    msgs = await db.contact_messages.find({}, {"_id": 0}).to_list(20000)

    def _date(doc, key="created_at"):
        d = _to_dt(doc.get(key) or doc.get("updated_at"))
        return d.strftime("%d/%m/%Y") if d else "—"

    subscribers = [
        {"customer": _mask_email(s.get("email")), "consent": bool(s.get("consent")), "date": _date(s)}
        for s in subs
    ]
    messages = [
        {
            "name": m.get("name", "—"),
            "customer": _mask_email(m.get("email")),
            "message": (m.get("message", "")[:120] + ("…" if len(m.get("message", "")) > 120 else "")),
            "date": _date(m),
        }
        for m in sorted(msgs, key=lambda m: _to_dt(m.get("created_at")) or datetime.min.replace(tzinfo=timezone.utc), reverse=True)
    ]
    return {
        "subscribers": subscribers,
        "subscriber_count": len(subscribers),
        "messages": messages,
        "message_count": len(messages),
    }


# ---------------------------------------------------------------------------
# CORS + mount
# ---------------------------------------------------------------------------
app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
