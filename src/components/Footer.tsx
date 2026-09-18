import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/services';
import { MessageCircle, ShieldCheck, Zap, Lock, Headphones, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigate: setCurrentTab, setSelectedCategory, openTopUpModal } = useStore();

  const handleNav = (tab: string, cat?: string) => {
    if (cat) setSelectedCategory(cat);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-12 text-sm">
      {/* 1. Amazon Back to Top Bar */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-center py-3.5 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <ArrowUp className="w-4 h-4" />
        <span>العودة إلى الأعلى</span>
      </button>

      {/* 2. Amazon Multi-tier Directory Section */}
      <div className="bg-[#232F3E] text-slate-300 py-10 px-4 sm:px-6 lg:px-8 border-b border-[#3a4553]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-right">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt={settings.siteName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/50 shadow-md"
              />
              <div>
                <h3 className="text-white font-bold text-base font-cairo">
                  {settings.siteName}
                </h3>
                <span className="text-[10px] text-amber-400/90 font-semibold tracking-wider block">SOUQ AL-ISHTIRAKAT</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              المنصة الأولى الموثوقة لتوفير اشتراكات الذكاء الاصطناعي (ChatGPT, Claude, Gemini)، برامج التصميم والمونتاج (Adobe, Canva, CapCut) وخدمات التسويق بأفضل أسعار الجملة في مصر.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappSupportNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 px-3 py-1.5 rounded text-xs font-bold transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>دعم واتساب: {settings.whatsappSupportNumber}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm sm:text-base font-cairo">
              تسوق حسب القسم
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleNav('services', cat.id)}
                    className="hover:underline hover:text-white transition-colors"
                  >
                    {cat.name} ({cat.badgeCount} خدمة)
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('bundles')}
                  className="text-amazon-yellow font-semibold hover:underline"
                >
                  عروض اليوم والباقات المجمعة
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Warranty */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm sm:text-base font-cairo">
              الدعم وسياسة الضمان
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('payment')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  طرق الدفع والشحن (انستاباي / كاش)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('warranty')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  سياسة الضمان والاستبدال الذهبي
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('support')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  الأسئلة الشائعة وخدمة العملاء
                </button>
              </li>
              <li>
                <button
                  onClick={openTopUpModal}
                  className="text-amazon-search font-semibold hover:underline"
                >
                  شحن رصيد المحفظة الفوري
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Orders */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm sm:text-base font-cairo">
              حسابك ومشترياتك
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  لوحة التحكم الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dashboard-orders')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  طلباتي وبيانات الحسابات المستلمة
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dashboard-wallet')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  المحفظة وحركات الشحن
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('cart')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  سلة التسوق ومتابعة الشراء
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dashboard-profile')}
                  className="hover:underline hover:text-white transition-colors"
                >
                  الملف الشخصي وكلمة المرور
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Amazon Bottom Bar */}
      <div className="bg-[#131A22] text-slate-400 py-6 px-4 text-center text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
          <button onClick={() => handleNav('home')} className="hover:underline">الرئيسية</button>
          <span>•</span>
          <button onClick={() => handleNav('services')} className="hover:underline">كل الاشتراكات</button>
          <span>•</span>
          <button onClick={() => handleNav('bundles')} className="hover:underline">باقات التوفير</button>
          <span>•</span>
          <button onClick={() => handleNav('payment')} className="hover:underline">انستاباي والمحافظ</button>
          <span>•</span>
          <button onClick={() => handleNav('warranty')} className="hover:underline">الضمان والاسترجاع</button>
          <span>•</span>
          <button onClick={() => handleNav('support')} className="hover:underline">اتصل بنا</button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-500">
          <span>طرق الدفع المدعومة: InstaPay • فودافون كاش • اتصالات كاش • وي باي • أورنج كاش</span>
        </div>

        <div className="flex items-center justify-center gap-2 pt-1">
          <img src="/logo.png" alt={settings.siteName} className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400/40" />
          <p className="text-[11px] text-slate-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {settings.siteName} .eg — منصة الاشتراكات الرقمية الأولى في مصر
          </p>
        </div>
      </div>
    </footer>
  );
};
