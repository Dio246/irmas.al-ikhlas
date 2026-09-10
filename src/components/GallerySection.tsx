import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Maximize2, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Images,
  Cloud,
  FolderOpen,
  UploadCloud,
  ExternalLink,
  Trash2,
  AlertCircle,
  Loader2,
  LogOut,
  CheckCircle2,
  FileImage,
  Sparkles,
  Link as LinkIcon,
  Copy,
  CheckCheck,
  Settings2,
  Info
} from 'lucide-react';
import { galleryData as initialGalleryData } from '../data/irmasData';
import { GalleryItem, GalleryCategory } from '../types';
import { resolveAsset } from '../lib/assetHelper';
import {
  validateUploadedFile,
  sanitizeText,
  sanitizeFileName,
  checkUploadRateLimit,
  MAX_BATCH_FILES
} from '../lib/security';

/**
 * Optimizes image URLs for fast, lag-free mobile rendering and smooth scrolling.
 * If the image is hosted on Google Drive, it requests an optimized 800px web thumbnail CDN format.
 */
function getOptimizedThumbUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.includes('lh3.googleusercontent.com/d/') && !url.includes('=')) {
    return `${url}=w800`;
  }
  return resolveAsset(url);
}
import {
  requestDriveAccessToken,
  getOrCreateIrmasFolder,
  uploadPhotoToGoogleDrive,
  convertGoogleDriveUrl,
  getCachedToken,
  getCachedUser,
  clearDriveAuth,
  fetchDriveUser,
  IRMAS_FOLDER_NAME,
  DriveUser
} from '../lib/googleDriveService';
import {
  TARGET_DRIVE_EMAIL,
  TARGET_FOLDER_NAME,
  GOOGLE_APPS_SCRIPT_CODE,
  getSavedScriptUrl,
  saveScriptUrl,
  uploadToGoogleDriveNoLogin,
  testDriveScriptConnection
} from '../lib/googleDriveAnonymousService';
import {
  loadCustomGalleryItems,
  saveCustomGalleryItem,
  compressImageFile
} from '../lib/galleryStorage';

interface GallerySectionProps {
  onSelectImage: (item: GalleryItem, photoIndex?: number) => void;
}

