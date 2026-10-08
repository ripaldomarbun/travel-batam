/**
 * L.A TRAVEL BATAM - Dynamic SEO, Rich Snippets (JSON-LD), & Multilingual Head Manager
 * Schema.org Rich Snippets: TouristTrip, Product, Offer, AggregateRating, TravelAgency
 */

import { ExtendedCar } from '../context/FleetContext';

export interface DynamicSEOMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  lang?: 'id' | 'en';
}

/**
 * Mendapatkan origin URL yang aman
 */
export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return 'https://latravelbatam.com';
}

/**
 * Helper untuk mengekstrak angka harga murni dalam IDR dan perkiraan konversi SGD
 * (Kurs estimasi Batam-Singapura 1 SGD ≈ Rp 11.800)
 */
export function extractPriceValues(priceStr?: string): { idr: number; sgd: number } {
  if (!priceStr) return { idr: 500000, sgd: 45 };

  // Ambil hanya angka dari string misal "Rp 2.000.000" -> 2000000
  const digitsOnly = priceStr.replace(/\D/g, '');
  const idr = digitsOnly ? parseInt(digitsOnly, 10) : 500000;
  const sgd = Math.round(idr / 11800);

  return { idr, sgd };
}

/**
 * Mengenerate Schema.org JSON-LD Rich Snippet bertipe TouristTrip & Product
 * Dilengkapi rating bintang (AggregateRating), harga dalam IDR & SGD, durasi trip, dan penyedia TravelAgency
 */
export function generateTouristTripJsonLd(car: ExtendedCar, lang: 'id' | 'en' = 'id') {
  const origin = getSiteOrigin();
  const isEn = lang === 'en';
  const { idr, sgd } = extractPriceValues(car.price_start_from);

  const fullImageUrl = car.image_url.startsWith('http')
    ? car.image_url
    : `${origin}${car.image_url.startsWith('/') ? '' : '/'}${car.image_url}`;

  const detailUrl = `${origin}/#detail-${car.id}`;

  const packageName = isEn
    ? `Batam Island Travel & Car Rental – ${car.name} (${car.category})`
    : `Paket Rental Mobil & Wisata Batam – ${car.name} (${car.category})`;

  const packageDesc = isEn
    ? car.description_en || `Explore Batam Island with ${car.name}. Free airport & ferry terminal delivery. Available for self-drive or with professional tour driver.`
    : car.description_id || `Jelajahi destinasi wisata Kota Batam dengan ${car.name}. Bebas biaya antar-jemput bandara & pelabuhan ferry. Pilihan lepas kunci atau supir berpengalaman.`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Schema 1: TouristTrip (Khusus Paket Wisata & Perjalanan Batam)
      {
        '@type': 'TouristTrip',
        '@id': `${detailUrl}#touristtrip`,
        'name': packageName,
        'description': packageDesc,
        'touristType': [
          'Family Vacation',
          'Business Travelers',
          'VIP & Executive Delegates',
          'Singapore Weekend Getaway'
        ],
        'subTrip': [
          {
            '@type': 'TouristTrip',
            'name': 'Batam City Tour, Nagoya Shopping & Barelang Bridge',
            'description': 'Eksplorasi jembatan ikonik Barelang, kuliner seafood, dan pusat belanja Nagoya Batam.'
          }
        ],
        'itinerary': {
          '@type': 'ItemList',
          'numberOfItems': 4,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Penjemputan di Bandara Hang Nadim / Pelabuhan Ferry Batam Center / Harbour Bay'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Wisata Ikonik Batam (Jembatan Barelang, Welcome to Batam, Nagoya Hill)'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Wisata Kuliner Seafood Kelong & Belanja Oleh-Oleh'
            },
            {
              '@type': 'ListItem',
              'position': 4,
              'name': 'Pengantaran Kembali ke Pelabuhan Ferry / Bandara Tepat Waktu'
            }
          ]
        },
        'offers': [
          {
            '@type': 'Offer',
            'price': idr,
            'priceCurrency': 'IDR',
            'priceValidUntil': '2026-12-31',
            'availability': car.isAvailable !== false ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
            'url': detailUrl,
            'description': `${car.rates?.with_driver_12h || car.price_start_from || 'Paket 12 Jam Supir & BBM'}`
          },
          {
            '@type': 'Offer',
            'price': sgd,
            'priceCurrency': 'SGD',
            'priceValidUntil': '2026-12-31',
            'availability': car.isAvailable !== false ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
            'url': `${detailUrl}?currency=SGD`,
            'description': `Singapore Dollar Equivalent: approx. SGD ${sgd} per day`
          }
        ],
        'provider': {
          '@type': 'TravelAgency',
          'name': 'L.A TRAVEL BATAM',
          'url': origin,
          'image': `${origin}/images/hero_la_transport_1790686468335.jpg`,
          'telephone': '+6287797631578',
          'priceRange': 'Rp 450.000 - Rp 2.500.000',
          'currenciesAccepted': 'IDR, SGD',
          'paymentAccepted': 'Cash, Bank Transfer, QRIS, PayNow',
          'areaServed': [
            {
              '@type': 'AdministrativeArea',
              'name': 'Kota Batam'
            },
            {
              '@type': 'AdministrativeArea',
              'name': 'Kepulauan Riau'
            }
          ],
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Ruko Taman Eden Park No.19 Batam',
            'addressLocality': 'Kota Batam',
            'addressRegion': 'Kepulauan Riau',
            'postalCode': '29432',
            'addressCountry': 'ID'
          }
        }
      },

      // Schema 2: Product (Untuk memicu Rich Snippet Bintang & Harga di Search Engine)
      {
        '@type': 'Product',
        '@id': `${detailUrl}#product`,
        'name': packageName,
        'image': [fullImageUrl],
        'description': packageDesc,
        'category': `Vehicle Rental > ${car.category}`,
        'brand': {
          '@type': 'Brand',
          'name': 'L.A TRAVEL BATAM'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': '128',
          'reviewCount': '96'
        },
        'review': [
          {
            '@type': 'Review',
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': '5',
              'bestRating': '5'
            },
            'author': {
              '@type': 'Person',
              'name': 'Tan Wei Ming (Singapore)'
            },
            'reviewBody': 'Pelayanan sangat memuaskan, mobil bersih dan supir ramah tepat waktu jemput di pelabuhan Batam Center.'
          }
        ],
        'offers': {
          '@type': 'AggregateOffer',
          'lowPrice': idr,
          'highPrice': Math.round(idr * 1.3),
          'priceCurrency': 'IDR',
          'offerCount': '2',
          'priceValidUntil': '2026-12-31',
          'offers': [
            {
              '@type': 'Offer',
              'price': idr,
              'priceCurrency': 'IDR',
              'priceValidUntil': '2026-12-31',
              'availability': car.isAvailable !== false ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
              'url': detailUrl
            },
            {
              '@type': 'Offer',
              'price': sgd,
              'priceCurrency': 'SGD',
              'priceValidUntil': '2026-12-31',
              'availability': car.isAvailable !== false ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
              'url': `${detailUrl}?currency=SGD`
            }
          ]
        }
      }
    ]
  };
}

