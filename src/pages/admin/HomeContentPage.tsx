import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, Upload, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

interface HeroContent {
  id: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  cta_text_ar: string;
  cta_text_en: string;
  cta_link: string;
  is_active: boolean;
}

interface HeroSlide {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

interface SiteStat {
  id: string;
  label_ar: string;
  label_en: string;
  value: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

interface WhyRaydanPoint {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

export default function HomeContentPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'slides' | 'stats' | 'why'>('hero');
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [whyPoints, setWhyPoints] = useState<WhyRaydanPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingHero, setEditingHero] = useState(false);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [editingStat, setEditingStat] = useState<string | null>(null);
  const [editingWhy, setEditingWhy] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [heroRes, slidesRes, statsRes, whyRes] = await Promise.all([
        supabase.from('hero_content').select('*').eq('is_active', true).maybeSingle(),
        supabase.from('hero_slides').select('*').order('display_order'),
        supabase.from('site_stats').select('*').order('display_order'),
        supabase.from('why_raydan_points').select('*').order('display_order'),
      ]);

      if (heroRes.data) setHeroContent(heroRes.data);
      if (slidesRes.data) setSlides(slidesRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (whyRes.data) setWhyPoints(whyRes.data);
    } catch (error) {
      console.error('Error loading content:', error);
      showMessage('error', 'حدث خطأ في تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveHero = async () => {
    if (!heroContent) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('hero_content')
        .upsert({
          ...heroContent,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showMessage('success', 'تم حفظ التغييرات بنجاح');
      setEditingHero(false);
      loadContent();
    } catch (error) {
      console.error('Error saving hero:', error);
      showMessage('error', 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const saveStat = async (stat: SiteStat) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_stats')
        .upsert({
          ...stat,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showMessage('success', 'تم حفظ التغييرات بنجاح');
      setEditingStat(null);
      loadContent();
    } catch (error) {
      console.error('Error saving stat:', error);
      showMessage('error', 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const saveWhyPoint = async (point: WhyRaydanPoint) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('why_raydan_points')
        .upsert({
          ...point,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showMessage('success', 'تم حفظ التغييرات بنجاح');
      setEditingWhy(null);
      loadContent();
    } catch (error) {
      console.error('Error saving why point:', error);
      showMessage('error', 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const deleteStat = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الإحصائية؟')) return;

    try {
      const { error } = await supabase.from('site_stats').delete().eq('id', id);

      if (error) throw error;

      showMessage('success', 'تم الحذف بنجاح');
      loadContent();
    } catch (error) {
      console.error('Error deleting stat:', error);
      showMessage('error', 'حدث خطأ أثناء الحذف');
    }
  };

  const deleteWhyPoint = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه النقطة؟')) return;

    try {
      const { error } = await supabase.from('why_raydan_points').delete().eq('id', id);

      if (error) throw error;

      showMessage('success', 'تم الحذف بنجاح');
      loadContent();
    } catch (error) {
      console.error('Error deleting why point:', error);
      showMessage('error', 'حدث خطأ أثناء الحذف');
    }
  };

  const handleImageUpload = async (file: File, slideId: string) => {
    if (!file) return null;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'نوع الملف غير مدعوم. يرجى رفع صورة JPG أو PNG أو WebP');
      return null;
    }

    if (file.size > 7340032) {
      showMessage('error', 'حجم الملف كبير جداً. الحد الأقصى 7 ميجابايت');
      return null;
    }

    setUploadingImage(slideId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${slideId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'حدث خطأ أثناء رفع الصورة');
      return null;
    } finally {
      setUploadingImage(null);
    }
  };

  const saveSlide = async (slide: HeroSlide, keepEditing = false) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('hero_slides')
        .upsert({
          ...slide,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showMessage('success', 'تم حفظ التغييرات بنجاح');
      if (!keepEditing) {
        setEditingSlide(null);
      }
      loadContent();
    } catch (error) {
      console.error('Error saving slide:', error);
      showMessage('error', 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id: string, imageUrl: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      if (imageUrl && imageUrl.includes('hero-images')) {
        const filePath = imageUrl.split('hero-images/')[1];
        if (filePath) {
          await supabase.storage.from('hero-images').remove([filePath]);
        }
      }

      const { error } = await supabase.from('hero_slides').delete().eq('id', id);

      if (error) throw error;

      showMessage('success', 'تم الحذف بنجاح');
      loadContent();
    } catch (error) {
      console.error('Error deleting slide:', error);
      showMessage('error', 'حدث خطأ أثناء الحذف');
    }
  };

  const addNewSlide = async () => {
    const newSlide: Partial<HeroSlide> = {
      title_ar: 'عنوان جديد',
      title_en: 'New Title',
      description_ar: 'وصف جديد',
      description_en: 'New Description',
      image_url: '',
      display_order: slides.length + 1,
      is_active: true,
    };

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .insert(newSlide)
        .select()
        .single();

      if (error) throw error;

      showMessage('success', 'تمت إضافة الصورة بنجاح');
      loadContent();
      if (data) setEditingSlide(data.id);
    } catch (error) {
      console.error('Error adding slide:', error);
      showMessage('error', 'حدث خطأ أثناء الإضافة');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">جاري التحميل...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">محتوى الصفحة الرئيسية</h1>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex space-x-4 space-x-reverse border-b border-gray-200">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'hero'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            قسم البطل (Hero)
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'slides'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            صور الهيرو
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'stats'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            الإحصائيات
          </button>
          <button
            onClick={() => setActiveTab('why')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'why'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            لماذا ريدان
          </button>
        </div>

        {activeTab === 'hero' && heroContent && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">محتوى قسم البطل</h2>
              {!editingHero ? (
                <button
                  onClick={() => setEditingHero(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Edit2 className="w-4 h-4" />
                  تعديل
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={saveHero}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditingHero(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان (عربي)
                  </label>
                  <input
                    type="text"
                    value={heroContent.title_ar}
                    onChange={(e) => setHeroContent({ ...heroContent, title_ar: e.target.value })}
                    disabled={!editingHero}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان (English)
                  </label>
                  <input
                    type="text"
                    value={heroContent.title_en}
                    onChange={(e) => setHeroContent({ ...heroContent, title_en: e.target.value })}
                    disabled={!editingHero}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    النص الفرعي (عربي)
                  </label>
                  <textarea
                    value={heroContent.subtitle_ar}
                    onChange={(e) => setHeroContent({ ...heroContent, subtitle_ar: e.target.value })}
                    disabled={!editingHero}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    النص الفرعي (English)
                  </label>
                  <textarea
                    value={heroContent.subtitle_en}
                    onChange={(e) => setHeroContent({ ...heroContent, subtitle_en: e.target.value })}
                    disabled={!editingHero}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نص الزر (عربي)
                  </label>
                  <input
                    type="text"
                    value={heroContent.cta_text_ar}
                    onChange={(e) => setHeroContent({ ...heroContent, cta_text_ar: e.target.value })}
                    disabled={!editingHero}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نص الزر (English)
                  </label>
                  <input
                    type="text"
                    value={heroContent.cta_text_en}
                    onChange={(e) => setHeroContent({ ...heroContent, cta_text_en: e.target.value })}
                    disabled={!editingHero}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط الزر
                  </label>
                  <input
                    type="text"
                    value={heroContent.cta_link}
                    onChange={(e) => setHeroContent({ ...heroContent, cta_link: e.target.value })}
                    disabled={!editingHero}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slides' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={addNewSlide}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                إضافة صورة جديدة
              </button>
            </div>

            {slides.map((slide) => (
              <div key={slide.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    صورة #{slide.display_order}
                  </h3>
                  <div className="flex gap-2">
                    {editingSlide !== slide.id ? (
                      <>
                        <button
                          onClick={() => setEditingSlide(slide.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSlide(slide.id, slide.image_url)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            const currentSlide = slides.find(s => s.id === slide.id);
                            if (currentSlide) saveSlide(currentSlide);
                          }}
                          disabled={saving}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingSlide(null)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        صورة الخلفية
                      </label>
                      <div className="flex items-start gap-4">
                        {slide.image_url ? (
                          <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={slide.image_url}
                              alt={slide.title_ar}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">لا توجد صورة</p>
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file && editingSlide === slide.id) {
                                const url = await handleImageUpload(file, slide.id);
                                if (url) {
                                  const updatedSlide = { ...slide, image_url: url };
                                  const updated = slides.map((s) =>
                                    s.id === slide.id ? updatedSlide : s
                                  );
                                  setSlides(updated);

                                  await saveSlide(updatedSlide, true);
                                }
                              }
                            }}
                            disabled={editingSlide !== slide.id || uploadingImage === slide.id}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"
                          />
                          {uploadingImage === slide.id && (
                            <p className="text-sm text-emerald-600 mt-2">جاري رفع الصورة...</p>
                          )}
                          {saving && editingSlide === slide.id && (
                            <p className="text-sm text-blue-600 mt-2">جاري الحفظ...</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, WebP - الحد الأقصى 7 ميجابايت (يتم الحفظ تلقائياً بعد الرفع)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان (عربي)
                      </label>
                      <input
                        type="text"
                        value={slide.title_ar}
                        onChange={(e) => {
                          const updated = slides.map((s) =>
                            s.id === slide.id ? { ...s, title_ar: e.target.value } : s
                          );
                          setSlides(updated);
                        }}
                        disabled={editingSlide !== slide.id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان (English)
                      </label>
                      <input
                        type="text"
                        value={slide.title_en}
                        onChange={(e) => {
                          const updated = slides.map((s) =>
                            s.id === slide.id ? { ...s, title_en: e.target.value } : s
                          );
                          setSlides(updated);
                        }}
                        disabled={editingSlide !== slide.id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف (عربي)
                      </label>
                      <textarea
                        value={slide.description_ar}
                        onChange={(e) => {
                          const updated = slides.map((s) =>
                            s.id === slide.id ? { ...s, description_ar: e.target.value } : s
                          );
                          setSlides(updated);
                        }}
                        disabled={editingSlide !== slide.id}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف (English)
                      </label>
                      <textarea
                        value={slide.description_en}
                        onChange={(e) => {
                          const updated = slides.map((s) =>
                            s.id === slide.id ? { ...s, description_en: e.target.value } : s
                          );
                          setSlides(updated);
                        }}
                        disabled={editingSlide !== slide.id}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ترتيب العرض
                      </label>
                      <input
                        type="number"
                        value={slide.display_order}
                        onChange={(e) => {
                          const updated = slides.map((s) =>
                            s.id === slide.id
                              ? { ...s, display_order: parseInt(e.target.value) || 0 }
                              : s
                          );
                          setSlides(updated);
                        }}
                        disabled={editingSlide !== slide.id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحالة
                      </label>
                      <select
                        value={slide.is_active ? 'active' : 'inactive'}
                        onChange={(e) => {
                          const updated = slides.map((s) =>
                            s.id === slide.id ? { ...s, is_active: e.target.value === 'active' } : s
                          );
                          setSlides(updated);
                        }}
                        disabled={editingSlide !== slide.id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      >
                        <option value="active">مفعّل</option>
                        <option value="inactive">غير مفعّل</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">إحصائية</h3>
                  <div className="flex gap-2">
                    {editingStat !== stat.id ? (
                      <>
                        <button
                          onClick={() => setEditingStat(stat.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStat(stat.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => saveStat(stat)}
                          disabled={saving}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingStat(null)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التسمية (عربي)
                    </label>
                    <input
                      type="text"
                      value={stat.label_ar}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, label_ar: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      disabled={editingStat !== stat.id}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التسمية (English)
                    </label>
                    <input
                      type="text"
                      value={stat.label_en}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, label_en: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      disabled={editingStat !== stat.id}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">القيمة</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, value: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      disabled={editingStat !== stat.id}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الأيقونة</label>
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => {
                        const updated = stats.map((s) =>
                          s.id === stat.id ? { ...s, icon: e.target.value } : s
                        );
                        setStats(updated);
                      }}
                      disabled={editingStat !== stat.id}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      dir="ltr"
                      placeholder="BookOpen, Users, etc."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'why' && (
          <div className="space-y-4">
            {whyPoints.map((point) => (
              <div key={point.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">نقطة</h3>
                  <div className="flex gap-2">
                    {editingWhy !== point.id ? (
                      <>
                        <button
                          onClick={() => setEditingWhy(point.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteWhyPoint(point.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => saveWhyPoint(point)}
                          disabled={saving}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingWhy(null)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان (عربي)
                      </label>
                      <input
                        type="text"
                        value={point.title_ar}
                        onChange={(e) => {
                          const updated = whyPoints.map((p) =>
                            p.id === point.id ? { ...p, title_ar: e.target.value } : p
                          );
                          setWhyPoints(updated);
                        }}
                        disabled={editingWhy !== point.id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان (English)
                      </label>
                      <input
                        type="text"
                        value={point.title_en}
                        onChange={(e) => {
                          const updated = whyPoints.map((p) =>
                            p.id === point.id ? { ...p, title_en: e.target.value } : p
                          );
                          setWhyPoints(updated);
                        }}
                        disabled={editingWhy !== point.id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الأيقونة</label>
                      <input
                        type="text"
                        value={point.icon}
                        onChange={(e) => {
                          const updated = whyPoints.map((p) =>
                            p.id === point.id ? { ...p, icon: e.target.value } : p
                          );
                          setWhyPoints(updated);
                        }}
                        disabled={editingWhy !== point.id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                        dir="ltr"
                        placeholder="Target, Eye, Users, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف (عربي)
                      </label>
                      <textarea
                        value={point.description_ar}
                        onChange={(e) => {
                          const updated = whyPoints.map((p) =>
                            p.id === point.id ? { ...p, description_ar: e.target.value } : p
                          );
                          setWhyPoints(updated);
                        }}
                        disabled={editingWhy !== point.id}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف (English)
                      </label>
                      <textarea
                        value={point.description_en}
                        onChange={(e) => {
                          const updated = whyPoints.map((p) =>
                            p.id === point.id ? { ...p, description_en: e.target.value } : p
                          );
                          setWhyPoints(updated);
                        }}
                        disabled={editingWhy !== point.id}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                        dir="ltr"
                      />
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
