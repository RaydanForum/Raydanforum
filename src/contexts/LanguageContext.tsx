import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'raydan-forum-language';

const translations = {
  en: {
    'site.title': 'Raydan Forum',
    'site.subtitle': 'For Strategic Relations',
    'site.tagline': 'An independent Yemeni platform for political, media, and community diplomatic relations',

    'nav.home': 'Home',
    'nav.publications': 'Publications',
    'nav.programs': 'Programs',
    'nav.news': 'News',
    'nav.podcasts': 'Podcasts',
    'nav.about': 'About',
    'nav.menu': 'Menu',
    'nav.search': 'Search',
    'nav.language': 'العربية',

    'hero.title': 'Raydan Forum for Strategic Relations',
    'hero.description': 'An independent Yemeni platform dedicated to political, media, and community diplomatic relations, seeking to convey the true image of Yemen with objectivity and professionalism',
    'hero.cta.explore': 'Explore Publications',
    'hero.cta.about': 'Learn About Us',

    'sections.title': 'Main Sections',
    'sections.subtitle': 'Explore the Forum\'s areas of work',

    'section.publications': 'Publications',
    'section.publications.desc': 'Strategic reports, research, and analysis',
    'section.programs': 'Programs',
    'section.programs.desc': 'Strategic programs and projects',
    'section.news': 'News & Events',
    'section.news.desc': 'Latest news, events, and conferences',
    'section.podcasts': 'Podcasts',
    'section.podcasts.desc': 'Audio episodes on strategic issues',
    'section.translations': 'Translations',
    'section.translations.desc': 'Translations of important articles and research',
    'section.about': 'About Us',
    'section.about.desc': 'Information about Raydan Forum, its vision and mission',

    'articles.title': 'Latest Publications',
    'articles.subtitle': 'Follow the latest strategic analysis and research',
    'articles.viewall': 'View All Publications',
    'articles.author': 'Author',
    'articles.views': 'Views',
    'articles.date': 'Date',

    'footer.description': 'An independent Yemeni platform for strategic relations and community diplomacy',
    'footer.quicklinks': 'Quick Links',
    'footer.sections': 'Sections',
    'footer.contact': 'Contact Us',
    'footer.location': 'United Kingdom, London',
    'footer.email': 'info@raydan-forum.org',
    'footer.rights': '© 2025 Raydan Forum for Strategic Relations. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',

    'category.analysis': 'Analysis',
    'category.reports': 'Reports',
    'category.policies': 'Policy Papers',
  },
  ar: {
    'site.title': 'منتدى ريدان',
    'site.subtitle': 'للعلاقات الاستراتيجية',
    'site.tagline': 'منصة يمنية مستقلة للعلاقات السياسية والإعلامية والدبلوماسية المجتمعية',

    'nav.home': 'الرئيسية',
    'nav.publications': 'المنشورات',
    'nav.programs': 'البرامج',
    'nav.news': 'الأخبار',
    'nav.podcasts': 'البودكاست',
    'nav.about': 'عن المنتدى',
    'nav.menu': 'القائمة',
    'nav.search': 'البحث',
    'nav.language': 'EN',

    'hero.title': 'منتدى ريدان للعلاقات الاستراتيجية',
    'hero.description': 'منصة يمنية مستقلة تُعنى بالعلاقات السياسية والإعلامية والدبلوماسية المجتمعية، وتسعى لنقل الصورة الحقيقية عن اليمن بموضوعية ومهنية',
    'hero.cta.explore': 'استكشف المنشورات',
    'hero.cta.about': 'تعرف على المنتدى',

    'sections.title': 'الأقسام الرئيسية',
    'sections.subtitle': 'استكشف مجالات عمل المنتدى',

    'section.publications': 'المنشورات',
    'section.publications.desc': 'التقارير والأبحاث والتحليلات الاستراتيجية',
    'section.programs': 'البرامج',
    'section.programs.desc': 'البرامج والمشاريع الاستراتيجية',
    'section.news': 'الأخبار والفعاليات',
    'section.news.desc': 'آخر الأخبار والفعاليات والمؤتمرات',
    'section.podcasts': 'البودكاست',
    'section.podcasts.desc': 'حلقات صوتية عن القضايا الاستراتيجية',
    'section.translations': 'الترجمات',
    'section.translations.desc': 'ترجمات المقالات والأبحاث الهامة',
    'section.about': 'عن المنتدى',
    'section.about.desc': 'معلومات عن منتدى ريدان ورؤيته ورسالته',

    'articles.title': 'أحدث المنشورات',
    'articles.subtitle': 'تابع آخر التحليلات والأبحاث الاستراتيجية',
    'articles.viewall': 'عرض جميع المنشورات',
    'articles.author': 'الكاتب',
    'articles.views': 'المشاهدات',
    'articles.date': 'التاريخ',

    'footer.description': 'منصة يمنية مستقلة للعلاقات الاستراتيجية والدبلوماسية المجتمعية',
    'footer.quicklinks': 'روابط سريعة',
    'footer.sections': 'الأقسام',
    'footer.contact': 'تواصل معنا',
    'footer.location': 'المملكة المتحدة، لندن',
    'footer.email': 'info@raydan-forum.org',
    'footer.rights': '© 2025 منتدى ريدان للعلاقات الاستراتيجية. جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط والأحكام',

    'category.analysis': 'التحليلات',
    'category.reports': 'التقارير الدورية',
    'category.policies': 'أوراق السياسات',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (savedLanguage === 'ar' || savedLanguage === 'en') ? savedLanguage : 'en';
  });

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLanguage = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      return newLanguage;
    });
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
