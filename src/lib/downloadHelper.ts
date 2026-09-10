import JSZip from 'jszip';
import { resolveAsset } from './assetHelper';

/**
 * Triggers a direct browser download for a blob or URL
 */
export function triggerBrowserDownload(urlOrBlobUrl: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = urlOrBlobUrl;
  anchor.download = filename;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
  }, 200);
}

/**
 * Extracts Google Drive file ID if present
 */
function extractDriveFileId(url: string): string | null {
  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) return driveMatch[1];

  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];

  return null;
}

/**
 * Fetches an image and converts it to a Blob.
 * Handles data URLs, local assets, CORS-enabled remote hosts, and canvas fallback.
 */
async function fetchImageAsBlob(rawUrl: string): Promise<{ blob: Blob; extension: string }> {
  const url = resolveAsset(rawUrl);

  // 1. Data URL
  if (url.startsWith('data:')) {
    const mimeMatch = url.match(/^data:([^;]+);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const ext = mime.split('/')[1] || 'jpg';
    const res = await fetch(url);
    const blob = await res.blob();
    return { blob, extension: ext };
  }

  // 2. Blob URL
  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    const blob = await res.blob();
    return { blob, extension: 'jpg' };
  }

  // 3. Try standard CORS fetch
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      let ext = 'jpg';
      if (blob.type.includes('png')) ext = 'png';
      else if (blob.type.includes('webp')) ext = 'webp';
      else if (blob.type.includes('gif')) ext = 'gif';
      return { blob, extension: ext };
    }
  } catch {
    // Continue to canvas fallback
  }

  // 4. HTML Image + Canvas fallback (handles many cross-origin CDNs)
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context unavailable');
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({ blob, extension: 'jpg' });
          } else {
            reject(new Error('Canvas toBlob returned null'));
          }
        }, 'image/jpeg', 0.95);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Downloads all photos of an album directly:
 * - If multiple photos: bundles them neatly into a single .ZIP file
 * - If single photo: downloads the photo directly
 */
export async function downloadAlbumPhotos(
  title: string,
  images: string[],
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  const imagesList = images && images.length > 0 ? images : [];
  if (imagesList.length === 0) return false;

  // Sanitize title for filename
  const cleanTitle = title
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .substring(0, 60);

  const total = imagesList.length;

  // Single photo: download directly without zip overhead
  if (total === 1) {
    onProgress?.(1, 1);
    const imgUrl = imagesList[0];
    try {
      const { blob, extension } = await fetchImageAsBlob(imgUrl);
      const blobUrl = URL.createObjectURL(blob);
      triggerBrowserDownload(blobUrl, `${cleanTitle}.${extension}`);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return true;
    } catch {
      // Fallback to direct URL download
      const driveId = extractDriveFileId(imgUrl);
      const downloadUrl = driveId
        ? `https://drive.google.com/uc?export=download&id=${driveId}`
        : resolveAsset(imgUrl);
      triggerBrowserDownload(downloadUrl, `${cleanTitle}.jpg`);
      return true;
    }
  }

  // Multiple photos: Bundle into a ZIP file
  const zip = new JSZip();
  let packedCount = 0;
  const failedDirectUrls: { url: string; filename: string }[] = [];

  for (let i = 0; i < total; i++) {
    onProgress?.(i + 1, total);
    const imgUrl = imagesList[i];
    const baseName = `${String(i + 1).padStart(2, '0')}-${cleanTitle}`;

    try {
      const { blob, extension } = await fetchImageAsBlob(imgUrl);
      zip.file(`${baseName}.${extension}`, blob);
      packedCount++;
    } catch {
      // If fetching/canvas failed for this photo (e.g. strict CORS), prepare direct fallback download
      const driveId = extractDriveFileId(imgUrl);
      const fallbackUrl = driveId
        ? `https://drive.google.com/uc?export=download&id=${driveId}`
        : resolveAsset(imgUrl);
      failedDirectUrls.push({ url: fallbackUrl, filename: `${baseName}.jpg` });
    }
  }

  // If at least one photo was packed into the ZIP
  if (packedCount > 0) {
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    const zipUrl = URL.createObjectURL(zipBlob);
    triggerBrowserDownload(zipUrl, `${cleanTitle} - Dokumentasi IRMAS.zip`);
    setTimeout(() => URL.revokeObjectURL(zipUrl), 15000);
  }

  // Trigger individual fallback downloads for any photos that could not be zipped due to CORS
  failedDirectUrls.forEach((f, idx) => {
    setTimeout(() => {
      triggerBrowserDownload(f.url, f.filename);
    }, (idx + 1) * 300);
  });

  return true;
}
