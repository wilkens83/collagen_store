// Editable starter legal content. Replace bracketed PLACEHOLDERS with your details.
const EFFECTIVE = "Effective date: [INSERT DATE]";
const BIZ = "[LUXE SKIN LLC]";
const ADDRESS = "[123 Botanical Way, Suite 100, Your City, ST 00000]";
const EMAIL = "[support@luxeskin-placeholder.com]";

export const LEGAL = {
  terms: {
    slug: "terms",
    title: "Terms of Service",
    intro:
      "These Terms of Service govern your use of the LUXE SKIN website and the purchase of products from us. By placing an order you agree to these terms.",
    sections: [
      {
        h: "1. Who We Are",
        p: `This website is operated by ${BIZ} ("we", "us", "our"). You can reach us at ${EMAIL} or by mail at ${ADDRESS}.`,
      },
      {
        h: "2. Products & Cosmetic Use",
        p: "All products sold are cosmetics intended for external topical use only. They are not drugs, dietary supplements, or medical devices and are not intended to diagnose, treat, cure, or prevent any disease. Product descriptions describe the look and feel of skin, not medical outcomes.",
      },
      {
        h: "3. Orders & Pricing",
        p: "All prices are shown in U.S. Dollars (USD). We reserve the right to correct pricing errors and to limit or cancel orders. An order is accepted once payment is confirmed and a confirmation email is sent.",
      },
      {
        h: "4. Payments",
        p: "Payments are securely processed by Stripe. We do not collect or store your full card details on our servers. By paying, you also agree to Stripe's terms where applicable.",
      },
      {
        h: "5. Shipping, Returns & Refunds",
        p: "Fulfillment is governed by our Shipping Policy, and returns/refunds by our Refund & Return Policy, both incorporated into these Terms by reference.",
      },
      {
        h: "6. Acceptable Use",
        p: "You agree not to misuse the site, attempt to disrupt it, or use it for unlawful purposes. Content on this site is owned by us or our licensors and may not be reproduced without permission.",
      },
      {
        h: "7. Limitation of Liability",
        p: "To the maximum extent permitted by law, our liability for any claim relating to a product is limited to the amount you paid for that product. Always patch test and discontinue use if irritation occurs.",
      },
      {
        h: "8. Changes & Governing Law",
        p: `We may update these terms from time to time. These terms are governed by the laws of [YOUR STATE/COUNTRY]. ${EFFECTIVE}`,
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    intro:
      "This Privacy Policy explains what information we collect, how we use it, and your choices. We respect your privacy and only collect what we need to fulfill your order and improve your experience.",
    sections: [
      {
        h: "1. Information We Collect",
        p: "Contact details (name, email, shipping address), order details, and communications you send us. When you pay, your payment information is collected and processed directly by Stripe — we receive confirmation and limited transaction metadata, not your full card number.",
      },
      {
        h: "2. Payment Processing (Stripe)",
        p: "We use Stripe, Inc. as our payment processor. Card data is handled by Stripe under PCI-DSS standards. Please review Stripe's Privacy Policy for how they process payment data.",
      },
      {
        h: "3. How We Use Information",
        p: "To process and ship orders, send order confirmations and receipts, provide customer support, prevent fraud, and — with your consent — send marketing emails you can unsubscribe from at any time.",
      },
      {
        h: "4. Cookies & Analytics",
        p: "We use essential cookies for cart and checkout functionality and may use analytics to understand site usage. You can control cookies through your browser settings.",
      },
      {
        h: "5. Sharing",
        p: "We share data only with service providers who help us operate (e.g., Stripe for payments, shipping carriers, email providers) and where required by law. We do not sell your personal information.",
      },
      {
        h: "6. Your Rights",
        p: `Depending on your location, you may request access, correction, or deletion of your data. Contact us at ${EMAIL}.`,
      },
      {
        h: "7. Data Retention & Contact",
        p: `We retain order records as required for accounting and legal purposes. Questions? Email ${EMAIL} or write to ${ADDRESS}. ${EFFECTIVE}`,
      },
    ],
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund & Return Policy",
    intro:
      "We want you to love your ritual. If something isn't right, here's how returns and refunds work.",
    sections: [
      {
        h: "1. Return Window",
        p: "You may request a return within [30] days of delivery. Items should be unused or gently used and, where possible, in original packaging. For hygiene reasons, heavily used products may not be eligible.",
      },
      {
        h: "2. How to Request a Return",
        p: `Email ${EMAIL} with your order number and reason for return. We'll reply with return instructions and the return address. Customers are responsible for return shipping unless the item arrived damaged or incorrect.`,
      },
      {
        h: "3. Refund Timeframe",
        p: "Once we receive and inspect your return, we'll process your refund to the original payment method via Stripe within [5–10] business days. You'll receive an email confirmation.",
      },
      {
        h: "4. Damaged or Incorrect Items",
        p: "If your order arrives damaged or incorrect, contact us within [7] days with a photo and we'll make it right at no cost to you.",
      },
      {
        h: "5. Non-Returnable",
        p: `Gift cards and free samples are non-returnable. ${EFFECTIVE}`,
      },
    ],
  },
  "shipping-policy": {
    slug: "shipping-policy",
    title: "Shipping & Fulfillment Policy",
    intro:
      "Here's everything about how and when your order ships.",
    sections: [
      {
        h: "1. Processing Time",
        p: "Orders are processed within [1–2] business days. You'll receive a confirmation email when your order is placed and a tracking email when it ships.",
      },
      {
        h: "2. Shipping Costs",
        p: "Free standard shipping on orders over $50 USD. A flat rate of [$5.95] applies to orders under $50. Costs are shown in USD before payment.",
      },
      {
        h: "3. Carriers & Delivery Estimates",
        p: "We ship via [USPS / UPS / FedEx]. Standard delivery typically takes [3–7] business days after dispatch, depending on destination.",
      },
      {
        h: "4. Shipping Regions",
        p: "We currently ship within [the United States]. [International shipping availability and rates: INSERT].",
      },
      {
        h: "5. Lost or Delayed Packages",
        p: `If your package is delayed or lost, contact ${EMAIL} and we'll help track it down. ${EFFECTIVE}`,
      },
    ],
  },
};
