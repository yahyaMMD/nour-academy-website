'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Container } from './Container';
import { FadeIn } from './FadeIn';
import { getCourseImageAspectClass } from '@/lib/course-image';

type Course = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  imageAspect?: string | null;
  category: { name: string };
  instructor: string;
  date: string;
  location: string;
  price: number;
  featured: boolean;
};

const fallbackImage = "/images/logo.png";

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses', { cache: 'no-store' });
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid courses response');
        }

        setCourses(data);
      } catch (error) {
        console.error(error);
        toast.error('تعذر تحميل البرامج حاليا');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(
    () => ['الكل', ...Array.from(new Set(courses.map((course) => course.category?.name).filter(Boolean)))],
    [courses]
  );

  const filteredCourses =
    activeCategory === 'الكل'
      ? courses
      : courses.filter((course) => course.category?.name === activeCategory);

  if (loading) {
    return (
      <section id="courses" className="py-20" dir="rtl">
        <Container>
          <div className="text-center">
            <div className="mx-auto mb-4 h-7 w-48 animate-pulse rounded-full bg-slate-200" />
            <div className="mx-auto h-4 w-72 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-[420px] animate-pulse rounded-[2rem] bg-white shadow-sm" />
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20" dir="rtl">
      <Container>
        <div className="mb-12 text-center">
          <FadeIn>
            <p className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">برامجنا</p>
            <h2 className="mb-4 font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)] md:text-5xl">
              اختر البرنامج الذي
              <span className="text-[var(--brand-accent)]"> يفتح لك باب التقدم </span>
              من اليوم
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-[var(--brand-muted)]">
              برامج صممت لتمنح الطالب فهما أقوى، حضورا أفضل، ونتائج تبني ثقته بنفسه. ابدأ بالمسار
              الأنسب لك ثم دع التقدم يتكلم عنك.
            </p>
          </FadeIn>
        </div>

        <motion.div
          className="mb-10 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'bg-[var(--brand-primary)] text-white shadow-md'
                  : 'bg-white text-[var(--brand-ink)] ring-1 ring-[rgba(45,131,173,0.12)] hover:bg-[var(--brand-primary-soft)]'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {filteredCourses.some((course) => course.featured) && (
          <div className="mb-8 space-y-6">
            {filteredCourses
              .filter((course) => course.featured)
              .map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  viewport={{ once: true }}
                  className="grid overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-[rgba(45,131,173,0.08)] lg:grid-cols-[1fr_1.05fr]"
                >
                  <div className={`relative w-full bg-[var(--brand-primary-soft)] ${getCourseImageAspectClass(course.imageAspect)}`}>
                    <Image
                      src={course.image || fallbackImage}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-4 top-4 inline-flex w-fit rounded-full bg-[var(--brand-accent)] px-4 py-2 text-sm font-bold text-white">
                      الأكثر طلبا
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-8 md:p-10">
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-[var(--brand-primary-soft)] px-3 py-1 font-semibold text-[var(--brand-primary)]">
                        {course.category?.name}
                      </span>
                      <span className="text-[var(--brand-muted)]">
                        {new Date(course.date).toLocaleDateString('ar-DZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="mb-4 font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">
                      {course.title}
                    </h3>
                    <p className="mb-6 text-base leading-8 text-[var(--brand-muted)]">{course.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-[var(--brand-muted)]">الرسوم</p>
                        <p className="text-3xl font-extrabold text-[var(--brand-ink)]">
                          {course.price.toLocaleString()} دج
                        </p>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="rounded-full bg-[var(--brand-accent)] px-6 py-3 font-bold text-white shadow-lg shadow-[rgba(255,67,67,0.2)] transition hover:bg-[#ea2f2f]"
                      >
                        أريد معرفة التفاصيل
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses
            .filter((course) => !course.featured)
            .map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Link href={`/courses/${course.id}`} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-[rgba(45,131,173,0.08)] transition hover:-translate-y-1 hover:shadow-xl">
                    <div className={`relative w-full overflow-hidden bg-[var(--brand-primary-soft)] ${getCourseImageAspectClass(course.imageAspect)}`}>
                      <Image
                        src={course.image || fallbackImage}
                        alt={course.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-[var(--brand-ink)]">
                        {course.category?.name}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center justify-between text-sm">
                        <span className="text-[var(--brand-muted)]">
                          {new Date(course.date).toLocaleDateString('ar-DZ')}
                        </span>
                        <span className="font-semibold text-[var(--brand-primary)]">{course.location}</span>
                      </div>
                      <h3 className="mb-3 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)] transition group-hover:text-[var(--brand-accent)]">
                        {course.title}
                      </h3>
                      <p className="mb-6 flex-1 text-sm leading-7 text-[var(--brand-muted)] line-clamp-4">
                        {course.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-extrabold text-[var(--brand-ink)]">{course.price} دج</span>
                        <span className="rounded-full bg-[var(--brand-primary-soft)] px-4 py-2 text-sm font-bold text-[var(--brand-primary)]">
                          ابدأ الآن
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="rounded-[2rem] bg-white p-10 text-center text-[var(--brand-muted)] shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]">
            لا توجد برامج متاحة في هذا القسم حاليا.
          </div>
        )}
      </Container>
    </section>
  );
};

export default CoursesSection;
