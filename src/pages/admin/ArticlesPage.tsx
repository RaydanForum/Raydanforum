import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface Article {
  id: string;
  section_id: string;
  category_id: string | null;
  author_id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  slug: string;
  featured_image: string;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Section {
  id: string;
  title_ar: string;
  title_en: string;
}

interface Category {
  id: string;
  section_id: string;
  title_ar: string;
  title_en: string;
}

export default function ArticlesPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filterSection, setFilterSection] = useState<string>('all');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, sectionsRes, categoriesRes] = await Promise.all([
        supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('sections')
          .select('id, title_ar, title_en')
          .order('order_index', { ascending: true }),
        supabase
          .from('categories')
          .select('id, section_id, title_ar, title_en')
          .order('order_index', { ascending: true }),
      ]);

      if (articlesRes.error) throw articlesRes.error;
      if (sectionsRes.error) throw sectionsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setArticles(articlesRes.data || []);
      setSections(sectionsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleTogglePublish = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          is_published: !article.is_published,
          published_at: !article.is_published ? new Date().toISOString() : article.published_at,
        })
        .eq('id', article.id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update article');
    }
  };

  const handleToggleFeatured = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ is_featured: !article.is_featured })
        .eq('id', article.id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update article');
    }
  };

  const getSectionName = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? (language === 'ar' ? section.title_ar : section.title_en) : 'N/A';
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'N/A';
    const category = categories.find(c => c.id === categoryId);
    return category ? (language === 'ar' ? category.title_ar : category.title_en) : 'N/A';
  };

  const filteredArticles = articles.filter(article => {
    if (filterSection !== 'all' && article.section_id !== filterSection) return false;
    if (filterPublished === 'published' && !article.is_published) return false;
    if (filterPublished === 'draft' && article.is_published) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        article.title_ar.toLowerCase().includes(query) ||
        article.title_en.toLowerCase().includes(query) ||
        article.excerpt_ar.toLowerCase().includes(query) ||
        article.excerpt_en.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (editingArticle || isAdding) {
    return (
      <ArticleForm
        article={editingArticle}
        sections={sections}
        categories={categories}
        onSave={async (article) => {
          await fetchData();
          setEditingArticle(null);
          setIsAdding(false);
        }}
        onCancel={() => {
          setEditingArticle(null);
          setIsAdding(false);
        }}
        language={language}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'ar' ? 'المقالات' : 'Articles'}
        </h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          {language === 'ar' ? 'إضافة مقالة' : 'Add Article'}
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">{language === 'ar' ? 'كل الأقسام' : 'All Sections'}</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {language === 'ar' ? section.title_ar : section.title_en}
              </option>
            ))}
          </select>
          <select
            value={filterPublished}
            onChange={(e) => setFilterPublished(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="published">{language === 'ar' ? 'منشور' : 'Published'}</option>
            <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredArticles.length} {language === 'ar' ? 'مقالة' : 'articles'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {language === 'ar' ? 'العنوان' : 'Title'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {language === 'ar' ? 'القسم' : 'Section'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {language === 'ar' ? 'التصنيف' : 'Category'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {language === 'ar' ? 'المشاهدات' : 'Views'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {article.is_featured && (
                        <Star size={16} className="text-yellow-500 fill-current" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ar' ? article.title_ar : article.title_en}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getSectionName(article.section_id)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getCategoryName(article.category_id)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {article.views_count}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      article.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.is_published
                        ? (language === 'ar' ? 'منشور' : 'Published')
                        : (language === 'ar' ? 'مسودة' : 'Draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFeatured(article)}
                        className={`p-2 rounded-lg ${
                          article.is_featured
                            ? 'text-yellow-600 bg-yellow-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={language === 'ar' ? 'مميز' : 'Featured'}
                      >
                        <Star size={18} className={article.is_featured ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(article)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        title={article.is_published
                          ? (language === 'ar' ? 'إلغاء النشر' : 'Unpublish')
                          : (language === 'ar' ? 'نشر' : 'Publish')}
                      >
                        {article.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => setEditingArticle(article)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ArticleForm({
  article,
  sections,
  categories,
  onSave,
  onCancel,
  language,
}: {
  article: Article | null;
  sections: Section[];
  categories: Category[];
  onSave: (article: Partial<Article>) => void;
  onCancel: () => void;
  language: string;
}) {
  const [formData, setFormData] = useState({
    section_id: article?.section_id || sections[0]?.id || '',
    category_id: article?.category_id || '',
    title_ar: article?.title_ar || '',
    title_en: article?.title_en || '',
    content_ar: article?.content_ar || '',
    content_en: article?.content_en || '',
    excerpt_ar: article?.excerpt_ar || '',
    excerpt_en: article?.excerpt_en || '',
    slug: article?.slug || '',
    featured_image: article?.featured_image || '',
    is_published: article?.is_published ?? false,
    is_featured: article?.is_featured ?? false,
  });

  const [saving, setSaving] = useState(false);

  const filteredCategories = categories.filter(c => c.section_id === formData.section_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const articleData = {
        ...formData,
        author_id: article?.author_id || user.id,
        published_at: formData.is_published && !article?.published_at
          ? new Date().toISOString()
          : article?.published_at,
      };

      if (article) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) throw error;
      }

      onSave(articleData);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {article
            ? (language === 'ar' ? 'تعديل المقالة' : 'Edit Article')
            : (language === 'ar' ? 'إضافة مقالة جديدة' : 'Add New Article')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'القسم' : 'Section'}
            </label>
            <select
              value={formData.section_id}
              onChange={(e) => setFormData({ ...formData, section_id: e.target.value, category_id: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {language === 'ar' ? section.title_ar : section.title_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'التصنيف' : 'Category'}
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">{language === 'ar' ? 'بدون تصنيف' : 'No Category'}</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {language === 'ar' ? category.title_ar : category.title_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}
            </label>
            <input
              type="text"
              value={formData.title_ar}
              onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المقتطف بالعربية' : 'Excerpt (Arabic)'}
            </label>
            <textarea
              value={formData.excerpt_ar}
              onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المقتطف بالإنجليزية' : 'Excerpt (English)'}
            </label>
            <textarea
              value={formData.excerpt_en}
              onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المحتوى بالعربية' : 'Content (Arabic)'}
            </label>
            <textarea
              value={formData.content_ar}
              onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المحتوى بالإنجليزية' : 'Content (English)'}
            </label>
            <textarea
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={10}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'رابط الصورة' : 'Featured Image URL'}
            </label>
            <input
              type="text"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              {language === 'ar' ? 'نشر' : 'Publish'}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              {language === 'ar' ? 'مميز' : 'Featured'}
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
              : (language === 'ar' ? 'حفظ' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
}