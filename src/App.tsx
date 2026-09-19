import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfileSection } from './components/ProfileSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { GalleryItem } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [profileTab, setProfileTab] = useState<'profil' | 'visi' | 'adart' | 'pengurus'>('profil');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  // Timestamp lock to prevent any intermediate menu flickering during programmatic smooth scrolling
  const navLockUntilRef = useRef<number>(0);

  // Deterministic scroll spy for manual scrolling
  useEffect(() => {
    const handleScroll = () => {
      // If within programmatic scroll lock window, do not modify active menu
      if (Date.now() < navLockUntilRef.current) {
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // 1. Top of page
      if (scrollY < 120) {
        setActiveSection('beranda');
        return;
      }

      // 2. Near bottom of page
      if (scrollY + windowHeight >= fullHeight - 80) {
        setActiveSection('kontak');
        return;
      }

      // 3. Determine active section smoothly from bottom to top
      const offsetThreshold = 110;
      const kontakEl = document.getElementById('kontak');
      const galeriEl = document.getElementById('galeri');
      const profilEl = document.getElementById('profil');

      if (kontakEl && kontakEl.getBoundingClientRect().top <= offsetThreshold + 50) {
        setActiveSection('kontak');
        return;
      }

      if (galeriEl && galeriEl.getBoundingClientRect().top <= offsetThreshold) {
        setActiveSection('galeri');
        return;
      }

      if (profilEl && profilEl.getBoundingClientRect().top <= offsetThreshold) {
        setActiveSection('profil');
        return;
      }

      setActiveSection('beranda');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string, tab?: 'profil' | 'visi' | 'adart' | 'pengurus') => {
    // 1. Target ID and active section mapping
    const resolvedSection = id === 'pengurus' ? 'profil' : id;
    setActiveSection(resolvedSection);

    // 2. Lock scroll spy for 950ms during smooth scroll
    navLockUntilRef.current = Date.now() + 950;

    // 3. Handle tab selection if applicable
    if (id === 'pengurus') {
      setProfileTab('pengurus');
    } else if (id === 'profil') {
      if (tab) {
        setProfileTab(tab);
      }
    } else if (tab) {
      setProfileTab(tab);
    }

    // 4. Calculate exact destination
    let targetY = 0;
    if (id === 'beranda') {
      targetY = 0;
    } else {
      const targetId = id === 'pengurus' ? 'profil' : id;
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 64;
        const rect = element.getBoundingClientRect();
        targetY = Math.max(0, Math.round(rect.top + window.scrollY - navHeight));
      }
    }

    // 5. Scroll smoothly to target
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* 1. Header Navigation Bar */}
      <Navbar 
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 2. Hero Overview & Logo Showcase */}
        <Hero 
          onExploreProfile={() => scrollToSection('profil', 'profil')}
          onExploreGallery={() => scrollToSection('galeri')}
        />

        {/* 3. Profil & Landasan IRMAS (Tentang IRMAS, Azas & Tujuan, AD/ART, Pengurus) */}
        <ProfileSection 
          activeTab={profileTab}
          onTabChange={(t) => {
            setProfileTab(t);
            setActiveSection('profil');
          }}
          onNavigateToPengurus={() => scrollToSection('pengurus', 'pengurus')}
        />

        {/* 4. Galeri Dokumentasi Kegiatan */}
        <GallerySection 
          onSelectImage={(item, photoIndex = 0) => {
            setSelectedGalleryItem(item);
            setSelectedPhotoIndex(photoIndex);
          }}
        />

      </main>

      {/* 5. Footer & Kontak */}
      <Footer onNavigate={scrollToSection} />

      {/* Lightbox Modal for Gallery Image Details */}
      <LightboxModal 
        item={selectedGalleryItem}
        initialIndex={selectedPhotoIndex}
        onClose={() => setSelectedGalleryItem(null)}
      />

    </div>
  );
}
