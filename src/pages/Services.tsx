import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

interface ServicesProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ selectedCategory, setSelectedCategory }) => {
  const { services } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filteredServices = useMemo(() => {
    return services.filter(service => {
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
      const minPriceA = Math.min(...a.variants.map(v => v.price));
      const minPriceB = Math.min(...b.variants.map(v => v.price));

      if (sortBy === 'price-asc') return minPriceA - minPriceB;
      if (sortBy === 'price-desc') return minPriceB - minPriceA;
      return 0; // default order
    });
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-gold/15 text-bazaar-gold text-xs font-bold border border-bazaar-gold/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>كتالوج الاشتراكات الرقمية الكامل</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-cairo text-white">
          جميع الاشتراكات والخدمات المتاحة
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          تصفح حسابات الذكاء الاصطناعي، التصميم، المونتاج، الإنتاجية، والتسويق بأسعار مخفضة وتسليم فوري.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bazaar-card/80 border border-bazaar-border p-4 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم (ChatGPT, Canva, CapCut...) أو الكود (10208, 10415)..."
              className="w-full bg-bazaar-bg/90 border border-white/10 focus:border-bazaar-gold rounded-2xl pr-10 pl-10 py-3 text-xs sm:text-sm text-white focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
              className="bg-bazaar-bg/90 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-bazaar-gold cursor-pointer"
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-bazaar-gold text-bazaar-bg shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            جميع الأقسام ({services.length})
          </button>

          {CATEGORIES.map(cat => {
            const count = services.filter(s => s.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-bazaar-gold text-bazaar-bg shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-bazaar-bg/20 text-bazaar-bg font-black' : 'bg-white/10 text-slate-400'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 p-8 rounded-3xl bg-bazaar-card/40 border border-white/5 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold font-cairo text-white">لم يتم العثور على أي نتائج</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            تأكد من كتابة الكلمة بشكل صحيح، أو قم بإلغاء التصفية للبحث في جميع الأقسام.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-bazaar-gold text-bazaar-bg text-xs font-bold mt-2"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  );
};
