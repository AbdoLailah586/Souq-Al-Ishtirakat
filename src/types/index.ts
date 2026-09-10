export type CategoryId = 
  | 'ai' 
  | 'design' 
  | 'video' 
  | 'entertainment' 
  | 'productivity' 
  | 'marketing';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  englishName: string;
  icon: string;
  description: string;
  color: string;
  badgeCount?: number;
}

export interface ServiceVariant {
  id: string;
  code: string;
  duration: string;
  originalPrice?: number;
  price: number;
  isPopular?: boolean;
  note?: string;
}

export interface Service {
  id: string;
  name: string;
  englishName?: string;
  category: CategoryId;
  slug: string;
  iconName: string;
  badge?: string;
  featured?: boolean;
  shortDescription: string;
  features: string[];
  note?: string;
  executionNote?: string;
  variants: ServiceVariant[];
}

export interface Bundle {
  id: string;
  code: string;
  name: string;
  components: string;
  componentsList: string[];
  originalPrice: number;
  price: number;
  savings: number;
  badge?: string;
  description: string;
  features: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  balance: number;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  method: 'instapay' | 'vodafone_cash' | 'internal';
  senderPhone?: string;
  receiptImage?: string;
  referenceNumber?: string;
  description: string;
  createdAt: string;
  adminNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  itemType: 'service' | 'bundle';
  itemId: string;
  itemName: string;
  variantDuration?: string;
  variantCode?: string;
  price: number;
  status: 'processing' | 'delivered' | 'cancelled';
  deliveryDetails?: {
    email?: string;
    password?: string;
    licenseKey?: string;
    instructions?: string;
    deliveredAt?: string;
  };
  customerNote?: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  instapayHandle: string;
  instapayName: string;
  vodafoneCashNumber: string;
  whatsappSupportNumber: string;
  bannerText: string;
  showBanner: boolean;
  workingHours: string;
}
