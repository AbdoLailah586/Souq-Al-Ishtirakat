import React, { useState } from 'react';
import { Bundle } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Gift, Check, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';

interface BundleCardProps {
  bundle: Bundle;
}

export const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const { purchaseItem, openTopUpModal } = useStore();
  const { user } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleBuy = () => {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (user.balance < bundle.price) {
      openTopUpModal();
      return;
    }

    const confirmBuy = window.confirm(`هل ترغب في تأكيد شراء «${bundle.name}» بمبلغ ${bundle.price} ج.م من رصيدك؟`);
    if (!confirmBuy) return;

    setIsPurchasing(true);
    const res = purchaseItem({
      itemType: 'bundle',
      itemId: bundle.id,
      itemName: bundle.name,
      variantCode: bundle.code,
      price: bundle.price,
    });

    setOrderResult(res);
    setIsPurchasing(false);

    if (res.success) {
      setTimeout(() => setOrderResult(null), 5000);
    }
  };

  return (
    <div className="relative rounded-3xl p-6 bg-gradient-to-br from-bazaar-card/90 via-bazaar-surface to-bazaar-card/90 border-2 border-bazaar-gold/40 hover:border-bazaar-gold transition-all duration-300 shadow-xl hover:shadow-glow-gold flex flex-col justify-between group">
      {/* Top Floating Badge */}
      <div className="absolute -top-3 left-6 bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>وفر {bundle.savings} جنيه</span>
      </div>

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold text-bazaar-teal px-2 py-0.5 rounded-full bg-bazaar-teal/10 border border-bazaar-teal/30">
              كود العرض: {bundle.code}
            </span>
            <h3 className="text-xl font-bold font-cairo text-white mt-1 group-hover:text-bazaar-gold transition-colors">
              {bundle.name}
            </h3>
            {bundle.badge && (
              <p className="text-xs font-semibold text-amber-300 mt-0.5">
                ✨ {bundle.badge}
              </p>
            )}
          </div>
          <div className="w-11 h-11 rounded-2xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center shrink-0 border border-bazaar-gold/30">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {bundle.description}
        </p>

        {/* Bundled Items Box */}
        <div className="bg-bazaar-bg/70 rounded-2xl p-3.5 border border-white/5 space-y-2 mb-4">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            محتويات الباقة:
          </span>
          {bundle.componentsList.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
              <div className="w-4 h-4 rounded-full bg-bazaar-gold/20 text-bazaar-gold flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Purchase Button */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] text-slate-400">السعر الإجمالي للباقة</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-cairo">
                {bundle.price}
              </span>
              <span className="text-xs text-slate-300">جنيه مصري</span>
              <span className="text-xs text-slate-500 line-through">
                {Math.round(bundle.originalPrice)} ج.م
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded-xl">
            خصم فوري
          </span>
        </div>

        {orderResult && (
          <div className={`p-2.5 rounded-xl text-xs font-bold mb-2 text-center ${
            orderResult.success ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40' : 'bg-rose-900/60 text-rose-200 border border-rose-500/40'
          }`}>
            {orderResult.message}
          </div>
        )}

        <button
          onClick={handleBuy}
          disabled={isPurchasing}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-bazaar-gold via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-sm transition-all duration-200 shadow-lg shadow-bazaar-gold/20 active:scale-98 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          <span>اطلب الباقة الآن من الرصيد</span>
        </button>
      </div>
    </div>
  );
};
