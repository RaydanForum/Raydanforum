import { useEffect, useState } from 'react';
import { supabase, Section } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import SectionCard from './SectionCard';

export default function Sections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('sections.title')}</h2>
            <p className="text-xl text-gray-600">{t('sections.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-6"></div>
                <div className="h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sections" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('sections.title')}</h2>
          <p className="text-xl text-gray-600">{t('sections.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="animate-scaleIn flex"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <SectionCard
                icon={section.icon}
                title={language === 'ar' ? section.title_ar : section.title_en}
                description={language === 'ar' ? section.description_ar : section.description_en}
                link={`#${section.slug}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
