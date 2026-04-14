'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Container } from './Container';
import { FadeIn } from './FadeIn';

type CourseImage = {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  alt?: string | null;
  course?: {
    id: string;
    title: string;
  } | null;
};

type CourseImageGroup = {
  courseId: string;
  courseTitle: string;
  images: CourseImage[];
};

export default function CourseImagesSection() {
  const [images, setImages] = useState<CourseImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCourseId, setActiveCourseId] = useState<string>('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images?activeOnly=true', { cache: 'no-store' });
        const data = await response.json();

        if (!data.success || !Array.isArray(data.data)) {
          throw new Error('Invalid images response');
        }

        const courseLinkedImages = data.data.filter(
          (image: CourseImage) => image.course?.id && image.url
        );

        setImages(courseLinkedImages);
      } catch (error) {
        console.error(error);
        toast.error('تعذر تحميل صور البرامج حالياً');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const courseGroups = useMemo<CourseImageGroup[]>(() => {
    const groups = new Map<string, CourseImageGroup>();

    images.forEach((image) => {
      if (!image.course?.id || !image.course?.title) {
        return;
      }

      if (!groups.has(image.course.id)) {
        groups.set(image.course.id, {
          courseId: image.course.id,
          courseTitle: image.course.title,
          images: [],
        });
      }

      groups.get(image.course.id)?.images.push(image);
    });

    return Array.from(groups.values());
  }, [images]);

  useEffect(() => {
    if (!courseGroups.length) {
      setActiveCourseId('');
      return;
    }

    if (!activeCourseId || !courseGroups.some((group) => group.courseId === activeCourseId)) {
      setActiveCourseId(courseGroups[0].courseId);
    }
  }, [activeCourseId, courseGroups]);

  const activeGroup = courseGroups.find((group) => group.courseId === activeCourseId) ?? courseGroups[0];
  const heroImage = activeGroup?.images[0];
  const sideImages = activeGroup?.images.slice(1, 5) ?? [];

  if (loading) {
    return (
      <section className="py-20" dir="rtl">
        <Container>
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]">
            <div className="mx-auto mb-4 h-8 w-52 animate-pulse rounded-full bg-slate-200" />
            <div className="mx-auto h-4 w-72 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="h-[380px] animate-pulse rounded-[2rem] bg-slate-100" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-40 animate-pulse rounded-[1.5rem] bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!activeGroup || !heroImage) {
    return null;
  }

  return (
    <section className="py-20" dir="rtl">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(227,244,250,0.9),rgba(255,255,255,0.96))] p-6 shadow-xl ring-1 ring-[rgba(45,131,173,0.08)] md:p-10">
          <FadeIn>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">صور البرامج</p>
              <h2 className="mb-4 font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)] md:text-5xl">
                شاهد أجواء كل برنامج قبل التسجيل
              </h2>
              <p className="text-lg leading-8 text-[var(--brand-muted)]">
                اختر البرنامج الذي تريد، وستظهر لك الصور المرتبطة به مباشرة داخل الصفحة الرئيسية.
              </p>
            </div>
          </FadeIn>

          <motion.div
            className="mb-8 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
          >
            {courseGroups.map((group) => (
              <button
                key={group.courseId}
                onClick={() => setActiveCourseId(group.courseId)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  activeCourseId === group.courseId
                    ? 'bg-[var(--brand-primary)] text-white shadow-md'
                    : 'bg-white text-[var(--brand-ink)] ring-1 ring-[rgba(45,131,173,0.14)] hover:bg-[var(--brand-primary-soft)]'
                }`}
              >
                {group.courseTitle}
              </button>
            ))}
          </motion.div>

          <motion.div
            key={activeGroup.courseId}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <article className="group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-white shadow-lg">
              <Image
                src={heroImage.url}
                alt={heroImage.alt || heroImage.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,26,38,0.82)] via-[rgba(8,26,38,0.18)] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  {activeGroup.courseTitle}
                </span>
                <h3 className="mb-2 text-2xl font-extrabold text-white md:text-3xl">{heroImage.title}</h3>
                {heroImage.description && (
                  <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-base">
                    {heroImage.description}
                  </p>
                )}
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {sideImages.map((image, index) => (
                <motion.article
                  key={image.id}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  viewport={{ once: true }}
                  className="group relative min-h-[200px] overflow-hidden rounded-[1.75rem] bg-white shadow-md"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || image.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h4 className="text-lg font-bold text-white">{image.title}</h4>
                  </div>
                </motion.article>
              ))}

              {sideImages.length === 0 && (
                <div className="flex min-h-[200px] items-center justify-center rounded-[1.75rem] bg-white/80 p-6 text-center text-sm leading-7 text-[var(--brand-muted)] ring-1 ring-[rgba(45,131,173,0.08)]">
                  أضف المزيد من الصور لهذا البرنامج من لوحة التحكم لتظهر هنا.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
