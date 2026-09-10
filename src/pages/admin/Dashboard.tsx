import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sliders, 
  ShoppingBag, 
  Wallet, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { OrdersManager } from './OrdersManager';
import { WalletRequests } from './WalletRequests';
import { ServicesManager } from './ServicesManager';
import { SettingsManager } from './SettingsManager';

export const AdminDashboard: React.FC = () => {
  const { orders, transactions, resetToDefaultData } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wallet-requests' | 'services' | 'settings'>('orders');

  const pendingOrders = orders.filter(o => o.status === 'processing');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const totalSales = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-bazaar-card via-bazaar-surface to-bazaar-card border-2 border-bazaar-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h1 className="text-2xl sm:text-3xl font-black font-cairo text-white">
              لوحة تحكم إدارة المتجر
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-bazaar-gold/20 text-bazaar-gold font-black border border-bazaar-gold/40">
              مدير النظام
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            إدارة طلبات الشراء، اعتماد إيصالات الشحن، وتعديل الأسعار وأرقام الدفع.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('هل ترغب في إعادة تعيين كافة البيانات إلى الحالة الافتراضية من ملف الوثيقة؟')) {
              resetToDefaultData();
              alert('تمت استعادة البيانات الافتراضية بنجاح.');
            }
          }}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة ضبط البيانات للوثيقة</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Orders Card */}
        <div 
          onClick={() => setActiveTab('orders')}
          className={`p-5 rounded-3xl cursor-pointer transition-all border ${
            activeTab === 'orders' ? 'bg-bazaar-card border-bazaar-gold shadow-glow-gold' : 'bg-bazaar-card/60 border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">طلبات جديدة للتسليم</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300 font-cairo mt-2">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-amber-400/80 mt-1 font-semibold">
            {pendingOrders.length > 0 ? '⚠️ تتطلب إدخال بيانات الحساب' : 'تم تسليم كافة الطلبات'}
          </p>
        </div>

        {/* Pending Wallet Top-ups */}
        <div 
          onClick={() => setActiveTab('wallet-requests')}
          className={`p-5 rounded-3xl cursor-pointer transition-all border ${
            activeTab === 'wallet-requests' ? 'bg-bazaar-card border-bazaar-teal shadow-glow-teal' : 'bg-bazaar-card/60 border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">طلبات شحن معلقة</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-bazaar-teal font-cairo mt-2">
            {pendingDeposits.length}
          </div>
          <p className="text-[11px] text-bazaar-teal/80 mt-1 font-semibold">
            {pendingDeposits.length > 0 ? '⚡ بانتظار مراجعة الإيصال واعتماده' : 'لا توجد طلبات شحن معلقة'}
          </p>
        </div>

        {/* Delivered Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="p-5 rounded-3xl bg-bazaar-card/60 border border-white/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">طلبات تم تسليمها</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-cairo mt-2">
            {deliveredOrders.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">حسابات نشطة لدى العملاء</p>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-bazaar-card/60 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">إجمالي الإيرادات</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-purple/15 text-bazaar-purple flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-bazaar-purple font-cairo mt-2">
            {totalSales.toLocaleString()} <span className="text-xs text-slate-300 font-normal">ج.م</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">من مبيعات الاشتراكات</p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-bazaar-gold text-bazaar-bg shadow-md'
              : 'bg-bazaar-card text-slate-300 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>إدارة طلبات الاشتراكات</span>
          {pendingOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('wallet-requests')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'wallet-requests'
              ? 'bg-bazaar-teal text-bazaar-bg shadow-md'
              : 'bg-bazaar-card text-slate-300 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>طلبات شحن المحفظة والإيصالات</span>
          {pendingDeposits.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-bazaar-bg text-[10px] flex items-center justify-center font-bold">
              {pendingDeposits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'services'
              ? 'bg-bazaar-purple text-white shadow-md'
              : 'bg-bazaar-card text-slate-300 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>الخدمات وتعديل الأسعار</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-white/20 text-white shadow-md'
              : 'bg-bazaar-card text-slate-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات أرقام الدفع والبانر</span>
        </button>
      </div>

      {/* Tab Content Components */}
      {activeTab === 'orders' && <OrdersManager />}
      {activeTab === 'wallet-requests' && <WalletRequests />}
      {activeTab === 'services' && <ServicesManager />}
      {activeTab === 'settings' && <SettingsManager />}
    </div>
  );
};
