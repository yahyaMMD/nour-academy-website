'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FiUser, FiMail, FiPhone, FiDollarSign, FiClock, FiUpload, FiX } from 'react-icons/fi';
import {
  COURSE_IMAGE_ASPECTS,
  DEFAULT_COURSE_IMAGE_ASPECT,
  getCourseImageAspectRatio,
  normalizeCourseImageAspect,
} from '@/lib/course-image';

const imageInputSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || value.startsWith('/') || /^https?:\/\//i.test(value),
    'يرجى إدخال رابط صحيح أو مسار عام'
  );

const formSchema = z.object({
  title: z.string().min(2, 'العنوان يجب أن يكون حرفين على الأقل'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  image: imageInputSchema.optional().or(z.literal('')),
  imageAspect: z.enum(COURSE_IMAGE_ASPECTS),
  categoryId: z.string().min(1, 'يرجى اختيار فئة'),
  instructor: z.string().min(2, 'اسم الأستاذ يجب أن يكون حرفين على الأقل'),
  date: z.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'يرجى إدخال وقت صحيح (HH:MM)'),
  location: z.string().optional().or(z.literal('')),
  price: z.number().min(0, 'السعر يجب أن يكون موجبا'),
  phone: z.string().min(6, 'رقم الهاتف يجب أن يكون 6 أحرف على الأقل').optional().or(z.literal('')),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal('')),
  featured: z.boolean(),
  inFront: z.boolean(),
});

type Category = {
  id: string;
  name: string;
};

