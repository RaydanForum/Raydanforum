import { Menu, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/raydan-logo.png');
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value_ar, value_en')
        .eq('key', 'logo_url')
        .maybeSingle();

      if (data && (data.value_ar || data.value_en)) {
        const url = data.value_ar || data.value_en;
        if (url) {
          setLogoUrl(url);
        }
      }
    };

    fetchLogo();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 relative">
          <div className="flex items-center lg:space-x-4 lg:space-x-reverse">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="القائمة"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <Link to="/" className="hidden lg:flex items-center">
              <img
                src={logoUrl}
                alt="Raydan Forum Logo"
                className="h-20 w-auto"
              />
            </Link>
          </div>

          <Link to="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center">
            <img
              src={logoUrl}
              alt="Raydan Forum Logo"
              className="h-16 w-auto"
            />
          </Link>

          <nav className={`hidden lg:flex items-center ${language === 'ar' ? 'space-x-8 space-x-reverse' : 'space-x-8'}`}>
            <Link to="/" className={`transition-colors font-medium whitespace-nowrap ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/activities" className={`transition-colors font-medium whitespace-nowrap ${isActive('/activities') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              {language === 'ar' ? 'الأنشطة' : 'Activities'}
            </Link>
            <Link to="/briefings" className={`transition-colors font-medium whitespace-nowrap ${isActive('/briefings') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              {language === 'ar' ? 'الإحاطات' : 'Briefings'}
            </Link>
            <Link to="/membership" className={`transition-colors font-medium whitespace-nowrap ${isActive('/membership') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              {language === 'ar' ? 'العضوية' : 'Membership'}
            </Link>
            <Link to="/about" className={`transition-colors font-medium whitespace-nowrap ${isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              {language === 'ar' ? 'من نحن' : 'About'}
            </Link>
          </nav>

          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="تغيير اللغة"
            >
              <Globe className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={`transition-colors font-medium py-2 ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
              <Link to="/activities" onClick={() => setIsMenuOpen(false)} className={`transition-colors font-medium py-2 ${isActive('/activities') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                {language === 'ar' ? 'الأنشطة' : 'Activities'}
              </Link>
              <Link to="/briefings" onClick={() => setIsMenuOpen(false)} className={`transition-colors font-medium py-2 ${isActive('/briefings') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                {language === 'ar' ? 'الإحاطات' : 'Briefings'}
              </Link>
              <Link to="/membership" onClick={() => setIsMenuOpen(false)} className={`transition-colors font-medium py-2 ${isActive('/membership') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                {language === 'ar' ? 'العضوية' : 'Membership'}
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`transition-colors font-medium py-2 ${isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                {language === 'ar' ? 'من نحن' : 'About'}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
