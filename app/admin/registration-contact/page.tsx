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
        toast.error('???? ????? ?????????');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveSettings = async () => {
    if (!settings.whatsappHref || !settings.telegramHref) {
      toast.error('??? ????? ???? ?????? ????? ????????');
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
      toast.success('?? ??? ?????????');
    } catch (error) {
      console.error(error);
      toast.error('???? ??? ?????????');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!newProfileName.trim() || !settings.whatsappHref || !settings.telegramHref) {
      toast.error('???? ??? ?????? ?????? ???????');
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
      toast.success('?? ??? ??????');
    } catch (error) {
      console.error(error);
      toast.error('???? ??? ??????');
    } finally {
      setAdding(false);
    }
  };

  const applyProfile = (profile: Profile) => {
    setSettings({
      whatsappHref: profile.whatsappHref,
      telegramHref: profile.telegramHref,
    });
    toast.success('?? ????? ??????? ???? ??? ???????');
  };

  const deleteProfile = async (id: string) => {
    if (!confirm('?? ???? ??? ??? ???????')) return;
    try {
      const res = await fetch(`/api/admin/registration-contact/profiles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'delete failed');
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      toast.success('?? ??? ??????');
    } catch (error) {
      console.error(error);
      toast.error('???? ??? ??????');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <p className="text-[var(--brand-muted)]">???? ????? ??????? ???????...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--brand-ink)]">??????? ????? ?? ??? ???????</h1>
          <p className="mt-2 text-[var(--brand-muted)]">??? ????????? ??? ???? ???? ??????? ???.</p>
        </div>
        <Link href="/admin/courses">
          <Button variant="outline" className="border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-soft)]">
            ?????? ??? ???????
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-[var(--brand-primary-soft)] bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--brand-ink)]">???? ??????</label>
            <input
              value={settings.whatsappHref}
              onChange={(e) => setSettings((prev) => ({ ...prev, whatsappHref: e.target.value }))}
              placeholder="https://wa.me/213XXXXXXXXX"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--brand-ink)]">???? ????????</label>
            <input
              value={settings.telegramHref}
              onChange={(e) => setSettings((prev) => ({ ...prev, telegramHref: e.target.value }))}
              placeholder="https://t.me/username"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-[var(--brand-primary)] text-white hover:bg-[#236d90]"
          >
            {saving ? '???? ?????...' : '??? ?????????'}
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--brand-primary-soft)] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--brand-ink)]">????? ??????? ????????</h2>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">????? ??? ????? ????? ?? ??????? ?????? ?????.</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="??? ?????? (????: ???? ??????? 1)"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
          <Button
            onClick={saveProfile}
            disabled={adding}
            className="bg-[var(--brand-primary)] text-white hover:bg-[#236d90]"
          >
            {adding ? '???? ?????...' : '??? ?????'}
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          {profiles.length === 0 ? (
            <p className="text-sm text-gray-500">?? ???? ????? ?????? ???.</p>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="rounded-xl border border-gray-200 p-4">
                <p className="font-semibold text-[var(--brand-ink)]">{profile.name}</p>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">??????: {profile.whatsappHref}</p>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">????????: {profile.telegramHref}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => applyProfile(profile)}
                    className="bg-[var(--brand-primary)] text-white hover:bg-[#236d90]"
                  >
                    ????? ??????
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => deleteProfile(profile.id)}>
                    ??? ??????
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
