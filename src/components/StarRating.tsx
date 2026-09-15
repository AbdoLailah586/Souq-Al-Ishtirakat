import React from 'react';

export const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'sm' }) => {
  const w = size === 'sm' ? 14 : 18;
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} من 5`}>
      {[0, 1, 2, 3, 4].map(i => {
        const filled = i < full || (i === full && half);
        return (
          <svg key={i} width={w} height={w} viewBox="0 0 24 24" className={filled ? 'fill-[#FFA41C]' : 'fill-[#dedede] stroke-[#888]'} aria-hidden>
            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17.8 6.2 20.5l1.1-6.5L2.5 9.4l6.6-.9L12 2.5z" />
          </svg>
        );
      })}
    </span>
  );
};
