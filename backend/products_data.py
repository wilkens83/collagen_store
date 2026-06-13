"""Static product catalog for LUXE SKIN.

Prices are sensible defaults (USD) and are EASILY EDITABLE here.
All copy follows cosmetic (non-medical / non-supplement) positioning for
Stripe restricted-business and FTC compliance.
"""

COSMETIC_DISCLAIMER = (
    "These statements have not been evaluated by the Food and Drug Administration. "
    "This product is not intended to diagnose, treat, cure, or prevent any disease. "
    "For external use only. Patch test before use; discontinue if irritation occurs."
)

PRODUCTS = [
    {
        "id": "retinol-peptide-face-serum",
        "slug": "retinol-peptide-face-serum",
        "name": "Retinol & Peptide Face Serum",
        "category": "Serums / Night Care",
        # PLACEHOLDER PRICE — edit to your final retail price (USD)
        "price": 68.00,
        "currency": "usd",
        "size": "1 fl oz / 30 ml",
        "hero_headline": "Refine Your Texture While You Rest.",
        "subheadline": (
            "A blend of smoothing Retinol and firming Hexapeptide-11, designed to help "
            "the look of your skin appear visibly polished and even by morning."
        ),
        "short_description": (
            "A lightweight, fast-absorbing Retinol and Hexapeptide-11 facial serum that "
            "helps improve the appearance of skin firmness and the look of fine lines "
            "overnight, with bisabolol to support comfort."
        ),
        "description": (
            "An overnight facial serum that pairs smoothing Retinol with firming "
            "Hexapeptide-11 in a featherlight, fast-absorbing texture. Phospholipids help "
            "carry the formula gently into the look of the skin, while soothing bisabolol "
            "is included to keep the experience comfortable. Designed to help your skin "
            "look smoother, more even and more defined by morning, without a greasy finish."
        ),
        "benefits": [
            "Supports the look of firmer, more defined facial contours.",
            "Bisabolol and phospholipids help keep the formula comfortable, even for sensitive skin.",
            "Lightweight texture sinks in fast and won't transfer to your pillowcase.",
        ],
        "benefit_tiles": [
            {"icon": "sparkles", "label": "Smoother-looking texture"},
            {"icon": "droplet", "label": "Lightweight, fast-absorbing"},
            {"icon": "leaf", "label": "Soothing bisabolol"},
            {"icon": "moon", "label": "Designed for nightly use"},
        ],
        "key_ingredients": [
            {"name": "Phospholipids", "icon": "droplet", "note": "Help carry the formula gently into the look of skin."},
            {"name": "Retinol", "icon": "sparkles", "note": "Helps smooth the look of texture and fine lines."},
            {"name": "Hexapeptide-11", "icon": "flower", "note": "Supports the appearance of firmer skin."},
            {"name": "Bisabolol", "icon": "leaf", "note": "A soothing botanical-derived comfort agent."},
        ],
        "how_to_use": [
            "After cleansing, apply 3–4 drops to face and neck at night.",
            "Follow with your favorite moisturizer.",
            "Apply sunscreen the following morning.",
        ],
        "specs": [
            {"label": "Size", "value": "1 fl oz / 30 ml"},
            {"label": "Texture", "value": "Lightweight serum"},
            {"label": "Use", "value": "PM / nightly"},
            {"label": "Skin types", "value": "All, including sensitive (patch test first)"},
            {"label": "Format", "value": "Topical cosmetic, external use only"},
        ],
        "faq": [
            {
                "q": "Is this serum suitable for sensitive skin?",
                "a": "Yes — it includes soothing bisabolol and hydrating phospholipids to help buffer the retinol, so it's designed to be well-tolerated, including by those with sensitive skin. Patch test first.",
            },
            {
                "q": "How often should I apply it?",
                "a": "Nightly for best results. If you're new to retinol, start every other night to let your skin adjust.",
            },
        ],
        "cta_text": "Reveal Smoother Skin",
        "variants": ["1 fl oz / 30 ml"],
        "badges": ["Clean Ingredients", "Cruelty-Free", "Made in USA"],
        "images": [
            "https://images.unsplash.com/photo-1680443285773-ef42672d00da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwzfHxza2luY2FyZSUyMGJvdHRsZSUyMHN0b25lfGVufDB8fHx8MTc4MTMyODUwNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1780599994472-8065fc345e3a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHw0fHxza2luY2FyZSUyMGJvdHRsZSUyMHN0b25lfGVufDB8fHx8MTc4MTMyODUwNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1581182800629-7d90925ad072?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdsb3dpbmclMjBza2luJTIwbmF0dXJhbHxlbnwwfHx8fDE3ODEzMjg1MDZ8MA&ixlib=rb-4.1.0&q=85",
        ],
        "disclaimer": COSMETIC_DISCLAIMER,
    },
    {
        "id": "sleep-night-recovery-cream",
        "slug": "sleep-night-recovery-cream",
        "name": "Sleep+ Night Recovery Cream",
        "category": "Moisturizers / Night Care",
        # PLACEHOLDER PRICE — edit to your final retail price (USD)
        "price": 54.00,
        "currency": "usd",
        "size": "2 oz / 56 g",
        "hero_headline": "Wake Up Looking Refreshed.",
        "subheadline": (
            "A rich night cream with Hyaluronic Acid, Collagen, and skin-conditioning "
            "melatonin to help your skin feel deeply hydrated and look radiant by morning."
        ),
        "short_description": (
            "A luxurious topical night cream with Hyaluronic Acid, hydrolyzed Collagen, and "
            "soothing botanical oils to help support overnight hydration and the look of "
            "smooth, supple skin."
        ),
        "description": (
            "A cushiony night cream that wraps skin in lasting overnight moisture. "
            "Hyaluronic Acid and hydrolyzed Collagen help skin look plump and feel "
            "hydrated, while skin-conditioning melatonin and botanical antioxidants support "
            "a healthy-looking complexion. Avocado and lavender oils soften skin and turn "
            "your evening routine into a calming ritual. A topical cosmetic for external "
            "use only — never ingested."
        ),
        "benefits": [
            "Hyaluronic Acid helps the skin hold onto moisture so it looks plump and feels hydrated by morning.",
            "Conditioning melatonin and botanical antioxidants support a healthy-looking complexion.",
            "Avocado and lavender oils soften skin and make your evening routine a calming ritual.",
        ],
        "benefit_tiles": [
            {"icon": "droplet", "label": "Deeply hydrating"},
            {"icon": "flower", "label": "Plump, supple look"},
            {"icon": "leaf", "label": "Soothing botanical oils"},
            {"icon": "moon", "label": "Calming nightly ritual"},
        ],
        "key_ingredients": [
            {"name": "Purified Water", "icon": "droplet", "note": "A clean, hydrating base."},
            {"name": "Melatonin", "icon": "moon", "note": "A skin-conditioning ingredient (topical, not ingested)."},
            {"name": "Aloe Vera Extract", "icon": "leaf", "note": "Helps soothe the feel of skin."},
            {"name": "Collagen", "icon": "sparkles", "note": "Hydrolyzed collagen for a supple look."},
            {"name": "Hyaluronic Acid", "icon": "droplet", "note": "Helps skin hold onto moisture."},
            {"name": "Avocado Oil", "icon": "leaf", "note": "Softens and conditions skin."},
            {"name": "Lavender Oil", "icon": "flower", "note": "A calming botanical scent."},
        ],
        "how_to_use": [
            "Apply a small amount (about ¼ tsp) to face and neck 45–60 minutes before bedtime, as a topical cosmetic.",
            "Smooth gently until absorbed. For external use only.",
        ],
        "specs": [
            {"label": "Size", "value": "2 oz / 56 g"},
            {"label": "Texture", "value": "Rich cream"},
            {"label": "Use", "value": "PM / nightly"},
            {"label": "Skin types", "value": "All (patch test first)"},
            {"label": "Format", "value": "Topical cosmetic, external use only — not a supplement"},
        ],
        "faq": [
            {
                "q": "Can I use this every night?",
                "a": "Yes — it's formulated with gentle, soothing oils and is intended for nightly topical use across skin types. Patch test first.",
            },
            {
                "q": "Is this a supplement or something I take?",
                "a": "No. Sleep+ is a topical cosmetic cream for external use only — it is not ingested and is not a dietary supplement.",
            },
        ],
        "cta_text": "Experience Deep Repair",
        "variants": ["2 oz / 56 g"],
        "badges": ["Clean Ingredients", "Cruelty-Free", "Made in USA"],
        "images": [
            "https://images.unsplash.com/photo-1763503836825-97f5450d155a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNyZWFtJTIwamFyfGVufDB8fHx8MTc4MTMyODUwNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1780599994472-8065fc345e3a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHw0fHxza2luY2FyZSUyMGJvdHRsZSUyMHN0b25lfGVufDB8fHx8MTc4MTMyODUwNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1555820585-c5ae44394b79?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwzfHx3b21hbiUyMGdsb3dpbmclMjBza2luJTIwbmF0dXJhbHxlbnwwfHx8fDE3ODEzMjg1MDZ8MA&ixlib=rb-4.1.0&q=85",
        ],
        "disclaimer": COSMETIC_DISCLAIMER,
    },
]
