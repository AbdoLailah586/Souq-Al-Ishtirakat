import { Bundle } from '../types';

export const BUNDLES: Bundle[] = [
  {
    id: 'bundle-chatgpt-gemini',
    code: '21885',
    name: 'ChatGPT زائد Gemini',
    components: 'ChatGPT Plus + Gemini Pro (إضافة بسعر خاص)',
    componentsList: [
      'ChatGPT Plus (شهر كامل مع GPT-5)',
      'Gemini Pro (18 شهر + 5TB مساحة سحابية)'
    ],
    originalPrice: 881.34,
    price: 985,
    savings: 65,
    badge: 'باقة الذكاء الخارق',
    description: 'اجمع بين أقوى نموذجين في العالم: أحدث إصدار من ChatGPT للبرمجة والتحليل والتفكير العميق + جوجل Gemini Pro مع 5 تيرابايت مساحة سحابية وتكامل مع تطبيقات جوجل.',
    features: [
      'وصول لأحدث نماذج GPT-5 ونماذج Gemini المتقدمة',
      'تخزين سحابي عملاق 5 تيرابايت على إيميلك الشخصي',
      'أدوات توليد وتعديل الصور والفيديو والصوت',
      'توفير خاص ومضمون عند شراء النموذجين معاً'
    ]
  },
  {
    id: 'bundle-claude-gemini',
    code: '23164',
    name: 'Claude زائد Gemini',
    components: 'Claude Pro 5X + Gemini Pro (إضافة بسعر خاص)',
    componentsList: [
      'Claude Pro 5X (حدود استخدام 5X)',
      'Gemini Pro (18 شهر + 5TB مساحة)'
    ],
    originalPrice: 835.22,
    price: 935,
    savings: 65,
    badge: 'باقة المبرمجين',
    description: 'أقوى تركيبة للمبرمجين وصناع المحتوى: دقة وتفكير Claude المذهلة في كتابة الأكواد ومراجعتها مع سرعة وتخزين Gemini Pro الضخم.',
    features: [
      'حدود استخدام 5 أضعاف على Claude Sonnet و Opus',
      'تخزين سحابي 5 تيرابايت مع Gemini Pro لمدة 18 شهر',
      'أدوات Claude Code و Artifacts البرمجية المتقدمة',
      'تفعيل شخصي مضمون وآمن'
    ]
  },
  {
    id: 'bundle-academic-year',
    code: '23232',
    name: 'باقة السنة الدراسية',
    components: 'Office 365 + Gemini Pro + Canva Pro (سنة)',
    componentsList: [
      'Microsoft Office 365 (سنة كاملة)',
      'Gemini Pro (18 شهر مع 5TB)',
      'Canva Pro (سنة كاملة)'
    ],
    originalPrice: 135.08,
    price: 330,
    savings: 70,
    badge: 'الأنسب للطلاب والمعلمين',
    description: 'كل ما يحتاجه الطالب والباحث والمعلم في مكان واحد: برامج الأوفيس للأبحاث، وجيميني للتلخيص وإعداد المحتوى، وكانفا بريميوم لتصميم العروض التقديمية.',
    features: [
      'حزمة أوفيس كاملة (Word, Excel, PowerPoint) لمدة سنة',
      'مساحة تخزين سحابية 1TB OneDrive + 5TB Google One',
      'أدوات الذكاء الاصطناعي لتلخيص الـ PDF عبر NotebookLM',
      'تصميم العروض والملصقات عبر Canva Pro لمدة سنة كاملة'
    ]
  },
  {
    id: 'bundle-digital-merchant',
    code: '23940',
    name: 'باقة التاجر الرقمي',
    components: 'داتا أرقام + واتساب سندر (سنة) + Canva Pro (سنة)',
    componentsList: [
      'داتا أرقام مصرية (30-45 مليون رقم)',
      'برنامج واتساب سندر (سنة كاملة)',
      'Canva Pro (سنة كاملة)'
    ],
    originalPrice: 253.59,
    price: 450,
    savings: 100,
    badge: 'انطلاقة المبيعات',
    description: 'الحزمة التسويقية المتكاملة لمضاعفة مبيعات متجرك: استهدف العملاء بأحدث داتا مصرية، وأرسل حملاتك عبر واتساب سندر، وصمم إعلاناتك بـ Canva Pro.',
    features: [
      'قاعدة بيانات مصرية 30-45 مليون رقم مصنفة حسب النشاط والمهنة',
      'برنامج واتساب سندر لمدة سنة مع الشات بوت وتسخين الأرقام',
      'حساب كانفا برو لتصميم البنرات والمنشورات التسويقية',
      'دعم فني كامل لكيفية تشغيل الحملات'
    ]
  },
  {
    id: 'bundle-launch-project',
    code: '24140',
    name: 'ابدأ مشروعك',
    components: 'واتساب سندر (مدى الحياة) + داتا أرقام + Canva Pro (3 سنوات)',
    componentsList: [
      'واتساب سندر (مدى الحياة)',
      'داتا أرقام مصرية (30-45 مليون رقم)',
      'Canva Pro (3 سنوات كاملة)'
    ],
    originalPrice: 304.10,
    price: 550,
    savings: 120,
    badge: 'الاستثمار الدائم',
    description: 'الباقة الكبرى لأصحاب الشركات والوكالات: ترخيص مدى الحياة لبرنامج واتساب سندر، داتا الأرقام الشاملة، و3 سنوات من اشتراك كانفا برو.',
    features: [
      'واتساب سندر ترخيص دائم مدى الحياة بدون تجديد سنوي',
      'داتا العملاء 30-45 مليون رقم محدثة 2025-2026',
      'اشتراك كانفا برو لمدة 3 سنوات كاملة',
      'أعلى قيمة وأكبر توفير مالي متاح'
    ]
  },
  {
    id: 'bundle-freelancer-kit',
    code: '25339',
    name: 'عدة الفريلانسر',
    components: 'Office 365 + Adobe Express/Pro + Gemini Pro',
    componentsList: [
      'Microsoft Office 365 (سنة كاملة)',
      'Adobe Express/Pro (3 شهور تفعيل شخصي)',
      'Gemini Pro (18 شهر)'
    ],
    originalPrice: 255.75,
    price: 420,
    savings: 80,
    badge: 'عدة العمل الحر',
    description: 'العدة الأساسية للعمل الحر وإنجاز المهام الاحترافية بسرعة: برامج أوفيس، تصميم سريع وتعديل PDF عبر أدوبي، ومساعد Gemini الذكي.',
    features: [
      'برامج أوفيس الأصلية مع مساحة 1 تيرابايت OneDrive',
      'تعديل وتوقيع وتحويل ملفات PDF وتصميم سريع عبر Adobe Express',
      'مساعد Gemini المتقدم لتوليد المحتوى وصياغة المقترحات',
      'تفعيل سهل وسريع لحساباتك'
    ]
  }
];
