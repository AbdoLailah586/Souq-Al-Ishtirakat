import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/services';
import { minEffectivePrice, hasAnyOffer, effectivePrice, isOfferActive, discountPercent } from '../utils/pricing';
import { productRating, formatCount } from '../utils/productMeta';
import { ProductCarousel } from '../components/ProductCarousel';
import { ProductTile } from '../components/ProductTile';
import { BundleCard } from '../components/BundleCard';
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
              <img src="/logo.png" alt="سوق الاشتراكات" className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400/40" />
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
          <div className="bg-white dark:bg-[#161538] p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl rounded-3xl flex flex-col justify-between transition-all duration-300">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-cairo">
                أشهر اشتراكات الذكاء الاصطناعي
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3.5">
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
                      <div className="h-20 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 rounded-2xl p-2 flex items-center justify-center mb-1.5 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                        ) : (
                          <span className="text-2xl">🤖</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-amazon-orange dark:group-hover:text-bazaar-gold transition-colors">
                        {service.name}
                      </div>
                      <div className="text-[11px] font-black text-rose-600 dark:text-rose-400">
                        {p} ج.م
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => handleCategoryClick('ai')}
              className="mt-4 text-xs font-bold text-amazon-link dark:text-teal-400 hover:underline text-right block"
            >
              استكشف كل أدوات الذكاء الاصطناعي ›
            </button>
          </div>

          {/* Tile 2: Design & Content 4-in-1 Quad Card */}
          <div className="bg-white dark:bg-[#161538] p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl rounded-3xl flex flex-col justify-between transition-all duration-300">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-cairo">
                أدوات التصميم والمونتاج
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3.5">
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
                      <div className="h-20 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 rounded-2xl p-2 flex items-center justify-center mb-1.5 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                        ) : (
                          <span className="text-2xl">🎨</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-amazon-orange dark:group-hover:text-bazaar-gold transition-colors">
                        {service.name}
                      </div>
                      <div className="text-[11px] font-black text-rose-600 dark:text-rose-400">
                        {p} ج.م
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => handleCategoryClick('design')}
              className="mt-4 text-xs font-bold text-amazon-link dark:text-teal-400 hover:underline text-right block"
            >
              استكشف كل برامج التصميم ›
            </button>
          </div>

          {/* Tile 3: Top Savings Bundle Spotlight Card */}
          <div className="bg-white dark:bg-[#161538] p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl rounded-3xl flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-cairo">
                  أقوى باقات التوفير
                </h2>
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  خصم مجمع
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3.5">
                اشتراكات مجمعة في باقة واحدة
              </p>

              {topBundle && (
                <div 
                  onClick={() => openBundleProduct(topBundle)}
                  className="cursor-pointer group space-y-3"
                >
                  <div className="h-36 relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-200/80 dark:border-white/10 group-hover:border-amber-500/50 transition-all">
                    <img
                      src={topBundle.imageUrl || '/images/bundles/bundle-chatgpt-gemini.jpg'}
                      alt={topBundle.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between z-10 text-white">
                      <span className="text-xs font-black truncate drop-shadow">{topBundle.name}</span>
                      <span className="text-[10px] font-bold bg-rose-600 px-2.5 py-0.5 rounded-full shadow">
                        وفر {topBundle.savings} ج.م
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">ج.م</span>
                      <span className="text-2xl font-black text-rose-600 dark:text-rose-400 leading-none">
                        {effectivePrice(topBundle)}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through mr-1">
                        {topBundle.price} ج.م
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {topBundle.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('bundles')}
              className="mt-4 text-xs font-bold text-amazon-link dark:text-teal-400 hover:underline text-right block"
            >
              عرض جميع الباقات (6 باقات) ›
            </button>
          </div>

          {/* Tile 4: Instant Wallet & Top Up Card */}
          <div className="bg-white dark:bg-[#161538] p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl rounded-3xl flex flex-col justify-between transition-all duration-300">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-cairo">
                محفظتك وطرق الدفع
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3.5">
                شحن رصيد فوري عبر انستاباي والمحافظ
              </p>

              {user ? (
                <div className="space-y-3 bg-slate-50 dark:bg-black/25 p-3.5 border border-slate-200/80 dark:border-white/5 rounded-2xl text-right">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">الرصيد المتاح:</span>
                    <span className="font-black text-lg text-emerald-600 dark:text-emerald-400 font-cairo">
                      {user.balance.toLocaleString()} ج.م
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
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
                <div className="space-y-3 bg-slate-50 dark:bg-black/25 p-3.5 border border-slate-200/80 dark:border-white/5 rounded-2xl text-right">
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
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
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 mt-3">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 mb-2">طرق الدفع المعتمدة:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300">انستاباي ⚡</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-300">فودافون كاش</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300">اتصالات كاش</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('payment')}
              className="mt-4 text-xs font-bold text-amazon-link dark:text-teal-400 hover:underline text-right block"
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
      <section className="bg-white dark:bg-[#161538] mx-3 sm:mx-4 lg:mx-6 p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-sm rounded-3xl space-y-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
              <Gift className="w-4 h-4" />
              <span>عروض التوفير الشاملة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-cairo text-slate-900 dark:text-white">
              باقات التوفير الكبرى (Bundles)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              اشتراكات متعددة مجمعة في باقة واحدة بخصم فوري يصل إلى 120 جنيه
            </p>
          </div>

          <button
            onClick={() => navigate('bundles')}
            className="text-xs sm:text-sm font-bold text-amazon-link dark:text-teal-400 hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1"
          >
            <span>عرض كافة الباقات ({visibleBundles.length})</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleBundles.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </section>

      {/* 7. Value Propositions Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white dark:bg-[#161538] p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm flex items-start gap-3.5 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">تسليم رقمي فوري</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                تصلك بيانات الحساب والترخيص فوراً على لوحة طلباتك بدون أي تأخير.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161538] p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm flex items-start gap-3.5 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">ضمان ذهبي 100%</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                دعم فني مستمر واستبدال فوري لأي حساب طوال فترة الاشتراك.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161538] p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm flex items-start gap-3.5 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0 border border-purple-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">دفع محلي بالجنيه</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                بدون فيزا دولية — ادفع عبر انستاباي أو المحافظ الإلكترونية.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161538] p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm flex items-start gap-3.5 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">دعم فني 24/7</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                فريق متخصص لمساعدتك في التفعيل والرد على استفساراتك عبر واتساب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Accepted Payment Methods Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white dark:bg-[#161538] p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
          <div className="space-y-1 text-center md:text-right">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-cairo">
              طرق الشحن والدفع المعتمدة لدى سوق الاشتراكات
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اشحن رصيد محفظتك بسهولة خلال ثوانٍ وبدون أي رسوم إضافية.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { name: 'انستاباي (InstaPay)', color: 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40' },
              { name: 'فودافون كاش', color: 'text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40' },
              { name: 'اتصالات كاش', color: 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40' },
              { name: 'وي باي (WE Pay)', color: 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40' },
              { name: 'أورنج كاش', color: 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40' },
            ].map(pm => (
              <span
                key={pm.name}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${pm.color}`}
              >
                {pm.name}
              </span>
            ))}
          </div>

          <button
            onClick={openTopUpModal}
            className="btn-buy px-6 py-2.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap active:scale-95 transition-all"
          >
            شحن رصيد الآن
          </button>
        </div>
      </section>

      {/* 9. Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white dark:bg-[#161538] p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm space-y-5 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-cairo text-slate-900 dark:text-white">
                تقييمات وتجارب العملاء الموثقة
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={4.9} size="md" />
                <span className="text-xs text-slate-500 dark:text-slate-400">4.9 من 5 بناءً على 480+ تقييم شراء موثق</span>
              </div>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1 rounded-full hidden sm:inline-block">
              ✓ تقييمات موثقة 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">محمود حسني</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">شراء موثق ✓</span>
              </div>
              <StarRating rating={5} size="sm" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "اشتراك Gemini Pro بـ 150 جنيه مع مساحة 5 تيرابايت كاملة على إيميلي الشخصي صفقة خيالية، والدعم تواصل معايا في دقائق لتأكيد التفعيل."
              </p>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                المنتج: Gemini Pro 5TB
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">سارة الجيار</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">شراء موثق ✓</span>
              </div>
              <StarRating rating={5} size="sm" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "أنا شغالة صناعة محتوى وبستخدم CapCut Pro و Canva Pro، وفرت أكتر من ألف جنيه مقارنة بالأسعار الرسمية، والموقع منظم جداً ببيانات الحسابات."
              </p>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                المنتج: Canva Pro + CapCut Pro
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">علي فاروق</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">شراء موثق ✓</span>
              </div>
              <StarRating rating={5} size="sm" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "باقة التاجر الرقمي مع داتا الأرقام وواتساب سندر فرقت جداً في حملاتي التسويقية، الداتا مصنفة بدقة والبرنامج اشتغل معايا بكفاءة."
              </p>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                المنتج: باقة التاجر الرقمي
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
