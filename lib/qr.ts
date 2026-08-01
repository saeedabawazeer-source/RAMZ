import QRCode from "qrcode";
import bwipjs from "bwip-js";

/** Renders a value as a QR code, returned as a base64 PNG data URL. */
export async function generateQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, { margin: 1, width: 300 });
}

/**
 * Renders a value as a CODE128 barcode (the standard format handheld
 * barcode scanners read), returned as a base64 PNG data URL. CODE128
 * supports arbitrary alphanumeric text, which fits Salla's digital codes
 * (they aren't always pure numbers).
 */
export async function generateBarcodeDataUrl(value: string): Promise<string> {
  const png = await bwipjs.toBuffer({
    bcid: "code128",
    text: value,
    scale: 3,
    height: 12,
    includetext: true,
    textxalign: "center",
  });
  return `data:image/png;base64,${png.toString("base64")}`;
}
