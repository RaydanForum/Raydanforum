import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PostImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface ImageGalleryProps {
  postId: string;
  postType: 'briefing' | 'activity' | 'article';
}

export default function ImageGallery({ postId, postType }: ImageGalleryProps) {
  const [images, setImages] = useState<PostImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('post_images')
        .select('id, image_url, display_order')
        .eq('post_id', postId)
        .eq('post_type', postType)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) setImages(data);
    };
    load();
  }, [postId, postType]);

  if (images.length === 0) return null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = (dir: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    if (dir === 'prev') {
      setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1);
    } else {
      setLightboxIndex(lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0);
    }
  };

  return (
    <>
      <div className="mt-10">
        <div className={`grid gap-3 ${
          images.length === 1 ? 'grid-cols-1' :
          images.length === 2 ? 'grid-cols-2' :
          'grid-cols-2 md:grid-cols-3'
        }`}>
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => openLightbox(index)}
              className="relative overflow-hidden rounded-xl group focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <img
                src={img.image_url}
                alt=""
                className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <img
            src={images[lightboxIndex].image_url}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-6 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
