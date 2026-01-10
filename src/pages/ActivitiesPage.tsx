import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
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
              <article
                key={activity.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-1 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-80 md:h-auto relative overflow-hidden">
                    <img
                      src={activity.featured_image}
                      alt={language === 'ar' ? activity.title_ar : activity.title_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-medium shadow-lg">
                        {language === 'ar' ? activity.activity_type_ar : activity.activity_type_en}
                      </span>
                    </div>
                    {activity.is_upcoming && (
                      <div className={`absolute bottom-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                        <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium shadow-lg">
                          {language === 'ar' ? 'قريباً' : 'Upcoming'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`md:w-3/5 p-8 lg:p-10 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                      {language === 'ar' ? activity.title_ar : activity.title_en}
                    </h3>

                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                      {language === 'ar' ? activity.description_ar : activity.description_en}
                    </p>

                    <div className="space-y-3">
                      <div className={`flex items-center gap-3 text-gray-600 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? 'التاريخ' : 'Date'}
                          </p>
                          <p className="font-semibold">
                            {new Date(activity.start_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 text-gray-600 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? 'الموقع' : 'Location'}
                          </p>
                          <p className="font-semibold">
                            {language === 'ar' ? activity.location_ar : activity.location_en}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
