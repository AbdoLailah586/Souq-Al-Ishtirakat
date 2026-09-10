-- ==============================================================================
-- قاعدة بيانات موقع سوق الاشتراكات (Souq Al-Ishtirakat)
-- سكريبت إنشاء الجداول وسياسات الحماية (RLS) والبيانات الأولية في Supabase
-- ==============================================================================

-- 1. جدول الحسابات الشخصية (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  balance NUMERIC(10, 2) DEFAULT 0.00 CHECK (balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول الفئات (Categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INT DEFAULT 0
);

-- 3. جدول الخدمات والاشتراكات (Services)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT,
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  short_description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  note TEXT,
  execution_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. جدول باقات ومُدد الخدمات (Service Variants)
CREATE TABLE IF NOT EXISTS public.service_variants (
  id TEXT PRIMARY KEY,
  service_id TEXT REFERENCES public.services(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  duration TEXT NOT NULL,
  original_price NUMERIC(10, 2),
  price NUMERIC(10, 2) NOT NULL,
  is_popular BOOLEAN DEFAULT false
);

-- 5. جدول الباقات المدمجة (Bundles)
CREATE TABLE IF NOT EXISTS public.bundles (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  components TEXT NOT NULL,
  components_list JSONB DEFAULT '[]'::jsonb,
  original_price NUMERIC(10, 2),
  price NUMERIC(10, 2) NOT NULL,
  savings NUMERIC(10, 2) DEFAULT 0,
  badge TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb
);

-- 6. جدول الطلبات وتفاصيل التسليم (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('service', 'bundle')),
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  variant_duration TEXT,
  variant_code TEXT,
  price NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'delivered', 'cancelled')),
  delivery_email TEXT,
  delivery_password TEXT,
  delivery_license_key TEXT,
  delivery_instructions TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  customer_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. جدول معاملات المحفظة والشحن (Wallet Transactions)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'purchase', 'refund')),
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  method TEXT CHECK (method IN ('instapay', 'vodafone_cash', 'internal')),
  sender_phone TEXT,
  receipt_image_url TEXT,
  reference_number TEXT,
  description TEXT,
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. جدول إعدادات الموقع (Site Settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- ==============================================================================
-- تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة العامة
CREATE POLICY "Public Services Read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Variants Read" ON public.service_variants FOR SELECT USING (true);
CREATE POLICY "Public Bundles Read" ON public.bundles FOR SELECT USING (true);
CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Settings Read" ON public.site_settings FOR SELECT USING (true);

-- سياسات المستخدم لملفه الشخصي وطلباته
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert deposit requests" ON public.wallet_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- سياسات الإدارة (Admins)
CREATE POLICY "Admin full access on profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access on orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access on transactions" ON public.wallet_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access on services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access on settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- تريجر إنشاء بروفايل تلقائي عند تسجيل مستخدم جديد في Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role, balance)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'customer',
    0.00
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
