import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { 
  ShoppingBag, 
  Send, 
  CheckCircle2, 
  Clock, 
  X, 
  AlertCircle, 
  Mail, 
  Lock, 
  Key, 
  Info,
  Phone,
  User,
  MessageCircle
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { orders, deliverOrder, cancelOrder, settings } = useStore();
  const [filter, setFilter] = useState<'all' | 'processing' | 'delivered'>('all');
  const [deliveringOrder, setDeliveringOrder] = useState<Order | null>(null);

  // Delivery Form State
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [deliveryPassword, setDeliveryPassword] = useState('');
  const [deliveryLicense, setDeliveryLicense] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  const openDeliveryModal = (order: Order) => {
    setDeliveringOrder(order);
    setDeliveryEmail(order.deliveryDetails?.email || '');
    setDeliveryPassword(order.deliveryDetails?.password || '');
    setDeliveryLicense(order.deliveryDetails?.licenseKey || '');
    setDeliveryInstructions(
      order.deliveryDetails?.instructions || 
      'تم تفعيل الاشتراك بنجاح. يرجى تسجيل الدخول بالبيانات المرفقة والتواصل مع الدعم الفني في حال وجود أي استفسار.'
    );
  };

  const handleDeliverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringOrder) return;

    deliverOrder(deliveringOrder.id, {
      email: deliveryEmail.trim(),
      password: deliveryPassword.trim(),
      licenseKey: deliveryLicense.trim(),
      instructions: deliveryInstructions.trim()
    });

    alert(`تم تسليم الطلب #${deliveringOrder.orderNumber} بنجاح! البيانات أصبحت متاحة الآن في لوحة تحكم العميل.`);
    setDeliveringOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Sub Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-base font-bold font-cairo text-white">
            قائمة طلبات العملاء ({orders.length})
          </h2>
          <p className="text-xs text-slate-400">
            يمكنك إدخال بيانات الحسابات وتأكيد تسليمها للعميل بضغطة زر.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-bazaar-bg p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filter === 'all' ? 'bg-bazaar-gold text-bazaar-bg' : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({orders.length})
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filter === 'processing' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            بانتظار التسليم ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filter === 'delivered' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            تم تسليمها ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(order => (
            <div
              key={order.id}
              className={`p-6 rounded-3xl bg-bazaar-card border transition-all ${
                order.status === 'processing'
                  ? 'border-amber-500/40 shadow-glow-gold'
                  : 'border-white/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      #{order.orderNumber}
                    </span>
                    <span className="font-bold text-base text-white font-cairo">
                      {order.itemName}
                    </span>
                    {order.variantDuration && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                        {order.variantDuration}
                      </span>
                    )}
                    {order.variantCode && (
                      <span className="text-[10px] text-slate-400">كود: {order.variantCode}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="w-3.5 h-3.5 text-bazaar-gold" />
                      <strong>العميل:</strong> {order.userName}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-bazaar-teal" />
                      <strong>الهاتف:</strong> {order.userPhone}
                    </span>
                    <span>• المبلغ: <strong className="text-white">{order.price} ج.م</strong></span>
                    <span>• الوقت: {new Date(order.createdAt).toLocaleString('ar-EG')}</span>
                  </div>

                  {order.customerNote && (
                    <p className="text-xs text-amber-200 bg-amber-950/40 p-2 rounded-xl border border-amber-500/20 mt-2">
                      <strong>ملاحظة العميل:</strong> {order.customerNote}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end lg:self-center">
                  <a
                    href={`https://wa.me/${order.userPhone.replace(/^0/, '20')}?text=${encodeURIComponent(`مرحباً أستاذ ${order.userName}، بخصوص طلبك #${order.orderNumber} في موقع سوق الاشتراكات.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
                    title="مراسلة العميل على واتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">واتساب</span>
                  </a>

                  {order.status === 'processing' ? (
                    <button
                      onClick={() => openDeliveryModal(order)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>تسليم الحساب للعميل</span>
                    </button>
                  ) : order.status === 'delivered' ? (
                    <button
                      onClick={() => openDeliveryModal(order)}
                      className="px-4 py-2 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تعديل البيانات المُسلّمة</span>
                    </button>
                  ) : (
                    <span className="text-xs text-rose-400 font-bold">ملغي</span>
                  )}

                  {order.status === 'processing' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من إلغاء الطلب #${order.orderNumber} وإعادة ${order.price} ج.م إلى محفظة العميل؟`)) {
                          cancelOrder(order.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-400 border border-rose-500/20 text-xs"
                      title="إلغاء الطلب واسترداد الرصيد"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 p-8 rounded-3xl bg-bazaar-card/40 border border-white/5 text-slate-400 text-xs">
          لا توجد طلبات في هذا القسم حالياً.
        </div>
      )}

      {/* Delivery Form Modal */}
      {deliveringOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-bazaar-card rounded-3xl border border-bazaar-gold/50 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold font-cairo text-white">
                  تسليم بيانات: {deliveringOrder.itemName}
                </h3>
                <p className="text-xs text-slate-400">
                  طلب رقم: #{deliveringOrder.orderNumber} • العميل: {deliveringOrder.userName}
                </p>
              </div>
              <button
                onClick={() => setDeliveringOrder(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeliverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">البريد الإلكتروني / الحساب:</label>
                <input
                  type="text"
                  value={deliveryEmail}
                  onChange={e => setDeliveryEmail(e.target.value)}
                  placeholder="مثال: account@souq.com أو الإيميل المفعل"
                  className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-bazaar-gold font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">كلمة المرور (Password):</label>
                <input
                  type="text"
                  value={deliveryPassword}
                  onChange={e => setDeliveryPassword(e.target.value)}
                  placeholder="مثال: Pass#2026!VIP"
                  className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-bazaar-gold font-mono text-amber-300"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">كود الترخيص أو رابط التفعيل (اختياري):</label>
                <input
                  type="text"
                  value={deliveryLicense}
                  onChange={e => setDeliveryLicense(e.target.value)}
                  placeholder="مثال: XXXXX-XXXXX-XXXXX أو رابط التفعيل"
                  className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-bazaar-gold font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">تعليمات وطريقة التشغيل للعميل:</label>
                <textarea
                  rows={3}
                  value={deliveryInstructions}
                  onChange={e => setDeliveryInstructions(e.target.value)}
                  className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-bazaar-gold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveringOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>اعتماد وتسليم الحساب فوراً</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
