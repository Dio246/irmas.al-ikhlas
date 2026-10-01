/**
 * Google Drive service for IRMAS Al-Ikhlas.
 *
 * The browser does NOT store shared gallery data locally.
 * Photos are uploaded to Google Drive through the Google Apps Script Web App.
 * The same Web App is used to read the shared gallery for every device.
 */

import type { GalleryItem } from '../types';
import { resolveGalleryCategory } from './categoryHelper';

export const TARGET_DRIVE_EMAIL = 'jekb66476@gmail.com';
export const TARGET_FOLDER_NAME = 'Dokumentasi IRMAS Al-Ikhlas';
export const SCRIPT_URL_STORAGE_KEY = 'irmas_gdrive_script_url';

// Ganti dengan URL /exec dari deployment Google Apps Script milik akun IRMAS.
export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3kN3sB_2huQeYecs2R14_sX1b6sXfLu1G1SwDrHMskdN6BZz66WBDsTWZ2WgzeMeW/exec';

// Dipertahankan agar komponen lama tetap dapat dikompilasi.
// Kode backend yang sebenarnya berada di backend/Code.gs.
export const GOOGLE_APPS_SCRIPT_CODE = '';

export interface DriveUploadResult {
  fileId: string;
  fileName: string;
  directUrl: string;
  driveUrl: string;
  folderUrl?: string;
  folderName?: string;
}

function getConfiguredScriptUrl(scriptUrl?: string): string {
  const explicit = scriptUrl?.trim();
  if (explicit && /^https?:\/\//i.test(explicit)) return explicit;

  try {
    const saved = localStorage.getItem(SCRIPT_URL_STORAGE_KEY)?.trim();
    if (saved && /^https?:\/\//i.test(saved)) return saved;
  } catch {
    // localStorage may be unavailable; use the default below.
  }

  return DEFAULT_SCRIPT_URL;
}

export function getSavedScriptUrl(): string {
  return getConfiguredScriptUrl();
}

export function saveScriptUrl(url: string): void {
  const clean = url.trim();
  if (!/^https?:\/\//i.test(clean)) {
    throw new Error('URL Google Apps Script tidak valid.');
  }

  try {
    localStorage.setItem(SCRIPT_URL_STORAGE_KEY, clean);
  } catch {
    // The URL is also passed explicitly by the component when possible.
  }
}

function getDriveThumbnailUrl(fileId: string, size = 1200): string {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${size}`;
}

function getDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;
}

/**
 * Upload one image to Google Drive through Apps Script.
 * The user does not need to sign in to Google.
 */
export async function uploadToGoogleDriveNoLogin(
  fileDataUrl: string,
  fileName: string,
  scriptUrl?: string,
  activityTitle?: string,
  metadata?: {
    category?: string;
    date?: string;
    location?: string;
    description?: string;
    participants?: number;
  }
): Promise<DriveUploadResult> {
  const targetUrl = getConfiguredScriptUrl(scriptUrl);

  if (!targetUrl || targetUrl.includes('PASTE_YOUR_APPS_SCRIPT')) {
    throw new Error('URL Google Apps Script belum dikonfigurasi.');
  }

  const pureBase64 = fileDataUrl.includes('base64,')
    ? fileDataUrl.split('base64,')[1]
    : fileDataUrl;

  if (!pureBase64) {
    throw new Error('Data foto kosong atau tidak valid.');
  }

  const cleanTitle = (activityTitle || '')
    .replace(/[\/\\:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);

  const payload = {
    action: 'upload',
    fileName,
    mimeType: 'image/jpeg',
    fileData: pureBase64,
    activityTitle: cleanTitle,
    folderName: cleanTitle,
    rootFolderName: TARGET_FOLDER_NAME,
    category: metadata?.category || 'kajian',
    date: metadata?.date || '',
    location: metadata?.location || "Masjid Jamie Al-Ikhlas",
    description: metadata?.description || `Dokumentasi kegiatan ${cleanTitle} di Google Drive.`,
    participants: metadata?.participants || 0
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script mengembalikan HTTP ${response.status}.`);
    }

    const text = await response.text();
    let result: any;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error('Respons Google Apps Script bukan JSON yang valid.');
    }

    if (result?.status !== 'success' || !result?.fileId) {
      throw new Error(result?.message || 'Foto gagal disimpan ke Google Drive.');
    }

    const fileId = String(result.fileId);

    return {
      fileId,
      fileName: result.fileName || fileName,
      directUrl: result.directUrl || getDriveThumbnailUrl(fileId),
      driveUrl: result.driveUrl || getDriveViewUrl(fileId),
      folderUrl: result.folderUrl,
      folderName: result.folderName
    };
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error('Upload ke Google Drive timeout. Periksa koneksi internet dan coba lagi.');
    }
    throw error instanceof Error ? error : new Error('Upload ke Google Drive gagal.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Deletes a file or activity folder from Google Drive through the Google Apps Script Web App.
 * Sends delete request with fileId and folderUrl for permanent removal.
 */
export async function deleteFromGoogleDriveNoLogin(
  fileId: string,
  scriptUrl?: string,
  extra?: { folderUrl?: string; folderId?: string }
): Promise<{ success: boolean; message: string }> {
  const targetUrl = getConfiguredScriptUrl(scriptUrl);

  if (!targetUrl || targetUrl.includes('PASTE_YOUR_APPS_SCRIPT')) {
    return { success: false, message: 'URL Google Apps Script belum dikonfigurasi.' };
  }

  try {
    const payload = {
      action: 'delete',
      fileId,
      folderUrl: extra?.folderUrl || '',
      folderId: extra?.folderId || ''
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    window.clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, message: `HTTP ${response.status} saat menghapus dari Google Drive.` };
    }

    const text = await response.text();
    let res: any = {};
    try {
      res = JSON.parse(text);
    } catch {
      // If Apps Script does not return JSON, check text
      return { success: true, message: 'Permintaan hapus diproses.' };
    }

    return {
      success: res.status === 'success' || res.status === 'ok',
      message: res.message || 'Foto berhasil dihapus dari Google Drive.'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Gagal menghubungi Google Apps Script untuk menghapus foto.'
    };
  }
}

