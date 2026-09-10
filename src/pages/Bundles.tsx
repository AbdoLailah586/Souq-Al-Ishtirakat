import React from 'react';
import { useStore } from '../context/StoreContext';
import { BundleCard } from '../components/BundleCard';
import { Gift, Sparkles, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export const Bundles: React.FC = () => {
  const { bundles } = useStore();
  const visibleBundles = bundles.filter(b => !b.isHidden);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-teal/15 text-bazaar-teal text-xs font-bold border border-bazaar-teal/30">
          <Gift className="w-3.5 h-3.5" />
          <span>عروض التوفير الشاملة</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-cairo text-white">
          الباقات والعروض المدمجة
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          اشتراكات متعددة مختارة بعناية للمبرمجين، الطلاب، التجار، وصناع المحتوى بأعلى نسبة توفير وضمان موحد.
        </p>
      </div>

      {/* Grid of All 6 Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBundles.map(bundle => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>

      {/* Why Buy Bundles Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-bazaar-card via-bazaar-surface to-bazaar-card border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center mx-auto md:mr-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">توفير مالي مضمون</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            شراء الباقة يوفر لك ما يصل إلى 120 جنيه مقارنة بشراء كل اشتراك منفصلاً.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center mx-auto md:mr-0">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">تفعيل وتسليم متزامن</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            يتم تسليم وتفعيل كافة حسابات الباقة معاً في لوحة طلباتك في نفس التوقيت.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-bazaar-purple/15 text-bazaar-purple flex items-center justify-center mx-auto md:mr-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">ضمان ذهبي موحد</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            دعم فني واستبدال فوري يشمل كافة مكونات الباقة بدون أي استثناء.
          </p>
        </div>
      </div>
    </div>
  );
};
