import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Users,
} from 'lucide-react';

interface MembershipApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  membership_tier: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
}

export default function MembershipApplicationsPage() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('membership_applications')
        .update({ status, admin_notes: notes || null })
        .eq('id', id);

      if (error) throw error;

      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status, admin_notes: notes || null } : app
        )
      );

      if (selectedApplication?.id === id) {
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const filteredApplications = applications.filter((app) => {
    const fullName = `${app.first_name} ${app.last_name}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const getMembershipTierLabel = (tier: string) => {
    switch (tier) {
      case 'individual':
        return 'عضوية فردية';
      case 'institutional':
        return 'عضوية مؤسسية';
      case 'founding':
        return 'شريك مؤسس';
      default:
        return tier;
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

  if (selectedApplication) {
    return (
      <ApplicationDetails
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onStatusUpdate={handleStatusUpdate}
        getMembershipTierLabel={getMembershipTierLabel}
      />
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">طلبات العضوية</h1>
          <p className="text-gray-600 mt-1">إدارة ومراجعة طلبات الانضمام للمنتدى</p>
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
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all'
                  ? 'لم يتم العثور على نتائج مطابقة'
                  : 'لا توجد طلبات عضوية حتى الآن'}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                onClick={() => setSelectedApplication(application)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {application.first_name} {application.last_name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {application.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {application.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {getMembershipTierLabel(application.membership_tier)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(application.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(application.status)}</div>
                </div>

                {application.admin_notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">ملاحظات الإدارة:</span>{' '}
                      {application.admin_notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function ApplicationDetails({
  application,
  onClose,
  onStatusUpdate,
  getMembershipTierLabel,
}: {
  application: MembershipApplication;
  onClose: () => void;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  getMembershipTierLabel: (tier: string) => string;
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
          <button
            onClick={onClose}
            className="text-emerald-600 hover:text-emerald-700 transition mb-4"
          >
            ← العودة إلى القائمة
          </button>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطلب</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {application.first_name} {application.last_name}
              </h2>
              <p className="text-gray-600">تاريخ التقديم: {new Date(application.created_at).toLocaleDateString('ar-SA')}</p>
            </div>
            <div>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">الاسم الأول</h3>
              <p className="text-gray-900">{application.first_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">اللقب</h3>
              <p className="text-gray-900">{application.last_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</h3>
              <p className="text-gray-900">{application.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">رقم الهاتف</h3>
              <p className="text-gray-900">{application.phone}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">العنوان</h3>
              <p className="text-gray-900">{application.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">نوع العضوية</h3>
              <p className="text-gray-900">{getMembershipTierLabel(application.membership_tier)}</p>
            </div>
          </div>

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
