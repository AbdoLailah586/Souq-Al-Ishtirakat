import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/services';
import { Search, ShoppingCart, MapPin, Menu, ChevronDown, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const {
    settings, orders, transactions, navigate, openAuthModal, openTopUpModal,
    cartCount, searchQuery, setSearchQuery, submitSearch, setSelectedCategory, services,
    openProduct, cartToast, dismissCartToast, theme, toggleTheme
  } = useStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [draft, setDraft] = useState(searchQuery);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setDraft(searchQuery); }, [searchQuery]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const suggestions = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (q.length < 1) return [];
    return services.filter(s => !s.isHidden).filter(s =>
      s.name.toLowerCase().includes(q) || (s.englishName || '').toLowerCase().includes(q)
    ).slice(0, 8);
  }, [draft, services]);

  const adminTaskCount =
    orders.filter(o => o.status === 'pending' || o.status === 'processing').length +
    transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;

  const go = (tab: string, cat?: string) => {
    if (cat) setSelectedCategory(cat);
    navigate(tab);
    setMobileOpen(false);
    setAccountOpen(false);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(draft);
    submitSearch(draft);
    setSuggestOpen(false);
  };

  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <header className="sticky top-0 z-40">
      {settings.showBanner && settings.bannerText && (
        <div className="bg-[#37475A] text-white text-center text-xs py-1.5 px-3">{settings.bannerText}</div>
      )}

      <div className="bg-amazon-header text-white">
        <div className="flex items-center gap-2 px-2 sm:px-3 py-2">
          <button type="button" className="lg:hidden p-2 border border-transparent hover:border-white rounded-sm" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button type="button" onClick={() => go('home')} className="shrink-0 px-1.5 py-1 border border-transparent hover:border-white rounded-md flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt={settings.siteName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-amber-400/50 shadow-md transition-transform group-hover:scale-105"
            />
            <div className="leading-tight text-right">
              <div className="text-lg sm:text-xl font-black font-cairo tracking-tight">{settings.siteName}</div>
              <div className="text-[10px] text-slate-300 hidden sm:block">.eg</div>
            </div>
          </button>

          <button type="button" onClick={() => go('dashboard-profile')} className="hidden md:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm text-right">
            <MapPin className="w-4 h-4 text-slate-300" />
            <span className="leading-tight">
              <span className="block text-[11px] text-slate-300">التوصيل إلى</span>
              <span className="block text-xs font-bold">{user?.city || 'مصر'} — رقمي</span>
            </span>
          </button>

          <form onSubmit={onSearch} className="flex-1 relative min-w-0">
            <div className="flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-amazon-orange">
              <select
                className="hidden sm:block bg-[#e6e6e6] text-[#0F1111] text-xs px-2 border-l border-slate-300 max-w-[120px]"
                defaultValue="all"
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="all">الكل</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                value={draft}
                onChange={e => { setDraft(e.target.value); setSuggestOpen(true); }}
                onFocus={() => setSuggestOpen(true)}
                placeholder="ابحث في سوق الاشتراكات"
                className="flex-1 min-w-0 px-3 text-sm text-[#0F1111] outline-none"
              />
              <button type="submit" className="bg-amazon-search hover:bg-amazon-searchHover px-3 text-[#0F1111]">
                <Search className="w-5 h-5" />
              </button>
            </div>
            {suggestOpen && suggestions.length > 0 && (
              <ul className="absolute top-full right-0 left-0 bg-white text-[#0F1111] shadow-xl z-50 border border-slate-200">
                {suggestions.map(s => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="w-full text-right px-3 py-2 text-sm hover:bg-slate-100"
                      onClick={() => { setSuggestOpen(false); setDraft(s.name); openProduct(s); }}
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => user ? setAccountOpen(v => !v) : openAuthModal(undefined, 'login')}
              className="px-2 py-1 border border-transparent hover:border-white rounded-sm text-right leading-tight min-w-[90px]"
            >
              <span className="block text-[11px]">{user ? `مرحباً، ${firstName}` : 'مرحباً، سجّل الدخول'}</span>
              <span className="text-xs font-bold flex items-center gap-0.5">الحساب والقوائم <ChevronDown className="w-3 h-3" /></span>
            </button>
            {accountOpen && user && (
              <div className="absolute left-0 mt-1 w-64 bg-white text-[#0F1111] shadow-2xl border border-slate-200 z-50 p-3">
                <p className="text-sm font-bold mb-2">{user.name}</p>
                <button className="block w-full text-right py-1.5 text-sm amazon-link" onClick={() => go('dashboard')}>حسابك</button>
                <button className="block w-full text-right py-1.5 text-sm amazon-link" onClick={() => go('dashboard-orders')}>طلباتك</button>
                <button className="block w-full text-right py-1.5 text-sm amazon-link" onClick={() => go('dashboard-wallet')}>المحفظة والمدفوعات</button>
                <button className="block w-full text-right py-1.5 text-sm amazon-link" onClick={() => go('dashboard-profile')}>تسجيل الدخول والأمان</button>
                {isAdmin && (
                  <button className="block w-full text-right py-1.5 text-sm font-bold" onClick={() => go('admin')}>
                    لوحة الإدارة {adminTaskCount > 0 ? `(${adminTaskCount})` : ''}
                  </button>
                )}
                <hr className="my-2" />
                <button className="block w-full text-right py-1.5 text-sm" onClick={() => { logout(); setAccountOpen(false); }}>تسجيل الخروج</button>
              </div>
            )}
          </div>

          <button type="button" onClick={() => user ? go('dashboard-orders') : openAuthModal()} className="hidden sm:block px-2 py-1 border border-transparent hover:border-white rounded-sm text-right leading-tight">
            <span className="block text-[11px]">المرتجعات</span>
            <span className="text-xs font-bold">&amp; الطلبات</span>
          </button>

          <button type="button" onClick={() => go('cart')} className="relative flex items-end gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm">
            <span className="relative">
              <ShoppingCart className="w-8 h-8" />
              <span className="absolute -top-1 right-2 text-amazon-orange font-black text-sm">{cartCount}</span>
            </span>
            <span className="hidden sm:inline text-xs font-bold pb-1">السلة</span>
          </button>

          {/* Theme Mode Toggle (Dark / Light) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 border border-white/10 hover:border-white/40 bg-white/5 hover:bg-white/10 rounded-full text-slate-200 hover:text-white transition-all flex items-center justify-center relative group"
            aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            title={theme === 'dark' ? 'تفعيل الوضع النهاري (Light Mode)' : 'تفعيل الوضع الليلي (Dark Mode)'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-300 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-200 group-hover:text-amazon-yellow transition-transform group-hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>

      <nav className="bg-amazon-subnav text-white text-sm px-2 sm:px-3 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button type="button" onClick={() => go('services', 'all')} className="flex items-center gap-1 px-2 py-1 hover:outline hover:outline-1 whitespace-nowrap font-bold">
          <Menu className="w-4 h-4" /> الكل
        </button>
        {CATEGORIES.map(c => (
          <button key={c.id} type="button" onClick={() => go('services', c.id)} className="px-2 py-1 hover:outline hover:outline-1 whitespace-nowrap">
            {c.name}
          </button>
        ))}
        <button type="button" onClick={() => go('bundles')} className="px-2 py-1 hover:outline hover:outline-1 whitespace-nowrap text-amazon-yellow font-semibold">عروض اليوم</button>
        <button type="button" onClick={() => go('payment')} className="px-2 py-1 hover:outline hover:outline-1 whitespace-nowrap">إعادة شحن الرصيد</button>
        <button type="button" onClick={() => go('support')} className="px-2 py-1 hover:outline hover:outline-1 whitespace-nowrap">خدمة العملاء</button>
        <button type="button" onClick={() => go('warranty')} className="px-2 py-1 hover:outline hover:outline-1 whitespace-nowrap">الضمان</button>
        {user && !isAdmin && (
          <button type="button" onClick={openTopUpModal} className="px-2 py-1 hover:outline hover:outline-1 whitespace-nowrap">
            الرصيد: {user.balance.toLocaleString()} ج.م
          </button>
        )}
      </nav>

      {cartToast && (
        <div className="bg-[#067D62] text-white text-sm px-4 py-2 flex items-center justify-between">
          <span>{cartToast}</span>
          <div className="flex gap-3">
            <button type="button" className="underline" onClick={() => { dismissCartToast(); go('cart'); }}>الانتقال إلى السلة</button>
            <button type="button" onClick={dismissCartToast}><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-[#161538] text-[#0F1111] dark:text-slate-100 border-b border-slate-200 dark:border-white/10 shadow-lg p-3 space-y-1">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt={settings.siteName} className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-400/40" />
              <span className="font-bold text-sm font-cairo text-slate-900 dark:text-white">{settings.siteName}</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
            </button>
          </div>
          {CATEGORIES.map(c => (
            <button key={c.id} type="button" onClick={() => go('services', c.id)} className="block w-full text-right py-2 border-b border-slate-100 dark:border-white/5">{c.name}</button>
          ))}
          <button type="button" onClick={() => go('bundles')} className="block w-full text-right py-2">عروض اليوم</button>
          {!user && (
            <button type="button" onClick={() => { setMobileOpen(false); openAuthModal(); }} className="block w-full text-right py-2 font-bold text-amazon-linkHover">سجّل الدخول</button>
          )}
        </div>
      )}
    </header>
  );
};
