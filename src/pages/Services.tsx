import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/services';
import { minEffectivePrice, hasAnyOffer } from '../utils/pricing';
import { ProductTile } from '../components/ProductTile';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

export const Services: React.FC = () => {
  const { services, selectedCategory, setSelectedCategory, navigate } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'offers'>('default');

  const filteredServices = useMemo(() => {
    return services.filter(service => !service.isHidden).filter(service => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        service.name.toLowerCase().includes(q) ||
        (service.englishName && service.englishName.toLowerCase().includes(q)) ||
        service.shortDescription.toLowerCase().includes(q) ||
        service.variants.some(v => v.code.toLowerCase().includes(q) || v.duration.toLowerCase().includes(q))
      );

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const minPriceA = minEffectivePrice(a.variants);
      const minPriceB = minEffectivePrice(b.variants);

      if (sortBy === 'price-asc') return minPriceA - minPriceB;
      if (sortBy === 'price-desc') return minPriceB - minPriceA;
      if (sortBy === 'offers') {
        return Number(hasAnyOffer(b.variants)) - Number(hasAnyOffer(a.variants));
      }
      return 0; // default order
    });
  }, [services, selectedCategory, searchQuery, sortBy]);

  const activeCategoryInfo = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-5">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="hover:text-amazon-orange transition-colors">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] dark:text-white font-semibold">
          {selectedCategory === 'all' ? 'جميع الاشتراكات' : (activeCategoryInfo?.name || 'الاشتراكات')}
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-white dark:bg-[#161538] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div className="space-y-2 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 text-xs font-bold text-amazon-orange dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>كتالوج الاشتراكات الرسمية بالجملة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cairo text-[#0F1111] dark:text-white">
            {selectedCategory === 'all' ? 'جميع الاشتراكات والخدمات الرقمية' : activeCategoryInfo?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            {selectedCategory === 'all'
              ? 'تصفح حسابات الذكاء الاصطناعي، التصميم، المونتاج، الإنتاجية، والتسويق بأسعار مخفضة وتسليم فوري.'
              : (activeCategoryInfo?.description || 'خدمات واشتراكات متخصصة بضمان كامل وتسليم رقمي سريع.')}
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shrink-0 shadow-inner">
          <span className="block font-black text-[#0F1111] dark:text-amber-400 text-2xl">{filteredServices.length}</span>
          <span className="font-semibold">خدمة متاحة حالياً</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم (ChatGPT, Canva, CapCut...) أو الكود (10208, 10415)..."
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 focus:border-amazon-orange focus:bg-white dark:focus:bg-slate-900 rounded-2xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-[#0F1111] dark:text-white focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#0F1111] dark:text-white focus:outline-none focus:border-amazon-orange cursor-pointer transition-colors"
            >
              <option value="default" className="dark:bg-[#161538]">الترتيب: الافتراضي</option>
              <option value="price-asc" className="dark:bg-[#161538]">السعر: من الأقل للأعلى</option>
              <option value="price-desc" className="dark:bg-[#161538]">السعر: من الأعلى للأقل</option>
              <option value="offers" className="dark:bg-[#161538]">العروض والخصومات أولاً</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md scale-105'
                : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            الكل ({services.length})
          </button>

          {CATEGORIES.map(cat => {
            const count = services.filter(s => s.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredServices.map(service => (
            <ProductTile key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm transition-colors">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold font-cairo text-[#0F1111] dark:text-white">لم يتم العثور على أي نتائج</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            تأكد من كتابة الكلمة بشكل صحيح، أو قم بإلغاء التصفية للبحث في جميع الأقسام.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 rounded-full btn-cart text-xs font-bold mt-2 shadow-sm"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  );
};
