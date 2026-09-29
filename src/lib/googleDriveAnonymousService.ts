/**
 * googleDriveAnonymousService.ts
 * 
 * Provides 100% Google Drive storage for jekb66476@gmail.com
 * WITHOUT requiring users / uploaders to log into Google!
 *
 * Utilizes a Google Apps Script Web App deployed under jekb66476@gmail.com
 * with "Execute as: Me" and "Access: Anyone".
 */

import type { GalleryItem } from '../types';

export const TARGET_DRIVE_EMAIL = 'jekb66476@gmail.com';
export const TARGET_FOLDER_NAME = 'Dokumentasi IRMAS Al-Ikhlas';
export const SCRIPT_URL_STORAGE_KEY = 'irmas_gdrive_script_url';
export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwBZJ98jJ8nb8CSu6yKrJ7W-ireTJueD_MrgfpXJvTYkidfpQ2S15N4G4qrowmhJmF4/exec';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * SKRIP PENYIMPANAN & SINKRONISASI GOOGLE DRIVE OTOMATIS
 * IRMAS Masjid Jamie Al-Ikhlas (jekb66476@gmail.com)
 * DILENGKAPI:
 * 1. Otomatis menampilkan galeri foto ke seluruh HP/device
 * 2. Upload foto tanpa login user
 * 3. Anti-Malware & proteksi ukuran
 */

