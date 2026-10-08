import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface Translations {
  nav: {
    cars: string;
    services: string;
    whyUs: string;
    coverage: string;
    terms: string;
    faq: string;
    chatAdmin: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    ctaWhatsapp: string;
    ctaCatalog: string;
    freePickup: string;
    freePickupSub: string;
    cleanVehicles: string;
    cleanVehiclesSub: string;
    support24: string;
    support24Sub: string;
    transparentTerms: string;
    transparentTermsSub: string;
  };
  catalog: {
    tag: string;
    title: string;
    subtitle: string;
    categories: {
      all: string;
      vip: string;
      premium: string;
      family: string;
      group: string;
    };
    packageLabel: string;
    selfDrive: string;
    withDriver: string;
    startingFrom: string;
    perDay: string;
    rentViaWa: string;
    customInquiryTitle: string;
    customInquiryDesc: string;
    customInquiryBtn: string;
  };
  whyUs: {
    tag: string;
    title: string;
    subtitle: string;
    points: Array<{
      title: string;
      desc: string;
    }>;
    termsTag: string;
    termsTitle: string;
    termsDesc: string;
    termsItems: string[];
    termsBtn: string;
  };
  footer: {
    about: string;
    quickLinks: string;
    contact: string;
    response24: string;
    response24Desc: string;
    chatNow: string;
    rights: string;
    tagline: string;
  };
  floatingWa: {
    badge: string;
    title: string;
    desc: string;
    chatBtn: string;
    defaultMsg: string;
  };
}

