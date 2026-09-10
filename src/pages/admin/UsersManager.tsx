import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { UserProfile } from '../../types';
import {
  Users, UserPlus, Pencil, Trash2, Wallet, Search, X, Save,
  ShieldCheck, ShieldOff, Plus, Minus, CheckCircle2, AlertCircle, Eye, EyeOff, MessageCircle
} from 'lucide-react';

const emptyForm = {
  name: '', email: '', phone: '', password: '', role: 'customer' as 'customer' | 'admin', balance: 0, notes: ''
};

export const UsersManager: React.FC = () => {
  const { users, adminCreateUser, adminUpdateUser, adminDeleteUser, adminSetBalance, adminAdjustBalance, user: me } = useAuth();
  const { orders, refreshTransactions } = useStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [showPass, setShowPass] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // نافذة الرصيد
  const [balanceTarget, setBalanceTarget] = useState<UserProfile | null>(null);
  const [balanceMode, setBalanceMode] = useState<'add' | 'deduct' | 'set'>('add');
  const [balanceAmount, setBalanceAmount] = useState<number>(100);
  const [balanceReason, setBalanceReason] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter(u => roleFilter === 'all' || u.role === roleFilter)
      .filter(u => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [users, search, roleFilter]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ ...emptyForm });
    setFeedback(null);
    setIsFormOpen(true);
  };

  const openEdit = (u: UserProfile) => {
    setEditingUser(u);
    setForm({
      name: u.name, email: u.email, phone: u.phone, password: u.password,
      role: u.role, balance: u.balance, notes: u.notes || ''
    });
    setFeedback(null);
    setIsFormOpen(true);
  };

  const [isBusy, setIsBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBusy(true);
    const res = editingUser
      ? await adminUpdateUser(editingUser.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          notes: form.notes
        })
      : await adminCreateUser({
          name: form.name, email: form.email, phone: form.phone,
          password: form.password, role: form.role, balance: Number(form.balance) || 0
        });

    setIsBusy(false);
    setFeedback(res);
    if (res.success) setTimeout(() => { setIsFormOpen(false); setFeedback(null); }, 1500);
  };

  const handleDelete = async (u: UserProfile) => {
    const count = orders.filter(o => o.userId === u.id).length;
    if (!window.confirm(`حذف حساب «${u.name}» نهائياً؟${count ? `\nلديه ${count} طلب مسجل وسيتم حذفها معه.` : ''}`)) return;
    const res = await adminDeleteUser(u.id);
    if (!res.success) alert(res.message);
  };

  const applyBalance = async () => {
    if (!balanceTarget) return;
    const amount = Math.abs(Number(balanceAmount) || 0);
    if (!amount && balanceMode !== 'set') { alert('أدخل مبلغاً صحيحاً.'); return; }

    setIsBusy(true);
    const res = balanceMode === 'set'
      ? await adminSetBalance(balanceTarget.id, amount, balanceReason)
      : await adminAdjustBalance(balanceTarget.id, balanceMode === 'add' ? amount : -amount, balanceReason);
    setIsBusy(false);

    if (!res.success) { alert(res.message); return; }

    await refreshTransactions();
    setBalanceTarget(null);
    setBalanceReason('');
    setBalanceAmount(100);
  };

  const field =
    'w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-2.5 text-xs text-white focus:outline-none transition-colors';

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-base font-bold font-cairo text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-bazaar-gold" />
            <span>إدارة حسابات العملاء ({users.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            إضافة وتعديل وحذف الحسابات، والتحكم الكامل في أرصدة المحافظ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الإيميل أو الهاتف..."
              className="bg-bazaar-bg border border-white/10 rounded-xl py-2 pr-9 pl-3 text-xs text-white focus:outline-none focus:border-bazaar-gold w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-bazaar-bg p-1 rounded-xl border border-white/5 text-xs">
            {([['all', 'الكل'], ['customer', 'عملاء'], ['admin', 'إدارة']] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setRoleFilter(k)}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  roleFilter === k ? 'bg-bazaar-gold text-bazaar-bg' : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة حساب جديد</span>
          </button>
        </div>
      </div>

      {/* القائمة */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(u => {
          const userOrdersCount = orders.filter(o => o.userId === u.id).length;
          return (
            <div
              key={u.id}
              className={`p-5 rounded-3xl bg-bazaar-card border transition-all ${
                u.role === 'admin' ? 'border-bazaar-gold/40' : 'border-white/10'
              } ${u.isBlocked ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-bazaar-purple/30 to-bazaar-teal/30 border border-white/10 flex items-center justify-center text-base font-black text-white shrink-0">
                    {u.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold font-cairo text-white truncate">{u.name}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          u.role === 'admin'
                            ? 'bg-bazaar-gold/15 text-bazaar-gold border-bazaar-gold/30'
                            : 'bg-bazaar-teal/15 text-bazaar-teal border-bazaar-teal/30'
                        }`}
                      >
                        {u.role === 'admin' ? 'إدارة' : 'عميل'}
                      </span>
                      {u.isBlocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30 font-bold">
                          موقوف
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate" dir="ltr">{u.email}</p>
                    <p className="text-[11px] text-slate-500" dir="ltr">{u.phone}</p>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="text-[10px] text-slate-400">الرصيد</div>
                  <div className="text-lg font-black text-amber-300 font-cairo">{u.balance.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">{userOrdersCount} طلب</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => { setBalanceTarget(u); setBalanceMode('add'); }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>إدارة الرصيد</span>
                </button>

                <button
                  onClick={() => openEdit(u)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-bold flex items-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>

                <a
                  href={`https://wa.me/${u.phone.replace(/^0/, '20')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </a>

                {u.id !== 'user-admin-root' && u.id !== me?.id && (
                  <>
                    <button
                      onClick={() => void adminUpdateUser(u.id, { isBlocked: !u.isBlocked })}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 border ${
                        u.isBlocked
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {u.isBlocked ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                      <span>{u.isBlocked ? 'تفعيل' : 'إيقاف'}</span>
                    </button>

                    <button
                      onClick={() => void handleDelete(u)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 border border-rose-500/20 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-3xl bg-bazaar-card/40 border border-white/5 text-slate-400 text-xs">
          لا توجد حسابات مطابقة لبحثك.
        </div>
      )}

      {/* نافذة إضافة / تعديل حساب */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-bazaar-card rounded-3xl border border-bazaar-gold/50 shadow-2xl p-6 space-y-4 my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold font-cairo text-white">
                {editingUser ? `تعديل حساب: ${editingUser.name}` : 'إضافة حساب جديد'}
              </h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">الاسم بالكامل *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={field} />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">رقم الهاتف</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={field} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">البريد الإلكتروني *</label>
              <input required type="email" value={form.email} disabled={!!editingUser}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={`${field} ${editingUser ? 'opacity-60 cursor-not-allowed' : ''}`} dir="ltr" />
              {editingUser && (
                <p className="text-[10px] text-slate-500 mt-1">لا يمكن تغيير البريد بعد إنشاء الحساب.</p>
              )}
            </div>

            {!editingUser && (
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">كلمة المرور *</label>
              <div className="relative">
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={field}
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">الصلاحية</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value as 'customer' | 'admin' })}
                  className={field}
                >
                  <option value="customer">عميل</option>
                  <option value="admin">مدير (صلاحية كاملة)</option>
                </select>
              </div>
              {!editingUser && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">الرصيد الابتدائي (ج.م)</label>
                <input
                  type="number" step="any"
                  min={0}
                  value={form.balance}
                  onChange={e => setForm({ ...form, balance: Number(e.target.value) })}
                  className={field}
                />
              </div>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">ملاحظات داخلية (تظهر للإدارة فقط)</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={field} />
            </div>

            {feedback && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                feedback.success ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
              }`}>
                {feedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs hover:text-white">
                إلغاء
              </button>
              <button type="submit" disabled={isBusy} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5 disabled:opacity-60">
                <Save className="w-3.5 h-3.5" />
                <span>{editingUser ? 'حفظ التعديلات' : 'إنشاء الحساب'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* نافذة إدارة الرصيد */}
      {balanceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-bazaar-card rounded-3xl border border-emerald-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold font-cairo text-white">إدارة رصيد: {balanceTarget.name}</h3>
                <p className="text-xs text-slate-400">
                  الرصيد الحالي: <span className="text-amber-300 font-bold">{balanceTarget.balance.toLocaleString()} ج.م</span>
                </p>
              </div>
              <button onClick={() => setBalanceTarget(null)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {([
                ['add', 'إضافة رصيد', Plus, 'emerald'],
                ['deduct', 'خصم رصيد', Minus, 'rose'],
                ['set', 'ضبط الرصيد', Wallet, 'amber']
              ] as const).map(([mode, label, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setBalanceMode(mode)}
                  className={`p-2.5 rounded-2xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                    balanceMode === mode
                      ? 'bg-bazaar-gold/20 border-bazaar-gold text-white'
                      : 'bg-bazaar-bg/60 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {balanceMode === 'set' ? 'الرصيد الجديد (ج.م)' : 'المبلغ (ج.م)'}
              </label>
              <input
                type="number" step="any"
                min={0}
                value={balanceAmount}
                onChange={e => setBalanceAmount(Number(e.target.value))}
                className={field}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[50, 100, 250, 500, 1000].map(v => (
                  <button
                    key={v}
                    onClick={() => setBalanceAmount(v)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 font-bold"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">سبب / وصف العملية (اختياري)</label>
              <input
                value={balanceReason}
                onChange={e => setBalanceReason(e.target.value)}
                placeholder="مثال: تحويل انستاباي مؤكد يدوياً"
                className={field}
              />
            </div>

            <div className="p-3 rounded-xl bg-bazaar-bg/80 border border-white/5 text-xs text-slate-300">
              الرصيد بعد التنفيذ:{' '}
              <strong className="text-amber-300">
                {balanceMode === 'set'
                  ? Math.max(0, Number(balanceAmount) || 0)
                  : balanceMode === 'add'
                  ? balanceTarget.balance + (Number(balanceAmount) || 0)
                  : Math.max(0, balanceTarget.balance - (Number(balanceAmount) || 0))}{' '}
                ج.م
              </strong>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setBalanceTarget(null)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs">
                إلغاء
              </button>
              <button
                onClick={() => void applyBalance()}
                disabled={isBusy}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>تنفيذ العملية</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
