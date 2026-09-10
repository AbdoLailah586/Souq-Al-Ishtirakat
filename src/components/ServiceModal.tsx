import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Wallet, 
  Plus, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

export const ServiceModal: React.FC = () => {
  const { selectedService, closeServiceModal, purchaseItem, openTopUpModal } = useStore();
  const { user } = useAuth();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [customerNote, setCustomerNote] = useState('');
  const [orderStatus, setOrderStatus] = useState<{ success: boolean; message: string; orderId?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedService) return null;

  const currentVariant = selectedService.variants[selectedVariantIndex] || selectedService.variants[0];
  const userBalance = user?.balance || 0;
  const isBalanceEnough = userBalance >= currentVariant.price;

  const handlePurchase = () => {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً للمتابعة.');
      return;
    }

    if (!isBalanceEnough) {
      openTopUpModal();
      return;
    }

    setIsSubmitting(true);
    const result = purchaseItem({
      itemType: 'service',
      itemId: selectedService.id,
      itemName: selectedService.name,
      variantDuration: currentVariant.duration,
      variantCode: currentVariant.code,
      price: currentVariant.price,
      customerNote
    });

    setOrderStatus(result);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-bazaar-card rounded-3xl border border-bazaar-gold/30 shadow-2xl overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-bazaar-surface to-bazaar-card p-6 border-b border-white/10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-bazaar-gold/15 text-bazaar-gold font-bold border border-bazaar-gold/30">
                كود الخدمة: {currentVariant.code}
              </span>
              {selectedService.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-bazaar-teal/15 text-bazaar-teal font-bold border border-bazaar-teal/30">
                  {selectedService.badge}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black font-cairo text-white">
              {selectedService.name}
            </h2>
            {selectedService.englishName && (
              <p className="text-xs text-slate-400 font-medium">
                {selectedService.englishName}
              </p>
            )}
          </div>

          <button
            onClick={closeServiceModal}
            className="w-9 h-9 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Duration Selector (if multiple) */}
          {selectedService.variants.length > 1 && (
            <div className="bg-bazaar-bg/80 p-4 rounded-2xl border border-white/5">
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-bazaar-gold" />
                <span>اختر الباقة / المدة المطلوبة:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setOrderStatus(null);
                    }}
                    className={`p-3 rounded-xl text-right transition-all border flex items-center justify-between ${
                      selectedVariantIndex === idx
                        ? 'bg-bazaar-gold/20 border-bazaar-gold text-white shadow-md'
                        : 'bg-bazaar-card/60 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{v.duration}</div>
                      <div className="text-[10px] text-slate-400">كود: {v.code}</div>
                    </div>
                    <div className="text-sm font-black text-amber-300">
                      {v.price} ج.م
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Full Numbered Features List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-cairo text-bazaar-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>الميزات والمواصفات التفصيلية:</span>
            </h3>
            <div className="space-y-2.5">
              {selectedService.features.map((feat, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notices */}
          {selectedService.note && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">تنبيه هام للضمان: </span>
                <span>{selectedService.note}</span>
              </div>
            </div>
          )}

          {/* Execution Note */}
          {selectedService.executionNote && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">طريقة الاستلام والتنفيذ: </span>
                <span>{selectedService.executionNote}</span>
              </div>
            </div>
          )}

          {/* Customer Input Note */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              ملاحظاتك أو بيانات التفعيل (اختياري - مثل إيميلك للتفعيل أو رقم الواتساب):
            </label>
            <textarea
              value={customerNote}
              onChange={e => setCustomerNote(e.target.value)}
              placeholder="مثال: يرجى التفعيل على إيميلي الشخصي: example@gmail.com"
              rows={2}
              className="w-full bg-bazaar-bg/90 border border-white/10 focus:border-bazaar-gold rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Result Alert */}
          {orderStatus && (
            <div className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-3 ${
              orderStatus.success
                ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                : 'bg-rose-950/80 text-rose-200 border border-rose-500/50'
            }`}>
              {orderStatus.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed flex-1">
                <p>{orderStatus.message}</p>
                {orderStatus.success && (
                  <p className="mt-2 text-[11px] text-emerald-300 font-normal">
                    يمكنك الآن متابعة حالة طلبك واستلام البيانات فوراً من قسم «طلباتي».
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Purchase Action Bar */}
        <div className="bg-bazaar-surface p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
            <div>
              <div className="text-[11px] text-slate-400">السعر المطلوب</div>
              <div className="text-2xl font-black text-white font-cairo">
                {currentVariant.price} <span className="text-xs text-slate-300">ج.م</span>
              </div>
            </div>

            {user && (
              <div className="border-r border-white/10 pr-4">
                <div className="text-[11px] text-slate-400">رصيد محفظتك</div>
                <div className={`text-sm font-bold ${isBalanceEnough ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {userBalance.toLocaleString()} ج.م
                </div>
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {!isBalanceEnough && (
              <button
                onClick={openTopUpModal}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-bazaar-card hover:bg-white/10 border border-bazaar-gold/40 text-bazaar-gold text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>شحن رصيد إضافي</span>
              </button>
            )}

            <button
              onClick={handlePurchase}
              disabled={isSubmitting || (orderStatus?.success ?? false)}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                isBalanceEnough
                  ? 'bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg shadow-bazaar-gold/25'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isBalanceEnough ? 'تأكيد الشراء من الرصيد' : 'شحن المحفظة لإتمام الشراء'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
