import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CreditCard, 
  Smartphone, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const PaymentGuide: React.FC = () => {
  const { settings, openTopUpModal } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-gold/15 text-bazaar-gold text-xs font-bold border border-bazaar-gold/30">
          <CreditCard className="w-3.5 h-3.5" />
          <span>دليل الدفع والشحن المحلي</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-cairo text-white">
          طرق الدفع والشحن في سوق الاشتراكات
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          نظام محفظة سهل وآمن. اشحن رصيدك عبر انستاباي أو المحافظ الإلكترونية، واستخدم رصيدك للشراء الفوري في أي وقت.
        </p>
      </div>

      {/* Methods Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Instapay Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-bazaar-card via-bazaar-surface to-bazaar-card border-2 border-bazaar-gold/40 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-bazaar-gold/20 text-bazaar-gold flex items-center justify-center font-black text-xl">
                ⚡
              </div>
              <div>
                <h3 className="text-xl font-bold font-cairo text-white">انستاباي (Instapay)</h3>
                <p className="text-xs text-emerald-400 font-semibold">تحويل لحظي - رسوم 0%</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-bazaar-gold/20 text-bazaar-gold border border-bazaar-gold/30">
              الأسرع والموصى به
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            التحويل الفوري من أي بنك مصري مباشرة إلى حسابنا في تطبيق انستاباي، بدون أي رسوم إضافية وبأعلى سرعة تأكيد.
          </p>

          {/* Account Details Box */}
          <div className="p-4 rounded-2xl bg-bazaar-bg/90 border border-white/10 space-y-3">
            <div className="text-xs text-slate-400">عنوان الدفع اللحظي (IPA Handle):</div>
            <div className="flex items-center justify-between bg-bazaar-card p-3 rounded-xl border border-bazaar-gold/30">
              <span className="font-mono text-sm font-bold text-amber-300 select-all" dir="ltr">
                {settings.instapayHandle}
              </span>
              <button
                onClick={() => handleCopy(settings.instapayHandle, 'guide-insta')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                {copiedKey === 'guide-insta' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-xs">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-xs">نسخ العنوان</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-slate-300">
              اسم المستلم الظاهر في التطبيق: <span className="font-bold text-white">{settings.instapayName}</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white font-cairo">خطوات التحويل عبر انستاباي:</h4>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside pr-1 leading-relaxed">
              <li>افتح تطبيق Instapay واختر "إرسال نقود".</li>
              <li>اختر التحويل إلى "عنوان دفع لحظي (IPA)".</li>
              <li>انسخ العنوان أعلاه والصقه، وأدخل المبلغ المطلوب.</li>
              <li>تأكد من مطابقة اسم المستلم ثم أدخل الرقم السري (IPN PIN).</li>
              <li>التقط سكرين شوت لإيصال التحويل واضغط على زر شحن المحفظة.</li>
            </ol>
          </div>
        </div>

        {/* Vodafone Cash Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-bazaar-card via-bazaar-surface to-bazaar-card border-2 border-bazaar-teal/40 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-bazaar-teal/20 text-bazaar-teal flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-cairo text-white">محافظ كاش الإلكترونية</h3>
                <p className="text-xs text-bazaar-teal font-semibold">فودافون كاش ومحافظ البنوك</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-bazaar-teal/20 text-bazaar-teal border border-bazaar-teal/30">
              متاح 24/7
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            التحويل من أي محفظة كاش (فودافون، أورنج، اتصالات، وي، أو أي محفظة بنكية ذكية) إلى رقم الكاش المعتمد لدينا.
          </p>

          {/* Account Details Box */}
          <div className="p-4 rounded-2xl bg-bazaar-bg/90 border border-white/10 space-y-3">
            <div className="text-xs text-slate-400">رقم المحفظة للتحويل:</div>
            <div className="flex items-center justify-between bg-bazaar-card p-3 rounded-xl border border-bazaar-teal/30">
              <span className="font-mono text-sm font-bold text-bazaar-teal select-all" dir="ltr">
                {settings.vodafoneCashNumber}
              </span>
              <button
                onClick={() => handleCopy(settings.vodafoneCashNumber, 'guide-cash')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                {copiedKey === 'guide-cash' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-xs">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-xs">نسخ الرقم</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-[11px] text-slate-400">
              ⚠️ يرجى التأكد من تحويل المبلغ الصافي بدون خصم مصاريف السحب من طرفكم.
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white font-cairo">خطوات التحويل عبر فودافون كاش:</h4>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside pr-1 leading-relaxed">
              <li>اطلب الكود <code>*9*7*الرقم*المبلغ#</code> أو افتح تطبيق أنا فودافون.</li>
              <li>أدخل الرقم السري للمحفظة لتأكيد التحويل.</li>
              <li>احتفظ برسالة تأكيد التحويل (SMS) أو سكرين شوت التطبيق.</li>
              <li>افتح نافذة "شحن المحفظة" وسجل رقمك والمبلغ لتعميده فوراً.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-8 rounded-3xl bg-bazaar-card/90 border border-bazaar-gold/30 text-center space-y-4">
        <h3 className="text-xl font-bold font-cairo text-white">
          هل قمت بالتحويل الآن؟
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          اضغط على الزر أدناه لتسجيل طلب الشحن ورفع الإيصال لإضافة الرصيد إلى محفظتك في ثوانٍ.
        </p>
        <button
          onClick={openTopUpModal}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-sm shadow-xl shadow-bazaar-gold/20 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>فتح نموذج شحن المحفظة</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
