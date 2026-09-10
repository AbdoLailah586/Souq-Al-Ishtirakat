import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { 
  Wallet, 
  ShoppingBag, 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check 
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { user } = useAuth();
  const { orders, transactions, openTopUpModal, navigate: setCurrentTab } = useStore();

  const userOrders = orders.filter(o => o.userId === user?.id);
  const deliveredCount = userOrders.filter(o => o.status === 'delivered').length;
  const processingCount = userOrders.filter(o => o.status === 'processing').length;
  const totalSpent = userOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-bazaar-card via-bazaar-surface to-bazaar-card border border-bazaar-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h1 className="text-2xl sm:text-3xl font-black font-cairo text-white">
              أهلاً بك، {user?.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-bazaar-teal/20 text-bazaar-teal font-bold border border-bazaar-teal/30">
              عميل مميز
            </span>
          </div>
          <p className="text-xs text-slate-400">
            مرحباً بك في لوحة تحكمك. يمكنك متابعة رصيد محفظتك، طلباتك الحالية، وبيانات حساباتك المسلمة.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setCurrentTab('services')}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all"
          >
            تصفح الخدمات
          </button>
          <button
            onClick={openTopUpModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>شحن رصيد المحفظة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance Card */}
        <div className="p-6 rounded-3xl bg-bazaar-card border border-bazaar-gold/40 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">الرصيد المتاح</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300 font-cairo">
            {(user?.balance || 0).toLocaleString()} <span className="text-xs text-slate-300 font-normal">ج.م</span>
          </div>
          <button
            onClick={() => setCurrentTab('dashboard-wallet')}
            className="text-[11px] font-bold text-bazaar-gold hover:underline flex items-center gap-1 pt-1"
          >
            <span>عرض تفاصيل المحفظة</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Delivered Orders */}
        <div className="p-6 rounded-3xl bg-bazaar-card border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">حسابات تم تسليمها</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-cairo">
            {deliveredCount}
          </div>
          <p className="text-[11px] text-slate-400">حسابات مفعلة وجاهزة للاستخدام</p>
        </div>

        {/* Processing Orders */}
        <div className="p-6 rounded-3xl bg-bazaar-card border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">طلبات قيد التجهيز</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-bazaar-teal font-cairo">
            {processingCount}
          </div>
          <p className="text-[11px] text-slate-400">جاري مراجعتها وتجهيزها للتسليم</p>
        </div>

        {/* Total Spent */}
        <div className="p-6 rounded-3xl bg-bazaar-card border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">إجمالي المشتريات</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-purple/15 text-bazaar-purple flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-bazaar-purple font-cairo">
            {totalSpent.toLocaleString()} <span className="text-xs text-slate-300 font-normal">ج.م</span>
          </div>
          <p className="text-[11px] text-slate-400">عبر {userOrders.length} طلبات منفذة</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-bazaar-card/90 rounded-3xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-cairo text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-bazaar-gold" />
            <span>آخر الطلبات والاشتراكات</span>
          </h2>
          <button
            onClick={() => setCurrentTab('dashboard-orders')}
            className="text-xs font-bold text-bazaar-gold hover:underline flex items-center gap-1"
          >
            <span>عرض كل الطلبات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {userOrders.length > 0 ? (
          <div className="space-y-3">
            {userOrders.slice(0, 3).map(order => (
              <div 
                key={order.id}
                className="p-4 rounded-2xl bg-bazaar-bg/70 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{order.itemName}</span>
                    {order.variantDuration && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {order.variantDuration}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">#{order.orderNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    بتاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')} • السعر: {order.price} ج.م
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-xs px-3 py-1 rounded-xl font-bold ${
                    order.status === 'delivered'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : order.status === 'processing'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                  }`}>
                    {order.status === 'delivered' ? 'تم التسليم ✓' : order.status === 'processing' ? 'قيد التجهيز ⏳' : 'ملغي'}
                  </span>

                  <button
                    onClick={() => setCurrentTab('dashboard-orders')}
                    className="px-3 py-1.5 rounded-xl bg-bazaar-card hover:bg-white/10 text-xs font-bold text-slate-200 border border-white/10"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs space-y-2">
            <p>لم تقم بأي طلبات بعد.</p>
            <button
              onClick={() => setCurrentTab('services')}
              className="px-4 py-2 rounded-xl bg-bazaar-gold text-bazaar-bg font-bold text-xs"
            >
              تصفح الاشتراكات الآن
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
