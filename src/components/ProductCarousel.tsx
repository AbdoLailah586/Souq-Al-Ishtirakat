import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Service } from '../types';
import { ProductTile } from './ProductTile';

export const ProductCarousel: React.FC<{
  title: string;
  subtitle?: string;
  items: Service[];
  onSeeAll?: () => void;
}> = ({ title, subtitle, items, onSeeAll }) => {
  const scroller = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * -340, behavior: 'smooth' });
  };

  return (
    <section className="bg-white dark:bg-[#161538] mx-3 sm:mx-4 lg:mx-6 my-6 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm transition-all">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-cairo text-slate-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {onSeeAll && (
          <button 
            type="button" 
            onClick={onSeeAll} 
            className="text-xs sm:text-sm font-bold text-amazon-link dark:text-teal-400 hover:underline whitespace-nowrap flex items-center gap-1 pb-0.5"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="relative group">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-11 h-14 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/20 shadow-xl items-center justify-center opacity-0 group-hover:opacity-100 text-slate-800 dark:text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
          aria-label="السابق"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div ref={scroller} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
          {items.map(s => (
            <ProductTile key={s.id} service={s} compact />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-11 h-14 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/20 shadow-xl items-center justify-center opacity-0 group-hover:opacity-100 text-slate-800 dark:text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
          aria-label="التالي"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
