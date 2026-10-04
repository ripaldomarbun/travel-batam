import React, { useState } from 'react';
import { Users, Gauge, Check, MessageCircle, Info, Eye, ArrowUpRight } from 'lucide-react';
import { Car, getCarInquiryUrl, isSelfDriveCar } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { CarDetailModal } from './CarDetailModal';
import { LazyImage } from './common/LazyImage';

export const CarCatalog: React.FC = () => {
  const { language, t } = useLanguage();
  const { cars, settings, selectedCarForDetail, setSelectedCarForDetail } = useFleet();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [serviceOption, setServiceOption] = useState<'all' | 'self' | 'driver'>('self');

  const isEn = language === 'en';

  const categories = [
    { key: 'all', label: t.catalog.categories.all, filterValue: 'Semua' },
    { key: 'vip', label: t.catalog.categories.vip, filterValue: 'VIP Luxury Van' },
    { key: 'premium', label: t.catalog.categories.premium, filterValue: 'Premium MPV' },
    { key: 'family', label: t.catalog.categories.family, filterValue: 'Family MPV' },
    { key: 'group', label: t.catalog.categories.group, filterValue: 'Minibus Group' },
  ];

  const activeCategory = categories.find((c) => c.key === selectedCategoryKey) || categories[0];

  // Hitung jumlah masing-masing paket secara real-time
  const selfDriveCount = cars.filter(isSelfDriveCar).length;
  const driverOnlyCount = cars.filter((c) => !isSelfDriveCar(c)).length;
  const allCount = cars.length;

  const handleServiceChange = (newOption: 'all' | 'self' | 'driver') => {
    setServiceOption(newOption);
    setSelectedCategoryKey('all');
  };

  const filteredCars = cars.filter((car) => {
    // 1. Filter Kategori Paket Layanan
    if (serviceOption === 'self' && !isSelfDriveCar(car)) return false;
    if (serviceOption === 'driver' && isSelfDriveCar(car)) return false;

    // 2. Filter Tab Tipe Mobil
    if (activeCategory.filterValue === 'Semua') return true;
    if (activeCategory.key === 'vip') return car.category.includes('VIP') || car.category.includes('Luxury');
    if (activeCategory.key === 'premium') return car.category.includes('Premium') || car.category.includes('SUV');
    if (activeCategory.key === 'family') return car.category.includes('Family') || car.category.includes('Compact') || car.category.includes('City');
    if (activeCategory.key === 'group') return car.category.includes('Minibus') || car.category.includes('Group');
    return car.category === activeCategory.filterValue;
  });

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

          {/* Service Preference Switch (Apple Segmented Control with Counts) */}
          <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 rounded-full w-full sm:w-auto justify-center sm:justify-start shadow-xs">
            <span className="text-xs text-slate-700 dark:text-neutral-300 pl-3 pr-1 hidden lg:inline font-medium">
              {t.catalog.packageLabel}
            </span>
            <button
              onClick={() => handleServiceChange('self')}
              className={`apple-pressable flex-1 sm:flex-none text-center px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                serviceOption === 'self'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-[#D4AF37] font-bold shadow-xs border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-neutral-400 font-semibold hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? `Self-Drive (${selfDriveCount})` : `Lepas Kunci (${selfDriveCount})`}
            </button>
            <button
              onClick={() => handleServiceChange('driver')}
              className={`apple-pressable flex-1 sm:flex-none text-center px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                serviceOption === 'driver'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-[#D4AF37] font-bold shadow-xs border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-neutral-400 font-semibold hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? `With Driver & Fuel (${driverOnlyCount})` : `Include Supir & BBM (${driverOnlyCount})`}
            </button>
            <button
              onClick={() => handleServiceChange('all')}
              className={`apple-pressable flex-1 sm:flex-none text-center px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                serviceOption === 'all'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-[#D4AF37] font-bold shadow-xs border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-neutral-400 font-semibold hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? `All (${allCount})` : `Semua (${allCount})`}
            </button>
          </div>

        </div>

        {/* Empty State jika filter kategori tidak menemukan mobil */}
        {filteredCars.length === 0 && (
          <div className="py-16 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-slate-700 dark:text-neutral-300 mb-2">
              {isEn 
                ? 'No vehicles found in this category for the selected package.' 
                : 'Tidak ada armada dalam kategori ini pada paket yang dipilih.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mb-6">
              {isEn
                ? 'Try selecting a different category tab or switch package options.'
                : 'Silakan pilih tab kategori mobil lain atau beralih ke paket lainnya.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategoryKey('all');
                setServiceOption('all');
              }}
              className="apple-pressable px-5 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold hover:bg-[#C59B27] transition-all cursor-pointer"
            >
              {isEn ? 'View All Vehicles (14)' : 'Tampilkan Seluruh 14 Armada'}
            </button>
          </div>
        )}

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => {
            const isSelf = isSelfDriveCar(car);
            
            // Tentukan label layanan untuk booking WA
            const bookingServiceLabel = isSelf
              ? (serviceOption === 'driver' ? (isEn ? 'With Driver' : 'Dengan Supir') : (isEn ? 'Self-Drive (Lepas Kunci)' : 'Lepas Kunci'))
              : (isEn ? 'With Driver & Fuel' : 'Include Supir & BBM');

            const bookingUrl = getCarInquiryUrl(car, bookingServiceLabel, language);
            const displayFeatures = (isEn && car.features_en) ? car.features_en : car.features;
            const displayCapacity = (isEn && car.capacity_en) ? car.capacity_en : car.capacity;
            const displayTransmission = (isEn && car.transmission_en) ? car.transmission_en : car.transmission;
            const isAvailable = car.isAvailable ?? true;

            // Paket Badge di pojok kiri atas foto
            const packageBadge = isSelf
              ? (isEn ? 'Self-Drive Available' : 'Lepas Kunci')
              : (isEn ? 'Driver & Fuel Included' : 'Include Supir & BBM');

            // Format tarif spesifik sesuai paket aktif
            let displayPrice = car.price_start_from;
            let displayUnit = isEn ? 'per day' : 'per hari';

            if (serviceOption === 'driver') {
              if (car.rates?.with_driver_12h) {
                const match = car.rates.with_driver_12h.match(/Rp\s*[\d.]+/i);
                if (match) displayPrice = match[0];
              }
              displayUnit = isEn ? '12 hrs (All-In)' : '12 jam (Supir & BBM)';
            } else if (serviceOption === 'self') {
              if (car.rates?.self_drive_24h) {
                const match = car.rates.self_drive_24h.match(/Rp\s*[\d.]+/i);
                if (match) displayPrice = match[0];
              }
              displayUnit = isEn ? '24 hrs (Self-Drive)' : '24 jam (Lepas Kunci)';
            } else {
              displayUnit = isSelf 
                ? (isEn ? 'per day (Self-Drive)' : 'per hari (Lepas Kunci)') 
                : (isEn ? '12 hrs (All-In)' : '12 jam (Supir & BBM)');
            }

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
                    alt={
                      isEn
                        ? `Batam Car Rental - ${car.name} (${car.category}) tour package`
                        : `Rental Mobil Batam - Paket Wisata ${car.name} (${car.category})`
                    }
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Chip & Status Badge */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full backdrop-blur-md shadow-xs border ${
                      isSelf 
                        ? 'bg-emerald-950/75 text-emerald-300 border-emerald-500/40' 
                        : 'bg-amber-950/75 text-[#D4AF37] border-amber-500/40'
                    }`}>
                      {packageBadge}
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
                  <div className="absolute bottom-3.5 right-3.5 text-right px-3.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 shadow-sm">
                    <p className="text-[10px] text-white/75 font-medium">{t.catalog.startingFrom}</p>
                    <p className="text-sm font-bold text-[#D4AF37] tabular-nums">
                      {displayPrice} <span className="text-[10px] font-normal text-white/75">{displayUnit}</span>
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

                    {/* Unboxed Metadata */}
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
                      <span aria-hidden="true" className="text-slate-300 dark:text-neutral-600">·</span>
                      <span className="text-slate-600 dark:text-neutral-400 font-semibold">
                        {car.category}
                      </span>
                    </div>

                    {/* Feature Bullets */}
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
                      <span>{isSelf ? (isEn ? 'Book Self-Drive' : 'Sewa Lepas Kunci') : (isEn ? 'Book Driver Package' : 'Sewa Include Supir')}</span>
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
                category: 'Corporate Fleet',
                capacity: 'Custom',
                transmission: 'Custom',
                price_start_from: 'Hubungi Admin',
                price_unit: 'paket',
                image_url: '/images/hero_la_transport_1790686468335.jpg',
                features: ['Sewa Bulanan / Korporat', 'Unit Baru & Terawat', 'Invoicing Resmi Perusahaan'],
                wa_message: 'Halo L.A Travel Batam, saya ingin konsultasi sewa jangka panjang / armada korporat.'
              },
              'Corporate Inquiry',
              language
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pressable shrink-0 py-3 px-6 rounded-full bg-white dark:bg-neutral-800 hover:bg-[#D4AF37] hover:text-black text-slate-900 dark:text-neutral-200 text-xs font-bold border border-black/5 dark:border-white/10 shadow-xs transition-all cursor-pointer"
          >
            {t.catalog.customInquiryBtn}
          </a>
        </div>

      </div>

      {/* Car Detail Modal */}
      {selectedCarForDetail && (
        <CarDetailModal
          car={selectedCarForDetail}
          onClose={() => setSelectedCarForDetail(null)}
        />
      )}
    </section>
  );
};
