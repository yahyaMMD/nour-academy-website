import Link from "next/link";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTelegramPlane,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaApple, FaGooglePlay, FaTiktok } from "react-icons/fa6";
import { Container } from "./Container";
import { FadeIn } from "./FadeIn";
import BrandLogo from "./BrandLogo";
import { brand } from "@/lib/brand";

const footerLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "عن المنصة", href: "/about" },
  { name: "البرامج", href: "/#courses" },
  { name: "تواصل معنا", href: "/#contact" },
  { name: "الخصوصية", href: "/privacy" },
  { name: "الشروط", href: "/terms" },
  { name: "الكوكيز", href: "/cookies" },
];

const socialLinks = [
  { href: brand.whatsappHref, label: "واتساب", icon: FaWhatsapp },
  { href: brand.facebookHref, label: "فيسبوك", icon: FaFacebook },
  { href: brand.instagramHref, label: "إنستغرام", icon: FaInstagram },
  { href: brand.youtubeHref, label: "يوتيوب", icon: FaYoutube },
  { href: brand.tiktokHref, label: "تيك توك", icon: FaTiktok },
  { href: brand.telegramHref, label: "تيليجرام", icon: FaTelegramPlane },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-[var(--brand-ink)] text-white" dir="rtl">
      <Container>
        <FadeIn>
          <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <BrandLogo showText={false} className="mb-5" />
              <h3 className="mb-4 font-[var(--font-brand-heading)] text-2xl font-bold">{brand.nameAr}</h3>
              <p className="mb-5 text-sm leading-7 text-white/78">{brand.missionAr}</p>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/10 p-3 text-[var(--brand-highlight)] transition hover:bg-white/20"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-5 font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-highlight)]">
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                {footerLinks.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-white/78 transition hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-highlight)]">
                تواصل مباشر
              </h3>
              <div className="space-y-4 text-white/78">
                <a href={`mailto:${brand.email}`} className="flex items-center gap-3 transition hover:text-white">
                  <FaEnvelope className="text-[var(--brand-highlight)]" />
                  {brand.email}
                </a>
                <a href={`tel:${brand.phoneHref}`} className="flex items-center gap-3 transition hover:text-white">
                  <FaPhone className="text-[var(--brand-highlight)]" />
                  {brand.phoneDisplay}
                </a>
                <p className="leading-7">{brand.locationAr}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-5 font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-highlight)]">
                وعد النور
              </h3>
              <div className="space-y-3 text-sm text-white/78">
                <p>تعليم واضح يريح الطالب ويقربه من الفهم الحقيقي.</p>
                <p>متابعة تصنع الانضباط وتدعم التقدم المستمر.</p>
                <p>بيئة حديثة ومحترمة تمنح الطالب الثقة ليكمل طريقه بقوة.</p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--brand-highlight)]">حمّل تطبيق منصة النور</p>
                <p className="mt-1 text-sm text-white/80">متوفر على Android و iOS لمتابعة البرامج من هاتفك بسهولة.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={brand.androidAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-highlight)] px-5 py-2.5 font-bold text-[var(--brand-ink)] transition hover:brightness-95"
                >
                  <FaGooglePlay className="h-4 w-4" />
                  تحميل Android
                </a>
                <a
                  href={brand.iosAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2.5 font-bold text-white transition hover:bg-white/10"
                >
                  <FaApple className="h-4 w-4" />
                  تحميل iOS
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
            <p>
              © {currentYear} {brand.nameAr}. جميع الحقوق محفوظة.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/privacy" className="transition hover:text-white">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                الشروط والأحكام
              </Link>
              <Link href="/cookies" className="transition hover:text-white">
                سياسة الكوكيز
              </Link>
            </div>
          </div>
        </FadeIn>
      </Container>
    </footer>
  );
};

export default Footer;
