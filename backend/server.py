"""LUXE SKIN — FastAPI backend.

Handles: product catalog, Stripe Checkout (hosted) sessions, secure server-side
pricing, payment status polling, Stripe webhook, order creation + confirmation
email, contact form and newsletter signup.

No raw card data is ever collected or stored — Stripe handles all payment data.
"""

import os
import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, BeforeValidator, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest,
)

from products_data import PRODUCTS, COSMETIC_DISCLAIMER

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(ROOT_DIR, ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("luxe_skin")

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
SUPPORT_EMAIL = os.environ.get("SUPPORT_EMAIL", "support@p-nice.com")
STATEMENT_DESCRIPTOR = os.environ.get("STORE_STATEMENT_DESCRIPTOR", "P-Nice")

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


@api.post("/checkout/session")
async def create_checkout_session(req: CheckoutRequest, request: Request):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    line_items, subtotal, shipping, total = _compute_order(req.items)

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    origin = req.origin_url.rstrip("/")
    success_url = f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/cart"

    metadata = {
        "source": "luxe_skin_web",
        "item_count": str(sum(li["quantity"] for li in line_items)),
        "subtotal": f"{subtotal:.2f}",
        "shipping": f"{shipping:.2f}",
    }
    if req.email:
        metadata["email"] = req.email

    checkout_request = CheckoutSessionRequest(
        amount=float(total),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(
        checkout_request
    )

    # MANDATORY: record transaction BEFORE returning, status pending
    txn = {
        "session_id": session.session_id,
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

    return {"url": session.url, "session_id": session.session_id}


@api.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str):
    txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not txn:
        raise HTTPException(status_code=404, detail="Session not found")

    # If already finalized, return cached result (idempotent — no double processing)
    if txn.get("payment_status") == "paid":
        return _status_payload(txn)

    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

    update = {
        "payment_status": status.payment_status,
        "status": status.status,
        "updated_at": now_iso(),
    }
    await db.payment_transactions.update_one(
        {"session_id": session_id}, {"$set": update}
    )
    txn.update(update)

    if status.payment_status == "paid":
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
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    try:
        result = await stripe_checkout.handle_webhook(body, signature)
    except Exception as exc:  # noqa: BLE001
        logger.error("Webhook verification failed: %s", exc)
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    if result.session_id and result.payment_status == "paid":
        await db.payment_transactions.update_one(
            {"session_id": result.session_id},
            {"$set": {"payment_status": "paid", "status": "complete", "updated_at": now_iso()}},
        )
        await _finalize_order(result.session_id)

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
