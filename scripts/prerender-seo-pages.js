import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const carsPath = path.resolve(__dirname, '../src/data/cars.json');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ Error: dist/index.html tidak ditemukan. Jalankan vite build terlebih dahulu.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
const cars = JSON.parse(fs.readFileSync(carsPath, 'utf-8'));
const origin = 'https://latravelbatam.com';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractPriceValues(priceStr) {
  if (!priceStr) return { idr: 300000, sgd: 26 };
  const digitsOnly = String(priceStr).replace(/\D/g, '');
  const idr = digitsOnly ? parseInt(digitsOnly, 10) : 300000;
  const sgd = Math.round(idr / 11800);
  return { idr, sgd };
}

function buildHomepageJsonLd() {
  const itemListElements = cars
    .filter((c) => c.isAvailable !== false)
    .map((car, idx) => {
      const { idr } = extractPriceValues(car.price_start_from);
      const imgUrl = car.image_url.startsWith('http')
        ? car.image_url
        : `${origin}${car.image_url.startsWith('/') ? '' : '/'}${car.image_url}`;
      return {
        '@type': 'ListItem',
        position: idx + 1,
        url: `${origin}/armada/${car.id}`,
        name: `Sewa ${car.name} Batam (${car.category})`,
        item: {
          '@type': 'Product',
          name: `Rental ${car.name} Batam - Lepas Kunci & Include Supir`,
          image: imgUrl,
          description: car.description_id,
          brand: { '@type': 'Brand', name: 'L.A TRANSPORT BATAM' },
          offers: {
            '@type': 'Offer',
            price: idr,
            priceCurrency: 'IDR',
            availability: 'https://schema.org/InStock',
            url: `${origin}/armada/${car.id}`
          }
        }
      };
    });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['AutoRental', 'TravelAgency', 'LocalBusiness'],
        '@id': `${origin}/#agency`,
        name: 'L.A TRANSPORT BATAM',
        alternateName: ['LA Transport Batam', 'L.A Travel Batam', 'Rental Mobil Batam L.A Transport'],
        legalName: 'L.A Transport Batam - Rental Mobil & Tour Provider',
        url: `${origin}/`,
        logo: `${origin}/images/la_transport_logo.jpg`,
        image: `${origin}/images/og_share_preview.jpg`,
        description:
          'Pusat rental mobil Batam lepas kunci 24 jam murah & sewa mobil + supir BBM terlengkap di Kota Batam. Tersedia Agya, Brio, Avanza, Veloz, Xpander, Raize, Innova Reborn, Zenix Hybrid, Fortuner GR, Alphard Transformer VIP, dan HiAce Commuter.',
        telephone: '+6287797631578',
        priceRange: 'Rp 300.000 - Rp 3.000.000',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ruko Taman Eden Park No.19 Batam',
          addressLocality: 'Kota Batam',
          addressRegion: 'Kepulauan Riau',
          postalCode: '29432',
          addressCountry: 'ID'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 1.1195328,
          longitude: 104.0598878
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '240',
          reviewCount: '195'
        }
      },
      {
        '@type': 'ItemList',
        '@id': `${origin}/#fleet-catalog`,
        name: 'Daftar Harga Rental Mobil Batam L.A Transport Batam',
        numberOfItems: itemListElements.length,
        itemListElement: itemListElements
      },
      {
        '@type': 'FAQPage',
        '@id': `${origin}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Berapa harga rental mobil Batam lepas kunci 24 jam?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Harga rental mobil Batam lepas kunci 24 jam di L.A Transport Batam mulai dari Rp 300.000/hari untuk Toyota Agya & Honda Brio, Rp 350.000/hari untuk Avanza & Xenia, Rp 450.000/hari untuk All New Veloz, Xpander & Raize, serta Rp 500.000 - Rp 700.000/hari untuk Kijang Innova Reborn & Zenix Hybrid.'
            }
          },
          {
            '@type': 'Question',
            name: 'Apakah gratis antar jemput mobil di Bandara Hang Nadim dan Pelabuhan Ferry Batam?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, L.A Transport Batam melayani gratis pengantaran dan penjemputan unit mobil di Bandara Internasional Hang Nadim, Pelabuhan Ferry Internasional Batam Center, Harbour Bay, Sekupang, serta hotel di area Nagoya dan Jodoh.'
            }
          },
          {
            '@type': 'Question',
            name: 'Apa saja syarat sewa mobil lepas kunci di Batam?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Syarat sewa mobil lepas kunci di Batam sangat mudah dan tanpa deposit uang tunai untuk wisatawan: cukup foto e-KTP, SIM A aktif, serta bukti tiket pesawat atau ferry pulang-pergi dan nama hotel tempat menginap.'
            }
          }
        ]
      }
    ]
  };
}

function buildCarJsonLd(car) {
  const { idr, sgd } = extractPriceValues(car.price_start_from);
  const fullImageUrl = car.image_url.startsWith('http')
    ? car.image_url
    : `${origin}${car.image_url.startsWith('/') ? '' : '/'}${car.image_url}`;
  const detailUrl = `${origin}/armada/${car.id}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${detailUrl}#product`,
        name: `Sewa ${car.name} Batam – Lepas Kunci & Include Supir`,
        image: [fullImageUrl],
        description: car.description_id,
        category: `Rental Mobil Batam > ${car.category}`,
        brand: {
          '@type': 'Brand',
          name: 'L.A TRANSPORT BATAM'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '128',
          reviewCount: '96'
        },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: idr,
          highPrice: Math.round(idr * 1.5),
          priceCurrency: 'IDR',
          offerCount: '2',
          offers: [
            {
              '@type': 'Offer',
              price: idr,
              priceCurrency: 'IDR',
              priceValidUntil: '2026-12-31',
              availability: 'https://schema.org/InStock',
              url: detailUrl,
              description: car.rates?.self_drive_24h || car.rates?.with_driver_12h || car.price_start_from
            },
            {
              '@type': 'Offer',
              price: sgd,
              priceCurrency: 'SGD',
              priceValidUntil: '2026-12-31',
              availability: 'https://schema.org/InStock',
              url: `${detailUrl}?lang=en`,
              description: `Approx. SGD ${sgd}/day`
            }
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Rental Mobil Batam', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: `Sewa ${car.name} Batam`, item: detailUrl }
        ]
      }
    ]
  };
}

