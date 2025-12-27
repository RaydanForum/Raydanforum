import { useState, useEffect } from 'react';
import { Info, Eye, Target, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import * as LucideIcons from 'lucide-react';

type OrganizationValue = {
  id: string;
  type: 'mission' | 'vision' | 'value';
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  icon: string | null;
};

export default function AboutPreview() {
  const { language } = useLanguage();
  const [highlights, setHighlights] = useState<OrganizationValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_values')
        .select('*')
        .in('type', ['vision', 'mission'])
        .order('type', { ascending: true });

      if (error) throw error;

      const values = await supabase
        .from('organization_values')
        .select('*')
        .eq('type', 'value')
        .limit(3);

      const allHighlights = [...(data || []), ...(values.data || [])];
      setHighlights(allHighlights.slice(0, 3));
    } catch (error) {
      console.error('Error loading highlights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string | null, defaultIcon: any) => {
    if (!iconName) return defaultIcon;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || defaultIcon;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Info className="w-10 h-10 text-teal-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              {language === 'ar' ? 'عن منتدى ريدان' : 'About Raydan Forum'}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'ar'
              ? 'مركز فكري مستقل يعمل على تعزيز الفهم الاستراتيجي للقضايا اليمنية والإقليمية'
              : 'An independent think tank working to enhance strategic understanding of Yemeni and regional issues'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
          </div>
        ) : highlights.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {highlights.map((item, index) => {
              const defaultIcon = item.type === 'vision' ? Eye : item.type === 'mission' ? Target : Info;
              const Icon = getIcon(item.icon, defaultIcon);
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-teal-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'ar' ? item.title_ar : item.title_en}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'ar' ? item.content_ar : item.content_en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl shadow-xl p-8 lg:p-12 text-white">
          <div className={`max-w-3xl mx-auto ${language === 'ar' ? 'text-center' : 'text-center'}`}>
            <h3 className="text-3xl font-bold mb-4">
              {language === 'ar'
                ? 'منصة يمنية مستقلة للعلاقات الاستراتيجية والدبلوماسية المجتمعية'
                : 'An independent Yemeni platform for strategic relations and community diplomacy'}
            </h3>
            <p className="text-lg text-teal-100 mb-8 leading-relaxed">
              {language === 'ar'
                ? 'نسعى لنقل الصورة الحقيقية عن اليمن بموضوعية ومهنية، ونعمل على بناء جسور التواصل والتفاهم'
                : 'We seek to convey the true image of Yemen objectively and professionally, building bridges of communication and understanding'}
            </p>
            <Link
              to="/about"
              className={`inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-600 text-lg font-semibold rounded-full hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                language === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              <span>{language === 'ar' ? 'اعرف المزيد عن المنتدى' : 'Learn More About Us'}</span>
              {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
