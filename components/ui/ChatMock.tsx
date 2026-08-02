// A messaging-app mockup — shows a merchant sharing the code in a DM/
// broadcast, which is how a lot of these codes actually travel (WhatsApp
// broadcasts, Instagram DMs) rather than only living on a printed flyer.
// Deliberately generic chat chrome (not a specific app's exact UI/branding)
// — the point is "this is what it looks like shared in a message," not a
// recreation of any one platform.
export function ChatMock({ qrDataUrl, caption }: { qrDataUrl: string; caption: string }) {
  return (
    <div className="mx-auto w-[168px] rounded-[22px] border-[4px] border-ink bg-ink p-2 shadow-brand-lg">
      <div className="overflow-hidden rounded-[16px] bg-[#ECE5D8]">
        {/* chat header */}
        <div className="flex items-center gap-2 bg-teal px-3 py-2">
          <div className="h-6 w-6 shrink-0 rounded-full border-2 border-white bg-white/25" />
          <div className="min-w-0 text-left">
            <div className="truncate font-display text-[10px] font-bold text-white">Your Store</div>
            <div className="font-mono text-[7px] text-white/70">online</div>
          </div>
        </div>

        {/* message bubble */}
        <div className="p-2.5">
          <div className="rounded-[10px] rounded-tl-sm border-2 border-ink bg-white p-2 shadow-brand">
            <img src={qrDataUrl} alt="Shared QR code" className="mb-1.5 h-16 w-16 rounded border-2 border-ink" />
            <p className="text-[8.5px] leading-snug text-ink">{caption}</p>
            <div className="mt-1.5 flex items-center justify-end gap-1">
              <span className="font-mono text-[7px] text-ink/40">9:41 AM</span>
              <svg width="12" height="8" viewBox="0 0 16 11" fill="none" aria-hidden="true">
                <path
                  d="M1 5.5L5 9.5L11 1.5M6 5.5L10 9.5L16 1.5"
                  stroke="#0B7A75"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
