"use client";

import { useEffect, useState } from "react";

interface GeneratedCode {
  id: string;
  orderId: string;
  productName: string;
  code: string;
  qrDataUrl: string;
  barcodeDataUrl: string;
  createdAt: number;
}

/**
 * The page that runs inside the Salla merchant dashboard iframe (an
 * "Embedded Page" — https://docs.salla.dev/embedded-sdk/overview). Lists
 * every digital code generated so far as printable QR + barcode images.
 *
 * TODO: wire in the real Salla Embedded SDK to get the authenticated
 * merchant's storeId instead of the "?storeId=" query param placeholder
 * below — the SDK provides this via postMessage handshake with the parent
 * dashboard frame.
 */
export default function EmbedPage() {
  const [codes, setCodes] = useState<GeneratedCode[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStoreId(params.get("storeId"));
  }, []);

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/codes?storeId=${storeId}`)
      .then((r) => r.json())
      .then((d) => setCodes(d.codes ?? []));
  }, [storeId]);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Digital product codes</h1>
      {!storeId && <p className="text-sm text-gray-500">Waiting for store context…</p>}
      {storeId && codes.length === 0 && (
        <p className="text-sm text-gray-500">No digital orders processed yet. New paid orders will appear here automatically.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {codes.map((c) => (
          <div key={c.id} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-1 text-sm font-semibold">{c.productName}</div>
            <div className="mb-3 font-mono text-xs text-gray-500">Order #{c.orderId}</div>
            <img src={c.qrDataUrl} alt="QR code" className="mb-2 h-32 w-32" />
            <img src={c.barcodeDataUrl} alt="Barcode" className="mb-2 w-full" />
            <div className="break-all font-mono text-[11px] text-gray-400">{c.code}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
