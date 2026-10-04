import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useFleet();
  const [isOpen, setIsOpen] = useState(false);

  const waUrl = buildWhatsAppUrl(t.floatingWa.defaultMsg, settings.whatsappNumber);

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex flex-col items-end pointer-events-auto">
      {/* Tooltip / Mini Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-72 max-w-[calc(100vw-36px)] rounded-2xl apple-glass p-4 shadow-2xl border border-black/5 dark:border-white/10 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{t.floatingWa.title}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="apple-pressable text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Tutup pesan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="py-3 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
            {t.floatingWa.desc}
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pressable flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20BA59] text-white text-xs font-semibold rounded-full shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.floatingWa.chatBtn}</span>
          </a>
        </div>
      )}

      {/* Main Sticky Action Button */}
      <div className="relative group flex items-center gap-2">
        {!isOpen && (
          <span className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] apple-glass rounded-full shadow-md transition-opacity">
            {t.floatingWa.badge}
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="apple-pressable relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA59] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] cursor-pointer"
          aria-label="Hubungi WhatsApp L.A Travel Batam"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D4AF37] text-[9px] font-bold text-black items-center justify-center">
              1
            </span>
          </span>
          <MessageCircle className="w-6 h-6 fill-white" />
        </button>
      </div>
    </aside>
  );
};
