import React from 'react';
import { Product, ProductColor } from '../types';
import { PRODUCTS } from '../data/products';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistViewProps {
  wishlistProductIds?: string[];
  allProducts?: Product[];
  onToggleWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product, color: ProductColor) => void;
  onNavigateToShop: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistProductIds = [],
  allProducts = PRODUCTS,
  onToggleWishlist,
  onClearWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onNavigateToShop,
}) => {
  const safeProducts = allProducts || PRODUCTS;
  const safeWishlistIds = wishlistProductIds || [];
  const wishlistedProducts = safeProducts.filter((p) =>
    safeWishlistIds.includes(p.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d3c3be]/40 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#090100]">
              My Wishlist
            </h1>
            <span className="bg-[#fdc087]/20 text-[#825425] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-[#504440] mt-1">
            Your saved bespoke creations, ready for personalization and order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {wishlistedProducts.length > 0 && (
            <button
              onClick={onClearWishlist}
              className="text-xs font-semibold text-[#827470] hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border border-[#d3c3be]/60 bg-white shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}

          <button
            onClick={onNavigateToShop}
            className="px-4 py-2 bg-[#825425] hover:bg-[#090100] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#fdc087]" />
            <span>Shop Collection</span>
          </button>
        </div>
      </div>

      {/* Wishlist Content Grid */}
      {wishlistedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-[#d3c3be]/40 p-12 text-center space-y-5 max-w-xl mx-auto my-8 shadow-xs"
        >
          <div className="w-16 h-16 rounded-full bg-[#fbf9f4] border border-[#d3c3be]/60 text-[#825425] flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-7 h-7 text-[#825425]" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-xl text-[#090100]">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-[#504440] max-w-sm mx-auto leading-relaxed">
              Explore our handcrafted Tuscan leather goods, bespoke monogramming options, and save your preferred pieces here.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToShop}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#090100] hover:bg-[#825425] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#fdc087]" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <AnimatePresence>
            {wishlistedProducts.map((product) => {
              const defaultColor = product.colors[0] || {
                image: product.images[0],
                name: 'Standard',
                hex: '#000',
              };

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  whileHover={{ y: -4 }}
                  onClick={() => onSelectProduct(product)}
                  className="group bg-white rounded-2xl border border-[#d3c3be]/50 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Image Container */}
                  <div
                    className="w-full aspect-[4/3] bg-[#f5f3ee] relative overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-2 left-2 bg-[#090100]/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-xs">
                      {product.category}
                    </span>

                    {/* Remove From Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/95 text-rose-600 rounded-full shadow-xs hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                      title="Remove from Wishlist"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-600" />
                    </button>
                  </div>

                  {/* Info & Action Buttons */}
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

                      {product.customizable !== false && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#825425] mt-1 bg-[#fdc087]/20 px-1.5 py-0.5 rounded">
                          <Sparkles className="w-2.5 h-2.5" />
                          Monogramming Available
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#f0eee9] flex items-center justify-between">
                      <div className="text-xs sm:text-sm font-bold text-[#825425]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAddToCart(product, defaultColor);
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
    </motion.div>
  );
};
