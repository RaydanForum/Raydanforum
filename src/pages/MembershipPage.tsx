import { CheckCircle, Send, Users, User, Building2, Upload, Loader2, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

const individualBenefits = {
  ar: [
    'دعوات وإشعارات مبكرة لفعاليات منصة ريدان',
    'الوصول لتحديثات وملخصات المنتدى',
    'فرص تواصل وشبكات مع الأعضاء',
    'أولوية المشاركة حسب المقاعد المتاحة',
  ],
  en: [
    'Early event updates and invitations',
    'Access to forum updates & briefings',
    'Networking opportunities with members',
    'Priority access (subject to capacity)',
  ],
};

const institutionalBenefits = {
  ar: [
    'جميع مميزات العضوية الفردية',
    'أولوية التسجيل في الفعاليات',
    'فرص تعاون ومبادرات مشتركة',
    'إبراز اسم المؤسسة ضمن منصة ريدان',
  ],
  en: [
    'All Individual membership benefits',
    'Priority event registration',
    'Collaboration opportunities',
    'Organization visibility on Raydan Forum',
  ],
};

const membershipTerms = {
  ar: [
    'يجب ألا يقل عمر المتقدم عن 18 سنة.',
    'يجب أن تكون البيانات دقيقة وصحيحة.',
    'الالتزام برسالة وقيم منصة ريدان واحترام السرية.',
    'رسوم العضوية (إن وجدت) غير قابلة للاسترداد.',
    'تحتفظ منصة ريدان بحق قبول/رفض الطلب أو إلغاء العضوية عند المخالفة.',
    'سيتم التواصل عبر البريد الإلكتروني ويجب تحديث بيانات التواصل عند تغييرها.',
  ],
  en: [
    'Applicants must be 18+.',
    'All information must be accurate.',
    'Members must uphold the mission and confidentiality.',
    'Fees (if applicable) are non-refundable.',
    'Raydan Forum may accept/reject or revoke membership if terms are violated.',
    'Communication is by email; keep details updated.',
  ],
};

export default function MembershipPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    membershipTier: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cityCountry: '',
    address: '',
    organizationName: '',
    organizationWebsite: '',
    roleTitle: '',
    consentAge: false,
    consentTerms: false,
    consentData: false,
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentAge || !formData.consentTerms || !formData.consentData) return;
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      let attachmentUrl = '';
      if (attachmentFile) {
        const ext = attachmentFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('membership-attachments')
          .upload(fileName, attachmentFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage
          .from('membership-attachments')
          .getPublicUrl(fileName);
        attachmentUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('membership_applications').insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city_country: formData.cityCountry,
          address: formData.address || '',
          membership_tier: formData.membershipTier,
          organization: formData.membershipTier === 'institutional' ? formData.organizationName : '',
          website_url: formData.membershipTier === 'institutional' ? formData.organizationWebsite : '',
          position: formData.membershipTier === 'institutional' ? formData.roleTitle : '',
          cv_url: attachmentUrl,
          consent_age: formData.consentAge,
          consent_terms: formData.consentTerms,
          consent_data_storage: formData.consentData,
        },
      ]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text:
          language === 'ar'
            ? 'تم إرسال طلبك بنجاح! سنتواصل معك عبر البريد الإلكتروني.'
            : 'Your application has been submitted successfully! We will contact you by email.',
      });

      setFormData({
        membershipTier: 'individual',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cityCountry: '',
        address: '',
        organizationName: '',
        organizationWebsite: '',
        roleTitle: '',
        consentAge: false,
        consentTerms: false,
        consentData: false,
      });
      setAttachmentFile(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitMessage({
        type: 'error',
        text:
          language === 'ar'
            ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
            : 'An error occurred while submitting your application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowed.includes(file.type)) {
        alert(language === 'ar' ? 'يرجى رفع ملف PDF أو JPG أو PNG فقط' : 'Please upload PDF, JPG, or PNG only');
        return;
      }
      setAttachmentFile(file);
    }
  };

  return (
    <>
      <SEOHead pagePath="/membership" />
      <div className="min-h-screen bg-gray-50">
        <div
          className="relative h-80 lg:h-96 overflow-hidden"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 to-amber-800/90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Users className="w-12 h-12 text-amber-300" />
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  {language === 'ar' ? 'تقديم عضوية' : 'Membership Application'}
                </h1>
              </div>
              <p className="text-lg text-amber-100 max-w-2xl leading-relaxed">
                {language === 'ar'
                  ? 'قدّم الآن للانضمام كعضو. تعبئة النموذج تستغرق أقل من دقيقة، وسنتواصل معك عبر البريد الإلكتروني.'
                  : "Apply to become a member. It takes less than a minute. We'll contact you by email."}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                <div className={`flex items-center gap-3 mb-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Send className="w-7 h-7 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === 'ar' ? 'نموذج العضوية' : 'Application Form'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {language === 'ar' ? 'نوع العضوية *' : 'Membership Type *'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, membershipTier: 'individual' })}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          formData.membershipTier === 'individual'
                            ? 'border-amber-500 bg-amber-50 shadow-md'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <User
                          className={`w-6 h-6 ${
                            formData.membershipTier === 'individual' ? 'text-amber-600' : 'text-gray-400'
                          }`}
                        />
                        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                          <p className="font-semibold text-gray-900">
                            {language === 'ar' ? 'عضوية فردية' : 'Individual'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === 'ar' ? 'للأفراد' : 'For individuals'}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, membershipTier: 'institutional' })}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          formData.membershipTier === 'institutional'
                            ? 'border-amber-500 bg-amber-50 shadow-md'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <Building2
                          className={`w-6 h-6 ${
                            formData.membershipTier === 'institutional' ? 'text-amber-600' : 'text-gray-400'
                          }`}
                        />
                        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                          <p className="font-semibold text-gray-900">
                            {language === 'ar' ? 'عضوية مؤسسية' : 'Institutional'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === 'ar' ? 'للمؤسسات' : 'For organizations'}
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        {language === 'ar' ? 'الاسم الأول *' : 'First Name *'}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        {language === 'ar' ? 'اسم العائلة *' : 'Last Name *'}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                        {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="cityCountry" className="block text-sm font-medium text-gray-700 mb-1.5">
                        {language === 'ar' ? 'المدينة / البلد *' : 'City / Country *'}
                      </label>
                      <input
                        type="text"
                        id="cityCountry"
                        name="cityCountry"
                        value={formData.cityCountry}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                      {language === 'ar' ? 'العنوان (اختياري)' : 'Address (Optional)'}
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {formData.membershipTier === 'institutional' && (
                    <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 space-y-5">
                      <h3 className="text-sm font-semibold text-amber-800">
                        {language === 'ar' ? 'معلومات المؤسسة' : 'Organization Details'}
                      </h3>
                      <div>
                        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1.5">
                          {language === 'ar' ? 'اسم المؤسسة *' : 'Organization Name *'}
                        </label>
                        <input
                          type="text"
                          id="organizationName"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="organizationWebsite" className="block text-sm font-medium text-gray-700 mb-1.5">
                            {language === 'ar' ? 'الموقع الإلكتروني (اختياري)' : 'Website (Optional)'}
                          </label>
                          <input
                            type="url"
                            id="organizationWebsite"
                            name="organizationWebsite"
                            value={formData.organizationWebsite}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-1.5">
                            {language === 'ar' ? 'المسمى/الدور (اختياري)' : 'Role/Title (Optional)'}
                          </label>
                          <input
                            type="text"
                            id="roleTitle"
                            name="roleTitle"
                            value={formData.roleTitle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {language === 'ar' ? 'مرفق (اختياري)' : 'Attachment (Optional)'}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      {language === 'ar' ? 'PDF / JPG / PNG (مثال: بطاقة تعريف / خطاب تعريفي)' : 'PDF / JPG / PNG (e.g., ID card / introduction letter)'}
                    </p>
                    {attachmentFile ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Upload className="w-5 h-5 text-amber-600" />
                        <span className="text-sm text-gray-700 flex-1 truncate">{attachmentFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachmentFile(null)}
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
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-3 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-600" />
                      {language === 'ar' ? 'إقرارات وموافقة *' : 'Declarations & Consent *'}
                    </h3>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consentAge"
                        checked={formData.consentAge}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'ar' ? 'أقر أن عمري 18 سنة أو أكثر' : 'I confirm I am 18+'}
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consentTerms"
                        checked={formData.consentTerms}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'ar'
                          ? 'أوافق على شروط العضوية والالتزام بالسرية'
                          : 'I agree to the membership terms and confidentiality'}
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consentData"
                        checked={formData.consentData}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'ar'
                          ? 'أوافق على حفظ بياناتي لغرض التواصل بخصوص العضوية'
                          : 'I agree to data storage for membership communication'}
                      </span>
                    </label>
                  </div>

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
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-7">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'مميزات العضوية الفردية' : 'Individual Benefits'}
                </h3>
                <ul className="space-y-3">
                  {(language === 'ar' ? individualBenefits.ar : individualBenefits.en).map((b, i) => (
                    <li key={i} className={`flex items-start gap-2 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-7">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  {language === 'ar' ? 'مميزات العضوية المؤسسية' : 'Institutional Benefits'}
                </h3>
                <ul className="space-y-3">
                  {(language === 'ar' ? institutionalBenefits.ar : institutionalBenefits.en).map((b, i) => (
                    <li key={i} className={`flex items-start gap-2 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-7">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  {language === 'ar' ? 'شروط العضوية' : 'Membership Terms'}
                </h3>
                <ul className="space-y-3">
                  {(language === 'ar' ? membershipTerms.ar : membershipTerms.en).map((t, i) => (
                    <li key={i} className={`flex items-start gap-2 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
