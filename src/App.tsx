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

  // Allow opening admin directly via URL hash e.g. #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <FleetProvider>
          <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black transition-colors duration-200">
            {/* 1-Row 3-Zone Top Bar with Theme Toggle, Bilingual Switcher & Admin CMS button */}
            <Header onOpenAdmin={() => setIsAdminOpen(true)} />

            {/* Main Content Flow: Proposition -> Catalog -> Proof */}
            <main className="flex-1">
              <Hero />
              <CarCatalog />
              <WhyUs />
            </main>

            {/* Quiet Grounded Footer with Admin CMS Entry Point */}
            <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

            {/* Sticky Floating WhatsApp CTA Button */}
            <FloatingWhatsApp />

            {/* Admin CMS Portal Modal */}
            <AdminPortal
              isOpen={isAdminOpen}
              onClose={() => {
                setIsAdminOpen(false);
                if (window.location.hash === '#admin') {
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
