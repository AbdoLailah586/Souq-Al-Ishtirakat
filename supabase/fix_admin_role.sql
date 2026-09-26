-- ==============================================================================
-- سكريبت ترقية وتثبيت رتبة المشرف (Admin) لمالك متجر سوق الاشتراكات
-- قم بتشغيل هذا الكود في Supabase SQL Editor لضمان حصول حساب المالك على كافة صلاحيات الإدارة
-- ==============================================================================

-- 1. ترقية الحساب في جدول profiles بناءً على البريد أو رقم الهاتف
UPDATE public.profiles
SET role = 'admin'
WHERE 
  LOWER(email) = 'abdolailah586@gmail.com'
  OR LOWER(email) = 'admin@souq-subs.com'
  OR LOWER(email) = 'admin@souqalishtirakat.com'
  OR LOWER(email) LIKE '%abdolailah%'
  OR phone LIKE '%01554826209%'
  OR phone LIKE '%1554826209%';

-- 2. في حالة وجود المستخدم في auth.users وتحديث الـ user_metadata أيضاً
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE 
  LOWER(email) = 'abdolailah586@gmail.com'
  OR LOWER(email) = 'admin@souq-subs.com'
  OR LOWER(email) LIKE '%abdolailah%'
  OR phone LIKE '%01554826209%';

-- 3. التأكد من سياسات RLS لتمكين الأدمن من إدارة الحسابات
DO $$
BEGIN
  -- التأكد من وجود سياسة قراءة وتعديل الملفات الشخصية
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Admins have full access to profiles'
  ) THEN
    CREATE POLICY "Admins have full access to profiles" 
    ON public.profiles 
    FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
  END IF;
END $$;

-- 4. استعراض الحسابات التي تحمل رتبة Admin للتأكيد
SELECT id, name, email, phone, role, balance, created_at 
FROM public.profiles 
WHERE role = 'admin';
