import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfileSection } from './components/ProfileSection';
import { PengurusSection } from './components/PengurusSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { GalleryItem } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [profileTab, setProfileTab] = useState<'profil' | 'visi' | 'adart'>('profil');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  // Navigation lock ref to completely avoid glitching/flickering during smooth scroll
  const isNavigatingRef = useRef<boolean>(false);
  const navLockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth, deterministic scroll position tracker for manual user scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isNavigatingRef.current) {
            ticking = false;
            return;
          }

          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const fullHeight = document.documentElement.scrollHeight;

          // 1. Top of page -> Beranda
          if (scrollY < 100) {
            setActiveSection('beranda');
            ticking = false;
            return;
          }

          // 2. Bottom of page -> Kontak
          if (scrollY + windowHeight >= fullHeight - 60) {
            setActiveSection('kontak');
            ticking = false;
            return;
          }

          // 3. Check sections in reverse order from bottom to top
          const sections = ['kontak', 'galeri', 'pengurus', 'profil'];
          for (const secId of sections) {
            const el = document.getElementById(secId);
            if (el) {
              const top = el.getBoundingClientRect().top;
              if (top <= 140) {
                setActiveSection(secId);
                ticking = false;
                return;
              }
            }
          }

          setActiveSection('beranda');
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (navLockTimerRef.current) {
        clearTimeout(navLockTimerRef.current);
      }
    };
  }, []);

  const scrollToSection = (id: string, tab?: 'profil' | 'visi' | 'adart') => {
    // 1. Lock scroll spy to eliminate any flickering/glitch
    if (navLockTimerRef.current) {
      clearTimeout(navLockTimerRef.current);
    }
    isNavigatingRef.current = true;

    // 2. Immediately reflect active button in UI
    setActiveSection(id);
    if (tab) {
      setProfileTab(tab);
    }

    // 3. Scroll to target smoothly
    if (id === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navHeight = 74;
        const targetY = Math.max(0, element.getBoundingClientRect().top + window.scrollY - navHeight);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }

    // 4. Release navigation lock when smooth scrolling finishes
    const unlockNavigation = () => {
      isNavigatingRef.current = false;
      window.removeEventListener('scrollend', unlockNavigation);
    };

    window.addEventListener('scrollend', unlockNavigation, { once: true });
    navLockTimerRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 850);
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
          onExplorePengurus={() => scrollToSection('pengurus')}
          onExploreAdArt={() => scrollToSection('profil', 'adart')}
          onExploreGallery={() => scrollToSection('galeri')}
        />

        {/* 3. Profil & Landasan IRMAS (Buku AD/ART, Azas, Tujuan) */}
        <ProfileSection 
          activeTab={profileTab}
          onTabChange={(t) => setProfileTab(t)}
          onNavigateToPengurus={() => scrollToSection('pengurus')}
        />

        {/* 4. Struktur Kepengurusan DKM & BPH IRMAS */}
        <PengurusSection />

        {/* 5. Galeri Dokumentasi Kegiatan */}
        <GallerySection 
          onSelectImage={(item, photoIndex = 0) => {
            setSelectedGalleryItem(item);
            setSelectedPhotoIndex(photoIndex);
          }}
        />

      </main>

      {/* 6. Footer & Kontak */}
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
