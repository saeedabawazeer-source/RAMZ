// Ramz's one recurring illustration motif (per brand-system: one mascot/
// illustration style, reused everywhere, never mixed) — the QR corner-marker
// mark from the app icon, used as a decorative accent on hero/feature
// moments. Never used as a literal scannable code.
export function QrMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="4" y="4" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="8" />
      <rect x="16" y="16" width="8" height="8" fill="currentColor" />
      <rect x="68" y="68" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="8" />
      <rect x="80" y="80" width="8" height="8" fill="currentColor" />
      <rect x="68" y="4" width="10" height="10" fill="currentColor" />
      <rect x="86" y="4" width="10" height="10" fill="currentColor" />
      <rect x="68" y="22" width="10" height="10" fill="currentColor" />
      <rect x="4" y="68" width="10" height="10" fill="currentColor" />
      <rect x="4" y="86" width="10" height="10" fill="currentColor" />
      <rect x="22" y="86" width="10" height="10" fill="currentColor" />
    </svg>
  );
}
