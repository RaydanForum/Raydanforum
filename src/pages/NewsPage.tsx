import { useState } from 'react';
import { Calendar, Clock, Tag, Newspaper } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type NewsItem = {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  image: string;
  date: string;
  category: {
    title_ar: string;
    title_en: string;
  };
  readTime: number;
};

const sampleNews: NewsItem[] = [
  {
    id: '1',
    title_ar: 'منتدى ريدان يستضيف وفداً دبلوماسياً رفيع المستوى',
    title_en: 'Raydan Forum Hosts High-Level Diplomatic Delegation',
    excerpt_ar: 'استضاف منتدى ريدان للعلاقات الاستراتيجية وفداً دبلوماسياً رفيع المستوى لمناقشة سبل تعزيز التعاون في المجالات الاستراتيجية',
    excerpt_en: 'Raydan Forum for Strategic Relations hosted a high-level diplomatic delegation to discuss ways to enhance cooperation in strategic areas',
    image: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-11-27',
    category: { title_ar: 'فعاليات', title_en: 'Events' },
    readTime: 5
  },
  {
    id: '2',
    title_ar: 'إطلاق مبادرة جديدة لتعزيز الحوار الوطني',
    title_en: 'Launch of New Initiative to Enhance National Dialogue',
    excerpt_ar: 'أطلق منتدى ريدان مبادرة جديدة تهدف إلى تعزيز الحوار الوطني بين مختلف الأطراف والمكونات اليمنية',
    excerpt_en: 'Raydan Forum launched a new initiative aimed at enhancing national dialogue among various Yemeni parties and components',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-11-25',
    category: { title_ar: 'أخبار', title_en: 'News' },
    readTime: 4
  },
  {
    id: '3',
    title_ar: 'مؤتمر دولي حول مستقبل الأمن في البحر الأحمر',
    title_en: 'International Conference on the Future of Red Sea Security',
    excerpt_ar: 'ينظم منتدى ريدان مؤتمراً دولياً لمناقشة مستقبل الأمن والاستقرار في منطقة البحر الأحمر بمشاركة خبراء دوليين',
    excerpt_en: 'Raydan Forum organizes an international conference to discuss the future of security and stability in the Red Sea region with international experts',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-11-22',
    category: { title_ar: 'مؤتمرات', title_en: 'Conferences' },
    readTime: 6
  },
  {
    id: '4',
    title_ar: 'صدور تقرير جديد حول التحديات الاقتصادية',
    title_en: 'New Report Released on Economic Challenges',
    excerpt_ar: 'أصدر منتدى ريدان تقريراً شاملاً يتناول التحديات الاقتصادية الراهنة ويقدم رؤى استراتيجية للتعامل معها',
    excerpt_en: 'Raydan Forum released a comprehensive report addressing current economic challenges and providing strategic insights',
    image: 'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-11-20',
    category: { title_ar: 'أخبار', title_en: 'News' },
    readTime: 7
  },
  {
    id: '5',
    title_ar: 'ورشة عمل حول القيادة الاستراتيجية للشباب',
    title_en: 'Workshop on Strategic Leadership for Youth',
    excerpt_ar: 'نظم المنتدى ورشة عمل مكثفة حول القيادة الاستراتيجية بمشاركة أكثر من 50 شاباً وشابة من مختلف المحافظات',
    excerpt_en: 'The Forum organized an intensive workshop on strategic leadership with participation of over 50 young men and women from various governorates',
    image: 'https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-11-18',
    category: { title_ar: 'فعاليات', title_en: 'Events' },
    readTime: 4
  },
  {
    id: '6',
    title_ar: 'شراكة استراتيجية مع مركز أبحاث بريطاني',
    title_en: 'Strategic Partnership with British Research Center',
    excerpt_ar: 'وقع منتدى ريدان مذكرة تفاهم مع مركز أبحاث بريطاني مرموق لتبادل الخبرات والأبحاث الاستراتيجية',
    excerpt_en: 'Raydan Forum signed a memorandum of understanding with a prestigious British research center to exchange expertise and strategic research',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-11-15',
    category: { title_ar: 'أخبار', title_en: 'News' },
    readTime: 5
  }
];

export default function NewsPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', title_ar: 'الكل', title_en: 'All' },
    { id: 'news', title_ar: 'أخبار', title_en: 'News' },
    { id: 'events', title_ar: 'فعاليات', title_en: 'Events' },
    { id: 'conferences', title_ar: 'مؤتمرات', title_en: 'Conferences' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-96 bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/95 to-orange-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-12 h-12 text-orange-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'الأخبار والفعاليات' : 'News & Events'}
              </h1>
            </div>
            <p className="text-xl text-orange-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'آخر الأخبار والفعاليات والمؤتمرات التي ينظمها أو يشارك فيها منتدى ريدان للعلاقات الاستراتيجية'
                : 'Latest news, events, and conferences organized by or participated in by Raydan Forum for Strategic Relations'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`flex items-center gap-4 mb-8 flex-wrap ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Tag className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">
            {language === 'ar' ? 'الفئة:' : 'Category:'}
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {language === 'ar' ? cat.title_ar : cat.title_en}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {sampleNews.map((news, index) => (
            <article
              key={news.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-orange-200 hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={news.image}
                    alt={language === 'ar' ? news.title_ar : news.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                    <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full font-medium shadow-lg">
                      {language === 'ar' ? news.category.title_ar : news.category.title_en}
                    </span>
                  </div>
                </div>

                <div className={`md:w-2/3 p-6 lg:p-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors leading-snug">
                    {language === 'ar' ? news.title_ar : news.title_en}
                  </h3>

                  <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                    {language === 'ar' ? news.excerpt_ar : news.excerpt_en}
                  </p>

                  <div className={`flex items-center gap-6 text-sm text-gray-500 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(news.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-4 h-4" />
                      <span>{news.readTime} {language === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
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
