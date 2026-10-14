import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, FileText, Download, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import ImageGallery from '../components/ImageGallery';

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
      {/* Top Header Section */}
      <div className="bg-white border-b border-gray-200/80 pt-8 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/briefings"
            className={`inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mb-6 group ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            {language === 'ar' ? (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            )}
            <span>{language === 'ar' ? 'العودة إلى الإحاطات' : 'Back to Briefings'}</span>
          </Link>

          <div className="mb-4">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              {language === 'ar' ? briefing.category_ar : briefing.category_en}
            </span>
          </div>

          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-snug mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? briefing.title_ar : briefing.title_en}
          </h1>

          <div className={`flex flex-wrap items-center gap-4 text-sm text-gray-600 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <User className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? briefing.author_ar : briefing.author_en}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>
                {new Date(briefing.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Featured Image Showcase Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 shadow-xl border border-gray-200/80 flex items-center justify-center min-h-[320px] max-h-[550px] lg:max-h-[620px]">
          <img
            src={briefing.featured_image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
          />
          <img
            src={briefing.featured_image}
            alt={language === 'ar' ? briefing.title_ar : briefing.title_en}
            className="relative max-h-[500px] lg:max-h-[580px] w-auto max-w-full object-contain z-10 p-2 sm:p-4 rounded-xl"
          />
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

          <ImageGallery postId={briefing.id} postType="briefing" />
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
