"use client";

import { AnimationPlaybackControls, motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const items = [
  "شرح واضح",
  "متابعة مستمرة",
  "بيئة محفزة",
  "ثقة أكبر",
  "تنظيم أفضل",
  "تقدم ملموس",
];

export const SponsorsMarquee = () => {
  const [scope, animate] = useAnimate();
  const [hovered, setHovered] = useState(false);
  const animation = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    animation.current = animate(scope.current, { x: "-50%" }, { duration: 36, ease: "linear", repeat: Infinity });
  }, [animate, scope]);

  useEffect(() => {
    if (animation.current) {
      animation.current.speed = hovered ? 0.45 : 1;
    }
  }, [hovered]);

  return (
    <section className="py-12" dir="rtl">
      <div className="mb-6 text-center">
        <h2 className="font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">
          ماذا سيشعر الطالب هنا؟
        </h2>
        <p className="mt-3 text-[var(--brand-muted)]">
          وضوح في الطريق، وراحة في التجربة، ودافع حقيقي للاستمرار والتحسن.
        </p>
      </div>

      <div className="overflow-x-hidden rounded-[2rem] bg-white px-4 py-6 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]">
        <motion.div
          ref={scope}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex flex-none gap-6 whitespace-nowrap pr-6"
        >
          {Array.from({ length: 8 }).map((_, outerIndex) => (
            <div key={outerIndex} className="flex items-center gap-6">
              {items.map((item) => (
                <div
                  key={`${outerIndex}-${item}`}
                  className="rounded-full bg-[linear-gradient(135deg,rgba(45,131,173,0.08),rgba(255,215,64,0.18))] px-6 py-3 text-sm font-bold text-[var(--brand-ink)] ring-1 ring-[rgba(45,131,173,0.08)]"
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
