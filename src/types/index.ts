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
  /** تكلفة المورد — بيانات داخلية للإدارة فقط ولا تظهر للعميل إطلاقاً */
  originalPrice?: number;
  /** السعر الأساسي المعلن للعميل */
  price: number;
  /** سعر العرض — لو موجود وأقل من السعر الأساسي يصبح هو السعر الفعلي */
  offerPrice?: number;
  /** اسم العرض الظاهر للعميل (مثال: عرض رمضان) */
  offerLabel?: string;
  /** تاريخ انتهاء العرض بصيغة YYYY-MM-DD — اتركه فارغاً لعرض دائم */
  offerEndsAt?: string;
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
  imageUrl?: string;
  badge?: string;
  featured?: boolean;
  isHidden?: boolean;
  shortDescription: string;
  features: string[];
  note?: string;
  executionNote?: string;
  deliveryTime?: string;
  deliveryFormat?: string;
  warrantyText?: string;
  accountType?: string;
  activationSteps?: string[];
  loginInstructions?: string[];
  externalLink?: { label: string; url: string };
  requiredInputType?: 'phone' | 'email' | 'text';
  requiredInputLabel?: string;
  requiredInputPlaceholder?: string;
  variants: ServiceVariant[];
}

export interface Bundle {
  id: string;
  code: string;
  name: string;
  components: string;
  componentsList: string[];
  /** تكلفة المورد — بيانات داخلية للإدارة فقط ولا تظهر للعميل */
  originalPrice: number;
  /** السعر الأساسي المعلن للعميل */
  price: number;
  /** سعر العرض — لو موجود وأقل من السعر الأساسي يصبح هو السعر الفعلي */
  offerPrice?: number;
  offerLabel?: string;
  offerEndsAt?: string;
  /** التوفير مقارنة بشراء مكونات الباقة منفصلة */
  savings: number;
  badge?: string;
  isHidden?: boolean;
  description: string;
  features: string[];
}

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  balance: number;
  isBlocked?: boolean;
  notes?: string;
  createdAt: string;
  avatarUrl?: string;
  city?: string;
  preferredContact?: 'whatsapp' | 'telegram' | 'phone' | string;
  isProfileComplete?: boolean;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: 'deposit' | 'purchase' | 'refund' | 'adjustment';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  method: 'instapay' | 'vodafone_cash' | 'etisalat_cash' | 'we_pay' | 'orange_cash' | 'internal' | 'admin' | string;
  senderPhone?: string;
  receiptImage?: string;
  referenceNumber?: string;
  description: string;
  createdAt: string;
  adminNote?: string;
}

/**
 * pending   = قيد التأكيد (تم استلام الطلب وبانتظار مراجعة الإدارة)
 * processing = جاري التنفيذ (الإدارة تجهز بيانات الحساب)
 * delivered = تم التسليم
 * cancelled = ملغي (مع استرداد الرصيد)
 */
export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

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
  status: OrderStatus;
  deliveryDetails?: {
    email?: string;
    password?: string;
    licenseKey?: string;
    instructions?: string;
    deliveredAt?: string;
  };
  customerNote?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  instapayHandle: string;
  instapayName: string;
  vodafoneCashNumber: string;
  etisalatCashNumber?: string;
  wePayNumber?: string;
  orangeCashNumber?: string;
  whatsappSupportNumber: string;
  bannerText: string;
  showBanner: boolean;
  workingHours: string;
  welcomeBonus: number;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'قيد التأكيد',
  processing: 'جاري التنفيذ',
  delivered: 'تم التسليم',
  cancelled: 'ملغي'
};