function buildFleetLinksHtml() {
  const carItems = cars
    .filter((c) => c.isAvailable !== false)
    .map(
      (c) => `
      <article>
        <h3><a href="/armada/${c.id}">Sewa ${escapeHtml(c.name)} Batam (${escapeHtml(c.category)}) - Mulai ${escapeHtml(c.price_start_from)}</a></h3>
        <p>${escapeHtml(c.description_id)}</p>
        <ul>
          <li>Kapasitas: ${c.capacity} Penumpang, ${c.luggage} Koper | Transmisi: ${escapeHtml(c.transmission)}</li>
          <li>Lepas Kunci 24 Jam: ${escapeHtml(c.rates?.self_drive_24h || 'Hubungi Admin')}</li>
          <li>Mobil + Supir + BBM (10-12 Jam): ${escapeHtml(c.rates?.with_driver_12h || 'Tersedia')}</li>
        </ul>
      </article>`
    )
    .join('\n');

  return `
    <section>
      <h2>Daftar Harga Armada Rental Mobil Batam 2026 - L.A Transport Batam</h2>
      ${carItems}
    </section>
    <nav aria-label="Layanan Populer Rental Mobil Batam">
      <h2>Layanan Utama L.A Transport Batam</h2>
      <ul>
        <li><a href="/">Beranda Rental Mobil Batam L.A Transport Batam</a></li>
        <li><a href="/rental-mobil-batam-lepas-kunci">Rental Mobil Batam Lepas Kunci 24 Jam Murah Tanpa Deposit</a></li>
        <li><a href="/sewa-mobil-supir-batam">Sewa Mobil Batam Include Supir &amp; BBM (All-In City Tour)</a></li>
        <li><a href="/antar-jemput-bandara-hang-nadim-batam">Antar Jemput Bandara Hang Nadim &amp; Pelabuhan Ferry Batam Center / Harbour Bay</a></li>
        <li><a href="/batam-car-rental-with-driver">Batam Car Rental with Driver &amp; Ferry Terminal Pickup (English)</a></li>
      </ul>
    </nav>
  `;
}

