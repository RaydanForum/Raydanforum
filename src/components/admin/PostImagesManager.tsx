import { useState, useEffect } from 'react';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PostImage {
  id: string;
  post_id: string;
  post_type: string;
  image_url: string;
  display_order: number;
}

interface PostImagesManagerProps {
  postId: string;
  postType: 'briefing' | 'activity' | 'article';
}

export default function PostImagesManager({ postId, postType }: PostImagesManagerProps) {
  const [images, setImages] = useState<PostImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, [postId]);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('post_images')
        .select('*')
        .eq('post_id', postId)
        .eq('post_type', postType)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading post images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages: PostImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const fileName = `${postType}-${postId}-${Date.now()}-${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        const { data, error } = await supabase
          .from('post_images')
          .insert({
            post_id: postId,
            post_type: postType,
            image_url: urlData.publicUrl,
            display_order: images.length + i,
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        if (data) newImages.push(data);
      }

      setImages([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('حدث خطأ أثناء رفع الصور');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (image: PostImage) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      const { error } = await supabase
        .from('post_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;
      setImages(images.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('حدث خطأ أثناء حذف الصورة');
    }
  };

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updated = [...images];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    const reordered = updated.map((img, i) => ({ ...img, display_order: i }));
    setImages(reordered);

    try {
      for (const img of reordered) {
        await supabase
          .from('post_images')
          .update({ display_order: img.display_order })
          .eq('id', img.id);
      }
    } catch (error) {
      console.error('Error reordering images:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        جاري تحميل الصور...
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        صور إضافية
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={image.image_url}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(image)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            <span className="text-sm text-gray-600">جاري الرفع...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">إضافة صور (يمكنك اختيار أكثر من صورة)</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      <p className="text-xs text-gray-400 mt-1">
        JPG, PNG, WEBP - يُنصح بضغط الصور قبل الرفع لتحسين سرعة الموقع
      </p>
    </div>
  );
}
