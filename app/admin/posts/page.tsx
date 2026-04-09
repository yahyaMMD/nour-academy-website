'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiImage, FiVideo, FiEdit2, FiPlus, FiSearch } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';
import { useEffect, useState, Suspense } from 'react';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string | Date; // Updated to accept string or Date
}

function AdminPostsList() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchQuery = searchParams.get('search') || '';
  const sortOrder = searchParams.get('sort') === 'oldest' ? 'asc' : 'desc';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/posts?search=${searchQuery}&sort=${sortOrder}`
        );
        if (response.ok) {
          const data = await response.json();
          // Convert createdAt strings to Date objects
          const processedPosts = data.map((post: Post) => ({
            ...post,
            createdAt: new Date(post.createdAt)
          }));
          setPosts(processedPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dentalPurple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Posts</h1>
            <p className="text-gray-600 mt-2">
              Manage all your published content
            </p>
          </div>
          
          <Link
            href="/admin/posts/create"
            className="flex items-center px-6 py-3 bg-dentalPurple text-white font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-dentalPurple focus:ring-offset-2 transition-colors"
          >
            <FiPlus className="mr-2" />
            New Post
          </Link>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <form action="/admin/posts" method="get" className="w-full">
              <input
                type="text"
                name="search"
                placeholder="Search your posts..."
                defaultValue={searchQuery}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-dentalPurple focus:border-transparent"
              />
              <input type="hidden" name="sort" value={sortOrder === 'asc' ? 'oldest' : 'newest'} />
            </form>
          </div>
          
          <div className="flex gap-2">
            <Link 
              href={`/admin/posts?search=${searchQuery}&sort=newest`}
              className={`flex items-center px-4 py-2 rounded-lg border ${sortOrder === 'desc' ? 'bg-lighterPurple border-dentalPurple text-dentalPurple' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              Newest
            </Link>
            <Link 
              href={`/admin/posts?search=${searchQuery}&sort=oldest`}
              className={`flex items-center px-4 py-2 rounded-lg border ${sortOrder === 'asc' ? 'bg-lighterPurple border-dentalPurple text-dentalPurple' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              Oldest
            </Link>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {posts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {posts.map((post, index) => (
                <div key={post.id || `post-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Media Thumbnail */}
                    <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : post.videoUrl ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dentalPurple to-purple-600">
                          <FiVideo className="text-white text-2xl" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FiImage className="text-gray-500 text-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                          {post.imageUrl ? 'Image' : post.videoUrl ? 'Video' : 'Text'}
                        </span>
                        <time 
                          dateTime={new Date(post.createdAt).toISOString()} 
                          className="text-xs text-gray-500"
                        >
                          {formatDate(new Date(post.createdAt))}
                        </time>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {post.description}
                      </p>
                    </div>

                    {/* Edit Link */}
                    <Link
                      href={`/admin/posts/${post.id}/`}
                      className="flex items-center justify-center p-2 text-gray-700 hover:text-dentalPurple hover:bg-lighterPurple rounded-lg transition-colors shrink-0"
                      title="Edit post"
                    >
                      <FiEdit2 className="text-lg mr-2" />
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchQuery ? 'No matching posts found' : 'You have no posts yet'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery ? 'Try a different search term' : 'Create your first post to get started'}
              </p>
              <Link
                href="/admin/posts/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lighterPurple hover:bg-lighterPurple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dentalPurple"
              >
                Create New Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dentalPurple"></div>
      </div>
    }>
      <AdminPostsList />
    </Suspense>
  );
}
