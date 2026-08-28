import React from 'react';
import { Order, Product, CategoryItem, CustomerUser, CustomerInquiry, AdminTab, BannerSlide } from '../../types';
import { DEFAULT_BANNER_SLIDES } from '../../data/products';
import {
  ShoppingBag,
  Clock,
  Package,
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Plus,
  FolderTree,
  Mail,
  ChevronRight,
  ArrowRight,
  Image as ImageIcon,
  Sliders
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  orders: Order[];
  products: Product[];
  categories: CategoryItem[];
  users: CustomerUser[];
  inquiries: CustomerInquiry[];
  banners?: BannerSlide[];
  onNavigateTab: (tab: AdminTab) => void;
  onSelectOrder: (order: Order) => void;
  onSelectInquiry: (inquiry: CustomerInquiry) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  orders,
  products,
  categories,
  inquiries,
  banners = DEFAULT_BANNER_SLIDES,
  onNavigateTab,
  onSelectOrder,
  onSelectInquiry,
}) => {
  // Calculated Statistics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Order Placed' || o.status === 'Stitching');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const pendingInquiries = inquiries.filter((i) => i.status === 'Pending');
  const activeBannersCount = banners.filter((b) => b.active !== false).length;

  // Category product counts
  const categoryCounts = categories.map((cat) => {
    const count = products.filter(
      (p) =>
        p.category.toLowerCase() === cat.category.toLowerCase() ||
        p.category.toLowerCase() === cat.name.toLowerCase()
    ).length;
    return { ...cat, productCount: count };
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Quick Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Store Overview & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time summary of sales, orders, banner slides, and catalog inventory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('banners')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Configure Banner</span>
          </button>

          <button
            onClick={() => onNavigateTab('products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => onNavigateTab('categories')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FolderTree className="w-4 h-4 text-slate-500" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{orders.length} orders total</span>
            </div>
          </div>
        </div>

        {/* Total Orders & In-Crafting */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Orders</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {orders.length}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
              <span className="text-amber-600 font-semibold">{pendingOrders.length} pending</span>
              <span>•</span>
              <span className="text-emerald-600">{deliveredOrders.length} delivered</span>
            </div>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Products</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {products.length}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Across {categories.length} categories
            </div>
          </div>
        </div>

        {/* Support Inquiries */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Support Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {inquiries.length}
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{pendingInquiries.length} pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner Showcase Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 text-white border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                Homepage Banner Slideshow
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activeBannersCount} Slides Active (4s Auto-Move)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Upload custom horizontal images to display clean on the website homepage without text clutter.
            </p>
          </div>
        </div>

        {/* Thumbnail Preview Strip & Manage Button */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex -space-x-2 overflow-hidden py-1">
            {banners.slice(0, 4).map((b, idx) => (
              <img
                key={b.id || idx}
                src={b.imageUrl}
                alt="Banner preview"
                className="inline-block h-8 w-14 rounded border border-white/20 object-cover"
              />
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('banners')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Configure Banner</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Section: Recent Orders & Support Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500">
                Latest customer purchases and order details
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No orders registered yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="pb-2.5 pr-2">Order ID</th>
                    <th className="pb-2.5 px-2">Customer</th>
                    <th className="pb-2.5 px-2">Items</th>
                    <th className="pb-2.5 px-2">Status</th>
                    <th className="pb-2.5 px-2">Amount</th>
                    <th className="pb-2.5 pl-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((order) => {
                    const statusStyles: Record<string, string> = {
                      'Order Placed': 'bg-blue-50 text-blue-700 border-blue-200',
                      'Stitching': 'bg-amber-50 text-amber-800 border-amber-200',
                      'Dispatched': 'bg-purple-50 text-purple-700 border-purple-200',
                      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    };

                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pr-2">
                          <div className="font-semibold text-slate-900 font-mono">{order.id}</div>
                          <div className="text-[11px] text-slate-400">{order.createdAt}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-slate-900">
                            {order.customerName || order.shippingAddress.street.split(',')[0]}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                            {order.customerEmail || order.shippingAddress.city}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              statusStyles[order.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-semibold text-slate-900">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Support Desk Inquiries */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Support Inquiries
                </h2>
                <p className="text-xs text-slate-500">
                  Pending customer questions
                </p>
              </div>

              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {pendingInquiries.length} Pending
              </span>
            </div>

            {/* Inquiries list */}
            <div className="space-y-2.5">
              {inquiries.slice(0, 3).map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => onSelectInquiry(inquiry)}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{inquiry.name}</span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        inquiry.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : inquiry.status === 'Replied'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-blue-700 truncate">
                    {inquiry.subject}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {inquiry.message}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>{inquiry.createdAt}</span>
                    <span className="font-medium text-blue-600 flex items-center gap-0.5">
                      Reply <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('support')}
            className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            <Mail className="w-4 h-4 text-slate-600" />
            <span>Open Support Desk</span>
          </button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Categories
            </h2>
            <p className="text-xs text-slate-500">
              Catalog categories and item distribution
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('categories')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryCounts.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateTab('categories')}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-white transition-all cursor-pointer text-center space-y-2 group"
            >
              <div className="w-12 h-12 rounded-lg mx-auto overflow-hidden bg-slate-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="font-semibold text-xs text-slate-900 line-clamp-1">{cat.name}</div>
              <div className="text-[11px] text-slate-500 font-medium">
                {cat.productCount} Product{cat.productCount !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
