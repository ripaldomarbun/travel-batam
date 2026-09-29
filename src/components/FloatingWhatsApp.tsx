import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const waUrl = buildWhatsAppUrl(t.floatingWa.defaultMsg);

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex flex-col items-end pointer-events-auto">
      {/* Tooltip / Mini Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-72 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#D4AF37]/30 p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-neutral-200">{t.floatingWa.title}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-1 rounded-md transition-colors"
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
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl shadow-lg transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.floatingWa.chatBtn}</span>
          </a>
        </div>
      )}

      {/* Main Sticky Action Button */}
      <div className="relative group flex items-center gap-2">
        {!isOpen && (
          <span className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-neutral-200 bg-white/95 dark:bg-[#1A1A1A]/95 border border-slate-200 dark:border-[#D4AF37]/40 rounded-full shadow-lg backdrop-blur-sm transition-opacity">
            {t.floatingWa.badge}
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label="Hubungi WhatsApp L.A Travel Batam"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D4AF37] text-[9px] font-bold text-black items-center justify-center">
              1
            </span>
          </span>
          <MessageCircle className="w-7 h-7 fill-white" />
        </button>
      </div>
    </aside>
  );
};