function injectPageSeo(htmlTemplate, { lang = 'id', title, description, canonicalUrl, ogImage, jsonLd, bodyHtml }) {
  let out = htmlTemplate;

  out = out.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  if (ogImage) {
    out = out.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
    );
    out = out.replace(
      /<meta property="og:image:secure_url" content="[^"]*" \/>/,
      `<meta property="og:image:secure_url" content="${escapeHtml(ogImage)}" />`
    );
    out = out.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
    );
  }

  if (jsonLd) {
    const scriptTag = `\n    <script id="prerendered-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`;
    out = out.replace('</head>', scriptTag);
  }

  if (bodyHtml) {
    out = out.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }

  return out;
}

// 1. Update Homepage (dist/index.html) with rich pre-rendered SEO content & JSON-LD
const homeBodyHtml = `
  <main>
    <h1>Rental Mobil Batam Lepas Kunci 24 Jam &amp; Sewa Mobil Include Supir | L.A TRANSPORT BATAM</h1>
    <p>Selamat datang di <strong>L.A TRANSPORT BATAM</strong> (Ruko Taman Eden Park No.19 Batam, WhatsApp: +62 877-9763-1578). Kami melayani sewa dan rental mobil Batam lepas kunci 24 jam tanpa deposit maupun paket sewa mobil dengan supir + BBM untuk wisata keluarga, perjalanan dinas korporat, kunjungan kerja VIP, dan antar-jemput Bandara Internasional Hang Nadim serta Pelabuhan Ferry Batam Center, Harbour Bay, dan Sekupang.</p>
    ${buildFleetLinksHtml()}
  </main>
`;

const updatedHomeHtml = injectPageSeo(baseHtml, {
  lang: 'id',
  title: 'Rental Mobil Batam Lepas Kunci & Include Supir | L.A Transport Batam',
  description:
    'Rental mobil Batam lepas kunci 24 jam murah mulai Rp 300rb & sewa mobil include supir VIP. Unit Agya, Brio, Avanza, Veloz, Zenix, Alphard, HiAce. Gratis antar Bandara & Ferry!',
  canonicalUrl: `${origin}/`,
  ogImage: `${origin}/images/og_share_preview.jpg`,
  jsonLd: buildHomepageJsonLd(),
  bodyHtml: homeBodyHtml
});

fs.writeFileSync(indexHtmlPath, updatedHomeHtml, 'utf-8');
console.log('✅ Pre-rendered Homepage: dist/index.html');

