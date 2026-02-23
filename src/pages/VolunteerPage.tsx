import { Heart, Send, Upload, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

const volunteerAreas = [
  { value: 'content_writing', ar: 'كتابة محتوى', en: 'Content Writing' },
  { value: 'design_editing', ar: 'تصميم / مونتاج', en: 'Design / Editing' },
  { value: 'marketing_media', ar: 'تسويق وإعلام', en: 'Marketing & Media' },
  { value: 'events', ar: 'تنظيم فعاليات', en: 'Events' },
  { value: 'translation', ar: 'ترجمة', en: 'Translation' },
  { value: 'technical_support', ar: 'دعم تقني', en: 'Technical Support' },
  { value: 'other', ar: 'أخرى', en: 'Other' },
];

const availabilityOptions = [
  { value: 'few_hours_weekly', ar: 'ساعات محدودة أسبوعيًا', en: 'Few hours weekly' },
  { value: 'part_time', ar: 'دوام جزئي', en: 'Part-time' },
  { value: 'as_needed', ar: 'حسب الحاجة', en: 'As needed' },
];

export default function VolunteerPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cityCountry: '',
    areas: [] as string[],
    otherAreaDetail: '',
    availability: '',
    motivation: '',
    consentData: false,
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentData || formData.areas.length === 0 || !formData.availability) return;
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      let cvUrl = '';
      if (cvFile) {
        const ext = cvFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('volunteer-attachments')
          .upload(fileName, cvFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage
          .from('volunteer-attachments')
          .getPublicUrl(fileName);
        cvUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('volunteer_applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city_country: formData.cityCountry,
          volunteering_areas: formData.areas,
          other_area_detail: formData.areas.includes('other') ? formData.otherAreaDetail : '',
          availability: formData.availability,
          motivation: formData.motivation,
          cv_url: cvUrl,
          consent_data_storage: formData.consentData,
        },
      ]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text:
          language === 'ar'
            ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.'
            : 'Your application has been submitted successfully! We will contact you soon.',
      });

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        cityCountry: '',
        areas: [],
        otherAreaDetail: '',
        availability: '',
        motivation: '',
        consentData: false,
      });
      setCvFile(null);
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      setSubmitMessage({
        type: 'error',
        text:
          language === 'ar'
            ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
            : 'An error occurred while submitting. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArea = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.includes(value)
        ? prev.areas.filter((a) => a !== value)
        : [...prev.areas, value],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-80 lg:h-96 overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/95 to-teal-800/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Heart className="w-12 h-12 text-teal-300" />
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                {language === 'ar' ? 'تطوع معنا' : 'Volunteer with Us'}
              </h1>
            </div>
            <p className="text-lg text-teal-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'انضم إلى فريق منصة ريدان كمتطوع/ـة. عبّئ النموذج وسنتواصل معك قريبًا.'
                : "Join Raydan Forum as a volunteer. Fill the form and we'll contact you soon."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="volEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                </label>
                <input
                  type="email"
                  id="volEmail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="volPhone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  id="volPhone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="volCity" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === 'ar' ? 'المدينة / البلد *' : 'City / Country *'}
              </label>
              <input
                type="text"
                id="volCity"
                value={formData.cityCountry}
                onChange={(e) => setFormData({ ...formData, cityCountry: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'ar' ? 'مجال التطوع * (اختر واحدًا أو أكثر)' : 'Volunteering Area * (Select one or more)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {volunteerAreas.map((area) => (
                  <button
                    key={area.value}
                    type="button"
                    onClick={() => toggleArea(area.value)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      formData.areas.includes(area.value)
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}
                  >
                    {language === 'ar' ? area.ar : area.en}
                  </button>
                ))}
              </div>
              {formData.areas.includes('other') && (
                <input
                  type="text"
                  value={formData.otherAreaDetail}
                  onChange={(e) => setFormData({ ...formData, otherAreaDetail: e.target.value })}
                  placeholder={language === 'ar' ? 'يرجى التوضيح...' : 'Please specify...'}
                  className="mt-3 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'ar' ? 'الوقت المتاح *' : 'Availability *'}
              </label>
              <div className="flex flex-wrap gap-3">
                {availabilityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, availability: opt.value })}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      formData.availability === opt.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}
                  >
                    {language === 'ar' ? opt.ar : opt.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === 'ar' ? 'لماذا ترغب بالتطوع معنا؟ *' : 'Why do you want to volunteer with us? *'}
              </label>
              <textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {language === 'ar' ? 'إرفاق سيرة ذاتية أو نماذج أعمال (اختياري)' : 'Upload CV / Work samples (Optional)'}
              </label>
              {cvFile ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Upload className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{cvFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setCvFile(null)}
                    className="p-1 text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'اختر ملف' : 'Choose file'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCvFile(file);
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={formData.consentData}
                onChange={(e) => setFormData({ ...formData, consentData: e.target.checked })}
                required
                className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                {language === 'ar'
                  ? 'أوافق على الاحتفاظ ببياناتي لغرض التواصل بشأن التطوع'
                  : 'I agree to data storage for volunteering contact'}
              </span>
            </label>

            {submitMessage && (
              <div
                className={`p-4 rounded-lg ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {language === 'ar' ? 'إرسال الطلب' : 'Submit Application'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
