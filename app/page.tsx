import { Smartphone, Package, Megaphone, Zap, Download, BarChart3, Palette } from "lucide-react";
import { generateQrDataUrl } from "@/lib/qr";
import { Logo } from "@/components/brand/Logo";
import { Stamp } from "@/components/ui/Stamp";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { QrMotif } from "@/components/brand/QrMotif";

// Public marketing page — this is what a merchant sees if they land here from
// outside the Salla App Store (shared link, search, etc). The actual app UI
// lives at /embed, loaded inside the Salla dashboard iframe.

const SALLA_INSTALL_URL = "https://apps.salla.sa/en"; // TODO: swap for the real listing URL once Ramz is published

const DEMO_PRODUCTS = [
  { name: "Wireless Earbuds — Black", url: "https://demo-store.salla.sa/products/earbuds-black", scans: 128 },
  { name: "Online Course: Arabic Calligraphy", url: "https://demo-store.salla.sa/products/calligraphy-course", scans: 43 },
  { name: "50 SAR Gift Card", url: "https://demo-store.salla.sa/products/gift-card-50", scans: 261 },
];

const USE_CASES = [
  {
    icon: Smartphone,
    title: "Digital products",
    body: "E-books, course access, gift cards — give them a scannable code they don't have by default, so you can sell them in person or bridge a physical checkout.",
  },
  {
    icon: Package,
    title: "Physical products",
    body: "A code for flyers, packaging, posters, or in-store displays that scans straight to the product page instead of a typed-out URL.",
  },
  {
    icon: Megaphone,
    title: "Marketing moments",
    body: "Instagram and TikTok “scan to buy” overlays, market or event flyers, packaging that links to reviews or related items.",
  },
];

const FEATURES = [
  { icon: Zap, title: "Auto-generation", body: "Every product gets a QR the moment it's created or edited. Nothing to trigger manually." },
  { icon: Download, title: "Bulk export", body: "Download every code as a zip — ready for a flyer or packaging print run." },
  { icon: BarChart3, title: "Scan tracking", body: "See how many times each code has actually been scanned." },
  { icon: Palette, title: "Branded styling", body: "QR codes rendered in your brand color instead of plain black.", badge: "Premium" },
];

