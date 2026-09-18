import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, MapPin, Users } from 'lucide-react';
import { mosqueProfile } from '../data/irmasData';
import { IrmasLogo } from './IrmasLogo';

interface HeroProps {
  onExploreProfile: () => void;
  onExploreGallery: () => void;
  onExploreAdArt?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreProfile, 
  onExploreGallery 
}) => {
  const [activeHeroBtn, setActiveHeroBtn] = useState<string | null>(null);

  const handleBtnClick = (btnId: string, action: () => void) => {
    setActiveHeroBtn(btnId);
    action();
  };

  const getButtonClass = (btnId: string) => {
    const isActive = activeHeroBtn === btnId;
    if (isActive) {
      return "inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-3 rounded-xl border border-emerald-700 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 text-xs sm:text-sm min-h-[44px]";
    }
    return "inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold px-5 py-3 rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-95 text-xs sm:text-sm min-h-[44px]";
  };

  return (
    <section id="beranda" className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white">
      
      {/* Subtle geometric ambient rings */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Islamic Calligraphy Greeting */}
        <div className="mb-4 sm:mb-6">
          <p className="font-arabic text-lg sm:text-2xl md:text-3xl text-emerald-900 tracking-normal font-normal leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-[11px] sm:text-xs text-emerald-700/80 mt-1 font-medium italic">
            "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang"
          </p>
        </div>

        {/* Tag Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold px-3 sm:px-3.5 py-1.5 rounded-full mb-4 sm:mb-6 shadow-xs max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Pedoman AD/ART Periode {mosqueProfile.activePeriod}</span>
        </div>

        {/* IRMAS Official Logo */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <div className="transition-transform duration-300 hover:scale-105">
            <IrmasLogo size="xl" showText={false} />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight mb-3 sm:mb-5 max-w-4xl mx-auto">
          <span className="block text-slate-900">
            Ikatan Remaja Masjid
          </span>
          <span className="block text-emerald-700 mt-1 sm:mt-2">
            Masjid Jamie “Al-Ikhlas”
          </span>
        </h1>

        {/* Location Subtitle */}
        <div className="mb-3.5 sm:mb-4 px-3 max-w-lg mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold text-emerald-800 leading-normal text-center">
            <span className="inline-flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>{mosqueProfile.housing} {mosqueProfile.neighborhood}</span>
            </span>
            <span className="block text-emerald-700 font-medium mt-0.5 sm:mt-1">
              {mosqueProfile.village}, Kec. Cikarang Timur, Kab. Bekasi, Jawa Barat
            </span>
          </p>
        </div>

        {/* Sub-description */}
        <p className="text-xs sm:text-base md:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto font-normal px-3">
          {mosqueProfile.shortDesc}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            id="hero-btn-profile"
            onClick={() => handleBtnClick('profile', onExploreProfile)}
            className={getButtonClass('profile')}
          >
            <Users className={`w-4 h-4 shrink-0 ${activeHeroBtn === 'profile' ? 'text-white' : 'text-slate-500'}`} />
            <span>Profil & Visi</span>
          </button>

          <button
            id="hero-btn-gallery"
            onClick={() => handleBtnClick('gallery', onExploreGallery)}
            className={getButtonClass('gallery')}
          >
            <ImageIcon className={`w-4 h-4 shrink-0 ${activeHeroBtn === 'gallery' ? 'text-white' : 'text-slate-500'}`} />
            <span>Galeri Kegiatan</span>
          </button>
        </div>

      </div>
    </section>
  );
};
