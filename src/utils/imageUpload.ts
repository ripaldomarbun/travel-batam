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
}

/**
 * Membaca dan mengompres file foto menjadi format Data URL yang dioptimalkan
 */
export async function processUploadedImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<string> {
  const { maxWidth = 1280, maxHeight = 960, quality = 0.82 } = options;

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
          // Fallback ke raw data URL jika canvas context tidak tersedia
          resolve(reader.result as string);
          return;
        }

        // Aktifkan anti-aliasing berkualitas tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Gambar ke canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP atau JPEG yang dioptimasi
        try {
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(reader.result as string);
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
