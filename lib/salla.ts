/**
 * Minimal Salla Partner API client — just the calls this app needs.
 * Docs: https://docs.salla.dev/
 *
 * IMPORTANT — auth mode: Salla's own docs state Easy Mode OAuth is the only
 * mode allowed for apps published on the Salla App Store; Custom Mode
 * (the exchangeCodeForToken flow below) is documented as testing-only via
 * Postman. This app is built around Easy Mode: Salla performs the OAuth
 * code exchange itself and pushes the access_token/refresh_token to your
 * webhook via the `app.store.authorize` event (see app/api/webhooks/salla/
 * route.ts). exchangeCodeForToken is kept here only in case you need it for
 * local Postman-style testing — it is NOT used in the real install flow.
 */

const API_BASE = "https://api.salla.dev/admin/v2";
const OAUTH_TOKEN_URL = "https://accounts.salla.sa/oauth2/token";

/** Testing-only (Custom Mode / Postman). Not used by the Easy Mode install flow. */
export async function exchangeCodeForToken(code: string) {
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.SALLA_CLIENT_ID!,
      client_secret: process.env.SALLA_CLIENT_SECRET!,
      redirect_uri: process.env.SALLA_REDIRECT_URI!,
      code,
    }),
  });
  if (!res.ok) throw new Error(`Salla token exchange failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number; scope: string }>;
}

/**
 * Manual refresh — Easy Mode apps normally don't need this: Salla refreshes
 * the token itself and re-delivers it via another app.store.authorize
 * webhook event before the old one (14-day life) expires. Kept as a fallback
 * only; per Salla's docs, refresh tokens are single-use and reusing one
 * invalidates the whole chain, forcing the merchant to reinstall the app —
 * so don't call this unless you're certain Easy Mode's auto-refresh didn't fire.
 */
export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.SALLA_CLIENT_ID!,
      client_secret: process.env.SALLA_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`Salla token refresh failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number }>;
}

export interface SallaOrderItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  // Legacy field, deprecated per Salla docs but some stores may still return it.
  codes?: string[];
  // Current field: digital delivery URL/content for this order item, if any.
  urls?: { digital_content?: string };
}

export async function listOrderItems(accessToken: string, orderId: string | number): Promise<SallaOrderItem[]> {
  const res = await fetch(`${API_BASE}/orders/items?order_id=${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`List Order Items failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.data as SallaOrderItem[];
}

// Extracts whatever digital code/content value is present on an order item,
// preferring the current field over the deprecated one.
export function extractDigitalCode(item: SallaOrderItem): string | null {
  if (item.urls?.digital_content) return item.urls.digital_content;
  if (item.codes && item.codes.length > 0) return item.codes[0];
  return null;
}
