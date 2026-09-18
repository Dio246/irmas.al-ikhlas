import React, { useState } from 'react';
import { Target, Shield, BookOpen, Layers, FileText, Scale, Users } from 'lucide-react';
import { mosqueProfile, visionMission } from '../data/irmasData';
import { AdArtViewer } from './AdArtViewer';
import { PengurusSection } from './PengurusSection';
import { resolveAsset } from '../lib/assetHelper';

interface ProfileSectionProps {
  activeTab?: 'profil' | 'visi' | 'adart' | 'pengurus';
  onTabChange?: (tab: 'profil' | 'visi' | 'adart' | 'pengurus') => void;
  onNavigateToPengurus?: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  activeTab: externalTab, 
  onTabChange,
  onNavigateToPengurus 
}) => {
  const [internalTab, setInternalTab] = useState<'profil' | 'visi' | 'adart' | 'pengurus'>('profil');

  const currentTab = externalTab || internalTab;

  const handleTabSelect = (tab: 'profil' | 'visi' | 'adart' | 'pengurus') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  return (
    <section id="profil" className="py-12 sm:py-16 md:py-24 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 mb-2.5 shadow-xs">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>Pedoman Resmi & Identitas Organisasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Profil & Landasan IRMAS
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base leading-relaxed px-1">
            Ikatan Remaja Masjid (IRMAS) Masjid Jamie “Al-Ikhlas” Jatibaru, Cikarang Timur, Kabupaten Bekasi.
          </p>

          {/* Section Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-6 sm:mt-8 p-1.5 bg-slate-100/90 rounded-2xl max-w-2xl mx-auto border border-slate-200/80 shadow-xs">
            <button
              id="tab-btn-profil"
              onClick={() => handleTabSelect('profil')}
              className={`min-h-[40px] py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                currentTab === 'profil'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Tentang IRMAS</span>
            </button>
            <button
              id="tab-btn-visi"
              onClick={() => handleTabSelect('visi')}
              className={`min-h-[40px] py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                currentTab === 'visi'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>Azas & 6 Tujuan</span>
            </button>
            <button
              id="tab-btn-adart"
              onClick={() => handleTabSelect('adart')}
              className={`min-h-[40px] py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                currentTab === 'adart'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Buku AD/ART</span>
            </button>
            <button
              id="tab-btn-pengurus"
              onClick={() => handleTabSelect('pengurus')}
              className={`min-h-[40px] py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                currentTab === 'pengurus'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Struktur Pengurus</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Tentang IRMAS */}
        {currentTab === 'profil' && (
          <div className="animate-tab-fade grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="md:col-span-1 lg:col-span-6 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Identitas & Tempat Pendirian</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                Wadah Pembinaan Remaja Masjid Jamie Al-Ikhlas
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base text-justify">
                {mosqueProfile.fullHistory}
              </p>

              {/* Specific AD/ART Location & Time Details */}
              <div className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border border-slate-200 text-xs space-y-2 text-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-bold text-emerald-800 shrink-0">Nama Resmi:</span>
                  <span>{mosqueProfile.organizationName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-bold text-emerald-800 shrink-0">Sekretariat:</span>
                  <span>{mosqueProfile.address}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-bold text-emerald-800 shrink-0">Waktu Pendirian:</span>
                  <span>{mosqueProfile.establishedDate} (Masa Kerja AD/ART {mosqueProfile.activePeriod})</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-100 shadow-xl bg-slate-900">
                <img
                  src={resolveAsset('/foto_putra_putri_jamaah.jpeg')}
                  alt="Putra-Putri Jamaah Remaja Masjid Jamie Al-Ikhlas"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent"></div>
                
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                  <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-600 px-2.5 py-0.5 sm:py-1 rounded-md mb-1.5 sm:mb-2 inline-block shadow-xs">
                    Pasal 1 & 7 AD/ART
                  </span>
                  <h4 className="text-base sm:text-lg font-bold leading-tight">Putra-Putri Jamaah Masjid Jamie Al-Ikhlas</h4>
                  <p className="text-[11px] sm:text-xs text-emerald-100 mt-1 leading-relaxed">
                    Terbuka bagi seluruh remaja lingkungan Perumahan Graha Bhakti Kodam Jaya & Cittavile Jatibaru hingga usia setinggi-tingginya 40 tahun.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Azas, Visi & 6 Tujuan Resmi AD/ART */}
        {currentTab === 'visi' && (
          <div className="animate-tab-fade space-y-8 sm:space-y-10">
            
            {/* Azas Section (BAB III Pasal 5) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-emerald-900 text-white rounded-2xl p-4.5 sm:p-6 shadow-md border border-emerald-800 flex items-start gap-3.5 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-300">BAB III Pasal 5 (Azas 1)</span>
                  <h4 className="text-sm sm:text-base font-bold mt-0.5 sm:mt-1">Al-Qur’an dan Sunnah Rasulullah SAW</h4>
                  <p className="text-[11px] sm:text-xs text-emerald-100 mt-1 sm:mt-1.5 leading-relaxed">
                    Menjadikan tuntunan wahyu ilahi dan teladan Nabi Muhammad SAW sebagai pondasi pokok peribadatan dan moral pemuda.
                  </p>
                </div>
              </div>

              <div className="bg-teal-900 text-white rounded-2xl p-4.5 sm:p-6 shadow-md border border-teal-800 flex items-start gap-3.5 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-800 text-teal-300 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-teal-300">BAB III Pasal 5 (Azas 2)</span>
                  <h4 className="text-sm sm:text-base font-bold mt-0.5 sm:mt-1">Pancasila dan UUD 1945</h4>
                  <p className="text-[11px] sm:text-xs text-teal-100 mt-1.5 leading-relaxed">
                    Menumbuhsuburkan kesetiaan kepada konstitusi dan kerukunan berbangsa dalam wadah Negara Kesatuan Republik Indonesia.
                  </p>
                </div>
              </div>
            </div>

            {/* 6 Tujuan Resmi IRMAS (BAB III Pasal 6) */}
            <div className="bg-emerald-50/50 rounded-2xl p-4.5 sm:p-6 md:p-8 border border-emerald-100">
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-tight">
                    6 Tujuan Pokok Organisasi (AD/ART Bab III Pasal 6)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">Arah dan sasaran utama pembinaan Ikatan Remaja Masjid Jamie Al-Ikhlas</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {visionMission.misi.map((tujuan, idx) => (
                  <div key={idx} className="bg-white p-3.5 sm:p-4.5 rounded-xl border border-slate-200/80 flex items-start gap-2.5 sm:gap-3 shadow-2xs hover:border-emerald-300 transition-colors">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {tujuan}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Pilar Karakter */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 shrink-0" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">4 Pilar Karakter Pemuda Masjid</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {visionMission.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Pilar 0{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">{pillar.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Buku Pedoman AD/ART (Interactive Document) */}
        {currentTab === 'adart' && (
          <div className="animate-tab-fade space-y-6">
            <AdArtViewer />
          </div>
        )}

        {/* Tab 4: Struktur Pengurus DKM & BPH IRMAS */}
        {currentTab === 'pengurus' && (
          <div id="pengurus-content" className="animate-tab-fade space-y-6">
            <PengurusSection embeddedInTab />
          </div>
        )}

      </div>
    </section>
  );
};
