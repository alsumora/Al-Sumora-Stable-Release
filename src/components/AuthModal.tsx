import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { X, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

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

  const handleGoogleQuickLogin = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      const defaultUser: UserProfile = {
        id: 'usr_google_' + Math.floor(1000 + Math.random() * 9000),
        name: customName.trim() || 'Aarav Sharma',
        email: customEmail.trim() || 'aarav.sharma@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        phone: '+91 98200 12345',
        billingAddress: {
          street: 'Flat 402, BKC Main Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400051',
          country: 'India',
        },
        shippingAddress: {
          street: 'Flat 402, BKC Main Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400051',
          country: 'India',
        },
      };
      onLogin(defaultUser);
      setIsSigningIn(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#090100]/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#fbf9f4] w-full max-w-md rounded-2xl shadow-2xl border border-[#d3c3be]/60 overflow-hidden text-[#1b1c19] z-10"
          >
            {/* Header */}
            <div className="bg-[#f5f3ee] p-5 sm:p-6 border-b border-[#d3c3be]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-[#825425] text-white">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="font-display font-bold text-base text-[#090100]">
                  Account Sign In
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-[#504440] hover:text-[#090100] transition-colors rounded-full hover:bg-[#e4e2dd] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white border border-[#d3c3be] shadow-xs flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-xl text-[#090100]">
                  Sign in with Google
                </h3>
                <p className="text-xs text-[#504440]">
                  Sign in to purchase products, customize your order, and track delivery.
                </p>
              </div>

              {/* Quick Google Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleQuickLogin}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f5f3ee] text-[#090100] font-medium py-3 px-4 rounded-xl border border-[#d3c3be] shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isSigningIn ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#825425]">
                    <div className="w-4 h-4 border-2 border-[#825425] border-t-transparent rounded-full animate-spin" />
                    <span>Signing In with Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                      />
                    </svg>
                    <span className="text-xs font-semibold">
                      Continue with Google
                    </span>
                  </>
                )}
              </motion.button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#d3c3be]/40" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-[#827470]">
                  <span className="bg-[#fbf9f4] px-2">Or enter your name</span>
                </div>
              </div>

              {/* Optional custom sign-in override inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-[#504440] uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-white border border-[#d3c3be] rounded-lg px-3 py-2 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#504440] uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. aarav.sharma@gmail.com"
                    className="w-full bg-white border border-[#d3c3be] rounded-lg px-3 py-2 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-[#827470]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>100% Secure Sign In</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
