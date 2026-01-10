import { Calendar, User, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Article = {
  id: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  author: { en: string; ar: string };
  date: string;
  views: number;
  category: { en: string; ar: string };
  image?: string;
};

const sampleArticles: Article[] = [
  {
    id: '1',
    title: {
      en: 'Strategic Transformations in the Region: An Analytical Reading',
      ar: 'التحولات الاستراتيجية في المنطقة: قراءة تحليلية'
    },
    excerpt: {
      en: 'In-depth analysis of regional developments and their impact on the Yemeni political landscape and international relations...',
      ar: 'تحليل معمق للتطورات الإقليمية وتأثيرها على المشهد السياسي اليمني والعلاقات الدولية...'
    },
    author: {
      en: 'Dr. Ahmed Mohammed',
      ar: 'د. أحمد محمد'
    },
    date: '2025-11-25',
    views: 1250,
    category: {
      en: 'Analysis',
      ar: 'التحليلات'
    },
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: {
      en: 'Yemeni-British Relations: Reality and Prospects',
      ar: 'العلاقات اليمنية البريطانية: الواقع والآفاق'
    },
    excerpt: {
      en: 'Comprehensive overview of the trajectory of diplomatic relations and opportunities for future cooperation...',
      ar: 'استعراض شامل لمسار العلاقات الدبلوماسية وفرص التعاون المستقبلي...'
    },
    author: {
      en: 'Ms. Fatima Ali',
      ar: 'أ. فاطمة علي'
    },
    date: '2025-11-23',
    views: 980,
    category: {
      en: 'Policy Papers',
      ar: 'أوراق سياسات'
    },
    image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: {
      en: 'Yemen\'s Role in Regional Security',
      ar: 'الدور اليمني في الأمن الإقليمي'
    },
    excerpt: {
      en: 'Analytical study on Yemen\'s strategic position and its impact on Red Sea security and the region...',
      ar: 'دراسة تحليلية حول موقع اليمن الاستراتيجي وتأثيره على أمن البحر الأحمر والمنطقة...'
    },
    author: {
      en: 'Dr. Mohammed Salem',
      ar: 'د. محمد سالم'
    },
    date: '2025-11-20',
    views: 1540,
    category: {
      en: 'Periodic Reports',
      ar: 'التقارير الدورية'
    },
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
];

export default function FeaturedArticles() {
  const { language, t } = useLanguage();

  return (
    <section id="publications" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('articles.title')}</h2>
          <p className="text-xl text-gray-600">{t('articles.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleArticles.map((article, index) => (
            <article
              key={article.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2 hover:scale-105 animate-slideUp"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="h-48 bg-gradient-to-br from-emerald-100 via-emerald-50 to-gray-50 relative overflow-hidden">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={language === 'ar' ? article.title.ar : article.title.en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-gray-50"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                  <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full font-medium shadow-lg">
                    {language === 'ar' ? article.category.ar : article.category.en}
                  </span>
                </div>
              </div>

              <div className={`p-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors leading-snug">
                  {language === 'ar' ? article.title.ar : article.title.en}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {language === 'ar' ? article.excerpt.ar : article.excerpt.en}
                </p>

                <div className={`flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center space-x-4 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                    <div className={`flex items-center space-x-1 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                      <User className="w-4 h-4" />
                      <span>{language === 'ar' ? article.author.ar : article.author.en}</span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-4 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                    <div className={`flex items-center space-x-1 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                      <Eye className="w-4 h-4" />
                      <span>{article.views}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/briefings"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
          >
            {t('articles.viewall')}
          </a>
        </div>
      </div>
    </section>
  );
}
