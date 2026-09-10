import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Phone, MapPin, MessageSquare, CheckCircle2, AlertCircle,
  Sparkles, LogOut, ArrowLeft, ShieldCheck, Zap, Gift, Loader2
} from 'lucide-react';

const EGYPTIAN_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'الشرقية',
  'القليوبية',
  'المنوفية',
  'الغربية',
  'البحيرة',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'كفر الشيخ',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء',
  'خارج مصر (دول عربية / أجنبية)'
];

export const CompleteProfilePage: React.FC = () => {
  const { user, completeGoogleProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'القاهرة');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'telegram' | 'phone'>('whatsapp');
  const [notes, setNotes] = useState('');

  const [isBusy, setIsBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFeedback({ success: false, message: 'يرجى إدخال اسمك بالكامل.' });
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      setFeedback({ success: false, message: 'رقم الهاتف والواتساب إجباري لاستلام بيانات الاشتراكات.' });
      return;
    }

    // التحقق من صيغة الرقم (مصري 11 خانة يبدأ بـ 01 أو رقم دولي)
    const isEgyptian = /^01[0-9]{9}$/.test(cleanPhone);
    const isInternational = /^\+?[0-9]{10,15}$/.test(cleanPhone);

    if (!isEgyptian && !isInternational) {
      setFeedback({
        success: false,
        message: 'صيغة رقم الهاتف غير صحيحة. يرجى إدخال رقم مصري مكوّن من 11 رقم يبدأ بـ 01 (مثال: 01012345678) أو رقم دولي صالح.'
      });
      return;
    }

    setIsBusy(true);
    setFeedback(null);

    const res = await completeGoogleProfile({
      name: name.trim(),
      phone: cleanPhone,
      city,
      preferredContact,
      notes: notes.trim()
    });

    setIsBusy(false);
    setFeedback(res);
  };

  const handleLogout = async () => {
    if (window.confirm('هل تود تسجيل الخروج والرجوع لشاشة الدخول؟')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-bazaar-bg text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* خلفية جمالية بتأثيرات البازار */}
      <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-bazaar-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-bazaar-teal/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-bazaar-card border border-bazaar-gold/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* الشريط العلوي للترحيب وتوثيق جوجل */}
        <div className="bg-gradient-to-r from-bazaar-surface via-bazaar-card to-bazaar-surface p-6 sm:p-8 border-b border-white/10 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || 'User'}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-bazaar-gold object-cover shadow-glow-gold"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-bazaar-gold/30 to-bazaar-teal/30 border-2 border-bazaar-gold flex items-center justify-center text-2xl font-black font-cairo text-bazaar-gold shadow-glow-gold">
                  {name ? name.charAt(0) : '🏮'}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black font-cairo text-white">
                    أهلاً بك يا {name || 'صديقنا'} 👋
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    تم التحقق عبر Google
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1" dir="ltr">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-white/5 hover:border-rose-500/30 transition-all text-xs flex items-center gap-1 shrink-0"
              title="تسجيل الخروج والرجوع"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-bazaar-gold/10 border border-bazaar-gold/25 flex items-center gap-2 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-bazaar-gold shrink-0" />
            <span>
              خطوة أخيرة لتفعيل حسابك: يرجى كتابة رقم هاتفك لتسليم بيانات الاشتراكات وتأكيد طلباتك.
            </span>
          </div>
        </div>

        {/* نموذج استكمال البيانات الإجباري */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-3 animate-fadeIn ${
                feedback.success
                  ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/50'
                  : 'bg-rose-950/90 text-rose-200 border border-rose-500/50'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{feedback.message}</span>
            </div>
          )}

          {/* 1. الاسم بالكامل */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-bazaar-gold" />
                <span>الاسم بالكامل</span>
                <span className="text-rose-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">يمكنك تعديله كما تفضل</span>
            </label>
            <input
              type="text"
              required
              disabled={isBusy}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: عبد الله أحمد"
              className="w-full bg-bazaar-bg/90 border border-white/10 focus:border-bazaar-gold rounded-2xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* 2. رقم الهاتف / الواتساب (إجباري) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم الواتساب / الهاتف الأساسي</span>
                <span className="text-rose-400 font-bold">* (إجباري)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>🇪🇬 رقم مصري أو دولي</span>
              </span>
            </label>

            <div className="relative">
              <input
                type="tel"
                required
                disabled={isBusy}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01012345678"
                dir="ltr"
                className="w-full bg-bazaar-bg/90 border border-emerald-500/40 focus:border-emerald-400 rounded-2xl py-3 px-4 text-sm text-white font-mono placeholder-slate-500 focus:outline-none transition-colors shadow-sm"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              💡 <strong>تنبيه هام:</strong> ستصلك بيانات الاشتراكات (الإيميلات وكلمات المرور وروابط التفعيل) مباشرة عبر الواتساب على هذا الرقم فور تنفيذ طلبك.
            </p>
          </div>

          {/* 3. المحافظة / المدينة */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-bazaar-teal" />
              <span>المحافظة / المدينة</span>
              <span className="text-slate-400 font-normal text-[11px]">(اختياري)</span>
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              disabled={isBusy}
              className="w-full bg-bazaar-bg/90 border border-white/10 focus:border-bazaar-gold rounded-2xl py-3 px-4 text-sm text-white focus:outline-none transition-colors"
            >
              {EGYPTIAN_GOVERNORATES.map(gov => (
                <option key={gov} value={gov} className="bg-bazaar-card text-white">
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* 4. وسيلة التواصل المفضلة */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-bazaar-purple" />
              <span>وسيلة التواصل المفضلة لديك</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'whatsapp', label: 'واتساب', icon: '💬', desc: 'أسرع استجابة' },
                { id: 'telegram', label: 'تليجرام', icon: '✈️', desc: 'عبر المعرف' },
                { id: 'phone', label: 'اتصال هاتف', icon: '📞', desc: 'مكالمة صوتية' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPreferredContact(opt.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    preferredContact === opt.id
                      ? 'bg-bazaar-gold/15 border-bazaar-gold text-white shadow-sm'
                      : 'bg-bazaar-bg/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15'
                  }`}
                >
                  <div className="text-lg mb-1">{opt.icon}</div>
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. ملاحظات إضافية (اختياري) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              ملاحظات إضافية أو اسم مستخدم تليجرام (اختياري)
            </label>
            <input
              type="text"
              disabled={isBusy}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="مثال: يفضل التواصل بعد الساعة 5 مساءً / @username"
              className="w-full bg-bazaar-bg/90 border border-white/10 focus:border-bazaar-gold rounded-2xl py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* ملخص الضمان والمزايا */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-300">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>تسليم فوري ومضمون</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ضمان كامل المدة</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-300">
              <Gift className="w-4 h-4 text-bazaar-teal shrink-0" />
              <span>محفظة شحن ذكية</span>
            </div>
          </div>

          {/* زر التأكيد والدخول */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isBusy}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-bazaar-gold via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-sm shadow-xl shadow-bazaar-gold/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جارٍ حفظ بياناتك وتفعيل الحساب...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-bazaar-bg stroke-[2.5]" />
                  <span>تأكيد البيانات والدخول إلى سوق الاشتراكات 🚀</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-2xl text-xs text-slate-400 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>تسجيل الخروج واستخدام بريد آخر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CompleteProfilePage;
