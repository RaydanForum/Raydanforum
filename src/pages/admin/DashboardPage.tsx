import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FileText, Calendar, Users, UserCircle2, TrendingUp, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Stats {
  briefingsCount: number;
  activitiesCount: number;
  teamMembersCount: number;
  membershipApplicationsCount: number;
  totalViews: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    briefingsCount: 0,
    activitiesCount: 0,
    teamMembersCount: 0,
    membershipApplicationsCount: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentBriefings, setRecentBriefings] = useState<any[]>([]);
  const [upcomingActivities, setUpcomingActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        briefingsResult,
        activitiesResult,
        teamResult,
        membershipResult,
        recentBriefingsResult,
        upcomingActivitiesResult,
      ] = await Promise.all([
        supabase.from('briefings').select('views_count', { count: 'exact', head: false }),
        supabase.from('activities').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('membership_applications').select('*', { count: 'exact', head: true }),
        supabase
          .from('briefings')
          .select('id, title_ar, published_at, views_count, is_featured')
          .order('published_at', { ascending: false })
          .limit(5),
        supabase
          .from('activities')
          .select('id, title_ar, start_date, activity_type_ar')
          .eq('is_upcoming', true)
          .order('start_date', { ascending: true })
          .limit(5),
      ]);

      const totalViews = briefingsResult.data?.reduce((sum, b) => sum + (b.views_count || 0), 0) || 0;

      setStats({
        briefingsCount: briefingsResult.count || 0,
        activitiesCount: activitiesResult.count || 0,
        teamMembersCount: teamResult.count || 0,
        membershipApplicationsCount: membershipResult.count || 0,
        totalViews,
      });

      setRecentBriefings(recentBriefingsResult.data || []);
      setUpcomingActivities(upcomingActivitiesResult.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'الإحاطات',
      value: stats.briefingsCount,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/briefings',
    },
    {
      label: 'الأنشطة',
      value: stats.activitiesCount,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/admin/activities',
    },
    {
      label: 'أعضاء الفريق',
      value: stats.teamMembersCount,
      icon: Users,
      color: 'bg-emerald-500',
      link: '/admin/team',
    },
    {
      label: 'طلبات العضوية',
      value: stats.membershipApplicationsCount,
      icon: UserCircle2,
      color: 'bg-orange-500',
      link: '/admin/membership',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك في لوحة التحكم</h1>
          <p className="text-gray-600">نظرة عامة على إحصائيات المنتدى</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.link}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-sm text-gray-600">{card.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-600">إجمالي المشاهدات</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">أحدث الإحاطات</h2>
              <Link
                to="/admin/briefings"
                className="text-sm text-emerald-600 hover:text-emerald-700 transition"
              >
                عرض الكل
              </Link>
            </div>
            {recentBriefings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد إحاطات بعد</p>
            ) : (
              <ul className="space-y-3">
                {recentBriefings.map((briefing) => (
                  <li
                    key={briefing.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {briefing.title_ar}
                        {briefing.is_featured && (
                          <span className="mr-2 text-xs text-yellow-600">★ مميزة</span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(briefing.published_at).toLocaleDateString('ar-SA')}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {briefing.views_count}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">الأنشطة القادمة</h2>
              <Link
                to="/admin/activities"
                className="text-sm text-emerald-600 hover:text-emerald-700 transition"
              >
                عرض الكل
              </Link>
            </div>
            {upcomingActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد أنشطة قادمة</p>
            ) : (
              <ul className="space-y-3">
                {upcomingActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title_ar}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(activity.start_date).toLocaleDateString('ar-SA')}
                        </p>
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                          {activity.activity_type_ar}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
