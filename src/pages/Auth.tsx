import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock, Mail, User, Phone, Eye, EyeOff, LogIn, UserPlus, ShieldCheck,
  Sparkles, AlertCircle, CheckCircle2, Zap, Wallet, Headphones,
  MailCheck, Loader2, ArrowRight, KeyRound, X
} from 'lucide-react';

/** أيقونة جوجل الرسمية بالألوان */
const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.05 6.05 29.3 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.3-.14-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.05 6.05 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5h-1.9V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C36.9 41.2 44 36 44 24c0-1.3-.14-2.4-.4-3.5z"/>
  </svg>
);

export type Mode = 'login' | 'register' | 'forgot';

export interface AuthPageProps {
  isModal?: boolean;
  onClose?: () => void;
  reason?: string;
  initialMode?: Mode;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  isModal = false,
  onClose,
  reason,
  initialMode = 'login'
}) => {
  const { login, register, loginWithGoogle, signInWithGoogleCredential, resendConfirmation, resetPassword } = useAuth();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  /** البريد الذي ينتظر التأكيد — عند وجوده نعرض شاشة "افحص بريدك" */
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');

  React.useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    if (!isModal || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModal, onClose]);

  const startCooldown = () => {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(c => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBusy(true);
    const res = await login(loginForm.email, loginForm.password);
    setIsBusy(false);
    if (res.needsEmailConfirmation) {
      setPendingEmail(loginForm.email.trim().toLowerCase());
      setFeedback(null);
      return;
    }
    setFeedback(res);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setFeedback({ success: false, message: 'كلمتا المرور غير متطابقتين.' });
      return;
    }
    setIsBusy(true);
    const res = await register({
      name: registerForm.name, email: registerForm.email,
      phone: registerForm.phone, password: registerForm.password
    });
    setIsBusy(false);

    if (res.success && res.needsEmailConfirmation) {
      setPendingEmail(registerForm.email.trim().toLowerCase());
      setFeedback(null);
      startCooldown();
      return;
    }
    setFeedback(res);
  };

  // تهيئة زر Google One Tap و Google Identity Services عند توفر السكريبت
  React.useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '510919267476-ri7t2gkgkmr7ouokdh8bi810cjut26mg.apps.googleusercontent.com';
    const initGsi = () => {
      const g = (window as any).google;
      if (g?.accounts?.id) {
        try {
          g.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (response?.credential) {
                setIsBusy(true);
                setFeedback({ success: true, message: 'تم التحقق من حساب جوجل... جارٍ تسجيل الدخول' });
                const res = await signInWithGoogleCredential(response.credential);
                setIsBusy(false);
                if (!res.success) setFeedback(res);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });
          g.accounts.id.prompt();
        } catch (err) {
          console.debug('GSI init notice:', err);
        }
      }
    };

    if ((window as any).google) {
      initGsi();
    } else {
      const t = setInterval(() => {
        if ((window as any).google) {
          clearInterval(t);
          initGsi();
        }
      }, 400);
      return () => clearInterval(t);
    }
  }, [signInWithGoogleCredential]);

  const handleGoogle = async () => {
    setIsBusy(true);
    setFeedback(null);
    const res = await loginWithGoogle();
    if (!res.success) {
      // رسالة أوضح لو Google Provider مش مفعّل
      if (
        res.message.includes('غير مفعّل') ||
        res.message.includes('provider') ||
        res.message.includes('not enabled')
      ) {
        setFeedback({
          success: false,
          message:
            'تسجيل الدخول بجوجل غير متاح حالياً. استخدم البريد الإلكتروني وكلمة المرور، أو تواصل مع الدعم.'
        });
      } else {
        setFeedback(res);
      }
      setIsBusy(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail || resendCooldown > 0) return;
    setIsBusy(true);
    const res = await resendConfirmation(pendingEmail);
    setIsBusy(false);
    setFeedback(res);
    if (res.success) startCooldown();
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBusy(true);
    const res = await resetPassword(forgotEmail);
    setIsBusy(false);
    setFeedback(res);
  };

  const switchMode = (next: Mode) => { setMode(next); setFeedback(null); };

  const inputBase =
    'w-full bg-bazaar-bg/90 border border-white/10 focus:border-bazaar-gold rounded-2xl py-3 pr-11 pl-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-60';

  const Alert = () => feedback && (
    <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
      feedback.success
        ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
        : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
    }`}>
      {feedback.success
        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
      <span className="leading-relaxed">{feedback.message}</span>
    </div>
  );

  const GoogleButton = () => (
    <>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={isBusy}
        title="تسجيل الدخول عبر حساب جوجل"
        className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 border border-slate-200 group relative overflow-hidden"
      >
        {isBusy ? (
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        ) : (
          <GoogleIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
        )}
        <span>المتابعة باستخدام حساب جوجل</span>
      </button>

      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[11px] text-slate-500 font-semibold">أو عبر البريد الإلكتروني</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
    </>
  );

  const cardBody = (
    <>
      {/* ===== شاشة انتظار تأكيد البريد ===== */}
      {pendingEmail ? (
            <div className="p-6 sm:p-8 space-y-5 text-center">
              {/* أيقونة الإيميل */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-bazaar-teal/15 border border-bazaar-teal/40 flex items-center justify-center">
                  <MailCheck className="w-10 h-10 text-bazaar-teal" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-bazaar-card">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black font-cairo text-white">افحص بريدك الإلكتروني 📬</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أرسلنا رسالة تفعيل إلى
                  <br />
                  <span className="text-bazaar-gold font-bold text-sm" dir="ltr">{pendingEmail}</span>
                  <br />
                  <span className="text-slate-400">افتح الرسالة واضغط على رابط التأكيد، ثم ارجع هنا وسجّل دخولك.</span>
                </p>
              </div>

              {/* خطوات واضحة */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { step: '1', label: 'افتح بريدك', icon: '📧' },
                  { step: '2', label: 'اضغط الرابط', icon: '🔗' },
                  { step: '3', label: 'سجّل دخولك', icon: '✅' },
                ].map(s => (
                  <div key={s.step} className="p-2.5 rounded-2xl bg-bazaar-surface/60 border border-white/5">
                    <div className="text-lg mb-1">{s.icon}</div>
                    <div className="text-[10px] text-slate-300 font-bold">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* تنبيه السبام مع الإيميل الصح */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 text-right leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  لو مالقيتش الرسالة خلال دقيقة، شوف مجلد <strong>السبام / البريد المهمل</strong>.
                  الرسالة بتيجي من{' '}
                  <span dir="ltr" className="font-bold text-amber-300">abdolailah586@gmail.com</span>
                </span>
              </div>

              <Alert />

              <div className="space-y-2.5">
                <button
                  onClick={handleResend}
                  disabled={isBusy || resendCooldown > 0}
                  className="w-full py-3 rounded-2xl bg-bazaar-card hover:bg-white/5 border border-bazaar-gold/40 text-bazaar-gold text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>
                    {resendCooldown > 0
                      ? `إعادة الإرسال بعد ${resendCooldown} ثانية`
                      : 'إعادة إرسال رسالة التأكيد'}
                  </span>
                </button>

                <button
                  onClick={() => { setPendingEmail(null); setMode('login'); setFeedback(null); }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-sm flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>فعّلت حسابي — ادخل الآن</span>
                </button>

                <button
                  onClick={() => { setPendingEmail(null); setMode('register'); setFeedback(null); }}
                  className="w-full py-2.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← رجوع للتسجيل باستخدام إيميل مختلف
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* التبويبات */}
              {mode !== 'forgot' && (
                <div className="flex p-2 gap-2 bg-bazaar-surface/60 border-b border-white/10">
                  <button
                    onClick={() => switchMode('login')}
                    className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      mode === 'login' ? 'bg-bazaar-gold text-bazaar-bg shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>تسجيل الدخول</span>
                  </button>
                  <button
                    onClick={() => switchMode('register')}
                    className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      mode === 'register' ? 'bg-bazaar-teal text-bazaar-bg shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إنشاء حساب جديد</span>
                  </button>
                </div>
              )}

              <div className="p-6 space-y-5">
                <div>
                  <h2 className="text-xl font-black font-cairo text-white">
                    {mode === 'login' ? 'أهلاً بعودتك 👋'
                      : mode === 'register' ? 'انضم إلى السوق 🎉'
                      : 'استعادة كلمة المرور 🔑'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {mode === 'login' ? 'سجّل دخولك للوصول إلى محفظتك وطلباتك وكل خدمات الموقع.'
                      : mode === 'register' ? 'أنشئ حسابك المجاني، وفعّله من رسالة البريد، وابدأ الشراء.'
                      : 'اكتب بريدك وسنرسل لك رابط إعادة تعيين كلمة المرور.'}
                  </p>
                </div>

                <Alert />

                {mode === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <GoogleButton />

                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="email" required disabled={isBusy} value={loginForm.email}
                        onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="البريد الإلكتروني" className={inputBase} />
                    </div>

                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type={showPassword ? 'text' : 'password'} required disabled={isBusy}
                        value={loginForm.password}
                        onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="كلمة المرور" className={inputBase} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex justify-start">
                      <button type="button" onClick={() => switchMode('forgot')}
                        className="text-[11px] text-slate-400 hover:text-bazaar-gold font-semibold flex items-center gap-1">
                        <KeyRound className="w-3 h-3" />
                        <span>نسيت كلمة المرور؟</span>
                      </button>
                    </div>

                    <button type="submit" disabled={isBusy}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bazaar-gold via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-sm shadow-lg shadow-bazaar-gold/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                      {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 stroke-[2.5]" />}
                      <span>دخول إلى حسابي</span>
                    </button>

                    <p className="text-center text-xs text-slate-400">
                      ليس لديك حساب؟{' '}
                      <button type="button" onClick={() => switchMode('register')} className="text-bazaar-teal font-bold hover:underline">
                        أنشئ حساباً مجانياً الآن
                      </button>
                    </p>
                  </form>
                )}

                {mode === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <GoogleButton />

                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="text" required disabled={isBusy} value={registerForm.name}
                        onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                        placeholder="الاسم بالكامل" className={inputBase} />
                    </div>

                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="email" required disabled={isBusy} value={registerForm.email}
                        onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="البريد الإلكتروني (سيصلك عليه التفعيل)" className={inputBase} />
                    </div>

                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="tel" required disabled={isBusy} value={registerForm.phone}
                        onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="رقم الواتساب (مثال: 01012345678)" className={inputBase} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input type={showPassword ? 'text' : 'password'} required disabled={isBusy}
                          value={registerForm.password}
                          onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                          placeholder="كلمة المرور" className={inputBase} />
                      </div>
                      <div className="relative">
                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input type={showPassword ? 'text' : 'password'} required disabled={isBusy}
                          value={registerForm.confirmPassword}
                          onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          placeholder="تأكيد كلمة المرور" className={inputBase} />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
                      <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)}
                        className="w-3.5 h-3.5 rounded accent-bazaar-gold" />
                      <span>إظهار كلمة المرور</span>
                    </label>

                    <button type="submit" disabled={isBusy}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bazaar-teal to-emerald-500 hover:from-emerald-400 hover:to-teal-500 text-bazaar-bg font-black text-sm shadow-lg shadow-bazaar-teal/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                      {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 stroke-[2.5]" />}
                      <span>إنشاء حسابي الآن</span>
                    </button>

                    <p className="text-center text-xs text-slate-400">
                      لديك حساب بالفعل؟{' '}
                      <button type="button" onClick={() => switchMode('login')} className="text-bazaar-gold font-bold hover:underline">
                        سجّل الدخول
                      </button>
                    </p>
                  </form>
                )}

                {mode === 'forgot' && (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="email" required disabled={isBusy} value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="البريد الإلكتروني لحسابك" className={inputBase} />
                    </div>

                    <button type="submit" disabled={isBusy}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                      {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      <span>إرسال رابط الاستعادة</span>
                    </button>

                    <button type="button" onClick={() => switchMode('login')}
                      className="w-full text-center text-xs text-slate-400 hover:text-white font-semibold">
                      الرجوع لتسجيل الدخول
                    </button>
                  </form>
                )}

                <div className="pt-4 border-t border-white/5 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                  <Sparkles className="w-3.5 h-3.5 text-bazaar-gold shrink-0 mt-0.5" />
                  <span>
                    التسجيل من هنا ينشئ حساب عميل فقط، ولن يعمل الحساب قبل تأكيد البريد الإلكتروني.
                    صلاحيات الإدارة محجوزة لحسابات معتمدة ولا يمكن الحصول عليها من واجهة التسجيل.
                  </span>
                </div>
              </div>
            </>
          )}
    </>
  );

  if (isModal) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg bg-bazaar-card rounded-3xl border border-bazaar-gold/30 shadow-2xl overflow-hidden my-8"
        >
          {/* زر إغلاق النافذة */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute left-4 top-4 z-20 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* ترويسة النافذة */}
          <div className="bg-gradient-to-r from-bazaar-surface to-bazaar-card p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-bazaar-bg border border-bazaar-gold/40 flex items-center justify-center text-xl shadow-glow-gold">
              🏮
            </div>
            <div>
              <h2 className="text-base font-black font-cairo gold-gradient-text">سوق الاشتراكات</h2>
              <p className="text-[11px] text-slate-400">
                {mode === 'login' ? 'تسجيل الدخول إلى حسابك' : mode === 'register' ? 'إنشاء حساب عميل جديد' : 'استعادة كلمة المرور'}
              </p>
            </div>
          </div>

          {/* تنبيه سبب طلب تسجيل الدخول */}
          {reason && (
            <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-bazaar-gold/10 border border-bazaar-gold/30 text-amber-200 text-xs font-bold flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-bazaar-gold shrink-0" />
              <span>{reason}</span>
            </div>
          )}

          {cardBody}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bazaar-bg text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-bazaar-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-bazaar-purple/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* اللوحة التعريفية */}
        <div className="hidden lg:block space-y-6 pr-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-bazaar-card to-bazaar-surface border border-bazaar-gold/40 flex items-center justify-center text-3xl shadow-glow-gold">
              🏮
            </div>
            <div>
              <h1 className="text-3xl font-black font-cairo gold-gradient-text">سوق الاشتراكات</h1>
              <p className="text-xs text-slate-400">بازار الاشتراكات الرقمية الأول في مصر والوطن العربي</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            سجّل دخولك للوصول إلى بازار الاشتراكات الرقمية: أدوات الذكاء الاصطناعي، التصميم،
            المونتاج والتسويق — بأسعار مصرية وضمان كامل طوال فترة الاشتراك.
          </p>

          <div className="space-y-3">
            {[
              { icon: Zap, title: 'تسليم فوري', desc: 'استلم بيانات حسابك خلال دقائق من الطلب' },
              { icon: Wallet, title: 'محفظة داخلية', desc: 'اشحن عبر انستاباي أو فودافون كاش واشترِ بضغطة' },
              { icon: ShieldCheck, title: 'ضمان ذهبي', desc: 'استبدال فوري لأي حساب يتوقف خلال مدة الاشتراك' },
              { icon: Headphones, title: 'دعم فني بشري', desc: 'فريق متاح يومياً للرد على استفساراتك' }
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-2xl bg-bazaar-card/60 border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* البطاقة */}
        <div className="bg-bazaar-card border border-bazaar-gold/25 rounded-3xl shadow-2xl overflow-hidden">
          <div className="lg:hidden bg-gradient-to-r from-bazaar-surface to-bazaar-card p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-bazaar-bg border border-bazaar-gold/40 flex items-center justify-center text-2xl">🏮</div>
            <div>
              <h1 className="text-lg font-black font-cairo gold-gradient-text">سوق الاشتراكات</h1>
              <p className="text-[10px] text-slate-400">اشتراكاتك الرقمية بضغطة زر</p>
            </div>
          </div>

          {cardBody}
        </div>
      </div>
    </div>
  );
};
