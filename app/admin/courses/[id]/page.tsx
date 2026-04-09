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
import { FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign, FiClock, FiUpload, FiX } from 'react-icons/fi';

const imageInputSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || value.startsWith('/') || /^https?:\/\//i.test(value),
    'Please enter a valid URL or public path'
  );

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: imageInputSchema.optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Please select a category'),
  instructor: z.string().min(2, 'Instructor name must be at least 2 characters'),
  date: z.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid time (HH:MM)'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  price: z.number().min(0, 'Price must be positive'),
  phone: z.string().min(6, 'Phone must be at least 6 characters'),
  email: z.string().email('Please enter a valid email'),
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image/(jpeg|png|gif|webp)')) {
      toast.error('Please upload a JPEG, PNG, GIF, or WebP image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      
      form.setValue('image', url, { shouldValidate: true });
      toast.success('Image uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const result = await response.json();
        const categoriesData = Array.isArray(result) ? result : result.data;
        
        if (!Array.isArray(categoriesData)) {
          throw new Error('Invalid categories data format');
        }

        setCategories(categoriesData);
        setCategoriesError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError(error instanceof Error ? error.message : 'Failed to load categories');
        setCategories([]);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchCategories();

        if (params?.id) {
          const courseResponse = await fetch(`/api/courses/${params.id}`);
          if (!courseResponse.ok) {
            throw new Error('Failed to fetch course');
          }
          const { data: courseData } = await courseResponse.json();
          
          const courseDate = courseData.date ? new Date(courseData.date) : new Date();
          const formattedTime = courseData.date ? format(courseDate, 'HH:mm') : '10:00';
          
          form.reset({
            ...courseData,
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
        toast.error('Failed to load data');
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id, form]);

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
        toast.success(params?.id ? 'Course updated successfully' : 'Course created successfully');
        router.push('/admin/courses');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save course');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save course';
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
            {params?.id ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-xl text-gray-600">
            {params?.id ? 'Update course details' : 'Add a new course to your platform'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-10">
            {/* Course Title */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Title *
              </label>
              <input
                placeholder="Course title"
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="mt-2 text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Description *
              </label>
              <textarea
                placeholder="Course description"
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
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Course Image
              </label>
              
              {imagePreview ? (
                <div className="relative group">
                  <div className="max-w-full overflow-hidden rounded-xl border border-gray-200">
                    <div className="relative h-[500px] w-full">
                      <Image
                        src={imagePreview}
                        alt="Course preview"
                        fill
                        unoptimized
                        className="object-contain"
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
                    <p className="text-lg text-gray-600 mb-3">Drag & drop your image here or click to browse</p>
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
                      className={`px-6 py-3 rounded-xl text-white font-medium ${
                        uploading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-[var(--brand-primary)] hover:bg-[#236d90] cursor-pointer'
                      }`}
                    >
                      {uploading ? 'Uploading...' : 'Select Image'}
                    </label>
                    <p className="mt-2 text-sm text-gray-500">Supports: JPEG, PNG, GIF, WebP (Max 5MB)</p>
                  </div>
                </div>
              )}
              
              {/* Fallback URL input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or enter image URL
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
                {form.formState.errors.image && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Category */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Category *
                </label>
                {categoriesError ? (
                  <div className="text-red-500 mb-2">{categoriesError}</div>
                ) : null}
                <select
                  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  {...form.register('categoryId')}
                  disabled={!!categoriesError}
                >
                  <option value="">Select a category</option>
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

              {/* Instructor */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Instructor *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    placeholder="Instructor name"
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




              {/* Date */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Date *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex h-14 w-full rounded-xl border border-gray-300 bg-background pl-10 pr-3 py-4 text-lg text-left items-center"
                  >
                    <CalendarIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
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
                            className="p-1 rounded hover:bg-gray-100"
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
                            className="p-1 rounded hover:bg-gray-100"
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
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                                isSelected 
                                  ? 'bg-[var(--brand-ink)] text-white' 
                                  : isToday 
                                    ? 'bg-gray-100' 
                                    : 'hover:bg-gray-100'
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

              {/* Time */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Time *
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

              {/* Location */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    placeholder="Course location"
                    className="w-full pl-10 px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    {...form.register('location')}
                  />
                </div>
                {form.formState.errors.location && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Price (DA) *
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

              {/* Contact Phone */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Contact Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    placeholder="Phone number"
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

              {/* Contact Email */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Contact Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    placeholder="Email address"
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
                <label htmlFor="featured" className="ml-2 block text-lg text-gray-700">
                  Featured Course
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inFront"
                  className="h-5 w-5 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] border-gray-300 rounded"
                  {...form.register('inFront')}
                />
                <label htmlFor="inFront" className="ml-2 block text-lg text-gray-700">
                  Show on Homepage
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={form.formState.isSubmitting || uploading}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all ${
                  form.formState.isSubmitting || uploading
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
                    {params?.id ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  params?.id ? 'Update Course' : 'Create Course'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
