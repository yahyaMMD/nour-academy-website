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

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
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
          <h1 className="text-3xl font-bold text-[var(--brand-ink)]">إنشاء مادة جديدة</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
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
                className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
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
                className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-3 px-6 rounded-xl text-white font-bold text-lg transition-all ${
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
