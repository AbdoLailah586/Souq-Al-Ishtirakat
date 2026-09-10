/**
 * منطق موحّد لحساب أسعار العروض.
 * القاعدة: `price` هو السعر الأساسي المعلن، و`offerPrice` هو سعر العرض.
 * لو كان في عرض ساري، السعر الفعلي للشراء = offerPrice، ويظهر price مشطوباً للعميل.
 */

export interface Offerable {
  price: number;
  offerPrice?: number;
  offerLabel?: string;
  offerEndsAt?: string;
}

/** تحويل تاريخ الانتهاء إلى آخر لحظة في اليوم حتى يظل العرض ساري طوال يوم الانتهاء */
const endOfDay = (dateStr: string): number => {
  const t = new Date(/T/.test(dateStr) ? dateStr : `${dateStr}T23:59:59`).getTime();
  return Number.isNaN(t) ? Infinity : t;
};

/** هل العرض ساري الآن؟ */
export const isOfferActive = (item?: Offerable | null): boolean => {
  if (!item) return false;
  const offer = item.offerPrice;
  if (offer === undefined || offer === null || Number.isNaN(Number(offer))) return false;
  if (Number(offer) < 0) return false;
  if (Number(offer) >= Number(item.price)) return false;
  if (item.offerEndsAt && endOfDay(item.offerEndsAt) < Date.now()) return false;
  return true;
};

/** هل العرض كان موجوداً لكن انتهت مدته؟ (للإدارة) */
export const isOfferExpired = (item?: Offerable | null): boolean => {
  if (!item?.offerEndsAt) return false;
  if (item.offerPrice === undefined || item.offerPrice === null) return false;
  return endOfDay(item.offerEndsAt) < Date.now();
};

/** السعر الفعلي الذي يُخصم من محفظة العميل */
export const effectivePrice = (item: Offerable): number =>
  isOfferActive(item) ? Number(item.offerPrice) : Number(item.price);

/** قيمة الخصم بالجنيه */
export const discountAmount = (item: Offerable): number =>
  isOfferActive(item) ? Number(item.price) - Number(item.offerPrice) : 0;

/** نسبة الخصم المئوية (مقرّبة) */
export const discountPercent = (item: Offerable): number => {
  if (!isOfferActive(item) || !Number(item.price)) return 0;
  return Math.round((discountAmount(item) / Number(item.price)) * 100);
};

/** عدد الأيام المتبقية على انتهاء العرض، أو null لو العرض دائم */
export const offerDaysLeft = (item: Offerable): number | null => {
  if (!isOfferActive(item) || !item.offerEndsAt) return null;
  const diff = endOfDay(item.offerEndsAt) - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

/** أقل سعر فعلي بين كل باقات الخدمة — يُستخدم في الترتيب و«يبدأ من» */
export const minEffectivePrice = (variants: Offerable[]): number =>
  variants.length ? Math.min(...variants.map(effectivePrice)) : 0;

/** هل تحتوي الخدمة على أي باقة عليها عرض ساري؟ */
export const hasAnyOffer = (variants: Offerable[]): boolean => variants.some(isOfferActive);
