import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Smartphone,
  CreditCard,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

export const Wallet: React.FC = () => {
  const { user } = useAuth();
  const { transactions, openTopUpModal, settings } = useStore();
  const [filter, setFilter] = useState<'all' | 'deposit' | 'purchase'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const userTransactions = transactions.filter(tx => tx.userId === user?.id);
  const filtered = userTransactions.filter(tx => filter === 'all' || tx.type === filter);

  const totalDeposited = userTransactions
    .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSpent = userTransactions
    .filter(tx => tx.type === 'purchase')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-cairo text-white">
            محفظتي والمعاملات المالية
          </h1>
          <p className="text-xs text-slate-400">
            إدارة رصيد الحساب، شحن المحفظة، وتتبع سجل العمليات المالية.
          </p>
        </div>

        <button
          onClick={openTopUpModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-bazaar-gold via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-black text-xs sm:text-sm shadow-xl shadow-bazaar-gold/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>شحن رصيد المحفظة الآن</span>
        </button>
      </div>

      {/* Balance & Quick Accounts Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-bazaar-card via-bazaar-surface to-bazaar-card border-2 border-bazaar-gold/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">الرصيد المتاح حالياً</span>
            <div className="w-8 h-8 rounded-xl bg-bazaar-gold/20 text-bazaar-gold flex items-center justify-center">
              <WalletIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-300 font-cairo">
            {(user?.balance || 0).toLocaleString()} <span className="text-xs text-slate-300 font-normal">ج.م</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
            <span className="text-slate-400">إجمالي المشحون: <strong className="text-emerald-400">{totalDeposited} ج.م</strong></span>
            <span className="text-slate-400">المصروف: <strong className="text-rose-400">{totalSpent} ج.م</strong></span>
          </div>
        </div>

        {/* Instapay Quick Copy */}
        <div className="p-5 rounded-3xl bg-bazaar-card border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>⚡</span>
              <span>انستاباي (Instapay)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">بدون رسوم</span>
          </div>
          <div className="bg-bazaar-bg/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <span className="font-mono text-amber-300 font-bold select-all truncate max-w-[170px]" dir="ltr">
              {settings.instapayHandle}
            </span>
            <button
              onClick={() => handleCopy(settings.instapayHandle, 'w-insta')}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
              title="نسخ"
            >
              {copiedKey === 'w-insta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            الاسم: <span className="text-white">{settings.instapayName}</span>
          </p>
        </div>

        {/* Vodafone Cash Quick Copy */}
        <div className="p-5 rounded-3xl bg-bazaar-card border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-bazaar-teal" />
              <span>فودافون كاش ومحافظ المحمول</span>
            </span>
            <span className="text-[10px] text-bazaar-teal font-bold">متاح 24/7</span>
          </div>
          <div className="bg-bazaar-bg/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <span className="font-mono text-bazaar-teal font-bold select-all" dir="ltr">
              {settings.vodafoneCashNumber}
            </span>
            <button
              onClick={() => handleCopy(settings.vodafoneCashNumber, 'w-cash')}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
              title="نسخ"
            >
              {copiedKey === 'w-cash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            تحويل مباشر من محفظتك بدون خصم رسوم
          </p>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="bg-bazaar-card/90 rounded-3xl border border-white/10 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold font-cairo text-white">
            سجل العمليات المالية
          </h2>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-bazaar-bg/80 p-1 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'all' ? 'bg-bazaar-gold text-bazaar-bg' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({userTransactions.length})
            </button>
            <button
              onClick={() => setFilter('deposit')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'deposit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              عمليات الشحن
            </button>
            <button
              onClick={() => setFilter('purchase')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'purchase' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              المشتريات
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filtered.map(tx => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'deposit' 
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{tx.description}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(tx.createdAt).toLocaleString('ar-EG')} 
                      {tx.senderPhone && ` • من رقم: ${tx.senderPhone}`}
                      {tx.method && ` • عبر: ${tx.method === 'instapay' ? 'Instapay' : tx.method === 'vodafone_cash' ? 'كاش' : 'المحفظة'}`}
                    </p>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className={`text-sm sm:text-base font-black font-cairo ${
                    tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} ج.م
                  </div>
                  <div className="mt-0.5">
                    {tx.status === 'completed' && (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        مكتملة ✓
                      </span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                        قيد المراجعة ⏳
                      </span>
                    )}
                    {tx.status === 'rejected' && (
                      <span className="text-[10px] text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30">
                        مرفوضة ✕
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا توجد معاملات مسجلة في هذا القسم.
          </div>
        )}
      </div>
    </div>
  );
};
