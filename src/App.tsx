/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FleetProvider } from './context/FleetContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CarCatalog } from './components/CarCatalog';
import { WhyUs } from './components/WhyUs';
import { CoverageArea } from './components/CoverageArea';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { SEOHead } from './components/common/SEOHead';

// Lazy load AdminPortal so regular customers do not download the 100KB+ admin bundle
const AdminPortal = React.lazy(() =>
  import('./components/Admin/AdminPortal').then((m) => ({ default: m.AdminPortal }))
);

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStandaloneAdmin, setIsStandaloneAdmin] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path === '/admin/' || path === '/cms' || hash === '#/admin';
  });

  // Secret entry points for authorized admin:
  // 1. Direct path /admin (Standalone tab/page)
  // 2. URL hash: #admin or #cms (Quick modal)
  // 3. Keyboard shortcut: Ctrl + Shift + A or Cmd + Shift + A (Opens new tab to /admin)
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const hasResetToken = params.has('reset_token');

      const isPathAdmin = path === '/admin' || path === '/admin/' || path === '/cms' || hash === '#/admin';
      setIsStandaloneAdmin(isPathAdmin);

      if (isPathAdmin || hash === '#admin' || hash === '#cms' || hasResetToken) {
        setIsAdminOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+A or Cmd+Shift+A -> Open Admin in new tab!
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const adminUrl = window.location.origin + '/admin';
        window.open(adminUrl, '_blank');
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <FleetProvider>
          {/* Dynamic SEO, Canonical & Multilingual Alternate Hreflang Injector */}
          <SEOHead />

          {isStandaloneAdmin ? (
            /* Standalone Admin Tab Page Mode (Dedicated Page) */
            <React.Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37]">Memuat Admin Portal...</div>}>
              <AdminPortal
                isOpen={true}
                isStandalone={true}
                onClose={() => {
                  window.location.href = window.location.origin + '/';
                }}
              />
            </React.Suspense>
          ) : (
            /* Standard Customer-Facing Website Mode */
            <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col selection:bg-[#D4AF37] selection:text-black transition-colors duration-300">
              {/* 1-Row 3-Zone Clean Header with zero admin buttons visible to the public */}
              <Header />

              {/* Main Content Flow: Proposition -> Catalog -> Coverage -> Proof -> FAQ */}
              <main className="flex-1">
                <Hero />
                <CarCatalog />
                <CoverageArea />
                <WhyUs />
                <FAQSection />
              </main>

              {/* Clean Professional Public Footer (Zero Admin Links) */}
              <div className="pb-16 md:pb-0">
                <Footer />
              </div>

              {/* Sticky Floating WhatsApp CTA Button */}
              <FloatingWhatsApp />

              {/* Modern Mobile Bottom Navigation Bar */}
              <MobileBottomBar />

              {/* Quick Admin CMS Portal (Popup Modal / Secret Shortcut) */}
              {isAdminOpen && (
                <React.Suspense fallback={null}>
                  <AdminPortal
                    isOpen={isAdminOpen}
                    isStandalone={false}
                    onClose={() => {
                      setIsAdminOpen(false);
                      if (window.location.hash === '#admin' || window.location.hash === '#cms') {
                        history.replaceState(null, '', ' ');
                      }
                    }}
                  />
                </React.Suspense>
              )}
            </div>
          )}
        </FleetProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
