"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface InstagramMedia {
  id: string;
  caption: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface InstagramGalleryProps {
  accessToken: string;
  limit?: number;
}

const InstagramGallery: React.FC<InstagramGalleryProps> = ({ 
  accessToken, 
  limit = 8 
}) => {
  const t = useTranslations();
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<InstagramMedia | null>(null);

  useEffect(() => {
    const fetchInstagramMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,thumbnail_url,timestamp,media_type&access_token=${accessToken}&limit=${limit}`
        );
        
        if (!response.ok) {
          throw new Error(`Instagram API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message);
        }
        
        setMedia(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching Instagram media:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchInstagramMedia();
    }
  }, [accessToken, limit]);

  const openModal = (item: InstagramMedia) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <p className="mt-2">
          {t('gallery.instagram.error')}
        </p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">{t('gallery.instagram.noMedia.title')}: </strong>
        <span className="block sm:inline">{t('gallery.instagram.noMedia.message')}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div 
            key={item.id} 
            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => openModal(item)}
          >
            <div className="relative h-64 w-full">
              <Image
                src={item.media_type === 'VIDEO' && item.thumbnail_url ? item.thumbnail_url : item.media_url}
                alt={item.caption || 'Instagram image'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.media_type === 'VIDEO' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md"
              onClick={closeModal}
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-2/3 h-[50vh] md:h-[70vh]">
                {selectedImage.media_type === 'VIDEO' ? (
                  <video 
                    src={selectedImage.media_url} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={selectedImage.media_url}
                    alt={selectedImage.caption || 'Instagram image'}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              
              <div className="p-6 w-full md:w-1/3 overflow-y-auto max-h-[70vh]">
                <p className="text-gray-700 mb-4">{selectedImage.caption || t('gallery.instagram.noCaption')}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(selectedImage.timestamp).toLocaleDateString()}
                </p>
                <a 
                  href={selectedImage.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t('gallery.instagram.viewOnInstagram')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramGallery; 