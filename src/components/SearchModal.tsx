import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { Search, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  productsList?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  productsList = PRODUCTS,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-focus input without delay
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      setQuery('');
    }
  }, [isOpen, onClose]);

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return productsList.slice(0, 8); // show top curated items when empty
    return productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.description.toLowerCase().includes(trimmed)
    );
  }, [query, productsList]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4"
          onClick={onClose}
        >
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-[#090100]/65 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15 }}
            className="bg-[#fbf9f4] w-full max-w-xl rounded-2xl shadow-2xl border border-[#d3c3be]/70 overflow-hidden relative text-[#1b1c19] z-10 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-3.5 sm:p-4 bg-[#f5f3ee] border-b border-[#d3c3be]/50 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#825425] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bags, wallets, shoes, accessories..."
                className="w-full bg-transparent text-sm sm:text-base text-[#090100] placeholder-[#827470] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-[#827470] hover:text-[#090100] transition-colors rounded-full hover:bg-[#e4e2dd] cursor-pointer"
                  title="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#504440] hover:text-[#090100] transition-colors rounded-lg hover:bg-[#e4e2dd] cursor-pointer text-xs font-semibold uppercase tracking-wider"
                aria-label="Close search"
              >
                Done
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2.5 bg-[#f0eee9] flex items-center gap-1.5 overflow-x-auto text-xs text-[#504440] border-b border-[#d3c3be]/30 no-scrollbar">
              <span className="font-semibold text-[#825425] text-[11px] uppercase tracking-wider shrink-0 mr-1">
                Filter:
              </span>
              {['Bags', 'Wallets', 'Shoes', 'Accessories', 'Full Grain'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0 border ${
                    query.toLowerCase() === tag.toLowerCase()
                      ? 'bg-[#090100] text-white border-[#090100]'
                      : 'bg-white text-[#504440] border-[#d3c3be]/60 hover:bg-[#825425] hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Instant Search Results List */}
            <div className="overflow-y-auto p-2 sm:p-3 space-y-1 divide-y divide-[#f0eee9]/60">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="text-sm font-semibold text-[#090100]">No products found</div>
                  <p className="text-xs text-[#827470] mt-1">
                    Try searching for briefcase, tote, leather wallet, or Oxford shoes.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#f0eee9] transition-colors flex items-center justify-between cursor-pointer group active:bg-[#e6e2da]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-contain bg-white p-1 border border-[#d3c3be]/50 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-xs sm:text-sm text-[#090100] group-hover:text-[#825425] transition-colors truncate">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-[#825425] font-semibold flex items-center gap-1.5 mt-0.5">
                          <span>₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="text-[#827470] font-normal">• {product.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[#825425] flex items-center gap-1 text-xs font-semibold shrink-0 pl-2">
                      <ChevronRight className="w-4 h-4 text-[#827470] group-hover:text-[#825425] transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
