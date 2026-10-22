/**
 * L.A TRANSPORT BATAM - Dynamic XML Sitemap Generator
 * Menghasilkan sitemap.xml berstandar Google Search Console (Sitemap Protocol 0.9)
 * - Me-looping semua paket wisata / mobil yang aktif
 * - Menyertakan tag <lastmod> dinamis ISO-8601
 * - Menyertakan halaman statis (Beranda, Armada, Keunggulan / Tentang Kami, Syarat & Ketentuan, Kontak)
 * - Menyertakan alternate hreflang untuk setiap URL (id-ID, en-SG, en-MY)
 */

import { ExtendedCar } from '../context/FleetContext';
import defaultCarsData from '../data/cars.json';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  title?: string;
  alternateHreflang?: Array<{
    hreflang: string;
    href: string;
  }>;
}

/**
 * Menghasilkan string XML Sitemap resmi dari database armada dan halaman statis
 */
export function generateSitemapXml(carsList?: ExtendedCar[], baseUrl: string = 'https://latravelbatam.com'): string {
  const todayIso = new Date().toISOString().split('T')[0];

  // Gunakan data aktif dari context jika ada, atau fallback ke database cars.json
  const activeCars: ExtendedCar[] = carsList && carsList.length > 0 
    ? carsList 
    : (defaultCarsData as ExtendedCar[]);

  // 1. Halaman Statis Utama Website (Real URLs tanpa # agar diindeks Google)
  const staticPages: SitemapUrlEntry[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: todayIso,
      changefreq: 'daily',
      priority: '1.0',
      title: 'Beranda L.A Transport Batam',
      alternateHreflang: [
        { hreflang: 'id-ID', href: `${baseUrl}/?lang=id` },
        { hreflang: 'en-SG', href: `${baseUrl}/?lang=en` },
        { hreflang: 'en-MY', href: `${baseUrl}/?lang=en` },
        { hreflang: 'x-default', href: `${baseUrl}/` }
      ]
    },
    {
      loc: `${baseUrl}/rental-mobil-batam-lepas-kunci`,
      lastmod: todayIso,
      changefreq: 'daily',
      priority: '0.95',
      title: 'Rental Mobil Batam Lepas Kunci 24 Jam Murah',
      alternateHreflang: [
        { hreflang: 'id-ID', href: `${baseUrl}/rental-mobil-batam-lepas-kunci` },
        { hreflang: 'en-SG', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'en-MY', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'x-default', href: `${baseUrl}/rental-mobil-batam-lepas-kunci` }
      ]
    },
    {
      loc: `${baseUrl}/sewa-mobil-supir-batam`,
      lastmod: todayIso,
      changefreq: 'daily',
      priority: '0.95',
      title: 'Sewa Mobil Batam Include Supir & BBM Murah',
      alternateHreflang: [
        { hreflang: 'id-ID', href: `${baseUrl}/sewa-mobil-supir-batam` },
        { hreflang: 'en-SG', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'en-MY', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'x-default', href: `${baseUrl}/sewa-mobil-supir-batam` }
      ]
    },
    {
      loc: `${baseUrl}/antar-jemput-bandara-hang-nadim-batam`,
      lastmod: todayIso,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Rental Mobil Bandara Hang Nadim & Pelabuhan Ferry Batam',
      alternateHreflang: [
        { hreflang: 'id-ID', href: `${baseUrl}/antar-jemput-bandara-hang-nadim-batam` },
        { hreflang: 'en-SG', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'en-MY', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'x-default', href: `${baseUrl}/antar-jemput-bandara-hang-nadim-batam` }
      ]
    },
    {
      loc: `${baseUrl}/batam-car-rental-with-driver`,
      lastmod: todayIso,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Batam Car Rental with Driver & Self Drive (Ferry Terminal Pickup)',
      alternateHreflang: [
        { hreflang: 'en-SG', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'en-MY', href: `${baseUrl}/batam-car-rental-with-driver` },
        { hreflang: 'id-ID', href: `${baseUrl}/sewa-mobil-supir-batam` },
        { hreflang: 'x-default', href: `${baseUrl}/batam-car-rental-with-driver` }
      ]
    }
  ];

  // 2. Looping Seluruh Data Paket Wisata Aktif dari Database
  const carPackagePages: SitemapUrlEntry[] = activeCars
    .filter((car) => car.isAvailable !== false) // hanya mobil yang aktif
    .map((car) => {
      const packageUrl = `${baseUrl}/armada/${car.id}`;
      return {
        loc: packageUrl,
        lastmod: todayIso,
        changefreq: 'weekly',
        priority: car.popular ? '0.9' : '0.85',
        title: `Paket Rental ${car.name} (${car.category})`,
        alternateHreflang: [
          { hreflang: 'id-ID', href: packageUrl },
          { hreflang: 'en-SG', href: `${packageUrl}?lang=en` },
          { hreflang: 'en-MY', href: `${packageUrl}?lang=en` },
          { hreflang: 'x-default', href: packageUrl }
        ]
      };
    });

  const allEntries = [...staticPages, ...carPackagePages];

  // 3. Render format XML Sitemap
  const xmlUrls = allEntries
    .map((entry) => {
      const hreflangs = entry.alternateHreflang
        ? entry.alternateHreflang
            .map(
              (alt) =>
                `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />`
            )
            .join('\n')
        : '';

      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
${hreflangs}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlUrls}
</urlset>
`;
}

/**
 * Helper untuk sanitasi karakter khusus XML
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
