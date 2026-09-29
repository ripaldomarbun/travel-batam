import React from 'react';
import { MessageCircle, Sun, Moon, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFleet } from '../context/FleetContext';
import { getGeneralInquiryUrl } from '../utils/whatsapp';

interface HeaderProps {
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useFleet();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#121212]/95 backdrop-blur-md border-b border-neutral-200 dark:border-[#262626] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Display Font + Gold Accent) */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#996515] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <div className="w-full h-full bg-[#121212] rounded-[7px] flex items-center justify-center">
              <span className="font-brand font-bold text-lg text-[#D4AF37] tracking-wider">LA</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-brand font-bold text-base sm:text-lg tracking-wider text-slate-900 dark:text-neutral-100 group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors leading-tight">
              L.A TRANSPORT
            </span>
            <span className="text-[10px] tracking-widest text-[#B8860B] dark:text-[#D4AF37] uppercase font-semibold">
              Batam Car Rental
            </span>
          </div>
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
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

        {/* Zone 3: Primary Actions (Theme Toggle + Language Toggle + Admin CMS + WhatsApp Direct) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Admin CMS Trigger Button */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-[#1C1C1C] border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-[#B8860B] dark:hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all cursor-pointer"
              title="Buka Portal Admin CMS"
              aria-label="Buka CMS Admin"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
              <span className="hidden xl:inline text-[11px]">CMS</span>
            </button>
          )}

          {/* Theme Mode Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-[#1C1C1C] border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-[#B8860B] dark:hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all cursor-pointer"
            title={theme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
            aria-label="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden lg:inline text-[11px]">Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-800" />
                <span className="hidden lg:inline text-[11px]">Gelap</span>
              </>
            )}
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#1C1C1C] border border-slate-200 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setLanguage('id')}
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                language === 'id'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bahasa Indonesia"
              aria-label="Ubah ke Bahasa Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
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
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-black bg-[#D4AF37] hover:bg-[#c49f2b] active:scale-95 rounded-lg shadow-[0_4px_14px_rgba(212,175,55,0.35)] transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span className="hidden sm:inline">{t.nav.chatAdmin}</span>
            <span className="sm:hidden">WA</span>
          </a>
        </div>

      </div>
    </header>
  );
};
