import { useRef, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="rich-text-editor">
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
      `}</style>
    </div>
  );
}
