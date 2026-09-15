import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/services';
import { minEffectivePrice, hasAnyOffer, effectivePrice, isOfferActive, discountPercent } from '../utils/pricing';
import { productRating, formatCount } from '../utils/productMeta';
import { ProductCarousel } from '../components/ProductCarousel';
import { ProductTile } from '../components/ProductTile';
import { StarRating } from '../components/StarRating';
import { 
  Sparkles, 
  ArrowLeft, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  Gift, 
  Star, 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight,
  Lock,
  Headphones,
  CreditCard,
  ExternalLink,
  Tag
} from 'lucide-react';

export const Home: React.FC = () => {
  const { 
    services, 
    bundles, 
    openTopUpModal, 
    openAuthModal,
    navigate, 
    setSelectedCategory,
    openProduct,
    openBundleProduct,
    addToCart
  } = useStore();

  const { user } = useAuth();

  const visibleServices = services.filter(s => !s.isHidden);
  const visibleBundles = bundles.filter(b => !b.isHidden);

  // تصنيفات المنتجات للسلايدرات
  const aiServices = visibleServices.filter(s => s.category === 'ai');
  const designAndMediaServices = visibleServices.filter(s => s.category === 'design' || s.category === 'video');
  const dealServices = visibleServices.filter(s => hasAnyOffer(s.variants));

  // بطاقات 4-في-1 للأقسام الرئيسية
  const topAi = aiServices.slice(0, 4);
  const topDesign = designAndMediaServices.slice(0, 4);
  const topBundle = visibleBundles[0];

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    navigate('services');
  };

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Amazon Hero Promotional Banner */}
      <section className="relative bg-gradient-to-b from-[#131921] via-[#232F3E] to-transparent text-white pt-8 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background graphic pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#febd69_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3.5 text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amazon-yellow text-xs font-bold border border-white/15">
              <span>🏮</span>
              <span>سوق الاشتراكات الرقمية — حسابات رسمية بأسعار الجملة</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-cairo leading-tight">
              امتلك أقوى اشتراكات <br />
              <span className="text-amazon-search">الذكاء الاصطناعي والتصميم</span> <br />
              بتسليم فوري وضمان ذهبي كامل
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              وفّر حتى 70% على ChatGPT Plus، Gemini Pro 5TB، Claude 3.5، Canva Pro، وCapCut Pro. دفع محلي مباشر بالجنيه المصري عبر تطبيق انستاباي وجميع المحافظ الإلكترونية.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  navigate('services');
                }}
                className="btn-buy px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>تصفح جميع الاشتراكات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={openTopUpModal}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Wallet className="w-4 h-4 text-amazon-yellow" />
                <span>شحن المحفظة (InstaPay / كاش)</span>
              </button>

              <button
                onClick={() => navigate('bundles')}
                className="bg-amazon-yellow text-[#0F1111] hover:bg-amazon-yellowHover px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5"
              >
                <Gift className="w-4 h-4" />
                <span>عروض الباقات الموفرة</span>
              </button>
            </div>
          </div>

          {/* Hero Quick Highlights Box */}
          <div className="hidden lg:grid grid-cols-2 gap-3 w-80 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-sm border border-white/10 text-right">
              <div className="text-2xl font-black text-amazon-yellow font-cairo">13+</div>
              <div className="text-xs text-slate-300 mt-0.5">خدمة واشتراك رقمي</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-sm border border-white/10 text-right">
              <div className="text-2xl font-black text-emerald-400 font-cairo">100%</div>
              <div className="text-xs text-slate-300 mt-0.5">ضمان ذهبي واستبدال</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-sm border border-white/10 text-right">
              <div className="text-2xl font-black text-amazon-search font-cairo">فوري ⚡</div>
              <div className="text-xs text-slate-300 mt-0.5">سرعة تسليم الحسابات</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-sm border border-white/10 text-right">
              <div className="text-2xl font-black text-purple-300 font-cairo">Instapay</div>
              <div className="text-xs text-slate-300 mt-0.5">دفع لحظي بدون فيزا</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Iconic Amazon 4-Tile Showcase Grid (Overlapping the Hero) */}
      <section className="-mt-24 sm:-mt-32 relative z-20 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: AI 4-in-1 Quad Card */}
          <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F1111] mb-1 font-cairo">
                أشهر اشتراكات الذكاء الاصطناعي
              </h2>
              <p className="text-[11px] text-amazon-muted mb-3">
                حسابات مميزة بأعلى سقف استخدام
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {topAi.map(service => {
                  const p = minEffectivePrice(service.variants);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => openProduct(service)}
                      className="text-right group"
                    >
                      <div className="h-20 bg-slate-50 border border-slate-100 rounded-sm p-2 flex items-center justify-center mb-1 group-hover:bg-slate-100 transition-colors">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-2xl">🤖</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-[#0F1111] truncate group-hover:text-amazon-linkHover">
                        {service.name}
                      </div>
                      <div className="text-[11px] amazon-price font-bold">
                        {p} ج.م
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => handleCategoryClick('ai')}
              className="mt-4 text-xs font-bold amazon-link text-right block"
            >
              استكشف كل أدوات الذكاء الاصطناعي ›
            </button>
          </div>

          {/* Tile 2: Design & Content 4-in-1 Quad Card */}
          <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F1111] mb-1 font-cairo">
                أدوات التصميم والمونتاج
              </h2>
              <p className="text-[11px] text-amazon-muted mb-3">
                برامج احترافية لصناع المحتوى
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {topDesign.map(service => {
                  const p = minEffectivePrice(service.variants);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => openProduct(service)}
                      className="text-right group"
                    >
                      <div className="h-20 bg-slate-50 border border-slate-100 rounded-sm p-2 flex items-center justify-center mb-1 group-hover:bg-slate-100 transition-colors">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-2xl">🎨</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-[#0F1111] truncate group-hover:text-amazon-linkHover">
                        {service.name}
                      </div>
                      <div className="text-[11px] amazon-price font-bold">
                        {p} ج.م
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => handleCategoryClick('design')}
              className="mt-4 text-xs font-bold amazon-link text-right block"
            >
              استكشف كل برامج التصميم ›
            </button>
          </div>

          {/* Tile 3: Top Savings Bundle Spotlight Card */}
          <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h2 className="text-lg font-bold text-[#0F1111] font-cairo">
                  أقوى باقات التوفير
                </h2>
                <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  خصم مجمع
                </span>
              </div>
              <p className="text-[11px] text-amazon-muted mb-3">
                اشتراكات مجمعة في باقة واحدة
              </p>

              {topBundle && (
                <div 
                  onClick={() => openBundleProduct(topBundle)}
                  className="cursor-pointer group space-y-2.5"
                >
                  <div className="h-32 bg-[#F7F7F7] border border-slate-200 rounded-sm p-3 flex flex-col items-center justify-center text-center group-hover:border-slate-300">
                    <span className="text-4xl mb-1">🎁</span>
                    <span className="text-xs font-bold text-[#0F1111] group-hover:text-amazon-linkHover">
                      {topBundle.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      وفر {topBundle.savings} ج.م مقابل الشراء المنفصل
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-amazon-muted">ج.م</span>
                      <span className="text-2xl font-bold amazon-price leading-none">
                        {effectivePrice(topBundle)}
                      </span>
                      <span className="text-xs text-amazon-muted line-through">
                        {topBundle.price} ج.م
                      </span>
                    </div>
                    <p className="text-[11px] text-amazon-muted line-clamp-2">
                      {topBundle.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('bundles')}
              className="mt-4 text-xs font-bold amazon-link text-right block"
            >
              عرض جميع الباقات (6 باقات) ›
            </button>
          </div>

          {/* Tile 4: Instant Wallet & Top Up Card */}
          <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F1111] mb-1 font-cairo">
                محفظتك وطرق الدفع
              </h2>
              <p className="text-[11px] text-amazon-muted mb-3">
                شحن رصيد فوري عبر انستاباي والمحافظ
              </p>

              {user ? (
                <div className="space-y-3 bg-slate-50 p-3.5 border border-slate-200 rounded-sm text-right">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amazon-muted">الرصيد المتاح:</span>
                    <span className="font-bold text-lg text-emerald-700 font-cairo">
                      {user.balance.toLocaleString()} ج.م
                    </span>
                  </div>
                  <p className="text-[11px] text-amazon-muted">
                    رصيدك جاهز لإتمام أي طلب بنقرة واحدة بدون انتظار تأكيد الدفع.
                  </p>
                  <button
                    onClick={openTopUpModal}
                    className="w-full btn-cart py-2 rounded-full text-xs font-bold shadow-sm"
                  >
                    شحن رصيد إضافي
                  </button>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-3.5 border border-slate-200 rounded-sm text-right">
                  <p className="text-xs text-[#0F1111] font-semibold leading-relaxed">
                    سجّل دخولك الآن للوصول إلى لوحة طلباتك، إدارة اشتراكاتك، وشحن محفظتك.
                  </p>
                  <button
                    onClick={() => openAuthModal('يرجى تسجيل الدخول أو إنشاء حساب للاستفادة من كافة الميزات.')}
                    className="w-full btn-buy py-2 rounded-full text-xs font-bold shadow-sm"
                  >
                    تسجيل الدخول / إنشاء حساب
                  </button>
                </div>
              )}

              {/* Payment Partners Icons */}
              <div className="pt-3 border-t border-slate-100 mt-3">
                <span className="block text-[10px] text-amazon-muted mb-2">طرق الدفع المعتمدة:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-white border border-slate-200 p-1 rounded text-center">
                    <span className="text-[10px] font-bold text-purple-700">انستاباي ⚡</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-1 rounded text-center">
                    <span className="text-[10px] font-bold text-rose-700">فودافون كاش</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-1 rounded text-center">
                    <span className="text-[10px] font-bold text-emerald-700">اتصالات كاش</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('payment')}
              className="mt-4 text-xs font-bold amazon-link text-right block"
            >
              عرض دليل الشحن والحسابات البنكية ›
            </button>
          </div>
        </div>
      </section>

      {/* 3. Product Carousel 1: AI Services */}
      <ProductCarousel
        title="أشهر اشتراكات الذكاء الاصطناعي (AI)"
        subtitle="حسابات ChatGPT Plus، Gemini Pro 5TB، Claude Pro، والمزيد بتسليم فوري"
        items={aiServices}
        onSeeAll={() => handleCategoryClick('ai')}
      />

      {/* 4. Product Carousel 2: Today's Deals */}
      {dealServices.length > 0 && (
        <ProductCarousel
          title="عروض اليوم والخصومات المحدودة"
          subtitle="اشتراكات رقمية بأسعار مخفضة وخصومات تصل إلى 50%"
          items={dealServices}
          onSeeAll={() => navigate('bundles')}
        />
      )}

      {/* 5. Product Carousel 3: Design & Media Services */}
      <ProductCarousel
        title="أدوات التصميم الجرافيكي والمونتاج"
        subtitle="Canva Pro، CapCut Pro، برامج أدوبي، وبنوك التصميم للمحترفين"
        items={designAndMediaServices}
        onSeeAll={() => handleCategoryClick('design')}
      />

      {/* 6. Amazon Bundles Shelf (Full 6 Bundles Showcase) */}
      <section className="bg-white mx-3 sm:mx-4 lg:mx-6 p-4 sm:p-6 border border-slate-200 shadow-sm rounded-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#CC0C39] mb-1">
              <Gift className="w-4 h-4" />
              <span>عروض التوفير الشاملة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cairo text-[#0F1111]">
              باقات التوفير الكبرى (Bundles)
            </h2>
            <p className="text-xs text-amazon-muted mt-0.5">
              اشتراكات متعددة مجمعة في باقة واحدة بخصم فوري يصل إلى 120 جنيه
            </p>
          </div>

          <button
            onClick={() => navigate('bundles')}
            className="text-xs font-bold amazon-link whitespace-nowrap self-start sm:self-auto"
          >
            عرض كافة الباقات (6) ›
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleBundles.map(bundle => {
            const price = effectivePrice(bundle);
            const onOffer = isOfferActive(bundle);
            const { rating, count } = productRating(bundle.id);

            return (
              <div
                key={bundle.id}
                className="border border-slate-200 hover:border-slate-300 rounded-sm p-4 flex flex-col justify-between bg-white group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openBundleProduct(bundle)}
                      className="text-right"
                    >
                      <h3 className="text-base font-bold text-[#0F1111] group-hover:text-amazon-linkHover leading-snug">
                        {bundle.name}
                      </h3>
                      <span className="text-[11px] text-amazon-muted">كود: {bundle.code}</span>
                    </button>
                    <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shrink-0">
                      وفر {bundle.savings} ج.م
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <StarRating rating={rating} size="sm" />
                    <span className="text-xs amazon-link">{formatCount(count)}</span>
                  </div>

                  <p className="text-xs text-amazon-muted mt-2 line-clamp-2 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Components List */}
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 block">محتويات الباقة:</span>
                    <ul className="text-xs text-[#0F1111] space-y-0.5">
                      {bundle.componentsList.slice(0, 3).map((comp, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{comp}</span>
                        </li>
                      ))}
                      {bundle.componentsList.length > 3 && (
                        <li className="text-[10px] text-amazon-link font-medium">
                          + {bundle.componentsList.length - 3} عناصر إضافية
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-amazon-muted">ج.م</span>
                      <span className="text-xl font-bold amazon-price leading-none">{price}</span>
                      <span className="text-xs text-amazon-muted line-through mr-1">{bundle.price} ج.م</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                      تسليم فوري موحد
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openBundleProduct(bundle)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F1111] rounded-sm text-xs font-semibold"
                    >
                      التفاصيل
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart({ itemType: 'bundle', itemId: bundle.id, quantity: 1 })}
                      className="btn-cart px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm"
                    >
                      أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Amazon 4 Value Propositions Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amazon-orange flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#0F1111]">تسليم رقمي فوري</h4>
              <p className="text-xs text-amazon-muted leading-relaxed">
                تصلك بيانات الحساب والترخيص فوراً على لوحة طلباتك بدون تأخير.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#0F1111]">ضمان ذهبي 100%</h4>
              <p className="text-xs text-amazon-muted leading-relaxed">
                دعم فني مستمر واستبدال فوري لأي حساب طوال فترة الاشتراك.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#0F1111]">دفع محلي بالجنيه</h4>
              <p className="text-xs text-amazon-muted leading-relaxed">
                بدون فيزا دولية — ادفع عبر انستاباي أو المحافظ الإلكترونية.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#0F1111]">دعم فني 24/7</h4>
              <p className="text-xs text-amazon-muted leading-relaxed">
                فريق متخصص لمساعدتك في التفعيل والرد على استفساراتك عبر واتساب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Accepted Payment Methods Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-right">
            <h3 className="text-base font-bold text-[#0F1111] font-cairo">
              طرق الشحن والدفع المعتمدة لدى سوق الاشتراكات
            </h3>
            <p className="text-xs text-amazon-muted">
              اشحن رصيد محفظتك بسهولة خلال ثوانٍ وبدون أي رسوم إضافية.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { name: 'انستاباي (InstaPay)', color: 'text-purple-700 bg-purple-50 border-purple-200' },
              { name: 'فودافون كاش', color: 'text-rose-700 bg-rose-50 border-rose-200' },
              { name: 'اتصالات كاش', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              { name: 'وي باي (WE Pay)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
              { name: 'أورنج كاش', color: 'text-amber-700 bg-amber-50 border-amber-200' },
            ].map(pm => (
              <span
                key={pm.name}
                className={`text-xs font-bold px-3 py-1.5 rounded border ${pm.color}`}
              >
                {pm.name}
              </span>
            ))}
          </div>

          <button
            onClick={openTopUpModal}
            className="btn-buy px-5 py-2 rounded-full text-xs font-bold shadow-sm whitespace-nowrap"
          >
            شحن رصيد الآن
          </button>
        </div>
      </section>

      {/* 9. Amazon Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white p-5 sm:p-6 border border-slate-200 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold font-cairo text-[#0F1111]">
                تقييمات وتجارب العملاء الموثقة
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={4.9} size="md" />
                <span className="text-xs text-amazon-muted">4.9 من 5 بناءً على 480+ تقييم شراء موثق</span>
              </div>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-sm hidden sm:inline-block">
              ✓ تقييمات موثقة 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F1111]">محمود حسني</span>
                <span className="text-[10px] text-emerald-700 font-semibold">شراء موثق ✓</span>
              </div>
              <StarRating rating={5} size="sm" />
              <p className="text-xs text-amazon-muted leading-relaxed">
                "اشتراك Gemini Pro بـ 150 جنيه مع مساحة 5 تيرابايت كاملة على إيميلي الشخصي صفقة خيالية، والدعم تواصل معايا في دقائق لتأكيد التفعيل."
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                المنتج: Gemini Pro 5TB
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F1111]">سارة الجيار</span>
                <span className="text-[10px] text-emerald-700 font-semibold">شراء موثق ✓</span>
              </div>
              <StarRating rating={5} size="sm" />
              <p className="text-xs text-amazon-muted leading-relaxed">
                "أنا شغالة صناعة محتوى وبستخدم CapCut Pro و Canva Pro، وفرت أكتر من ألف جنيه مقارنة بالأسعار الرسمية، والموقع منظم جداً ببيانات الحسابات."
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                المنتج: Canva Pro + CapCut Pro
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F1111]">علي فاروق</span>
                <span className="text-[10px] text-emerald-700 font-semibold">شراء موثق ✓</span>
              </div>
              <StarRating rating={5} size="sm" />
              <p className="text-xs text-amazon-muted leading-relaxed">
                "باقة التاجر الرقمي مع داتا الأرقام وواتساب سندر فرقت جداً في حملاتي التسويقية، الداتا مصنفة بدقة والبرنامج اشتغل معايا بكفاءة."
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                المنتج: باقة التاجر الرقمي
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
