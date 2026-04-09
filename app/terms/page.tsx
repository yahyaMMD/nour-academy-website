import Link from "next/link";
import { Container } from "@/components/Container";
import { brand } from "@/lib/brand";

const sections = [
  {
    title: "استخدام المنصة",
    body: "يُسمح باستخدام المنصة لأغراض تعليمية وإدارية مشروعة فقط. أي استخدام مسيء أو محاولة للوصول غير المصرح به إلى لوحة الإدارة أو البيانات مرفوض.",
  },
  {
    title: "الحسابات",
    body: "المستخدم مسؤول عن صحة بياناته وعن الحفاظ على سرية بيانات الدخول الخاصة به. حساب الإدارة مخصص للإشراف فقط ولا يجب مشاركته مع الآخرين.",
  },
  {
    title: "الدورات والتسجيلات",
    body: "عرض الدورات، تفاصيلها، ورسومها يعتمد على البيانات الموجودة في قاعدة البيانات ويمكن تحديثها من لوحة الإدارة بحسب حاجة المؤسسة.",
  },
  {
    title: "المحتوى والهوية",
    body: "الشعار، الألوان، النصوص، والواجهة الخاصة بمدرسة النور جزء من الهوية البصرية للموقع ولا يجوز نسخها أو إعادة استخدامها دون إذن.",
  },
];

export default function TermsPage() {
  return (
    <div className="py-16" dir="rtl">
      <Container>
        <section className="rounded-[2rem] bg-[var(--brand-ink)] px-8 py-12 text-white">
          <h1 className="mb-4 font-[var(--font-brand-heading)] text-4xl font-extrabold">
            الشروط والأحكام
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-white/80">
            آخر تحديث: 9 أبريل 2026. باستخدامك منصة {brand.nameAr} فإنك توافق على القواعد الأساسية
            التالية المتعلقة بالحسابات والدورات ولوحة الإدارة.
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
          في حال وجود سؤال قانوني أو إداري، تواصل عبر{" "}
          <a className="font-bold" href={`mailto:${brand.email}`}>{brand.email}</a> أو ارجع إلى{" "}
          <Link href="/" className="font-bold underline">
            الصفحة الرئيسية
          </Link>
          .
        </div>
      </Container>
    </div>
  );
}
