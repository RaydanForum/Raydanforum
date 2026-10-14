import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

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
};

export default function ActivitiesPage() {
  const { language } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead pagePath="/activities" />
      <div className="min-h-screen bg-gray-50">
        <div
          className="relative h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-12 h-12 text-blue-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'الأنشطة والفعاليات' : 'Activities & Events'}
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'نظم منتدى ريدان مجموعة متنوعة من الأنشطة والفعاليات لتعزيز الحوار والتفاهم الاستراتيجي'
                : 'Raydan Forum organizes a variety of activities and events to promote dialogue and strategic understanding'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد أنشطة حالياً' : 'No activities available'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' ? 'تابعنا لمعرفة الأنشطة القادمة' : 'Follow us for upcoming activities'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity, index) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1 animate-slideUp block cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="w-full md:w-80 lg:w-96 flex-shrink-0 p-4 sm:p-5 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                    <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden shadow-sm border border-gray-200/80 bg-slate-950 flex items-center justify-center">
                      <img
                        src={activity.featured_image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                      />
                      <img
                        src={activity.featured_image}
                        alt={language === 'ar' ? activity.title_ar : activity.title_en}
                        className="relative max-h-full max-w-full w-auto h-auto object-contain z-10 p-1.5 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} z-20`}>
                        <span className="px-3 py-1 bg-blue-600/90 text-white text-xs rounded-full font-semibold shadow-md backdrop-blur-sm">
                          {language === 'ar' ? activity.activity_type_ar : activity.activity_type_en}
                        </span>
                      </div>
                      {activity.is_upcoming && (
                        <div className={`absolute bottom-3 ${language === 'ar' ? 'right-3' : 'left-3'} z-20`}>
                          <span className="px-3 py-1 bg-emerald-600/90 text-white text-xs rounded-full font-semibold shadow-md backdrop-blur-sm">
                            {language === 'ar' ? 'قريباً' : 'Upcoming'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-semibold border border-blue-100">
                          {language === 'ar' ? activity.activity_type_ar : activity.activity_type_en}
                        </span>
                        {activity.is_upcoming && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md font-semibold border border-emerald-100">
                            {language === 'ar' ? 'نشاط قادم' : 'Upcoming Event'}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {language === 'ar' ? activity.title_ar : activity.title_en}
                      </h2>

                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3 sm:line-clamp-4">
                        {language === 'ar' ? activity.description_ar : activity.description_en}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className={`flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {new Date(activity.start_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium line-clamp-1">
                            {language === 'ar' ? activity.location_ar : activity.location_en}
                          </span>
                        </span>
                      </div>

                      <div className={`inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                        {language === 'ar' ? (
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
