'use client'

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "./Container";

const cards = [
  {
    title: "تعلم مرن وواضح",
    text: "الطالب يعرف ماذا يدرس، ولماذا يدرسه، وكيف يتقدم فيه دون شعور بالتشتت أو الضياع.",
    color: "bg-[var(--brand-primary-soft)]",
  },
  {
    title: "صورة تبعث على الثقة",
    text: "اللغة البصرية الهادئة والحديثة تجعل الطالب يشعر أن المكان منظم ومحفز ويستحق أن ينتمي إليه.",
    color: "bg-[var(--brand-accent-soft)]",
  },
  {
    title: "رحلة قابلة للنمو",
    text: "سواء بدأ الطالب من الصفر أو كان يطمح إلى مستوى أعلى، فالتجربة قابلة للتوسع معه خطوة بعد خطوة.",
    color: "bg-[var(--brand-highlight-soft)]",
  },
];

const FeedbackSection = () => {
  return (
    <section id="feedback" className="py-20" dir="rtl">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">لماذا هذه التجربة مختلفة؟</p>
            <h2 className="mb-5 font-[var(--font-brand-heading)] text-3xl font-extrabold leading-[1.26] text-[var(--brand-ink)] md:text-5xl md:leading-[1.24]">
              منصة تجعل الطالب
              <span className="text-[var(--brand-accent)]"> يريد أن يتعلم </span>
              لا أن ينجز المطلوب فقط
            </h2>
            <p className="mb-8 text-lg leading-8 text-[var(--brand-muted)]">
              حين يشعر الطالب أن المكان يفهمه ويخاطبه بطريقة محترمة وقريبة، يتحول الحضور من واجب ثقيل إلى خطوة طبيعية نحو نتيجة أفضل. هذا بالضبط ما نعمل عليه في منصة النور.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="rounded-full bg-[var(--brand-primary)] px-7 py-3 font-bold text-white transition hover:bg-[#236d90]"
              >
                تعرّف أكثر علينا
              </Link>
              <Link
                href="/#courses"
                className="rounded-full border border-[var(--brand-primary)] px-7 py-3 font-bold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary-soft)]"
              >
                اختر برنامجك
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-[1.75rem] p-6 shadow-sm ring-1 ring-black/5 ${card.color}`}
              >
                <h3 className="mb-2 font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-ink)]">
                  {card.title}
                </h3>
                <p className="text-sm leading-7 text-[var(--brand-muted)]">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeedbackSection;
