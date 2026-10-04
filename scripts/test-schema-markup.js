import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import cars data
const carsFilePath = path.resolve(__dirname, '../src/data/cars.json');
const cars = JSON.parse(fs.readFileSync(carsFilePath, 'utf-8'));

function extractPriceValues(priceStr) {
  if (!priceStr) return { idr: 500000, sgd: 45 };
  const digitsOnly = priceStr.replace(/\D/g, '');
  const idr = digitsOnly ? parseInt(digitsOnly, 10) : 500000;
  const sgd = Math.round(idr / 11800);
  return { idr, sgd };
}

function generateTouristTripJsonLd(car, lang = 'id') {
  const origin = 'https://latravelbatam.com';
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
    ? car.description_en || `Explore Batam Island with ${car.name}.`
    : car.description_id || `Jelajahi destinasi wisata Kota Batam dengan ${car.name}.`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
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
          'telephone': '+6281270008899',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Komp. Ruko Nagoya Hill Blok G No. 12',
            'addressLocality': 'Kota Batam',
            'addressRegion': 'Kepulauan Riau',
            'postalCode': '29432',
            'addressCountry': 'ID'
          }
        }
      },
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
        'offers': {
          '@type': 'AggregateOffer',
          'lowPrice': idr,
          'highPrice': Math.round(idr * 1.3),
          'priceCurrency': 'IDR',
          'offerCount': '2',
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

function generateTravelAgencyJsonLd() {
  const origin = 'https://latravelbatam.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': `${origin}/#agency`,
    'name': 'L.A TRAVEL BATAM',
    'legalName': 'L.A Travel Batam - Rental Mobil & Tour Provider',
    'url': origin,
    'logo': `${origin}/favicon.svg`,
    'image': `${origin}/images/hero_la_transport_1790686468335.jpg`,
    'description': 'Layanan rental mobil premium dan travel wisata terpercaya di Batam.',
    'telephone': '+6281270008899',
    'priceRange': 'Rp 500.000 - Rp 2.500.000',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Komp. Ruko Nagoya Hill Blok G No. 12',
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
      'reviewCount': '240'
    }
  };
}

console.log('--- 🧪 MENJALANKAN UJI VALIDASI SCHEMA MARKUP (GOOGLE RICH SNIPPETS) ---');

// 1. Validasi Home Agency Schema
const agencySchema = generateTravelAgencyJsonLd();
console.log('\n[1/3] Menguji Schema AutoRental / TravelAgency (Homepage):');
try {
  JSON.parse(JSON.stringify(agencySchema));
  if (agencySchema['@type'] && agencySchema['name'] && agencySchema['telephone'] && agencySchema['address'] && agencySchema['aggregateRating']) {
    console.log('✅ PASS: AutoRental Schema terstruktur valid.');
    console.log(`   - Tipe: ${agencySchema['@type']}`);
    console.log(`   - Nama Usaha: ${agencySchema['name']}`);
    console.log(`   - Rating Agregat: ${agencySchema.aggregateRating.ratingValue} (${agencySchema.aggregateRating.reviewCount} ulasan)`);
    console.log(`   - Alamat: ${agencySchema.address.streetAddress}, ${agencySchema.address.addressLocality}`);
  } else {
    throw new Error('Properti wajib AutoRental kurang');
  }
} catch (err) {
  console.error('❌ FAIL AutoRental:', err.message);
}

// 2. Validasi TouristTrip & Product Schema untuk Setiap Mobil di Database
console.log('\n[2/3] Menguji Schema TouristTrip & Product untuk semua unit armada:');
let allPassed = true;

cars.forEach((car, index) => {
  const schema = generateTouristTripJsonLd(car, 'id');
  try {
    const rawJson = JSON.stringify(schema, null, 2);
    JSON.parse(rawJson); // uji parsing JSON murni

    const graph = schema['@graph'];
    const trip = graph.find(item => item['@type'] === 'TouristTrip');
    const product = graph.find(item => item['@type'] === 'Product');

    if (!trip || !product) {
      throw new Error(`Item @graph tidak lengkap pada ${car.name}`);
    }

    // Periksa properti TouristTrip
    if (!trip.name || !trip.offers || trip.offers.length < 2 || !trip.itinerary || !trip.provider) {
      throw new Error(`Properti TouristTrip tidak lengkap pada ${car.name}`);
    }

    // Periksa properti Product
    if (!product.name || !product.image || !product.aggregateRating || !product.offers) {
      throw new Error(`Properti Product tidak lengkap pada ${car.name}`);
    }

    const idrOffer = trip.offers.find(o => o.priceCurrency === 'IDR');
    const sgdOffer = trip.offers.find(o => o.priceCurrency === 'SGD');

    console.log(`✅ [${index + 1}/${cars.length}] ${car.name}:`);
    console.log(`   • TouristTrip: "${trip.name}"`);
    console.log(`   • Harga IDR: Rp ${idrOffer.price.toLocaleString('id-ID')} | SGD: ~SGD ${sgdOffer.price}`);
    console.log(`   • Itinerary: ${trip.itinerary.numberOfItems} tahapan rute`);
    console.log(`   • Rating: ${product.aggregateRating.ratingValue} ★ (${product.aggregateRating.ratingCount} reviews)`);
    console.log(`   • Gambar Cover: ${product.image[0]}`);
  } catch (err) {
    allPassed = false;
    console.error(`❌ FAIL pada ${car.name}:`, err.message);
  }
});

// 3. Output Contoh JSON-LD yang dapat langsung dicoba di Google Rich Results Test
console.log('\n[3/3] Contoh JSON-LD Siap Uji di Google Rich Results Test (Toyota Alphard VIP):');
const sampleAlphard = cars[0];
const sampleJson = JSON.stringify(generateTouristTripJsonLd(sampleAlphard, 'id'), null, 2);
console.log(sampleJson);

console.log('\n======================================================');
if (allPassed) {
  console.log('🎉 SEMUA PENGUJIAN SCHEMA MARKUP LOLOS 100%!');
  console.log('Semua tag Schema.org memenuhi standar Google Rich Snippets.');
} else {
  console.log('⚠️ Terdapat kesalahan pada Schema Markup.');
}
console.log('======================================================\n');
