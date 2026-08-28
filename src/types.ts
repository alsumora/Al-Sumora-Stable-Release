export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
  category: string;
  image: string;
  itemCount?: string;
  tagline?: string;
  description?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  details: string[];
  images: string[];
  colors: ProductColor[];
  boutiques: string[]; // e.g. ['paris', 'milan', 'london']
  isFeatured?: boolean;
  customizable?: boolean;
  stock?: number;
}

export interface MonogramConfig {
  initials: string; // Name / text to be engraved
  description?: string; // Custom description and requirements
  referenceImages?: string[]; // Reference images uploaded by the customer (data URLs or file names)
  referenceImageNames?: string[];
  finish?: 'blind' | 'gold' | 'silver' | 'debossed';
  placement?: string;
  logoFileName?: string;
  customNotes?: string;
  canvasSnapshot?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
  monogram?: MonogramConfig;
}

export interface Boutique {
  id: string;
  name: string;
  city: string;
  address: string;
  district: string;
  postalCode: string;
  phone: string;
  email: string;
  hours: string;
  mapImage: string;
  coordinates: { lat: number; lng: number };
}

export interface Review {
  id: string;
  clientName: string;
  location: string;
  rating: number;
  quote: string;
  productName: string;
  verified: boolean;
}

export type ActiveTab = 'home' | 'shop' | 'customization' | 'wishlist' | 'about' | 'contact' | 'checkout' | 'orders' | 'settings' | 'admin';

export type AdminTab = 'overview' | 'banners' | 'categories' | 'products' | 'users' | 'orders' | 'support';

export interface BannerSlide {
  id: string;
  imageUrl: string;
  title?: string;
  altText?: string;
  active?: boolean;
  order?: number;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  billingAddress: UserAddress;
  shippingAddress: UserAddress;
}

export interface CustomerUser extends UserProfile {
  joinedDate?: string;
  role?: 'admin' | 'customer';
  ordersCount?: number;
  totalSpent?: number;
  status?: 'Active' | 'VIP' | 'Inactive';
}

export type OrderStatus =
  | 'Order Placed'
  | 'Stitching'
  | 'Dispatched'
  | 'Delivered';

export interface TrackingStep {
  label: OrderStatus;
  date: string;
  completed: boolean;
  current?: boolean;
  description: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
  courierName: string;
  shippingAddress: UserAddress;
  paymentMethod: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Refunded';
  transactionId?: string;
  giftNote?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  trackingSteps: TrackingStep[];
  adminNotes?: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Pending' | 'Replied' | 'Resolved';
  replyNotes?: string;
  repliedAt?: string;
  adminRepliedBy?: string;
  productRef?: string;
}

