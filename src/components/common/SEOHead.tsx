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
        ? `Rent ${carName} in Batam (${category}) | L.A Travel`
        : `Sewa ${carName} di Batam (${category}) | L.A Travel Batam`;

      const dynamicDescription = isEn
        ? selectedCarForDetail.description_en ||
          `Rent ${carName} in Batam starting from ${price}/day. Available for self-drive or with professional chauffeur. Free delivery to airport & ferry terminal.`
        : selectedCarForDetail.description_id ||
          `Sewa ${carName} di Batam mulai dari ${price}/hari. Tersedia pilihan lepas kunci atau dengan supir profesional L.A Travel. Gratis antar-jemput bandara & pelabuhan!`;

      // Suntikkan Dynamic Head SEO
      injectDynamicSEO({
        title: customTitle || dynamicTitle,
        description: customDescription || dynamicDescription,
        canonicalPath: canonicalPath || '/',
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
        title: 'Admin CMS Portal | L.A Travel Batam',
        description: 'Pusat pengelolaan armada, tarif sewa, dan kontak admin L.A Travel Batam.',
        canonicalPath: '/admin',
        type: 'website',
        lang: language
      });
      // Hapus atau reset snippet paket wisata di halaman admin
      injectJsonLd({}, 'json-ld-tourist-trip');
      return;
    }

    // 3. Tampilan Halaman Utama / Katalog Umum (Schema.org TravelAgency / AutoRental)
    const defaultTitle = isEn
      ? 'L.A Travel Batam – Premium Car Rental & Travel in Batam Island'
      : 'L.A Travel Batam | Rental Mobil & Travel Terpercaya di Batam';

    const defaultDescription = isEn
      ? 'Top-rated car rental and tour travel in Batam. Rent Toyota Alphard VIP, Innova Zenix, Veloz, HiAce. Self-drive or with polite English-speaking chauffeur. Free airport & ferry pickup!'
      : 'Pusat sewa dan rental mobil terbaik di Batam. Pilihan unit prima (Innova, Alphard VIP, Veloz, HiAce), lepas kunci atau dengan supir ramah. Reservasi cepat via WhatsApp!';

    injectDynamicSEO({
      title: customTitle || defaultTitle,
      description: customDescription || defaultDescription,
      canonicalPath: canonicalPath || '/',
      imageUrl: '/images/og_share_preview.jpg',
      type: pageType,
      lang: language
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
