import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  HelpCircle, 
  MessageCircle, 
  ChevronDown, 
  Clock, 
  Send, 
  CheckCircle2
} from 'lucide-react';

export const Support: React.FC = () => {
  const { settings, navigate } = useStore();
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
      a: 'يمكنك التحويل عبر تطبيق Instapay على عنواننا الرسمي، أو عبر محافظ كاش (فودافون كاش، أورنج، اتصالات، وي). بعد التحويل، اضغط على زر "شحن المحفظة" في أعلى الموقع، وأدخل المبلغ ورقم هاتفك، وسيتم إضافة الرصيد لمحفظتك فوراً.'
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

    const msg = encodeURIComponent(
      `مرحباً دعم سوق الاشتراكات،\nالاسم: ${contactName || 'عميل'}\nالهاتف: ${contactPhone || 'غير محدد'}\nالرسالة: ${contactMessage}`
    );
    window.open(`https://wa.me/${settings.whatsappSupportNumber}?text=${msg}`, '_blank');

    setIsSent(true);
    setContactMessage('');
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">مركز خدمة العملاء والدعم</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm text-right space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-sm border border-blue-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>مركز المساعدة والدعم الفني</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-cairo text-[#0F1111]">
          كيف يمكننا مساعدتك اليوم؟
        </h1>
        <p className="text-xs sm:text-sm text-amazon-muted max-w-xl">
          إجابات شاملة لأكثر الأسئلة الشائعة، مع قنوات تواصل مباشرة عبر تطبيق واتساب ومواعيد العمل الرسمية.
        </p>
      </div>

      {/* Support Hours Banner */}
      <div className="p-4 rounded-sm bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Clock className="w-4 h-4 text-amazon-orange shrink-0" />
          <span>مواعيد عمل الدعم الفني: <strong className="text-[#0F1111]">{settings.workingHours}</strong></span>
        </div>
        <a
          href={`https://wa.me/${settings.whatsappSupportNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>محادثة واتساب فورية</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs Accordion */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-bold font-cairo text-[#0F1111] pb-1 border-b border-slate-200">
            الأسئلة الشائعة وإجاباتها
          </h2>

          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-right flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#0F1111] font-cairo">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amazon-orange' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-5 border border-slate-200 shadow-sm rounded-sm space-y-3 h-fit">
          <h3 className="text-base font-bold font-cairo text-[#0F1111] pb-1 border-b border-slate-100">
            أرسل رسالة مباشرة للدعم
          </h3>
          <p className="text-xs text-amazon-muted leading-relaxed">
            اكتب استفسارك وسيتم تحويلك فوراً لمحادثة الدعم الفني على واتساب.
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">الاسم الكريم:</label>
              <input 
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-[#0F1111] focus:outline-none focus:border-amazon-orange focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">رقم الهاتف:</label>
              <input 
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-[#0F1111] focus:outline-none focus:border-amazon-orange focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">نص الاستفسار أو المشكلة:</label>
              <textarea 
                rows={3}
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                required
                placeholder="تفاصيل طلبك أو رقم الطلب..."
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-[#0F1111] focus:outline-none focus:border-amazon-orange focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full btn-buy text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال عبر واتساب</span>
            </button>

            {isSent && (
              <div className="p-2 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold text-center border border-emerald-200">
                جاري فتح تطبيق واتساب للتواصل...
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
