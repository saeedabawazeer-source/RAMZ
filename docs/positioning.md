# Ramz — Positioning (final, post-pivot)

This supersedes two earlier drafts written before the scope was finalized:
one recommending a pivot toward physical-inventory barcoding, one recommending
automated digital-code delivery. Abdullah settled scope directly — this
reflects that decision, not either earlier draft.

## What Ramz is

A universal QR code generator for Salla stores. Every product — physical or
digital — gets a scannable code, generated automatically and kept in sync
with the live catalog. Point it at a flyer, packaging, a poster, a business
card, or an Instagram/TikTok "scan to buy" overlay, and it lands the customer
straight on that product's page.

## Why this avoids the trap the earlier analysis flagged

The original scope (QR-ify an existing digital redemption code) overlapped
directly with a live competitor, Pay Card, which already automates digital
code delivery end to end — a fight Ramz had no edge in. This version doesn't
compete there at all: it's not about delivering a code to a customer, it's
about making any product instantly scannable for marketing and in-person
sale. Digital products are one use case among several (physical product
flyers/packaging, marketing overlays), not the whole pitch — so a single
competitor in one narrow sub-niche doesn't sink the product.

## Core value proposition

One line: "Every product in your store gets a scannable code automatically —
no exporting, no manual work, always up to date."

## Features (in build order)

1. Auto-generate QR for any product (digital or physical), linked to the live
   catalog, regenerated automatically when the product changes.
2. Bulk export — download every code as a zip for a print run.
3. Scan tracking — count how many times each code was scanned, giving the
   merchant real marketing data instead of a guess.
4. Branded styling (Premium) — QR rendered in the merchant's brand color
   instead of plain black. (Logo-in-center is a fast-follow, not in v1 — see
   README "still a placeholder".)

## Pricing

- **Base: 15–25 SAR/month** — auto-generation, bulk export, scan tracking.
- **Premium: 30–40 SAR/month** — adds branded styling.

This is priced as a broad marketing utility, not a narrow fulfillment tool,
which is why it can sit meaningfully above Pay Card's 23 SAR/month without
being a head-to-head price comparison — it's not solving the same problem.

## Brand

No name change, no new visual system. Ramz (رمز — "code/symbol") still fits:
the product's whole job is turning a product into a code you can scan.
Visual system stays exactly as documented in
`/Users/saeed/Desktop/Skills/brand-system/docs/brand.md` — teal `#0B7A75`
anchor, cream `#F6EFE3` base, ink `#131110` text, violet `#7A5CFA` accent.

Suggested tagline: **"Every product, one scan away."**
