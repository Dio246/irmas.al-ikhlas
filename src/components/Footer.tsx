import React from 'react';
import { MapPin, Mail, Phone, Instagram, Youtube, ArrowUp, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { mosqueProfile } from '../data/irmasData';
import { IrmasLogo } from './IrmasLogo';

interface FooterProps {
  onNavigate?: (id: string, tab?: 'profil' | 'visi' | 'pengurus' | 'adart') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (id: string, tab?: 'profil' | 'visi' | 'pengurus' | 'adart') => {
    if (onNavigate) {
      onNavigate(id, tab);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      handle: mosqueProfile.instagram,
      url: mosqueProfile.instagramUrl,
      gradient: 'from-amber-500 via-pink-600 to-purple-600',
      tag: '@irmas_al.ikhlashu',
      icon: <Instagram className="w-4 h-4 text-white" />
    },
    {
      name: 'TikTok',
      handle: '@irmas_al.ikhlashu',
      url: mosqueProfile.tiktokUrl,
      gradient: 'from-slate-900 via-cyan-500 to-rose-500',
      tag: 'Konten Video & Dakwah',
      icon: (
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.47 6.34 6.34 0 0 0 1.88-4.47V8.62a8.27 8.27 0 0 0 4.9 1.58V6.75a4.83 4.83 0 0 1-1-.06z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      handle: mosqueProfile.youtube,
      url: mosqueProfile.youtubeUrl,
      gradient: 'from-red-600 to-red-700',
      tag: 'Kajian & Streaming',
      icon: <Youtube className="w-4 h-4 text-white" />
    },
    {
      name: 'Facebook',
      handle: 'Irmas Al-Ikhlas',
      url: mosqueProfile.facebookUrl,
      gradient: 'from-blue-600 to-blue-700',
      tag: 'Komunitas & Warta',
      icon: (
        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  return (
    <footer id="kontak" className="bg-emerald-950 text-slate-300 relative overflow-hidden pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-emerald-900">
      
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-700/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-10 sm:pb-12 border-b border-emerald-900/80 items-start">
          
          {/* 1. Brand & Mosque Info (col-span-4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <IrmasLogo size="md" showText={true} lightText={true} />

            <p className="text-xs text-slate-300 leading-relaxed text-justify sm:text-left">
              Ikatan Remaja Masjid (IRMAS) Masjid Jamie “Al-Ikhlas” berfungsi sebagai sarana pembinaan aqidah, akhlak, serta ukhuwah Islamiah pemuda di lingkungan Graha Bhakti Kodam Jaya & Cittavile, Jatibaru, Cikarang Timur.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-lg border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>AD/ART Periode {mosqueProfile.activePeriod}</span>
              </span>
            </div>
          </div>

          {/* 2. Navigation Quick Links (col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Menu Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('beranda')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left py-1 inline-block min-h-[32px]">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('profil', 'visi')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left py-1 inline-block min-h-[32px]">
                  Profil & Azas
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('profil', 'pengurus')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left py-1 inline-block min-h-[32px]">
                  Struktur BPH
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('profil', 'adart')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left py-1 inline-block min-h-[32px]">
                  Buku AD/ART
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('galeri')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left py-1 inline-block min-h-[32px]">
                  Galeri Kegiatan
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Address & Contact (col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Sekretariat</h4>
            
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{mosqueProfile.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{mosqueProfile.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{mosqueProfile.whatsapp}</span>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={mosqueProfile.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 font-semibold underline underline-offset-4 min-h-[36px]"
              >
                <span>Buka Google Maps</span>
              </a>
            </div>
          </div>

          {/* 4. Official Social Media Channels (col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Media Sosial Resmi</h4>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Klik logo atau nama kanal di bawah untuk langsung membuka media sosial IRMAS:
            </p>

            <div className="space-y-2 pt-1">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-800/80 bg-emerald-900/40 hover:bg-emerald-900/80 hover:border-emerald-700 transition-all duration-200 group hover:translate-x-1 shadow-xs min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.gradient} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {item.tag}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-slate-400 group-hover:text-emerald-300 transition-colors pl-2">
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} IRMAS Masjid Jamie “Al-Ikhlas” Jatibaru Cikarang Timur. Ditetapkan 20 Desember 2024.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-white transition-colors cursor-pointer bg-emerald-900/50 hover:bg-emerald-900 px-3.5 py-2 rounded-lg border border-emerald-800 text-xs min-h-[38px]"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </footer>
  );
};
