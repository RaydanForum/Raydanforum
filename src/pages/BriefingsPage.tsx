import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Clock, Tag, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

type Briefing = {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  featured_image: string;
  published_at: string;
  category_ar: string;
  category_en: string;
  views_count: number;
};

export default function BriefingsPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ id: string; title_ar: string; title_en: string }>>([
    { id: 'all', title_ar: 'الكل', title_en: 'All' }
  ]);

  useEffect(() => {
    loadBriefings();
  }, []);

  const loadBriefings = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setBriefings(data || []);

      const uniqueCategories = Array.from(
        new Set(data?.map((b) => b.category_ar) || [])
      ).map((cat) => {
        const item = data?.find((b) => b.category_ar === cat);
        return {
          id: cat.toLowerCase().replace(/\s+/g, '-'),
          title_ar: cat,
          title_en: item?.category_en || cat,
        };
      });

      setCategories([
        { id: 'all', title_ar: 'الكل', title_en: 'All' },
        ...uniqueCategories,
      ]);
    } catch (error) {
      console.error('Error loading briefings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBriefings =
    selectedCategory === 'all'
      ? briefings
      : briefings.filter((briefing) => {
          const categoryId = briefing.category_ar.toLowerCase().replace(/\s+/g, '-');
          return categoryId === selectedCategory;
        });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <>
      <SEOHead pagePath="/briefings" />
      <div className="min-h-screen bg-gray-50">
        <div
          className="relative h-96 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 to-emerald-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-12 h-12 text-emerald-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'الإحاطات والتقارير' : 'Briefings & Reports'}
              </h1>
            </div>
            <p className="text-xl text-emerald-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'تحليلات وإحاطات متخصصة حول القضايا الاستراتيجية والتطورات الإقليمية'
                : 'Specialized analysis and briefings on strategic issues and regional developments'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`flex items-center gap-4 mb-8 flex-wrap ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Tag className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">
            {language === 'ar' ? 'الفئة:' : 'Category:'}
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {language === 'ar' ? cat.title_ar : cat.title_en}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredBriefings.map((briefing, index) => (
            <Link
              key={briefing.id}
              to={`/briefings/${briefing.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1 animate-slideUp block cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 relative overflow-hidden">
                  <img
                    src={briefing.featured_image}
                    alt={language === 'ar' ? briefing.title_ar : briefing.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                    <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full font-medium shadow-lg">
                      {language === 'ar' ? briefing.category_ar : briefing.category_en}
                    </span>
                  </div>
                </div>

                <div className={`md:w-2/3 p-6 lg:p-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors leading-snug">
                    {language === 'ar' ? briefing.title_ar : briefing.title_en}
                  </h3>

                  <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                    {language === 'ar' ? briefing.excerpt_ar : briefing.excerpt_en}
                  </p>

                  <div className={`flex items-center gap-6 text-sm text-gray-500 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(briefing.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-4 h-4" />
                      <span>{briefing.views_count} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
