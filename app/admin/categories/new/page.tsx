'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'تعذر إنشاء المادة');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ غير معروف');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-soft)]';

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md mx-auto">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => router.push('/admin/categories')}
            className="flex items-center text-[var(--brand-primary)] hover:text-[#236d90] transition-colors"
          >
            <FiArrowLeft className="ml-2" />
            العودة إلى المواد
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">إنشاء مادة جديدة</h1>
        </div>

        <div className="brand-panel rounded-[2rem] p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-[var(--brand-ink)]">
                اسم المادة *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-medium text-[var(--brand-ink)]">
                الشعبة
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-2xl px-6 py-3 text-lg font-bold text-white transition-all ${
                  isSubmitting ? 'bg-[#236d90]' : 'bg-[var(--brand-primary)] hover:bg-[#236d90] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">جارٍ الإنشاء...</span>
                ) : (
                  'إنشاء المادة'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
