import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, FileText, Users, Clock, MapPin, Image as ImageIcon, ChevronLeft, Maximize2, X } from 'lucide-react';
import { adArtOfficialDocument, mosqueProfile, musyawarahPhotos } from '../data/irmasData';

export const AdArtViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBabs, setExpandedBabs] = useState<string[]>(['BAB I', 'BAB II', 'BAB III']);
  const [activeTab, setActiveTab] = useState<'pasal' | 'kata-pengantar' | 'pengesahan' | 'dokumentasi'>('pasal');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  const toggleBab = (babNumber: string) => {
    setExpandedBabs(prev => 
      prev.includes(babNumber) 
        ? prev.filter(b => b !== babNumber) 
        : [...prev, babNumber]
    );
  };

  const expandAll = () => {
    setExpandedBabs(adArtOfficialDocument.chapters.map(c => c.babNumber));
  };

  const collapseAll = () => {
    setExpandedBabs([]);
  };

  const filteredChapters = adArtOfficialDocument.chapters.filter(chapter => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesBab = chapter.babNumber.toLowerCase().includes(query) || chapter.title.toLowerCase().includes(query);
    const matchesPasal = chapter.pasalList.some(p => 
      p.pasalNumber.toLowerCase().includes(query) || 
      (p.title && p.title.toLowerCase().includes(query)) ||
      p.contents.some(c => c.toLowerCase().includes(query))
    );
    return matchesBab || matchesPasal;
  });

  return (
    <div id="adart-viewer-container" className="bg-slate-50/80 rounded-2xl border border-emerald-100 p-3 sm:p-6 md:p-7 shadow-sm">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-6 text-white mb-5 sm:mb-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 bg-emerald-700/80 text-emerald-200 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40 w-fit">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Dokumen Resmi Pedoman Organisasi</span>
            </div>
            
            <button
              onClick={() => setActiveTab('dokumentasi')}
              className="inline-flex items-center gap-1.5 bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-100 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/40 transition-colors cursor-pointer w-fit"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Dokumentasi Musyawarah ({musyawarahPhotos.length} Foto)</span>
            </button>
          </div>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-snug">
            {adArtOfficialDocument.title}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-semibold">
            {adArtOfficialDocument.period} • {adArtOfficialDocument.locationHeader}
          </p>
          
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-3 sm:mt-4 text-[11px] sm:text-xs text-emerald-100/90 pt-3 border-t border-emerald-700/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              Ditetapkan: {adArtOfficialDocument.pengesahan.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              {mosqueProfile.housing}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              12 BAB • 18 PASAL
            </span>
          </div>
        </div>
      </div>

      {/* Sub navigation buttons & Search */}
      <div className="flex flex-col gap-3 mb-5 sm:mb-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('pasal')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeTab === 'pasal' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Isi AD/ART (18 Pasal)
          </button>
          <button
            onClick={() => setActiveTab('kata-pengantar')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeTab === 'kata-pengantar' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Kata Pengantar
          </button>
          <button
            onClick={() => setActiveTab('pengesahan')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeTab === 'pengesahan' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Tanda Tangan Pengesahan
          </button>
          <button
            onClick={() => setActiveTab('dokumentasi')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[38px] ${
              activeTab === 'dokumentasi' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Dokumentasi Musyawarah</span>
          </button>
        </div>

        {/* Search input & Controls */}
        {activeTab === 'pasal' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pasal, azas, tujuan..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[40px]"
              />
            </div>
            
            <button
              onClick={expandedBabs.length > 0 ? collapseAll : expandAll}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-colors shrink-0 cursor-pointer text-center min-h-[40px]"
            >
              {expandedBabs.length > 0 ? 'Tutup Semua BAB' : 'Buka Semua BAB'}
            </button>
          </div>
        )}
      </div>

      {/* Tab Content: 1. Pasal-Pasal */}
      {activeTab === 'pasal' && (
        <div className="space-y-4">
          {filteredChapters.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
              Tidak ditemukan pasal atau ketentuan yang sesuai dengan kata kunci "{searchQuery}".
            </div>
          ) : (
            filteredChapters.map((chapter) => {
              const isExpanded = expandedBabs.includes(chapter.babNumber) || searchQuery.length > 0;
              return (
                <div 
                  key={chapter.babNumber}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-emerald-200"
                >
                  {/* BAB Header Accordion Toggle */}
                  <button
                    onClick={() => toggleBab(chapter.babNumber)}
                    className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-emerald-50/50 text-left transition-colors cursor-pointer border-b border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200/80">
                        {chapter.babNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {chapter.title}
                      </h4>
                    </div>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-700" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Pasal List */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-4 divide-y divide-slate-100">
                      {chapter.pasalList.map((pasal) => (
                        <div key={pasal.pasalNumber} className="pt-3 first:pt-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {pasal.pasalNumber}
                            </span>
                            {pasal.title && (
                              <span className="text-xs font-semibold text-emerald-800">
                                ({pasal.title})
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/40">
                            {pasal.contents.map((line, idx) => (
                              <p key={idx} className="text-xs text-slate-700 leading-relaxed font-normal">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content: 2. Kata Pengantar */}
      {activeTab === 'kata-pengantar' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 space-y-6 text-slate-800">
          <div className="text-center pb-4 border-b border-slate-100">
            <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              Kata Pengantar
            </h4>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">
              Anggaran Dasar & Anggaran Rumah Tangga IRMAS Masa Bakti 2025/2027
            </p>
          </div>

          {/* Muqaddimah Ayat Al-Qur'an */}
          <div className="bg-emerald-50/60 rounded-xl p-4 sm:p-5 border border-emerald-100 space-y-2.5">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
              Landasan Firman Allah SWT:
            </span>
            {adArtOfficialDocument.kataPengantar.muqaddimah.map((ayat, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                {ayat}
              </p>
            ))}
          </div>

          {/* Paragraphs */}
          <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-slate-700">
            {adArtOfficialDocument.kataPengantar.body.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Signature */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <div className="text-right text-xs">
              <p className="text-slate-500">{adArtOfficialDocument.kataPengantar.signatureDate}</p>
              <p className="font-bold text-slate-900 mt-1">{adArtOfficialDocument.kataPengantar.signerRole}</p>
              <div className="h-12 flex items-center justify-end">
                <span className="text-[11px] text-emerald-600 font-serif italic">[Tanda Tangan Resmi]</span>
              </div>
              <p className="font-extrabold text-slate-900 underline underline-offset-2">
                {adArtOfficialDocument.kataPengantar.signerName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: 3. Tanda Tangan Pengesahan */}
      {activeTab === 'pengesahan' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 space-y-6 text-slate-800">
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Lembar Pengesahan Resmi
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-3">
              Ditetapkan di {adArtOfficialDocument.pengesahan.location}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Pada Tanggal: {adArtOfficialDocument.pengesahan.date}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {/* Sekretaris */}
            <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-200">
              <p className="text-xs font-bold text-slate-700">Sekretaris IRMAS</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs font-serif text-emerald-700 italic border-b border-emerald-300 pb-0.5">
                  Hesti Puspitasari
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-900">
                {adArtOfficialDocument.pengesahan.sekretaris}
              </p>
            </div>

            {/* Ketua IRMAS */}
            <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-200">
              <p className="text-xs font-bold text-slate-700">Ketua IRMAS</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs font-serif text-emerald-700 italic border-b border-emerald-300 pb-0.5">
                  M. Addym Jaka Anugrah
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-900">
                {adArtOfficialDocument.pengesahan.ketuaIrmas}
              </p>
            </div>
          </div>

          {/* Mengetahui Ketua DKM */}
          <div className="pt-2">
            <div className="max-w-md mx-auto bg-emerald-50/70 rounded-xl p-5 text-center border border-emerald-200">
              <p className="text-xs font-medium text-emerald-800">Mengetahui,</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">Ketua DKM Masjid Jamie Al-Ikhlas</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs font-serif text-emerald-800 italic border-b border-emerald-400 pb-0.5">
                  Rosadi
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-900">
                {adArtOfficialDocument.pengesahan.ketuaDkm}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab Content: 4. Dokumentasi Musyawarah Pembentukan & Pengesahan AD/ART */}
      {activeTab === 'dokumentasi' && (
        <div className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200 space-y-6 text-slate-800">
          
          {/* Header Description */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full mb-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Dokumentasi Musyawarah Resmi</span>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">
                Dokumentasi Pembentukan & Pengesahan AD/ART IRMAS
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Momen bersejarah musyawarah pembahasan dan penetapan pedoman organisasi di Masjid Jamie Al-Ikhlas (20 Desember 2024).
              </p>
            </div>

            <div className="shrink-0 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>{musyawarahPhotos.length} Foto Dokumentasi</span>
            </div>
          </div>

          {/* Featured Active Photo Carousel / Showcase */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 select-none">
            
            <div className="relative h-72 sm:h-96 w-full flex items-center justify-center bg-black/90">
              <img
                src={musyawarahPhotos[activePhotoIndex]?.url}
                alt={musyawarahPhotos[activePhotoIndex]?.title}
                className="w-full h-full object-contain cursor-pointer transition-all duration-300"
                onClick={() => setFullscreenPhoto(musyawarahPhotos[activePhotoIndex]?.url)}
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={() => setActivePhotoIndex((prev) => (prev - 1 + musyawarahPhotos.length) % musyawarahPhotos.length)}
                aria-label="Foto sebelumnya"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-emerald-700 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-md z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActivePhotoIndex((prev) => (prev + 1) % musyawarahPhotos.length)}
                aria-label="Foto berikutnya"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-emerald-700 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-md z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Top Photo Counter & Zoom hint */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                <span>Foto {activePhotoIndex + 1} dari {musyawarahPhotos.length}</span>
              </div>

              <button
                onClick={() => setFullscreenPhoto(musyawarahPhotos[activePhotoIndex]?.url)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-emerald-700 text-white p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer z-10"
                title="Perbesar Foto"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white">
                <h5 className="text-sm font-bold text-emerald-300">
                  {musyawarahPhotos[activePhotoIndex]?.title}
                </h5>
                <p className="text-xs text-slate-200 mt-0.5 line-clamp-2 font-normal">
                  {musyawarahPhotos[activePhotoIndex]?.desc}
                </p>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="bg-slate-900/95 border-t border-slate-800 p-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {musyawarahPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIndex === idx
                      ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/20 opacity-100 ring-2 ring-emerald-400/50'
                      : 'border-slate-700 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>

          </div>

          {/* Photo Cards Grid with Titles & Descriptions */}
          <div className="pt-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Daftar Foto Dokumentasi Musyawarah AD/ART:
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {musyawarahPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => {
                    setActivePhotoIndex(idx);
                    setFullscreenPhoto(photo.url);
                  }}
                  className={`group bg-slate-50 rounded-xl overflow-hidden border transition-all cursor-pointer hover:shadow-md ${
                    activePhotoIndex === idx
                      ? 'border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-300'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="relative h-40 bg-slate-950 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      Foto #{idx + 1}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-3.5">
                    <h6 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {photo.title}
                    </h6>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {photo.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Fullscreen Photo Modal */}
      {fullscreenPhoto && (
        <div
          onClick={() => setFullscreenPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-emerald-300 bg-black/60 p-2 rounded-full cursor-pointer transition-colors"
              aria-label="Tutup foto"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={fullscreenPhoto}
              alt="Dokumentasi Musyawarah AD/ART"
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-emerald-500/30"
              referrerPolicy="no-referrer"
            />

            <p className="text-xs text-slate-300 mt-3 text-center bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-xs">
              Musyawarah Pembentukan & Pengesahan AD/ART IRMAS Masjid Jamie Al-Ikhlas (20 Desember 2024)
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
