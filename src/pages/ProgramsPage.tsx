import { useState } from 'react';
import { Briefcase, Calendar, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Program = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image: string;
  participants: number;
  duration: string;
  status: 'active' | 'upcoming' | 'completed';
};

const samplePrograms: Program[] = [
  {
    id: '1',
    title_ar: 'برنامج تطوير القيادات الشابة',
    title_en: 'Young Leadership Development Program',
    description_ar: 'برنامج تدريبي شامل يهدف إلى تطوير مهارات القيادة والتفكير الاستراتيجي لدى الشباب اليمني وتأهيلهم لتحمل المسؤوليات المستقبلية',
    description_en: 'A comprehensive training program aimed at developing leadership and strategic thinking skills among Yemeni youth and preparing them for future responsibilities',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 45,
    duration: '6 أشهر / 6 Months',
    status: 'active'
  },
  {
    id: '2',
    title_ar: 'مبادرة الحوار المجتمعي',
    title_en: 'Community Dialogue Initiative',
    description_ar: 'مبادرة تهدف إلى تعزيز الحوار البناء بين مختلف مكونات المجتمع اليمني وبناء جسور التواصل والتفاهم',
    description_en: 'An initiative aimed at promoting constructive dialogue among different components of Yemeni society and building bridges of communication and understanding',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 120,
    duration: '12 شهر / 12 Months',
    status: 'active'
  },
  {
    id: '3',
    title_ar: 'برنامج البحث والدراسات الاستراتيجية',
    title_en: 'Strategic Research and Studies Program',
    description_ar: 'برنامج بحثي متخصص يركز على إنتاج أوراق بحثية ودراسات معمقة حول القضايا الاستراتيجية اليمنية والإقليمية',
    description_en: 'A specialized research program focusing on producing research papers and in-depth studies on Yemeni and regional strategic issues',
    image: 'https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 25,
    duration: 'مستمر / Ongoing',
    status: 'active'
  },
  {
    id: '4',
    title_ar: 'منتدى السياسات العامة',
    title_en: 'Public Policy Forum',
    description_ar: 'منصة دورية لمناقشة السياسات العامة وتقديم توصيات عملية لصانعي القرار حول القضايا ذات الأولوية',
    description_en: 'A periodic platform for discussing public policies and providing practical recommendations to decision-makers on priority issues',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 80,
    duration: 'فصلي / Quarterly',
    status: 'upcoming'
  },
  {
    id: '5',
    title_ar: 'برنامج بناء القدرات المؤسسية',
    title_en: 'Institutional Capacity Building Program',
    description_ar: 'برنامج يهدف إلى تعزيز قدرات المؤسسات المحلية في مجالات الحوكمة والإدارة والتخطيط الاستراتيجي',
    description_en: 'A program aimed at enhancing the capacities of local institutions in governance, management, and strategic planning',
    image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 60,
    duration: '9 أشهر / 9 Months',
    status: 'upcoming'
  },
  {
    id: '6',
    title_ar: 'مشروع التوثيق والأرشفة',
    title_en: 'Documentation and Archiving Project',
    description_ar: 'مشروع يهدف إلى توثيق وأرشفة الأحداث والتطورات الاستراتيجية في اليمن والمنطقة لأغراض البحث والدراسة',
    description_en: 'A project aimed at documenting and archiving strategic events and developments in Yemen and the region for research and study purposes',
    image: 'https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 15,
    duration: 'مستمر / Ongoing',
    status: 'completed'
  }
];

export default function ProgramsPage() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  const filteredPrograms = filter === 'all'
    ? samplePrograms
    : samplePrograms.filter(p => p.status === filter);

  const getStatusBadge = (status: string) => {
    const badges = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label_ar: 'نشط',
        label_en: 'Active'
      },
      upcoming: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label_ar: 'قريباً',
        label_en: 'Upcoming'
      },
      completed: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label_ar: 'مكتمل',
        label_en: 'Completed'
      }
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {language === 'ar' ? badge.label_ar : badge.label_en}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-96 bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 to-green-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'} animate-fadeIn`}>
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-12 h-12 text-green-300" />
              <h1 className="text-5xl font-bold text-white">
                {language === 'ar' ? 'البرامج' : 'Programs'}
              </h1>
            </div>
            <p className="text-xl text-green-100 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'برامج ومبادرات استراتيجية تهدف إلى بناء القدرات وتعزيز الحوار وتطوير المهارات القيادية'
                : 'Strategic programs and initiatives aimed at building capacities, promoting dialogue, and developing leadership skills'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`flex items-center gap-4 mb-8 flex-wrap ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-700 font-medium">
            {language === 'ar' ? 'عرض:' : 'Show:'}
          </span>
          {[
            { value: 'all', label_ar: 'الكل', label_en: 'All' },
            { value: 'active', label_ar: 'النشطة', label_en: 'Active' },
            { value: 'upcoming', label_ar: 'القادمة', label_en: 'Upcoming' },
            { value: 'completed', label_ar: 'المكتملة', label_en: 'Completed' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f.value
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {language === 'ar' ? f.label_ar : f.label_en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPrograms.map((program, index) => (
            <article
              key={program.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200 hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={program.image}
                    alt={language === 'ar' ? program.title_ar : program.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className={`md:w-3/5 p-6 ${language === 'ar' ? 'text-right' : 'text-left'} flex flex-col`}>
                  <div className="mb-3">
                    {getStatusBadge(program.status)}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors leading-snug">
                    {language === 'ar' ? program.title_ar : program.title_en}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                    {language === 'ar' ? program.description_ar : program.description_en}
                  </p>

                  <div className={`flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Users className="w-4 h-4" />
                      <span>{program.participants} {language === 'ar' ? 'مشارك' : 'Participants'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{program.duration}</span>
                    </div>
                  </div>

                  <button className={`mt-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium group-hover:gap-3 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span>{language === 'ar' ? 'معرفة المزيد' : 'Learn More'}</span>
                    {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
