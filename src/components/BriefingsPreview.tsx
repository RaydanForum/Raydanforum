import { useState, useEffect } from 'react';
import { FileText, Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

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

export default function BriefingsPreview() {
  const { language } = useLanguage();
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBriefings();
  }, []);

  const loadBriefings = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      setBriefings(data || []);
    } catch (error) {
      console.error('Error loading briefings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-400">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  if (briefings.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-400">لا توجد إحاطات متاحة</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3 mb-4 justify-center">
            <FileText className="w-10 h-10 text-emerald-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              {language === 'ar' ? 'أحدث الإحاطات والتقارير' : 'Latest Briefings & Reports'}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'ar'
              ? 'تحليلات وإحاطات متخصصة حول القضايا الاستراتيجية والتطورات الإقليمية'
              : 'Specialized analysis and briefings on strategic issues and regional developments'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {briefings.map((briefing, index) => (
            <Link
              key={briefing.id}
              to={`/briefings/${briefing.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-300 hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={briefing.featured_image}
                  alt={language === 'ar' ? briefing.title_ar : briefing.title_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                  <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full font-medium shadow-lg">
                    {language === 'ar' ? briefing.category_ar : briefing.category_en}
                  </span>
                </div>
              </div>

              <div className={`p-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">
                  {language === 'ar' ? briefing.title_ar : briefing.title_en}
                </h3>

                <p className="text-gray-600 mb-4 text-base leading-relaxed line-clamp-3">
                  {language === 'ar' ? briefing.excerpt_ar : briefing.excerpt_en}
                </p>

                <div className={`flex items-center gap-4 text-sm text-gray-500 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(briefing.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-4 h-4" />
                    <span>{briefing.views_count} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/briefings"
            className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-lg font-semibold rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            <span>{language === 'ar' ? 'جميع الإحاطات والتقارير' : 'All Briefings & Reports'}</span>
            {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
