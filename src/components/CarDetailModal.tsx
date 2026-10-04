import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Gauge,
  Briefcase,
  Fuel,
  Check,
  MessageCircle,
  ShieldCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';
import { Car, getCarInquiryUrl, isSelfDriveCar } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import { LazyImage } from './common/LazyImage';
import { generateTouristTripJsonLd } from '../utils/seo';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({ car, onClose }) => {
  const { language } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Reset active image when car changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [car?.id]);

  // Gallery array fallback
  const galleryImages: string[] = car?.gallery && car.gallery.length > 0
    ? car.gallery
    : car?.image_url ? [car.image_url] : [];

  // Keyboard navigation for Escape and Arrow keys
  useEffect(() => {
    if (!car) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [car, onClose, galleryImages.length]);

  if (!car) return null;

  const isEn = language === 'en';
  const displayFeatures = (isEn && car.features_en) ? car.features_en : car.features;
  const displayCapacity = (isEn && car.capacity_en) ? car.capacity_en : car.capacity;
  const displayTransmission = (isEn && car.transmission_en) ? car.transmission_en : car.transmission;
  const displayFuel = (isEn && car.fuel_en) ? car.fuel_en : car.fuel;
  const displayLuggage = (isEn && car.luggage_en) ? car.luggage_en : car.luggage;
  const displayBadge = (isEn && car.badge_en) ? car.badge_en : car.badge;
  const displayDescription = (isEn && car.description_en) ? car.description_en : car.description_id;

  const waSelfDriveUrl = getCarInquiryUrl(car, isEn ? 'Self-Drive (Lepas Kunci)' : 'Lepas Kunci', language);
  const waDriverUrl = getCarInquiryUrl(car, isEn ? 'With Chauffeur (Dengan Supir)' : 'Dengan Supir', language);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Thumbnail label helper
  const getThumbnailLabel = (index: number) => {
    if (index === 0) return isEn ? 'Exterior' : 'Eksterior';
    if (index === 1) return isEn ? 'Cabin / Interior' : 'Kabin Interior';
    if (index === 2) return isEn ? 'Trunk / Luggage' : 'Bagasi Koper';
    return isEn ? 'Overview' : 'Tampak Lain';
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xl flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl apple-glass-card rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="apple-pressable absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg backdrop-blur-md cursor-pointer border border-white/20"
          aria-label="Tutup Detail Mobil"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Gallery Visual Area */}
        <div className="relative bg-black select-none shrink-0">
          {/* Main Active Image Display */}
          <div className="relative aspect-[16/10] sm:aspect-[21/9] bg-neutral-950 overflow-hidden">
            <LazyImage
              key={galleryImages[activeImageIndex]}
              src={galleryImages[activeImageIndex]}
              alt={
                isEn
                  ? `${car.name} (${car.category}) Batam Island Travel Package - ${getThumbnailLabel(activeImageIndex)}`
                  : `Paket Rental Wisata Batam ${car.name} (${car.category}) - ${getThumbnailLabel(activeImageIndex)}`
              }
              containerClassName="w-full h-full"
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

            {/* Badges on Top */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-md bg-black/75 backdrop-blur-md border border-neutral-700 text-xs font-semibold text-white tracking-wide">
                {car.category}
              </span>
              {displayBadge && (
                <span className="px-3 py-1 rounded-md bg-[#D4AF37] text-black text-xs font-bold tracking-wide shadow-md">
                  {displayBadge}
                </span>
              )}
            </div>

            {/* Image Counter & Gallery Icon Indicator */}
            {galleryImages.length > 1 && (
              <div className="absolute top-4 right-16 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-neutral-700 text-white text-xs font-medium">
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="tabular-nums">
                  {activeImageIndex + 1} / {galleryImages.length}
                </span>
              </div>
            )}

            {/* Left / Right Carousel Controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md backdrop-blur-xs cursor-pointer"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md backdrop-blur-xs cursor-pointer"
                  aria-label="Foto Berikutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Title & Pricing over Media Banner */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white pointer-events-none">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {car.name}
                </h2>
                {car.engine && (
                  <p className="text-xs text-neutral-300 font-medium mt-0.5">
                    {isEn ? 'Engine Spec:' : 'Tipe Mesin:'} {car.engine}
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-neutral-800 shrink-0">
                <p className="text-[10px] text-neutral-300 uppercase tracking-wider font-semibold">
                  {isEn ? 'Daily Rate from' : 'Mulai Dari'}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-[#D4AF37] tabular-nums">
                  {car.price_start_from}{' '}
                  <span className="text-xs font-normal text-neutral-200">
                    {isEn ? '/ day' : '/ hari'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Thumbnails Strip */}
          {galleryImages.length > 1 && (
            <div className="p-3 bg-neutral-950/95 border-b border-neutral-800/80 flex items-center gap-3 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-semibold text-neutral-400 pl-1 uppercase tracking-wider hidden sm:inline whitespace-nowrap">
                {isEn ? 'Gallery:' : 'Foto Unit:'}
              </span>
              <div className="flex items-center gap-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#D4AF37] scale-102 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <LazyImage
                      src={imgUrl}
                      alt={`${car.name} - ${getThumbnailLabel(idx)}`}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/75 py-0.5 text-center">
                      <span className="text-[9px] text-neutral-200 font-medium truncate block px-1">
                        {getThumbnailLabel(idx)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-5 sm:space-y-8">
          
          {/* Executive Pitch Description */}
          {displayDescription && (
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-300 leading-relaxed font-normal">
                {displayDescription}
              </p>
            </div>
          )}

          {/* 4-Box Technical Specifications Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#B8860B] dark:text-[#D4AF37] mb-4">
              {isEn ? 'Vehicle Specifications' : 'Spesifikasi Teknis Unit'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-slate-600 dark:text-neutral-300 mb-1">
                  <Users className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span className="text-[11px] font-semibold">{isEn ? 'Capacity' : 'Kapasitas'}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{displayCapacity}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-slate-600 dark:text-neutral-300 mb-1">
                  <Gauge className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span className="text-[11px] font-semibold">{isEn ? 'Transmission' : 'Transmisi'}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{displayTransmission}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-slate-600 dark:text-neutral-300 mb-1">
                  <Briefcase className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span className="text-[11px] font-semibold">{isEn ? 'Luggage' : 'Bagasi'}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{displayLuggage || '3-4 Koper'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-slate-600 dark:text-neutral-300 mb-1">
                  <Fuel className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span className="text-[11px] font-semibold">{isEn ? 'Fuel Type' : 'Bahan Bakar'}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{displayFuel || 'Bensin'}</p>
              </div>

            </div>
          </div>

          {/* Pricing & Rental Packages Breakdown */}
          {car.rates && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#B8860B] dark:text-[#D4AF37] mb-4">
                {isEn ? 'Pricing & Rental Options' : 'Pilihan Paket & Tarif Rental'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option 1: Self Drive */}
                {isSelfDriveCar(car) ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-emerald-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                          {isEn ? 'Option A: Self-Drive (24 Hours)' : 'Opsi 1: Lepas Kunci (24 Jam)'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                          {isEn ? 'Available' : 'Tersedia'}
                        </span>
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {car.rates.self_drive_24h}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-neutral-400 mt-2">
                        {isEn ? 'Full freedom to drive across Batam Island without a driver. Simple verification.' : 'Bebas keliling Batam tanpa supir. Syarat mudah (KTP/Paspor & SIM A).'}
                      </p>
                    </div>
                    <a
                      href={waSelfDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-pressable mt-4 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black text-xs font-bold transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Book Self-Drive via WA' : 'Pesan Lepas Kunci'}</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800 flex flex-col justify-between opacity-80">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">
                          {isEn ? 'Self-Drive (24 Hours)' : 'Lepas Kunci (24 Jam)'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 font-semibold">
                          {isEn ? 'Not Available' : 'Tidak Tersedia'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-neutral-300 mt-2">
                        {isEn ? 'Chauffeur Package Only' : 'Khusus Paket Supir & BBM'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {isEn ? 'This vehicle is exclusively bundled with our driver service for your utmost comfort & safety.' : 'Armada ini khusus dipaketkan bersama supir berpengalaman & BBM demi kenyamanan prima Anda.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Option 2: With Chauffeur */}
                <div className={`p-4 rounded-xl flex flex-col justify-between ${
                  !isSelfDriveCar(car) 
                    ? 'bg-amber-500/10 dark:bg-neutral-900 border-2 border-[#D4AF37]' 
                    : 'bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                        {isEn ? 'Option B: With Chauffeur & Fuel' : 'Opsi: Lengkap Supir & BBM (12 Jam)'}
                      </span>
                      {!isSelfDriveCar(car) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-black font-bold">
                          {isEn ? 'Recommended Package' : 'Paket Rekomendasi'}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {car.rates.with_driver_12h}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 mt-2">
                      {isEn ? 'Includes experienced, courteous driver and fuel who knows all top Batam sights.' : 'Termasuk supir ramah yang paham rute wisata & BBM. Bebas repot, santai di jalan.'}
                    </p>
                  </div>
                  <a
                    href={waDriverUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pressable mt-4 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black text-xs font-bold transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Book with Chauffeur' : 'Pesan Termasuk Supir'}</span>
                  </a>
                </div>

              </div>

              {/* Free Airport/Ferry Delivery Note */}
              <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 font-medium">
                <MapPin className="w-4 h-4 shrink-0 text-[#B8860B] dark:text-[#D4AF37]" />
                <span>{car.rates.airport_transfer}</span>
              </div>
            </div>
          )}

          {/* Key Amenities & Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#B8860B] dark:text-[#D4AF37] mb-3">
              {isEn ? 'Vehicle Highlights & Comfort' : 'Keunggulan & Fasilitas Unit'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {displayFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-neutral-300"
                >
                  <Check className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fast Verification Note for Self-Drive */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
              <ShieldCheck className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
              <span>{isEn ? 'Fast Rental Document Verification' : 'Syarat Booking Cepat (Tanpa Ribet)'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
              {isEn
                ? 'Only requires photo of Passport/ID, valid Driving License, and flight/ferry ticket or hotel reservation. Verified within 15 minutes.'
                : 'Cukup foto KTP/Paspor, SIM A, dan bukti tiket ferry/pesawat atau voucher hotel. Verifikasi data selesai dalam 15 menit.'}
            </p>
          </div>

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-3.5 sm:p-5 apple-glass border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{car.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">
              {isEn ? 'Ready for immediate booking in Batam' : 'Tersedia untuk reservasi hari ini di Batam'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="apple-pressable w-1/3 sm:w-auto px-5 py-3 rounded-full border border-black/10 dark:border-white/15 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              {isEn ? 'Close' : 'Tutup'}
            </button>
            <a
              href={waSelfDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-pressable flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA59] text-white text-xs font-bold shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{isEn ? 'Book via WhatsApp' : 'Chat WhatsApp Sekarang'}</span>
            </a>
          </div>
        </div>

        {/* Embedded JSON-LD Schema (TouristTrip & Product) for Search Engine Crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateTouristTripJsonLd(car, language))
          }}
        />

      </div>
    </div>
  );
};
