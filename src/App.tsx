import React from 'react';
import { useAuth } from './context/AuthContext';
import { useStore } from './context/StoreContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ServiceModal } from './components/ServiceModal';
import { TopUpModal } from './components/TopUpModal';

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

export const App: React.FC = () => {
  const { isAuthenticated, isAdmin, needsProfileCompletion } = useAuth();
  const { currentTab } = useStore();

  // معاينة شاشة استكمال البيانات للمراجعة والاختبار
  if (typeof window !== 'undefined' && window.location.search.includes('preview_complete_profile')) {
    return <CompleteProfilePage />;
  }

  // 🔒 بوابة الحماية: لا يمكن رؤية أي صفحة في الموقع قبل تسجيل الدخول
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // 🛑 بوابة استكمال البيانات: إجبارية لأي مستخدم لم يكمل بياناته (مثل الدخول بجوجل) قبل دخول الموقع
  if (needsProfileCompletion) {
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

        {currentTab === 'dashboard' && <Overview />}
        {currentTab === 'dashboard-wallet' && <Wallet />}
        {currentTab === 'dashboard-orders' && <Orders />}
        {currentTab === 'dashboard-profile' && <Profile />}

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
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default App;
