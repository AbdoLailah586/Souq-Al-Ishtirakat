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
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">
          {selectedCategory === 'all' ? 'جميع الاشتراكات' : (activeCategoryInfo?.name || 'الاشتراكات')}
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 sm:p-6 border border-slate-200 shadow-sm rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amazon-orange">
            <Sparkles className="w-3.5 h-3.5" />
            <span>كتالوج الاشتراكات الرسمية بالجملة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cairo text-[#0F1111]">
            {selectedCategory === 'all' ? 'جميع الاشتراكات والخدمات الرقمية' : activeCategoryInfo?.name}
          </h1>
          <p className="text-xs text-amazon-muted max-w-xl">
            {selectedCategory === 'all'
              ? 'تصفح حسابات الذكاء الاصطناعي، التصميم، المونتاج، الإنتاجية، والتسويق بأسعار مخفضة وتسليم فوري.'
              : (activeCategoryInfo?.description || 'خدمات واشتراكات متخصصة بضمان كامل وتسليم رقمي سريع.')}
          </p>
        </div>

        <div className="text-xs text-amazon-muted bg-slate-50 p-3 rounded border border-slate-200 text-center shrink-0">
          <span className="block font-bold text-[#0F1111] text-base">{filteredServices.length}</span>
          <span>خدمة متاحة حالياً</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم (ChatGPT, Canva, CapCut...) أو الكود (10208, 10415)..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-amazon-orange focus:bg-white rounded-sm pr-9 pl-9 py-2 text-xs sm:text-sm text-[#0F1111] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F1111]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-xs sm:text-sm text-[#0F1111] focus:outline-none focus:border-amazon-orange cursor-pointer"
            >
              <option value="default">الترتيب: الافتراضي</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="offers">العروض والخصومات أولاً</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#131921] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-[#0F1111]'
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
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#131921] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0F1111]'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid in Authentic Amazon Layout */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredServices.map(service => (
            <ProductTile key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-sm bg-white border border-slate-200 space-y-3 shadow-sm">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold font-cairo text-[#0F1111]">لم يتم العثور على أي نتائج</h3>
          <p className="text-xs text-amazon-muted max-w-sm mx-auto">
            تأكد من كتابة الكلمة بشكل صحيح، أو قم بإلغاء التصفية للبحث في جميع الأقسام.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2 rounded-full btn-cart text-xs font-bold mt-2"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  );
};