export async function testDriveScriptConnection(scriptUrl: string): Promise<{
  success: boolean;
  message: string;
  folder?: string;
}> {
  const targetUrl = getConfiguredScriptUrl(scriptUrl);

  if (!targetUrl || targetUrl.includes('PASTE_YOUR_APPS_SCRIPT')) {
    return { success: false, message: 'URL Google Apps Script belum dikonfigurasi.' };
  }

  try {
    const response = await fetch(targetUrl, { method: 'GET', cache: 'no-store' });
    if (!response.ok) {
      return { success: false, message: `Google Apps Script mengembalikan HTTP ${response.status}.` };
    }

    const data = await response.json();

    if (data?.status !== 'ok') {
      return { success: false, message: data?.message || 'Respons Apps Script tidak sesuai.' };
    }

    return {
      success: true,
      message: 'Koneksi Google Drive berhasil.',
      folder: data.folder
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : 'Tidak dapat menghubungi Google Apps Script.'
    };
  }
}

export function extractDriveFileId(url: string | undefined): string | null {
  if (!url) return null;

  const patterns = [
    /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?(?:[^#]*&)?id=([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function getCrossBrowserDriveImageUrl(
  url: string | undefined,
  size = 1000
): string {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  return fileId ? getDriveThumbnailUrl(fileId, size) : url;
}

export function getDriveImageFallbackUrls(url: string | undefined): string[] {
  if (!url) return [];

  const fileId = extractDriveFileId(url);
  if (!fileId) return [url];

  return [
    `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}=w1000`,
    `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}`,
    getDriveThumbnailUrl(fileId, 1000),
    `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`
  ];
}

/**
 * Reads the shared gallery directly from Google Drive through Apps Script.
 * This is the source used by every device.
 */
export async function fetchGoogleDriveGallery(
  scriptUrl?: string
): Promise<GalleryItem[]> {
  const targetUrl = getConfiguredScriptUrl(scriptUrl);

  if (!targetUrl || targetUrl.includes('PASTE_YOUR_APPS_SCRIPT')) {
    throw new Error('URL Google Apps Script belum dikonfigurasi.');
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    20000
  );

  try {
    const response = await fetch(
      `${targetUrl}?action=list&t=${Date.now()}`,
      {
        method: 'GET',
        cache: 'no-store',
        redirect: 'follow',
        headers: {
          Accept: 'application/json'
        },
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gagal mengambil galeri: HTTP ${response.status}`
      );
    }

    const text = await response.text();

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        'Respons Google Apps Script bukan JSON yang valid.'
      );
    }

    if (data?.status !== 'ok') {
      throw new Error(
        data?.message ||
        'Google Apps Script gagal mengambil galeri.'
      );
    }

    const rawItems: any[] =
      Array.isArray(data.items)
        ? data.items
        : [];

    return rawItems.map(
      (item, index): GalleryItem => {
        const fileId = String(
          item.fileId ||
          item.driveFileId ||
          ''
        );

        const firstImage = fileId
          ? getDriveThumbnailUrl(fileId, 1200)
          : String(
              item.imageUrl ||
              item.directUrl ||
              ''
            );

        const images =
          Array.isArray(item.images)
            ? item.images
                .map((image: string) => {
                  const id = extractDriveFileId(image);

                  return id
                    ? getDriveThumbnailUrl(id, 1200)
                    : image;
                })
                .filter(Boolean)
            : [firstImage];

        return {
          id:
            String(
              item.id ||
              `gdrive-${fileId || index}`
            ),

          title:
            String(
              item.title ||
              item.activityTitle ||
              'Dokumentasi Kegiatan'
            ),

          category:
            resolveGalleryCategory(
              item.category,
              String(item.title || item.activityTitle || '')
            ),

          date:
            String(
              item.date ||
              'Terbaru'
            ),

          location:
            String(
              item.location ||
              "Masjid Jami'e Al-Ikhlas"
            ),

          imageUrl:
            firstImage,

          images,

          description:
            String(
              item.description ||
              "Dokumentasi kegiatan IRMAS Masjid Jami'e Al-Ikhlas."
            ),

          participants:
            Number(item.participants) ||
            undefined,

          highlight:
            Boolean(item.highlight),

          isUserUploaded:
            true,

          storageType:
            'gdrive',

          createdAt:
            Number(item.createdAt) ||
            Date.now(),

          driveFileId:
            fileId ||
            undefined,

          driveFileIds:
            Array.isArray(
              item.driveFileIds ||
              item.fileIds
            )
              ? (
                  item.driveFileIds ||
                  item.fileIds
                )
              : fileId
                ? [fileId]
                : [],

          driveUrl:
            item.driveUrl ||
            (
              fileId
                ? getDriveViewUrl(fileId)
                : undefined
            ),

          driveFolderUrl:
            item.driveFolderUrl ||
            item.folderUrl
        };
      }
    );

  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(
        'Pengambilan galeri dari Google Drive timeout.'
      );
    }

    throw error instanceof Error
      ? error
      : new Error(
          'Tidak dapat mengambil galeri Google Drive.'
        );

  } finally {
    window.clearTimeout(timeoutId);
  }
}
