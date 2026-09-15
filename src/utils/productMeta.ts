/** تقييمات ثابتة لكل منتج حتى تبدو صفحة أمازون طبيعية بدون بيانات وهمية متغيرة */

export const productRating = (id: string): { rating: number; count: number } => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) >>> 0;
  const rating = Math.round((4.2 + (h % 8) / 10) * 10) / 10;
  const count = 180 + (h % 2400);
  return { rating, count };
};

export const formatCount = (n: number) => n.toLocaleString('ar-EG');
