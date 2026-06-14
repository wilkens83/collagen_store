# P-Nice

Clean, botanical night-care storefront — a **Retinol & Peptide Face Serum** and a
**Collagen + Hyaluronic Acid Night Cream** — with secure Stripe Checkout.

- **Frontend:** React (Create React App) + Tailwind CSS, React Router, react-helmet-async (SEO/JSON-LD).
- **Backend:** FastAPI + MongoDB (motor), official **Stripe** Python SDK (hosted Checkout), Resend for confirmation emails.
- **Hosting:** Designed to deploy on **Vercel** — the React app as a static build and the FastAPI app as a Python serverless function under `/api`.

```
api/index.py        # Vercel serverless entry — re-exports the FastAPI app
backend/            # FastAPI app (server.py), product catalog, tests
frontend/           # React app
vercel.json         # Build + routing config for Vercel
requirements.txt    # Python deps for the serverless function
.env.example        # All required environment variables
```

## Local development

**Backend** (Python 3.11+):

```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env   # fill in MONGO_URL, STRIPE_API_KEY, etc.
uvicorn server:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
# Point the app at the local API (same-origin in prod, so only needed locally):
REACT_APP_BACKEND_URL=http://localhost:8000 npm start
```

## Deploy to Vercel

1. **Import the repo** into Vercel (it auto-detects `vercel.json`).
2. **Environment variables** — add everything from [`.env.example`](./.env.example)
   in *Settings → Environment Variables*. Leave `REACT_APP_BACKEND_URL` **empty**
   so the frontend calls the same-origin `/api`.
3. **Deploy.** Vercel runs the frontend build (`frontend/` → `frontend/build`) and
   provisions the Python function from `api/index.py` (using root `requirements.txt`).
   All `/api/*` requests are routed to it; everything else falls back to the SPA.
4. **MongoDB** — create a free **MongoDB Atlas** cluster and put its connection
   string in `MONGO_URL` (allow Vercel's egress / `0.0.0.0/0` for the network rule).
5. **Stripe webhook** — in the Stripe dashboard add an endpoint at
   `https://YOUR-DOMAIN/api/webhook/stripe` for the `checkout.session.completed`
   event, and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

### Before going live
- Use a Stripe **secret** key (`sk_live_…`), not a publishable key.
- Set `CORS_ORIGINS` to your real domain.
- Confirm final product prices in `backend/products_data.py`.
- Fill the bracketed placeholders in the legal pages (`frontend/src/data/legal.js`).

> Note: the FastAPI app opens a MongoDB connection at import. On serverless this is
> reused across warm invocations; for higher traffic consider a dedicated backend
> host (Render/Railway) and point `REACT_APP_BACKEND_URL` at it instead.
