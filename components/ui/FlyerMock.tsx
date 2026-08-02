// A small poster/flyer mockup — shows the QR in a real print context
// instead of floating on its own.
export function FlyerMock({ qrDataUrl, scanLabel }: { qrDataUrl: string; scanLabel: string }) {
  return (
    <div className="mx-auto w-[150px] -rotate-2 rounded-brand border-[4px] border-ink bg-teal p-4 text-center shadow-brand-lg">
      <div className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white">
        {scanLabel}
      </div>
      <div className="mx-auto w-fit rounded border-2 border-ink bg-white p-1.5">
        <img src={qrDataUrl} alt="Flyer QR code" className="h-20 w-20" />
      </div>
    </div>
  );
}
