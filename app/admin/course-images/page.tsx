'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiX, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

type GalleryImage = {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  alt?: string | null;
  courseId?: string | null;
  course?: { id: string; title: string } | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Course = {
  id: string;
  title: string;
};

type ImageFormData = {
  title: string;
  description: string;
  url: string;
  alt: string;
  courseId: string;
  order: number;
  isActive: boolean;
};

export default function ImageManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<ImageFormData>({
    title: '',
    description: '',
    url: '',
    alt: '',
    courseId: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchImages();
    fetchCourses();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('تعذر تحميل الصور');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses?all=true');
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('تعذر تحميل الدورات');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image/(jpeg|png|gif|webp)')) {
      toast.error('يرجى رفع صورة بصيغة JPEG أو PNG أو GIF أو WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('يجب أن يكون حجم الصورة أقل من 5MB');
      return;
    }

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('فشل الرفع');
      }

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, url }));
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل الرفع');
    } finally {
      setUploading(false);
    }
  };

  const openModal = (image?: GalleryImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title,
        description: image.description || '',
        url: image.url,
        alt: image.alt || '',
        courseId: image.courseId || '',
        order: image.order,
        isActive: image.isActive,
      });
    } else {
      setEditingImage(null);
      setFormData({
        title: '',
        description: '',
        url: '',
        alt: '',
        courseId: '',
        order: images.length,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setFormData({
      title: '',
      description: '',
      url: '',
      alt: '',
      courseId: '',
      order: 0,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.url || !formData.courseId) {
      toast.error('العنوان والرابط والدورة مطلوبة');
      return;
    }

    try {
      const url = editingImage ? `/api/images/${editingImage.id}` : '/api/images';
      const method = editingImage ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchImages();
        closeModal();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('تعذر حفظ الصورة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('تم حذف الصورة بنجاح');
        fetchImages();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('تعذر حذف الصورة');
    }
  };

  const toggleStatus = async (image: GalleryImage) => {
    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !image.isActive }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`تم ${!image.isActive ? 'تفعيل' : 'تعطيل'} الصورة`);
        fetchImages();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('تعذر تغيير الحالة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mt-4 text-lg font-medium text-[var(--brand-muted)]">جارٍ تحميل الصور...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--brand-ink)]">إدارة الصور</h1>
            <p className="mt-2 text-[var(--brand-muted)]">إدارة صور المعرض</p>
          </div>
          <button onClick={() => openModal()} className="inline-flex items-center px-6 py-3 bg-[var(--brand-primary)] text-white font-medium rounded-lg hover:bg-[#236d90] transition-colors">
            <FiPlus className="w-5 h-5 ml-2" />
            إضافة صورة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src={image.url} alt={image.alt || image.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => toggleStatus(image)}
                    className={`p-2 rounded-full text-white transition-colors ${image.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                  >
                    {image.isActive ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[var(--brand-ink)] mb-1 truncate">{image.title}</h3>
                {image.description && <p className="text-sm text-[var(--brand-muted)] mb-3 line-clamp-2">{image.description}</p>}
                <p className="mb-2 text-xs font-semibold text-[var(--brand-primary)]">
                  {image.course?.title || 'غير مرتبطة بدورة'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>الترتيب: {image.order}</span>
                  <span className={`px-2 py-1 rounded-full ${image.isActive ? 'bg-green-100 text-green-800' : 'bg-[var(--brand-primary-soft)] text-gray-800'}`}>
                    {image.isActive ? 'نشطة' : 'غير نشطة'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => openModal(image)} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                    <FiEdit className="w-4 h-4 ml-1" />
                    تعديل
                  </button>
                  <button onClick={() => handleDelete(image.id)} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">
                    <FiTrash2 className="w-4 h-4 ml-1" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد صور</p>
            <button onClick={() => openModal()} className="mt-4 inline-flex items-center px-6 py-3 bg-[var(--brand-primary)] text-white font-medium rounded-lg hover:bg-[#236d90] transition-colors">
              <FiPlus className="w-5 h-5 ml-2" />
              إضافة أول صورة
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-[var(--brand-ink)]">{editingImage ? 'تعديل الصورة' : 'إضافة صورة'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-[var(--brand-muted)] transition-colors">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">الصورة</label>

                {formData.url ? (
                  <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={formData.url} alt="معاينة" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, url: '' }))}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-[var(--brand-muted)] mb-3">اسحب الصورة هنا أو انقر للاختيار</p>
                    <input type="file" id="image-upload" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    <label htmlFor="image-upload" className={`px-6 py-2 rounded-lg text-white font-medium cursor-pointer ${uploading ? 'bg-gray-400' : 'bg-[var(--brand-primary)] hover:bg-[#236d90]'}`}>
                      {uploading ? 'جارٍ الرفع...' : 'اختر صورة'}
                    </label>
                    <p className="mt-2 text-sm text-gray-500">الصيغ: JPEG و PNG و GIF و WebP (حد أقصى 5MB)</p>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[var(--brand-ink)] mb-1">أو أدخل رابط الصورة</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">العنوان *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="عنوان الصورة" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">الدورة المرتبطة *</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                >
                  <option value="">اختر دورة</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">الوصف</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="وصف الصورة (اختياري)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">النص البديل</label>
                <input type="text" name="alt" value={formData.alt} onChange={handleInputChange} placeholder="نص بديل لتحسين الوصول" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">ترتيب العرض</label>
                  <input type="number" name="order" value={formData.order} onChange={handleInputChange} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                </div>

                <div className="flex items-center h-full">
                  <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] border-gray-300 rounded" />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-[var(--brand-ink)]">صورة نشطة</label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 text-[var(--brand-ink)] rounded-lg hover:bg-[var(--brand-surface)] transition-colors">
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!formData.title || !formData.url || !formData.courseId || uploading}
                  className="px-6 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[#236d90] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <FiSave className="w-4 h-4 ml-2" />
                  {editingImage ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
