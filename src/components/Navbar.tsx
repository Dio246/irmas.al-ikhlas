import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Image as ImageIcon, Home, PhoneCall, ChevronRight } from 'lucide-react';
import { IrmasLogo } from './IrmasLogo';

interface NavbarProps {
  activeSection: string;
  onNavigate?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'profil', label: 'Profil & Visi', icon: Users },
    { id: 'galeri', label: 'Galeri Kegiatan', icon: ImageIcon },
    { id: 'kontak', label: 'Kontak', icon: PhoneCall },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const y = Math.max(0, element.getBoundingClientRect().top + window.scrollY - 68);
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <header 
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            
            {/* Logo & Brand */}
            <a 
              id="brand-logo"
              href="#beranda" 
              onClick={(e) => { e.preventDefault(); handleNavClick('beranda'); }}
              className="flex items-center gap-2 text-left cursor-pointer min-w-0 max-w-[78%] sm:max-w-none select-none"
            >
              <IrmasLogo size="sm" showText={true} />
            </a>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={`nav-${item.id}`}
                    id={`nav-btn-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer border ${
                      isActive 
                        ? 'text-emerald-800 bg-emerald-50 border-emerald-200/80 shadow-2xs' 
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/70 border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Contact Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => handleNavClick('kontak')}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors duration-150 cursor-pointer active:scale-95 border border-emerald-700"
              >
                <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                <span>Hubungi Kami</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center md:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-700" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white/98 backdrop-blur-md border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl transition-all">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={`m-${item.id}`}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-sm font-medium cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-700 text-white font-semibold shadow-xs' 
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
