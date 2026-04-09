'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { brand } from "@/lib/brand";

const values = [
  {
    title: "تعليم يصنع الأثر",
    text: "نؤمن أن الحصة الجيدة لا تنتهي بانتهاء الشرح، بل تستمر في شكل فهم أعمق وثقة أعلى ورغبة أكبر في التقدم.",
  },
  {
    title: "قرب من الطالب",
    text: "نخاطب الطالب بلغة واضحة ومحترمة، ونجعل التجربة التعليمية مريحة وقريبة من واقعه وطموحه.",
  },
  {
    title: "طموح يليق بالمستقبل",
    text: "لا نبحث عن نتائج سريعة فقط، بل عن بناء طالب أقوى، أكثر انضباطا، وأكثر استعدادا لما هو أكبر.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-8" dir="rtl">
      <section className="relative overflow-hidden px-4 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <FadeIn>
                <p className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">عن المدرسة</p>
                <h1 className="mb-5 font-[var(--font-brand-heading)] text-4xl font-extrabold leading-[1.3] text-[var(--brand-ink)] md:text-6xl">
                  {brand.nameAr}
                  <span className="brand-gradient-text"> ليست مجرد مكان للدراسة </span>
                  بل بيئة تدفع الطالب ليؤمن بقدرته على النجاح.
                </h1>
                <p className="mb-8 max-w-2xl text-lg leading-8 text-[var(--brand-muted)]">
                  {brand.missionAr}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/#courses"
                    className="rounded-full bg-[var(--brand-accent)] px-7 py-3 font-bold text-white transition hover:bg-[#ea2f2f]"
                  >
                    استعرض البرامج
                  </Link>
                  <Link
                    href="/#contact"
                    className="rounded-full border border-[var(--brand-primary)] px-7 py-3 font-bold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary-soft)]"
                  >
                    تحدث معنا
                  </Link>
                </div>
              </FadeIn>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65 }}
              className="brand-panel rounded-[2rem] p-8"
            >
              <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-[2rem] bg-white shadow-md ring-1 ring-[rgba(45,131,173,0.12)]">
                <Image src="/images/logo.png" alt={brand.nameAr} fill className="object-contain p-4" priority />
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.5rem] bg-[var(--brand-primary-soft)] p-5">
                  <p className="mb-2 text-sm font-semibold text-[var(--brand-primary)]">فلسفة المدرسة</p>
                  <p className="text-base leading-8 text-[var(--brand-ink)]">
                    نريد للطالب أن يدخل وهو متردد، ثم يخرج وهو أكثر فهما وهدوءا وثقة بما يستطيع تحقيقه.
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-[var(--brand-highlight-soft)] p-5">
                  <p className="mb-2 text-sm font-semibold text-[var(--brand-ink)]">شخصيتنا</p>
                  <p className="text-base leading-8 text-[var(--brand-ink)]">
                    جادة أكاديميا، قريبة إنسانيا، وعصرية في طريقة التقديم والتواصل مع الطالب والأسرة.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-[1.75rem] bg-white p-7 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]"
              >
                <h2 className="mb-3 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
                  {value.title}
                </h2>
                <p className="text-sm leading-7 text-[var(--brand-muted)]">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="rounded-[2rem] bg-[var(--brand-ink)] px-8 py-10 text-white">
            <h2 className="mb-4 font-[var(--font-brand-heading)] text-3xl font-extrabold">
              أين تظهر قوة هذه الهوية؟
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {["داخل الصف", "في التواصل", "في المواد التعليمية", "في التجربة الرقمية"].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-white/10 p-5">
                  <p className="font-bold text-[var(--brand-highlight)]">{item}</p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    نفس الروح الواضحة والمحترمة التي تجعل الطالب يشعر بالانتماء والثقة أينما تفاعل مع المدرسة.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
