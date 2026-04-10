"use client";

import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiImage, FiVideo, FiX } from 'react-icons/fi';

export default function PageCreationArticle() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl: mediaType === 'image' ? mediaUrl : null,
          videoUrl: mediaType === 'video' ? mediaUrl : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/posts/${data.id}`);
      }
    } catch (error) {
      console.error('خطأ أثناء إنشاء المقال:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaChange = (url: string) => {
    setMediaUrl(url);
    if (url) {
      setPreviewUrl(url);
    }
  };

  const clearMedia = () => {
    setMediaUrl('');
    setPreviewUrl('');
    setMediaType(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[var(--brand-ink)] mb-4">إنشاء مقال جديد</h1>
          <p className="text-xl text-[var(--brand-muted)]">شارك أفكارك ومحتواك بطريقة واضحة</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-10">
            <div className="mb-8">
              <label htmlFor="title" className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                عنوان المقال
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                placeholder="اكتب عنوانا واضحا"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="description" className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                المحتوى
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                placeholder="اكتب محتوى المقال..."
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">إضافة وسائط (اختياري)</label>

              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex items-center justify-center px-6 py-3 rounded-xl border-2 ${mediaType === 'image' ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <FiImage className="ml-2 text-xl" />
                  رابط صورة
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex items-center justify-center px-6 py-3 rounded-xl border-2 ${mediaType === 'video' ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <FiVideo className="ml-2 text-xl" />
                  رابط فيديو
                </button>
              </div>

              {mediaType && (
                <div className="relative">
                  <div className="flex items-center">
                    <div className="absolute left-4 text-gray-400">{mediaType === 'image' ? <FiImage /> : <FiVideo />}</div>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => handleMediaChange(e.target.value)}
                      className="w-full pl-12 pr-10 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                      placeholder={`ألصق رابط ${mediaType === 'image' ? 'الصورة' : 'الفيديو'} هنا...`}
                    />
                    {mediaUrl && (
                      <button type="button" onClick={clearMedia} className="absolute right-4 text-gray-400 hover:text-[var(--brand-muted)]">
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {previewUrl && (
                <div className="mt-6 rounded-xl overflow-hidden border border-gray-200">
                  {mediaType === 'image' ? (
                    <div className="relative h-96 w-full">
                      <Image src={previewUrl} alt="معاينة" fill unoptimized className="object-contain" onError={() => setPreviewUrl('')} />
                    </div>
                  ) : (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={previewUrl}
                        className="w-full h-96"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all ${isSubmitting ? 'bg-[var(--brand-primary)]' : 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)] shadow-lg hover:shadow-xl'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جارٍ النشر...
                  </span>
                ) : (
                  'نشر المقال'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
