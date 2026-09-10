import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus, ORDER_STATUS_LABEL } from '../../types';
import { effectivePrice } from '../../utils/pricing';
import {
  Send, CheckCircle2, X, Plus, Pencil, Trash2, Search,
  Phone, User, MessageCircle, Save, ShoppingBag
} from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'delivered', 'cancelled'];

const statusStyle = (s: OrderStatus) => ({
  pending: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
  processing: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
  delivered: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  cancelled: 'bg-rose-950/80 text-rose-300 border-rose-500/40'
}[s]);

export const OrdersManager: React.FC = () => {
  const { orders, services, bundles, deliverOrder, cancelOrder, setOrderStatus, updateOrder, deleteOrder, adminCreateOrder } = useStore();
  const { users } = useAuth();

  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');

  // نافذة التسليم
  const [deliveringOrder, setDeliveringOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState({ email: '', password: '', licenseKey: '', instructions: '' });

  // نافذة تعديل الطلب
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({ itemName: '', variantDuration: '', variantCode: '', price: 0, status: 'pending' as OrderStatus, adminNote: '' });

  // نافذة إنشاء طلب
  const [isCreating, setIsCreating] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [createForm, setCreateForm] = useState({
    userId: '', itemType: 'service' as 'service' | 'bundle', itemId: '', itemName: '',
    variantDuration: '', variantCode: '', price: 0, status: 'pending' as OrderStatus,
    deductBalance: false, adminNote: ''
  });
  const [createMsg, setCreateMsg] = useState<{ success: boolean; message: string } | null>(null);

  const countOf = (s: OrderStatus) => orders.filter(o => o.status === s).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter(o => filter === 'all' || o.status === filter)
      .filter(o => !q || o.orderNumber.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q) ||
        o.itemName.toLowerCase().includes(q) || o.userPhone.includes(q));
  }, [orders, filter, search]);

  const openDeliveryModal = (order: Order) => {
    setDeliveringOrder(order);
    setDelivery({
      email: order.deliveryDetails?.email || '',
      password: order.deliveryDetails?.password || '',
      licenseKey: order.deliveryDetails?.licenseKey || '',
      instructions:
        order.deliveryDetails?.instructions ||
        'تم تفعيل الاشتراك بنجاح. يرجى تسجيل الدخول بالبيانات المرفقة والتواصل مع الدعم الفني في حال وجود أي استفسار.'
    });
  };

  const handleDeliverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringOrder) return;
    setIsBusy(true);
    const res = await deliverOrder(deliveringOrder.id, {
      email: delivery.email.trim(),
      password: delivery.password.trim(),
      licenseKey: delivery.licenseKey.trim(),
      instructions: delivery.instructions.trim()
    });
    setIsBusy(false);
    if (!res.success) { alert(res.message); return; }
    setDeliveringOrder(null);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setEditForm({
      itemName: order.itemName,
      variantDuration: order.variantDuration || '',
      variantCode: order.variantCode || '',
      price: order.price,
      status: order.status,
      adminNote: order.adminNote || ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const { status, ...rest } = editForm;
    setIsBusy(true);
    const res = await updateOrder(editingOrder.id, { ...rest, status, price: Number(rest.price) || 0 });
    setIsBusy(false);
    if (!res.success) { alert(res.message); return; }
    setEditingOrder(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBusy(true);
    const res = await adminCreateOrder({ ...createForm, price: Number(createForm.price) || 0 });
    setIsBusy(false);
    setCreateMsg(res);
    if (res.success) {
      setTimeout(() => {
        setIsCreating(false);
        setCreateMsg(null);
        setCreateForm({ userId: '', itemType: 'service', itemId: '', itemName: '', variantDuration: '', variantCode: '', price: 0, status: 'pending', deductBalance: false, adminNote: '' });
      }, 1000);
    }
  };

  /** ملء تلقائي عند اختيار خدمة أو عرض */
  const handlePickItem = (itemId: string) => {
    if (createForm.itemType === 'service') {
      const s = services.find(x => x.id === itemId);
      if (s) {
        const v = s.variants[0];
        setCreateForm(f => ({ ...f, itemId, itemName: s.name, variantDuration: v?.duration || '', variantCode: v?.code || '', price: v ? effectivePrice(v) : 0 }));
      }
    } else {
      const b = bundles.find(x => x.id === itemId);
      if (b) setCreateForm(f => ({ ...f, itemId, itemName: b.name, variantCode: b.code, variantDuration: '', price: effectivePrice(b) }));
    }
  };

  const field =
    'w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-2.5 text-xs text-white focus:outline-none transition-colors';

  return (
    <div className="space-y-6">
      {/* الرأس والفلاتر */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-base font-bold font-cairo text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-bazaar-gold" />
            <span>إدارة طلبات العملاء ({orders.length})</span>
          </h2>
          <p className="text-xs text-slate-400">تسليم البيانات، تغيير الحالة، تعديل أو حذف أي طلب، أو إضافة طلب يدوي.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث برقم الطلب أو العميل..."
              className="bg-bazaar-bg border border-white/10 rounded-xl py-2 pr-9 pl-3 text-xs text-white focus:outline-none focus:border-bazaar-gold w-52"
            />
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-teal to-emerald-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طلب يدوي</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-bazaar-bg p-1 rounded-xl border border-white/5 text-xs flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold ${filter === 'all' ? 'bg-bazaar-gold text-bazaar-bg' : 'text-slate-400 hover:text-white'}`}
        >
          الكل ({orders.length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg font-bold border ${
              filter === s ? statusStyle(s) : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {ORDER_STATUS_LABEL[s]} ({countOf(s)})
          </button>
        ))}
      </div>

      {/* قائمة الطلبات */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(order => (
            <div
              key={order.id}
              className={`p-5 rounded-3xl bg-bazaar-card border transition-all ${
                order.status === 'pending' || order.status === 'processing' ? 'border-amber-500/40' : 'border-white/10'
              }`}
            >
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-300">#{order.orderNumber}</span>
                    <span className="font-bold text-base text-white font-cairo">{order.itemName}</span>
                    {order.variantDuration && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-200">{order.variantDuration}</span>
                    )}
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${statusStyle(order.status)}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="w-3.5 h-3.5 text-bazaar-gold" />
                      <strong>{order.userName}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-slate-300" dir="ltr">
                      <Phone className="w-3.5 h-3.5 text-bazaar-teal" />
                      {order.userPhone}
                    </span>
                    <span>• المبلغ: <strong className="text-white">{order.price} ج.م</strong></span>
                    {order.variantCode && <span>• كود: {order.variantCode}</span>}
                    <span>• {new Date(order.createdAt).toLocaleString('ar-EG')}</span>
                  </div>

                  {order.customerNote && (
                    <p className="text-xs text-amber-200 bg-amber-950/40 p-2 rounded-xl border border-amber-500/20 mt-1">
                      <strong>ملاحظة العميل:</strong> {order.customerNote}
                    </p>
                  )}
                  {order.adminNote && (
                    <p className="text-xs text-slate-300 bg-white/[0.03] p-2 rounded-xl border border-white/5 mt-1">
                      <strong>ملاحظة إدارية:</strong> {order.adminNote}
                    </p>
                  )}
                </div>

                {/* أزرار التحكم */}
                <div className="flex items-center gap-2 flex-wrap xl:justify-end shrink-0">
                  {/* تغيير الحالة السريع */}
                  <select
                    value={order.status}
                    onChange={e => void setOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-bazaar-bg border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-bazaar-gold font-bold"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                    ))}
                  </select>

                  <a
                    href={`https://wa.me/${order.userPhone.replace(/^0/, '20')}?text=${encodeURIComponent(
                      `مرحباً ${order.userName}، بخصوص طلبك #${order.orderNumber} في موقع سوق الاشتراكات.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30"
                    title="مراسلة العميل"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => openDeliveryModal(order)}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                      order.status === 'delivered'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg shadow-md'
                    }`}
                  >
                    {order.status === 'delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{order.status === 'delivered' ? 'تعديل البيانات' : 'تسليم الحساب'}</span>
                  </button>

                  <button
                    onClick={() => openEdit(order)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    title="تعديل بيانات الطلب"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`إلغاء الطلب #${order.orderNumber} وإعادة ${order.price} ج.م إلى محفظة العميل؟`))
                          void cancelOrder(order.id, true);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 border border-rose-500/20 text-[11px] font-bold"
                    >
                      إلغاء واسترداد
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (!window.confirm(`حذف الطلب #${order.orderNumber} نهائياً من السجلات؟`)) return;
                      const refund =
                        order.status !== 'cancelled' &&
                        window.confirm('هل تريد إعادة قيمة الطلب إلى محفظة العميل قبل الحذف؟');
                      void deleteOrder(order.id, refund);
                    }}
                    className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 border border-rose-500/20"
                    title="حذف الطلب"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-3xl bg-bazaar-card/40 border border-white/5 text-slate-400 text-xs">
          لا توجد طلبات في هذا القسم حالياً.
        </div>
      )}

      {/* نافذة التسليم */}
      {deliveringOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleDeliverSubmit} className="w-full max-w-lg bg-bazaar-card rounded-3xl border border-bazaar-gold/50 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold font-cairo text-white">تسليم بيانات: {deliveringOrder.itemName}</h3>
                <p className="text-xs text-slate-400">
                  طلب #{deliveringOrder.orderNumber} • العميل: {deliveringOrder.userName}
                </p>
              </div>
              <button type="button" onClick={() => setDeliveringOrder(null)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">البريد الإلكتروني / الحساب:</label>
              <input value={delivery.email} onChange={e => setDelivery({ ...delivery, email: e.target.value })} className={`${field} font-mono`} dir="ltr" />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">كلمة المرور:</label>
              <input value={delivery.password} onChange={e => setDelivery({ ...delivery, password: e.target.value })} className={`${field} font-mono text-amber-300`} dir="ltr" />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">كود الترخيص أو رابط التفعيل (اختياري):</label>
              <input value={delivery.licenseKey} onChange={e => setDelivery({ ...delivery, licenseKey: e.target.value })} className={`${field} font-mono`} dir="ltr" />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">تعليمات التشغيل للعميل:</label>
              <textarea rows={3} value={delivery.instructions} onChange={e => setDelivery({ ...delivery, instructions: e.target.value })} className={field} />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setDeliveringOrder(null)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>اعتماد وتسليم الحساب</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* نافذة تعديل الطلب */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="w-full max-w-lg bg-bazaar-card rounded-3xl border border-white/20 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold font-cairo text-white">تعديل الطلب #{editingOrder.orderNumber}</h3>
              <button type="button" onClick={() => setEditingOrder(null)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">اسم الخدمة / المنتج</label>
              <input value={editForm.itemName} onChange={e => setEditForm({ ...editForm, itemName: e.target.value })} className={field} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">المدة</label>
                <input value={editForm.variantDuration} onChange={e => setEditForm({ ...editForm, variantDuration: e.target.value })} className={field} />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">الكود</label>
                <input value={editForm.variantCode} onChange={e => setEditForm({ ...editForm, variantCode: e.target.value })} className={field} dir="ltr" />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">السعر (ج.م)</label>
                <input type="number" step="any" min={0} value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} className={field} />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">الحالة</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as OrderStatus })} className={field}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">ملاحظة إدارية (تظهر للعميل)</label>
              <textarea rows={2} value={editForm.adminNote} onChange={e => setEditForm({ ...editForm, adminNote: e.target.value })} className={field} />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setEditingOrder(null)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* نافذة إنشاء طلب يدوي */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-lg bg-bazaar-card rounded-3xl border border-bazaar-teal/50 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold font-cairo text-white">إضافة طلب يدوي لعميل</h3>
              <button type="button" onClick={() => setIsCreating(false)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">العميل *</label>
              <select required value={createForm.userId} onChange={e => setCreateForm({ ...createForm, userId: e.target.value })} className={field}>
                <option value="">— اختر العميل —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.phone} (رصيد: {u.balance} ج.م)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">نوع المنتج</label>
                <select
                  value={createForm.itemType}
                  onChange={e => setCreateForm({ ...createForm, itemType: e.target.value as 'service' | 'bundle', itemId: '', itemName: '' })}
                  className={field}
                >
                  <option value="service">خدمة / اشتراك</option>
                  <option value="bundle">عرض / باقة</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">اختر من القائمة</label>
                <select value={createForm.itemId} onChange={e => handlePickItem(e.target.value)} className={field}>
                  <option value="">— اختياري —</option>
                  {(createForm.itemType === 'service' ? services : bundles).map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">اسم المنتج في الطلب *</label>
              <input required value={createForm.itemName} onChange={e => setCreateForm({ ...createForm, itemName: e.target.value })} className={field} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">المدة</label>
                <input value={createForm.variantDuration} onChange={e => setCreateForm({ ...createForm, variantDuration: e.target.value })} className={field} />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">الكود</label>
                <input value={createForm.variantCode} onChange={e => setCreateForm({ ...createForm, variantCode: e.target.value })} className={field} dir="ltr" />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">السعر (ج.م)</label>
                <input type="number" step="any" min={0} value={createForm.price} onChange={e => setCreateForm({ ...createForm, price: Number(e.target.value) })} className={field} />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">حالة الطلب</label>
              <select value={createForm.status} onChange={e => setCreateForm({ ...createForm, status: e.target.value as OrderStatus })} className={field}>
                {STATUS_OPTIONS.filter(s => s !== 'cancelled').map(s => (
                  <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs cursor-pointer p-3 rounded-xl bg-bazaar-bg/70 border border-white/5">
              <input
                type="checkbox"
                checked={createForm.deductBalance}
                onChange={e => setCreateForm({ ...createForm, deductBalance: e.target.checked })}
                className="w-4 h-4 rounded accent-bazaar-gold"
              />
              <span className="text-slate-300 font-semibold">خصم قيمة الطلب من رصيد محفظة العميل</span>
            </label>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">ملاحظة إدارية</label>
              <input value={createForm.adminNote} onChange={e => setCreateForm({ ...createForm, adminNote: e.target.value })} className={field} />
            </div>

            {createMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                createMsg.success ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
              }`}>
                {createMsg.message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-teal to-emerald-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>إنشاء الطلب</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
