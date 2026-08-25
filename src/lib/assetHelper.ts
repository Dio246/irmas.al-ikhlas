/// <reference types="vite/client" />

/**
 * Resolves static asset URLs relative to Vite's configured base URL.
 * Ensures images and media load properly whether deployed on GitHub Pages (/repo-name/),
 * custom domains (/), or localhost.
 */
export function resolveAsset(path: string | undefined | null): string {
  if (!path) return '';
  
  // External URLs or data URIs are left untouched
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Remove leading slash if any
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  const meta = import.meta as unknown as { env?: { BASE_URL?: string } };
  const base = meta.env?.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  
  return `${normalizedBase}${cleanPath}`;
}

