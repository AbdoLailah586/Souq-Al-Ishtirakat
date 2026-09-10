import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { BundleCard } from '../components/BundleCard';
import { 
  Sparkles, 
  ArrowLeft, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Gift, 
  Users, 
  Star,
  ChevronRight,
  Search
} from 'lucide-react';

interface HomeProps {
  setCurrentTab: (tab: string) => void;
  setSelectedCategory: (cat: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentTab, setSelectedCategory }) => {
  const { services, bundles, openTopUpModal } = useStore();
  const { user } = useAuth();

  const featuredServices = services.filter(s => s.featured).slice(0, 6);
  const featuredBundles = bundles.slice(0, 3);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Blobs */}
        <div className="bazaar-glow-blob w-[500px] h-[500px] bg-bazaar-gold/10 -top-24 -right-24"></div>
        <div className="bazaar-glow-blob w-[500px] h-[500px] bg-bazaar-purple/15 top-1/2 -left-32"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-bazaar-gold/15 to-bazaar-teal/15 border border-bazaar-gold/30 shadow-glow-gold">
            <span className="text-base">🏮</span>
            <span className="text-xs sm:text-sm font-bold text-amber-300">
              أول بازار رقمي مصري للاشتراكات الرسمية بأسعار الجملة
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black font-cairo text-white leading-tight tracking-tight">
            امتلك أقوى اشتراكات <br />
            <span className="gold-gradient-text">الذكاء الاصطناعي والتصميم</span> <br />
            مع تسليم فوري وضمان كامل
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            وفّر حتى 70% من تكلفة اشتراكاتك الرقمية: ChatGPT Plus، Gemini Pro 5TB، Claude Pro، Canva Pro، CapCut، وباقات أدوبي، بنظام محفظة ذكي ودفع عبر Instapay والمحافظ الإلكترونية.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentTab('services');
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-bazaar-gold via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-sm sm:text-base shadow-xl shadow-bazaar-gold/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>تصفح جميع الاشتراكات</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={openTopUpModal}
              className="px-6 py-4 rounded-2xl bg-bazaar-card hover:bg-bazaar-cardHover text-white border border-bazaar-gold/30 hover:border-bazaar-gold font-bold text-sm sm:text-base transition-all flex items-center gap-2 active:scale-95 shadow-md"
            >
              <Wallet className="w-5 h-5 text-bazaar-gold" />
              <span>شحن المحفظة (انستاباي / كاش)</span>
            </button>

            <button
              onClick={() => setCurrentTab('bundles')}
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-bazaar-teal border border-bazaar-teal/30 font-bold text-sm sm:text-base transition-all flex items-center gap-2 active:scale-95"
            >
              <Gift className="w-5 h-5" />
              <span>عروض الباقات الموفرة</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-bazaar-card/60 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-cairo">13+</div>
              <div className="text-xs text-slate-400 mt-0.5">خدمة واشتراك رقمي</div>
            </div>
            <div className="p-4 rounded-2xl bg-bazaar-card/60 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-bazaar-teal font-cairo">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">ضمان ذهبي واستبدال</div>
            </div>
            <div className="p-4 rounded-2xl bg-bazaar-card/60 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-bazaar-purple font-cairo">دقائق</div>
              <div className="text-xs text-slate-400 mt-0.5">متوسط سرعة التسليم</div>
            </div>
            <div className="p-4 rounded-2xl bg-bazaar-card/60 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-cairo">Instapay</div>
              <div className="text-xs text-slate-400 mt-0.5">دفع محلي فوري وآمن</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-bazaar-gold uppercase tracking-wider">
            أقسام السوق الرقمي
          </span>
          <h2 className="text-3xl font-black font-cairo text-white">
            اختر مجالك وتصفح الاشتراكات المتخصصة
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="p-5 rounded-3xl bg-bazaar-card/70 hover:bg-bazaar-cardHover border border-white/5 hover:border-bazaar-gold/50 transition-all text-center flex flex-col items-center justify-between group shadow-lg"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-inner"
                style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold font-cairo text-white group-hover:text-bazaar-gold transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1">
                {cat.badgeCount} خدمات متاحة
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Bundles Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-bazaar-teal px-2.5 py-1 rounded-full bg-bazaar-teal/10 border border-bazaar-teal/20 mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>عروض مدمجة بأعلى توفير</span>
            </div>
            <h2 className="text-3xl font-black font-cairo text-white">
              باقات التوفير الكبرى (Bundles)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              اشتراكات متعددة مجمعة في باقة واحدة بخصم فوري يصل إلى 120 جنيه
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('bundles')}
            className="text-xs font-bold text-bazaar-gold hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <span>عرض كل الـ 6 باقات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBundles.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </section>

      {/* Top Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-bazaar-gold px-2.5 py-1 rounded-full bg-bazaar-gold/10 border border-bazaar-gold/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الأكثر طلباً هذا الأسبوع</span>
            </div>
            <h2 className="text-3xl font-black font-cairo text-white">
              أشهر اشتراكات الذكاء الاصطناعي والتصميم
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentTab('services');
            }}
            className="text-xs font-bold text-bazaar-gold hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <span>استعراض كل الخدمات (13 خدمة)</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-bazaar-card via-bazaar-surface to-bazaar-card rounded-3xl p-8 sm:p-12 border border-bazaar-border relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-bazaar-teal uppercase tracking-wider">
              بساطة وسرعة
            </span>
            <h2 className="text-3xl font-black font-cairo text-white mt-1">
              كيف تشتري اشتراكك في 3 خطوات بسيطة؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="text-center space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center text-xl font-black font-cairo mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold font-cairo text-white">اختر الخدمة والمدة</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تصفح كتالوج الخدمات، حدد مدة الاشتراك المناسبة لاحتياجك وميزانيتك، واطلع على كامل الميزات.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center text-xl font-black font-cairo mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold font-cairo text-white">اشحن محفظتك محلياً</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                حول المبلغ عبر انستاباي أو فودافون كاش بكل سهولة، وسيتم إضافة الرصيد لحسابك خلال لحظات.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-bazaar-purple/15 text-bazaar-purple flex items-center justify-center text-xl font-black font-cairo mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold font-cairo text-white">استلم بياناتك فوراً</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                اضغط شراء، وتصلك بيانات الحساب (الإيميل، الباسورد، الإرشادات) مباشرة في لوحة طلباتك مع زر نسخ سريع.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust / Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl font-black font-cairo text-white">
            آراء وتجارب عملائنا المميزين
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              "اشتراك Gemini Pro بـ 150 جنيه فقط مع مساحة 5 تيرابايت كاملة على إيميلي الشخصي صفقة خيالية، والدعم الفني تواصل معايا في دقائق لتأكيد التفعيل."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <div className="w-9 h-9 rounded-full bg-bazaar-gold/20 text-bazaar-gold flex items-center justify-center font-bold text-xs">
                م
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">محمود حسني</h4>
                <p className="text-[10px] text-slate-400">مهندس برمجيات</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              "أنا شغال صناعة محتوى وبستخدم CapCut Pro و Canva Pro، وفرت أكتر من ألف جنيه مقارنة بالأسعار الرسمية، والموقع منظم جداً ببيانات الحسابات."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <div className="w-9 h-9 rounded-full bg-bazaar-teal/20 text-bazaar-teal flex items-center justify-center font-bold text-xs">
                س
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">سارة الجيار</h4>
                <p className="text-[10px] text-slate-400">صانعة محتوى ديجيتال</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              "باقة التاجر الرقمي مع داتا الأرقام وواتساب سندر فرقت جداً في حملاتي التسويقية، الداتا مصنفة بدقة والبرنامج اشتغل معايا بكفاءة بدون أي مشاكل."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <div className="w-9 h-9 rounded-full bg-bazaar-purple/20 text-bazaar-purple flex items-center justify-center font-bold text-xs">
                ع
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">علي فاروق</h4>
                <p className="text-[10px] text-slate-400">مدير متجر إلكتروني</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