const translations: Record<Language, Translations> = {
  id: {
    nav: {
      cars: 'Katalog Armada',
      services: 'Paket & Wisata',
      coverage: 'Area Layanan',
      whyUs: 'Keunggulan',
      terms: 'Syarat Sewa',
      faq: 'FAQ & Bantuan',
      chatAdmin: 'Chat WhatsApp'
    },
    hero: {
      badge: 'Rental Mobil #1 Pilihan Wisatawan & Pebisnis di Batam',
      titlePart1: 'Rental Mobil Premium & Nyaman di ',
      titleHighlight: 'Kota Batam',
      subtitle: 'Pilihan armada prima mulai dari Alphard VIP, Innova Zenix Hybrid, hingga mobil keluarga hemat. Siap antar-jemput di Bandara Hang Nadim & seluruh Pelabuhan Ferry Batam (Harbour Bay & Batam Center).',
      ctaWhatsapp: 'Hubungi via WhatsApp',
      ctaCatalog: 'Lihat Daftar Armada',
      freePickup: 'Antar-Jemput Gratis',
      freePickupSub: 'Bandara & Pelabuhan Batam',
      cleanVehicles: 'Unit Wangi & Prima',
      cleanVehiclesSub: 'Servis Berkala Resmi',
      support24: 'Respon Cepat 24 Jam',
      support24Sub: 'Booking Instan Tanpa Ribet',
      transparentTerms: 'Syarat Transparan',
      transparentTermsSub: 'Tanpa Biaya Tersembunyi'
    },
    catalog: {
      tag: 'PILIHAN ARMADA TERBAIK',
      title: 'Katalog Mobil Rental Batam Siap Pakai',
      subtitle: 'Semua armada ber-AC dingin, bersih, wangi, dan terawat. Tersedia opsi Lepas Kunci maupun Dengan Supir Berpengalaman.',
      categories: {
        all: 'Semua',
        vip: 'VIP Luxury Van',
        premium: 'Premium MPV',
        family: 'Family MPV',
        group: 'Minibus Rombongan'
      },
      packageLabel: 'Pilihan Layanan:',
      allPackages: 'Semua Armada',
      selfDrive: 'Lepas Kunci',
      withDriver: 'Include Supir & BBM',
      startingFrom: 'Mulai dari',
      perDay: '/ hari',
      rentViaWa: 'Sewa Unit via WA',
      customInquiryTitle: 'Butuh mobil tipe lain atau sewa jangka panjang / korporat?',
      customInquiryDesc: 'Tersedia layanan sewa mingguan & bulanan untuk perusahaan, ekspatriat, dan acara kenegaraan di Batam.',
      customInquiryBtn: 'Konsultasi Sewa Korporat'
    },
    whyUs: {
      tag: 'STANDAR KUALITAS L.A TRAVEL',
      title: 'Mengapa Wisatawan & Eksekutif Memilih Kami?',
      subtitle: 'Kenyamanan, keamanan, dan ketepatan waktu adalah prioritas utama kami untuk perjalanan Anda di Batam.',
      points: [
        {
          title: 'Free Delivery Bandara Hang Nadim',
          desc: 'Unit kami antarkan langsung saat pesawat Anda mendarat (BTH). Tanpa antre taksi, langsung siap jalan.'
        },
        {
          title: 'Antar-Jemput Pelabuhan Ferry Internasional',
          desc: 'Tersedia di Batam Center Ferry Terminal, Harbour Bay, Sekupang, dan Nongsapura untuk turis Singapura/Malaysia.'
        },
        {
          title: 'Kondisi Armada Terjamin Prima',
          desc: 'Service berkala di bengkel resmi, AC double blower dingin, kabin higienis wangi, dan ban tebal aman berkendara.'
        },
        {
          title: 'Syarat Lepas Kunci Mudah & Cepat',
          desc: 'Verifikasi dokumen instan (KTP/Paspor, SIM A, dan tiket/voucher hotel). Proses selesai dalam 15 menit.'
        },
        {
          title: 'Asuransi & Dukungan Darurat 24 Jam',
          desc: 'Tim mekanik dan unit cadangan siap siaga di seluruh wilayah Batam jika timbul kendala teknis.'
        },
        {
          title: 'Driver Ramah & Paham Rute Wisata',
          desc: 'Pilihan supir berpengalaman, sopan, non-smoking, dan siap memandu rute kuliner seafood serta spot foto Batam.'
        }
      ],
      termsTag: 'PROSES SEDERHANA',
      termsTitle: 'Persyaratan Sewa Lepas Kunci di Batam',
      termsDesc: 'Kami menerapkan verifikasi praktis tanpa birokrasi berbelit:',
      termsItems: [
        'Foto KTP Asli / Paspor (WNA / Turis Asing)',
        'Foto SIM A yang masih berlaku',
        'Bukti Tiket Pesawat atau Tiket Ferry ke Batam',
        'Bukti Reservasi Hotel atau Penginapan'
      ],
      termsBtn: 'Verifikasi Syarat via WhatsApp'
    },
    footer: {
      about: 'Penyedia layanan rental dan sewa mobil terpercaya di Batam. Melayani wisatawan domestik, turis mancanegara (Singapura/Malaysia), dan kunjungan bisnis.',
      quickLinks: 'Navigasi Cepat',
      contact: 'Kontak & Lokasi',
      response24: 'Butuh Respons Instan?',
      response24Desc: 'Hubungi admin WhatsApp sekarang untuk cek stok mobil dan penawaran terbaik hari ini.',
      chatNow: 'Chat WhatsApp 24 Jam',
      rights: 'Seluruh hak cipta dilindungi.',
      tagline: 'Layanan Rental Mobil Batam Terpercaya · Solusi Perjalanan Tanpa Kendala'
    },
    floatingWa: {
      badge: 'Konsultasi Sewa Cepat',
      title: 'Admin L.A Travel Batam',
      desc: 'Butuh sewa mendesak atau jemputan di bandara/pelabuhan Batam? Kami aktif 24 jam untuk melayani Anda.',
      chatBtn: 'Chat WhatsApp Sekarang',
      defaultMsg: 'Halo Admin L.A Travel Batam, saya ingin tanya ketersediaan unit rental mobil hari ini.'
    }
  },
  en: {
    nav: {
      cars: 'Fleet Catalog',
      services: 'Packages & Tours',
      coverage: 'Service Areas',
      whyUs: 'Why Choose Us',
      terms: 'Requirements',
      faq: 'FAQ',
      chatAdmin: 'Chat WhatsApp'
    },
    hero: {
      badge: '#1 Car Rental Choice for Tourists & Business Travelers in Batam',
      titlePart1: 'Premium & Reliable Car Rental in ',
      titleHighlight: 'Batam Island',
      subtitle: 'Premium fleet including Toyota Alphard VIP, Innova Zenix Hybrid, and economical family MPVs. Free pickup & delivery at Hang Nadim Airport and International Ferry Terminals (Harbour Bay & Batam Center).',
      ctaWhatsapp: 'Book via WhatsApp',
      ctaCatalog: 'Explore Fleet',
      freePickup: 'Free Delivery / Pickup',
      freePickupSub: 'Airport & Ferry Terminals',
      cleanVehicles: 'Pristine & Sanitized',
      cleanVehiclesSub: 'Authorized Dealer Maintained',
      support24: '24/7 Fast Response',
      support24Sub: 'Instant Hassle-Free Booking',
      transparentTerms: 'Transparent Rates',
      transparentTermsSub: 'No Hidden Surcharges'
    },
    catalog: {
      tag: 'OUR PREMIUM SELECTION',
      title: 'Ready-to-Drive Batam Rental Fleet',
      subtitle: 'All vehicles are well-maintained, sanitized, fully air-conditioned, and insured. Choose Self-Drive or Chauffeur-Driven options.',
      categories: {
        all: 'All',
        vip: 'VIP Luxury Van',
        premium: 'Premium MPV',
        family: 'Family MPV',
        group: 'Minibus / Coach'
      },
      packageLabel: 'Service Option:',
      allPackages: 'All Fleet',
      selfDrive: 'Self-Drive',
      withDriver: 'Include Driver & Fuel',
      startingFrom: 'From',
      perDay: '/ day',
      rentViaWa: 'Book via WhatsApp',
      customInquiryTitle: 'Looking for a different model or long-term corporate rental?',
      customInquiryDesc: 'We offer weekly and monthly lease packages for corporations, expats, and state visits in Batam.',
      customInquiryBtn: 'Inquire Corporate Lease'
    },
    whyUs: {
      tag: 'EXCELLENCE & RELIABILITY',
      title: 'Why International Travelers & Executives Choose Us',
      subtitle: 'Your comfort, safety, and punctual transportation are our top priorities throughout Batam Island.',
      points: [
        {
          title: 'Free Delivery to Hang Nadim Airport (BTH)',
          desc: 'Your vehicle will be ready right as you step out of the arrival hall. Skip taxi lines and drive away immediately.'
        },
        {
          title: 'Pickup at International Ferry Terminals',
          desc: 'Seamless transfers from Batam Center, Harbour Bay, Sekupang, and Nongsapura for guests arriving from Singapore or Malaysia.'
        },
        {
          title: 'Pristine & Regularly Serviced Fleet',
          desc: 'Serviced strictly at authorized dealerships, ice-cold double-blower AC, fresh interior, and optimal tire treads.'
        },
        {
          title: 'Quick & Simple Self-Drive Verification',
          desc: 'Rapid document check (Passport/ID, valid driving license, and ferry/hotel booking). Approved within 15 minutes.'
        },
        {
          title: 'Full Insurance & 24/7 Roadside Assistance',
          desc: 'On-call mechanics and backup replacement vehicles stationed across Batam in case of any road emergencies.'
        },
        {
          title: 'Courteous English-Speaking Drivers',
          desc: 'Experienced, polite, non-smoking chauffeurs who know the best local seafood gems and Batam landmarks.'
        }
      ],
      termsTag: 'SIMPLE VERIFICATION',
      termsTitle: 'Self-Drive Rental Requirements in Batam',
      termsDesc: 'We make renting smooth with straightforward verification for international & local guests:',
      termsItems: [
        'Valid Passport (International Travelers) or National ID Card',
        'Valid Driving License (International or Home Country)',
        'Proof of Flight or Ferry Ticket to Batam',
        'Confirmed Hotel / Accommodation Booking Voucher'
      ],
      termsBtn: 'Verify Requirements on WhatsApp'
    },
    footer: {
      about: 'Premier car rental and executive transfer provider in Batam Island. Serving tourists from Singapore, Malaysia, and international business delegates.',
      quickLinks: 'Quick Links',
      contact: 'Contact & Location',
      response24: 'Need an Instant Response?',
      response24Desc: 'Message our WhatsApp support team now to check fleet availability and special rates for today.',
      chatNow: '24/7 WhatsApp Chat',
      rights: 'All rights reserved.',
      tagline: 'Trusted Batam Car Rental Service · Smooth Journeys Guaranteed'
    },
    floatingWa: {
      badge: 'Quick Rental Support',
      title: 'L.A Travel Batam Desk',
      desc: 'Need an urgent rental or pickup at Batam ferry terminal/airport? Our bilingual desk is available 24/7.',
      chatBtn: 'Chat on WhatsApp Now',
      defaultMsg: 'Hello L.A Travel Batam, I would like to inquire about car rental availability in Batam today.'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  try {
    // 1. Jika pengunjung pernah memilih bahasa secara manual sebelumnya
    const saved = localStorage.getItem('la_transport_lang');
    if (saved === 'en' || saved === 'id') {
      return saved;
    }

    // 2. Deteksi otomatis dari preferensi bahasa browser/perangkat
    if (typeof navigator !== 'undefined') {
      const browserLanguages = navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || ''];

      // Jika perangkat menggunakan Bahasa Indonesia (id, id-ID, id-*, dll) -> gunakan Bahasa Indonesia
      const isIndonesian = browserLanguages.some((lang) =>
        lang && lang.toLowerCase().startsWith('id')
      );

      if (isIndonesian) {
        return 'id';
      }

      // Jika turis asing / internasional (Singapura en-SG, Malaysia en-MY, global tourist) -> otomatis Bahasa Inggris
      return 'en';
    }
  } catch {
    // fallback safe
  }
  return 'id';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('la_transport_lang', lang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
