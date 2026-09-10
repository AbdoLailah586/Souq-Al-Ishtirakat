import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  throw new Error(
    'إعدادات Supabase غير موجودة. تأكد من وجود ملف .env يحتوي على VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

/** ترجمة رسائل الخطأ الإنجليزية القادمة من Supabase إلى العربية */
export const translateError = (message?: string): string => {
  if (!message) return 'حدث خطأ غير متوقع. حاول مرة أخرى.';
  const m = message.toLowerCase();

  if (m.includes('invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  if (m.includes('email not confirmed')) return 'لم يتم تأكيد بريدك الإلكتروني بعد. افتح رسالة التأكيد المرسلة إليك.';
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'هذا البريد الإلكتروني مسجل بالفعل. سجّل الدخول بدلاً من ذلك.';
  if (m.includes('password should be at least')) return 'كلمة المرور يجب ألا تقل عن 6 خانات.';
  if (m.includes('unable to validate email') || m.includes('invalid email'))
    return 'صيغة البريد الإلكتروني غير صحيحة.';
  if (m.includes('email rate limit') || m.includes('over_email_send_rate_limit'))
    return 'تم إرسال عدد كبير من الرسائل. انتظر ساعة ثم حاول مرة أخرى.';
  if (m.includes('for security purposes')) return 'انتظر لحظات قبل إعادة المحاولة.';
  if (m.includes('insufficient_funds')) return 'رصيد المحفظة غير كافٍ لإتمام العملية.';
  if (m.includes('failed to fetch') || m.includes('networkerror'))
    return 'تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.';

  return message;
};

/** استخراج رسالة نقص الرصيد القادمة من دالة الشراء */
export const parseInsufficientFunds = (message: string) => {
  const match = message.match(/INSUFFICIENT_FUNDS\|([\d.]+)\|([\d.]+)/);
  if (!match) return null;
  return { balance: Number(match[1]), required: Number(match[2]) };
};