// 2. Generate 4 Dedicated High-Intent SEO Landing Pages
const landingPages = [
  {
    slug: 'rental-mobil-batam-lepas-kunci',
    lang: 'id',
    title: 'Rental Mobil Batam Lepas Kunci 24 Jam Murah (Mulai Rp 300rb) | L.A Transport Batam',
    description:
      'Pusat rental mobil Batam lepas kunci 24 jam murah tanpa deposit. Tersedia Brio, Agya, Avanza, Veloz, Xpander, Raize & Innova Reborn matic. Gratis antar ke Bandara Hang Nadim & Pelabuhan Ferry!',
    h1: 'Rental Mobil Batam Lepas Kunci 24 Jam Murah & Syarat Mudah',
    intro:
      'Cari layanan rental mobil Batam lepas kunci 24 jam dengan unit tahun muda, matic responsif, bersih, dan syarat mudah tanpa ribet? L.A Transport Batam menyediakan Agya & Brio mulai Rp 300.000/hari, Avanza & Xenia Rp 350.000/hari, Veloz, Xpander & Raize Rp 450.000/hari, hingga Innova Reborn & Zenix Hybrid. Gratis layanan serah-terima mobil langsung di Bandara Hang Nadim, Pelabuhan Ferry Batam Center, Harbour Bay, atau lobi hotel Anda di Nagoya.'
  },
  {
    slug: 'sewa-mobil-supir-batam',
    lang: 'id',
    title: 'Sewa Mobil Batam Include Supir & BBM Murah (Paket 12 Jam) | L.A Transport Batam',
    description:
      'Layanan sewa mobil plus supir di Batam sudah termasuk BBM. Driver ramah, hafal rute wisata Barelang, Nagoya & kuliner kelong seafood. Tersedia Avanza, Innova Zenix, Fortuner, Alphard VIP & HiAce.',
    h1: 'Sewa Mobil Batam Include Supir & BBM (All-In City Tour & Dinas)',
    intro:
      'Nikmati perjalanan bebas lelah keliling Pulau Batam bersama layanan sewa mobil plus supir dan BBM dari L.A Transport Batam. Paket durasi 10–12 jam sudah termasuk pengemudi profesional berpengalaman, ramah, tepat waktu, serta bahan bakar (BBM) untuk rute wisata Jembatan Barelang, pusat oleh-oleh Nagoya, kuliner seafood kelong, hingga agenda dinas pemerintahan dan perusahaan.'
  },
  {
    slug: 'antar-jemput-bandara-hang-nadim-batam',
    lang: 'id',
    title: 'Rental Mobil Bandara Hang Nadim & Pelabuhan Ferry Batam | L.A Transport Batam',
    description:
      'Jasa antar jemput VIP & rental mobil langsung di Bandara Internasional Hang Nadim, Pelabuhan Ferry Batam Center, Harbour Bay & Sekupang. Tepat waktu, armada bersih & harga transparan.',
    h1: 'Rental Mobil & Antar Jemput Bandara Hang Nadim serta Pelabuhan Ferry Batam',
    intro:
      'Baru mendarat di Bandara Internasional Hang Nadim Batam atau tiba dengan kapal ferry di Pelabuhan Internasional Batam Center, Harbour Bay, maupun Sekupang? Tim L.A Transport Batam siap menyambut Anda tepat waktu di pintu kedatangan baik untuk serah-terima mobil lepas kunci 24 jam maupun layanan charter drop-off dan city tour bersama supir VIP.'
  },
  {
    slug: 'batam-car-rental-with-driver',
    lang: 'en',
    title: 'Batam Car Rental with Driver & Self Drive (Ferry Terminal Pickup) | L.A Transport Batam',
    description:
      'Trusted Batam car rental with English-speaking driver or 24h self-drive. Instant pickup at Batam Center Ferry Terminal, Harbour Bay & Hang Nadim Airport. Alphard VIP, Zenix Hybrid, HiAce & MPVs from SGD 30/day.',
    h1: 'Batam Car Rental with Driver & Ferry Terminal Pickup (Batam Center & Harbour Bay)',
    intro:
      'Travelling from Singapore or Malaysia to Batam Island? L.A Transport Batam provides premier private car charter with experienced drivers (inclusive of petrol/fuel) and 24-hour self-drive car rental. Enjoy complimentary meet-and-greet pickup at Batam Center International Ferry Terminal, Harbour Bay Ferry Terminal, Nongsapura, and Hang Nadim Airport.'
  }
];

for (const page of landingPages) {
  const bodyHtml = `
    <main>
      <h1>${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      ${buildFleetLinksHtml()}
    </main>
  `;

  const html = injectPageSeo(baseHtml, {
    lang: page.lang,
    title: page.title,
    description: page.description,
    canonicalUrl: `${origin}/${page.slug}`,
    ogImage: `${origin}/images/og_share_preview.jpg`,
    jsonLd: buildHomepageJsonLd(),
    bodyHtml
  });

  fs.writeFileSync(path.join(distDir, `${page.slug}.html`), html, 'utf-8');
  console.log(`✅ Pre-rendered Landing Page: dist/${page.slug}.html`);
}

