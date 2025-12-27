import { FileText, Briefcase, Calendar, Radio, Languages, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type SectionCardProps = {
  icon: string;
  title: string;
  description: string;
  link: string;
};

const iconMap = {
  'file-text': FileText,
  'briefcase': Briefcase,
  'calendar': Calendar,
  'radio': Radio,
  'languages': Languages,
  'info': Info,
};

export default function SectionCard({ icon, title, description, link }: SectionCardProps) {
  const { language } = useLanguage();
  const IconComponent = iconMap[icon as keyof typeof iconMap] || FileText;
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <a
      href={link}
      className="group bg-white rounded-xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-100 hover:-translate-y-2 hover:scale-105 flex flex-col h-full"
    >
      <div className={`flex items-start justify-between mb-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className="p-3 lg:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 transition-colors flex-shrink-0">
          <IconComponent className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600" />
        </div>
        <Arrow className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all flex-shrink-0 ${language === 'ar' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
      </div>

      <h3 className={`text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {title}
      </h3>

      <p className={`text-gray-600 leading-relaxed text-sm lg:text-base ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {description}
      </p>
    </a>
  );
}
