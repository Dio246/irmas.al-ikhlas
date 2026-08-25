import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Users, Tag, Share2, Check, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { GalleryItem } from '../types';
import { resolveAsset } from '../lib/assetHelper';

interface LightboxModalProps {
  item: GalleryItem | null;
  initialIndex?: number;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, initialIndex = 0, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(initialIndex);

  // Sync index when item changes
  useEffect(() => {
    setActivePhotoIdx(initialIndex);
  }, [item, initialIndex]);

  const imagesList = item ? (item.images && item.images.length > 0 ? item.images : [item.imageUrl]) : [];
  const currentImage = imagesList[activePhotoIdx] || item?.imageUrl || '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActivePhotoIdx((prev) => (prev + 1) % imagesList.length);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActivePhotoIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, imagesList.length]);

  if (!item) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % imagesList.length);
  };

  return (
    <div 
      id="lightbox-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        id="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[92vh] shadow-2xl border border-emerald-100 flex flex-col md:flex-row"
      >
        
        {/* Close Button */}
        <button
          id="btn-close-lightbox"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup detail foto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Main Area (Left Column) */}
        <div className="md:w-3/5 bg-slate-950 flex flex-col justify-between relative min-h-[300px] md:min-h-[500px] select-none">
          
          {/* Main Photo with Prev / Next Navigation */}
          <div className="relative flex-1 flex items-center justify-center p-2 overflow-hidden">
            <img
              key={currentImage}
              src={resolveAsset(currentImage)}
              alt={`${item.title} - Foto ${activePhotoIdx + 1}`}
              className="w-full h-full max-h-[62vh] object-contain transition-all duration-300"
              referrerPolicy="no-referrer"
            />

            {/* Navigation Arrows (if multiple photos) */}
            {imagesList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  id="btn-lightbox-prev"
                  aria-label="Foto sebelumnya"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  id="btn-lightbox-next"
                  aria-label="Foto berikutnya"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Photo Counter Pill */}
            {imagesList.length > 1 && (
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Images className="w-3.5 h-3.5 text-emerald-400" />
                <span>Foto {activePhotoIdx + 1} dari {imagesList.length}</span>
              </div>
            )}
          </div>

          {/* Horizontal Thumbnail Bar (Scrollable right) */}
          {imagesList.length > 1 && (
            <div className="bg-slate-900/90 border-t border-slate-800 p-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx 
                      ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20 opacity-100 ring-2 ring-emerald-400/40' 
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img
                    src={resolveAsset(imgUrl)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activePhotoIdx === idx && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Right Column */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                <Tag className="w-3 h-3" />
                {item.category}
              </span>
              {item.participants && (
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Users className="w-3 h-3 text-emerald-600" />
                  {item.participants} Jamaah
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {item.description}
            </p>

            <div className="space-y-2.5 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Waktu:</strong> {item.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span><strong>Lokasi:</strong> {item.location}</span>
              </div>
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2 pt-1 border-t border-emerald-100/70 text-emerald-800 font-medium text-[11px]">
                  <Images className="w-3.5 h-3.5 shrink-0" />
                  <span>Terdapat <strong>{imagesList.length} foto</strong> dokumentasi. Geser foto atau gunakan tombol panah untuk melihat.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
            <button
              onClick={handleShare}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan Foto</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
