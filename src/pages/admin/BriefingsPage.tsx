import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  FileText,
  Calendar,
  Loader2,
  Upload,
  X,
} from 'lucide-react';

interface Briefing {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  category_ar: string;
  category_en: string;
  author_ar: string;
  featured_image: string;
  is_featured: boolean;
  views_count: number;
  published_at: string;
}

export default function BriefingsPage() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBriefing, setEditingBriefing] = useState<Briefing | null>(null);

  useEffect(() => {
    loadBriefings();
  }, []);

  const loadBriefings = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBriefings(data || []);
    } catch (error) {
      console.error('Error loading briefings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الإحاطة؟')) return;

    try {
      const { error } = await supabase.from('briefings').delete().eq('id', id);

      if (error) throw error;

      setBriefings(briefings.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Error deleting briefing:', error);
      alert('حدث خطأ أثناء حذف الإحاطة');
    }
  };

  const handleEdit = (briefing: Briefing) => {
    setEditingBriefing(briefing);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBriefing(null);
    loadBriefings();
  };

  const filteredBriefings = briefings.filter(
    (b) =>
      b.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author_ar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return <BriefingForm briefing={editingBriefing} onClose={handleFormClose} />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الإحاطات</h1>
            <p className="text-gray-600 mt-1">
              إضافة وتعديل الإحاطات والدراسات البحثية
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة إحاطة جديدة</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الإحاطات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredBriefings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد إحاطات
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'لم يتم العثور على نتائج مطابقة'
                : 'ابدأ بإضافة أول إحاطة'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة إحاطة جديدة</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBriefings.map((briefing) => (
              <div
                key={briefing.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex gap-6">
                  <img
                    src={briefing.featured_image}
                    alt={briefing.title_ar}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {briefing.title_ar}
                          </h3>
                          {briefing.is_featured && (
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {briefing.title_en}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {briefing.excerpt_ar}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(briefing)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(briefing.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(briefing.published_at).toLocaleDateString('ar-SA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {briefing.views_count} مشاهدة
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {briefing.category_ar}
                      </span>
                      <span className="text-gray-500">
                        بواسطة: {briefing.author_ar}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function BriefingForm({
  briefing,
  onClose,
}: {
  briefing: Briefing | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(briefing?.featured_image || '');
  const [formData, setFormData] = useState({
    title_ar: briefing?.title_ar || '',
    title_en: briefing?.title_en || '',
    content_ar: briefing?.content_ar || '',
    content_en: briefing?.content_en || '',
    excerpt_ar: briefing?.excerpt_ar || '',
    excerpt_en: briefing?.excerpt_en || '',
    author_ar: briefing?.author_ar || '',
    author_en: briefing?.author_en || '',
    category_ar: briefing?.category_ar || '',
    category_en: briefing?.category_en || '',
    featured_image: briefing?.featured_image || '',
    pdf_url: briefing?.pdf_url || '',
    is_featured: briefing?.is_featured || false,
    published_at: briefing?.published_at
      ? new Date(briefing.published_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.featured_image;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('briefing-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('briefing-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      const data = {
        ...formData,
        featured_image: imageUrl,
        published_at: new Date(formData.published_at).toISOString(),
      };

      if (briefing) {
        const { error } = await supabase
          .from('briefings')
          .update(data)
          .eq('id', briefing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('briefings').insert([data]);

        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving briefing:', error);
      alert('حدث خطأ أثناء حفظ الإحاطة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {briefing ? 'تعديل الإحاطة' : 'إضافة إحاطة جديدة'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان بالعربية *
              </label>
              <input
                type="text"
                required
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title in English *
              </label>
              <input
                type="text"
                required
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المحتوى بالعربية *
            </label>
            <textarea
              required
              rows={8}
              value={formData.content_ar}
              onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content in English *
            </label>
            <textarea
              required
              rows={8}
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الملخص بالعربية *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerpt_ar}
                onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt in English *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerpt_en}
                onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكاتب بالعربية *
              </label>
              <input
                type="text"
                required
                value={formData.author_ar}
                onChange={(e) => setFormData({ ...formData, author_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author in English *
              </label>
              <input
                type="text"
                required
                value={formData.author_en}
                onChange={(e) => setFormData({ ...formData, author_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف بالعربية *
              </label>
              <input
                type="text"
                required
                value={formData.category_ar}
                onChange={(e) => setFormData({ ...formData, category_ar: e.target.value })}
                placeholder="مثال: سياسي، اقتصادي"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category in English *
              </label>
              <input
                type="text"
                required
                value={formData.category_en}
                onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                placeholder="Example: Political, Economic"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الصورة المميزة *
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">اختر صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!briefing}
                  />
                </label>
                <span className="text-sm text-gray-500">JPG, PNG, WEBP (حد أقصى 5MB)</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط PDF (اختياري)
            </label>
            <input
              type="url"
              value={formData.pdf_url}
              onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
              placeholder="https://example.com/document.pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ النشر *
              </label>
              <input
                type="date"
                required
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  إحاطة مميزة (تظهر في الصفحة الرئيسية)
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{uploading ? 'جاري رفع الصورة...' : 'جاري الحفظ...'}</span>
                </>
              ) : (
                <span>{briefing ? 'حفظ التعديلات' : 'إضافة الإحاطة'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
