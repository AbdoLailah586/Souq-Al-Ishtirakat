import { CategoryInfo, Service } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'ai',
    name: 'مساعدات الذكاء الاصطناعي',
    englishName: 'AI Assistants',
    icon: 'Bot',
    description: 'أقوى نماذج الذكاء الاصطناعي العالمية للمبرمجين والكتاب والباحثين',
    color: '#9b8bff',
    badgeCount: 4
  },
  {
    id: 'design',
    name: 'التصميم والإبداع',
    englishName: 'Design & Creativity',
    icon: 'Palette',
    description: 'أدوات التصميم الجرافيكي وتعديل الصور وباقات أدوبي وفيجما',
    color: '#f0a83c',
    badgeCount: 4
  },
  {
    id: 'video',
    name: 'المونتاج والفيديو',
    englishName: 'Video Editing',
    icon: 'Video',
    description: 'برامج تعديل ومونتاج الفيديو وتصدير 4K لصناع المحتوى',
    color: '#3ddad0',
    badgeCount: 1
  },
  {
    id: 'entertainment',
    name: 'الترفيه والمشاهدة',
    englishName: 'Entertainment',
    icon: 'Tv',
    description: 'منصات البث السينمائي والمسلسلات بحسابات خاصة مضمونة',
    color: '#f0728a',
    badgeCount: 1
  },
  {
    id: 'productivity',
    name: 'الإنتاجية وأوفيس',
    englishName: 'Productivity',
    icon: 'Briefcase',
    description: 'حزم البرامج المكتبية والتخزين السحابي الضخم للمحترفين والطلبة',
    color: '#5fe08a',
    badgeCount: 1
  },
  {
    id: 'marketing',
    name: 'أدوات التسويق والبيزنس',
    englishName: 'Marketing & Business',
    icon: 'TrendingUp',
    description: 'برامج إرسال رسائل الواتساب وقواعد بيانات الأرقام المصرية المصنفة',
    color: '#f59e0b',
    badgeCount: 2
  }
];

