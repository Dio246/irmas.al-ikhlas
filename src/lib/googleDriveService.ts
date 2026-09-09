// Google Drive Service for IRMAS Masjid Jami'e Al-Ikhlas
// Handles client-side Google OAuth 2.0 (GIS) and Google Drive API v3

export const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  '156907068645-spebvft7emq9n96knt0e6u4qgon3nrfc.apps.googleusercontent.com';

export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
export const IRMAS_FOLDER_NAME = 'Dokumentasi IRMAS Al-Ikhlas';
export const TARGET_DRIVE_EMAIL = 'jekb66476@gmail.com';

export interface DriveUser {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
}

export interface DriveUploadResult {
  id: string;
  name: string;
  directUrl: string;
  webViewLink?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            hint?: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string; hint?: string }) => void;
          };
        };
      };
    };
  }
}

let cachedAccessToken: string | null = null;
let cachedUser: DriveUser | null = null;
let cachedFolderId: string | null = null;

// Initialize token from session if still valid
try {
  const savedToken = sessionStorage.getItem('irmas_gdrive_token');
  const savedExpiry = sessionStorage.getItem('irmas_gdrive_expiry');
  if (savedToken && savedExpiry && Date.now() < Number(savedExpiry)) {
    cachedAccessToken = savedToken;
  }
} catch {
  // Ignore sessionStorage errors in restricted environments
}

export function getCachedToken(): string | null {
  return cachedAccessToken;
}

export function getCachedUser(): DriveUser | null {
  return cachedUser;
}

export function clearDriveAuth(): void {
  cachedAccessToken = null;
  cachedUser = null;
  cachedFolderId = null;
  try {
    sessionStorage.removeItem('irmas_gdrive_token');
    sessionStorage.removeItem('irmas_gdrive_expiry');
  } catch {
    // ignore
  }
}

/**
 * Checks whether Google Identity Services script has loaded
 */
export function isGsiReady(): boolean {
  return typeof window !== 'undefined' && !!window.google?.accounts?.oauth2;
}

/**
 * Requests a Google Drive access token using GIS client
 * Directs login specifically to target email (default: jekb66476@gmail.com)
 */
export function requestDriveAccessToken(emailHint: string = TARGET_DRIVE_EMAIL): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isGsiReady()) {
      reject(new Error('Sistem Google Identity Services sedang dimuat. Harap tunggu beberapa detik lalu coba lagi.'));
      return;
    }

    try {
      const client = window.google!.accounts!.oauth2!.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: DRIVE_SCOPE,
        hint: emailHint,
        callback: (response) => {
          if (response.error) {
            reject(new Error(`Otorisasi Google Drive ditolak: ${response.error}`));
            return;
          }
          if (response.access_token) {
            cachedAccessToken = response.access_token;
            try {
              sessionStorage.setItem('irmas_gdrive_token', response.access_token);
              // Token default expires in 3600 seconds (1 hour)
              sessionStorage.setItem('irmas_gdrive_expiry', String(Date.now() + 3500 * 1000));
            } catch {
              // ignore
            }
            resolve(response.access_token);
          } else {
            reject(new Error('Gagal mendapatkan token akses dari Google.'));
          }
        },
        error_callback: (err) => {
          reject(new Error(typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : 'Terjadi kesalahan saat otorisasi Google.'));
        }
      });

      // Force account chooser with hint to ensure jekb66476@gmail.com is selected
      client.requestAccessToken({ 
        prompt: 'select_account consent',
        hint: emailHint
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Fetches the user profile info associated with the Drive token
 */
export async function fetchDriveUser(token: string): Promise<DriveUser | null> {
  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data.user) {
      cachedUser = {
        displayName: data.user.displayName,
        emailAddress: data.user.emailAddress,
        photoLink: data.user.photoLink
      };
      return cachedUser;
    }
  } catch {
    // Non-critical, fallback
  }
  return null;
}

/**
 * Finds or creates the folder 'Dokumentasi IRMAS Al-Ikhlas' in Google Drive
 */
export async function getOrCreateIrmasFolder(token: string): Promise<{ folderId: string; folderUrl: string }> {
  if (cachedFolderId) {
    return {
      folderId: cachedFolderId,
      folderUrl: `https://drive.google.com/drive/folders/${cachedFolderId}`
    };
  }

  // 1. Search for existing folder
  const query = `mimeType='application/vnd.google-apps.folder' and name='${IRMAS_FOLDER_NAME}' and trashed=false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      const found = searchData.files[0];
      cachedFolderId = found.id;
      return {
        folderId: found.id,
        folderUrl: found.webViewLink || `https://drive.google.com/drive/folders/${found.id}`
      };
    }
  }

  // 2. Create new folder if not exists
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: IRMAS_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder arsip foto dan dokumentasi kegiatan resmi IRMAS Masjid Jami\'e Al-Ikhlas.'
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Gagal membuat folder di Google Drive: ${errText}`);
  }

  const newFolder = await createRes.json();
  cachedFolderId = newFolder.id;

  // 3. Make the folder viewable so photos can be seen by visitors
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${newFolder.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch {
    // Non-blocking
  }

  return {
    folderId: newFolder.id,
    folderUrl: newFolder.webViewLink || `https://drive.google.com/drive/folders/${newFolder.id}`
  };
}

/**
 * Uploads a photo to Google Drive inside the IRMAS folder
 */
export async function uploadPhotoToGoogleDrive(
  file: File,
  folderId: string,
  token: string
): Promise<DriveUploadResult> {
  // Metadata for Drive File
  const metadata = {
    name: `IRMAS_${Date.now()}_${file.name.replace(/\s+/g, '_')}`,
    mimeType: file.type || 'image/jpeg',
    parents: [folderId],
    description: 'Foto dokumentasi kegiatan pemuda IRMAS Masjid Jami\'e Al-Ikhlas'
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink';

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal mengunggah foto ke Google Drive (${res.status}): ${err}`);
  }

  const uploadedFile = await res.json();
  const fileId = uploadedFile.id;

  // Make the file publicly viewable as reader so it can be rendered on the website
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });
  } catch {
    // Permission update error is non-fatal if inherited from folder
  }

  // Google CDN direct display URL for Drive files
  const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

  return {
    id: fileId,
    name: metadata.name,
    directUrl,
    webViewLink: uploadedFile.webViewLink
  };
}

/**
 * Converts any shared Google Drive file link into a direct web image URL
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Already a direct CDN URL or standard web URL
  if (trimmed.includes('lh3.googleusercontent.com/d/')) {
    return trimmed;
  }

  // Standard Google Drive share links
  // e.g. https://drive.google.com/file/d/1ABCXYZ_123/view?usp=sharing
  // or https://drive.google.com/open?id=1ABCXYZ_123
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }

  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }

  return trimmed;
}
