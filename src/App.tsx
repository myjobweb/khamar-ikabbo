import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { WhyKhamariKabbo } from './components/WhyKhamariKabbo';
import { CombinationSection } from './components/CombinationSection';
import { FarmerGuideSection } from './components/FarmerGuideSection';
import { HowToOrder } from './components/HowToOrder';
import { TrustSection } from './components/TrustSection';
import { ContactCTA } from './components/ContactCTA';
import { Footer } from './components/Footer';

// Views & Modals
import { CategoryView } from './components/views/CategoryView';
import { ContactView } from './components/views/ContactView';
import { CartView } from './components/views/CartView';
import { CheckoutView } from './components/views/CheckoutView';
import { OrderSuccessView } from './components/views/OrderSuccessView';
import { TrackOrderView } from './components/views/TrackOrderView';
import { SearchView } from './components/views/SearchView';
import { NotFoundView } from './components/views/404View';
import { SEOManager } from './components/SEOManager';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { FeedCalculatorModal } from './components/FeedCalculatorModal';
import { GuideReaderModal } from './components/GuideReaderModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function App() {
  const { currentRoute, toasts, removeToast } = useApp();

  // Scroll to top and set SEO noindex for order routes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (currentRoute === 'order-success' || currentRoute === 'track-order') {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow');
    }
  }, [currentRoute]);

  // If currently in protected /admin route, render full-screen Admin Layout
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F7F4] text-[#2E3333] font-sans selection:bg-[#E8F5E9] selection:text-[#1B5E20]">
        <AdminLayout />

        {/* Global Toast Notifications */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold transition-all transform duration-300 animate-in slide-in-from-bottom-3 ${
                toast.type === 'error'
                  ? 'bg-red-50 text-red-900 border-red-300'
                  : toast.type === 'warning'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : toast.type === 'info'
                  ? 'bg-blue-50 text-blue-900 border-blue-200'
                  : 'bg-[#1B5E20] text-white border-[#124116]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                ) : toast.type === 'warning' ? (
                  <AlertCircle className="w-4 h-4 text-[#F57C00] shrink-0" />
                ) : toast.type === 'info' ? (
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Route resolver
  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <>
            <Hero />
            <CategorySection />
            <FeaturedProductsSection />
            <WhyKhamariKabbo />
            <CombinationSection />
            <FarmerGuideSection />
            <HowToOrder />
            <TrustSection />
            <ContactCTA />
          </>
        );

      case 'feed':
        return <CategoryView categorySlug="feed" />;
      case 'feed-motatajakaron':
        return <CategoryView categorySlug="feed" subcategorySlug="motatajakaron" />;
      case 'feed-shar':
        return <CategoryView categorySlug="feed" subcategorySlug="shar" />;
      case 'feed-gavi':
        return <CategoryView categorySlug="feed" subcategorySlug="gavi" />;
      case 'feed-dairy-special':
        return <CategoryView categorySlug="feed" subcategorySlug="dairy-special" />;

      case 'raw-materials':
        return <CategoryView categorySlug="raw-materials" />;

      case 'supplements':
        return <CategoryView categorySlug="supplements" />;

      case 'medicines':
        return <CategoryView categorySlug="medicines" />;

      case 'combinations':
        return <CategoryView categorySlug="combinations" />;

      case 'guides':
        return (
          <div className="py-6">
            <FarmerGuideSection />
            <WhyKhamariKabbo />
            <ContactCTA />
          </div>
        );

      case 'contact':
        return <ContactView />;

      case 'cart':
        return <CartView />;

      case 'checkout':
        return <CheckoutView />;

      case 'order-success':
        return <OrderSuccessView />;

      case 'track-order':
        return <TrackOrderView />;

      case 'search':
        return <SearchView />;

      default:
        return <NotFoundView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2E3333] font-sans flex flex-col selection:bg-[#E8F5E9] selection:text-[#1B5E20]">
      {/* Dynamic SEO Manager */}
      <SEOManager />

      {/* Sticky Header Navigation */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Global Overlays & Modals */}
      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <FeedCalculatorModal />
      <GuideReaderModal />
      <AdminDashboardModal />

      {/* Global Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold transition-all transform duration-300 animate-in slide-in-from-bottom-3 ${
              toast.type === 'error'
                ? 'bg-red-50 text-red-900 border-red-300'
                : toast.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : toast.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-[#1B5E20] text-white border-[#124116]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-[#F57C00] shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
