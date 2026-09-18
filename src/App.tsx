import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfileSection } from './components/ProfileSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { GalleryItem } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [profileTab, setProfileTab] = useState<'profil' | 'visi' | 'adart' | 'pengurus'>('profil');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  // Navigation lock ref to completely avoid glitching/flickering during smooth scroll
  const isNavigatingRef = useRef<boolean>(false);
  const targetYRef = useRef<number>(0);
  const navLockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserInteractedRef = useRef<boolean>(false);

  const unlockNavigation = () => {
    isNavigatingRef.current = false;
    if (navLockTimerRef.current) {
      clearTimeout(navLockTimerRef.current);
      navLockTimerRef.current = null;
    }
    if (scrollDebounceTimerRef.current) {
      clearTimeout(scrollDebounceTimerRef.current);
      scrollDebounceTimerRef.current = null;
    }
  };

  // Smooth, deterministic scroll position tracker for manual user scroll
  useEffect(() => {
    // If the user manually touches the screen or scrolls the mouse wheel, immediately yield control
    const handleManualInteraction = () => {
      if (isNavigatingRef.current) {
        unlockNavigation();
      }
      hasUserInteractedRef.current = true;
    };

    window.addEventListener('wheel', handleManualInteraction, { passive: true });
    window.addEventListener('touchstart', handleManualInteraction, { passive: true });

    const handleScroll = () => {
      // 1. If programmatic navigation is running, do NOT switch active section
      if (isNavigatingRef.current) {
        // Arrived at destination within 12px
        if (Math.abs(window.scrollY - targetYRef.current) <= 12) {
          unlockNavigation();
          return;
        }

        // Debounce: unlock when scroll stops firing for 100ms
        if (scrollDebounceTimerRef.current) {
          clearTimeout(scrollDebounceTimerRef.current);
        }
        scrollDebounceTimerRef.current = setTimeout(() => {
          unlockNavigation();
        }, 100);

        return;
      }

      // 2. Manual scroll spy logic
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // At top of page
      if (scrollY < 120) {
        if (hasUserInteractedRef.current) {
          setActiveSection('beranda');
        } else {
          setActiveSection('');
        }
        return;
      }

      hasUserInteractedRef.current = true;

      // Bottom of page -> Kontak
      if (scrollY + windowHeight >= fullHeight - 50) {
        setActiveSection('kontak');
        return;
      }

      // Check sections based on fixed reading offset line (70px navbar + 50px offset = 120px)
      const readingLine = 120;
      const kontakEl = document.getElementById('kontak');
      const galeriEl = document.getElementById('galeri');
      const profilEl = document.getElementById('profil');

      if (kontakEl && kontakEl.getBoundingClientRect().top <= readingLine) {
        setActiveSection('kontak');
        return;
      }

      if (galeriEl) {
        const rect = galeriEl.getBoundingClientRect();
        if (rect.top <= readingLine && rect.bottom > readingLine) {
          setActiveSection('galeri');
          return;
        }
      }

      if (profilEl) {
        const rect = profilEl.getBoundingClientRect();
        if (rect.top <= readingLine && rect.bottom > readingLine) {
          setActiveSection('profil');
          return;
        }
        if (rect.top > readingLine) {
          setActiveSection('beranda');
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleManualInteraction);
      window.removeEventListener('touchstart', handleManualInteraction);
      if (navLockTimerRef.current) clearTimeout(navLockTimerRef.current);
      if (scrollDebounceTimerRef.current) clearTimeout(scrollDebounceTimerRef.current);
    };
  }, []);

  const scrollToSection = (id: string, tab?: 'profil' | 'visi' | 'adart' | 'pengurus') => {
    hasUserInteractedRef.current = true;

    // 1. Lock scroll spy to eliminate any flickering/glitch during smooth transition
    unlockNavigation();
    isNavigatingRef.current = true;

    // 2. Target ID and active section mapping
    const resolvedSection = id === 'pengurus' ? 'profil' : id;
    setActiveSection(resolvedSection);

    // 3. Tab state management
    if (id === 'pengurus') {
      setProfileTab('pengurus');
    } else if (id === 'profil') {
      if (tab) {
        setProfileTab(tab);
      }
    } else if (tab) {
      setProfileTab(tab);
    }

    // 4. Scroll destination calculation
    let targetY = 0;
    if (id === 'beranda') {
      targetY = 0;
    } else {
      const targetId = id === 'pengurus' ? 'profil' : id;
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 68;
        targetY = Math.max(0, element.getBoundingClientRect().top + window.scrollY - navHeight);
      }
    }

    targetYRef.current = targetY;

    // 5. Scroll smoothly
    window.scrollTo({ top: targetY, behavior: 'smooth' });

    // 6. Failsafe unlock timeout (in case scrollend does not trigger)
    navLockTimerRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1100);
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
