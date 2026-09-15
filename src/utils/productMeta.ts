/** تقييمات ثابتة لكل منتج حتى تبدو صفحة أمازون طبيعية بدون بيانات وهمية متغيرة */

export const productRating = (id?: string | null): { rating: number; count: number } => {
  const str = typeof id === 'string' && id ? id : 'default-id';
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) >>> 0;
  const rating = Math.round((4.2 + (h % 8) / 10) * 10) / 10;
  const count = 180 + (h % 2400);
  return { rating, count };
};

export const formatCount = (n?: number | null) => (typeof n === 'number' ? n.toLocaleString('ar-EG') : '0');
