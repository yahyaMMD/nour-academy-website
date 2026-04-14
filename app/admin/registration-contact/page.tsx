'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Settings = {
  whatsappHref: string;
  telegramHref: string;
};

type Profile = {
  id: string;
  name: string;
  whatsappHref: string;
  telegramHref: string;
};

const defaultSettings: Settings = {
  whatsappHref: 'https://wa.me/213556268876',
  telegramHref: 'https://t.me/+213556268876',
};

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-soft)]';

export default function RegistrationContactSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsRes, profilesRes] = await Promise.all([
          fetch('/api/admin/registration-contact'),
          fetch('/api/admin/registration-contact/profiles'),
        ]);

        const settingsJson = await settingsRes.json();
        const profilesJson = await profilesRes.json();

        if (settingsJson.success) {
          setSettings({
            whatsappHref: settingsJson.data.whatsappHref,
            telegramHref: settingsJson.data.telegramHref,
          });
        }

        if (profilesJson.success) {
          setProfiles(profilesJson.data || []);
        }
      } catch (error) {
        console.error(error);
        toast.error('تعذر تحميل الإعدادات');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveSettings = async () => {
    if (!settings.whatsappHref || !settings.telegramHref) {
      toast.error('يرجى إدخال روابط صحيحة لوسائل التواصل');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/registration-contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'save failed');
      toast.success('تم حفظ الإعدادات');
    } catch (error) {
      console.error(error);
      toast.error('تعذر حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!newProfileName.trim() || !settings.whatsappHref || !settings.telegramHref) {
      toast.error('أدخل اسم الملف الشخصي وروابط التواصل أولًا');
      return;
    }

    try {
      setAdding(true);
      const res = await fetch('/api/admin/registration-contact/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProfileName.trim(),
          whatsappHref: settings.whatsappHref,
          telegramHref: settings.telegramHref,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'save profile failed');
      setProfiles((prev) => [data.data, ...prev]);
      setNewProfileName('');
      toast.success('تم حفظ الملف');
    } catch (error) {
      console.error(error);
      toast.error('تعذر حفظ الملف');
    } finally {
      setAdding(false);
    }
  };

  const applyProfile = (profile: Profile) => {
    setSettings({
      whatsappHref: profile.whatsappHref,
      telegramHref: profile.telegramHref,
    });
    toast.success('تم تطبيق الملف الشخصي على الإعدادات');
  };

  const deleteProfile = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    try {
      const res = await fetch(`/api/admin/registration-contact/profiles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'delete failed');
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      toast.success('تم حذف الملف');
    } catch (error) {
      console.error(error);
      toast.error('تعذر حذف الملف');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] px-4 py-10" dir="rtl">
        <div className="container mx-auto">
          <div className="brand-panel rounded-[2rem] p-8 text-center">
            <p className="text-[var(--brand-muted)]">جارٍ تحميل إعدادات التواصل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] px-4 py-10" dir="rtl">
      <div className="container mx-auto">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">إعدادات التواصل بعد التسجيل</h1>
          <p className="mt-2 text-[var(--brand-muted)]">حدّث الروابط التي تظهر للطالب بعد إتمام التسجيل هنا.</p>
        </div>
        <Link href="/admin/courses">
          <Button variant="outline" className="rounded-2xl border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-soft)]">
            العودة إلى الدورات
          </Button>
        </Link>
      </div>

      <div className="brand-panel rounded-[2rem] p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">رابط واتساب</label>
            <input
              value={settings.whatsappHref}
              onChange={(e) => setSettings((prev) => ({ ...prev, whatsappHref: e.target.value }))}
              placeholder="https://wa.me/213XXXXXXXXX"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">رابط تيليجرام</label>
            <input
              value={settings.telegramHref}
              onChange={(e) => setSettings((prev) => ({ ...prev, telegramHref: e.target.value }))}
              placeholder="https://t.me/username"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="rounded-2xl bg-[var(--brand-primary)] text-white hover:bg-[#236d90]"
          >
            {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </div>
      </div>

      <div className="brand-panel mt-8 rounded-[2rem] p-6 shadow-sm">
        <h2 className="font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-ink)]">ملفات التواصل المحفوظة</h2>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">احفظ أكثر من إعداد حتى تتمكن من التبديل بينها بسرعة.</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="اسم الملف (مثال: تواصل التسجيل 1)"
            className={inputClass}
          />
          <Button
            onClick={saveProfile}
            disabled={adding}
            className="rounded-2xl bg-[var(--brand-primary)] text-white hover:bg-[#236d90]"
          >
            {adding ? 'جارٍ الحفظ...' : 'حفظ الملف'}
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          {profiles.length === 0 ? (
            <p className="text-sm text-[var(--brand-muted)]">لا توجد ملفات محفوظة بعد.</p>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="rounded-[1.5rem] border border-[rgba(45,131,173,0.12)] bg-white p-4 shadow-sm">
                <p className="font-semibold text-[var(--brand-ink)]">{profile.name}</p>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">واتساب: {profile.whatsappHref}</p>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">تيليجرام: {profile.telegramHref}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => applyProfile(profile)}
                    className="rounded-2xl bg-[var(--brand-primary)] text-white hover:bg-[#236d90]"
                  >
                    تطبيق الملف
                  </Button>
                  <Button type="button" className="rounded-2xl bg-[var(--brand-accent)] text-white hover:bg-[#ea2f2f]" onClick={() => deleteProfile(profile.id)}>
                    حذف الملف
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
