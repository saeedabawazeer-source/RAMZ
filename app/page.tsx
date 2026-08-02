import { generateQrDataUrl } from "@/lib/qr";

// Public marketing page — this is what a merchant sees if they land here from
// outside the Salla App Store (shared link, search, etc). The actual app UI
// lives at /embed, loaded inside the Salla dashboard iframe.

const SALLA_INSTALL_URL = "https://apps.salla.sa/en"; // TODO: swap for the real listing URL once Ramz is published

const DEMO_PRODUCTS = [
  { name: "Wireless Earbuds — Black", url: "https://demo-store.salla.sa/products/earbuds-black" },
  { name: "Online Course: Arabic Calligraphy", url: "https://demo-store.salla.sa/products/calligraphy-course" },
  { name: "50 SAR Gift Card", url: "https://demo-store.salla.sa/products/gift-card-50" },
];

export default async function Home() {
  const demoQrs = await Promise.all(DEMO_PRODUCTS.map((p) => generateQrDataUrl(p.url)));

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b-[3px] border-ink">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-teal">RAMZ</span>
          <a
            href={SALLA_INSTALL_URL}
            className="rounded-brand border-[3px] border-ink bg-accent px-4 py-2 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brand-hover"
          >
            Install on Salla
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1100px] px-6 py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <div>
            <h1 className="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Every product, one scan away.
            </h1>
            <p className="mb-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              Ramz gives every product in your Salla store — physical or digital — a scannable QR
              code, generated automatically and kept in sync with your live catalog. No exporting,
              no third-party tools.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={SALLA_INSTALL_URL}
                className="rounded-brand border-[3px] border-ink bg-accent px-5 py-3 text-sm font-semibold text-white shadow-brand-lg transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brand-xl"
              >
                Install on Salla
              </a>
              <a
                href="#how-it-works"
                className="rounded-brand border-[3px] border-ink bg-white px-5 py-3 text-sm font-semibold text-ink shadow-brand-lg transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brand-xl"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Hero visual: one product card, matching the real dashboard */}
          <div className="rounded-brand border-[4px] border-ink bg-white p-5 shadow-brand-accent">
            <div className="mb-1 text-sm font-semibold">{DEMO_PRODUCTS[0].name}</div>
            <div className="mb-3 truncate font-mono text-xs text-teal underline">{DEMO_PRODUCTS[0].url}</div>
            <img src={demoQrs[0]} alt="Example QR code" className="mb-3 h-40 w-40 rounded border-2 border-ink" />
            <span className="rounded bg-teal/10 px-2 py-1 font-mono text-[11px] text-teal-dark">
              128 scans
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-8 text-center font-display text-2xl font-bold">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Install Ramz", body: "One click from the Salla App Store. No setup screens, no configuration." },
              { step: "2", title: "Add or edit a product", body: "Anything you do in Salla — Ramz is just watching your catalog in the background." },
              { step: "3", title: "Get a QR, automatically", body: "It shows up in your Ramz dashboard, ready to print, download, or scan." },
            ].map((s) => (
              <div key={s.step} className="rounded-brand border-[3px] border-ink bg-paper p-5 shadow-brand">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink bg-accent font-mono text-sm font-bold text-white">
                  {s.step}
                </div>
                <div className="mb-1 font-semibold">{s.title}</div>
                <p className="text-sm text-ink/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <h2 className="mb-2 text-center font-display text-2xl font-bold">What you'll see</h2>
        <p className="mx-auto mb-8 max-w-[520px] text-center text-sm text-ink/60">
          One screen in your Salla dashboard. Every product, its QR code, and how many times it's
          been scanned.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {DEMO_PRODUCTS.map((p, i) => (
            <div key={p.name} className="rounded-brand border-[3px] border-ink bg-white p-4 shadow-brand">
              <div className="mb-1 text-sm font-semibold">{p.name}</div>
              <div className="mb-3 truncate font-mono text-xs text-teal underline">{p.url}</div>
              <img src={demoQrs[i]} alt={`QR code for ${p.name}`} className="mb-2 h-28 w-28 rounded border-2 border-ink" />
              <span className="rounded bg-teal/10 px-2 py-1 font-mono text-[11px] text-teal-dark">
                {[128, 43, 261][i]} scans
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-8 text-center font-display text-2xl font-bold">What's included</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Auto-generation", body: "Every product gets a QR the moment it's created or edited. Nothing to trigger manually." },
              { title: "Bulk export", body: "Download every code as a zip — ready for a flyer or packaging print run." },
              { title: "Scan tracking", body: "See how many times each code has actually been scanned." },
              { title: "Branded styling", body: "Premium plan: QR codes rendered in your brand color instead of plain black.", badge: "Premium" },
            ].map((f) => (
              <div key={f.title} className="rounded-brand border-[3px] border-ink bg-paper p-5 shadow-brand">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-semibold">{f.title}</span>
                  {f.badge && (
                    <span className="rounded-full border-2 border-ink bg-accent px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink/70">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">Pricing</h2>
        <div className="mx-auto grid max-w-[720px] gap-6 sm:grid-cols-2">
          <div className="rounded-brand border-[3px] border-ink bg-white p-6 shadow-brand-lg">
            <div className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">Base</div>
            <div className="mb-4 font-display text-3xl font-bold">15–25 <span className="text-base font-normal text-ink/60">SAR/month</span></div>
            <ul className="space-y-2 text-sm text-ink/70">
              <li>Auto-generation for every product</li>
              <li>Bulk export</li>
              <li>Scan tracking</li>
            </ul>
          </div>
          <div className="rounded-brand border-[4px] border-ink bg-white p-6 shadow-brand-accent">
            <div className="mb-1 font-mono text-xs uppercase tracking-wide text-accent-dark">Premium</div>
            <div className="mb-4 font-display text-3xl font-bold">30–40 <span className="text-base font-normal text-ink/60">SAR/month</span></div>
            <ul className="space-y-2 text-sm text-ink/70">
              <li>Everything in Base</li>
              <li>Branded (color-styled) QR codes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-ink">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-sm font-semibold text-teal">RAMZ</span>
          <p className="font-mono text-xs text-ink/50">
            Billed and managed through Salla. Not affiliated with or endorsed by Salla.
          </p>
        </div>
      </footer>
    </div>
  );
}
