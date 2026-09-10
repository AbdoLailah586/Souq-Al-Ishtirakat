import React, { useState } from 'react';
import { Service, ServiceVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Clock, 
  Tag, 
  Bot, 
  Palette, 
  Video, 
  Tv, 
  Briefcase, 
  TrendingUp,
  Zap,
  Info
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { openServiceModal } = useStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const currentVariant: ServiceVariant = service.variants[selectedVariantIndex] || service.variants[0];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ai': return 'text-bazaar-purple bg-bazaar-purple/10 border-bazaar-purple/30';
      case 'design': return 'text-bazaar-gold bg-bazaar-gold/10 border-bazaar-gold/30';
      case 'video': return 'text-bazaar-teal bg-bazaar-teal/10 border-bazaar-teal/30';
      case 'entertainment': return 'text-bazaar-pink bg-bazaar-pink/10 border-bazaar-pink/30';
      case 'productivity': return 'text-bazaar-green bg-bazaar-green/10 border-bazaar-green/30';
      case 'marketing': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      default: return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-bazaar-gold" />;
      case 'Brain': return <Bot className="w-6 h-6 text-bazaar-purple" />;
      case 'Cpu': return <Zap className="w-6 h-6 text-bazaar-teal" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Image': return <Palette className="w-6 h-6 text-bazaar-gold" />;
      case 'Layers': return <Palette className="w-6 h-6 text-rose-400" />;
      case 'PenTool': return <Palette className="w-6 h-6 text-cyan-400" />;
      case 'Figma': return <Palette className="w-6 h-6 text-purple-400" />;
      case 'Video': return <Video className="w-6 h-6 text-bazaar-teal" />;
      case 'Film': return <Tv className="w-6 h-6 text-bazaar-pink" />;
      case 'FileText': return <Briefcase className="w-6 h-6 text-bazaar-green" />;
      case 'MessageSquare': return <TrendingUp className="w-6 h-6 text-emerald-400" />;
      case 'Database': return <TrendingUp className="w-6 h-6 text-bazaar-gold" />;
      default: return <Sparkles className="w-6 h-6 text-bazaar-gold" />;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative group overflow-hidden border border-white/10 hover:border-bazaar-gold/50 transition-all duration-300">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-bazaar-gold/5 rounded-full filter blur-2xl group-hover:bg-bazaar-gold/15 transition-all"></div>

      <div>
        {/* Top Header & Badges */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-bazaar-bg/80 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              {getServiceIcon(service.iconName)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-cairo group-hover:text-bazaar-gold transition-colors leading-tight">
                {service.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${getCategoryColor(service.category)}`}>
                  كود: {currentVariant.code}
                </span>
                {service.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-bazaar-gold/20 to-amber-500/20 text-bazaar-gold font-bold border border-bazaar-gold/30">
                    {service.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
          {service.shortDescription}
        </p>

        {/* Variant Duration Pills (if multiple options) */}
        {service.variants.length > 1 && (
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              اختر المدة المطلوبة:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {service.variants.map((variant, idx) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-between border ${
                    selectedVariantIndex === idx
                      ? 'bg-bazaar-gold/20 text-bazaar-gold border-bazaar-gold shadow-sm'
                      : 'bg-bazaar-bg/60 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="truncate">{variant.duration}</span>
                  <span className="text-[11px] font-bold">{variant.price} ج.م</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features Preview (first 3 features) */}
        <div className="space-y-2 mb-5">
          {service.features.slice(0, 3).map((feat, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="line-clamp-1 leading-snug">{feat}</span>
            </div>
          ))}
          {service.features.length > 3 && (
            <p className="text-[11px] text-bazaar-gold/90 font-medium pr-6">
              + {service.features.length - 3} ميزات إضافية متقدمة
            </p>
          )}
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>المدة: {currentVariant.duration}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-white font-cairo">
              {currentVariant.price}
            </span>
            <span className="text-xs text-slate-300">جنيه مصري</span>
            {currentVariant.originalPrice && currentVariant.originalPrice < currentVariant.price && (
              <span className="text-[11px] text-slate-500 line-through">
                {Math.round(currentVariant.originalPrice)} ج.م
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => openServiceModal(service)}
          className="bg-gradient-to-r from-bazaar-cardHover to-bazaar-surface hover:from-bazaar-gold hover:to-amber-500 hover:text-bazaar-bg text-white border border-bazaar-gold/30 hover:border-transparent px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-md active:scale-95 group-hover:bg-gradient-to-r group-hover:from-bazaar-gold group-hover:to-amber-500 group-hover:text-bazaar-bg"
        >
          <span>التفاصيل والشراء</span>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>
    </div>
  );
};
