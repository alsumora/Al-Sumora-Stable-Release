import React, { useState, useEffect } from 'react';
import { Product, ProductColor, Category, ActiveTab, CategoryItem, BannerSlide } from '../types';
import { PRODUCTS, PRODUCT_CATEGORIES, DEFAULT_BANNER_SLIDES } from '../data/products';
import { REVIEWS } from '../data/reviews';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Star,
  Eye,
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product, color: ProductColor) => void;
  onSelectCategory?: (category: Category) => void;
  setIsBespokeOpen?: (open: boolean) => void;
  wishlistProductIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  productsList?: Product[];
  categoriesList?: CategoryItem[];
  bannersList?: BannerSlide[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onSelectProduct,
  onQuickAddToCart,
  onSelectCategory,
  wishlistProductIds = [],
  onToggleWishlist,
  productsList = PRODUCTS,
  categoriesList = PRODUCT_CATEGORIES,
  bannersList = DEFAULT_BANNER_SLIDES,
}) => {
  const featuredProducts = productsList.filter((p) => p.isFeatured).length > 0
    ? productsList.filter((p) => p.isFeatured).slice(0, 8)
    : productsList.slice(0, 8);

  const activeBannerSlides = bannersList && bannersList.filter((b) => b.active !== false).length > 0
    ? bannersList.filter((b) => b.active !== false)
    : DEFAULT_BANNER_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide interval every 4 seconds (4000ms)
  useEffect(() => {
    if (activeBannerSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBannerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeBannerSlides.length]);

  // Reset slide index if bounds change
  useEffect(() => {
    if (currentSlide >= activeBannerSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeBannerSlides.length, currentSlide]);

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % activeBannerSlides.length);
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + activeBannerSlides.length) % activeBannerSlides.length);
  };

  const handleCategoryClick = (cat: Category) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-12 sm:space-y-16 pb-20 overflow-hidden"
    >
      {/* 1. Moving Horizontal Banner Slideshow (Pure Image, Rotates Every 4s) */}
      <section className="relative w-full overflow-hidden bg-[#090100] group select-none shadow-md">
        {/* Banner Aspect Ratio Container */}
        <div 
          className="relative w-full aspect-[16/7] sm:aspect-[21/8] md:aspect-[24/8] min-h-[220px] sm:min-h-[380px] md:min-h-[460px] max-h-[580px] cursor-pointer overflow-hidden"
          onClick={() => {
            setActiveTab('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {/* Carousel Slide Images with Smooth Cross-Fade & Subtle Zoom */}
          {activeBannerSlides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out ${
                idx === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.altText || slide.title || 'Al Sumora Atelier Banner'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Left Arrow Navigation Button */}
          {activeBannerSlides.length > 1 && (
            <button
              onClick={handlePrevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 bg-black/40 hover:bg-[#825425] text-white rounded-full transition-all border border-white/20 opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg hover:scale-110 active:scale-95 backdrop-blur-xs"
              aria-label="Previous banner slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Right Arrow Navigation Button */}
          {activeBannerSlides.length > 1 && (
            <button
              onClick={handleNextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 bg-black/40 hover:bg-[#825425] text-white rounded-full transition-all border border-white/20 opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg hover:scale-110 active:scale-95 backdrop-blur-xs"
              aria-label="Next banner slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Slide Indicators / Dots */}
          {activeBannerSlides.length > 1 && (
            <div 
              className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-xs border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {activeBannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide
                      ? 'w-6 sm:w-8 bg-[#fdc087]'
                      : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 border-b border-[#d3c3be]/35 pb-3">
          <div>
            <span className="hidden sm:block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#825425]">
              Artisan Collections
            </span>
            <h2 className="font-display font-bold text-lg sm:text-2xl text-[#090100] mt-0.5">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-6">
          {categoriesList.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => handleCategoryClick(cat.category)}
              className="flex flex-col items-center gap-2 group cursor-pointer w-full text-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-[#d3c3be]/40 group-hover:border-[#825425] transition-all bg-white shadow-2xs group-hover:shadow-md">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#504440] group-hover:text-[#825425] transition-colors truncate w-full px-1">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 3. Featured Leather Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 border-b border-[#d3c3be]/40 pb-4 sm:pb-6">
          <div>
            <span className="hidden sm:block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#825425]">
              Curated Masterpieces
            </span>
            <h2 className="font-display font-bold text-xl sm:text-4xl text-[#090100] mt-1">
              Featured Leather Collection
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('shop');
              window.scrollTo(0, 0);
            }}
            className="mt-2 md:mt-0 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#825425] hover:text-[#090100] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View Full Collection</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => onSelectProduct(product)}
              className="group bg-white rounded-2xl border border-[#d3c3be]/50 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Product Image */}
              <div
                className="w-full aspect-[4/3] bg-[#f5f3ee] relative overflow-hidden flex items-center justify-center"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                />

                <span className="absolute top-2 left-2 bg-[#090100]/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-xs">
                  {product.category}
                </span>

                {/* Wishlist Heart Toggle */}
                {onToggleWishlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/95 rounded-full shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                    title={
                      wishlistProductIds.includes(product.id)
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'
                    }
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        wishlistProductIds.includes(product.id)
                          ? 'fill-rose-600 text-rose-600'
                          : 'text-[#504440] hover:text-rose-600'
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
                <div className="space-y-1">
                  <h3
                    className="font-display font-semibold text-xs sm:text-sm text-[#090100] group-hover:text-[#825425] transition-colors line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-[#504440] line-clamp-1 leading-tight">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0eee9] flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-bold text-[#825425]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const color = product.colors[0] || {
                        name: 'Standard',
                        hex: '#000',
                        image: product.images[0],
                      };
                      onQuickAddToCart(product, color);
                    }}
                    className="p-2 sm:px-3 sm:py-1.5 bg-[#090100] hover:bg-[#825425] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    title="Add to Shopping Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#fdc087]" />
                    <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider">Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Standards: Mastery in Every Stitch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#825425]">
            Uncompromising Standards
          </span>
          <h2 className="font-display font-bold text-3xl text-[#090100] mt-1">
            Mastery in Every Stitch
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: 'Pure Full-Grain Leather',
              desc: 'Crafted using premium certified vegetable-tanned full-grain leather for rich longevity and a natural patina.',
            },
            {
              icon: ShieldCheck,
              title: 'Hand Saddle Stitching',
              desc: 'Stitched using two needles and waxed linen thread. Unlike machine lockstitches, saddle stitching will never unravel over decades of heavy use.',
            },
            {
              icon: Sparkles,
              title: 'Hand-Burnished Edges',
              desc: 'Every raw edge is carefully sanded, dyed, and burnished with beeswax to ensure smooth, waterproof edge protection that develops an exquisite patina.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 bg-white rounded-xl border border-[#d3c3be]/40 space-y-4 shadow-2xs hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-[#f0eee9] flex items-center justify-center text-[#825425]">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#090100]">
                {item.title}
              </h3>
              <p className="text-xs text-[#504440] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Client Experiences / Testimonials */}
      <section className="bg-[#f5f3ee] py-16 border-y border-[#d3c3be]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#825425]">
              Client Testimonials
            </span>
            <h2 className="font-display font-bold text-3xl text-[#090100] mt-1">
              Client Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, i) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-xl border border-[#d3c3be]/40 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-[#825425] mb-3">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current text-[#fdc087]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#1b1c19] italic leading-relaxed">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f0eee9] flex items-center justify-between">
                  <div>
                    <div className="font-display font-semibold text-xs text-[#090100]">
                      {rev.clientName}
                    </div>
                    <div className="text-[10px] text-[#827470]">{rev.location}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#825425] bg-[#f0eee9] px-2 py-0.5 rounded">
                    Verified Buyer
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