export const SERVICES: Service[] = [
  // 1) مساعدات الذكاء الاصطناعي
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    englishName: 'ChatGPT Plus',
    category: 'ai',
    slug: 'chatgpt-plus',
    iconName: 'Sparkles',
    badge: 'الأكثر طلباً',
    featured: true,
    shortDescription: 'نموذج GPT-5 الكامل مع التفكير العميق وتوليد الصور والفيديو والصوت والبرمجة',
    features: [
      'نموذج GPT-5 الكامل: وصول لأحدث نسخة من النموذج، شامل وضع «التفكير العميق» للمهام اللي محتاجة تحليل وتفكير خطوة بخطوة.',
      'توليد الصور بالذكاء الاصطناعي: إنشاء صور من نص بسرعة أعلى من النسخة المجانية.',
      'تحليل البيانات والأكواد: رفع ملفات (إكسل، PDF، بيانات) وتحليلها، أو كتابة أكواد برمجية بمساعدة أداة تحليل البيانات المدمجة.',
      'توليد فيديو (Sora): إمكانية محدودة لإنشاء مقاطع فيديو قصيرة من وصف نصي.',
      'الوضع الصوتي: التحدث مع الشات بصوتك وسماع الرد بدل الكتابة.',
      'ذاكرة أوسع: الشات بيفتكر تفاصيل من محادثاتك السابقة وبيبني عليها.',
      'Custom GPTs ومساحات عمل (Projects): عمل نسخة مخصصة من الشات لمهمة معينة، وتنظيم شغلك في مشاريع منفصلة.',
      'أولوية استخدام وقت الزحام، وأول من يجرب أي ميزة جديدة تنزل من OpenAI.'
    ],
    note: 'مدة الضمان مش متطابقة بين العنوان والوصف الأصليين، يُرجى مراجعة الرقم الصحيح قبل النشر على الموقع.',
    variants: [
      {
        id: 'chatgpt-1m',
        code: '10208',
        duration: 'شهر واحد',
        originalPrice: 819.85,
        price: 900,
        isPopular: true
      }
    ]
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro (Google AI Pro)',
    englishName: 'Gemini Pro (Google AI Pro)',
    category: 'ai',
    slug: 'gemini-pro',
    iconName: 'Brain',
    badge: 'تخزين 5TB مجاناً',
    featured: true,
    shortDescription: 'ذكاء جوجل المتقدم مع 5 تيرابايت مساحة تخزين وتفعيل على إيميلك الشخصي',
    features: [
      'نموذج Gemini المتقدم: يجاوب على أي سؤال، يكتب أكواد برمجية، يحلل بيانات معقدة، ويكتب محتوى تسويقي وإبداعي بجودة عالية.',
      'تخزين Google One الضخم: 5 تيرابايت مساحة (بدل الـ15 جيجا العادية) لصورك وملفاتك ورسايل Gmail.',
      'توليد فيديو (Veo): تحويل نص مكتوب لفيديو واقعي بجودة عالية.',
      'NotebookLM: رفع ملفات (PDF، مستندات كبيرة) والحصول على تلخيص لها، مع إمكانية «مناقشة» المحتوى.',
      'تعديل الصور بالذكاء الاصطناعي: عزل الخلفيات وتحسين جودة الصور القديمة بضغطة زرار.',
      'Google Flow: استوديو متكامل لتصميم الصور والفيديوهات من نص.',
      'تكامل داخل Gmail وDrive وDocs وSheets وMeet: مساعد ذكاء اصطناعي مدمج جوه تطبيقات جوجل اليومية.',
      'التفعيل بيكون على إيميلك الشخصي، يعني خصوصية كاملة وبياناتك ليك وبس.'
    ],
    variants: [
      {
        id: 'gemini-18m',
        code: '10415',
        duration: '18 شهر',
        originalPrice: 61.49,
        price: 150,
        isPopular: true
      }
    ]
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro 5X',
    englishName: 'Claude Pro 5X',
    category: 'ai',
    slug: 'claude-pro',
    iconName: 'Cpu',
    badge: 'حدود استخدام 5X',
    featured: true,
    shortDescription: 'أقوى نماذج البرمجة والتفكير والتحليل الدقيق مع أداة Claude Code و Artifacts',
    features: [
      'أحدث نماذج Claude: وصول لأقوى نسخ Claude (Sonnet وOpus) لأي مهمة تفكير أو كتابة أو تحليل.',
      'حدود استخدام أعلى (5X): مساحة استخدام أوسع بكتير من الباقة العادية.',
      'Projects: تنظيم شغلك في مساحات عمل منفصلة بسياق ثابت لكل مشروع.',
      'Artifacts: عرض النتائج (كود، تصميم، جداول) في نافذة تفاعلية جنب المحادثة مباشرة.',
      'Claude Code: أداة برمجة بالذكاء الاصطناعي تشتغل من الـ Terminal لمشاريع برمجية حقيقية.',
      'قدرة عالية على التخطيط والبحث المعمّق: مناسب للمهام المعقدة اللي محتاجة خطوات متسلسلة.',
      'الأنسب لأي حد شغله محتاج تفكير عميق ودقة أعلى من الشات العادي.'
    ],
    variants: [
      {
        id: 'claude-full',
        code: '10427',
        duration: 'اشتراك كامل',
        originalPrice: 773.73,
        price: 850,
        isPopular: true
      }
    ]
  },
  {
    id: 'super-grok',
    name: 'Super Grok',
    englishName: 'Super Grok',
    category: 'ai',
    slug: 'super-grok',
    iconName: 'Zap',
    badge: 'سريع وتفاعلي',
    featured: false,
    shortDescription: 'أحدث نماذج Grok مع Grok Imagine لتوليد الصور والفيديو والبحث المعمق DeepSearch',
    features: [
      'نموذج Grok الأقوى: أولوية وصول لأحدث إصدار من Grok بسرعة استجابة أعلى من النسخة المجانية.',
      'Grok Imagine: توليد صور وفيديوهات بالذكاء الاصطناعي من وصف نصي.',
      'DeepSearch: بحث عميق وتجميع معلومات من مصادر متعددة بدل البحث العادي.',
      'وضع التفكير العميق (Think Mode): تحليل خطوة بخطوة للمسائل المعقدة.',
      'الوضع الصوتي التفاعلي: التحدث مع Grok بصوتك في محادثة طبيعية.',
      'ذاكرة ومشاريع: الشات بيفتكر سياق محادثاتك، وتقدر تنظم شغلك في مهام منفصلة.',
      'مدة 7 أيام مثالية لتجربة الإمكانيات الكاملة بدون التزام طويل.'
    ],
    variants: [
      {
        id: 'grok-7d',
        code: '10423',
        duration: '7 أيام',
        originalPrice: 256.20,
        price: 350,
        isPopular: true
      }
    ]
  },

  // 2) التصميم والإبداع
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    englishName: 'Canva Pro',
    category: 'design',
    slug: 'canva-pro',
    iconName: 'Image',
    badge: 'أفضل قيمة',
    featured: true,
    shortDescription: '140 مليون عنصر وتصميم، أدوات Magic Switch وتوليد الصور وتفريغ خلفية الفيديو',
    features: [
      'مكتبة تصميم ضخمة: أكتر من 140 مليون صورة وفيديو وموسيقى وجرافيك جاهز للاستخدام.',
      'تغيير المقاس بضغطة واحدة (Magic Switch): تحويل نفس التصميم لكل المقاسات (ستوري، بوست، بانر) في ثانية.',
      'أدوات ذكاء اصطناعي: كتابة نصوص (Magic Write)، مسح عناصر من الصورة (Magic Eraser)، توسيع الصورة (Magic Expand)، وتوليد صور من نص (Dream Lab).',
      'إزالة خلفية الفيديو: تصوير مباشر بدون خلفية وبدون شاشة خضراء.',
      'Brand Kit: حفظ ألوان وخطوط وشعار المشروع واستخدامهم في أي تصميم بضغطة.',
      '100 جيجا تخزين سحابي لحفظ التصاميم والملفات.',
      'برامج Affinity البديلة (Photo, Designer, Publisher) مع أدوات ذكاء اصطناعي مدمجة.',
      'مناسبة لأي حد بيصمم محتوى سوشيال ميديا أو تسويقي بشكل يومي.'
    ],
    variants: [
      {
        id: 'canva-1y',
        code: '10436',
        duration: 'سنة',
        originalPrice: 3.59,
        price: 100,
        isPopular: true
      },
      {
        id: 'canva-3y',
        code: '10419',
        duration: '3 سنوات',
        originalPrice: 4.10,
        price: 120
      }
    ]
  },
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud (حساب جاهز)',
    englishName: 'Adobe Creative Cloud (Ready Account)',
    category: 'design',
    slug: 'adobe-creative-cloud',
    iconName: 'Layers',
    badge: 'الحزمة الاحترافية',
    featured: true,
    shortDescription: 'أكثر من 20 برنامج احترافي: فوتوشوب، إليستريتور، بريمير، وأفتر إيفكتس مع خطوط Adobe',
    features: [
      'أكتر من 20 برنامج احترافي: فوتوشوب، إليستريتور، بريمير برو، أفتر إيفكتس، إن ديزاين، أكروبات، لايت روم، وأكتر.',
      'آلاف الخطوط الاحترافية من مكتبة Adobe Fonts جاهزة للاستخدام في أي مشروع.',
      'Creative Cloud Libraries: مشاركة الألوان والخطوط والعناصر بين كل المشاريع والبرامج.',
      'Adobe Portfolio وBehance: عرض الأعمال في بورتفوليو احترافي والتواصل مع مجتمع المصممين.',
      'قوالب سوشيال ميديا جاهزة للتعديل السريع.',
      'الباقة دي بتتسلم كحساب جاهز مُفعّل بكل البرامج، مناسبة للمصممين والمونتيرين اللي شغلهم على الديسكتوب.'
    ],
    variants: [
      {
        id: 'adobe-cc-4m',
        code: '10055',
        duration: '4 شهور',
        originalPrice: 1127.30,
        price: 1200,
        isPopular: true
      }
    ]
  },
  {
    id: 'adobe-express',
    name: 'Adobe Express/Pro (حساب شخصي)',
    englishName: 'Adobe Express / Pro (Personal Account)',
    category: 'design',
    slug: 'adobe-express',
    iconName: 'PenTool',
    badge: 'تفعيل شخصي',
    featured: false,
    shortDescription: 'تصميم سريع من المتصفح والموبايل وتعديل كامل لملفات PDF مع أدوات التوليد بالذكاء الاصطناعي',
    features: [
      'تصميم سريع من المتصفح أو الموبايل: قوالب جاهزة لبوستات السوشيال ميديا والمنشورات التسويقية بدون تحميل برنامج ثقيل.',
      'تعديل وتحرير ملفات PDF: دمج وتقسيم وتحويل وتعديل ملفات PDF بشكل أساسي.',
      'أدوات ذكاء اصطناعي للتصميم: توليد وتعديل صور بالذكاء الاصطناعي داخل نفس الأداة.',
      'قوالب مدفوعة حصرية غير متاحة في النسخة المجانية.',
      'التفعيل بيكون على حسابك الشخصي — مناسبة لمن يحتاج تصميم وتعديل PDF بسرعة من غير برامج ديسكتوب ثقيلة.'
    ],
    variants: [
      {
        id: 'adobe-exp-3m',
        code: '10444',
        duration: '3 شهور',
        originalPrice: 124.26,
        price: 200,
        isPopular: true
      }
    ]
  },
  {
    id: 'figma-pro',
    name: 'Figma Pro Education',
    englishName: 'Figma Pro Education',
    category: 'design',
    slug: 'figma-pro',
    iconName: 'Figma',
    badge: 'سنتين كاملتين',
    featured: false,
    shortDescription: 'مشاريع غير محدودة، مكتبات الفريق، Dev Mode، وأدوات الذكاء الاصطناعي للتصميم',
    features: [
      'ملفات ومشاريع غير محدودة: بدل الـ3 ملفات في النسخة المجانية، اعمل أي عدد من المشاريع.',
      'سجل تعديلات كامل: الرجوع لأي نسخة سابقة من التصميم في أي وقت.',
      'Team Libraries: مشاركة المكونات وتوحيد هوية التصميم بين أعضاء الفريق.',
      'Dev Mode: تحويل التصميم لكود جاهز للمبرمجين مباشرة.',
      'أدوات ذكاء اصطناعي: مساعدة في توليد وتعديل التصميمات (متاحة لمستخدمي التعليم العالي).',
      'خطة تعليمية (Education) بريميوم كاملة بسعر رمزي.'
    ],
    note: 'البريد وكلمة السر متطابقين مع حساب Hotmail المرتبط — ممنوع تغيير البريد في Figma حفاظًا على الضمان.',
    variants: [
      {
        id: 'figma-2y',
        code: '1570',
        duration: 'سنتين',
        originalPrice: 350.00,
        price: 450,
        isPopular: true
      }
    ]
  },

  // 3) المونتاج والفيديو
  {
    id: 'capcut-pro',
    name: 'CapCut Pro',
    englishName: 'CapCut Pro',
    category: 'video',
    slug: 'capcut-pro',
    iconName: 'Video',
    badge: 'صناع المحتوى',
    featured: true,
    shortDescription: 'تصدير دقة 4K، تأثيرات Purple Diamond، تفريغ الخلفية وترجمة الكلام وتتبع الكاميرا',
    features: [
      'تصدير بجودة أعلى: إمكانية التصدير بدقة 2K وحتى 4K (حسب الجهاز ونوع المقطع).',
      'قوالب وتأثيرات حصرية (Purple Diamond): فلاتر وانتقالات وخطوط مميزة غير متاحة في النسخة المجانية.',
      'أدوات ذكاء اصطناعي: ترجمة الكلام لنص تلقائيًا، إزالة الخلفية، تتبع الكاميرا، وتوليد صور وفيديو وأفاتار بالذكاء الاصطناعي.',
      'تخزين سحابي إضافي لحفظ المشاريع والمقاطع.',
      'يشتغل على كل الأجهزة: موبايل وكمبيوتر ومتصفح بنفس الحساب.'
    ],
    note: 'الفرق الدقيق بين نسخة «الاقتصادي» و«المميز» في مدة الـ30 يوم (سعة التخزين أو رصيد أدوات الذكاء الاصطناعي) يتم توضيحه بدقة حسب المتاح من المورد.',
    variants: [
      {
        id: 'capcut-7d',
        code: '10421',
        duration: '7 أيام',
        originalPrice: 15.37,
        price: 70
      },
      {
        id: 'capcut-30d-eco',
        code: '10428',
        duration: '30 يوم (اقتصادي)',
        originalPrice: 81.99,
        price: 140
      },
      {
        id: 'capcut-30d-prem',
        code: '10422',
        duration: '30 يوم (مميز)',
        originalPrice: 122.98,
        price: 200,
        isPopular: true
      },
      {
        id: 'capcut-6m',
        code: '1596',
        duration: '6 شهور',
        originalPrice: 520.00,
        price: 600
      }
    ]
  },

  // 4) الترفيه
  {
    id: 'netflix',
    name: 'Netflix',
    englishName: 'Netflix Premium',
    category: 'entertainment',
    slug: 'netflix',
    iconName: 'Film',
    badge: 'حساب خاص',
    featured: true,
    shortDescription: 'حساب خاص بالكامل بجودة 4K، إمكانية إرسال حتى 5 دعوات، وضمان ذهبي 25 يوم',
    features: [
      'حساب خاص بالكامل: العميل هو المتحكم الوحيد فيه طول مدة الاشتراك.',
      'جودة عرض عالية: مشاهدة بأفضل جودة متاحة على الحساب (Ultra HD / 4K).',
      'إرسال دعوات: إمكانية إرسال حتى 5 دعوات لمشاهدين إضافيين.',
      'بروفايل مخصص للأطفال يقدر العميل يضيفه للحساب.',
      'تسجيل الدخول عبر Outlook: الدخول بالبريد الإلكتروني المرفق، والحصول على رمز التحقق (OTP) من نفس البريد عند الحاجة.',
      'الضمان: 25 يوم. صلاحية الاشتراك: 30 يوم.'
    ],
    note: 'ممنوع تغيير كلمة مرور Outlook المرتبط بالحساب — تغييرها يلغي الضمان.',
    variants: [
      {
        id: 'netflix-1m',
        code: '1563',
        duration: 'شهري (30 يوم)',
        originalPrice: 135.00,
        price: 200,
        isPopular: true
      }
    ]
  },

  // 5) الإنتاجية
  {
    id: 'microsoft-office-365',
    name: 'Microsoft Office 365',
    englishName: 'Microsoft Office 365',
    category: 'productivity',
    slug: 'microsoft-office-365',
    iconName: 'FileText',
    badge: 'سنة كاملة + 1TB',
    featured: true,
    shortDescription: 'وورد، إكسل، باوربوينت مع 1 تيرابايت تخزين ون درايف وحماية متقدمة لمدة سنة كاملة',
    features: [
      'برامج أوفيس الكاملة: وورد وإكسيل وباوربوينت وأوت لوك بأحدث إصدار.',
      'تيرابايت تخزين سحابي (OneDrive) لحفظ الملفات ومشاركتها من أي جهاز.',
      'اقتراحات ذكية أثناء الكتابة: تصحيح واقتراحات تصميم داخل وورد وباوربوينت.',
      'قوالب وصور وخطوط جاهزة مدمجة داخل البرامج نفسها.',
      'حماية من الفيروسات: كشف واسترجاع الملفات عند هجوم Ransomware، مع خزنة شخصية محمية بتحقق ثنائي (Personal Vault).',
      'اشتراك سنة كاملة (12 شهر) بحساب جاهز.'
    ],
    variants: [
      {
        id: 'office-12m',
        code: '1597',
        duration: '12 شهر',
        originalPrice: 70.00,
        price: 150,
        isPopular: true
      }
    ]
  },

  // 6) أدوات التسويق والبيزنس
  {
    id: 'whatsapp-sender',
    name: 'واتساب سندر (WhatsApp Sender)',
    englishName: 'WhatsApp Bulk Sender',
    category: 'marketing',
    slug: 'whatsapp-sender',
    iconName: 'MessageSquare',
    badge: 'حملات تسويقية',
    featured: true,
    shortDescription: 'إرسال رسائل جماعية، شات بوت ذكي، تسخين الحسابات، وجدولة الرسائل وفلترة الأرقام',
    features: [
      'رسائل جماعية من عدة أرقام: إرسال لعدد كبير من العملاء دفعة واحدة، مع توزيع الحمل على أكتر من رقم واتساب.',
      'فلترة وإدارة الأرقام: التأكد إن الأرقام مفعّلة على واتساب قبل الإرسال، وتنظيمها في قوائم ومجموعات.',
      'شات بوت ذكي: ردود تلقائية على كلمات مفتاحية، ونظام سؤال وجواب متطور.',
      'جدولة الرسائل لتنفيذها أوتوماتيك في ميعاد محدد.',
      'أدوات الجروبات: استخراج الأعضاء، إضافة أعضاء دفعة واحدة، الانضمام التلقائي، والبحث عن جروبات مستهدفة.',
      'تسخين الحساب (Warmer): نشاط تدريجي يقلل احتمالية الحظر.',
      'تقارير وتحليلات مفصّلة لنسب نجاح وفشل الإرسال.'
    ],
    executionNote: 'طريقة التنفيذ: يتم وضع رقم الهاتف في خانة الرابط عند الطلب، وبعدها يتواصل العميل مع دعم واتساب لتفعيل الاشتراك.',
    variants: [
      {
        id: 'wa-1y',
        code: '1386',
        duration: 'سنة',
        originalPrice: 50.00,
        price: 150
      },
      {
        id: 'wa-3y',
        code: '1568',
        duration: '3 سنوات',
        originalPrice: 70.00,
        price: 200
      },
      {
        id: 'wa-lifetime',
        code: '1569',
        duration: 'مدى الحياة',
        originalPrice: 100.00,
        price: 250,
        isPopular: true
      }
    ]
  },
  {
    id: 'egypt-numbers-data',
    name: 'داتا أرقام مصرية (30–45 مليون)',
    englishName: 'Egypt Phone Numbers Database',
    category: 'marketing',
    slug: 'egypt-numbers-data',
    iconName: 'Database',
    badge: 'بيانات 2025-2026',
    featured: true,
    shortDescription: 'قاعدة بيانات ضخمة مصنفة حسب التخصص والمهنة والأنشطة التجارية لحملات الواتساب وSMS',
    features: [
      'حجم ضخم: من 30 إلى 45 مليون رقم هاتف داخل مصر.',
      'تصنيف حسب المجال: أطباء، صيادلة، مهندسين، مقاولات، شركات، موارد بشرية، كول سنتر، مطاعم، تجار جملة وقطاعي، عقارات، تسويق، سوشيال ميديا، ومشاهير.',
      'مناسبة لحملات متعددة: واتساب، SMS، مكالمات، إعلانات ممولة، وتسويق مباشر.',
      'محدثة باستمرار (بيانات حية 2025–2026).'
    ],
    executionNote: 'طريقة التنفيذ: يتم وضع رقم الواتساب في خانة الرابط عند الطلب، وبعدها يتواصل دعم واتساب لتسليم البيانات فوراً.',
    variants: [
      {
        id: 'data-onetime',
        code: '208',
        duration: 'دفعة واحدة',
        originalPrice: 200.00,
        price: 300,
        isPopular: true
      }
    ]
  }
];
