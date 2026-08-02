# Ramz — QR/Barcode Generator for Salla stores

Auto-generates a scannable QR code for every product in a merchant's Salla
store — physical or digital — linked directly to that product's live page.
Codes stay synced with the catalog: add a product, a code generates on its
own; edit a product, its code updates.

## What it does

- **Auto-generate on catalog change.** Every product gets a QR code the
  moment it's created or edited — no manual step, no dashboard button to
  press.
- **Works for any product.** Digital products (e-books, course access, gift
  cards) get a scannable code they don't have by default, so a merchant can
  sell them in person or bridge a physical checkout. Physical products get a
  code for flyers, packaging, posters, or in-store displays that scans
  straight to the product page — no typed URLs.
- **Bulk export.** Download every product's QR as a single zip for a print
  run (flyers, packaging batches).
- **Scan tracking.** Every scan is counted, so a merchant can see which codes
  are actually getting used — real marketing data, not a guess.
- **Branded styling (Premium).** QR codes render in the merchant's brand
  colors instead of plain black-on-white.

## What's real vs. what's still a placeholder

- **Real and working:** QR generation (`lib/qr.ts`), the Salla API calls to
  read a product and its live storefront URL (`lib/salla.ts`), the webhook
  receiver that (re)generates a product's QR on `product.created` /
  `product.updated` (`app/api/webhooks/salla/route.ts`), the scan-tracking
  redirect (`app/api/s/[code]/route.ts`), bulk zip export
  (`app/api/export/route.ts`), and storage — everything is in Supabase
  Postgres (project `ramz-db`), not an in-memory Map, so data survives
  deploys/restarts.
- **Still a placeholder:**
  - `app/embed/page.tsx` reads `storeId` from a query string. Replace with
    the real Salla Embedded SDK handshake before publishing — this hasn't
    been tested with a real order yet.
  - Branded styling (Premium) is color-only for now (merchant's accent color
    instead of black). A logo-in-the-center version needs a canvas/image
    dependency (sharp or node-canvas) — deliberately deferred to keep the
    build light; not a blocker for launch.
  - Premium plan upgrades aren't wired to Salla's subscription billing yet —
    `merchant_tokens.plan` defaults to `'base'` and has to be flipped
    manually until that's built.

## Setup in Salla Partners Portal

1. Log into [salla.partners](https://salla.partners), go to **My Apps** →
   **Create App**. Choose **Public** (or Private, to test on your own store
   first before submitting for the App Store review).
2. **OAuth mode: Easy Mode.** Salla's docs explicitly say Custom Mode is
   testing-only via Postman — Easy Mode is required for anything published.
3. **App Scope:** enable `products.read` (required — this is how the app
   reads a product's name and live URL). Add `orders.read` only if you also
   want the legacy per-order digital-code QR/barcode path.
4. **Webhooks/Notifications:**
   - Set the Webhook URL to `https://<your-deployed-domain>/api/webhooks/salla`.
   - Under **App Events**, enable `App Store Authorize` — this is how you
     receive the access token in Easy Mode.
   - Under **Store Events**, enable `product.created` and `product.updated`
     — this is the app's core loop. Confirm the exact event names in your
     portal's picker before relying on them.
5. **Embedded Pages:** point the app's embedded page URL at
   `https://<your-deployed-domain>/embed` so it opens inside the merchant
   dashboard.
6. **App Testing:** generate a demo store from the App Testing tab, add a
   product there, and confirm a QR shows up in the embedded page before
   touching a real store.

## Local dev

```
npm install
cp .env.example .env.local   # fill in values from the portal + Supabase
npm run dev
```

Then, in Supabase's SQL editor for project `ramz-db`, run `schema.sql` to
create the `product_qrs` table, the `merchant_tokens.plan` column, and the
`increment_scan_count` function this app needs.

Deployed on Railway (auto-deploys from `main` on push) at
`https://ramz-production-0c82.up.railway.app`. Salla needs a real public
HTTPS URL for the webhook and embedded page, it can't reach `localhost`.

## Pricing

- **Base — 15–25 SAR/month:** auto-generation for every product + bulk
  export + scan tracking.
- **Premium — 30–40 SAR/month:** adds branded (color-styled) QR codes.

## Brand

Follows Abdullah's shared brand system (`/Users/saeed/Desktop/Skills/brand-system`):
teal `#0B7A75` anchor, warm cream `#F6EFE3` base, ink `#131110` text, and a
violet `#7A5CFA` accent chosen specifically because it's distinct from every
sibling project's accent (Port's orange, Nahlaa's lime, Ajwaa's red/gold).
