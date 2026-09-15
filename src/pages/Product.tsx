import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/services';
import { effectivePrice, isOfferActive, discountPercent } from '../utils/pricing';
import { productRating, formatCount } from '../utils/productMeta';
import { StarRating } from '../components/StarRating';
import { ProductCarousel } from '../components/ProductCarousel';
import { Lock, MapPin, ShieldCheck } from 'lucide-react';

export const ProductPage: React.FC = () => {
  const {
    selectedService, selectedBundle, services, bundles, addToCart, navigate,
    openTopUpModal, openAuthModal, setSelectedCategory, purchaseItem
  } = useStore();
  const { user } = useAuth();
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyMsg, setBuyMsg] = useState<string | null>(null);

  const related = useMemo(() => {
    if (selectedService) {
      return services.filter(s => !s.isHidden && s.category === selectedService.category && s.id !== selectedService.id);
    }
    return services.filter(s => !s.isHidden).slice(0, 8);
  }, [selectedService, services]);

  if (!selectedService && !selectedBundle) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center bg-white m-6">
        <p className="mb-4">لم يتم اختيار منتج.</p>
        <button type="button" className="amazon-link" onClick={() => navigate('home')}>العودة إلى الصفحة الرئيسية</button>
      </div>
    );
  }

  if (selectedBundle) {
    const price = effectivePrice(selectedBundle);
    const onOffer = isOfferActive(selectedBundle);
    const { rating, count } = productRating(selectedBundle.id);
    const add = () => {
      addToCart({ itemType: 'bundle', itemId: selectedBundle.id, quantity: qty, customerNote: note });
      setAdded(true);
    };
    const buyNow = async () => {
      if (!user) {
        openAuthModal('سجّل الدخول لإتمام الشراء.');
        return;
      }
      add();
      navigate('checkout');
    };
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
        {/* Breadcrumbs */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <button type="button" className="hover:text-amazon-orange transition-colors" onClick={() => navigate('bundles')}>عروض اليوم والباقات</button>
          <span>›</span>
          <span className="text-[#0F1111] dark:text-white font-semibold">{selectedBundle.name}</span>
        </div>

        {/* Bundle Details Card */}
        <div className="bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_340px] gap-6 p-6 lg:p-8 transition-colors">
          <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl min-h-[280px] p-4 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {selectedBundle.imageUrl ? (
              <img
                src={selectedBundle.imageUrl}
                alt={selectedBundle.name}
                className="w-full h-auto max-h-[360px] object-cover rounded-xl shadow-md transition-transform hover:scale-[1.02]"
              />
            ) : (
              <div className="text-7xl">🎁</div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-cairo text-[#0F1111] dark:text-white leading-snug">{selectedBundle.name}</h1>
              {selectedBundle.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amazon-orange dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 text-xs font-bold mt-2">
                  {selectedBundle.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <StarRating rating={rating} size="md" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({formatCount(count)} تقييم معتمد)</span>
            </div>

            <div className="py-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
              {onOffer && (
                <span className="inline-block text-xs font-black text-[#CC0C39] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full">
                  خصم {discountPercent(selectedBundle)}%
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">ج.م</span>
                <span className="text-3xl font-black amazon-price">{price}</span>
                {onOffer && <span className="text-sm text-slate-400 dark:text-slate-500 line-through mr-2">{selectedBundle.price} ج.م</span>}
              </div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">توفير {selectedBundle.savings} ج.م مقابل الشراء المنفصل</p>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedBundle.description}</p>

            <div className="pt-2">
              <h2 className="font-bold text-sm text-[#0F1111] dark:text-white mb-2">مكونات ومزايا الباقة:</h2>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedBundle.componentsList.map(c => (
                  <li key={c} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amazon-orange"></span>
                    <span>{c}</span>
                  </li>
                ))}
                {selectedBundle.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <BuyBox
            price={price}
            qty={qty}
            setQty={setQty}
            added={added}
            onAdd={add}
            onBuy={buyNow}
            note={note}
            setNote={setNote}
            noteLabel="ملاحظة التسليم (رقم الواتساب أو الإيميل)"
          />
        </div>

        <ProductCarousel title="العملاء الذين اشتروا هذا المنتج اشتروا أيضاً" items={related} />
      </div>
    );
  }

  const service = selectedService!;
  const variant = service.variants[variantIndex] || service.variants[0];
  const price = effectivePrice(variant);
  const onOffer = isOfferActive(variant);
  const cat = CATEGORIES.find(c => c.id === service.category);
  const { rating, count } = productRating(service.id);

  const add = () => {
    addToCart({ itemType: 'service', itemId: service.id, variantId: variant.id, quantity: qty, customerNote: note });
    setAdded(true);
  };

  const buyNow = async () => {
    if (!user) {
      openAuthModal('سجّل الدخول لإتمام الشراء بنقرة واحدة.');
      return;
    }
    if ((user.balance || 0) < price * qty) {
      add();
      openTopUpModal();
      return;
    }
    setBuying(true);
    let lastOk = true;
    for (let i = 0; i < qty; i++) {
      const res = await purchaseItem({
        itemType: 'service',
        itemId: service.id,
        variantId: variant.id,
        customerNote: note
      });
      if (!res.success) {
        lastOk = false;
        setBuyMsg(res.message);
        break;
      }
      setBuyMsg(res.message);
    }
    setBuying(false);
    if (lastOk) navigate('dashboard-orders');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <button type="button" className="hover:text-amazon-orange transition-colors" onClick={() => { setSelectedCategory(service.category); navigate('services'); }}>{cat?.name}</button>
        <span>›</span>
        <span className="text-[#0F1111] dark:text-white font-semibold">{service.name}</span>
      </div>

      <div className="bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_340px] gap-6 lg:gap-8 transition-colors">
        <div className="lg:sticky lg:top-28 self-start">
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/60 min-h-[320px] flex items-center justify-center p-6 shadow-inner">
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.name} className="max-h-[380px] w-full object-contain rounded-xl" />
            ) : <div className="text-7xl">📦</div>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-cairo text-[#0F1111] dark:text-white leading-snug">{service.name}</h1>
            {service.englishName && <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-semibold mt-1">{service.englishName}</p>}
            {service.badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900/50 text-xs font-bold text-[#CC0C39] dark:text-rose-400 mt-2">
                {service.badge}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <StarRating rating={rating} size="md" />
            <span className="text-xs sm:text-sm font-bold text-[#0F1111] dark:text-white">{rating}</span>
            <a href="#reviews" className="text-xs text-amazon-orange font-semibold hover:underline">({formatCount(count)} تقييم)</a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">أكثر من 100+ طلب في الشهر الماضي</span>
          </div>

          <div className="py-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
            {onOffer && (
              <div className="text-[#CC0C39] dark:text-rose-400 text-xs font-bold">
                {variant.offerLabel || 'عرض محدود'} — خصم {discountPercent(variant)}%
              </div>
            )}
            <div className="flex items-baseline gap-2">
              {onOffer && <span className="text-[#CC0C39] dark:text-rose-400 text-lg font-black">-{discountPercent(variant)}%</span>}
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">ج.م</span>
                <span className="text-3xl font-black amazon-price">{price}</span>
              </div>
            </div>
            {onOffer && (
              <p className="text-xs text-slate-400 dark:text-slate-500">السعر المعتاد: <span className="line-through">{variant.price} ج.م</span></p>
            )}
          </div>

          {service.variants.length > 1 && (
            <div className="py-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-xs font-bold text-[#0F1111] dark:text-white">المدة: <span className="font-normal text-slate-600 dark:text-slate-400">{variant.duration}</span></p>
              <div className="flex flex-wrap gap-2">
                {service.variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => { setVariantIndex(i); setAdded(false); }}
                    className={`min-w-[120px] text-right rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      i === variantIndex
                        ? 'border-2 border-amazon-orange bg-amber-50/40 dark:bg-amber-950/20 text-[#0F1111] dark:text-white shadow-sm'
                        : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="font-bold">{v.duration}</div>
                    <div className="text-[11px] text-amazon-orange">{effectivePrice(v)} ج.م</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-y-2.5 text-xs py-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">العلامة التجارية</span><span className="font-bold text-[#0F1111] dark:text-white">{service.englishName || service.name}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">التسليم</span><span className="font-bold text-[#0F1111] dark:text-white">{service.deliveryTime || 'رقمي'}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">الصيغة</span><span className="font-bold text-[#0F1111] dark:text-white">{service.deliveryFormat || 'حساب رقمي'}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">الضمان</span><span className="font-bold text-[#0F1111] dark:text-white">{service.warrantyText || 'حسب المنتج'}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">نوع الحساب</span><span className="font-bold text-[#0F1111] dark:text-white">{service.accountType || 'رقمي'}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">كود المنتج</span><span className="font-mono font-bold text-[#0F1111] dark:text-white">{variant.code}</span>
          </div>

          <div className="py-2 space-y-2">
            <h2 className="font-bold text-sm text-[#0F1111] dark:text-white">حول هذا المنتج:</h2>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {service.features.map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amazon-orange"></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <BuyBox
          price={price}
          qty={qty}
          setQty={setQty}
          added={added}
          buying={buying}
          buyMsg={buyMsg}
          onAdd={add}
          onBuy={() => void buyNow()}
          note={note}
          setNote={setNote}
          noteLabel={service.requiredInputLabel || 'بيانات التسليم'}
          notePlaceholder={service.requiredInputPlaceholder}
          inStock
        />
      </div>

      {service.activationSteps && service.activationSteps.length > 0 && (
        <section className="bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm transition-colors">
          <h2 className="text-lg font-bold font-cairo text-[#0F1111] dark:text-white mb-3">خطوات التفعيل والاستخدام</h2>
          <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-decimal pr-4">
            {service.activationSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          {service.externalLink && (
            <a href={service.externalLink.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-amazon-orange hover:underline mt-4 inline-block">
              {service.externalLink.label} ›
            </a>
          )}
        </section>
      )}

      {service.loginInstructions && (
        <section className="bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm transition-colors">
          <h2 className="text-lg font-bold font-cairo text-[#0F1111] dark:text-white mb-3">تعليمات تسجيل الدخول</h2>
          {service.loginInstructions.map((s, i) => <p key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s}</p>)}
        </section>
      )}

      {service.note && (
        <section className="bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm transition-colors text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <h2 className="font-bold text-sm text-[#0F1111] dark:text-white mb-2">ملاحظات هامة</h2>
          {service.note}
        </section>
      )}

      <ProductCarousel
        title="المنتجات ذات الصلة بهذا المنتج"
        items={related}
        onSeeAll={() => { setSelectedCategory(service.category); navigate('services'); }}
      />

      <section id="reviews" className="bg-white dark:bg-[#161538] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm transition-colors">
        <h2 className="text-lg font-bold font-cairo text-[#0F1111] dark:text-white mb-3">تقييمات العملاء</h2>
        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={rating} size="md" />
          <span className="text-base font-bold text-[#0F1111] dark:text-white">{rating} من 5</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">استناداً إلى {formatCount(count)} تقييم عالمي للمنتج.</p>
        {[5, 4, 3, 2, 1].map(star => {
          const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1;
          return (
            <div key={star} className="flex items-center gap-3 text-xs my-2">
              <span className="w-14 font-semibold text-slate-600 dark:text-slate-400">{star} نجوم</span>
              <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-md">
                <div className="h-full bg-[#DE7921] rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-10 text-slate-400 text-left font-mono">{pct}%</span>
            </div>
          );
        })}
      </section>
    </div>
  );
};

const BuyBox: React.FC<{
  price: number;
  qty: number;
  setQty: (n: number) => void;
  added: boolean;
  buying?: boolean;
  buyMsg?: string | null;
  onAdd: () => void;
  onBuy: () => void;
  note: string;
  setNote: (s: string) => void;
  noteLabel: string;
  notePlaceholder?: string;
  inStock?: boolean;
}> = ({ price, qty, setQty, added, buying, buyMsg, onAdd, onBuy, note, setNote, noteLabel, notePlaceholder, inStock = true }) => {
  const { user, navigate, openAuthModal } = { ...useAuth(), ...useStore() };
  return (
    <aside className="border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 h-fit lg:sticky lg:top-28 bg-slate-50/60 dark:bg-slate-900/60 shadow-sm backdrop-blur-sm transition-colors space-y-3">
      <div>
        <span className="text-xs text-slate-500 dark:text-slate-400">ج.م</span>
        <span className="text-2xl font-black amazon-price mr-1">{(price * qty).toLocaleString()}</span>
      </div>
      <p className="text-xs">
        {inStock ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">● متوفر للتسليم الفوري</span> : 'غير متوفر'}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
        <MapPin className="w-3.5 h-3.5 text-amazon-orange shrink-0 mt-0.5" /> 
        <span>تسليم رقمي فوري — عادةً خلال دقائق</span>
      </p>
      <div className="pt-2">
        <label className="block text-xs font-bold text-[#0F1111] dark:text-white mb-1">الكمية:</label>
        <select 
          value={qty} 
          onChange={e => setQty(Number(e.target.value))} 
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs bg-white dark:bg-slate-900 text-[#0F1111] dark:text-white focus:outline-none focus:border-amazon-orange cursor-pointer"
        >
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="dark:bg-[#161538]">{n}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">{noteLabel}</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={notePlaceholder || 'رقم الواتساب أو البريد للتسليم'}
          rows={2}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs bg-white dark:bg-slate-900 text-[#0F1111] dark:text-white focus:outline-none focus:border-amazon-orange transition-colors"
        />
      </div>
      {added && (
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
          <ShieldCheck className="w-4 h-4 shrink-0" /> 
          <span>تمت الإضافة إلى السلة بنجاح</span>
        </div>
      )}
      {buyMsg && <p className="text-xs text-slate-500 dark:text-slate-400">{buyMsg}</p>}
      
      <div className="pt-1 space-y-2">
        <button type="button" onClick={onAdd} className="btn-cart w-full rounded-full py-2.5 text-xs font-bold shadow-sm active:scale-98 transition-all">
          أضف إلى السلة
        </button>
        <button type="button" disabled={buying} onClick={onBuy} className="btn-buy w-full rounded-full py-2.5 text-xs font-bold shadow-sm active:scale-98 transition-all">
          {buying ? 'جارٍ التنفيذ...' : 'اشتر الآن'}
        </button>
      </div>

      {!user && (
        <button type="button" onClick={() => openAuthModal()} className="w-full text-xs text-amazon-orange font-bold hover:underline text-center block pt-1">
          سجّل الدخول لإتمام عملية أسرع ›
        </button>
      )}
      <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 border-t border-slate-200/80 dark:border-slate-800 pt-3">
        <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
          <Lock className="w-3.5 h-3.5" /> 
          <span>عملية دفع آمنة 100%</span>
        </p>
        <p>يباع ويشحن بواسطة سوق الاشتراكات</p>
        <button type="button" className="text-amazon-orange hover:underline" onClick={() => navigate('warranty')}>
          سياسة الإرجاع والضمان الذهبي ›
        </button>
      </div>
    </aside>
  );
};
