import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFleet } from '../context/FleetContext';
import { getGeneralInquiryUrl } from '../utils/whatsapp';

export interface FAQItem {
  questionId: string;
  questionEn: string;
  answerId: string;
  answerEn: string;
  category: 'harga' | 'syarat' | 'lokasi' | 'turis' | 'layanan';
}

export const FAQ_DATA: FAQItem[] = [
  {
    category: 'harga',
    questionId: 'Berapa tarif harga sewa / rental mobil di Batam per hari?',
    questionEn: 'How much are the daily car rental rates in Batam?',
    answerId:
      'Tarif rental mobil di L.A Travel Batam sangat kompetitif dan transparan tanpa biaya tersembunyi. Untuk City Car hemat seperti Toyota Agya & Honda Brio mulai dari Rp 300.000 / hari (~SGD 25). Family MPV seperti Toyota Avanza & Daihatsu Xenia Rp 350.000 – Rp 450.000 / hari. Crossover MPV Mitsubishi Xpander & SUV mulai Rp 800.000 – Rp 950.000 / hari. Sementara kelas eksekutif Toyota Innova Zenix Hybrid Rp 1.100.000, Toyota Fortuner GR Rp 1.600.000, dan Toyota Alphard VIP Rp 3.200.000 / hari. Tersedia opsi Lepas Kunci 24 Jam atau Include Supir & BBM.',
    answerEn:
      'Our car rental rates in Batam are transparent and highly competitive with no hidden fees. Compact city cars (Toyota Agya, Honda Brio) start from IDR 300,000 / day (~SGD 25). Family MPVs (Toyota Avanza, Daihatsu Xenia) range from IDR 350,000 to IDR 450,000 / day. Crossover MPVs (Mitsubishi Xpander) and compact SUVs from IDR 800,000 / day. Executive vehicles like Toyota Innova Zenix Hybrid are IDR 1,100,000 / day, Fortuner GR Sport IDR 1,600,000 / day, and luxury Toyota Alphard VIP IDR 3,200,000 / day. Available for 24-hour self-drive or with professional chauffeur & fuel.'
  },
  {
    category: 'syarat',
    questionId: 'Apa saja syarat sewa mobil lepas kunci di Batam?',
    questionEn: 'What are the requirements for self-drive car rental in Batam?',
    answerId:
      'Syarat sewa lepas kunci di L.A Travel Batam sangat mudah dan cepat (verifikasi online via WhatsApp hanya 15 menit). Untuk wisatawan nusantara: cukup kirim foto KTP asli, SIM A aktif, bukti tiket pesawat / ferry tiba di Batam, dan bukti booking hotel. Untuk turis mancanegara (Singapura/Malaysia): Passport, Driving License asal / Internasional, dan tiket ferry PP. Untuk warga lokal Batam: KTP, SIM A, dan jaminan dokumen pendukung (motor/KK/ID kerja).',
    answerEn:
      'Self-drive requirements are simple and verified online via WhatsApp within 15 minutes. International travelers (Singapore, Malaysia, and overseas tourists) only need to provide: Passport, Valid Driving License (International or home country license), and Proof of Ferry/Flight return tickets. For Indonesian domestic travelers: National ID (KTP), Driving License (SIM A), Travel ticket, and Hotel reservation.'
  },
  {
    category: 'lokasi',
    questionId: 'Apakah melayani antar-jemput gratis di Pelabuhan Ferry dan Bandara Hang Nadim?',
    questionEn: 'Is free pickup and return available at ferry terminals and the airport?',
    answerId:
      'Ya, 100% GRATIS! Kami menyediakan layanan antar dan jemput mobil langsung di Bandara Internasional Hang Nadim (BTH), Pelabuhan Ferry Batam Center, Pelabuhan Ferry Harbour Bay, Pelabuhan Sekupang, dan Pelabuhan Nongsapura, serta seluruh hotel di kawasan Nagoya dan Batam Kota. Tim staf kami siap standby tepat waktu sesuai jadwal kedatangan tiket kapal atau pesawat Anda.',
    answerEn:
      'Yes, 100% FREE! We offer complimentary vehicle handover and return directly at Hang Nadim International Airport (BTH), Batam Center Ferry Terminal, Harbour Bay Ferry Terminal, Sekupang, Nongsapura, and all major hotels across Nagoya and Batam Center. Our team monitors your arrival time to ensure a punctual and smooth handover.'
  },
  {
    category: 'turis',
    questionId: 'Bagaimana cara turis dari Singapura & Malaysia menyewa mobil di Batam?',
    questionEn: 'How can tourists from Singapore & Malaysia rent a car easily in Batam?',
    answerId:
      'Sangat praktis! Anda bisa memesan unit sebelum berangkat dari Singapura atau Malaysia melalui WhatsApp kami. Kami menerima pembayaran transfer bank, PayNow, maupun uang tunai IDR & SGD saat mobil diserahkan. Saat Anda tiba di Pelabuhan Ferry Batam Center atau Harbour Bay, tim kami sudah menunggu dengan mobil yang bersih dan siap pakai.',
    answerEn:
      'Very easy! You can reserve your preferred car in advance via WhatsApp before taking the ferry from Singapore (HarbourFront / Tanah Merah) or Malaysia. We accept cashless payments, PayNow, and cash (IDR / SGD) upon car handover. When you walk out of the Batam arrival hall, our representative will meet you immediately with the vehicle ready to drive.'
  },
  {
    category: 'layanan',
    questionId: 'Apakah tersedia sewa mobil dengan supir profesional untuk dinas / VIP?',
    questionEn: 'Is chauffeur-driven service available for executive business & VIPs?',
    answerId:
      'Tentu saja. Kami menyediakan paket mobil dengan supir profesional, berpengalaman, ramah, dan menguasai seluruh rute protokol di Batam. Pilihan unit favorit untuk dinas dan VIP meliputi Toyota Alphard VIP Transformer, Toyota Innova Zenix Hybrid, Toyota Fortuner GR Sport, dan Toyota HiAce Commuter (14–16 penumpang) untuk delegasi atau rombongan keluarga besar.',
    answerEn:
      'Absolutely. We provide executive chauffeur services with courteous, polite, and punctual drivers who know Batam routes inside and out. Popular executive choices include Toyota Alphard VIP Transformer, Toyota Innova Zenix Hybrid, Fortuner GR Sport, and Toyota HiAce Commuter (14-16 seats) for corporate delegations, ministerial visits, and family holidays.'
  },
  {
    category: 'layanan',
    questionId: 'Bagaimana perhitungan durasi sewa 24 jam dan jaminan kebersihan unit?',
    questionEn: 'How does the 24-hour rental duration work and what are the vehicle cleanliness standards?',
    answerId:
      'Sewa lepas kunci dihitung per 24 jam penuh sejak jam serah terima mobil (contoh: serah terima jam 09.00 pagi, maka batas kembali adalah jam 09.00 pagi keesokan harinya). Seluruh armada L.A Travel Batam selalu dicuci bersih, interior disanitasi wangi, ber-AC dingin prima, dan menjalani pengecekan mekanik sebelum diserahkan demi kenyamanan perjalanan Anda.',
    answerEn:
      'Self-drive rental operates on a full 24-hour cycle calculated from the exact handover time (e.g. pickup at 9:00 AM, return by 9:00 AM the next day). All vehicles are thoroughly sanitized, smelling fresh, fully air-conditioned, and undergo strict pre-trip safety checks before being handed over to guarantee your peace of mind.'
  }
];

