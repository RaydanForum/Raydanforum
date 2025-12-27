import { useState } from 'react';
import { Radio, Play, Clock, Calendar, Headphones } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Podcast = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image: string;
  duration: string;
  date: string;
  listens: number;
  host: {
    name_ar: string;
    name_en: string;
  };
};

const samplePodcasts: Podcast[] = [
  {
    id: '1',
    title_ar: 'مستقبل العلاقات اليمنية الإقليمية',
    title_en: 'The Future of Yemeni Regional Relations',
    description_ar: 'حلقة نقاشية معمقة حول مستقبل العلاقات اليمنية مع دول المنطقة والفرص المتاحة لتعزيز التعاون الإقليمي',
    description_en: 'An in-depth discussion episode on the future of Yemeni relations with regional countries and opportunities to enhance regional cooperation',
    image: 'https://images.pexels.com/photos/7551672/pexels-photo-7551672.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45:30',
    date: '2025-11-26',
    listens: 2340,
    host: { name_ar: 'د. أحمد السياغي', name_en: 'Dr. Ahmed Al-Sayaghi' }
  },
  {
    id: '2',
    title_ar: 'التحديات الأمنية في البحر الأحمر',
    title_en: 'Security Challenges in the Red Sea',
    description_ar: 'استعراض شامل للتحديات الأمنية في منطقة البحر الأحمر وتأثيرها على الملاحة الدولية والأمن الإقليمي',
    description_en: 'A comprehensive review of security challenges in the Red Sea region and their impact on international navigation and regional security',
    image: 'https://images.pexels.com/photos/7551670/pexels-photo-7551670.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '52:15',
    date: '2025-11-19',
    listens: 1890,
    host: { name_ar: 'أ. فاطمة الحكيمي', name_en: 'Ms. Fatima Al-Hakami' }
  },
  {
    id: '3',
    title_ar: 'الشباب ودورهم في بناء السلام',
    title_en: 'Youth and Their Role in Peacebuilding',
    description_ar: 'حوار مفتوح مع قيادات شبابية حول دور الشباب في عملية بناء السلام والتنمية في اليمن',
    description_en: 'An open dialogue with youth leaders on the role of youth in peacebuilding and development in Yemen',
    image: 'https://images.pexels.com/photos/7551669/pexels-photo-7551669.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '38:45',
    date: '2025-11-12',
    listens: 2150,
    host: { name_ar: 'أ. محمد العزاني', name_en: 'Mr. Mohammed Al-Azzani' }
  },
  {
    id: '4',
    title_ar: 'الاقتصاد اليمني: الواقع والحلول',
    title_en: 'Yemeni Economy: Reality and Solutions',
    description_ar: 'تحليل اقتصادي شامل للوضع الراهن ومناقشة الحلول العملية لتحقيق الانتعاش الاقتصادي',
    description_en: 'A comprehensive economic analysis of the current situation and discussion of practical solutions to achieve economic recovery',
    image: 'https://images.pexels.com/photos/7551421/pexels-photo-7551421.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '48:20',
    date: '2025-11-05',
    listens: 1720,
    host: { name_ar: 'د. سارة المطري', name_en: 'Dr. Sarah Al-Matari' }
  },
  {
    id: '5',
    title_ar: 'الدبلوماسية الثقافية ودورها في التواصل',
    title_en: 'Cultural Diplomacy and Its Role in Communication',
    description_ar: 'استكشاف أهمية الدبلوماسية الثقافية في تعزيز التفاهم بين الشعوب وبناء جسور التواصل',
    description_en: 'Exploring the importance of cultural diplomacy in promoting understanding between peoples and building bridges of communication',
    image: 'https://images.pexels.com/photos/7551424/pexels-photo-7551424.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '41:10',
    date: '2025-10-29',
    listens: 1560,
    host: { name_ar: 'د. خالد الوجيه', name_en: 'Dr. Khaled Al-Wajeeh' }
  },
  {
    id: '6',
    title_ar: 'المرأة اليمنية في صنع القرار',
    title_en: 'Yemeni Women in Decision-Making',
    description_ar: 'حوار حول دور المرأة اليمنية في عمليات صنع القرار وأهمية تعزيز مشاركتها في الحياة العامة',
    description_en: 'A dialogue on the role of Yemeni women in decision-making processes and the importance of enhancing their participation in public life',
    image: 'https://images.pexels.com/photos/7551675/pexels-photo-7551675.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '44:55',
    date: '2025-10-22',
    listens: 2010,
    host: { name_ar: 'أ. نادية الكوكباني', name_en: 'Ms. Nadia Al-Kokabani' }
  }
];

export default function PodcastsPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-96 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/7551657/pexels-photo-7551657.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 to-purple-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-12 h-12 text-purple-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'البودكاست' : 'Podcasts'}
              </h1>
            </div>
            <p className="text-xl text-purple-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'حلقات صوتية متخصصة تناقش القضايا الاستراتيجية والسياسية والاقتصادية مع خبراء ومختصين'
                : 'Specialized audio episodes discussing strategic, political, and economic issues with experts and specialists'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {samplePodcasts.map((podcast, index) => (
            <article
              key={podcast.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-purple-200 hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={podcast.image}
                  alt={language === 'ar' ? podcast.title_ar : podcast.title_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all shadow-lg">
                  <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                </button>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className={`flex items-center gap-2 text-white ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{podcast.duration}</span>
                  </div>
                </div>
              </div>

              <div className={`p-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors leading-snug">
                  {language === 'ar' ? podcast.title_ar : podcast.title_en}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                  {language === 'ar' ? podcast.description_ar : podcast.description_en}
                </p>

                <div className={`flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span className="font-medium text-gray-700">
                      {language === 'ar' ? podcast.host.name_ar : podcast.host.name_en}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Headphones className="w-4 h-4" />
                      <span>{podcast.listens.toLocaleString()}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(podcast.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
