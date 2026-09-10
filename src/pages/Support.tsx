import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  HelpCircle, 
  MessageCircle, 
  ChevronDown, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Support: React.FC = () => {
  const { settings } = useStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const faqs = [
    {
      q: 'كم يستغرق تسليم بيانات الحساب بعد إتمام الشراء؟',
      a: 'يتم تسليم معظم الحسابات فورياً خلال دقائق معدودة (من 5 إلى 30 دقيقة كحد أقصى خلال ساعات العمل). ستجد تفاصيل الحساب (الإيميل، الباسورد، الإرشادات) مباشرة في لوحة طلباتك.'
    },
    {
      q: 'كيف أقوم بشحن رصيد محفظتي للشراء من الموقع؟',
      a: 'يمكنك التحويل عبر تطبيق Instapay على عنواننا الرسمي، أو عبر محافظ كاش (فودافون كاش، أورنج، اتصالات، وي). بعد التحويل، اضغط على زر "+ شحن" في أعلى الموقع، وأدخل المبلغ ورقم هاتفك، وسيتم إضافة الرصيد لمحفظتك فوراً.'
    },
    {
      q: 'هل اشتراك Gemini Pro يتطلب إعطاءكم باسورد حسابي؟',
      a: 'لا نهائياً! تفعيل Gemini Pro و Google One يتم بمشاركة رابط تفعيل رسمي أو دعوة لعضوية العائلة لمساحة الـ 5 تيرابايت دون الحاجة لأي كلمات مرور، مما يحافظ على خصوصية حسابك بالكامل.'
    },
    {
      q: 'كيف أحصل على رمز التحقق (OTP) لحساب نتفلكس (Netflix)؟',
      a: 'حساب نتفلكس يتم تسليمه مع بيانات بريد إلكتروني مرتبط على Outlook. عند طلب رمز التحقق، يمكنك فتح بريد Outlook المرفق ونسخ الرمز منه مباشرة في أي وقت.'
    },
    {
      q: 'ماذا أفعل في حالة توقف الحساب أو حدوث أي مشكلة أثناء فترة الضمان؟',
      a: 'فريق الدعم الفني متواجد يومياً لخدمتك. تواصل معنا مباشرة عبر زر الواتساب مع ذكر رقم طلبك، وسيتم فحص الحساب واستبداله فوراً بحساب جديد طوال فترة الضمان.'
    },
    {
      q: 'هل يمكنني استخدام برنامج واتساب سندر على أكثر من كمبيوتر؟',
      a: 'ترخيص برنامج واتساب سندر يرتبط بجهاز واحد (Hardware ID). في حال قمت بتغيير جهازك، يمكنك التواصل مع الدعم الفني لنقل الترخيص لجهازك الجديد.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage) return;

    // Open WhatsApp with prefilled message
    const msg = encodeURIComponent(
      `مرحباً دعم سوق الاشتراكات،\nالاسم: ${contactName || 'عميل'}\nالهاتف: ${contactPhone || 'غير محدد'}\nالرسالة: ${contactMessage}`
    );
    window.open(`https://wa.me/${settings.whatsappSupportNumber}?text=${msg}`, '_blank');

    setIsSent(true);
    setContactMessage('');
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-purple/15 text-bazaar-purple text-xs font-bold border border-bazaar-purple/30">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>مركز المساعدة والدعم الفني</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-cairo text-white">
          كيف يمكننا مساعدتك اليوم؟
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          إجابات شاملة لأكثر الأسئلة الشائعة، مع قنوات تواصل مباشرة عبر تطبيق واتساب.
        </p>
      </div>

      {/* Support Hours Banner */}
      <div className="p-4 rounded-2xl bg-bazaar-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-4 h-4 text-bazaar-gold shrink-0" />
          <span>مواعيد عمل الدعم الفني: <strong className="text-white">{settings.workingHours}</strong></span>
        </div>
        <a
          href={`https://wa.me/${settings.whatsappSupportNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>محادثة واتساب مباشرة</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQs Accordion (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xl font-bold font-cairo text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-bazaar-gold" />
            <span>الأسئلة الأكثر شيوعاً</span>
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-bazaar-card/80 border border-white/5 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-right p-4 font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 hover:bg-white/[0.02]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-bazaar-gold' : ''
                    }`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Contact Form */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-bazaar-card via-bazaar-surface to-bazaar-card border border-bazaar-gold/30 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold font-cairo text-white">
            أرسل استفسارك مباشرة
          </h3>
          <p className="text-xs text-slate-400">
            اكتب رسالتك وسيتم تحويلك لمحادثة الدعم الفني فوراً.
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">الاسم:</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="اسمك الكريم"
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-bazaar-gold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">رقم الهاتف / الواتساب:</label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-bazaar-gold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">نص الاستفسار أو المشكلة:</label>
              <textarea
                required
                rows={4}
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                placeholder="اكتب استفسارك بالتفصيل..."
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-bazaar-gold"
              />
            </div>

            {isSent && (
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-300 text-xs text-center border border-emerald-500/30">
                جاري فتح المحادثة على الواتساب...
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال عبر واتساب</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
