import { useState, useEffect } from 'react';
import { Info, Target, Eye, Users, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import * as LucideIcons from 'lucide-react';
import SEOHead from '../components/SEOHead';

type OrganizationValue = {
  id: string;
  type: 'mission' | 'vision' | 'value';
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  icon: string | null;
  display_order: number;
};

type TeamMember = {
  id: string;
  name_ar: string;
  name_en: string;
  position_ar: string;
  position_en: string;
  bio_ar: string;
  bio_en: string;
  photo_url: string;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  is_leadership: boolean;
  is_active: boolean;
};

export default function AboutPage() {
  const { language } = useLanguage();
  const [mission, setMission] = useState<OrganizationValue | null>(null);
  const [vision, setVision] = useState<OrganizationValue | null>(null);
  const [values, setValues] = useState<OrganizationValue[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [valuesRes, teamRes] = await Promise.all([
        supabase
          .from('organization_values')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
      ]);

      if (valuesRes.error) throw valuesRes.error;
      if (teamRes.error) throw teamRes.error;

      const valuesData = valuesRes.data || [];
      setMission(valuesData.find(v => v.type === 'mission') || null);
      setVision(valuesData.find(v => v.type === 'vision') || null);
      setValues(valuesData.filter(v => v.type === 'value'));
      setTeam(teamRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Target;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Target;
  };

  return (
    <>
      <SEOHead pagePath="/about" />
      <div className="min-h-screen bg-gray-50">
        <div
          className="relative h-96 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/95 to-teal-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-12 h-12 text-teal-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'عن المنتدى' : 'About Us'}
              </h1>
            </div>
            <p className="text-xl text-teal-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'مركز فكري مستقل يعمل على تعزيز الفهم الاستراتيجي للقضايا اليمنية والإقليمية'
                : 'An independent think tank working to enhance strategic understanding of Yemeni and regional issues'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {vision && (
                <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-8 h-8 text-teal-600" />
                    <h2 className="text-3xl font-bold text-gray-900">
                      {language === 'ar' ? vision.title_ar : vision.title_en}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {language === 'ar' ? vision.content_ar : vision.content_en}
                  </p>
                </div>
              )}

              {mission && (
                <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-teal-600" />
                    <h2 className="text-3xl font-bold text-gray-900">
                      {language === 'ar' ? mission.title_ar : mission.title_en}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {language === 'ar' ? mission.content_ar : mission.content_en}
                  </p>
                </div>
              )}
            </div>

            {values.length > 0 && (
              <div className="mb-16">
                <h2 className={`text-3xl font-bold text-gray-900 mb-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'قيمنا' : 'Our Values'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.map((value, index) => {
                    const Icon = getIcon(value.icon);
                    return (
                      <div
                        key={value.id}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200 animate-slideUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                          <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {language === 'ar' ? value.title_ar : value.title_en}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {language === 'ar' ? value.content_ar : value.content_en}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {team.length > 0 && (
              <div>
                <h2 className={`text-3xl font-bold text-gray-900 mb-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'فريق العمل' : 'Our Team'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {team.map((member, index) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={member.photo_url}
                          alt={language === 'ar' ? member.name_ar : member.name_en}
                          className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className={`p-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {language === 'ar' ? member.name_ar : member.name_en}
                        </h3>
                        <p className="text-sm text-teal-600 font-medium">
                          {language === 'ar' ? member.position_ar : member.position_en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
}
