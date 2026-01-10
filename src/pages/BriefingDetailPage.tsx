import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, FileText, Download, ArrowLeft, ArrowRight, Eye, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

type Briefing = {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  author_ar: string;
  author_en: string;
  category_ar: string;
  category_en: string;
  featured_image: string;
  pdf_url: string | null;
  views_count: number;
  published_at: string;
};

export default function BriefingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      loadBriefing();
      incrementViews();
    }
  }, [id]);

  const loadBriefing = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBriefing(data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error loading briefing:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase.rpc('increment_briefing_views', { briefing_id: id });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !briefing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'الإحاطة غير موجودة' : 'Briefing not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' ? 'عذراً، لم نتمكن من العثور على الإحاطة المطلوبة' : 'Sorry, we could not find the requested briefing'}
          </p>
          <Link
            to="/briefings"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span>{language === 'ar' ? 'العودة إلى الإحاطات' : 'Back to Briefings'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <img
          src={briefing.featured_image}
          alt={language === 'ar' ? briefing.title_ar : briefing.title_en}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/briefings"
              className={`inline-flex md:hidden items-center gap-2 text-white hover:text-emerald-300 transition-colors mb-6 ${
                language === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span>{language === 'ar' ? 'العودة إلى الإحاطات' : 'Back to Briefings'}</span>
            </Link>

            <div className={`inline-block mb-4 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold ${
              language === 'ar' ? 'mr-0' : 'ml-0'
            }`}>
              {language === 'ar' ? briefing.category_ar : briefing.category_en}
            </div>

            <h1 className={`text-3xl lg:text-5xl font-bold text-white mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? briefing.title_ar : briefing.title_en}
            </h1>

            <div className={`flex flex-wrap items-center gap-6 text-white/90 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <User className="w-5 h-5" />
                <span>{language === 'ar' ? briefing.author_ar : briefing.author_en}</span>
              </div>
              <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(briefing.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Eye className="w-5 h-5" />
                <span>{briefing.views_count} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {briefing.pdf_url && (
          <div className="mb-8">
            <a
              href={briefing.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                language === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              <Download className="w-5 h-5" />
              <span>{language === 'ar' ? 'تحميل الملف الكامل (PDF)' : 'Download Full Report (PDF)'}</span>
            </a>
          </div>
        )}

        <article className={`bg-white rounded-2xl shadow-lg p-8 lg:p-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-emerald-600 hover:prose-a:text-emerald-700"
            style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
          >
            {(language === 'ar' ? briefing.content_ar : briefing.content_en).split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index} className="mb-4 leading-relaxed text-gray-700">{paragraph}</p> : null
            ))}
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            to="/briefings"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span>{language === 'ar' ? 'عرض جميع الإحاطات' : 'View All Briefings'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
