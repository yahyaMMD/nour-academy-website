'use client';

import Link from 'next/link';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

type Category = {
  id: string;
  name: string;
  description?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('تعذر جلب المواد');
        }
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'خطأ غير معروف');
        toast.error('تعذر تحميل المواد');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('تعذر حذف المادة');
      }
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success('تم حذف المادة بنجاح');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('تعذر حذف المادة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-primary)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">خطأ: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-[var(--brand-primary)] text-white px-4 py-2 rounded hover:bg-[#236d90]"
            >
              حاول مرة أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--brand-ink)]">المواد</h1>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-md hover:bg-[#236d90]"
          >
            <FiPlus className="ml-2" />
            إضافة مادة
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {categories.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">لا توجد مواد</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={`category-${category.id}`} className="px-6 py-4 hover:bg-[var(--brand-surface)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-[var(--brand-ink)]">{category.name}</h3>
                      {category.description && <p className="text-gray-500 mt-1">{category.description}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/categories/${category.id}/`}
                        className="text-[var(--brand-primary)] hover:text-[#236d90]"
                        aria-label="تعديل المادة"
                      >
                        <FiEdit className="h-5 w-5" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(category.id)}
                        aria-label="حذف المادة"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
