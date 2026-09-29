import React from 'react';
import { MessageCircle, MapPin, Clock, Phone, Instagram, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { language, t } = useLanguage();
  const { settings } = useFleet();

  return (
    <footer className="bg-slate-950 dark:bg-[#0D0D0D] border-t border-slate-800 dark:border-neutral-800 text-neutral-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center font-brand font-bold text-black text-sm shadow-md">
                LA
              </div>
              <span className="font-brand font-bold text-base text-white tracking-wider">
                L.A TRANSPORT BATAM
              </span>
            </div>
            <p className="leading-relaxed text-neutral-400 text-xs">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                aria-label="Instagram L.A Transport Batam"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors font-bold text-xs"
                aria-label="TikTok L.A Transport Batam"
              >
                TT
              </a>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                aria-label="Google Maps L.A Transport Batam"
              >
                <MapPin className="w-4 h-4" />
              </a>
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
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer text-[#D4AF37]/80"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Admin CMS Login</span>
                  </button>
                </li>
              )}
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
            </ul>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between">
            <div>
              <p className="font-bold text-white text-sm mb-1">{t.footer.response24}</p>
              <p className="text-neutral-400 text-xs mb-4 leading-relaxed">
                {t.footer.response24Desc}
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(language === 'en' ? 'Hello Admin L.A Transport Batam, I need a car rental today.' : 'Halo Admin L.A Transport Batam, saya butuh mobil rental hari ini.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded-lg transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t.footer.chatNow}</span>
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} L.A Transport Batam. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <p>{t.footer.tagline}</p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-neutral-500 hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                CMS Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
