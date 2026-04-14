'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiTrash2, FiX } from 'react-icons/fi';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost({
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl || '',
            videoUrl: data.videoUrl || '',
          });
        }
      } catch (error) {
        console.error('خطأ أثناء جلب المقال:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('خطأ أثناء تحديث المقال:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('خطأ أثناء حذف المقال:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-soft)]';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-[var(--font-brand-heading)] text-3xl font-extrabold text-[var(--brand-ink)]">تعديل المقال</h1>
          <button onClick={() => router.push('/admin/posts')} className="flex items-center text-[var(--brand-muted)] hover:text-[var(--brand-ink)]">
            <FiX className="ml-1" /> إلغاء
          </button>
        </div>

        <form onSubmit={handleSubmit} className="brand-panel rounded-[2rem] p-6 shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--brand-ink)] mb-1">
                العنوان
              </label>
              <input
                type="text"
                id="title"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[var(--brand-ink)] mb-1">
                الوصف
              </label>
              <textarea
                id="description"
                value={post.description}
                onChange={(e) => setPost({ ...post, description: e.target.value })}
                rows={6}
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-[var(--brand-ink)] mb-1">
                رابط الصورة (اختياري)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={post.imageUrl}
                onChange={(e) => setPost({ ...post, imageUrl: e.target.value })}
                className={inputClass}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-[var(--brand-ink)] mb-1">
                رابط الفيديو (اختياري)
              </label>
              <input
                type="url"
                id="videoUrl"
                value={post.videoUrl}
                onChange={(e) => setPost({ ...post, videoUrl: e.target.value })}
                className={inputClass}
                placeholder="https://youtube.com/embed/video-id"
              />
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="flex items-center rounded-2xl bg-[var(--brand-accent)] px-5 py-3 font-bold text-white transition hover:bg-[#ea2f2f] disabled:opacity-50"
              >
                <FiTrash2 className="ml-2" />
                حذف المقال
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center rounded-2xl bg-[var(--brand-primary)] px-5 py-3 font-bold text-white transition hover:bg-[#236d90] disabled:opacity-50"
              >
                <FiSave className="ml-2" />
                {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,30,41,0.45)] p-4">
            <div className="brand-panel w-full max-w-md rounded-[2rem] p-6">
              <h3 className="mb-4 font-[var(--font-brand-heading)] text-lg font-bold text-[var(--brand-ink)]">تأكيد الحذف</h3>
              <p className="text-[var(--brand-muted)] mb-6">هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-[var(--brand-ink)] transition hover:bg-[var(--brand-primary-soft)]">
                  إلغاء
                </button>
                <button onClick={handleDelete} disabled={isSubmitting} className="rounded-2xl bg-[var(--brand-accent)] px-4 py-2 font-bold text-white transition hover:bg-[#ea2f2f] disabled:opacity-50">
                  {isSubmitting ? 'جارٍ الحذف...' : 'حذف'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
