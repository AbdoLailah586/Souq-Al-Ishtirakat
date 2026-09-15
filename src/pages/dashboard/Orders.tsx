import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, ORDER_STATUS_LABEL } from '../../types';
import {
  CheckCircle2, Clock, Copy, Check, Key, Mail, Lock, Info,
  MessageCircle, Hourglass, Loader2, XCircle, PackageSearch
} from 'lucide-react';

/** شريط تتبع حالة الطلب: قيد التأكيد ← جاري التنفيذ ← تم التسليم */
const StatusTimeline: React.FC<{ status: OrderStatus }> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>تم إلغاء هذا الطلب وإعادة قيمته بالكامل إلى محفظتك.</span>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; hint: string; icon: React.ElementType }[] = [
    { key: 'pending', label: 'قيد التأكيد', hint: 'تم استلام طلبك وبانتظار المراجعة', icon: Hourglass },
    { key: 'processing', label: 'جاري التنفيذ', hint: 'يتم تجهيز بيانات حسابك الآن', icon: Loader2 },
    { key: 'delivered', label: 'تم التسليم', hint: 'بيانات الحساب جاهزة بالأسفل', icon: CheckCircle2 }
  ];

  const activeIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="p-4 rounded-sm bg-slate-50 border border-slate-200">
      <div className="flex items-start">
        {steps.map((step, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center text-center flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    done
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : current
                      ? 'bg-amazon-orange text-white border-amazon-orange shadow-sm'
                      : 'bg-white text-slate-400 border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${current && step.key === 'processing' ? 'animate-spin' : ''}`} />
                </div>
                <span
                  className={`text-xs font-bold mt-1.5 ${
                    done ? 'text-emerald-700' : current ? 'text-amazon-orange' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
                {current && <span className="text-[10px] text-amazon-muted mt-0.5 leading-tight">{step.hint}</span>}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mt-[16px] rounded-full ${i < activeIndex ? 'bg-emerald-600' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const statusPill = (status: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    pending: 'bg-blue-50 text-blue-800 border-blue-200',
    processing: 'bg-amber-50 text-amber-800 border-amber-200',
    delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-800 border-rose-200'
  };
  return map[status];
};

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const { orders, settings, navigate } = useStore();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const userOrders = orders.filter(o => o.userId === user?.id);
  const filtered = userOrders.filter(o => filter === 'all' || o.status === filter);

  const countOf = (s: OrderStatus) => userOrders.filter(o => o.status === s).length;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const tabs: { key: 'all' | OrderStatus; label: string; count: number }[] = [
    { key: 'all', label: 'الكل', count: userOrders.length },
    { key: 'pending', label: ORDER_STATUS_LABEL.pending, count: countOf('pending') },
    { key: 'processing', label: ORDER_STATUS_LABEL.processing, count: countOf('processing') },
    { key: 'delivered', label: ORDER_STATUS_LABEL.delivered, count: countOf('delivered') }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <button onClick={() => navigate('dashboard')} className="amazon-link">لوحة التحكم</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">طلباتي وحساباتي</span>
      </div>

      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-cairo text-[#0F1111]">طلباتي وحالة التنفيذ</h1>
          <p className="text-xs text-amazon-muted mt-0.5">
            تابع حالة كل طلب لحظة بلحظة، واستعرض بيانات الحسابات المسلَّمة مع إمكانية النسخ بضغطة واحدة.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs self-start sm:self-auto flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-sm font-semibold transition-all ${
                filter === t.key ? 'bg-[#131921] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F1111]'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((order: Order) => (
            <div key={order.id} className="p-5 rounded-sm bg-white border border-slate-200 space-y-4 shadow-sm">
              {/* رأس الطلب */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      order.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {order.status === 'delivered' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : order.status === 'cancelled' ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold font-cairo text-[#0F1111]">{order.itemName}</h3>
                      {order.variantDuration && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {order.variantDuration}
                        </span>
                      )}
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-sm font-bold border ${statusPill(order.status)}`}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </div>
                    <div className="text-[11px] text-amazon-muted mt-0.5">
                      رقم الطلب: <strong className="text-[#0F1111] font-mono">{order.orderNumber}</strong> • {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-amazon-muted">قيمة الطلب:</span>
                  <div className="text-lg font-bold amazon-price">{order.price} ج.م</div>
                </div>
              </div>

              {/* شريط حالة الطلب */}
              <StatusTimeline status={order.status} />

              {/* بيانات الحساب المسلّم */}
              {order.status === 'delivered' && order.deliveryDetails && (
                <div className="p-4 rounded-sm bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>بيانات الحساب المسلّم (جاهز للاستخدام الفوري)</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      تم التسليم بنجاح ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {order.deliveryDetails.email && (
                      <div className="bg-white p-3 rounded-sm border border-emerald-200 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] text-amazon-muted block">البريد الإلكتروني:</span>
                          <span className="font-mono text-xs font-bold text-[#0F1111] select-all truncate block" dir="ltr">
                            {order.deliveryDetails.email}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(order.deliveryDetails!.email!, `email-${order.id}`)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-[#0F1111] shrink-0"
                          title="نسخ الإيميل"
                        >
                          {copiedKey === `email-${order.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {order.deliveryDetails.password && (
                      <div className="bg-white p-3 rounded-sm border border-emerald-200 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] text-amazon-muted block">كلمة المرور:</span>
                          <span className="font-mono text-xs font-bold text-[#0F1111] select-all truncate block" dir="ltr">
                            {order.deliveryDetails.password}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(order.deliveryDetails!.password!, `pwd-${order.id}`)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-[#0F1111] shrink-0"
                          title="نسخ الباسورد"
                        >
                          {copiedKey === `pwd-${order.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {order.deliveryDetails.licenseKey && (
                      <div className="sm:col-span-2 bg-white p-3 rounded-sm border border-emerald-200 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] text-amazon-muted block">كود التفعيل / مفتاح الترخيص:</span>
                          <span className="font-mono text-xs font-bold text-amber-700 select-all truncate block" dir="ltr">
                            {order.deliveryDetails.licenseKey}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(order.deliveryDetails!.licenseKey!, `lic-${order.id}`)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-[#0F1111] shrink-0"
                          title="نسخ الكود"
                        >
                          {copiedKey === `lic-${order.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {order.deliveryDetails.instructions && (
                    <div className="p-3 bg-white rounded-sm border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-1">
                      <span className="font-bold text-[#0F1111] block">إرشادات تسجيل الدخول والتفعيل:</span>
                      <p>{order.deliveryDetails.instructions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ملاحظات ومساعدة */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-amazon-muted">
                  ضمان كامل طوال مدة الاشتراك المعتمدة
                </span>
                <a
                  href={`https://wa.me/${settings.whatsappSupportNumber}?text=${encodeURIComponent(`مرحباً دعم سوق الاشتراكات، بخصوص طلبي رقم: ${order.orderNumber} (${order.itemName})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amazon-link flex items-center gap-1 font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>تواصل بخصوص هذا الطلب</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-sm bg-white border border-slate-200 space-y-3 shadow-sm">
          <div className="text-4xl">📦</div>
          <h3 className="text-lg font-bold font-cairo text-[#0F1111]">لا توجد أي طلبات مطابقة</h3>
          <p className="text-xs text-amazon-muted max-w-sm mx-auto">
            لم تقم بطلب أي اشتراك في هذا القسم حتى الآن.
          </p>
          <button
            onClick={() => navigate('services')}
            className="btn-cart px-5 py-2 rounded-full font-bold text-xs shadow-sm mt-2"
          >
            تصفح الكتالوج وابدأ طلبك الآن
          </button>
        </div>
      )}
    </div>
  );
};