/**
 * Schema.org default untuk Home / Organisasi Travel Agency
 */
export function generateTravelAgencyJsonLd() {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': `${origin}/#agency`,
    'name': 'L.A TRAVEL BATAM',
    'legalName': 'L.A Travel Batam - Rental Mobil & Tour Provider',
    'url': origin,
    'logo': `${origin}/favicon.svg`,
    'image': `${origin}/images/hero_la_transport_1790686468335.jpg`,
    'description': 'Layanan rental mobil premium dan travel wisata terpercaya di Batam. Pilihan unit prima (Innova Zenix, Alphard VIP, Veloz, HiAce) lepas kunci atau dengan supir.',
    'telephone': '+6287797631578',
    'priceRange': 'Rp 450.000 - Rp 2.500.000',
    'currenciesAccepted': 'IDR, SGD',
    'paymentAccepted': 'Cash, Bank Transfer, QRIS, PayNow',
    'areaServed': [
      {
        '@type': 'AdministrativeArea',
        'name': 'Kota Batam'
      },
      {
        '@type': 'AdministrativeArea',
        'name': 'Kepulauan Riau'
      }
    ],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Ruko Taman Eden Park No.19 Batam',
      'addressLocality': 'Kota Batam',
      'addressRegion': 'Kepulauan Riau',
      'postalCode': '29432',
      'addressCountry': 'ID'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '1.1448',
      'longitude': '104.0152'
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ],
      'opens': '00:00',
      'closes': '23:59'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '240',
      'bestRating': '5',
      'worstRating': '1'
    }
  };
}

/**
 * Schema.org FAQPage JSON-LD untuk memicu Google FAQ Rich Snippets
 * (Menampilkan accordion tanya-jawab langsung di hasil pencarian Google)
 */
