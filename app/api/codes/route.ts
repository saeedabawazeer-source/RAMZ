import { NextRequest, NextResponse } from "next/server";
import { listGeneratedCodes } from "@/lib/store";

// Called by the embedded dashboard page (app/embed/page.tsx) to fetch this
// store's generated QR/barcode entries.
// TODO(auth): verify the request actually comes from this merchant's
// authenticated dashboard session (Salla Embedded SDK provides the store
// context) before trusting the storeId query param as-is.
export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get("storeId");
  if (!storeId) return NextResponse.json({ error: "missing storeId" }, { status: 400 });
  const codes = await listGeneratedCodes(storeId);
  return NextResponse.json({ codes });
}
