import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { UserProfile } from '../types';
import { createClient } from '@supabase/supabase-js';
import { supabase, translateError } from '../lib/supabase';

export interface AuthResult {
  success: boolean;
  message: string;
  /** true عندما يُنشأ الحساب وينتظر تأكيد البريد */
  needsEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  users: UserProfile[];
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  needsProfileCompletion: boolean;

  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  signInWithGoogleCredential: (idToken: string) => Promise<AuthResult>;
  completeGoogleProfile: (data: {
    name: string;
    phone: string;
    city?: string;
    preferredContact?: 'whatsapp' | 'telegram' | 'phone' | string;
    notes?: string;
  }) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  changeOwnPassword: (newPassword: string) => Promise<AuthResult>;
  updateOwnProfile: (data: { name?: string; phone?: string }) => Promise<AuthResult>;

  // ===== إدارة الحسابات (أدمن) =====
  refreshUsers: () => Promise<void>;
  adminCreateUser: (data: {
    name: string; email: string; phone: string; password: string;
    role: 'customer' | 'admin'; balance: number;
  }) => Promise<AuthResult>;
  adminUpdateUser: (userId: string, data: Partial<UserProfile>) => Promise<AuthResult>;
  adminDeleteUser: (userId: string) => Promise<AuthResult>;
  adminSetBalance: (userId: string, newBalance: number, reason?: string) => Promise<AuthResult>;
  adminAdjustBalance: (userId: string, delta: number, reason?: string) => Promise<AuthResult>;
  getUserById: (userId: string) => UserProfile | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rowToProfile = (r: any): UserProfile => ({
  id: r.id,
  name: r.name || '',
  email: r.email || '',
  phone: r.phone || '',
  password: '',
  role: r.role === 'admin' ? 'admin' : 'customer',
  balance: Number(r.balance) || 0,
  isBlocked: !!r.is_blocked,
  notes: r.notes || '',
  createdAt: r.created_at,
  avatarUrl: r.avatar_url || '',
  city: r.city || '',
  preferredContact: r.preferred_contact || 'whatsapp',
  isProfileComplete: Boolean(r.phone && String(r.phone).trim().length >= 10)
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const mounted = useRef(true);

  const isAdmin = user?.role === 'admin';

  /** تحميل ملف المستخدم الحالي من قاعدة البيانات مع فحص اكتمال البيانات */
  const loadProfile = useCallback(async (userId: string, authUser?: any) => {
    const { data, error } = await supabase
      .from('profiles').select('*').eq('id', userId).maybeSingle();

    if (error) { console.error('تعذر تحميل الحساب', error); }

    let p: UserProfile | null = null;
    if (data) {
      p = rowToProfile(data);
    } else if (authUser) {
      // إذا لم يكن هناك صف للمستخدم في profiles بعد (مثل أول دخول بحساب جوجل)
      const meta = authUser.user_metadata || {};
      const fallbackName = meta.full_name || meta.name || authUser.email?.split('@')[0] || 'عميل جديد';
      const fallbackPhone = meta.phone || '';

      const { data: upserted } = await supabase.from('profiles').upsert({
        id: userId,
        name: fallbackName,
        email: authUser.email || '',
        phone: fallbackPhone,
        role: 'customer',
        balance: 0.00
      }).select().maybeSingle();

      if (upserted) {
        p = rowToProfile(upserted);
      } else {
        p = {
          id: userId,
          name: fallbackName,
          email: authUser.email || '',
          phone: fallbackPhone,
          password: '',
          role: 'customer',
          balance: 0,
          createdAt: authUser.created_at || new Date().toISOString(),
          isProfileComplete: false
        };
      }
    }

    if (p && authUser) {
      const meta = authUser.user_metadata || {};
      if (meta.avatar_url || meta.picture) p.avatarUrl = meta.avatar_url || meta.picture;
      if (meta.city && !p.city) p.city = meta.city;
      if (meta.preferred_contact && !p.preferredContact) p.preferredContact = meta.preferred_contact;
      if (meta.phone && (!p.phone || p.phone.trim() === '')) p.phone = meta.phone;
      p.isProfileComplete = Boolean(p.phone && p.phone.trim().length >= 10);
    }

    return p;
  }, []);

  useEffect(() => {
    mounted.current = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted.current) return;
      setSession(data.session);
      if (data.session?.user) {
        const p = await loadProfile(data.session.user.id, data.session.user);
        if (mounted.current) {
          setUser(p);
          const needsComp = !p?.phone || p.phone.trim().length < 10;
          setNeedsProfileCompletion(needsComp);
        }
      }
      if (mounted.current) setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted.current) return;
      setSession(newSession);
      if (newSession?.user) {
        const p = await loadProfile(newSession.user.id, newSession.user);
        if (mounted.current) {
          setUser(p);
          const needsComp = !p?.phone || p.phone.trim().length < 10;
          setNeedsProfileCompletion(needsComp);
        }
      } else {
        setUser(null);
        setUsers([]);
        setNeedsProfileCompletion(false);
      }
      if (mounted.current) setIsLoading(false);
    });

