"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiImage, FiVideo, FiX } from 'react-icons/fi';

export default function PageCreationArticle() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl: mediaType === 'image' ? mediaUrl : null,
          videoUrl: mediaType === 'video' ? mediaUrl : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/posts/${data.id}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'article :', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaChange = (url: string) => {
    setMediaUrl(url);
    if (url) {
      setPreviewUrl(url);
    }
  };

  const clearMedia = () => {
    setMediaUrl('');
    setPreviewUrl('');
    setMediaType(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Créer un nouvel article</h1>
          <p className="text-xl text-gray-600">
            Partagez vos idées avec le monde de manière élégante
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-10">
            {/* Champ Titre */}
            <div className="mb-8">
              <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-3">
                Titre de l&#39;article
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-dentalPurple focus:border-transparent"
                placeholder="Un titre captivant qui attire l'attention"
                required
              />
            </div>

            {/* Champ Description */}
            <div className="mb-8">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-3">
                Votre contenu
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-dentalPurple focus:border-transparent"
                placeholder="Écrivez quelque chose de significatif et engageant..."
                required
              />
            </div>

            {/* Sélection du type de média */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Ajouter un média (Optionnel)
              </label>
              
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex items-center justify-center px-6 py-3 rounded-xl border-2 ${mediaType === 'image' ? 'border-dentalPurple bg-lighterPurple text-dentalPurple' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <FiImage className="mr-2 text-xl" />
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex items-center justify-center px-6 py-3 rounded-xl border-2 ${mediaType === 'video' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <FiVideo className="mr-2 text-xl" />
                  Vidéo URL
                </button>
              </div>

              {/* Champ URL média */}
              {mediaType && (
                <div className="relative">
                  <div className="flex items-center">
                    <div className="absolute left-4 text-gray-400">
                      {mediaType === 'image' ? <FiImage /> : <FiVideo />}
                    </div>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => handleMediaChange(e.target.value)}
                      className="w-full pl-12 pr-10 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-dentalPurple focus:border-transparent"
                      placeholder={`Coller l'URL ${mediaType === 'image' ? 'de l\'image' : 'de la vidéo'} ici...`}
                    />
                    {mediaUrl && (
                      <button
                        type="button"
                        onClick={clearMedia}
                        className="absolute right-4 text-gray-400 hover:text-gray-600"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Aperçu du média */}
              {previewUrl && (
                <div className="mt-6 rounded-xl overflow-hidden border border-gray-200">
                  {mediaType === 'image' ? (
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full h-auto max-h-96 object-contain"
                      onError={() => setPreviewUrl('')}
                    />
                  ) : (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={previewUrl}
                        className="w-full h-96"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bouton de soumission */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all ${isSubmitting ? 'bg-dentalPurple' : 'bg-dentalPurple hover:bg-dentalPurple shadow-lg hover:shadow-xl'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publication en cours...
                  </span>
                ) : (
                  'Publier l\'article'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}