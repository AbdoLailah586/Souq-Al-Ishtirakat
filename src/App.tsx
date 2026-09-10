import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ServiceModal } from './components/ServiceModal';
import { TopUpModal } from './components/TopUpModal';

// Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Bundles } from './pages/Bundles';
import { PaymentGuide } from './pages/PaymentGuide';
import { AboutWarranty } from './pages/AboutWarranty';
import { Support } from './pages/Support';

// Dashboard & Admin Pages
import { Overview } from './pages/dashboard/Overview';
import { Wallet } from './pages/dashboard/Wallet';
import { Orders } from './pages/dashboard/Orders';
import { AdminDashboard } from './pages/admin/Dashboard';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="min-h-screen flex flex-col bg-bazaar-bg text-slate-100 selection:bg-bazaar-gold selection:text-bazaar-bg">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home setCurrentTab={setCurrentTab} setSelectedCategory={setSelectedCategory} />
        )}

        {currentTab === 'services' && (
          <Services 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
        )}

        {currentTab === 'bundles' && <Bundles />}

        {currentTab === 'payment' && <PaymentGuide />}

        {currentTab === 'warranty' && <AboutWarranty />}

        {currentTab === 'support' && <Support />}

        {currentTab === 'dashboard' && <Overview setCurrentTab={setCurrentTab} />}

        {currentTab === 'dashboard-wallet' && <Wallet />}

        {currentTab === 'dashboard-orders' && <Orders />}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Floating Tools */}
      <ServiceModal />
      <TopUpModal />
      <WhatsAppButton />

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default App;
