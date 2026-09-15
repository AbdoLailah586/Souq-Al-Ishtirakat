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
import { ProductPage } from './pages/Product';
import { CartPage } from './pages/Cart';
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
    <div className="max-w-md mx-auto my-16 p-8 rounded-sm bg-white border border-slate-200 text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amazon-orange flex items-center justify-center text-3xl">
        🔒
      </div>
      <h2 className="text-xl font-bold font-cairo text-[#0F1111]">تسجيل الدخول مطلوب</h2>
      <p className="text-xs text-amazon-muted leading-relaxed">
        للوصول إلى {title} ومتابعة حسابك وطلباتك، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
        <button
          onClick={() => openAuthModal(`يرجى تسجيل الدخول للوصول إلى ${title}.`)}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full btn-buy font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>تسجيل الدخول الآن</span>
        </button>
        <button
          onClick={() => navigate('home')}
          className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F1111] text-xs font-semibold"
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
    <div className="min-h-screen flex flex-col bg-amazon-bg text-[#0F1111] font-cairo antialiased selection:bg-amazon-orange selection:text-white">
      <Navbar />

      <main className="flex-1">
        {currentTab === 'home' && <Home />}
        {currentTab === 'services' && <Services />}
        {currentTab === 'bundles' && <Bundles />}
        {currentTab === 'product' && <ProductPage />}
        {currentTab === 'cart' && <CartPage />}
        {currentTab === 'checkout' && <CartPage isCheckout />}
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
            <div className="max-w-xl mx-auto my-20 p-8 rounded-sm bg-white border border-rose-200 text-center space-y-2 shadow-sm">
              <div className="text-4xl">🔒</div>
              <h2 className="text-lg font-bold font-cairo text-[#0F1111]">صفحة محظورة</h2>
              <p className="text-xs text-amazon-muted">
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
