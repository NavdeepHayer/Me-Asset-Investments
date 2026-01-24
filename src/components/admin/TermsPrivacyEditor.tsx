import { useState, useEffect } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

interface LegalContent {
  id: string;
  key: string;
  value: string;
}

const LEGAL_KEYS = ['terms_of_use', 'privacy_policy'];

const contentLabels: Record<string, string> = {
  terms_of_use: 'Terms of Use',
  privacy_policy: 'Privacy Policy',
};

export function TermsPrivacyEditor() {
  const { showToast } = useToast();
  const [content, setContent] = useState<LegalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  const loadContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .in('key', LEGAL_KEYS);

    if (error) {
      showToast('Failed to load legal content', 'error');
      console.error(error);
    } else {
      setContent(data || []);
      const initial: Record<string, string> = {};
      data?.forEach(item => {
        initial[item.key] = item.value;
      });
      setEditedContent(initial);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async (key: string) => {
    setSavingKey(key);

    const existingItem = content.find(item => item.key === key);

    if (existingItem) {
      const { error } = await supabase
        .from('site_content')
        .update({
          value: editedContent[key],
          updated_at: new Date().toISOString(),
        })
        .eq('key', key);

      if (error) {
        showToast('Failed to save content', 'error');
        console.error(error);
      } else {
        showToast('Content saved', 'success');
        setContent(content.map(item =>
          item.key === key ? { ...item, value: editedContent[key] } : item
        ));
      }
    } else {
      const { error } = await supabase
        .from('site_content')
        .insert({
          key: key,
          value: editedContent[key] || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        showToast('Failed to create content', 'error');
        console.error(error);
      } else {
        showToast('Content created', 'success');
        loadContent();
      }
    }

    setSavingKey(null);
  };

  const hasChanged = (key: string) => {
    const original = content.find(item => item.key === key);
    return original?.value !== editedContent[key];
  };

  const handleEditorChange = (key: string, value: string) => {
    setEditedContent(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="text-white/60">Loading legal content...</div>;
  }

  return (
    <div className="space-y-8">
      {LEGAL_KEYS.map((key) => {
        const item = content.find(c => c.key === key);
        const isNew = !item;

        return (
          <div key={key} className="border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-white">
                  {contentLabels[key]}
                </label>
                {isNew && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400">
                    New
                  </span>
                )}
              </div>
              {hasChanged(key) && (
                <span className="text-xs text-yellow-400">Unsaved changes</span>
              )}
            </div>

            <div className="mb-4">
              <RichTextEditor
                value={editedContent[key] || ''}
                onChange={(value) => handleEditorChange(key, value)}
                placeholder={`Enter ${contentLabels[key].toLowerCase()} content...`}
              />
            </div>

            <button
              onClick={() => handleSave(key)}
              disabled={(!hasChanged(key) && !isNew) || savingKey === key}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingKey === key ? 'Saving...' : isNew ? 'Create' : 'Save'}
            </button>
          </div>
        );
      })}

      <div className="border border-white/10 p-4 bg-white/5">
        <h4 className="text-sm font-medium text-white mb-2">Editor Tips</h4>
        <p className="text-xs text-white/60">
          Use the formatting toolbar to add headings, bold/italic text, lists, and links.
          Content saved here will be displayed in the Terms & Privacy modal in the website footer.
        </p>
      </div>
    </div>
  );
}
