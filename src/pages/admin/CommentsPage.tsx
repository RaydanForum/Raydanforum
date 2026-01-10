import { useState, useEffect } from 'react';
import { Check, X, Trash2, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

interface Article {
  id: string;
  title_ar: string;
  title_en: string;
}

interface User {
  id: string;
  full_name_ar: string;
  full_name_en: string;
}

export default function CommentsPage() {
  const { language } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterArticle, setFilterArticle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingComment, setViewingComment] = useState<Comment | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [commentsRes, articlesRes, usersRes] = await Promise.all([
        supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('articles')
          .select('id, title_ar, title_en'),
        supabase
          .from('users')
          .select('id, full_name_ar, full_name_en'),
      ]);

      if (commentsRes.error) throw commentsRes.error;
      if (articlesRes.error) throw articlesRes.error;
      if (usersRes.error) throw usersRes.error;

      setComments(commentsRes.data || []);
      setArticles(articlesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Failed to approve comment');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: false })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      alert('Failed to reject comment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const getArticleTitle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    return article ? (language === 'ar' ? article.title_ar : article.title_en) : 'N/A';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user
      ? (language === 'ar' ? user.full_name_ar : user.full_name_en)
      : 'Unknown User';
  };

  const filteredComments = comments.filter(comment => {
    if (filterStatus === 'approved' && !comment.is_approved) return false;
    if (filterStatus === 'pending' && comment.is_approved) return false;
    if (filterArticle !== 'all' && comment.article_id !== filterArticle) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        comment.content.toLowerCase().includes(query) ||
        getUserName(comment.user_id).toLowerCase().includes(query) ||
        getArticleTitle(comment.article_id).toLowerCase().includes(query)
      );
    }

    return true;
  });

  const pendingCount = comments.filter(c => !c.is_approved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? 'التعليقات' : 'Comments'}
          </h1>
          {pendingCount > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              {pendingCount} {language === 'ar' ? 'تعليق بانتظار الموافقة' : 'pending approval'}
            </p>
          )}
        </div>
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
            value={filterArticle}
            onChange={(e) => setFilterArticle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">{language === 'ar' ? 'كل المقالات' : 'All Articles'}</option>
            {articles.map((article) => (
              <option key={article.id} value={article.id}>
                {language === 'ar' ? article.title_ar : article.title_en}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="approved">{language === 'ar' ? 'موافق عليه' : 'Approved'}</option>
            <option value="pending">{language === 'ar' ? 'بانتظار الموافقة' : 'Pending'}</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredComments.length} {language === 'ar' ? 'تعليق' : 'comments'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !comment.is_approved ? 'border-l-4 border-orange-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-900">
                    {getUserName(comment.user_id)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    comment.is_approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {comment.is_approved
                      ? (language === 'ar' ? 'موافق عليه' : 'Approved')
                      : (language === 'ar' ? 'بانتظار' : 'Pending')}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {language === 'ar' ? 'على المقالة:' : 'On article:'}{' '}
                  <span className="font-medium">{getArticleTitle(comment.article_id)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              {comment.content.length > 200 && !viewingComment
                ? comment.content.substring(0, 200) + '...'
                : comment.content}
            </p>

            {comment.content.length > 200 && (
              <button
                onClick={() => setViewingComment(viewingComment?.id === comment.id ? null : comment)}
                className="text-blue-600 text-sm mb-4 hover:underline"
              >
                {viewingComment?.id === comment.id
                  ? (language === 'ar' ? 'عرض أقل' : 'Show less')
                  : (language === 'ar' ? 'عرض المزيد' : 'Show more')}
              </button>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              {!comment.is_approved && (
                <button
                  onClick={() => handleApprove(comment.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Check size={18} />
                  {language === 'ar' ? 'موافقة' : 'Approve'}
                </button>
              )}
              {comment.is_approved && (
                <button
                  onClick={() => handleReject(comment.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <X size={18} />
                  {language === 'ar' ? 'رفض' : 'Reject'}
                </button>
              )}
              <button
                onClick={() => handleDelete(comment.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 size={18} />
                {language === 'ar' ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">
              {language === 'ar' ? 'لا توجد تعليقات' : 'No comments found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}