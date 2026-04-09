import React, { ReactNode } from "react";
import { Accordion, AccordionBody, AccordionHeader } from "@material-tailwind/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Tag } from "./tag";

type AccordionItem = {
  id: number;
  header: string;
  body: ReactNode;
};

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform text-[var(--brand-primary)]`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

const accordionData: AccordionItem[] = [
  {
    id: 1,
    header: "ما الذي يجعل مدرسة النور مختلفة؟",
    body: "لأنها لا تكتفي بعرض الدروس، بل تبني تجربة كاملة يشعر فيها الطالب بالوضوح، الحافز، والمتابعة التي تدفعه للتقدم بثقة.",
  },
  {
    id: 2,
    header: "هل البرامج مناسبة للطلاب الذين يحتاجون إلى تقوية؟",
    body: "نعم. البرامج مصممة لتخدم الطالب الذي يريد تحسين مستواه، تثبيت أساسه، أو استعادة ثقته بنفسه خطوة بعد خطوة.",
  },
  {
    id: 3,
    header: "هل المدرسة مناسبة فقط للمتفوقين؟",
    body: "أبدا. المدرسة مناسبة لكل طالب يريد أن يتقدم، سواء كان يبحث عن دعم إضافي، تنظيم أفضل، أو مستوى أعلى من الإنجاز.",
  },
  {
    id: 4,
    header: "كيف أختار البرنامج المناسب؟",
    body: "يمكنك تصفح البرامج المعروضة، ثم التواصل معنا لنوجهك إلى المسار الأنسب حسب المرحلة والمستوى والهدف الدراسي.",
  },
  {
    id: 5,
    header: "كيف أبدأ؟",
    body: "الأمر بسيط: اختر البرنامج الذي لفت انتباهك، اطلع على تفاصيله، ثم تواصل معنا أو أكمل التسجيل لتبدأ رحلتك بثقة.",
  },
];

export function FAQSection() {
  const [open, setOpen] = React.useState<number>(0);

  return (
    <section className="py-20" dir="rtl">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 flex justify-center">
            <Tag className="bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">FAQ</Tag>
          </div>
          <h2 className="mb-5 font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)] md:text-5xl">
            أسئلة <span className="text-[var(--brand-accent)]">تدور في بالك</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--brand-muted)]">
            جمعنا أهم الأسئلة التي يحتاج الطالب وولي الأمر إلى معرفتها قبل اتخاذ خطوة التسجيل.
          </p>
        </motion.div>

        <div className="space-y-4">
          {accordionData.map(({ id, header, body }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Accordion
                open={open === id}
                icon={<Icon id={id} open={open} />}
                className="rounded-[1.5rem] border border-[rgba(45,131,173,0.1)] bg-white px-2 shadow-sm"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <AccordionHeader
                  onClick={() => setOpen(open === id ? 0 : id)}
                  className="border-none px-5 py-5 text-right font-[var(--font-brand-heading)] text-lg font-bold text-[var(--brand-ink)] hover:text-[var(--brand-primary)]"
                  placeholder=""
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {header}
                </AccordionHeader>
                <AccordionBody className="px-5 pb-6 pt-1 text-base leading-8 text-[var(--brand-muted)]">
                  {body}
                </AccordionBody>
              </Accordion>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-full bg-[var(--brand-primary)] px-8 py-3 font-bold text-white transition hover:bg-[#236d90]"
            >
              اسألنا مباشرة
            </Link>
            <Link
              href="/#courses"
              className="rounded-full border border-[var(--brand-ink)] px-8 py-3 font-bold text-[var(--brand-ink)] transition hover:bg-[var(--brand-ink)] hover:text-white"
            >
              استعرض البرامج
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
