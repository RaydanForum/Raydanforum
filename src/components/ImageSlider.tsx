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

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
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
        setSlides(slidesWithImages);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-400 text-lg">جاري تحميل الصور...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-400 text-lg">لا توجد صور متاحة</div>
      </div>
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          <div className={`absolute inset-0 flex items-center justify-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
              {getSlideLink(slide) ? (
                slide.link_type === 'external' ? (
                  <a
                    href={getSlideLink(slide)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group cursor-pointer"
                  >
                    <h2
                      className={`text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 transition-all duration-700 delay-300 group-hover:text-emerald-300 ${
                        index === currentSlide
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      {language === 'ar' ? slide.title_ar : slide.title_en}
                    </h2>
                    <p
                      className={`text-lg lg:text-xl xl:text-2xl text-gray-100 transition-all duration-700 delay-500 ${
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
                    className="block group cursor-pointer"
                  >
                    <h2
                      className={`text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 transition-all duration-700 delay-300 group-hover:text-emerald-300 ${
                        index === currentSlide
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      {language === 'ar' ? slide.title_ar : slide.title_en}
                    </h2>
                    <p
                      className={`text-lg lg:text-xl xl:text-2xl text-gray-100 transition-all duration-700 delay-500 ${
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
                    className={`text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 transition-all duration-700 delay-300 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {language === 'ar' ? slide.title_ar : slide.title_en}
                  </h2>
                  <p
                    className={`text-lg lg:text-xl xl:text-2xl text-gray-100 transition-all duration-700 delay-500 ${
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
