import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Lock, HelpCircle } from 'lucide-react';

export const AboutWarranty: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-500/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>سياسة الضمان والاستبدال الذهبي</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-cairo text-white">
          الضمان وشروط الاستخدام
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          نحن نضمن تشغيل واستقرار كافة الاشتراكات طوال فترة الضمان المحددة، مع دعم فني متواصل واستبدال فوري عند الحاجة.
        </p>
      </div>

      {/* Main Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-bazaar-card border border-white/5 space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">استبدال فوري</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            في حال حدوث أي توقف في الحساب خلال فترة الضمان، يتم تعويضك بحساب جديد فوراً.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-bazaar-card border border-white/5 space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">أمان وخصوصية</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            بياناتك ومشاريعك في أمان تام، مع إمكانية التفعيل على حساباتك الشخصية في معظم الخدمات.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-bazaar-card border border-white/5 space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bazaar-teal/15 text-bazaar-teal flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">تجديد مستمر</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            إمكانية تجديد اشتراكاتك بنفس الأسعار المخفضة قبل انتهاء المدة بدون فقدان ملفاتك.
          </p>
        </div>
      </div>

      {/* Critical Conditions Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-950/30 border-2 border-amber-500/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-cairo text-white">
            شروط وتعليمات هامة جداً للحفاظ على سريان الضمان
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-200 leading-relaxed pr-2">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <p>
              <strong className="text-amber-300">حسابات نتفلكس (Netflix):</strong> يتم تسليم الحساب مع بريد Outlook مرتبط لاستلام رمز الدخول (OTP). <span className="underline font-bold text-rose-300">ممنوع نهائياً تغيير كلمة مرور بريد Outlook</span>؛ تغييرها يلغي الضمان فوراً ولا يشمله التعويض. مدة الضمان للحساب الشهري هي 25 يوماً وصلاحية الاشتراك 30 يوماً.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <p>
              <strong className="text-amber-300">اشتراك فيجما (Figma Pro Education):</strong> البريد الإلكتروني وكلمة السر متطابقين مع حساب Hotmail المرتبط. <span className="underline font-bold text-rose-300">ممنوع تغيير البريد الإلكتروني داخل Figma</span> حفاظاً على استمرار الخطة التعليمية وضمان السنتين.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <p>
              <strong className="text-amber-300">اشتراك جيميني (Gemini Pro):</strong> يتم التفعيل على إيميلك الشخصي مباشرة، مما يضمن لك خصوصية 100% وحماية كاملة لملفاتك وصورك على مساحة الـ 5 تيرابايت.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <p>
              <strong className="text-amber-300">برنامج واتساب سندر (WhatsApp Sender):</strong> يتم إرسال كود التفعيل ورابط التحميل، والتواصل مع دعم واتساب للمساعدة في تثبيت البرنامج وتشغيل الشات بوت وميزة تسخين الحسابات لتقليل احتمالية الحظر.
            </p>
          </div>
        </div>
      </div>

      {/* Warranty Details per Category Table */}
      <div className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-4">
        <h3 className="text-lg font-bold font-cairo text-white">
          جدول مدد وضمانات الاشتراكات
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold">
                <th className="py-3 px-4">الخدمة</th>
                <th className="py-3 px-4">مدة الاشتراك</th>
                <th className="py-3 px-4">نوع الحساب</th>
                <th className="py-3 px-4">مدة الضمان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              <tr>
                <td className="py-3 px-4 font-bold text-white">ChatGPT Plus</td>
                <td className="py-3 px-4">شهر كامل</td>
                <td className="py-3 px-4">حساب جاهز مفعل</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">طوال فترة الاشتراك (25-30 يوم)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Gemini Pro (Google AI)</td>
                <td className="py-3 px-4">18 شهر</td>
                <td className="py-3 px-4">تفعيل شخصي على إيميلك</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">18 شهر كاملة</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Claude Pro 5X</td>
                <td className="py-3 px-4">اشتراك كامل</td>
                <td className="py-3 px-4">حساب جاهز</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">كامل المدة المحددة</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Canva Pro</td>
                <td className="py-3 px-4">سنة / 3 سنوات</td>
                <td className="py-3 px-4">انضمام لفريق بريميوم</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">كامل مدة الاشتراك</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">CapCut Pro</td>
                <td className="py-3 px-4">7 أيام / 30 يوم / 6 شهور</td>
                <td className="py-3 px-4">حساب جاهز</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">كامل مدة الباقة المختارة</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Netflix 4K</td>
                <td className="py-3 px-4">30 يوم</td>
                <td className="py-3 px-4">حساب خاص كامل</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">25 يوم استبدال</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Office 365</td>
                <td className="py-3 px-4">12 شهر</td>
                <td className="py-3 px-4">حساب جاهز + 1TB</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">سنة كاملة</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
