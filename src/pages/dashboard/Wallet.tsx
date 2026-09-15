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
  Copy,
  Check,
  CreditCard,
  MessageCircle
} from 'lucide-react';

export const Wallet: React.FC = () => {
  const { user } = useAuth();
  const { transactions, openTopUpModal, settings, navigate } = useStore();
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
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-amazon-muted flex items-center gap-1.5">
        <button onClick={() => navigate('home')} className="amazon-link">الرئيسية</button>
        <span>›</span>
        <button onClick={() => navigate('dashboard')} className="amazon-link">لوحة التحكم</button>
        <span>›</span>
        <span className="text-[#0F1111] font-semibold">المحفظة والمدفوعات</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <h1 className="text-2xl font-bold font-cairo text-[#0F1111]">
            محفظتي والمعاملات المالية
          </h1>
          <p className="text-xs text-amazon-muted">
            إدارة رصيد الحساب، شحن المحفظة، وتتبع سجل العمليات والتحويلات المالية.
          </p>
        </div>

        <button
          onClick={openTopUpModal}
          className="px-6 py-2.5 rounded-full btn-buy font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>شحن رصيد المحفظة الآن</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2 text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amazon-muted">الرصيد المتاح الحالي</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amazon-orange flex items-center justify-center">
              <WalletIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold amazon-price font-cairo">
            {(user?.balance || 0).toLocaleString()} <span className="text-xs text-amazon-muted font-normal">ج.م</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">جاهز للشراء الفوري</p>
        </div>

        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2 text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amazon-muted">إجمالي المبالغ المشحونة</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-cairo">
            {totalDeposited.toLocaleString()} <span className="text-xs text-amazon-muted font-normal">ج.م</span>
          </div>
          <p className="text-[11px] text-amazon-muted">شحنات معتمدة بنجاح</p>
        </div>

        <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2 text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amazon-muted">إجمالي المشتريات المنفذة</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0F1111] font-cairo">
            {totalSpent.toLocaleString()} <span className="text-xs text-amazon-muted font-normal">ج.م</span>
          </div>
          <p className="text-[11px] text-amazon-muted">قيمة الاشتراكات المشتراة</p>
        </div>
      </div>

      {/* Quick Deposit Numbers Banner */}
      <div className="p-5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold font-cairo text-[#0F1111]">
          عناوين التحويل المعتمدة للشحن الفوري
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amazon-muted block">عنوان Instapay اللحظي:</span>
              <span className="font-mono text-xs font-bold text-[#0F1111] select-all" dir="ltr">
                {settings.instapayHandle}
              </span>
            </div>
            <button
              onClick={() => handleCopy(settings.instapayHandle, 'insta')}
              className="p-1.5 rounded bg-white hover:bg-slate-100 text-[#0F1111] border border-slate-300 shrink-0 font-semibold text-xs flex items-center gap-1"
            >
              {copiedKey === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'insta' ? 'تم' : 'نسخ'}</span>
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amazon-muted block">رقم فودافون كاش:</span>
              <span className="font-mono text-xs font-bold text-[#0F1111] select-all" dir="ltr">
                {settings.vodafoneCashNumber}
              </span>
            </div>
            <button
              onClick={() => handleCopy(settings.vodafoneCashNumber, 'voda')}
              className="p-1.5 rounded bg-white hover:bg-slate-100 text-[#0F1111] border border-slate-300 shrink-0 font-semibold text-xs flex items-center gap-1"
            >
              {copiedKey === 'voda' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'voda' ? 'تم' : 'نسخ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white p-5 sm:p-6 border border-slate-200 shadow-sm rounded-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold font-cairo text-[#0F1111]">
            سجل العمليات المالية
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-sm font-semibold transition-all ${
                filter === 'all' ? 'bg-[#131921] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F1111]'
              }`}
            >
              الكل ({userTransactions.length})
            </button>
            <button
              onClick={() => setFilter('deposit')}
              className={`px-3 py-1 rounded-sm font-semibold transition-all ${
                filter === 'deposit' ? 'bg-[#131921] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F1111]'
              }`}
            >
              شحن المحفظة
            </button>
            <button
              onClick={() => setFilter('purchase')}
              className={`px-3 py-1 rounded-sm font-semibold transition-all ${
                filter === 'purchase' ? 'bg-[#131921] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F1111]'
              }`}
            >
              مشتريات
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map(tx => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'deposit'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {tx.type === 'deposit' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F1111]">
                      {tx.description || (tx.type === 'deposit' ? 'شحن رصيد المحفظة' : 'شراء اشتراك')}
                    </h4>
                    <span className="text-[11px] text-amazon-muted">
                      {new Date(tx.createdAt).toLocaleDateString('ar-EG')} • {tx.method}
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <span
                    className={`text-sm sm:text-base font-bold font-cairo block ${
                      tx.type === 'deposit' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()} ج.م
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-sm ${
                      tx.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : tx.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {tx.status === 'completed' ? 'مكتملة' : tx.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-amazon-muted space-y-2">
            <p>لا توجد أي معاملات مسجلة في هذا التبويب.</p>
          </div>
        )}
      </div>
    </div>
  );
};
