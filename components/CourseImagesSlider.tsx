'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type GalleryImage = {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  alt?: string | null;
};

export default function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images?activeOnly=true');
        const data = await response.json();
        if (data.success) {
          setImages(data.data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className="py-16" dir="rtl">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="h-5 w-5 animate-bounce rounded-full bg-[var(--brand-primary)] [animation-delay:-0.3s]" />
            <div className="h-5 w-5 animate-bounce rounded-full bg-[var(--brand-primary)] [animation-delay:-0.15s]" />
            <div className="h-5 w-5 animate-bounce rounded-full bg-[var(--brand-primary)]" />
          </div>
          <p className="mt-4 text-lg font-medium text-[var(--brand-muted)]">جار تحميل المعرض...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="py-16" dir="rtl">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-[var(--font-brand-heading)] text-4xl font-extrabold text-[var(--brand-ink)]">
              معرض الصور
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-[var(--brand-muted)]">
              مساحة بصرية داعمة للأنشطة والهوية التعليمية
            </p>
          </div>

          <div className="relative mb-8">
            <div className="relative h-96 overflow-hidden rounded-[2rem] shadow-2xl md:h-[500px]">
              <Image
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.alt || images[currentIndex]?.title}
                fill
                className="object-cover"
                priority
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="mb-2 text-2xl font-bold text-white">{images[currentIndex]?.title}</h3>
                {images[currentIndex]?.description && (
                  <p className="text-lg text-white/90">{images[currentIndex].description}</p>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition hover:bg-white/30"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition hover:bg-white/30"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsModalOpen(true);
                  }}
                  className={`relative h-24 overflow-hidden rounded-2xl shadow-lg transition hover:scale-105 md:h-32 ${
                    index === currentIndex ? 'ring-4 ring-[var(--brand-primary)]' : 'hover:shadow-xl'
                  }`}
                >
                  <Image src={image.url} alt={image.alt || image.title} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-h-full max-w-5xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white transition hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="relative">
              <Image
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.alt || images[currentIndex]?.title}
                width={1200}
                height={800}
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 text-center text-white">
              <h3 className="mb-2 text-2xl font-bold">{images[currentIndex]?.title}</h3>
              {images[currentIndex]?.description && <p className="text-gray-300">{images[currentIndex].description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
