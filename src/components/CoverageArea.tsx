import React from 'react';
import { Plane, Ship, Building2, MapPin, CheckCircle2, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CoverageArea: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const locations = [
    {
      icon: Plane,
      title: isEn ? 'Hang Nadim International Airport (BTH)' : 'Bandara Hang Nadim (BTH)',
      badge: isEn ? '100% Free Pickup & Return' : 'Gratis Antar-Jemput Gate Kedatangan',
      desc: isEn
        ? 'Flight monitoring system ensuring on-time car handover at domestic & VIP terminal gates.'
        : 'Standby tepat waktu di area gate kedatangan & keberangkatan domestik dengan monitoring jadwal penerbangan realtime.',
      points: [
        isEn ? 'Direct handover at Terminal Arrival' : 'Serah terima langsung di lobi kedatangan',
        isEn ? '24/7 flight delay monitoring' : 'Pantau jadwal delay pesawat 24 jam',
        isEn ? 'Return car at departure drop-off zone' : 'Bisa pengembalian langsung di drop-off gate'
      ]
    },
    {
      icon: Ship,
      title: isEn ? 'Ferry Terminals (Batam Center & Harbour Bay)' : 'Pelabuhan Ferry Batam Center & Harbour Bay',
      badge: isEn ? 'Singapore & Malaysia Gateway' : 'Gerbang Utama Wisatawan Ferry',
      desc: isEn
        ? 'Seamless car delivery for travelers arriving via Sindo Ferry, BatamFast, Horizon, and Majestic from Singapore & Malaysia.'
        : 'Sambut kedatangan penumpang kapal ferry dari HarbourFront, Tanah Merah, Stulang Laut, & Pasir Gudang tanpa tunggu lama.',
      points: [
        isEn ? 'Meet & Greet at Ferry Arrival Hall' : 'Penyambutan langsung di pintu keluar ferry',
        isEn ? 'Harbour Bay, Batam Center, & Sekupang' : 'Layanan di Batam Center, Harbour Bay, Sekupang, Nongsa',
        isEn ? 'Luggage assistance & fast handover' : 'Bantu barang bawaan & serah terima cepat'
      ]
    },
    {
      icon: Building2,
      title: isEn ? 'Nagoya, Jodoh & Batam Center Hubs' : 'Kawasan Bisnis Nagoya, Jodoh & Batam Kota',
      badge: isEn ? 'City Center & Hotel Delivery' : 'Antar Langsung ke Hotel & Mall',
      desc: isEn
        ? 'Complimentary vehicle delivery to Marriott, Aston, Radisson, Best Western, Nagoya Hill Mall, and all commercial spots.'
        : 'Pengantaran unit langsung ke hotel, resort, apartemen, pusat bisnis, hingga mall belanja favorit (Nagoya Hill, Grand Batam, BCS Mall).',
      points: [
        isEn ? 'Free delivery to all major hotels' : 'Gratis antar ke seluruh hotel berbintang',
        isEn ? 'Corporate & government business fleet' : 'Pilihan armada dinas, kementerian & eksekutif',
        isEn ? 'Flexible daily & weekly extension' : 'Perpanjangan sewa harian & mingguan fleksibel'
      ]
    },
    {
      icon: Compass,
      title: isEn ? 'Barelang Bridges & Nongsa Resorts' : 'Destinasi Wisata Barelang, Nongsa & Kuliner',
      badge: isEn ? 'Islandwide Travel Freedom' : 'Bebas Keliling Seluruh Pulau Batam',
      desc: isEn
        ? 'Explore Batam iconic landmarks: Barelang Bridges 1-6, kelong seafood restaurants, pristine Nongsa beaches, and historic spots.'
        : 'Kunjungi 6 jembatan ikonik Barelang, surga kuliner seafood kelong Piayu, pantai resort Nongsa, hingga spot foto Welcome to Batam.',
      points: [
        isEn ? 'Unlimited mileage within Batam Island' : 'Bebas kilometer keliling Pulau Batam',
        isEn ? 'Reliable suspension & AC for all terrains' : 'Mesin bertenaga & AC dingin siap jelajah',
        isEn ? 'Optional chauffeur who knows local hidden gems' : 'Supir berpengalaman tahu spot kuliner terbaik'
      ]
    }
  ];

  return (
    <section id="area-layanan" className="py-20 bg-white dark:bg-[#0B0B0D] border-b border-black/5 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#B8860B] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3.5 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{isEn ? 'Islandwide Coverage & Free Delivery' : 'Wilayah Layanan & Antar-Jemput Gratis'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-4 text-balance">
            {isEn ? (
              <>Pick Up & Drop Off Anywhere in <span className="text-[#B8860B] dark:text-[#D4AF37]">Batam Island</span></>
            ) : (
              <>Bebas Antar-Jemput di Seluruh Titik Strategis <span className="text-[#B8860B] dark:text-[#D4AF37]">Kota Batam</span></>
            )}
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed text-balance">
            {isEn
              ? 'Enjoy zero additional delivery fees across airports, international ferry terminals, premier resorts, and city center hotels in Batam.'
              : 'Nikmati kemudahan sewa mobil tanpa ribet. Kami antarkan mobil langsung ke pintu kedatangan Anda di bandara, pelabuhan, hotel, maupun kantor.'}
          </p>
        </div>

        {/* 4 Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {locations.map((loc, idx) => {
            const Icon = loc.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 sm:p-7 bg-[#F5F5F7] dark:bg-[#151518] border border-black/5 dark:border-white/10 hover:border-[#D4AF37]/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#B8860B] dark:text-[#D4AF37] shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white dark:bg-black/40 text-[#B8860B] dark:text-[#D4AF37] border border-[#D4AF37]/25 shadow-xs">
                      {loc.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-white mb-2 tracking-tight">
                    {loc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-5">
                    {loc.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                  {loc.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-neutral-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Location Ribbon */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚗</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#1D1D1F] dark:text-white">
                {isEn ? 'Need a customized pickup outside standard zones?' : 'Butuh antar-jemput di luar titik di atas?'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                {isEn
                  ? 'Our team covers Batu Aji, Kabil, Tiban, Piayu, and all residential/industrial areas in Batam.'
                  : 'Tim kami melayani seluruh area Batu Aji, Kabil, Tiban, Tanjung Piayu, hingga kawasan industri Batam.'}
              </p>
            </div>
          </div>
          <a
            href="#armada"
            className="apple-pressable px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            {isEn ? 'Browse Fleet →' : 'Pilih Mobil Sekarang →'}
          </a>
        </div>

      </div>
    </section>
  );
};
