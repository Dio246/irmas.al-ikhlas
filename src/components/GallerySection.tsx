import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Search, Calendar, MapPin, Users, Plus, Maximize2, Check, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { galleryData as initialGalleryData } from '../data/irmasData';
import { GalleryItem, GalleryCategory } from '../types';

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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      if (index >= 0 && index < imagesList.length) {
        setActiveIdx(index);
      }
    }
  };

  const scrollToPhoto = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (scrollContainerRef.current) {
      const targetScroll = index * scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setActiveIdx(index);
    }
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

  return (
    <div
      id={`gallery-card-${item.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Interactive Horizontal Scroll Photo Track */}
      <div className="relative h-60 sm:h-64 w-full bg-slate-950 overflow-hidden select-none">
        
        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {imagesList.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => onSelectImage(item, idx)}
              className="w-full h-full shrink-0 snap-center relative cursor-pointer group/img"
            >
              <img
                src={imgUrl}
                alt={`${item.title} - Foto ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-60 group-hover/img:opacity-80 transition-opacity" />
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
            <span className="bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs pointer-events-auto">
              <Images className="w-3 h-3 text-emerald-300" />
              <span>{activeIdx + 1}/{imagesList.length} Foto • Geser ➔</span>
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
          <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 pointer-events-none">
            <Users className="w-3 h-3 text-emerald-300" />
            {item.participants} Jamaah
          </span>
        )}

        {/* Pagination Dots at Bottom Center */}
        {imagesList.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
            {imagesList.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => scrollToPhoto(dotIdx, e)}
                aria-label={`Lihat foto ${dotIdx + 1}`}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeIdx === dotIdx ? 'bg-emerald-400 w-4' : 'bg-white/50 hover:bg-white/80'
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
  const [items, setItems] = useState<GalleryItem[]>(initialGalleryData);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Documentation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryCategory>('kajian');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState("Masjid Jamie Al-Ikhlas");
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newExtraImages, setNewExtraImages] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newParticipants, setNewParticipants] = useState<number>(50);
  const [addSuccessToast, setAddSuccessToast] = useState(false);

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

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const fallbackImg = newImageUrl.trim() || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1000&auto=format&fit=crop&q=80';
    
    // Parse extra photo URLs (from separate lines or commas)
    const extraUrls = newExtraImages
      .split(/[\n,]+/)
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const allImages = [fallbackImg, ...extraUrls];

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: newDate || 'Agustus 2026',
      location: newLocation || "Masjid Jamie Al-Ikhlas",
      imageUrl: fallbackImg,
      images: allImages,
      description: newDescription || 'Dokumentasi kegiatan kepemudaan bersama IRMAS.',
      participants: Number(newParticipants) || 30,
      highlight: false
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    setNewTitle('');
    setNewImageUrl('');
    setNewExtraImages('');
    setNewDescription('');
    setAddSuccessToast(true);
    setTimeout(() => setAddSuccessToast(false), 4000);
  };

  const getCategoryLabel = (cat: GalleryCategory) => {
    const found = categories.find(c => c.id === cat);
    return found ? found.label : cat;
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

          {/* Search Box & Add Photo Action */}
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

            <button
              id="btn-add-documentation"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 min-h-[42px]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumentasi Foto</span>
            </button>
          </div>

        </div>

        {/* Success Toast */}
        {addSuccessToast && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dokumentasi foto kegiatan berhasil ditambahkan ke galeri!</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Tambah Foto Dokumentasi Kegiatan</h3>
                    <p className="text-xs text-slate-500">Unggah satu atau banyak foto untuk satu kegiatan IRMAS</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddPhoto} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kegiatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kajian Bulanan Remaja & Buka Bersama"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Foto Utama (URL Gambar / Path Lokal)</label>
                  <input
                    type="text"
                    placeholder="Contoh: /dokumentasi/foto-1.jpeg atau https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Kosongkan untuk menggunakan foto default bernuansa islami.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Foto Tambahan (Bisa multi foto, pisahkan baris per URL)</label>
                  <textarea
                    rows={2}
                    placeholder="/dokumentasi/foto-2.jpeg&#10;/dokumentasi/foto-3.jpeg"
                    value={newExtraImages}
                    onChange={(e) => setNewExtraImages(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Masukkan URL atau path foto lain dalam kegiatan yang sama agar pengunjung bisa menggeser foto ke kanan.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Kegiatan</label>
                  <textarea
                    rows={2}
                    placeholder="Ceritakan momen seru dan hikmah kegiatan ini..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md cursor-pointer"
                  >
                    Simpan ke Galeri
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