export default async function Home() {
  const demoQrs = await Promise.all(DEMO_PRODUCTS.map((p) => generateQrDataUrl(p.url)));

  return (
    <div className="min-h-screen overflow-x-clip">
      {/* Nav */}
      <header className="border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-4">
            <a href="/ar" className="font-mono text-xs text-ink/50 underline hover:text-ink">
              العربية
            </a>
            <a
              href={SALLA_INSTALL_URL}
              className="rounded-brand border-[3px] border-ink bg-accent px-4 py-2 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brand-hover"
            >
              Install on Salla
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-[1100px] px-6 py-16 sm:py-20">
        <QrMotif className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-teal/10 sm:h-56 sm:w-56" />
        <div className="relative grid gap-10 sm:grid-cols-2 sm:items-center">
          <div>
            <Stamp className="mb-5">Salla app</Stamp>
            <h1 className="mb-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
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
          <div className="rotate-1 rounded-brand border-[4px] border-ink bg-white p-5 shadow-brand-accent">
            <div className="mb-1 text-sm font-semibold">{DEMO_PRODUCTS[0].name}</div>
            <div className="mb-3 truncate font-mono text-xs text-teal underline">{DEMO_PRODUCTS[0].url}</div>
            <img src={demoQrs[0]} alt="Example QR code" className="mb-3 h-40 w-40 rounded border-2 border-ink" />
            <span className="rounded bg-teal/10 px-2 py-1 font-mono text-[11px] text-teal-dark">
              {DEMO_PRODUCTS[0].scans} scans
            </span>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-2 text-center font-display text-2xl font-bold">Where this is useful</h2>
          <p className="mx-auto mb-8 max-w-[520px] text-center text-sm text-ink/60">
            Ramz isn&rsquo;t just for one kind of product or one kind of merchant.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {USE_CASES.map((u) => (
              <div key={u.title} className="rounded-brand border-[3px] border-ink bg-paper p-5 shadow-brand">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-brand border-[3px] border-ink bg-white text-teal">
                  <u.icon size={20} aria-hidden="true" />
                </div>
                <div className="mb-1 font-semibold">{u.title}</div>
                <p className="text-sm text-ink/70">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-[1100px] px-6 py-14">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: "1", title: "Install Ramz", body: "One click from the Salla App Store. No setup screens, no configuration." },
            { step: "2", title: "Add or edit a product", body: "Anything you do in Salla — Ramz is just watching your catalog in the background." },
            { step: "3", title: "Get a QR, automatically", body: "It shows up in your Ramz dashboard, ready to print, download, or scan." },
          ].map((s) => (
            <div key={s.step} className="rounded-brand border-[3px] border-ink bg-white p-5 shadow-brand">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink bg-accent font-mono text-sm font-bold text-white">
                {s.step}
              </div>
              <div className="mb-1 font-semibold">{s.title}</div>
              <p className="text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-2 text-center font-display text-2xl font-bold">What you&rsquo;ll see</h2>
          <p className="mx-auto mb-8 max-w-[520px] text-center text-sm text-ink/60">
            One screen in your Salla dashboard. Every product, its QR code, and how many times it&rsquo;s
            been scanned.
          </p>
          <BrowserFrame url="yourstore.salla.sa/admin/apps/ramz">
            <div className="grid gap-4 sm:grid-cols-3">
              {DEMO_PRODUCTS.map((p, i) => (
                <div key={p.name} className="rounded-brand border-[3px] border-ink bg-white p-4 shadow-brand">
                  <div className="mb-1 text-sm font-semibold">{p.name}</div>
                  <div className="mb-3 truncate font-mono text-xs text-teal underline">{p.url}</div>
                  <img src={demoQrs[i]} alt={`QR code for ${p.name}`} className="mb-2 h-28 w-28 rounded border-2 border-ink" />
                  <span className="rounded bg-teal/10 px-2 py-1 font-mono text-[11px] text-teal-dark">
                    {p.scans} scans
                  </span>
                </div>
              ))}
            </div>
          </BrowserFrame>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">What&rsquo;s included</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-brand border-[3px] border-ink bg-white p-5 shadow-brand">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-brand border-[3px] border-ink bg-paper text-accent-dark">
                <f.icon size={20} aria-hidden="true" />
              </div>
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
      </section>

      {/* Pricing */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-8 text-center font-display text-2xl font-bold">Pricing</h2>
          <div className="mx-auto grid max-w-[720px] gap-6 sm:grid-cols-2">
            <div className="rounded-brand border-[3px] border-ink bg-paper p-6 shadow-brand-lg">
              <div className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">Base</div>
              <div className="mb-4 font-display text-3xl font-bold">15–25 <span className="text-base font-normal text-ink/60">SAR/month</span></div>
              <ul className="space-y-2 text-sm text-ink/70">
                <li>Auto-generation for every product</li>
                <li>Bulk export</li>
                <li>Scan tracking</li>
              </ul>
            </div>
            <div className="rounded-brand border-[4px] border-ink bg-paper p-6 shadow-brand-accent">
              <div className="mb-1 font-mono text-xs uppercase tracking-wide text-accent-dark">Premium</div>
              <div className="mb-4 font-display text-3xl font-bold">30–40 <span className="text-base font-normal text-ink/60">SAR/month</span></div>
              <ul className="space-y-2 text-sm text-ink/70">
                <li>Everything in Base</li>
                <li>Branded (color-styled) QR codes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-accent px-6 py-14 text-white">
        <QrMotif className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 text-white/10" />
        <div className="relative mx-auto max-w-[1100px] text-center">
          <h2 className="mb-3 font-display text-2xl font-bold sm:text-3xl">
            Make every product scannable.
          </h2>
          <p className="mx-auto mb-6 max-w-[440px] text-sm text-white/80">
            Install Ramz from the Salla App Store and it starts working the next time you touch your
            catalog.
          </p>
          <a
            href={SALLA_INSTALL_URL}
            className="inline-block rounded-brand border-[3px] border-ink bg-white px-6 py-3 text-sm font-semibold text-ink shadow-brand-lg transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brand-xl"
          >
            Install on Salla
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <Logo />
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <a href="/ar" className="font-mono text-xs text-ink/50 underline hover:text-ink">
              العربية
            </a>
            <p className="font-mono text-xs text-ink/50">
              Billed and managed through Salla. Not affiliated with or endorsed by Salla.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
