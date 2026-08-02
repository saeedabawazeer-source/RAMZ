import { Smartphone, Package, Megaphone, Zap, Download, BarChart3, Palette } from "lucide-react";
import { generateQrDataUrl, generateBrandedQrDataUrl } from "@/lib/qr";
import { Logo } from "@/components/brand/Logo";
import { Stamp } from "@/components/ui/Stamp";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { QrMotif } from "@/components/brand/QrMotif";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { FlyerMock } from "@/components/ui/FlyerMock";
import { BrickSignature } from "@/components/brand/BrickSignature";

// Arabic mirror of app/page.tsx. Next.js's App Router only lets the root
// layout set <html>/<body>, so this page can't change the document-level
// lang/dir itself — it sets dir="rtl" + lang="ar" on its own wrapping div
// instead, which is enough for correct RTL rendering and font selection.
// (Noted limitation: a screen reader inspecting the raw <html> tag would
// still see lang="en" — fine for a single secondary-locale page, but worth
// moving to a proper /en, /ar route split with next-intl if this app grows
// more languages.)

const SALLA_INSTALL_URL = "https://apps.salla.sa/en"; // TODO: swap for the real listing URL once Ramz is published

const DEMO_PRODUCTS = [
  { name: "سماعات لاسلكية — أسود", url: "https://demo-store.salla.sa/products/earbuds-black", scans: 128 },
  { name: "دورة: الخط العربي", url: "https://demo-store.salla.sa/products/calligraphy-course", scans: 43 },
  { name: "بطاقة هدايا 50 ريال", url: "https://demo-store.salla.sa/products/gift-card-50", scans: 261 },
];

const USE_CASES = [
  {
    icon: Smartphone,
    title: "المنتجات الرقمية",
    body: "كتب إلكترونية، دورات، بطاقات هدايا — امنحها كودًا قابلاً للمسح لا تملكه افتراضيًا، لتبيعها حضوريًا أو تربطها بنقطة بيع مادية.",
  },
  {
    icon: Package,
    title: "المنتجات المادية",
    body: "كود لكل ملصق، عبوة، بوستر، أو عرض داخل المتجر يوصل مباشرة لصفحة المنتج — بدون كتابة روابط.",
  },
  {
    icon: Megaphone,
    title: "لحظات تسويقية",
    body: "ملصقات «امسح لتشتري» على إنستغرام وتيك توك، فعاليات وأسواق، وعبوات تربط بالتقييمات أو منتجات ذات صلة.",
  },
];

const FEATURES = [
  { icon: Zap, title: "توليد تلقائي", body: "كل منتج يحصل على كود QR فور إنشائه أو تعديله. لا شيء يتطلب تفعيلًا يدويًا." },
  { icon: Download, title: "تصدير جماعي", body: "حمّل جميع الأكواد كملف مضغوط واحد — جاهز لطباعة الملصقات أو العبوات." },
  { icon: BarChart3, title: "تتبع المسح", body: "شاهد كم مرة تم مسح كل كود فعليًا." },
  { icon: Palette, title: "تصميم بألوانك", body: "أكواد QR بألوان علامتك التجارية بدلاً من الأسود العادي.", badge: "بريميوم" },
];

