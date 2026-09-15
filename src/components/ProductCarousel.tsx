import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    scroller.current?.scrollBy({ left: dir * -320, behavior: 'smooth' });
  };

  return (
    <section className="bg-white mx-3 sm:mx-4 lg:mx-6 my-4 p-4 shadow-sm">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F1111]">{title}</h2>
          {subtitle && <p className="text-xs text-amazon-muted mt-0.5">{subtitle}</p>}
        </div>
        {onSeeAll && (
          <button type="button" onClick={onSeeAll} className="text-sm amazon-link whitespace-nowrap">
            عرض الكل
          </button>
        )}
      </div>
      <div className="relative group">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-white/90 border border-slate-300 shadow items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="السابق"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div ref={scroller} className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {items.map(s => (
            <ProductTile key={s.id} service={s} compact />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-white/90 border border-slate-300 shadow items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="التالي"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
