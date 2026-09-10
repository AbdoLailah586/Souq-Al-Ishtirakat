import { SiteSettings, UserProfile, Order, WalletTransaction } from '../types';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'سوق الاشتراكات',
  siteTagline: 'بازار الاشتراكات الرقمية الأول في مصر والوطن العربي',
  instapayHandle: 'souq-subs@instapay',
  instapayName: 'سوق الاشتراكات (محمد علي)',
  vodafoneCashNumber: '01023456789',
  whatsappSupportNumber: '201023456789',
  bannerText: '⚡ تسليم فوري لحسابات ChatGPT Plus و Canva Pro وضمان ذهبي كامل طوال فترة الاشتراك!',
  showBanner: true,
  workingHours: 'خدمة العملاء والتسليم: يومياً من 10 صباحاً إلى 2 صباحاً بتوقيت القاهرة'
};

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-demo-customer',
    name: 'عبدالله الشناوي',
    email: 'abdullah@client.com',
    phone: '01012345678',
    role: 'customer',
    balance: 850,
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'user-demo-admin',
    name: 'مدير النظام (Admin)',
    email: 'admin@souq-subs.com',
    phone: '01099887766',
    role: 'admin',
    balance: 50000,
    createdAt: '2026-09-01T08:00:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SQ-84912',
    userId: 'user-demo-customer',
    userName: 'عبدالله الشناوي',
    userPhone: '01012345678',
    itemType: 'service',
    itemId: 'canva-pro',
    itemName: 'Canva Pro',
    variantDuration: 'سنة',
    variantCode: '10436',
    price: 100,
    status: 'delivered',
    deliveryDetails: {
      email: 'canva-user89@souq-vip.com',
      password: 'VIP-Canva#2026!Pass',
      instructions: 'تم تفعيل الحساب ضمن فريق بريميوم. يمكنك تسجيل الدخول والبدء مباشرة، حفظ مشاريعك في الفريق.',
      deliveredAt: '2026-09-08T14:30:00.000Z'
    },
    createdAt: '2026-09-08T14:15:00.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'SQ-84915',
    userId: 'user-demo-customer',
    userName: 'عبدالله الشناوي',
    userPhone: '01012345678',
    itemType: 'service',
    itemId: 'gemini-pro',
    itemName: 'Gemini Pro (Google AI Pro)',
    variantDuration: '18 شهر',
    variantCode: '10415',
    price: 150,
    status: 'delivered',
    deliveryDetails: {
      email: 'abdullah.work@gmail.com',
      instructions: 'تم ربط اشتراك 5TB على إيميلك الشخصي بنجاح. يرجى مراجعة صفحة Google One لتأكيد السعة.',
      deliveredAt: '2026-09-09T18:00:00.000Z'
    },
    createdAt: '2026-09-09T17:40:00.000Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'SQ-84920',
    userId: 'user-demo-customer',
    userName: 'عبدالله الشناوي',
    userPhone: '01012345678',
    itemType: 'service',
    itemId: 'chatgpt-plus',
    itemName: 'ChatGPT Plus',
    variantDuration: 'شهر واحد',
    variantCode: '10208',
    price: 900,
    status: 'processing',
    customerNote: 'يرجى الإرسال على الواتساب فور التجهيز',
    createdAt: '2026-09-10T04:20:00.000Z'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-201',
    userId: 'user-demo-customer',
    userName: 'عبدالله الشناوي',
    userPhone: '01012345678',
    type: 'deposit',
    amount: 1000,
    status: 'completed',
    method: 'instapay',
    senderPhone: '01012345678',
    referenceNumber: 'INSTA-89218312',
    description: 'شحن رصيد محفظة عبر تطبيق انستاباي',
    createdAt: '2026-09-08T13:00:00.000Z'
  },
  {
    id: 'tx-202',
    userId: 'user-demo-customer',
    userName: 'عبدالله الشناوي',
    userPhone: '01012345678',
    type: 'purchase',
    amount: 100,
    status: 'completed',
    method: 'internal',
    description: 'شراء Canva Pro (سنة كاملة)',
    createdAt: '2026-09-08T14:15:00.000Z'
  },
  {
    id: 'tx-203',
    userId: 'user-demo-customer',
    userName: 'عبدالله الشناوي',
    userPhone: '01012345678',
    type: 'deposit',
    amount: 500,
    status: 'pending',
    method: 'vodafone_cash',
    senderPhone: '01012345678',
    description: 'طلب شحن رصيد عبر فودافون كاش (بانتظار تأكيد الإيصال)',
    createdAt: '2026-09-10T05:00:00.000Z'
  }
];
