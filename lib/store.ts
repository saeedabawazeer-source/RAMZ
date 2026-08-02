/**
 * Storage layer, backed by Supabase (Postgres). Replaces the old in-memory
 * Map — that version lost every merchant token and generated code on every
 * deploy/restart, which is unacceptable once real merchants install this.
 *
 * Uses SUPABASE_SECRET_KEY (server-only, bypasses Row Level Security) since
 * this file only ever runs in API routes, never in the browser.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.warn(
    "SUPABASE_URL / SUPABASE_SECRET_KEY are not set — storage calls will fail. See .env.example."
  );
}

const supabase = createClient(supabaseUrl ?? "", supabaseSecretKey ?? "");

export interface MerchantToken {
  storeId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
  plan?: "base" | "premium"; // controls branded QR styling; defaults to "base"
}

export interface ProductQr {
  id: string; // `${storeId}-${productId}` — also the short redirect code in /api/s/[id]
  storeId: string;
  productId: string;
  productName: string;
  productUrl: string; // the live Salla storefront URL this code resolves to
  qrDataUrl: string; // base64 PNG data URL, plain style
  brandedQrDataUrl: string | null; // premium-tier styled version, null on base plan
  scanCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface GeneratedCode {
  id: string;
  storeId: string;
  orderId: string;
  orderItemId: string;
  productName: string;
  code: string; // the raw digital_content value from Salla
  qrDataUrl: string; // base64 PNG data URL, ready to <img src=...>
  barcodeDataUrl: string;
  createdAt: number;
}

export async function saveMerchantToken(token: MerchantToken) {
  const { error } = await supabase.from("merchant_tokens").upsert({
    store_id: token.storeId,
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expires_at: token.expiresAt,
    // Only set plan on first insert; upsert with undefined would null out an
    // existing subscription tier on every token refresh, so default here.
    plan: token.plan ?? "base",
  });
  if (error) throw new Error(`saveMerchantToken failed: ${error.message}`);
}

export async function getMerchantToken(storeId: string): Promise<MerchantToken | null> {
  const { data, error } = await supabase
    .from("merchant_tokens")
    .select("store_id, access_token, refresh_token, expires_at, plan")
    .eq("store_id", storeId)
    .maybeSingle();
  if (error) throw new Error(`getMerchantToken failed: ${error.message}`);
  if (!data) return null;
  return {
    storeId: data.store_id,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    plan: data.plan ?? "base",
  };
}

// --- Legacy (pre-pivot): QR/barcode for a digital order's redemption code.
// Kept only so nothing breaks if old rows exist; the product-QR functions
// below are what the app actually runs on now. Safe to drop once confirmed
// unused in production.
export async function saveGeneratedCode(entry: GeneratedCode) {
  const { error } = await supabase.from("generated_codes").upsert({
    id: entry.id,
    store_id: entry.storeId,
    order_id: entry.orderId,
    order_item_id: entry.orderItemId,
    product_name: entry.productName,
    code: entry.code,
    qr_data_url: entry.qrDataUrl,
    barcode_data_url: entry.barcodeDataUrl,
    created_at: entry.createdAt,
  });
  if (error) throw new Error(`saveGeneratedCode failed: ${error.message}`);
}

export async function listGeneratedCodes(storeId: string): Promise<GeneratedCode[]> {
  const { data, error } = await supabase
    .from("generated_codes")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(`listGeneratedCodes failed: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    storeId: row.store_id,
    orderId: row.order_id,
    orderItemId: row.order_item_id,
    productName: row.product_name,
    code: row.code,
    qrDataUrl: row.qr_data_url,
    barcodeDataUrl: row.barcode_data_url,
    createdAt: row.created_at,
  }));
}

// --- Product QR: the app's actual product (one row per product, kept in
// sync whenever Salla tells us the product changed).

export async function saveProductQr(entry: ProductQr) {
  const { error } = await supabase.from("product_qrs").upsert(
    {
      id: entry.id,
      store_id: entry.storeId,
      product_id: entry.productId,
      product_name: entry.productName,
      product_url: entry.productUrl,
      qr_data_url: entry.qrDataUrl,
      branded_qr_data_url: entry.brandedQrDataUrl,
      // scan_count intentionally omitted on upsert — see incrementScanCount,
      // this must never be reset when a product is re-synced.
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    },
    { onConflict: "id", ignoreDuplicates: false }
  );
  if (error) throw new Error(`saveProductQr failed: ${error.message}`);
}

export async function listProductQrs(storeId: string): Promise<ProductQr[]> {
  const { data, error } = await supabase
    .from("product_qrs")
    .select("*")
    .eq("store_id", storeId)
    .order("updated_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`listProductQrs failed: ${error.message}`);
  return (data ?? []).map(mapProductQrRow);
}

export async function getProductQr(id: string): Promise<ProductQr | null> {
  const { data, error } = await supabase.from("product_qrs").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getProductQr failed: ${error.message}`);
  return data ? mapProductQrRow(data) : null;
}

/** Fire-and-forget from the scan-redirect route — never blocks the redirect. */
export async function incrementScanCount(id: string) {
  const { error } = await supabase.rpc("increment_scan_count", { row_id: id });
  if (error) console.error(`incrementScanCount failed for ${id}:`, error.message);
}

function mapProductQrRow(row: any): ProductQr {
  return {
    id: row.id,
    storeId: row.store_id,
    productId: row.product_id,
    productName: row.product_name,
    productUrl: row.product_url,
    qrDataUrl: row.qr_data_url,
    brandedQrDataUrl: row.branded_qr_data_url,
    scanCount: row.scan_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
