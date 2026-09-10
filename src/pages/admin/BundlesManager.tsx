import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Bundle } from '../../types';
import { effectivePrice, isOfferActive, isOfferExpired, discountPercent } from '../../utils/pricing';
import { Gift, Plus, Pencil, Trash2, Save, X, Copy, Eye, EyeOff, ListPlus, Sparkles, Percent, AlertTriangle } from 'lucide-react';

const blankBundle = (): Bundle => ({
  id: 'bundle-' + Date.now(),
  code: '',
  name: '',
  components: '',
  componentsList: [''],
  originalPrice: 0,
  price: 0,
  savings: 0,
  badge: '',
  isHidden: false,
  description: '',
  features: ['']
});

export const BundlesManager: React.FC = () => {
  const { bundles, saveBundle, updateBundle, deleteBundle } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<Bundle | null>(null);
  const [isNew, setIsNew] = useState(false);

  const patch = (data: Partial<Bundle>) => setDraft(prev => (prev ? { ...prev, ...data } : prev));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    if (!draft.name.trim()) { alert('اسم العرض مطلوب.'); return; }

    const cleaned: Bundle = {
      ...draft,
      name: draft.name.trim(),
      price: Number(draft.price) || 0,
      originalPrice: Number(draft.originalPrice) || 0,
      savings: Number(draft.savings) || 0,
      offerPrice: draft.offerPrice === undefined || draft.offerPrice === null ? undefined : Number(draft.offerPrice),
      componentsList: draft.componentsList.map(c => c.trim()).filter(Boolean),
      features: draft.features.map(f => f.trim()).filter(Boolean),
      components: draft.components || draft.componentsList.filter(Boolean).join(' + ')
    };

    setIsSaving(true);
    const res = await saveBundle(cleaned, isNew);
    setIsSaving(false);
    if (!res.success) { alert(res.message); return; }
    setDraft(null);
  };

  const field =
    'w-full bg-bazaar-bg border border-white/10 focus:border-bazaar-gold rounded-xl p-2.5 text-xs text-white focus:outline-none transition-colors';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bazaar-card p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-base font-bold font-cairo text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-bazaar-gold" />
            <span>إدارة العروض والباقات ({bundles.length})</span>
          </h2>
          <p className="text-xs text-slate-400">أضف عروضاً جديدة أو عدّل محتويات وأسعار العروض الحالية بالكامل.</p>
        </div>

        <button
          onClick={() => { setDraft(blankBundle()); setIsNew(true); }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عرض جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {bundles.map(b => (
          <div
            key={b.id}
            className={`p-5 rounded-3xl bg-bazaar-card border space-y-3 ${
              b.isHidden ? 'border-white/5 opacity-60' : 'border-bazaar-gold/30'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold font-cairo text-white truncate">{b.name}</h3>
                  {b.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-bazaar-teal/15 text-bazaar-teal border border-bazaar-teal/30 font-bold">
                      {b.badge}
                    </span>
                  )}
                  {b.isHidden && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10 font-bold">
                      مخفي
                    </span>
                  )}
                  {isOfferActive(b) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                      عليه عرض
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">كود: {b.code}</span>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{b.description}</p>
              </div>
              <div className="text-left shrink-0">
                {isOfferActive(b) && (
                  <div className="text-[11px] text-slate-500 line-through">{b.price} ج.م</div>
                )}
                <div className={`text-lg font-black font-cairo ${isOfferActive(b) ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {effectivePrice(b)} ج.م
                </div>
                {isOfferActive(b) ? (
                  <div className="text-[10px] text-emerald-400 font-bold">خصم {discountPercent(b)}%</div>
                ) : (
                  <div className="text-[10px] text-slate-400 font-bold">وفر {b.savings} ج.م</div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1">
              {b.componentsList.map((c, i) => (
                <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-bazaar-gold shrink-0" />
                  <span className="truncate">{c}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => { setDraft(JSON.parse(JSON.stringify(b))); setIsNew(false); }}
                className="px-3 py-1.5 rounded-xl bg-bazaar-gold/15 hover:bg-bazaar-gold/25 text-bazaar-gold border border-bazaar-gold/30 text-[11px] font-bold flex items-center gap-1"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>تعديل</span>
              </button>
              <button
                onClick={() => void updateBundle(b.id, { isHidden: !b.isHidden })}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-bold flex items-center gap-1"
              >
                {b.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{b.isHidden ? 'إظهار' : 'إخفاء'}</span>
              </button>
              <button
                onClick={() => void saveBundle({
                  ...JSON.parse(JSON.stringify(b)),
                  id: 'bundle-' + Date.now(),
                  code: (b.code || '') + '-copy',
                  name: b.name + ' (نسخة)'
                }, true)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-bold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ</span>
              </button>
              <button
                onClick={() => { if (window.confirm(`حذف عرض «${b.name}» نهائياً؟`)) void deleteBundle(b.id); }}
                className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 border border-rose-500/20 text-[11px] font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* محرر العرض */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleSave} className="w-full max-w-2xl bg-bazaar-card rounded-3xl border border-bazaar-gold/50 shadow-2xl my-8">
            <div className="sticky top-0 bg-bazaar-card z-10 p-6 border-b border-white/10 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-lg font-bold font-cairo text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-bazaar-gold" />
                <span>{isNew ? 'إضافة عرض جديد' : `تعديل: ${draft.name || 'عرض'}`}</span>
              </h3>
              <button type="button" onClick={() => setDraft(null)} className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">اسم العرض *</label>
                  <input required value={draft.name} onChange={e => patch({ name: e.target.value })} className={field} />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">كود العرض</label>
                  <input value={draft.code} onChange={e => patch({ code: e.target.value })} className={field} dir="ltr" />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">شارة العرض</label>
                  <input value={draft.badge || ''} onChange={e => patch({ badge: e.target.value })} placeholder="باقة الذكاء الخارق" className={field} />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">قيمة التوفير المعلنة (ج.م)</label>
                  <input type="number" step="any" min={0} value={draft.savings} onChange={e => patch({ savings: Number(e.target.value) })} className={field} />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1" title="لا تظهر للعميل إطلاقاً">
                    تكلفة المورد 🔒
                  </label>
                  <input type="number" step="any" min={0} value={draft.originalPrice} onChange={e => patch({ originalPrice: Number(e.target.value) })} className={field} />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">السعر الأساسي (ج.م) *</label>
                  <input required type="number" step="any" min={0} value={draft.price} onChange={e => patch({ price: Number(e.target.value) })} className={`${field} text-amber-300 font-bold`} />
                </div>
              </div>

              {/* ===== قسم العرض / الخصم ===== */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isOfferActive(draft) ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-white/[0.02] border-white/5'
              }`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <Percent className="w-4 h-4" />
                    <span>عرض / خصم على هذه الباقة</span>
                  </span>
                  {draft.offerPrice !== undefined && draft.offerPrice !== null ? (
                    <button
                      type="button"
                      onClick={() => patch({ offerPrice: undefined, offerLabel: '', offerEndsAt: '' })}
                      className="px-3 py-1 rounded-lg bg-rose-950/50 text-rose-300 border border-rose-500/20 text-[11px] font-bold"
                    >
                      إلغاء العرض
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => patch({ offerPrice: Math.round(draft.price * 0.8), offerLabel: 'عرض خاص' })}
                      className="px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold"
                    >
                      + تفعيل عرض
                    </button>
                  )}
                </div>

                {draft.offerPrice !== undefined && draft.offerPrice !== null && (
                  <>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">خصم سريع:</span>
                      {[5, 10, 15, 20, 25, 30, 40, 50].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => patch({ offerPrice: Math.round(draft.price * (1 - pct / 100)) })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                            discountPercent(draft) === pct ? 'bg-emerald-500 text-bazaar-bg' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">سعر العرض (ج.م)</label>
                        <input
                          type="number" step="any"
                          min={0}
                          value={draft.offerPrice}
                          onChange={e => patch({ offerPrice: Number(e.target.value) })}
                          className={`${field} text-emerald-300 font-bold`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">اسم العرض</label>
                        <input
                          value={draft.offerLabel || ''}
                          onChange={e => patch({ offerLabel: e.target.value })}
                          placeholder="عرض رمضان"
                          className={field}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">ينتهي في (اختياري)</label>
                        <input
                          type="date"
                          value={draft.offerEndsAt || ''}
                          onChange={e => patch({ offerEndsAt: e.target.value })}
                          className={field}
                        />
                      </div>
                    </div>

                    {isOfferActive(draft) ? (
                      <div className="p-3 rounded-xl bg-bazaar-bg/80 border border-emerald-500/20 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] text-slate-400">ما سيراه العميل:</span>
                        <span className="flex items-baseline gap-2">
                          <span className="text-xs text-slate-500 line-through">{draft.price} ج.م</span>
                          <span className="text-base font-black text-emerald-400">{effectivePrice(draft)} ج.م</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            خصم {discountPercent(draft)}%
                          </span>
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isOfferExpired(draft)
                            ? 'انتهت مدة هذا العرض — لن يظهر للعميل.'
                            : 'سعر العرض يجب أن يكون أقل من السعر الأساسي حتى يظهر للعميل.'}
                        </span>
                      </p>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">وصف العرض *</label>
                <textarea required rows={3} value={draft.description} onChange={e => patch({ description: e.target.value })} className={field} />
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!draft.isHidden} onChange={e => patch({ isHidden: e.target.checked })} className="w-4 h-4 rounded accent-rose-500" />
                <span className="text-slate-300 font-semibold">إخفاء العرض من الموقع</span>
              </label>

              {/* المحتويات */}
              <section className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-bazaar-teal">محتويات الباقة</h4>
                  <button
                    type="button"
                    onClick={() => patch({ componentsList: [...draft.componentsList, ''] })}
                    className="px-3 py-1.5 rounded-xl bg-bazaar-teal/15 text-bazaar-teal border border-bazaar-teal/30 text-[11px] font-bold flex items-center gap-1"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>إضافة عنصر</span>
                  </button>
                </div>
                {draft.componentsList.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={c}
                      onChange={e => patch({ componentsList: draft.componentsList.map((x, j) => (j === i ? e.target.value : x)) })}
                      className={field}
                    />
                    <button
                      type="button"
                      onClick={() => patch({ componentsList: draft.componentsList.filter((_, j) => j !== i) })}
                      className="p-2 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/20 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </section>

              {/* المميزات */}
              <section className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-bazaar-gold">مميزات العرض</h4>
                  <button
                    type="button"
                    onClick={() => patch({ features: [...draft.features, ''] })}
                    className="px-3 py-1.5 rounded-xl bg-bazaar-gold/15 text-bazaar-gold border border-bazaar-gold/30 text-[11px] font-bold flex items-center gap-1"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>إضافة ميزة</span>
                  </button>
                </div>
                {draft.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={f}
                      onChange={e => patch({ features: draft.features.map((x, j) => (j === i ? e.target.value : x)) })}
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
              </section>
            </div>

            <div className="sticky bottom-0 bg-bazaar-surface p-5 border-t border-white/10 flex items-center justify-end gap-2 rounded-b-3xl">
              <button type="button" onClick={() => setDraft(null)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-black text-xs flex items-center gap-1.5 disabled:opacity-60">
                <Save className="w-4 h-4" />
                <span>{isNew ? 'إضافة العرض' : 'حفظ التعديلات'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