interface ActivityCardProps {
  item: GalleryItem;
  getCategoryLabel: (cat: GalleryCategory) => string;
  onSelectImage: (item: GalleryItem, photoIndex?: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ item, getCategoryLabel, onSelectImage }) => {
  const imagesList = item.images && item.images.length > 0 ? item.images : [item.imageUrl];
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef<number | null>(null);
  const scrollSettledTimerRef = useRef<number | null>(null);

  // Smooth scroll to target photo without triggering conflicting scroll feedback
  const scrollToPhoto = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (index < 0 || index >= imagesList.length) return;

    if (programmaticTimerRef.current) {
      window.clearTimeout(programmaticTimerRef.current);
    }
    isProgrammaticScrollRef.current = true;
    setActiveIdx(index);

    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
    }

    programmaticTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 450);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeIdx + 1) % imagesList.length;
    scrollToPhoto(nextIdx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (activeIdx - 1 + imagesList.length) % imagesList.length;
    scrollToPhoto(prevIdx);
  };

  // Debounced and thresholded scroll listener:
  // Prevents rapid flipping between numbers at the 50% boundary during drags/swipes
  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) return;

    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      if (clientWidth > 0) {
        const raw = scrollLeft / clientWidth;
        const nearest = Math.round(raw);
        // Only update when scroll position is convincingly settled near the center of the photo
        if (Math.abs(raw - nearest) < 0.35 && nearest >= 0 && nearest < imagesList.length) {
          if (nearest !== activeIdx) {
            setActiveIdx(nearest);
          }
        }
      }
    }

    // Debounced fallback to lock in the final settled index
    if (scrollSettledTimerRef.current) {
      window.clearTimeout(scrollSettledTimerRef.current);
    }
    scrollSettledTimerRef.current = window.setTimeout(() => {
      if (scrollContainerRef.current && !isProgrammaticScrollRef.current) {
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        if (clientWidth > 0) {
          const finalIndex = Math.round(scrollLeft / clientWidth);
          if (finalIndex >= 0 && finalIndex < imagesList.length && finalIndex !== activeIdx) {
            setActiveIdx(finalIndex);
          }
        }
      }
    }, 80);
  };

  // Hardware-accelerated native scrollend detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScrollEnd = () => {
      if (container.clientWidth > 0) {
        const finalIndex = Math.round(container.scrollLeft / container.clientWidth);
        if (finalIndex >= 0 && finalIndex < imagesList.length) {
          setActiveIdx(finalIndex);
        }
      }
      isProgrammaticScrollRef.current = false;
    };

    container.addEventListener('scrollend', onScrollEnd);
    return () => {
      container.removeEventListener('scrollend', onScrollEnd);
      if (programmaticTimerRef.current) window.clearTimeout(programmaticTimerRef.current);
      if (scrollSettledTimerRef.current) window.clearTimeout(scrollSettledTimerRef.current);
    };
  }, [imagesList.length]);

  // Rolling 3-dot pagination calculation:
  // Shows max 3 dots, sliding to the right as activeIdx increases.
  // Stable slots ensure buttons are NEVER unmounted/remounted during sliding, avoiding visual pops.
  const totalDots = imagesList.length;
  const maxVisibleDots = Math.min(3, totalDots);
  const dotStartIndex = totalDots <= 3
    ? 0
    : Math.max(0, Math.min(activeIdx - 1, totalDots - 3));

  const slots = Array.from({ length: maxVisibleDots }, (_, slotIdx) => {
    const targetPhotoIdx = dotStartIndex + slotIdx;
    const isActive = activeIdx === targetPhotoIdx;
    const isLeftEdge = slotIdx === 0 && dotStartIndex > 0 && !isActive;
    const isRightEdge = slotIdx === maxVisibleDots - 1 && dotStartIndex + maxVisibleDots < totalDots && !isActive;
    return {
      slotIdx,
      targetPhotoIdx,
      isActive,
      isLeftEdge,
      isRightEdge
    };
  });

  return (
    <div
      id={`gallery-card-${item.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col [content-visibility:auto] [contain-intrinsic-size:380px]"
    >
      {/* Interactive Horizontal Scroll Photo Track */}
      <div className="relative h-60 sm:h-64 w-full bg-slate-950 overflow-hidden select-none">
        
        {/* Horizontal Scrollable Container with touch-pan-y to keep mobile vertical scroll silky-smooth */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-y"
        >
          {imagesList.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => onSelectImage(item, idx)}
              className="w-full h-full shrink-0 snap-center relative cursor-pointer group/img bg-slate-950"
            >
              <img
                src={getOptimizedThumbUrl(imgUrl)}
                alt={`${item.title} - Foto ${idx + 1}`}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 md:group-hover/img:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-60 md:group-hover/img:opacity-80 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          {/* Category Pill */}
          <span className="bg-emerald-700/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs pointer-events-auto">
            {getCategoryLabel(item.category)}
          </span>

          {/* Multiple Photos Count Indicator with Scroll Hint */}
          {imagesList.length > 1 && (
            <span className="bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs pointer-events-auto select-none">
              <Images className="w-3 h-3 text-emerald-300 shrink-0" />
              <span className="tabular-nums">{activeIdx + 1}/{imagesList.length} Foto • Geser ➔</span>
            </span>
          )}
        </div>

        {/* Left & Right Interactive Scroll Arrows (if multiple photos) */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-emerald-700 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs z-10 shadow-md opacity-80 group-hover:opacity-100 active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-emerald-700 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs z-10 shadow-md opacity-80 group-hover:opacity-100 active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Quick Zoom Action Button */}
        <button
          onClick={() => onSelectImage(item, activeIdx)}
          aria-label="Perbesar foto"
          className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-black/50 hover:bg-emerald-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Participants Pill if available */}
        {item.participants && (
          <span className="absolute bottom-2.5 right-3 bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 pointer-events-none shadow-xs">
            <Users className="w-3 h-3 text-emerald-300" />
            <span>{item.participants} Jamaah</span>
          </span>
        )}

        {/* Compact Rolling 3-Dot Pagination (Max 3 dots, scrolls smoothly to right without overlapping Jamaah badge) */}
        {imagesList.length > 1 && (
          <div 
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 z-10 bg-black/55 px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs pointer-events-auto min-w-[48px] h-5 select-none"
            title={`Foto ${activeIdx + 1} dari ${imagesList.length}`}
          >
            {slots.map((slot) => (
              <button
                key={slot.slotIdx}
                onClick={(e) => scrollToPhoto(slot.targetPhotoIdx, e)}
                aria-label={`Lihat foto ${slot.targetPhotoIdx + 1} dari ${imagesList.length}`}
                className={`transition-all duration-200 cursor-pointer rounded-full shrink-0 ${
                  slot.isActive
                    ? 'bg-emerald-400 w-3.5 h-1.5 shadow-xs'
                    : slot.isLeftEdge || slot.isRightEdge
                    ? 'bg-white/45 hover:bg-white/80 w-1 h-1'
                    : 'bg-white/70 hover:bg-white w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Card Content Description */}
      <div 
        onClick={() => onSelectImage(item, activeIdx)}
        className="p-4 sm:p-5 flex-1 flex flex-col justify-between cursor-pointer"
      >
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {item.description}
          </p>
        </div>

        {/* Google Drive Storage Indicator with Activity Subfolder Link */}
        {(item.driveUrl || item.driveFolderUrl || item.id.includes('gdrive') || item.imageUrl.includes('googleusercontent.com/d/') || item.imageUrl.includes('drive.google.com')) && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-800 bg-sky-50/80 px-2.5 py-1.5 rounded-lg">
            <span className="flex items-center gap-1.5 font-semibold truncate">
              <FolderOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">Google Drive • Folder Terpisah</span>
            </span>
            {(item.driveFolderUrl || item.driveUrl) && (
              <a
                href={item.driveFolderUrl || item.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:underline flex items-center gap-1 font-bold text-sky-900 bg-white px-2 py-0.5 rounded shadow-2xs border border-sky-200 text-[10px] shrink-0 hover:bg-sky-50 transition-colors"
                title={item.driveFolderUrl ? `Buka folder Google Drive untuk "${item.title}"` : "Buka di Google Drive"}
              >
                <span>{item.driveFolderUrl ? 'Buka Folder' : 'Buka di Drive'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-600" />
            <span>{item.date}</span>
          </div>
          <div className="flex items-center gap-1 max-w-[50%] truncate">
            <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectImage }) => {
  // Load initial data merged with any saved custom items from localStorage
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('irmas_custom_gallery_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...initialGalleryData];
        }
      }
    } catch {
      // ignore parsing error
    }
    return initialGalleryData;
  });

  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Google Drive 100% Zero-Login Service State (via Google Apps Script Web App for jekb66476@gmail.com)
  const [scriptUrl] = useState<string>(() => getSavedScriptUrl());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [driveError, setDriveError] = useState<string | null>(null);

  // Optional Direct Google OAuth Login State (if someone explicitly wants to login)
  const [driveToken, setDriveToken] = useState<string | null>(getCachedToken());
  const [driveUser, setDriveUser] = useState<DriveUser | null>(getCachedUser());
  const [driveFolderUrl, setDriveFolderUrl] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('irmas_gdrive_folder_url') || null;
    } catch {
      return null;
    }
  });
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);

  // New Documentation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryCategory>('kajian');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState("Masjid Jamie Al-Ikhlas");
  const [newParticipants, setNewParticipants] = useState<number>(50);
  const [newDescription, setNewDescription] = useState('');

  // Selected Files & Previews (Direct Device Upload)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);
  const [isValidatingFiles, setIsValidatingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success Feedback
  const [addSuccessToast, setAddSuccessToast] = useState(false);
  const [lastSavedFolderUrl, setLastSavedFolderUrl] = useState<string | null>(null);

  // Load custom items from IndexedDB asynchronously on mount
  useEffect(() => {
    loadCustomGalleryItems().then((customItems) => {
      if (customItems && customItems.length > 0) {
        setItems(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = customItems.filter(c => !existingIds.has(c.id));
          return [...newItems, ...prev];
        });
      }
    });
  }, []);

  // Check Drive session on mount
  useEffect(() => {
    const token = getCachedToken();
    if (token) {
      setDriveToken(token);
      fetchDriveUser(token).then((user) => {
        if (user) setDriveUser(user);
      });
      getOrCreateIrmasFolder(token).then(({ folderUrl }) => {
        setDriveFolderUrl(folderUrl);
        try {
          sessionStorage.setItem('irmas_gdrive_folder_url', folderUrl);
        } catch {
          // ignore
        }
      }).catch(() => {
        // non-fatal
      });
    }
  }, []);

  const categories: { id: GalleryCategory; label: string }[] = [
    { id: 'semua', label: 'Semua Galeri' },
    { id: 'kajian', label: 'Kajian Remaja' },
    { id: 'sosial', label: 'Baksos & Sosial' },
    { id: 'phbi', label: 'PHBI Akbar' },
    { id: 'rihlah', label: 'Rihlah & Alam' },
    { id: 'pelatihan', label: 'Pelatihan Skill' },
    { id: 'ramadhan', label: 'Semarak Ramadhan' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'semua' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (cat: GalleryCategory) => {
    const found = categories.find(c => c.id === cat);
    return found ? found.label : cat;
  };

  // Google Drive Connect Handler
  const handleConnectDrive = async (targetEmail: string = TARGET_DRIVE_EMAIL) => {
    setIsConnectingDrive(true);
    setDriveError(null);
    try {
      const token = await requestDriveAccessToken(targetEmail);
      setDriveToken(token);
      const user = await fetchDriveUser(token);
      if (user) setDriveUser(user);
      
      const { folderUrl } = await getOrCreateIrmasFolder(token);
      setDriveFolderUrl(folderUrl);
      try {
        sessionStorage.setItem('irmas_gdrive_folder_url', folderUrl);
      } catch {
        // ignore
      }
    } catch (err) {
      setDriveError(err instanceof Error ? err.message : 'Gagal menghubungkan Google Drive.');
    } finally {
      setIsConnectingDrive(false);
    }
  };

  // Google Drive Disconnect Handler
  const handleDisconnectDrive = () => {
    clearDriveAuth();
    setDriveToken(null);
    setDriveUser(null);
    setDriveFolderUrl(null);
  };

  // Handle Local File Selection with Validation & Security Checks
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setDriveError(null);
    setSecurityMessage('Memeriksa kelayakan file foto...');
    setIsValidatingFiles(true);

    const incomingFiles: File[] = Array.from(e.target.files);

    // Limit check
    if (selectedFiles.length + incomingFiles.length > MAX_BATCH_FILES) {
      setDriveError(`Maksimal ${MAX_BATCH_FILES} foto dalam sekali unggah demi stabilitas sistem dan kelancaran proses.`);
      setSecurityMessage(null);
      setIsValidatingFiles(false);
      e.target.value = '';
      return;
    }

    const verifiedFiles: File[] = [];

    for (const file of incomingFiles) {
      const validation = await validateUploadedFile(file);
      if (!validation.valid) {
        setDriveError(validation.error || 'File tidak lolos verifikasi format.');
        setSecurityMessage(null);
        setIsValidatingFiles(false);
        e.target.value = '';
        return;
      }
      verifiedFiles.push(file);
    }

    setSelectedFiles(prev => [...prev, ...verifiedFiles]);

    // Create object URLs for immediate preview
    const newPreviews = verifiedFiles.map((file: File) => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    setSecurityMessage(`${verifiedFiles.length} file foto siap diunggah.`);
    setIsValidatingFiles(false);
    e.target.value = '';
  };

  // Remove a single selected file
  const handleRemoveFile = (index: number) => {
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Clean up previews on modal close
  const handleCloseModal = () => {
    setShowAddModal(false);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setDriveError(null);
    setSecurityMessage(null);
    setIsUploading(false);
    setIsValidatingFiles(false);
  };

  // Persist gallery items
  const persistNewItem = async (newItem: GalleryItem) => {
    setItems(prev => [newItem, ...prev]);
    await saveCustomGalleryItem(newItem);
  };

  // Submit Handler: Upload otomatis ke Google Drive jekb66476@gmail.com dengan sanitasi ketat & Anti-Spam
  const handleSaveDocumentation = async (e: React.FormEvent) => {
    e.preventDefault();
    setDriveError(null);

    // 1. Anti-Spam / Rate Limit Protection
    const rateCheck = checkUploadRateLimit();
    if (!rateCheck.allowed) {
      setDriveError(`Proteksi Anti-Spam aktif: Terlalu banyak unggahan beruntun. Mohon tunggu ${rateCheck.waitSeconds} detik sebelum mengunggah kembali demi stabilitas server.`);
      return;
    }

    // 2. Sanitasi Input Teks (Anti-XSS & HTML Injection)
    const cleanTitle = sanitizeText(newTitle, 100);
    const cleanDescription = sanitizeText(newDescription, 1500);
    const cleanLocation = sanitizeText(newLocation, 100);
    const cleanDate = sanitizeText(newDate, 50);

    if (!cleanTitle) {
      setDriveError('Silakan masukkan judul kegiatan yang valid.');
      return;
    }

    if (selectedFiles.length === 0) {
      setDriveError('Silakan pilih minimal 1 foto dokumentasi dari galeri HP atau komputer Anda.');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Memindai & mengompresi foto aman (membersihkan metadata polyglot)...');

    try {
      const processedImages: string[] = [];
      let primaryDriveUrl: string | undefined = undefined;
      let primaryFolderUrl: string | undefined = undefined;

      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress(`Mengunggah foto ${i + 1} dari ${selectedFiles.length} ke Google Drive...`);
        // Canvas decode & re-encoding strips out any embedded virus/steganography payload
        const compressed = await compressImageFile(selectedFiles[i]);
        const safeFileName = sanitizeFileName(selectedFiles[i].name);

        try {
          // Upload ke Google Drive via Google Apps Script (berjalan di background tanpa login)
          const driveResult = await uploadToGoogleDriveNoLogin(
            compressed,
            safeFileName,
            scriptUrl.trim(),
            cleanTitle
          );
          processedImages.push(driveResult.directUrl);
          if (!primaryDriveUrl) {
            primaryDriveUrl = driveResult.driveUrl;
          }
          if (!primaryFolderUrl && driveResult.folderUrl) {
            primaryFolderUrl = driveResult.folderUrl;
          }
        } catch (driveErr) {
          console.warn('Fallback penyimpanan kompresi langsung:', driveErr);
          processedImages.push(compressed);
        }
      }

      const newItem: GalleryItem = {
        id: `gal-gdrive-${Date.now()}`,
        title: cleanTitle,
        category: newCategory,
        date: cleanDate || 'Agustus 2026',
        location: cleanLocation || "Masjid Jamie Al-Ikhlas",
        imageUrl: processedImages[0],
        images: processedImages,
        description: cleanDescription || 'Dokumentasi kegiatan kepemudaan bersama IRMAS Masjid Jamie Al-Ikhlas.',
        participants: Math.max(1, Math.min(10000, Number(newParticipants) || 30)),
        highlight: false,
        driveUrl: primaryDriveUrl,
        driveFolderUrl: primaryFolderUrl
      };

      if (primaryFolderUrl) {
        setLastSavedFolderUrl(primaryFolderUrl);
      }

      await persistNewItem(newItem);
      handleCloseModal();
      setAddSuccessToast(true);
      setTimeout(() => setAddSuccessToast(false), 5000);
    } catch (err) {
      setDriveError(err instanceof Error ? err.message : 'Terjadi kendala saat memproses foto.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="galeri" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 mb-2.5">
            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Dokumentasi Syiar & Ukhuwah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri Kegiatan IRMAS
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base leading-relaxed px-1">
            Momen kebersamaan, semangat hijrah, dan jejak langkah dakwah pemuda Masjid Jamie Al-Ikhlas. Geser ke kanan foto pada setiap kegiatan untuk melihat dokumentasi lengkap.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-3.5 mb-6 sm:mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[38px] ${
                  activeCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kegiatan, waktu, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 min-h-[42px]"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Google Drive Status & Folder Link */}
              {driveFolderUrl ? (
                <a
                  href={driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[42px]"
                  title="Buka folder arsip foto di Google Drive"
                >
                  <FolderOpen className="w-4 h-4 text-sky-600" />
                  <span className="hidden md:inline">Folder Drive IRMAS</span>
                  <ExternalLink className="w-3 h-3 text-sky-500" />
                </a>
              ) : driveToken ? (
                <button
                  onClick={async () => {
                    try {
                      const { folderUrl } = await getOrCreateIrmasFolder(driveToken);
                      setDriveFolderUrl(folderUrl);
                      window.open(folderUrl, '_blank');
                    } catch (e) {
                      setDriveError(e instanceof Error ? e.message : 'Gagal membuka folder');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[42px]"
                >
                  <FolderOpen className="w-4 h-4 text-sky-600" />
                  <span className="hidden md:inline">Drive IRMAS</span>
                </button>
              ) : null}

              {/* Add Documentation Button */}
              <button
                id="btn-add-documentation"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 min-h-[42px] shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Dokumentasi Foto</span>
              </button>
            </div>
          </div>

        </div>

        {/* Success Toast */}
        {addSuccessToast && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Alhamdulillah, dokumentasi berhasil disimpan!</span>
                <p className="text-xs text-emerald-700 mt-0.5">Foto kegiatan kini telah tayang di galeri website IRMAS.</p>
              </div>
            </div>
            {lastSavedFolderUrl && (
              <a
                href={lastSavedFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Buka di Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Gallery Grid with Interactive Multi-Photo Scrollable Cards */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ActivityCard
                key={item.id}
                item={item}
                getCategoryLabel={getCategoryLabel}
                onSelectImage={onSelectImage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Tidak ada dokumentasi ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau pilih kategori lainnya.</p>
            <button
              onClick={() => { setActiveCategory('semua'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Modal: Tambah Dokumentasi Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-emerald-100 max-h-[92vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Tambah Foto Dokumentasi Kegiatan</h3>
                    <p className="text-xs text-slate-500 font-medium">Unggah langsung foto dokumentasi dari HP atau laptop</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isUploading}
                  className="text-slate-400 hover:text-slate-600 p-1.5 text-lg font-bold rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drive Error Banner if any */}
              {driveError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{driveError}</p>
                  </div>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSaveDocumentation} className="space-y-4">
                
                {/* File Picker Zone */}
                <div>
                  <div className="mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Pilih Foto Kegiatan dari HP / Komputer</span>
                      <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                  />
                  
                  <div
                    onClick={() => !isValidatingFiles && !isUploading && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-2xl p-6 text-center cursor-pointer bg-emerald-50/40 hover:bg-emerald-50/70 transition-all group"
                  >
                    {isValidatingFiles ? (
                      <div className="py-2">
                        <Loader2 className="w-8 h-8 text-emerald-600 mx-auto animate-spin mb-2" />
                        <p className="text-xs font-bold text-emerald-800">
                          Memeriksa kelayakan file foto...
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Memastikan foto valid dan siap diproses
                        </p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-slate-800">
                          Klik di sini untuk memilih foto dokumentasi
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Format: JPG, JPEG, PNG, WEBP • Maks. 10 MB/foto
                        </p>
                      </>
                    )}
                  </div>

                  {/* Security Scan Feedback */}
                  {securityMessage && !isValidatingFiles && (
                    <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium">{securityMessage}</span>
                    </div>
                  )}

                  {/* Selected Files Thumbnails */}
                  {previewUrls.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[11px] font-bold text-slate-600 mb-2">
                        {previewUrls.length} Foto terpilih:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {previewUrls.map((url, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                            <img
                              src={url}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                Sampul
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(idx);
                              }}
                              disabled={isUploading}
                              className="absolute top-1 right-1 w-6 h-6 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Hapus foto ini"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Common Activity Metadata */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kegiatan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kajian Bulanan Remaja & Buka Bersama"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
                    <FolderOpen className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Foto akan otomatis masuk ke folder terpisah di Google Drive sesuai judul kegiatan ini.</span>
                  </p>
                </div>

                {/* Deskripsi Singkat Kegiatan - Ditempatkan langsung di bawah Judul agar jelas dan mudah diisi */}
                <div>
                  <div className="mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Deskripsi Singkat Kegiatan
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan cerita singkat tentang keseruan acara, materi atau hikmah kajian, ustadz pengisi, atau kesan pesan kegiatan..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white placeholder:text-slate-400 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as GalleryCategory)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    >
                      <option value="kajian">Kajian Remaja</option>
                      <option value="sosial">Baksos & Sosial</option>
                      <option value="phbi">PHBI Akbar</option>
                      <option value="rihlah">Rihlah & Alam</option>
                      <option value="pelatihan">Pelatihan Skill</option>
                      <option value="ramadhan">Semarak Ramadhan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kegiatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: 15 Agustus 2026"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Kegiatan</label>
                    <input
                      type="text"
                      placeholder="Masjid Jamie Al-Ikhlas"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Jamaah</label>
                    <input
                      type="number"
                      placeholder="Contoh: 85"
                      value={newParticipants}
                      onChange={(e) => setNewParticipants(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                    <span className="font-semibold">{uploadProgress}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isUploading}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || selectedFiles.length === 0}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan Foto...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Simpan Foto ke Galeri</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
