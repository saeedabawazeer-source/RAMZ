"use client";

import { useEffect, useState } from "react";

interface ProductQr {
  id: string;
  productId: string;
  productName: string;
  productUrl: string;
  qrDataUrl: string;
  brandedQrDataUrl: string | null;
  scanCount: number;
  updatedAt: number;
}

/**
 * The page that runs inside the Salla merchant dashboard iframe (an
 * "Embedded Page" — https://docs.salla.dev/embedded-sdk/overview). Lists
 * every product's QR code, live scan counts, and a bulk-export button.
 *
 * TODO: wire in the real Salla Embedded SDK to get the authenticated
 * merchant's storeId instead of the "?storeId=" query param placeholder
 * below — the SDK provides this via postMessage handshake with the parent
 * dashboard frame.
 */
export default function EmbedPage() {
  const [products, setProducts] = useState<ProductQr[]>([]);
  const [plan, setPlan] = useState<"base" | "premium">("base");
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStoreId(params.get("storeId"));
  }, []);

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/products?storeId=${storeId}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? []);
        setPlan(d.plan ?? "base");
      });
  }, [storeId]);

  return (
    <div className="min-h-screen bg-paper p-6 text-ink">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Product QR codes</h1>
          <p className="font-mono text-xs text-ink/50">
            {plan === "premium" ? "Premium plan — branded styling active" : "Base plan"}
          </p>
        </div>
        {storeId && products.length > 0 && (
          <a
            href={`/api/export?storeId=${storeId}`}
            className="rounded-brand border-[3px] border-ink bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[4px_4px_0_#131110] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#131110]"
          >
            Download all as ZIP
          </a>
        )}
      </div>

      {!storeId && <p className="font-mono text-sm text-ink/60">Waiting for store context…</p>}
      {storeId && products.length === 0 && (
        <p className="font-mono text-sm text-ink/60">
          No products yet. Every product you add or edit gets a QR code here automatically — nothing
          to configure.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => {
          const showBranded = plan === "premium" && p.brandedQrDataUrl;
          return (
            <div
              key={p.id}
              className="rounded-brand border-[3px] border-ink bg-white p-4 shadow-[6px_6px_0_#131110] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#131110]"
            >
              <div className="mb-1 text-sm font-semibold">{p.productName}</div>
              <a
                href={p.productUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-3 block truncate font-mono text-xs text-teal underline"
              >
                {p.productUrl}
              </a>
              <img
                src={showBranded ? p.brandedQrDataUrl! : p.qrDataUrl}
                alt="QR code"
                className="mb-2 h-32 w-32 rounded border-2 border-ink"
              />
              <div className="flex items-center justify-between">
                <span className="rounded bg-teal/10 px-2 py-1 font-mono text-[11px] text-teal-dark">
                  {p.scanCount} {p.scanCount === 1 ? "scan" : "scans"}
                </span>
                <a
                  href={showBranded ? p.brandedQrDataUrl! : p.qrDataUrl}
                  download={`${p.productName}-qr.png`}
                  className="font-mono text-[11px] text-accent-dark underline"
                >
                  Download
                </a>
              </div>
              {plan !== "premium" && (
                <p className="mt-2 font-mono text-[10px] text-ink/40">
                  Upgrade to Premium for branded (color-styled) QR codes.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
