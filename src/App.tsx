import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Category,
  Product,
  ProductColor,
  MonogramConfig,
  CartItem,
  UserProfile,
  Order,
  CategoryItem,
  CustomerUser,
  CustomerInquiry,
  BannerSlide,
} from './types';
import { PRODUCTS, PRODUCT_CATEGORIES, DEFAULT_BANNER_SLIDES } from './data/products';
import { INITIAL_CUSTOMER_USERS, INITIAL_CUSTOMER_INQUIRIES } from './data/adminData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { CheckoutView } from './components/CheckoutView';
import { SettingsView } from './components/SettingsView';
import { OrdersView } from './components/OrdersView';
import { WishlistView } from './components/WishlistView';
import { CustomizationInfoView } from './components/CustomizationInfoView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { LegalModal } from './components/LegalModal';
import { AuthModal } from './components/AuthModal';
import { AdminView } from './components/AdminView';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_USER: UserProfile = {
  id: 'usr_google_8912',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  phone: '+91 98200 12345',
  billingAddress: {
    street: 'Flat 402, Sterling Palms, BKC Main Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    country: 'India',
  },
  shippingAddress: {
    street: 'Flat 402, Sterling Palms, BKC Main Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    country: 'India',
  },
};

const DEFAULT_SAMPLE_ORDER: Order = {
  id: 'ALS-89412',
  createdAt: 'Aug 04, 2026',
  items: [
    {
      product: PRODUCTS[0],
      selectedColor: PRODUCTS[0].colors[0],
      quantity: 1,
      monogram: {
        initials: 'AS',
        placement: 'Bottom Right Corner',
        finish: 'gold',
      },
    },
  ],
  subtotal: PRODUCTS[0].price,
  shippingFee: 0,
  total: PRODUCTS[0].price,
  status: 'Stitching',
  trackingNumber: 'BLUEDART-981240-IN',
  estimatedDelivery: 'Wed, Aug 12',
  courierName: 'BlueDart Express Air',
  shippingAddress: {
    street: 'Flat 402, Sterling Palms, BKC Main Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    country: 'India',
  },
  paymentMethod: 'Google Pay (Aarav Sharma)',
  trackingSteps: [
    {
      label: 'Order Placed',
      date: 'Aug 04 • 09:15 AM',
      completed: true,
      description: 'Order confirmed and registered in atelier system.',
    },
    {
      label: 'Stitching',
      date: 'Aug 06 • 02:40 PM',
      completed: false,
      current: true,
      description: 'Master leather artisan hand-stitching with wax-dipped linen thread.',
    },
    {
      label: 'Dispatched',
      date: 'Pending',
      completed: false,
      description: 'Insured parcel dispatched with tracking.',
    },
    {
      label: 'Delivered',
      date: 'Pending',
      completed: false,
      description: 'Delivered safely to doorstep destination.',
    },
  ],
};

