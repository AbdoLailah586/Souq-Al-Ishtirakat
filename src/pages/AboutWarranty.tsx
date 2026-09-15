import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Lock } from 'lucide-react';

export const AboutWarranty: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">سياسة الضمان والاستبدال</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm text-right space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-sm border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>سياسة الضمان والاستبدال الذهبي</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-cairo text-[#0F1111]">
          الضمان وشروط الاستخدام الرسمية
        </h1>
        <p className="text-xs sm:text-sm text-amazon-muted max-w-2xl leading-relaxed">
          نحن نضمن تشغيل واستقرار كافة الاشتراكات طوال فترة الضمان المحددة، مع دعم فني متواصل عبر واتساب واستبدال فوري عند الحاجة.
        </p>
      </div>

      {/* Main Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2 text-right">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#0F1111] text-sm font-cairo">استبدال فوري</h3>
          <p className="text-xs text-amazon-muted leading-relaxed">
            في حال حدوث أي توقف في الحساب خلال فترة الضمان، يتم تعويضك بحساب جديد فوراً بدون تعقيدات.
          </p>
        </div>

        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2 text-right">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amazon-orange flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#0F1111] text-sm font-cairo">أمان وخصوصية</h3>
          <p className="text-xs text-amazon-muted leading-relaxed">
            بياناتك ومشاريعك في أمان تام، مع إمكانية التفعيل على حساباتك الشخصية في معظم خدمات الذكاء الاصطناعي.
          </p>
        </div>

        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2 text-right">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#0F1111] text-sm font-cairo">تجديد مستمر</h3>
          <p className="text-xs text-amazon-muted leading-relaxed">
            إمكانية تجديد اشتراكاتك بنفس الأسعار المخفضة قبل انتهاء المدة بدون فقدان ملفاتك أو محادثاتك.
          </p>
        </div>
      </div>

      {/* Critical Conditions Box */}
      <div className="p-5 sm:p-6 rounded-sm bg-amber-50/70 border border-amber-300 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amazon-orange" />
          <h3 className="text-base font-bold font-cairo">
            شروط وتعليمات هامة جداً للحفاظ على سريان الضمان
          </h3>
        </div>

        <div className="space-y-2.5 text-xs text-[#0F1111] leading-relaxed pr-2">
          <div className="flex items-start gap-2">
            <span className="text-amazon-orange font-bold">•</span>
            <p>
              <strong>حسابات نتفلكس (Netflix):</strong> يتم تسليم الحساب مع بريد Outlook مرتبط لاستلام رمز الدخول (OTP). <span className="underline font-bold text-rose-700">ممنوع نهائياً تغيير كلمة مرور بريد Outlook</span>؛ تغييرها يلغي الضمان فوراً ولا يشمله التعويض. مدة الضمان للحساب الشهري هي 25 يوماً وصلاحية الاشتراك 30 يوماً.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-amazon-orange font-bold">•</span>
            <p>
              <strong>اشتراك فيجما (Figma Pro Education):</strong> البريد الإلكتروني وكلمة السر متطابقين مع حساب Hotmail المرتبط. <span className="underline font-bold text-rose-700">ممنوع تغيير البريد الإلكتروني داخل Figma</span> حفاظاً على استمرار الخطة التعليمية وضمان السنتين.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-amazon-orange font-bold">•</span>
            <p>
              <strong>اشتراك جيميني (Gemini Pro):</strong> يتم التفعيل على إيميلك الشخصي مباشرة، مما يضمن لك خصوصية 100% وحماية كاملة لملفاتك وصورك على مساحة الـ 5 تيرابايت.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-amazon-orange font-bold">•</span>
            <p>
              <strong>برنامج واتساب سندر (WhatsApp Sender):</strong> يتم إرسال كود التفعيل ورابط التحميل، والتواصل مع دعم واتساب للمساعدة في تثبيت البرنامج وتشغيل الشات بوت وميزة تسخين الحسابات لتقليل احتمالية الحظر.
            </p>
          </div>
        </div>
      </div>

      {/* Warranty Details Table */}
      <div className="p-5 sm:p-6 rounded-sm bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold font-cairo text-[#0F1111]">
          جدول مدد وضمانات الاشتراكات الرقمية
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-2.5 px-3">الخدمة</th>
                <th className="py-2.5 px-3">مدة الاشتراك</th>
                <th className="py-2.5 px-3">نوع الحساب</th>
                <th className="py-2.5 px-3">مدة الضمان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#0F1111]">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold">ChatGPT Plus</td>
                <td className="py-2.5 px-3">شهر كامل</td>
                <td className="py-2.5 px-3">حساب جاهز مفعل</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">طوال فترة الاشتراك (25-30 يوم)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold">Gemini Pro (Google AI)</td>
                <td className="py-2.5 px-3">18 شهر</td>
                <td className="py-2.5 px-3">تفعيل شخصي على إيميلك</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">18 شهر كاملة</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold">Claude Pro 5X</td>
                <td className="py-2.5 px-3">اشتراك كامل</td>
                <td className="py-2.5 px-3">حساب جاهز</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">كامل المدة المحددة</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold">Canva Pro</td>
                <td className="py-2.5 px-3">سنة / 3 سنوات</td>
                <td className="py-2.5 px-3">انضمام لفريق بريميوم</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">كامل مدة الاشتراك</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold">CapCut Pro</td>
                <td className="py-2.5 px-3">7 أيام / 30 يوم / 6 شهور</td>
                <td className="py-2.5 px-3">حساب جاهز</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">كامل مدة الباقة المختارة</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold">Netflix 4K</td>
                <td className="py-2.5 px-3">30 يوم</td>
                <td className="py-2.5 px-3">حساب خاص كامل</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">25 يوم استبدال</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold">Office 365</td>
                <td className="py-2.5 px-3">12 شهر</td>
                <td className="py-2.5 px-3">حساب جاهز + 1TB</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">سنة كاملة</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
