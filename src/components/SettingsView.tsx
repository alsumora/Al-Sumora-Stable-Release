import React, { useState, useEffect } from 'react';
import { UserProfile, UserAddress } from '../types';
import {
  User,
  MapPin,
  CheckCircle2,
  Save,
  ShieldCheck,
  LogOut,
  Sliders,
  Mail,
  Phone,
  Building,
  Bell,
  Lock,
  ShoppingBag
} from 'lucide-react';

interface SettingsViewProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToShop?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onLogout,
  onOpenAuthModal,
  onNavigateToShop,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'addresses' | 'preferences'>('profile');

  // Form states for Personal Info
  const [name, setName] = useState(userProfile?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(userProfile?.email || 'aarav.sharma@gmail.com');
  const [phone, setPhone] = useState(userProfile?.phone || '+91 98200 12345');
  const [avatar, setAvatar] = useState(
    userProfile?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  );

  // Sync state if userProfile changes
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone || '+91 98200 12345');
      setAvatar(userProfile.avatar);
      if (userProfile.shippingAddress) {
        setShippingAddress(userProfile.shippingAddress);
      }
      if (userProfile.billingAddress) {
        setBillingAddress(userProfile.billingAddress);
      }
    }
  }, [userProfile]);

  // Form states for Shipping & Billing Addresses
  const [shippingAddress, setShippingAddress] = useState<UserAddress>({
    street: userProfile?.shippingAddress?.street || 'Flat 402, BKC Main Road',
    city: userProfile?.shippingAddress?.city || 'Mumbai',
    state: userProfile?.shippingAddress?.state || 'Maharashtra',
    postalCode: userProfile?.shippingAddress?.postalCode || '400051',
    country: userProfile?.shippingAddress?.country || 'India',
  });

  const [billingAddress, setBillingAddress] = useState<UserAddress>({
    street: userProfile?.billingAddress?.street || 'Flat 402, BKC Main Road',
    city: userProfile?.billingAddress?.city || 'Mumbai',
    state: userProfile?.billingAddress?.state || 'Maharashtra',
    postalCode: userProfile?.billingAddress?.postalCode || '400051',
    country: userProfile?.billingAddress?.country || 'India',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Notification Preferences
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyDeliverySMS, setNotifyDeliverySMS] = useState(true);

  // If user is not logged in, enforce security lock
  if (!userProfile) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#f0eee9] text-[#825425] rounded-2xl flex items-center justify-center mx-auto border border-[#d3c3be]">
          <Lock className="w-8 h-8 text-[#825425]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#090100]">
            Sign in to Access Profile & Settings
          </h1>
          <p className="text-xs text-[#504440] leading-relaxed max-w-md mx-auto">
            You can view all our products without logging in, but you must sign in with your Google account to manage your delivery addresses, phone number, and purchase history.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-6 py-3 bg-[#090100] hover:bg-[#825425] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-[#fdc087]" />
            <span>Sign In with Google</span>
          </button>

          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#f0eee9] text-[#090100] border border-[#d3c3be] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#825425]" />
              <span>Browse Products</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      id: userProfile?.id || 'usr_google_default',
      name,
      email,
      phone,
      avatar,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
    };
    onUpdateProfile(updated);
    setSaveSuccessMsg('Personal profile updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveAddresses = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBilling = sameAsShipping ? shippingAddress : billingAddress;
    const updated: UserProfile = {
      id: userProfile?.id || 'usr_google_default',
      name,
      email,
      phone,
      avatar,
      shippingAddress,
      billingAddress: finalBilling,
    };
    onUpdateProfile(updated);
    setSaveSuccessMsg('Shipping and billing addresses saved successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-28">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#d3c3be]/40 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#825425]">
            <Sliders className="w-4 h-4" />
            <span>Account Management</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#090100] mt-1">
            Profile & Account Settings
          </h1>
          <p className="text-xs text-[#504440] mt-1 max-w-2xl">
            Update your personal details, default doorstep delivery addresses for India & international orders, and linked Google authentication credentials.
          </p>
        </div>
      </div>

      {/* Guest Notice if not logged in */}
      {!userProfile && (
        <div className="bg-[#fff9f3] border border-[#fdc087] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fdc087]/30 flex items-center justify-center text-[#825425] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#090100]">Guest Session</h3>
              <p className="text-xs text-[#825425]">
                Sign in with your Google account to automatically store and sync your addresses, orders, and custom monogram preferences.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="px-5 py-2.5 bg-[#825425] text-white hover:bg-[#090100] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
          >
            Sign In with Google
          </button>
        </div>
      )}

      {/* Save Success Alert Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Navigation Card */}
        <div className="bg-white rounded-2xl border border-[#d3c3be]/50 p-6 space-y-6 shadow-xs lg:sticky lg:top-24">
          {/* User Card Summary */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-[#f0eee9]">
            <img
              src={avatar}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#fdc087] shrink-0"
            />
            <div className="overflow-hidden">
              <h3 className="font-display font-semibold text-sm text-[#090100] truncate">
                {name}
              </h3>
              <p className="text-[11px] text-[#827470] truncate">{email}</p>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Google Verified Member</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveSubTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'profile'
                  ? 'bg-[#090100] text-white shadow-xs'
                  : 'text-[#504440] hover:bg-[#f0eee9] hover:text-[#090100]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveSubTab('addresses')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'addresses'
                  ? 'bg-[#090100] text-white shadow-xs'
                  : 'text-[#504440] hover:bg-[#f0eee9] hover:text-[#090100]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses & Invoicing</span>
            </button>

            <button
              onClick={() => setActiveSubTab('preferences')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'preferences'
                  ? 'bg-[#090100] text-white shadow-xs'
                  : 'text-[#504440] hover:bg-[#f0eee9] hover:text-[#090100]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications & Security</span>
            </button>
          </nav>

          {/* Sign Out Button */}
          {userProfile && (
            <div className="pt-4 border-t border-[#f0eee9]">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: PERSONAL PROFILE */}
          {activeSubTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-[#d3c3be]/50 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-[#f0eee9] pb-4">
                <h2 className="font-display font-bold text-xl text-[#090100]">Personal Information</h2>
                <p className="text-xs text-[#504440] mt-1">
                  Manage your public profile name, contact phone for courier delivery notifications, and profile avatar.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="flex items-center gap-4 p-4 bg-[#fbf9f4] rounded-xl border border-[#d3c3be]/40">
                  <img
                    src={avatar}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#825425] shadow-xs"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-[#090100]">{name}</h3>
                    <p className="text-xs text-[#827470]">{email}</p>
                    <span className="inline-block text-[10px] font-semibold text-[#825425] bg-[#fdc087]/20 px-2 py-0.5 rounded mt-1">
                      Maison Member Profile
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#090100] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#825425]" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#090100] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#825425]" />
                      <span>Google Account Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#090100] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#825425]" />
                      <span>Primary Contact Number (For Courier Delivery Dispatch)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98200 12345"
                      className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                    />
                    <p className="text-[10px] text-[#827470]">
                      Our express delivery partners (BlueDart, Delhivery, DHL) will send OTP and tracking updates to this mobile number.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#825425] hover:bg-[#090100] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Personal Information</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ADDRESSES & INVOICING */}
          {activeSubTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-[#d3c3be]/50 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-[#f0eee9] pb-4">
                <h2 className="font-display font-bold text-xl text-[#090100]">Addresses & Billing Information</h2>
                <p className="text-xs text-[#504440] mt-1">
                  Manage your primary shipping address for doorstep courier deliveries across India or internationally.
                </p>
              </div>

              <form onSubmit={handleSaveAddresses} className="space-y-6">
                {/* Shipping Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#825425]">
                    <MapPin className="w-4 h-4" />
                    <span>Primary Doorstep Shipping Address</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-[#090100]">Flat / House / Street Address</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        placeholder="e.g. 402 Palm Heights, BKC Road"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#090100]">City</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#090100]">State / Province</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        placeholder="e.g. Maharashtra, Delhi, Karnataka"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#090100]">Postal / PIN Code</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        placeholder="e.g. 400051 or 110021"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#090100]">Country</label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425] cursor-pointer"
                      >
                        <option value="India">India</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Singapore">Singapore</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Same as Shipping Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 text-xs text-[#090100] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4 text-[#825425] rounded focus:ring-[#825425] cursor-pointer"
                    />
                    <span className="font-semibold">Billing address is identical to shipping address</span>
                  </label>
                </div>

                {/* Billing Address if different */}
                {!sameAsShipping && (
                  <div className="space-y-4 pt-4 border-t border-[#f0eee9]">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#825425]">
                      <Building className="w-4 h-4" />
                      <span>Billing & GST Invoice Address</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-medium text-[#090100]">Billing Street Address</label>
                        <input
                          type="text"
                          required
                          value={billingAddress.street}
                          onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                          className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#090100]">City</label>
                        <input
                          type="text"
                          required
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                          className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#090100]">State / Province</label>
                        <input
                          type="text"
                          required
                          value={billingAddress.state}
                          onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                          className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#090100]">PIN / Postal Code</label>
                        <input
                          type="text"
                          required
                          value={billingAddress.postalCode}
                          onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                          className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#090100]">Country</label>
                        <input
                          type="text"
                          required
                          value={billingAddress.country}
                          onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                          className="w-full bg-[#fbf9f4] border border-[#d3c3be]/60 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#825425]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#825425] hover:bg-[#090100] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Address Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS & SECURITY */}
          {activeSubTab === 'preferences' && (
            <div className="bg-white rounded-2xl border border-[#d3c3be]/50 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-[#f0eee9] pb-4">
                <h2 className="font-display font-bold text-xl text-[#090100]">Notifications & Security Preferences</h2>
                <p className="text-xs text-[#504440] mt-1">
                  Manage how you receive delivery tracking alerts and artisan production updates.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#fbf9f4] rounded-xl border border-[#d3c3be]/40">
                  <div>
                    <h4 className="font-semibold text-xs text-[#090100]">WhatsApp & SMS Live Dispatch Alerts</h4>
                    <p className="text-[11px] text-[#827470]">
                      Receive automated courier out-for-delivery alerts and tracking links directly on WhatsApp.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyWhatsApp}
                    onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                    className="w-4 h-4 text-[#825425] rounded focus:ring-[#825425] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#fbf9f4] rounded-xl border border-[#d3c3be]/40">
                  <div>
                    <h4 className="font-semibold text-xs text-[#090100]">Order Confirmation & Digital Tax Invoices</h4>
                    <p className="text-[11px] text-[#827470]">
                      Receive detailed PDF invoices and master craftsmanship certificates by email.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="w-4 h-4 text-[#825425] rounded focus:ring-[#825425] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#fbf9f4] rounded-xl border border-[#d3c3be]/40">
                  <div>
                    <h4 className="font-semibold text-xs text-[#090100]">Artisan Milestone Notifications</h4>
                    <p className="text-[11px] text-[#827470]">
                      Get updates when your leather piece starts cutting, hand saddle-stitching, and finishes quality inspection.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyDeliverySMS}
                    onChange={(e) => setNotifyDeliverySMS(e.target.checked)}
                    className="w-4 h-4 text-[#825425] rounded focus:ring-[#825425] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
