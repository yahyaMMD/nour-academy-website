import Link from "next/link";
import { Container } from "@/components/Container";
import { brand } from "@/lib/brand";

const sections = [
  {
    title: "البيانات التي نجمعها",
    body: "نجمع البيانات التي يدخلها المستخدم عند إنشاء الحساب أو التسجيل في الدورات مثل الاسم، البريد الإلكتروني، الهاتف، الولاية، وبيانات التسجيل المرتبطة بالدورة.",
  },
  {
    title: "كيف نستخدم البيانات",
    body: "تُستخدم البيانات لتسيير الحسابات، إدارة طلبات التسجيل، وتحسين تجربة المنصة. لا نبيع البيانات لأي جهة خارجية.",
  },
  {
    title: "التخزين والحماية",
    body: "تُخزن التسجيلات والبيانات الأساسية داخل قاعدة البيانات المرتبطة بالتطبيق، مع استخدام صلاحيات إدارة منفصلة للوصول إلى لوحة التحكم.",
  },
  {
    title: "حقوق المستخدم",
    body: "يمكن للمستخدم طلب تعديل بياناته أو حذفها أو الاستفسار عن طريقة استخدامها عبر وسائل التواصل المدرجة في الموقع.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="py-16" dir="rtl">
      <Container>
        <section className="rounded-[2rem] bg-[var(--brand-ink)] px-8 py-12 text-white">
          <h1 className="mb-4 font-[var(--font-brand-heading)] text-4xl font-extrabold">
            سياسة الخصوصية
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-white/80">
            آخر تحديث: 9 أبريل 2026. تشرح هذه الصفحة كيف تتعامل {brand.nameAr} مع البيانات
            التي يُدخلها المستخدمون أثناء استخدام المنصة.
          </p>
        </section>

        <section className="mt-8 grid gap-5">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[1.75rem] bg-white p-7 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]">
              <h2 className="mb-3 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
                {section.title}
              </h2>
              <p className="text-base leading-8 text-[var(--brand-muted)]">{section.body}</p>
            </article>
          ))}
        </section>

        <div className="mt-8 rounded-[1.75rem] bg-[var(--brand-primary-soft)] p-6 text-[var(--brand-ink)]">
          للاستفسار، راسلنا عبر <a className="font-bold" href={`mailto:${brand.email}`}>{brand.email}</a> أو عد إلى{" "}
          <Link href="/" className="font-bold underline">
            الصفحة الرئيسية
          </Link>
          .
        </div>
      </Container>
    </div>
  );
}
