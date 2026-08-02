// The "stamp" typographic treatment from build-rules.md — a rotated badge
// used for eyebrow labels, "new"/"premium" tags, and callouts.
export function Stamp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block -rotate-2 rounded-full border-[3px] border-ink bg-accent px-4 py-1 font-mono text-xs font-bold uppercase tracking-wide text-white shadow-brand ${className}`}
    >
      {children}
    </span>
  );
}