export default async function ArabicHome() {
  const demoQrs = await Promise.all(DEMO_PRODUCTS.map((p) => generateQrDataUrl(p.url)));
  const brandedQr = await generateBrandedQrDataUrl(DEMO_PRODUCTS[0].url);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen overflow-x-clip font-arabic">
      {/* Nav */}
      <header className="border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-4">
            <a href="/" className="font-mono text-xs text-ink/50 underline hover:text-ink">
              English
            </a>
            <a
              href={SALLA_INSTALL_URL}
              className="rounded-brand border-[3px] border-ink bg-accent px-4 py-2 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-brand-hover"
            >
              ثبّت على سلة
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-[1100px] px-6 py-16 sm:py-20">
        <QrMotif className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 text-teal/10 sm:h-56 sm:w-56" />
        <div className="relative grid gap-10 sm:grid-cols-2 sm:items-center">
          <div>
            <Stamp className="mb-5">بدون إعداد</Stamp>
            <h1 className="mb-4 font-display text-4xl font-bold leading-[1.15] sm:text-5xl">
              كل منتج، على بعد مسحة واحدة.
            </h1>
            <p className="mb-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              رمز يمنح كل منتج في متجرك — رقميًا كان أو ماديًا — كود QR قابل للمسح،
              يتولّد تلقائيًا ويبقى متزامنًا مع كتالوجك الحي. بدون تصدير، بدون أدوات خارجية.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={SALLA_INSTALL_URL}
                className="rounded-brand border-[3px] border-ink bg-accent px-5 py-3 text-sm font-semibold text-white shadow-brand-lg transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-brand-xl"
              >
                ثبّت على سلة
              </a>
              <a
                href="#how-it-works"
                className="rounded-brand border-[3px] border-ink bg-white px-5 py-3 text-sm font-semibold text-ink shadow-brand-lg transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-brand-xl"
              >
                شاهد كيف يعمل
              </a>
            </div>
          </div>

          <div className="-rotate-1 rounded-brand border-[4px] border-ink bg-white p-5 shadow-brand-accent">
            <div className="mb-3 text-sm font-semibold">{DEMO_PRODUCTS[0].name}</div>
            <img src={demoQrs[0]} alt="مثال على كود QR" className="mb-3 h-40 w-40 rounded border-2 border-ink" />
            <span className="rounded bg-teal/10 px-2 py-1 font-mono text-[11px] text-teal-dark" dir="ltr">
              {DEMO_PRODUCTS[0].scans} scans
            </span>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-2 text-center font-display text-2xl font-bold">أين يفيدك رمز</h2>
          <p className="mx-auto mb-8 max-w-[520px] text-center text-sm text-ink/60">
            رمز ليس مخصصًا لنوع واحد فقط من المنتجات أو التجار.
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
        <h2 className="mb-8 text-center font-display text-2xl font-bold">كيف يعمل</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: "١", title: "ثبّت رمز", body: "بضغطة واحدة من متجر تطبيقات متجرك. بدون شاشات إعداد، بدون تهيئة." },
            { step: "٢", title: "أضف أو عدّل منتجًا", body: "أي شيء تفعله في لوحة تحكم متجرك — رمز يراقب كتالوجك في الخلفية." },
            { step: "٣", title: "احصل على كود QR تلقائيًا", body: "يظهر في لوحة رمز، جاهز للطباعة أو التحميل أو المسح." },
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
          <h2 className="mb-2 text-center font-display text-2xl font-bold">ما الذي ستراه</h2>
          <p className="mx-auto mb-8 max-w-[520px] text-center text-sm text-ink/60">
            شاشة واحدة في لوحة تحكم متجرك. كل منتج، كود QR الخاص به، وعدد مرات مسحه.
          </p>
          <BrowserFrame url="yourstore.com/admin/apps/ramz" rtl>
            <div className="grid gap-4 sm:grid-cols-3">
              {DEMO_PRODUCTS.map((p, i) => (
                <div key={p.name} className="rounded-brand border-[3px] border-ink bg-white p-4 shadow-brand">
                  <div className="mb-3 text-sm font-semibold">{p.name}</div>
                  <img src={demoQrs[i]} alt={`كود QR لـ ${p.name}`} className="mb-2 h-28 w-28 rounded border-2 border-ink" />
                  <span className="rounded bg-teal/10 px-2 py-1 font-mono text-[11px] text-teal-dark" dir="ltr">
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
        <h2 className="mb-8 text-center font-display text-2xl font-bold">المزايا</h2>
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
              {f.title === "تصميم بألوانك" && (
                <div className="mt-3 flex items-center gap-2 border-t border-ink/10 pt-3" dir="ltr">
                  <img src={demoQrs[0]} alt="كود الباقة الأساسية" className="h-9 w-9 rounded border-2 border-ink" />
                  <span className="text-ink/30" aria-hidden="true">→</span>
                  <img src={brandedQr} alt="كود بريميوم بألوان العلامة" className="h-9 w-9 rounded border-2 border-ink" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* See it in action */}
      <section className="border-y-[3px] border-ink bg-paper">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-2 text-center font-display text-2xl font-bold">شاهده على أرض الواقع</h2>
          <p className="mx-auto mb-10 max-w-[440px] text-center text-sm text-ink/60">
            ليس مجرد صورة مسطحة في لوحة تحكم — هذا شكل الكود فعليًا في العالم الحقيقي.
          </p>
          <div className="mx-auto grid max-w-[420px] gap-10 sm:grid-cols-2">
            <div className="text-center">
              <PhoneFrame qrDataUrl={demoQrs[0]} label="مسح عبر الجوال" />
              <p className="mt-4 text-sm font-semibold">مسح عبر الجوال</p>
              <p className="text-xs text-ink/60">وجّه الكاميرا نحوه، وستصل مباشرة لصفحة المنتج.</p>
            </div>
            <div className="text-center">
              <FlyerMock qrDataUrl={demoQrs[0]} scanLabel="امسح لتشتري" />
              <p className="mt-4 text-sm font-semibold">على ملصق أو بوستر</p>
              <p className="text-xs text-ink/60">اطبعه على عبوة، بوستر، أو بطاقة عمل.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-14">
          <h2 className="mb-8 text-center font-display text-2xl font-bold">الأسعار</h2>
          <div className="mx-auto grid max-w-[720px] gap-6 sm:grid-cols-2">
            <div className="rounded-brand border-[3px] border-ink bg-paper p-6 shadow-brand-lg">
              <div className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">أساسي</div>
              <div className="mb-4 font-display text-3xl font-bold">١٥–٢٥ <span className="text-base font-normal text-ink/60">ريال / شهريًا</span></div>
              <ul className="space-y-2 text-sm text-ink/70">
                <li>توليد تلقائي لكل منتج</li>
                <li>تصدير جماعي</li>
                <li>تتبع المسح</li>
              </ul>
            </div>
            <div className="rounded-brand border-[4px] border-ink bg-paper p-6 shadow-brand-accent">
              <div className="mb-1 font-mono text-xs uppercase tracking-wide text-accent-dark">بريميوم</div>
              <div className="mb-4 font-display text-3xl font-bold">٣٠–٤٠ <span className="text-base font-normal text-ink/60">ريال / شهريًا</span></div>
              <ul className="space-y-2 text-sm text-ink/70">
                <li>كل ما في الباقة الأساسية</li>
                <li>أكواد QR بألوان علامتك</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-accent px-6 py-14 text-white">
        <QrMotif className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 text-white/10" />
        <div className="relative mx-auto max-w-[1100px] text-center">
          <h2 className="mb-3 font-display text-2xl font-bold sm:text-3xl">
            اجعل كل منتج قابلاً للمسح.
          </h2>
          <p className="mx-auto mb-6 max-w-[440px] text-sm text-white/80">
            ثبّت رمز، وسيبدأ العمل من أول مرة تلمس فيها كتالوجك.
          </p>
          <a
            href={SALLA_INSTALL_URL}
            className="inline-block rounded-brand border-[3px] border-ink bg-white px-6 py-3 text-sm font-semibold text-ink shadow-brand-lg transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-brand-xl"
          >
            ثبّت على سلة
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <a href="/" className="font-mono text-xs text-ink/50 underline hover:text-ink">
              English
            </a>
            <p className="font-mono text-xs text-ink/50">
              تتم إدارة الفوترة عبر سلة. غير تابع لسلة أو معتمد منها.
            </p>
          </div>
          <BrickSignature />
        </div>
      </footer>
    </div>
  );
}
