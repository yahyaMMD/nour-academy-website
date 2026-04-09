import Link from "next/link";
import { Container } from "@/components/Container";
import { brand } from "@/lib/brand";

const items = [
  {
    title: "كوكيز أساسية",
    body: "تُستخدم لحفظ الجلسات، تسجيل الدخول، واستقرار التجربة الأساسية داخل المنصة.",
  },
  {
    title: "كوكيز وظيفية",
    body: "قد تُستخدم لتحسين الواجهة، تذكر بعض الإعدادات، أو دعم التصفح داخل الدورات ولوحة الإدارة.",
  },
  {
    title: "إدارة التفضيلات",
    body: "يمكنك التحكم في ملفات الكوكيز من خلال إعدادات المتصفح. تعطيلها قد يؤثر على بعض وظائف الموقع.",
  },
];

export default function CookiesPage() {
  return (
    <div className="py-16" dir="rtl">
      <Container>
        <section className="rounded-[2rem] bg-[var(--brand-ink)] px-8 py-12 text-white">
          <h1 className="mb-4 font-[var(--font-brand-heading)] text-4xl font-extrabold">
            سياسة الكوكيز
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-white/80">
            آخر تحديث: 9 أبريل 2026. تشرح هذه الصفحة كيف تستخدم {brand.nameAr} ملفات الكوكيز
            لدعم جلسات المستخدمين وتحسين تجربة التصفح.
          </p>
        </section>

        <section className="mt-8 grid gap-5">
          {items.map((item) => (
            <article key={item.title} className="rounded-[1.75rem] bg-white p-7 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]">
              <h2 className="mb-3 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
                {item.title}
              </h2>
              <p className="text-base leading-8 text-[var(--brand-muted)]">{item.body}</p>
            </article>
          ))}
        </section>

        <div className="mt-8 rounded-[1.75rem] bg-[var(--brand-primary-soft)] p-6 text-[var(--brand-ink)]">
          للمزيد من المعلومات، اطلع على{" "}
          <Link href="/privacy" className="font-bold underline">
            سياسة الخصوصية
          </Link>{" "}
          أو تواصل معنا على{" "}
          <a className="font-bold" href={`mailto:${brand.email}`}>{brand.email}</a>.
        </div>
      </Container>
    </div>
  );
}
