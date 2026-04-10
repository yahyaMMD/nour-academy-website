'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

export default function PageArticle() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const id = params.id as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          router.replace('/404');
        }
      } catch (error) {
        console.error('خطأ أثناء جلب المقال:', error);
        router.replace('/404');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center" dir="rtl">
        <h1 className="text-3xl font-bold mb-4">المقال غير موجود</h1>
        <p>المقال الذي تبحث عنه غير موجود أو تم حذفه.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" dir="rtl">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {post.imageUrl && (
        <div className="relative mb-6 h-[420px] w-full overflow-hidden rounded-lg">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      {post.videoUrl && (
        <div className="aspect-w-16 aspect-h-9 mb-6">
          <iframe
            src={post.videoUrl}
            className="w-full h-96 rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="prose max-w-none">
        <p className="text-lg">{post.description}</p>
      </div>
    </div>
  );
}
