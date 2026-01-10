import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Loader2,
  Clock,
  Upload,
  X,
} from 'lucide-react';

interface Activity {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  activity_type_ar: string;
  activity_type_en: string;
  location_ar: string;
  location_en: string;
  featured_image: string;
  start_date: string;
  end_date: string | null;
  is_upcoming: boolean;
  registration_link: string | null;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا النشاط؟')) return;

    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);

      if (error) throw error;

      setActivities(activities.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('حدث خطأ أثناء حذف النشاط');
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingActivity(null);
    loadActivities();
  };

  const filteredActivities = activities.filter(
    (a) =>
      a.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.activity_type_ar.toLowerCase().includes(searchQuery.toLowerCase())
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
    return <ActivityForm activity={editingActivity} onClose={handleFormClose} />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الأنشطة</h1>
            <p className="text-gray-600 mt-1">
              إضافة وتعديل الفعاليات والمؤتمرات وورش العمل
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة نشاط جديد</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الأنشطة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد أنشطة
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'لم يتم العثور على نتائج مطابقة'
                : 'ابدأ بإضافة أول نشاط'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة نشاط جديد</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex gap-6">
                  <img
                    src={activity.featured_image}
                    alt={activity.title_ar}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {activity.title_ar}
                          </h3>
                          {activity.is_upcoming && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              قادم
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {activity.title_en}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {activity.description_ar}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(activity.start_date).toLocaleDateString('ar-SA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {activity.location_ar}
                      </span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                        {activity.activity_type_ar}
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

function ActivityForm({
  activity,
  onClose,
}: {
  activity: Activity | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(activity?.featured_image || '');
  const [formData, setFormData] = useState({
    title_ar: activity?.title_ar || '',
    title_en: activity?.title_en || '',
    description_ar: activity?.description_ar || '',
    description_en: activity?.description_en || '',
    activity_type_ar: activity?.activity_type_ar || '',
    activity_type_en: activity?.activity_type_en || '',
    location_ar: activity?.location_ar || '',
    location_en: activity?.location_en || '',
    featured_image: activity?.featured_image || '',
    start_date: activity?.start_date
      ? new Date(activity.start_date).toISOString().slice(0, 16)
      : '',
    end_date: activity?.end_date
      ? new Date(activity.end_date).toISOString().slice(0, 16)
      : '',
    is_upcoming: activity?.is_upcoming ?? true,
    registration_link: activity?.registration_link || '',
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
        .from('activity-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('activity-images')
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
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        registration_link: formData.registration_link || null,
      };

      if (activity) {
        const { error } = await supabase
          .from('activities')
          .update(data)
          .eq('id', activity.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('activities').insert([data]);

        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('حدث خطأ أثناء حفظ النشاط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {activity ? 'تعديل النشاط' : 'إضافة نشاط جديد'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف بالعربية *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description in English *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع النشاط بالعربية *
              </label>
              <input
                type="text"
                required
                value={formData.activity_type_ar}
                onChange={(e) => setFormData({ ...formData, activity_type_ar: e.target.value })}
                placeholder="مثال: ورشة عمل، مؤتمر، ندوة"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type in English *
              </label>
              <input
                type="text"
                required
                value={formData.activity_type_en}
                onChange={(e) => setFormData({ ...formData, activity_type_en: e.target.value })}
                placeholder="Example: Workshop, Conference, Seminar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المكان بالعربية *
              </label>
              <input
                type="text"
                required
                value={formData.location_ar}
                onChange={(e) => setFormData({ ...formData, location_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location in English *
              </label>
              <input
                type="text"
                required
                value={formData.location_en}
                onChange={(e) => setFormData({ ...formData, location_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ البدء *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الانتهاء (اختياري)
              </label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                    required={!activity}
                  />
                </label>
                <span className="text-sm text-gray-500">JPG, PNG, WEBP (حد أقصى 5MB)</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط التسجيل (اختياري)
            </label>
            <input
              type="url"
              value={formData.registration_link}
              onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
              placeholder="https://example.com/register"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_upcoming}
                onChange={(e) => setFormData({ ...formData, is_upcoming: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">
                نشاط قادم (يظهر في قائمة الأنشطة القادمة)
              </span>
            </label>
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
                <span>{activity ? 'حفظ التعديلات' : 'إضافة النشاط'}</span>
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
