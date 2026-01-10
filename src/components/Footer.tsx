import { Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useBusinessInfo } from '../hooks/useBusinessInfo';
import NAP from './NAP';

export default function Footer() {
  const { language } = useLanguage();
  const { businessInfo } = useBusinessInfo();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div>
            <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <img
                src="/raydan-logo.png"
                alt="Raydan Forum"
                className="h-10 w-auto"
              />
              <h3 className="text-white text-xl font-bold">
                {language === 'ar' ? 'منتدى ريدان' : 'Raydan Forum'}
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              {language === 'ar'
                ? 'للعلاقات الاستراتيجية والدبلوماسية المجتمعية'
                : 'For Strategic Relations and Community Diplomacy'}
            </p>
            <div className={`flex items-center space-x-4 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
              {businessInfo?.social_media?.twitter && (
                <a
                  href={businessInfo.social_media.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {businessInfo?.social_media?.linkedin && (
                <a
                  href={businessInfo.social_media.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {businessInfo?.social_media?.facebook && (
                <a
                  href={businessInfo.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  {language === 'ar' ? 'عن المنتدى' : 'About'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">
              {language === 'ar' ? 'الأقسام' : 'Sections'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/briefings" className="hover:text-blue-400 transition-colors">
                  {language === 'ar' ? 'الإحاطات والتقارير' : 'Briefings'}
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-blue-400 transition-colors">
                  {language === 'ar' ? 'الأنشطة' : 'Activities'}
                </Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-blue-400 transition-colors">
                  {language === 'ar' ? 'العضوية' : 'Membership'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <NAP
              variant="footer"
              showIcons={true}
            />
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-center">
            <p className="text-gray-400 text-sm text-center">
              {language === 'ar'
                ? '© 2025 منتدى ريدان للعلاقات الاستراتيجية. جميع الحقوق محفوظة.'
                : '© 2025 Raydan Forum for Strategic Relations. All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
