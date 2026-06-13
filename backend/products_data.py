"""Static product catalog for P-Nice.

Prices are sensible defaults (USD) and are EASILY EDITABLE here.
All copy follows cosmetic (non-medical / non-supplement) positioning for
Stripe restricted-business and FTC compliance. Ingredient lists, sizes and
cautions are sourced from the manufacturer product sheets and reframed for
topical, external-use only positioning.
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
            "Crafted to refine and refresh the skin's appearance overnight. Retinol, known "
            "for its smoothing properties, works together with Hexapeptide-11 to support the "
            "look of firmness and texture, for a complexion that appears more even and polished "
            "over time. Soothing bisabolol and nourishing phospholipids help support a soft, "
            "balanced feel, while the silky, fast-absorbing texture sinks in without a greasy "
            "finish. A topical cosmetic for external use only."
        ),
        "benefits": [
            "Supports the look of firmer, more defined facial contours.",
            "Bisabolol and phospholipids help keep the formula comfortable, even for sensitive skin.",
            "Lightweight texture sinks in fast and won't transfer to your pillowcase.",
        ],
        "benefit_tiles": [
            {"icon": "sparkles", "label": "Smoother Texture", "note": "Retinol helps refine the look of fine lines and uneven texture."},
            {"icon": "flower", "label": "Visibly Firmer", "note": "Hexapeptide-11 supports the appearance of firmer skin."},
            {"icon": "leaf", "label": "Soothing Comfort", "note": "Bisabolol and phospholipids keep the formula gentle."},
            {"icon": "moon", "label": "Overnight Ritual", "note": "A featherlight serum designed for nightly use."},
        ],
        "key_ingredients": [
            {"name": "Retinol", "icon": "sparkles", "note": "Helps smooth the look of texture and fine lines."},
            {"name": "Hexapeptide-11", "icon": "flower", "note": "Supports the appearance of firmer skin."},
            {"name": "Phospholipids", "icon": "droplet", "note": "Help carry the formula gently into the look of skin."},
            {"name": "Bisabolol", "icon": "leaf", "note": "A soothing botanical-derived comfort agent."},
        ],
        "full_ingredients": (
            "Aqua (Water), Caprylic/Capric Triglyceride, Phospholipids, Retinol, Aluminum "
            "Starch Octenylsuccinate, 1,2-Hexanediol, Butylene Glycol, Propanediol, "
            "Hexapeptide-11, Ammonium Acryloyldimethyltaurate/Carboxyethyl Acrylate "
            "Crosspolymer, Sodium Polyacrylate, Bisabolol."
        ),
        "usage_steps": [
            {"icon": "droplet", "title": "Apply", "text": "After cleansing, apply 3–4 drops to face and neck at night."},
            {"icon": "sparkles", "title": "Massage", "text": "Gently press and smooth until fully absorbed."},
            {"icon": "moon", "title": "Moisturize", "text": "Follow with your favorite night moisturizer."},
            {"icon": "sun", "title": "Protect", "text": "Apply sunscreen the following morning."},
        ],
        "spec_panel": [
            {"icon": "droplet", "label": "Skin Type", "value": "All types, incl. sensitive"},
            {"icon": "sparkles", "label": "Targets", "value": "Texture, fine lines, firmness"},
            {"icon": "leaf", "label": "Texture", "value": "Lightweight, silky serum"},
            {"icon": "moon", "label": "Use", "value": "PM / nightly"},
            {"icon": "droplet", "label": "Size", "value": "1 fl oz / 30 ml"},
            {"icon": "pin", "label": "Origin", "value": "Made in USA"},
            {"icon": "shield", "label": "Format", "value": "Topical cosmetic, external use only"},
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
        "warnings": (
            "If pregnant or nursing, consult your physician before use. For external use only. "
            "Avoid contact with eyes. If irritation occurs, discontinue use. Shake well before "
            "use. Retinol may increase skin's sensitivity to sunlight — use sunscreen daily."
        ),
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
            "A luxurious, cushiony night cream designed to complement your evening routine "
            "with a hydrating, skin-nourishing formula. Hyaluronic Acid — nature's “moisture "
            "miracle” — helps keep skin supple and hydrated through the night, while hydrolyzed "
            "Collagen supports a smooth, elastic-looking complexion. Avocado and Lavender oils "
            "soothe and soften, and skin-conditioning melatonin rounds out a calming ritual. "
            "Gentle enough for all skin types, for men and women alike. A topical cosmetic for "
            "external use only — never ingested."
        ),
        "benefits": [
            "Hyaluronic Acid helps the skin hold onto moisture so it looks plump and feels hydrated by morning.",
            "Conditioning melatonin and botanical antioxidants support a healthy-looking complexion.",
            "Avocado and lavender oils soften skin and make your evening routine a calming ritual.",
        ],
        "benefit_tiles": [
            {"icon": "droplet", "label": "Deep Hydration", "note": "Hyaluronic Acid helps skin stay supple and hydrated overnight."},
            {"icon": "sparkles", "label": "Supple Look", "note": "Hydrolyzed collagen supports a smooth, elastic appearance."},
            {"icon": "leaf", "label": "Botanical Oils", "note": "Avocado and lavender oils soften and soothe the skin."},
            {"icon": "moon", "label": "Calming Ritual", "note": "Skin-conditioning melatonin for a restful evening routine."},
        ],
        "key_ingredients": [
            {"name": "Hyaluronic Acid", "icon": "droplet", "note": "Helps skin hold onto moisture for a plump look."},
            {"name": "Collagen", "icon": "sparkles", "note": "Hydrolyzed collagen for a smooth, supple look."},
            {"name": "Melatonin", "icon": "moon", "note": "A skin-conditioning ingredient (topical, not ingested)."},
            {"name": "Avocado & Lavender Oil", "icon": "leaf", "note": "Soften, soothe and condition the skin."},
        ],
        "full_ingredients": (
            "Purified Water, Melatonin, Aloe Vera Extract, Collagen, Hyaluronic Acid, "
            "Avocado Oil, Rheosol, Lavender Oil, Phenonip, Rosemary Leaf Extract."
        ),
        "usage_steps": [
            {"icon": "droplet", "title": "Warm", "text": "Take about ¼ tsp and warm gently between fingertips."},
            {"icon": "flower", "title": "Apply", "text": "Smooth over face and neck 45–60 minutes before bed."},
            {"icon": "leaf", "title": "Massage", "text": "Massage in upward motions until absorbed. External use only."},
            {"icon": "moon", "title": "Rest", "text": "Increase to ½ tsp if you wake repeatedly during the night."},
        ],
        "spec_panel": [
            {"icon": "droplet", "label": "Skin Type", "value": "All types — men & women"},
            {"icon": "sparkles", "label": "Targets", "value": "Hydration, plumpness, comfort"},
            {"icon": "flower", "label": "Texture", "value": "Rich, cushiony cream"},
            {"icon": "moon", "label": "Use", "value": "PM, 45–60 min before bed"},
            {"icon": "droplet", "label": "Size", "value": "2 oz / 56 g"},
            {"icon": "pin", "label": "Origin", "value": "Made in USA"},
            {"icon": "shield", "label": "Format", "value": "Topical cosmetic — not ingested"},
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
        "warnings": (
            "For external use only. Topical cosmetic — not a dietary supplement and not for "
            "ingestion. If irritation develops, discontinue use. If product enters the eye, "
            "flush thoroughly with water. Pregnant or nursing mothers and those with a medical "
            "condition should consult a physician before use. Keep out of reach of children. "
            "Store in a cool, dry place; do not use if the safety seal is damaged or missing."
        ),
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
