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
        setError('ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„ØªØ³Ø¬ÙŠÙ„Ø§Øª: ' + (error instanceof Error ? error.message : 'Ø®Ø·Ø£ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'));
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
        alert('ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø­Ø§Ù„Ø©');
      }
    } catch (error) {
      alert('ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø­Ø§Ù„Ø© ' + (error instanceof Error ? error.message : 'Ø®Ø·Ø£ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--brand-ink)]">ØªØ³Ø¬ÙŠÙ„Ø§Øª Ø§Ù„Ø¯ÙˆØ±Ø§Øª</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-[var(--brand-primary-soft)] text-left text-sm font-semibold text-[var(--brand-muted)]">
              <th className="px-4 py-3 border-b">Ø§Ù„Ø§Ø³Ù…</th>
              <th className="px-4 py-3 border-b">Ø§Ù„Ø¯ÙˆØ±Ø©</th>
              <th className="px-4 py-3 border-b">Ø§Ù„Ø¨Ø±ÙŠØ¯</th>
              <th className="px-4 py-3 border-b">Ø§Ù„Ù‡Ø§ØªÙ</th>
              <th className="px-4 py-3 border-b">Ø§Ù„ØªØ§Ø±ÙŠØ®</th>
              <th className="px-4 py-3 border-b">Ø§Ù„Ø­Ø§Ù„Ø©</th>
              <th className="px-4 py-3 border-b">Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id} className="text-sm text-[var(--brand-ink)]">
                <td className="px-4 py-2 border-b">{reg.fullName}</td>
                <td className="px-4 py-2 border-b">{reg.course?.title}</td>
                <td className="px-4 py-2 border-b">{reg.email}</td>
                <td className="px-4 py-2 border-b">{reg.phone}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(reg.registeredAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      reg.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : reg.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {reg.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => updateStatus(reg.id, 'confirmed')}
                    className="text-green-600 hover:underline text-xs"
                  >
                    ØªØ£ÙƒÙŠØ¯
                  </button>
                  <button
                    onClick={() => updateStatus(reg.id, 'pending')}
                    className="text-yellow-600 hover:underline text-xs"
                  >
                    Ø§Ù†ØªØ¸Ø§Ø±
                  </button>
                  <button
                    onClick={() => updateStatus(reg.id, 'cancelled')}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Ø¥Ù„ØºØ§Ø¡
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
