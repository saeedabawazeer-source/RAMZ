/**
 * Minimal Zid Partner API client — the Zid-side twin of lib/salla.ts.
 * Docs: https://docs.zid.sa/authorization.md, https://docs.zid.sa/webhooks.md
 *
 * IMPORTANT — Zid's auth model is different from Salla's Easy Mode: Zid does
 * NOT push tokens to a webhook after install. Instead the merchant is
 * redirected to our own Redirection URL (app/api/oauth/zid/callback) with a
 * `?code=` query param, and OUR server exchanges that code for tokens by
 * calling the Token endpoint directly (classic OAuth 2.0 authorization-code
 * grant). See that route for the redirect side of this flow.
 *
 * Zid also uses two tokens per store, both required on every API call:
 *   - Authorization token  -> `Authorization: Bearer <token>` header
 *   - X-Manager-Token       -> `X-Manager-Token: <token>` header (this is the
 *     same value the token endpoint calls "access_token" — confusingly, Zid's
 *     "Access-Token" and "X-Manager-Token" are the same value, just used
 *     under different header names depending on the endpoint family).
 * Both expire in ~1 year, refresh_token also expires in ~1 year.
 */

const API_BASE = "https://api.zid.sa/v1";
const OAUTH_TOKEN_URL = "https://oauth.zid.sa/oauth/token";

export interface ZidTokenResponse {
  /** This is the X-Manager-Token / Access-Token value, despite the generic name. */
  accessToken: string;
  /** This is the Authorization-header bearer token. */
  authorizationToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/**
 * Zid's token response field names are inconsistently cased across their own
 * docs ("authorization" in prose, but real APIs vary) — read defensively and
 * log the raw shape once so a mismatch is obvious in Railway logs rather than
 * a silent undefined.
 */
function parseTokenResponse(json: any): ZidTokenResponse {
  const authorizationToken = json.authorization ?? json.Authorization ?? json.authorization_token;
  const accessToken = json.access_token;
  if (!authorizationToken || !accessToken) {
    console.error("Unexpected Zid token response shape", json);
  }
  return {
    accessToken,
    authorizationToken,
    refreshToken: json.refresh_token,
    expiresIn: Number(json.expires_in ?? 31536000), // docs: ~1 year
  };
}

export async function exchangeCodeForToken(code: string): Promise<ZidTokenResponse> {
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ZID_CLIENT_ID!,
      client_secret: process.env.ZID_CLIENT_SECRET!,
      redirect_uri: process.env.ZID_REDIRECT_URI!,
      code,
    }),
  });
  if (!res.ok) throw new Error(`Zid token exchange failed: ${res.status} ${await res.text()}`);
  return parseTokenResponse(await res.json());
}

export async function refreshAccessToken(refreshToken: string): Promise<ZidTokenResponse> {
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ZID_CLIENT_ID!,
      client_secret: process.env.ZID_CLIENT_SECRET!,
      redirect_uri: process.env.ZID_REDIRECT_URI!,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`Zid token refresh failed: ${res.status} ${await res.text()}`);
  return parseTokenResponse(await res.json());
}

function authHeaders(authorizationToken: string, accessToken: string) {
  return {
    Authorization: `Bearer ${authorizationToken}`,
    "X-Manager-Token": accessToken,
    Accept: "application/json",
  };
}

/**
 * There's no single confirmed "give me the store id" field in Zid's public
 * docs, so this checks every shape their sample profile-style endpoints are
 * known to return. If Zid's actual response doesn't match any of these, this
 * throws with the raw JSON logged — fix by adding the real path here once
 * seen in a live Railway log, rather than guessing further.
 */
function extractStoreId(json: any): string {
  const candidates = [
    json?.store?.id,
    json?.data?.store?.id,
    json?.data?.id,
    json?.id,
    json?.user?.store?.id,
  ];
  const found = candidates.find((v) => v !== undefined && v !== null);
  if (found === undefined) {
    console.error("Could not find store id in Zid profile response", json);
    throw new Error("Could not determine Zid store id from profile response");
  }
  return String(found);
}

function extractStoreDomain(json: any): string | null {
  const candidates = [
    json?.store?.domain,
    json?.data?.store?.domain,
    json?.data?.domain,
    json?.store?.url,
    json?.data?.store?.url,
  ];
  const found = candidates.find((v) => typeof v === "string" && v.length > 0);
  return found ? String(found).replace(/^https?:\/\//, "").replace(/\/$/, "") : null;
}

export interface ZidStoreProfile {
  storeId: string;
  storeDomain: string | null;
}

/** GET the authenticated manager's profile — used right after token exchange purely to learn the store id (and domain, as a product-URL fallback). */
export async function getStoreProfile(authorizationToken: string, accessToken: string): Promise<ZidStoreProfile> {
  const res = await fetch(`${API_BASE}/managers/account/profile`, {
    headers: authHeaders(authorizationToken, accessToken),
  });
  if (!res.ok) throw new Error(`Zid profile fetch failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return { storeId: extractStoreId(json), storeDomain: extractStoreDomain(json) };
}

export interface ZidProduct {
  id: number | string;
  name: string;
  // Field name for the live storefront URL isn't confirmed from docs yet —
  // check every plausible shape, same defensive approach as extractStoreId.
  url?: string;
  slug?: string;
}

/** GET /products/{id} */
export async function getProduct(
  authorizationToken: string,
  accessToken: string,
  productId: string | number
): Promise<ZidProduct> {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    headers: authHeaders(authorizationToken, accessToken),
  });
  if (!res.ok) throw new Error(`Zid Get Product failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return (json.data ?? json.product ?? json) as ZidProduct;
}

/** The one URL this whole app exists to turn into a scannable code. */
export function resolveProductUrl(product: ZidProduct, storeDomain?: string | null): string | null {
  if (product.url) return product.url;
  if (storeDomain && product.slug) return `https://${storeDomain}/product/${product.slug}`;
  return null;
}
