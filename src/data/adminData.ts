import { CustomerUser, CustomerInquiry, Order, UserProfile } from '../types';
import { PRODUCTS } from './products';

// Retrieve authorized administrator emails (configured via VITE_ADMIN_EMAIL or default user email)
export const getAdminEmails = (): string[] => {
  const envEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.toLowerCase().trim();
  const defaultAdmins = ['asfaqsilmi999@gmail.com', 'admin@alsumora.com'];
  if (envEmail && !defaultAdmins.includes(envEmail)) {
    return [envEmail, ...defaultAdmins];
  }
  return defaultAdmins;
};

export const isAdminUser = (userOrEmail: UserProfile | string | null | undefined): boolean => {
  if (!userOrEmail) return false;
  const email = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.email;
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase().trim());
};

export const ADMIN_DEFAULT_PROFILE: CustomerUser = {
  id: 'usr_admin_001',
  name: 'Asfaq Silmi (Atelier Administrator)',
  email: 'asfaqsilmi999@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  phone: '+91 98765 00999',
  role: 'admin',
  status: 'VIP',
  joinedDate: 'Jan 15, 2024',
  ordersCount: 4,
  totalSpent: 86496,
  billingAddress: {
    street: 'Al Sumora Leather Atelier HQ, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
  },
  shippingAddress: {
    street: 'Al Sumora Leather Atelier HQ, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
  },
};

