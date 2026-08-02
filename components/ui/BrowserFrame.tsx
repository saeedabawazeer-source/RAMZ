// Wraps a dashboard mockup in a browser-window chrome so it reads as a real
// product screenshot rather than a floating card grid.
export function BrowserFrame({
  url,
  children,
  rtl = false,
}: {
  url: string;
  children: React.ReactNode;
  rtl?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-brand border-[4px] border-ink shadow-brand-xl">
      <div className="flex items-center gap-2 border-b-[3px] border-ink bg-white px-4 py-3" dir="ltr">
        <span className="h-3 w-3 rounded-full border-2 border-ink bg-accent" />
        <span className="h-3 w-3 rounded-full border-2 border-ink bg-teal" />
        <span className="h-3 w-3 rounded-full border-2 border-ink bg-ink/20" />
        <span className="ml-3 truncate rounded border-2 border-ink/20 bg-paper px-3 py-0.5 font-mono text-[11px] text-ink/50">
          {url}
        </span>
      </div>
      <div className="bg-paper p-5" dir={rtl ? "rtl" : "ltr"}>
        {children}
      </div>
    </div>
  );
}
