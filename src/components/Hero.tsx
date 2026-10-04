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
          alt="L.A Travel Batam - Layanan Rental Mobil Mewah dan Paket Wisata Pulau Batam"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-50 dark:brightness-40 contrast-110"
        />
        {/* Gradients for high contrast readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Subtle Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 dark:bg-white/10 border border-white/15 backdrop-blur-xl mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[12px] font-medium text-neutral-100 caption-label">
            {t.hero.badge}
          </span>
        </div>

        {/* Marquee Headline with Optical Tracking */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.028em] text-white mb-6 max-w-4xl text-balance leading-[1.08]">
          {t.hero.titlePart1}
          <span className="text-[#D4AF37] block sm:inline"> {t.hero.titleHighlight}</span>
        </h1>

        {/* Value Proposition */}
        <p className="text-base sm:text-lg text-[#E5E5EA] max-w-2xl mx-auto mb-10 font-normal leading-relaxed text-balance">
          {t.hero.subtitle}
        </p>

        {/* Primary CTA Decision Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14">
          <a
            href={getGeneralInquiryUrl('Pemesanan Rental Cepat', language)}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pressable w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20BA59] text-white font-semibold text-sm shadow-[0_4px_24px_rgba(37,211,102,0.45)] transition-colors duration-150"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.hero.ctaWhatsapp}</span>
          </a>

          <a
            href="#armada"
            className="apple-pressable w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-xl shadow-xs transition-colors duration-150"
          >
            <span>{t.hero.ctaCatalog}</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>

        {/* Trust Badges - Proof Adjacency on Translucent Apple Glass Card */}
        <div className="rounded-2xl p-5 sm:p-6 w-full max-w-4xl bg-black/55 backdrop-blur-xl border border-white/15 shadow-2xl text-left grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">{t.hero.freePickup}</p>
              <p className="text-white/80 text-[11px] font-medium">{t.hero.freePickupSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">{t.hero.cleanVehicles}</p>
              <p className="text-white/80 text-[11px] font-medium">{t.hero.cleanVehiclesSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">{t.hero.support24}</p>
              <p className="text-white/80 text-[11px] font-medium">{t.hero.support24Sub}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">{t.hero.transparentTerms}</p>
              <p className="text-white/80 text-[11px] font-medium">{t.hero.transparentTermsSub}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
