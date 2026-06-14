"""Vercel Python serverless entry point.

Vercel detects the ASGI ``app`` and serves it. All ``/api/*`` requests are
rewritten to this function (see ``vercel.json``); FastAPI's ``/api`` router
prefix then matches the original request path. The backend source lives in
``/backend`` and is bundled via the ``includeFiles`` setting in vercel.json.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from server import app  # noqa: E402,F401  (re-exported for the Vercel runtime)