// 3. Generate 14 Physical Car Armada Pages (dist/armada/<id>.html)
const armadaDir = path.join(distDir, 'armada');
fs.mkdirSync(armadaDir, { recursive: true });

for (const car of cars) {
  if (car.isAvailable === false) continue;

  const canonicalUrl = `${origin}/armada/${car.id}`;
  const fullImageUrl = car.image_url.startsWith('http')
    ? car.image_url
    : `${origin}${car.image_url.startsWith('/') ? '' : '/'}${car.image_url}`;

  const selfDriveText =
    car.rates?.self_drive_24h && car.rates.self_drive_24h.startsWith('Rp')
      ? `Lepas Kunci ${car.rates.self_drive_24h}`
      : `Include Supir ${car.rates?.with_driver_12h || car.price_start_from}`;

  const title = `Sewa ${car.name} Batam Murah (${car.price_start_from}) - ${selfDriveText} | L.A Transport Batam`;
  const description = `Rental & sewa ${car.name} (${car.category}) di Batam mulai ${car.price_start_from}. ${car.description_id} Gratis antar jemput Bandara Hang Nadim & Pelabuhan Ferry Batam. Hubungi WA 0877-9763-1578!`;

  const bodyHtml = `
    <main>
      <nav aria-label="Breadcrumb">
        <a href="/">Beranda Rental Mobil Batam</a> &rsaquo; <span>Sewa ${escapeHtml(car.name)} Batam</span>
      </nav>
      <h1>Sewa ${escapeHtml(car.name)} Batam (${escapeHtml(car.category)}) – Mulai ${escapeHtml(car.price_start_from)}</h1>
      <img src="${escapeHtml(car.image_url)}" alt="Rental Sewa ${escapeHtml(car.name)} Batam L.A Transport Batam" width="800" height="500" />
      <p>${escapeHtml(car.description_id)}</p>
      <h2>Harga &amp; Paket Rental ${escapeHtml(car.name)} di Batam</h2>
      <ul>
        <li><strong>Harga Mulai:</strong> ${escapeHtml(car.price_start_from)} / hari</li>
        <li><strong>Lepas Kunci 24 Jam:</strong> ${escapeHtml(car.rates?.self_drive_24h || 'Hubungi Admin')}</li>
        <li><strong>Paket Mobil + Supir + BBM (10-12 Jam):</strong> ${escapeHtml(car.rates?.with_driver_12h || 'Tersedia')}</li>
        <li><strong>Antar Jemput Bandara / Pelabuhan Ferry:</strong> ${escapeHtml(car.rates?.airport_transfer || 'Gratis / Tersedia')}</li>
      </ul>
      <h2>Spesifikasi &amp; Fasilitas Unit ${escapeHtml(car.name)}</h2>
      <ul>
        <li>Kategori: ${escapeHtml(car.category)}</li>
        <li>Kapasitas Penumpang: ${car.capacity} Orang Dewasa</li>
        <li>Kapasitas Bagasi: ${car.luggage} Koper</li>
        <li>Transmisi: ${escapeHtml(car.transmission)}</li>
        <li>Termasuk: ${(car.includes || []).map(escapeHtml).join(', ')}</li>
      </ul>
      <p>Pesan sekarang melalui WhatsApp Resmi L.A Transport Batam di <a href="https://wa.me/6287797631578">+62 877-9763-1578</a> atau kunjungi garasi kami di Ruko Taman Eden Park No.19, Kota Batam.</p>
      ${buildFleetLinksHtml()}
    </main>
  `;

  const html = injectPageSeo(baseHtml, {
    lang: 'id',
    title,
    description,
    canonicalUrl,
    ogImage: fullImageUrl,
    jsonLd: buildCarJsonLd(car),
    bodyHtml
  });

  fs.writeFileSync(path.join(armadaDir, `${car.id}.html`), html, 'utf-8');
  console.log(`✅ Pre-rendered Car Page: dist/armada/${car.id}.html`);
}

console.log(`🎉 Selesai melakukan pre-rendering 19 halaman SEO statis di folder dist/!`);
