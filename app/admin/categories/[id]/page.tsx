'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error('تعذر جلب المادة');
        const data = await res.json();
        setName(data.name);
        setDescription(data.description || '');
      } catch (error) {
        toast.error('تعذر تحميل المادة' + (error instanceof Error ? `: ${error.message}` : ''));
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('تعذر تحديث المادة');
      toast.success('تم تحديث المادة');
      router.push('/admin/categories');
    } catch (err) {
      toast.error('فشل التحديث' + (err instanceof Error ? `: ${err.message}` : ''));
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('تعذر حذف المادة');
      toast.success('تم حذف المادة');
      router.push('/admin/categories');
    } catch (err) {
      toast.error('فشل الحذف' + (err instanceof Error ? `: ${err.message}` : ''));
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-10 bg-[var(--brand-primary-soft)] rounded" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-20 bg-[var(--brand-primary-soft)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">تعديل المادة</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">اسم المادة</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium">الشعبة</label>
          <textarea className="w-full border rounded px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-[var(--brand-primary)] text-white px-4 py-2 rounded hover:bg-[#236d90]">
            تحديث
          </button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            حذف
          </button>
          <Link href="/admin/categories" className="ml-auto underline text-[var(--brand-muted)] hover:text-gray-800">
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
