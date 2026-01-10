import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface SiteSetting {
  id: string;
  key: string;
  value_ar: string;
  value_en: string;
  description: string;
  updated_at: string;
}

export default function SiteSettingsPage() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (setting: Partial<SiteSetting>) => {
    try {
      if (setting.id) {
        const { error } = await supabase
          .from('site_settings')
          .update(setting)
          .eq('id', setting.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([setting]);

        if (error) throw error;
      }

      await fetchSettings();
      setEditingSetting(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving setting:', error);
      alert('Failed to save setting');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      alert('Failed to delete setting');
    }
  };

  const filteredSettings = settings.filter(setting => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        setting.key.toLowerCase().includes(query) ||
        setting.description.toLowerCase().includes(query) ||
        setting.value_ar.toLowerCase().includes(query) ||
        setting.value_en.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
        </h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          {language === 'ar' ? 'إضافة إعداد' : 'Add Setting'}
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <SettingForm
            setting={null}
            onSave={handleSave}
            onCancel={() => setIsAdding(false)}
            language={language}
          />
        </div>
      )}

      <div className="space-y-4">
        {filteredSettings.map((setting) => (
          <div key={setting.id} className="bg-white rounded-lg shadow-md p-6">
            {editingSetting?.id === setting.id ? (
              <SettingForm
                setting={editingSetting}
                onSave={handleSave}
                onCancel={() => setEditingSetting(null)}
                language={language}
              />
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{setting.key}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(setting.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    {setting.description && (
                      <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingSetting(setting)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(setting.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {setting.key.includes('_url') && (setting.value_ar || setting.value_en) && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      {language === 'ar' ? 'معاينة' : 'Preview'}
                    </div>
                    <img
                      src={setting.value_ar || setting.value_en}
                      alt="Preview"
                      className="h-24 w-auto object-contain border border-gray-200 rounded-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {language === 'ar' ? 'القيمة بالعربية' : 'Value (Arabic)'}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 break-all">{setting.value_ar || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {language === 'ar' ? 'القيمة بالإنجليزية' : 'Value (English)'}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 break-all">{setting.value_en || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSettings.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">
            {language === 'ar' ? 'لا توجد إعدادات' : 'No settings found'}
          </p>
        </div>
      )}
    </div>
  );
}

function SettingForm({
  setting,
  onSave,
  onCancel,
  language,
}: {
  setting: SiteSetting | null;
  onSave: (setting: Partial<SiteSetting>) => void;
  onCancel: () => void;
  language: string;
}) {
  const [formData, setFormData] = useState({
    key: setting?.key || '',
    value_ar: setting?.value_ar || '',
    value_en: setting?.value_en || '',
    description: setting?.description || '',
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(setting?.value_ar || setting?.value_en || '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'ar' ? 'الرجاء اختيار صورة فقط' : 'Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.key}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, value_ar: publicUrl, value_en: publicUrl });
      setImagePreview(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(setting ? { ...formData, id: setting.id } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'المفتاح' : 'Key'}
          </label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
            disabled={!!setting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'الوصف' : 'Description'}
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {formData.key.includes('_url') ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'رفع صورة' : 'Upload Image'}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                <Upload size={18} />
                {uploading ? (language === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (language === 'ar' ? 'اختر صورة' : 'Choose Image')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-auto object-contain border border-gray-200 rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رابط الصورة (عربي)' : 'Image URL (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.value_ar}
                onChange={(e) => setFormData({ ...formData, value_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رابط الصورة (إنجليزي)' : 'Image URL (English)'}
              </label>
              <input
                type="text"
                value={formData.value_en}
                onChange={(e) => setFormData({ ...formData, value_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'القيمة بالعربية' : 'Value (Arabic)'}
            </label>
            <textarea
              value={formData.value_ar}
              onChange={(e) => setFormData({ ...formData, value_ar: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'القيمة بالإنجليزية' : 'Value (English)'}
            </label>
            <textarea
              value={formData.value_en}
              onChange={(e) => setFormData({ ...formData, value_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <X size={18} />
          {language === 'ar' ? 'إلغاء' : 'Cancel'}
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save size={18} />
          {language === 'ar' ? 'حفظ' : 'Save'}
        </button>
      </div>
    </form>
  );
}