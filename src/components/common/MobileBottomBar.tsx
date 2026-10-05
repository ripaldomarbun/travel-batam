import React from 'react';
import { Car, ShieldCheck, FileText, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFleet } from '../../context/FleetContext';
import { getGeneralInquiryUrl } from '../../utils/whatsapp';

export const MobileBottomBar: React.FC = () => {
  const { language, t } = useLanguage();
  const { selectedCarForDetail, settings } = useFleet();

  // If a car detail modal or full modal is open, let the modal have full focus
  if (selectedCarForDetail) {
    return null;
  }

  const isEn = language === 'en';

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-neutral-800/90 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] transition-colors duration-200"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 px-2">
        {/* Tab 1: Armada */}
        <a
          href="#armada"
          onClick={(e) => scrollToSection(e, 'armada')}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 dark:text-neutral-400 hover:text-[#B8860B] dark:hover:text-[#D4AF37] active:scale-95 transition-all"
        >
          <Car className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
          <span className="text-[10px] font-bold tracking-tight">{isEn ? 'Fleet' : 'Armada'}</span>
        </a>

        {/* Tab 2: Keunggulan */}
        <a
          href="#keunggulan"
          onClick={(e) => scrollToSection(e, 'keunggulan')}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 dark:text-neutral-400 hover:text-[#B8860B] dark:hover:text-[#D4AF37] active:scale-95 transition-all"
        >
          <ShieldCheck className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
          <span className="text-[10px] font-bold tracking-tight">{isEn ? 'Why Us' : 'Keunggulan'}</span>
        </a>

        {/* Tab 3: Syarat Sewa */}
        <a
          href="#keunggulan"
          onClick={(e) => scrollToSection(e, 'keunggulan')}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 dark:text-neutral-400 hover:text-[#B8860B] dark:hover:text-[#D4AF37] active:scale-95 transition-all"
        >
          <FileText className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
          <span className="text-[10px] font-bold tracking-tight">{isEn ? 'Terms' : 'Syarat'}</span>
        </a>

        {/* Tab 4: Direct WhatsApp Chat */}
        <a
          href={getGeneralInquiryUrl('Pemesanan Cepat via Mobile', language, settings.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1 text-[#0E7A33] dark:text-[#25D366] hover:text-[#0a5c26] active:scale-95 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
            <MessageCircle className="w-4 h-4 fill-[#06240E] text-[#06240E]" />
          </div>
          <span className="text-[10px] font-extrabold text-[#0E7A33] dark:text-[#25D366] tracking-tight">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
};
