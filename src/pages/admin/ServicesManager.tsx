import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Service } from '../../types';
import { Sliders, Save, Check, Tag, Clock, RotateCcw } from 'lucide-react';

export const ServicesManager: React.FC = () => {
  const { services, updateServiceVariantPrice } = useStore();
  const [editingPrice, setEditingPrice] = useState<{ [key: string]: number }>({});
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const handlePriceChange = (serviceId: string, variantId: string, val: number) => {
    setEditingPrice(prev => ({
      ...prev,
      [`${serviceId}-${variantId}`]: val
    }));
  };

  const handleSavePrice = (serviceId: string, variantId: string) => {
    const key = `${serviceId}-${variantId}`;
    const newPrice = editingPrice[key];
    if (newPrice !== undefined && newPrice > 0) {
      updateServiceVariantPrice(serviceId, variantId, newPrice);
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-bazaar-card p-4 rounded-3xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-cairo text-white">
            قائمة الخدمات وتعديل الأسعار ({services.length} خدمة)
          </h2>
          <p className="text-xs text-slate-400">
            يمكنك تعديل سعر البيع النهائي لأي مدة أو باقة، وسيتم تحديث السعر في الموقع فوراً.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service.id} className="p-5 rounded-3xl bg-bazaar-card border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-cairo text-white">{service.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{service.englishName}</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-bazaar-gold/15 text-bazaar-gold font-bold">
                {service.variants.length} باقات
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              {service.variants.map(variant => {
                const key = `${service.id}-${variant.id}`;
                const currentEditVal = editingPrice[key] !== undefined ? editingPrice[key] : variant.price;
                const isSaved = savedKey === key;

                return (
                  <div key={variant.id} className="p-3 rounded-2xl bg-bazaar-bg/80 border border-white/5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-bazaar-teal" />
                        <span>{variant.duration}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        كود: <strong className="text-amber-300">{variant.code}</strong>
                        {variant.originalPrice && ` • تكلفة المورد: ${variant.originalPrice} ج.م`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          value={currentEditVal}
                          onChange={e => handlePriceChange(service.id, variant.id, Number(e.target.value))}
                          className="w-24 bg-bazaar-card border border-white/10 focus:border-bazaar-gold rounded-xl px-2.5 py-1.5 text-center font-bold text-white focus:outline-none text-xs"
                        />
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                          ج.م
                        </span>
                      </div>

                      <button
                        onClick={() => handleSavePrice(service.id, variant.id)}
                        className={`p-2 rounded-xl transition-all ${
                          isSaved 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-white/5 hover:bg-bazaar-gold hover:text-bazaar-bg text-slate-300'
                        }`}
                        title="حفظ السعر"
                      >
                        {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
