import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface Section {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  slug: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  section_id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  slug: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function SectionsPage() {
  const { language } = useLanguage();
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
    fetchCategories();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSaveSection = async (section: Partial<Section>) => {
    try {
      if (section.id) {
        const { error } = await supabase
          .from('sections')
          .update(section)
          .eq('id', section.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sections')
          .insert([section]);

        if (error) throw error;
      }

      await fetchSections();
      setEditingSection(null);
      setIsAddingSection(false);
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const handleSaveCategory = async (category: Partial<Category>) => {
    try {
      if (category.id) {
        const { error } = await supabase
          .from('categories')
          .update(category)
          .eq('id', category.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{ ...category, section_id: selectedSectionId }]);

        if (error) throw error;
      }

      await fetchCategories();
      setEditingCategory(null);
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const getSectionCategories = (sectionId: string) => {
    return categories.filter(cat => cat.section_id === sectionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'ar' ? 'الأقسام والتصنيفات' : 'Sections & Categories'}
        </h1>
        <button
          onClick={() => setIsAddingSection(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          {language === 'ar' ? 'إضافة قسم' : 'Add Section'}
        </button>
      </div>

      {isAddingSection && (
        <SectionForm
          section={null}
          onSave={handleSaveSection}
          onCancel={() => setIsAddingSection(false)}
          language={language}
        />
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              {editingSection?.id === section.id ? (
                <SectionForm
                  section={editingSection}
                  onSave={handleSaveSection}
                  onCancel={() => setEditingSection(null)}
                  language={language}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {language === 'ar' ? section.title_ar : section.title_en}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {language === 'ar' ? section.description_ar : section.description_en}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Slug: {section.slug}</span>
                      <span>Order: {section.order_index}</span>
                      <span className={section.is_active ? 'text-green-600' : 'text-red-600'}>
                        {section.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingSection(section)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'التصنيفات' : 'Categories'}
                </h4>
                <button
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    setIsAddingCategory(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  {language === 'ar' ? 'إضافة تصنيف' : 'Add Category'}
                </button>
              </div>

              {isAddingCategory && selectedSectionId === section.id && (
                <CategoryForm
                  category={null}
                  onSave={handleSaveCategory}
                  onCancel={() => {
                    setIsAddingCategory(false);
                    setSelectedSectionId(null);
                  }}
                  language={language}
                />
              )}

              <div className="space-y-3">
                {getSectionCategories(section.id).map((category) => (
                  <div key={category.id}>
                    {editingCategory?.id === category.id ? (
                      <CategoryForm
                        category={editingCategory}
                        onSave={handleSaveCategory}
                        onCancel={() => setEditingCategory(null)}
                        language={language}
                      />
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {language === 'ar' ? category.title_ar : category.title_en}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {language === 'ar' ? category.description_ar : category.description_en}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Slug: {category.slug}</span>
                            <span>Order: {category.order_index}</span>
                            <span className={category.is_active ? 'text-green-600' : 'text-red-600'}>
                              {category.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionForm({
  section,
  onSave,
  onCancel,
  language,
}: {
  section: Section | null;
  onSave: (section: Partial<Section>) => void;
  onCancel: () => void;
  language: string;
}) {
  const [formData, setFormData] = useState({
    title_ar: section?.title_ar || '',
    title_en: section?.title_en || '',
    description_ar: section?.description_ar || '',
    description_en: section?.description_en || '',
    slug: section?.slug || '',
    icon: section?.icon || 'BookOpen',
    order_index: section?.order_index || 0,
    is_active: section?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(section ? { ...formData, id: section.id } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}
          </label>
          <input
            type="text"
            value={formData.title_ar}
            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}
          </label>
          <input
            type="text"
            value={formData.title_en}
            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}
          </label>
          <textarea
            value={formData.description_ar}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}
          </label>
          <textarea
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm font-medium text-gray-700">
          {language === 'ar' ? 'نشط' : 'Active'}
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <X size={18} />
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save size={18} />
          {language === 'ar' ? 'حفظ' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function CategoryForm({
  category,
  onSave,
  onCancel,
  language,
}: {
  category: Category | null;
  onSave: (category: Partial<Category>) => void;
  onCancel: () => void;
  language: string;
}) {
  const [formData, setFormData] = useState({
    title_ar: category?.title_ar || '',
    title_en: category?.title_en || '',
    description_ar: category?.description_ar || '',
    description_en: category?.description_en || '',
    slug: category?.slug || '',
    order_index: category?.order_index || 0,
    is_active: category?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(category ? { ...formData, id: category.id, section_id: category.section_id } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 mb-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}
          </label>
          <input
            type="text"
            value={formData.title_ar}
            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}
          </label>
          <input
            type="text"
            value={formData.title_en}
            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}
          </label>
          <textarea
            value={formData.description_ar}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}
          </label>
          <textarea
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">
            {language === 'ar' ? 'نشط' : 'Active'}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <X size={18} />
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save size={18} />
          {language === 'ar' ? 'حفظ' : 'Save'}
        </button>
      </div>
    </form>
  );
}