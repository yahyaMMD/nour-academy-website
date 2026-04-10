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
          <h1 className="text-3xl font-bold text-[var(--brand-ink)]">تعديل المقال</h1>
          <button onClick={() => router.push('/admin/posts')} className="flex items-center text-gray-500 hover:text-[var(--brand-ink)]">
            <FiX className="ml-1" /> إلغاء
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                placeholder="https://youtube.com/embed/video-id"
              />
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                <FiTrash2 className="ml-2" />
                حذف المقال
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] disabled:opacity-50"
              >
                <FiSave className="ml-2" />
                {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-[var(--brand-ink)] mb-4">تأكيد الحذف</h3>
              <p className="text-[var(--brand-muted)] mb-6">هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-[var(--brand-ink)] hover:bg-[var(--brand-surface)]">
                  إلغاء
                </button>
                <button onClick={handleDelete} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
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
