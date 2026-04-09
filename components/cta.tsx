"use client";

import { motion, useAnimate, AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const messages = [
  "ابدأ بثقة",
  "تعلّم بوضوح",
  "تقدّم بثبات",
  "اصنع فرقك",
];

export const CTA = () => {
  const [scope, animate] = useAnimate();
  const [hovered, setHovered] = useState(false);
  const animation = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    animation.current = animate(scope.current, { x: "-50%" }, { duration: 14, ease: "linear", repeat: Infinity });
  }, [animate, scope]);

  useEffect(() => {
    if (animation.current) {
      animation.current.speed = hovered ? 0.45 : 1;
    }
  }, [hovered]);

  return (
    <section className="py-8">
      <div className="overflow-x-hidden rounded-[2rem] bg-[var(--brand-ink)] px-4 py-6">
        <motion.div
          ref={scope}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex flex-none gap-14 whitespace-nowrap pr-14 text-3xl font-extrabold text-white md:text-5xl"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              {messages.map((message) => (
                <div key={`${i}-${message}`} className="flex items-center gap-5">
                  <span className="text-[var(--brand-highlight)]">✦</span>
                  <span>{message}</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