export const INITIAL_USERS: CustomerUser[] = [
  ADMIN_DEFAULT_PROFILE,
  {
    id: 'usr_google_8912',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98200 12345',
    role: 'customer',
    status: 'VIP',
    joinedDate: 'Mar 12, 2025',
    ordersCount: 3,
    totalSpent: 59997,
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
  },
  {
    id: 'usr_google_4321',
    name: 'Priya Patel',
    email: 'priya.patel@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98111 54321',
    role: 'customer',
    status: 'Active',
    joinedDate: 'Apr 02, 2025',
    ordersCount: 2,
    totalSpent: 34998,
    billingAddress: {
      street: '12 Prestige Golfshire, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    shippingAddress: {
      street: '12 Prestige Golfshire, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
  },
  {
    id: 'usr_google_7761',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    phone: '+91 97654 11223',
    role: 'customer',
    status: 'Active',
    joinedDate: 'May 19, 2025',
    ordersCount: 1,
    totalSpent: 18499,
    billingAddress: {
      street: '74 Golf Links, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110003',
      country: 'India',
    },
    shippingAddress: {
      street: '74 Golf Links, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110003',
      country: 'India',
    },
  },
  {
    id: 'usr_google_9024',
    name: 'Vikram Singhania',
    email: 'vikram.singhania@corp.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    phone: '+91 99000 88776',
    role: 'customer',
    status: 'VIP',
    joinedDate: 'Jun 10, 2025',
    ordersCount: 4,
    totalSpent: 82996,
    billingAddress: {
      street: 'Tower C, The Imperial, Tardeo',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400034',
      country: 'India',
    },
    shippingAddress: {
      street: 'Tower C, The Imperial, Tardeo',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400034',
      country: 'India',
    },
  },
  {
    id: 'usr_google_3310',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98450 33112',
    role: 'customer',
    status: 'Active',
    joinedDate: 'Jul 21, 2026',
    ordersCount: 1,
    totalSpent: 7999,
    billingAddress: {
      street: 'Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
    },
    shippingAddress: {
      street: 'Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
    },
  },
];

export const INITIAL_CUSTOMER_USERS = INITIAL_USERS;

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'INQ-7821',
    name: 'Kabir Oberoi',
    email: 'kabir.oberoi@luxconsult.in',
    phone: '+91 98199 44321',
    subject: 'Corporate Bespoke Briefcases Order (25 units)',
    message: 'Hello Al Sumora atelier, we are looking to commission 25 units of The Sovereign Executive Briefcase in hand-burnished Tobacco Tan with custom debossed corporate crest and executive initials for our partner summit. Could you provide timelines and bulk tier quotes?',
    createdAt: 'Aug 26, 2026 • 04:15 PM',
    status: 'Pending',
    productRef: 'briefcase-executive-sovereign',
  },
  {
    id: 'INQ-7819',
    name: 'Devika Mehra',
    email: 'devika.mehra@gmail.com',
    phone: '+91 99201 55678',
    subject: 'Custom Sizing & Leather Monogram for Cafe Racer Jacket',
    message: 'Hi team, I want to order the Heritage Cafe Racer jacket in Midnight Black (Size 42 with +1 inch sleeve extension). Can you also do a 24k gold foil stamped monogram on the inner breast pocket flap? Please confirm if feasible.',
    createdAt: 'Aug 25, 2026 • 11:30 AM',
    status: 'Replied',
    replyNotes: 'Replied via mail confirming custom sleeve measurement pattern at no extra cost, and verified gold foil placement on inner pocket.',
    repliedAt: 'Aug 25, 2026 • 02:10 PM',
    adminRepliedBy: 'Asfaq Silmi (Master Atelier)',
    productRef: 'jacket-heritage-cafe-racer',
  },
  {
    id: 'INQ-7810',
    name: 'Tanya Sengupta',
    email: 'tanya.sengupta@artarch.com',
    phone: '+91 98300 77112',
    subject: 'Vegetable Tannage Care & Conditioning Guide',
    message: 'Greetings! I recently purchased the Voyager Full-Grain Duffel. What is the recommended beeswax / mink oil conditioner for monsoon protection?',
    createdAt: 'Aug 22, 2026 • 09:45 AM',
    status: 'Resolved',
    replyNotes: 'Sent Al Sumora organic beeswax balm recommendation and leather care brochure via email.',
    repliedAt: 'Aug 22, 2026 • 11:00 AM',
    adminRepliedBy: 'Customer Support Desk',
    productRef: 'bag-voyager-duffel',
  },
  {
    id: 'INQ-7804',
    name: 'Siddharth Rao',
    email: 'siddharth.rao@techvest.co',
    phone: '+91 98401 22334',
    subject: 'Bridal Gift Set with Family Monogram',
    message: 'Hi, I need a matching bespoke set: The Continental Travel Wallet and The Artisan Bridle Belt in English Chestnut with interlocking initials "S & M" in debossed blind stamp. Is it possible to rush delivery by next Friday?',
    createdAt: 'Aug 20, 2026 • 01:20 PM',
    status: 'Pending',
    productRef: 'wallet-continental-zip',
  },
];

export const INITIAL_CUSTOMER_INQUIRIES = INITIAL_INQUIRIES;

