import { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

// Public images available in the project
const PUBLIC_IMAGES = [
  '/images/projects/the-interchange.jpeg',
  '/images/projects/celestial-house.jpeg',
  '/images/projects/o-central.jpeg',
  '/images/projects/landmark.jpeg',
  '/images/projects/skyline-chambers.jpeg',
  '/images/projects/falcondale-court.jpeg',
  '/images/projects/century-tower.jpeg',
  '/images/projects/burton-place.jpeg',
  '/images/projects/swansea.jpeg',
];

// Supabase storage buckets to load images from
const STORAGE_BUCKETS = ['news-images', 'news-content'];

interface UploadedImage {
  url: string;
  bucket: string;
  name: string;
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function ImagePicker({ value, onChange, label = 'Image', required = false }: ImagePickerProps) {
  const { showToast } = useToast();
  const fileInputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'uploaded'>('public');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded images from all Supabase storage buckets
  const loadUploadedImages = async () => {
    setLoading(true);
    try {
      const allImages: UploadedImage[] = [];

      for (const bucketName of STORAGE_BUCKETS) {
        try {
          const { data, error } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

          if (error) {
            console.error(`Error loading from ${bucketName}:`, error);
            continue;
          }

          if (data) {
            const images = data
              .filter(file => {
                // Only include image files
                const ext = file.name.split('.').pop()?.toLowerCase();
                return !file.name.startsWith('.') &&
                       ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
              })
              .map(file => {
                const { data: urlData } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(file.name);
                return {
                  url: urlData.publicUrl,
                  bucket: bucketName,
                  name: file.name,
                };
              });
            allImages.push(...images);
          }
        } catch (err) {
          console.error(`Error loading from ${bucketName}:`, err);
        }
      }

      setUploadedImages(allImages);
    } catch (err) {
      console.error('Error loading images:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'uploaded') {
      loadUploadedImages();
    }
  }, [isOpen, activeTab]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error } = await supabase.storage
        .from('news-images')
        .upload(filename, file);

      if (error) {
        console.error('Upload error:', error);
        showToast('Failed to upload image', 'error');
      } else {
        showToast('Image uploaded successfully', 'success');
        // Get the public URL and select it
        const { data: urlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(filename);
        setSelectedImage(urlData.publicUrl);
        // Reload the list
        loadUploadedImages();
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

  return (
    <div>

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
              className="bg-[#2d382c] border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Select Image</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('public')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'public'
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Project Images
                </button>
                <button
                  onClick={() => setActiveTab('uploaded')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'uploaded'
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Uploaded Images
                </button>
              </div>

              {/* Upload section (for uploaded tab) - uses native label for reliability */}
              {activeTab === 'uploaded' && (
                <div className="p-4 border-b border-white/10">
                  <input
                    ref={fileInputRef}
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
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
                        Upload New Image
                      </>
                    )}
                  </label>
                  <span className="text-xs text-white/40 ml-3">Max 5MB</span>
                </div>
              )}

              {/* Image grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white/60">Loading images...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {activeTab === 'public' && PUBLIC_IMAGES.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setSelectedImage(url)}
                        className={`aspect-square bg-white/5 border-2 overflow-hidden transition-all ${
                          selectedImage === url
                            ? 'border-white ring-2 ring-white/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo-icon.svg';
                          }}
                        />
                      </button>
                    ))}
                    {activeTab === 'uploaded' && uploadedImages.map((image) => (
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
                        {/* Bucket label */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white/70 text-[10px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {image.bucket}
                        </div>
                      </button>
                    ))}
                    {activeTab === 'uploaded' && uploadedImages.length === 0 && (
                      <div className="col-span-full text-center py-8 text-white/40">
                        No uploaded images yet. Upload one above.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 flex justify-end gap-3">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
