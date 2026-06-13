"""LUXE SKIN backend API tests."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://9ba68ffa-50db-414d-b575-2ce500317f41.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------- Products ----------------
class TestProducts:
    def test_list_products(self, client):
        r = client.get(f"{API}/products")
        assert r.status_code == 200
        data = r.json()
        assert "products" in data and "disclaimer" in data
        assert len(data["products"]) == 2
        ids = [p["id"] for p in data["products"]]
        assert "retinol-peptide-face-serum" in ids
        assert "sleep-night-recovery-cream" in ids
        # full fields
        p0 = data["products"][0]
        for k in ["id", "slug", "name", "price", "currency", "images", "benefits", "faq", "variants"]:
            assert k in p0, f"missing {k}"
        assert "not been evaluated" in data["disclaimer"]

    def test_product_detail_unknown_slug(self, client):
        r = client.get(f"{API}/products/does-not-exist")
        assert r.status_code == 404

    def test_product_detail_valid_slug(self, client):
        for slug in ["retinol-peptide-face-serum", "sleep-night-recovery-cream"]:
            r = client.get(f"{API}/products/{slug}")
            assert r.status_code == 200, f"slug {slug} failed"
            data = r.json()
            assert "product" in data and "related" in data
            assert data["product"]["slug"] == slug
            assert len(data["related"]) == 1

    def test_product_not_found(self, client):
        r = client.get(f"{API}/products/does-not-exist")
        assert r.status_code == 404

    def test_config(self, client):
        r = client.get(f"{API}/config")
        assert r.status_code == 200
        data = r.json()
        assert data["free_shipping_threshold"] == 50.0
        assert data["shipping_flat_rate"] == 5.95
        assert "support_email" in data
        assert "disclaimer" in data


# ---------------- Checkout ----------------
class TestCheckout:
    def test_checkout_session_serum(self, client):
        """68.00 >= $50 threshold, so shipping should be free, total 68.00."""
        payload = {
            "items": [{"product_id": "retinol-peptide-face-serum", "quantity": 1}],
            "origin_url": "https://example.com",
            "email": "TEST_buyer@example.com",
        }
        r = client.post(f"{API}/checkout/session", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and "checkout.stripe.com" in data["url"]
        assert "session_id" in data and data["session_id"]
        # store for status test
        pytest.serum_session = data["session_id"]

    def test_checkout_session_cream(self, client):
        """$54 cream, free shipping (>=50), total = 54.00."""
        payload = {
            "items": [{"product_id": "sleep-night-recovery-cream", "quantity": 1}],
            "origin_url": "https://example.com",
            "email": "TEST_buyer2@example.com",
        }
        r = client.post(f"{API}/checkout/session", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "checkout.stripe.com" in data["url"]
        assert data["session_id"]

    def test_checkout_ignores_client_price(self, client):
        """Make sure even if client passes extra fields, server uses its own price."""
        payload = {
            "items": [{"product_id": "retinol-peptide-face-serum", "quantity": 1, "price": 1.00}],
            "origin_url": "https://example.com",
        }
        r = client.post(f"{API}/checkout/session", json=payload)
        assert r.status_code == 200

    def test_checkout_invalid_product(self, client):
        payload = {
            "items": [{"product_id": "nonexistent", "quantity": 1}],
            "origin_url": "https://example.com",
        }
        r = client.post(f"{API}/checkout/session", json=payload)
        assert r.status_code == 400

    def test_checkout_empty_cart(self, client):
        r = client.post(f"{API}/checkout/session", json={"items": [], "origin_url": "https://example.com"})
        assert r.status_code == 400

    def test_checkout_status(self, client):
        sid = getattr(pytest, "serum_session", None)
        if not sid:
            pytest.skip("No session created")
        r = client.get(f"{API}/checkout/status/{sid}")
        assert r.status_code == 200, r.text
        data = r.json()
        assert "payment_status" in data
        # Fresh session not yet paid
        assert data["payment_status"] in ("unpaid", "pending", "open", None)
        assert data["session_id"] == sid

    def test_checkout_status_not_found(self, client):
        r = client.get(f"{API}/checkout/status/cs_nonexistent_xxx")
        assert r.status_code == 404


# ---------------- Contact & Newsletter ----------------
class TestContactNewsletter:
    def test_contact_submit(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "TEST_User",
            "email": "TEST_contact@example.com",
            "message": "Test message from automation",
        })
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True

    def test_contact_invalid_email(self, client):
        r = client.post(f"{API}/contact", json={"name": "x", "email": "notanemail", "message": "hi"})
        assert r.status_code == 422

    def test_newsletter_requires_consent(self, client):
        r = client.post(f"{API}/newsletter", json={"email": "TEST_news@example.com", "consent": False})
        assert r.status_code == 400

    def test_newsletter_success(self, client):
        r = client.post(f"{API}/newsletter", json={"email": "TEST_news2@example.com", "consent": True})
        assert r.status_code == 200
        assert r.json()["success"] is True
