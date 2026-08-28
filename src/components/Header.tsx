import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, Category, UserProfile } from '../types';
import { LOGO_IMAGE } from '../data/products';
import { isAdminUser } from '../data/adminData';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Package,
  LogOut,
  Settings,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectCategory?: (category: Category) => void;
  cartCount: number;
  wishlistCount?: number;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsBespokeOpen?: (open: boolean) => void;
  userProfile: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount = 0,
  setIsCartOpen,
  setIsSearchOpen,
  userProfile,
  onOpenAuthModal,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile navigation drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsUserMenuOpen(false);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fbf9f4]/95 backdrop-blur-md border-b border-[#d3c3be]/30 transition-all duration-300">
      {/* Main Brand & Navigation Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Mobile Burger Menu Toggle Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 -ml-1.5 text-[#1b1c19] hover:text-[#825425] hover:bg-[#f0eee9] rounded-lg transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer transition-transform duration-200"
          >
            <div className="h-9 sm:h-11 w-9 sm:w-11 rounded-lg overflow-hidden border border-[#825425]/40 shadow-xs bg-[#090100] flex items-center justify-center shrink-0">
              <img
                src={LOGO_IMAGE}
                alt="Al Sumora Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-2xl tracking-wider text-[#090100] uppercase leading-none">
                AL SUMORA
              </span>
              <span className="text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-[#825425] uppercase font-semibold mt-0.5 leading-none">
                PURE LEATHER STUDIO
              </span>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation in specified order: Home, Shop Collection, Customization, About Us */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleNavClick('home')}
            className={`relative py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#090100] font-semibold'
                : 'text-[#504440] hover:text-[#825425]'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#825425] transition-all" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('shop')}
            className={`relative py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'shop'
                ? 'text-[#090100] font-semibold'
                : 'text-[#504440] hover:text-[#825425]'
            }`}
          >
            Shop Collection
            {activeTab === 'shop' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#825425] transition-all" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('customization')}
            className={`relative py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'customization'
                ? 'text-[#090100] font-semibold'
                : 'text-[#504440] hover:text-[#825425]'
            }`}
          >
            My Customization
            {activeTab === 'customization' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#825425] transition-all" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`relative py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'text-[#090100] font-semibold'
                : 'text-[#504440] hover:text-[#825425]'
            }`}
          >
            About Us
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#825425] transition-all" />
            )}
          </button>
        </nav>

        {/* Right Actions: Search, Saved/Wishlist, Cart, Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-4">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 sm:p-2 text-[#1b1c19] hover:text-[#825425] transition-colors rounded-full hover:bg-[#f0eee9] cursor-pointer"
            title="Search Collection"
            aria-label="Search Collection"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Wishlist Trigger */}
          <button
            onClick={() => handleNavClick('wishlist')}
            className={`p-1.5 sm:p-2 transition-colors relative rounded-full hover:bg-[#f0eee9] cursor-pointer ${
              activeTab === 'wishlist'
                ? 'text-[#825425] bg-[#f0eee9]'
                : 'text-[#1b1c19] hover:text-[#825425]'
            }`}
            title="Saved Wishlist"
            aria-label="Saved Wishlist"
          >
            <Heart
              className={`w-5 h-5 ${
                wishlistCount > 0 ? 'fill-[#825425]/20 text-[#825425]' : ''
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#825425] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger with Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-1.5 sm:p-2 text-[#1b1c19] hover:text-[#825425] transition-colors relative rounded-full hover:bg-[#f0eee9] cursor-pointer"
            title="View Shopping Bag"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#825425] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Sign In */}
          {userProfile ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-[#d3c3be] hover:border-[#825425] bg-white transition-all cursor-pointer shadow-2xs"
                title="Account Settings"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#d3c3be] rounded-xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-[#f0eee9]">
                    <div className="text-xs font-bold text-[#090100] truncate">
                      {userProfile.name}
                    </div>
                    <div className="text-[10px] text-[#827470] truncate">
                      {userProfile.email}
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavClick('wishlist')}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#090100] hover:bg-[#fbf9f4] hover:text-[#825425] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-[#825425]" />
                      <span>My Saved Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-[#fdc087]/30 text-[#825425] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavClick('orders')}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#090100] hover:bg-[#fbf9f4] hover:text-[#825425] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-[#825425]" />
                    <span>My Orders & Tracking</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#090100] hover:bg-[#fbf9f4] hover:text-[#825425] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#825425]" />
                    <span>Profile & Addresses</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('contact')}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#090100] hover:bg-[#fbf9f4] hover:text-[#825425] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LifeBuoy className="w-3.5 h-3.5 text-[#825425]" />
                    <span>Raise Ticket</span>
                  </button>

                  {isAdminUser(userProfile.email) && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-[#825425] bg-[#fdc087]/15 hover:bg-[#825425] hover:text-white flex items-center gap-2 transition-colors cursor-pointer border-t border-b border-[#fdc087]/30"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Atelier Admin Portal</span>
                    </button>
                  )}

                  <div className="border-t border-[#f0eee9] my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="p-1.5 sm:p-2 text-[#1b1c19] hover:text-[#825425] transition-colors rounded-full hover:bg-[#f0eee9] cursor-pointer flex text-sm font-medium items-center gap-1.5"
              title="Sign In"
              aria-label="Sign In"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Android & Mobile Full Left-Side Drawer Menu */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#090100]/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Slide-out Left Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#fbf9f4] shadow-2xl flex flex-col justify-between border-r border-[#d3c3be]/50 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Header */}
              <div>
                <div className="p-5 bg-[#090100] text-white flex items-center justify-between border-b border-[#2c1810]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg overflow-hidden border border-[#fdc087]/40 bg-[#090100] shrink-0">
                      <img
                        src={LOGO_IMAGE}
                        alt="Al Sumora Logo"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm tracking-wider text-white uppercase leading-none">
                        AL SUMORA
                      </div>
                      <div className="text-[8px] tracking-[0.2em] text-[#fdc087] uppercase font-semibold mt-1">
                        PURE LEATHER STUDIO
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Navigation Links in strict requested order: Home, Shop Collection, Customization, About Us */}
                <div className="p-4 space-y-1.5">
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'home'
                        ? 'bg-[#090100] text-white shadow-sm'
                        : 'text-[#090100] hover:bg-[#f0eee9]'
                    }`}
                  >
                    <span>Home</span>
                    <ChevronRight className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#fdc087]' : 'text-[#827470]'}`} />
                  </button>

                  <button
                    onClick={() => handleNavClick('shop')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'shop'
                        ? 'bg-[#090100] text-white shadow-sm'
                        : 'text-[#090100] hover:bg-[#f0eee9]'
                    }`}
                  >
                    <span>Shop Collection</span>
                    <ChevronRight className={`w-4 h-4 ${activeTab === 'shop' ? 'text-[#fdc087]' : 'text-[#827470]'}`} />
                  </button>

                  <button
                    onClick={() => handleNavClick('customization')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'customization'
                        ? 'bg-[#090100] text-white shadow-sm'
                        : 'text-[#090100] hover:bg-[#f0eee9]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>Customization</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#825425]" />
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeTab === 'customization' ? 'text-[#fdc087]' : 'text-[#827470]'}`} />
                  </button>

                  <button
                    onClick={() => handleNavClick('about')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'about'
                        ? 'bg-[#090100] text-white shadow-sm'
                        : 'text-[#090100] hover:bg-[#f0eee9]'
                    }`}
                  >
                    <span>About Us</span>
                    <ChevronRight className={`w-4 h-4 ${activeTab === 'about' ? 'text-[#fdc087]' : 'text-[#827470]'}`} />
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="px-4 pt-2 border-t border-[#d3c3be]/40 space-y-1">
                  <button
                    onClick={() => handleNavClick('wishlist')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'wishlist' ? 'bg-[#f0eee9] text-[#825425]' : 'text-[#504440] hover:bg-[#f0eee9]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-[#825425]" />
                      <span>My Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-[#825425] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavClick('orders')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'orders' ? 'bg-[#f0eee9] text-[#825425]' : 'text-[#504440] hover:bg-[#f0eee9]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-[#825425]" />
                      <span>My Orders & Tracking</span>
                    </div>
                  </button>

                  {userProfile && (
                    <>
                      <button
                        onClick={() => handleNavClick('settings')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          activeTab === 'settings' ? 'bg-[#f0eee9] text-[#825425]' : 'text-[#504440] hover:bg-[#f0eee9]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4 text-[#825425]" />
                          <span>Profile & Settings</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('contact')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          activeTab === 'contact' ? 'bg-[#f0eee9] text-[#825425]' : 'text-[#504440] hover:bg-[#f0eee9]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <LifeBuoy className="w-4 h-4 text-[#825425]" />
                          <span>Raise Ticket</span>
                        </div>
                      </button>
                    </>
                  )}

                  {userProfile && isAdminUser(userProfile.email) && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-[#fdc087]/20 text-[#825425]`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#825425]" />
                        <span>Atelier Admin Portal</span>
                      </div>
                      <span className="text-[9px] uppercase bg-[#825425] text-white px-1.5 py-0.5 rounded font-bold">Admin</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Profile / Sign in bar */}
              <div className="p-4 bg-[#f5f3ee] border-t border-[#d3c3be]/40">
                {userProfile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#090100] truncate">
                          {userProfile.name}
                        </div>
                        <div className="text-[10px] text-[#827470] truncate">
                          {userProfile.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsMobileNavOpen(false);
                        onLogout();
                      }}
                      className="p-2 text-rose-700 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full py-3 px-4 bg-[#090100] hover:bg-[#825425] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#fdc087]" />
                    <span>Sign In with Google</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