export default function App() {
  // Determine initial tab from URL path or hash
  const getInitialTab = (): ActiveTab => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        return 'admin';
      }
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dynamic Catalog: Categories with LocalStorage persistence
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('alsumora_categories');
      return saved ? JSON.parse(saved) : PRODUCT_CATEGORIES;
    } catch {
      return PRODUCT_CATEGORIES;
    }
  });

  // Dynamic Homepage Banners with LocalStorage persistence
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('alsumora_banner_slides');
      return saved ? JSON.parse(saved) : DEFAULT_BANNER_SLIDES;
    } catch {
      return DEFAULT_BANNER_SLIDES;
    }
  });

  // Dynamic Catalog: Products with LocalStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('alsumora_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Admin Data: Customer directory with LocalStorage persistence
  const [customerUsers, setCustomerUsers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem('alsumora_admin_users');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_USERS;
    } catch {
      return INITIAL_CUSTOMER_USERS;
    }
  });

  // Admin Data: Support inquiries with LocalStorage persistence
  const [customerInquiries, setCustomerInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('alsumora_customer_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_INQUIRIES;
    } catch {
      return INITIAL_CUSTOMER_INQUIRIES;
    }
  });

  // User Profile & Orders State with LocalStorage Persistence
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('alsumora_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('alsumora_orders');
      return saved ? JSON.parse(saved) : [DEFAULT_SAMPLE_ORDER];
    } catch {
      return [DEFAULT_SAMPLE_ORDER];
    }
  });

  // Wishlist state with LocalStorage persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alsumora_wishlist');
      return saved ? JSON.parse(saved) : [PRODUCTS[1]?.id || 'shoes-welted-derby'];
    } catch {
      return [PRODUCTS[1]?.id || 'shoes-welted-derby'];
    }
  });

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | null>(null);

  // Sync URL with activeTab for /admin route
  useEffect(() => {
    if (activeTab === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({ tab: 'admin' }, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState({ tab: activeTab }, '', '/');
      }
    }
  }, [activeTab]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') {
        setActiveTab('admin');
      } else if (activeTab === 'admin') {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('alsumora_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('alsumora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('alsumora_admin_users', JSON.stringify(customerUsers));
  }, [customerUsers]);

  useEffect(() => {
    localStorage.setItem('alsumora_customer_inquiries', JSON.stringify(customerInquiries));
  }, [customerInquiries]);

  // Global scroll lock when any overlay/modal/drawer is open
  useEffect(() => {
    const isAnyOverlayActive = Boolean(
      selectedProduct ||
      isCartOpen ||
      isSearchOpen ||
      isAuthModalOpen ||
      legalModalTab !== null
    );

    if (isAnyOverlayActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct, isCartOpen, isSearchOpen, isAuthModalOpen, legalModalTab]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('alsumora_user', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('alsumora_user');
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('alsumora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('alsumora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Wishlist toggle handler
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedColor: ProductColor,
    quantity: number,
    monogram?: MonogramConfig
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === selectedColor.name &&
          JSON.stringify(item.monogram) === JSON.stringify(monogram)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedColor, quantity, monogram }];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenCustomization = () => {
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =================== ADMIN CRUD HANDLERS ===================

  // Category CRUD
  const handleCreateCategory = (category: CategoryItem) => {
    setCategories((prev) => [...prev, category]);
  };

  // Banner Slides CRUD
  const handleSaveBanners = (updatedBanners: BannerSlide[]) => {
    setBanners(updatedBanners);
    try {
      localStorage.setItem('alsumora_banner_slides', JSON.stringify(updatedBanners));
    } catch (err) {
      console.error('Failed to persist banners:', err);
    }
  };

  const handleUpdateCategory = (updated: CategoryItem) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  // Product CRUD
  const handleCreateProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  // Order status & tracking updates
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedSteps = (ord.trackingSteps || []).map((step) => {
          if (step.label.toLowerCase() === status.toLowerCase()) {
            return { ...step, completed: true, current: true, date: 'Just updated' };
          }
          return step;
        });
        return { ...ord, status, trackingSteps: updatedSteps };
      })
    );
  };

  const handleUpdateOrderTracking = (
    orderId: string,
    trackingNumber: string,
    courierName: string,
    estimatedDelivery?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          trackingNumber,
          courierName,
          estimatedDelivery: estimatedDelivery || ord.estimatedDelivery,
        };
      })
    );
  };

  // Support desk inquiries
  const handleReplyInquiry = (inquiryId: string, replyText: string) => {
    setCustomerInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id !== inquiryId) return inq;
        return {
          ...inq,
          status: 'Replied',
          repliedAt: 'Just now',
          adminReply: replyText,
        };
      })
    );
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    setCustomerInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
  };

  const handleSubmitInquiry = (inquiry: CustomerInquiry) => {
    setCustomerInquiries((prev) => [inquiry, ...prev]);
  };

  // Customer users management
  const handleAddUser = (user: CustomerUser) => {
    setCustomerUsers((prev) => [user, ...prev]);
  };

  const handleUpdateUserStatus = (userId: string, status: 'Active' | 'Suspended') => {
    setCustomerUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4] text-[#1b1c19] font-body selection:bg-[#fdc087] selection:text-[#090100]">
      {/* Header (always accessible, with link to Admin if authorized) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectCategory={handleSelectCategoryFromHome}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        setIsCartOpen={setIsCartOpen}
        setIsSearchOpen={setIsSearchOpen}
        setIsBespokeOpen={handleOpenCustomization}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => setUserProfile(null)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="w-full"
          >
            {activeTab === 'home' && (
              <HomeView
                setActiveTab={setActiveTab}
                onSelectProduct={setSelectedProduct}
                onQuickAddToCart={(prod, color) => handleAddToCart(prod, color, 1)}
                setIsBespokeOpen={handleOpenCustomization}
                onSelectCategory={handleSelectCategoryFromHome}
                wishlistProductIds={wishlist}
                onToggleWishlist={handleToggleWishlist}
                productsList={products}
                categoriesList={categories}
                bannersList={banners}
              />
            )}

            {activeTab === 'shop' && (
              <ShopView
                initialCategory={selectedCategory}
                onSelectProduct={setSelectedProduct}
                onQuickAddToCart={(prod, color) => handleAddToCart(prod, color, 1)}
                setIsBespokeOpen={handleOpenCustomization}
                wishlistProductIds={wishlist}
                onToggleWishlist={handleToggleWishlist}
                productsList={products}
                categoriesList={categories}
              />
            )}

            {activeTab === 'wishlist' && (
              <WishlistView
                wishlistProductIds={wishlist}
                allProducts={products}
                onToggleWishlist={handleToggleWishlist}
                onClearWishlist={handleClearWishlist}
                onSelectProduct={setSelectedProduct}
                onQuickAddToCart={(prod, color) => handleAddToCart(prod, color, 1)}
                onNavigateToShop={() => setActiveTab('shop')}
              />
            )}

            {activeTab === 'customization' && (
              <CustomizationInfoView
                onNavigateToShop={() => {
                  setActiveTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'about' && <AboutView />}

            {activeTab === 'contact' && (
              <ContactView onSubmitInquiry={handleSubmitInquiry} />
            )}

            {activeTab === 'checkout' && (
              <CheckoutView
                cartItems={cartItems}
                userProfile={userProfile}
                onPlaceOrder={handlePlaceOrder}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onNavigateToShop={() => setActiveTab('shop')}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersView
                userProfile={userProfile}
                orders={orders}
                onNavigateToShop={() => setActiveTab('shop')}
                onNavigateToSettings={() => setActiveTab('settings')}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                userProfile={userProfile}
                onUpdateProfile={(updated) => setUserProfile(updated)}
                onLogout={() => setUserProfile(null)}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onNavigateToOrders={() => setActiveTab('orders')}
                onNavigateToShop={() => setActiveTab('shop')}
              />
            )}

            {/* Admin Panel (/admin) */}
            {activeTab === 'admin' && (
              <AdminView
                userProfile={userProfile}
                categories={categories}
                products={products}
                orders={orders}
                users={customerUsers}
                inquiries={customerInquiries}
                banners={banners}
                onSaveBanners={handleSaveBanners}
                onCreateCategory={handleCreateCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onCreateProduct={handleCreateProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateOrderTracking={handleUpdateOrderTracking}
                onReplyInquiry={handleReplyInquiry}
                onDeleteInquiry={handleDeleteInquiry}
                onAddUser={handleAddUser}
                onUpdateUserStatus={handleUpdateUserStatus}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onNavigateToStorefront={() => setActiveTab('home')}
                onLoginAsAdmin={(adminProf) => setUserProfile(adminProf)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        setIsBespokeOpen={handleOpenCustomization}
        onOpenPrivacy={() => setLegalModalTab('privacy')}
        onOpenTerms={() => setLegalModalTab('terms')}
      />

      {/* Product Detail / Customization Modal */}
      {selectedProduct && (
        <ProductDetailModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onNavigateToCustomizationTerms={() => {
            setSelectedProduct(null);
            setActiveTab('customization');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Slide-out Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        userProfile={userProfile}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onNavigateToCheckout={() => {
          setActiveTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Quick Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        productsList={products}
      />

      {/* Google Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(usr) => setUserProfile(usr)}
      />

      {/* Legal Privacy Policy & Terms Modal */}
      <LegalModal
        isOpen={legalModalTab !== null}
        onClose={() => setLegalModalTab(null)}
        initialTab={legalModalTab || 'privacy'}
      />

      {/* Floating Scroll to Top Direct Button */}
      <ScrollToTopButton />
    </div>
  );
}
