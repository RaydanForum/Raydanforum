import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  is_upcoming: boolean;
};

export default function ActivitiesPreview() {
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
        .eq('is_upcoming', true)
        .order('start_date', { ascending: true })
        .limit(3);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Calendar className="w-10 h-10 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              {language === 'ar' ? 'الأنشطة والفعاليات' : 'Activities & Events'}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'ar'
              ? 'ننظم مجموعة متنوعة من الأنشطة والفعاليات لتعزيز الحوار والتفاهم الاستراتيجي'
              : 'We organize a variety of activities and events to promote dialogue and strategic understanding'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 mb-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'ar' ? 'لا توجد أنشطة قادمة حالياً' : 'No upcoming activities at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {activities.map((activity, index) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.featured_image}
                    alt={language === 'ar' ? activity.title_ar : activity.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium shadow-lg">
                      {language === 'ar' ? activity.activity_type_ar : activity.activity_type_en}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-xl font-bold text-gray-900 mb-3 line-clamp-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? activity.title_ar : activity.title_en}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed mb-4 line-clamp-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? activity.description_ar : activity.description_en}
                  </p>
                  <div className={`flex items-center gap-2 text-sm text-gray-500 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(activity.start_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm text-gray-500 mt-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">
                      {language === 'ar' ? activity.location_ar : activity.location_en}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/activities"
            className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            <span>{language === 'ar' ? 'استكشف جميع الأنشطة' : 'Explore All Activities'}</span>
            {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
