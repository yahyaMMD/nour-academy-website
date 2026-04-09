'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
  });
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setError(await response.text());
      return;
    }

    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-14" dir="rtl">
      <div className="brand-panel w-full max-w-md rounded-[2rem] p-8">
        <h1 className="mb-2 text-center font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">
          إنشاء حساب
        </h1>
        <p className="mb-6 text-center text-sm leading-7 text-[var(--brand-muted)]">
          افتح حساب طالب جديد للوصول إلى الدورات والتسجيلات.
        </p>

        <form className="space-y-5" onSubmit={registerUser}>
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
              الاسم الكامل
            </label>
            <input
              id="username"
              type="text"
              required
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-soft)]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-soft)]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-soft)]"
            />
          </div>

          {error && <p className="text-sm font-medium text-[var(--brand-accent)]">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[var(--brand-primary)] px-4 py-3 font-bold text-white transition hover:bg-[#236d90]"
          >
            إنشاء الحساب
          </button>
        </form>

        <button
          onClick={() => router.push('/auth/login')}
          className="mt-4 w-full rounded-2xl border border-[var(--brand-primary)] px-4 py-3 font-bold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary-soft)]"
        >
          لدي حساب بالفعل
        </button>
      </div>
    </div>
  );
}
