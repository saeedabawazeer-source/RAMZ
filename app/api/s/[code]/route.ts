import { NextRequest, NextResponse } from "next/server";
import { getProductQr, incrementScanCount } from "@/lib/store";

/**
 * The URL every generated QR code actually encodes. A scan hits this route,
 * we log it (feature #4: scan tracking), then bounce straight to the real
 * Salla product page — the customer never notices the extra hop.
 */
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const record = await getProductQr(params.code);
  if (!record) {
    return NextResponse.json({ error: "unknown_code" }, { status: 404 });
  }

  // Don't make the customer wait on a write — count the scan in the
  // background and redirect immediately.
  incrementScanCount(record.id).catch((err) => console.error("scan count increment failed", err));

  return NextResponse.redirect(record.productUrl, { status: 302 });
}
