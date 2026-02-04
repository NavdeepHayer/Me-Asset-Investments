import { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

// Supabase storage bucket
const STORAGE_BUCKET = 'news-content';

// Default document categories
const DEFAULT_CATEGORIES = ['pdfs'];

interface GalleryDocument {
  url: string;
  name: string;
  category: string;
}

interface PDFPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function PDFPicker({
  value,
  onChange,
  label = 'Document',
  required = false,
}: PDFPickerProps) {
  const { showToast } = useToast();
  const fileInputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [uploadCategory, setUploadCategory] = useState<string>('pdfs');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [documents, setDocuments] = useState<GalleryDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories from localStorage
  useEffect(() => {
    const savedCats = localStorage.getItem('gallery_document_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    }
  }, [isOpen]);

  // Load documents from Supabase storage
  const loadDocuments = async () => {
    setLoading(true);
    const allDocuments: GalleryDocument[] = [];

    try {
      // Load from each category
      for (const category of categories) {
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list(category, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (error) {
          console.error(`Error loading documents from ${category}:`, error);
          continue;
        }

        if (data) {
          const categoryDocs = data
            .filter(file => {
              if (file.name.startsWith('.')) return false;
              const ext = file.name.split('.').pop()?.toLowerCase() || '';
              return ['pdf'].includes(ext);
            })
            .map(file => {
              const { data: urlData } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(`${category}/${file.name}`);

              return {
                url: urlData.publicUrl,
                name: file.name,
                category: category,
              };
            });

          allDocuments.push(...categoryDocs);
        }
      }

      setDocuments(allDocuments);
    } catch (err) {
      console.error('Error loading documents:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen, categories]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      showToast('Please select a PDF file', 'error');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      showToast('PDF must be less than 20MB', 'error');
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `${uploadCategory}/${filename}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        showToast('Failed to upload document', 'error');
      } else {
        showToast('Document uploaded successfully', 'success');
        // Get the public URL and select it
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);
        setSelectedDocument(urlData.publicUrl);
        // Reload the list
        loadDocuments();
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Failed to upload document', 'error');
    }
    setUploading(false);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelect = () => {
    onChange(selectedDocument);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setSelectedDocument('');
  };

  // Filter documents by category
  const filteredDocuments = activeCategory === 'all'
    ? documents
    : documents.filter(doc => doc.category === activeCategory);

  // Format category name for display
  const formatCategoryName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Get filename from URL
  const getFilename = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div>
      {/* File input - MUST be outside AnimatePresence to work in Firefox */}
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept=".pdf"
        onChange={handleUpload}
        disabled={uploading}
        className="sr-only"
      />

      <label className="block text-xs font-medium text-white/60 mb-1">
        {label} {required && '*'}
      </label>

      {/* Current document preview */}
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative w-24 h-24 bg-white/5 border border-white/20 overflow-hidden flex-shrink-0 flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-red-400 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
            </svg>
            <span className="text-[10px] text-white/60">PDF</span>
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              title="Remove document"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 bg-white/5 border border-white/20 border-dashed flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="flex-1">
          <button
            type="button"
            onClick={() => {
              setSelectedDocument(value);
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            {value ? 'Change Document' : 'Select Document'}
          </button>
          {value && (
            <p className="text-xs text-white/40 mt-2 break-all max-w-xs">
              {getFilename(value)}
            </p>
          )}
        </div>
      </div>

      {/* Document picker modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Select Document from Gallery</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category Tabs */}
              {categories.length > 1 && (
                <div className="flex items-center gap-2 p-4 border-b border-white/10 flex-wrap">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                        activeCategory === category
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {formatCategoryName(category)}
                    </button>
                  ))}
                </div>
              )}

              {/* Upload section */}
              <div className="p-4 border-b border-white/10 flex items-center gap-4 flex-wrap">
                <label
                  htmlFor={fileInputId}
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors cursor-pointer ${
                    uploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload New PDF
                    </>
                  )}
                </label>
                {categories.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">to:</span>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="px-2 py-1 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{formatCategoryName(cat)}</option>
                      ))}
                    </select>
                  </div>
                )}
                <span className="text-xs text-white/40">Max 20MB</span>
              </div>

              {/* Document grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white/60">Loading documents...</div>
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/40">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p>No documents in {activeCategory === 'all' ? 'the gallery' : `"${formatCategoryName(activeCategory)}"`}.</p>
                    <p className="text-sm mt-1">Upload some using the button above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredDocuments.map((doc) => (
                      <button
                        key={doc.url}
                        type="button"
                        onClick={() => setSelectedDocument(doc.url)}
                        className={`aspect-[3/4] bg-white/5 border-2 overflow-hidden transition-all relative group flex flex-col items-center justify-center p-3 ${
                          selectedDocument === doc.url
                            ? 'border-white ring-2 ring-white/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <svg className="w-12 h-12 text-red-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
                        </svg>
                        <p className="text-xs text-white/60 text-center truncate w-full">{doc.name}</p>

                        {/* Selected indicator */}
                        {selectedDocument === doc.url && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-white flex items-center justify-center">
                            <svg className="w-3 h-3 text-[#2d382c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-white/40">
                  {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSelect}
                    disabled={!selectedDocument}
                    className="px-4 py-2 bg-white text-[#2d382c] text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select Document
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
