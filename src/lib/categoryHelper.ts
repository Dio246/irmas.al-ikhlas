import { GalleryCategory } from '../types';

export interface CategoryInfo {
  id: GalleryCategory;
  label: string;
}

export const CATEGORY_DEFINITIONS: CategoryInfo[] = [
  { id: 'semua', label: 'Semua Galeri' },
  { id: 'kajian', label: 'Kajian Remaja' },
  { id: 'sosial', label: 'Bakti & Sosial' },
  { id: 'phbi', label: 'PHBI Akbar' },
  { id: 'rihlah', label: 'Rihlah & Alam' },
  { id: 'pelatihan', label: 'Pelatihan Skill' },
  { id: 'ramadhan', label: 'Semarak Ramadhan' },
];

/**
 * Returns a human-friendly display label for any category key.
 * Handles exact ids ('phbi' -> 'PHBI Akbar'), titles matching labels, or title heuristics.
 */
export function formatCategoryLabel(categoryOrRaw: string | undefined, titleFallback?: string): string {
  if (!categoryOrRaw) {
    if (titleFallback) {
      return guessCategoryFromText(titleFallback);
    }
    return 'Kajian Remaja';
  }

  const normalized = categoryOrRaw.trim().toLowerCase();

  // 1. Direct match with standard category IDs
  switch (normalized) {
    case 'phbi':
      return 'PHBI Akbar';
    case 'kajian':
      return 'Kajian Remaja';
    case 'sosial':
    case 'bakti':
      return 'Bakti & Sosial';
    case 'rihlah':
      return 'Rihlah & Alam';
    case 'pelatihan':
      return 'Pelatihan Skill';
    case 'ramadhan':
    case 'ramadan':
      return 'Semarak Ramadhan';
    case 'semua':
      return 'Semua Galeri';
  }

  // 2. Direct match with label variations
  if (normalized.includes('phbi') || normalized.includes('maulid') || normalized.includes('isra') || normalized.includes('muharram') || normalized.includes('idul')) {
    return 'PHBI Akbar';
  }
  if (normalized.includes('kajian') || normalized.includes('taklim') || normalized.includes('halaqah')) {
    return 'Kajian Remaja';
  }
  if (normalized.includes('sosial') || normalized.includes('bakti') || normalized.includes('santunan') || normalized.includes('peduli')) {
    return 'Bakti & Sosial';
  }
  if (normalized.includes('rihlah') || normalized.includes('tadabbur') || normalized.includes('kemah') || normalized.includes('camping')) {
    return 'Rihlah & Alam';
  }
  if (normalized.includes('pelatihan') || normalized.includes('workshop') || normalized.includes('seminar') || normalized.includes('skill')) {
    return 'Pelatihan Skill';
  }
  if (normalized.includes('ramadhan') || normalized.includes('ramadan') || normalized.includes('tarawih') || normalized.includes('bukber') || normalized.includes('pesantren kilat')) {
    return 'Semarak Ramadhan';
  }

  // 3. Fallback: If category string is generic "kegiatan" or unknown, inspect title/description
  if (normalized === 'kegiatan' && titleFallback) {
    return guessCategoryFromText(titleFallback);
  }

  // 4. If user entered a custom text, capitalize nicely
  return categoryOrRaw.charAt(0).toUpperCase() + categoryOrRaw.slice(1);
}

/**
 * Guesses the appropriate category based on activity title or description text
 */
export function guessCategoryFromText(text: string): string {
  if (!text) return 'Kajian Remaja';
  const lower = text.toLowerCase();

  if (lower.includes('maulid') || lower.includes('isra') || lower.includes('mi\'raj') || lower.includes('miraj') || lower.includes('muharram') || lower.includes('phbi') || lower.includes('idul fitri') || lower.includes('idul adha') || lower.includes('nuzulul')) {
    return 'PHBI Akbar';
  }
  if (lower.includes('bakti') || lower.includes('sosial') || lower.includes('santunan') || lower.includes('donor') || lower.includes('peduli') || lower.includes('gotong royong') || lower.includes('kebersihan')) {
    return 'Bakti & Sosial';
  }
  if (lower.includes('rihlah') || lower.includes('tadabbur') || lower.includes('alam') || lower.includes('camping') || lower.includes('kemah') || lower.includes('outbound') || lower.includes('gowes') || lower.includes('futsal')) {
    return 'Rihlah & Alam';
  }
  if (lower.includes('pelatihan') || lower.includes('workshop') || lower.includes('kursus') || lower.includes('skill') || lower.includes('belajar') || lower.includes('desain') || lower.includes('public speaking')) {
    return 'Pelatihan Skill';
  }
  if (lower.includes('ramadhan') || lower.includes('ramadan') || lower.includes('bukber') || lower.includes('buka bersama') || lower.includes('tarawih') || lower.includes('tadarus') || lower.includes('pesantren kilat') || lower.includes('sahur')) {
    return 'Semarak Ramadhan';
  }
  if (lower.includes('musyawarah') || lower.includes('sidang') || lower.includes('pengesahan') || lower.includes('rapat') || lower.includes('kajian') || lower.includes('taklim')) {
    return 'Kajian Remaja';
  }

  return 'Kajian Remaja';
}

/**
 * Resolves raw category key into standard GalleryCategory
 */
export function resolveGalleryCategory(categoryOrRaw: string | undefined, titleFallback?: string): GalleryCategory {
  const label = formatCategoryLabel(categoryOrRaw, titleFallback);
  switch (label) {
    case 'PHBI Akbar':
      return 'phbi';
    case 'Bakti & Sosial':
      return 'sosial';
    case 'Rihlah & Alam':
      return 'rihlah';
    case 'Pelatihan Skill':
      return 'pelatihan';
    case 'Semarak Ramadhan':
      return 'ramadhan';
    case 'Kajian Remaja':
    default:
      return 'kajian';
  }
}
