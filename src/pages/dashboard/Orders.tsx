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
      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-200">
        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
        <span>تم إلغاء هذا الطلب وإعادة قيمته إلى محفظتك.</span>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; hint: string; icon: React.ElementType }[] = [
    { key: 'pending', label: 'قيد التأكيد', hint: 'تم استلام طلبك وجاري مراجعته', icon: Hourglass },
    { key: 'processing', label: 'جاري التنفيذ', hint: 'يتم تجهيز بيانات حسابك الآن', icon: Loader2 },
    { key: 'delivered', label: 'تم التسليم', hint: 'بياناتك جاهزة بالأسفل', icon: CheckCircle2 }
  ];

  const activeIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-bazaar-bg/70 border border-white/5">
      <div className="flex items-start">
        {steps.map((step, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center text-center flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all ${
                    done
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                      : current
                      ? 'bg-bazaar-gold/20 text-bazaar-gold border-bazaar-gold shadow-glow-gold'
                      : 'bg-white/5 text-slate-600 border-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${current && step.key === 'processing' ? 'animate-spin' : ''}`} />
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 ${
                    done ? 'text-emerald-400' : current ? 'text-bazaar-gold' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
                {current && <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{step.hint}</span>}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mt-[18px] rounded-full ${i < activeIndex ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
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
    pending: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
    processing: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    delivered: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    cancelled: 'bg-rose-950/80 text-rose-300 border-rose-500/40'
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

  const tabs: { key: 'all' | OrderStatus; label: string; count: number; active: string }[] = [
    { key: 'all', label: 'الكل', count: userOrders.length, active: 'bg-bazaar-gold text-bazaar-bg' },
    { key: 'pending', label: ORDER_STATUS_LABEL.pending, count: countOf('pending'), active: 'bg-sky-600 text-white' },
    { key: 'processing', label: ORDER_STATUS_LABEL.processing, count: countOf('processing'), active: 'bg-amber-600 text-white' },
    { key: 'delivered', label: ORDER_STATUS_LABEL.delivered, count: countOf('delivered'), active: 'bg-emerald-600 text-white' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-cairo text-white">طلباتي وحالة التنفيذ</h1>
          <p className="text-xs text-slate-400">
            تابع حالة كل طلب لحظة بلحظة، واستعرض بيانات الحسابات المسلَّمة مع إمكانية النسخ بضغطة واحدة.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-bazaar-card p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === t.key ? t.active : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((order: Order) => (
            <div key={order.id} className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-5 shadow-xl">
              {/* رأس الطلب */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      order.status === 'delivered'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : order.status === 'cancelled'
                        ? 'bg-rose-500/15 text-rose-400'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    {order.status === 'delivered' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : order.status === 'cancelled' ? (
                      <XCircle className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold font-cairo text-white">{order.itemName}</h3>
                      {order.variantDuration && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                          {order.variantDuration}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-mono text-slate-500">#{order.orderNumber}</span>
                      {order.variantCode && <span>• كود: {order.variantCode}</span>}
                      <span>• بتاريخ: {new Date(order.createdAt).toLocaleString('ar-EG')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-base font-black font-cairo text-amber-300">{order.price} ج.م</span>
                  <span className={`text-xs px-3 py-1 rounded-xl font-bold border ${statusPill(order.status)}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
              </div>

              {/* شريط الحالة */}
              <StatusTimeline status={order.status} />

              {/* بيانات التسليم */}
              {order.status === 'delivered' && order.deliveryDetails ? (
                <div className="p-5 rounded-2xl bg-bazaar-bg/90 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Key className="w-4 h-4" />
                      <span>بيانات الحساب / التفعيل المُسلّمة:</span>
                    </span>
                    {order.deliveryDetails.deliveredAt && (
                      <span className="text-[10px] text-slate-500">
                        وقت التسليم: {new Date(order.deliveryDetails.deliveredAt).toLocaleString('ar-EG')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.deliveryDetails.email && (
                      <div className="bg-bazaar-card p-3 rounded-xl border border-white/10 flex items-center justify-between">
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>البريد الإلكتروني / الحساب:</span>
                          </span>
                          <span className="font-mono text-xs text-white font-bold truncate block select-all" dir="ltr">
                            {order.deliveryDetails.email}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(order.deliveryDetails!.email!, `${order.id}-email`)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0"
                          title="نسخ"
                        >
                          {copiedKey === `${order.id}-email` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {order.deliveryDetails.password && (
                      <div className="bg-bazaar-card p-3 rounded-xl border border-white/10 flex items-center justify-between">
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>كلمة المرور (Password):</span>
                          </span>
                          <span className="font-mono text-xs text-amber-300 font-bold truncate block select-all" dir="ltr">
                            {order.deliveryDetails.password}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(order.deliveryDetails!.password!, `${order.id}-pass`)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0"
                          title="نسخ"
                        >
                          {copiedKey === `${order.id}-pass` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {order.deliveryDetails.licenseKey && (
                      <div className="md:col-span-2 bg-bazaar-card p-3 rounded-xl border border-white/10 flex items-center justify-between">
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Key className="w-3 h-3" />
                            <span>كود الترخيص / رابط التحميل:</span>
                          </span>
                          <span className="font-mono text-xs text-cyan-300 font-bold truncate block select-all" dir="ltr">
                            {order.deliveryDetails.licenseKey}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(order.deliveryDetails!.licenseKey!, `${order.id}-key`)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0"
                          title="نسخ"
                        >
                          {copiedKey === `${order.id}-key` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {order.deliveryDetails.instructions && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <Info className="w-4 h-4 text-bazaar-teal shrink-0 mt-0.5" />
                      <span>{order.deliveryDetails.instructions}</span>
                    </div>
                  )}
                </div>
              ) : order.status !== 'cancelled' ? (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-amber-200">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {order.status === 'pending'
                        ? 'طلبك قيد التأكيد لدى فريق الإدارة، وسيتم البدء في تنفيذه خلال دقائق.'
                        : 'جاري تجهيز بيانات حسابك الآن، وستظهر هنا فور الانتهاء.'}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsappSupportNumber}?text=${encodeURIComponent(
                      `مرحباً دعم سوق الاشتراكات، أستفسر عن طلبي رقم #${order.orderNumber} لخدمة ${order.itemName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 shrink-0 font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>متابعة الطلب على واتساب</span>
                  </a>
                </div>
              ) : null}

              {order.customerNote && (
                <div className="text-[11px] text-slate-400 bg-white/[0.02] p-2.5 rounded-xl">
                  <strong>ملاحظتك المرفقة:</strong> {order.customerNote}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-bazaar-card/40 border border-white/5 space-y-3">
          <PackageSearch className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold font-cairo text-white">لا توجد طلبات في هذا القسم</h3>
          <p className="text-xs text-slate-400">اختر اشتراكك المفضل وادفع من محفظتك واستلم بياناتك فوراً.</p>
          <button
            onClick={() => navigate('services')}
            className="px-5 py-2.5 rounded-xl bg-bazaar-gold text-bazaar-bg font-bold text-xs"
          >
            تصفح الاشتراكات الآن
          </button>
        </div>
      )}
    </div>
  );
};
