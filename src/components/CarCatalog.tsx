import React, { useState } from 'react';
import { Users, Gauge, Check, MessageCircle, Info, Eye, ArrowUpRight } from 'lucide-react';
import { Car, getCarInquiryUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { CarDetailModal } from './CarDetailModal';
import { LazyImage } from './common/LazyImage';

export const CarCatalog: React.FC = () => {
  const { language, t } = useLanguage();
  const { cars, settings, selectedCarForDetail, setSelectedCarForDetail } = useFleet();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [serviceOption, setServiceOption] = useState<'self' | 'driver'>('self');

  const isEn = language === 'en';

  const categories = [
    { key: 'all', label: t.catalog.categories.all, filterValue: 'Semua' },
    { key: 'vip', label: t.catalog.categories.vip, filterValue: 'VIP Luxury Van' },
    { key: 'premium', label: t.catalog.categories.premium, filterValue: 'Premium MPV' },
    { key: 'family', label: t.catalog.categories.family, filterValue: 'Family MPV' },
    { key: 'group', label: t.catalog.categories.group, filterValue: 'Minibus Group' },
  ];

  const activeCategory = categories.find((c) => c.key === selectedCategoryKey) || categories[0];

  const filteredCars = cars.filter((car) => {
    if (activeCategory.filterValue === 'Semua') return true;
    return car.category === activeCategory.filterValue;
  });

  const activeServiceLabel = serviceOption === 'self' ? t.catalog.selfDrive : t.catalog.withDriver;

  return (
    <section id="armada" className="py-24 bg-[#F5F5F7] dark:bg-[#000000] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-[#B8860B] dark:text-[#D4AF37] font-bold mb-2.5 caption-label">
            {t.catalog.tag}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-[-0.025em] mb-4 text-balance">
            {t.catalog.title}
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed text-balance">
            {t.catalog.subtitle}
          </p>
        </div>

        {/* Filter Bar & Service Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-black/5 dark:border-white/10">
          
          {/* Category Tabs (Apple Pills) */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategoryKey(cat.key)}
                className={`apple-pressable px-4 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategoryKey === cat.key
                    ? 'bg-[#D4AF37] text-black shadow-xs font-bold'
                    : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/15 border border-black/5 dark:border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Service Preference Switch (Apple Segmented Control) */}
          <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 rounded-full w-full sm:w-auto justify-center sm:justify-start shadow-xs">
            <span className="text-xs text-slate-700 dark:text-neutral-300 pl-3 pr-1 hidden sm:inline font-medium">{t.catalog.packageLabel}</span>
            <button
              onClick={() => setServiceOption('self')}
              className={`apple-pressable flex-1 sm:flex-none text-center px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                serviceOption === 'self'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-[#D4AF37] font-bold shadow-xs border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-neutral-400 font-semibold hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.catalog.selfDrive}
            </button>
            <button
              onClick={() => setServiceOption('driver')}
              className={`apple-pressable flex-1 sm:flex-none text-center px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                serviceOption === 'driver'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-[#D4AF37] font-bold shadow-xs border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-neutral-400 font-semibold hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.catalog.withDriver}
            </button>
          </div>

        </div>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => {
            const bookingUrl = getCarInquiryUrl(car, activeServiceLabel, language);
            const displayFeatures = (isEn && car.features_en) ? car.features_en : car.features;
            const displayCapacity = (isEn && car.capacity_en) ? car.capacity_en : car.capacity;
            const displayTransmission = (isEn && car.transmission_en) ? car.transmission_en : car.transmission;
            const displayBadge = (isEn && car.badge_en) ? car.badge_en : car.badge;
            const isAvailable = car.isAvailable ?? true;

            return (
              <div
                key={car.id}
                onClick={() => setSelectedCarForDetail(car)}
                className={`group flex flex-col apple-glass-card rounded-2xl overflow-hidden cursor-pointer ${
                  !isAvailable ? 'opacity-80' : ''
                }`}
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                  <LazyImage
                    src={car.image_url}
                    alt={car.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Chip & Status Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                    <span className="px-3 py-1 text-[11px] font-semibold text-white bg-black/65 backdrop-blur-md rounded-full border border-white/20 shadow-xs">
                      {displayBadge || car.category}
                    </span>
                    {!isAvailable && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold text-amber-300 bg-amber-500/25 border border-amber-400/40 rounded-full backdrop-blur-md">
                        {isEn ? 'Booked' : 'Tersewa'}
                      </span>
                    )}
                  </div>

                  {/* "Click to View Details" Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/35 backdrop-blur-xs">
                    <span className="apple-pressable inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-black text-xs font-bold shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>{isEn ? 'View Full Specs' : 'Lihat Detail Mobil'}</span>
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3.5 right-3.5 text-right px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 shadow-sm">
                    <p className="text-[10px] text-white/75 font-medium">{t.catalog.startingFrom}</p>
                    <p className="text-sm font-bold text-[#D4AF37] tabular-nums">
                      {car.price_start_from} <span className="text-[10px] font-normal text-white/75">{t.catalog.perDay}</span>
                    </p>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-[-0.015em] group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                        <span>{car.name}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#B8860B] dark:text-[#D4AF37]" />
                      </h3>
                    </div>

                    {/* Unboxed Metadata (Zero-Pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-3 sm:mb-4 font-medium">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                        {displayCapacity}
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-neutral-600">·</span>
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                        {displayTransmission}
                      </span>
                    </div>

                    {/* Feature Bullets (First 3 for clean card density) */}
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {displayFeatures.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dual Action: Details + Direct WA */}
                  <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCarForDetail(car);
                      }}
                      className="apple-pressable p-3 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                      title={isEn ? 'View Details' : 'Lihat Detail'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <a
                      href={bookingUrl}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-pressable flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-black shrink-0" />
                      <span>{t.catalog.rentViaWa}</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Free Custom Consultation Note */}
        <div className="mt-14 p-6 sm:p-7 rounded-2xl apple-glass border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">{t.catalog.customInquiryTitle}</p>
              <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5">{t.catalog.customInquiryDesc}</p>
            </div>
          </div>
          <a
            href={getCarInquiryUrl(
              {
                id: 'custom-fleet',
                name: isEn ? 'Corporate & Long-term Lease' : 'Permintaan Khusus / Sewa Bulanan',
                category: 'Corporate',
                capacity: 'Custom',
                transmission: 'Custom',
                price_start_from: 'Negotiable',
                price_unit: 'month',
                image_url: '',
                features: [],
                wa_message: ''
              },
              'Corporate Lease',
              language
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#B8860B] dark:text-[#D4AF37] text-xs font-bold whitespace-nowrap transition-colors"
          >
            {t.catalog.customInquiryBtn}
          </a>
        </div>

      </div>

      {/* Render Dedicated Detail Modal */}
      <CarDetailModal
        car={selectedCarForDetail}
        onClose={() => setSelectedCarForDetail(null)}
      />
    </section>
  );
};
