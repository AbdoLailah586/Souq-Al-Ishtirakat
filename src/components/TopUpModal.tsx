import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Wallet, 
  Copy, 
  Check, 
  Upload, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck,
  Smartphone,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export const TopUpModal: React.FC = () => {
  const { isTopUpModalOpen, closeTopUpModal, requestTopUp, openAuthModal, settings } = useStore();
  const { user } = useAuth();

  const [method, setMethod] = useState<'instapay' | 'vodafone_cash' | 'etisalat_cash' | 'we_pay' | 'orange_cash'>('instapay');

  const methodsList = [
    {
      id: 'instapay' as const,
      name: 'انستاباي',
      tag: 'تحويل لحظي ⚡',
      logo: '/images/payment/instapay.png',
      targetLabel: 'عنوان انستاباي اللحظي (IPA):',
      targetValue: settings.instapayHandle,
      extra: `اسم المستلم: ${settings.instapayName}`
    },
    {
      id: 'vodafone_cash' as const,
      name: 'فودافون كاش',
      tag: 'كاش 📱',
      logo: '/images/payment/vodafone-cash.png',
      targetLabel: 'رقم محفظة فودافون كاش:',
      targetValue: settings.vodafoneCashNumber,
      extra: 'الكود السريع: *9*7*الرقم*المبلغ#'
    },
    {
      id: 'etisalat_cash' as const,
      name: 'اتصالات كاش',
      tag: 'كاش 🟢',
      logo: '/images/payment/etisalat-cash.png',
      targetLabel: 'رقم محفظة اتصالات كاش:',
      targetValue: settings.etisalatCashNumber || settings.vodafoneCashNumber,
      extra: 'الكود المختصر: *777#'
    },
    {
      id: 'we_pay' as const,
      name: 'وي باي (WE Pay)',
      tag: 'كاش 🟣',
      logo: '/images/payment/we-pay.png',
      targetLabel: 'رقم محفظة وي باي:',
      targetValue: settings.wePayNumber || settings.vodafoneCashNumber,
      extra: 'عبر تطبيق WE Pay الرسمي'
    },
    {
      id: 'orange_cash' as const,
      name: 'أورنج / أوروبا',
      tag: 'محلي ودولي 🌍',
      logo: '/images/payment/orange-europe.png',
      targetLabel: 'رقم محفظة أورنج / الاستفسار الدولي:',
      targetValue: settings.orangeCashNumber || settings.vodafoneCashNumber,
      extra: 'للمغتربين: تواصل مع الدعم لبيانات التحويل الدولي واليورو'
    }
  ];

  const currentMethod = methodsList.find(m => m.id === method) || methodsList[0];
  const [amount, setAmount] = useState<number>(250);
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // إغلاق النافذة بزر Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeTopUpModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeTopUpModal]);

  // مزامنة رقم المحوّل مع المستخدم الحالي عند فتح النافذة
  useEffect(() => {
    if (isTopUpModalOpen) {
      setSenderPhone(user?.phone || '');
      setStatusMessage(null);
    }
  }, [isTopUpModalOpen, user?.id]);

  if (!isTopUpModalOpen) return null;

  if (!user) {
    return (
      <div onClick={closeTopUpModal} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div onClick={e => e.stopPropagation()} className="relative w-full max-w-md bg-bazaar-card rounded-3xl border border-bazaar-gold/30 shadow-2xl p-6 sm:p-8 text-center space-y-4">
          <button onClick={closeTopUpModal} className="absolute left-4 top-4 text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center text-3xl">
            💳
          </div>
          <h2 className="text-xl font-black font-cairo text-white">تسجيل الدخول مطلوب لشحن المحفظة</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            يجب تسجيل الدخول إلى حسابك أو إنشاء حساب جديد لتتمكن من إضافة رصيد ورفع إيصال التحويل.
          </p>
          <button
            onClick={() => {
              closeTopUpModal();
              openAuthModal('يرجى تسجيل الدخول أو إنشاء حساب جديد لشحن المحفظة وإضافة الرصيد.');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-sm shadow-lg shadow-bazaar-gold/25 active:scale-95 transition-all"
          >
            تسجيل الدخول / إنشاء حساب الآن
          </button>
        </div>
      </div>
    );
  }

  const quickAmounts = [100, 200, 350, 500, 850, 1000, 1500];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setStatusMessage({ success: false, message: 'يرجى إدخال مبلغ شحن صحيح.' });
      return;
    }

    if (!senderPhone || senderPhone.trim().length < 10) {
      setStatusMessage({ success: false, message: 'يرجى كتابة رقم الهاتف أو الحساب المحول منه بدقة.' });
      return;
    }

    setIsSubmitting(true);
    const res = await requestTopUp({
      amount: Number(amount),
      method,
      senderPhone,
      receiptImage,
      referenceNumber
    });

    setStatusMessage(res);
    setIsSubmitting(false);

    if (res.success) {
      setTimeout(() => {
        setStatusMessage(null);
        closeTopUpModal();
      }, 3500);
    }
  };

  const waMessage = encodeURIComponent(
    `مرحباً دعم سوق الاشتراكات، قمت بطلب شحن محفظتي بمبلغ ${amount} ج.م عبر ${method === 'instapay' ? 'انستاباي' : 'المحفظة'} من رقم ${senderPhone}. أرجو سرعة التأكيد.`
  );

  return (
    <div
      onClick={closeTopUpModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-xl bg-bazaar-card rounded-3xl border border-bazaar-gold/30 shadow-2xl overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-bazaar-surface to-bazaar-card p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-cairo text-white">
                شحن رصيد المحفظة
              </h2>
              <p className="text-xs text-slate-400">
                رصيدك الحالي: <span className="text-amber-300 font-bold">{user?.balance || 0} ج.م</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeTopUpModal}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Method Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              اختر وسيلة الدفع / الشحن المطلوبة:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {methodsList.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`p-2.5 rounded-2xl border text-right transition-all flex items-center gap-2.5 relative overflow-hidden ${
                    method === m.id
                      ? 'bg-bazaar-gold/15 border-bazaar-gold text-white shadow-lg ring-1 ring-bazaar-gold/30'
                      : 'bg-bazaar-bg/70 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="w-11 h-9 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 p-1 flex items-center justify-center">
                    <img src={m.logo} alt={m.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{m.name}</div>
                    <div className="text-[9px] text-amber-300/80 font-medium truncate">{m.tag}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Account Details Box */}
          <div className="p-4 rounded-2xl bg-bazaar-bg/90 border border-bazaar-gold/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                {currentMethod.targetLabel}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold">
                متاح الآن 🟢
              </span>
            </div>

            <div className="flex items-center justify-between bg-bazaar-card p-3 rounded-xl border border-white/10">
              <span className="font-mono text-xs sm:text-sm font-black text-amber-300 select-all truncate" dir="ltr">
                {currentMethod.targetValue}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentMethod.targetValue, 'account')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-all shrink-0 ml-1"
              >
                {copiedKey === 'account' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-[11px]">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">نسخ</span>
                  </>
                )}
              </button>
            </div>

            {currentMethod.extra && (
              <p className="text-[11px] text-slate-300 font-medium">
                {currentMethod.extra}
              </p>
            )}
          </div>

          {/* Amount Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              المبلغ المراد شحنه (جنيه مصري):
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    amount === val
                      ? 'bg-bazaar-gold text-bazaar-bg shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  {val} ج.م
                </button>
              ))}
            </div>
            <input
              type="number" step="any"
              value={amount || ''}
              onChange={e => setAmount(Number(e.target.value))}
              placeholder="أدخل مبلغ مخصص..."
              min={10}
              className="w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-3 text-sm text-white font-bold focus:outline-none"
            />
          </div>

          {/* Sender Phone Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              رقم الهاتف أو الحساب الذي قمت بالتحويل منه:
            </label>
            <input
              type="text"
              required
              value={senderPhone}
              onChange={e => setSenderPhone(e.target.value)}
              placeholder="مثال: 01012345678"
              className="w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Reference Number */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              الرقم المرجعي للتحويل أو اسم الحساب المحول (اختياري):
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={e => setReferenceNumber(e.target.value)}
              placeholder="مثال: REF-1234567 أو اسمك على انستاباي"
              className="w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Receipt Screenshot Upload */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              صورة إيصال التحويل (اختياري لتسريع التأكيد):
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer border-2 border-dashed border-white/10 hover:border-bazaar-gold/50 rounded-2xl p-4 text-center transition-colors bg-white/[0.02]">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-300 block">
                  {receiptImage ? 'تم اختيار صورة الإيصال بنجاح ✓' : 'اضغط لاختيار صورة الإيصال أو السكرين شوت'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {receiptImage && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-bazaar-gold shrink-0">
                  <img src={receiptImage} alt="Receipt Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setReceiptImage(undefined)}
                    className="absolute top-0.5 right-0.5 bg-black/80 rounded-full p-0.5 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Result Alert */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl text-xs font-bold leading-relaxed ${
              statusMessage.success
                ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
            }`}>
              {statusMessage.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bazaar-gold via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-sm transition-all duration-200 shadow-lg shadow-bazaar-gold/25 active:scale-98 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>تأكيد وإرسال طلب الشحن</span>
            </button>

            <a
              href={`https://wa.me/${settings.whatsappSupportNumber}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>إرسال إثبات التحويل مباشرة لدعم واتساب للتأكيد الفوري</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
