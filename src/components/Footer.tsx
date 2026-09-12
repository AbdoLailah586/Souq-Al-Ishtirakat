import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Zap, Headphones, Sparkles, MessageCircle, Lock } from 'lucide-react';



export const Footer: React.FC = () => {
  const { settings, navigate: setCurrentTab } = useStore();

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b0a1a] border-t border-bazaar-border text-slate-400 text-sm mt-20 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="bazaar-glow-blob w-96 h-96 bg-bazaar-purple/10 -bottom-20 -right-20"></div>
      <div className="bazaar-glow-blob w-96 h-96 bg-bazaar-gold/5 -top-20 -left-20"></div>

      {/* Trust Badges Banner */}
      <div className="border-b border-bazaar-border/60 py-8 bg-bazaar-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-bazaar-card/40 border border-white/5">
            <div className="w-11 h-11 rounded-xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">تسليم سريع وفوري</h4>
              <p className="text-xs text-slate-400">تصلك بيانات الحساب مباشرة على لوحة تحكمك</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-bazaar-card/40 border border-white/5">
            <div className="w-11 h-11 rounded-xl bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">ضمان ذهبي كامل</h4>
              <p className="text-xs text-slate-400">حسابات رسمية مدعومة بضمان استبدال حقيقي</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-bazaar-card/40 border border-white/5">
            <div className="w-11 h-11 rounded-xl bg-bazaar-green/15 text-bazaar-green flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">دفع محلي آمن</h4>
              <p className="text-xs text-slate-400">شحن فوري عبر تطبيق انستاباي والمحافظ</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-bazaar-card/40 border border-white/5">
            <div className="w-11 h-11 rounded-xl bg-bazaar-purple/15 text-bazaar-purple flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">دعم فني متخصص</h4>
              <p className="text-xs text-slate-400">مساعدتك في التفعيل عبر الواتساب على مدار الساعة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
            <span className="text-2xl">🏮</span>
            <span className="text-2xl font-black font-cairo gold-gradient-text">
              {settings.siteName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
            المنصة الأولى الموثوقة لتوفير اشتراكات الذكاء الاصطناعي (ChatGPT, Claude, Gemini)، برامج التصميم والمونتاج (Adobe, Canva, CapCut) وخدمات التسويق بأفضل الأسعار وبنظام المحفظة السريعة.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={`https://wa.me/${settings.whatsappSupportNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع الدعم عبر واتساب</span>
            </a>
          </div>
        </div>

        {/* Links Col 1 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold font-cairo text-sm">الروابط السريعة</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleNav('home')} className="hover:text-bazaar-gold transition-colors">
                الرئيسية
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('services')} className="hover:text-bazaar-gold transition-colors">
                جميع الخدمات والاشتراكات
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('bundles')} className="hover:text-bazaar-gold transition-colors">
                الباقات والعروض المدمجة
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('payment')} className="hover:text-bazaar-gold transition-colors">
                طرق الشحن والدفع
              </button>
            </li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold font-cairo text-sm">السياسات والضمان</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleNav('warranty')} className="hover:text-bazaar-gold transition-colors">
                سياسة الضمان والاستبدال
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('support')} className="hover:text-bazaar-gold transition-colors">
                الأسئلة الشائعة (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('payment')} className="hover:text-bazaar-gold transition-colors">
                تعليمات التحويل والتحقق
              </button>
            </li>
          </ul>
        </div>

        {/* Payment Methods Badges */}
        <div className="space-y-4">
          <h4 className="text-white font-bold font-cairo text-sm">طرق الدفع المدعومة</h4>
          
          <div className="space-y-3 pt-1">
            {/* Row 1: InstaPay */}
            <div 
              onClick={() => handleNav('payment')}
              className="cursor-pointer group flex items-center justify-start transition-all"
              title="انستاباي - تحويل فوري ولحظي"
            >
              <img 
                src="/images/payment/instapay.png?v=3" 
                alt="انستاباي InstaPay" 
                className="h-8 w-auto max-w-[170px] object-contain filter drop-shadow hover:scale-105 transition-transform duration-200" 
              />
            </div>

            {/* Row 2: Vodafone Cash & Etisalat Cash */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div 
                onClick={() => handleNav('payment')}
                className="cursor-pointer group flex items-center justify-start transition-all"
                title="فودافون كاش"
              >
                <img 
                  src="/images/payment/vodafone-cash.png?v=3" 
                  alt="فودافون كاش Vodafone Cash" 
                  className="h-9 w-auto max-w-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-200" 
                />
              </div>

              <div 
                onClick={() => handleNav('payment')}
                className="cursor-pointer group flex items-center justify-start transition-all"
                title="اتصالات كاش"
              >
                <img 
                  src="/images/payment/etisalat-cash.png?v=3" 
                  alt="اتصالات كاش Etisalat Cash" 
                  className="h-9 w-auto max-w-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-200" 
                />
              </div>
            </div>

            {/* Row 3: WE Pay & Orange Europe */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div 
                onClick={() => handleNav('payment')}
                className="cursor-pointer group flex items-center justify-start transition-all"
                title="وي باي WE Pay"
              >
                <img 
                  src="/images/payment/we-pay.png?v=3" 
                  alt="وي باي WE Pay" 
                  className="h-9 w-auto max-w-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-200" 
                />
              </div>

              <div 
                onClick={() => handleNav('payment')}
                className="cursor-pointer group flex items-center justify-start transition-all"
                title="أورنج كاش وتحويلات أوروبا والدولية"
              >
                <img 
                  src="/images/payment/orange-europe.png?v=3" 
                  alt="أورنج كاش Orange Europe" 
                  className="h-9 w-auto max-w-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-200" 
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            مواعيد التحويل والتسليم: {settings.workingHours}
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-bazaar-border/60 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {settings.siteName}. جميع الحقوق محفوظة — بازار الاشتراكات الرقمية الأول.</p>
      </div>
    </footer>
  );
};
