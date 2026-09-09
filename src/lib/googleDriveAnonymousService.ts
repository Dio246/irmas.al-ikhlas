/**
 * googleDriveAnonymousService.ts
 * 
 * Provides 100% Google Drive storage for jekb66476@gmail.com
 * WITHOUT requiring users / uploaders to log into Google!
 *
 * Utilizes a Google Apps Script Web App deployed under jekb66476@gmail.com
 * with "Execute as: Me" and "Access: Anyone".
 */

export const TARGET_DRIVE_EMAIL = 'jekb66476@gmail.com';
export const TARGET_FOLDER_NAME = 'Dokumentasi IRMAS Al-Ikhlas';
export const SCRIPT_URL_STORAGE_KEY = 'irmas_gdrive_script_url';
export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwBZJ98jJ8nb8CSu6yKrJ7W-ireTJueD_MrgfpXJvTYkidfpQ2S15N4G4qrowmhJmF4/exec';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * SKRIP PENYIMPANAN GOOGLE DRIVE 100% TANPA LOGIN USER
 * DILENGKAPI SISTEM KEAMANAN KETAT (ANTI-MALWARE & INJEKSI)
 * IRMAS Masjid Jamie Al-Ikhlas (jekb66476@gmail.com)
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Google Drive Upload Service IRMAS Al-Ikhlas Aktif & Terlindungi (Anti-Malware, Folder per Kegiatan)",
    targetEmail: "jekb66476@gmail.com",
    folder: "Dokumentasi IRMAS Al-Ikhlas",
    security: "Enforced"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Data permintaan kosong atau tidak valid.");
    }

    var contents = e.postData.contents;
    // Cegah payload raksasa yang berpotensi membebani kuota atau serangan DoS (Maks 15MB teks)
    if (contents.length > 20 * 1024 * 1024) {
      throw new Error("Ukuran data melebihi batas aman maksimal.");
    }

    var data;
    try {
      data = JSON.parse(contents);
    } catch(err) {
      data = e.parameter;
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
    
    // Berikan izin baca publik agar foto dapat ditampilkan di website
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
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

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Koneksi Google Drive gagal (Status HTTP: ${response.status})`);
  }

  const result = await response.json();

  if (result.status === 'error' || !result.directUrl) {
    throw new Error(result.message || 'Gagal menyimpan foto ke Google Drive.');
  }

  return {
    fileId: result.fileId,
    fileName: result.fileName || fileName,
    directUrl: result.directUrl,
    driveUrl: result.driveUrl || `https://drive.google.com/file/d/${result.fileId}/view`,
    folderUrl: result.folderUrl,
    folderName: result.folderName
  };
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
