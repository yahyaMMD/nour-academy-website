import { motion } from "framer-motion";
import { FaEnvelope, FaLocationDot, FaPhone, FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";
import { brand } from "@/lib/brand";

const actions = [
  {
    title: "راسلنا بالبريد",
    value: brand.email,
    href: `mailto:${brand.email}`,
    icon: <FaEnvelope className="text-[var(--brand-primary)]" />,
  },
  {
    title: "اتصل بنا",
    value: brand.phoneDisplay,
    href: `tel:${brand.phoneHref}`,
    icon: <FaPhone className="text-[var(--brand-accent)]" />,
  },
  {
    title: "واتساب",
    value: "تواصل سريع ومباشر",
    href: brand.whatsappHref,
    icon: <FaWhatsapp className="text-[#25D366]" />,
  },
];

const Contact = () => {
  return (
    <section id="contact" className="relative py-24" dir="rtl">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-10 top-20 h-60 w-60 rounded-full bg-[var(--brand-primary)]/10 blur-3xl"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        />
        <motion.div
          className="absolute bottom-12 right-12 h-72 w-72 rounded-full bg-[var(--brand-highlight)]/20 blur-3xl"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          viewport={{ once: true }}
        />
      </div>

      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">تواصل معنا</p>
          <h2 className="mb-5 font-[var(--font-brand-heading)] text-3xl font-extrabold leading-[1.26] text-[var(--brand-ink)] md:text-5xl md:leading-[1.24]">
            خذ الخطوة الأولى نحو
            <span className="text-[var(--brand-accent)]"> مستوى أفضل</span>
          </h2>
          <p className="mb-8 text-lg leading-8 text-[var(--brand-muted)]">
            إذا كنت تبحث عن مكان يساعدك على الفهم، وينظم طريقك، ويمنحك دفعة حقيقية نحو التفوق، فنحن هنا لنبدأ معك من النقطة المناسبة.
          </p>

          <div className="space-y-4">
            {actions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="flex items-center justify-between rounded-[1.5rem] bg-white px-5 py-4 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-slate-50 p-3">{action.icon}</div>
                  <div>
                    <p className="text-sm text-[var(--brand-muted)]">{action.title}</p>
                    <p className="font-semibold text-[var(--brand-ink)]">{action.value}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[var(--brand-primary)]">فتح</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="brand-panel rounded-[2rem] p-8"
        >
          <div className="mb-6 inline-flex items-center rounded-full bg-[var(--brand-highlight-soft)] px-4 py-2 text-sm font-bold text-[var(--brand-ink)]">
            بداية جديدة للتعلّم
          </div>
          <h3 className="mb-4 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
            نحن لا نعدك بدروس فقط، بل بتجربة تساعدك على التقدم فعلًا
          </h3>
          <p className="mb-8 text-base leading-8 text-[var(--brand-muted)]">
            سواء كنت طالبًا يريد تحسين مستواه أو ولي أمر يبحث عن بيئة موثوقة ومحفزة، ستجد في منصة النور وضوحًا في التواصل وجدية في المتابعة وطموحًا في النتائج.
          </p>

          <div className="space-y-5">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]">
              <div className="mb-2 flex items-center gap-3">
                <FaLocationDot className="text-[var(--brand-accent)]" />
                <p className="font-semibold text-[var(--brand-ink)]">الموقع</p>
              </div>
              <p className="text-[var(--brand-muted)]">{brand.locationAr}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--brand-ink)] p-6 text-white shadow-sm">
              <p className="mb-3 text-sm font-semibold text-[var(--brand-highlight)]">خطوة سريعة</p>
              <p className="text-base leading-8 text-white/85">
                تصفح البرامج، اختر ما يناسبك، ثم تواصل معنا لنساعدك على بدء المسار الأقرب إلى هدفك الدراسي.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/#courses"
              className="rounded-full bg-[var(--brand-accent)] px-6 py-3 font-bold text-white transition hover:bg-[#ea2f2f]"
            >
              شاهد البرامج
            </Link>
            <Link
              href={brand.whatsappHref}
              className="rounded-full border border-[var(--brand-primary)] px-6 py-3 font-bold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary-soft)]"
            >
              تحدث معنا الآن
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
