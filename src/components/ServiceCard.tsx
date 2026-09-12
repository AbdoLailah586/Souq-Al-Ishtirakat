import React, { useState } from 'react';
import { Service, ServiceVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { effectivePrice, isOfferActive, discountPercent, offerDaysLeft, hasAnyOffer } from '../utils/pricing';
import { 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Clock, 
  Tag, 
  ShieldCheck,
  Package,
  Zap
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { openServiceModal } = useStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const currentVariant: ServiceVariant = service.variants[selectedVariantIndex] || service.variants[0];

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'ai': return { badge: 'text-purple-300 bg-purple-900/30 border-purple-500/40', glow: 'group-hover:shadow-purple-500/20' };
      case 'design': return { badge: 'text-amber-300 bg-amber-900/30 border-amber-500/40', glow: 'group-hover:shadow-amber-500/20' };
      case 'video': return { badge: 'text-teal-300 bg-teal-900/30 border-teal-500/40', glow: 'group-hover:shadow-teal-500/20' };
      case 'entertainment': return { badge: 'text-rose-300 bg-rose-900/30 border-rose-500/40', glow: 'group-hover:shadow-rose-500/20' };
      case 'productivity': return { badge: 'text-emerald-300 bg-emerald-900/30 border-emerald-500/40', glow: 'group-hover:shadow-emerald-500/20' };
      case 'marketing': return { badge: 'text-amber-400 bg-amber-900/30 border-amber-500/40', glow: 'group-hover:shadow-amber-500/20' };
      default: return { badge: 'text-slate-300 bg-slate-800 border-slate-700', glow: 'group-hover:shadow-bazaar-gold/20' };
    }
  };

  const theme = getCategoryTheme(service.category);

  return (
    <div className={`glass-card rounded-3xl flex flex-col justify-between relative group overflow-hidden border border-white/10 hover:border-bazaar-gold/50 transition-all duration-500 hover:-translate-y-1.5 shadow-xl ${theme.glow}`}>
      
      {/* Product Image Header with Ambient Lighting & Micro-Animations */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-gradient-to-b from-slate-900 to-bazaar-bg border-b border-white/10">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bazaar-surface to-bazaar-card">
            <Sparkles className="w-12 h-12 text-bazaar-gold/40 animate-pulse" />
          </div>
        )}

        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-bazaar-bg via-transparent to-black/60 pointer-events-none" />

        {/* Animated Golden Light Sweep Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none z-10">
          {/* Warranty / Badge Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {service.badge && (
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-bazaar-gold border border-bazaar-gold/40 shadow-lg flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-bazaar-gold animate-spin-slow" />
                <span>{service.badge}</span>
              </span>
            )}
            {service.warrantyText && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                <span className="truncate max-w-[130px]">{service.warrantyText}</span>
              </span>
            )}
          </div>

          {/* Delivery speed pill */}
          {service.deliveryTime && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/15 shadow-lg flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              <span>{service.deliveryTime.split('(')[0].trim()}</span>
            </span>
          )}
        </div>

        {/* Bottom Tag over image */}
        <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between z-10 pointer-events-none">
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold backdrop-blur-md border ${theme.badge}`}>
            كود: {currentVariant.code}
          </span>
          {service.deliveryFormat && (
            <span className="text-[10px] text-slate-300 font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
              <Package className="w-2.5 h-2.5 text-bazaar-gold" />
              <span className="truncate max-w-[140px]">{service.deliveryFormat.split('(')[0].trim()}</span>
            </span>
          )}
        </div>

        {/* Special Offer Ribbon */}
        {hasAnyOffer(service.variants) && (
          <div className="absolute top-3 left-0 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-bazaar-bg text-[10px] font-black px-3 py-1 rounded-r-full shadow-xl flex items-center gap-1 animate-pulse">
            <Tag className="w-3 h-3 stroke-[3]" />
            <span>
              {service.variants.find(v => isOfferActive(v))?.offerLabel || 'عرض حصري'}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Category Info */}
          <div className="mb-2">
            <h3 className="font-black text-lg text-white font-cairo group-hover:text-bazaar-gold transition-colors leading-snug">
              {service.name}
            </h3>
            {service.englishName && (
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {service.englishName}
              </p>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3.5">
            {service.shortDescription}
          </p>

          {/* Variant Selector (if multiple options) */}
          {service.variants.length > 1 && (
            <div className="mb-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400">اختر المدة:</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {service.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-between border ${
                      selectedVariantIndex === idx
                        ? 'bg-bazaar-gold/20 text-bazaar-gold border-bazaar-gold shadow-sm'
                        : 'bg-bazaar-bg/60 text-slate-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="truncate text-[11px]">{variant.duration}</span>
                    <span className="text-[10px] font-bold flex items-center gap-1">
                      {isOfferActive(variant) && (
                        <span className="text-[9px] text-slate-500 line-through">{variant.price}</span>
                      )}
                      <span className={isOfferActive(variant) ? 'text-emerald-400' : ''}>
                        {effectivePrice(variant)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Features preview */}
          <div className="space-y-1.5 mb-4">
            {service.features.slice(0, 2).map((feat, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <div className="w-3.5 h-3.5 rounded-full bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="line-clamp-1 leading-snug text-[11px] text-slate-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Call to Action Footer */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{currentVariant.duration}</span>
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`text-xl font-black font-cairo ${
                isOfferActive(currentVariant) ? 'text-emerald-400' : 'text-white'
              }`}>
                {effectivePrice(currentVariant)}
              </span>
              <span className="text-[11px] text-slate-300">ج.م</span>
              {isOfferActive(currentVariant) && (
                <span className="text-[10px] text-slate-500 line-through">
                  {currentVariant.price} ج.م
                </span>
              )}
            </div>
            {isOfferActive(currentVariant) && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  خصم {discountPercent(currentVariant)}%
                </span>
                {offerDaysLeft(currentVariant) !== null && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    باقي {offerDaysLeft(currentVariant)} يوم
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => openServiceModal(service)}
            className="bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-bazaar-gold/15 active:scale-95 group-hover:scale-102"
          >
            <span>التفاصيل والشراء</span>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
