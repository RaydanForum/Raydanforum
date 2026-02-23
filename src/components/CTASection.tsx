import { ArrowLeft, ArrowRight, Mail, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CTASection() {
  const { language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className={`bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 lg:p-12 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 animate-slideUp ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm ${language === 'ar' ? 'float-right ml-4' : 'float-left mr-4'}`}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {language === 'ar' ? 'انضم كعضو' : 'Join as Member'}
            </h3>
            <p className="text-emerald-50 text-lg mb-8 leading-relaxed">
              {language === 'ar'
                ? 'كن جزءاً من شبكة الخبراء والباحثين في منتدى ريدان واحصل على وصول حصري للمنشورات والفعاليات'
                : 'Be part of Raydan Forum\'s network of experts and researchers and get exclusive access to publications and events'}
            </p>
            <a
              href="/membership"
              className={`inline-flex items-center px-8 py-4 bg-white text-emerald-700 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                language === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              {language === 'ar' ? 'التقديم الآن' : 'Apply Now'}
              <Arrow className={`${language === 'ar' ? 'mr-2' : 'ml-2'} w-5 h-5`} />
            </a>
          </div>

          <div
            className={`bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 lg:p-12 shadow-2xl hover:shadow-teal-500/20 transition-all duration-500 hover:-translate-y-2 animate-slideUp ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            style={{ animationDelay: '150ms' }}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm ${language === 'ar' ? 'float-right ml-4' : 'float-left mr-4'}`}>
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {language === 'ar' ? 'اشترك في النشرة' : 'Subscribe to Newsletter'}
            </h3>
            <p className="text-teal-50 text-lg mb-8 leading-relaxed">
              {language === 'ar'
                ? 'احصل على آخر التحليلات والأبحاث الاستراتيجية مباشرة في بريدك الإلكتروني'
                : 'Get the latest strategic analyses and research directly in your email'}
            </p>
            <a
              href="#newsletter"
              className={`inline-flex items-center px-8 py-4 bg-white text-teal-700 rounded-lg font-bold hover:bg-teal-50 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                language === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
              <Arrow className={`${language === 'ar' ? 'mr-2' : 'ml-2'} w-5 h-5`} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
