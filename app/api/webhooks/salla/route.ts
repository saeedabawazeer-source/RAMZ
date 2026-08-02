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
 * Security strategy for this app is set to "Token" in the Partners Portal
  * (App > Webhooks/Notifications). Salla sends the secret key value back in
   * the Authorization header (sometimes prefixed with "Bearer "), so we just
    * need an exact string match against SALLA_WEBHOOK_SECRET.
     */
function isVerifiedWebhook(req: NextRequest, _rawBody: string): boolean {
  const secret = process.env.SALLA_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // allow through in local dev only
  const authHeader = req.headers.get("authorization") || "";
  const provided = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  return provided === secret;
}


export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Log every single incoming request BEFORE any verification/parsing can
  // reject or crash it — this is the only way to tell "Salla never called
  // us" apart from "Salla called us and we silently rejected it".
  console.log("Incoming Salla webhook", {
    headers: Object.fromEntries(req.headers.entries()),
    bodyPreview: rawBody.slice(0, 500),
  });

  if (!isVerifiedWebhook(req, rawBody)) {
    console.log("Rejected webhook as unverified");
    return NextResponse.json({ error: "unverified" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error("Failed to parse webhook body as JSON", err);
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const event = payload.event as string;
  console.log("Parsed webhook event", event);

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

// Lets you confirm the endpoint itself is reachable by just visiting the URL
// in a browser — Salla only ever sends POST, so GET is otherwise unused.
export async function GET() {
  return NextResponse.json({ ok: true, note: "Webhook endpoint is reachable. Salla sends POST here." });
}
