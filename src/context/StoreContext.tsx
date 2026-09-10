import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Bundle, Order, WalletTransaction, SiteSettings } from '../types';
import { SERVICES } from '../data/services';
import { BUNDLES } from '../data/bundles';
import { DEFAULT_SETTINGS, INITIAL_ORDERS, INITIAL_TRANSACTIONS } from '../data/initialData';
import { useAuth } from './AuthContext';

interface StoreContextType {
  services: Service[];
  bundles: Bundle[];
  orders: Order[];
  transactions: WalletTransaction[];
  settings: SiteSettings;
  
  // Modals
  selectedService: Service | null;
  openServiceModal: (service: Service) => void;
  closeServiceModal: () => void;
  isTopUpModalOpen: boolean;
  openTopUpModal: () => void;
  closeTopUpModal: () => void;

  // Actions
  purchaseItem: (params: {
    itemType: 'service' | 'bundle';
    itemId: string;
    itemName: string;
    variantDuration?: string;
    variantCode?: string;
    price: number;
    customerNote?: string;
  }) => { success: boolean; message: string; orderId?: string };

  requestTopUp: (params: {
    amount: number;
    method: 'instapay' | 'vodafone_cash';
    senderPhone: string;
    receiptImage?: string;
    referenceNumber?: string;
  }) => { success: boolean; message: string };

  // Admin Actions
  approveTopUp: (transactionId: string) => void;
  rejectTopUp: (transactionId: string, reason?: string) => void;
  deliverOrder: (orderId: string, delivery: { email?: string; password?: string; licenseKey?: string; instructions?: string }) => void;
  cancelOrder: (orderId: string) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateServiceVariantPrice: (serviceId: string, variantId: string, newPrice: number) => void;
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateBalance } = useAuth();

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('souq_services');
    return saved ? JSON.parse(saved) : SERVICES;
  });

  const [bundles, setBundles] = useState<Bundle[]>(() => {
    const saved = localStorage.getItem('souq_bundles');
    return saved ? JSON.parse(saved) : BUNDLES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('souq_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('souq_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('souq_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Modal states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('souq_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('souq_bundles', JSON.stringify(bundles));
  }, [bundles]);

  useEffect(() => {
    localStorage.setItem('souq_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('souq_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('souq_settings', JSON.stringify(settings));
  }, [settings]);

  const openServiceModal = (service: Service) => setSelectedService(service);
  const closeServiceModal = () => setSelectedService(null);
  const openTopUpModal = () => setIsTopUpModalOpen(true);
  const closeTopUpModal = () => setIsTopUpModalOpen(false);

  // Purchase Item
  const purchaseItem = ({
    itemType,
    itemId,
    itemName,
    variantDuration,
    variantCode,
    price,
    customerNote
  }: {
    itemType: 'service' | 'bundle';
    itemId: string;
    itemName: string;
    variantDuration?: string;
    variantCode?: string;
    price: number;
    customerNote?: string;
  }) => {
    if (!user) {
      return { success: false, message: 'يرجى تسجيل الدخول أولاً لإتمام عملية الشراء.' };
    }

    if (user.balance < price) {
      setIsTopUpModalOpen(true);
      return {
        success: false,
        message: `رصيدك الحالي (${user.balance} ج.م) غير كافٍ لإتمام الشراء بمبلغ (${price} ج.م). تم فتح نافذة شحن الرصيد.`
      };
    }

    // Deduct balance
    updateBalance(-price);

    const orderId = 'ord-' + Date.now();
    const newOrder: Order = {
      id: orderId,
      orderNumber: 'SQ-' + Math.floor(10000 + Math.random() * 90000),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      itemType,
      itemId,
      itemName,
      variantDuration,
      variantCode,
      price,
      status: 'processing',
      customerNote,
      createdAt: new Date().toISOString()
    };

    const newTx: WalletTransaction = {
      id: 'tx-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      type: 'purchase',
      amount: price,
      status: 'completed',
      method: 'internal',
      description: `شراء ${itemName} ${variantDuration ? `(${variantDuration})` : ''}`,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `تم الشراء بنجاح! تم خصم ${price} ج.م من رصيدك، وجاري تجهيز وتسليم بيانات الحساب.`,
      orderId
    };
  };

  // Top Up Request
  const requestTopUp = ({
    amount,
    method,
    senderPhone,
    receiptImage,
    referenceNumber
  }: {
    amount: number;
    method: 'instapay' | 'vodafone_cash';
    senderPhone: string;
    receiptImage?: string;
    referenceNumber?: string;
  }) => {
    if (!user) return { success: false, message: 'يرجى تسجيل الدخول أولاً.' };

    const newTx: WalletTransaction = {
      id: 'tx-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      type: 'deposit',
      amount,
      status: 'pending',
      method,
      senderPhone,
      receiptImage,
      referenceNumber,
      description: `طلب شحن محفظة بمبلغ ${amount} ج.م عبر ${method === 'instapay' ? 'Instapay' : 'فودافون كاش'}`,
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsTopUpModalOpen(false);

    return {
      success: true,
      message: `تم تسجيل طلب شحن الرصيد بمبلغ ${amount} ج.م بنجاح! سيقوم فريق الإدارة بمراجعته وإضافة الرصيد لمحفظتك خلال دقائق.`
    };
  };

  // Admin: Approve Top-up
  const approveTopUp = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === transactionId && tx.status === 'pending') {
          // If transaction belongs to current user, credit directly
          if (user && user.id === tx.userId) {
            updateBalance(tx.amount);
          }
          return { ...tx, status: 'completed' };
        }
        return tx;
      })
    );
  };

  // Admin: Reject Top-up
  const rejectTopUp = (transactionId: string, reason = 'بيانات التحويل غير مطابقة أو لم يصل التحويل') => {
    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === transactionId && tx.status === 'pending') {
          return { ...tx, status: 'rejected', adminNote: reason };
        }
        return tx;
      })
    );
  };

  // Admin: Deliver Order
  const deliverOrder = (
    orderId: string,
    delivery: { email?: string; password?: string; licenseKey?: string; instructions?: string }
  ) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'delivered',
            deliveryDetails: {
              ...delivery,
              deliveredAt: new Date().toISOString()
            }
          };
        }
        return ord;
      })
    );
  };

  // Admin: Cancel Order (refund user)
  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId && ord.status !== 'cancelled') {
          if (user && user.id === ord.userId) {
            updateBalance(ord.price);
          }
          return { ...ord, status: 'cancelled' };
        }
        return ord;
      })
    );
  };

  // Update Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Update Service Variant Price
  const updateServiceVariantPrice = (serviceId: string, variantId: string, newPrice: number) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            variants: s.variants.map(v => (v.id === variantId ? { ...v, price: newPrice } : v))
          };
        }
        return s;
      })
    );
  };

  // Reset to default
  const resetToDefaultData = () => {
    localStorage.removeItem('souq_services');
    localStorage.removeItem('souq_bundles');
    localStorage.removeItem('souq_orders');
    localStorage.removeItem('souq_transactions');
    localStorage.removeItem('souq_settings');
    setServices(SERVICES);
    setBundles(BUNDLES);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <StoreContext.Provider
      value={{
        services,
        bundles,
        orders,
        transactions,
        settings,
        selectedService,
        openServiceModal,
        closeServiceModal,
        isTopUpModalOpen,
        openTopUpModal,
        closeTopUpModal,
        purchaseItem,
        requestTopUp,
        approveTopUp,
        rejectTopUp,
        deliverOrder,
        cancelOrder,
        updateSettings,
        updateServiceVariantPrice,
        resetToDefaultData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
