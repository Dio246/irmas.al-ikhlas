/**
 * security.ts
 * Lapisan Keamanan Aplikasi Web IRMAS Masjid Jami'e Al-Ikhlas
 *
 * Menyediakan proteksi tingkat tinggi terhadap:
 * 1. XSS (Cross-Site Scripting) & HTML Injection
 * 2. File Upload Malware / Virus / Trojan / Polyglot / WebShell
 * 3. File Traversal & Name Spoofing
 * 4. Fake Extension (Verifikasi Magic Bytes Binary)
 * 5. Denial of Service (DoS) / Spam Flooding / Memory Exhaustion
 * 6. Reverse Tabnabbing & Phishing Redirects
 */

// Ekstensi & MIME Type yang secara ketat diizinkan (Hanya gambar raster murni)
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabyte per file
export const MAX_BATCH_FILES = 15; // Maksimal 15 foto sekali unggah

// Daftar ekstensi berbahaya yang dilarang keras
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.php5', '.js', '.vbs',
  '.scr', '.dll', '.jar', '.apk', '.msi', '.ps1', '.html', '.htm', '.xhtml',
  '.svg', '.xml', '.cgi', '.pl', '.py', '.wsf', '.reg'
];

/**
 * Membersihkan string teks dari tag HTML berbahaya, script injeksi, dan karakter kontrol (Anti-XSS).
 */
export function sanitizeText(input: unknown, maxLength: number = 2000): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input).slice(0, maxLength);
  }

  let text = input;

  // Hapus karakter kontrol (null bytes, carriage injection, dll)
  text = text.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  // Hapus tag HTML & Script
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  text = text.replace(/<[^>]+>/g, '');

  // Hapus pola event handler seperti onclick=, onerror=, dll
  text = text.replace(/on\w+\s*=/gi, '');

  // Hapus protokol pseudo berbahaya (javascript:, data:text/html, vbscript:)
  text = text.replace(/javascript:/gi, '');
  text = text.replace(/vbscript:/gi, '');
  text = text.replace(/data:text\/html/gi, '');

  // Batasi panjang string untuk mencegah memory overflow
  return text.trim().slice(0, maxLength);
}

/**
 * Membersihkan URL dan memvalidasi protokol yang aman (Anti-Phishing & Open Redirect).
 * Hanya mengizinkan protokol https:, http:, atau data:image aman.
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Izinkan relative path yang aman
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Izinkan data URL gambar yang valid
  if (trimmed.startsWith('data:image/jpeg;base64,') ||
      trimmed.startsWith('data:image/png;base64,') ||
      trimmed.startsWith('data:image/webp;base64,')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    // URL tidak valid
  }

  return '';
}

/**
 * Membersihkan nama file dari karakter berbahaya, path traversal, dan null-byte injection.
 */
export function sanitizeFileName(rawName: string): string {
  if (!rawName) return `irmas-${Date.now()}.jpg`;

  // Cegah path traversal (../../ atau ..\\)
  let clean = rawName.replace(/(\.\.[\/\\])+/g, '');

  // Hapus karakter ilegal pada sistem file dan shell
  clean = clean.replace(/[\/\\\\:*?"<>|;&$`!~^+=]/g, '-');
  clean = clean.replace(/[\u0000-\u001F]/g, '');

  // Ambil ekstensi terakhir
  const lastDot = clean.lastIndexOf('.');
  if (lastDot === -1) {
    return `${clean.slice(0, 40)}-${Date.now()}.jpg`;
  }

  const baseName = clean.slice(0, lastDot).replace(/\./g, '-').slice(0, 40) || 'foto';
  const ext = clean.slice(lastDot).toLowerCase();

  const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.jpg';
  return `${baseName}-${Date.now()}${safeExt}`;
}

/**
 * Membaca Magic Bytes (file signature biner) dari file untuk memastikan
 * bahwa file tersebut benar-benar gambar asli dan bukan virus/malware/script
 * yang sengaja diganti ekstensinya menjadi .jpg atau .png.
 */
export async function verifyImageMagicBytes(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. Validasi JPEG / JPG (FF D8 FF)
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return true;
    }

    // 2. Validasi PNG (89 50 4E 47 0D 0A 1A 0A)
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4E &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0D &&
      bytes[5] === 0x0A &&
      bytes[6] === 0x1A &&
      bytes[7] === 0x0A
    ) {
      return true;
    }

    // 3. Validasi WEBP (RIFF .... WEBP)
    // Bytes 0-3: 'RIFF' (0x52, 0x49, 0x46, 0x46)
    // Bytes 8-11: 'WEBP' (0x57, 0x45, 0x42, 0x50)
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return true;
    }

    return false;
  } catch (err) {
    console.error('Gagal memverifikasi signature biner file:', err);
    return false;
  }
}

