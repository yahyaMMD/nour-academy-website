'use client';

import { useState, useEffect } from 'react';

type Registration = {
  id: string;
  fullName: string;
  course?: { title: string };
  email: string;
  phone: string;
  registeredAt: string;
  status: string;
};

const statusLabel: Record<string, string> = {
  confirmed: 'مؤكد',
  pending: 'قيد الانتظار',
  cancelled: 'ملغى',
};

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch('/api/registrations');
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        setError('تعذر تحميل التسجيلات: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg.id === id ? { ...reg, status } : reg))
        );
      } else {
        alert('تعذر تحديث الحالة');
      }
    } catch (error) {
      alert('تعذر تحديث الحالة ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[var(--brand-primary)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[var(--brand-ink)]">تسجيلات الدورات</h1>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="bg-[var(--brand-primary-soft)] text-right text-sm font-semibold text-[var(--brand-muted)]">
              <th className="border-b px-4 py-3">الاسم</th>
              <th className="border-b px-4 py-3">الدورة</th>
              <th className="border-b px-4 py-3">البريد</th>
              <th className="border-b px-4 py-3">الهاتف</th>
              <th className="border-b px-4 py-3">التاريخ</th>
              <th className="border-b px-4 py-3">الحالة</th>
              <th className="border-b px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id} className="text-sm text-[var(--brand-ink)]">
                <td className="border-b px-4 py-2">{reg.fullName}</td>
                <td className="border-b px-4 py-2">{reg.course?.title}</td>
                <td className="border-b px-4 py-2">{reg.email}</td>
                <td className="border-b px-4 py-2">{reg.phone}</td>
                <td className="border-b px-4 py-2">
                  {new Date(reg.registeredAt).toLocaleDateString()}
                </td>
                <td className="border-b px-4 py-2">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      reg.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : reg.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {statusLabel[reg.status] || reg.status}
                  </span>
                </td>
                <td className="border-b px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(reg.id, 'confirmed')}
                      className="text-xs text-green-600 hover:underline"
                    >
                      تأكيد
                    </button>
                    <button
                      onClick={() => updateStatus(reg.id, 'pending')}
                      className="text-xs text-yellow-600 hover:underline"
                    >
                      انتظار
                    </button>
                    <button
                      onClick={() => updateStatus(reg.id, 'cancelled')}
                      className="text-xs text-red-600 hover:underline"
                    >
                      إلغاء
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
