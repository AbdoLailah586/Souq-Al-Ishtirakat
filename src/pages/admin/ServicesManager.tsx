import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Service, ServiceVariant, CategoryId } from '../../types';
import { CATEGORIES } from '../../data/services';
import { effectivePrice, isOfferActive, isOfferExpired, discountPercent, hasAnyOffer } from '../../utils/pricing';
import {
  Plus, Pencil, Trash2, Save, X, Search, Copy, Eye, EyeOff,
  Sliders, Package, Tag, ListPlus, GripVertical, Percent, AlertTriangle
} from 'lucide-react';

const blankVariant = (): ServiceVariant => ({
  id: 'var-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
  code: '',
  duration: '',
  price: 0,
  originalPrice: undefined,
  isPopular: false
});

const blankService = (): Service => ({
  id: 'srv-' + Date.now(),
  name: '',
  englishName: '',
  category: 'ai',
  slug: 'service-' + Date.now(),
  iconName: 'Sparkles',
  badge: '',
  featured: false,
  isHidden: false,
  shortDescription: '',
  features: [''],
  note: '',
  executionNote: '',
  variants: [blankVariant()]
});

export const ServicesManager: React.FC = () => {
  const { services, saveService, updateService, deleteService } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CategoryId>('all');
  const [draft, setDraft] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services
      .filter(s => categoryFilter === 'all' || s.category === categoryFilter)
      .filter(
        s =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          (s.englishName || '').toLowerCase().includes(q) ||
          s.variants.some(v => v.code.includes(q))
      );
  }, [services, search, categoryFilter]);

  const openNew = () => { setDraft(blankService()); setIsNew(true); };
  const openEdit = (s: Service) => { setDraft(JSON.parse(JSON.stringify(s))); setIsNew(false); };

  const duplicateService = async (s: Service) => {
    const copy: Service = {
      ...JSON.parse(JSON.stringify(s)),
      id: 'srv-' + Date.now(),
      slug: s.slug + '-copy-' + Date.now(),
      name: s.name + ' (نسخة)',
      variants: s.variants.map((v, i) => ({ ...v, id: 'var-' + Date.now() + '-' + i }))
    };
    const res = await saveService(copy, true);
    if (!res.success) alert(res.message);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    if (!draft.name.trim()) { alert('اسم الخدمة مطلوب.'); return; }
    if (draft.variants.length === 0) { alert('أضف باقة/مدة واحدة على الأقل.'); return; }

    const cleaned: Service = {
      ...draft,
      name: draft.name.trim(),
      features: draft.features.map(f => f.trim()).filter(Boolean),
      variants: draft.variants.map(v => ({ ...v, price: Number(v.price) || 0 }))
    };

    setIsSaving(true);
    const res = await saveService(cleaned, isNew);
    setIsSaving(false);
    if (!res.success) { alert(res.message); return; }
    setDraft(null);
  };

  const handleDelete = async (s: Service) => {
    if (!window.confirm(`حذف خدمة «${s.name}» نهائياً من الموقع؟`)) return;
    const res = await deleteService(s.id);
    if (!res.success) alert(res.message);
  };

  const patch = (data: Partial<Service>) => setDraft(prev => (prev ? { ...prev, ...data } : prev));

  const patchVariant = (idx: number, data: Partial<ServiceVariant>) =>
    setDraft(prev =>
      prev ? { ...prev, variants: prev.variants.map((v, i) => (i === idx ? { ...v, ...data } : v)) } : prev
    );

  const field =
    'w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-2.5 text-xs text-white focus:outline-none transition-colors';

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-base font-bold font-cairo text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-bazaar-purple" />
            <span>إدارة الاشتراكات والخدمات ({services.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            تعديل كامل لأي خدمة: الاسم، الوصف، المميزات، الأكواد، المدد والأسعار — أو إضافة خدمات جديدة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الكود..."
              className="bg-bazaar-bg border border-white/10 rounded-xl py-2 pr-9 pl-3 text-xs text-white focus:outline-none focus:border-bazaar-gold w-52"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as 'all' | CategoryId)}
            className="bg-bazaar-bg border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
          >
            <option value="all">كل الأقسام</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={openNew}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-purple to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة خدمة جديدة</span>
          </button>
        </div>
      </div>

      {/* قائمة الخدمات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(service => {
          const cat = CATEGORIES.find(c => c.id === service.category);
          const minPrice = Math.min(...service.variants.map(v => effectivePrice(v)));
          return (
            <div
              key={service.id}
              className={`p-5 rounded-3xl bg-bazaar-card border space-y-3 ${
                service.isHidden ? 'border-white/5 opacity-60' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold font-cairo text-white truncate">{service.name}</h3>
                    {service.featured && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-bazaar-gold/15 text-bazaar-gold border border-bazaar-gold/30 font-bold">
                        مميزة
                      </span>
                    )}
                    {service.isHidden && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10 font-bold">
                        مخفية
                      </span>
                    )}
                    {hasAnyOffer(service.variants) && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                        عليها عرض
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{service.englishName}</span>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{service.shortDescription}</p>
                </div>
                <div className="text-left shrink-0">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                    style={{ color: cat?.color, borderColor: (cat?.color || '#fff') + '55', background: (cat?.color || '#fff') + '18' }}
                  >
                    {cat?.name}
                  </span>
                  <div className="text-sm font-black text-amber-300 font-cairo mt-1.5">
                    من {minPrice} ج.م
                  </div>
                  <div className="text-[10px] text-slate-500">{service.variants.length} باقة</div>
                </div>
              </div>

              {/* الباقات */}
              <div className="space-y-1.5 pt-2 border-t border-white/5 max-h-32 overflow-y-auto">
                {service.variants.map(v => (
                  <div key={v.id} className="flex items-center justify-between text-[11px] bg-bazaar-bg/70 rounded-xl px-3 py-1.5 gap-2">
                    <span className="text-slate-200 font-bold truncate">{v.duration}</span>
                    <span className="text-slate-500 font-mono shrink-0">{v.code}</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {isOfferActive(v) && (
                        <>
                          <span className="text-[10px] text-slate-500 line-through">{v.price}</span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            -{discountPercent(v)}%
                          </span>
                        </>
                      )}
                      <span className={`font-black ${isOfferActive(v) ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {effectivePrice(v)} ج.م
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => openEdit(service)}
                  className="px-3 py-1.5 rounded-xl bg-bazaar-gold/15 hover:bg-bazaar-gold/25 text-bazaar-gold border border-bazaar-gold/30 text-[11px] font-bold flex items-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>تعديل كامل</span>
                </button>
                <button
                  onClick={() => void updateService(service.id, { isHidden: !service.isHidden })}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-bold flex items-center gap-1"
                >
                  {service.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{service.isHidden ? 'إظهار' : 'إخفاء'}</span>
                </button>
                <button
                  onClick={() => void updateService(service.id, { featured: !service.featured })}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-bold flex items-center gap-1"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{service.featured ? 'إلغاء التمييز' : 'تمييز'}</span>
                </button>
                <button
                  onClick={() => void duplicateService(service)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ</span>
                </button>
                <button
                  onClick={() => void handleDelete(service)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 border border-rose-500/20 text-[11px] font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-3xl bg-bazaar-card/40 border border-white/5 text-slate-400 text-xs">
          لا توجد خدمات مطابقة.
        </div>
      )}

      {/* محرر الخدمة الكامل */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleSave} className="w-full max-w-3xl bg-bazaar-card rounded-3xl border border-bazaar-purple/50 shadow-2xl my-8">
            <div className="sticky top-0 bg-bazaar-card z-10 p-6 border-b border-white/10 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold font-cairo text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-bazaar-purple" />
                  <span>{isNew ? 'إضافة خدمة جديدة' : `تعديل: ${draft.name || 'خدمة'}`}</span>
                </h3>
                <p className="text-xs text-slate-400">كل الحقول قابلة للتعديل بالكامل.</p>
              </div>
              <button type="button" onClick={() => setDraft(null)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* البيانات الأساسية */}
              <section className="space-y-3">
                <h4 className="text-xs font-black text-bazaar-gold">① البيانات الأساسية</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">اسم الخدمة (عربي) *</label>
                    <input required value={draft.name} onChange={e => patch({ name: e.target.value })} className={field} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">الاسم بالإنجليزية</label>
                    <input value={draft.englishName || ''} onChange={e => patch({ englishName: e.target.value })} className={field} dir="ltr" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">القسم</label>
                    <select value={draft.category} onChange={e => patch({ category: e.target.value as CategoryId })} className={field}>
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">شارة الخدمة (مثال: الأكثر مبيعاً)</label>
                    <input value={draft.badge || ''} onChange={e => patch({ badge: e.target.value })} className={field} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">الوصف المختصر (يظهر في الكارت) *</label>
                  <textarea required rows={2} value={draft.shortDescription} onChange={e => patch({ shortDescription: e.target.value })} className={field} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!draft.featured} onChange={e => patch({ featured: e.target.checked })} className="w-4 h-4 rounded accent-bazaar-gold" />
                    <span className="text-slate-300 font-semibold">خدمة مميزة (تظهر في الصفحة الرئيسية)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!draft.isHidden} onChange={e => patch({ isHidden: e.target.checked })} className="w-4 h-4 rounded accent-rose-500" />
                    <span className="text-slate-300 font-semibold">إخفاء الخدمة من الموقع</span>
                  </label>
                </div>
              </section>

              {/* المميزات */}
              <section className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-bazaar-teal">② المميزات والمواصفات</h4>
                  <button
                    type="button"
                    onClick={() => patch({ features: [...draft.features, ''] })}
                    className="px-3 py-1.5 rounded-xl bg-bazaar-teal/15 text-bazaar-teal border border-bazaar-teal/30 text-[11px] font-bold flex items-center gap-1"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>إضافة ميزة</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {draft.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <GripVertical className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <input
                        value={f}
                        onChange={e => patch({ features: draft.features.map((x, j) => (j === i ? e.target.value : x)) })}
                        placeholder={`الميزة رقم ${i + 1}`}
                        className={field}
                      />
                      <button
                        type="button"
                        onClick={() => patch({ features: draft.features.filter((_, j) => j !== i) })}
                        className="p-2 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/20 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* الملاحظات */}
              <section className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-black text-amber-300">③ التنبيهات وطريقة التسليم</h4>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">تنبيه الضمان (يظهر بخلفية صفراء)</label>
                  <textarea rows={2} value={draft.note || ''} onChange={e => patch({ note: e.target.value })} className={field} />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">طريقة الاستلام والتنفيذ (يظهر بخلفية زرقاء)</label>
                  <textarea rows={2} value={draft.executionNote || ''} onChange={e => patch({ executionNote: e.target.value })} className={field} />
                </div>
              </section>

              {/* الباقات والأسعار */}
              <section className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-bazaar-gold">④ المدد والأسعار ({draft.variants.length})</h4>
                  <button
                    type="button"
                    onClick={() => patch({ variants: [...draft.variants, blankVariant()] })}
                    className="px-3 py-1.5 rounded-xl bg-bazaar-gold/15 text-bazaar-gold border border-bazaar-gold/30 text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مدة / باقة</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {draft.variants.map((v, i) => (
                    <div key={v.id} className="p-3.5 rounded-2xl bg-bazaar-bg/80 border border-white/5 space-y-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">المدة *</label>
                          <input required value={v.duration} onChange={e => patchVariant(i, { duration: e.target.value })} placeholder="شهر واحد" className={field} />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">الكود</label>
                          <input value={v.code} onChange={e => patchVariant(i, { code: e.target.value })} placeholder="10208" className={field} dir="ltr" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">السعر الأساسي (ج.م) *</label>
                          <input required type="number" step="any" min={0} value={v.price} onChange={e => patchVariant(i, { price: Number(e.target.value) })} className={`${field} text-amber-300 font-bold`} />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1" title="لا تظهر للعميل إطلاقاً">تكلفة المورد 🔒</label>
                          <input
                            type="number" step="any"
                            min={0}
                            value={v.originalPrice ?? ''}
                            onChange={e => patchVariant(i, { originalPrice: e.target.value === '' ? undefined : Number(e.target.value) })}
                            className={field}
                          />
                        </div>
                      </div>

                      {/* ===== قسم العرض / الخصم ===== */}
                      <div className={`p-3 rounded-2xl border space-y-2.5 ${
                        isOfferActive(v)
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-white/[0.02] border-white/5'
                      }`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5">
                            <Percent className="w-3.5 h-3.5" />
                            <span>عرض / خصم على هذه الباقة</span>
                          </span>

                          {v.offerPrice !== undefined && v.offerPrice !== null ? (
                            <button
                              type="button"
                              onClick={() => patchVariant(i, { offerPrice: undefined, offerLabel: '', offerEndsAt: '' })}
                              className="px-2.5 py-1 rounded-lg bg-rose-950/50 text-rose-300 border border-rose-500/20 text-[10px] font-bold"
                            >
                              إلغاء العرض
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => patchVariant(i, { offerPrice: Math.round(v.price * 0.8), offerLabel: 'عرض خاص' })}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold"
                            >
                              + تفعيل عرض
                            </button>
                          )}
                        </div>

                        {v.offerPrice !== undefined && v.offerPrice !== null && (
                          <>
                            {/* أزرار خصم سريعة */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] text-slate-400">خصم سريع:</span>
                              {[5, 10, 15, 20, 25, 30, 40, 50].map(pct => (
                                <button
                                  key={pct}
                                  type="button"
                                  onClick={() => patchVariant(i, { offerPrice: Math.round(v.price * (1 - pct / 100)) })}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                                    discountPercent(v) === pct
                                      ? 'bg-emerald-500 text-bazaar-bg'
                                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                  }`}
                                >
                                  {pct}%
                                </button>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">سعر العرض (ج.م)</label>
                                <input
                                  type="number" step="any"
                                  min={0}
                                  value={v.offerPrice}
                                  onChange={e => patchVariant(i, { offerPrice: Number(e.target.value) })}
                                  className={`${field} text-emerald-300 font-bold`}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">اسم العرض</label>
                                <input
                                  value={v.offerLabel || ''}
                                  onChange={e => patchVariant(i, { offerLabel: e.target.value })}
                                  placeholder="عرض رمضان"
                                  className={field}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">ينتهي في (اختياري)</label>
                                <input
                                  type="date"
                                  value={v.offerEndsAt || ''}
                                  onChange={e => patchVariant(i, { offerEndsAt: e.target.value })}
                                  className={field}
                                />
                              </div>
                            </div>

                            {/* معاينة ما يراه العميل */}
                            {isOfferActive(v) ? (
                              <div className="p-2.5 rounded-xl bg-bazaar-bg/80 border border-emerald-500/20 flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-[10px] text-slate-400">ما سيراه العميل:</span>
                                <span className="flex items-baseline gap-2">
                                  <span className="text-xs text-slate-500 line-through">{v.price} ج.م</span>
                                  <span className="text-sm font-black text-emerald-400">{effectivePrice(v)} ج.م</span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    خصم {discountPercent(v)}%
                                  </span>
                                </span>
                              </div>
                            ) : (
                              <p className="text-[10px] text-amber-300 flex items-center gap-1.5">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>
                                  {isOfferExpired(v)
                                    ? 'انتهت مدة هذا العرض — لن يظهر للعميل. غيّر تاريخ الانتهاء لإعادة تفعيله.'
                                    : 'سعر العرض يجب أن يكون أقل من السعر الأساسي حتى يظهر للعميل.'}
                                </span>
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                          <input type="checkbox" checked={!!v.isPopular} onChange={e => patchVariant(i, { isPopular: e.target.checked })} className="w-3.5 h-3.5 rounded accent-bazaar-gold" />
                          <span>الأكثر طلباً</span>
                        </label>

                        <input
                          value={v.note || ''}
                          onChange={e => patchVariant(i, { note: e.target.value })}
                          placeholder="ملاحظة على هذه الباقة (اختياري)"
                          className={`${field} flex-1`}
                        />

                        {draft.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => patch({ variants: draft.variants.filter((_, j) => j !== i) })}
                            className="p-2 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/20 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 bg-bazaar-surface p-5 border-t border-white/10 flex items-center justify-end gap-2 rounded-b-3xl">
              <button type="button" onClick={() => setDraft(null)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs hover:text-white">
                إلغاء
              </button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5 disabled:opacity-60">
                <Save className="w-4 h-4" />
                <span>{isNew ? 'إضافة الخدمة للموقع' : 'حفظ كل التعديلات'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
