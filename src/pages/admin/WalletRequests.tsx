import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Wallet, 
  Check, 
  X, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  Eye, 
  MessageCircle,
  ExternalLink,
  User,
  Phone
} from 'lucide-react';

export const WalletRequests: React.FC = () => {
  const { transactions, approveTopUp, rejectTopUp } = useStore();
  const [filter, setFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const deposits = transactions.filter(t => t.type === 'deposit');
  const filtered = deposits.filter(t => filter === 'all' || t.status === filter);

  const handleApprove = (id: string, amount: number, userName: string) => {
    if (window.confirm(`هل أنت متأكد من قبول طلب الشحن وإضافة ${amount} ج.م إلى محفظة ${userName}؟`)) {
      approveTopUp(id);
      alert(`تم شحن المحفظة بنجاح بمبلغ ${amount} ج.م.`);
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt('يرجى كتابة سبب الرفض (سيظهر للعميل):', 'لم يتم استلام المبلغ في الحساب');
    if (reason !== null) {
      rejectTopUp(id, reason);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-base font-bold font-cairo text-white">
            طلبات شحن المحفظة ومراجعة الإيصالات ({deposits.length})
          </h2>
          <p className="text-xs text-slate-400">
            راجع إيصالات التحويل عبر انستاباي وفودافون كاش واعتمد الرصيد للعميل فوراً.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-bazaar-bg p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filter === 'pending' ? 'bg-amber-500 text-bazaar-bg' : 'text-slate-400 hover:text-white'
            }`}
          >
            بانتظار المراجعة ({deposits.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filter === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            المعتمدة ({deposits.filter(t => t.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filter === 'all' ? 'bg-bazaar-gold text-bazaar-bg' : 'text-slate-400 hover:text-white'
            }`}
          >
            جميع الطلبات ({deposits.length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(req => (
            <div
              key={req.id}
              className={`p-6 rounded-3xl bg-bazaar-card border transition-all ${
                req.status === 'pending'
                  ? 'border-bazaar-teal/40 shadow-glow-teal'
                  : 'border-white/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Receipt Thumbnail if present */}
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
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-slate-500 shrink-0 text-center p-1">
                      بدون صورة
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-cairo text-amber-300">
                        {req.amount} ج.م
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 font-semibold">
                        عبر {req.method === 'instapay' ? 'Instapay ⚡' : 'فودافون كاش 📱'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-200">
                        <User className="w-3.5 h-3.5 text-bazaar-gold" />
                        <strong>العميل:</strong> {req.userName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <Phone className="w-3.5 h-3.5 text-bazaar-teal" />
                        <strong>رقم المحول:</strong> {req.senderPhone || 'غير محدد'}
                      </span>
                      {req.referenceNumber && (
                        <span>• مرجع: <strong className="text-white font-mono">{req.referenceNumber}</strong></span>
                      )}
                      <span>• التاريخ: {new Date(req.createdAt).toLocaleString('ar-EG')}</span>
                    </div>

                    {req.adminNote && (
                      <p className="text-xs text-rose-300 mt-1">
                        <strong>ملاحظة الرفض:</strong> {req.adminNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  <a
                    href={`https://wa.me/${(req.senderPhone || req.userPhone).replace(/^0/, '20')}?text=${encodeURIComponent(`مرحباً ${req.userName}، بخصوص طلب شحن محفظتك بمبلغ ${req.amount} ج.م في موقع سوق الاشتراكات.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
                    title="مراسلة العميل"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">واتساب</span>
                  </a>

                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id, req.amount, req.userName)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
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
                      <span>تم الشحن وإضافة الرصيد</span>
                    </span>
                  ) : (
                    <span className="text-xs text-rose-400 font-bold bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-500/30">
                      طلب مرفوض
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 p-8 rounded-3xl bg-bazaar-card/40 border border-white/5 text-slate-400 text-xs">
          لا توجد طلبات شحن في هذا القسم حالياً.
        </div>
      )}

      {/* Full Size Receipt Modal */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedReceipt(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-bazaar-card rounded-3xl p-3 border border-bazaar-gold">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 bg-black/80 text-white rounded-full p-2 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedReceipt} alt="Full Receipt" className="w-full h-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
