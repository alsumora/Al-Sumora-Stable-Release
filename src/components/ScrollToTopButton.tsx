import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-[#090100] text-[#fdc087] hover:bg-[#825425] hover:text-white shadow-xl hover:shadow-2xl border border-[#d3c3be]/40 transition-all duration-300 group flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#825425]/50"
          aria-label="Scroll to top of page"
          title="Go to top"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline-block pr-1">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
