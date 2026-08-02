import { NextRequest, NextResponse } from "next/server";
import { getProduct, resolveProductUrl } from "@/lib/zid";
import { generateQrDataUrl, generateBrandedQrDataUrl } from "@/lib/qr";
import { getZidMerchantToken, getProductQr, saveProductQr } from "@/lib/store";

/** Public base URL this app is deployed at — same one used by the Salla webhook. */
const APP_URL = process.env.APP_URL ?? "https://ramz-production-0c82.up.railway.app";

/**
 * This is the "Callback URL" registered in the Zid Partner Dashboard
 * (Application Details step / Webhook Management step). Per
 * docs.zid.sa/webhooks.md, subscribe to these events there:
 *
 *   - product.create / product.update / product.publish — core loop: every
 *     product a merchant adds, edits, or publishes gets its QR (re)generated,
 *     mirroring the Salla webhook's product.created/product.updated handling.
 *   - (Zid's docs note an app-uninstall event exists — "When the merchant
 *     uninstalls your app, we will send you a webhook with this event and
 *     the tokens you have will be invalid" — but don't give its exact name
 *     in the pages fetched so far. Handled defensively below by checking a
 *     few plausible names; update once the real name is confirmed from a
 *     live Zid webhook log.)
 *
 * Zid's docs (as fetched) don't specify a webhook signature/secret scheme
 * the way Salla's "Token" strategy does, so verification here is
 * best-effort: if ZID_WEBHOOK_SECRET is set, require it via a header; if
 * not set, allow through in all environments except flag it loudly in logs
 * so this isn't silently insecure in production long-term.
 */
function isVerifiedWebhook(req: NextRequest): boolean {
  const secret = process.env.ZID_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("ZID_WEBHOOK_SECRET is not set — accepting Zid webhook without verification");
    return true;
  }
  const provided = req.headers.get("x-zid-webhook-secret") || req.headers.get("authorization") || "";
  return provided === secret || provided === `Bearer ${secret}`;
}

/** Namespace Zid rows in the shared product_qrs table so a Zid store id can never collide with a Salla store id. */
function namespacedStoreId(zidStoreId: string) {
  return `zid:${zidStoreId}`;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  console.log("Incoming Zid webhook", {
    headers: Object.fromEntries(req.headers.entries()),
    bodyPreview: rawBody.slice(0, 500),
  });

  if (!isVerifiedWebhook(req)) {
    console.log("Rejected Zid webhook as unverified");
    return NextResponse.json({ error: "unverified" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error("Failed to parse Zid webhook body as JSON", err);
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Zid's exact envelope shape (which field carries the event name, and
  // which carries the store id) isn't fully confirmed from docs fetched so
  // far — check the plausible field names defensively rather than assume one.
  const event: string | undefined = payload.event ?? payload.event_name ?? payload.type;
  const zidStoreId: string | undefined =
    payload.store_id !== undefined
      ? String(payload.store_id)
      : payload.store?.id !== undefined
      ? String(payload.store.id)
      : payload.data?.store_id !== undefined
      ? String(payload.data.store_id)
      : undefined;

  console.log("Parsed Zid webhook event", event, "store", zidStoreId);

  if (!event) {
    return NextResponse.json({ ok: true, ignored: "no_event_field" });
  }

  if (/uninstall/i.test(event)) {
    // Tokens are invalid per Zid's docs once this fires — nothing else to do
    // here since we don't currently delete rows on uninstall (kept for
    // potential reinstall / audit trail, same posture as the Salla side).
    console.log("Zid app uninstalled for store", zidStoreId);
    return NextResponse.json({ ok: true });
  }

  if (event === "product.create" || event === "product.update" || event === "product.publish") {
    if (!zidStoreId) return NextResponse.json({ error: "missing_store_id" }, { status: 400 });

    const token = await getZidMerchantToken(zidStoreId);
    if (!token) return NextResponse.json({ error: "store not installed" }, { status: 404 });

    const productId = payload.data?.id ?? payload.product?.id ?? payload.data?.product_id;
    if (!productId) return NextResponse.json({ ok: true });

    try {
      const product = await getProduct(token.authorizationToken, token.accessToken, productId);
      const productUrl = resolveProductUrl(product, token.storeDomain);
      if (!productUrl) {
        return NextResponse.json({ ok: true, skipped: "no_product_url" });
      }

      const storeId = namespacedStoreId(zidStoreId);
      const id = `${storeId}-${productId}`;
      const shortLink = `${APP_URL}/api/s/${id}`;

      const [qrDataUrl, brandedQrDataUrl] = await Promise.all([
        generateQrDataUrl(shortLink),
        token.plan === "premium" ? generateBrandedQrDataUrl(shortLink) : Promise.resolve(null),
      ]);

      const existing = await getProductQr(id);
      await saveProductQr({
        id,
        storeId,
        productId: String(productId),
        productName: product.name,
        productUrl,
        qrDataUrl,
        brandedQrDataUrl,
        scanCount: existing?.scanCount ?? 0,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      });
      return NextResponse.json({ ok: true, productId });
    } catch (err) {
      console.error("Failed to process Zid product webhook", { productId, zidStoreId, err });
      return NextResponse.json({ error: "upstream_failure" }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, ignored: event });
}

// Same reachability check the Salla webhook route offers.
export async function GET() {
  return NextResponse.json({ ok: true, note: "Webhook endpoint is reachable. Zid sends POST here." });
}
