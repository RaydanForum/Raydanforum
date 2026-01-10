import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Target,
  UserCircle2,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Settings,
  Building2
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'لوحة التحكم',
      exact: true,
    },
    {
      path: '/admin/home-content',
      icon: Home,
      label: 'محتوى الصفحة الرئيسية',
    },
    {
      path: '/admin/briefings',
      icon: FileText,
      label: 'الإحاطات',
    },
    {
      path: '/admin/activities',
      icon: Calendar,
      label: 'الأنشطة',
    },
    {
      path: '/admin/team',
      icon: Users,
      label: 'الفريق',
    },
    {
      path: '/admin/values',
      icon: Target,
      label: 'القيم والرؤية',
    },
    {
      path: '/admin/membership',
      icon: UserCircle2,
      label: 'طلبات العضوية',
    },
    {
      path: '/admin/business-info',
      icon: Building2,
      label: 'معلومات المنشأة و SEO',
    },
    {
      path: '/admin/settings',
      icon: Settings,
      label: 'إعدادات الموقع',
    },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-gray-200 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">منتدى ريدان</p>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        active
                          ? 'bg-emerald-50 text-emerald-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                      {active && (
                        <ChevronRight className="w-4 h-4 mr-auto" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {admin?.full_name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {admin?.role === 'super_admin' ? 'مسؤول رئيسي' : 'محرر'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:mr-72">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-1 lg:flex-none">
                <h2 className="text-lg font-semibold text-gray-900">
                  {menuItems.find((item) => isActive(item.path, item.exact))?.label || 'لوحة التحكم'}
                </h2>
              </div>
              <div className="hidden lg:block">
                <Link
                  to="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition"
                >
                  عرض الموقع
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
