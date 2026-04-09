import Link from "next/link";
import { FaEnvelope, FaFacebook, FaInstagram, FaPhone, FaWhatsapp } from "react-icons/fa";
import { Container } from "./Container";
import { FadeIn } from "./FadeIn";
import BrandLogo from "./BrandLogo";
import { brand } from "@/lib/brand";

const footerLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "عن المدرسة", href: "/about" },
  { name: "البرامج", href: "/#courses" },
  { name: "تواصل معنا", href: "/#contact" },
  { name: "الخصوصية", href: "/privacy" },
  { name: "الشروط", href: "/terms" },
  { name: "الكوكيز", href: "/cookies" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-[var(--brand-ink)] text-white">
      <Container>
        <FadeIn>
          <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <BrandLogo showText={false} className="mb-5" />
              <h3 className="mb-4 font-[var(--font-brand-heading)] text-2xl font-bold">
                {brand.nameAr}
              </h3>
              <p className="mb-5 text-sm leading-7 text-white/78">{brand.missionAr}</p>
              <div className="flex items-center gap-3">
                <a
                  href={brand.whatsappHref}
                  className="rounded-full bg-white/10 p-3 text-[var(--brand-highlight)] transition hover:bg-white/20"
                >
                  <FaWhatsapp className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-3 text-[var(--brand-highlight)] transition hover:bg-white/20"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-3 text-[var(--brand-highlight)] transition hover:bg-white/20"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
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

          <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
            <p>© {currentYear} {brand.nameAr}. جميع الحقوق محفوظة.</p>
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
