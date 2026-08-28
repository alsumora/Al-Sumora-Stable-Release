import React, { useState, useMemo } from 'react';
import { Product, Category, ProductColor, CategoryItem } from '../types';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/products';
import {
  Sparkles,
  Eye,
  ShoppingBag,
  Check,
  Heart,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShopViewProps {
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product, color: ProductColor) => void;
  initialCategory?: Category;
  setIsBespokeOpen?: (open: boolean) => void;
  wishlistProductIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  productsList?: Product[];
  categoriesList?: CategoryItem[];
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export const ShopView: React.FC<ShopViewProps> = ({
  onSelectProduct,
  onQuickAddToCart,
  initialCategory = 'All',
  wishlistProductIds = [],
  onToggleWishlist,
  productsList = PRODUCTS,
  categoriesList = PRODUCT_CATEGORIES,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, ProductColor>>({});

  // Synchronize when initialCategory changes from parent
  React.useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories: string[] = [
    'All',
    ...categoriesList.map((c) => c.category || c.id || c.name),
  ];

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' || p.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.details && p.details.some((d) => d.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy]);

  const handleColorSelect = (
    productId: string,
    color: ProductColor,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedColorMap((prev) => ({ ...prev, [productId]: color }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#fbf9f4] min-h-screen pt-4 sm:pt-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-32 space-y-8 bg-white p-4 sm:p-6 rounded-xl border border-[#d3c3be]/40 shadow-sm">
              {/* Mobile Toggle */}
              <div
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="flex items-center justify-between lg:hidden cursor-pointer"
              >
                <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#090100] flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#825425]" />
                  <span>Filters & Categories</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#827470] transition-transform duration-200 ${
                    isMobileFilterOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Filters Content */}
              <div
                className={`${
                  isMobileFilterOpen ? 'block' : 'hidden'
                } lg:block space-y-8 mt-6 lg:mt-0`}
              >
                {/* Categories */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#825425] mb-3 sm:mb-4">
                    Categories
                  </h3>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`text-left text-xs sm:text-sm py-1 sm:py-1.5 transition-all cursor-pointer ${
                          activeCategory === cat
                            ? 'font-bold text-[#825425] translate-x-1.5'
                            : 'text-[#504440] hover:text-[#090100] hover:translate-x-1'
                        } transform duration-200`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#825425] mb-3 sm:mb-4">
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full bg-[#f5f3ee] border border-[#d3c3be]/60 text-xs sm:text-sm p-2 rounded-lg focus:outline-none focus:border-[#825425] cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#825425] mb-3 sm:mb-4">
                    Search
                  </h3>
                  <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f5f3ee] border border-[#d3c3be]/60 text-xs sm:text-sm p-2 rounded-lg focus:outline-none focus:border-[#825425]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Product Grid or Empty State Area */}
          <div className="flex-1 w-full lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-1 scrollbar-thin mt-2">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl border border-[#d3c3be]/40 p-10 sm:p-20 text-center shadow-sm"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f0eee9] flex items-center justify-center mx-auto text-[#825425] mb-6">
                  <Sparkles className="w-7 h-7 sm:w-9 sm:h-9" />
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#090100] mb-2">
                  Coming Soon
                </h3>
                <p className="text-xs sm:text-sm text-[#827470] max-w-md mx-auto leading-relaxed">
                  We are preparing an exclusive collection of premium leather goods. Check back soon for new handcrafted additions.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5"
              >
                <AnimatePresence>
                  {filteredProducts.map((product, idx) => {
                    const activeColor =
                      selectedColorMap[product.id] ||
                      product.colors[0] || {
                        image: product.images[0],
                        name: 'Standard',
                        hex: '#000',
                      };
                    const displayImage = activeColor.image || product.images[0];

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                        key={product.id}
                        whileHover={{ y: -4 }}
                        onClick={() => onSelectProduct(product)}
                        className="group bg-white rounded-2xl border border-[#d3c3be]/50 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                      >
                        {/* Image Container */}
                        <div
                          className="w-full aspect-[4/3] bg-[#f5f3ee] relative overflow-hidden flex items-center justify-center group"
                        >
                          <img
                            src={displayImage}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                          />

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                            <span className="bg-[#090100]/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-xs">
                              {product.category}
                            </span>
                          </div>

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

                        {/* Info & Swatches */}
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

                            {/* Color Swatches */}
                            {product.colors.length > 1 && (
                              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                                {product.colors.map((c) => (
                                  <button
                                    key={c.name}
                                    onClick={(e) =>
                                      handleColorSelect(product.id, c, e)
                                    }
                                    className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer ${
                                      activeColor.name === c.name
                                        ? 'border-[#090100] scale-115 shadow ring-1 ring-[#825425]'
                                        : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  >
                                    {activeColor.name === c.name && (
                                      <Check className="w-2 h-2 text-white mx-auto" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-[#f0eee9] flex items-center justify-between">
                            <div className="text-xs sm:text-sm font-bold text-[#825425]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuickAddToCart(product, activeColor);
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
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
