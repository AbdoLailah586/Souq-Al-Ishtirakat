-- ==============================================================================
-- إضافة خدمة ChatGPT Plus K12 Edu (سنتين) إلى قاعدة البيانات في Supabase
-- ==============================================================================

insert into public.services (
  id,
  name,
  english_name,
  category_id,
  slug,
  icon_name,
  badge,
  featured,
  is_hidden,
  short_description,
  features,
  note,
  execution_note,
  sort_order
) values (
  'chatgpt-plus-k12-2y',
  'ChatGPT Plus K12 Edu (سنتين)',
  'ChatGPT Plus K12 Edu (2 Years)',
  'ai',
  'chatgpt-plus-k12-2y',
  'Sparkles',
  'سنتان كاملتان (24 شهر)',
  true,
  false,
  'حساب خاص ومُجهّز مسبقاً لمدة سنتين (24 شهراً) بكافة ميزات ChatGPT Plus ومساحة عمل تعليمية K-12 مع رسائل غير محدودة وGPT-5.6.',
  '[
    "رسائل غير محدودة مع أحدث وأقوى النماذج المتقدمة GPT-5.6 بأعلى سرعة واستجابة.",
    "البحث المباشر على الويب وميزة البحث المعمق Deep Research لأدق النتائج والتقارير الأكاديمية.",
    "رفع وتحليل مختلف الملفات (PDF، إكسل، مستندات، أكواد) والبحث الذكي داخلها والتطبيقات المتصلة.",
    "الوضع الصوتي التفاعلي المتقدم وتوليد الصور بالذكاء الاصطناعي بدقة فائقة وبلا قيود.",
    "تحليل البيانات المتقدم (Advanced Data Analysis) وأدوات معالجة البيانات المنظمة.",
    "ميزة الذاكرة الذكية (Memory) للتخصيص الفائق وتذكر سياق محادثاتك ومشروعاتك السابقة.",
    "إنشاء وتخصيص Custom GPTs غير محدودة وإدارة مساحات العمل والمشاريع المشتركة.",
    "أدوات تعاون ومشاركة متطورة مخصصة للمعلمين والطلاب والمدارس والمؤسسات التعليمية.",
    "أعلى معايير الخصوصية والأمان والامتثال المعتمد للقطاع التعليمي والحفاظ على سرية البيانات.",
    "دعم تسجيل الدخول الموحد SSO والتحكم في صلاحيات الوصول RBAC والتحكم في النطاق وتحليلات الإدارة."
  ]'::jsonb,
  'حساب خاص مُجهّز مسبقاً يحتوي على كافة مميزات Plus من خلال مساحة K-12 التعليمية لمدة 24 شهراً مع ضمان 24 ساعة.',
  'طريقة التسليم: الإيميل | كلمة المرور | 2FA (كود التحقق عبر 2fa.live). يجب الدخول من المتصفح أولاً.',
  1
) on conflict (id) do update set
  name=excluded.name,
  english_name=excluded.english_name,
  category_id=excluded.category_id,
  icon_name=excluded.icon_name,
  badge=excluded.badge,
  featured=excluded.featured,
  short_description=excluded.short_description,
  features=excluded.features,
  note=excluded.note,
  execution_note=excluded.execution_note,
  sort_order=excluded.sort_order;

insert into public.service_variants (
  id,
  service_id,
  code,
  duration,
  original_price,
  price,
  is_popular,
  sort_order
) values (
  'chatgpt-k12-24m',
  'chatgpt-plus-k12-2y',
  '10212',
  'سنتان (24 شهرًا)',
  450.00,
  700.00,
  true,
  0
) on conflict (id) do update set
  code=excluded.code,
  duration=excluded.duration,
  original_price=excluded.original_price,
  price=excluded.price,
  is_popular=excluded.is_popular,
  sort_order=excluded.sort_order;
