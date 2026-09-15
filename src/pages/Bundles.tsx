import React from 'react';
import { useStore } from '../context/StoreContext';
import { BundleCard } from '../components/BundleCard';
import { Gift, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Bundles: React.FC = () => {
  const { bundles, navigate } = useStore();
  const visibleBundles = bundles.filter(b => !b.isHidden);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">عروض اليوم وباقات التوفير</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC0C39]">
            <Gift className="w-3.5 h-3.5" />
            <span>عروض التوفير الشاملة — وفر حتى 120 جنيه</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cairo text-[#0F1111]">
            باقات التوفير والعروض المدمجة
          </h1>
          <p className="text-xs text-amazon-muted max-w-xl">
            اشتراكات متعددة مختارة بعناية للمبرمجين، الطلاب، التجار، وصناع المحتوى بأعلى نسبة توفير وضمان ذهبي موحد.
          </p>
        </div>

        <div className="text-xs text-amazon-muted bg-slate-50 p-3 rounded border border-slate-200 text-center shrink-0">
          <span className="block font-bold text-[#0F1111] text-base">{visibleBundles.length}</span>
          <span>باقات موفرة متاحة</span>
        </div>
      </div>

      {/* Grid of All 6 Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleBundles.map(bundle => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>

      {/* Why Buy Bundles Banner */}
      <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amazon-orange flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] text-sm">توفير مالي مضمون</h3>
            <p className="text-xs text-amazon-muted leading-relaxed">
              شراء الباقة يوفر لك ما يصل إلى 120 جنيه مقارنة بشراء كل اشتراك منفصلاً.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] text-sm">تفعيل وتسليم متزامن</h3>
            <p className="text-xs text-amazon-muted leading-relaxed">
              يتم تسليم وتفعيل كافة حسابات الباقة معاً في لوحة طلباتك في نفس التوقيت.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] text-sm">ضمان ذهبي موحد</h3>
            <p className="text-xs text-amazon-muted leading-relaxed">
              دعم فني واستبدال فوري يشمل كافة مكونات الباقة بدون أي استثناء طوال فترة الاشتراك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
