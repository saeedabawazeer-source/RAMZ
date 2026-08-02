import { Package } from "lucide-react";

// A real flyer mockup — looks like something pinned to a corkboard or taped
// to a wall, not a flat colored rectangle. Product block up top, a "new
// drop" price-tag-style badge, then a dashed tear line before the QR + CTA
// row, so the QR reads as "the part you actually scan" on a printed piece.
export function FlyerMock({
  qrDataUrl,
  scanLabel,
  productName = "Wireless Earbuds",
  tag = "NEW DROP",
}: {
  qrDataUrl: string;
  scanLabel: string;
  productName?: string;
  tag?: string;
}) {
  return (
    <div className="relative mx-auto w-[168px] -rotate-2">
      {/* tape corners, so it reads as pinned/taped to something */}
      <span className="absolute -top-2 left-5 z-10 h-4 w-9 -rotate-6 rounded-[2px] bg-white/70 shadow-sm" />
      <span className="absolute -top-2 right-5 z-10 h-4 w-9 rotate-6 rounded-[2px] bg-white/70 shadow-sm" />

      <div className="rounded-sm border-[3px] border-ink bg-white p-3 shadow-brand-lg">
        <div className="mb-2 flex h-20 items-center justify-center rounded-sm bg-gradient-to-br from-teal to-accent">
          <Package className="text-white" size={30} strokeWidth={1.75} aria-hidden="true" />
        </div>

        <div className="mb-1.5 flex items-start justify-between gap-2">
          <div className="font-display text-xs font-bold leading-tight">{productName}</div>
          <span className="shrink-0 rounded-full border-2 border-ink bg-accent px-2 py-0.5 font-mono text-[8px] font-bold text-white">
            {tag}
          </span>
        </div>

        <div className="flex items-center gap-2 border-t-2 border-dashed border-ink/25 pt-2">
          <img src={qrDataUrl} alt="Flyer QR code" className="h-12 w-12 shrink-0 rounded border-2 border-ink" />
          <span className="font-display text-[10px] font-bold uppercase leading-tight text-ink">{scanLabel}</span>
        </div>
      </div>
    </div>
  );
}
