import React, { useState } from 'react';
import { Table, BookOpen, CheckCircle2, MessageCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { getCarInquiryUrl } from '../utils/whatsapp';

export const PriceTableAndArticles: React.FC = () => {
  const { language } = useLanguage();
  const { cars, settings, setSelectedCarForDetail } = useFleet();
  const isEn = language === 'en';

  const activeCars = cars.filter((c) => c.isAvailable !== false);

  const initialGuideSlug = () => {
    if (typeof window === 'undefined') return 'tips-rental-mobil-batam-lepas-kunci';
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (
      path === 'panduan-wisata-jembatan-barelang-batam' ||
      path === 'tips-rental-mobil-batam-lepas-kunci' ||
      path === 'tarif-antar-jemput-bandara-hang-nadim-pelabuhan-ferry-batam'
    ) {
      return path;
    }
    return 'tips-rental-mobil-batam-lepas-kunci';
  };

  const [openGuide, setOpenGuide] = useState<string>(initialGuideSlug);

  const seoGuides = [
    {
      slug: 'tips-rental-mobil-batam-lepas-kunci',
      tag: isEn ? 'Self-Drive Guide' : 'Panduan Lepas Kunci',
      title: isEn
        ? 'Complete Guide & Requirements for 24-Hour Self-Drive Car Rental in Batam'
        : 'Syarat & Tips Aman Rental Mobil Batam Lepas Kunci 24 Jam untuk Wisatawan & Dinas',
      summary: isEn
        ? 'Everything you need to know about renting a self-drive car in Batam without cash deposit, unit inspection checklist, and free airport/ferry delivery.'
        : 'Panduan praktis menyewa mobil lepas kunci 24 jam di Batam tanpa deposit uang tunai untuk wisatawan luar kota, cara serah-terima di Bandara Hang Nadim, dan pilihan mobil matic terbaik.',
      points: isEn
        ? [
            'Calculated per full 24 hours from handover time at Hang Nadim Airport, Ferry Terminal, or hotel lobby.',
            'No cash deposit required for tourists — simply send photos of your ID/Passport, active driving license, and return flight/ferry ticket via WhatsApp.',
            'All city cars (Agya, Brio) and MPVs (Avanza, Veloz, Xpander, Raize, Innova Reborn) feature responsive automatic transmissions tailored for Batam wide roads.',
            'Unlimited mileage across Batam Island, Nagoya, Batam Center, Nongsa, and Barelang Bridges.'
          ]
        : [
            'Hitungan sewa murni 24 jam penuh sejak unit diserahkan di Bandara Hang Nadim, Pelabuhan Ferry, atau lobi hotel Anda.',
            'Tanpa uang deposit untuk wisatawan luar kota/mancanegara — cukup kirim foto e-KTP/Paspor, SIM A aktif, serta tiket pesawat/ferry PP via WhatsApp.',
            'Seluruh unit City Car (Agya, Brio) dan MPV (Avanza, Veloz, Xpander, Raize, Innova Reborn) menggunakan transmisi matic halus dan AC dingin.',
            'Bebas jarak tempuh (unlimited kilometer) untuk keliling Nagoya, Batam Center, Nongsa, hingga Jembatan 1–6 Barelang.'
          ]
    },
    {
      slug: 'panduan-wisata-jembatan-barelang-batam',
      tag: isEn ? 'Destination & Culinary Guide' : 'Rute Wisata & Kuliner',
      title: isEn
        ? 'Barelang Bridge Sightseeing & Best Waterfront Kelong Seafood Guide in Batam'
        : 'Panduan Wisata Jembatan Barelang & Rekomendasi Kelong Seafood Terbaik di Batam',
      summary: isEn
        ? 'Best times to visit Barelang Bridge 1, recommended seafood kelong restaurants, and ideal family MPV or VIP vehicles for a 1-day Batam tour.'
        : 'Waktu terbaik mengunjungi Jembatan 1 Barelang (Tengku Fisabilillah), daftar restoran seafood kelong tepi laut favorit, serta estimasi waktu tempuh dari Nagoya.',
      points: isEn
        ? [
            'Located 35–40 minutes south of Nagoya & Batam Center via wide, scenic arterial roads.',
            'Best visited between 16:00 – 18:00 WIB for golden sunset photos at Bridge 1 Lookout and refreshing sea breeze.',
            'Pair your trip with fresh live seafood (Gonggong, Black Pepper Crab, Salted Egg Prawns) at Golden Prawn, Kopak Jaya 007, or Barelang Seafood Kelong.',
            'Most popular package: 12-Hour Car + Chauffeur + Fuel (All-In) starting from Rp 800.000 so your family can relax without worrying about parking or directions.'
          ]
        : [
            'Berjarak sekitar 35–40 menit dari pusat kota Nagoya & Batam Center melalui jalur jalan raya kembar yang lebar dan mulus.',
            'Waktu terbaik berkunjung adalah pukul 16.00 – 18.00 WIB untuk menikmati matahari terbenam (sunset) di anjungan Jembatan 1 Barelang sambil mencicipi jagung bakar & kelapa muda.',
            'Wajib singgah makan siang/malam seafood hidup segar (Siput Gonggong khas Kepri, Kepiting Saus Padang, Udang Telur Asin) di Kelong Kopak Jaya 007, Golden Prawn, atau Love Seafood.',
            'Paket paling direkomendasikan: Sewa Mobil + Supir + BBM 12 Jam (mulai Rp 800.000) agar Anda dan keluarga bebas lelah menyetir.'
          ]
    },
    {
      slug: 'tarif-antar-jemput-bandara-hang-nadim-pelabuhan-ferry-batam',
      tag: isEn ? 'Airport & Ferry Transfer' : 'Bandara & Pelabuhan Ferry',
      title: isEn
        ? 'Hang Nadim Airport (BTH) & Batam Center / Harbour Bay Ferry Terminal Transfer Guide'
        : 'Panduan Transportasi & Tarif Sewa Mobil dari Bandara Hang Nadim & Pelabuhan Ferry Batam',
      summary: isEn
        ? 'Instant meet-and-greet car handover or private VIP chauffeur pickup at Hang Nadim Airport, Batam Center, Harbour Bay, Sekupang, and Nongsapura.'
        : 'Cara memesan penjemputan VIP tepat waktu maupun serah-terima mobil lepas kunci langsung di pintu kedatangan Bandara Hang Nadim dan 4 pelabuhan ferry internasional Batam.',
      points: isEn
        ? [
            'Free vehicle delivery & collection for 24h self-drive rentals at Hang Nadim Airport (BTH), Batam Center Ferry Terminal, and Harbour Bay.',
            'Our driver tracks your flight number or Singapore/Johor ferry schedule in real time — no extra waiting charge if your flight is delayed.',
            'Distance guide: Hang Nadim Airport to Batam Center (15 mins), Hang Nadim Airport to Nagoya/Harbour Bay (25–30 mins), Nongsa Resorts (15 mins).',
            'Executive VIP delegations can book Toyota Alphard Transformer or Innova Zenix Hybrid with VIP arrival signboard.'
          ]
        : [
            'Gratis biaya antar-jemput unit mobil lepas kunci 24 jam di Bandara Internasional Hang Nadim (BTH), Pelabuhan Ferry Batam Center, dan Harbour Bay.',
            'Tim operasional kami memantau nomor penerbangan dan jadwal kapal ferry Anda secara real-time — driver sudah standby 15 menit sebelum Anda mendarat.',
            'Estimasi waktu tempuh: Bandara Hang Nadim ke Batam Center (15 menit), Bandara ke hotel area Nagoya / Jodoh / Harbour Bay (25–30 menit), Bandara ke Resort Nongsa (15 menit).',
            'Tersedia layanan penjemputan tamu VIP / Direksi menggunakan Toyota Alphard Transformer, Fortuner GR Sport, Innova Zenix Hybrid, hingga rombongan HiAce Commuter 14 kursi.'
          ]
    }
  ];

  return (
    <section
      id="daftar-harga"
      className="py-20 bg-white dark:bg-[#0B0C10] border-t border-black/5 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PART 1: Semantic HTML Price Table for Google Featured Snippet (Position #0) */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#B8860B] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
              <Table className="w-3.5 h-3.5" />
              <span>{isEn ? 'Official 2026 Price List' : 'Tabel Tarif Resmi 2026'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-3">
              {isEn
                ? 'Batam Car Rental Price List 2026 (Self-Drive & With Driver)'
                : 'Daftar Harga Rental Mobil Batam Terbaru 2026 (Lepas Kunci & Plus Supir)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
              {isEn
                ? 'Transparent daily rental rates for 24-hour self-drive and 12-hour all-in chauffeur packages (inclusive of driver & fuel). Free pickup at Hang Nadim Airport & Ferry Terminals.'
                : 'Perbandingan lengkap tarif sewa mobil Batam lepas kunci 24 jam dan paket mobil + supir + BBM (12 jam). Harga transparan, gratis antar-jemput Bandara Hang Nadim & Pelabuhan Ferry Batam.'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 shadow-lg bg-[#F9F9FB] dark:bg-[#121318]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1D1D1F] dark:bg-[#1A1C23] text-white text-xs sm:text-sm uppercase tracking-wider border-b border-white/10">
                  <th className="py-4 px-4 sm:px-6 font-bold">
                    {isEn ? 'Vehicle Model & Category' : 'Tipe Mobil & Kategori'}
                  </th>
                  <th className="py-4 px-3 sm:px-4 font-bold hidden sm:table-cell">
                    {isEn ? 'Capacity' : 'Kapasitas'}
                  </th>
                  <th className="py-4 px-4 sm:px-5 font-bold text-[#D4AF37]">
                    {isEn ? 'Self-Drive (24 Hours)' : 'Lepas Kunci (24 Jam)'}
                  </th>
                  <th className="py-4 px-4 sm:px-5 font-bold">
                    {isEn ? 'With Driver + Fuel (12H)' : 'Mobil + Supir + BBM (12 Jam)'}
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-bold text-right">
                    {isEn ? 'Reservation' : 'Pemesanan'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10 text-xs sm:text-sm">
                {activeCars.map((car) => {
                  const selfDriveRate =
                    car.rates?.self_drive_24h && car.rates.self_drive_24h.startsWith('Rp')
                      ? car.rates.self_drive_24h
                      : isEn
                      ? 'Chauffeur Only'
                      : 'Khusus + Supir';

                  const driverRate = car.rates?.with_driver_12h || car.price_start_from;

                  return (
                    <tr
                      key={car.id}
                      className="hover:bg-[#D4AF37]/5 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-[#1D1D1F] dark:text-white">
                        <a
                          href={`/armada/${car.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCarForDetail(car);
                          }}
                          className="hover:text-[#B8860B] dark:hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{car.name}</span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-slate-600 dark:text-neutral-300">
                            {car.category}
                          </span>
                        </a>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-slate-600 dark:text-neutral-300 hidden sm:table-cell">
                        {car.capacity} {isEn ? 'Seats' : 'Kursi'} • {car.transmission}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 font-extrabold text-[#B8860B] dark:text-[#D4AF37]">
                        {selfDriveRate}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 font-semibold text-slate-800 dark:text-neutral-200">
                        {driverRate}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <a
                          href={getCarInquiryUrl(car, 'Lepas Kunci / Supir', language, settings.whatsappNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#15803d] dark:text-[#4ade80] hover:text-black font-bold text-xs transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Book' : 'Pesan'}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PART 2: SEO Travel & Rental Guides Hub */}
        <div id="panduan-wisata">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#B8860B] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'Batam Travel & Rental Insights' : 'Panduan Resmi Wisata & Sewa Mobil'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-2">
              {isEn
                ? 'Essential Guides for Exploring Batam Island'
                : 'Panduan Lengkap Sewa Mobil & Eksplorasi Wisata Pulau Batam'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400">
              {isEn
                ? 'Helpful tips on self-drive requirements, airport/ferry pickup procedures, and the best culinary routes.'
                : 'Tips penting sebelum menyewa mobil lepas kunci, prosedur jemput di Bandara Hang Nadim & Pelabuhan Ferry, serta rekomendasi rute wisata.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {seoGuides.map((guide) => {
              const isOpen = openGuide === guide.slug;
              return (
                <article
                  key={guide.slug}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#F9F9FB] dark:bg-[#121318] overflow-hidden transition-all"
                >
                  <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#B8860B] dark:text-[#D4AF37]">
                          {guide.tag}
                        </span>
                        <a
                          href={`/${guide.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({ guide: guide.slug }, '', `/${guide.slug}`);
                            setOpenGuide(guide.slug);
                          }}
                          className="text-[11px] text-slate-400 hover:text-[#D4AF37] inline-flex items-center gap-1 transition-colors"
                        >
                          <span>latravelbatam.com/{guide.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <h3
                        onClick={() => setOpenGuide(isOpen ? '' : guide.slug)}
                        className="text-base sm:text-lg font-extrabold text-[#1D1D1F] dark:text-white cursor-pointer hover:text-[#B8860B] dark:hover:text-[#D4AF37] transition-colors"
                      >
                        {guide.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                        {guide.summary}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpenGuide(isOpen ? '' : guide.slug)}
                      aria-label={guide.title}
                      className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-neutral-200 hover:bg-[#D4AF37] hover:text-black transition-colors shrink-0 cursor-pointer"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-black/5 dark:border-white/5">
                      <ul className="space-y-2.5 mt-3">
                        {guide.points.map((pt, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-neutral-300 leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
