import React, { useState } from 'react';
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
  const { isTopUpModalOpen, closeTopUpModal, requestTopUp, settings } = useStore();
  const { user } = useAuth();

  const [method, setMethod] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [amount, setAmount] = useState<number>(250);
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isTopUpModalOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
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
    const res = requestTopUp({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
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
              اختر طريقة التحويل:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('instapay')}
                className={`p-3.5 rounded-2xl border text-right transition-all flex items-center gap-3 ${
                  method === 'instapay'
                    ? 'bg-bazaar-gold/15 border-bazaar-gold text-white shadow-md'
                    : 'bg-bazaar-bg/60 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm text-bazaar-gold">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-white">انستاباي (Instapay)</div>
                  <div className="text-[10px] text-slate-400">تحويل فوري بدون عمولات</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('vodafone_cash')}
                className={`p-3.5 rounded-2xl border text-right transition-all flex items-center gap-3 ${
                  method === 'vodafone_cash'
                    ? 'bg-bazaar-teal/15 border-bazaar-teal text-white shadow-md'
                    : 'bg-bazaar-bg/60 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm text-bazaar-teal">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">محافظ كاش الذكية</div>
                  <div className="text-[10px] text-slate-400">فودافون كاش ومحافظ البنوك</div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Account Details Box */}
          <div className="p-4 rounded-2xl bg-bazaar-bg/90 border border-bazaar-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {method === 'instapay' ? 'عنوان انستاباي للتحويل عليه:' : 'رقم فودافون كاش للتحويل عليه:'}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                متاح الآن 🟢
              </span>
            </div>

            <div className="flex items-center justify-between bg-bazaar-card p-3 rounded-xl border border-white/10">
              <span className="font-mono text-sm font-bold text-amber-300 select-all" dir="ltr">
                {method === 'instapay' ? settings.instapayHandle : settings.vodafoneCashNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(
                  method === 'instapay' ? settings.instapayHandle : settings.vodafoneCashNumber,
                  'account'
                )}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-all"
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

            {method === 'instapay' && (
              <p className="text-[11px] text-slate-400">
                اسم المستلم في التطبيق: <span className="text-white font-semibold">{settings.instapayName}</span>
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
              type="number"
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
