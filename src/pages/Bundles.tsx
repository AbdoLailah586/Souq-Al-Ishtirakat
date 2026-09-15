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
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="hover:text-amazon-orange transition-colors">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] dark:text-white font-semibold">عروض اليوم وباقات التوفير</span>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-[#161538] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div className="space-y-2 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900/50 text-xs font-bold text-[#CC0C39] dark:text-rose-400">
            <Gift className="w-3.5 h-3.5" />
            <span>عروض التوفير الشاملة — وفر حتى 120 جنيه</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cairo text-[#0F1111] dark:text-white">
            باقات التوفير والعروض المدمجة
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            اشتراكات متعددة مختارة بعناية للمبرمجين، الطلاب، التجار، وصناع المحتوى بأعلى نسبة توفير وضمان ذهبي موحد.
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shrink-0 shadow-inner">
          <span className="block font-black text-[#0F1111] dark:text-amber-400 text-2xl">{visibleBundles.length}</span>
          <span className="font-semibold">باقات موفرة متاحة</span>
        </div>
      </div>

      {/* Grid of All 6 Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBundles.map(bundle => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>

      {/* Why Buy Bundles Banner */}
      <div className="bg-white dark:bg-[#161538] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-right transition-colors">
        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/30">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amazon-orange dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] dark:text-white text-sm">توفير مالي مضمون</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              شراء الباقة يوفر لك ما يصل إلى 120 جنيه مقارنة بشراء كل اشتراك منفصلاً.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/30">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] dark:text-white text-sm">تفعيل وتسليم متزامن</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              يتم تسليم وتفعيل كافة حسابات الباقة معاً في لوحة طلباتك في نفس التوقيت.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/30">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F1111] dark:text-white text-sm">ضمان ذهبي موحد</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              دعم فني واستبدال فوري يشمل كافة مكونات الباقة بدون أي استثناء طوال فترة الاشتراك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
