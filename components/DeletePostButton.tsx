'use client';

import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="حذف المقال"
      >
        <FiTrash2 className="text-lg" />
        <span className="sr-only">حذف</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">حذف المقال</h3>
          <p className="text-gray-600 mb-6">
            هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dentalPurple"
            >
              إلغاء
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isDeleting ? 'جارٍ الحذف...' : 'حذف'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
