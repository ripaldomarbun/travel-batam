/**
 * L.A Transport Batam - Defensive Security Utilities
 * Grounded in skill-security.md guidelines
 * - URL scheme sanitization (anti-javascript: / anti-XSS)
 * - Cryptographic PIN hashing via Web Crypto API (SHA-256)
 * - Rate limiting & brute-force lockout mechanism
 */

const PIN_SALT = 'la_transport_batam_salt_v2';
const DEFAULT_PIN = '1234';

/**
 * Validasi dan sanitasi URL eksternal agar aman dari serangan javascript: URI atau payload berbahaya.
 * Hanya protokol https://, http://, mailto:, dan tel: yang diizinkan.
 */
export function sanitizeExternalUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (trimmed === '') return '#';

  // Cegah protocol-relative bypass atau javascript/vbscript/data URI
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return '#';
  }

  // Izinkan path lokal atau protokol aman
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:')
  ) {
    return trimmed;
  }

  // Jika URL tidak menyertakan skema (misal 'instagram.com/user'), tambahkan https://
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return '#';
}

/**
 * Menghitung hash SHA-256 dari string (PIN) menggunakan Web Crypto API asli browser
 */
export async function hashStringSHA256(value: string, salt: string = PIN_SALT): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    // Fallback sederhana jika crypto.subtle tidak didukung (sangat jarang di modern browser)
    return btoa(unescape(encodeURIComponent(value + salt)));
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(value + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Mengambil hash default untuk PIN awal ('1234')
 */
let cachedDefaultHash = '';
export async function getDefaultPinHash(): Promise<string> {
  if (!cachedDefaultHash) {
    cachedDefaultHash = await hashStringSHA256(DEFAULT_PIN);
  }
  return cachedDefaultHash;
}

/**
 * Verifikasi PIN yang dimasukkan dengan hash tersimpan di localStorage
 */
export async function verifyPin(inputPin: string): Promise<boolean> {
  const cleanInput = inputPin.trim();
  if (!cleanInput) return false;

  const storedHash = localStorage.getItem('la_admin_pin_hash');

  if (storedHash) {
    const inputHash = await hashStringSHA256(cleanInput);
    return inputHash === storedHash;
  }

  // Fallback migrasi jika ada PIN lama tersimpan dalam plaintext 'la_admin_pin'
  const legacyPin = localStorage.getItem('la_admin_pin');
  if (legacyPin) {
    if (cleanInput === legacyPin || cleanInput.toLowerCase() === legacyPin.toLowerCase()) {
      const inputHash = await hashStringSHA256(cleanInput);
      localStorage.setItem('la_admin_pin_hash', inputHash);
      localStorage.removeItem('la_admin_pin');
      return true;
    }
    return false;
  }

  // Jika belum ada PIN kustom yang disetel, izinkan PIN default '1234' atau 'admin'
  const lower = cleanInput.toLowerCase();
  if (cleanInput === '1234' || lower === 'admin') {
    return true;
  }

  const defaultHash = await getDefaultPinHash();
  const inputHash = await hashStringSHA256(cleanInput);
  return inputHash === defaultHash;
}

/**
 * Simpan PIN baru dalam bentuk hash SHA-256 (tidak pernah menyimpan plaintext)
 */
export async function storeNewPin(newPin: string): Promise<void> {
  const cleanPin = newPin.trim();
  const hashed = await hashStringSHA256(cleanPin);
  localStorage.setItem('la_admin_pin_hash', hashed);
  // Bersihkan key legacy plaintext bila ada
  localStorage.removeItem('la_admin_pin');
}

/**
 * Brute-force rate limiting helper
 */
const ATTEMPTS_KEY = 'la_admin_failed_attempts';
const LOCKOUT_KEY = 'la_admin_lockout_until';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 detik lock duration

export function checkLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const lockoutUntil = parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return {
        isLocked: true,
        remainingSeconds: Math.ceil((lockoutUntil - now) / 1000)
      };
    }
  } catch {
    // ignore
  }
  return { isLocked: false, remainingSeconds: 0 };
}

export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number; attemptsCount: number } {
  try {
    const currentAttempts = parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
    sessionStorage.setItem(ATTEMPTS_KEY, currentAttempts.toString());

    if (currentAttempts >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
      return {
        isLocked: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        attemptsCount: currentAttempts
      };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsCount: currentAttempts
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsCount: 1 };
  }
}

export function resetFailedAttempts(): void {
  try {
    sessionStorage.removeItem(ATTEMPTS_KEY);
    sessionStorage.removeItem(LOCKOUT_KEY);
  } catch {
    // ignore
  }
}

/**
 * Token Reset Password / PIN
 */
const RESET_TOKEN_KEY = 'la_admin_reset_token';
const RESET_EXPIRY_KEY = 'la_admin_reset_expiry';
const RESET_VALIDITY_MS = 15 * 60 * 1000; // 15 menit

export function generateResetToken(): { token: string; expiry: number; resetUrl: string } {
  const array = new Uint8Array(16);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  const token = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  const expiry = Date.now() + RESET_VALIDITY_MS;

  localStorage.setItem(RESET_TOKEN_KEY, token);
  localStorage.setItem(RESET_EXPIRY_KEY, expiry.toString());

  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const resetUrl = `${origin}${pathname}?reset_token=${token}#admin`;

  return { token, expiry, resetUrl };
}

export function verifyResetToken(token: string): boolean {
  if (!token) return false;
  const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
  const storedExpiry = parseInt(localStorage.getItem(RESET_EXPIRY_KEY) || '0', 10);

  if (!storedToken || storedToken !== token) {
    return false;
  }

  if (Date.now() > storedExpiry) {
    clearResetToken();
    return false;
  }

  return true;
}

export function clearResetToken(): void {
  localStorage.removeItem(RESET_TOKEN_KEY);
  localStorage.removeItem(RESET_EXPIRY_KEY);
}

export function createResetEmailMailto(recipientEmail: string, resetUrl: string): string {
  const subject = `[L.A Transport Batam] Tautan Pemulihan PIN Admin CMS`;
  const body = `Halo Pengelola L.A Transport Batam,

Kami menerima permintaan untuk mereset PIN / Password akses Admin CMS Portal Anda.

Silakan klik tautan di bawah ini untuk membuat PIN baru:
${resetUrl}

Catatan Keamanan:
- Tautan ini hanya berlaku selama 15 menit.
- Jika Anda tidak meminta pemulihan ini, abaikan email ini dan PIN Anda akan tetap aman.

Salam hangat,
Sistem Keamanan L.A Transport Batam`;

  return `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
