import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface WhyRaydanPoint {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  display_order: number;
}

export default function WhyRaydan() {
  const { language } = useLanguage();
  const [features, setFeatures] = useState<WhyRaydanPoint[]>([]);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    const { data } = await supabase
      .from('why_raydan_points')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (data) setFeatures(data);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return Icon;
  };

  if (features.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 animate-fadeIn ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            {language === 'ar' ? 'لماذا منتدى ريدان؟' : 'Why Raydan Forum?'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center">
            {language === 'ar'
              ? 'نتميز بمنهجية علمية رصينة وشبكة واسعة من الخبراء والشراكات الاستراتيجية'
              : 'We stand out with rigorous scientific methodology and an extensive network of experts and strategic partnerships'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            return (
              <div
                key={feature.id}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex flex-col ${language === 'ar' ? 'items-end text-right' : 'items-start text-left'}`}>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {language === 'ar' ? feature.title_ar : feature.title_en}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'ar' ? feature.description_ar : feature.description_en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
