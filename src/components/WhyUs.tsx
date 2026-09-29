import React from 'react';
import { Plane, Ship, ShieldAlert, Award, FileCheck, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const WhyUs: React.FC = () => {
  const { language, t } = useLanguage();

  const icons = [Plane, Ship, Award, FileCheck, ShieldAlert, Headphones];

  const waInquiryMsg = language === 'en'
    ? 'Hello L.A Travel Batam, I would like to verify rental requirements and car availability.'
    : 'Halo Admin L.A Travel Batam, saya mau verifikasi syarat sewa lepas kunci untuk tanggal tertentu.';

  return (
    <section id="keunggulan" className="py-12 sm:py-20 bg-[#F1F3F5] dark:bg-[#161616] border-y border-slate-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <p className="text-xs uppercase tracking-widest text-[#B8860B] dark:text-[#D4AF37] font-bold mb-2">
            {t.whyUs.tag}
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            {t.whyUs.title}
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {t.whyUs.points.map((p, idx) => {
            const Icon = icons[idx] || Award;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1F1F1F] border border-slate-200 dark:border-neutral-800/80 hover:border-[#D4AF37]/50 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#B8860B] dark:text-[#D4AF37]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">{p.title}</h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Short Rental Requirements Box */}
        <div id="faq" className="mt-10 sm:mt-16 p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#D4AF37]/40 dark:border-[#D4AF37]/30 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="text-xs text-[#B8860B] dark:text-[#D4AF37] font-bold tracking-wider uppercase">
                {t.whyUs.termsTag}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2 sm:mb-3">
                {t.whyUs.termsTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-300 mb-4 leading-relaxed">
                {t.whyUs.termsDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs text-slate-700 dark:text-neutral-300 font-medium">
                {t.whyUs.termsItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-right pt-2 lg:pt-0">
              <a
                href={buildWhatsAppUrl(waInquiryMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-black font-bold text-xs shadow-lg transition-transform active:scale-95"
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
