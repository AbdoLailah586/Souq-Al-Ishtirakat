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
      <div className="bg-amazon-bg pb-10">
        <div className="bg-white px-4 py-2 text-xs text-amazon-muted border-b">
          <button type="button" className="amazon-link" onClick={() => navigate('bundles')}>عروض اليوم</button>
          {' › '}
          {selectedBundle.name}
        </div>
        <div className="bg-white grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_340px] gap-6 p-4 lg:p-6">
          <div className="flex items-center justify-center bg-[#f7f7f7] min-h-[280px] p-6">
            <div className="text-7xl">🎁</div>
          </div>
          <div>
            <h1 className="text-2xl font-normal leading-snug">{selectedBundle.name}</h1>
            {selectedBundle.badge && <p className="text-sm amazon-link mt-1">{selectedBundle.badge}</p>}
            <div className="flex items-center gap-2 mt-2 pb-3 border-b">
              <StarRating rating={rating} size="md" />
              <span className="text-sm amazon-link">{formatCount(count)} تقييم</span>
            </div>
            <div className="py-3 border-b">
              {onOffer && <span className="text-sm text-[#CC0C39] font-bold">خصم {discountPercent(selectedBundle)}%</span>}
              <div>
                <span className="text-sm">ج.م</span>
                <span className="text-3xl amazon-price mx-1">{price}</span>
                {onOffer && <span className="text-sm text-amazon-muted line-through">{selectedBundle.price} ج.م</span>}
              </div>
              <p className="text-sm text-amazon-muted mt-1">توفير {selectedBundle.savings} ج.م مقابل الشراء المنفصل</p>
            </div>
            <p className="text-sm leading-7 mt-3">{selectedBundle.description}</p>
            <h2 className="font-bold mt-5 mb-2">حول هذا المنتج</h2>
            <ul className="list-disc pr-5 text-sm space-y-1">
              {selectedBundle.componentsList.map(c => <li key={c}>{c}</li>)}
              {selectedBundle.features.map(f => <li key={f}>{f}</li>)}
            </ul>
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
    <div className="bg-amazon-bg pb-10">
      <div className="bg-white px-4 py-2 text-xs text-amazon-muted border-b">
        <button type="button" className="amazon-link" onClick={() => { setSelectedCategory(service.category); navigate('services'); }}>{cat?.name}</button>
        {' › '}
        {service.name}
      </div>

      <div className="bg-white grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_340px] gap-4 lg:gap-6 p-4 lg:p-6">
        <div className="lg:sticky lg:top-28 self-start">
          <div className="border rounded-sm bg-white min-h-[320px] flex items-center justify-center p-4">
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.name} className="max-h-[420px] w-full object-contain" />
            ) : <div className="text-7xl">📦</div>}
          </div>
        </div>

        <div>
          <h1 className="text-[24px] leading-8 font-normal">{service.name}</h1>
          {service.englishName && <p className="text-sm amazon-link mt-0.5">{service.englishName}</p>}
          {service.badge && <p className="text-xs text-[#CC0C39] font-bold mt-1">{service.badge}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-2 pb-3 border-b">
            <StarRating rating={rating} size="md" />
            <span className="text-sm">{rating}</span>
            <a href="#reviews" className="text-sm amazon-link">{formatCount(count)} تقييم</a>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-amazon-muted">أكثر من 100+ طلب في الشهر الماضي</span>
          </div>

          <div className="py-3 border-b">
            {onOffer && (
              <div className="text-[#CC0C39] text-sm font-bold mb-1">
                {variant.offerLabel || 'عرض محدود'} — خصم {discountPercent(variant)}%
              </div>
            )}
            <div className="flex items-end gap-2">
              {onOffer && <span className="text-[#CC0C39] text-xl">-{discountPercent(variant)}%</span>}
              <div>
                <span className="text-xs align-super">ج.م</span>
                <span className="text-[28px] amazon-price leading-none">{price}</span>
              </div>
            </div>
            {onOffer && (
              <p className="text-sm text-amazon-muted">السعر المعتاد: <span className="line-through">{variant.price} ج.م</span></p>
            )}
          </div>

          {service.variants.length > 1 && (
            <div className="py-4 border-b">
              <p className="text-sm font-bold mb-2">المدة: <span className="font-normal">{variant.duration}</span></p>
              <div className="flex flex-wrap gap-2">
                {service.variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => { setVariantIndex(i); setAdded(false); }}
                    className={`min-w-[120px] text-right border rounded-sm px-3 py-2 text-sm ${i === variantIndex ? 'border-[#c7511f] border-2' : 'border-slate-300'}`}
                  >
                    <div className="font-semibold">{v.duration}</div>
                    <div className="text-xs">{effectivePrice(v)} ج.م</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-y-2 text-sm py-4 border-b">
            <span className="text-amazon-muted">العلامة التجارية</span><span>{service.englishName || service.name}</span>
            <span className="text-amazon-muted">التسليم</span><span>{service.deliveryTime || 'رقمي'}</span>
            <span className="text-amazon-muted">الصيغة</span><span>{service.deliveryFormat || 'حساب رقمي'}</span>
            <span className="text-amazon-muted">الضمان</span><span>{service.warrantyText || 'حسب المنتج'}</span>
            <span className="text-amazon-muted">نوع الحساب</span><span>{service.accountType || 'رقمي'}</span>
            <span className="text-amazon-muted">كود المنتج</span><span>{variant.code}</span>
          </div>

          <div className="py-4">
            <h2 className="font-bold text-lg mb-2">حول هذا المنتج</h2>
            <ul className="list-disc pr-5 text-sm space-y-1.5 leading-6">
              {service.features.map(f => <li key={f}>{f}</li>)}
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
        <section className="bg-white mx-3 sm:mx-4 lg:mx-6 my-4 p-5 shadow-sm">
          <h2 className="text-xl font-bold mb-3">من الشركة المصنعة</h2>
          <ol className="space-y-2 text-sm leading-7">
            {service.activationSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          {service.externalLink && (
            <a href={service.externalLink.url} target="_blank" rel="noreferrer" className="amazon-link text-sm mt-3 inline-block">
              {service.externalLink.label}
            </a>
          )}
        </section>
      )}

      {service.loginInstructions && (
        <section className="bg-white mx-3 sm:mx-4 lg:mx-6 my-4 p-5 shadow-sm">
          <h2 className="text-xl font-bold mb-3">معلومات المنتج</h2>
          {service.loginInstructions.map((s, i) => <p key={i} className="text-sm leading-7">{s}</p>)}
        </section>
      )}

      {service.note && (
        <section className="bg-white mx-3 sm:mx-4 lg:mx-6 my-4 p-5 shadow-sm text-sm">
          <h2 className="font-bold mb-2">ملاحظات هامة</h2>
          {service.note}
        </section>
      )}

      <ProductCarousel
        title="المنتجات ذات الصلة بهذا المنتج"
        items={related}
        onSeeAll={() => { setSelectedCategory(service.category); navigate('services'); }}
      />

      <section id="reviews" className="bg-white mx-3 sm:mx-4 lg:mx-6 my-4 p-5 shadow-sm">
        <h2 className="text-xl font-bold mb-3">تقييمات العملاء</h2>
        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={rating} size="md" />
          <span className="text-lg">{rating} من 5</span>
        </div>
        <p className="text-sm text-amazon-muted">استناداً إلى {formatCount(count)} تقييم عالمي للمنتج.</p>
        {[5, 4, 3, 2, 1].map(star => {
          const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1;
          return (
            <div key={star} className="flex items-center gap-2 text-sm my-1">
              <span className="w-12 amazon-link">{star} نجوم</span>
              <div className="flex-1 h-4 bg-slate-200 max-w-md">
                <div className="h-4 bg-[#DE7921]" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-10 text-amazon-muted">{pct}%</span>
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
    <aside className="border border-slate-300 rounded-lg p-4 h-fit lg:sticky lg:top-28">
      <div>
        <span className="text-xs align-super">ج.م</span>
        <span className="text-2xl amazon-price">{(price * qty).toLocaleString()}</span>
      </div>
      <p className="text-sm mt-2">
        {inStock ? <span className="text-[#007600] font-semibold">متوفر</span> : 'غير متوفر'}
      </p>
      <p className="text-sm mt-1 flex items-start gap-1">
        <MapPin className="w-3.5 h-3.5 mt-0.5" /> تسليم رقمي إلى مصر — عادةً خلال ساعات العمل
      </p>
      <label className="block text-sm mt-3">
        الكمية:
        <select value={qty} onChange={e => setQty(Number(e.target.value))} className="mr-2 border rounded-sm px-2 py-1 text-sm bg-[#F0F2F2]">
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label className="block text-xs text-amazon-muted mt-3 mb-1">{noteLabel}</label>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder={notePlaceholder || 'رقم الواتساب أو البريد للتسليم'}
        rows={2}
        className="w-full border border-slate-400 rounded-sm p-2 text-sm"
      />
      {added && (
        <div className="mt-2 text-sm text-[#007600] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> تمت الإضافة إلى السلة
        </div>
      )}
      {buyMsg && <p className="text-xs mt-2 text-amazon-muted">{buyMsg}</p>}
      <button type="button" onClick={onAdd} className="btn-cart w-full rounded-full py-2.5 text-sm mt-3 font-medium">
        أضف إلى السلة
      </button>
      <button type="button" disabled={buying} onClick={onBuy} className="btn-buy w-full rounded-full py-2.5 text-sm mt-2 font-medium">
        {buying ? 'جارٍ التنفيذ...' : 'اشتر الآن'}
      </button>
      {!user && (
        <button type="button" onClick={() => openAuthModal()} className="w-full text-sm amazon-link mt-2">
          سجّل الدخول لإتمام عملية أسرع
        </button>
      )}
      <div className="text-xs text-amazon-muted mt-4 space-y-1 border-t pt-3">
        <p className="flex items-center gap-1"><Lock className="w-3 h-3" /> عملية دفع آمنة</p>
        <p>يباع بواسطة سوق الاشتراكات</p>
        <p>يشحن من المتجر الرقمي</p>
        <button type="button" className="amazon-link" onClick={() => navigate('warranty')}>سياسة الإرجاع والضمان</button>
      </div>
    </aside>
  );
};
