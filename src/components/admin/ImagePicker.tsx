import { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

// Supabase storage bucket
const STORAGE_BUCKET = 'news-content';

// Default image categories
const DEFAULT_CATEGORIES = ['projects', 'news', 'team', 'general'];

interface GalleryImage {
  url: string;
  name: string;
  category: string;
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  /** Suggested category for uploads (defaults to 'general') */
  suggestedCategory?: string;
}

export function ImagePicker({
  value,
  onChange,
  label = 'Image',
  required = false,
  suggestedCategory = 'general'
}: ImagePickerProps) {
  const { showToast } = useToast();
  const fileInputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [uploadCategory, setUploadCategory] = useState<string>(suggestedCategory);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load categories from localStorage
  useEffect(() => {
    const savedCats = localStorage.getItem('gallery_image_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    }
  }, [isOpen]);

  // Load images from Supabase storage
  const loadImages = async () => {
    setLoading(true);
    const allImages: GalleryImage[] = [];

    try {
      // Load from each category - check both new path (images/{category}) and legacy path ({category})
      for (const category of categories) {
        const pathsToCheck = [`images/${category}`, category];

        for (const folderPath of pathsToCheck) {
          const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list(folderPath, {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' }
            });

          if (error) {
            // Silent - path might not exist
            continue;
          }

          if (data) {
            const categoryImages = data
              .filter(file => {
                if (file.name.startsWith('.')) return false;
                const ext = file.name.split('.').pop()?.toLowerCase() || '';
                return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
              })
              .map(file => {
                const { data: urlData } = supabase.storage
                  .from(STORAGE_BUCKET)
                  .getPublicUrl(`${folderPath}/${file.name}`);

                return {
                  url: urlData.publicUrl,
                  name: file.name,
                  category: category,
                };
              });

            allImages.push(...categoryImages);
          }
        }
      }

      setImages(allImages);
    } catch (err) {
      console.error('Error loading images:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, categories]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be less than 10MB', 'error');
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `images/${uploadCategory}/${filename}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        showToast('Failed to upload image', 'error');
      } else {
        showToast('Image uploaded successfully', 'success');
        // Get the public URL and select it
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);
        setSelectedImage(urlData.publicUrl);
        // Reload the list
        loadImages();
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Failed to upload image', 'error');
    }
    setUploading(false);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelect = () => {
    onChange(selectedImage);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setSelectedImage('');
  };

  // Filter images by category
  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  // Format category name for display
  const formatCategoryName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div>
      {/* File input - MUST be outside AnimatePresence to work in Firefox */}
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="sr-only"
      />

      <label className="block text-xs font-medium text-white/60 mb-1">
        {label} {required && '*'}
      </label>

      {/* Current image preview */}
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative w-24 h-24 bg-white/5 border border-white/20 overflow-hidden flex-shrink-0">
            <img
              src={value}
              alt="Selected"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo-icon.svg';
              }}
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              title="Remove image"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 bg-white/5 border border-white/20 border-dashed flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="flex-1">
          <button
            type="button"
            onClick={() => {
              setSelectedImage(value);
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            {value ? 'Change Image' : 'Select Image'}
          </button>
          {value && (
            <p className="text-xs text-white/40 mt-2 break-all max-w-xs">
              {value}
            </p>
          )}
        </div>
      </div>

      {/* Image picker modal */}
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
              className="bg-[#2d382c] border border-white/20 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Select Image from Gallery</h3>
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
                      Upload New
                    </>
                  )}
                </label>
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
                <span className="text-xs text-white/40">Max 10MB</span>
              </div>

              {/* Image grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white/60">Loading images...</div>
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/40">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No images in {activeCategory === 'all' ? 'the gallery' : `"${formatCategoryName(activeCategory)}"`}.</p>
                    <p className="text-sm mt-1">Upload some using the button above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {filteredImages.map((image) => (
                      <button
                        key={image.url}
                        type="button"
                        onClick={() => setSelectedImage(image.url)}
                        className={`aspect-square bg-white/5 border-2 overflow-hidden transition-all relative group ${
                          selectedImage === image.url
                            ? 'border-white ring-2 ring-white/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo-icon.svg';
                          }}
                        />
                        {/* Category label */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white/70 text-[10px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatCategoryName(image.category)}
                        </div>
                        {/* Selected indicator */}
                        {selectedImage === image.url && (
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
                  {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
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
                    disabled={!selectedImage}
                    className="px-4 py-2 bg-white text-[#2d382c] text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select Image
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
