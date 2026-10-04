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
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPortal } from './components/Admin/AdminPortal';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret entry points for authorized admin only (completely invisible to public visitors):
  // 1. URL hash: #admin or #cms (e.g. yourwebsite.com/#admin)
  // 2. Keyboard shortcut: Ctrl + Shift + A or Cmd + Shift + A
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const hasResetToken = params.has('reset_token');
      if (hash === '#admin' || hash === '#cms' || hasResetToken) {
        setIsAdminOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <FleetProvider>
          <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col selection:bg-[#D4AF37] selection:text-black transition-colors duration-300">
            {/* 1-Row 3-Zone Clean Header with zero admin buttons visible to the public */}
            <Header />

            {/* Main Content Flow: Proposition -> Catalog -> Proof */}
            <main className="flex-1">
              <Hero />
              <CarCatalog />
              <WhyUs />
            </main>

            {/* Clean Professional Public Footer (Zero Admin Links) */}
            <Footer />

            {/* Sticky Floating WhatsApp CTA Button */}
            <FloatingWhatsApp />

            {/* Hidden Admin CMS Portal - only accessible via URL #admin or Ctrl+Shift+A */}
            <AdminPortal
              isOpen={isAdminOpen}
              onClose={() => {
                setIsAdminOpen(false);
                if (window.location.hash === '#admin' || window.location.hash === '#cms') {
                  history.replaceState(null, '', ' ');
                }
              }}
            />
          </div>
        </FleetProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
