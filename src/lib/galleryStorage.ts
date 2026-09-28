/**
 * galleryStorage.ts
 * Manages local persistent gallery storage (IndexedDB with LocalStorage fallback)
 * Allows direct photo uploads WITHOUT requiring any Google login!
 */

import { GalleryItem } from '../types';

const DB_NAME = 'irmas_gallery_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_items';
const WEBHOOK_STORAGE_KEY = 'irmas_gdrive_webhook_url';

// Open or create IndexedDB
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Loads all custom uploaded gallery items from IndexedDB or LocalStorage
 */
export async function loadCustomGalleryItems(): Promise<GalleryItem[]> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = req.result as GalleryItem[];
        if (results && results.length > 0) {
          // Keep chronological order (first uploaded to last uploaded, placed at the bottom)
          resolve(results);
        } else {
          // Fallback to localStorage check
          resolve(loadFromLocalStorage());
        }
      };

      req.onerror = () => {
        resolve(loadFromLocalStorage());
      };
    });
  } catch {
    return loadFromLocalStorage();
  }
}

function loadFromLocalStorage(): GalleryItem[] {
  try {
    const saved = localStorage.getItem('irmas_custom_gallery_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Saves a new custom gallery item to IndexedDB (and syncs to localStorage metadata)
 */
export async function saveCustomGalleryItem(item: GalleryItem): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      const current = loadFromLocalStorage();
      const updated = [...current.filter((it) => it.id !== item.id), item];
      // Keep only metadata in localStorage if string is too large
      localStorage.setItem('irmas_custom_gallery_items', JSON.stringify(updated.slice(-20)));
    } catch {
      // ignore
    }
  }
}

export async function deleteCustomGalleryItem(itemId: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(itemId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }

  try {
    const current = loadFromLocalStorage();
    const updated = current.filter((it) => it.id !== itemId);
    localStorage.setItem('irmas_custom_gallery_items', JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * Compresses an image file client-side to optimal web dimensions and quality.
 * Lightweight, fast, robust on mobile devices (handles camera raw, HEIC, large orientation metadata).
 */
export async function compressImageFile(file: File, maxWidth = 1000, quality = 0.75): Promise<string> {
  // Method 1: Modern high-performance createImageBitmap (built into modern Android & iOS browsers, handles huge photos smoothly without memory spikes)
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      let width = bitmap.width;
      let height = bitmap.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();
        return canvas.toDataURL('image/jpeg', quality);
      }
      bitmap.close();
    } catch (bitmapErr) {
      console.warn('createImageBitmap fallback ke Image loading:', bitmapErr);
    }
  }

  // Method 2: Blob Object URL (more reliable on mobile devices than full base64 FileReader memory dump)
  try {
    const objectUrl = URL.createObjectURL(file);
    const result = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(objectUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (canvasErr) {
          reject(canvasErr);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Gagal memproses gambar'));
      };
      img.src = objectUrl;
    });
    return result;
  } catch (objectUrlErr) {
    console.warn('Blob URL fallback ke FileReader:', objectUrlErr);
  }

  // Method 3: Standard FileReader fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file dari penyimpanan perangkat'));
    reader.readAsDataURL(file);
  });
}

/**
 * Creates an ultra-lightweight web thumbnail (e.g. max 450px)
 * ensuring base64 representations stay well under Firestore limits (<150KB)
 */
export function compressToCompactDataUrl(dataUrl: string, maxWidth = 450, quality = 0.65): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl.startsWith('data:')) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Optional Google Apps Script Webhook sync
 * If a webhook URL for jekb66476@gmail.com is provided, this forwards the photo
 * to jekb66476@gmail.com's Google Drive without any login required!
 */
export function getSavedWebhookUrl(): string {
  try {
    return localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveWebhookUrl(url: string): void {
  try {
    localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
  } catch {
    // ignore
  }
}

export async function uploadToDriveWebhook(
  fileDataUrl: string,
  fileName: string,
  webhookUrl: string
): Promise<string | null> {
  if (!webhookUrl) return null;
  try {
    const base64Content = fileDataUrl.split(',')[1] || fileDataUrl;
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        fileData: base64Content,
        fileName: fileName,
        folderName: 'Dokumentasi IRMAS Al-Ikhlas',
      }),
    });
    const result = await response.json();
    return result.directUrl || result.fileUrl || null;
  } catch (err) {
    console.warn('Webhook sync optional error:', err);
    return null;
  }
}
