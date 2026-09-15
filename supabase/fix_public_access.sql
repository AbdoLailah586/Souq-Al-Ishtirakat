-- ==============================================================================
-- حل مشكلة عدم ظهور الأسعار والعروض للزوار غير المسجلين (Guest Visitors)
-- ==============================================================================
-- سبب المشكلة:
-- في Supabase، جداول الخدمات (services) وباقاتها (service_variants) والباقات (bundles)
-- كانت مقيدة بسياسات حماية (RLS) أو صلاحيات تقتصر على المسجلين فقط (authenticated)،
-- مما يجعل استعلام الزائر غير المسجل (anon) يُرجع مصفوفة فارغة وتظهر له البيانات القديمة.
--
-- طريقة التطبيق:
-- انسخ هذا الكود بالكامل، وافتحه في لوحة تحكم Supabase:
-- Dashboard -> SQL Editor -> New Query ثم اضغط RUN.
-- ==============================================================================

-- 1. منح دور الزائر (anon) ودور المسجل (authenticated) صلاحية استخدام schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. منح صلاحية القراءة (SELECT) لجميع الزوار على جداول الكتالوج والأسعار والإعدادات
GRANT SELECT ON TABLE public.services TO anon, authenticated;
GRANT SELECT ON TABLE public.service_variants TO anon, authenticated;
GRANT SELECT ON TABLE public.bundles TO anon, authenticated;
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT SELECT ON TABLE public.site_settings TO anon, authenticated;

-- 3. تفعيل RLS والتأكد من شمول دور anon في سياسات القراءة
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- حذف السياسات السابقة لتجنب أي تعارض
DROP POLICY IF EXISTS "Public Services Read" ON public.services;
DROP POLICY IF EXISTS "Public Variants Read" ON public.service_variants;
DROP POLICY IF EXISTS "Public Bundles Read" ON public.bundles;
DROP POLICY IF EXISTS "Public Categories Read" ON public.categories;
DROP POLICY IF EXISTS "Public Settings Read" ON public.site_settings;

DROP POLICY IF EXISTS "Allow anon and authenticated read services" ON public.services;
DROP POLICY IF EXISTS "Allow anon and authenticated read variants" ON public.service_variants;
DROP POLICY IF EXISTS "Allow anon and authenticated read bundles" ON public.bundles;
DROP POLICY IF EXISTS "Allow anon and authenticated read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anon and authenticated read settings" ON public.site_settings;

-- إنشاء سياسات القراءة العامة الصريحة (تسمح للجميع anon + authenticated بالقراءة)
CREATE POLICY "Public Services Read" ON public.services
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Variants Read" ON public.service_variants
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Bundles Read" ON public.bundles
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Categories Read" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Settings Read" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- 4. إشعار بنجاح العملية
SELECT 'تم تفعيل القراءة العامة بنجاح لجميع الزوار والعملاء بدون الحاجة لتسجيل دخول' AS result;