    return () => { mounted.current = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  /** تحديث الحساب الحالي (بعد أي عملية تغيّر الرصيد) */
  const refreshSelf = useCallback(async () => {
    if (!session?.user) return;
    const p = await loadProfile(session.user.id, session.user);
    if (p) {
      setUser(p);
      setNeedsProfileCompletion(!p.phone || p.phone.trim().length < 10);
    }
  }, [session, loadProfile]);

  /** قائمة كل الحسابات (تعمل للأدمن فقط بحكم سياسات الحماية) */
  const refreshUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles').select('*').order('created_at', { ascending: false });
    if (error) { console.error('تعذر تحميل الحسابات', error); return; }
    setUsers((data || []).map(rowToProfile));
  }, []);

  useEffect(() => { if (isAdmin) refreshUsers(); }, [isAdmin, refreshUsers]);

  // ================= تسجيل الدخول والتسجيل =================

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), password
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('email not confirmed')) {
        return {
          success: false,
          needsEmailConfirmation: true,
          message: 'لم يتم تفعيل حسابك بعد. افتح رسالة التأكيد المرسلة على بريدك واضغط على الرابط.'
        };
      }
      return { success: false, message: translateError(error.message) };
    }

    const profile = data.user ? await loadProfile(data.user.id) : null;
    if (profile?.isBlocked) {
      await supabase.auth.signOut();
      return { success: false, message: 'تم إيقاف هذا الحساب من قبل الإدارة. تواصل مع الدعم الفني.' };
    }

    return { success: true, message: `أهلاً بك، ${profile?.name || ''}!` };
  }, [loadProfile]);

  /** التسجيل ينشئ حساب عميل وينتظر تأكيد البريد قبل التفعيل */
  const register = useCallback(async (
    { name, email, phone, password }: { name: string; email: string; phone: string; password: string }
  ): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!name.trim()) return { success: false, message: 'يرجى كتابة الاسم بالكامل.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return { success: false, message: 'صيغة البريد الإلكتروني غير صحيحة.' };
    if (!/^01[0-9]{9}$/.test(phone.trim()))
      return { success: false, message: 'رقم الهاتف غير صحيح. أدخل رقم مصري مكوّن من 11 رقم يبدأ بـ 01.' };
    if (password.length < 6)
      return { success: false, message: 'كلمة المرور يجب ألا تقل عن 6 خانات.' };

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { name: name.trim(), phone: phone.trim() },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) return { success: false, message: translateError(error.message) };

    // وجود جلسة فوراً معناه أن تأكيد البريد غير مفعّل في إعدادات Supabase
    if (data.session) {
      return { success: true, message: `تم إنشاء حسابك بنجاح، أهلاً بك ${name}!` };
    }

    return {
      success: true,
      needsEmailConfirmation: true,
      message: `تم إرسال رسالة تأكيد إلى ${cleanEmail}. افتح الرسالة واضغط على الرابط لتفعيل حسابك.`
    };
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    });
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes('provider is not enabled') || m.includes('unsupported provider')) {
        return {
          success: false,
          message: 'تسجيل الدخول بجوجل غير مفعّل بعد في إعدادات لوحة تحكم Supabase. يرجى تفعيل Google Provider وإدخال Client ID و Secret.'
        };
      }
      return { success: false, message: translateError(error.message) };
    }
    return { success: true, message: 'جارٍ تحويلك إلى جوجل...' };
  }, []);

  const signInWithGoogleCredential = useCallback(async (idToken: string): Promise<AuthResult> => {
    const { data, error } = await (supabase.auth as any).signInWithIdToken({
      provider: 'google',
      token: idToken
    });
    if (error) {
      return { success: false, message: translateError(error.message) };
    }
    if (data.session?.user) {
      const p = await loadProfile(data.session.user.id, data.session.user);
      setUser(p);
      setNeedsProfileCompletion(!p?.phone || p.phone.trim().length < 10);
    }
    return { success: true, message: 'تم تسجيل الدخول بنجاح!' };
  }, [loadProfile]);

  const completeGoogleProfile = useCallback(async (data: {
    name: string;
    phone: string;
    city?: string;
    preferredContact?: 'whatsapp' | 'telegram' | 'phone' | string;
    notes?: string;
  }): Promise<AuthResult> => {
    if (!session?.user) {
      return { success: false, message: 'لا توجد جلسة تسجيل دخول نشطة.' };
    }

    const trimmedName = data.name.trim();
    const trimmedPhone = data.phone.trim();

    if (!trimmedName) {
      return { success: false, message: 'يرجى كتابة الاسم بالكامل.' };
    }

    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return {
        success: false,
        message: 'رقم الهاتف غير صحيح. يرجى إدخال رقم هاتف أو واتساب صحيح (11 رقم للأرقام المصرية مثل 01012345678).'
      };
    }

    // 1. تحديث بيانات المستخدم في Supabase Auth metadata
    try {
      await supabase.auth.updateUser({
        data: {
          name: trimmedName,
          phone: trimmedPhone,
          city: data.city || '',
          preferred_contact: data.preferredContact || 'whatsapp',
          notes: data.notes || '',
          profile_completed: true
        }
      });
    } catch (e) {
      console.warn('تنبيه عند تحديث بيانات المستخدم:', e);
    }

    // 2. تحديث جدول profiles
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: session.user.id,
      name: trimmedName,
      email: session.user.email || '',
      phone: trimmedPhone,
      role: user?.role || 'customer'
    });

    if (profileError) {
      console.error('تعذر تحديث ملف الحساب:', profileError);
      return { success: false, message: translateError(profileError.message) };
    }

    const updated = await loadProfile(session.user.id, session.user);
    if (updated) {
      updated.name = trimmedName;
      updated.phone = trimmedPhone;
      if (data.city) updated.city = data.city;
      if (data.preferredContact) updated.preferredContact = data.preferredContact;
      updated.isProfileComplete = true;
      setUser(updated);
    }
    setNeedsProfileCompletion(false);

    return {
      success: true,
      message: `أهلاً بك يا ${trimmedName}! تم تفعيل حسابك بنجاح 🎉`
    };
  }, [session, user, loadProfile]);

  const resendConfirmation = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/` }
    });
    if (error) return { success: false, message: translateError(error.message) };
    return { success: true, message: 'تم إرسال رسالة التأكيد مرة أخرى. راجع بريدك (وصندوق السبام).' };
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/`
    });
    if (error) return { success: false, message: translateError(error.message) };
    return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.' };
  }, []);

  const logout = useCallback(async () => {
    setNeedsProfileCompletion(false);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  }, []);

  const changeOwnPassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
    if (newPassword.length < 6)
      return { success: false, message: 'كلمة المرور الجديدة يجب ألا تقل عن 6 خانات.' };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, message: translateError(error.message) };
    return { success: true, message: 'تم تغيير كلمة المرور بنجاح.' };
  }, []);

  const updateOwnProfile = useCallback(async (data: { name?: string; phone?: string }): Promise<AuthResult> => {
    if (!user) return { success: false, message: 'يجب تسجيل الدخول أولاً.' };
    const { error } = await supabase.from('profiles')
      .update({ name: data.name, phone: data.phone }).eq('id', user.id);
    if (error) return { success: false, message: translateError(error.message) };
    await refreshSelf();
    return { success: true, message: 'تم تحديث بياناتك بنجاح.' };
  }, [user, refreshSelf]);

  // ================= إجراءات الإدارة =================

  /**
   * إنشاء حساب من لوحة الإدارة.
   * نستخدم نسخة منفصلة من العميل لا تحفظ الجلسة، حتى لا يخرج الأدمن من حسابه.
   */
  const adminCreateUser = useCallback(async (data: {
    name: string; email: string; phone: string; password: string;
    role: 'customer' | 'admin'; balance: number;
  }): Promise<AuthResult> => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!data.name.trim()) return { success: false, message: 'الاسم مطلوب.' };
    if (!cleanEmail) return { success: false, message: 'البريد الإلكتروني مطلوب.' };
    if (!data.password || data.password.length < 6)
      return { success: false, message: 'كلمة المرور يجب ألا تقل عن 6 خانات.' };

    const tempClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    );

    const { data: signUpData, error } = await tempClient.auth.signUp({
      email: cleanEmail,
      password: data.password,
      options: { data: { name: data.name.trim(), phone: data.phone.trim() } }
    });

    if (error) return { success: false, message: translateError(error.message) };

    const newId = signUpData.user?.id;
    if (!newId) return { success: false, message: 'تعذر إنشاء الحساب.' };

    // ننتظر لحظة حتى ينشئ التريجر صف الحساب ثم نضبط الصلاحية والرصيد
    for (let i = 0; i < 6; i++) {
      const { data: row } = await supabase.from('profiles').select('id').eq('id', newId).maybeSingle();
      if (row) break;
      await new Promise(r => setTimeout(r, 400));
    }

    if (data.role === 'admin') {
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', newId);
    }
    if (Number(data.balance) > 0) {
      await supabase.rpc('admin_set_balance', {
        p_user: newId, p_amount: Number(data.balance), p_description: 'رصيد ابتدائي عند إنشاء الحساب'
      });
    }

    await refreshUsers();
    return {
      success: true,
      message: signUpData.session
        ? `تم إنشاء حساب «${data.name}» بنجاح.`
        : `تم إنشاء حساب «${data.name}». أُرسلت رسالة تأكيد إلى ${cleanEmail} ولن يستطيع الدخول قبل تفعيلها.`
    };
  }, [refreshUsers]);

  const adminUpdateUser = useCallback(async (userId: string, data: Partial<UserProfile>): Promise<AuthResult> => {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.role !== undefined) payload.role = data.role;
    if (data.isBlocked !== undefined) payload.is_blocked = data.isBlocked;
    if (data.notes !== undefined) payload.notes = data.notes;

    const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
    if (error) return { success: false, message: translateError(error.message) };

    await refreshUsers();
    if (userId === user?.id) await refreshSelf();
    return { success: true, message: 'تم حفظ تعديلات الحساب بنجاح.' };
  }, [refreshUsers, refreshSelf, user]);

  const adminDeleteUser = useCallback(async (userId: string): Promise<AuthResult> => {
    if (userId === user?.id)
      return { success: false, message: 'لا يمكنك حذف الحساب الذي تستخدمه حالياً.' };

    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) return { success: false, message: translateError(error.message) };
    await refreshUsers();
    return {
      success: true,
      message: 'تم حذف بيانات الحساب. لحذف بيانات الدخول نهائياً استخدم لوحة Supabase.'
    };
  }, [refreshUsers, user]);

  const adminSetBalance = useCallback(async (userId: string, newBalance: number, reason?: string): Promise<AuthResult> => {
    const { error } = await supabase.rpc('admin_set_balance', {
      p_user: userId, p_amount: newBalance, p_description: reason || null
    });
    if (error) return { success: false, message: translateError(error.message) };
    await refreshUsers();
    if (userId === user?.id) await refreshSelf();
    return { success: true, message: 'تم ضبط الرصيد بنجاح.' };
  }, [refreshUsers, refreshSelf, user]);

  const adminAdjustBalance = useCallback(async (userId: string, delta: number, reason?: string): Promise<AuthResult> => {
    const { error } = await supabase.rpc('admin_adjust_balance', {
      p_user: userId, p_delta: delta, p_description: reason || null, p_type: null
    });
    if (error) return { success: false, message: translateError(error.message) };
    await refreshUsers();
    if (userId === user?.id) await refreshSelf();
    return { success: true, message: delta >= 0 ? 'تمت إضافة الرصيد بنجاح.' : 'تم خصم الرصيد بنجاح.' };
  }, [refreshUsers, refreshSelf, user]);

  const getUserById = useCallback((userId: string) => users.find(u => u.id === userId), [users]);

  // إتاحة تحديث الحساب للسياق الآخر (StoreContext) بعد الشراء
  useEffect(() => {
    (window as any).__souqRefreshProfile = refreshSelf;
    (window as any).__souqRefreshUsers = refreshUsers;
  }, [refreshSelf, refreshUsers]);

  return (
    <AuthContext.Provider
      value={{
        user, users, session,
        isAuthenticated: !!session && !!user,
        isAdmin, isLoading, needsProfileCompletion,
        login, register, loginWithGoogle, signInWithGoogleCredential, completeGoogleProfile,
        resendConfirmation, resetPassword, logout,
        changeOwnPassword, updateOwnProfile,
        refreshUsers, adminCreateUser, adminUpdateUser, adminDeleteUser,
        adminSetBalance, adminAdjustBalance, getUserById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
