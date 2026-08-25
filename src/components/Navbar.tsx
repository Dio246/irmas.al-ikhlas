import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Image as ImageIcon, BookOpen, UserCheck, PhoneCall, ChevronRight } from 'lucide-react';
import { IrmasLogo } from './IrmasLogo';

interface NavbarProps {
  activeSection: string;
  onNavigate?: (id: string, tab?: 'profil' | 'visi' | 'pengurus' | 'adart') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: string; label: string; tab?: 'profil' | 'visi' | 'pengurus' | 'adart'; icon: typeof BookOpen }[] = [
    { id: 'beranda', label: 'Beranda', icon: BookOpen },
    { id: 'profil', label: 'Profil & Visi', tab: 'profil', icon: Users },
    { id: 'profil', label: 'Pengurus', tab: 'pengurus', icon: UserCheck },
    { id: 'galeri', label: 'Galeri Kegiatan', icon: ImageIcon },
    { id: 'kontak', label: 'Kontak', icon: PhoneCall },
  ];

  const handleNavClick = (id: string, tab?: 'profil' | 'visi' | 'pengurus' | 'adart') => {
    setMobileMenuOpen(false);
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

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-emerald-100' 
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a 
            id="brand-logo"
            href="#beranda" 
            onClick={(e) => { e.preventDefault(); handleNavClick('beranda'); }}
            className="flex items-center gap-2 group text-left cursor-pointer min-w-0 max-w-[78%] sm:max-w-none"
          >
            <IrmasLogo size="sm" showText={true} />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={`${item.id}-${item.tab || idx}`}
                  id={`nav-btn-${item.id}-${item.tab || idx}`}
                  onClick={() => handleNavClick(item.id, item.tab)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' 
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
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
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white border-b border-emerald-100 px-4 pt-3 pb-6 shadow-xl transition-all">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={`m-${item.id}-${item.tab || idx}`}
                  id={`mobile-nav-${item.id}-${item.tab || idx}`}
                  onClick={() => handleNavClick(item.id, item.tab)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-sm font-medium cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-700 text-white font-semibold shadow-xs' 
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
