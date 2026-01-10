import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Target, Loader2 } from 'lucide-react';

interface OrganizationValue {
  id: string;
  type: 'mission' | 'vision' | 'value';
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  icon: string | null;
  display_order: number;
}

export default function ValuesPage() {
  const [values, setValues] = useState<OrganizationValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingValue, setEditingValue] = useState<OrganizationValue | null>(null);

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_values')
        .select('*')
        .order('type')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setValues(data || []);
    } catch (error) {
      console.error('Error loading values:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

    try {
      const { error } = await supabase.from('organization_values').delete().eq('id', id);
      if (error) throw error;
      setValues(values.filter((v) => v.id !== id));
    } catch (error) {
      console.error('Error deleting value:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleEdit = (value: OrganizationValue) => {
    setEditingValue(value);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingValue(null);
    loadValues();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mission':
        return 'الرسالة';
      case 'vision':
        return 'الرؤية';
      case 'value':
        return 'القيم';
      default:
        return type;
    }
  };

  const groupedValues = {
    mission: values.filter((v) => v.type === 'mission'),
    vision: values.filter((v) => v.type === 'vision'),
    value: values.filter((v) => v.type === 'value'),
  };

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
    return <ValueForm value={editingValue} onClose={handleFormClose} />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">القيم والرؤية</h1>
            <p className="text-gray-600 mt-1">إدارة رسالة ورؤية وقيم المنتدى</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة عنصر جديد</span>
          </button>
        </div>

        {['mission', 'vision', 'value'].map((type) => (
          <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {getTypeLabel(type)}
            </h2>

            {groupedValues[type as keyof typeof groupedValues].length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                لا توجد عناصر في {getTypeLabel(type)}
              </p>
            ) : (
              <div className="space-y-4">
                {groupedValues[type as keyof typeof groupedValues].map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-emerald-200 transition"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title_ar}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{item.title_en}</p>
                        <p className="text-sm text-gray-700">{item.content_ar}</p>
                        {item.icon && (
                          <p className="text-xs text-gray-500 mt-2">أيقونة: {item.icon}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function ValueForm({ value, onClose }: { value: OrganizationValue | null; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: value?.type || 'value' as 'mission' | 'vision' | 'value',
    title_ar: value?.title_ar || '',
    title_en: value?.title_en || '',
    content_ar: value?.content_ar || '',
    content_en: value?.content_en || '',
    icon: value?.icon || '',
    display_order: value?.display_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        icon: formData.icon || null,
      };

      if (value) {
        const { error } = await supabase
          .from('organization_values')
          .update(data)
          .eq('id', value.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('organization_values').insert([data]);
        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving value:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {value ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              النوع *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="mission">الرسالة</option>
              <option value="vision">الرؤية</option>
              <option value="value">القيم</option>
            </select>
          </div>

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
                المحتوى بالعربية *
              </label>
              <textarea
                required
                rows={5}
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
                rows={5}
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الأيقونة (اختياري)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="مثال: Target, Shield, Award"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                استخدم اسم أيقونة من مكتبة Lucide React
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب العرض
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{value ? 'حفظ التعديلات' : 'إضافة العنصر'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
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
