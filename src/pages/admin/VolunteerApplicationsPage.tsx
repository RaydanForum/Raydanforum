import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface VolunteerApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city_country: string;
  volunteering_areas: string[];
  other_area_detail: string;
  availability: string;
  motivation: string;
  cv_url: string;
  consent_data_storage: boolean;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string;
  created_at: string;
}

const areaLabels: Record<string, string> = {
  content_writing: 'كتابة محتوى',
  design_editing: 'تصميم / مونتاج',
  marketing_media: 'تسويق وإعلام',
  events: 'تنظيم فعاليات',
  translation: 'ترجمة',
  technical_support: 'دعم تقني',
  other: 'أخرى',
};

const availabilityLabels: Record<string, string> = {
  few_hours_weekly: 'ساعات محدودة أسبوعيًا',
  part_time: 'دوام جزئي',
  as_needed: 'حسب الحاجة',
};

export default function VolunteerApplicationsPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading volunteer applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .update({ status, admin_notes: notes || '' })
        .eq('id', id);

      if (error) throw error;

      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status, admin_notes: notes || '' } : app
        )
      );
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب نهائيًا؟')) return;
    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setApplications(applications.filter((a) => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('حدث خطأ أثناء حذف الطلب');
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
            <Clock className="w-4 h-4" />
            قيد المراجعة
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            <CheckCircle className="w-4 h-4" />
            مقبول
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
            <XCircle className="w-4 h-4" />
            مرفوض
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
      </AdminLayout>
    );
  }

  if (selectedApp) {
    return (
      <VolunteerDetails
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">طلبات التطوع</h1>
          <p className="text-gray-600 mt-1">إدارة ومراجعة طلبات التطوع</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all'
                  ? 'لم يتم العثور على نتائج مطابقة'
                  : 'لا توجد طلبات تطوع حتى الآن'}
              </p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.full_name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {app.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {app.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {app.city_country}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(app.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {app.volunteering_areas?.map((area) => (
                        <span key={area} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-md">
                          {areaLabels[area] || area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(app.status)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(app.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function VolunteerDetails({
  application,
  onClose,
  onStatusUpdate,
  onDelete,
}: {
  application: VolunteerApplication;
  onClose: () => void;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(application.admin_notes || '');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm('هل أنت متأكد من قبول هذا الطلب؟')) return;
    setLoading(true);
    await onStatusUpdate(application.id, 'approved', notes);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
    setLoading(true);
    await onStatusUpdate(application.id, 'rejected', notes);
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={onClose} className="text-emerald-600 hover:text-emerald-700 transition mb-4">
            ← العودة إلى القائمة
          </button>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل طلب التطوع</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{application.full_name}</h2>
              <p className="text-gray-600">
                تاريخ التقديم: {new Date(application.created_at).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {application.status === 'pending' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  <Clock className="w-4 h-4" />
                  قيد المراجعة
                </span>
              ) : application.status === 'approved' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  مقبول
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                  <XCircle className="w-4 h-4" />
                  مرفوض
                </span>
              )}
              <button
                onClick={() => onDelete(application.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="حذف"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</h3>
              <p className="text-gray-900">{application.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">رقم الهاتف</h3>
              <p className="text-gray-900">{application.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">المدينة / البلد</h3>
              <p className="text-gray-900">{application.city_country}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">الوقت المتاح</h3>
              <p className="text-gray-900">{availabilityLabels[application.availability] || application.availability}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">مجالات التطوع</h3>
            <div className="flex flex-wrap gap-2">
              {application.volunteering_areas?.map((area) => (
                <span key={area} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm rounded-lg">
                  {areaLabels[area] || area}
                </span>
              ))}
            </div>
            {application.other_area_detail && (
              <p className="mt-2 text-sm text-gray-600">توضيح: {application.other_area_detail}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">سبب الرغبة في التطوع</h3>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{application.motivation}</p>
          </div>

          {application.cv_url && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">السيرة الذاتية / نماذج الأعمال</h3>
              <a
                href={application.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                عرض الملف المرفق
              </a>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">ملاحظات الإدارة</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="أضف ملاحظات حول هذا الطلب..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {application.status === 'pending' && (
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                قبول الطلب
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
                رفض الطلب
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
