import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc
} from 'firebase/firestore';
import type { GalleryItem } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';
import { compressToCompactDataUrl } from './galleryStorage';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use specific database ID configured for this project with automatic long-polling detection
// to prevent "Could not reach Cloud Firestore backend" in iframes, proxies, and preview domains
export const db = (() => {
  const databaseId = firebaseConfig.firestoreDatabaseId || undefined;
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true
    }, databaseId);
  } catch {
    return getFirestore(app, databaseId);
  }
})();

export const GALLERY_COLLECTION = 'gallery_items';

/**
 * Saves a new documentation item to Firebase Firestore so it is instantly
 * visible to ALL users on all devices (mobile, laptop, tablet, etc.)
 */
export async function saveGalleryItemToFirestore(item: GalleryItem): Promise<void> {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, item.id);
    
    // Ensure images are compact so they fit comfortably within Firestore document limit (1MB)
    const rawImages = item.images && item.images.length > 0 ? item.images : [item.imageUrl];
    const sanitizedImages: string[] = [];

    for (const img of rawImages) {
      if (img.startsWith('data:')) {
        // Compact large base64 strings so they stay small
        const compact = await compressToCompactDataUrl(img, 450, 0.65);
        sanitizedImages.push(compact);
      } else {
        // Remote URLs (e.g. Google Drive URLs or local asset paths) are already tiny strings
        sanitizedImages.push(img);
      }
    }

    // Clean payload: Firestore forbids 'undefined' values anywhere in document objects
    const payload: Record<string, any> = {
      id: item.id,
      title: item.title || '',
      category: item.category || 'kajian',
      date: item.date || 'Agustus 2026',
      location: item.location || 'Masjid Jamie Al-Ikhlas',
      imageUrl: sanitizedImages[0] || item.imageUrl || '',
      images: sanitizedImages,
      description: item.description || '',
      participants: typeof item.participants === 'number' ? item.participants : 30,
      highlight: Boolean(item.highlight),
      createdAt: (item as any).createdAt || Date.now()
    };

    if (item.driveFileId) payload.driveFileId = item.driveFileId;
    if (item.driveFileIds && Array.isArray(item.driveFileIds) && item.driveFileIds.length > 0) {
      payload.driveFileIds = item.driveFileIds.filter(Boolean);
    }
    if (item.driveUrl) payload.driveUrl = item.driveUrl;
    if (item.driveFolderUrl) payload.driveFolderUrl = item.driveFolderUrl;

    // Safety timeout: Do not allow setDoc network negotiation to hang the browser UI
    const writePromise = setDoc(docRef, payload, { merge: true });
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        // Resolve after 6s timeout so UI can proceed smoothly while Firestore writes in background
        resolve();
      }, 6000);
    });

    await Promise.race([writePromise, timeoutPromise]);
  } catch (error) {
    console.error('Gagal menyimpan dokumentasi ke Firestore:', error);
    // Non-fatal: Local state and IndexedDB already retain the item
  }
}

/**
 * Fetches all documentation items from Firestore once
 */
export async function getGalleryItemsFromFirestore(): Promise<GalleryItem[]> {
  try {
    const snapshot = await getDocs(collection(db, GALLERY_COLLECTION));
    const items = snapshot.docs.map(d => ({
      ...(d.data() as GalleryItem),
      id: d.id || (d.data() as GalleryItem).id
    }));
    items.sort((a, b) => ((a as any).createdAt || 0) - ((b as any).createdAt || 0));
    return items;
  } catch (error) {
    console.error('Gagal memuat galeri dari Firestore:', error);
    return [];
  }
}

/**
 * Automatically syncs local items from this device to Firestore
 * so they instantly become visible on all other devices (phone, laptop, tablet).
 */
export async function syncLocalItemsToFirestore(localItems: GalleryItem[]): Promise<number> {
  if (!localItems || localItems.length === 0) return 0;
  try {
    const remoteItems = await getGalleryItemsFromFirestore();
    const remoteIds = new Set(remoteItems.map(it => it.id));
    let synced = 0;

    for (const item of localItems) {
      if (!remoteIds.has(item.id)) {
        await saveGalleryItemToFirestore(item);
        synced++;
      }
    }
    return synced;
  } catch (err) {
    console.warn('Gagal sinkronisasi item lokal ke Firestore:', err);
    return 0;
  }
}

/**
 * Subscribes to real-time updates from Firestore.
 * Whenever someone uploads from a phone or laptop, the listener fires immediately
 * on all connected devices without needing a page refresh!
 */
export function subscribeToGalleryItems(
  onUpdate: (items: GalleryItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const colRef = collection(db, GALLERY_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map(d => ({
          ...(d.data() as GalleryItem),
          id: d.id || (d.data() as GalleryItem).id
        }));
        // Sort in memory by createdAt ascending so older first, newest last
        items.sort((a, b) => ((a as any).createdAt || 0) - ((b as any).createdAt || 0));
        onUpdate(items);
      },
      (err) => {
        console.error('Error listening to Firestore gallery updates:', err);
        if (onError) onError(err);
      }
    );
  } catch (error) {
    console.error('Gagal inisialisasi listener Firestore:', error);
    return () => {};
  }
}

/**
 * Optional delete item helper
 */
export async function deleteGalleryItemFromFirestore(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, itemId));
  } catch (error) {
    console.error('Gagal menghapus item dari Firestore:', error);
    throw error;
  }
}
