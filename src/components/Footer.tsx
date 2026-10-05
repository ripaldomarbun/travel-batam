import React from 'react';
import { MessageCircle, MapPin, Clock, Phone, Instagram, Lock, Mail, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { sanitizeExternalUrl } from '../utils/security';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useFleet();

  const safeInstagram = sanitizeExternalUrl(settings.instagramUrl);
  const safeFacebook = sanitizeExternalUrl(settings.facebookUrl);
  const safeTiktok = sanitizeExternalUrl(settings.tiktokUrl);
  const safeMaps = sanitizeExternalUrl(settings.mapsUrl);

  return (
    <footer className="bg-[#0A0A0C] border-t border-black/5 dark:border-white/10 text-neutral-400 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 bg-black shadow-[0_2px_12px_rgba(212,175,55,0.3)] shrink-0">
                <img
                  src="/images/la_travel_logo.jpg"
                  alt="Logo L.A Travel Batam"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-brand font-extrabold text-sm tracking-tight text-white leading-tight">
                  L.A TRAVEL BATAM
                </span>
                <span className="text-[9px] tracking-wider text-[#D4AF37] uppercase font-bold">
                  Ride • Travel • Enjoy Batam
                </span>
              </div>
            </div>
            <p className="leading-relaxed text-neutral-400 text-xs">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              {safeInstagram !== '#' && (
                <a
                  href={safeInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-pressable w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  aria-label="Instagram L.A Travel Batam"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {safeFacebook !== '#' && (
                <a
                  href={safeFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-pressable w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  aria-label="Facebook L.A Travel Batam"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {safeTiktok !== '#' && (
                <a
                  href={safeTiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-pressable w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors font-bold text-xs"
                  aria-label="TT - TikTok L.A Travel Batam"
                >
                  TT
                </a>
              )}
              {safeMaps !== '#' && (
                <a
                  href={safeMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-pressable w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  aria-label="Google Maps L.A Travel Batam"
                >
                  <MapPin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#armada" className="hover:text-[#D4AF37] transition-colors">{t.nav.cars}</a>
              </li>
              <li>
                <a href="#armada" className="hover:text-[#D4AF37] transition-colors">{t.catalog.selfDrive}</a>
              </li>
              <li>
                <a href="#armada" className="hover:text-[#D4AF37] transition-colors">{t.catalog.withDriver}</a>
              </li>
              <li>
                <a href="#keunggulan" className="hover:text-[#D4AF37] transition-colors">{t.nav.whyUs}</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#D4AF37] transition-colors">{t.nav.terms}</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.officeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Customer Care: {settings.openingHours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+{settings.whatsappNumber}</span>
              </li>
              {settings.secondaryPhone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>+{settings.secondaryPhone} (Cadangan)</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
            <div>
              <p className="font-bold text-white text-sm mb-1">{t.footer.response24}</p>
              <p className="text-neutral-300 text-xs mb-4 leading-relaxed">
                {t.footer.response24Desc}
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(settings.defaultWaGreeting || (language === 'en' ? 'Hello Admin L.A Travel Batam, I need a car rental today.' : 'Halo Admin L.A Travel Batam, saya butuh mobil rental hari ini.'), settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-pressable flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20BA59] text-[#06240E] font-bold rounded-full shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-[#06240E] text-[#06240E]" />
              <span>{t.footer.chatNow}</span>
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} L.A Travel Batam. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <p>{t.footer.tagline}</p>
            <span className="text-neutral-700">|</span>
            <a
              href="#admin"
              className="apple-pressable inline-flex items-center gap-1.5 text-neutral-500 hover:text-[#D4AF37] transition-colors"
              title="Akses Portal Manajemen CMS Admin"
            >
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span>Admin CMS</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