export default function CourseForm() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [categories, setالفئات] = useState<Category[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      imageAspect: DEFAULT_COURSE_IMAGE_ASPECT,
      categoryId: '',
      instructor: '',
      date: new Date(),
      time: '10:00',
      location: '',
      price: 0,
      phone: '',
      email: '',
      featured: false,
      inFront: false,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('تعذر جلب الفئات');
        }
        const categoriesData = await categoriesResponse.json();
        setالفئات(categoriesData || []);

        // Fetch course data if editing
        if (params?.id) {
          const courseResponse = await fetch(`/api/courses/${params.id}`);
          if (!courseResponse.ok) {
            throw new Error('تعذر جلب الدورة');
          }
          const { data: courseData } = await courseResponse.json();

          const courseDate = courseData.date ? new Date(courseData.date) : new Date();
          const formattedTime = courseData.date ? format(courseDate, 'HH:mm') : '10:00';

          form.reset({
            ...courseData,
            imageAspect: normalizeCourseImageAspect(courseData.imageAspect),
            date: courseDate,
            time: formattedTime,
            price: parseFloat(courseData.price),
          });
          setDate(courseDate);

          if (courseData.image) {
            setImagePreview(courseData.image);
          }
        }
      } catch (error) {
        toast.error('تعذر تحميل البيانات');
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id, form]);



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
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

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your Next.js API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل الرفع');
      }

      const { url } = await response.json();

      // Update form field
      form.setValue('image', url, { shouldValidate: true });
      toast.success('تم رفع الصورة بنجاح!');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`فشل الرفع: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setImagePreview(null);
      form.setValue('image', '', { shouldValidate: true });
    } finally {
      setUploading(false);
    }
  };
  const removeImage = () => {
    setImagePreview(null);
    form.setValue('image', '');
  };
  const selectedImageAspect = form.watch('imageAspect');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = params?.id ? `/api/courses/${params.id}` : '/api/courses';
      const method = params?.id ? 'PATCH' : 'POST';

      const dateStr = format(values.date, 'yyyy-MM-dd');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          date: dateStr,
        }),
      });

      if (response.ok) {
        toast.success(params?.id ? 'تم تحديث الدورة بنجاح' : 'تم إنشاء الدورة بنجاح');
        router.push('/admin/courses');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'تعذر حفظ الدورة');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر حفظ الدورة';
      toast.error(message);
      console.error('Error saving course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-ink)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[var(--brand-ink)] mb-4">
            {params?.id ? 'تعديل الدورة' : 'إنشاء دورة جديدة'}
          </h1>
          <p className="text-xl text-[var(--brand-muted)]">
            {params?.id ? 'تحديث تفاصيل الدورة' : 'إضافة دورة جديدة إلى المنصة'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-10">
            {/* Course العنوان */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                العنوان *
              </label>
              <input
                placeholder="عنوان الدورة"
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="mt-2 text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* الوصف */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                الوصف *
              </label>
              <textarea
                placeholder="وصف الدورة"
                rows={6}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="mt-2 text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload */}

            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                صورة الدورة
              </label>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                  أبعاد الصورة *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold transition has-[:checked]:border-[var(--brand-primary)] has-[:checked]:bg-[var(--brand-primary-soft)]">
                    <input
                      type="radio"
                      value="16:9"
                      className="sr-only"
                      {...form.register('imageAspect')}
                    />
                    16:9
                  </label>
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold transition has-[:checked]:border-[var(--brand-primary)] has-[:checked]:bg-[var(--brand-primary-soft)]">
                    <input
                      type="radio"
                      value="4:5"
                      className="sr-only"
                      {...form.register('imageAspect')}
                    />
                    4:5
                  </label>
                </div>
                {form.formState.errors.imageAspect && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.imageAspect.message}
                  </p>
                )}
              </div>

              {imagePreview ? (
                <div className="relative group">
                  <div className="max-w-full overflow-hidden rounded-xl border border-gray-200">
                    <div
                      className="relative w-full bg-[var(--brand-surface)]"
                      style={{ aspectRatio: getCourseImageAspectRatio(selectedImageAspect) }}
                    >
                      <Image
                        src={imagePreview}
                        alt="Course preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full transition-all"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-lg text-[var(--brand-muted)] mb-3">اسحب الصورة هنا أو انقر للاختيار</p>
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
                      className={`px-6 py-3 rounded-xl text-white font-medium ${uploading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[var(--brand-primary)] hover:bg-[#236d90] cursor-pointer'
                        }`}
                    >
                      {uploading ? 'جارٍ الرفع...' : 'اختر صورة'}
                    </label>
                    <p className="mt-2 text-sm text-gray-500">الصيغ المدعومة: JPEG و PNG و GIF و WebP (حد أقصى 5MB)</p>
                  </div>
                </div>
              )}

              {/* Fallback URL input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-1">
                  أو أدخل رابط الصورة
                </label>
                <input
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 text-md border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  {...form.register('image')}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                />
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* الفئة */}
              <div>
                <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                  الفئة *
                </label>
                <select
                  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  {...form.register('categoryId')}
                >
                  <option value="">اختر فئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.categoryId && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* الأستاذ */}
              <div>
                <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                  الأستاذ *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    placeholder="اسم الأستاذ"
                    className="w-full pl-10 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    {...form.register('instructor')}
                  />
                </div>
                {form.formState.errors.instructor && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.instructor.message}
                  </p>
                )}
              </div>

              {/* التاريخ */}
              <div>
                <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                  التاريخ *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex h-14 w-full rounded-xl border border-gray-300 bg-background pl-10 pr-3 py-4 text-lg text-left items-center"
                  >
                    <CalendarIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                    {date ? format(date, 'PPP') : 'اختر تاريخا'}
                  </button>
                  {showCalendar && (
                    <div className="absolute z-10 mt-1 w-auto p-2 bg-white border rounded-xl shadow-lg">
                      <div className="grid grid-cols-7 gap-1">
                        <div className="col-span-7 flex justify-between items-center mb-2">
                          <button
                            onClick={() => {
                              const newDate = new Date(date);
                              newDate.setMonth(newDate.getMonth() - 1);
                              setDate(newDate);
                            }}
                            className="p-1 rounded hover:bg-[var(--brand-primary-soft)]"
                          >
                            &lt;
                          </button>
                          <span className="font-medium">
                            {format(date, 'MMMM yyyy')}
                          </span>
                          <button
                            onClick={() => {
                              const newDate = new Date(date);
                              newDate.setMonth(newDate.getMonth() + 1);
                              setDate(newDate);
                            }}
                            className="p-1 rounded hover:bg-[var(--brand-primary-soft)]"
                          >
                            &gt;
                          </button>
                        </div>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={`day-header-${day}`} className="text-xs text-center font-medium text-gray-500">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }).map((_, i) => {
                          const day = i + 1;
                          const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
                          const isSelected = currentDate.toDateString() === date.toDateString();
                          const isToday = currentDate.toDateString() === new Date().toDateString();

                          return (
                            <button
                              key={`day-${day}-${date.getMonth()}-${date.getFullYear()}`}
                              type="button"
                              onClick={() => {
                                setDate(currentDate);
                                form.setValue('date', currentDate);
                                setShowCalendar(false);
                              }}
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${isSelected
                                  ? 'bg-[var(--brand-ink)] text-white'
                                  : isToday
                                    ? 'bg-[var(--brand-primary-soft)]'
                                    : 'hover:bg-[var(--brand-primary-soft)]'
                                }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                {form.formState.errors.date && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>

              {/* الوقت */}
              <div>
                <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                  الوقت *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    className="w-full pl-10 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    {...form.register('time')}
                  />
                </div>
                {form.formState.errors.time && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.time.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                  السعر (دج) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-10 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    {...form.register('price', { valueAsNumber: true })}
                  />
                </div>
                {form.formState.errors.price && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>

              {/* هاتف التواصل */}
              <div>
                <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                  هاتف التواصل *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    placeholder="رقم الهاتف"
                    className="w-full pl-10 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    {...form.register('phone')}
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {/* بريد التواصل */}
              <div>
                <label className="block text-lg font-medium text-[var(--brand-ink)] mb-3">
                  بريد التواصل *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    placeholder="البريد الإلكتروني"
                    className="w-full pl-10 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    {...form.register('email')}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col space-y-4 mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  className="h-5 w-5 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] border-gray-300 rounded"
                  {...form.register('featured')}
                />
                <label htmlFor="featured" className="ml-2 block text-lg text-[var(--brand-ink)]">
                  دورة مميزة
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inFront"
                  className="h-5 w-5 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] border-gray-300 rounded"
                  {...form.register('inFront')}
                />
                <label htmlFor="inFront" className="ml-2 block text-lg text-[var(--brand-ink)]">
                  إظهار في الصفحة الرئيسية
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={form.formState.isSubmitting || uploading}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all ${form.formState.isSubmitting || uploading
                    ? 'bg-[#236d90]'
                    : 'bg-[var(--brand-primary)] hover:bg-[#236d90] shadow-lg hover:shadow-xl'
                  }`}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {params?.id ? 'جارٍ التحديث...' : 'جارٍ الإنشاء...'}
                  </span>
                ) : (
                  params?.id ? 'تحديث الدورة' : 'إنشاء الدورة'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
