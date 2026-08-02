import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getStoreProfile } from "@/lib/zid";
import { saveZidMerchantToken, getZidMerchantToken } from "@/lib/store";

/**
 * This is the "Redirection URL" registered in the Zid Partner Dashboard
 * (Application Details step). Unlike Salla's Easy Mode, Zid does not push
 * tokens to a webhook — instead it redirects the merchant's browser here
 * with a one-time `?code=` after they approve the install, and OUR server
 * exchanges that code for tokens directly. See lib/zid.ts for the exchange
 * call and docs/authorization.md's documented flow.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    console.error("Zid OAuth redirect returned an error", error);
    return NextResponse.redirect(new URL("/?zid_error=" + encodeURIComponent(error), req.url));
  }
  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  try {
    const token = await exchangeCodeForToken(code);
    // Zid's token response doesn't include the store id directly, so fetch
    // the manager profile once right after exchange purely to learn it (and
    // the store domain, as a fallback for building product URLs) — that id
    // is what every subsequent webhook payload will key rows by.
    const profile = await getStoreProfile(token.authorizationToken, token.accessToken);

    const existing = await getZidMerchantToken(profile.storeId);
    await saveZidMerchantToken({
      storeId: profile.storeId,
      accessToken: token.accessToken,
      authorizationToken: token.authorizationToken,
      refreshToken: token.refreshToken,
      expiresAt: Date.now() + token.expiresIn * 1000,
      plan: existing?.plan ?? "base",
      storeDomain: profile.storeDomain ?? existing?.storeDomain ?? null,
    });

    console.log("Zid app installed for store", profile.storeId);
    return NextResponse.redirect(new URL("/?zid_installed=1", req.url));
  } catch (err) {
    console.error("Zid OAuth callback failed", err);
    return NextResponse.redirect(new URL("/?zid_error=install_failed", req.url));
  }
}
