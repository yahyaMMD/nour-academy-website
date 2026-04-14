'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  FiEdit,
  FiEye,
  FiEyeOff,
  FiImage,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUpload,
  FiX,
} from 'react-icons/fi';

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

const initialFormData: ImageFormData = {
  title: '',
  description: '',
  url: '',
  alt: '',
  courseId: '',
  order: 0,
  isActive: true,
};

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand-primary)] px-6 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#236d90]';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(45,131,173,0.18)] bg-white px-6 py-3 font-bold text-[var(--brand-primary)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--brand-primary-soft)]';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-soft)]';

export default function ImageManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<ImageFormData>(initialFormData);

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
        ...initialFormData,
        order: images.length,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setFormData(initialFormData);
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

  const activeImages = images.filter((image) => image.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] px-4 py-16 sm:px-6 lg:px-8" dir="rtl">
        <div className="mx-auto max-w-7xl">
          <div className="brand-panel rounded-[2rem] p-10 text-center">
            <div className="mx-auto flex w-fit items-center gap-2">
              <div className="h-4 w-4 animate-bounce rounded-full bg-[var(--brand-primary)] [animation-delay:-0.3s]" />
              <div className="h-4 w-4 animate-bounce rounded-full bg-[var(--brand-primary)] [animation-delay:-0.15s]" />
              <div className="h-4 w-4 animate-bounce rounded-full bg-[var(--brand-primary)]" />
            </div>
            <p className="mt-5 text-lg font-medium text-[var(--brand-muted)]">جارٍ تحميل صور المعرض...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] px-4 py-10 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#f4fbff_0%,#fffef8_48%,#fff5ea_100%)] px-6 py-8 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)] md:px-8 md:py-10">
          <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[var(--brand-highlight)]/25 blur-3xl" />
          <div className="absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-[var(--brand-primary)]/16 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--brand-primary)] shadow-sm ring-1 ring-[rgba(45,131,173,0.12)]">
                <FiImage className="h-4 w-4" />
                لوحة إدارة المعرض
              </div>
              <h1 className="font-[var(--font-brand-heading)] text-3xl font-extrabold leading-[1.34] text-[var(--brand-ink)] md:text-5xl md:leading-[1.38]">
                إدارة صور المعرض
                <span className="text-[var(--brand-accent)]"> بنفس هوية منصة النور</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--brand-muted)] md:text-lg">
                أضف الصور، راجع المعاينة، اربط كل صورة بالدورة المناسبة، واضبط ظهورها بواجهة متناسقة مع
                الأسلوب البصري العام للموقع.
              </p>
            </div>

            <button onClick={() => openModal()} className={primaryButtonClass}>
              <FiPlus className="h-5 w-5" />
              إضافة صورة جديدة
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="brand-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold text-[var(--brand-primary)]">إجمالي الصور</p>
            <p className="mt-3 font-[var(--font-brand-heading)] text-4xl font-extrabold text-[var(--brand-ink)]">
              {images.length}
            </p>
          </div>
          <div className="brand-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold text-[var(--brand-primary)]">الصور النشطة</p>
            <p className="mt-3 font-[var(--font-brand-heading)] text-4xl font-extrabold text-[var(--brand-ink)]">
              {activeImages}
            </p>
          </div>
          <div className="brand-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold text-[var(--brand-primary)]">الدورات المرتبطة</p>
            <p className="mt-3 font-[var(--font-brand-heading)] text-4xl font-extrabold text-[var(--brand-ink)]">
              {new Set(images.map((image) => image.courseId).filter(Boolean)).size}
            </p>
          </div>
        </section>

        {images.length === 0 ? (
          <section className="brand-panel mt-8 rounded-[2rem] p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
              <FiImage className="h-9 w-9" />
            </div>
            <h2 className="mt-5 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
              لا توجد صور في المعرض بعد
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-8 text-[var(--brand-muted)]">
              ابدأ بإضافة أول صورة ليظهر المعرض بنفس مستوى الوضوح والجودة الموجود في بقية صفحات الموقع.
            </p>
            <button onClick={() => openModal()} className={`${primaryButtonClass} mt-6`}>
              <FiPlus className="h-5 w-5" />
              إضافة أول صورة
            </button>
          </section>
        ) : (
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <article
                key={image.id}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-[rgba(45,131,173,0.08)] transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-[var(--brand-primary-soft)]">
                  <Image
                    src={image.url}
                    alt={image.alt || image.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        image.isActive
                          ? 'bg-white/90 text-[var(--brand-primary)]'
                          : 'bg-black/55 text-white'
                      }`}
                    >
                      {image.isActive ? 'مرئية الآن' : 'مخفية'}
                    </span>
                    <button
                      onClick={() => toggleStatus(image)}
                      className={`rounded-full p-2.5 text-white shadow-md transition ${
                        image.isActive
                          ? 'bg-[var(--brand-primary)] hover:bg-[#236d90]'
                          : 'bg-[var(--brand-muted)] hover:bg-[var(--brand-ink)]'
                      }`}
                      aria-label={image.isActive ? 'إخفاء الصورة' : 'إظهار الصورة'}
                    >
                      {image.isActive ? <FiEye className="h-4 w-4" /> : <FiEyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-[var(--font-brand-heading)] text-xl font-bold text-[var(--brand-ink)]">
                        {image.title}
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-[var(--brand-primary)]">
                        {image.course?.title || 'غير مرتبطة بدورة'}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--brand-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-primary)]">
                      #{image.order}
                    </span>
                  </div>

                  {image.description && (
                    <p className="mb-5 line-clamp-3 text-sm leading-7 text-[var(--brand-muted)]">
                      {image.description}
                    </p>
                  )}

                  <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-[var(--brand-highlight-soft)] px-3 py-1 text-[var(--brand-ink)]">
                      {image.alt ? 'نص بديل مضاف' : 'بدون نص بديل'}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 ${
                        image.isActive
                          ? 'bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]'
                          : 'bg-slate-100 text-[var(--brand-muted)]'
                      }`}
                    >
                      {image.isActive ? 'نشطة' : 'غير نشطة'}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => openModal(image)} className={`${secondaryButtonClass} flex-1 px-4 py-2.5 text-sm`}>
                      <FiEdit className="h-4 w-4" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--brand-accent)] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#ea2f2f]"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,30,41,0.45)] p-4 backdrop-blur-sm">
          <div className="brand-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem]" dir="rtl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[rgba(45,131,173,0.12)] bg-white/90 px-6 py-5 backdrop-blur-sm sm:px-8">
              <div>
                <p className="text-sm font-semibold text-[var(--brand-primary)]">
                  {editingImage ? 'تحديث صورة حالية' : 'إضافة صورة جديدة'}
                </p>
                <h2 className="mt-1 font-[var(--font-brand-heading)] text-2xl font-bold text-[var(--brand-ink)]">
                  {editingImage ? 'تعديل بيانات الصورة' : 'إعداد صورة للمعرض'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full bg-[var(--brand-primary-soft)] p-3 text-[var(--brand-primary)] transition hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-accent)]"
                aria-label="إغلاق"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--brand-ink)]">الصورة</label>
                  <span className="text-xs text-[var(--brand-muted)]">JPEG / PNG / GIF / WebP حتى 5MB</span>
                </div>

                {formData.url ? (
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-[var(--brand-primary-soft)] p-3 ring-1 ring-[rgba(45,131,173,0.12)]">
                    <div className="relative h-64 overflow-hidden rounded-[1.25rem]">
                      <Image src={formData.url} alt="معاينة" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, url: '' }))}
                      className="absolute right-5 top-5 rounded-full bg-[var(--brand-accent)] p-2.5 text-white shadow-md transition hover:bg-[#ea2f2f]"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border-2 border-dashed border-[rgba(45,131,173,0.25)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)] p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                      <FiUpload className="h-7 w-7" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-[var(--brand-ink)]">
                      ارفع صورة جديدة أو استخدم رابطًا مباشرًا
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                      اختر صورة واضحة تتماشى مع اللغة البصرية الهادئة والنظيفة للموقع.
                    </p>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold text-white transition ${
                        uploading ? 'bg-slate-400' : 'bg-[var(--brand-primary)] hover:bg-[#236d90]'
                      }`}
                    >
                      <FiUpload className="h-4 w-4" />
                      {uploading ? 'جارٍ الرفع...' : 'اختر صورة'}
                    </label>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">أو أدخل رابط الصورة</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                  />
                </div>
              </section>

              <section className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">العنوان *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="عنوان الصورة"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">الدورة المرتبطة *</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
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
                  <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">ترتيب العرض</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">الوصف</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="وصف الصورة (اختياري)"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">النص البديل</label>
                  <input
                    type="text"
                    name="alt"
                    value={formData.alt}
                    onChange={handleInputChange}
                    placeholder="نص بديل لتحسين الوصول"
                    className={inputClass}
                  />
                </div>
              </section>

              <section className="rounded-[1.75rem] bg-[var(--brand-primary-soft)]/60 p-5 ring-1 ring-[rgba(45,131,173,0.08)]">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                  />
                  <span className="font-semibold text-[var(--brand-ink)]">إظهار الصورة في المعرض</span>
                </label>
                <p className="mt-2 text-sm text-[var(--brand-muted)]">
                  عند تعطيل هذا الخيار ستبقى الصورة محفوظة ولكنها لن تظهر في واجهات المعرض.
                </p>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-[rgba(45,131,173,0.12)] pt-6 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className={secondaryButtonClass}>
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!formData.title || !formData.url || !formData.courseId || uploading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand-primary)] px-6 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#236d90] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <FiSave className="h-4 w-4" />
                  {editingImage ? 'تحديث الصورة' : 'حفظ الصورة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
