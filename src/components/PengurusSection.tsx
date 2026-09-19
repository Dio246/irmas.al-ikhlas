import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Award, Users, Phone, X, BookOpen } from 'lucide-react';
import { mosqueProfile, pengurusList, dkmList } from '../data/irmasData';
import { resolveAsset } from '../lib/assetHelper';
import { Pengurus } from '../types';

interface PengurusSectionProps {
  embeddedInTab?: boolean;
}

export const PengurusSection: React.FC<PengurusSectionProps> = ({ embeddedInTab = false }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Pengurus | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);

  const isRealPhoto = (avatarUrl: string) => {
    return avatarUrl.toLowerCase().includes('foto bph') || avatarUrl.toLowerCase().includes('ketua');
  };

  const getInitials = (name: string) => {
    const clean = name.replace(/^(Ust\.|H\.|Hj\.)\s*/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const getWhatsAppLink = (p: Pengurus) => {
    const raw = p.whatsapp || (p.phone !== '-' ? p.phone : '');
    if (!raw) return null;
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.length < 8) return null;
    const intl = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
    return `https://wa.me/${intl}`;
  };

  const content = (
    <div className="space-y-8 sm:space-y-10">
      {/* Leadership & DKM Header Badge */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4.5 sm:p-6 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-700 inline-block">
            Kepengurusan Terpadu Periode {mosqueProfile.activePeriod}
          </span>
          <h3 className="text-base sm:text-lg md:text-xl font-bold mt-2 leading-snug">
            Masjid Jami'e Al-Ikhlas Jatibaru
          </h3>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed max-w-2xl">
            Hirarki pembinaan pemuda-pemudi masjid: Pengurus DKM Masjid sebagai penanggung jawab utama, Jajaran Pembina IRMAS, serta Pengurus Harian Pelaksana (BPH).
          </p>
        </div>

        {/* Info Statis Mengetahui (Bukan Tombol) */}
        <div className="bg-emerald-950/60 p-3 sm:p-3.5 rounded-xl border border-emerald-700/60 text-xs shrink-0 text-left sm:text-right shadow-2xs">
          <p className="text-emerald-300 font-medium text-[11px] sm:text-xs">Mengetahui,</p>
          <p className="text-emerald-200/90 text-[11px] sm:text-xs mt-0.5">Ketua DKM Jami'e Al-Ikhlas</p>
          <p className="font-bold text-white text-sm sm:text-base mt-1">{mosqueProfile.ketuaDkm}</p>
        </div>
      </div>

        {/* 1. Jajaran Pengurus DKM Masjid */}
        <div className="space-y-4 mb-8 sm:mb-12">
          <div className="flex items-center justify-between border-b border-emerald-300 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-5 bg-emerald-800 rounded-full"></div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Jajaran Pengurus DKM Masjid Jami'e Al-Ikhlas</span>
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {dkmList.map((p) => {
              const hasRealPhoto = isRealPhoto(p.avatar);

              return (
                <div
                  key={p.id}
                  id={`pengurus-card-${p.id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPhoto(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPhoto(p);
                    }
                  }}
                  className="bg-white rounded-2xl border-2 border-emerald-500/40 hover:border-emerald-600 hover:shadow-xl transition-all p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden cursor-pointer hover:-translate-y-0.5"
                  title="Klik kartu untuk melihat detail profil & foto"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-100/80 to-transparent pointer-events-none rounded-bl-3xl" />
                  <div>
                    <div className="flex items-center gap-3 sm:gap-4 mb-3.5">
                      <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 shadow-xs group-hover:scale-105 transition-transform bg-slate-100 border-2 border-emerald-700/70 ring-2 ring-emerald-200">
                        <img
                          src={resolveAsset(p.avatar)}
                          alt={p.name}
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1">
                          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-950 bg-emerald-200/90 border border-emerald-300 px-2 py-0.5 rounded-md inline-block">
                            DKM MASJID
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate group-hover:text-emerald-800 transition-colors">{p.name}</h4>
                        <p className="text-xs text-emerald-800 font-bold truncate">{p.role}</p>
                      </div>
                    </div>

                    {p.quote && (
                      <p className="text-[11px] sm:text-xs text-slate-700 italic bg-emerald-50/60 p-2.5 sm:p-3 rounded-xl border border-emerald-200/70 leading-relaxed mb-3">
                        "{p.quote}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-slate-400 font-medium group-hover:text-emerald-700 transition-colors">
                      Detail Profil
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Jajaran Pembina IRMAS (Di Bawah DKM & Di Atas Pengurus Lainnya) */}
        <div className="space-y-4 mb-8 sm:mb-12">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-5 bg-emerald-600 rounded-full"></div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Jajaran Pembina IRMAS</span>
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pengurusList
              .filter((p) => p.role.toLowerCase().includes('pembina'))
              .map((p) => {
                const hasRealPhoto = isRealPhoto(p.avatar);

                return (
                  <div
                    key={p.id}
                    id={`pengurus-card-${p.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPhoto(p)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPhoto(p);
                      }
                    }}
                    className="bg-white rounded-2xl border border-emerald-300/80 hover:border-emerald-500 hover:shadow-xl transition-all p-4 sm:p-5 flex flex-col justify-between group cursor-pointer hover:-translate-y-0.5"
                    title="Klik kartu untuk melihat detail profil & foto"
                  >
                    <div>
                      <div className="flex items-center gap-3 sm:gap-4 mb-3.5">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 shadow-xs group-hover:scale-105 transition-transform bg-slate-100 border-2 border-emerald-600/70 ring-2 ring-emerald-100">
                          <img
                            src={resolveAsset(p.avatar)}
                            alt={p.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-200/70 border border-emerald-300/60 px-2 py-0.5 rounded-md inline-block">
                            {p.division}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate group-hover:text-emerald-800 transition-colors">{p.name}</h4>
                          <p className="text-xs text-emerald-700 font-semibold truncate">{p.role}</p>
                        </div>
                      </div>

                      {p.quote && (
                        <p className="text-[11px] sm:text-xs text-slate-600 italic bg-emerald-50/50 p-2.5 sm:p-3 rounded-xl border border-emerald-100/80 leading-relaxed mb-3">
                          "{p.quote}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-center">
                      <span className="text-[11px] text-slate-400 font-medium group-hover:text-emerald-700 transition-colors">
                        Detail Profil
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 3. Jajaran Pengurus Harian IRMAS (Ketua, Wakil, Sekretaris, Bendahara) */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-5 bg-teal-600 rounded-full"></div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Jajaran Pengurus Harian IRMAS</span>
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pengurusList
              .filter((p) => !p.role.toLowerCase().includes('pembina'))
              .map((p) => {
                const hasRealPhoto = isRealPhoto(p.avatar);

                return (
                  <div
                    key={p.id}
                    id={`pengurus-card-${p.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPhoto(p)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPhoto(p);
                      }
                    }}
                    className={`bg-white rounded-2xl transition-all p-4 sm:p-5 flex flex-col justify-between group cursor-pointer hover:-translate-y-0.5 ${
                      hasRealPhoto 
                        ? 'border-2 border-teal-500/40 hover:border-teal-600 hover:shadow-xl' 
                        : 'border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg'
                    }`}
                    title="Klik kartu untuk melihat detail profil & foto"
                  >
                    <div>
                      <div className="flex items-center gap-3 sm:gap-4 mb-3.5">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 shadow-xs group-hover:scale-105 transition-transform bg-slate-100 border-2 border-teal-600/70 ring-2 ring-teal-100">
                          <img
                            src={resolveAsset(p.avatar)}
                            alt={p.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1">
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-teal-900 bg-teal-100/90 px-2 py-0.5 rounded-md inline-block">
                              {p.division}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate group-hover:text-teal-800 transition-colors">{p.name}</h4>
                          <p className="text-xs text-teal-700 font-semibold truncate">{p.role}</p>
                        </div>
                      </div>

                      {p.quote && (
                        <p className="text-[11px] sm:text-xs text-slate-600 italic bg-emerald-50/40 p-2.5 sm:p-3 rounded-xl border border-emerald-100/60 leading-relaxed mb-3">
                          "{p.quote}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-center">
                      <span className="text-[11px] text-slate-400 font-medium group-hover:text-teal-700 transition-colors">
                        Detail Profil
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Organigram Note from AD/ART */}
        <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-2xl p-4 sm:p-5 text-center max-w-2xl mx-auto shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ketentuan AD/ART Bab VII Pasal 12</span>
          </div>
          <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
            Sesuai BAB VII Pasal 12 AD/ART, Pengurus IRMAS berkewajiban membuat laporan kegiatan dan berkoordinasi langsung dengan Pengurus DKM Masjid Jamie Al-Ikhlas.
          </p>
        </div>

      {/* Modal Detail Profil & Foto Pengurus (Rendered directly to document.body via Portal) */}
      {selectedPhoto && typeof document !== 'undefined' && createPortal(
        <div 
          id="modal-preview-foto-pengurus"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Dialog */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-slate-50/90 shrink-0">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md">
                {selectedPhoto.division === 'DKM' ? "Pengurus DKM Masjid" : `Pengurus IRMAS • ${selectedPhoto.division}`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup pratinjau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4">
              {/* Foto Profil Pengurus (DKM, Pembina, & BPH) */}
              <div className="relative w-full aspect-square max-h-48 sm:max-h-60 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs flex items-center justify-center mx-auto">
                <img
                  src={resolveAsset(selectedPhoto.avatar)}
                  alt={selectedPhoto.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Data Identitas */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{selectedPhoto.name}</h3>
                <p className="text-xs sm:text-sm font-semibold text-emerald-800 mt-0.5">{selectedPhoto.role}</p>
              </div>

              {/* Amanah & Kutipan */}
              {selectedPhoto.quote && (
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Amanah & Pesan:</p>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{selectedPhoto.quote}"
                  </p>
                </div>
              )}
            </div>

            {/* Footer Aksi */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
              {getWhatsAppLink(selectedPhoto) ? (
                <a
                  href={getWhatsAppLink(selectedPhoto)!}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:text-white hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors min-h-[38px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Sekretariat DKM / IRMAS</span>
              )}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-200/70 text-xs font-semibold transition-colors cursor-pointer ml-auto min-h-[38px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );

  if (embeddedInTab) {
    return content;
  }

  return (
    <section id="pengurus" className="py-12 sm:py-16 md:py-24 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-900 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2.5 shadow-2xs">
            <Users className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
            <span>Amanah & Kepemimpinan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Struktur Kepengurusan DKM & BPH IRMAS
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base leading-relaxed px-1">
            Hirarki pembinaan dan pelaksana kepemudaan Masjid Jamie “Al-Ikhlas” Periode {mosqueProfile.activePeriod}.
          </p>
        </div>
        {content}
      </div>
    </section>
  );
};

