import { Users, User, Crown, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

type MembershipTier = {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  benefits: {
    en: string[];
    ar: string[];
  };
  gradient: string;
  featured?: boolean;
};

const tiers: MembershipTier[] = [
  {
    id: 1,
    icon: User,
    name: {
      en: 'Individual Member',
      ar: 'عضوية فردية'
    },
    description: {
      en: 'For individuals passionate about strategic relations and regional affairs',
      ar: 'للأفراد المهتمين بالعلاقات الاستراتيجية والشؤون الإقليمية'
    },
    benefits: {
      en: [
        'Access to exclusive publications',
        'Invitations to events and webinars',
        'Monthly newsletter subscription',
        'Networking opportunities'
      ],
      ar: [
        'الوصول إلى المنشورات الحصرية',
        'دعوات للفعاليات والندوات',
        'الاشتراك في النشرة الشهرية',
        'فرص التواصل والتشبيك'
      ]
    },
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    icon: Users,
    name: {
      en: 'Institutional Member',
      ar: 'عضوية مؤسسية'
    },
    description: {
      en: 'For organizations seeking strategic partnerships and collaboration',
      ar: 'للمؤسسات الباحثة عن شراكات استراتيجية وتعاون'
    },
    benefits: {
      en: [
        'All Individual Member benefits',
        'Priority event registration',
        'Collaborative research opportunities',
        'Brand visibility on our platform'
      ],
      ar: [
        'جميع مزايا العضوية الفردية',
        'أولوية التسجيل في الفعاليات',
        'فرص البحث التعاوني',
        'ظهور العلامة التجارية على منصتنا'
      ]
    },
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 3,
    icon: Crown,
    name: {
      en: 'Founding Partner',
      ar: 'شريك مؤسس'
    },
    description: {
      en: 'Exclusive partnership for those committed to our long-term vision',
      ar: 'شراكة حصرية للملتزمين برؤيتنا طويلة الأمد'
    },
    benefits: {
      en: [
        'All Institutional benefits',
        'Strategic advisory role',
        'Co-branded initiatives',
        'Premium recognition'
      ],
      ar: [
        'جميع مزايا العضوية المؤسسية',
        'دور استشاري استراتيجي',
        'مبادرات مشتركة',
        'اعتراف وتقدير متميز'
      ]
    },
    gradient: 'from-amber-500 to-amber-600',
    featured: true
  }
];

export default function MembershipPreview() {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Users className="w-10 h-10 text-amber-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              {language === 'ar' ? 'العضوية والانضمام' : 'Membership'}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'ar'
              ? 'انضم إلى مجتمعنا من الخبراء والممارسين المهتمين بالعلاقات الاستراتيجية'
              : 'Join our community of experts and practitioners interested in strategic relations'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={`group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 p-8 border-2 hover:-translate-y-2 ${
                  tier.featured
                    ? 'border-amber-400 ring-4 ring-amber-100'
                    : 'border-gray-100 hover:border-amber-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold rounded-full shadow-lg">
                      {language === 'ar' ? 'مميز' : 'Featured'}
                    </span>
                  </div>
                )}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold text-gray-900 mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? tier.name.ar : tier.name.en}
                </h3>
                <p className={`text-gray-600 mb-6 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? tier.description.ar : tier.description.en}
                </p>
                <ul className="space-y-3 mb-6">
                  {(language === 'ar' ? tier.benefits.ar : tier.benefits.en).map((benefit, idx) => (
                    <li key={idx} className={`flex items-start gap-2 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/membership"
            className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-lg font-semibold rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
              language === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            <span>{language === 'ar' ? 'انضم الآن' : 'Join Now'}</span>
            {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
