export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/icon.svg" alt="" className="h-8 w-8 rounded-[6px] border-2 border-ink" aria-hidden="true" />
      <span className="text-xl font-bold tracking-tight text-teal">RAMZ</span>
    </span>
  );
}
