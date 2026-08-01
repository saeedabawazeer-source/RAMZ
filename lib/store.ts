/**
 * Storage layer — deliberately the simplest possible thing that works for local
 * dev and demoing: an in-memory Map. This is NOT safe for production:
 *
 *   - Serverless platforms (Vercel, etc.) run each request in a fresh/ephemeral
 *     process, so in-memory data does not persist between requests reliably.
 *   - Merchant OAuth tokens MUST be stored somewhere durable and encrypted at
 *     rest before this app goes live — losing a merchant's token means they
 *     have to reinstall the app.
 *
 * TODO(prod): swap this module's internals for a real datastore before
 * publishing — Vercel KV, Supabase (Postgres), or even a single Postgres
 * table is enough for this app's scale. Keep the same function signatures
 * below so nothing else in the app has to change.
 */

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

const tokens = new Map<string, MerchantToken>();
const codes = new Map<string, GeneratedCode[]>(); // keyed by storeId

export async function saveMerchantToken(token: MerchantToken) {
  tokens.set(token.storeId, token);
}

export async function getMerchantToken(storeId: string) {
  return tokens.get(storeId) ?? null;
}

export async function saveGeneratedCode(entry: GeneratedCode) {
  const existing = codes.get(entry.storeId) ?? [];
  codes.set(entry.storeId, [entry, ...existing].slice(0, 200)); // cap for demo purposes
}

export async function listGeneratedCodes(storeId: string) {
  return codes.get(storeId) ?? [];
}
