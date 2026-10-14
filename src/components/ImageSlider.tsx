import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

type Slide = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image_url: string;
  display_order: number;
  link_type?: string | null;
  link_id?: string | null;
  external_link?: string | null;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: '5c8e0274-5b36-4d49-8d2d-33dff912e9ca',
    title_ar: 'أقام منتدى ريدان فعالية في مدينة إسطنبول ضمن برامجه وأنشطته.',
    title_en: 'Raydan Forum hosted an event in Istanbul.',
    description_ar: 'ندوة دولية عن اليمن بالشراكة مع Forward Thinking ومركز المخا.',
    description_en: 'An international Yemen seminar with Forward Thinking and the Mokha Center.',
    image_url: 'https://rcvdprxiflggpianisfg.supabase.co/storage/v1/object/public/hero-images/5c8e0274-5b36-4d49-8d2d-33dff912e9ca-1768009750662.jpg',
    display_order: 1,
  },
  {
    id: '9cade7a8-aec6-403e-ad53-94d66f729549',
    title_ar: 'ينظّم منتدى ريدان زيارة مهنية إلى إسطنبول ضمن أنشطته التعريفية بالملف اليمني.',
    title_en: 'Raydan Forum Organizes a Professional Visit to Istanbul as Part of Its Outreach on the Yemeni File',
    description_ar: 'نظّم منتدى ريدان زيارة مهنية إلى إسطنبول لتعريف المهتمين بتطورات اليمن.',
    description_en: 'Raydan Forum organized a professional visit to Istanbul to brief audiences on Yemen.',
    image_url: 'https://rcvdprxiflggpianisfg.supabase.co/storage/v1/object/public/hero-images/9cade7a8-aec6-403e-ad53-94d66f729549-1768011117285.jpeg',
    display_order: 2,
  },
];

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const cached = localStorage.getItem('cached_hero_slides');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_SLIDES;
  });
  const { language } = useLanguage();

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      if (data && data.length > 0) {
        const slidesWithImages = data.filter(slide => slide.image_url && slide.image_url.trim() !== '');
        if (slidesWithImages.length > 0) {
          setSlides(slidesWithImages);
          try {
            localStorage.setItem('cached_hero_slides', JSON.stringify(slidesWithImages));
          } catch {}
        }
      }
    } catch (error) {
      console.error('Error loading slides:', error);
    }
  };

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getSlideLink = (slide: Slide) => {
    if (!slide.link_type) return null;

    if (slide.link_type === 'briefing' && slide.link_id) {
      return `/briefings/${slide.link_id}`;
    }
    if (slide.link_type === 'activity' && slide.link_id) {
      return `/activities/${slide.link_id}`;
    }
    if (slide.link_type === 'external' && slide.external_link) {
      return slide.external_link;
    }

    return null;
  };

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-emerald-50 to-gray-100" />
    );
  }

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
            style={{
              backgroundImage: `url(${slide.image_url})`,
              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className={`absolute inset-0 flex items-end ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 pb-14 sm:pb-16">
              <div className="max-w-2xl bg-black/45 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-2xl transition-all">
                {getSlideLink(slide) ? (
                  slide.link_type === 'external' ? (
                    <a
                      href={getSlideLink(slide)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group/link cursor-pointer"
                    >
                      <h2
                        className={`text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 leading-snug transition-all duration-700 delay-300 group-hover/link:text-emerald-300 ${
                          index === currentSlide
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                      >
                        {language === 'ar' ? slide.title_ar : slide.title_en}
                      </h2>
                      <p
                        className={`text-xs sm:text-sm lg:text-base text-gray-200 transition-all duration-700 delay-500 line-clamp-2 leading-relaxed ${
                          index === currentSlide
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                      >
                        {language === 'ar' ? slide.description_ar : slide.description_en}
                      </p>
                    </a>
                  ) : (
                    <Link
                      to={getSlideLink(slide)!}
                      className="block group/link cursor-pointer"
                    >
                      <h2
                        className={`text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 leading-snug transition-all duration-700 delay-300 group-hover/link:text-emerald-300 ${
                          index === currentSlide
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                      >
                        {language === 'ar' ? slide.title_ar : slide.title_en}
                      </h2>
                      <p
                        className={`text-xs sm:text-sm lg:text-base text-gray-200 transition-all duration-700 delay-500 line-clamp-2 leading-relaxed ${
                          index === currentSlide
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                      >
                        {language === 'ar' ? slide.description_ar : slide.description_en}
                      </p>
                    </Link>
                  )
                ) : (
                  <>
                    <h2
                      className={`text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 leading-snug transition-all duration-700 delay-300 ${
                        index === currentSlide
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      {language === 'ar' ? slide.title_ar : slide.title_en}
                    </h2>
                    <p
                      className={`text-xs sm:text-sm lg:text-base text-gray-200 transition-all duration-700 delay-500 line-clamp-2 leading-relaxed ${
                        index === currentSlide
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      {language === 'ar' ? slide.description_ar : slide.description_en}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110`}
        aria-label="Previous slide"
      >
        {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>

      <button
        onClick={nextSlide}
        className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110`}
        aria-label="Next slide"
      >
        {language === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 space-x-reverse">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-12 h-3'
                : 'bg-white/50 hover:bg-white/75 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
