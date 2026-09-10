import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import {
  Sparkles, Wallet, Plus, User, ShoppingBag, Menu, X,
  Layers, Sliders, ChevronDown, LogOut, UserCog
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { openTopUpModal, settings, orders, transactions, currentTab, navigate } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminTaskCount =
    orders.filter(o => o.status === 'pending' || o.status === 'processing').length +
    transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'services', label: 'جميع الخدمات' },
    { id: 'bundles', label: 'العروض والباقات' },
    { id: 'payment', label: 'طرق الدفع والشحن' },
    { id: 'warranty', label: 'الضمان والشروط' },
    { id: 'support', label: 'الدعم الفني' }
  ];

  const handleNavClick = (tabId: string) => {
    navigate(tabId);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('هل تريد تسجيل الخروج من حسابك؟')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-bazaar-bg/90 backdrop-blur-md border-b border-bazaar-border shadow-xl">
      {settings.showBanner && settings.bannerText && (
        <div className="bg-gradient-to-r from-bazaar-purple/30 via-bazaar-gold/20 to-bazaar-teal/30 border-b border-bazaar-border py-1.5 px-4 text-center text-xs sm:text-sm font-medium text-amber-200 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-bazaar-gold" />
          <span>{settings.bannerText}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* الشعار */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-bazaar-card to-bazaar-surface border border-bazaar-gold/40 flex items-center justify-center shadow-glow-gold transition-all duration-300 group-hover:scale-105 group-hover:border-bazaar-gold">
            <span className="text-2xl">🏮</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-cairo tracking-tight gold-gradient-text">
                {settings.siteName}
              </span>
              {isAdmin && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-bazaar-gold/15 text-bazaar-gold font-bold border border-bazaar-gold/30">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block">{settings.siteTagline}</p>
          </div>
        </div>

        {/* روابط سطح المكتب */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentTab === link.id
                  ? 'bg-bazaar-card text-bazaar-gold shadow-sm border border-bazaar-gold/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* زر لوحة الإدارة (للأدمن فقط) */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentTab === 'admin'
                  ? 'bg-bazaar-gold text-bazaar-bg border-bazaar-gold'
                  : 'bg-bazaar-card text-bazaar-gold border-bazaar-gold/30 hover:bg-bazaar-gold/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
              {adminTaskCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-bazaar-pink text-white text-[10px] flex items-center justify-center">
                  {adminTaskCount}
                </span>
              )}
            </button>
          )}

          {/* المحفظة (للعملاء) */}
          {user && !isAdmin && (
            <div className="flex items-center bg-bazaar-card border border-bazaar-border hover:border-bazaar-gold/40 rounded-xl p-1 sm:px-3 sm:py-1.5 transition-all shadow-inner">
              <div
                onClick={() => handleNavClick('dashboard-wallet')}
                className="flex items-center gap-2 cursor-pointer pl-2 select-none"
                title="اضغط لفتح المحفظة"
              >
                <div className="w-7 h-7 rounded-lg bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] text-slate-400 leading-none">رصيد المحفظة</div>
                  <div className="text-xs sm:text-sm font-black text-amber-300 leading-tight">
                    {user.balance.toLocaleString()} <span className="text-[10px] font-normal text-slate-300">ج.م</span>
                  </div>
                </div>
              </div>
              <button
                onClick={openTopUpModal}
                className="bg-gradient-to-r from-bazaar-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-bazaar-bg font-bold px-2 sm:px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-transform active:scale-95 shadow-sm"
                title="شحن الرصيد الآن"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">شحن</span>
              </button>
            </div>
          )}

          {/* قائمة الحساب */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 bg-bazaar-card hover:bg-bazaar-cardHover border border-bazaar-border rounded-xl px-2.5 py-1.5 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bazaar-purple/30 to-bazaar-teal/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                {user ? user.name.slice(0, 1) : <User className="w-4 h-4" />}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[90px] truncate">
                {user?.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-bazaar-card border border-bazaar-border shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-bazaar-border/60">
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate" dir="ltr">{user?.email}</p>
                  <span
                    className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isAdmin ? 'bg-bazaar-gold/20 text-bazaar-gold' : 'bg-bazaar-teal/20 text-bazaar-teal'
                    }`}
                  >
                    {isAdmin ? 'مدير المتجر (Admin)' : 'عميل'}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full text-right px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>لوحة التحكم الرئيسية</span>
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleNavClick('dashboard-orders')}
                    className="w-full text-right px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>طلباتي وحساباتي المسلمة</span>
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleNavClick('dashboard-wallet')}
                    className="w-full text-right px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>محفظتي وحركات الشحن</span>
                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleNavClick('dashboard-profile')}
                    className="w-full text-right px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>بياناتي وكلمة المرور</span>
                    <UserCog className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {isAdmin && (
                  <div className="pt-1 border-t border-bazaar-border/60">
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-right px-3 py-2 rounded-lg text-xs text-bazaar-gold font-bold hover:bg-bazaar-gold/10 flex items-center justify-between"
                    >
                      <span>لوحة تحكم الإدارة الكاملة</span>
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="pt-1 border-t border-bazaar-border/60">
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-3 py-2 rounded-lg text-xs text-rose-300 font-bold hover:bg-rose-950/40 flex items-center justify-between"
                  >
                    <span>تسجيل الخروج</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-bazaar-card border border-bazaar-border text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-bazaar-bg/98 border-b border-bazaar-border px-4 pt-2 pb-6 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium ${
                currentTab === link.id
                  ? 'bg-bazaar-card text-bazaar-gold font-bold border border-bazaar-gold/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold text-bazaar-gold bg-bazaar-gold/10 border border-bazaar-gold/30"
            >
              ⚙️ لوحة الإدارة (Admin Panel)
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold text-rose-300 bg-rose-950/30 border border-rose-500/20 mt-2"
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </header>
  );
};
