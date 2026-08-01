import { NextRequest, NextResponse } from "next/server";
import { listOrderItems, extractDigitalCode } from "@/lib/salla";
import { generateQrDataUrl, generateBarcodeDataUrl } from "@/lib/qr";
import { saveMerchantToken, getMerchantToken, saveGeneratedCode } from "@/lib/store";

/**
 * Single webhook endpoint that receives every subscribed event from Salla.
 * Salla's dashboard lets you pick which App Events and Store Events to send
 * here — configure both of these in the Partners Portal:
 *
 *   1. App Events -> "App Store Authorize" (event name: app.store.authorize)
 *      This is how Easy Mode delivers the access_token/refresh_token after
 *      install (and again on each auto-refresh) — see docs/salla-setup.md.
 *
 *   2. Store Events -> an Orders event fired when a digital product is paid
 *      for. Salla's event picker in the portal lists the exact available
 *      names (they change over time) — pick the "order paid"/"completed"
 *      status event, or use Conditional Webhooks
 *      (https://docs.salla.dev/421120m0) to filter order.status.updated to
 *      just the paid/completed status so this doesn't fire on unpaid orders.
 *      CONFIRM the exact event name in your portal before relying on this.
 *
 * TODO(security): Salla's docs state webhooks are verified via a "Signature
 * or Token strategy" but the exact header name/algorithm needs confirming
 * from your app's Webhook security settings in the Partners Portal before
 * this goes live — do not treat the check below as final until confirmed.
 */
function isVerifiedWebhook(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.SALLA_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // allow through in local dev only
  const provided = req.headers.get("x-salla-security-strategy") ? req.headers.get("signature") : req.headers.get("authorization");
  // Placeholder equality/HMAC check — replace with the exact scheme Salla's
  // portal shows for your app once confirmed (see TODO above).
  return Boolean(provided);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  if (!isVerifiedWebhook(req, rawBody)) {
    return NextResponse.json({ error: "unverified" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event as string;

  if (event === "app.store.authorize") {
    const { access_token, refresh_token, expires } = payload.data;
    await saveMerchantToken({
      storeId: String(payload.merchant),
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Number(expires) * 1000,
    });
    return NextResponse.json({ ok: true });
  }

  // Adjust this to whatever event name you confirm in the portal for a paid order.
  if (event === "order.status.updated" || event === "order.created") {
    const storeId = String(payload.merchant);
    const token = await getMerchantToken(storeId);
    if (!token) return NextResponse.json({ error: "store not installed" }, { status: 404 });

    const orderId = payload.data?.id ?? payload.data?.order_id;
    if (!orderId) return NextResponse.json({ ok: true }); // nothing to do

    // Salla will retry a webhook that responds with a server error, so a
    // real failure (bad/expired token, Salla API outage) should surface as
    // a 502 rather than crash — that gets you a retry instead of a silently
    // dropped order. A malformed/unexpected payload, by contrast, will never
    // succeed on retry, so that stays a 4xx below.
    try {
      const items = await listOrderItems(token.accessToken, orderId);
      for (const item of items) {
        const code = extractDigitalCode(item);
        if (!code) continue; // not a digital item, or no code assigned yet

        const [qrDataUrl, barcodeDataUrl] = await Promise.all([
          generateQrDataUrl(code),
          generateBarcodeDataUrl(code),
        ]);

        await saveGeneratedCode({
          id: `${orderId}-${item.id}`,
          storeId,
          orderId: String(orderId),
          orderItemId: String(item.id),
          productName: item.name,
          code,
          qrDataUrl,
          barcodeDataUrl,
          createdAt: Date.now(),
        });
      }
      return NextResponse.json({ ok: true, processed: items.length });
    } catch (err) {
      console.error("Failed to process order webhook", { orderId, storeId, err });
      return NextResponse.json({ error: "upstream_failure" }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, ignored: event });
}