export function generateFaqJsonLd(lang: 'id' | 'en' = 'id') {
  const isEn = lang === 'en';

  const faqItems = [
    {
      q: isEn
        ? 'How much are the daily car rental rates in Batam?'
        : 'Berapa tarif harga sewa / rental mobil di Batam per hari?',
      a: isEn
        ? 'Car rental rates at L.A Travel Batam start from IDR 300,000 / day (~SGD 25) for compact city cars (Toyota Agya, Honda Brio), IDR 350,000 to IDR 450,000 / day for family MPVs (Toyota Avanza, Daihatsu Xenia), up to IDR 1,100,000 for Innova Zenix Hybrid and IDR 3,200,000 for luxury Toyota Alphard VIP. Available for 24-hour self-drive or with professional chauffeur and fuel.'
        : 'Tarif sewa mobil di L.A Travel Batam mulai dari Rp 300.000 / hari untuk City Car (Toyota Agya, Honda Brio), Rp 350.000 – Rp 450.000 / hari untuk Family MPV (Avanza, Xenia), hingga Rp 1.100.000 untuk Innova Zenix Hybrid dan Rp 3.200.000 / hari untuk Toyota Alphard VIP. Pilihan lepas kunci 24 jam atau include supir & BBM.'
    },
    {
      q: isEn
        ? 'What are the requirements for self-drive car rental in Batam?'
        : 'Apa saja syarat sewa mobil lepas kunci di Batam?',
      a: isEn
        ? 'Self-drive rental requirements are simple with a 15-minute fast online verification via WhatsApp. Domestic visitors only need National ID (KTP), Driving License (SIM A), flight/ferry tickets to Batam, and hotel voucher. International tourists (Singapore/Malaysia) provide Passport, Home/International Driving License, and Ferry tickets.'
        : 'Syarat sewa lepas kunci di L.A Travel Batam cepat dan praktis (verifikasi 15 menit). Wisatawan/tamu luar kota: Foto KTP asli, SIM A aktif, bukti tiket pesawat/ferry tiba di Batam, dan bukti booking hotel. Turis Singapura/Malaysia: Paspor, SIM asal/Internasional, dan tiket ferry PP.'
    },
    {
      q: isEn
        ? 'Is free pickup and return available at ferry terminals and the airport?'
        : 'Apakah melayani antar-jemput gratis di Pelabuhan Ferry dan Bandara Hang Nadim?',
      a: isEn
        ? 'Yes, 100% FREE! We provide complimentary vehicle drop-off and pickup across all major terminals in Batam: Hang Nadim Airport (BTH), Batam Center Ferry Terminal, Harbour Bay Ferry Terminal, Sekupang, Nongsapura, and all hotels in Nagoya.'
        : 'Ya, 100% GRATIS! Kami menyediakan layanan antar dan jemput mobil langsung di Bandara Hang Nadim (BTH), Pelabuhan Ferry Batam Center, Pelabuhan Ferry Harbour Bay, Sekupang, Nongsapura, serta seluruh hotel di Nagoya dan Batam Kota.'
    },
    {
      q: isEn
        ? 'How can tourists from Singapore & Malaysia rent a car easily in Batam?'
        : 'Bagaimana cara turis dari Singapura & Malaysia menyewa mobil di Batam?',
      a: isEn
        ? 'Tourists from Singapore & Malaysia can reserve easily via WhatsApp in advance. We accept PayNow, bank transfers, and cash SGD & IDR upon arrival. Our team will meet you right outside the ferry arrival hall with the car clean and ready to go.'
        : 'Sangat mudah! Wisatawan dari Singapura & Malaysia dapat booking via WhatsApp sebelum berangkat. Kami menerima pembayaran PayNow, transfer, serta cash IDR & SGD saat mobil diserahkan di pelabuhan Harbour Bay atau Batam Center.'
    },
    {
      q: isEn
        ? 'Is chauffeur-driven service available for executive business and VIPs in Batam?'
        : 'Apakah tersedia sewa mobil dengan supir profesional untuk dinas / VIP di Batam?',
      a: isEn
        ? 'Yes, we provide executive chauffeur services with polite, punctual, and well-dressed drivers. Executive fleet includes Toyota Alphard VIP, Innova Zenix Hybrid, Fortuner GR Sport, and Toyota HiAce Commuter (14-16 seats) for delegations and corporate trips.'
        : 'Ya, kami menyediakan paket mobil dengan supir profesional berpengalaman dan berpakaian rapi. Pilihan unit eksekutif meliputi Toyota Alphard VIP, Innova Zenix Hybrid, Fortuner GR Sport, serta Toyota HiAce Commuter (14–16 seat) untuk dinas dan rombongan.'
    }
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqItems.map((item) => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };
}

/**
 * Menyuntikkan skrip JSON-LD Schema Markup secara aman ke dalam <head>
 */
export function injectJsonLd(schemaData: object, scriptId: string = 'json-ld-seo'): void {
  if (typeof document === 'undefined') return;

  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  scriptEl.textContent = JSON.stringify(schemaData);
}

/**
 * Menyuntikkan / memperbarui tag <title>, <meta description>, <link rel="canonical">,
 * dan <link rel="alternate" hreflang="..."> secara dinamis ke dalam document.head.
 */
export function injectDynamicSEO({
  title,
  description,
  canonicalPath,
  imageUrl,
  type = 'website',
  lang = 'id'
}: DynamicSEOMetadata): void {
  if (typeof document === 'undefined') return;

  const origin = getSiteOrigin();

  // 1. Suntikkan Title Dinamis
  document.title = title;

  // 2. Helper untuk membuat atau memperbarui Meta Tag
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Helper untuk membuat atau memperbarui Link Tag (<link rel="..." ...>)
  const setLink = (selector: string, attributes: Record<string, string>) => {
    let el = document.querySelector(selector) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      document.head.appendChild(el);
    }
    Object.entries(attributes).forEach(([attr, val]) => {
      el?.setAttribute(attr, val);
    });
  };

  // 4. Update Standard Meta Description
  setMeta('name', 'description', description);

  // 5. OpenGraph Tags (Facebook, WhatsApp, iMessage, LinkedIn, Telegram)
  setMeta('property', 'og:site_name', 'L.A TRAVEL BATAM');
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:locale', lang === 'id' ? 'id_ID' : 'en_US');

  // 6. Twitter / X Card Tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:site', '@latravelbatam');
  setMeta('name', 'twitter:creator', '@latravelbatam');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);

  // 7. Dynamic Open Graph & Twitter Image (Pastikan selalu Absolute URL)
  // Nilai default/fallback resmi jika halaman beranda dibagikan
  const defaultCoverImage = `${origin}/images/hero_la_transport_1790686468335.jpg`;
  let targetImageUrl = defaultCoverImage;

  if (imageUrl && imageUrl.trim().length > 0) {
    targetImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  setMeta('property', 'og:image', targetImageUrl);
  setMeta('property', 'og:image:secure_url', targetImageUrl);
  setMeta('property', 'og:image:alt', title);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('name', 'twitter:image', targetImageUrl);
  setMeta('name', 'twitter:image:alt', title);

  // 8. Canonical & og:url: Bersihkan parameter filter query (misal ?sort=price, ?filter=vip)
  const currentPath = canonicalPath !== undefined 
    ? canonicalPath 
    : (typeof window !== 'undefined' ? window.location.pathname : '/');
  
  const cleanPath = currentPath.split('#')[0].split('?')[0] || '/';
  const canonicalUrl = `${origin}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;

  setLink('link[rel="canonical"]', {
    rel: 'canonical',
    href: canonicalUrl
  });
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('name', 'twitter:url', canonicalUrl);

  // 9. Multilingual Alternate Hreflang Tags (Target Pasar Batam: Indonesia, Singapura, Malaysia)
  const baseUrl = `${origin}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  
  // id-ID (Indonesia - Bahasa default lokal)
  const idUrl = `${baseUrl}${cleanPath.includes('?') ? '&' : '?'}lang=id`;
  setLink('link[rel="alternate"][hreflang="id-ID"]', {
    rel: 'alternate',
    hreflang: 'id-ID',
    href: idUrl
  });

  // en-SG (Singapura - Pasar turis & expat utama ke Batam via ferry)
  const sgUrl = `${baseUrl}${cleanPath.includes('?') ? '&' : '?'}lang=en`;
  setLink('link[rel="alternate"][hreflang="en-SG"]', {
    rel: 'alternate',
    hreflang: 'en-SG',
    href: sgUrl
  });

  // en-MY (Malaysia - Pasar wisatawan dari Johor Bahru & sekitarnya)
  const myUrl = `${baseUrl}${cleanPath.includes('?') ? '&' : '?'}lang=en`;
  setLink('link[rel="alternate"][hreflang="en-MY"]', {
    rel: 'alternate',
    hreflang: 'en-MY',
    href: myUrl
  });

  // x-default (Fallback global untuk search engine)
  setLink('link[rel="alternate"][hreflang="x-default"]', {
    rel: 'alternate',
    hreflang: 'x-default',
    href: baseUrl
  });

  // 10. Update html lang attribute pada tag <html>
  if (document.documentElement) {
    document.documentElement.lang = lang;
  }
}
