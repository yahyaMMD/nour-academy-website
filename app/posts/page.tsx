'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiClock, FiImage, FiVideo, FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string | Date;
}

function ListeArticles() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchQuery = searchParams.get('search') || '';
  const sortOrder = searchParams.get('sort') === 'oldest' ? 'asc' : 'desc';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/posts?search=${searchQuery}&sort=${sortOrder}`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        
        const data = await response.json();
        const processedPosts = data.map((post: Post) => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }));
        setPosts(processedPosts);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPosts();
  }, [searchQuery, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de page avec recherche */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Dernières Publications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez notre collection d&#39;articles et ressources professionnelles
          </p>
          
          {/* Contrôles de recherche et tri */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <form action="/posts" method="get" className="w-full">
                <input
                  type="text"
                  name="search"
                  placeholder="Rechercher des articles..."
                  defaultValue={searchQuery}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-dentalPurple focus:border-transparent"
                />
                <input type="hidden" name="sort" value={sortOrder === 'asc' ? 'oldest' : 'newest'} />
              </form>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Link 
                href={`/posts?search=${searchQuery}&sort=newest`}
                className={`flex items-center px-4 py-3 rounded-lg border ${sortOrder === 'desc' ? 'bg-lighterPurple border-dentalPurple text-dentalPurple' : 'bg-white border-gray-300 text-gray-700'}`}
              >
                <FiArrowDown className="mr-2" />
                Plus récents
              </Link>
              <Link 
                href={`/posts?search=${searchQuery}&sort=oldest`}
                className={`flex items-center px-4 py-3 rounded-lg border ${sortOrder === 'asc' ? 'bg-lighterPurple border-dentalPurple text-dentalPurple' : 'bg-white border-gray-300 text-gray-700'}`}
              >
                <FiArrowUp className="mr-2" />
                Plus anciens
              </Link>
            </div>
          </div>
        </div>

        {/* Nombre de résultats */}
        {searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              {posts.length} {posts.length === 1 ? 'article trouvé' : 'articles trouvés'} pour &laquo;{searchQuery}&raquo;
            </p>
          </div>
        )}

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id || `post-${Math.random().toString(36).substr(2, 9)}`} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Aperçu média */}
              <div className="relative h-48 bg-gray-100">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : post.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <FiVideo className="text-white text-4xl" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <FiImage className="text-gray-500 text-4xl" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800 shadow-sm">
                    {post.imageUrl ? (
                      <>
                        <FiImage className="mr-1" /> Image
                      </>
                    ) : post.videoUrl ? (
                      <>
                        <FiVideo className="mr-1" /> Vidéo
                      </>
                    ) : (
                      'Texte'
                    )}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FiClock className="mr-1.5" />
                  <time dateTime={new Date(post.createdAt).toISOString()}>
                    {formatDate(new Date(post.createdAt))}
                  </time>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-5 line-clamp-3 flex-grow">
                  {post.description}
                </p>
                
                <Link
                  href={`/posts/${post.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-dentalPurple to-dentalPurple hover:from-dentalPurple hover:to-dentalPurple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dentalPurple transition-colors duration-200 group-hover:shadow-md"
                >
                  Lire la suite
                  <svg className="ml-2 -mr-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* État vide */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchQuery ? 'Aucun article correspondant' : 'Aucun article pour le moment'}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PageArticles() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={`fallback-${index}`} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ListeArticles />
    </Suspense>
  );
}