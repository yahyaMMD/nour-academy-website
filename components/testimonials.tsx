'use client'

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils";

const testimonials = [
  {
    id: 1,
    comment: "كنت أضيع وقتا طويلا في محاولة الفهم وحدي، لكن هنا أصبحت الدروس مرتبة وواضحة، وصرت أدخل الحصة وأنا مطمئنة بدل أن أكون متوترة.",
    author: "آية ب.",
    role: "طالبة ثانوي",
    location: "الجزائر العاصمة",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Aya&background=2D83AD&color=fff",
    course: "تجربة تعلم مريحة",
  },
  {
    id: 2,
    comment: "أكثر شيء أعجبني أن المدرسة تجعل الطالب يشعر أن التقدم ممكن. الشرح مباشر، والتنظيم ممتاز، والتسجيل سهل جدا.",
    author: "وليد ر.",
    role: "طالب متوسط",
    location: "البليدة",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Walid&background=FF4343&color=fff",
    course: "مسار واضح للتطور",
  },
  {
    id: 3,
    comment: "كولية أمر، أحببت هذا التوازن بين الجدية والقرب من الطالب. المدرسة تعطي انطباعا محترما، وفي نفس الوقت تشجع الطالب ولا ترهبه.",
    author: "أمينة ك.",
    role: "ولية أمر",
    location: "وهران",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Amina&background=FFD740&color=16384B",
    course: "ثقة للأسرة والطالب",
  },
];

const TestimonialCard = ({ testimonial, className }: { testimonial: (typeof testimonials)[0]; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className={cn(
        "flex h-full min-w-[300px] max-w-md flex-shrink-0 flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-[rgba(45,131,173,0.08)]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < testimonial.rating ? "text-[var(--brand-highlight)]" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <Quote className="h-8 w-8 text-[var(--brand-primary)] opacity-75" />

      <p className="flex-1 text-lg leading-8 text-[var(--brand-muted)]">&#34;{testimonial.comment}&#34;</p>

      <div className="mt-2 flex items-center gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-full">
          <Image src={testimonial.image} alt={testimonial.author} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-[var(--font-brand-heading)] text-lg font-bold text-[var(--brand-ink)]">
            {testimonial.author}
          </h4>
          <p className="text-sm text-[var(--brand-muted)]">
            {testimonial.role} • {testimonial.location}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-accent)]">{testimonial.course}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="mb-4 font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)] md:text-5xl"
          >
            طلاب يشعرون
            <span className="text-[var(--brand-primary)]"> بالفرق من البداية</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-lg leading-8 text-[var(--brand-muted)]"
          >
            عندما تكون التجربة واضحة ومريحة ومحفزة، ينعكس ذلك مباشرة على حضور الطالب وثقته واستعداده للتقدم.
          </motion.p>
        </div>

        <div className="relative">
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide md:snap-none">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} className="snap-center" />
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-4 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
            جاهز لتبدأ خطوة مختلفة؟
          </h3>
          <p className="mx-auto mb-7 max-w-2xl text-lg leading-8 text-[var(--brand-muted)]">
            اختر البرنامج المناسب لك، وابدأ تجربة تعلم تشعرك بأنك تتقدم فعلا.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#courses"
              className="rounded-full bg-[var(--brand-accent)] px-8 py-3 font-bold text-white shadow-lg shadow-[rgba(255,67,67,0.2)] transition hover:bg-[#ea2f2f]"
            >
              تصفح البرامج
            </Link>
            <Link
              href="/#contact"
              className="rounded-full border border-[var(--brand-primary)] px-8 py-3 font-bold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary-soft)]"
            >
              تواصل معنا
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
