import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';
import { RichTextEditor } from './RichTextEditor';

interface NewsItem {
  id: string;
  headline: string;
  date: string;
  excerpt: string;
  content: string;
  quote: string;
  cta_text: string;
  external_link: string;
  display_order: number;
  visible: boolean;
}

const emptyNews: Omit<NewsItem, 'id'> = {
  headline: '',
  date: new Date().toISOString().split('T')[0],
  excerpt: '',
  content: '',
  quote: '',
  cta_text: 'Read More',
  external_link: '',
  display_order: 0,
  visible: true,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function NewsManagement() {
  const { showToast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      showToast('Failed to load news', 'error');
      console.error(error);
    } else {
      setNews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleSave = async (item: Omit<NewsItem, 'id'> & { id?: string }) => {
    setSaving(true);

    if (item.id) {
      // Update existing
      const { error } = await supabase
        .from('news')
        .update({
          headline: item.headline,
          date: item.date,
          excerpt: item.excerpt,
          content: item.content,
          quote: item.quote,
          cta_text: item.cta_text,
          external_link: item.external_link,
          display_order: item.display_order,
          visible: item.visible,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) {
        showToast('Failed to update news', 'error');
        console.error(error);
      } else {
        showToast('News updated', 'success');
        loadNews();
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('news')
        .insert({
          headline: item.headline,
          date: item.date,
          excerpt: item.excerpt,
          content: item.content,
          quote: item.quote,
          cta_text: item.cta_text,
          external_link: item.external_link,
          display_order: item.display_order,
          visible: item.visible,
        });

      if (error) {
        showToast('Failed to create news', 'error');
        console.error(error);
      } else {
        showToast('News created', 'success');
        loadNews();
      }
    }

    setSaving(false);
    setEditingNews(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Failed to delete news', 'error');
      console.error(error);
    } else {
      showToast('News deleted', 'success');
      loadNews();
    }
    setDeleteConfirm(null);
  };

  const handleToggleVisibility = async (item: NewsItem) => {
    const { error } = await supabase
      .from('news')
      .update({ visible: !item.visible })
      .eq('id', item.id);

    if (error) {
      showToast('Failed to update visibility', 'error');
    } else {
      setNews(news.map(n =>
        n.id === item.id ? { ...n, visible: !n.visible } : n
      ));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Loading news...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">News Management</h2>
          <p className="text-sm text-white/60 mt-1">
            {news.length} article{news.length !== 1 ? 's' : ''} published
          </p>
        </div>
        <button
          onClick={() => {
            setEditingNews(emptyNews as NewsItem);
            setIsCreating(true);
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add News
        </button>
      </div>

      {/* News List */}
      <div className="space-y-3">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`border border-white/10 p-4 hover:border-white/20 transition-colors ${
              !item.visible ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-white/40">
                    {formatDate(item.date)}
                  </span>
                  {!item.visible && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400">
                      Hidden
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 truncate">
                  {item.headline}
                </h3>
                {item.excerpt && (
                  <p className="text-xs text-white/60 line-clamp-2">{item.excerpt}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditingNews(item)}
                  className="px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleVisibility(item)}
                  className="px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  title={item.visible ? 'Hide article' : 'Show article'}
                >
                  {item.visible ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {news.length === 0 && (
          <div className="text-center py-12 text-white/40">
            No news articles yet. Click "Add News" to create one.
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setEditingNews(null);
              setIsCreating(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                {isCreating ? 'Add News Article' : 'Edit News Article'}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(editingNews);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Headline *</label>
                  <input
                    type="text"
                    value={editingNews.headline}
                    onChange={(e) => setEditingNews({ ...editingNews, headline: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Date *</label>
                    <input
                      type="date"
                      value={editingNews.date}
                      onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingNews.display_order}
                      onChange={(e) => setEditingNews({ ...editingNews, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Excerpt (shown on card)</label>
                  <textarea
                    value={editingNews.excerpt}
                    onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                    placeholder="Brief summary shown on the news card..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Full Content</label>
                  <RichTextEditor
                    value={editingNews.content}
                    onChange={(value) => setEditingNews({ ...editingNews, content: value })}
                    placeholder="Full article content..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Quote (optional)</label>
                  <textarea
                    value={editingNews.quote}
                    onChange={(e) => setEditingNews({ ...editingNews, quote: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                    placeholder="Optional pullquote to highlight..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">CTA Text</label>
                    <input
                      type="text"
                      value={editingNews.cta_text}
                      onChange={(e) => setEditingNews({ ...editingNews, cta_text: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                      placeholder="Read More"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">External Link (optional)</label>
                    <input
                      type="url"
                      value={editingNews.external_link}
                      onChange={(e) => setEditingNews({ ...editingNews, external_link: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={editingNews.visible}
                    onChange={(e) => setEditingNews({ ...editingNews, visible: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="visible" className="text-sm text-white/70">
                    Visible on website
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNews(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-white text-[#2d382c] text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : isCreating ? 'Create Article' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Delete Article</h3>
              <p className="text-sm text-white/60 mb-4">
                Are you sure you want to delete this article? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
