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
  HelpCircle
} from 'lucide-react';

export const PaymentGuide: React.FC = () => {
  const { settings, openTopUpModal, navigate } = useStore();
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
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
      image: '/images/payment/instapay.png',
      fee: 'رسوم 0% — تحويل لحظي فوري',
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
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
      image: '/images/payment/vodafone-cash.png',
      fee: 'متاح 24 ساعة — تأكيد سريع',
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
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
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
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
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
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
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
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">طرق الدفع والشحن</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm text-right space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-50 text-amazon-orange text-xs font-bold border border-amber-200">
          <CreditCard className="w-3.5 h-3.5" />
          <span>بوابة وطرق الدفع والشحن المعتمدة</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-cairo text-[#0F1111]">
          طرق الدفع وشحن المحفظة في سوق الاشتراكات
        </h1>
        <p className="text-xs sm:text-sm text-amazon-muted leading-relaxed max-w-2xl">
          نوفر لك أحدث وأأمن وسائل الدفع الإلكتروني في مصر والوطن العربي وأوروبا. اشحن رصيد محفظتك واستمتع بتفعيل اشتراكاتك فورياً.
        </p>

        {/* Feature badges */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="px-3 py-1 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>رسوم تحويل 0%</span>
          </span>
          <span className="px-3 py-1 rounded-sm bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amazon-orange" />
            <span>تأكيد وشحن فوري خلال دقائق</span>
          </span>
          <span className="px-3 py-1 rounded-sm bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>أمان وحماية 100%</span>
          </span>
        </div>
      </div>

      {/* Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map(method => (
          <div 
            key={method.id}
            className="bg-white rounded-sm border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow transition-all flex flex-col justify-between group overflow-hidden"
          >
            <div>
              {/* Image Header */}
              <div className="relative h-36 bg-slate-50 border-b border-slate-100 p-3 flex items-center justify-center">
                <img 
                  src={method.image} 
                  alt={method.name} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${method.badgeColor}`}>
                    {method.tag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold font-cairo text-[#0F1111]">
                    {method.name}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    {method.fee}
                  </p>
                </div>

                <p className="text-xs text-amazon-muted leading-relaxed line-clamp-2">
                  {method.description}
                </p>

                {/* Account Details Box */}
                <div className="p-3 rounded-sm bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[10px] text-amazon-muted font-semibold">{method.targetLabel}:</div>
                  <div className="flex items-center justify-between bg-white p-2 rounded-sm border border-slate-300">
                    <span className="font-mono text-xs font-bold text-[#0F1111] select-all truncate" dir="ltr">
                      {method.targetValue}
                    </span>
                    <button
                      onClick={() => handleCopy(method.targetValue, method.id)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs text-[#0F1111] flex items-center gap-1 transition-all shrink-0 ml-1 font-semibold"
                    >
                      {copiedKey === method.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 text-[10px]">تم</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                  {method.extraInfo && (
                    <div className="text-[10px] text-amazon-muted pt-0.5">
                      {method.extraInfo}
                    </div>
                  )}
                </div>

                {/* Steps */}
                <div className="space-y-1 pt-1">
                  <h4 className="text-xs font-bold text-[#0F1111] flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-amazon-orange" />
                    <span>خطوات التحويل:</span>
                  </h4>
                  <ol className="space-y-1 text-[11px] text-amazon-muted pr-3 list-decimal leading-relaxed">
                    {method.steps.slice(0, 3).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 pt-0">
              <button
                onClick={openTopUpModal}
                className="w-full btn-buy py-2 rounded-full text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>شحن المحفظة بهذا الخيار</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Support Box */}
      <div className="p-5 sm:p-6 rounded-sm bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span>ضمان وحماية المشتريات 100%</span>
          </div>
          <h3 className="text-lg font-bold font-cairo text-[#0F1111]">
            تحتاج مساعدة أو طريقة دفع مخصصة للمغتربين؟
          </h3>
          <p className="text-xs text-amazon-muted max-w-xl">
            فريق الدعم متواجد على مدار الساعة لمساعدتك في تأكيد التحويلات أو توفير حسابات دولية وأوروبية.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <a
            href={`https://wa.me/${settings.whatsappSupportNumber}?text=${encodeURIComponent('السلام عليكم، استفسار بخصوص طرق الدفع والشحن في سوق الاشتراكات')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>دعم واتساب</span>
          </a>

          <button
            onClick={openTopUpModal}
            className="px-5 py-2.5 rounded-full btn-cart text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>شحن المحفظة الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
