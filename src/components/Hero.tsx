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

export default function Hero() {
  const { language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;
  const [content, setContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('hero_content')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (data) setContent(data);
  };

  if (!content) return null;

  return (
    <section className="relative bg-gradient-to-bl from-emerald-50 via-white to-gray-50">
      <div className="w-full animate-fadeIn">
        <ImageSlider />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className={`text-center max-w-4xl mx-auto animate-slideUp ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold animate-fadeIn">
            {language === 'ar' ? 'منصة يمنية مستقلة' : 'Independent Yemeni Platform'}
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-center">
            {language === 'ar' ? content.title_ar : content.title_en}
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed text-center">
            {language === 'ar' ? content.subtitle_ar : content.subtitle_en}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={content.cta_link}
              className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              {language === 'ar' ? content.cta_text_ar : content.cta_text_en}
              <Arrow className={`${language === 'ar' ? 'mr-2' : 'ml-2'} w-5 h-5`} />
            </a>
            <a
              href="/about"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-xl font-bold border-2 border-gray-200 hover:border-emerald-400 hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
