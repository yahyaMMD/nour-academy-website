import Link from 'next/link';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import AppDownloadPromo from '@/components/AppDownloadPromo';

const DEFAULT_CONTACT = {
  whatsappHref: 'https://wa.me/213556268876',
  telegramHref: 'https://t.me/+213556268876',
};

export default async function RegistrationSuccess({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; date?: string }>;
}) {
  const params = await searchParams;
  const course = params.course;
  const date = params.date;

  const settings = await prisma.registrationContactSettings.findUnique({
    where: { key: 'registration-contact' },
    select: {
      whatsappHref: true,
      telegramHref: true,
    },
  });

  const whatsappHref = settings?.whatsappHref || DEFAULT_CONTACT.whatsappHref;
  const telegramHref = settings?.telegramHref || DEFAULT_CONTACT.telegramHref;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-14" dir="rtl">
      <div className="brand-panel w-full max-w-2xl rounded-[2rem] p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-4 font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">
          تم استلام طلبك بنجاح
        </h1>

        <p className="mb-6 text-lg leading-8 text-[var(--brand-muted)]">
          خطوتك الأولى اكتملت. سنراجع طلبك ونتواصل معك في أقرب وقت لتأكيد التفاصيل ومساعدتك على بدء البرنامج
          المناسب بثقة.
        </p>

        {(course || date) && (
          <div className="mb-8 rounded-[1.5rem] bg-[var(--brand-primary-soft)] p-5 text-right">
            {course && <p className="font-bold text-[var(--brand-ink)]">البرنامج: {course}</p>}
            {date && <p className="mt-2 text-[var(--brand-muted)]">التاريخ: {date}</p>}
          </div>
        )}

        <div className="mb-6 rounded-[1.5rem] bg-[var(--brand-highlight-soft)] p-5 text-right">
          <p className="font-bold text-[var(--brand-ink)]">الخطوة التالية</p>
          <p className="mt-2 leading-7 text-[var(--brand-muted)]">
            تواصل معنا الآن على واتساب أو تيليجرام حتى نؤكد معك التفاصيل بسرعة ونبقى على تواصل مباشر.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            <Button className="rounded-full bg-[#25D366] px-6 py-3 text-white hover:bg-[#1fb85a]">تواصل عبر واتساب</Button>
          </a>

          <a href={telegramHref} target="_blank" rel="noreferrer">
            <Button className="rounded-full bg-[#229ED9] px-6 py-3 text-white hover:bg-[#1b8fc5]">تواصل عبر تيليجرام</Button>
          </a>
        </div>

        <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/#courses">
            <Button
              variant="outline"
              className="rounded-full border-[var(--brand-primary)] px-6 py-3 text-[var(--brand-primary)] hover:bg-[var(--brand-primary-soft)]"
            >
              العودة إلى البرامج
            </Button>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              className="rounded-full border-[var(--brand-primary)] px-6 py-3 text-[var(--brand-primary)] hover:bg-[var(--brand-primary-soft)]"
            >
              الصفحة الرئيسية
            </Button>
          </Link>
        </div>

        <AppDownloadPromo compact className="mt-8 text-right" />
      </div>
    </div>
  );
}
