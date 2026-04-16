'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { arDZ } from 'date-fns/locale';
import { toast } from 'sonner';
import ImageGallery from '@/components/CourseImagesSlider';
import { getCourseImageAspectRatio } from '@/lib/course-image';

type Course = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  imageAspect?: string | null;
  instructor: string;
  category: { name: string };
  date: string;
  location: string;
  price: number;
  email: string;
  phone: string;
};

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    wilaya: '',
    role: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();

        if (!res.ok || !data.data) {
          throw new Error('Course not found');
        }

        setCourse(data.data);
      } catch (error) {
        console.error(error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course) {
      toast.error('البرنامج غير متاح حاليا');
      return;
    }

    const { fullName, email, phone, wilaya } = formData;
    if (!fullName || !email || !phone || !wilaya) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          courseId: course.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'تعذر إرسال طلب التسجيل');
      }

      router.push(
        `/registration-success?course=${encodeURIComponent(course.title)}&date=${encodeURIComponent(
          format(new Date(course.date), 'PPPP', { locale: arDZ })
        )}`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center" dir="rtl">
        <div className="inline-flex items-center space-x-2">
          <div className="h-5 w-5 animate-bounce rounded-full bg-[var(--brand-primary)] [animation-delay:-0.3s]" />
          <div className="h-5 w-5 animate-bounce rounded-full bg-[var(--brand-primary)] [animation-delay:-0.15s]" />
          <div className="h-5 w-5 animate-bounce rounded-full bg-[var(--brand-primary)]" />
        </div>
        <p className="mt-4 text-lg font-medium text-[var(--brand-muted)]">جار تحميل تفاصيل البرنامج...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-24 text-center" dir="rtl">
        <h1 className="mb-4 font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">
          البرنامج غير موجود
        </h1>
        <p className="mb-6 text-[var(--brand-muted)]">ربما تم تحديث هذا البرنامج أو لم يعد متاحا حاليا.</p>
        <button
          onClick={() => router.push('/#courses')}
          className="rounded-full bg-[var(--brand-primary)] px-6 py-3 font-bold text-white transition hover:bg-[#236d90]"
        >
          العودة إلى البرامج
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-[var(--brand-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--brand-primary)]">
            {course.category?.name}
          </span>
          <h1 className="mt-4 font-[var(--font-brand-heading)] text-4xl font-extrabold text-[var(--brand-ink)] sm:text-5xl lg:text-6xl">
            {course.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-muted)]">
            برنامج صُمم ليمنح الطالب تجربة أوضح، تقدما أقوى، وشعورا حقيقيا بأنه يسير في الطريق الصحيح.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-[rgba(45,131,173,0.08)]">
              <div
                className="relative w-full bg-[var(--brand-primary-soft)]"
                style={{ aspectRatio: getCourseImageAspectRatio(course.imageAspect) }}
              >
                <Image
                  src={course.image || '/images/logo.png'}
                  alt={course.title}
                  width={1200}
                  height={720}
                  className="h-full w-full object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-6">
                <span className="rounded-full bg-[var(--brand-highlight-soft)] px-4 py-2 text-sm font-bold text-[var(--brand-ink)]">
                  {format(new Date(course.date), 'PPP', { locale: arDZ })}
                </span>
                <span className="text-2xl font-extrabold text-[var(--brand-ink)]">{course.price.toFixed(2)} دج</span>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-[rgba(45,131,173,0.08)]">
              <h2 className="mb-6 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
                معلومات البرنامج
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <InfoCard label="الأستاذ" value={course.instructor} />
                <InfoCard label="التواصل" value={`${course.phone}${course.email ? ` • ${course.email}` : ''}`} />
                <InfoCard label="التاريخ" value={format(new Date(course.date), 'PPPP', { locale: arDZ })} />
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-[rgba(45,131,173,0.08)]">
              <h2 className="mb-6 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
                ماذا ينتظرك داخل هذا البرنامج؟
              </h2>
              <div className="whitespace-pre-line text-base leading-8 text-[var(--brand-muted)]">
                {course.description}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#2d83ad_0%,#16384b_100%)] shadow-2xl">
                <div className="p-8 text-white">
                  <h2 className="mb-2 font-[var(--font-brand-heading)] text-2xl font-bold">احجز مكانك الآن</h2>
                  <p className="mb-6 text-white/85">
                    املأ البيانات التالية ودعنا نساعدك على بدء البرنامج المناسب لك بأسرع وقت.
                  </p>

                  <div className="mb-6 rounded-[1.5rem] bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">رسوم البرنامج</span>
                      <span className="text-xl font-extrabold">{course.price.toFixed(2)} دج</span>
                    </div>
                    <div className="mt-2 text-sm text-white/80">
                      {format(new Date(course.date), 'PPPP', { locale: arDZ })}
                    </div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <CourseInput label="الاسم الكامل" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                    <CourseInput label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    <CourseInput label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    <CourseInput label="الولاية" name="wilaya" value={formData.wilaya} onChange={handleInputChange} required />
                    <CourseInput label="البلدية" name="role" value={formData.role} onChange={handleInputChange} placeholder="اكتب البلدية" />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-4 w-full rounded-full bg-white py-4 text-lg font-extrabold text-[var(--brand-primary)] transition hover:bg-slate-100"
                    >
                      {submitting ? 'جار إرسال الطلب...' : 'أكمل طلب التسجيل'}
                    </button>
                  </form>
                </div>

                <div className="bg-black/10 px-8 py-4 text-center text-sm text-white/80">
                  سنراجع طلبك ونتواصل معك في أقرب وقت لتأكيد التفاصيل.
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-[rgba(45,131,173,0.08)]">
                <h3 className="mb-4 font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-ink)]">
                  ماذا ستستفيد؟
                </h3>
                <ul className="space-y-3 text-sm leading-7 text-[var(--brand-muted)]">
                  <li>شرح واضح يساعدك على فهم الدروس بثقة.</li>
                  <li>تنظيم أفضل لمسارك الدراسي وخطواتك القادمة.</li>
                  <li>تجربة مريحة تشجعك على الاستمرار والتحسن.</li>
                  <li>بيئة تعليمية تحمل نفس روح منصة النور في الوضوح والتحفيز.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {course && <ImageGallery courseId={course.id} />}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[var(--brand-primary-soft)]/50 p-5">
      <p className="mb-2 text-sm font-semibold text-[var(--brand-primary)]">{label}</p>
      <p className="text-base leading-8 text-[var(--brand-ink)]">{value}</p>
    </div>
  );
}

function CourseInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-white/85">{label}{required ? ' *' : ''}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
      />
    </div>
  );
}
