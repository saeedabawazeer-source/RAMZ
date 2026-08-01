# Digital Code QR — Salla App (MVP scaffold)

Turns a Salla digital product's assigned code into a scannable QR + CODE128
barcode after a paid order, so it can be scanned at a physical counter
instead of retyped. Built against feature request
[SUG-I-10101](https://features.salla.sa/ideas/SUG-I-10101) (112 votes,
unbuilt as of Aug 2026).

## What's real vs. what's a placeholder

- **Real and working:** QR/barcode generation (`lib/qr.ts`), the Salla API
  call to pull a digital code off a paid order item (`lib/salla.ts`), the
  webhook receiver that ties them together (`app/api/webhooks/salla/route.ts`).
- **Placeholder, must fix before going live:**
  - `lib/store.ts` uses an in-memory Map. This will lose data on every
    serverless cold start. Swap for Vercel KV or a real Postgres table
    before publishing — the function signatures are already there so
    nothing else changes.
  - The webhook signature check in `route.ts` is a stub. Salla's docs
    confirm webhooks are verified via a "Signature or Token" strategy but
    the exact header/algorithm needs to be read off your specific app's
    Webhook settings in the Partners Portal.
  - The exact Store Event name for "order paid" needs confirming in the
    portal's event picker — I used `order.status.updated`/`order.created`
    as placeholders.
  - `app/embed/page.tsx` reads `storeId` from a query string. Replace with
    the real Salla Embedded SDK handshake.

## Setup in Salla Partners Portal

1. Log into [salla.partners](https://salla.partners), go to **My Apps** →
   **Create App**. Choose **Public** (or Private, to test on your own store
   first before submitting for the App Store review).
2. **OAuth mode: Easy Mode.** Salla's docs explicitly say Custom Mode is
   testing-only via Postman — Easy Mode is required for anything published.
3. **App Scope:** enable `orders.read` at minimum (needed for List Order
   Items). Add `products.read` if you later want to also read product-level
   barcodes.
4. **Webhooks/Notifications:**
   - Set the Webhook URL to `https://<your-deployed-domain>/api/webhooks/salla`.
   - Under **App Events**, enable `App Store Authorize` — this is how you
     receive the access token in Easy Mode.
   - Under **Store Events**, enable the Orders event that fires when an
     order is paid/completed (check the exact name in the picker — it may
     be `order.status.updated` filtered via
     [Conditional Webhooks](https://docs.salla.dev/421120m0) to the
     paid/completed status, so this doesn't fire on unpaid orders).
5. **Embedded Pages:** point the app's embedded page URL at
   `https://<your-deployed-domain>/embed` so it opens inside the merchant
   dashboard.
6. **App Testing:** generate a demo store from the App Testing tab and
   install the app there first — this is how you confirm the webhook
   payloads and event names actually match what's coded here, before
   touching a real store.

## Local dev

```
npm install
cp .env.example .env.local   # fill in values from the portal
npm run dev
```

Deploy to Vercel (or any Node host) and point the Partners Portal URLs at
the deployed domain — Salla needs a real public HTTPS URL for the webhook
and embedded page, it can't reach `localhost`.
