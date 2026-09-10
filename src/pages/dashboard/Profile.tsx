import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  UserCog, Save, Lock, Mail, Phone, User as UserIcon,
  CheckCircle2, AlertCircle, LogOut, Wallet, ShoppingBag, Calendar
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateOwnProfile, changeOwnPassword, logout, isAdmin } = useAuth();
  const { orders } = useStore();

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
    'w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-3 text-xs text-white focus:outline-none transition-colors';

  const Alert: React.FC<{ data: { success: boolean; message: string } }> = ({ data }) => (
    <div
      className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
        data.success
          ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
          : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
      }`}
    >
      {data.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{data.message}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center">
          <UserCog className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-cairo text-white">بياناتي الشخصية</h1>
          <p className="text-xs text-slate-400">تعديل بيانات حسابك وكلمة المرور الخاصة بك.</p>
        </div>
      </div>

      {/* ملخص الحساب */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-bazaar-card border border-bazaar-gold/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>الرصيد الحالي</span>
            <Wallet className="w-4 h-4 text-bazaar-gold" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-cairo mt-1">
            {user.balance.toLocaleString()} <span className="text-xs font-normal text-slate-300">ج.م</span>
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-bazaar-card border border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>عدد الطلبات</span>
            <ShoppingBag className="w-4 h-4 text-bazaar-teal" />
          </div>
          <div className="text-2xl font-black text-bazaar-teal font-cairo mt-1">{myOrders.length}</div>
        </div>
        <div className="p-5 rounded-3xl bg-bazaar-card border border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>تاريخ الانضمام</span>
            <Calendar className="w-4 h-4 text-bazaar-purple" />
          </div>
          <div className="text-sm font-bold text-white font-cairo mt-2">
            {new Date(user.createdAt).toLocaleDateString('ar-EG')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* البيانات الأساسية */}
        <form onSubmit={handleProfileSave} className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-4">
          <h2 className="text-sm font-bold font-cairo text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-bazaar-gold" />
            <span>البيانات الأساسية</span>
          </h2>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">الاسم بالكامل</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">رقم الواتساب</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>البريد الإلكتروني (لا يمكن تغييره)</span>
            </label>
            <input type="text" value={user.email} disabled dir="ltr" className={`${field} opacity-60 cursor-not-allowed`} />
          </div>

          {profileMsg && <Alert data={profileMsg} />}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ البيانات</span>
          </button>
        </form>

        {/* كلمة المرور */}
        <form onSubmit={handlePasswordSave} className="p-6 rounded-3xl bg-bazaar-card border border-white/10 space-y-4">
          <h2 className="text-sm font-bold font-cairo text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-bazaar-teal" />
            <span>تغيير كلمة المرور</span>
          </h2>

          <p className="text-[11px] text-slate-400 bg-white/[0.02] p-2.5 rounded-xl leading-relaxed">
            أنت مسجّل الدخول بالفعل، لذلك يكفي كتابة كلمة المرور الجديدة مرتين.
          </p>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={passwordForm.confirm}
              onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className={field}
            />
          </div>

          {passwordMsg && <Alert data={passwordMsg} />}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-bazaar-teal to-emerald-500 text-bazaar-bg font-black text-xs flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>تحديث كلمة المرور</span>
          </button>
        </form>
      </div>

      <button
        onClick={() => { if (window.confirm('هل تريد تسجيل الخروج؟')) void logout(); }}
        className="px-5 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>تسجيل الخروج من الحساب</span>
      </button>

      {isAdmin && (
        <p className="text-[11px] text-slate-500">
          أنت مسجّل الدخول بحساب الإدارة — لديك صلاحية كاملة على كل أقسام الموقع.
        </p>
      )}
    </div>
  );
};
