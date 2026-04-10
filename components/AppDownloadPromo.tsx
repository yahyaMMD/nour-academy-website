import { FaApple, FaGooglePlay } from "react-icons/fa";
import { FaMobileScreenButton, FaRocket } from "react-icons/fa6";
import { brand } from "@/lib/brand";

type AppDownloadPromoProps = {
  compact?: boolean;
  className?: string;
};

export default function AppDownloadPromo({ compact = false, className = "" }: AppDownloadPromoProps) {
  return (
    <section
      dir="rtl"
      className={`relative overflow-hidden rounded-[1.9rem] border border-[rgba(45,131,173,0.2)] bg-gradient-to-l from-[#eef8fc] via-white to-[#f9fbfc] p-6 shadow-[0_10px_40px_rgba(45,131,173,0.12)] ${compact ? "" : "md:p-8"} ${className}`}
    >
      <div className="pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full bg-[var(--brand-highlight)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-[var(--brand-primary)]/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(45,131,173,0.18)] bg-white/85 px-4 py-2 text-sm font-bold text-[var(--brand-primary)]">
            <FaMobileScreenButton className="h-4 w-4" />
            تطبيق منصة النور
          </div>

          <h3
            className={`font-[var(--font-brand-heading)] font-extrabold leading-[1.2] text-[var(--brand-ink)] ${compact ? "text-2xl" : "text-3xl md:text-4xl"}`}
          >
            تعلم من هاتفك في أي وقت
          </h3>

          <p className="mt-3 max-w-2xl text-[var(--brand-muted)] leading-8">
            تطبيقنا متوفر على Android و iOS. حمّله الآن لتبقى قريبًا من البرامج والتحديثات والتواصل السريع.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
              <FaRocket className="h-3 w-3" />
              إشعارات فورية
            </span>
            <span className="inline-flex rounded-full bg-[var(--brand-highlight-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-ink)]">
              دروس وتحديثات
            </span>
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--brand-muted)] ring-1 ring-black/5">
              Android + iOS
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[260px]">
          <a
            href={brand.androidAppHref}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--brand-primary)] px-6 py-4 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#236d90]"
          >
            <FaGooglePlay className="h-5 w-5 transition group-hover:scale-110" />
            <span className="text-right">
              <span className="block text-xs font-medium text-white/80">متجر Google Play</span>
              <span className="block">تحميل Android</span>
            </span>
          </a>

          <a
            href={brand.iosAppHref}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-[rgba(45,131,173,0.22)] bg-white px-6 py-4 font-bold text-[var(--brand-primary)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--brand-primary-soft)]"
          >
            <FaApple className="h-5 w-5 transition group-hover:scale-110" />
            <span className="text-right">
              <span className="block text-xs font-medium text-[var(--brand-muted)]">متجر App Store</span>
              <span className="block">تحميل iOS</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
