import React, { useState, useEffect } from 'react';
import { Product, ProductColor, MonogramConfig } from '../types';
import {
  X,
  Check,
  Sparkles,
  ShoppingBag,
  Upload,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  FileText,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    color: ProductColor,
    quantity: number,
    monogram?: MonogramConfig
  ) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onNavigateToCustomizationTerms?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  onNavigateToCustomizationTerms,
}) => {
  // Lock body scrolling when product modal is open & listen for escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    return (
      product?.colors?.[0] || {
        name: 'Natural',
        hex: '#8c5e3c',
        image: product?.images?.[0] || '',
      }
    );
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  // Accordions / Tabs
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Customization Form State
  const [engravedName, setEngravedName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [placement, setPlacement] = useState('Bottom Right Corner');
  const [referenceImages, setReferenceImages] = useState<Array<{ name: string; url: string }>>([]);

  if (!product) return null;

  const isCustomizable = product.customizable !== false;

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : [selectedColor.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'];

  const currentImage = imagesList[selectedImageIndex] || imagesList[0];

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(-1);
    setSelectedImageIndex((prev) =>
      prev === 0 ? imagesList.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(1);
    setSelectedImageIndex((prev) =>
      prev === imagesList.length - 1 ? 0 : prev + 1
    );
  };

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.image) {
      const idx = imagesList.indexOf(color.image);
      if (idx !== -1) {
        setSlideDirection(idx > selectedImageIndex ? 1 : -1);
        setSelectedImageIndex(idx);
      }
    }
  };

  const handleReferenceImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            setReferenceImages((prev) => [
              ...prev,
              {
                name: file.name,
                url: uploadEvent.target!.result as string,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveReferenceImage = (indexToRemove: number) => {
    setReferenceImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddToCartClick = () => {
    const hasCustomization = isCustomizable && isCustomizationOpen && (engravedName.trim() || customDescription.trim() || referenceImages.length > 0);

    const monogram: MonogramConfig | undefined = hasCustomization
      ? {
          initials: engravedName.trim() || 'PERSONALIZED',
          description: customDescription.trim() || undefined,
          customNotes: customDescription.trim() || undefined,
          placement,
          referenceImages: referenceImages.map((img) => img.url),
          referenceImageNames: referenceImages.map((img) => img.name),
        }
      : undefined;

    onAddToCart(product, selectedColor, quantity, monogram);
    onClose();
  };

  // Image slide transition variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-[#090100]/65 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#fbf9f4] w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-[#d3c3be]/70 relative text-[#1b1c19] my-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-[#504440] hover:text-[#090100] bg-white/90 hover:bg-[#e4e2dd] rounded-full transition-all duration-200 cursor-pointer shadow-sm border border-[#d3c3be]/40 hover:scale-105"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Left Column: Interactive Product Image Carousel & Engraving Preview */}
            <div className="p-6 sm:p-8 bg-[#f5f3ee] flex flex-col justify-start items-center border-b md:border-b-0 md:border-r border-[#d3c3be]/40 select-none">
              <div className="w-full max-w-sm flex flex-col items-center">
                {/* Moving Main Product Image Stage */}
                <div className="w-full aspect-square relative rounded-2xl bg-white p-4 flex items-center justify-center border border-[#d3c3be]/50 shadow-sm overflow-hidden group">
                  <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                    <motion.img
                      key={selectedImageIndex}
                      custom={slideDirection}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      src={currentImage}
                      alt={`${product.name} slide ${selectedImageIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </AnimatePresence>

                  {/* Live Name Engraving Overlay Preview when user fills the customization form */}
                  {isCustomizationOpen && engravedName.trim() && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute pointer-events-none z-20 px-2.5 py-1 rounded-md backdrop-blur-[2px] shadow-sm font-serif font-bold uppercase tracking-[0.2em] border text-[#f5d77f] border-[#f5d77f]/40 bg-[#090100]/75 ${
                        placement === 'Bottom Right Corner'
                          ? 'bottom-6 right-6 text-xs'
                          : placement === 'Front Center'
                          ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm'
                          : placement === 'Top Flap / Collar'
                          ? 'top-6 left-1/2 -translate-x-1/2 text-xs'
                          : 'bottom-6 left-6 text-xs'
                      }`}
                    >
                      <span>{engravedName}</span>
                    </motion.div>
                  )}

                  {/* Previous / Next Moving Controls */}
                  {imagesList.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-[#090100]/85 hover:bg-[#090100] text-white rounded-full transition-all cursor-pointer shadow-md opacity-90 hover:scale-110 active:scale-95 z-10"
                        aria-label="Previous product image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-[#090100]/85 hover:bg-[#090100] text-white rounded-full transition-all cursor-pointer shadow-md opacity-90 hover:scale-110 active:scale-95 z-10"
                        aria-label="Next product image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Image Counter Badge */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#090100]/80 backdrop-blur-xs text-white text-[11px] font-mono rounded-full tracking-wider z-10 shadow-xs">
                        {selectedImageIndex + 1} / {imagesList.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Row */}
                {imagesList.length > 1 && (
                  <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1 w-full justify-center">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSlideDirection(idx > selectedImageIndex ? 1 : -1);
                          setSelectedImageIndex(idx);
                        }}
                        className={`w-12 h-12 rounded-xl border overflow-hidden p-1 bg-white cursor-pointer transition-all duration-200 ${
                          selectedImageIndex === idx
                            ? 'border-[#090100] ring-2 ring-[#825425]/40 scale-105 shadow-sm'
                            : 'border-[#d3c3be]/60 opacity-60 hover:opacity-100'
                        }`}
                        aria-label={`Show image ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Clean Details, Customization Form & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                {/* 1. Title & Price */}
                <div>
                  <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#825425] mb-1">
                    AL SUMORA • {product.category}
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#090100] tracking-tight leading-snug">
                    {product.name}
                  </h2>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-[#825425]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#827470]">
                      (Free express delivery included)
                    </span>
                  </div>
                </div>

                {/* 2. Description */}
                <p className="text-xs sm:text-sm text-[#504440] leading-relaxed">
                  {product.description}
                </p>

                {/* 3. Colour Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="pt-3 border-t border-[#d3c3be]/40">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold uppercase tracking-wider text-[#1b1c19]">
                        Colour:
                      </span>
                      <span className="font-medium text-[#825425]">
                        {selectedColor.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => handleSelectColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                            selectedColor.name === c.name
                              ? 'border-[#090100] scale-110 ring-2 ring-[#825425]/40'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          aria-label={`Select ${c.name} leather`}
                        >
                          {selectedColor.name === c.name && (
                            <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Customization Form */}
                {isCustomizable && (
                  <div className="pt-3 border-t border-[#d3c3be]/40">
                    <button
                      type="button"
                      onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#f0eee9] hover:bg-[#eae8e3] text-[#090100] border border-[#d3c3be]/60 text-xs font-semibold tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-[#825425]" />
                        <span>Customize</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#825425]">
                        <span className="text-[10px] font-bold uppercase">
                          {isCustomizationOpen ? 'Close' : 'Customize'}
                        </span>
                        {isCustomizationOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Customization Form */}
                    <AnimatePresence>
                      {isCustomizationOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 p-4 rounded-xl bg-white border border-[#d3c3be]/70 shadow-xs space-y-4">
                            {/* 1. Name to be engraved */}
                            <div>
                              <label className="text-[11px] font-bold text-[#090100] uppercase tracking-wider block mb-1">
                                Name to engrave:
                              </label>
                              <input
                                type="text"
                                maxLength={30}
                                value={engravedName}
                                onChange={(e) => setEngravedName(e.target.value)}
                                placeholder="Enter name or initials"
                                className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg px-3 py-2 text-xs font-serif font-bold uppercase tracking-widest text-[#090100] focus:outline-none focus:border-[#825425] shadow-inner"
                              />
                            </div>

                            {/* Placement */}
                            <div>
                              <label className="text-[10px] font-bold text-[#504440] uppercase tracking-wider block mb-1">
                                Placement:
                              </label>
                              <select
                                value={placement}
                                onChange={(e) => setPlacement(e.target.value)}
                                className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg px-2.5 py-1.5 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                              >
                                <option value="Bottom Right Corner">Bottom Right Corner</option>
                                <option value="Front Center">Front Center</option>
                                <option value="Top Flap / Collar">Top Flap</option>
                                <option value="Inner Leather Tag">Inside Tag</option>
                              </select>
                            </div>

                            {/* 2. Custom Description / Instructions */}
                            <div>
                              <label className="text-[11px] font-bold text-[#090100] uppercase tracking-wider block mb-1">
                                Description:
                              </label>
                              <textarea
                                rows={3}
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                placeholder="Any specific requirements, instructions, or notes..."
                                className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-2.5 text-xs text-[#090100] focus:outline-none focus:border-[#825425] resize-none"
                              />
                            </div>

                            {/* 3. Reference Images Upload */}
                            <div>
                              <label className="text-[11px] font-bold text-[#090100] uppercase tracking-wider block mb-1">
                                Reference image:
                              </label>
                              <div className="space-y-2">
                                <label className="flex items-center justify-center gap-2 bg-[#f5f3ee] hover:bg-[#e4e2dd] text-[#090100] text-xs font-semibold py-2 px-3 rounded-lg border border-dashed border-[#825425]/50 cursor-pointer transition-colors">
                                  <Upload className="w-4 h-4 text-[#825425]" />
                                  <span>Upload Reference Image</span>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleReferenceImagesUpload}
                                    className="hidden"
                                  />
                                </label>

                                {/* Image Preview Grid */}
                                {referenceImages.length > 0 && (
                                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#f0eee9]">
                                    {referenceImages.map((img, idx) => (
                                      <div
                                        key={idx}
                                        className="relative rounded-lg overflow-hidden border border-[#d3c3be] bg-white group/img"
                                      >
                                        <img
                                          src={img.url}
                                          alt={img.name}
                                          className="w-full h-16 object-cover"
                                        />
                                        <div className="p-1 bg-[#fbf9f4] text-[9px] text-[#504440] truncate">
                                          {img.name}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveReferenceImage(idx)}
                                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                                          title="Remove reference"
                                        >
                                          <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Terms Notice & Link to Customization Info Page */}
                            <div className="pt-2 border-t border-[#f0eee9] flex items-center justify-between text-[11px] text-[#504440]">
                              <span>Customized items are made to order.</span>
                              {onNavigateToCustomizationTerms && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onNavigateToCustomizationTerms();
                                  }}
                                  className="text-[#825425] hover:text-[#090100] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
                                >
                                  Click here for terms
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 5. Specifications */}
                {product.details && product.details.length > 0 && (
                  <div className="pt-3 border-t border-[#d3c3be]/40">
                    <button
                      type="button"
                      onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-medium text-[#504440] hover:text-[#090100] hover:bg-[#f0eee9]/60 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#825425]" />
                        <span>Specifications</span>
                      </div>
                      {isDetailsOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isDetailsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-2 text-xs text-[#504440] space-y-1.5 pl-3 border-l-2 border-[#825425]/40 py-1">
                            {product.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#825425] font-bold">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* 6. Action Bar: Quantity Stepper + Add to Bag + Wishlist */}
              <div className="mt-6 pt-4 border-t border-[#d3c3be]/40 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
                {/* Number of items (Quantity) */}
                <div className="flex items-center border border-[#d3c3be] rounded-xl bg-white overflow-hidden shadow-xs shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 sm:px-3 py-2.5 text-xs font-bold text-[#1b1c19] hover:bg-[#f0eee9] transition-colors cursor-pointer select-none active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-2 sm:px-3 py-2.5 text-xs font-semibold min-w-[2rem] sm:min-w-[2.2rem] text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 sm:px-3 py-2.5 text-xs font-bold text-[#1b1c19] hover:bg-[#f0eee9] transition-colors cursor-pointer select-none active:scale-95"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCartClick}
                  className="flex-1 min-w-[160px] bg-[#090100] text-white hover:bg-[#2c1810] py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#fdc087] shrink-0" />
                  <span>
                    Add to Bag • ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </motion.button>

                {/* Wishlist Button */}
                {onToggleWishlist && (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0 ${
                      isWishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-[#d3c3be] bg-white text-[#504440] hover:border-[#825425] hover:text-[#825425]'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isWishlisted ? 'fill-rose-600' : ''
                      }`}
                    />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

