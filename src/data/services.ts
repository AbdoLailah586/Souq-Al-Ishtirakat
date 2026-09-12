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
    imageUrl: '/images/products/chatgpt-plus.jpg',
    badge: 'الأكثر طلباً',
    featured: true,
    shortDescription: 'وصول لأحدث نماذج GPT المتقدمة، تحليل الملفات والـ PDF، سرعة فائقة، Custom GPTs، وتفعيل مضمون.',
    deliveryTime: '0 - 6 ساعات (تسليم سريع 10 - 20 دقيقة)',
    deliveryFormat: 'حساب جديد جاهز أو تفعيل على إيميلك الشخصي',
    warrantyText: 'ضمان 30 يوم ودعم فني طوال المدة',
    accountType: 'حساب جاهز ومفعّل خاص بك (مش مشترك)',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم هاتفك / الواتساب للتواصل والتسليم',
    requiredInputPlaceholder: 'ضع رقم هاتفك في الخانة وسيتم التواصل معك لتسليمك الحساب (من 10 إلى 20 دقيقة)',
    activationSteps: [
      '1️⃣ في خانة البيانات ضع رقم هاتفك أو واتساب الخاص بك.',
      '2️⃣ قم بإنشاء وتأكيد طلب الاشتراك.',
      '3️⃣ سيتم التواصل معك مباشرة لتسليمك الحساب (مدة البدء والتسليم من 10 إلى 20 دقيقة).',
      '4️⃣ نعطيك حساباً جاهزاً ومفعلاً خاصاً بك (مش مشترك) أو تفعيل مباشر على إيميلك الشخصي الجديد.',
      '5️⃣ استمتع بضمان رسمي 30 يوم ودعم فني مخصص طوال فترة الاشتراك.'
    ],
    features: [
      'وصول لأحدث النماذج المتقدمة بأداء قوي ومحادثات ذكية وبحث دقيق.',
      'تحليل وقراءة وتلخيص الملفات والمستندات والبي دي إف والصور.',
      'أولوية وأداء صاروخي وسرعة استجابة فائقة وسعة استخدام عالية وقت الذروة.',
      'إمكانية بناء واستخدام النماذج المخصصة Custom GPTs ومشاريع العمل.',
      'تفعيل مباشر على إيميلك الشخصي الجديد (بشرط ميكونش تم استخدامه قبل كده في ChatGPT) أو استلام حساب جاهز خاص بك.',
      'توليد الصور بالذكاء الاصطناعي بدقة عالية والوضع الصوتي المتقدم.',
      'ضمان ودعم فني طوال مدة الاشتراك مع سرعة استبدال عند أي عطل.'
    ],
    note: 'نعطيك حساباً جديداً خاصاً بك بالكامل مع ضمان 30 يوماً ودعم فني مباشر.',
    executionNote: 'ضع رقم هاتفك في الخانة وسيتم التواصل معك خلال دقائق لتسليم الحساب.',
    variants: [
      {
        id: 'chatgpt-1m',
        code: '10208',
        duration: 'شهر واحد',
        originalPrice: 819.85,
        price: 900,
        isPopular: true
      },
      {
        id: 'chatgpt-2m',
        code: '10209',
        duration: 'شهرين (شهر أساسي + إضافي)',
        originalPrice: 1550.00,
        price: 1650,
        offerPrice: 1500,
        offerLabel: 'عرض الشهر الإضافي'
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
    imageUrl: '/images/products/gemini-pro.jpg',
    badge: 'تخزين 5TB مجاناً',
    featured: true,
    shortDescription: 'ذكاء جوجل المتقدم مع 5 تيرابايت مساحة تخزين Google One وتفعيل على إيميلك الشخصي مباشرة.',
    deliveryTime: '0 - 6 ساعات',
    deliveryFormat: 'تفعيل على إيميلك الشخصي (Gmail)',
    warrantyText: 'ضمان كامل واستقرار دائم',
    accountType: 'حساب شخصي مع مساحة 5TB في Google Drive و Photos',
    requiredInputType: 'email',
    requiredInputLabel: 'البريد الإلكتروني المراد تفعيله أو رقم الواتس',
    requiredInputPlaceholder: 'أدخل بريدك الشخصي (Gmail) أو رقم الواتس للتفعيل المباشر',
    activationSteps: [
      '1️⃣ في خانة الرابط أو البيانات ضع بريدك الشخصي (Gmail) أو رقم الواتس الخاص بك.',
      '2️⃣ قم بإنشاء وتأكيد طلب الاشتراك.',
      '3️⃣ بعد عمل الطلب، تواصل مع الدعم الفني عبر واتساب واذكر مدة الاشتراك لتفعيل مساحة الـ 5TB فوراً.'
    ],
    features: [
      'نموذج Gemini المتقدم: يجاوب على أي سؤال، يكتب أكواد برمجية، يحلل بيانات معقدة، ويكتب محتوى تسويقي وإبداعي.',
      'تخزين Google One الضخم: 5 تيرابايت مساحة (بدل الـ15 جيجا العادية) لصورك وملفاتك ورسايل Gmail.',
      'توليد فيديو (Veo): تحويل نص مكتوب لفيديو واقعي بجودة عالية.',
      'NotebookLM: رفع ملفات (PDF، مستندات كبيرة) والحصول على تلخيص فوري ومناقشتها تفاعلياً.',
      'تعديل الصور بالذكاء الاصطناعي: عزل الخلفيات وتحسين جودة الصور بضغطة زر.',
      'تكامل مدمج داخل Gmail وDrive وDocs وSheets وMeet.',
      'التفعيل بيكون على إيميلك الشخصي، خصوصية كاملة وبياناتك لك وحدك.'
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
    englishName: 'Claude Pro 5X (Opus & Sonnet & Codex)',
    category: 'ai',
    slug: 'claude-pro',
    iconName: 'Cpu',
    imageUrl: '/images/products/claude-pro.jpg',
    badge: 'حدود استخدام 5X',
    featured: true,
    shortDescription: 'وصول سريع لنماذج Claude Opus وSonnet وGPT Codex، حتى 5 مليون Token شهرياً ودعم أدوات الكود.',
    deliveryTime: '0 - 2 ساعة (تفعيل سريع)',
    deliveryFormat: 'كود اشتراك سريع (Subscription Code)',
    warrantyText: 'ضمان كامل المدة',
    accountType: 'Pro 5X مع واجهة موحدة ولوحة تحكم متطورة',
    externalLink: {
      label: 'بوابة تسجيل الحساب (claudesk.pro)',
      url: 'https://claudesk.pro/'
    },
    requiredInputType: 'email',
    requiredInputLabel: 'البريد المسجل به في منصة claudesk.pro',
    requiredInputPlaceholder: 'سجل في https://claudesk.pro/ واكتب هنا الإيميل الذي قمت بالتسجيل به',
    activationSteps: [
      '1️⃣ قم بالدخول والتسجيل في المنصة: https://claudesk.pro/',
      '2️⃣ انسخ الإيميل الذي سجلت به في المنصة وضعه في خانة بيانات التفعيل بالأسفل.',
      '3️⃣ قم بإنشاء طلب الاشتراك في متجرنا للحصول على كود التفعيل أو الترقية.',
      '4️⃣ بعد عمل الطلب، تواصل مع الدعم الفني عبر واتساب لإتمام تفعيل باقة Pro 5X فوراً.'
    ],
    features: [
      'الوصول إلى أقوى نماذج Claude Opus وSonnet بالإضافة إلى GPT Codex من خلال واجهة واحدة.',
      'سعة ضخمة تصل حتى 5 مليون Token شهرياً.',
      'سرعة استجابة حتى 40 رسالة كل 4 ساعات، وحتى 300 رسالة أسبوعياً.',
      'دعم كامل لأدوات البرمجة: Claude Code وCursor وCline وRoo وContinue وCodex CLI.',
      'لوحة تحكم تفاعلية لمتابعة الاستهلاك والحدود بشكل فوري.',
      'تفعيل سريع باستخدام كود الاشتراك بدون الحاجة إلى API Keys أو دفع مقابل كل طلب.',
      'مثالي للمطورين والباحثين والمبرمجين والمشاريع الكودية المعقدة.'
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
    englishName: 'Super Grok (xAI)',
    category: 'ai',
    slug: 'super-grok',
    iconName: 'Zap',
    imageUrl: '/images/products/super-grok.jpg',
    badge: 'سريع وتفاعلي',
    featured: false,
    shortDescription: 'أحدث نماذج Grok مع Grok Imagine لتوليد الصور والفيديو والبحث المعمق DeepSearch والتفكير العميق.',
    deliveryTime: '0 - 6 ساعات',
    deliveryFormat: 'حساب مفعل أو ترقية',
    warrantyText: 'ضمان كامل المدة',
    accountType: 'اشتراك Super Grok فائق السرعة',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الهاتف / الواتساب للتواصل',
    requiredInputPlaceholder: 'في خانة الرابط/البيانات ضع رقمك للتواصل واستكمال التنفيذ',
    activationSteps: [
      '1️⃣ في خانة الرابط/البيانات ضع رقمك.',
      '2️⃣ قم بإنشاء طلب الاشتراك.',
      '3️⃣ بعد إنشاء الطلب، تواصل معنا عبر دعم واتساب لاستكمال التنفيذ.'
    ],
    features: [
      'نموذج Grok الأقوى: أولوية وصول لأحدث إصدار من Grok بسرعة استجابة فائقة.',
      'Grok Imagine: توليد صور وفيديوهات إبداعية بالذكاء الاصطناعي من وصف نصي.',
      'DeepSearch: بحث عميق وتجميع معلومات حية من مصادر متعددة على شبكة الإنترنت.',
      'وضع التفكير العميق (Think Mode): تحليل متدرج خطوة بخطوة للمسائل المعقدة.',
      'الوضع الصوتي التفاعلي للتحدث بصوت طبيعي وسلس.',
      'ذاكرة وسياق موسع للمحادثات وتنظيم المهام في مساحات عمل مستقلة.'
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
    imageUrl: '/images/products/canva-pro.jpg',
    badge: 'أفضل قيمة',
    featured: true,
    shortDescription: '140 مليون عنصر وتصميم، أدوات الذكاء الاصطناعي الكاملة، تفعيل مباشر على بريدك الشخصي.',
    deliveryTime: '0 - 6 ساعات',
    deliveryFormat: 'دعوة للانضمام إلى فريق Canva Pro',
    warrantyText: 'ضمان فعلي 3 سنوات (استبدال لأي مشكلة - ضمان 6 شهور)',
    accountType: 'حساب شخصي كـ "طالب" في فريق Canva Pro',
    requiredInputType: 'email',
    requiredInputLabel: 'بريدك الإلكتروني في Canva لتلقي الدعوة',
    requiredInputPlaceholder: 'يرجى إضافة بريدك الإلكتروني لتلقي الدعوة عليه مباشرة',
    activationSteps: [
      '1️⃣ يرجى إضافة بريدك الإلكتروني في خانة البيانات لتلقي الدعوة عليه مباشرة.',
      '2️⃣ سيتم إضافتك إلى غرفة كـ "طالب" في فريق Canva Pro.',
      '3️⃣ افتح بريدك الإلكتروني واضغط على رابط قبول الدعوة لتفعيل الـ Pro فوراً.',
      '4️⃣ يعمل على بريدك الشخصي (لا حاجة لحساب جديد) مع استقرار رسمي وموثوق.',
      '5️⃣ ضمان فعلي لمدة 3 سنوات – استبدال لأي مشكلة خلال فترة الضمان (ضمان مؤكد 6 شهور).'
    ],
    features: [
      'يعمل على بريدك الشخصي (لا حاجة لحساب جديد).',
      'اشتراك رسمي، مستقر، وموثوق 100%.',
      'فتح جميع ميزات Canva Pro الكاملة بدون أي قيود.',
      'مكتبة تصميم ضخمة تضم أكثر من 140 مليون صورة وفيديو وقالب مميز.',
      'ميزات الذكاء الاصطناعي: Magic Switch، تفريغ الخلفيات، Magic Eraser، وتوليد الصور Dream Lab.',
      'مثالي للمصممين، رواد الأعمال، الطلاب، وأصحاب المشاريع وصناع المحتوى.'
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
    imageUrl: '/images/products/adobe-creative-cloud.jpg',
    badge: 'الحزمة الاحترافية',
    featured: true,
    shortDescription: 'أكثر من 20 برنامج احترافي: فوتوشوب، إليستريتور، بريمير برو، أفتر إيفكتس، حساب جاهز يعمل على كافة التطبيقات.',
    deliveryTime: '0 - 6 ساعات',
    deliveryFormat: 'حساب جاهز إصدار أدوبي تجريبي يعمل على جميع التطبيقات',
    warrantyText: 'بدون ضمان',
    accountType: 'حساب جاهز (البريد الإلكتروني | كلمة مرور الإيميل | كلمة مرور Adobe)',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الهاتف / الواتساب لاستلام بيانات الحساب',
    requiredInputPlaceholder: 'في خانة الرابط ضع رقمك وسيتم تسليم الحساب بكافة بياناته',
    activationSteps: [
      '1️⃣ في خانة الرابط/البيانات ضع رقمك وأنشئ طلب الاشتراك.',
      '2️⃣ يتم تنفيذ الطلب والتسليم خلال 0 – 6 ساعات.',
      '3️⃣ يتم تسليمك حساباً جاهزاً (إصدار أدوبي تجريبي يعمل على جميع التطبيقات).',
      '4️⃣ تنسيق البيانات المسلمة: البريد الإلكتروني | كلمة مرور البريد الإلكتروني | كلمة مرور Adobe.',
      '5️⃣ سجل الدخول في تطبيق Adobe Creative Cloud Desktop وحمل أي برنامج تريده.'
    ],
    features: [
      'أكثر من 20 برنامج احترافي: فوتوشوب، إليستريتور، بريمير برو، أفتر إيفكتس، إن ديزاين، أكروبات، لايت روم.',
      'يعمل على جميع التطبيقات للكمبيوتر والموبايل.',
      'آلاف الخطوط الاحترافية من مكتبة Adobe Fonts.',
      'مكتبات Creative Cloud Libraries لمزامنة الأعمال والألوان.',
      'بدء التنفيذ: 0 - 6 ساعات، لمدة 3 شهور.'
    ],
    note: 'يتم تسليمك حساب جاهز إصدار أدوبي التجريبي يعمل على جميع التطبيقات لمدة 3 شهور (بدون ضمان).',
    variants: [
      {
        id: 'adobe-cc-3m',
        code: '10055',
        duration: '3 شهور',
        originalPrice: 950.00,
        price: 1050,
        isPopular: true
      },
      {
        id: 'adobe-cc-4m',
        code: '10056',
        duration: '4 شهور',
        originalPrice: 1127.30,
        price: 1200
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
    imageUrl: '/images/products/adobe-express.jpg',
    badge: 'تفعيل شخصي',
    featured: false,
    shortDescription: 'رابط تفعيل Redeem Link رسمي، ترقية حسابك الشخصي فوراً لمدة 3 شهور بدون VPN وبدون فيزا.',
    deliveryTime: 'تسليم فوري (رابط تفعيل Redeem)',
    deliveryFormat: 'رابط تفعيل رقمي (Redeem Link)',
    warrantyText: 'بدون ضمان',
    accountType: 'حسابك الشخصي يتم ترقيته إلى Premium لمدة 3 شهور',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الواتساب لاستلام رابط التفعيل',
    requiredInputPlaceholder: 'ضع رقم الواتس لاستلام رابط الـ Redeem المباشر',
    activationSteps: [
      '1️⃣ قم بإنشاء طلب الاشتراك في المتجر.',
      '2️⃣ هتستلم رابط تفعيل (Redeem Link) بشكل فوري.',
      '3️⃣ افتح الرابط وسجّل الدخول بإيميلك الشخصي، وهيتم ترقية حسابك فورًا إلى Premium لمدة 3 شهور.',
      '❌ بدون الحاجة لاستخدام VPN.',
      '❌ بدون الحاجة لفيزا أو وسيلة دفع.',
      '✅ تفعيل بسيط وسريع في ثوانٍ معدودة.'
    ],
    features: [
      'يتم تسليمك رابط تفعيل (Redeem Link) رسمي لمدة 3 شهور.',
      'تفعيل بسيط وسريع على إيميلك الشخصي بدون أي تعقيدات.',
      'بدون VPN وبدون الحاجة لربط فيزا أو وسيلة دفع بنكية.',
      'تصميم سريع من المتصفح أو الموبايل بقوالب احترافية فائقة الجودة.',
      'تعديل وتحرير ملفات الـ PDF (دمج، تقسيم، تحويل، وتعديل).',
      'أدوات الذكاء الاصطناعي لتوليد وتعديل الصور وتفريغ الخلفيات.'
    ],
    note: 'الاشتراك لمدة 3 شهور عبر رابط Redeem Link رسمي، بدون ضمان، وبدون فيزا أو VPN.',
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
    imageUrl: '/images/products/figma-pro.jpg',
    badge: 'سنتين كاملتين',
    featured: false,
    shortDescription: 'خطة Figma Pro التعليمية لمدة سنتين مع مساحة غير محدودة، مكتبات الفريق، Dev Mode، وميزة Make في Opus 4.7.',
    deliveryTime: '0 - 6 ساعات',
    deliveryFormat: 'حساب جاهز (البريد الإلكتروني | كلمة المرور)',
    warrantyText: 'ضمان لمدة شهر واحد (اشتراك سنتين)',
    accountType: 'حساب Figma Pro التعليمي لمدة سنتين كاملتين',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الهاتف / الواتساب لاستلام بيانات الحساب',
    requiredInputPlaceholder: 'في خانة الرابط ضع رقمك لاستلام بيانات الحساب ومتابعة التعليمات',
    activationSteps: [
      '1️⃣ في خانة الرابط ضع رقمك وأنشئ طلب الاشتراك.',
      '2️⃣ يتم تسليمك بيانات الحساب بالتنسيق: البريد الإلكتروني | كلمة المرور.',
      '3️⃣ كلمة مرور Figma و Hotmail متطابقة تماماً.',
      '4️⃣ سجل الدخول إلى Hotmail أولاً للتأكد ثم سجل الدخول إلى Figma.',
      '⚠️ ملاحظة هامة جداً: لا تقم بتغيير بريدك الإلكتروني في Figma نهائياً للحفاظ على استمرار الخطة والضمان.'
    ],
    features: [
      'خطة Figma Pro التعليمية لمدة سنتين كاملتين مع ضمان شهر.',
      'مساحة غير محدودة: عدد لا نهائي من الملفات والمشاريع وسجل التعديلات (بدلاً من 3 ملفات في المجانية).',
      'مكتبات الفريق (Team Libraries): لمشاركة المكونات وتوحيد هوية التصميم بين أعضاء الفريق.',
      'أدوات متقدمة: نماذج تفاعلية (Prototyping) أعمق، أدوات ذكاء اصطناعي، ووضع المطورين (Dev Mode) لاستخراج الأكواد.',
      'ميزة Make متوفرة الآن في Opus 4.7.',
      'احصل على 3000 رصيد شهرياً لأدوات الذكاء الاصطناعي والتوليد.'
    ],
    note: 'كلمة مرور Figma و Hotmail متطابقة. تنبيه: لا تقم بتغيير بريدك الإلكتروني في Figma.',
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
    imageUrl: '/images/products/capcut-pro.jpg',
    badge: 'صناع المحتوى',
    featured: true,
    shortDescription: 'تصدير دقة 4K، تأثيرات Purple Diamond، تفريغ الخلفية وترجمة الكلام وتتبع الكاميرا بالذكاء الاصطناعي.',
    deliveryTime: '0 – 6 ساعات',
    deliveryFormat: 'تفعيل اشتراك الحساب',
    warrantyText: 'ضمان كامل المدة',
    accountType: 'اشتراك بريميوم كامل الميزات',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الهاتف / الواتساب للتنفيذ',
    requiredInputPlaceholder: 'في خانة الرابط ضع رقمك ويتم تنفيذ الطلب خلال 0 – 6 ساعات',
    activationSteps: [
      '1️⃣ في خانة الرابط ضع رقمك.',
      '2️⃣ قم بإنشاء طلب الاشتراك.',
      '3️⃣ يتم تنفيذ الطلب والتفعيل خلال 0 – 6 ساعات.'
    ],
    features: [
      'تصدير بجودة فائقة: إمكانية التصدير بدقة 2K وحتى 4K بمعدل إطارات سلس.',
      'قوالب وتأثيرات حصرية (Purple Diamond): فلاتر وانتقالات وخطوط احترافية مدفوعة.',
      'أدوات ذكاء اصطناعي: ترجمة الكلام لنص تلقائياً بدقة، إزالة الخلفية، وتتبع الكاميرا الذكي.',
      'تخزين سحابي إضافي لحفظ المشاريع ومزامنتها بين الأجهزة.',
      'يعمل على الكمبيوتر والموبايل والمتصفح بنفس الحساب.'
    ],
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
    englishName: 'Netflix Premium (5 Profiles)',
    category: 'entertainment',
    slug: 'netflix',
    iconName: 'Film',
    imageUrl: '/images/products/netflix.jpg',
    badge: 'حساب خاص 5 بروفايل',
    featured: true,
    shortDescription: 'حساب نتفلكس خاص بالكامل [5 بروفايل مع PIN لكل بروفايل]، جودة 4K Ultra HD، ضمان 20 يوم.',
    deliveryTime: '0 – 24 ساعة (تسليم حساب جاهز فوري)',
    deliveryFormat: 'حساب جاهز خاص مع بريد وصول أكواد التحقق',
    warrantyText: 'ضمان 20 يوم (مدة الاشتراك 30 يوم)',
    accountType: 'حساب كامل خاص بك (5 بروفايلات مع PIN خاص)',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الهاتف / الواتساب لاستلام بيانات الدخول',
    requiredInputPlaceholder: 'في خانة الرابط ضع رقمك وسيتم تسليم الحساب فورياً',
    activationSteps: [
      '1️⃣ في خانة الرابط ضع رقمك.',
      '2️⃣ قم بإنشاء طلب الاشتراك.',
      '3️⃣ يتم تنفيذ الطلب وتسليمك الحساب خلال 0 – 24 ساعة بشكل فوري.',
      '4️⃣ الاشتراك لمدة 30 يوماً مع ضمان 20 يوماً.',
      '5️⃣ يمكنك إنشاء 5 بروفايلات مع تعيين رمز PIN خاص لكل بروفايل.',
      '🔴 ملاحظة: في بعض الدول (حوالي 1%) قد تحتاج إلى استخدام VPN.'
    ],
    loginInstructions: [
      '1. ادخل إلى موقع crowmail.sbs من متصفح الإنترنت.',
      '2. اختر Full Email Mode من نافذة تسجيل الدخول.',
      '3. أدخل البريد الإلكتروني وكلمة المرور المرفقين بالطلب، ثم اضغط Login.',
      '4. ادخل إلى موقع أو تطبيق Netflix وسجّل الدخول بنفس البريد الإلكتروني.',
      '5. افحص صندوق الوارد في crowmail.sbs للحصول على كود التحقق من Netflix.',
      '6. أدخل كود التحقق في Netflix لإكمال تسجيل الدخول بنجاح.'
    ],
    features: [
      'حساب خاص بالكامل: العميل هو المتحكم الوحيد فيه طول مدة الاشتراك.',
      'يمكنك إنشاء حتى 5 بروفايلات مع تعيين رمز PIN مستقل لكل بروفايل.',
      'جودة عرض فائقة 4K Ultra HD ودعم الصوت المكاني Spatial Audio.',
      'مدة الاشتراك 30 يوماً كاملة مع ضمان فعلي لمدة 20 يوماً.',
      'نظام بريد خاص (crowmail.sbs) لاستلام أكواد التحقق OTP بسهولة وأمان.'
    ],
    note: 'ممنوع تغيير كلمة مرور بريد التحقق المرتبط بالحساب حفاظاً على سريان الضمان.',
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
    englishName: 'Microsoft Office 365 Pro',
    category: 'productivity',
    slug: 'microsoft-office-365',
    iconName: 'FileText',
    imageUrl: '/images/products/microsoft-office-365.jpg',
    badge: 'سنة كاملة + 1TB',
    featured: true,
    shortDescription: 'وورد، إكسل، باوربوينت، وأوت لوك مع 1 تيرابايت تخزين OneDrive وحماية متقدمة لمدة سنة كاملة.',
    deliveryTime: '0 – 6 ساعات',
    deliveryFormat: 'حساب جاهز مرخص رسمي',
    warrantyText: 'ضمان كامل المدة (سنة كاملة)',
    accountType: 'حساب رسمي مرخص لمدة 12 شهر',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الواتس الخاص بك لتسليم الحساب',
    requiredInputPlaceholder: 'في خانة الرابط ضع رقم الواتس الخاص بك',
    activationSteps: [
      '1️⃣ في خانة الرابط ضع رقم الواتس الخاص بك.',
      '2️⃣ قم بإنشاء طلب الاشتراك.',
      '3️⃣ يتم تفعيل الطلب وتسليم بيانات الحساب الجاهز (إيميل وباسورد) خلال 0 – 6 ساعات.',
      '4️⃣ بعد عمل الطلب، تواصل مع الدعم الفني عبر واتساب واذكر مدة الاشتراك لتأكيد التسليم.'
    ],
    features: [
      'برامج أوفيس الكاملة: وورد، إكسيل، باوربوينت، وأوت لوك بأحدث إصدار رسمي.',
      'تيرابايت كامل (1000 GB) تخزين سحابي على OneDrive.',
      'حفظ ومزامنة الملفات والعمل المشترك عليها من عدة أجهزة.',
      'اقتراحات ذكية وتصحيح لغوي متقدم وقوالب احترافية مدمجة.',
      'حماية متقدمة من الفيروسات والبرمجيات الخبيثة مع خزنة شخصية Personal Vault.',
      'اشتراك لمدة سنة كاملة (12 شهر) بحساب مرخص وجاهز للاستخدام.'
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
    imageUrl: '/images/products/whatsapp-sender.jpg',
    badge: 'حملات تسويقية',
    featured: true,
    shortDescription: 'إرسال رسائل جماعية، شات بوت ذكي، تسخين الحسابات، جدولة الرسائل وفلترة الأرقام لزيادة مبيعاتك.',
    deliveryTime: '0 – 6 ساعات',
    deliveryFormat: 'ترخيص البرنامج + رابط التحميل والشرح المباشر',
    warrantyText: 'دعم فني وتحديثات مستمرة طوال فترة الاشتراك',
    accountType: 'ترخيص تشغيل رسمي (سنوي / مدى الحياة)',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الواتساب لاستلام البرنامج وكود التفعيل',
    requiredInputPlaceholder: 'في خانة الرابط ضع رقم الواتس الخاص بك',
    activationSteps: [
      '1️⃣ في خانة الرابط ضع رقم الواتس الخاص بك.',
      '2️⃣ قم بإنشاء طلب الاشتراك.',
      '3️⃣ بعد عمل الطلب، تواصل مع الدعم الفني عبر واتساب واذكر مدة الاشتراك لاستلام كود التفعيل والبرنامج وشرح الاستخدام فوراً.'
    ],
    features: [
      'رسائل جماعية غير محدودة من عدة أرقام مع توزيع الحمل التلقائي.',
      'فلترة الأرقام والتحقق من وجود واتساب قبل بدء الإرسال.',
      'شات بوت ذكي للرد الآلي الفوري على استفسارات العملاء والكلمات المفتاحية.',
      'جدولة الحملات التسويقية لتنطلق في المواعيد المحددة بدقة.',
      'أدوات متطورة لجروبات الواتساب وسحب جهات الاتصال.',
      'نظام تسخين الأرقام (Warmer) لحماية أرقامك وتفادي الحظر.',
      'تقارير مفصلة بالأرقام الناجحة ونسب التحويل.'
    ],
    executionNote: 'طريقة التنفيذ: في خانة الرابط ضع رقم الواتس الخاص بك، وبعد عمل الطلب تواصل مع الدعم الفني عبر واتساب واذكر مدة الاشتراك.',
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
    imageUrl: '/images/products/egypt-numbers-data.jpg',
    badge: 'بيانات 2025-2026',
    featured: true,
    shortDescription: 'قاعدة بيانات ضخمة مصنفة حسب التخصص والمهنة والأنشطة التجارية لحملات الواتساب وSMS والمكالمات.',
    deliveryTime: 'تسليم فوري (0 - 2 ساعة)',
    deliveryFormat: 'روابط تحميل سحابية مباشرة لملفات Excel/CSV المنظمة',
    warrantyText: 'بيانات مفحوصة ومحدثة 2025 - 2026',
    accountType: 'قاعدة بيانات كاملة مصنفة حسب المحافظات والقطاعات',
    requiredInputType: 'phone',
    requiredInputLabel: 'رقم الواتساب لاستلام روابط التحميل الفورية',
    requiredInputPlaceholder: 'في خانة الرابط ضع رقم الواتس الخاص بك',
    activationSteps: [
      '1️⃣ في خانة الرابط ضع رقم الواتس الخاص بك.',
      '2️⃣ قم بإنشاء طلب شراء الداتا.',
      '3️⃣ بعد عمل الطلب، تواصل مع الدعم الفني عبر واتساب لاستلام روابط تحميل الملفات مباشرة وبدء حملاتك الإعلانية فوراً.'
    ],
    features: [
      'قاعدة بيانات هائلة: من 30 إلى 45 مليون رقم هاتف داخل جمهورية مصر العربية.',
      'تصنيف دقيق وشامل حسب القطاعات: أطباء، صيادلة، مهندسين، مقاولات، شركات، موارد بشرية، كول سنتر، مطاعم، تجار جملة وقطاعي، عقارات، تسويق، ومشاهير.',
      'مثالية لجميع أنواع الحملات: رسائل واتساب، حملات SMS، إعلانات Custom Audiences، واتصالات تسويقية.',
      'بيانات حية ومحدثة باستمرار للعام الحالي 2025–2026.'
    ],
    executionNote: 'طريقة التنفيذ: في خانة الرابط ضع رقم الواتس الخاص بك، وبعد عمل الطلب تواصل مع الدعم الفني عبر واتساب لاستلام الروابط.',
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
