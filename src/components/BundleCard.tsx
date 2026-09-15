import React, { useState } from 'react';
import { Bundle } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { effectivePrice, isOfferActive, discountPercent } from '../utils/pricing';
import { productRating, formatCount } from '../utils/productMeta';
import { StarRating } from './StarRating';
import { Check, Sparkles, ShoppingCart, ArrowLeft, Gift } from 'lucide-react';

interface BundleCardProps {
  bundle: Bundle;
}

export const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const { addToCart, openBundleProduct } = useStore();
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
    <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 dark:hover:border-bazaar-gold/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
      
      {/* Top Banner Image with 3D Artwork */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-white/10">
        {bundle.imageUrl ? (
          <img
            src={bundle.imageUrl}
            alt={bundle.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-slate-900 flex items-center justify-center">
            <Gift className="w-16 h-16 text-amber-400 opacity-60" />
          </div>
        )}

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Code and Badge Top Bar */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10">
          <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
            كود: {bundle.code}
          </span>
          {bundle.badge && (
            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 stroke-[3]" />
              <span>{bundle.badge}</span>
            </span>
          )}
        </div>

        {/* Offer Discount Ribbon Over Image */}
        {onOffer && (
          <div className="absolute bottom-2.5 right-3 bg-gradient-to-r from-[#CC0C39] to-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{bundle.offerLabel || 'عرض خاص'} — خصم {discountPercent(bundle)}%</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Rating */}
          <button
            type="button"
            onClick={() => openBundleProduct(bundle)}
            className="text-right block w-full group/title"
          >
            <h3 className="text-lg font-bold font-cairo text-slate-900 dark:text-white group-hover/title:text-amazon-orange dark:group-hover/title:text-bazaar-gold transition-colors leading-snug">
              {bundle.name}
            </h3>
          </button>

          <div className="flex items-center gap-2 pt-1 pb-2.5">
            <StarRating rating={rating} size="sm" />
            <button
              type="button"
              onClick={() => openBundleProduct(bundle)}
              className="text-xs text-amazon-link dark:text-teal-400 hover:underline"
            >
              ({formatCount(count)} تقييم معتمد)
            </button>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5 line-clamp-2">
            {bundle.description}
          </p>

          {/* Bundled Items Rounded Box */}
          <div className="bg-slate-50/80 dark:bg-white/[0.04] rounded-2xl p-3 border border-slate-200/60 dark:border-white/5 space-y-1.5 mb-4">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              <span>محتويات الباقة الرسمية:</span>
            </div>
            {(bundle.componentsList || []).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-300/40">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="font-medium text-[11px] sm:text-xs truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Purchase Buttons */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ج.م</span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400 leading-none">
                  {finalPrice}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through mr-1">
                  {bundle.price} ج.م
                </span>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <span>توفير {bundle.savings} ج.م مقارنة بالشراء المنفصل</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openBundleProduct(bundle)}
              className="text-xs text-amazon-link dark:text-teal-400 hover:underline font-semibold flex items-center gap-0.5"
            >
              <span>التفاصيل</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openBundleProduct(bundle)}
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors"
            >
              عرض الباقة
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className={`w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'btn-cart text-[#0F1111] hover:shadow-md active:scale-95'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{added ? 'تمت الإضافة ✓' : 'أضف للسلة'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
