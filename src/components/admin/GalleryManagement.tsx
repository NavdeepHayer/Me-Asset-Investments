import { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

// Storage bucket
const STORAGE_BUCKET = 'news-content';

// Default categories
const DEFAULT_IMAGE_CATEGORIES = ['projects', 'news', 'team', 'general'];
const DEFAULT_DOCUMENT_CATEGORIES = ['pdfs'];

interface MediaItem {
  name: string;
  url: string;
  category: string;
  type: 'image' | 'document';
  size?: number;
  created_at?: string;
}

type MediaType = 'images' | 'documents';

export function GalleryManagement() {
  const { showToast } = useToast();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [mediaType, setMediaType] = useState<MediaType>('images');
  const [imageCategories, setImageCategories] = useState<string[]>(DEFAULT_IMAGE_CATEGORIES);
  const [documentCategories, setDocumentCategories] = useState<string[]>(DEFAULT_DOCUMENT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>('projects');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Get current categories based on media type
  const currentCategories = mediaType === 'images' ? imageCategories : documentCategories;

  // Load categories from localStorage
  useEffect(() => {
    const savedImageCats = localStorage.getItem('gallery_image_categories');
    const savedDocCats = localStorage.getItem('gallery_document_categories');

    if (savedImageCats) {
      setImageCategories(JSON.parse(savedImageCats));
    }
    if (savedDocCats) {
      setDocumentCategories(JSON.parse(savedDocCats));
    }
  }, []);

  // Save categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('gallery_image_categories', JSON.stringify(imageCategories));
  }, [imageCategories]);

  useEffect(() => {
    localStorage.setItem('gallery_document_categories', JSON.stringify(documentCategories));
  }, [documentCategories]);

  // Load media from Supabase
  const loadMedia = async () => {
    setLoading(true);
    setSelectedItems(new Set());

    try {
      const folderPath = mediaType === 'images' ? `images/${activeCategory}` : activeCategory;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(folderPath, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading media:', error);
        setMedia([]);
        setLoading(false);
        return;
      }

      if (data) {
        const items: MediaItem[] = data
          .filter(file => {
            if (file.name.startsWith('.')) return false;

            const ext = file.name.split('.').pop()?.toLowerCase() || '';
            if (mediaType === 'images') {
              return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
            } else {
              return ['pdf'].includes(ext);
            }
          })
          .map(file => {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(`${folderPath}/${file.name}`);

            return {
              name: file.name,
              url: urlData.publicUrl,
              category: activeCategory,
              type: mediaType === 'images' ? 'image' : 'document',
              size: file.metadata?.size,
              created_at: file.created_at,
            };
          });

        setMedia(items);
      }
    } catch (err) {
      console.error('Error loading media:', err);
      setMedia([]);
    }

    setLoading(false);
  };

  // Load media when category or type changes
  useEffect(() => {
    loadMedia();
  }, [activeCategory, mediaType]);

  // Handle media type change
  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    setActiveCategory(type === 'images' ? 'projects' : 'pdfs');
    setSelectedItems(new Set());
  };

  // Handle file upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of Array.from(files)) {
      // Validate file type
      if (mediaType === 'images' && !file.type.startsWith('image/')) {
        showToast(`${file.name} is not an image`, 'error');
        errorCount++;
        continue;
      }
      if (mediaType === 'documents' && file.type !== 'application/pdf') {
        showToast(`${file.name} is not a PDF`, 'error');
        errorCount++;
        continue;
      }

      // Validate file size (10MB for images, 20MB for documents)
      const maxSize = mediaType === 'images' ? 10 * 1024 * 1024 : 20 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast(`${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`, 'error');
        errorCount++;
        continue;
      }

      try {
        // Generate unique filename
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const folderPath = mediaType === 'images' ? `images/${activeCategory}` : activeCategory;
        const filePath = `${folderPath}/${filename}`;

        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file);

        if (error) {
          console.error('Upload error:', error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error('Upload error:', err);
        errorCount++;
      }
    }

    if (successCount > 0) {
      showToast(`${successCount} file(s) uploaded successfully`, 'success');
      loadMedia();
    }
    if (errorCount > 0) {
      showToast(`${errorCount} file(s) failed to upload`, 'error');
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle selection toggle
  const toggleSelection = (url: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedItems(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(media.map(m => m.url)));
    }
  };

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;

    setDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const url of selectedItems) {
      const item = media.find(m => m.url === url);
      if (!item) continue;

      const folderPath = mediaType === 'images' ? `images/${activeCategory}` : activeCategory;
      const filePath = `${folderPath}/${item.name}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        errorCount++;
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      showToast(`${successCount} file(s) deleted`, 'success');
      loadMedia();
    }
    if (errorCount > 0) {
      showToast(`${errorCount} file(s) failed to delete`, 'error');
    }

    setSelectedItems(new Set());
    setDeleting(false);
    setDeleteConfirm(null);
  };

  // Handle add category
  const handleAddCategory = () => {
    const categorySlug = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (!categorySlug) {
      showToast('Please enter a valid category name', 'error');
      return;
    }

    if (currentCategories.includes(categorySlug)) {
      showToast('Category already exists', 'error');
      return;
    }

    if (mediaType === 'images') {
      setImageCategories([...imageCategories, categorySlug]);
    } else {
      setDocumentCategories([...documentCategories, categorySlug]);
    }

    setNewCategoryName('');
    setShowAddCategory(false);
    setActiveCategory(categorySlug);
    showToast('Category added', 'success');
  };

  // Handle remove category (only custom ones)
  const handleRemoveCategory = (category: string) => {
    const defaults = mediaType === 'images' ? DEFAULT_IMAGE_CATEGORIES : DEFAULT_DOCUMENT_CATEGORIES;
    if (defaults.includes(category)) {
      showToast('Cannot remove default category', 'error');
      return;
    }

    if (mediaType === 'images') {
      setImageCategories(imageCategories.filter(c => c !== category));
      if (activeCategory === category) {
        setActiveCategory('projects');
      }
    } else {
      setDocumentCategories(documentCategories.filter(c => c !== category));
      if (activeCategory === category) {
        setActiveCategory('pdfs');
      }
    }
    showToast('Category removed', 'success');
  };

  // Format category name for display
  const formatCategoryName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept={mediaType === 'images' ? 'image/*' : '.pdf'}
        onChange={handleUpload}
        disabled={uploading}
        multiple
        className="sr-only"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Media Gallery</h2>
          <p className="text-sm text-white/60 mt-1">
            Central hub for all images and documents
          </p>
        </div>
        <div className="flex gap-3">
          {selectedItems.size > 0 && (
            <button
              onClick={() => setDeleteConfirm('bulk')}
              disabled={deleting}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete ({selectedItems.size})
            </button>
          )}
          <label
            htmlFor={fileInputId}
            className={`px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
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
                Upload
              </>
            )}
          </label>
        </div>
      </div>

      {/* Media Type Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleMediaTypeChange('images')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mediaType === 'images'
              ? 'bg-white text-[#2d382c]'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          Images
        </button>
        <button
          onClick={() => handleMediaTypeChange('documents')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mediaType === 'documents'
              ? 'bg-white text-[#2d382c]'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          Documents
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {currentCategories.map((category) => (
          <div key={category} className="relative group">
            <button
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {formatCategoryName(category)}
            </button>
            {/* Remove button for custom categories */}
            {!(mediaType === 'images' ? DEFAULT_IMAGE_CATEGORIES : DEFAULT_DOCUMENT_CATEGORIES).includes(category) && (
              <button
                onClick={() => handleRemoveCategory(category)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove category"
              >
                x
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowAddCategory(true)}
          className="px-3 py-1.5 text-sm font-medium bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      {/* Selection Bar */}
      {media.length > 0 && (
        <div className="flex items-center justify-between mb-4 py-2 border-b border-white/10">
          <button
            onClick={handleSelectAll}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {selectedItems.size === media.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-white/40">
            {media.length} item{media.length !== 1 ? 's' : ''} in {formatCategoryName(activeCategory)}
          </span>
        </div>
      )}

      {/* Media Grid */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/60">Loading media...</div>
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mediaType === 'images' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              )}
            </svg>
            <p>No {mediaType} in this category yet.</p>
            <p className="text-sm mt-1">Upload some using the button above.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            mediaType === 'images'
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
          }`}>
            {media.map((item) => (
              <motion.div
                key={item.url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative group border-2 transition-all cursor-pointer ${
                  selectedItems.has(item.url)
                    ? 'border-white ring-2 ring-white/30'
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => toggleSelection(item.url)}
              >
                {mediaType === 'images' ? (
                  <div className="aspect-square bg-white/5 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo-icon.svg';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-white/5 flex flex-col items-center justify-center p-4">
                    <svg className="w-12 h-12 text-red-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
                      <text x="7" y="17" fontSize="5" fill="currentColor" fontWeight="bold">PDF</text>
                    </svg>
                    <p className="text-xs text-white/60 text-center truncate w-full">{item.name}</p>
                  </div>
                )}

                {/* Selection checkbox */}
                <div className={`absolute top-2 left-2 w-5 h-5 border-2 flex items-center justify-center transition-all ${
                  selectedItems.has(item.url)
                    ? 'bg-white border-white'
                    : 'border-white/40 bg-black/40 opacity-0 group-hover:opacity-100'
                }`}>
                  {selectedItems.has(item.url) && (
                    <svg className="w-3 h-3 text-[#2d382c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white/80 text-[10px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.name}
                </div>

                {/* Copy URL button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(item.url);
                    showToast('URL copied to clipboard', 'success');
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy URL"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCategory(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Add Category</h3>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                }}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-white text-[#2d382c] text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  Add Category
                </button>
              </div>
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
              <h3 className="text-lg font-semibold text-white mb-4">Delete Files</h3>
              <p className="text-sm text-white/60 mb-4">
                Are you sure you want to delete {selectedItems.size} selected file{selectedItems.size !== 1 ? 's' : ''}?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Files'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
