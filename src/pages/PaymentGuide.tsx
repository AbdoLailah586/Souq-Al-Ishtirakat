import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Globe,
  HelpCircle
} from 'lucide-react';

export const PaymentGuide: React.FC = () => {
  const { settings, openTopUpModal } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const paymentMethods = [
    {
      id: 'instapay',
      name: 'انستاباي (InstaPay)',
      tag: 'الأسرع والموصى به ⚡',
      badgeColor: 'text-purple-300 bg-purple-900/40 border-purple-500/40',
      image: '/images/payment/instapay.png',
      fee: 'رسوم 0% - تحويل لحظي فوري',
      description: 'التحويل المباشر من أي بنك مصري أو بطاقة ميزة إلى عنوان الدفع اللحظي (IPA) بأعلى سرعة وأمان.',
      targetLabel: 'عنوان الدفع اللحظي (IPA Handle)',
      targetValue: settings.instapayHandle,
      extraInfo: `اسم المستلم في التطبيق: ${settings.instapayName}`,
      steps: [
        'افتح تطبيق Instapay على هاتفك واختر «إرسال نقود».',
        'اختر التحويل إلى «عنوان دفع لحظي (IPA)».',
        'الصق عنوان الدفع أعلاه وأدخل المبلغ المطلوب شحنه.',
        'تأكد من مطابقة اسم المستلم ثم أدخل الرقم السري (IPN PIN).',
        'التقط لقطة شاشة لإيصال التحويل واضغط «شحن رصيد المحفظة» بالأسفل.'
      ]
    },
    {
      id: 'vodafone-cash',
      name: 'فودافون كاش (Vodafone Cash)',
      tag: 'الأكثر انتشاراً في مصر 📱',
      badgeColor: 'text-rose-300 bg-rose-900/40 border-rose-500/40',
      image: '/images/payment/vodafone-cash.png',
      fee: 'متاح 24 ساعة - تأكيد سريع',
      description: 'التحويل من محفظة فودافون كاش أو تطبيق «أنا فودافون» مباشرة إلى رقم المحفظة المعتمد لدينا.',
      targetLabel: 'رقم محفظة التحويل',
      targetValue: settings.vodafoneCashNumber,
      extraInfo: 'الكود السريع: *9*7*الرقم*المبلغ#',
      steps: [
        'اطلب الكود السريع #المبلغ*الرقم*7*9* أو افتح تطبيق أنا فودافون.',
        'اختر تحويل أموال إلى رقم محفظة فودافون كاش.',
        'أدخل رقم المحفظة أعلاه والمبلغ المطلوب بدون خصم مصاريف.',
        'أدخل الرقم السري للمحفظة لتأكيد خروج المبلغ.',
        'احتفظ برسالة التأكيد أو الإيصال لرفعه في طلب الشحن.'
      ]
    },
    {
      id: 'etisalat-cash',
      name: 'اتصالات كاش (Etisalat Cash)',
      tag: 'محفظة اتصالات مصر 🟢',
      badgeColor: 'text-emerald-300 bg-emerald-900/40 border-emerald-500/40',
      image: '/images/payment/etisalat-cash.png',
      fee: 'تحويل فوري لحظي',
      description: 'التحويل من تطبيق My Etisalat أو كود اتصالات كاش مباشرة بكل سهولة وأمان.',
      targetLabel: 'رقم المحفظة المعتمد للتحويل',
      targetValue: settings.etisalatCashNumber || settings.vodafoneCashNumber,
      extraInfo: 'الكود المختصر: اطلب *777# واختر تحويل أموال',
      steps: [
        'افتح تطبيق My Etisalat أو اطلب الكود *777#.',
        'اختر خدمة تحويل الأموال إلى محفظة إلكترونية.',
        'أدخل رقم المحفظة أعلاه والمبلغ المراد شحنه.',
        'أكد العملية بإدخال الرقم السري لمحفظتك.',
        'التقط صورة لرسالة نجاح التحويل وأرفقها في صفحة الشحن.'
      ]
    },
    {
      id: 'we-pay',
      name: 'وي باي (WE Pay)',
      tag: 'محفظة المصرية للاتصالات 🟣',
      badgeColor: 'text-purple-300 bg-purple-900/40 border-purple-500/40',
      image: '/images/payment/we-pay.png',
      fee: 'شحن فوري مباشر',
      description: 'ادفع واشحن رصيدك عبر تطبيق WE Pay الرسمي بسهولة فائقة بدون أي تعقيدات.',
      targetLabel: 'رقم محفظة التحويل',
      targetValue: settings.wePayNumber || settings.vodafoneCashNumber,
      extraInfo: 'متاح التحويل من كافة محافظ وي باي وتطبيق WE Pay',
      steps: [
        'افتح تطبيق WE Pay على هاتفك المحمول.',
        'اختر «تحويل أموال» من القائمة الرئيسية.',
        'أدخل رقم المحفظة المحدد أعلاه ومبلغ التحويل.',
        'أدخل الرقم السري لمحفظة WE Pay وأتمم التحويل.',
        'احفظ الإيصال لتقديمه في طلب شحن المحفظة.'
      ]
    },
    {
      id: 'orange-europe',
      name: 'أورنج كاش وتحويلات أوروبا والدولية',
      tag: 'محلي ودولي للمغتربين 🌍',
      badgeColor: 'text-amber-300 bg-amber-900/40 border-amber-500/40',
      image: '/images/payment/orange-europe.png',
      fee: 'دعم العملاء بالخارج وأوروبا',
      description: 'نوفر حلول تحويل مرنة لعملائنا في مصر عبر أورنج كاش ولعملائنا في أوروبا والدول العربية عبر الحسابات البنكية المباشرة.',
      targetLabel: 'رقم محفظة أورنج / الاستفسار الدولي',
      targetValue: settings.orangeCashNumber || settings.vodafoneCashNumber,
      extraInfo: 'للمغتربين في أوروبا: تواصل مع الدعم عبر واتساب لتزويدك ببيانات التحويل الدولي واليورو.',
      steps: [
        'للتحويل المحلي عبر أورنج كاش: اطلب #115# أو استخدم تطبيق Orange Cash.',
        'للتحويلات من دول أوروبا والخليج: اضغط على زر تواصل الدعم الفني بالأسفل.',
        'سيقوم ممثل خدمة العملاء بتزويدك بالحساب البنكي أو طريقة التحويل المتاحة في بلدك.',
        'يتم تأكيد الشحن الفوري في رصيد محفظتك بمجرد إرسال إشعار التحويل.'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bazaar-gold/15 text-bazaar-gold text-xs font-black border border-bazaar-gold/30 shadow-md">
          <CreditCard className="w-4 h-4 text-bazaar-gold" />
          <span>بوابة وطرق الدفع والشحن المعتمدة</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-cairo text-white leading-tight">
          طرق الدفع والشحن في سوق الاشتراكات
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
          نوفر لك أحدث وأأمن وسائل الدفع الإلكتروني في مصر والوطن العربي وأوروبا. اشحن رصيد محفظتك واستمتع بتفعيل اشتراكاتك فورياً.
        </p>

        {/* Feature badges */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>رسوم تحويل 0%</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>تأكيد وشحن فوري في دقائق</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>أمان وحماية 100%</span>
          </span>
        </div>
      </div>

      {/* Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map(method => (
          <div 
            key={method.id}
            className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-bazaar-gold/50 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
          >
            <div>
              {/* Image Preview Header */}
              <div className="relative h-44 overflow-hidden bg-slate-950 border-b border-white/10 p-4 flex items-center justify-center">
                <img 
                  src={method.image} 
                  alt={method.name} 
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border backdrop-blur-md shadow-md ${method.badgeColor}`}>
                    {method.tag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-black font-cairo text-white group-hover:text-bazaar-gold transition-colors">
                    {method.name}
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                    {method.fee}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {method.description}
                </p>

                {/* Account Details / Number to copy */}
                <div className="p-3.5 rounded-2xl bg-bazaar-bg/90 border border-white/10 space-y-2">
                  <div className="text-[10px] text-slate-400 font-semibold">{method.targetLabel}:</div>
                  <div className="flex items-center justify-between bg-bazaar-card p-2.5 rounded-xl border border-bazaar-gold/30">
                    <span className="font-mono text-xs sm:text-sm font-black text-amber-300 select-all truncate" dir="ltr">
                      {method.targetValue}
                    </span>
                    <button
                      onClick={() => handleCopy(method.targetValue, method.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-all shrink-0 ml-1"
                    >
                      {copiedKey === method.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold text-[10px]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                  {method.extraInfo && (
                    <div className="text-[11px] text-slate-300 font-medium pt-1">
                      {method.extraInfo}
                    </div>
                  )}
                </div>

                {/* Steps List */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-white font-cairo flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-bazaar-gold" />
                    <span>خطوات التحويل:</span>
                  </h4>
                  <ol className="space-y-1.5 text-[11px] text-slate-300 pr-3 list-decimal leading-relaxed">
                    {method.steps.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="pl-1">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Card Action */}
            <div className="p-5 pt-0">
              <button
                onClick={openTopUpModal}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold/20 to-amber-500/20 hover:from-bazaar-gold hover:to-amber-500 text-bazaar-gold hover:text-bazaar-bg border border-bazaar-gold/40 hover:border-transparent text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <span>شحن المحفظة بهذا الخيار</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Direct CTA and WhatsApp Support Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-bazaar-card via-bazaar-surface to-bazaar-card border border-bazaar-gold/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>ضمان وحماية المشتريات</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-cairo text-white">
            تحتاج مساعدة أو طريقة دفع مخصصة؟
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            فريق الدعم الفني متواجد على مدار الساعة لمساعدتك في تأكيد التحويلات أو توفير وسائل دفع دولية وإقليمية مخصصة.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
          <a
            href={`https://wa.me/${settings.whatsappSupportNumber}?text=${encodeURIComponent('السلام عليكم، استفسار بخصوص طرق الدفع والشحن في سوق الاشتراكات')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل مع الدعم عبر واتساب</span>
          </a>

          <button
            onClick={openTopUpModal}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-bazaar-gold/20 active:scale-95"
          >
            <span>شحن المحفظة الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