function doGet(e) {
  try {
    var rootFolderName = "Dokumentasi IRMAS Al-Ikhlas";
    var rootFolders = DriveApp.getFoldersByName(rootFolderName);
    var rootFolder = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder(rootFolderName);
    
    var items = [];
    
    // 1. Ambil foto langsung di folder utama
    var files = rootFolder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      var mime = (file.getMimeType() || "").toLowerCase();
      if (mime.indexOf("image/") === 0 || mime.indexOf("image") > -1) {
        var fId = file.getId();
        var fTime = file.getDateCreated().getTime();
        items.push({
          id: "gdrive-file-" + fId,
          fileId: fId,
          fileName: file.getName(),
          title: file.getName().replace(/\\.[^/.]+$/, ""),
          category: "kegiatan",
          date: Utilities.formatDate(file.getDateCreated(), "GMT+7", "dd MMMM yyyy"),
          location: "Masjid Jamie Al-Ikhlas",
          directUrl: "https://lh3.googleusercontent.com/d/" + fId,
          imageUrl: "https://drive.google.com/thumbnail?id=" + fId + "&sz=w1000",
          images: ["https://drive.google.com/thumbnail?id=" + fId + "&sz=w1000"],
          driveUrl: file.getUrl(),
          createdAt: fTime,
          folderName: rootFolderName,
          description: "Dokumentasi foto tersimpan di Google Drive jekb66476@gmail.com",
          participants: 50,
          highlight: false
        });
      }
    }
    
    // 2. Ambil foto terorganisir per sub-folder kegiatan
    var subfolders = rootFolder.getFolders();
    while (subfolders.hasNext()) {
      var subfolder = subfolders.next();
      var subName = subfolder.getName();
      var cleanTitle = subName.replace(/^\\[IRMAS\\]\\s*/i, "");
      var subFiles = subfolder.getFiles();
      var folderImages = [];
      var earliestTime = 0;
      
      while (subFiles.hasNext()) {
        var sFile = subFiles.next();
        var sMime = (sFile.getMimeType() || "").toLowerCase();
        if (sMime.indexOf("image/") === 0 || sMime.indexOf("image") > -1) {
          var sfId = sFile.getId();
          var time = sFile.getDateCreated().getTime();
          if (!earliestTime || time < earliestTime) earliestTime = time;
          folderImages.push({
            fileId: sfId,
            fileName: sFile.getName(),
            directUrl: "https://lh3.googleusercontent.com/d/" + sfId,
            thumbUrl: "https://drive.google.com/thumbnail?id=" + sfId + "&sz=w1000",
            driveUrl: sFile.getUrl(),
            createdAt: time
          });
        }
      }
      
      if (folderImages.length > 0) {
        folderImages.sort(function(a, b) { return a.createdAt - b.createdAt; });
        var first = folderImages[0];
        items.push({
          id: "gdrive-folder-" + subfolder.getId(),
          fileId: first.fileId,
          title: cleanTitle || subName,
          category: "kegiatan",
          date: Utilities.formatDate(new Date(first.createdAt), "GMT+7", "dd MMMM yyyy"),
          location: "Masjid Jamie Al-Ikhlas",
          imageUrl: first.thumbUrl || first.directUrl,
          images: folderImages.map(function(f) { return f.thumbUrl || f.directUrl; }),
          description: "Dokumentasi " + (cleanTitle || subName) + " di Google Drive (" + folderImages.length + " foto)",
          participants: folderImages.length * 15,
          highlight: false,
          createdAt: first.createdAt,
          folderUrl: subfolder.getUrl(),
          folderName: subName
        });
      }
    }
    
    // Urutkan dokumentasi terbaru di urutan paling atas
    items.sort(function(a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      count: items.length,
      items: items,
      targetEmail: "jekb66476@gmail.com",
      folder: rootFolderName,
      message: "Berhasil mengambil " + items.length + " data dokumentasi Google Drive"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.message || "Gagal membaca berkas Google Drive"
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Data permintaan kosong atau tidak valid.");
    }

    var contents = e.postData.contents;
    // Cegah payload raksasa yang berpotensi membebani kuota atau serangan DoS (Maks 20MB teks)
    if (contents.length > 20 * 1024 * 1024) {
      throw new Error("Ukuran data melebihi batas aman maksimal.");
    }

    var data;
    try {
      data = JSON.parse(contents);
    } catch(err) {
      data = e.parameter;
    }
    
    // Fitur: Hapus File dari Google Drive berdasarkan File ID
    if (data.action === "delete" || data.action === "deleteFile") {
      var fileIdToDelete = (data.fileId || "").toString().trim();
      if (!fileIdToDelete) {
        throw new Error("File ID yang akan dihapus tidak disertakan.");
      }
      try {
        var fileToTrash = DriveApp.getFileById(fileIdToDelete);
        fileToTrash.setTrashed(true);
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          message: "File berhasil dihapus dari Google Drive.",
          fileId: fileIdToDelete
        })).setMimeType(ContentService.MimeType.JSON);
      } catch (delErr) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Gagal menghapus file di Drive: " + delErr.message
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 1. Folder Utama IRMAS di Google Drive
    var rootFolderName = "Dokumentasi IRMAS Al-Ikhlas";
    var rootFolders = DriveApp.getFoldersByName(rootFolderName);
    var rootFolder = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder(rootFolderName);
    
    // 2. Sanitasi Judul Kegiatan & Folder Khusus (Cegah Path Traversal & Script)
    var activityTitle = (data.activityTitle || "").toString().trim();
    var customFolder = (data.folderName || "").toString().trim();
    var targetFolder = rootFolder;
    
    var subfolderName = activityTitle || (customFolder !== rootFolderName ? customFolder : "");
    if (subfolderName) {
      // Hapus karakter kontrol, path traversal, dan tanda terlarang
      var cleanTitle = subfolderName.replace(/(\.\.[\/\\])+/g, "")
                                    .replace(/[\/\\\\:*?"<>|;&$!~^+=]/g, " ")
                                    .replace(/\s+/g, " ")
                                    .trim()
                                    .slice(0, 100);
      if (cleanTitle) {
        var subFolders = rootFolder.getFoldersByName(cleanTitle);
        targetFolder = subFolders.hasNext() ? subFolders.next() : rootFolder.createFolder(cleanTitle);
      }
    }
    
    var base64Data = data.fileData || data.base64;
    if (!base64Data) {
      throw new Error("Data foto base64 tidak ditemukan.");
    }
    if (base64Data.indexOf(",") > -1) {
      base64Data = base64Data.split(",")[1];
    }
    
    // 3. Validasi Tipe Konten (Hanya izinkan gambar raster murni)
    var mimeType = (data.mimeType || "image/jpeg").toString().toLowerCase().trim();
    var allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimes.indexOf(mimeType) === -1) {
      throw new Error("Keamanan: Jenis file ditolak. Hanya format JPG, PNG, atau WEBP yang diizinkan.");
    }
    
    // 4. Sanitasi Nama File
    var rawFileName = (data.fileName || "irmas-" + new Date().getTime() + ".jpg").toString();
    var cleanFileName = rawFileName.replace(/(\.\.[\/\\])+/g, "")
                                   .replace(/[^a-zA-Z0-9._-]/g, "_")
                                   .slice(0, 80);
    // Pastikan berakhiran ekstensi gambar yang sah
    if (!cleanFileName.match(/\.(jpg|jpeg|png|webp)$/i)) {
      cleanFileName += ".jpg";
    }

    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, cleanFileName);
    var file = targetFolder.createFile(blob);
    
    // 1. Berikan izin baca publik otomatis via DriveApp: Anyone with link can view
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    // 2. Format Direct Embed URL resmi Google Drive lh3.googleusercontent.com/d/FILE_ID
    var directUrl = "https://lh3.googleusercontent.com/d/" + fileId;
    var driveUrl = "https://drive.google.com/file/d/" + fileId + "/view";
    var folderUrl = targetFolder.getUrl();
    var folderName = targetFolder.getName();

    var result = {
      status: "success",
      fileId: fileId,
      fileName: cleanFileName,
      directUrl: directUrl,
      driveUrl: driveUrl,
      folderUrl: folderUrl,
      folderName: folderName
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.message ? error.message.toString() : "Gagal memproses file."
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export function getSavedScriptUrl(): string {
  try {
    const saved = localStorage.getItem(SCRIPT_URL_STORAGE_KEY);
    return saved && saved.trim().startsWith('http') ? saved.trim() : DEFAULT_SCRIPT_URL;
  } catch {
    return DEFAULT_SCRIPT_URL;
  }
}

export function saveScriptUrl(url: string): void {
  try {
    localStorage.setItem(SCRIPT_URL_STORAGE_KEY, url.trim());
  } catch {
    // ignore
  }
}

export interface DriveUploadResult {
  fileId: string;
  fileName: string;
  directUrl: string;
  driveUrl: string;
  folderUrl?: string;
  folderName?: string;
}

/**
 * Uploads a photo to Google Drive (jekb66476@gmail.com) via Google Apps Script Web App.
 * User NEVER logs in.
 * Otomatis memisahkan folder di Google Drive berdasarkan Judul Kegiatan!
 */
export async function uploadToGoogleDriveNoLogin(
  fileDataUrl: string,
  fileName: string,
  scriptUrl?: string,
  activityTitle?: string
): Promise<DriveUploadResult> {
  const targetUrl = (scriptUrl && scriptUrl.trim().startsWith('http')) 
    ? scriptUrl.trim() 
    : DEFAULT_SCRIPT_URL;

  const cleanTitle = activityTitle ? activityTitle.replace(/[\/\\\\:*?"<>|]/g, ' ').trim() : '';

  const payload = {
    fileData: fileDataUrl,
    fileName: fileName,
    mimeType: 'image/jpeg',
    // Kompatibilitas ganda:
    // 1. Untuk skrip yang sedang aktif sekarang (hanya baca data.folderName),
    //    akan otomatis membuat folder terpisah per judul kegiatan: "[IRMAS] Judul"
    // 2. Untuk skrip versi sub-folder, akan membuat subfolder di dalam folder induk IRMAS
    folderName: cleanTitle ? `[IRMAS] ${cleanTitle}` : TARGET_FOLDER_NAME,
    rootFolderName: TARGET_FOLDER_NAME,
    activityTitle: cleanTitle
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 seconds timeout per photo upload

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Koneksi Google Drive gagal (Status HTTP: ${response.status})`);
    }

    const textResponse = await response.text();
    let result: any;
    try {
      result = JSON.parse(textResponse);
    } catch {
      // If Apps Script returns raw HTML redirect or text
      const idMatch = textResponse.match(/"fileId"\s*:\s*"([a-zA-Z0-9_-]+)"/);
      if (idMatch && idMatch[1]) {
        result = {
          status: 'success',
          fileId: idMatch[1],
          directUrl: `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1200`,
          driveUrl: `https://drive.google.com/file/d/${idMatch[1]}/view`
        };
      } else {
        throw new Error('Respon dari Google Drive tidak valid.');
      }
    }

    if (result.status === 'error' || (!result.directUrl && !result.fileId)) {
      throw new Error(result.message || 'Gagal menyimpan foto ke Google Drive.');
    }

    const fileId = result.fileId || '';
    // Most reliable CDN URL for public Drive files: Google Drive thumbnail endpoint + lh3 fallback
    const reliableDirectUrl = fileId 
      ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`
      : result.directUrl;

    return {
      fileId: fileId,
      fileName: result.fileName || fileName,
      directUrl: reliableDirectUrl,
      driveUrl: result.driveUrl || (fileId ? `https://drive.google.com/file/d/${fileId}/view` : ''),
      folderUrl: result.folderUrl,
      folderName: result.folderName
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Unggahan ke Google Drive memakan waktu terlalu lama (timeout).');
    }
    throw err;
  }
}

