// A simple CSS phone-frame mockup so the QR preview reads as "this is what
// scanning looks like" rather than just another flat image.
export function PhoneFrame({ qrDataUrl, label }: { qrDataUrl: string; label: string }) {
  return (
    <div className="mx-auto w-[150px] rounded-[20px] border-[4px] border-ink bg-ink p-2 shadow-brand-lg">
      <div className="relative rounded-[14px] bg-white p-4">
        <div className="mx-auto mb-3 h-1.5 w-8 rounded-full bg-ink/20" />
        <div className="relative mx-auto h-24 w-24">
          <img src={qrDataUrl} alt={label} className="h-full w-full rounded border-2 border-ink" />
          {/* viewfinder corner brackets, suggesting an active scan */}
          <span className="absolute -left-1.5 -top-1.5 h-4 w-4 border-l-[3px] border-t-[3px] border-accent" />
          <span className="absolute -right-1.5 -top-1.5 h-4 w-4 border-r-[3px] border-t-[3px] border-accent" />
          <span className="absolute -bottom-1.5 -left-1.5 h-4 w-4 border-b-[3px] border-l-[3px] border-accent" />
          <span className="absolute -bottom-1.5 -right-1.5 h-4 w-4 border-b-[3px] border-r-[3px] border-accent" />
        </div>
      </div>
    </div>
  );
}
