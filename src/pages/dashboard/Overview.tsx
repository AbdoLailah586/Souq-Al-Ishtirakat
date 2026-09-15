import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { 
  Wallet, 
  ShoppingBag, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Package, 
  CreditCard,
  User,
  ShieldCheck
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { user } = useAuth();
  const { orders, openTopUpModal, navigate: setCurrentTab } = useStore();

  const userOrders = orders.filter(o => o.userId === user?.id);
  const deliveredCount = userOrders.filter(o => o.status === 'delivered').length;
  const processingCount = userOrders.filter(o => o.status === 'processing').length;
  const totalSpent = userOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => setCurrentTab('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">لوحة تحكم العميل</span>
      </div>

      {/* Welcome Banner */}
      <div className="p-6 rounded-sm bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h1 className="text-2xl font-bold font-cairo text-[#0F1111]">
              مرحباً، {user?.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              عميل موثق
            </span>
          </div>
          <p className="text-xs text-amazon-muted">
            إدارة رصيد محفظتك، استعراض بيانات الحسابات المسلمة، ومتابعة الطلبات الجارية.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentTab('services')}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F1111] text-xs font-semibold transition-all"
          >
            تصفح الاشتراكات
          </button>
          <button
            onClick={openTopUpModal}
            className="px-5 py-2 rounded-full btn-buy text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>شحن المحفظة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance Card */}
        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amazon-muted">الرصيد المتاح بالمحفظة</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amazon-orange flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold amazon-price font-cairo">
            {(user?.balance || 0).toLocaleString()} <span className="text-xs text-amazon-muted font-normal">ج.م</span>
          </div>
          <button
            onClick={() => setCurrentTab('dashboard-wallet')}
            className="text-xs amazon-link font-semibold flex items-center gap-1 pt-1"
          >
            <span>عرض سجل المحفظة والشحن</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Delivered Orders */}
        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amazon-muted">حسابات تم تسليمها</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-cairo">
            {deliveredCount}
          </div>
          <p className="text-[11px] text-amazon-muted">حسابات مفعلة وجاهزة للاستخدام</p>
        </div>

        {/* Processing Orders */}
        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amazon-muted">طلبات قيد التجهيز</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 font-cairo">
            {processingCount}
          </div>
          <p className="text-[11px] text-amazon-muted">جاري مراجعتها وتجهيز بياناتها</p>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amazon-muted">إجمالي المشتريات</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F1111] font-cairo">
            {totalSpent.toLocaleString()} <span className="text-xs text-amazon-muted font-normal">ج.م</span>
          </div>
          <p className="text-[11px] text-amazon-muted">{userOrders.length} طلب منفذ بنجاح</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentTab('dashboard-orders')}
          className="p-5 rounded-sm bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-right flex items-start gap-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amazon-orange flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] text-sm group-hover:text-amazon-linkHover">
              طلباتي وحساباتي المسلمة
            </h3>
            <p className="text-xs text-amazon-muted leading-relaxed">
              استعراض البريد الإلكتروني، كلمات المرور، ومفاتيح التفعيل مع إمكانية النسخ الفوري.
            </p>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard-wallet')}
          className="p-5 rounded-sm bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-right flex items-start gap-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] text-sm group-hover:text-amazon-linkHover">
              المحفظة وحركات الشحن
            </h3>
            <p className="text-xs text-amazon-muted leading-relaxed">
              شحن الرصيد عبر InstaPay وفودافون كاش، وتتبع سجل المعاملات المالية.
            </p>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard-profile')}
          className="p-5 rounded-sm bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-right flex items-start gap-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] text-sm group-hover:text-amazon-linkHover">
              تسجيل الدخول والأمان
            </h3>
            <p className="text-xs text-amazon-muted leading-relaxed">
              تعديل بيانات الحساب، تحديث رقم الهاتف، وتغيير كلمة المرور.
            </p>
          </div>
        </button>
      </div>

      {/* Recent Orders Preview */}
      <div className="p-6 rounded-sm bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold font-cairo text-[#0F1111]">
            آخر الطلبات المنفذة
          </h2>
          <button
            onClick={() => setCurrentTab('dashboard-orders')}
            className="text-xs amazon-link font-semibold"
          >
            عرض كافة الطلبات ({userOrders.length}) ›
          </button>
        </div>

        {userOrders.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {userOrders.slice(0, 3).map(order => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#0F1111]">{order.itemName}</h4>
                  <span className="text-xs text-amazon-muted">
                    كود: {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold amazon-price block">{order.price} ج.م</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {order.status === 'delivered' ? 'تم التسليم' : 'قيد المتابعة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-amazon-muted space-y-3">
            <p>لا توجد لديك طلبات سابقة حتى الآن.</p>
            <button
              onClick={() => setCurrentTab('services')}
              className="btn-cart px-5 py-2 rounded-full font-bold text-xs"
            >
              ابدأ التسوق الآن
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
