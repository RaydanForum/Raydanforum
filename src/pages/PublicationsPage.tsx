import { useEffect, useState } from 'react';
import { Calendar, User, Eye, FileText, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

type Article = {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  slug: string;
  featured_image: string;
  views_count: number;
  published_at: string;
  category?: {
    title_ar: string;
    title_en: string;
  };
};

export default function PublicationsPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sampleArticles: Article[] = [
    {
      id: '1',
      title_ar: 'التحولات الاستراتيجية في المنطقة: قراءة تحليلية',
      title_en: 'Strategic Transformations in the Region: An Analytical Reading',
      excerpt_ar: 'تحليل معمق للتطورات الإقليمية وتأثيرها على المشهد السياسي اليمني والعلاقات الدولية في منطقة البحر الأحمر والقرن الأفريقي',
      excerpt_en: 'In-depth analysis of regional developments and their impact on the Yemeni political landscape and international relations in the Red Sea and Horn of Africa region',
      slug: 'strategic-transformations',
      featured_image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      views_count: 1250,
      published_at: '2025-11-25',
      category: {
        title_ar: 'التحليلات',
        title_en: 'Analysis'
      }
    },
    {
      id: '2',
      title_ar: 'العلاقات اليمنية البريطانية: الواقع والآفاق',
      title_en: 'Yemeni-British Relations: Reality and Prospects',
      excerpt_ar: 'استعراض شامل لمسار العلاقات الدبلوماسية وفرص التعاون المستقبلي بين اليمن والمملكة المتحدة في المجالات السياسية والاقتصادية',
      excerpt_en: 'Comprehensive overview of the trajectory of diplomatic relations and opportunities for future cooperation between Yemen and the United Kingdom in political and economic fields',
      slug: 'yemen-uk-relations',
      featured_image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
      views_count: 980,
      published_at: '2025-11-23',
      category: {
        title_ar: 'أوراق سياسات',
        title_en: 'Policy Papers'
      }
    },
    {
      id: '3',
      title_ar: 'الدور اليمني في الأمن الإقليمي',
      title_en: 'Yemen\'s Role in Regional Security',
      excerpt_ar: 'دراسة تحليلية حول موقع اليمن الاستراتيجي وتأثيره على أمن البحر الأحمر والمنطقة، وأهمية دوره في استقرار المنطقة',
      excerpt_en: 'Analytical study on Yemen\'s strategic position and its impact on Red Sea security and the region, and the importance of its role in regional stability',
      slug: 'yemen-regional-security',
      featured_image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      views_count: 1540,
      published_at: '2025-11-20',
      category: {
        title_ar: 'التقارير الدورية',
        title_en: 'Periodic Reports'
      }
    },
    {
      id: '4',
      title_ar: 'الأبعاد الاقتصادية للأزمة اليمنية',
      title_en: 'Economic Dimensions of the Yemeni Crisis',
      excerpt_ar: 'تحليل شامل للتحديات الاقتصادية التي تواجه اليمن وسبل تعزيز الانتعاش الاقتصادي وإعادة الإعمار',
      excerpt_en: 'Comprehensive analysis of the economic challenges facing Yemen and ways to enhance economic recovery and reconstruction',
      slug: 'economic-dimensions',
      featured_image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      views_count: 1120,
      published_at: '2025-11-18',
      category: {
        title_ar: 'التحليلات',
        title_en: 'Analysis'
      }
    },
    {
      id: '5',
      title_ar: 'الحوار الوطني: الطريق نحو السلام المستدام',
      title_en: 'National Dialogue: The Road to Sustainable Peace',
      excerpt_ar: 'رؤية استشرافية لمسارات الحوار الوطني ودوره في بناء توافقات وطنية شاملة تضمن السلام المستدام',
      excerpt_en: 'A forward-looking vision of national dialogue paths and their role in building comprehensive national consensus to ensure sustainable peace',
      slug: 'national-dialogue',
      featured_image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      views_count: 890,
      published_at: '2025-11-15',
      category: {
        title_ar: 'أوراق سياسات',
        title_en: 'Policy Papers'
      }
    },
    {
      id: '6',
      title_ar: 'التطورات الجيوسياسية في البحر الأحمر',
      title_en: 'Geopolitical Developments in the Red Sea',
      excerpt_ar: 'دراسة معمقة للتحولات الجيوسياسية في منطقة البحر الأحمر وتأثيرها على المصالح الإقليمية والدولية',
      excerpt_en: 'In-depth study of geopolitical shifts in the Red Sea region and their impact on regional and international interests',
      slug: 'red-sea-geopolitics',
      featured_image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=800',
      views_count: 1340,
      published_at: '2025-11-12',
      category: {
        title_ar: 'التقارير الدورية',
        title_en: 'Periodic Reports'
      }
    }
  ];

  useEffect(() => {
    setArticles(sampleArticles);
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', title_ar: 'الكل', title_en: 'All' },
    { id: 'analysis', title_ar: 'التحليلات', title_en: 'Analysis' },
    { id: 'policy', title_ar: 'أوراق سياسات', title_en: 'Policy Papers' },
    { id: 'reports', title_ar: 'التقارير الدورية', title_en: 'Periodic Reports' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-12 h-12 text-blue-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'المنشورات' : 'Publications'}
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'مجموعة شاملة من التحليلات والأوراق السياسية والتقارير الدورية حول القضايا الاستراتيجية اليمنية والإقليمية'
                : 'A comprehensive collection of analyses, policy papers, and periodic reports on Yemeni and regional strategic issues'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`flex items-center gap-4 mb-8 flex-wrap ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">
            {language === 'ar' ? 'تصفية حسب:' : 'Filter by:'}
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {language === 'ar' ? cat.title_ar : cat.title_en}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-100 hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={article.featured_image}
                    alt={language === 'ar' ? article.title_ar : article.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {article.category && (
                    <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-medium shadow-lg">
                        {language === 'ar' ? article.category.title_ar : article.category.title_en}
                      </span>
                    </div>
                  )}
                </div>

                <div className={`p-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {language === 'ar' ? article.title_ar : article.title_en}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {language === 'ar' ? article.excerpt_ar : article.excerpt_en}
                  </p>

                  <div className={`flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center space-x-1 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                      <Eye className="w-4 h-4" />
                      <span>{article.views_count}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
