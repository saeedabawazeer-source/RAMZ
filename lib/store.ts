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
  });
  if (error) throw new Error(`saveMerchantToken failed: ${error.message}`);
}

export async function getMerchantToken(storeId: string): Promise<MerchantToken | null> {
  const { data, error } = await supabase
    .from("merchant_tokens")
    .select("store_id, access_token, refresh_token, expires_at")
    .eq("store_id", storeId)
    .maybeSingle();
  if (error) throw new Error(`getMerchantToken failed: ${error.message}`);
  if (!data) return null;
  return {
    storeId: data.store_id,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
  };
}

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
