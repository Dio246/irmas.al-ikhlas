export type GalleryCategory = 'semua' | 'kajian' | 'sosial' | 'phbi' | 'rihlah' | 'pelatihan' | 'ramadhan';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  date: string;
  location: string;
  imageUrl: string;
  images?: string[];
  description: string;
  participants?: number;
  highlight?: boolean;
}

export interface Pengurus {
  id: string;
  name: string;
  role: string;
  division: 'BPH' | 'Syiar & Dakwah' | 'Kaderisasi & Minat Bakat' | 'Humas & Media' | 'Dana Usaha & Sosial';
  avatar: string;
  quote?: string;
  phone?: string;
  whatsapp?: string;
  social?: {
    instagram?: string;
    whatsapp?: string;
    phone?: string;
  };
}

export interface MosqueProfile {
  name: string;
  subName: string;
  organizationName: string;
  tagline: string;
  shortDesc: string;
  fullHistory: string;
  address: string;
  housing: string;
  neighborhood: string;
  village: string;
  district: string;
  regency: string;
  city: string;
  mapsUrl: string;
  establishedDate: string;
  establishedYear: string;
  activePeriod: string;
  email: string;
  whatsapp: string;
  instagram: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  youtube: string;
  ketuaIrmas: string;
  sekretarisIrmas: string;
  ketuaDkm: string;
}

export interface PasalItem {
  pasalNumber: string;
  title?: string;
  contents: string[];
}

export interface BabItem {
  babNumber: string;
  title: string;
  pasalList: PasalItem[];
}

export interface AdArtDocument {
  title: string;
  period: string;
  locationHeader: string;
  kataPengantar: {
    muqaddimah: string[];
    body: string[];
    signatureDate: string;
    signerRole: string;
    signerName: string;
  };
  chapters: BabItem[];
  pengesahan: {
    location: string;
    date: string;
    sekretaris: string;
    ketuaIrmas: string;
    ketuaDkm: string;
  };
}
