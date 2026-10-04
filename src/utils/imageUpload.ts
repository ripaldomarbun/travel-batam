/**
 * L.A Transport Batam - Client-Side Image Upload & Compression Helper
 * Mengompres foto yang diupload dari HP / Laptop secara lokal menggunakan HTML5 Canvas
 * Menghasilkan Data URL ringan (~80-150KB) yang tajam untuk Retina display
 * dan aman disimpan di localStorage tanpa menyebabkan QuotaExceededError.
 */

export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Memeriksa apakah browser mendukung encoding canvas ke format WebP
 */
export function isWebpSupported(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Membaca dan mengonversi file gambar ke format WebP berbobot ultra-ringan
 * (Menghemat hingga 40-70% ukuran file dibanding JPG biasa tanpa menurunkan ketajaman)
 */
export async function convertToWebp(
  file: File,
  quality: number = 0.85,
  maxWidth: number = 1440,
  maxHeight: number = 1080
): Promise<string> {
  return processUploadedImage(file, {
    maxWidth,
    maxHeight,
    quality,
    format: 'image/webp'
  });
}

/**
 * Membaca dan mengompres file foto menjadi format Data URL yang dioptimalkan
 * Otomatis memprioritaskan WebP modern untuk efisiensi loading maksimal!
 */
export async function processUploadedImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1440,
    maxHeight = 1080,
    quality = 0.82,
    format = 'image/webp'
  } = options;

  if (!file.type.startsWith('image/')) {
    throw new Error('File yang dipilih bukan merupakan format gambar yang didukung (JPG, PNG, WebP).');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Gagal membaca file dari penyimpanan perangkat Anda.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Format file gambar rusak atau tidak dapat diproses.'));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung rasio resize proporsional
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Aktifkan anti-aliasing berkualitas tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Gambar ke canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Prioritaskan WebP jika didukung, dengan fallback aman ke JPEG
        try {
          const webpSupported = isWebpSupported();
          const targetFormat = format === 'image/webp' && webpSupported ? 'image/webp' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(targetFormat, quality);
          resolve(optimizedDataUrl);
        } catch {
          try {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch {
            resolve(reader.result as string);
          }
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Memproses beberapa file sekaligus untuk galeri
 */
export async function processMultipleImages(
  files: FileList | File[],
  options?: ProcessImageOptions
): Promise<string[]> {
  const fileArray = Array.from(files);
  const results: string[] = [];

  for (const file of fileArray) {
    if (file.type.startsWith('image/')) {
      try {
        const compressed = await processUploadedImage(file, options);
        results.push(compressed);
      } catch (err) {
        console.warn(`Gagal memproses file ${file.name}:`, err);
      }
    }
  }

  return results;
}
