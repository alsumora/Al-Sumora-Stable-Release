import React, { useState, useEffect } from 'react';
import { CartItem, UserProfile, Order, OrderStatus, TrackingStep } from '../types';
import { Shield, Truck, CreditCard, CheckCircle2, Lock, Sparkles, ArrowRight, Package, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CheckoutViewProps {
  cartItems: CartItem[];
  userProfile: UserProfile | null;
  onPlaceOrder: (newOrder: Order) => void;
  onOpenAuthModal: () => void;
  onNavigateToShop: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  userProfile,
  onPlaceOrder,
  onOpenAuthModal,
  onNavigateToShop,
}) => {
  // Form State initialized with user profile if available
  const [formData, setFormData] = useState({
    fullName: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    street: userProfile?.shippingAddress?.street || '',
    apartment: '',
    city: userProfile?.shippingAddress?.city || 'Mumbai',
    state: userProfile?.shippingAddress?.state || 'Maharashtra',
    postalCode: userProfile?.shippingAddress?.postalCode || '400051',
    country: userProfile?.shippingAddress?.country || 'India',
    sameAsShipping: true,
    billingStreet: userProfile?.billingAddress?.street || '',
    billingCity: userProfile?.billingAddress?.city || 'Mumbai',
    billingPostalCode: userProfile?.billingAddress?.postalCode || '400051',
    billingCountry: userProfile?.billingAddress?.country || 'India',
    shippingMethod: 'express',
    paymentMethod: 'upi',
    cardName: userProfile?.name || '',
    cardNumber: '4242 •••• •••• 8912',
    cardExpiry: '08/29',
    cardCvc: '889',
    giftNote: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        fullName: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || prev.phone,
        street: userProfile.shippingAddress?.street || prev.street,
        city: userProfile.shippingAddress?.city || prev.city,
        state: userProfile.shippingAddress?.state || prev.state,
        postalCode: userProfile.shippingAddress?.postalCode || prev.postalCode,
        country: userProfile.shippingAddress?.country || 'India',
        cardName: userProfile.name,
      }));
    }
  }, [userProfile]);

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  // If user is not logged in, enforce security lock
  if (!userProfile) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#f0eee9] text-[#825425] rounded-2xl flex items-center justify-center mx-auto border border-[#d3c3be]">
          <Lock className="w-8 h-8 text-[#825425]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#090100]">
            Sign in to Complete Your Purchase
          </h1>
          <p className="text-xs text-[#504440] leading-relaxed max-w-md mx-auto">
            To ensure your handcrafted leather order is securely recorded, linked to your tracking profile, and dispatched with insured delivery, please sign in with your Google account.
          </p>
        </div>

        <div className="bg-[#f5f3ee] border border-[#d3c3be]/70 rounded-xl p-4 text-xs text-[#504440] flex items-center justify-between max-w-md mx-auto">
          <span>Items in Bag: <strong className="text-[#090100]">{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</strong></span>
          <span>Bag Total: <strong className="text-[#825425]">₹{subtotal.toLocaleString('en-IN')}</strong></span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#090100] hover:bg-[#825425] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-[#fdc087]" />
            <span>Sign In with Google to Unlock Checkout</span>
          </button>

          <button
            onClick={onNavigateToShop}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-[#f0eee9] text-[#090100] border border-[#d3c3be] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#825425]" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#f0eee9] text-[#825425] rounded-full flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[#090100]">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-[#504440] max-w-md mx-auto">
          Add items from our collection to proceed with checkout and purchase your handcrafted leather creations.
        </p>
        <button
          onClick={onNavigateToShop}
          className="px-6 py-3 bg-[#090100] text-white hover:bg-[#825425] text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `ALS-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const estDelivery = new Date(now.setDate(now.getDate() + 4)).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const initialSteps: TrackingStep[] = [
        {
          label: 'Order Placed',
          date: `${formattedDate} • 10:30 AM`,
          completed: true,
          current: true,
          description: 'Payment authorized and order registered for handcrafted assembly.',
        },
        {
          label: 'Stitching',
          date: 'Pending',
          completed: false,
          description: 'Master artisan hand-stitching full-grain leather with wax thread.',
        },
        {
          label: 'Dispatched',
          date: 'Pending',
          completed: false,
          description: 'Handed over to insured express courier with live tracking.',
        },
        {
          label: 'Delivered',
          date: 'Pending',
          completed: false,
          description: 'Delivered directly to doorstep.',
        },
      ];

      const newOrder: Order = {
        id: orderId,
        createdAt: formattedDate,
        items: [...cartItems],
        subtotal,
        shippingFee,
        total,
        status: 'Order Placed',
        trackingNumber: `DHL-${Math.floor(100000 + Math.random() * 900000)}-EX`,
        estimatedDelivery: estDelivery,
        courierName: 'DHL Express Worldwide Air',
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod === 'googlepay' ? 'Google Pay' : 'Credit Card (Visa •••• 8912)',
        giftNote: formData.giftNote,
        trackingSteps: initialSteps,
      };

      onPlaceOrder(newOrder);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Page Title */}
      <div className="mb-8 border-b border-[#d3c3be]/40 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#825425]">
            Secure Maison Checkout
          </span>
          <h1 className="font-display font-bold text-3xl text-[#090100]">
            Complete Your Purchase
          </h1>
        </div>

        {!userProfile ? (
          <div className="p-3 bg-[#f0eee9] rounded-xl border border-[#d3c3be]/60 flex items-center justify-between gap-4 text-xs">
            <span className="text-[#504440]">Have a Google Account?</span>
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 bg-white border border-[#d3c3be] rounded-lg text-[#090100] font-semibold flex items-center gap-1.5 hover:bg-[#e4e2dd] transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#825425] font-medium bg-[#f0eee9] px-3 py-1.5 rounded-lg border border-[#825425]/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Authenticated as {userProfile.name}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 7 Columns: Checkout Details Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Contact Information */}
          <section className="bg-white rounded-2xl border border-[#d3c3be]/40 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-3">
              <h3 className="font-display font-bold text-lg text-[#090100] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#090100] text-white text-xs flex items-center justify-center font-mono">1</span>
                <span>Contact Details</span>
              </h3>
              <span className="text-[10px] text-[#827470] uppercase tracking-wider font-semibold">For Dispatch Updates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#090100] uppercase block mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Lord Alexander Sterling"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-3 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#090100] uppercase block mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="alexander@mayfair.co.uk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-3 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#090100] uppercase block mb-1">Telephone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="+44 20 7946 0912"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-3 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Delivery Shipping Address */}
          <section className="bg-white rounded-2xl border border-[#d3c3be]/40 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-3">
              <h3 className="font-display font-bold text-lg text-[#090100] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#090100] text-white text-xs flex items-center justify-center font-mono">2</span>
                <span>Shipping Delivery Address</span>
              </h3>
              <span className="text-[10px] text-[#827470] uppercase tracking-wider font-semibold">Insured Courier</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#090100] uppercase block mb-1">Street Address</label>
                <input
                  required
                  type="text"
                  placeholder="14 Berkeley Square, Mayfair"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-3 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#090100] uppercase block mb-1">City</label>
                  <input
                    required
                    type="text"
                    placeholder="London"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-3 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#090100] uppercase block mb-1">Postal / Zip Code</label>
                  <input
                    required
                    type="text"
                    placeholder="W1J 6CB"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-3 text-xs text-[#090100] focus:outline-none focus:border-[#825425]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#090100] uppercase block mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-3 text-xs text-[#090100] focus:outline-none focus:border-[#825425] cursor-pointer"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Japan">Japan</option>
                    <option value="Switzerland">Switzerland</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Shipping Speed */}
          <section className="bg-white rounded-2xl border border-[#d3c3be]/40 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-display font-bold text-lg text-[#090100] flex items-center gap-2 border-b border-[#d3c3be]/30 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#090100] text-white text-xs flex items-center justify-center font-mono">3</span>
              <span>Express Delivery Options</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setFormData({ ...formData, shippingMethod: 'express' })}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  formData.shippingMethod === 'express'
                    ? 'border-[#090100] bg-[#fbf9f4] shadow-sm'
                    : 'border-[#d3c3be]/50 hover:border-[#825425]/40'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={formData.shippingMethod === 'express'}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div>
                  <div className="text-xs font-bold text-[#090100] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#825425]" />
                    <span>Complimentary Express Air Courier</span>
                  </div>
                  <p className="text-[11px] text-[#827470] mt-1">
                    3-5 Business Days • Fully Insured by DHL
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase mt-1 inline-block">
                    Free
                  </span>
                </div>
              </label>

              <label
                onClick={() => setFormData({ ...formData, shippingMethod: 'whiteglove' })}
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  formData.shippingMethod === 'whiteglove'
                    ? 'border-[#090100] bg-[#fbf9f4] shadow-sm'
                    : 'border-[#d3c3be]/50 hover:border-[#825425]/40'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={formData.shippingMethod === 'whiteglove'}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div>
                  <div className="text-xs font-bold text-[#090100] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#fdc087]" />
                    <span>White Glove Atelier Hand Delivery</span>
                  </div>
                  <p className="text-[11px] text-[#827470] mt-1">
                    Direct hand-delivery with bespoke presentation box
                  </p>
                  <span className="text-[10px] font-bold text-[#825425] uppercase mt-1 inline-block">
                    +$120 USD
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* Section 4: Payment Method */}
          <section className="bg-white rounded-2xl border border-[#d3c3be]/40 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-display font-bold text-lg text-[#090100] flex items-center gap-2 border-b border-[#d3c3be]/30 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#090100] text-white text-xs flex items-center justify-center font-mono">4</span>
              <span>Payment Details</span>
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#090100] bg-[#090100] text-white'
                      : 'border-[#d3c3be] text-[#504440] hover:border-[#825425]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#fdc087]" />
                  <span>Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'googlepay' })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.paymentMethod === 'googlepay'
                      ? 'border-[#090100] bg-white text-[#090100] shadow-sm'
                      : 'border-[#d3c3be] text-[#504440] hover:border-[#825425]'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                  </svg>
                  <span>Google Pay</span>
                </button>
              </div>

              {formData.paymentMethod === 'card' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-semibold text-[#090100] uppercase block mb-1">Name on Card</label>
                    <input
                      required
                      type="text"
                      placeholder="Lord Sterling"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-2.5 text-xs text-[#090100]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-semibold text-[#090100] uppercase block mb-1">Card Number</label>
                      <input
                        required
                        type="text"
                        placeholder="4242 8912 3456 7890"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-2.5 text-xs text-[#090100] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#090100] uppercase block mb-1">Expiry / CVC</label>
                      <input
                        required
                        type="text"
                        placeholder="08/29 • 889"
                        value={`${formData.cardExpiry} / ${formData.cardCvc}`}
                        onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                        className="w-full bg-[#fbf9f4] border border-[#d3c3be] rounded-lg p-2.5 text-xs text-[#090100] font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#f0eee9] rounded-xl text-center space-y-2">
                  <p className="text-xs text-[#504440]">
                    Google Pay express authorization will process upon clicking Complete Purchase below.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Section 5: Gift Note */}
          <section className="bg-white rounded-2xl border border-[#d3c3be]/40 p-6 space-y-2 shadow-xs">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#090100] block">
              Handwritten Gift Note (Complimentary)
            </label>
            <textarea
              rows={2}
              placeholder="Add personal note to be written on Al Sumora wax-sealed card..."
              value={formData.giftNote}
              onChange={(e) => setFormData({ ...formData, giftNote: e.target.value })}
              className="w-full text-xs p-3 bg-[#fbf9f4] border border-[#d3c3be] rounded-lg focus:outline-none focus:border-[#825425]"
            />
          </section>
        </div>

        {/* Right 5 Columns: Order Summary & Pay Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#d3c3be]/60 p-6 shadow-md sticky top-28 space-y-6">
            <h3 className="font-display font-bold text-xl text-[#090100] border-b border-[#d3c3be]/40 pb-4 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-sans text-[#825425] uppercase tracking-wider">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </h3>

            {/* Cart Items Preview */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-[#d3c3be]/30 text-xs">
                  <img
                    src={item.selectedColor.image || item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg bg-[#f5f3ee] border border-[#d3c3be]/40 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-[#090100] line-clamp-1">{item.product.name}</h4>
                    <div className="text-[10px] text-[#827470]">
                      Shade: {item.selectedColor.name} • Qty: {item.quantity}
                    </div>

                    {item.monogram && (
                      <div className="p-1.5 bg-[#f5f3ee] rounded border border-[#825425]/20 text-[10px] space-y-0.5">
                        <div className="text-[#825425] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#825425]" />
                          <span>Engraved: "{item.monogram.initials}"</span>
                        </div>
                        {item.monogram.description && (
                          <div className="text-[#504440] text-[9px] line-clamp-1 italic">
                            "{item.monogram.description}"
                          </div>
                        )}
                        {item.monogram.referenceImages && item.monogram.referenceImages.length > 0 && (
                          <div className="text-[#825425] text-[9px]">
                            📸 {item.monogram.referenceImages.length} reference attached
                          </div>
                        )}
                      </div>
                    )}

                    <div className="font-bold text-[#825425]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-b border-[#d3c3be]/40 pb-4 text-[#504440]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#090100]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-emerald-700 font-semibold">Free Delivery</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Taxes</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex items-center justify-between font-display font-bold text-xl text-[#090100]">
              <span>Total</span>
              <span className="text-[#825425]">₹{total.toLocaleString('en-IN')}</span>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#090100] hover:bg-[#825425] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2 text-[#fdc087]">
                  <div className="w-4 h-4 border-2 border-[#fdc087] border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#fdc087]" />
                  <span>Place Order • ₹{total.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4 text-[#fdc087]" />
                </>
              )}
            </button>

            <div className="text-[10px] text-[#827470] text-center flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#825425]" />
              <span>100% Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