/**
 * Validasi menyeluruh keamanan file sebelum diproses dan diunggah.
 */
export async function validateUploadedFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // 1. Validasi Keberadaan Objek File
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'File tidak valid atau rusak.' };
  }

  // 2. Validasi Ukuran File (Mencegah serangan Denial of Service / Crash Memori)
  if (file.size === 0) {
    return { valid: false, error: `File "${file.name}" kosong (0 byte).` };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File "${file.name}" berukuran ${sizeMB} MB melebihi batas aman maksimal 10 MB per foto.`
    };
  }

  // 3. Cek nama file berbahaya dan ekstensi terlarang
  const lowerName = file.name.toLowerCase();
  for (const dangerous of DANGEROUS_EXTENSIONS) {
    if (lowerName.endsWith(dangerous)) {
      return {
        valid: false,
        error: `Demi keamanan, jenis file "${dangerous}" dilarang keras karena berpotensi mengandung kode script/virus.`
      };
    }
  }

  // SVG dilarang karena format XML dapat menyimpan JavaScript executable (<svg onload=...>)
  if (lowerName.endsWith('.svg') || file.type === 'image/svg+xml') {
    return {
      valid: false,
      error: 'Format SVG tidak diizinkan demi keamanan (hanya JPG, PNG, dan WEBP yang diperbolehkan).'
    };
  }

  // 4. Validasi Ekstensi yang Diizinkan
  const hasValidExt = ALLOWED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: `Format file "${file.name}" tidak didukung. Harap unggah foto dengan format JPG, JPEG, PNG, atau WEBP.`
    };
  }

  // 5. Validasi MIME Type Browser
  if (file.type && !ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipe konten file (${file.type}) tidak diizinkan. Hanya file foto murni yang diterima.`
    };
  }

  // 6. Validasi Magic Bytes Biner (Mendeteksi file kamuflase / virus yang berganti ekstensi)
  const isRealImage = await verifyImageMagicBytes(file);
  if (!isRealImage) {
    return {
      valid: false,
      error: `Peringatan Keamanan: File "${file.name}" terdeteksi bukan file foto asli atau isinya rusak. Sistem menolak file ini untuk mencegah serangan malware/virus.`
    };
  }

  return { valid: true };
}

/**
 * Rate Limiter Sederhana di Browser (Anti-Bot / Anti-Spam Flooding)
 * Membatasi frekuensi unggahan agar server dan Google Drive tidak dibanjiri request otomatis.
 */
const RATE_LIMIT_KEY = 'irmas_security_upload_timestamps';
const MAX_UPLOADS_PER_WINDOW = 6;
const WINDOW_DURATION_MS = 120 * 1000; // 2 Menit

export function checkUploadRateLimit(): { allowed: boolean; waitSeconds?: number } {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    let timestamps: number[] = raw ? JSON.parse(raw) : [];

    // Filter timestamp dalam jendela waktu aktif (2 menit terakhir)
    timestamps = timestamps.filter(t => now - t < WINDOW_DURATION_MS);

    if (timestamps.length >= MAX_UPLOADS_PER_WINDOW) {
      const oldestInWindow = timestamps[0];
      const waitSeconds = Math.ceil((WINDOW_DURATION_MS - (now - oldestInWindow)) / 1000);
      return { allowed: false, waitSeconds: Math.max(1, waitSeconds) };
    }

    // Catat upload baru
    timestamps.push(now);
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}
