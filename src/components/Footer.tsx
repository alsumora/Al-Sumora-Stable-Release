import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { LOGO_IMAGE } from '../data/products';
import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  Facebook,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  setIsBespokeOpen?: (open: boolean) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090100] text-[#fbf9f4] pt-6 pb-4 sm:pt-10 sm:pb-8 border-t border-[#2c1810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 md:gap-8 pb-6 sm:pb-8">
          {/* Brand & Socials */}
          <div className="space-y-2 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg overflow-hidden border border-[#825425]/50 shadow-xs bg-[#090100] flex items-center justify-center shrink-0">
                <img
                  src={LOGO_IMAGE}
                  alt="Al Sumora Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-sm sm:text-base tracking-wider text-white">
                AL SUMORA
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#d3c3be] leading-relaxed">
              Handcrafted pure leather goods since 1984. Preserving traditional leathercraft, natural vegetable tanning, and custom monogramming.
            </p>
            <div className="text-[10px] sm:text-xs text-[#fdc087] font-medium">
              Customer Care & Support
            </div>
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1b1c19] border border-[#504440] hover:border-[#fdc087] hover:text-[#fdc087] flex items-center justify-center transition-colors cursor-pointer text-[#d3c3be]"
                title="Follow on Instagram"
              >
                <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1b1c19] border border-[#504440] hover:border-[#fdc087] hover:text-[#fdc087] flex items-center justify-center transition-colors cursor-pointer text-[#d3c3be]"
                title="Follow on Facebook"
              >
                <Facebook className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1b1c19] border border-[#504440] hover:border-[#fdc087] hover:text-[#fdc087] flex items-center justify-center transition-colors cursor-pointer text-[#d3c3be]"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a
                href="tel:+919876543210"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1b1c19] border border-[#504440] hover:border-[#fdc087] hover:text-[#fdc087] flex items-center justify-center transition-colors cursor-pointer text-[#d3c3be]"
                title="Call Support"
              >
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
              <a
                href="mailto:support@alsumora.com"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1b1c19] border border-[#504440] hover:border-[#fdc087] hover:text-[#fdc087] flex items-center justify-center transition-colors cursor-pointer text-[#d3c3be]"
                title="Email Support"
              >
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
            </div>
          </div>

          {/* Collection Links */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-[#fdc087] mb-2 sm:mb-3">
              Collection
            </h4>
            <ul className="space-y-1 text-[10px] sm:text-xs text-[#d3c3be]">
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Leather Goods
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Briefcases
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Classic Totes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fine Wallets
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-[#fdc087] mb-2 sm:mb-3">
              Company
            </h4>
            <ul className="space-y-1 text-[10px] sm:text-xs text-[#d3c3be]">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('customization')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customization & Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Leather Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Support
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-[#fdc087] mb-2 sm:mb-3">
              Newsletter
            </h4>
            <p className="text-[10px] sm:text-xs text-[#d3c3be] mb-2 sm:mb-3">
              Private previews of seasonal leather releases and events.
            </p>
            {subscribed ? (
              <div className="p-2 bg-[#2c1810] text-[#fdc087] rounded text-[10px] sm:text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Enrolled in the Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-1.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1b1c19] border border-[#504440] text-white text-[10px] sm:text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-[#fdc087] transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 p-1 bg-[#825425] text-white rounded hover:bg-[#fdc087] hover:text-[#090100] transition-colors cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sub-footer Copyright */}
        <div className="pt-4 sm:pt-6 border-t border-[#2c1810] flex flex-col md:flex-row items-center justify-between text-[9px] sm:text-[10px] text-[#827470] gap-3">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} Al Sumora Pure Leather Studio.
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#d3c3be] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-[#d3c3be] transition-colors cursor-pointer"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
