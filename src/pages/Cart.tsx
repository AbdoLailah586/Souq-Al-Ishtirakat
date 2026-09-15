import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { effectivePrice, isOfferActive, discountPercent } from '../utils/pricing';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Wallet
} from 'lucide-react';

export const CartPage: React.FC<{ isCheckout?: boolean }> = ({ isCheckout = false }) => {
  const {
    cart,
    cartCount,
    removeFromCart,
    updateCartQty,
    updateCartNote,
    clearCart,
    services,
    bundles,
    navigate,
    purchaseItem,
    openTopUpModal,
    openAuthModal,
    openProduct,
    openBundleProduct
  } = useStore();

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<{ success: boolean; text: string } | null>(null);

  // حساب تفاصيل كل عنصر في السلة
  const cartDetails = cart.map(item => {
    if (item.itemType === 'service') {
      const service = services.find(s => s.id === item.itemId);
      const variant = service?.variants.find(v => v.id === item.variantId) || service?.variants[0];
      const unitPrice = variant ? effectivePrice(variant) : 0;
      const originalPrice = variant?.price || 0;
      const onOffer = variant ? isOfferActive(variant) : false;

      return {
        ...item,
        title: service?.name || 'خدمة غير معروفة',
        englishTitle: service?.englishName,
        imageUrl: service?.imageUrl,
        variantLabel: variant?.duration || 'المدة الافتراضية',
        unitPrice,
        originalPrice,
        onOffer,
        subtotal: unitPrice * item.quantity,
        deliveryTime: service?.deliveryTime || 'خلال دقائق',
        rawItem: service
      };
    } else {
      const bundle = bundles.find(b => b.id === item.itemId);
      const unitPrice = bundle ? effectivePrice(bundle) : 0;
      const originalPrice = bundle?.price || 0;
      const onOffer = bundle ? isOfferActive(bundle) : false;

      return {
        ...item,
        title: bundle?.name || 'باقة مجمعة',
        englishTitle: bundle?.badge,
        imageUrl: bundle?.imageUrl,
        variantLabel: 'باقة شاملة',
        unitPrice,
        originalPrice,
        onOffer,
        subtotal: unitPrice * item.quantity,
        deliveryTime: 'تسليم فوري موحد',
        rawItem: bundle
      };
    }
  });

  const grandTotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const userBalance = user?.balance || 0;
  const isBalanceSufficient = userBalance >= grandTotal;
  const shortage = Math.max(0, grandTotal - userBalance);

  const handleCheckout = async () => {
    if (!user) {
      openAuthModal('يرجى تسجيل الدخول أولاً لإتمام طلبك.');
      return;
    }

    if (cart.length === 0) return;

    if (!isBalanceSufficient) {
      openTopUpModal();
      return;
    }

    setIsSubmitting(true);
    setCheckoutMessage(null);

    let successCount = 0;
    let failedCount = 0;
    let lastError = '';

    for (const item of cart) {
      for (let i = 0; i < item.quantity; i++) {
        const res = await purchaseItem({
          itemType: item.itemType,
          itemId: item.itemId,
          variantId: item.variantId,
          customerNote: item.customerNote
        });

        if (res.success) {
          successCount++;
        } else {
          failedCount++;
          lastError = res.message;
        }
      }
    }

    setIsSubmitting(false);

    if (failedCount === 0) {
      clearCart();
      setCheckoutMessage({
        success: true,
        text: `تم تنفيذ طلبك بنجاح (${successCount} عنصر). جاري تجهيز بيانات حساباتك...`
      });
      setTimeout(() => {
        navigate('dashboard-orders');
      }, 1500);
    } else {
      setCheckoutMessage({
        success: false,
        text: `تم شراء ${successCount} عناصر وفشل ${failedCount}. السبب: ${lastError}`
      });
    }
  };

  if (cart.length === 0 && !checkoutMessage) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#161538] p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-5 rounded-3xl transition-colors">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-900/80 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cairo text-[#0F1111] dark:text-white">
            سلة التسوق في سوق الاشتراكات فارغة
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            استكشف أقوى اشتراكات الذكاء الاصطناعي، التصميم، والمونتاج بأسعار الجملة، وأضف ما يناسبك إلى السلة.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('services')}
              className="btn-cart px-8 py-3 rounded-full text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all"
            >
              تصفح كتالوج الاشتراكات
            </button>
            <button
              onClick={() => navigate('bundles')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm px-6 py-3 rounded-full font-semibold text-[#0F1111] dark:text-white transition-colors"
            >
              عروض اليوم والباقات الموفرة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="hover:text-amazon-orange transition-colors">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] dark:text-white font-semibold">{isCheckout ? 'إتمام الشراء' : 'سلة التسوق'}</span>
      </div>

      {checkoutMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold shadow-sm ${
          checkoutMessage.success ? 'bg-[#D5F5E3] dark:bg-emerald-950/60 text-[#196F3D] dark:text-emerald-300 border border-[#A9DFBF] dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
        }`}>
          {checkoutMessage.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{checkoutMessage.text}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Cart Items List */}
        <div className="bg-white dark:bg-[#161538] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-black font-cairo text-[#0F1111] dark:text-white">
                {isCheckout ? 'تأكيد عناصر الطلب' : 'سلة التسوق'}
              </h1>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {cartCount} {cartCount === 1 ? 'منتج' : 'منتجات'}
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">السعر</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {cartDetails.map(item => (
              <div key={item.lineId} className="py-5 flex flex-col sm:flex-row gap-4 justify-between">
                {/* Product Info */}
                <div className="flex gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain rounded-lg" />
                    ) : (
                      <div className="text-3xl">🎁</div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        if (item.itemType === 'service' && item.rawItem) {
                          openProduct(item.rawItem as any);
                        } else if (item.itemType === 'bundle' && item.rawItem) {
                          openBundleProduct(item.rawItem as any);
                        }
                      }}
                      className="text-right text-base sm:text-lg font-bold text-[#0F1111] dark:text-white hover:text-amazon-orange transition-colors leading-snug line-clamp-2"
                    >
                      {item.title}
                    </button>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-semibold">
                        {item.variantLabel}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>تسليم فوري ({item.deliveryTime})</span>
                      </span>
                    </div>

                    {/* Delivery Note Input */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        ملاحظة التسليم (رقم الواتساب أو الإيميل الخاص بك):
                      </label>
                      <input
                        type="text"
                        value={item.customerNote || ''}
                        onChange={e => updateCartNote(item.lineId, e.target.value)}
                        placeholder="مثال: 01012345678 أو email@gmail.com"
                        className="w-full sm:w-80 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-1.5 text-[#0F1111] dark:text-white focus:outline-none focus:border-amazon-orange transition-colors"
                      />
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full bg-slate-50 dark:bg-slate-900 text-xs overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.lineId, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                          title="تقليل الكمية"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-bold text-[#0F1111] dark:text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.lineId, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                          title="زيادة الكمية"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.lineId)}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0">
                  <div className="flex items-baseline gap-1 justify-start sm:justify-end">
                    <span className="text-xs text-slate-500 dark:text-slate-400">ج.م</span>
                    <span className="text-xl font-black amazon-price">{item.subtotal}</span>
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      ({item.unitPrice} ج.م للقطعة)
                    </div>
                  )}
                  {item.onOffer && (
                    <div className="text-[10px] text-[#CC0C39] dark:text-rose-400 font-bold mt-0.5">
                      وفرت {item.originalPrice - item.unitPrice} ج.م
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm font-bold">
            <button
              onClick={clearCart}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              إفراغ السلة بالكامل
            </button>
            <div className="text-base text-[#0F1111] dark:text-white">
              المجموع الفرعي ({cartCount} سلعة):{' '}
              <span className="amazon-price text-2xl font-black mr-1">{grandTotal} ج.م</span>
            </div>
          </div>
        </div>

        {/* Order Summary / Buy Box */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#161538] p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl space-y-4 transition-colors">
            <h2 className="text-base font-bold text-[#0F1111] dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              ملخص الطلب
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>إجمالي المنتجات ({cartCount}):</span>
                <span className="font-bold text-[#0F1111] dark:text-white">{grandTotal} ج.م</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>مصاريف التوصيل الرقمي:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">مجاني ⚡</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline text-sm font-bold">
                <span className="text-[#0F1111] dark:text-white">المجموع الكلي:</span>
                <span className="text-2xl font-black amazon-price">{grandTotal} ج.م</span>
              </div>
            </div>

            {/* User Balance Section */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-amazon-orange" />
                  <span>رصيد محفظتك:</span>
                </span>
                <span className="font-bold text-[#0F1111] dark:text-white">
                  {user ? `${userBalance.toLocaleString()} ج.م` : 'غير مسجل'}
                </span>
              </div>

              {!user && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  سجّل دخولك أو أنشئ حساباً لإتمام الطلب من رصيدك.
                </p>
              )}

              {user && !isBalanceSufficient && (
                <div className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold space-y-1.5 pt-1">
                  <p>رصيدك غير كافٍ. ينقصك {shortage} ج.م لإتمام الشراء.</p>
                  <button
                    onClick={openTopUpModal}
                    className="w-full py-2 px-3 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-800/60 text-amber-950 dark:text-amber-200 font-bold rounded-xl text-xs transition-colors"
                  >
                    شحن المحفظة الآن (انستاباي / كاش)
                  </button>
                </div>
              )}
            </div>

            {/* Action Button */}
            {user ? (
              <button
                type="button"
                disabled={isSubmitting || !isBalanceSufficient}
                onClick={handleCheckout}
                className={`w-full py-3 rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                  isBalanceSufficient && !isSubmitting
                    ? 'btn-buy hover:brightness-95 active:scale-98'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري تنفيذ الطلب...' : 'متابعة الشراء وتأكيد الطلب'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('سجّل الدخول لإتمام عملية الشراء.')}
                className="w-full py-3 rounded-full btn-buy text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                تسجيل الدخول للمتابعة
              </button>
            )}

            <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ضمان ذهبي 100% واستبدال فوري</span>
              </div>
              <p>تصلك بيانات الحساب مباشرة على شاشة طلباتك</p>
            </div>
          </div>

          {/* Quick Continue Shopping Link */}
          <button
            onClick={() => navigate('services')}
            className="w-full py-3 bg-white dark:bg-[#161538] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs font-bold text-center block text-amazon-orange shadow-sm transition-colors"
          >
            متابعة التسوق وإضافة اشتراكات أخرى ›
          </button>
        </div>
      </div>
    </div>
  );
};
