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
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ImageFormData = {
  title: string;
  description: string;
  url: string;
  alt: string;
  order: number;
  isActive: boolean;
};

export default function ImageManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ImageFormData>({
    title: '',
    description: '',
    url: '',
    alt: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchImages();
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
      toast.error('Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image/(jpeg|png|gif|webp)')) {
      toast.error('Veuillez télécharger une image JPEG, PNG, GIF ou WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille de l\'image doit être inférieure à 5MB');
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
        throw new Error('Échec du téléchargement');
      }

      const { url } = await response.json();
      setFormData(prev => ({ ...prev, url }));
      toast.success('Image téléchargée avec succès!');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Échec du téléchargement');
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
      order: 0,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.url) {
      toast.error('Le titre et l\'URL sont obligatoires');
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
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Image supprimée avec succès');
        fetchImages();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erreur lors de la suppression');
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
        toast.success(`Image ${!image.isActive ? 'activée' : 'désactivée'}`);
        fetchImages();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-purple-600 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-5 h-5 rounded-full bg-purple-600 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-5 h-5 rounded-full bg-purple-600 animate-bounce"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">Chargement des images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Images</h1>
            <p className="mt-2 text-gray-600">Gérez les images de votre galerie</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Ajouter une Image
          </button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={image.url}
                  alt={image.alt || image.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => toggleStatus(image)}
                    className={`p-2 rounded-full text-white transition-colors ${
                      image.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {image.isActive ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Ordre: {image.order}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    image.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {image.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(image)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit className="w-4 h-4 mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune image trouvée</p>
            <button
              onClick={() => openModal()}
              className="mt-4 inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Ajouter votre première image
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingImage ? 'Modifier l\'Image' : 'Ajouter une Image'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                
                {formData.url ? (
                  <div className="relative">
                    <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={formData.url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, url: '' }))}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">Glissez-déposez votre image ici ou cliquez pour parcourir</p>
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
                      className={`px-6 py-2 rounded-lg text-white font-medium cursor-pointer ${
                        uploading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {uploading ? 'Téléchargement...' : 'Sélectionner une Image'}
                    </label>
                    <p className="mt-2 text-sm text-gray-500">Formats: JPEG, PNG, GIF, WebP (Max 5MB)</p>
                  </div>
                )}

                {/* URL Input as fallback */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ou entrez l&#39;URL de l&#39;image
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Titre de l'image"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Description de l'image (optionnel)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte Alternatif
                </label>
                <input
                  type="text"
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  placeholder="Texte alternatif pour l'accessibilité"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Order and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d&#39;affichage
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex items-center h-full">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Image active
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!formData.title || !formData.url || uploading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  {editingImage ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}