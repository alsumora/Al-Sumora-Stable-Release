import React, { useState } from 'react';
import { UserProfile, Order, CartItem } from '../types';
import {
  Package,
  Truck,
  Sparkles,
  Search,
  ArrowRight,
  ShoppingBag,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { OrderTrackingModal } from './OrderTrackingModal';

interface OrdersViewProps {
  userProfile: UserProfile | null;
  orders: Order[];
  onNavigateToShop: () => void;
  onNavigateToSettings: () => void;
  onOpenAuthModal: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  userProfile,
  orders = [],
  onNavigateToShop,
  onOpenAuthModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [trackingItem, setTrackingItem] = useState<CartItem | null>(null);

  const openTracker = (order: Order, item?: CartItem) => {
    setTrackingOrder(order);
    setTrackingItem(item || order.items[0]);
  };

  // If user is not logged in, enforce security lock
  if (!userProfile) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#f0eee9] text-[#825425] rounded-2xl flex items-center justify-center mx-auto border border-[#d3c3be]">
          <Lock className="w-8 h-8 text-[#825425]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#090100]">
            Sign in to View Your Orders
          </h1>
          <p className="text-xs text-[#504440] leading-relaxed max-w-md mx-auto">
            You can browse all our handcrafted products freely, but you must sign in with your Google account to access your orders, track deliveries, and view invoices.
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

          <button
            onClick={onNavigateToShop}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#f0eee9] text-[#090100] border border-[#d3c3be] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#825425]" />
            <span>Browse Products</span>
          </button>
        </div>
      </div>
    );
  }

  const safeOrders = orders || [];
  const filteredOrders = safeOrders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      order.id.toLowerCase().includes(query) ||
      order.items.some((i) => i.product.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d3c3be]/40 pb-5 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#090100]">
            My Orders
          </h1>
          <p className="text-xs text-[#504440] mt-0.5">
            Logged in as {userProfile.name} ({userProfile.email})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToShop}
            className="px-3.5 py-2 bg-[#825425] hover:bg-[#090100] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop Pieces</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#827470]" />
        <input
          type="text"
          placeholder="Search by product name or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#fbf9f4] border border-[#d3c3be]/70 pl-9 pr-3 py-2 text-xs rounded-lg text-[#090100] focus:outline-none focus:border-[#825425]"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#d3c3be]/40 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#f0eee9] text-[#825425] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[#090100]">No Orders Placed Yet</h3>
            <p className="text-xs text-[#504440] max-w-md mx-auto">
              {searchQuery
                ? `No orders match "${searchQuery}".`
                : 'Browse our collection of pure leather bags, footwear, and accessories to place your first order.'}
            </p>
          </div>
          <button
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#825425] hover:bg-[#090100] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-[#d3c3be]/60 shadow-xs overflow-hidden"
            >
              {/* Order Info Subheader: Reference & Date */}
              <div className="px-5 py-3 bg-[#fbf9f4] border-b border-[#d3c3be]/40 flex items-center justify-between text-xs text-[#504440]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#090100]">{order.id}</span>
                  <span className="text-[#827470]">•</span>
                  <span>{order.createdAt}</span>
                </div>
                <div className="font-semibold text-[#825425]">
                  Total: ₹{order.total.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#f0eee9] p-2 sm:p-4">
                {order.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Thumbnail & Name */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-lg bg-[#f0eee9] overflow-hidden border border-[#d3c3be]/50 shrink-0">
                        <img
                          src={item.selectedColor.image || item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      <div>
                        <h4 className="font-display font-semibold text-sm text-[#090100]">
                          {item.product.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#504440] mt-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span className="text-[11px]">{item.selectedColor.name}</span>
                          </div>

                          <span className="text-[11px] text-[#827470]">
                            Qty: {item.quantity}
                          </span>

                          {item.monogram?.initials && (
                            <span className="inline-flex items-center gap-1 text-[#825425] font-mono text-[10px] font-bold bg-[#fdc087]/20 px-1.5 py-0.5 rounded">
                              <Sparkles className="w-2.5 h-2.5" />
                              "{item.monogram.initials}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount & Track Item Button */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 border-[#f0eee9] pt-2 sm:pt-0">
                      <div className="text-right font-bold text-sm text-[#090100]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      <button
                        onClick={() => openTracker(order, item)}
                        className="px-3.5 py-2 bg-[#090100] hover:bg-[#825425] text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#fdc087]" />
                        <span>Track Item</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Tracking Modal */}
      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          selectedItem={trackingItem || trackingOrder.items[0]}
          onClose={() => {
            setTrackingOrder(null);
            setTrackingItem(null);
          }}
        />
      )}
    </div>
  );
};
