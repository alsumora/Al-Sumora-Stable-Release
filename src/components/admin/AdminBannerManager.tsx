import React, { useState, useRef } from 'react';
import { BannerSlide } from '../../types';
import { DEFAULT_BANNER_SLIDES } from '../../data/products';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminBannerManagerProps {
  banners: BannerSlide[];
  onSaveBanners: (updatedBanners: BannerSlide[]) => void;
}

export const AdminBannerManager: React.FC<AdminBannerManagerProps> = ({
  banners,
  onSaveBanners,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);

  // Form State
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerAltText, setBannerAltText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    // Check size (< 5MB recommended for localStorage)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB. Please choose a compressed horizontal image.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImageData(result);
      setImageUrlInput('');
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerAltText('');
    setImageUrlInput('');
    setUploadedImageData(null);
    setUploadError(null);
    setIsAddModalOpen(true);
  };

  const handleEditBanner = (b: BannerSlide) => {
    setEditingBannerId(b.id);
    setBannerTitle(b.title || '');
    setBannerAltText(b.altText || '');
    setImageUrlInput(b.imageUrl.startsWith('data:') ? '' : b.imageUrl);
    setUploadedImageData(b.imageUrl.startsWith('data:') ? b.imageUrl : null);
    setUploadError(null);
    setIsAddModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = uploadedImageData || imageUrlInput.trim();

    if (!finalImage) {
      setUploadError('Please upload an image file or provide an image URL.');
      return;
    }

    if (editingBannerId) {
      // Update existing banner
      const updated = banners.map((b) => {
        if (b.id === editingBannerId) {
          return {
            ...b,
            imageUrl: finalImage,
            title: bannerTitle.trim() || 'Hero Banner',
            altText: bannerAltText.trim() || 'Homepage Leather Banner',
          };
        }
        return b;
      });
      onSaveBanners(updated);
      showTemporaryStatus('Banner updated successfully.');
    } else {
      // Create new banner
      const newBanner: BannerSlide = {
        id: `banner-${Date.now()}`,
        imageUrl: finalImage,
        title: bannerTitle.trim() || `Banner #${banners.length + 1}`,
        altText: bannerAltText.trim() || 'Homepage Leather Banner',
        active: true,
        order: banners.length + 1,
      };
      onSaveBanners([...banners, newBanner]);
      showTemporaryStatus('New banner slide added.');
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (banners.length <= 1) {
      alert('At least one banner image is required for the homepage slideshow.');
      return;
    }
    const updated = banners.filter((b) => b.id !== id);
    onSaveBanners(updated);
    if (previewSlideIndex >= updated.length) {
      setPreviewSlideIndex(0);
    }
    showTemporaryStatus('Banner removed.');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index - 1];
    newBanners[index - 1] = temp;
    onSaveBanners(newBanners);
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index + 1];
    newBanners[index + 1] = temp;
    onSaveBanners(newBanners);
  };

  const handleToggleActive = (id: string) => {
    const updated = banners.map((b) => {
      if (b.id === id) {
        return { ...b, active: b.active !== false ? false : true };
      }
      return b;
    });
    onSaveBanners(updated);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset banner slides to default high-resolution horizontal artisan images?')) {
      onSaveBanners(DEFAULT_BANNER_SLIDES);
      setPreviewSlideIndex(0);
      showTemporaryStatus('Restored default artisan banner slides.');
    }
  };

  const showTemporaryStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Curated Luxury Horizontal Presets
  const PRESET_BANNERS = [
    {
      title: 'Artisan Workshop Outwear',
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=2000',
    },
    {
      title: 'Executive Briefcase Suite',
      url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=2000',
    },
    {
      title: 'Handcrafted Heritage Footwear',
      url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=2000',
    },
    {
      title: 'Voyager Travel Bags',
      url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=2000',
    },
    {
      title: 'Saddle Stitching Master Craft',
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=2000',
    },
  ];

  const activeBanners = banners.filter((b) => b.active !== false);
  const currentPreviewSlide = activeBanners[previewSlideIndex] || banners[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast notification */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Homepage Showcase
            </span>
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
              4-Second Auto Slide
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Homepage Banner Slides
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Upload and configure horizontal images for the homepage slider. The banner automatically rotates every 4 seconds without any text overlays, putting your visuals front and center.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restore default banners"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Banner</span>
          </button>
        </div>
      </div>

      {/* Live Preview Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">
              Live Homepage Banner Preview ({activeBanners.length} Active Slides)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Slides move every 4s on live site</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-900">
          <div className="relative aspect-[21/9] sm:aspect-[21/8] max-h-[360px] w-full rounded-lg overflow-hidden bg-black border border-slate-800 shadow-inner">
            {currentPreviewSlide ? (
              <img
                src={currentPreviewSlide.imageUrl}
                alt={currentPreviewSlide.altText || 'Banner Preview'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                No active banner slides available.
              </div>
            )}

            {/* Slider navigation controls inside preview */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setPreviewSlideIndex(
                      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-blue-600 text-white transition-all cursor-pointer"
                  aria-label="Previous preview slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setPreviewSlideIndex((prev) => (prev + 1) % activeBanners.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-blue-600 text-white transition-all cursor-pointer"
                  aria-label="Next preview slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === previewSlideIndex
                          ? 'w-6 bg-blue-500'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Banners List & Configuration Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Configured Banner Slides ({banners.length})
            </h2>
            <p className="text-xs text-slate-500">
              Drag, reorder, edit, or remove horizontal banner graphics
            </p>
          </div>
        </div>

        {banners.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No banners configured yet. Click "Upload New Banner" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map((banner, index) => {
              const isActive = banner.active !== false;

              return (
                <div
                  key={banner.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                      : 'bg-slate-50/80 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Index badge */}
                    <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-[11px] text-slate-700 shrink-0">
                      {index + 1}
                    </div>

                    {/* Wide Horizontal Thumbnail Preview */}
                    <div className="w-28 sm:w-36 aspect-[21/9] rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                      <img
                        src={banner.imageUrl}
                        alt={banner.altText || 'Banner'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs text-slate-900 truncate">
                          {banner.title || `Slide ${index + 1}`}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {isActive ? 'Active on Homepage' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                        {banner.altText || 'Horizontal wide banner'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Move Up */}
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className={`p-1.5 rounded-md border transition-colors ${
                        index === 0
                          ? 'text-slate-300 border-slate-100 cursor-not-allowed'
                          : 'text-slate-600 border-slate-200 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="Move slide earlier in rotation"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={index === banners.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className={`p-1.5 rounded-md border transition-colors ${
                        index === banners.length - 1
                          ? 'text-slate-300 border-slate-100 cursor-not-allowed'
                          : 'text-slate-600 border-slate-200 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="Move slide later in rotation"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(banner.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                      }`}
                    >
                      {isActive ? 'Hide' : 'Show'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEditBanner(banner)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 sm:p-6 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setIsAddModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 z-10 w-full max-w-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {editingBannerId ? 'Edit Banner Slide' : 'Upload Horizontal Banner'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Landscape image displayed cleanly without text overlay
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveBanner} className="p-5 space-y-4">
                {uploadError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Upload Image Section */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Horizontal Image (File Upload or URL) *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Drag & Drop / File Upload */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 p-4 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 min-h-[110px]"
                    >
                      <Upload className="w-5 h-5 text-blue-600" />
                      <div className="text-xs font-semibold text-slate-800">
                        Upload from Device
                      </div>
                      <div className="text-[10px] text-slate-400">
                        JPG, PNG, WEBP (Landscape 16:9 / 21:9)
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Or Presets Quick Select */}
                    <div className="border border-slate-200 bg-slate-50 p-3 rounded-xl space-y-1.5 flex flex-col justify-between">
                      <div className="text-[11px] font-semibold text-slate-700">
                        Or pick artisan preset:
                      </div>
                      <div className="space-y-1 overflow-y-auto max-h-[80px] pr-1">
                        {PRESET_BANNERS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setImageUrlInput(preset.url);
                              setUploadedImageData(null);
                              setBannerTitle(preset.title);
                            }}
                            className="w-full text-left text-[11px] px-2 py-1 rounded bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors truncate block cursor-pointer"
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Or Paste Direct Image Web URL
                  </label>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      if (e.target.value) setUploadedImageData(null);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Live Preview Box */}
                {(uploadedImageData || imageUrlInput) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Horizontal Preview:
                    </label>
                    <div className="aspect-[21/9] w-full rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
                      <img
                        src={uploadedImageData || imageUrlInput}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={() => setUploadError('Image URL could not be loaded.')}
                      />
                    </div>
                  </div>
                )}

                {/* Banner Internal Name & Alt Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Banner Label (For Admin Reference)
                    </label>
                    <input
                      type="text"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      placeholder="e.g. Master Atelier Jackets"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Alt / Accessibility Tag
                    </label>
                    <input
                      type="text"
                      value={bannerAltText}
                      onChange={(e) => setBannerAltText(e.target.value)}
                      placeholder="e.g. Handcrafted Leather Banner"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Submit & Cancel */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    {editingBannerId ? 'Update Banner' : 'Save Banner Slide'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
