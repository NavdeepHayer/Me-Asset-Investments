import { useRef, useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  bucketName?: string;
}

export function RichTextEditor({ value, onChange, placeholder, bucketName = 'news-content' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const insertHtml = useCallback((html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file: ' + error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadFile(file, 'images');
      if (publicUrl) {
        insertHtml(`<img src="${publicUrl}" alt="${file.name}" style="max-width: 100%; height: auto; margin: 1rem 0;" />`);
      }
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  }, [insertHtml, bucketName]);

  const handlePdfUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('PDF must be less than 20MB');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadFile(file, 'pdfs');
      if (publicUrl) {
        // Add parameters to hide PDF viewer toolbar and navigation
        const pdfUrl = `${publicUrl}#toolbar=0&navpanes=0&scrollbar=0`;
        insertHtml(`<iframe src="${pdfUrl}" class="pdf-embed" style="width: 100%; height: 500px; border: 1px solid rgba(255,255,255,0.2); margin: 1rem 0;"></iframe>`);
      }
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  }, [insertHtml, bucketName]);

  return (
    <div className="rich-text-editor">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={handlePdfUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-white/10 border border-white/20 border-b-0">
        <select
          onChange={(e) => {
            if (e.target.value) {
              execCommand('formatBlock', e.target.value);
            }
            e.target.value = '';
          }}
          className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>Heading</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="p">Paragraph</option>
        </select>

        <div className="w-px bg-white/20 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-2 py-1 text-xs font-bold bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-2 py-1 text-xs italic bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-2 py-1 text-xs underline bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Underline"
        >
          U
        </button>

        <div className="w-px bg-white/20 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Bullet List"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Numbered List"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="w-px bg-white/20 mx-1" />

        <button
          type="button"
          onClick={insertLink}
          className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Insert Link"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        <div className="w-px bg-white/20 mx-1" />

        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          title="Insert Image"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* PDF Upload Button */}
        <button
          type="button"
          onClick={() => pdfInputRef.current?.click()}
          disabled={uploading}
          className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          title="Insert PDF"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>

        <div className="w-px bg-white/20 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Clear Formatting"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Upload indicator */}
        {uploading && (
          <span className="ml-2 text-xs text-white/50 flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </span>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[200px] p-3 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 overflow-y-auto"
        style={{ maxHeight: '400px' }}
        data-placeholder={placeholder}
      />

      <style>{`
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          pointer-events: none;
        }
        .rich-text-editor [contenteditable] p {
          margin-bottom: 0.5rem;
        }
        .rich-text-editor [contenteditable] ul,
        .rich-text-editor [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .rich-text-editor [contenteditable] li {
          margin-bottom: 0.25rem;
        }
        .rich-text-editor [contenteditable] a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: underline;
        }
        .rich-text-editor [contenteditable] strong {
          font-weight: 600;
        }
        .rich-text-editor [contenteditable] h1 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
        }
        .rich-text-editor [contenteditable] h2 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
        }
        .rich-text-editor [contenteditable] h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
        }
        .rich-text-editor [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
        }
        .rich-text-editor [contenteditable] iframe {
          max-width: 100%;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
