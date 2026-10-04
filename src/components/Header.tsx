import React, { useEffect, useState } from 'react';
import { MessageCircle, Sun, Moon, Menu, X, Car, ShieldCheck, FileText, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFleet } from '../context/FleetContext';
import { getGeneralInquiryUrl } from '../utils/whatsapp';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useFleet();
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

  // Header presentation logic (SEO tags are managed cleanly by the root SEOHead component)

  const activePromoText = language === 'en' && settings.promoBannerTextEn
    ? settings.promoBannerTextEn
    : settings.promoBannerText;

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Dynamic Announcement Banner managed from Admin CMS */}
      {settings.promoBannerActive && activePromoText && (
        <div className="bg-gradient-to-r from-[#1a1400] via-[#2a2205] to-[#1a1400] border-b border-[#D4AF37]/30 text-[#E5C158] text-[11px] sm:text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
          <span className="inline-block animate-pulse">🔥</span>
          <span className="truncate max-w-4xl">{activePromoText}</span>
          <a
            href={getGeneralInquiryUrl('Klaim Promo Spesial Batam', language)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center underline text-[#D4AF37] hover:text-white font-bold ml-1.5 transition-colors"
          >
            {language === 'en' ? 'Claim Offer →' : 'Klaim Sekarang →'}
          </a>
        </div>
      )}

      <div className="w-full apple-glass-nav">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Display Font + Gold Accent) */}
        <a href="#" className="flex items-center gap-2 sm:gap-2.5 group apple-pressable shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#996515] p-0.5 shadow-[0_2px_12px_rgba(212,175,55,0.25)]">
            <div className="w-full h-full bg-[#121212] rounded-[9px] sm:rounded-[10px] flex items-center justify-center">
              <span className="font-bold text-sm sm:text-base text-[#D4AF37] tracking-wider">LA</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs sm:text-base tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors leading-tight">
              L.A TRAVEL
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-[#B8860B] dark:text-[#D4AF37] uppercase font-semibold">
              Batam Car Rental
            </span>
          </div>
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-700 dark:text-neutral-300">
          <a href="#armada" className="hover:text-black dark:hover:text-[#D4AF37] transition-colors">
            {t.nav.cars}
          </a>
          <a href="#keunggulan" className="hover:text-black dark:hover:text-[#D4AF37] transition-colors">
            {t.nav.whyUs}
          </a>
          <a href="#faq" className="hover:text-black dark:hover:text-[#D4AF37] transition-colors">
            {t.nav.terms}
          </a>
        </nav>

        {/* Zone 3: Primary Actions (Theme Toggle + Language Toggle + WhatsApp Direct) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

          {/* Theme Mode Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="apple-pressable flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/5 dark:border-white/10 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
            aria-label="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden lg:inline text-[11px] ml-1">Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden lg:inline text-[11px] ml-1">Gelap</span>
              </>
            )}
            <span className="hidden xl:inline text-[11px]">{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center p-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-xs">
            <button
              onClick={() => setLanguage('id')}
              className={`apple-pressable px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                language === 'id'
                  ? 'bg-[#D4AF37] text-black shadow-xs font-bold'
                  : 'text-slate-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`apple-pressable px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#D4AF37] text-black shadow-xs font-bold'
                  : 'text-slate-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'
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
            className="apple-pressable inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-[13px] font-semibold text-black bg-[#D4AF37] hover:bg-[#C59B27] rounded-full shadow-[0_2px_12px_rgba(212,175,55,0.35)] transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">{t.nav.chatAdmin}</span>
            <span className="sm:hidden font-bold">WA</span>
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
                  alt="Logo L.A Travel Batam - Agen Rental Mobil & Paket Wisata Batam"
                  loading="lazy"
                  decoding="async"
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

