import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useFleet } from '../../context/FleetContext';
import { injectDynamicSEO, injectJsonLd, generateTouristTripJsonLd, generateTravelAgencyJsonLd, generateFaqJsonLd } from '../../utils/seo';

interface SEOHeadProps {
  customTitle?: string;
  customDescription?: string;
  canonicalPath?: string;
  pageType?: 'website' | 'article';
}

/**
 * Layout / Template Component untuk menyuntikkan SEO dinamis, canonical URL bersih,
 * multilingual hreflang (id-ID, en-SG, en-MY), dan Schema.org JSON-LD Rich Snippet
 * (TouristTrip, Product, AggregateRating, TravelAgency) secara terpusat.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  customTitle,
  customDescription,
  canonicalPath,
  pageType = 'website'
}) => {
  const { language } = useLanguage();
  const { selectedCarForDetail } = useFleet();

  useEffect(() => {
    const isEn = language === 'en';

    // 1. Jika pengguna membuka modal detail mobil / armada paket wisata tertentu
    if (selectedCarForDetail) {
      const carName = selectedCarForDetail.name;
      const category = selectedCarForDetail.category;
      const price = selectedCarForDetail.price_start_from;

      const dynamicTitle = isEn
        ? `Rent ${carName} in Batam (${category}) – From ${price} | L.A Transport Batam`
        : `Sewa ${carName} di Batam (${category}) Mulai ${price} | L.A Transport Batam`;

      const dynamicDescription = isEn
        ? selectedCarForDetail.description_en ||
          `Rent ${carName} in Batam starting from ${price}/day. Available for self-drive or with professional chauffeur. Free delivery to airport & ferry terminal.`
        : selectedCarForDetail.description_id ||
          `Sewa ${carName} di Batam mulai dari ${price}/hari. Tersedia pilihan lepas kunci atau dengan supir profesional L.A Transport. Gratis antar-jemput bandara & pelabuhan!`;

      // Suntikkan Dynamic Head SEO dengan canonical URL spesifik armada
      injectDynamicSEO({
        title: customTitle || dynamicTitle,
        description: customDescription || dynamicDescription,
        canonicalPath: canonicalPath || `/armada/${selectedCarForDetail.id}`,
        imageUrl: selectedCarForDetail.image_url,
        type: 'article',
        lang: language
      });

      // Suntikkan JSON-LD Rich Snippet khusus paket wisata (TouristTrip + Product Schema)
      const tripSchema = generateTouristTripJsonLd(selectedCarForDetail, language);
      injectJsonLd(tripSchema, 'json-ld-tourist-trip');
      return;
    }

    // 2. Jika sedang berada di halaman Standalone Admin
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      injectDynamicSEO({
        title: 'Admin CMS Portal | L.A Transport Batam',
        description: 'Pusat pengelolaan armada, tarif sewa, dan kontak admin L.A Transport Batam.',
        canonicalPath: '/admin',
        type: 'website',
        lang: language
      });
      // Hapus atau reset snippet paket wisata di halaman admin
      injectJsonLd({}, 'json-ld-tourist-trip');
      return;
    }

    // 3. Cek apakah berada di Halaman Landing SEO Spesifik
    const currentPath = typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') : '';
    const seoLandingMap: Record<string, { title: string; desc: string; lang?: 'id' | 'en' }> = {
      '/rental-mobil-batam-lepas-kunci': {
        title: 'Rental Mobil Batam Lepas Kunci 24 Jam Murah | L.A Transport Batam',
        desc: 'Pusat rental mobil Batam lepas kunci 24 jam syarat mudah & harga murah mulai Rp 300.000/hari. Unit Agya, Brio, Avanza, Xpander, Innova Zenix. Gratis antar Bandara & Ferry!',
        lang: 'id'
      },
      '/sewa-mobil-supir-batam': {
        title: 'Sewa Mobil Include Supir & BBM di Batam (All-In) | L.A Transport Batam',
        desc: 'Paket sewa mobil dengan supir ramah & BBM (All-In 12 Jam) untuk tour wisata Batam, Jembatan Barelang, Nagoya, & tamu dinas VIP. Unit Alphard, Zenix, Fortuner, HiAce.',
        lang: 'id'
      },
      '/antar-jemput-bandara-hang-nadim-batam': {
        title: 'Rental Mobil Bandara Hang Nadim & Pelabuhan Ferry Batam | L.A Transport Batam',
        desc: 'Layanan rental mobil & drop-off antar-jemput gratis di Bandara Internasional Hang Nadim (BTH), Pelabuhan Ferry Batam Center, & Harbour Bay. Standby 24 jam tepat waktu!',
        lang: 'id'
      },
      '/batam-car-rental-with-driver': {
        title: 'Batam Car Rental with Driver & Self Drive (From SGD 25) | L.A Transport Batam',
        desc: 'Top-rated Batam car rental with polite English-speaking private driver or 24-hour self-drive. Free pickup at Batam Center & Harbour Bay Ferry Terminals. Book via WhatsApp!',
        lang: 'en'
      },
      '/tips-rental-mobil-batam-lepas-kunci': {
        title: 'Syarat & Tips Aman Rental Mobil Batam Lepas Kunci 24 Jam | L.A Transport Batam',
        desc: 'Panduan lengkap syarat sewa mobil lepas kunci 24 jam di Batam tanpa deposit untuk wisatawan & dinas. Gratis antar jemput Bandara Hang Nadim & Pelabuhan Ferry Batam.',
        lang: 'id'
      },
      '/panduan-wisata-jembatan-barelang-batam': {
        title: 'Panduan Wisata Jembatan Barelang & Seafood Kelong Batam | L.A Transport Batam',
        desc: 'Rute perjalanan, waktu sunset terbaik di Jembatan 1 Barelang, rekomendasi restoran seafood kelong terbaik, serta tarif sewa mobil + supir 12 jam di Batam.',
        lang: 'id'
      },
      '/tarif-antar-jemput-bandara-hang-nadim-pelabuhan-ferry-batam': {
        title: 'Tarif Sewa Mobil & Antar Jemput Bandara Hang Nadim & Ferry Batam | L.A Transport Batam',
        desc: 'Informasi lengkap transportasi, estimasi waktu tempuh, dan layanan rental mobil gratis antar-jemput di Bandara Hang Nadim, Pelabuhan Batam Center & Harbour Bay.',
        lang: 'id'
      }
    };

    const matchedLanding = seoLandingMap[currentPath];

    // 4. Tampilan Halaman Utama / Katalog Umum (Schema.org TravelAgency / AutoRental)
    const defaultTitle = matchedLanding
      ? matchedLanding.title
      : isEn
      ? 'Batam Car Rental with Driver & Self Drive | L.A Transport Batam'
      : 'Rental Mobil Batam Lepas Kunci & Include Supir | L.A Transport Batam';

    const defaultDescription = matchedLanding
      ? matchedLanding.desc
      : isEn
      ? 'Premier Batam car rental with polite English-speaking driver & self-drive options. Luxury Alphard VIP, Innova Zenix Hybrid, Veloz, HiAce. Free ferry terminal & airport delivery!'
      : 'Rental mobil Batam lepas kunci 24 jam murah & sewa mobil include supir VIP. Unit Alphard, Innova Zenix, Veloz, HiAce. Gratis antar-jemput Pelabuhan Ferry & Bandara Batam!';

    injectDynamicSEO({
      title: customTitle || defaultTitle,
      description: customDescription || defaultDescription,
      canonicalPath: canonicalPath || (matchedLanding ? currentPath : '/'),
      imageUrl: '/images/og_share_preview.jpg',
      type: pageType,
      lang: matchedLanding?.lang || language
    });

    // Suntikkan Schema.org TravelAgency / AutoRental
    const agencySchema = generateTravelAgencyJsonLd();
    injectJsonLd(agencySchema, 'json-ld-tourist-trip');

    // Suntikkan Schema.org FAQPage untuk memicu Google FAQ Rich Snippets
    const faqSchema = generateFaqJsonLd(language);
    injectJsonLd(faqSchema, 'json-ld-faq');
  }, [language, selectedCarForDetail, customTitle, customDescription, canonicalPath, pageType]);

  return null;
};
