'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import { DefaultButton } from "./DefaultButton";
import { brand } from "@/lib/brand";

const featureCards = [
  {
    title: "شرح يفهمك فعلا",
    text: "نحوّل الدروس إلى أفكار واضحة وخطوات سهلة حتى يشعر الطالب أنه قادر من أول حصة.",
    color: "bg-[var(--brand-highlight-soft)]",
  },
  {
    title: "متابعة تصنع الفرق",
    text: "نعتمد على التدرج، التكرار الذكي، والتوجيه المستمر حتى يتحول التحسن إلى نتيجة ملموسة.",
    color: "bg-[var(--brand-primary-soft)]",
  },
  {
    title: "جو يشجعك على النجاح",
    text: "بيئة حديثة وقريبة من الطالب تمنحه الحافز والثقة ليحضر، يشارك، ويتقدم بثبات.",
    color: "bg-[var(--brand-accent-soft)]",
  },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#f4fbff_0%,#fffef8_48%,#fff5ea_100%)] px-6 py-12 md:px-10 md:py-16" dir="rtl">
      <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-[var(--brand-highlight)]/25 blur-3xl" />
      <div className="absolute -left-10 bottom-8 h-56 w-56 rounded-full bg-[var(--brand-primary)]/16 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[var(--brand-primary)] shadow-sm ring-1 ring-[rgba(45,131,173,0.12)]">
            {brand.taglineAr}
          </div>

          <h1 className="mb-5 font-[var(--font-brand-heading)] text-4xl font-extrabold leading-[1.24] text-[var(--brand-ink)] md:text-6xl md:leading-[1.32] lg:leading-[1.38]">
            هنا يبدأ
            <span className="brand-gradient-text"> التفوق الحقيقي </span>
            بخطوات واضحة وثقة أكبر.
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-8 text-[var(--brand-muted)] md:text-xl">
            {brand.missionAr}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {featureCards.map((item) => (
              <div key={item.title} className={`rounded-3xl p-4 shadow-sm ring-1 ring-black/5 ${item.color}`}>
                <h3 className="mb-2 font-[var(--font-brand-heading)] text-base font-bold text-[var(--brand-ink)]">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-[var(--brand-muted)]">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DefaultButton
              text="اكتشف برامجنا"
              url="/#courses"
              backgroundColor="var(--brand-accent)"
              textColor="#ffffff"
              borderColor="var(--brand-accent)"
              hoverBackground="#ea2f2f"
            />
            <DefaultButton
              text="احجز استفسارك الآن"
              url="/#contact"
              backgroundColor="transparent"
              textColor="var(--brand-ink)"
              borderColor="var(--brand-primary)"
              hoverBackground="rgba(45,131,173,0.08)"
              hoverText="var(--brand-primary)"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -left-4 top-6 z-10 rounded-full bg-[var(--brand-accent)] px-4 py-2 text-sm font-bold text-white shadow-lg">
            تعلّم بثقة
          </div>

          <div className="brand-panel overflow-hidden rounded-[2rem] p-3 shadow-[0_24px_80px_rgba(22,56,75,0.16)]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/hero.png"
                alt={`${brand.nameAr} hero`}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,30,41,0.02)_0%,rgba(11,30,41,0.08)_48%,rgba(11,30,41,0.18)_100%)]" />

              <motion.div
                className="absolute -right-6 top-8 h-28 w-28 rounded-full bg-[var(--brand-highlight)]/30 blur-2xl"
                animate={{ y: [0, -14, 0], opacity: [0.45, 0.72, 0.45] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -left-6 bottom-10 h-32 w-32 rounded-full bg-[var(--brand-primary)]/22 blur-3xl"
                animate={{ y: [0, 12, 0], opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
              <motion.div
                className="absolute left-6 top-6 h-3 w-3 rounded-full bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.85)]"
                animate={{ y: [0, 18, 0], x: [0, 8, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute right-10 bottom-10 h-2.5 w-2.5 rounded-full bg-[var(--brand-highlight)] shadow-[0_0_22px_rgba(255,215,64,0.8)]"
                animate={{ y: [0, -16, 0], x: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
              <motion.div
                className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.2)_100%)]"
                animate={{ opacity: [0.18, 0.32, 0.18] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { Hero };
