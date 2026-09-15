import React, { useState } from 'react';
import { Service } from '../types';
import { useStore } from '../context/StoreContext';
import { minEffectivePrice, hasAnyOffer, isOfferActive } from '../utils/pricing';
import { productRating, formatCount } from '../utils/productMeta';
import { StarRating } from './StarRating';
import { ShoppingCart, Zap, Sparkles } from 'lucide-react';

export const ProductTile: React.FC<{ service: Service; compact?: boolean }> = ({ service, compact }) => {
  const { openProduct, addToCart } = useStore();
  const { rating, count } = productRating(service.id);
  const price = minEffectivePrice(service.variants);
  const popular = service.variants.find(v => v.isPopular) || service.variants[0];
  const offer = hasAnyOffer(service.variants);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      itemType: 'service',
      itemId: service.id,
      variantId: popular?.id,
      quantity: 1
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article
      className={`group bg-white dark:bg-[#161538] rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 ${
        compact 
          ? 'min-w-[190px] w-[190px] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 dark:hover:border-bazaar-gold/50 shadow-sm hover:shadow-md' 
          : 'h-full border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 dark:hover:border-bazaar-gold/50 shadow-sm hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div onClick={() => openProduct(service)} className="cursor-pointer text-right">
        {/* Product Image Stage */}
        <div className={`relative ${compact ? 'h-36' : 'h-44'} rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 flex items-center justify-center p-3 mb-3 overflow-hidden transition-colors group-hover:border-slate-300 dark:group-hover:border-white/20`}>
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500" 
              loading="lazy"
            />
          ) : (
            <div className="text-4xl">📦</div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10 pointer-events-none">
            {offer && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>عرض حصري</span>
              </span>
            )}
            {service.badge && !offer && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                {service.badge}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amazon-orange dark:group-hover:text-bazaar-gold transition-colors min-h-[40px] leading-snug">
          {service.name} {service.englishName && service.englishName !== service.name ? `— ${service.englishName}` : ''}
        </h3>
      </div>

      <div className="pt-2">
        {/* Rating */}
        <div className="flex items-center gap-1.5 pb-1">
          <StarRating rating={rating} size="sm" />
          <button type="button" onClick={() => openProduct(service)} className="text-[11px] text-amazon-link dark:text-teal-400 hover:underline">
            ({formatCount(count)})
          </button>
        </div>

        {/* Price Box */}
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">ج.م</span>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400 leading-none">{price}</span>
          {popular && isOfferActive(popular) && (
            <span className="text-xs text-slate-400 dark:text-slate-500 line-through mr-1 font-medium">{popular.price} ج.م</span>
          )}
        </div>

        {/* Delivery Tag */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="truncate">تسليم خلال {service.deliveryTime?.split('(')[0].trim() || 'ساعات'}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`mt-3 w-full rounded-full py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
            added 
              ? 'bg-emerald-600 text-white' 
              : 'btn-cart text-[#0F1111] hover:shadow-md'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{added ? 'تمت الإضافة ✓' : 'أضف إلى السلة'}</span>
        </button>
      </div>
    </article>
  );
};
