import React from 'react';
import { Shield, Award, Users, Phone, X } from 'lucide-react';
import { mosqueProfile, pengurusList, dkmList } from '../data/irmasData';
import { resolveAsset } from '../lib/assetHelper';

interface PengurusSectionProps {
  onClose?: () => void;
}

export const PengurusSection: React.FC<PengurusSectionProps> = ({ onClose }) => {
  return (
    <section id="pengurus" className="py-12 sm:py-16 md:py-24 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Close Button at Top */}
        {onClose && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Tutup Struktur Kepengurusan"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
              <span>Tutup Struktur</span>
            </button>
          </div>
        )}

        {/* Section Header */}
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

          <div className="text-left sm:text-right bg-emerald-950/50 p-3 sm:p-3.5 rounded-xl border border-emerald-700/60 text-xs shrink-0">
            <p className="text-emerald-300 font-medium text-[11px] sm:text-xs">Ketua DKM Jami'e Al-Ikhlas:</p>
            <p className="font-bold text-white text-sm sm:text-base">{mosqueProfile.ketuaDkm}</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-200/80">Penanggung Jawab Kemasjidan</p>
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
              const rawPhone = p.whatsapp || p.phone || p.social?.whatsapp || p.social?.phone || '';
              const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
              const hasValidPhone = cleanPhone.length >= 8;

              return (
                <div
                  key={p.id}
                  id={`pengurus-card-${p.id}`}
                  className="bg-white rounded-2xl border-2 border-emerald-500/40 hover:border-emerald-600 hover:shadow-lg transition-all p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-100/80 to-transparent pointer-events-none rounded-bl-3xl" />
                  <div>
                    <div className="flex items-center gap-3 sm:gap-4 mb-3.5">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-700/60 ring-2 ring-emerald-200 shrink-0 shadow-xs group-hover:scale-105 transition-transform bg-slate-100">
                        <img
                          src={resolveAsset(p.avatar)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-950 bg-emerald-200/90 border border-emerald-300 px-2 py-0.5 rounded-md inline-block">
                          DKM MASJID
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">{p.name}</h4>
                        <p className="text-xs text-emerald-800 font-bold truncate">{p.role}</p>
                      </div>
                    </div>

                    {p.quote && (
                      <p className="text-[11px] sm:text-xs text-slate-700 italic bg-emerald-50/60 p-2.5 sm:p-3 rounded-xl border border-emerald-200/70 leading-relaxed mb-3">
                        "{p.quote}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 shrink-0">
                      Pengurus DKM Masjid
                    </span>
                    {hasValidPhone ? (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 transition-colors text-[11px] sm:text-xs min-h-[36px]"
                        title="Hubungi via WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{p.phone || p.whatsapp}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Sekretariat DKM</span>
                    )}
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
                const rawPhone = p.whatsapp || p.phone || p.social?.whatsapp || p.social?.phone || '';
                const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
                const hasValidPhone = cleanPhone.length >= 8;

                return (
                  <div
                    key={p.id}
                    id={`pengurus-card-${p.id}`}
                    className="bg-white rounded-2xl border border-emerald-300/80 hover:border-emerald-500 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-3 sm:gap-4 mb-3.5">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-600/50 ring-2 ring-emerald-100 shrink-0 shadow-xs group-hover:scale-105 transition-transform bg-slate-100">
                          <img
                            src={resolveAsset(p.avatar)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-200/70 border border-emerald-300/60 px-2 py-0.5 rounded-md inline-block">
                            {p.division}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">{p.name}</h4>
                          <p className="text-xs text-emerald-700 font-semibold truncate">{p.role}</p>
                        </div>
                      </div>

                      {p.quote && (
                        <p className="text-[11px] sm:text-xs text-slate-600 italic bg-emerald-50/50 p-2.5 sm:p-3 rounded-xl border border-emerald-100/80 leading-relaxed mb-3">
                          "{p.quote}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
                      <span className="text-[10px] sm:text-[11px] font-medium text-emerald-700 font-semibold shrink-0">
                        Pembina Organisasi
                      </span>
                      {hasValidPhone ? (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 transition-colors text-[11px] sm:text-xs min-h-[36px]"
                          title="Hubungi via WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{p.phone || p.whatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Melalui DKM / IRMAS</span>
                      )}
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
                const rawPhone = p.whatsapp || p.phone || p.social?.whatsapp || p.social?.phone || '';
                const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
                const hasValidPhone = cleanPhone.length >= 8;

                return (
                  <div
                    key={p.id}
                    id={`pengurus-card-${p.id}`}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-3 sm:gap-4 mb-3.5">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shrink-0 shadow-xs group-hover:scale-105 transition-transform bg-slate-100">
                          <img
                            src={resolveAsset(p.avatar)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block">
                            {p.division}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">{p.name}</h4>
                          <p className="text-xs text-emerald-700 font-semibold truncate">{p.role}</p>
                        </div>
                      </div>

                      {p.quote && (
                        <p className="text-[11px] sm:text-xs text-slate-600 italic bg-emerald-50/40 p-2.5 sm:p-3 rounded-xl border border-emerald-100/60 leading-relaxed mb-3">
                          "{p.quote}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
                      <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 shrink-0">Masa Kerja 2 Tahun</span>
                      {hasValidPhone ? (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 transition-colors text-[11px] sm:text-xs min-h-[36px]"
                          title="Hubungi via WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{p.phone || p.whatsapp || p.social?.phone || p.social?.whatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Melalui DKM / IRMAS</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Organigram Note from AD/ART */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
            Sesuai BAB VII Pasal 12 AD/ART, Pengurus IRMAS berkewajiban membuat laporan kegiatan dan berkoordinasi langsung dengan Pengurus DKM Masjid Jamie Al-Ikhlas.
          </p>
        </div>

        {/* Bottom Close Button */}
        {onClose && (
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer hover:border-slate-400"
            >
              <X className="w-4 h-4 text-slate-500" />
              <span>Tutup Tampilan Struktur Kepengurusan</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
