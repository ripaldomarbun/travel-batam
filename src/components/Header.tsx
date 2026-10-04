import React, { useEffect } from 'react';
import { MessageCircle, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFleet } from '../context/FleetContext';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { updateMetaTags } from '../utils/seo';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { settings, selectedCarForDetail } = useFleet();

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
          : 'L.A Travel Batam | Rental Mobil Premium & Terpercaya',
        description: isEn
          ? 'Premier car rental service in Batam. Rent Toyota Alphard VIP, Innova Zenix Hybrid, Veloz. Self-drive and professional chauffeur packages with free airport delivery.'
          : 'Layanan sewa dan rental mobil terbaik di Batam. Pilihan unit prima (Innova, Alphard, Veloz), lepas kunci atau dengan supir ramah. Reservasi cepat via WhatsApp!',
        imageUrl: '/images/hero_la_transport_1790686468335.jpg',
        url: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : undefined,
        type: 'website'
      });
    }
  }, [selectedCarForDetail, language]);

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
              aria-label="Ubah ke Bahasa Indonesia"
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
              title="English Language"
              aria-label="Switch to English"
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
        </div>

        </div>
      </div>
    </header>
  );
};
