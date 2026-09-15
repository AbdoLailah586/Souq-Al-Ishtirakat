import React from 'react';
import { Service } from '../types';
import { useStore } from '../context/StoreContext';
import { minEffectivePrice, hasAnyOffer, effectivePrice, isOfferActive } from '../utils/pricing';
import { productRating, formatCount } from '../utils/productMeta';
import { StarRating } from './StarRating';

export const ProductTile: React.FC<{ service: Service; compact?: boolean }> = ({ service, compact }) => {
  const { openProduct, addToCart } = useStore();
  const { rating, count } = productRating(service.id);
  const price = minEffectivePrice(service.variants);
  const popular = service.variants.find(v => v.isPopular) || service.variants[0];
  const offer = hasAnyOffer(service.variants);

  return (
    <article className={`bg-white rounded-sm p-3.5 flex flex-col justify-between transition-all ${
      compact 
        ? 'min-w-[180px] w-[180px] border border-transparent hover:border-slate-200' 
        : 'h-full border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'
    }`}>
      <button type="button" onClick={() => openProduct(service)} className="text-right">
        <div className={`${compact ? 'h-36' : 'h-44'} bg-white flex items-center justify-center mb-2`}>
          {service.imageUrl ? (
            <img src={service.imageUrl} alt={service.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-4xl">📦</div>
          )}
        </div>
        {offer && (
          <span className="inline-block text-[11px] font-bold bg-[#CC0C39] text-white px-1.5 py-0.5 mb-1">عرض اليوم</span>
        )}
        <h3 className="text-[13px] leading-5 text-[#0F1111] line-clamp-2 hover:text-amazon-linkHover min-h-[40px]">
          {service.name} {service.englishName && service.englishName !== service.name ? `— ${service.englishName}` : ''}
        </h3>
      </button>
      <div className="flex items-center gap-1 mt-1">
        <StarRating rating={rating} />
        <button type="button" onClick={() => openProduct(service)} className="text-xs amazon-link">
          {formatCount(count)}
        </button>
      </div>
      <div className="mt-1">
        <span className="text-[11px] text-amazon-muted">ج.م</span>
        <span className="text-[21px] leading-none amazon-price font-normal mx-0.5">{price}</span>
        {popular && isOfferActive(popular) && (
          <span className="text-xs text-amazon-muted line-through">{popular.price} ج.م</span>
        )}
      </div>
      <p className="text-[11px] text-amazon-muted mt-1">توصيل رقمي خلال {service.deliveryTime?.split('(')[0] || 'ساعات'}</p>
      <button
        type="button"
        onClick={() =>
          addToCart({
            itemType: 'service',
            itemId: service.id,
            variantId: popular?.id,
            quantity: 1
          })
        }
        className="mt-2 w-full btn-cart rounded-full py-1.5 text-xs font-semibold"
      >
        أضف إلى السلة
      </button>
    </article>
  );
};
