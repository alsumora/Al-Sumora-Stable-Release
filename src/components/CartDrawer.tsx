import React, { useEffect } from 'react';
import { CartItem, UserProfile } from '../types';
import { X, Trash2, Plus, Minus, Sparkles, Truck, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  userProfile?: UserProfile | null;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onNavigateToCheckout: () => void;
  onOpenAuthModal?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  userProfile,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToCheckout,
  onOpenAuthModal,
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCheckoutClick = () => {
    if (!userProfile && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }
    onClose();
    onNavigateToCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] overflow-hidden"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#090100]/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          <div
            className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-screen max-w-md bg-[#fbf9f4] text-[#1b1c19] shadow-2xl flex flex-col justify-between border-l border-[#d3c3be]/40 relative z-10 pointer-events-auto"
            >
              {/* Header */}
              <div className="p-6 bg-[#f5f3ee] border-b border-[#d3c3be]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-lg text-[#090100]">Your Shopping Bag</span>
                  <span className="text-xs bg-[#825425] text-white px-2.5 py-0.5 rounded-full font-semibold">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#504440] hover:text-[#090100] transition-colors rounded-full hover:bg-[#e4e2dd] cursor-pointer"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complimentary Shipping Banner */}
              <div className="bg-[#2c1810] text-[#fbf9f4] px-6 py-2.5 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#fdc087] font-medium">
                  <Truck className="w-4 h-4" /> Complimentary Worldwide Express Shipping
                </span>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#f0eee9] flex items-center justify-center mx-auto text-[#825425]">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-[#090100]">Your bag is currently empty</h3>
                    <p className="text-xs text-[#504440] max-w-xs mx-auto">
                      Explore our handcrafted leather goods or design a personalized monogram piece.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 bg-[#090100] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#825425] transition-colors cursor-pointer"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={`${item.product.id}-${item.selectedColor.name}-${index}`}
                        className="flex gap-4 p-4 rounded-xl bg-white border border-[#d3c3be]/40 shadow-xs relative"
                      >
                        <img
                          src={item.monogram?.canvasSnapshot || item.selectedColor?.image || item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 object-contain bg-[#f5f3ee] rounded-lg p-1 border border-[#e4e2dd]"
                        />

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-display font-semibold text-sm text-[#090100] leading-tight">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(index)}
                                className="text-[#827470] hover:text-rose-600 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-[11px] text-[#504440] mt-1">
                              Shade: <span className="font-medium text-[#1b1c19]">{item.selectedColor.name}</span>
                            </div>

                            {/* Custom Monogram / Engraving Badge */}
                            {item.monogram && (
                              <div className="mt-2 p-2 rounded-lg bg-[#f0eee9] border border-[#825425]/30 text-[10px] space-y-1">
                                <div className="flex items-center gap-1.5 font-semibold text-[#825425]">
                                  <Sparkles className="w-3 h-3 text-[#825425]" />
                                  <span>Engraved: <strong className="font-serif tracking-widest uppercase">{item.monogram.initials}</strong></span>
                                </div>
                                {item.monogram.placement && (
                                  <div className="text-[#504440] text-[9px]">
                                    Placement: {item.monogram.placement}
                                  </div>
                                )}
                                {item.monogram.description && (
                                  <div className="text-[#504440] text-[9px] line-clamp-1 italic">
                                    Notes: "{item.monogram.description}"
                                  </div>
                                )}
                                {item.monogram.referenceImages && item.monogram.referenceImages.length > 0 && (
                                  <div className="text-[#825425] text-[9px] font-medium flex items-center gap-1">
                                    <span>📸 {item.monogram.referenceImages.length} reference {item.monogram.referenceImages.length === 1 ? 'image' : 'images'} attached</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#f0eee9]">
                            <div className="flex items-center border border-[#d3c3be]/60 rounded-lg bg-[#fbf9f4] overflow-hidden">
                              <button
                                onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                                className="px-2.5 py-1 text-xs hover:bg-[#e4e2dd] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                className="px-2.5 py-1 text-xs hover:bg-[#e4e2dd] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="font-semibold text-sm text-[#090100]">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer Subtotal & Checkout Button */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-[#f5f3ee] border-t border-[#d3c3be]/40 space-y-4">
                  <div className="space-y-1.5 text-xs text-[#504440]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#090100] text-sm">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insured Courier</span>
                      <span className="text-emerald-700 font-semibold uppercase">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custom Monogramming</span>
                      <span className="text-emerald-700 font-semibold uppercase">Complimentary</span>
                    </div>
                  </div>

                  {!userProfile && (
                    <div className="bg-[#f0eee9] border border-[#d3c3be] p-2.5 rounded-lg text-[11px] text-[#504440] flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#825425] shrink-0" />
                      <span>Sign in required at checkout to complete order.</span>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckoutClick}
                    className="w-full bg-[#090100] hover:bg-[#2c1810] text-white py-3.5 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    {!userProfile ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#fdc087]" />
                        <span>Sign In to Checkout</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-4 h-4 text-[#fdc087]" />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
