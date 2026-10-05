/**
 * L.A Travel Batam - WhatsApp Lead Generation Helper
 * Mengoptimalkan tautan WhatsApp dengan URL encoding yang aman & ramah mobile
 * Mendukung Bahasa Indonesia & English
 */

// Nomor WhatsApp Resmi Admin L.A Travel Batam
// (Fallback saja — nilai utama diambil dari database via /api/settings.php)
export const LA_TRAVEL_WA_PHONE = '6287797631578';
export const LA_TRANSPORT_WA_PHONE = LA_TRAVEL_WA_PHONE; // backward-compatible alias
export const LA_TRAVEL_OFFICE_ADDRESS = 'Ruko Taman Eden Park No.19 Batam';
export const LA_TRANSPORT_OFFICE_ADDRESS = LA_TRAVEL_OFFICE_ADDRESS;
export const LA_TRAVEL_INSTAGRAM = 'https://instagram.com/latravelbatam';
export const LA_TRANSPORT_INSTAGRAM = LA_TRAVEL_INSTAGRAM;
export const LA_TRAVEL_TIKTOK = 'https://tiktok.com/@latravelbatam';
export const LA_TRANSPORT_TIKTOK = LA_TRAVEL_TIKTOK;
export const LA_TRAVEL_MAPS = 'https://maps.app.goo.gl/rFDQeosfUoj6YGo2A';
export const LA_TRANSPORT_MAPS = LA_TRAVEL_MAPS;

/**
 * Mendapatkan nomor WhatsApp aktif dari CMS settings jika ada
 */
export function getActiveWhatsAppPhone(): string {
  try {
    const saved = localStorage.getItem('la_travel_settings_v2') || 
                  localStorage.getItem('la_transport_settings_v2') || 
                  localStorage.getItem('la_transport_settings_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.whatsappNumber && parsed.whatsappNumber.trim().length > 0) {
        return parsed.whatsappNumber.trim();
      }
    }
  } catch {
    // fallback
  }
  return LA_TRAVEL_WA_PHONE;
}

export interface Car {
  id: string;
  name: string;
  category: string;
  capacity: string;
  capacity_en?: string;
  transmission: string;
  transmission_en?: string;
  engine?: string;
  fuel?: string;
  fuel_en?: string;
  luggage?: string;
  luggage_en?: string;
  price_start_from: string;
  price_unit: string;
  rates?: {
    self_drive_24h: string;
    with_driver_12h: string;
    airport_transfer: string;
  };
  description_id?: string;
  description_en?: string;
  image_url: string;
  gallery?: string[];
  features: string[];
  features_en?: string[];
  badge?: string;
  badge_en?: string;
  popular?: boolean;
  wa_message: string;
}

/**
 * Memeriksa apakah mobil masuk ke dalam kategori Lepas Kunci (Hanya 6 unit armada yang diizinkan)
 */
export function isSelfDriveCar(car: { id?: string; rates?: { self_drive_24h?: string } } | null | undefined): boolean {
  if (!car) return false;
  const selfDriveIds = [
    'toyota-agya',
    'honda-brio',
    'toyota-calya',
    'toyota-avanza',
    'toyota-all-new-avanza',
    'daihatsu-xenia'
  ];
  if (car.id && selfDriveIds.includes(car.id)) return true;
  const rate = car.rates?.self_drive_24h || '';
  return rate.toLowerCase().includes('lepas kunci') && !rate.toLowerCase().includes('khusus');
}

/**
 * Menghasilkan URL WhatsApp dengan encode query string yang valid
 */
export function buildWhatsAppUrl(message: string, phone?: string): string {
  const targetPhone = phone || getActiveWhatsAppPhone();
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Template pesan instan untuk konsultasi umum atau booking armada spesifik (Bilingual)
 */
export function getCarInquiryUrl(
  car: Car,
  serviceType: string = 'Lepas Kunci',
  lang: 'id' | 'en' = 'id',
  phone?: string
): string {
  if (lang === 'en') {
    const text = `Hello L.A Travel Batam, I am interested in renting the following vehicle:\n\n*Vehicle:* ${car.name}\n*Category:* ${car.category}\n*Rental Option:* ${serviceType}\n*Estimated Rate:* ${car.price_start_from} / day\n\nPlease let me know unit availability and rental terms. Thank you!`;
    return buildWhatsAppUrl(text, phone);
  }

  const text = `Halo Admin L.A Travel Batam, saya tertarik sewa armada:\n\n*Mobil:* ${car.name}\n*Kategori:* ${car.category}\n*Pilihan Layanan:* ${serviceType}\n*Estimasi Harga:* ${car.price_start_from} / hari\n\nMohon info ketersediaan unit dan persyaratan sewanya ya. Terima kasih!`;
  return buildWhatsAppUrl(text, phone);
}

export function getGeneralInquiryUrl(
  topic: string = 'Konsultasi Rental Mobil Batam',
  lang: 'id' | 'en' = 'id',
  phone?: string
): string {
  if (lang === 'en') {
    const text = `Hello L.A Travel Batam, I would like to inquire about car rental in Batam (${topic}). Could you please share the fleet list, daily rates, and self-drive/driver options? Thank you.`;
    return buildWhatsAppUrl(text, phone);
  }

  const text = `Halo L.A Travel Batam, saya ingin konsultasi mengenai ${topic}. Boleh minta info katalog lengkap, promo dan syarat sewanya? Terima kasih.`;
  return buildWhatsAppUrl(text, phone);
}

