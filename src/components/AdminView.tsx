import React, { useState } from 'react';
import {
  AdminTab,
  CategoryItem,
  Product,
  Order,
  CustomerUser,
  CustomerInquiry,
  OrderStatus,
  UserProfile,
  BannerSlide,
} from '../types';
import { isAdminUser } from '../data/adminData';
import { DEFAULT_BANNER_SLIDES } from '../data/products';
import { NotFoundView } from './NotFoundView';
import { AdminDashboardOverview } from './admin/AdminDashboardOverview';
import { AdminCategoryManager } from './admin/AdminCategoryManager';
import { AdminProductManager } from './admin/AdminProductManager';
import { AdminUsersManager } from './admin/AdminUsersManager';
import { AdminOrdersManager } from './admin/AdminOrdersManager';
import { AdminSupportDesk } from './admin/AdminSupportDesk';
import { AdminBannerManager } from './admin/AdminBannerManager';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Users,
  ShoppingBag,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminViewProps {
  userProfile?: UserProfile | null;
  currentUserEmail?: string | null;
  onAdminLogin?: (email: string) => void;
  onAdminLogout?: () => void;
  onReturnToStore?: () => void;
  onNavigateToStorefront?: () => void;
  onNavigateToShop?: () => void;
  onOpenAuthModal?: () => void;
  onLoginAsAdmin?: (adminProfile: UserProfile) => void;
  // Dynamic State Pass-Through
  categories: CategoryItem[];
  products: Product[];
  orders: Order[];
  users: CustomerUser[];
  inquiries: CustomerInquiry[];
  banners?: BannerSlide[];
  onSaveBanners?: (updatedBanners: BannerSlide[]) => void;
  // Category Handlers
  onCreateCategory: (category: CategoryItem) => void;
  onUpdateCategory: (category: CategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
  // Product Handlers
  onCreateProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onSelectProductPreview?: (product: Product) => void;
  // Order Handlers
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateOrderDetails?: (updatedOrder: Order) => void;
  onUpdateOrderTracking?: (orderId: string, trackingNumber: string, courierName: string, estimatedDelivery?: string) => void;
  // User Handlers
  onAddUser?: (user: CustomerUser) => void;
  onUpdateUserStatus?: (userId: string, status: 'Active' | 'Suspended') => void;
  // Support Handlers
  onReplyInquiry: (inquiryId: string, replyText: string, adminName?: string) => void;
  onDeleteInquiry?: (inquiryId: string) => void;
  onUpdateInquiryStatus?: (inquiryId: string, status: 'Pending' | 'Replied' | 'Resolved') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  userProfile,
  currentUserEmail,
  onAdminLogin,
  onAdminLogout,
  onReturnToStore,
  onNavigateToStorefront,
  onNavigateToShop,
  onLoginAsAdmin,
  categories,
  products,
  orders,
  users,
  inquiries,
  banners = DEFAULT_BANNER_SLIDES,
  onSaveBanners = () => {},
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onSelectProductPreview,
  onUpdateOrderStatus,
  onUpdateOrderDetails,
  onUpdateOrderTracking,
  onAddUser,
  onUpdateUserStatus,
  onReplyInquiry,
  onDeleteInquiry,
  onUpdateInquiryStatus,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [selectedOrderForInspector, setSelectedOrderForInspector] = useState<Order | null>(null);
  const [selectedInquiryForInspector, setSelectedInquiryForInspector] = useState<CustomerInquiry | null>(null);

  const effectiveEmail = userProfile?.email || currentUserEmail;
  const isAuthorized = isAdminUser(effectiveEmail);

  // If unauthorized, render standard 404 Not Found
  if (!isAuthorized) {
    return (
      <NotFoundView
        onNavigateHome={() => {
          if (onNavigateToStorefront) onNavigateToStorefront();
          else if (onReturnToStore) onReturnToStore();
        }}
        onNavigateShop={() => {
          if (onNavigateToShop) onNavigateToShop();
          else if (onNavigateToStorefront) onNavigateToStorefront();
          else if (onReturnToStore) onReturnToStore();
        }}
      />
    );
  }

  const handleInspectOrderFromDashboard = (order: Order) => {
    setSelectedOrderForInspector(order);
    setActiveAdminTab('orders');
  };

  const handleInspectInquiryFromDashboard = (inquiry: CustomerInquiry) => {
    setSelectedInquiryForInspector(inquiry);
    setActiveAdminTab('support');
  };

  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'Pending').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Order Placed' || o.status === 'Stitching').length;

  const NAV_ITEMS: { tab: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { tab: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
    { tab: 'banners', label: 'Banner Slides', icon: ImageIcon },
    { tab: 'categories', label: 'Categories', icon: FolderTree },
    { tab: 'products', label: 'Product Catalog', icon: Package },
    { tab: 'users', label: 'Customer Users', icon: Users },
    { tab: 'orders', label: 'Orders & Transactions', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { tab: 'support', label: 'Customer Support Desk', icon: MessageSquare, badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Top Admin Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight text-slate-900">
              AL SUMORA
            </span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Admin
            </span>
          </div>

          {/* Current Admin Email & Storefront Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium text-xs">{effectiveEmail}</span>
            </div>

            <button
              onClick={() => {
                if (onNavigateToStorefront) onNavigateToStorefront();
                else if (onReturnToStore) onReturnToStore();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Storefront</span>
            </button>

            <button
              onClick={() => {
                if (onAdminLogout) onAdminLogout();
                else if (onNavigateToStorefront) onNavigateToStorefront();
              }}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer border border-slate-300 hover:border-red-300"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveAdminTab(item.tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeAdminTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeAdminTab === 'overview' && (
            <AdminDashboardOverview
              categories={categories}
              products={products}
              orders={orders}
              users={users}
              inquiries={inquiries}
              banners={banners}
              onNavigateTab={(tab) => setActiveAdminTab(tab)}
              onSelectOrder={handleInspectOrderFromDashboard}
              onSelectInquiry={handleInspectInquiryFromDashboard}
            />
          )}

          {activeAdminTab === 'banners' && (
            <AdminBannerManager
              banners={banners}
              onSaveBanners={onSaveBanners}
            />
          )}

          {activeAdminTab === 'categories' && (
            <AdminCategoryManager
              categories={categories}
              products={products}
              onCreateCategory={onCreateCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}

          {activeAdminTab === 'products' && (
            <AdminProductManager
              products={products}
              categories={categories}
              onCreateProduct={onCreateProduct}
              onUpdateProduct={onUpdateProduct}
              onDeleteProduct={onDeleteProduct}
              onSelectProductPreview={onSelectProductPreview}
            />
          )}

          {activeAdminTab === 'users' && (
            <AdminUsersManager
              users={users}
              orders={orders}
              onSelectOrder={handleInspectOrderFromDashboard}
              onAddUser={onAddUser}
            />
          )}

          {activeAdminTab === 'orders' && (
            <AdminOrdersManager
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onUpdateOrderDetails={onUpdateOrderDetails || ((ord) => onUpdateOrderStatus(ord.id, ord.status))}
              initialSelectedOrder={selectedOrderForInspector}
            />
          )}

          {activeAdminTab === 'support' && (
            <AdminSupportDesk
              inquiries={inquiries}
              onReplyInquiry={(id, reply, adminName) => onReplyInquiry(id, reply, adminName || 'Asfaq Silmi')}
              onUpdateInquiryStatus={onUpdateInquiryStatus || (() => {})}
              initialSelectedInquiry={selectedInquiryForInspector}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};
