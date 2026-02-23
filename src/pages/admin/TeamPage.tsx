import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Users, Loader2, Mail, Linkedin, Twitter, Upload, X } from 'lucide-react';

interface TeamMember {
  id: string;
  name_ar: string;
  name_en: string;
  position_ar: string;
  position_en: string;
  bio_ar: string;
  bio_en: string;
  photo_url: string;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  display_order: number;
  is_leadership: boolean;
  is_active: boolean;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;

    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      setMembers(members.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('حدث خطأ أثناء حذف العضو');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
    loadMembers();
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position_ar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return <MemberForm member={editingMember} onClose={handleFormClose} />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الفريق</h1>
            <p className="text-gray-600 mt-1">إضافة وتعديل أعضاء الفريق والقيادة</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة عضو جديد</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الأعضاء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد أعضاء</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'لم يتم العثور على نتائج مطابقة' : 'ابدأ بإضافة أول عضو'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة عضو جديد</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <img
                    src={member.photo_url}
                    alt={member.name_ar}
                    className="w-24 h-24 rounded-full object-cover object-top mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name_ar}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{member.name_en}</p>
                  <p className="text-sm text-emerald-600 font-medium mb-2">
                    {member.position_ar}
                  </p>
                  {member.is_leadership && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      قيادة
                    </span>
                  )}
                  {!member.is_active && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mt-1">
                      غير نشط
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {member.bio_ar}
                </p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">تعديل</span>
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function MemberForm({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(member?.photo_url || '');
  const [formData, setFormData] = useState({
    name_ar: member?.name_ar || '',
    name_en: member?.name_en || '',
    position_ar: member?.position_ar || '',
    position_en: member?.position_en || '',
    bio_ar: member?.bio_ar || '',
    bio_en: member?.bio_en || '',
    photo_url: member?.photo_url || '',
    email: member?.email || '',
    linkedin_url: member?.linkedin_url || '',
    twitter_url: member?.twitter_url || '',
    display_order: member?.display_order || 0,
    is_leadership: member?.is_leadership || false,
    is_active: member?.is_active ?? true,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const uploadPhoto = async (): Promise<string> => {
    if (!photoFile) return formData.photo_url;

    setUploading(true);
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('team-photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('team-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error('فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const photoUrl = await uploadPhoto();

      const data = {
        ...formData,
        photo_url: photoUrl,
        email: formData.email || null,
        linkedin_url: formData.linkedin_url || null,
        twitter_url: formData.twitter_url || null,
      };

      if (member) {
        const { error } = await supabase
          .from('team_members')
          .update(data)
          .eq('id', member.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team_members').insert([data]);
        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('حدث خطأ أثناء حفظ العضو');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {member ? 'تعديل العضو' : 'إضافة عضو جديد'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم بالعربية *
              </label>
              <input
                type="text"
                required
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name in English *
              </label>
              <input
                type="text"
                required
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المنصب بالعربية *
              </label>
              <input
                type="text"
                required
                value={formData.position_ar}
                onChange={(e) => setFormData({ ...formData, position_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position in English *
              </label>
              <input
                type="text"
                required
                value={formData.position_en}
                onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السيرة بالعربية *
              </label>
              <textarea
                required
                rows={5}
                value={formData.bio_ar}
                onChange={(e) => setFormData({ ...formData, bio_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio in English *
              </label>
              <textarea
                required
                rows={5}
                value={formData.bio_en}
                onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الصورة الشخصية *
            </label>
            {photoPreview ? (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover object-top border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">اختر صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    required={!member}
                  />
                </label>
                <span className="text-sm text-gray-500">JPG, PNG, WEBP (حد أقصى 5MB)</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط Twitter
              </label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب العرض
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_leadership}
                  onChange={(e) => setFormData({ ...formData, is_leadership: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">عضو قيادة</span>
              </label>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">نشط</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{uploading ? 'جاري رفع الصورة...' : 'جاري الحفظ...'}</span>
                </>
              ) : (
                <span>{member ? 'حفظ التعديلات' : 'إضافة العضو'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
