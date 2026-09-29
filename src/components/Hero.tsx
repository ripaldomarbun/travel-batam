import React from 'react';
import { MessageCircle, ArrowDown, ShieldCheck, MapPin, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getGeneralInquiryUrl } from '../utils/whatsapp';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section className="relative min-h-[75svh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-neutral-200 dark:border-[#262626] transition-colors duration-200">
      {/* Background Photography with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_la_transport_1790686468335.jpg"
          alt="L.A Travel Batam Luxury Car Fleet"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-50 dark:brightness-40 contrast-110"
        />
        {/* Gradients for high contrast readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center flex flex-col items-center">
        
        {/* Official Brand Seal & Tagline Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/75 dark:bg-[#1A1A1A]/90 border border-[#D4AF37]/60 backdrop-blur-md mb-4 sm:mb-6 shadow-[0_4px_20px_rgba(212,175,55,0.25)]">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-[#D4AF37] shrink-0">
            <img
              src="/images/la_travel_logo.jpg"
              alt="L.A Travel Batam Emblem"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
            {t.hero.badge} <span className="text-[#D4AF37] font-semibold hidden sm:inline">· Ride • Travel • Enjoy Batam</span>
          </span>
        </div>

        {/* Marquee Headline */}
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-6 max-w-4xl text-balance leading-snug sm:leading-tight">
          {t.hero.titlePart1}
          <span className="text-[#D4AF37] block sm:inline"> {t.hero.titleHighlight}</span>
        </h1>

        {/* Value Proposition */}
        <p className="text-xs sm:text-base lg:text-lg text-neutral-200 max-w-2xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed text-balance">
          {t.hero.subtitle}
        </p>

        {/* Primary CTA Decision Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-12">
          <a
            href={getGeneralInquiryUrl('Pemesanan Rental Cepat', language)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-sm shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            <span>{t.hero.ctaWhatsapp}</span>
          </a>

          <a
            href="#armada"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-[#1A1A1A] dark:hover:bg-[#262626] border border-white/30 dark:border-[#D4AF37]/50 text-white dark:text-[#D4AF37] font-semibold text-sm shadow-md backdrop-blur-sm transition-all duration-200 active:scale-95"
          >
            <span>{t.hero.ctaCatalog}</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>

        {/* Trust Badges - Proof Adjacency */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl pt-5 sm:pt-6 border-t border-white/20 dark:border-neutral-800/80 text-left">
          <div className="flex items-center gap-2.5 p-2 sm:p-0 rounded-lg bg-black/30 sm:bg-transparent">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <p className="font-bold text-white">{t.hero.freePickup}</p>
              <p className="text-neutral-300 text-[10px] sm:text-xs">{t.hero.freePickupSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 sm:p-0 rounded-lg bg-black/30 sm:bg-transparent">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <p className="font-bold text-white">{t.hero.cleanVehicles}</p>
              <p className="text-neutral-300 text-[10px] sm:text-xs">{t.hero.cleanVehiclesSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 sm:p-0 rounded-lg bg-black/30 sm:bg-transparent">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <p className="font-bold text-white">{t.hero.support24}</p>
              <p className="text-neutral-300 text-[10px] sm:text-xs">{t.hero.support24Sub}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 sm:p-0 rounded-lg bg-black/30 sm:bg-transparent">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <p className="font-bold text-white">{t.hero.transparentTerms}</p>
              <p className="text-neutral-300 text-[10px] sm:text-xs">{t.hero.transparentTermsSub}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
