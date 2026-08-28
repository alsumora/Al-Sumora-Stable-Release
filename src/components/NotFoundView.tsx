import React from 'react';
import { Compass, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface NotFoundViewProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#fdc087]/20 border border-[#fdc087]/40 text-[#825425] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-[#825425] uppercase mb-2 block">
          Error 404
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#090100] mb-3">
          Page Not Found
        </h1>

        <p className="text-sm text-[#827470] leading-relaxed mb-8">
          The requested address could not be located or is unavailable. Please verify the URL or return to our boutique storefront.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#090100] text-white text-xs font-semibold hover:bg-[#825425] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <button
            onClick={onNavigateShop}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#d3c3be] text-[#090100] text-xs font-semibold hover:bg-white hover:border-[#825425] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#825425]" />
            <span>Explore Collection</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
