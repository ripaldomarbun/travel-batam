import React from 'react';
import { Plane, Ship, ShieldAlert, Award, FileCheck, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const WhyUs: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useFleet();

  const icons = [Plane, Ship, Award, FileCheck, ShieldAlert, Headphones];

  const waInquiryMsg = language === 'en'
    ? 'Hello L.A Travel Batam, I would like to verify rental requirements and car availability.'
    : 'Halo Admin L.A Travel Batam, saya mau verifikasi syarat sewa lepas kunci untuk tanggal tertentu.';

  return (
    <section id="keunggulan" className="py-24 bg-[#F5F5F7] dark:bg-[#0B0B0D] border-y border-black/5 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest text-[#B8860B] dark:text-[#D4AF37] font-bold mb-2.5 caption-label">
            {t.whyUs.tag}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-[-0.025em] mb-4 text-balance">
            {t.whyUs.title}
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed text-balance">
            {t.whyUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whyUs.points.map((p, idx) => {
            const Icon = icons[idx] || Award;
            return (
              <div
                key={idx}
                className="apple-glass-card p-6 sm:p-7 rounded-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#B8860B] dark:text-[#D4AF37]" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-2">{p.title}</h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Short Rental Requirements Box */}
        <div id="faq" className="mt-16 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl apple-glass border border-black/5 dark:border-white/10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="text-xs text-[#B8860B] dark:text-[#D4AF37] font-bold tracking-wider uppercase caption-label">
                {t.whyUs.termsTag}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mt-1.5 mb-3">
                {t.whyUs.termsTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-300 mb-5 leading-relaxed">
                {t.whyUs.termsDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700 dark:text-neutral-300 font-medium">
                {(language === 'id' && settings.selfDriveTerms && settings.selfDriveTerms.length > 0
                  ? settings.selfDriveTerms
                  : t.whyUs.termsItems
                ).map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-right">
              <a
                href={buildWhatsAppUrl(waInquiryMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-pressable inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold text-xs shadow-md transition-colors"
              >
                {t.whyUs.termsBtn}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
