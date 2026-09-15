import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  UserCog, Save, Lock, Mail, Phone, User as UserIcon,
  CheckCircle2, AlertCircle, LogOut, Wallet, ShoppingBag, Calendar
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateOwnProfile, changeOwnPassword, logout, isAdmin } = useAuth();
  const { orders, navigate } = useStore();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirm: '' });
  const [isBusy, setIsBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ success: boolean; message: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (!user) return null;

  const myOrders = orders.filter(o => o.userId === user.id);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setProfileMsg({ success: false, message: 'الاسم لا يمكن أن يكون فارغاً.' });
      return;
    }
    setIsBusy(true);
    setProfileMsg(await updateOwnProfile({ name: profileForm.name.trim(), phone: profileForm.phone.trim() }));
    setIsBusy(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordMsg({ success: false, message: 'كلمتا المرور الجديدتان غير متطابقتين.' });
      return;
    }
    setIsBusy(true);
    const res = await changeOwnPassword(passwordForm.newPassword);
    setIsBusy(false);
    setPasswordMsg(res);
    if (res.success) setPasswordForm({ newPassword: '', confirm: '' });
  };

  const field =
    'w-full bg-slate-50 border border-slate-300 focus:border-amazon-orange focus:bg-white rounded-sm p-2.5 text-xs text-[#0F1111] focus:outline-none transition-colors';

  const Alert: React.FC<{ data: { success: boolean; message: string } }> = ({ data }) => (
    <div
      className={`p-3 rounded-sm text-xs font-bold flex items-center gap-2 ${
        data.success
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          : 'bg-rose-50 text-rose-800 border border-rose-200'
      }`}
    >
      {data.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{data.message}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <button onClick={() => navigate('dashboard')} className="amazon-link">لوحة التحكم</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">تسجيل الدخول والأمان</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-cairo text-[#0F1111]">
            الملف الشخصي وإعدادات الأمان
          </h1>
          <p className="text-xs text-amazon-muted mt-0.5">
            إدارة بيانات حسابك، رقم الهاتف للتسليم، وتحديث كلمة المرور.
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-full border border-slate-300 bg-slate-50 hover:bg-slate-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* تعديل البيانات الأساسية */}
        <div className="bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserIcon className="w-5 h-5 text-amazon-orange" />
            <h2 className="text-base font-bold font-cairo text-[#0F1111]">البيانات الشخصية</h2>
          </div>

          {profileMsg && <Alert data={profileMsg} />}

          <form onSubmit={handleProfileSave} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">الاسم الكامل:</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className={field}
                required
              />
            </div>

            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">البريد الإلكتروني (ثابت):</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-sm p-2.5 text-xs text-slate-500 cursor-not-allowed"
                dir="ltr"
              />
              <span className="text-[10px] text-amazon-muted block mt-1">البريد الإلكتروني مرتبط بحسابك ولا يمكن تعديله.</span>
            </div>

            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">رقم الهاتف (للتسليم والإشعارات):</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className={field}
                placeholder="01012345678"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full py-2 rounded-full btn-buy text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isBusy ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </form>
        </div>

        {/* تغيير كلمة المرور */}
        <div className="bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-amazon-orange" />
            <h2 className="text-base font-bold font-cairo text-[#0F1111]">تغيير كلمة المرور</h2>
          </div>

          {passwordMsg && <Alert data={passwordMsg} />}

          <form onSubmit={handlePasswordSave} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">كلمة المرور الجديدة:</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className={field}
                minLength={6}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-[#0F1111] font-semibold mb-1">تأكيد كلمة المرور الجديدة:</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className={field}
                minLength={6}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isBusy || !passwordForm.newPassword}
              className="w-full py-2 rounded-full btn-buy text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>{isBusy ? 'جاري التحديث...' : 'تحديث كلمة المرور'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
