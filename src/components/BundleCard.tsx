import React, { useState } from 'react';
import { Bundle } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { effectivePrice, isOfferActive, discountPercent, discountAmount } from '../utils/pricing';
import { productRating, formatCount } from '../utils/productMeta';
import { StarRating } from './StarRating';
import { Gift, Check, Sparkles, ShoppingCart, ArrowLeft } from 'lucide-react';

interface BundleCardProps {
  bundle: Bundle;
}

export const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const { addToCart, openBundleProduct, navigate } = useStore();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);

  const finalPrice = effectivePrice(bundle);
  const onOffer = isOfferActive(bundle);
  const { rating, count } = productRating(bundle.id);

  const handleAdd = () => {
    addToCart({
      itemType: 'bundle',
      itemId: bundle.id,
      quantity: 1
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="relative rounded-sm p-5 bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Top Floating Badge */}
      {onOffer && (
        <div className="absolute -top-3 left-4 bg-[#CC0C39] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{bundle.offerLabel || 'عرض محدود'} — خصم {discountPercent(bundle)}%</span>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
              كود: {bundle.code}
            </span>
            <button
              type="button"
              onClick={() => openBundleProduct(bundle)}
              className="text-right block mt-1"
            >
              <h3 className="text-lg font-bold font-cairo text-[#0F1111] group-hover:text-amazon-linkHover transition-colors leading-snug">
                {bundle.name}
              </h3>
            </button>
            {bundle.badge && (
              <p className="text-xs font-semibold text-amber-700 mt-0.5">
                ✨ {bundle.badge}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-2xl">
            🎁
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 pb-2">
          <StarRating rating={rating} size="sm" />
          <span className="text-xs amazon-link">{formatCount(count)} تقييم</span>
        </div>

        {/* Description */}
        <p className="text-xs text-amazon-muted mb-3 leading-relaxed line-clamp-2">
          {bundle.description}
        </p>

        {/* Bundled Items Box */}
        <div className="bg-slate-50 rounded-sm p-3 border border-slate-100 space-y-1.5 mb-4">
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            محتويات الباقة الرسمية:
          </span>
          {bundle.componentsList.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#0F1111]">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Purchase Buttons */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-amazon-muted">ج.م</span>
              <span className="text-2xl font-bold amazon-price leading-none">
                {finalPrice}
              </span>
              <span className="text-xs text-amazon-muted line-through mr-1">
                {bundle.price} ج.م
              </span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
              توفير {bundle.savings} ج.م مقابل الشراء المنفصل
            </div>
          </div>

          <button
            type="button"
            onClick={() => openBundleProduct(bundle)}
            className="text-xs amazon-link font-semibold"
          >
            التفاصيل الكاملة ›
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => openBundleProduct(bundle)}
            className="w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F1111] font-semibold text-xs transition-colors"
          >
            عرض المنتج
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'btn-cart shadow-sm active:scale-95'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{added ? 'تمت الإضافة ✓' : 'أضف للسلة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
