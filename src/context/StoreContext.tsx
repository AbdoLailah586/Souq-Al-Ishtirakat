import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Service, ServiceVariant, Bundle, Order, OrderStatus, WalletTransaction, SiteSettings, CategoryId
} from '../types';
import { supabase, translateError, parseInsufficientFunds } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { DEFAULT_SETTINGS } from '../data/initialData';
import { SERVICES } from '../data/services';
import { BUNDLES } from '../data/bundles';

interface ActionResult { success: boolean; message: string; orderId?: string; }

interface StoreContextType {
  services: Service[];
  bundles: Bundle[];
  orders: Order[];
  transactions: WalletTransaction[];
  settings: SiteSettings;
  isLoadingData: boolean;

  currentTab: string;
  navigate: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  selectedService: Service | null;
  openServiceModal: (service: Service) => void;
  closeServiceModal: () => void;
  isTopUpModalOpen: boolean;
  openTopUpModal: () => void;
  closeTopUpModal: () => void;

  isAuthModalOpen: boolean;
  authModalReason: string | null;
  authModalMode: 'login' | 'register';
  openAuthModal: (reason?: string, mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  refreshAll: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshCatalog: () => Promise<void>;

  purchaseItem: (params: {
    itemType: 'service' | 'bundle';
    itemId: string;
    variantId?: string;
    customerNote?: string;
  }) => Promise<ActionResult>;

  requestTopUp: (params: {
    amount: number;
    method: 'instapay' | 'vodafone_cash';
    senderPhone: string;
    receiptImage?: string;
    referenceNumber?: string;
  }) => Promise<ActionResult>;

  approveTopUp: (transactionId: string) => Promise<ActionResult>;
  rejectTopUp: (transactionId: string, reason?: string) => Promise<ActionResult>;
  deleteTransaction: (transactionId: string) => Promise<ActionResult>;
  adminAddTransaction: (params: {
    userId: string;
    type: 'deposit' | 'refund' | 'adjustment' | 'purchase';
    amount: number;
    description?: string;
    applyToBalance?: boolean;
  }) => Promise<ActionResult>;

  deliverOrder: (orderId: string, delivery: { email?: string; password?: string; licenseKey?: string; instructions?: string }) => Promise<ActionResult>;
  cancelOrder: (orderId: string, refund?: boolean) => Promise<ActionResult>;
  setOrderStatus: (orderId: string, status: OrderStatus) => Promise<ActionResult>;
  updateOrder: (orderId: string, data: Partial<Order>) => Promise<ActionResult>;
  deleteOrder: (orderId: string, refund?: boolean) => Promise<ActionResult>;
  adminCreateOrder: (params: {
    userId: string; itemType: 'service' | 'bundle'; itemId: string; itemName: string;
    variantDuration?: string; variantCode?: string; price: number;
    status: OrderStatus; deductBalance: boolean; adminNote?: string;
  }) => Promise<ActionResult>;

  saveService: (service: Service, isNew: boolean) => Promise<ActionResult>;
  updateService: (serviceId: string, data: Partial<Service>) => Promise<ActionResult>;
  deleteService: (serviceId: string) => Promise<ActionResult>;
  saveBundle: (bundle: Bundle, isNew: boolean) => Promise<ActionResult>;
  updateBundle: (bundleId: string, data: Partial<Bundle>) => Promise<ActionResult>;
  deleteBundle: (bundleId: string) => Promise<ActionResult>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<ActionResult>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const num = (v: unknown) => (v === null || v === undefined || v === '' ? undefined : Number(v));

// ---------- تحويل صفوف قاعدة البيانات إلى أنواع التطبيق ----------
const rowToVariant = (r: any): ServiceVariant => ({
  id: r.id, code: r.code || '', duration: r.duration,
  originalPrice: num(r.original_price), price: Number(r.price),
  offerPrice: num(r.offer_price), offerLabel: r.offer_label || undefined,
  offerEndsAt: r.offer_ends_at || undefined,
  isPopular: !!r.is_popular, note: r.note || undefined
});

const rowToService = (r: any): Service => ({
  id: r.id, name: r.name, englishName: r.english_name || '',
  category: (r.category_id || 'ai') as CategoryId, slug: r.slug,
  iconName: r.icon_name || 'Sparkles', badge: r.badge || undefined,
  featured: !!r.featured, isHidden: !!r.is_hidden,
  shortDescription: r.short_description || '',
  features: Array.isArray(r.features) ? r.features : [],
  note: r.note || undefined, executionNote: r.execution_note || undefined,
  variants: (r.service_variants || [])
    .slice()
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(rowToVariant)
});

const rowToBundle = (r: any): Bundle => ({
  id: r.id, code: r.code || '', name: r.name,
  components: r.components || '',
  componentsList: Array.isArray(r.components_list) ? r.components_list : [],
  originalPrice: Number(r.original_price) || 0, price: Number(r.price),
  offerPrice: num(r.offer_price), offerLabel: r.offer_label || undefined,
  offerEndsAt: r.offer_ends_at || undefined,
  savings: Number(r.savings) || 0, badge: r.badge || undefined,
  isHidden: !!r.is_hidden, description: r.description || '',
  features: Array.isArray(r.features) ? r.features : []
});

const rowToOrder = (r: any): Order => ({
  id: r.id, orderNumber: r.order_number, userId: r.user_id,
  userName: r.profiles?.name || r.user_name || '—',
  userPhone: r.profiles?.phone || r.user_phone || '',
  itemType: r.item_type, itemId: r.item_id || '', itemName: r.item_name,
  variantDuration: r.variant_duration || undefined,
  variantCode: r.variant_code || undefined,
  price: Number(r.price), status: r.status as OrderStatus,
  deliveryDetails: (r.delivery_email || r.delivery_password || r.delivery_license || r.delivery_instructions)
    ? {
        email: r.delivery_email || undefined,
        password: r.delivery_password || undefined,
        licenseKey: r.delivery_license || undefined,
        instructions: r.delivery_instructions || undefined,
        deliveredAt: r.delivered_at || undefined
      }
    : undefined,
  customerNote: r.customer_note || undefined,
  adminNote: r.admin_note || undefined,
  createdAt: r.created_at, updatedAt: r.updated_at
});

const rowToTx = (r: any): WalletTransaction => ({
  id: r.id, userId: r.user_id,
  userName: r.profiles?.name || '—',
  userPhone: r.profiles?.phone || '',
  type: r.type, amount: Number(r.amount), status: r.status, method: r.method,
  senderPhone: r.sender_phone || undefined,
  receiptImage: r.receipt_image || undefined,
  referenceNumber: r.reference_number || undefined,
  description: r.description || '', createdAt: r.created_at,
  adminNote: r.admin_note || undefined
});

const rowToSettings = (r: any): SiteSettings => ({
  siteName: r.site_name, siteTagline: r.site_tagline,
  instapayHandle: r.instapay_handle, instapayName: r.instapay_name,
  vodafoneCashNumber: r.vodafone_cash_number,
  whatsappSupportNumber: r.whatsapp_support_number,
  bannerText: r.banner_text || '', showBanner: !!r.show_banner,
  workingHours: r.working_hours || '', welcomeBonus: Number(r.welcome_bonus) || 0
});

const ok = (message: string): ActionResult => ({ success: true, message });
const fail = (e: any): ActionResult => ({ success: false, message: translateError(e?.message || String(e)) });

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [currentTab, setCurrentTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = useCallback((reason?: string, mode?: 'login' | 'register') => {
    setAuthModalReason(reason || null);
    setAuthModalMode(mode || 'login');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
  }, []);

  // إغلاق نافذة تسجيل الدخول تلقائياً بمجرد تسجيل الدخول بنجاح
  useEffect(() => {
    if (isAuthenticated) {
      setIsAuthModalOpen(false);
      setAuthModalReason(null);
    }
  }, [isAuthenticated]);

  const navigate = useCallback((tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const refreshProfile = () => (window as any).__souqRefreshProfile?.();
  const refreshUsers = () => (window as any).__souqRefreshUsers?.();

  // ================= التحميل =================
  const refreshCatalog = useCallback(async () => {
    try {
      const [svc, bnd, st] = await Promise.all([
        supabase.from('services').select('*, service_variants(*)').order('sort_order'),
        supabase.from('bundles').select('*').order('sort_order'),
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
      ]);
      if (svc.data && svc.data.length > 0) setServices(svc.data.map(rowToService));
      else setServices(SERVICES);
      if (bnd.data && bnd.data.length > 0) setBundles(bnd.data.map(rowToBundle));
      else setBundles(BUNDLES);
      if (st.data) setSettings(rowToSettings(st.data));
    } catch (e) {
      console.error('Failed to load catalog:', e);
      setServices(SERVICES);
      setBundles(BUNDLES);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(name, phone)')
      .order('created_at', { ascending: false });
    if (data) setOrders(data.map(rowToOrder));
  }, []);

  const refreshTransactions = useCallback(async () => {
    const { data } = await supabase
      .from('wallet_transactions')
      .select('*, profiles(name, phone)')
      .order('created_at', { ascending: false });
    if (data) setTransactions(data.map(rowToTx));
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoadingData(true);
    await Promise.all([refreshCatalog(), refreshOrders(), refreshTransactions()]);
    setIsLoadingData(false);
  }, [refreshCatalog, refreshOrders, refreshTransactions]);

  // تحميل الكتالوج فوراً لجميع الزوار (مسجلين أو غير مسجلين)
  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  // تحميل الطلبات والمعاملات الخاصة بالمستخدم فقط عند تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingData(true);
      Promise.all([refreshOrders(), refreshTransactions()]).finally(() => {
        setIsLoadingData(false);
      });
    } else {
      setOrders([]);
      setTransactions([]);
      setIsLoadingData(false);
    }
  }, [isAuthenticated, refreshOrders, refreshTransactions]);

  // تحديث فوري عند أي تغيير في الطلبات أو المحفظة (Realtime)
  useEffect(() => {
    if (!isAuthenticated) return;
    const channel = supabase
      .channel('souq-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => { void refreshOrders(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_transactions' }, () => {
        void refreshTransactions(); refreshProfile();
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [isAuthenticated, refreshOrders, refreshTransactions]);

  const openServiceModal = (s: Service) => setSelectedService(s);
  const closeServiceModal = () => setSelectedService(null);

  const openTopUpModal = useCallback(() => {
    if (!user) {
      openAuthModal('يرجى تسجيل الدخول أو إنشاء حساب جديد لشحن محفظتك وإضافة الرصيد.');
      return;
    }
    setIsTopUpModalOpen(true);
  }, [user, openAuthModal]);

  const closeTopUpModal = () => setIsTopUpModalOpen(false);

  // ================= الشراء =================
  const purchaseItem: StoreContextType['purchaseItem'] = async ({ itemType, itemId, variantId, customerNote }) => {
    if (!user) return { success: false, message: 'يرجى تسجيل الدخول أولاً لإتمام عملية الشراء.' };

    const { data, error } = await supabase.rpc('purchase_item', {
      p_item_type: itemType,
      p_item_id: itemId,
      p_variant_id: variantId || null,
      p_customer_note: customerNote || null
    });

    if (error) {
      const shortage = parseInsufficientFunds(error.message);
      if (shortage) {
        setIsTopUpModalOpen(true);
        return {
          success: false,
          message: `رصيدك الحالي (${shortage.balance} ج.م) غير كافٍ لإتمام الشراء بمبلغ (${shortage.required} ج.م). تم فتح نافذة شحن الرصيد.`
        };
      }
      return fail(error);
    }

    const created = Array.isArray(data) ? data[0] : data;
    await Promise.all([refreshOrders(), refreshTransactions()]);
    refreshProfile();

    return {
      success: true,
      orderId: created?.id,
      message: `تم استلام طلبك بنجاح! تم خصم ${Number(created?.price)} ج.م من رصيدك، وطلبك الآن قيد التأكيد.`
    };
  };

  // ================= شحن المحفظة =================
  const requestTopUp: StoreContextType['requestTopUp'] = async ({ amount, method, senderPhone, receiptImage, referenceNumber }) => {
    if (!user) return { success: false, message: 'يرجى تسجيل الدخول أولاً.' };

    const { error } = await supabase.from('wallet_transactions').insert({
      user_id: user.id, type: 'deposit', amount, status: 'pending', method,
      sender_phone: senderPhone, receipt_image: receiptImage || null,
      reference_number: referenceNumber || null,
      description: `طلب شحن محفظة بمبلغ ${amount} ج.م عبر ${method === 'instapay' ? 'Instapay' : 'فودافون كاش'}`
    });
    if (error) return fail(error);

    await refreshTransactions();
    setIsTopUpModalOpen(false);
    return ok(`تم تسجيل طلب شحن الرصيد بمبلغ ${amount} ج.م بنجاح! سيقوم فريق الإدارة بمراجعته وإضافة الرصيد لمحفظتك خلال دقائق.`);
  };

  const approveTopUp = async (id: string): Promise<ActionResult> => {
    const { error } = await supabase.rpc('approve_topup', { p_tx: id });
    if (error) return fail(error);
    await refreshTransactions(); refreshUsers(); refreshProfile();
    return ok('تم اعتماد الشحن وإضافة الرصيد بنجاح.');
  };

  const rejectTopUp = async (id: string, reason?: string): Promise<ActionResult> => {
    const { error } = await supabase.rpc('reject_topup', { p_tx: id, p_reason: reason || null });
    if (error) return fail(error);
    await refreshTransactions();
    return ok('تم رفض طلب الشحن.');
  };

  const deleteTransaction = async (id: string): Promise<ActionResult> => {
    const { error } = await supabase.from('wallet_transactions').delete().eq('id', id);
    if (error) return fail(error);
    await refreshTransactions();
    return ok('تم حذف العملية من السجل.');
  };

  const adminAddTransaction: StoreContextType['adminAddTransaction'] = async (p) => {
    const delta = p.type === 'purchase' ? -p.amount : p.amount;
    const { error: txErr } = await supabase.from('wallet_transactions').insert({
      user_id: p.userId,
      type: p.type,
      amount: p.amount,
      status: 'completed',
      method: 'admin',
      description: p.description || 'معاملة يدوية من الإدارة'
    });
    if (txErr) return fail(txErr);

    if (p.applyToBalance) {
      await supabase.rpc('admin_adjust_balance', {
        p_user: p.userId,
        p_delta: delta,
        p_description: p.description || 'تعديل رصيد بواسطة الإدارة',
        p_type: p.type
      });
    }

    await refreshTransactions();
    refreshUsers();
    refreshProfile();
    return ok('تم تسجيل المعاملة بنجاح.');
  };

  // ================= الطلبات =================
  const deliverOrder: StoreContextType['deliverOrder'] = async (orderId, delivery) => {
    const { error } = await supabase.from('orders').update({
      status: 'delivered',
      delivery_email: delivery.email || null,
      delivery_password: delivery.password || null,
      delivery_license: delivery.licenseKey || null,
      delivery_instructions: delivery.instructions || null,
      delivered_at: new Date().toISOString()
    }).eq('id', orderId);
    if (error) return fail(error);
    await refreshOrders();
    return ok('تم تسليم الحساب للعميل بنجاح.');
  };

  const cancelOrder = async (orderId: string, refund = true): Promise<ActionResult> => {
    const { error } = await supabase.rpc('cancel_order', { p_order: orderId, p_refund: refund });
    if (error) return fail(error);
    await Promise.all([refreshOrders(), refreshTransactions()]);
    refreshUsers(); refreshProfile();
    return ok(refund ? 'تم إلغاء الطلب وإعادة قيمته لمحفظة العميل.' : 'تم إلغاء الطلب.');
  };

  const setOrderStatus = async (orderId: string, status: OrderStatus): Promise<ActionResult> => {
    if (status === 'cancelled') return cancelOrder(orderId, true);
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) return fail(error);
    await refreshOrders();
    return ok('تم تحديث حالة الطلب.');
  };

  const updateOrder = async (orderId: string, data: Partial<Order>): Promise<ActionResult> => {
    const payload: Record<string, unknown> = {};
    if (data.itemName !== undefined) payload.item_name = data.itemName;
    if (data.variantDuration !== undefined) payload.variant_duration = data.variantDuration || null;
    if (data.variantCode !== undefined) payload.variant_code = data.variantCode || null;
    if (data.price !== undefined) payload.price = data.price;
    if (data.status !== undefined) payload.status = data.status;
    if (data.adminNote !== undefined) payload.admin_note = data.adminNote || null;

    const { error } = await supabase.from('orders').update(payload).eq('id', orderId);
    if (error) return fail(error);
    await refreshOrders();
    return ok('تم حفظ تعديلات الطلب.');
  };

  const deleteOrder = async (orderId: string, refund = false): Promise<ActionResult> => {
    if (refund) {
      const { error: e } = await supabase.rpc('cancel_order', { p_order: orderId, p_refund: true });
      if (e) return fail(e);
    }
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) return fail(error);
    await Promise.all([refreshOrders(), refreshTransactions()]);
    refreshUsers();
    return ok('تم حذف الطلب نهائياً.');
  };

  const adminCreateOrder: StoreContextType['adminCreateOrder'] = async (p) => {
    const { data, error } = await supabase.rpc('admin_create_order', {
      p_user: p.userId, p_item_type: p.itemType, p_item_id: p.itemId || null,
      p_item_name: p.itemName, p_variant_duration: p.variantDuration || '',
      p_variant_code: p.variantCode || '', p_price: p.price, p_status: p.status,
      p_deduct: p.deductBalance, p_admin_note: p.adminNote || null
    });
    if (error) return fail(error);
    const created = Array.isArray(data) ? data[0] : data;
    await Promise.all([refreshOrders(), refreshTransactions()]);
    refreshUsers();
    return { success: true, orderId: created?.id, message: `تم إنشاء الطلب #${created?.order_number} بنجاح.` };
  };

  // ================= الكتالوج =================
  const saveService = async (s: Service, isNew: boolean): Promise<ActionResult> => {
    const payload = {
      id: s.id, name: s.name, english_name: s.englishName || null, category_id: s.category,
      slug: s.slug, icon_name: s.iconName, badge: s.badge || null,
      featured: !!s.featured, is_hidden: !!s.isHidden,
      short_description: s.shortDescription, features: s.features,
      note: s.note || null, execution_note: s.executionNote || null
    };

    const { error } = isNew
      ? await supabase.from('services').insert(payload)
      : await supabase.from('services').update(payload).eq('id', s.id);
    if (error) return fail(error);

    // مزامنة الباقات: حذف المحذوف ثم إضافة/تعديل الباقي
    const keepIds = s.variants.map(v => v.id);
    if (!isNew) {
      const del = keepIds.length
        ? await supabase.from('service_variants').delete().eq('service_id', s.id).not('id', 'in', `(${keepIds.map(i => `"${i}"`).join(',')})`)
        : await supabase.from('service_variants').delete().eq('service_id', s.id);
      if (del.error) return fail(del.error);
    }

    const variantRows = s.variants.map((v, i) => ({
      id: v.id, service_id: s.id, code: v.code || '', duration: v.duration,
      original_price: v.originalPrice ?? null, price: v.price,
      offer_price: v.offerPrice ?? null, offer_label: v.offerLabel || null,
      offer_ends_at: v.offerEndsAt || null,
      is_popular: !!v.isPopular, note: v.note || null, sort_order: i
    }));

    if (variantRows.length) {
      const { error: ve } = await supabase.from('service_variants').upsert(variantRows);
      if (ve) return fail(ve);
    }

    await refreshCatalog();
    return ok(isNew ? 'تمت إضافة الخدمة بنجاح.' : 'تم حفظ التعديلات بنجاح.');
  };

  const updateService = async (serviceId: string, data: Partial<Service>): Promise<ActionResult> => {
    const payload: Record<string, unknown> = {};
    if (data.isHidden !== undefined) payload.is_hidden = data.isHidden;
    if (data.featured !== undefined) payload.featured = data.featured;
    if (data.name !== undefined) payload.name = data.name;
    const { error } = await supabase.from('services').update(payload).eq('id', serviceId);
    if (error) return fail(error);
    await refreshCatalog();
    return ok('تم التحديث.');
  };

  const deleteService = async (serviceId: string): Promise<ActionResult> => {
    const { error } = await supabase.from('services').delete().eq('id', serviceId);
    if (error) return fail(error);
    await refreshCatalog();
    return ok('تم حذف الخدمة.');
  };

  const saveBundle = async (b: Bundle, isNew: boolean): Promise<ActionResult> => {
    const payload = {
      id: b.id, code: b.code || '', name: b.name, components: b.components || '',
      components_list: b.componentsList, original_price: b.originalPrice || 0,
      price: b.price, offer_price: b.offerPrice ?? null,
      offer_label: b.offerLabel || null, offer_ends_at: b.offerEndsAt || null,
      savings: b.savings || 0, badge: b.badge || null, is_hidden: !!b.isHidden,
      description: b.description, features: b.features
    };
    const { error } = isNew
      ? await supabase.from('bundles').insert(payload)
      : await supabase.from('bundles').update(payload).eq('id', b.id);
    if (error) return fail(error);
    await refreshCatalog();
    return ok(isNew ? 'تمت إضافة العرض بنجاح.' : 'تم حفظ التعديلات بنجاح.');
  };

  const updateBundle = async (bundleId: string, data: Partial<Bundle>): Promise<ActionResult> => {
    const payload: Record<string, unknown> = {};
    if (data.isHidden !== undefined) payload.is_hidden = data.isHidden;
    if (data.name !== undefined) payload.name = data.name;
    const { error } = await supabase.from('bundles').update(payload).eq('id', bundleId);
    if (error) return fail(error);
    await refreshCatalog();
    return ok('تم التحديث.');
  };

  const deleteBundle = async (bundleId: string): Promise<ActionResult> => {
    const { error } = await supabase.from('bundles').delete().eq('id', bundleId);
    if (error) return fail(error);
    await refreshCatalog();
    return ok('تم حذف العرض.');
  };

  const updateSettings = async (s: Partial<SiteSettings>): Promise<ActionResult> => {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (s.siteName !== undefined) payload.site_name = s.siteName;
    if (s.siteTagline !== undefined) payload.site_tagline = s.siteTagline;
    if (s.instapayHandle !== undefined) payload.instapay_handle = s.instapayHandle;
    if (s.instapayName !== undefined) payload.instapay_name = s.instapayName;
    if (s.vodafoneCashNumber !== undefined) payload.vodafone_cash_number = s.vodafoneCashNumber;
    if (s.whatsappSupportNumber !== undefined) payload.whatsapp_support_number = s.whatsappSupportNumber;
    if (s.bannerText !== undefined) payload.banner_text = s.bannerText;
    if (s.showBanner !== undefined) payload.show_banner = s.showBanner;
    if (s.workingHours !== undefined) payload.working_hours = s.workingHours;
    if (s.welcomeBonus !== undefined) payload.welcome_bonus = s.welcomeBonus;

    const { error } = await supabase.from('site_settings').update(payload).eq('id', 1);
    if (error) return fail(error);
    await refreshCatalog();
    return ok('تم حفظ كافة الإعدادات بنجاح.');
  };

  const value = useMemo<StoreContextType>(() => ({
    services, bundles, orders, transactions, settings, isLoadingData,
    currentTab, navigate, selectedCategory, setSelectedCategory,
    selectedService, openServiceModal, closeServiceModal,
    isTopUpModalOpen, openTopUpModal, closeTopUpModal,
    isAuthModalOpen, authModalReason, authModalMode, openAuthModal, closeAuthModal,
    refreshAll, refreshOrders, refreshTransactions, refreshCatalog,
    purchaseItem, requestTopUp,
    approveTopUp, rejectTopUp, deleteTransaction, adminAddTransaction,
    deliverOrder, cancelOrder, setOrderStatus, updateOrder, deleteOrder, adminCreateOrder,
    saveService, updateService, deleteService,
    saveBundle, updateBundle, deleteBundle, updateSettings
  }), [services, bundles, orders, transactions, settings, isLoadingData,
       currentTab, selectedCategory, selectedService, isTopUpModalOpen,
       isAuthModalOpen, authModalReason, authModalMode, openAuthModal, closeAuthModal,
       navigate, refreshAll, refreshOrders, refreshTransactions, refreshCatalog, user, isAdmin, openTopUpModal]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