export const FAQSection: React.FC = () => {
  const { language } = useLanguage();
  const { settings } = useFleet();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const isEn = language === 'en';

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#F5F5F7] dark:bg-[#000000] border-b border-black/5 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#B8860B] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3.5 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{isEn ? 'Frequently Asked Questions' : 'Tanya Jawab Seputar Rental Mobil Batam'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-4 text-balance">
            {isEn ? (
              <>Everything You Need to Know About <span className="text-[#B8860B] dark:text-[#D4AF37]">Car Rental in Batam</span></>
            ) : (
              <>Pertanyaan Umum Seputar <span className="text-[#B8860B] dark:text-[#D4AF37]">Sewa Mobil di Batam</span></>
            )}
          </h2>

          <p className="text-slate-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed text-balance">
            {isEn
              ? 'Find quick answers regarding rental requirements, rates, airport & ferry terminal delivery, payment methods, and chauffeur packages.'
              : 'Informasi lengkap mengenai harga, persyaratan sewa lepas kunci, gratis antar-jemput bandara & pelabuhan ferry, hingga layanan supir.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            const qText = isEn ? item.questionEn : item.questionId;
            const aText = isEn ? item.answerEn : item.answerId;

            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? 'bg-white dark:bg-[#151518] border-[#D4AF37]/40 shadow-md'
                    : 'bg-white/80 dark:bg-[#111114] border-black/5 dark:border-white/10 hover:border-black/15 dark:hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-5 px-6 sm:px-7 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-[#1D1D1F] dark:text-white leading-snug">
                    {qText}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#D4AF37] text-black rotate-180'
                        : 'bg-black/5 dark:bg-white/10 text-slate-700 dark:text-neutral-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 text-slate-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed border-t border-black/5 dark:border-white/5">
                    <p>{aText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-black via-[#161618] to-black border border-[#D4AF37]/30 text-white text-center shadow-xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] mb-4">
            <MessageCircle className="w-6 h-6 fill-[#25D366] text-[#25D366]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            {isEn ? 'Have More Questions or Need an Instant Quote?' : 'Punya Pertanyaan Lain atau Butuh Estimasi Harga?'}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mb-6">
            {isEn
              ? 'Our bilingual customer care is available 24/7 on WhatsApp. Feel free to ask about custom itineraries, bulk bookings, or specific vehicle availability.'
              : 'Tim customer support L.A Travel Batam siap membantu 24 jam via WhatsApp. Jangan ragu bertanya seputar rute wisata, sewa mingguan, atau stok mobil hari ini.'}
          </p>

          <a
            href={getGeneralInquiryUrl('Konsultasi FAQ & Pertanyaan Khusus', language, settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pressable inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BA59] text-[#06240E] font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-[#06240E] text-[#06240E]" />
            <span>{isEn ? 'Chat WhatsApp Support (24/7)' : 'Tanya Admin via WhatsApp (24 Jam)'}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
