import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Baca database cars.json langsung
const carsFilePath = path.resolve(__dirname, '../src/data/cars.json');
const carsData = JSON.parse(fs.readFileSync(carsFilePath, 'utf-8'));

const baseUrl = 'https://latravelbatam.com';
const todayIso = new Date().toISOString().split('T')[0];

function escapeXml(unsafe) {
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

// 1. Static Pages
const staticPages = [
  {
    loc: `${baseUrl}/`,
    lastmod: todayIso,
    changefreq: 'daily',
    priority: '1.0',
    alternateHreflang: [
      { hreflang: 'id-ID', href: `${baseUrl}/?lang=id` },
      { hreflang: 'en-SG', href: `${baseUrl}/?lang=en` },
      { hreflang: 'en-MY', href: `${baseUrl}/?lang=en` },
      { hreflang: 'x-default', href: `${baseUrl}/` }
    ]
  },
  {
    loc: `${baseUrl}/#armada`,
    lastmod: todayIso,
    changefreq: 'daily',
    priority: '0.9',
    alternateHreflang: [
      { hreflang: 'id-ID', href: `${baseUrl}/#armada?lang=id` },
      { hreflang: 'en-SG', href: `${baseUrl}/#armada?lang=en` },
      { hreflang: 'en-MY', href: `${baseUrl}/#armada?lang=en` },
      { hreflang: 'x-default', href: `${baseUrl}/#armada` }
    ]
  },
  {
    loc: `${baseUrl}/#keunggulan`,
    lastmod: todayIso,
    changefreq: 'weekly',
    priority: '0.8',
    alternateHreflang: [
      { hreflang: 'id-ID', href: `${baseUrl}/#keunggulan?lang=id` },
      { hreflang: 'en-SG', href: `${baseUrl}/#keunggulan?lang=en` },
      { hreflang: 'en-MY', href: `${baseUrl}/#keunggulan?lang=en` },
      { hreflang: 'x-default', href: `${baseUrl}/#keunggulan` }
    ]
  },
  {
    loc: `${baseUrl}/#syarat`,
    lastmod: todayIso,
    changefreq: 'weekly',
    priority: '0.8',
    alternateHreflang: [
      { hreflang: 'id-ID', href: `${baseUrl}/#syarat?lang=id` },
      { hreflang: 'en-SG', href: `${baseUrl}/#syarat?lang=en` },
      { hreflang: 'en-MY', href: `${baseUrl}/#syarat?lang=en` },
      { hreflang: 'x-default', href: `${baseUrl}/#syarat` }
    ]
  },
  {
    loc: `${baseUrl}/#kontak`,
    lastmod: todayIso,
    changefreq: 'monthly',
    priority: '0.7',
    alternateHreflang: [
      { hreflang: 'id-ID', href: `${baseUrl}/#kontak?lang=id` },
      { hreflang: 'en-SG', href: `${baseUrl}/#kontak?lang=en` },
      { hreflang: 'en-MY', href: `${baseUrl}/#kontak?lang=en` },
      { hreflang: 'x-default', href: `${baseUrl}/#kontak` }
    ]
  }
];

// 2. Dynamic Car Tour Packages
const carPackagePages = carsData
  .filter((car) => car.isAvailable !== false)
  .map((car) => {
    const packageUrl = `${baseUrl}/#detail-${car.id}`;
    return {
      loc: packageUrl,
      lastmod: todayIso,
      changefreq: 'weekly',
      priority: car.popular ? '0.9' : '0.8',
      alternateHreflang: [
        { hreflang: 'id-ID', href: `${packageUrl}?lang=id` },
        { hreflang: 'en-SG', href: `${packageUrl}?lang=en` },
        { hreflang: 'en-MY', href: `${packageUrl}?lang=en` },
        { hreflang: 'x-default', href: packageUrl }
      ]
    };
  });

const allEntries = [...staticPages, ...carPackagePages];

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

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlUrls}
</urlset>
`;

// Tulis ke folder public/sitemap.xml
const publicSitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(publicSitemapPath, sitemapContent, 'utf-8');

console.log(`✅ [Sitemap Generator] Berhasil mengenerate sitemap.xml dengan ${allEntries.length} URL ke: ${publicSitemapPath}`);
