import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfileSection } from './components/ProfileSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { GalleryItem } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [profileTab, setProfileTab] = useState<'profil' | 'visi' | 'pengurus' | 'adart'>('profil');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  // Monitor active scroll section for active navbar link highlight using lightweight IntersectionObserver
  useEffect(() => {
    const sections = ['beranda', 'profil', 'galeri', 'kontak'];
    const elements = sections
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
      }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string, tab?: 'profil' | 'visi' | 'pengurus' | 'adart') => {
    setActiveSection(id);
    if (tab) {
      setProfileTab(tab);
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* 1. Header Navigation Bar */}
      <Navbar 
        activeSection={activeSection}
        activeProfileTab={profileTab}
        onNavigate={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 2. Hero Overview & Logo Showcase */}
        <Hero 
          onExploreProfile={() => scrollToSection('profil', 'profil')}
          onExploreAdArt={() => scrollToSection('profil', 'adart')}
          onExploreGallery={() => scrollToSection('galeri')}
        />

        {/* 3. Profil & Landasan IRMAS (Buku AD/ART, Azas, Tujuan, Pengurus) */}
        <ProfileSection 
          activeTab={profileTab}
          onTabChange={(t) => setProfileTab(t)}
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
