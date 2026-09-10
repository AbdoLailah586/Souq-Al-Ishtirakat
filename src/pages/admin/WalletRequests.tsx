import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet, Check, X, CheckCircle2, Eye, MessageCircle, User, Phone,
  Plus, Trash2, Search, Search as SearchIcon
} from 'lucide-react';

export const WalletRequests: React.FC = () => {
  const { transactions, approveTopUp, rejectTopUp, adminAddTransaction, deleteTransaction } = useStore();
  const { users } = useAuth();

  const [filter, setFilter] = useState<'pending' | 'completed' | 'rejected' | 'all'>('pending');
  const [typeFilter, setTypeFilter] = useState<'deposit' | 'all'>('deposit');
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({
    userId: '', type: 'deposit' as 'deposit' | 'refund' | 'adjustment' | 'purchase',
    amount: 100, description: '', applyToBalance: true
  });
  const [addMsg, setAddMsg] = useState<{ success: boolean; message: string } | null>(null);

  const scoped = useMemo(
    () => transactions.filter(t => (typeFilter === 'deposit' ? t.type === 'deposit' : true)),
    [transactions, typeFilter]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scoped
      .filter(t => filter === 'all' || t.status === filter)
      .filter(t => !q || t.userName.toLowerCase().includes(q) || (t.senderPhone || '').includes(q) || t.userPhone.includes(q));
  }, [scoped, filter, search]);

  const countOf = (s: string) => scoped.filter(t => t.status === s).length;

  const handleApprove = (id: string, amount: number, userName: string) => {
    if (window.confirm(`قبول طلب الشحن وإضافة ${amount} ج.م إلى محفظة ${userName}؟`)) approveTopUp(id);
  };

  const handleReject = (id: string) => {
    const reason = prompt('سبب الرفض (سيظهر للعميل):', 'لم يتم استلام المبلغ في الحساب');
    if (reason !== null) rejectTopUp(id, reason);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await adminAddTransaction({ ...addForm, amount: Number(addForm.amount) || 0 });
    setAddMsg(res);
    if (res.success) {
      setTimeout(() => {
        setIsAdding(false);
        setAddMsg(null);
        setAddForm({ userId: '', type: 'deposit', amount: 100, description: '', applyToBalance: true });
      }, 1000);
    }
  };

  const field =
    'w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-2.5 text-xs text-white focus:outline-none transition-colors';

  const typeLabel: Record<string, string> = {
    deposit: 'شحن رصيد', purchase: 'عملية شراء', refund: 'استرداد', adjustment: 'تعديل إداري'
  };

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-base font-bold font-cairo text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-bazaar-teal" />
            <span>المحفظة وطلبات الشحن ({scoped.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            راجع إيصالات انستاباي وفودافون كاش، أو أضف/اخصم رصيداً يدوياً لأي عميل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالعميل أو الرقم..."
              className="bg-bazaar-bg border border-white/10 rounded-xl py-2 pr-9 pl-3 text-xs text-white focus:outline-none focus:border-bazaar-gold w-48"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as 'deposit' | 'all')}
            className="bg-bazaar-bg border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
          >
            <option value="deposit">طلبات الشحن فقط</option>
            <option value="all">كل العمليات المالية</option>
          </select>

          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>عملية رصيد يدوية</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-bazaar-bg p-1 rounded-xl border border-white/5 text-xs flex-wrap">
        {([
          ['pending', 'بانتظار المراجعة', 'bg-amber-500 text-bazaar-bg'],
          ['completed', 'المعتمدة', 'bg-emerald-600 text-white'],
          ['rejected', 'المرفوضة', 'bg-rose-600 text-white'],
          ['all', 'الكل', 'bg-bazaar-gold text-bazaar-bg']
        ] as const).map(([k, label, active]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-lg font-bold ${filter === k ? active : 'text-slate-400 hover:text-white'}`}
          >
            {label} ({k === 'all' ? scoped.length : countOf(k)})
          </button>
        ))}
      </div>

      {/* القائمة */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(req => (
            <div
              key={req.id}
              className={`p-5 rounded-3xl bg-bazaar-card border transition-all ${
                req.status === 'pending' ? 'border-bazaar-teal/40' : 'border-white/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {req.receiptImage ? (
                    <div
                      onClick={() => setSelectedReceipt(req.receiptImage!)}
                      className="w-16 h-16 rounded-2xl overflow-hidden border border-bazaar-gold/50 cursor-pointer shrink-0 relative group"
                      title="اضغط لتكبير الإيصال"
                    >
                      <img src={req.receiptImage} alt="Receipt" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-slate-500 shrink-0 text-center p-1">
                      بدون صورة
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-black font-cairo text-amber-300">{req.amount} ج.م</span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 font-semibold">
                        {typeLabel[req.type] || req.type}
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300">
                        {req.method === 'instapay' ? 'Instapay ⚡' : req.method === 'vodafone_cash' ? 'فودافون كاش 📱' : req.method === 'admin' ? 'إداري 🛠️' : 'المحفظة'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-200">
                        <User className="w-3.5 h-3.5 text-bazaar-gold" />
                        <strong>{req.userName}</strong>
                      </span>
                      {req.senderPhone && (
                        <span className="flex items-center gap-1 text-slate-200" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-bazaar-teal" />
                          {req.senderPhone}
                        </span>
                      )}
                      {req.referenceNumber && <span>• مرجع: <strong className="text-white font-mono">{req.referenceNumber}</strong></span>}
                      <span>• {new Date(req.createdAt).toLocaleString('ar-EG')}</span>
                    </div>

                    <p className="text-[11px] text-slate-400">{req.description}</p>
                    {req.adminNote && <p className="text-[11px] text-rose-300"><strong>ملاحظة:</strong> {req.adminNote}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <a
                    href={`https://wa.me/${(req.senderPhone || req.userPhone).replace(/^0/, '20')}?text=${encodeURIComponent(
                      `مرحباً ${req.userName}، بخصوص عملية محفظتك بمبلغ ${req.amount} ج.م في موقع سوق الاشتراكات.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30"
                    title="مراسلة العميل"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id, req.amount, req.userName)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>قبول وإضافة الرصيد</span>
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>رفض</span>
                      </button>
                    </>
                  ) : req.status === 'completed' ? (
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>مكتملة</span>
                    </span>
                  ) : (
                    <span className="text-xs text-rose-400 font-bold bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-500/30">
                      مرفوضة
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm('حذف هذه العملية من السجل نهائياً؟ (لن يتغير رصيد العميل)')) deleteTransaction(req.id);
                    }}
                    className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 border border-rose-500/20"
                    title="حذف من السجل"
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
          لا توجد عمليات في هذا القسم حالياً.
        </div>
      )}

      {/* نافذة عملية يدوية */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddSubmit} className="w-full max-w-md bg-bazaar-card rounded-3xl border border-emerald-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold font-cairo text-white">عملية رصيد يدوية</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">العميل *</label>
              <select required value={addForm.userId} onChange={e => setAddForm({ ...addForm, userId: e.target.value })} className={field}>
                <option value="">— اختر العميل —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} — رصيد: {u.balance} ج.م</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">نوع العملية</label>
                <select value={addForm.type} onChange={e => setAddForm({ ...addForm, type: e.target.value as typeof addForm.type })} className={field}>
                  <option value="deposit">إضافة رصيد (شحن)</option>
                  <option value="refund">استرداد</option>
                  <option value="purchase">خصم (عملية شراء)</option>
                  <option value="adjustment">تعديل إداري</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">المبلغ (ج.م) *</label>
                <input required type="number" step="any" min={1} value={addForm.amount} onChange={e => setAddForm({ ...addForm, amount: Number(e.target.value) })} className={field} />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">وصف العملية</label>
              <input value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} placeholder="مثال: تحويل انستاباي مؤكد" className={field} />
            </div>

            <label className="flex items-center gap-2 text-xs cursor-pointer p-3 rounded-xl bg-bazaar-bg/70 border border-white/5">
              <input
                type="checkbox"
                checked={addForm.applyToBalance}
                onChange={e => setAddForm({ ...addForm, applyToBalance: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span className="text-slate-300 font-semibold">تطبيق العملية فعلياً على رصيد المحفظة</span>
            </label>

            {addMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                addMsg.success ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
              }`}>
                {addMsg.message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs">
                تنفيذ العملية
              </button>
            </div>
          </form>
        </div>
      )}

      {/* معاينة الإيصال */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setSelectedReceipt(null)}>
          <div className="relative max-w-2xl max-h-[85vh] bg-bazaar-card rounded-3xl p-3 border border-bazaar-gold">
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-4 right-4 bg-black/80 text-white rounded-full p-2 hover:bg-black">
              <X className="w-5 h-5" />
            </button>
            <img src={selectedReceipt} alt="Full Receipt" className="w-full h-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
