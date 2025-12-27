import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface StatData {
  id: string;
  label_ar: string;
  label_en: string;
  value: string;
  icon: string;
  display_order: number;
}

export default function StatsSection() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<StatData[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await supabase
      .from('site_stats')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (data) setStats(data);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return Icon;
  };

  if (stats.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <div
                key={stat.id}
                className="text-center group animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-emerald-50 font-medium">
                  {language === 'ar' ? stat.label_ar : stat.label_en}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