/**
 * Deletes a file from Google Drive via the Google Apps Script Web App
 */
export async function deleteFromGoogleDriveNoLogin(fileId: string, scriptUrl?: string): Promise<{ success: boolean; message: string }> {
  if (!fileId) return { success: true, message: 'Tidak ada file ID' };
  
  const targetUrl = (scriptUrl && scriptUrl.trim().startsWith('http')) 
    ? scriptUrl.trim() 
    : DEFAULT_SCRIPT_URL;

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'delete',
        fileId: fileId
      })
    });

    if (!res.ok) {
      return { success: false, message: `HTTP Error: ${res.status}` };
    }

    const json = await res.json();
    return {
      success: json.status === 'success',
      message: json.message || 'File diproses'
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Koneksi skrip gagal'
    };
  }
}

/**
 * Tests connection to the Google Apps Script Web App
 */
export async function testDriveScriptConnection(scriptUrl: string): Promise<{
  success: boolean;
  message: string;
  folder?: string;
}> {
  if (!scriptUrl || !scriptUrl.startsWith('http')) {
    return { success: false, message: 'URL skrip belum valid.' };
  }

  try {
    const res = await fetch(scriptUrl, { method: 'GET' });
    const data = await res.json();
    if (data.status === 'ok') {
      return {
        success: true,
        message: 'Koneksi ke Google Drive jekb66476@gmail.com BERHASIL!',
        folder: data.folder
      };
    }
    return { success: false, message: data.message || 'Respon tidak sesuai format.' };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Tidak dapat menghubungi skrip Google Drive.'
    };
  }
}

