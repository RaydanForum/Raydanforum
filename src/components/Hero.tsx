import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ImageSlider from './ImageSlider';
import { supabase } from '../lib/supabase';

interface HeroContent {
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  cta_text_ar: string;
  cta_text_en: string;
  cta_link: string;
}

const DEFAULT_HERO_CONTENT: HeroContent = {
  title_ar: 'منتدى ريدان',
  title_en: 'Raydan Forum',
  subtitle_ar: 'منصة بريطانية-يمنية مستقلة، مقرّها لندن، تعمل على تعزيز الحوار البنّاء وبناء علاقات سياسية وإعلامية ومجتمعية مع المؤسسات البريطانية والأوروبية في الشؤون اليمنية وقضايا منطقة الشرق الأوسط وشمال أفريقيا.',
  subtitle_en: 'An independent British-Yemeni platform based in London, focused on promoting constructive dialogue and building political, media, and community relations with British and European institutions on Yemeni and MENA region affairs.',
  cta_text_ar: 'استكشف موجزاتنا',
  cta_text_en: 'Explore Our Briefings',
  cta_link: '/briefings',
};

export default function Hero() {
  const { language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;
  const [content, setContent] = useState<HeroContent>(() => {
    try {
      const cached = localStorage.getItem('cached_hero_content');
      return cached ? JSON.parse(cached) : DEFAULT_HERO_CONTENT;
    } catch {
      return DEFAULT_HERO_CONTENT;
    }
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data } = await supabase
        .from('hero_content')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        setContent(data);
        try {
          localStorage.setItem('cached_hero_content', JSON.stringify(data));
        } catch {}
      }
    } catch (e) {
      console.error('Error loading hero content:', e);
    }
  };

  return (
    <section className="relative bg-gradient-to-bl from-emerald-50 via-white to-gray-50">
      <div className="w-full animate-fadeIn">
        <ImageSlider />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className={`text-center max-w-3xl mx-auto animate-slideUp ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="inline-block mb-3 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs sm:text-sm font-semibold animate-fadeIn">
            {language === 'ar' ? 'منصة يمنية مستقلة' : 'Independent Yemeni Platform'}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-snug text-center">
            {language === 'ar' ? content.title_ar : content.title_en}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed text-center">
            {language === 'ar' ? content.subtitle_ar : content.subtitle_en}
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <a
              href={content.cta_link}
              className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              {language === 'ar' ? content.cta_text_ar : content.cta_text_en}
              <Arrow className={`${language === 'ar' ? 'mr-2' : 'ml-2'} w-4 h-4`} />
            </a>
            <a
              href="/about"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-emerald-400 hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {language === 'ar' ? 'من نحن' : 'About Us'}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}
