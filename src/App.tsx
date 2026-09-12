import React from 'react';
import { useAuth } from './context/AuthContext';
import { useStore } from './context/StoreContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ServiceModal } from './components/ServiceModal';
import { TopUpModal } from './components/TopUpModal';
import { AuthModal } from './components/AuthModal';

// الصفحات العامة
import { AuthPage } from './pages/Auth';
import { CompleteProfilePage } from './pages/CompleteProfile';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Bundles } from './pages/Bundles';
import { PaymentGuide } from './pages/PaymentGuide';
import { AboutWarranty } from './pages/AboutWarranty';
import { Support } from './pages/Support';

// لوحات التحكم
import { Overview } from './pages/dashboard/Overview';
import { Wallet } from './pages/dashboard/Wallet';
import { Orders } from './pages/dashboard/Orders';
import { Profile } from './pages/dashboard/Profile';
import { AdminDashboard } from './pages/admin/Dashboard';
import { LogIn } from 'lucide-react';

const RequireAuthPrompt: React.FC<{ title: string }> = ({ title }) => {
  const { openAuthModal, navigate } = useStore();
  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-bazaar-card border border-bazaar-gold/30 text-center space-y-4 shadow-2xl">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-bazaar-gold/15 text-bazaar-gold flex items-center justify-center text-3xl">
        🔒
      </div>
      <h2 className="text-xl font-black font-cairo text-white">تسجيل الدخول مطلوب</h2>
      <p className="text-xs text-slate-300 leading-relaxed">
        للوصول إلى {title} ومتابعة حسابك وطلباتك، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
        <button
          onClick={() => openAuthModal(`يرجى تسجيل الدخول للوصول إلى ${title}.`)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-bazaar-gold to-amber-500 text-bazaar-bg font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>تسجيل الدخول الآن</span>
        </button>
        <button
          onClick={() => navigate('home')}
          className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const { isAuthenticated, isAdmin, needsProfileCompletion } = useAuth();
  const { currentTab } = useStore();

  // معاينة شاشة استكمال البيانات للمراجعة والاختبار
  if (typeof window !== 'undefined' && window.location.search.includes('preview_complete_profile')) {
    return <CompleteProfilePage />;
  }

  // 🛑 بوابة استكمال البيانات: إجبارية لأي مستخدم سجل دخوله بالفعل ولم يكمل بياناته
  if (isAuthenticated && needsProfileCompletion) {
    return <CompleteProfilePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bazaar-bg text-slate-100 selection:bg-bazaar-gold selection:text-bazaar-bg">
      <Navbar />

      <main className="flex-1">
        {currentTab === 'home' && <Home />}
        {currentTab === 'services' && <Services />}
        {currentTab === 'bundles' && <Bundles />}
        {currentTab === 'payment' && <PaymentGuide />}
        {currentTab === 'warranty' && <AboutWarranty />}
        {currentTab === 'support' && <Support />}
        {currentTab === 'auth' && <AuthPage />}

        {currentTab === 'dashboard' && (isAuthenticated ? <Overview /> : <RequireAuthPrompt title="لوحة التحكم الرئيسية" />)}
        {currentTab === 'dashboard-wallet' && (isAuthenticated ? <Wallet /> : <RequireAuthPrompt title="محفظتي وحركات الشحن" />)}
        {currentTab === 'dashboard-orders' && (isAuthenticated ? <Orders /> : <RequireAuthPrompt title="طلباتي وحساباتي" />)}
        {currentTab === 'dashboard-profile' && (isAuthenticated ? <Profile /> : <RequireAuthPrompt title="الملف الشخصي" />)}

        {/* لوحة الإدارة محمية: تظهر فقط لحساب الأدمن */}
        {currentTab === 'admin' &&
          (isAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-bazaar-card border border-rose-500/30 text-center space-y-2">
              <div className="text-4xl">🔒</div>
              <h2 className="text-lg font-black font-cairo text-white">صفحة محظورة</h2>
              <p className="text-xs text-slate-400">
                هذه الصفحة مخصّصة لإدارة المتجر فقط ولا يمكن الوصول إليها بحساب عميل.
              </p>
            </div>
          ))}
      </main>

      <ServiceModal />
      <TopUpModal />
      <AuthModal />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default App;
