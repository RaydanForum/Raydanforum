import { useState, useEffect, FormEvent } from 'react';
import { Building2, MapPin, Phone, Mail, Clock, Globe, Save, Loader2, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { BusinessInfo, BusinessHours } from '../../lib/seo';

export default function BusinessInfoPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setBusinessInfo(data);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
      setMessage({ type: 'error', text: 'فشل في تحميل معلومات المنشأة' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!businessInfo) return;

    try {
      setSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from('business_info')
        .upsert({
          ...businessInfo,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'تم حفظ معلومات المنشأة بنجاح' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving business info:', error);
      setMessage({ type: 'error', text: 'فشل في حفظ معلومات المنشأة' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof BusinessInfo, value: any) => {
    if (!businessInfo) return;
    setBusinessInfo({ ...businessInfo, [field]: value });
  };

  const updateBusinessHours = (day: keyof BusinessHours, field: keyof BusinessHours[keyof BusinessHours], value: any) => {
    if (!businessInfo) return;
    const newHours = {
      ...businessInfo.business_hours,
      [day]: {
        ...businessInfo.business_hours[day],
        [field]: value,
      },
    };
    setBusinessInfo({ ...businessInfo, business_hours: newHours });
  };

  const updateSocialMedia = (platform: string, url: string) => {
    if (!businessInfo) return;
    const newSocialMedia = { ...businessInfo.social_media, [platform]: url };
    setBusinessInfo({ ...businessInfo, social_media: newSocialMedia });
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

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">معلومات المنشأة والموقع</h1>
            <p className="text-gray-600 mt-1">إدارة معلومات NAP وبيانات SEO المحلي</p>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Building2 className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold">المعلومات الأساسية</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنشأة (عربي)
                </label>
                <input
                  type="text"
                  value={businessInfo?.business_name_ar || ''}
                  onChange={(e) => updateField('business_name_ar', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنشأة (English)
                </label>
                <input
                  type="text"
                  value={businessInfo?.business_name || ''}
                  onChange={(e) => updateField('business_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف (عربي)
                </label>
                <textarea
                  value={businessInfo?.description_ar || ''}
                  onChange={(e) => updateField('description_ar', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف (English)
                </label>
                <textarea
                  value={businessInfo?.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold">معلومات العنوان (NAP)</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان (عربي)
                </label>
                <input
                  type="text"
                  value={businessInfo?.address_ar || ''}
                  onChange={(e) => updateField('address_ar', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان (English)
                </label>
                <input
                  type="text"
                  value={businessInfo?.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة (عربي)
                </label>
                <input
                  type="text"
                  value={businessInfo?.city_ar || ''}
                  onChange={(e) => updateField('city_ar', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة (English)
                </label>
                <input
                  type="text"
                  value={businessInfo?.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدولة (عربي)
                </label>
                <input
                  type="text"
                  value={businessInfo?.country_ar || ''}
                  onChange={(e) => updateField('country_ar', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدولة (English)
                </label>
                <input
                  type="text"
                  value={businessInfo?.country || ''}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرمز البريدي
                </label>
                <input
                  type="text"
                  value={businessInfo?.postal_code || ''}
                  onChange={(e) => updateField('postal_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سنة التأسيس
                </label>
                <input
                  type="number"
                  value={businessInfo?.founded_year || 2024}
                  onChange={(e) => updateField('founded_year', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Phone className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold">معلومات الاتصال</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline ml-1" />
                  رقم الهاتف الأساسي
                </label>
                <input
                  type="tel"
                  value={businessInfo?.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline ml-1" />
                  رقم الهاتف الثانوي
                </label>
                <input
                  type="tel"
                  value={businessInfo?.phone_secondary || ''}
                  onChange={(e) => updateField('phone_secondary', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline ml-1" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={businessInfo?.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Globe className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold">وسائل التواصل الاجتماعي</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={businessInfo?.social_media?.twitter || ''}
                  onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                  placeholder="https://twitter.com/raydanforum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={businessInfo?.social_media?.linkedin || ''}
                  onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/raydanforum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={businessInfo?.social_media?.facebook || ''}
                  onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                  placeholder="https://facebook.com/raydanforum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط Google Business Profile
                </label>
                <input
                  type="url"
                  value={businessInfo?.google_business_profile_url || ''}
                  onChange={(e) => updateField('google_business_profile_url', e.target.value)}
                  placeholder="https://g.page/raydanforum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>حفظ التغييرات</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
