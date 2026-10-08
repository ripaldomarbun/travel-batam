import React, { useState } from 'react';
import { 
  Key, 
  UserCheck, 
  Car, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  ShoppingBag, 
  Landmark, 
  Palmtree, 
  ArrowRight, 
  MessageCircle, 
  FileText,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const RentalPackagesAndGuide: React.FC = () => {
  const { language } = useLanguage();
  const { settings } = useFleet();
  const isEn = language === 'en';

  const [activePackageTab, setActivePackageTab] = useState<'lepas-kunci' | 'supir' | 'antar-jemput'>('lepas-kunci');

  // Package Options Data
  const packages = [
    {
      id: 'lepas-kunci',
      icon: Key,
      title: isEn ? 'Self-Drive (24 Hours)' : 'Sewa Lepas Kunci (24 Jam)',
      badge: isEn ? 'Maximum Privacy' : '100% Bebas Privasi',
      tagline: isEn 
        ? 'Full 24-hour flexibility to drive across Batam Island without mileage limits.'
        : 'Kebebasan penuh berkendara 24 jam keliling Pulau Batam tanpa batas kilometer.',
      highlights: [
        isEn ? 'Calculated on a full 24-hour basis' : 'Hitungan per 24 jam penuh sejak serah terima',
        isEn ? 'Unlimited mileage within Batam Island' : 'Bebas kilometer keliling seluruh Pulau Batam',
        isEn ? 'Free delivery to Airport & Ferry Terminals' : 'Gratis antar-jemput di Bandara & Pelabuhan Ferry',
        isEn ? 'Clean, sanitized vehicle with full cold A/C' : 'Unit wangi, bersih, dan AC dingin prima'
      ],
      requirementsTitle: isEn ? 'Required Documents:' : 'Syarat & Dokumen Sewa:',
      requirementsTourist: isEn 
        ? ['Passport & Valid Home/International Driving License', 'Return Flight / Ferry tickets to Batam', 'Hotel / Resort accommodation booking proof']
        : ['KTP Elektronik / Paspor Asli', 'SIM A aktif (atau International Driving Permit)', 'Tiket Pesawat / Tiket Kapal Ferry PP', 'Bukti Reservasi Hotel / Penginapan di Batam'],
      requirementsLocal: isEn
        ? ['Simple online identity verification via WhatsApp within 15 mins']
        : ['Untuk Domisili Batam: KTP Batam, SIM A, Kartu Keluarga/ID Kerja, jaminan Motor+STNK atau Deposit'],
      waText: isEn
        ? 'Hello L.A Travel Batam, I would like to book a Self-Drive (Lepas Kunci) car. Please check car availability.'
        : 'Halo Admin L.A Travel Batam, saya ingin booking rental mobil Lepas Kunci 24 Jam. Mohon info ketersediaan unit.'
    },
    {
      id: 'supir',
      icon: UserCheck,
      title: isEn ? 'With Chauffeur & Fuel (All-In)' : 'Include Supir VIP & BBM (All-In)',
      badge: isEn ? 'Most Popular for Tourists' : 'Pilihan Favorit Wisatawan',
      tagline: isEn
        ? 'Relax and enjoy your journey with courteous, English-speaking local drivers.'
        : 'Santai menikmati perjalanan tanpa lelah menyetir bersama supir lokal ramah & berpengalaman.',
      highlights: [
        isEn ? '12 Hours full service with polite driver' : 'Durasi 12 Jam perjalanan bersama driver ramah',
        isEn ? 'Fuel (BBM) already included in package' : 'Bahan Bakar Minyak (BBM) sudah termasuk',
        isEn ? 'Expert shortcuts avoiding traffic' : 'Paham rute tercepat bebas macet di Batam',
        isEn ? 'Insider recommendations for seafood & shopping' : 'Rekomendasi kuliner seafood kelong & oleh-oleh terbaik'
      ],
      requirementsTitle: isEn ? 'Zero Document Hassle:' : 'Tanpa Syarat Ribet:',
      requirementsTourist: isEn
        ? ['No deposit or vehicle security guarantee required', 'Just share your pickup time & ferry/flight schedule', 'Cashless, SGD, or PayNow payment accepted upon arrival']
        : ['Tanpa perlu jaminan deposit atau dokumen rumit', 'Cukup infokan jadwal tiba kapal/pesawat & lokasi jemput', 'Bisa bayar tunai (IDR/SGD), transfer bank, atau QRIS'],
      requirementsLocal: isEn
        ? ['Flexible hourly overtime available upon request']
        : ['Bisa perpanjang overtime terjangkau jika ingin menikmati kuliner malam lebih lama'],
      waText: isEn
        ? 'Hello L.A Travel Batam, I would like to reserve an All-In Car with Driver & Fuel for a Batam Tour.'
        : 'Halo Admin L.A Travel Batam, saya ingin pesan Paket Sewa Mobil Include Supir & BBM (All-In) untuk tour di Batam.'
    },
    {
      id: 'antar-jemput',
      icon: Car,
      title: isEn ? 'Airport & Ferry Transfer (Drop-Off)' : 'Drop-Off Bandara & Pelabuhan Ferry',
      badge: isEn ? 'Punctual & Stress-Free' : 'Tepat Waktu & Nyaman',
      tagline: isEn
        ? 'Direct private transfer from arrival gate to your hotel, office, or ferry terminal.'
        : 'Layanan antar-jemput privat langsung dari lobi kedatangan ke hotel, kantor, atau pelabuhan.',
      highlights: [
        isEn ? 'Driver stands by 15 mins prior to arrival' : 'Driver standby 15 menit sebelum kapal/pesawat tiba',
        isEn ? 'Realtime flight & ferry delay tracking' : 'Monitoring delay jadwal kapal & pesawat secara realtime',
        isEn ? 'Luggage assistance included' : 'Bantuan angkat koper & barang bawaan',
        isEn ? 'Clean spacious fleet (Alphard, Zenix, HiAce)' : 'Armada bersih & luas (Alphard, Zenix, HiAce, Veloz)'
      ],
      requirementsTitle: isEn ? 'Coverage Hubs:' : 'Titik Penjemputan Utama:',
      requirementsTourist: isEn
        ? ['Hang Nadim Airport (BTH) ↔ Nagoya / Batam Center', 'Batam Center Ferry Terminal ↔ Resorts & Hotels', 'Harbour Bay Ferry Terminal ↔ City & Barelang']
        : ['Bandara Hang Nadim (BTH) ↔ Seluruh Hotel Batam', 'Pelabuhan Ferry Batam Center & Harbour Bay', 'Pelabuhan Nongsapura, Sekupang, & Kawasan Barelang'],
      requirementsLocal: isEn
        ? ['Available 24 hours with advance booking confirmation']
        : ['Siap melayani 24 jam dengan konfirmasi jadwal reservasi terlebih dahulu'],
      waText: isEn
        ? 'Hello L.A Travel Batam, I need a private Airport/Ferry transfer in Batam. Please share rates.'
        : 'Halo Admin L.A Travel Batam, saya mau pesan layanan antar-jemput private Drop-Off Bandara / Pelabuhan Ferry di Batam.'
    }
  ];

  // Top Batam Travel Itineraries for SEO & Tourist Guidance
  const tourRoutes = [
    {
      icon: Compass,
      tag: isEn ? 'Iconic Landmark' : 'Ikon Megah Batam',
      title: isEn ? 'Barelang Bridges & Kelong Seafood Trail' : 'Rute Ikonik Jembatan Barelang & Seafood Kelong',
      desc: isEn
        ? 'Cross the 6 architectural bridges connecting Batam, Rempang, and Galang islands. Enjoy fresh gonggong & chilli crab at waterfront kelong restaurants while catching the sunset.'
        : 'Jelajahi keindahan 6 jembatan megah Barelang yang menghubungkan pulau Batam, Rempang, dan Galang. Singgah di spot foto Jembatan 1 Tengku Fisabilillah dan santap seafood kepiting saus padang & gonggong segar di atas kelong laut.',
      spots: isEn
        ? ['Barelang Bridge 1 Lookout', 'Viovio & Mirota Beach', 'Floating Kelong Seafood Lunch', 'Galang Memorial Camp']
        : ['Spot Foto Jembatan 1 Barelang', 'Pantai Viovio & Pantai Mirota', 'Makan Siang Seafood Kelong Tepi Laut', 'Kampung Vietnam Pulau Galang'],
      duration: isEn ? '4 – 6 Hours' : '4 – 6 Jam',
      recommendedFleet: isEn ? 'Innova Zenix / Fortuner GR / Veloz' : 'Innova Zenix / Fortuner GR / Veloz'
    },
    {
      icon: ShoppingBag,
      tag: isEn ? 'Shopping & Food' : 'Belanja & Kuliner',
      title: isEn ? 'Nagoya City Center & Shopping Spree' : 'Pusat Belanja Nagoya & Wisata Kuliner Malam',
      desc: isEn
        ? 'Batam premier shopping and lifestyle hub. Browse luxury perfumes, bags, and chocolates at Grand Batam Mall and Nagoya Hill, followed by famous Batam layered cakes (Lapis Legit).'
        : 'Kawasan belanja paling favorit wisatawan! Berburu tas, parfum, pakaian, dan elektronik di Grand Batam Mall, Nagoya Hill Mall, dan BCS Mall. Malamnya cicipi aneka jajanan di Nagoya Food Court dan borong oleh-oleh kue lapis legit khas Batam.',
      spots: isEn
        ? ['Grand Batam Mall & Nagoya Hill', 'BCS Mall & Factory Outlets', 'Batam Layered Cake (Lapis Legit)', 'Nagoya Culinary Food Court']
        : ['Grand Batam Mall & Nagoya Hill', 'BCS Mall (Batam City Square)', 'Toko Oleh-Oleh Lapis Legit Batam', 'Pusat Kuliner Malam Nagoya Food Court'],
      duration: isEn ? '3 – 5 Hours' : '3 – 5 Jam',
      recommendedFleet: isEn ? 'Toyota Avanza / Xpander / Innova Zenix' : 'Toyota Avanza / Xpander / Innova Zenix'
    },
    {
      icon: Landmark,
      tag: isEn ? 'Culture & Heritage' : 'Religi & Budaya',
      title: isEn ? 'Batam Heritage & Instagram Landmarks' : 'Wisata Religi, Sejarah & Landmark Ikonik',
      desc: isEn
        ? 'Take your signature photos at the "Welcome to Batam" hill monument, marvel at Sultan Mahmud Riayat Syah Mosque (the largest mosque in Sumatra with Madinah-style umbrellas), and visit Maha Vihara Duta Maitreya.'
        : 'Abadikan momen terbaik di monumen "Welcome to Batam", kagumi kemegahan Masjid Sultan Mahmud Ri\'ayat Syah (Masjid terbesar di Sumatra dengan arsitektur payung Madinah), dan kunjungi Maha Vihara Duta Maitreya yang megah.',
      spots: isEn
        ? ['Welcome to Batam Monument', 'Sultan Mahmud Ri\'ayat Syah Mosque', 'Maha Vihara Duta Maitreya', 'Engku Putri Batam Center Park']
        : ['Monumen Welcome to Batam', 'Masjid Sultan Mahmud Ri\'ayat Syah', 'Maha Vihara Duta Maitreya', 'Alun-Alun Engku Putri Batam Center'],
      duration: isEn ? '3 – 4 Hours' : '3 – 4 Jam',
      recommendedFleet: isEn ? 'Toyota Alphard VIP / HiAce Commuter' : 'Toyota Alphard VIP / HiAce Commuter'
    },
    {
      icon: Palmtree,
      tag: isEn ? 'Resort & Relaxation' : 'Pantai & Santai',
      title: isEn ? 'Nongsa Coastline, Beachfront & Golf Resorts' : 'Kawasan Pantai & Resor Mewah Nongsa',
      desc: isEn
        ? 'Breeze along Batam eastern coast with scenic views of Singapore skyline. Play at championship golf clubs (Palm Springs) or unwind at premium seaside beach clubs and resorts.'
        : 'Rasakan kesejukan semilir angin di pesisir Nongsa dengan pemandangan kapal kargo di Selat Singapura. Cocok untuk bermain golf di Palm Springs Golf Club atau menikmati relaksasi sore di pantai resort mewah Montigo & Nongsa Point Marina.',
      spots: isEn
        ? ['Nongsa Beach & Marina View', 'Palm Springs Golf Club', 'Montigo Resorts Beach Club', 'Nongsapura Ferry Hub']
        : ['Pantai Nongsa & Pemandangan Singapura', 'Palm Springs Golf & Country Club', 'Montigo Resorts & Beach Club', 'Pelabuhan Ferry Nongsapura'],
      duration: isEn ? '4 – 5 Hours' : '4 – 5 Jam',
      recommendedFleet: isEn ? 'Toyota Innova Zenix / Alphard VIP / Raize' : 'Toyota Innova Zenix / Alphard VIP / Raize'
    }
  ];

  const currentPkg = packages.find(p => p.id === activePackageTab) || packages[0];

  return (
    <section id="paket-wisata" className="py-24 bg-[#F5F5F7] dark:bg-[#070709] border-t border-black/5 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#B8860B] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Rental Options & Travel Guide' : 'Pilihan Paket Sewa & Panduan Wisata'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-4 text-balance">
            {isEn ? 'Choose Your Travel Style in Batam' : 'Pilihan Paket Sewa Mobil & Rute Wisata Batam'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-400 leading-relaxed text-balance">
            {isEn 
              ? 'Transparent requirements, comprehensive self-drive or chauffeur options, and curated travel routes to explore the best of Batam Island.'
              : 'Informasi lengkap dan transparan: opsi sewa lepas kunci 24 jam, paket tour include supir & BBM, serta rekomendasi rute wisata populer untuk liburan atau dinas Anda.'}
          </p>
        </div>

        {/* Part 1: Interactive Rental Package Selector */}
        <div className="mb-20">
          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 mb-8">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              const isActive = activePackageTab === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => setActivePackageTab(pkg.id as any)}
                  className={`apple-pressable flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#1D1D1F] text-white dark:bg-[#D4AF37] dark:text-black shadow-lg scale-[1.02]'
                      : 'bg-white/80 dark:bg-white/5 text-slate-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-white/10 border border-black/5 dark:border-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37] dark:text-black' : 'text-[#B8860B] dark:text-[#D4AF37]'}`} />
                  <span>{pkg.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Package Showcase Card */}
          <div className="apple-glass-card rounded-3xl p-6 sm:p-9 lg:p-11 border border-black/5 dark:border-white/10 shadow-xl relative overflow-hidden">
            {/* Background gold subtle glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Details & Value Props (7 cols) */}
              <div className="lg:col-span-7">
                <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#B8860B] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
                  {currentPkg.badge}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-3">
                  {currentPkg.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-neutral-300 mb-6 leading-relaxed">
                  {currentPkg.tagline}
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {currentPkg.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-neutral-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Requirements / Conditions box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 text-xs">
                  <p className="font-bold text-[#1D1D1F] dark:text-white mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{currentPkg.requirementsTitle}</span>
                  </p>
                  <ul className="space-y-1.5 text-slate-600 dark:text-neutral-300 mb-3">
                    {currentPkg.requirementsTourist.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                  {currentPkg.requirementsLocal.map((loc, lIdx) => (
                    <p key={lIdx} className="text-[11px] text-slate-500 dark:text-neutral-400 italic">
                      ℹ️ {loc}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right Column: CTA & Instant Action Card (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#1c1d22] to-[#0c0d10] text-white border border-[#D4AF37]/30 shadow-2xl text-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h4 className="text-lg font-bold mb-1.5">
                    {isEn ? 'Fast Booking & Instant Confirmation' : 'Reservasi Mudah & Cepat'}
                  </h4>
                  <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
                    {isEn 
                      ? 'Chat with our Batam reservation team on WhatsApp. Response within 5 minutes, 24/7.'
                      : 'Konsultasikan tanggal, rute, dan tipe armada dengan tim L.A Travel Batam. Respon ramah 24 jam.'}
                  </p>

                  <a
                    href={buildWhatsAppUrl(currentPkg.waText, settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pressable w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-black text-transparent" />
                    <span>{isEn ? 'Book This Option via WhatsApp' : 'Pesan Paket Ini via WhatsApp'}</span>
                  </a>

                  <p className="text-[11px] text-neutral-400 mt-3 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isEn ? '24/7 Fast Response • Official WA: +62 877-9763-1578' : 'Respon Cepat 24 Jam • WA: +62 877-9763-1578'}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Part 2: 4 Curated Batam Travel Routes & Itineraries */}
        <div id="rute-wisata">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-3">
              {isEn ? 'Top Curated Batam Travel Routes' : '4 Rekomendasi Rute Wisata Ikonik Kota Batam'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
              {isEn 
                ? 'Popular itineraries favored by travelers from Singapore, Malaysia, and domestic tourists.'
                : 'Destinasi terbaik yang wajib dikunjungi saat Anda berlibur atau ada kegiatan dinas di Batam.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {tourRoutes.map((route, idx) => {
              const Icon = route.icon;
              return (
                <div
                  key={idx}
                  className="apple-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-black/5 dark:border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#D4AF37]">
                          {route.tag}
                        </span>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-neutral-300 font-semibold">
                        ⏱️ {route.duration}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-2.5 group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] transition-colors">
                      {route.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-5">
                      {route.desc}
                    </p>

                    {/* Spots pills */}
                    <div className="mb-5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400 mb-2">
                        {isEn ? 'Key Spots & Highlights:' : 'Destinasi Utama:'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {route.spots.map((spot, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-neutral-300 font-medium"
                          >
                            📍 {spot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fleet Recommendation & Fast Inquiry button */}
                  <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400">
                      <span className="font-semibold text-slate-700 dark:text-neutral-300">{isEn ? 'Best Unit: ' : 'Armada Ideal: '}</span>
                      <span>{route.recommendedFleet}</span>
                    </div>
                    
                    <a
                      href={buildWhatsAppUrl(
                        isEn 
                          ? `Hello L.A Travel Batam, I am interested in exploring route: ${route.title}. What is the recommended car and package?`
                          : `Halo Admin L.A Travel Batam, saya tertarik untuk rute wisata: ${route.title}. Rekomendasi mobil dan paketnya bagaimana ya?`,
                        settings.whatsappNumber
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-pressable inline-flex items-center gap-1 text-xs font-bold text-[#B8860B] dark:text-[#D4AF37] hover:underline"
                    >
                      <span>{isEn ? 'Tour Inquiry' : 'Tanya Paket'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Part 3: Trust & Airport/Ferry Free Delivery Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#D4AF37]/15 to-amber-500/10 border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-black flex items-center justify-center shrink-0 font-bold text-xl shadow-md">
              📍
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {isEn ? 'Free Handover at Batam Ferry Terminals & Airport' : 'Gratis Antar-Jemput di Seluruh Pelabuhan Ferry & Bandara'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-neutral-300 mt-0.5">
                {isEn 
                  ? 'Batam Center • Harbour Bay • Nongsapura • Sekupang • Hang Nadim Airport (BTH). Zero extra delivery fees!'
                  : 'Batam Center • Harbour Bay • Nongsapura • Sekupang • Bandara Hang Nadim (BTH). Tanpa biaya antar sepersenpun!'}
              </p>
            </div>
          </div>

          <a
            href={buildWhatsAppUrl('Halo Admin L.A Travel Batam, saya mau tanya ketersediaan mobil untuk sewa di Batam.', settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pressable inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1D1F] dark:bg-white text-white dark:text-black font-bold text-xs shrink-0 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>{isEn ? 'Chat WhatsApp Now' : 'Hubungi WhatsApp Sekarang'}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
