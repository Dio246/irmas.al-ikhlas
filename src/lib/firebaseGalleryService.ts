import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import type { GalleryItem } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';
import { compressToCompactDataUrl } from './galleryStorage';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use specific database ID configured for this project
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

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

    const payload = {
      ...item,
      imageUrl: sanitizedImages[0] || item.imageUrl,
      images: sanitizedImages,
      createdAt: Date.now()
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('Gagal menyimpan dokumentasi ke Firestore:', error);
    throw error;
  }
}

/**
 * Fetches all documentation items from Firestore once
 */
export async function getGalleryItemsFromFirestore(): Promise<GalleryItem[]> {
  try {
    const q = query(collection(db, GALLERY_COLLECTION), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as GalleryItem);
  } catch (error) {
    console.error('Gagal memuat galeri dari Firestore:', error);
    return [];
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