export const INITIAL_ADMIN_ORDERS: Order[] = [
  {
    id: 'ALS-89412',
    createdAt: 'Aug 25, 2026 • 09:15 AM',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@gmail.com',
    customerPhone: '+91 98200 12345',
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
    subtotal: 24999,
    shippingFee: 0,
    total: 24999,
    status: 'Stitching',
    paymentMethod: 'UPI / Google Pay',
    paymentStatus: 'Paid',
    transactionId: 'TXN_UPI_9812401824',
    trackingNumber: 'BLUEDART-981240-IN',
    estimatedDelivery: 'Wed, Sep 02, 2026',
    courierName: 'BlueDart Express Air',
    shippingAddress: {
      street: 'Flat 402, Sterling Palms, BKC Main Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400051',
      country: 'India',
    },
    adminNotes: 'Artisan assigned: Master Salim. Gold foil hot-stamp engraved on right breast pocket interior.',
    trackingSteps: [
      {
        label: 'Order Placed',
        date: 'Aug 25 • 09:15 AM',
        completed: true,
        description: 'Order confirmed and registered in atelier system. Payment verified.',
      },
      {
        label: 'Stitching',
        date: 'Aug 26 • 02:40 PM',
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
  },
  {
    id: 'ALS-89410',
    createdAt: 'Aug 24, 2026 • 03:30 PM',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@outlook.com',
    customerPhone: '+91 98111 54321',
    items: [
      {
        product: PRODUCTS[2] || PRODUCTS[0],
        selectedColor: PRODUCTS[2]?.colors[0] || PRODUCTS[0].colors[0],
        quantity: 1,
        monogram: {
          initials: 'PP',
          placement: 'Front Flap Center',
          finish: 'blind',
        },
      },
    ],
    subtotal: 18499,
    shippingFee: 0,
    total: 18499,
    status: 'Dispatched',
    paymentMethod: 'Credit Card (HDFC Visa Signature)',
    paymentStatus: 'Paid',
    transactionId: 'TXN_CC_7719283410',
    trackingNumber: 'DHL-EXPRESS-441290-IN',
    estimatedDelivery: 'Sat, Aug 29, 2026',
    courierName: 'DHL Express Secure Logistics',
    shippingAddress: {
      street: '12 Prestige Golfshire, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    adminNotes: 'Packaged in signature velvet-lined wooden chest.',
    trackingSteps: [
      {
        label: 'Order Placed',
        date: 'Aug 24 • 03:30 PM',
        completed: true,
        description: 'Order confirmed and registered in atelier system.',
      },
      {
        label: 'Stitching',
        date: 'Aug 25 • 10:00 AM',
        completed: true,
        description: 'Precision saddle stitch finished and inspected.',
      },
      {
        label: 'Dispatched',
        date: 'Aug 26 • 06:15 PM',
        completed: false,
        current: true,
        description: 'Handed over to DHL Express Courier Hub.',
      },
      {
        label: 'Delivered',
        date: 'Pending',
        completed: false,
        description: 'Out for delivery to Bengaluru address.',
      },
    ],
  },
  {
    id: 'ALS-89398',
    createdAt: 'Aug 21, 2026 • 11:20 AM',
    customerName: 'Vikram Singhania',
    customerEmail: 'vikram.singhania@corp.in',
    customerPhone: '+91 99000 88776',
    items: [
      {
        product: PRODUCTS[1] || PRODUCTS[0],
        selectedColor: PRODUCTS[1]?.colors[0] || PRODUCTS[0].colors[0],
        quantity: 1,
      },
      {
        product: PRODUCTS[4] || PRODUCTS[0],
        selectedColor: PRODUCTS[4]?.colors[0] || PRODUCTS[0].colors[0],
        quantity: 1,
        monogram: {
          initials: 'VS',
          placement: 'Corner',
          finish: 'gold',
        },
      },
    ],
    subtotal: 19998,
    shippingFee: 0,
    total: 19998,
    status: 'Delivered',
    paymentMethod: 'Net Banking (ICICI Corporate)',
    paymentStatus: 'Paid',
    transactionId: 'TXN_NB_4401928374',
    trackingNumber: 'DELHIVERY-5591823-IN',
    estimatedDelivery: 'Sun, Aug 23, 2026',
    courierName: 'Delhivery Surface Premium',
    shippingAddress: {
      street: 'Tower C, The Imperial, Tardeo',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400034',
      country: 'India',
    },
    adminNotes: 'Delivered successfully. Customer verified signature.',
    trackingSteps: [
      {
        label: 'Order Placed',
        date: 'Aug 21 • 11:20 AM',
        completed: true,
        description: 'Order registered and payment received.',
      },
      {
        label: 'Stitching',
        date: 'Aug 21 • 03:00 PM',
        completed: true,
        description: 'Assembled in footwear atelier.',
      },
      {
        label: 'Dispatched',
        date: 'Aug 22 • 09:00 AM',
        completed: true,
        description: 'In transit with Delhivery Air.',
      },
      {
        label: 'Delivered',
        date: 'Aug 23 • 01:45 PM',
        completed: true,
        current: true,
        description: 'Delivered to Tardeo address. Signed by Vikram S.',
      },
    ],
  },
];