/**
 * Extracts Google Drive fileId from various formats:
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function extractDriveFileId(url: string | undefined): string | null {
  if (!url) return null;
  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  const driveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|thumbnail\?id=|uc\?(?:.*&)?id=)([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) return driveMatch[1];

  return null;
}

/**
 * Returns a robust, cross-browser embeddable URL for Google Drive photos.
 * The Google Drive thumbnail CDN endpoint (`drive.google.com/thumbnail?id=...&sz=w1000`)
 * has the highest reliability across iOS Safari, Android Chrome, and desktop browsers.
 */
export function getCrossBrowserDriveImageUrl(url: string | undefined, size: number = 1000): string {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  }
  return url;
}

/**
 * Provides an array of fallback URLs for a given Google Drive image, in priority order:
 * 1. Thumbnail CDN (fast, anti-cookie-block, optimized)
 * 2. lh3 direct with anti-cache query
 * 3. uc?export=view direct stream
 */
export function getDriveImageFallbackUrls(url: string | undefined): string[] {
  if (!url) return [];
  const fileId = extractDriveFileId(url);
  if (!fileId) return [url];

  return [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
    `https://lh3.googleusercontent.com/d/${fileId}?t=${Date.now()}`,
    `https://drive.google.com/uc?export=view&id=${fileId}`
  ];
}

/**
 * Fetches documentation items from the Google Apps Script Web App.
 * Runs automatically on page load & via periodic polling interval.
 * Supports multiple response formats (items, data, files, raw array).
 */
export async function fetchGoogleDriveGallery(scriptUrl?: string): Promise<GalleryItem[]> {
  const targetUrl = (scriptUrl && scriptUrl.trim().startsWith('http')) 
    ? scriptUrl.trim() 
    : getSavedScriptUrl();

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return [];
  }

  // Anti-cache query ensures fresh data every fetch without stale browser proxy caching
  const antiCacheUrl = targetUrl + (targetUrl.includes('?') ? '&' : '?') + `action=list&_t=${Date.now()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout

  try {
    const res = await fetch(antiCacheUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return [];
    }

    const rawItems: any[] = Array.isArray(data)
      ? data
      : (Array.isArray(data?.items) 
          ? data.items 
          : (Array.isArray(data?.data) 
              ? data.data 
              : (Array.isArray(data?.files) ? data.files : [])));

    if (!rawItems || rawItems.length === 0) {
      return [];
    }

    const formatted: GalleryItem[] = rawItems.map((item, idx) => {
      const fileId = item.fileId || item.id || '';
      const rawUrl = item.imageUrl || item.directUrl || (fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : '');
      const reliableThumb = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : rawUrl;
      const title = item.title || item.activityTitle || item.fileName || `Dokumentasi Kegiatan ${idx + 1}`;
      
      const imagesList: string[] = (Array.isArray(item.images) && item.images.length > 0)
        ? item.images.map((img: string) => {
            const fid = extractDriveFileId(img);
            return fid ? `https://drive.google.com/thumbnail?id=${fid}&sz=w1000` : img;
          })
        : [reliableThumb];

      return {
        id: item.id || `gdrive-${fileId || idx}-${Date.now()}`,
        title: title,
        category: (item.category as any) || 'kegiatan',
        date: item.date || 'Terbaru',
        location: item.location || "Masjid Jami'e Al-Ikhlas",
        imageUrl: reliableThumb,
        images: imagesList,
        description: item.description || `Dokumentasi kegiatan "${title}" tersimpan di Google Drive.`,
        participants: item.participants || 50,
        highlight: !!item.highlight,
        isUserUploaded: true,
        storageType: 'gdrive',
        createdAt: item.createdAt || item.dateCreated || (Date.now() - idx * 1000),
        driveFileId: fileId,
        driveUrl: item.driveUrl || (fileId ? `https://drive.google.com/file/d/${fileId}/view` : undefined),
        driveFolderUrl: item.folderUrl
      };
    });

    return formatted;
  } catch (err: any) {
    clearTimeout(timeoutId);
    return [];
  }
}

