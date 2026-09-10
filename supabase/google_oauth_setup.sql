-- ==============================================================================
-- إعداد تسجيل الدخول بواسطة Google في Supabase (سوق الاشتراكات)
-- ==============================================================================

-- 1. الخطوة الأولى: تفعيل مزود Google في لوحة تحكم Supabase
-- اذهب إلى: Supabase Dashboard -> Authentication -> Providers -> Google
-- قم بتفعيل خيار "Enable Sign in with Google"
-- وضع البيانات التالية التي تم إنشاؤها في Google Cloud Console:
--
-- Client ID:
-- ضع الـ Client ID الخاص بك هنا
--
-- Client Secret:
-- ضع الـ Client Secret الخاص بك هنا
--
-- تأكد من أن الـ Redirect URI في Google Cloud Console هو:
-- https://vkykqtkgettxqennesxt.supabase.co/auth/v1/callback
--
-- وتأكد من أن Authorized JavaScript origins في Google Cloud Console يحتوي على:
-- http://localhost:5173
-- (وأي دومين رسمي مستقبلي مثل https://souq-al-ishtirakat.com)


-- 2. تحديث دالة تريجر المستخدمين لدعم بيانات حساب Google تلقائياً:
-- هذا التريجر يضمن إنشاء صف في profiles للمستخدم فور تسجيل دخوله بجوجل
-- مع ترك رقم الهاتف فارغاً لفرض شاشة استكمال البيانات الإجبارية.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role, balance)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'customer',
    0.00
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إعادة ربط التريجر
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
