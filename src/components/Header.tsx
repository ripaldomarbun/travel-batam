import React, { useEffect, useState } from 'react';
import { MessageCircle, Sun, Moon, Menu, X, Car, ShieldCheck, FileText, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFleet } from '../context/FleetContext';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { updateMetaTags } from '../utils/seo';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { settings, selectedCarForDetail } = useFleet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when route/hash changes or on resize
  useEffect(() => {
    const handleClose = () => setIsMobileMenuOpen(false);
    window.addEventListener('resize', handleClose);
    window.addEventListener('hashchange', handleClose);
    return () => {
      window.removeEventListener('resize', handleClose);
      window.removeEventListener('hashchange', handleClose);
    };
  }, []);

  // Dynamic meta tag generation utility: Updates page title and Open Graph metadata
  // whenever a user navigates to a specific car detail view or returns to the home page.
  useEffect(() => {
    const isEn = language === 'en';

    if (selectedCarForDetail) {
      const carName = selectedCarForDetail.name;
      const category = selectedCarForDetail.category;
      const price = selectedCarForDetail.price_start_from;
      const desc = isEn
        ? selectedCarForDetail.description_en || `Rent ${carName} in Batam from ${price}/day. Self-drive or with professional chauffeur.`
        : selectedCarForDetail.description_id || `Sewa ${carName} di Batam mulai dari ${price}/hari. Tersedia lepas kunci atau dengan supir profesional L.A Travel.`;

      const pageTitle = isEn
        ? `Rent ${carName} in Batam – ${category} | L.A Travel`
        : `Sewa ${carName} di Batam – ${category} | L.A Travel`;

      updateMetaTags({
        title: pageTitle,
        description: desc,
        imageUrl: selectedCarForDetail.image_url,
        url: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#detail-${selectedCarForDetail.id}` : undefined,
        type: 'article'
      });
    } else {
      // Default Base Meta Tags when on general page
      updateMetaTags({
        title: isEn
          ? 'L.A Travel Batam – Premium Car Rental & Chauffeur Services'
          : 'L.A Travel Batam | Rental Mobil & Travel Premium Terpercaya',
        description: isEn
          ? 'Premier car rental and travel service in Batam. Rent Toyota Alphard VIP, Innova Zenix Hybrid, Veloz. Self-drive and professional chauffeur packages with free airport delivery.'
          : 'Layanan sewa dan rental mobil terbaik di Batam. Pilihan unit prima (Innova, Alphard, Veloz), lepas kunci atau dengan supir ramah. Reservasi cepat via WhatsApp!',
        imageUrl: '/images/hero_la_transport_1790686468335.jpg',
        url: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : undefined,
        type: 'website'
      });
    }
  }, [selectedCarForDetail, language]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-neutral-200 dark:border-[#262626] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Zone 1: Official Emblem + Brand Wordmark */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#D4AF37]/60 p-0.5 bg-black shadow-[0_0_14px_rgba(212,175,55,0.35)] group-hover:border-[#D4AF37] group-hover:scale-105 transition-all duration-300">
            <img
              src="/images/la_travel_logo.jpg"
              alt="L.A Travel Batam Official Logo"
              className="w-full h-full object-cover object-center rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-brand font-extrabold text-sm sm:text-lg tracking-wider text-slate-900 dark:text-neutral-100 group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors leading-tight">
              L.A TRAVEL
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-[#B8860B] dark:text-[#D4AF37] uppercase font-bold flex items-center gap-1">
              <span>Batam</span>
              <span className="opacity-60">·</span>
              <span className="hidden sm:inline">Ride • Travel • Enjoy</span>
              <span className="sm:hidden">Rental & Travel</span>
            </span>
          </div>
        </a>

        {/* Zone 2: Desktop Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-neutral-300">
          <a href="#armada" className="hover:text-[#B8860B] dark:hover:text-[#D4AF37] transition-colors">
            {t.nav.cars}
          </a>
          <a href="#keunggulan" className="hover:text-[#B8860B] dark:hover:text-[#D4AF37] transition-colors">
            {t.nav.whyUs}
          </a>
          <a href="#faq" className="hover:text-[#B8860B] dark:hover:text-[#D4AF37] transition-colors">
            {t.nav.terms}
          </a>
        </nav>

        {/* Zone 3: Actions (Theme + Language + WhatsApp + Mobile Menu Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Theme Mode Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 p-2 rounded-lg bg-slate-100 dark:bg-[#1C1C1C] border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-[#B8860B] dark:hover:text-[#D4AF37] transition-all cursor-pointer"
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-800" />
            )}
            <span className="hidden xl:inline text-[11px]">{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#1C1C1C] border border-slate-200 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setLanguage('id')}
              className={`px-2 py-1 rounded font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                language === 'id'
                  ? 'bg-[#D4AF37] text-black shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#D4AF37] text-black shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* WhatsApp Direct CTA */}
          <a
            href={getGeneralInquiryUrl('Cek Ketersediaan Mobil', language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-black bg-[#D4AF37] hover:bg-[#c49f2b] active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
            <span className="hidden sm:inline">{t.nav.chatAdmin}</span>
            <span className="sm:hidden text-xs">Chat</span>
          </a>

          {/* Mobile Hamburger Drawer Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-[#1C1C1C] border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:text-[#B8860B] dark:hover:text-[#D4AF37] active:scale-95 transition-all cursor-pointer"
            aria-label="Buka Menu Navigasi Mobile"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Slide-Down Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-neutral-800 bg-white/98 dark:bg-[#141414]/98 backdrop-blur-xl px-4 py-5 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <div className="space-y-4">
            
            {/* Logo Emblem Header in Mobile Drawer */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-neutral-800">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 bg-black shadow-md shrink-0">
                <img
                  src="/images/la_travel_logo.jpg"
                  alt="L.A Travel Batam Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-brand font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  L.A TRAVEL BATAM
                </p>
                <p className="text-[10px] font-bold text-[#B8860B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Ride • Travel • Enjoy Batam
                </p>
              </div>
            </div>

            <nav className="flex flex-col space-y-1.5">
              <a
                href="#armada"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:hover:bg-[#252525] text-sm font-semibold text-slate-900 dark:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#B8860B] dark:text-[#D4AF37]">
                  <Car className="w-4 h-4" />
                </div>
                <span>{t.nav.cars} (Alphard, Zenix, Veloz, HiAce)</span>
              </a>

              <a
                href="#keunggulan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:hover:bg-[#252525] text-sm font-semibold text-slate-900 dark:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#B8860B] dark:text-[#D4AF37]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>{t.nav.whyUs} & Antar-Jemput Gratis</span>
              </a>

              <a
                href="#keunggulan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:hover:bg-[#252525] text-sm font-semibold text-slate-900 dark:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#B8860B] dark:text-[#D4AF37]">
                  <FileText className="w-4 h-4" />
                </div>
                <span>{t.nav.terms} (Syarat Lepas Kunci 15 Menit)</span>
              </a>
            </nav>

            {/* Quick Contact Box inside Drawer */}
            <div className="pt-3 border-t border-slate-200 dark:border-neutral-800">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Customer Support 24 Jam</p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">+{settings.whatsappNumber}</p>
                </div>
                <a
                  href={getGeneralInquiryUrl('Konsultasi Cepat dari Mobile Menu', language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Chat WA</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

