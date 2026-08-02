import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { listProductQrs, getMerchantToken } from "@/lib/store";

/**
 * Bulk export (feature #2): bundles every product's QR image into a single
 * zip so a merchant can hand it to a printer for a flyer/packaging run
 * instead of saving images one by one. Uses the branded version when the
 * store is on the premium plan and one exists, otherwise the plain QR.
 */
export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get("storeId");
  if (!storeId) return NextResponse.json({ error: "missing storeId" }, { status: 400 });

  const [products, token] = await Promise.all([listProductQrs(storeId), getMerchantToken(storeId)]);
  if (products.length === 0) {
    return NextResponse.json({ error: "no_products_yet" }, { status: 404 });
  }

  const zip = new JSZip();
  for (const product of products) {
    const useBranded = token?.plan === "premium" && product.brandedQrDataUrl;
    const dataUrl = useBranded ? product.brandedQrDataUrl! : product.qrDataUrl;
    const base64 = dataUrl.split(",")[1];
    const safeName = product.productName.replace(/[^a-z0-9؀-ۿ]+/gi, "-").slice(0, 60);
    zip.file(`${safeName || product.productId}-${product.productId}.png`, base64, { base64: true });
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="ramz-qr-codes-${storeId}.zip"`,
    },
  });
}
