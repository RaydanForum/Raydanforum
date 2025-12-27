import { CheckCircle, FileText, Send, Users } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

export default function MembershipPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    membershipTier: 'individual'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const membershipTiers = [
    {
      id: 1,
      value: 'individual',
      name: {
        en: 'Individual Member',
        ar: 'عضوية فردية'
      }
    },
    {
      id: 2,
      value: 'institutional',
      name: {
        en: 'Institutional Member',
        ar: 'عضوية مؤسسية'
      }
    },
    {
      id: 3,
      value: 'founding',
      name: {
        en: 'Founding Partner',
        ar: 'شريك مؤسس'
      }
    }
  ];

  const terms = {
    en: [
      'Applicants must be at least 18 years of age',
      'All information provided must be accurate and truthful',
      'Members agree to uphold the values and mission of Raydan Forum',
      'Membership fees are non-refundable',
      'The Forum reserves the right to reject any application without providing reasons',
      'Members must respect the confidentiality of sensitive discussions and information',
      'Membership can be revoked if terms are violated',
      'Members will receive communication via email and should keep their contact information updated'
    ],
    ar: [
      'يجب أن يكون المتقدم بعمر 18 عامًا على الأقل',
      'يجب أن تكون جميع المعلومات المقدمة دقيقة وصحيحة',
      'يوافق الأعضاء على دعم قيم ورسالة منتدى ريدان',
      'رسوم العضوية غير قابلة للاسترداد',
      'يحتفظ المنتدى بالحق في رفض أي طلب دون تقديم أسباب',
      'يجب على الأعضاء احترام سرية المناقشات والمعلومات الحساسة',
      'يمكن إلغاء العضوية في حالة انتهاك الشروط',
      'سيتلقى الأعضاء التواصل عبر البريد الإلكتروني ويجب الحفاظ على تحديث معلومات الاتصال'
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const { error } = await supabase
        .from('membership_applications')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            membership_tier: formData.membershipTier
          }
        ]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text: language === 'ar'
          ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.'
          : 'Your application has been submitted successfully! We will contact you soon.'
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        membershipTier: 'individual'
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitMessage({
        type: 'error',
        text: language === 'ar'
          ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while submitting your application. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <SEOHead pagePath="/membership" />
      <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-96 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 to-amber-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-12 h-12 text-amber-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'العضوية والانضمام' : 'Membership'}
              </h1>
            </div>
            <p className="text-xl text-amber-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'انضم إلى مجتمعنا من الخبراء والممارسين المهتمين بالعلاقات الاستراتيجية'
                : 'Join our community of experts and practitioners interested in strategic relations'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'شروط العضوية' : 'Membership Terms'}
              </h2>
            </div>
            <ul className="space-y-4">
              {(language === 'ar' ? terms.ar : terms.en).map((term, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 leading-relaxed">{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'نموذج التسجيل' : 'Application Form'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={language === 'ar' ? 'أدخل الاسم الأول' : 'Enter first name'}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اللقب' : 'Last Name'}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={language === 'ar' ? 'أدخل اللقب' : 'Enter last name'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان' : 'Address'}
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder={language === 'ar' ? 'أدخل العنوان' : 'Enter address'}
                />
              </div>

              <div>
                <label htmlFor="membershipTier" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نوع العضوية' : 'Membership Type'}
                </label>
                <select
                  id="membershipTier"
                  name="membershipTier"
                  value={formData.membershipTier}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white cursor-pointer hover:border-blue-400 appearance-none bg-no-repeat bg-right pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: '1.5rem',
                    backgroundPosition: language === 'ar' ? 'left 0.75rem center' : 'right 0.75rem center'
                  }}
                >
                  {membershipTiers.map((tier) => (
                    <option key={tier.id} value={tier.value} className="py-2">
                      {language === 'ar' ? tier.name.ar : tier.name.en}
                    </option>
                  ))}
                </select>
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
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </div>
    </>
  );
}
