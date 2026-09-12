import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { effectivePrice, isOfferActive, discountPercent, discountAmount, offerDaysLeft } from '../utils/pricing';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Plus, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Tag,
  LogIn,
  Zap,
  ShieldCheck,
  Package,
  UserCheck,
  ExternalLink,
  Info
} from 'lucide-react';

export const ServiceModal: React.FC = () => {
  const { selectedService, closeServiceModal, purchaseItem, openTopUpModal, openAuthModal, navigate } = useStore();
  const { user } = useAuth();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [customerNote, setCustomerNote] = useState('');
  const [orderStatus, setOrderStatus] = useState<{ success: boolean; message: string; orderId?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'activation'>('features');

  // إغلاق النافذة بزر Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeServiceModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeServiceModal]);

  // إعادة ضبط الاختيارات عند فتح خدمة مختلفة
  useEffect(() => {
    setSelectedVariantIndex(0);
    setCustomerNote('');
    setOrderStatus(null);
    setActiveTab('features');
  }, [selectedService?.id]);

  if (!selectedService) return null;

  const currentVariant = selectedService.variants[selectedVariantIndex] || selectedService.variants[0];
  const finalPrice = effectivePrice(currentVariant);
  const onOffer = isOfferActive(currentVariant);
  const userBalance = user?.balance || 0;
  const isBalanceEnough = userBalance >= finalPrice;

  const handlePurchase = async () => {
    if (!user) {
      openAuthModal(`يرجى تسجيل الدخول أو إنشاء حساب جديد للاشتراك في خدمة «${selectedService.name}».`);
      return;
    }

    if (!isBalanceEnough) {
      openTopUpModal();
      return;
    }

    setIsSubmitting(true);
    const result = await purchaseItem({
      itemType: 'service',
      itemId: selectedService.id,
      variantId: currentVariant.id,
      customerNote
    });

    setOrderStatus(result);
    setIsSubmitting(false);

    // بمجرد تأكيد الطلب ينتقل العميل مباشرة إلى صفحة حالة الطلب
    if (result.success) {
      setTimeout(() => {
        closeServiceModal();
        setOrderStatus(null);
        setCustomerNote('');
        navigate('dashboard-orders');
      }, 1400);
    }
  };

  return (
    <div
      onClick={closeServiceModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-3xl bg-bazaar-card rounded-3xl border border-bazaar-gold/30 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner Header with Image & Overlay */}
        <div className="relative h-44 sm:h-52 w-full shrink-0 overflow-hidden bg-slate-950 border-b border-white/10">
          {selectedService.imageUrl ? (
            <img 
              src={selectedService.imageUrl} 
              alt={selectedService.name} 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-bazaar-surface to-bazaar-card" />
          )}

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-bazaar-card via-bazaar-card/70 to-black/60 pointer-events-none" />

          {/* Top Bar inside Banner */}
          <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-bazaar-gold font-bold border border-bazaar-gold/40 shadow-lg">
                كود الخدمة: {currentVariant.code}
              </span>
              {selectedService.badge && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-teal-300 font-bold border border-teal-500/40 shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  <span>{selectedService.badge}</span>
                </span>
              )}
            </div>

            <button
              onClick={closeServiceModal}
              className="w-10 h-10 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/30"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Title inside Banner */}
          <div className="absolute bottom-3 right-5 left-5 z-20">
            <h2 className="text-2xl sm:text-3xl font-black font-cairo text-white drop-shadow-md">
              {selectedService.name}
            </h2>
            {selectedService.englishName && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium drop-shadow">
                {selectedService.englishName}
              </p>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-bazaar-surface/70 border-b border-white/10 text-xs shrink-0">
          <div className="bg-white/[0.03] p-2.5 rounded-2xl border border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">وقت البدء والتسليم</div>
              <div className="font-bold text-slate-200 truncate">{selectedService.deliveryTime || '0 - 6 ساعات'}</div>
            </div>
          </div>

          <div className="bg-white/[0.03] p-2.5 rounded-2xl border border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">الضمان الفعلي</div>
              <div className="font-bold text-slate-200 truncate">{selectedService.warrantyText || 'ضمان كامل المدة'}</div>
            </div>
          </div>

          <div className="bg-white/[0.03] p-2.5 rounded-2xl border border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">طريقة التسليم</div>
              <div className="font-bold text-slate-200 truncate">{selectedService.deliveryFormat || 'تسليم فوري'}</div>
            </div>
          </div>

          <div className="bg-white/[0.03] p-2.5 rounded-2xl border border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">نوع الحساب</div>
              <div className="font-bold text-slate-200 truncate">{selectedService.accountType || 'حساب خاص'}</div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Active Offer Banner */}
          {onOffer && (
            <div className="p-4 rounded-2xl bg-gradient-to-l from-emerald-950/80 to-teal-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black font-cairo text-emerald-300">
                    {currentVariant.offerLabel || 'عرض خاص'} — خصم {discountPercent(currentVariant)}%
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    وفّر {discountAmount(currentVariant)} ج.م على باقة «{currentVariant.duration}»
                    {offerDaysLeft(currentVariant) !== null && ` — العرض ينتهي خلال ${offerDaysLeft(currentVariant)} يوم`}
                  </p>
                </div>
              </div>
              <div className="text-left shrink-0">
                <div className="text-xs text-slate-400 line-through">{currentVariant.price} ج.م</div>
                <div className="text-xl font-black font-cairo text-emerald-400">{finalPrice} ج.م</div>
              </div>
            </div>
          )}

          {/* Duration Selector (if multiple) */}
          {selectedService.variants.length > 1 && (
            <div className="bg-bazaar-bg/80 p-4 rounded-2xl border border-white/5">
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-bazaar-gold" />
                <span>اختر الباقة / المدة المطلوبة:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setOrderStatus(null);
                    }}
                    className={`p-3 rounded-xl text-right transition-all border flex items-center justify-between ${
                      selectedVariantIndex === idx
                        ? 'bg-bazaar-gold/20 border-bazaar-gold text-white shadow-md'
                        : 'bg-bazaar-card/60 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{v.duration}</span>
                        {isOfferActive(v) && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            -{discountPercent(v)}%
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">كود: {v.code}</div>
                    </div>
                    <div className="text-left">
                      {isOfferActive(v) && (
                        <div className="text-[10px] text-slate-500 line-through leading-none">
                          {v.price} ج.م
                        </div>
                      )}
                      <div className={`text-sm font-black ${isOfferActive(v) ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {effectivePrice(v)} ج.م
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section Tabs: المميزات vs طريقة التفعيل */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'features'
                  ? 'bg-bazaar-gold text-bazaar-bg shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>المواصفات والميزات ({selectedService.features.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('activation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'activation'
                  ? 'bg-bazaar-gold text-bazaar-bg shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>طريقة وكيفية التفعيل والتسليم</span>
            </button>
          </div>

          {/* Tab 1: Features List */}
          {activeTab === 'features' && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              {selectedService.features.map((feat, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-start gap-3 transition-colors">
                  <div className="w-5 h-5 rounded-lg bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Activation & Execution Steps */}
          {activeTab === 'activation' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {selectedService.activationSteps && selectedService.activationSteps.length > 0 ? (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-bazaar-gold flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>خطوات تنفيذ وتفعيل طلبك:</span>
                  </h4>
                  {selectedService.activationSteps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 flex items-start gap-3">
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 leading-relaxed">
                  في خانة البيانات ضع رقم الواتس الخاص بك أو بريدك، وسيتم التواصل معك وتنفيذ وتفعيل الطلب فورياً بعد إنشائه.
                </div>
              )}

              {/* External Link (e.g. Claudesk portal) */}
              {selectedService.externalLink && (
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-purple-300">رابط التسجيل في المنصة</h5>
                    <p className="text-[11px] text-purple-200/80">سجل في المنصة ثم اكتب إيميلك في الخانة بالأسفل</p>
                  </div>
                  <a
                    href={selectedService.externalLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0"
                  >
                    <span>{selectedService.externalLink.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Special Login Instructions (e.g. Netflix crowmail) */}
              {selectedService.loginInstructions && selectedService.loginInstructions.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span>طريقة تسجيل الدخول واستلام كود التحقق:</span>
                  </h4>
                  <div className="space-y-1.5 pr-2">
                    {selectedService.loginInstructions.map((inst, i) => (
                      <p key={i} className="text-xs text-rose-100/90 leading-relaxed">
                        {inst}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Important Notices / Warranty notes */}
          {selectedService.note && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">تنبيه وملاحظة هامة: </span>
                <span>{selectedService.note}</span>
              </div>
            </div>
          )}

          {/* Customer Input Note with dynamic placeholder */}
          <div className="bg-bazaar-bg/80 p-4 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-200 block mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-bazaar-gold animate-ping" />
              <span>{selectedService.requiredInputLabel || 'بيانات التفعيل أو رقم هاتفك للتواصل:'}</span>
            </label>
            <textarea
              value={customerNote}
              onChange={e => setCustomerNote(e.target.value)}
              placeholder={selectedService.requiredInputPlaceholder || 'ضع رقم هاتفك أو إيميلك هنا للتنفيذ والتسليم المباشر'}
              rows={2}
              className="w-full bg-bazaar-card border border-white/10 focus:border-bazaar-gold rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Result Alert */}
          {orderStatus && (
            <div className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-3 ${
              orderStatus.success
                ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                : 'bg-rose-950/80 text-rose-200 border border-rose-500/50'
            }`}>
              {orderStatus.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed flex-1">
                <p>{orderStatus.message}</p>
                {orderStatus.success && (
                  <p className="mt-2 text-[11px] text-emerald-300 font-normal animate-pulse">
                    جارٍ تحويلك إلى صفحة متابعة الطلبات لمتابعة التسليم...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Purchase Action Bar */}
        <div className="bg-bazaar-surface p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
            <div>
              <div className="text-[10px] text-slate-400">
                {onOffer ? 'السعر النهائي بعد العرض' : 'إجمالي المطلوب'}
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-2xl font-black font-cairo ${onOffer ? 'text-emerald-400' : 'text-white'}`}>
                  {finalPrice} <span className="text-xs text-slate-300">ج.م</span>
                </span>
                {onOffer && (
                  <span className="text-xs text-slate-500 line-through">{currentVariant.price} ج.م</span>
                )}
              </div>
            </div>

            {user ? (
              <div className="border-r border-white/10 pr-4">
                <div className="text-[10px] text-slate-400">رصيدك الحالي</div>
                <div className={`text-xs sm:text-sm font-bold ${isBalanceEnough ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {userBalance.toLocaleString()} ج.م
                </div>
              </div>
            ) : (
              <div className="border-r border-white/10 pr-4">
                <div className="text-[10px] text-slate-400">حالة الحساب</div>
                <div className="text-xs font-bold text-amber-300">زائر (غير مسجل)</div>
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {!user ? (
              <button
                onClick={() => openAuthModal(`يرجى تسجيل الدخول أو إنشاء حساب جديد للاشتراك في خدمة «${selectedService.name}».`)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg shadow-bazaar-gold/25 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول للاشتراك</span>
              </button>
            ) : (
              <>
                {!isBalanceEnough && (
                  <button
                    onClick={openTopUpModal}
                    className="flex-1 sm:flex-none px-3.5 py-3 rounded-2xl bg-bazaar-card hover:bg-white/10 border border-bazaar-gold/40 text-bazaar-gold text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>شحن رصيد</span>
                  </button>
                )}

                <button
                  onClick={() => void handlePurchase()}
                  disabled={isSubmitting || (orderStatus?.success ?? false)}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                    isBalanceEnough
                      ? 'bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg shadow-bazaar-gold/25 active:scale-95'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isBalanceEnough ? 'تأكيد الشراء من الرصيد' : 'شحن المحفظة لإتمام الشراء'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
