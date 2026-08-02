import QRCode from "qrcode";
import bwipjs from "bwip-js";

/** Renders a value as a QR code, returned as a base64 PNG data URL. */
export async function generateQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, { margin: 1, width: 300 });
}

/**
 * Premium-tier "branded" QR: same scannable data, rendered in the merchant's
 * brand colors instead of plain black-on-white. Real, working differentiation
 * — not a placeholder — but scoped to color only for now. A logo-in-the-
 * center version needs a canvas/image-compositing dependency (sharp or
 * node-canvas); intentionally left out here to keep this app's build light
 * and reliable on Railway. Track as a fast-follow, not a blocker.
 */
export async function generateBrandedQrDataUrl(
  value: string,
  opts: { dark?: string; light?: string } = {}
): Promise<string> {
  return QRCode.toDataURL(value, {
    margin: 1,
    width: 300,
    color: {
      dark: opts.dark ?? "#7A5CFA", // Ramz violet accent
      light: opts.light ?? "#F6EFE3", // Ramz cream
    },
  });
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
