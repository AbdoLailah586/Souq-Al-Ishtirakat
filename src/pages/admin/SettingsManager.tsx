import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, Check, Sparkles, Smartphone, MessageCircle, AlertCircle } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <h2 className="text-base font-bold font-cairo text-white">
          إعدادات المتجر وبيانات التحويل والدعم
        </h2>
        <p className="text-xs text-slate-400">
          تعديل أرقام انستاباي والمحافظ ورقم الواتساب وبانر الإعلانات العلوي.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-5 text-xs">
        {/* هوية الموقع */}
        <div className="space-y-3 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <span>🏮</span>
            <span>هوية الموقع</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">اسم الموقع:</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={e => handleChange('siteName', e.target.value)}
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">الوصف التعريفي تحت الاسم:</label>
              <input
                type="text"
                value={formData.siteTagline}
                onChange={e => handleChange('siteTagline', e.target.value)}
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Instapay Settings */}
        <div className="space-y-3 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm text-bazaar-gold flex items-center gap-1.5">
            <span>⚡</span>
            <span>بيانات انستاباي (Instapay)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">عنوان الدفع اللحظي (IPA Handle):</label>
              <input
                type="text"
                value={formData.instapayHandle}
                onChange={e => handleChange('instapayHandle', e.target.value)}
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">اسم المستلم الظاهر في التطبيق:</label>
              <input
                type="text"
                value={formData.instapayName}
                onChange={e => handleChange('instapayName', e.target.value)}
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Mobile Cash & WhatsApp */}
        <div className="space-y-3 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm text-bazaar-teal flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>بيانات المحافظ والواتساب</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">رقم فودافون كاش والمحافظ:</label>
              <input
                type="text"
                value={formData.vodafoneCashNumber}
                onChange={e => handleChange('vodafoneCashNumber', e.target.value)}
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">رقم واتساب خدمة العملاء (مع كود الدولة 20):</label>
              <input
                type="text"
                value={formData.whatsappSupportNumber}
                onChange={e => handleChange('whatsappSupportNumber', e.target.value)}
                className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Top Banner Settings */}
        <div className="space-y-3 pb-4 border-b border-white/5">
          <h3 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>الشريط الإعلاني العلوي (Top Banner)</span>
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="showBanner"
              checked={formData.showBanner}
              onChange={e => handleChange('showBanner', e.target.checked)}
              className="w-4 h-4 rounded text-bazaar-gold"
            />
            <label htmlFor="showBanner" className="text-slate-300 font-bold cursor-pointer">
              تفعيل إظهار الشريط الإعلاني في أعلى الموقع
            </label>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">نص الشريط الإعلاني:</label>
            <input
              type="text"
              value={formData.bannerText}
              onChange={e => handleChange('bannerText', e.target.value)}
              className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>
        </div>

        {/* Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">ساعات ومواعيد العمل الموضحة للعملاء:</label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={e => handleChange('workingHours', e.target.value)}
              className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">هدية ترحيبية للعملاء الجدد (ج.م):</label>
            <input
              type="number" step="any"
              min={0}
              value={formData.welcomeBonus}
              onChange={e => handleChange('welcomeBonus', Number(e.target.value))}
              className="w-full bg-bazaar-bg border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-950 text-emerald-300 font-bold text-center border border-emerald-500/30 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>تم حفظ كافة الإعدادات بنجاح ✓</span>
          </div>
        )}

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التغييرات</span>
        </button>
      </form>
    </div>
  );
};
