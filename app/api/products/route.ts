import { NextRequest, NextResponse } from "next/server";
import { listProductQrs, getMerchantToken } from "@/lib/store";

// Called by the embedded dashboard (app/embed/page.tsx) to fetch every
// product QR generated so far for this store, plus the store's plan (so the
// UI knows whether to offer branded styling).
// TODO(auth): verify the request comes from this merchant's authenticated
// dashboard session (Salla Embedded SDK provides store context) before
// trusting the storeId query param as-is.
export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get("storeId");
  if (!storeId) return NextResponse.json({ error: "missing storeId" }, { status: 400 });
  const [products, token] = await Promise.all([listProductQrs(storeId), getMerchantToken(storeId)]);
  return NextResponse.json({ products, plan: token?.plan ?? "base" });
}
