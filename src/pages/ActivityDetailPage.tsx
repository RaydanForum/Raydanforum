import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

type Activity = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  activity_type_ar: string;
  activity_type_en: string;
  location_ar: string;
  location_en: string;
  featured_image: string;
  start_date: string;
  end_date: string | null;
  is_upcoming: boolean;
  registration_link: string | null;
};

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      loadActivity();
    }
  }, [id]);

  const loadActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setActivity(data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'النشاط غير موجود' : 'Activity not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar' ? 'عذراً، لم نتمكن من العثور على النشاط المطلوب' : 'Sorry, we could not find the requested activity'}
          </p>
          <Link
            to="/activities"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span>{language === 'ar' ? 'العودة إلى الأنشطة' : 'Back to Activities'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <img
          src={activity.featured_image}
          alt={language === 'ar' ? activity.title_ar : activity.title_en}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/activities"
              className={`inline-flex md:hidden items-center gap-2 text-white hover:text-blue-300 transition-colors mb-6 ${
                language === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span>{language === 'ar' ? 'العودة إلى الأنشطة' : 'Back to Activities'}</span>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                {language === 'ar' ? activity.activity_type_ar : activity.activity_type_en}
              </span>
              {activity.is_upcoming && (
                <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold">
                  {language === 'ar' ? 'قادم' : 'Upcoming'}
                </span>
              )}
            </div>

            <h1 className={`text-3xl lg:text-5xl font-bold text-white mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? activity.title_ar : activity.title_en}
            </h1>

            <div className={`flex flex-wrap items-center gap-6 text-white/90 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-5 h-5" />
                <span>{formatDate(activity.start_date)}</span>
              </div>
              <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-5 h-5" />
                <span>{formatTime(activity.start_date)}</span>
              </div>
              <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-5 h-5" />
                <span>{language === 'ar' ? activity.location_ar : activity.location_en}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className={`bg-white rounded-2xl shadow-lg p-8 lg:p-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'عن النشاط' : 'About the Activity'}
              </h2>
              <div className="prose prose-lg max-w-none" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                {(language === 'ar' ? activity.description_ar : activity.description_en).split('\n').map((paragraph, index) => (
                  paragraph.trim() ? <p key={index} className="mb-4 leading-relaxed text-gray-700">{paragraph}</p> : null
                ))}
              </div>
            </article>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className={`text-xl font-bold text-gray-900 mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'تفاصيل النشاط' : 'Activity Details'}
              </h3>

              <div className="space-y-4">
                <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 text-gray-600 mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">{language === 'ar' ? 'التاريخ' : 'Date'}</span>
                  </div>
                  <p className="text-gray-900">{formatDate(activity.start_date)}</p>
                  {activity.end_date && (
                    <p className="text-sm text-gray-600 mt-1">
                      {language === 'ar' ? 'ينتهي في: ' : 'Ends: '}{formatDate(activity.end_date)}
                    </p>
                  )}
                </div>

                <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 text-gray-600 mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{language === 'ar' ? 'الوقت' : 'Time'}</span>
                  </div>
                  <p className="text-gray-900">{formatTime(activity.start_date)}</p>
                </div>

                <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 text-gray-600 mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">{language === 'ar' ? 'الموقع' : 'Location'}</span>
                  </div>
                  <p className="text-gray-900">{language === 'ar' ? activity.location_ar : activity.location_en}</p>
                </div>

                {activity.registration_link && activity.is_upcoming && (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={activity.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl ${
                        language === 'ar' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>{language === 'ar' ? 'التسجيل في النشاط' : 'Register for Activity'}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/activities"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span>{language === 'ar' ? 'عرض جميع الأنشطة' : 'View All Activities'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
