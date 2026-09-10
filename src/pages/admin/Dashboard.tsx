import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { hasAnyOffer, isOfferActive } from '../../utils/pricing';
import {
  Sliders, ShoppingBag, Wallet, Settings, CheckCircle2, Clock,
  Users, TrendingUp, RotateCcw, Gift, Hourglass
} from 'lucide-react';
import { OrdersManager } from './OrdersManager';
import { WalletRequests } from './WalletRequests';
import { ServicesManager } from './ServicesManager';
import { BundlesManager } from './BundlesManager';
import { UsersManager } from './UsersManager';
import { SettingsManager } from './SettingsManager';

type AdminTab = 'orders' | 'wallet-requests' | 'users' | 'services' | 'bundles' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { orders, transactions, services, bundles, refreshAll, isLoadingData } = useStore();
  const { users, user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const totalSales = deliveredOrders.reduce((sum, o) => sum + o.price, 0);
  const totalWallets = users.reduce((sum, u) => sum + u.balance, 0);
  const openOrders = pendingOrders.length + processingOrders.length;
  const activeOffers =
    services.filter(s => !s.isHidden && hasAnyOffer(s.variants)).length +
    bundles.filter(b => !b.isHidden && isOfferActive(b)).length;

  const tabs: { id: AdminTab; label: string; icon: React.ElementType; badge?: number; color: string }[] = [
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag, badge: openOrders, color: 'bg-bazaar-gold text-bazaar-bg' },
    { id: 'wallet-requests', label: 'المحفظة والشحن', icon: Wallet, badge: pendingDeposits.length, color: 'bg-bazaar-teal text-bazaar-bg' },
    { id: 'users', label: 'العملاء والحسابات', icon: Users, color: 'bg-emerald-600 text-white' },
    { id: 'services', label: 'الاشتراكات والخدمات', icon: Sliders, color: 'bg-bazaar-purple text-white' },
    { id: 'bundles', label: 'العروض والباقات', icon: Gift, color: 'bg-amber-600 text-white' },
    { id: 'settings', label: 'إعدادات الموقع', icon: Settings, color: 'bg-white/20 text-white' }
  ];

  const kpis = [
    { label: 'طلبات قيد التأكيد', value: pendingOrders.length, icon: Hourglass, tone: 'text-sky-300', bg: 'bg-sky-500/15 text-sky-400', tab: 'orders' as AdminTab, hint: pendingOrders.length ? '⚠️ تحتاج مراجعة' : 'لا يوجد جديد' },
    { label: 'طلبات جاري تنفيذها', value: processingOrders.length, icon: Clock, tone: 'text-amber-300', bg: 'bg-amber-500/15 text-amber-400', tab: 'orders' as AdminTab, hint: processingOrders.length ? 'بانتظار إدخال البيانات' : 'كل الطلبات مُسلّمة' },
    { label: 'طلبات شحن معلقة', value: pendingDeposits.length, icon: Wallet, tone: 'text-bazaar-teal', bg: 'bg-bazaar-teal/15 text-bazaar-teal', tab: 'wallet-requests' as AdminTab, hint: pendingDeposits.length ? '⚡ راجع الإيصالات' : 'لا توجد طلبات شحن' },
    { label: 'حسابات تم تسليمها', value: deliveredOrders.length, icon: CheckCircle2, tone: 'text-emerald-400', bg: 'bg-emerald-500/15 text-emerald-400', tab: 'orders' as AdminTab, hint: 'حسابات نشطة لدى العملاء' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* الرأس */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-bazaar-card via-bazaar-surface to-bazaar-card border-2 border-bazaar-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">⚙️</span>
            <h1 className="text-2xl sm:text-3xl font-black font-cairo text-white">لوحة تحكم إدارة المتجر</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-bazaar-gold/20 text-bazaar-gold font-black border border-bazaar-gold/40">
              صلاحية كاملة
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            أهلاً {user?.name} — لديك تحكم كامل في الطلبات، الحسابات، الأرصدة، الاشتراكات والعروض وإعدادات الموقع.
          </p>
        </div>

        <button
          onClick={() => void refreshAll()}
          disabled={isLoadingData}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-60"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
          <span>{isLoadingData ? 'جارٍ التحديث...' : 'تحديث البيانات'}</span>
        </button>
      </div>

      {/* مؤشرات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div
            key={k.label}
            onClick={() => setActiveTab(k.tab)}
            className={`p-5 rounded-3xl cursor-pointer transition-all border ${
              activeTab === k.tab ? 'bg-bazaar-card border-bazaar-gold/60' : 'bg-bazaar-card/60 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{k.label}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${k.bg}`}>
                <k.icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-3xl font-black font-cairo mt-2 ${k.tone}`}>{k.value}</div>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* مؤشرات مالية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-bazaar-card/60 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">إجمالي الإيرادات المُسلّمة</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-purple/15 text-bazaar-purple flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-bazaar-purple font-cairo mt-2">
            {totalSales.toLocaleString()} <span className="text-xs text-slate-300 font-normal">ج.م</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-bazaar-card/60 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">أرصدة العملاء بالمحافظ</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-cairo mt-2">
            {totalWallets.toLocaleString()} <span className="text-xs text-slate-300 font-normal">ج.م</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('users')}
          className="p-5 rounded-3xl bg-bazaar-card/60 border border-white/5 cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">الحسابات المسجلة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-cairo mt-2">{users.length}</div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
            <span>{services.length} خدمة</span>
            <span className="text-slate-600">|</span>
            <span>{bundles.length} باقة</span>
            {activeOffers > 0 && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-bold">{activeOffers} عرض ساري</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* التبويبات */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === t.id ? `${t.color} shadow-md` : 'bg-bazaar-card text-slate-300 hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
            {!!t.badge && t.badge > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && <OrdersManager />}
      {activeTab === 'wallet-requests' && <WalletRequests />}
      {activeTab === 'users' && <UsersManager />}
      {activeTab === 'services' && <ServicesManager />}
      {activeTab === 'bundles' && <BundlesManager />}
      {activeTab === 'settings' && <SettingsManager />}
    </div>
  );
};
