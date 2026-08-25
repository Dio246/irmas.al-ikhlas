import React, { useState } from 'react';
import { resolveAsset } from '../lib/assetHelper';

interface IrmasLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  lightText?: boolean;
}

export const IrmasLogo: React.FC<IrmasLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  lightText = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-28 h-28 sm:w-32 sm:h-32',
  };

  const badgeSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${badgeSizeClass} shrink-0 rounded-full overflow-hidden shadow-md group transition-transform hover:scale-105 bg-white`}>
        {!imageError ? (
          <img
            src={resolveAsset('/Logo.IRMAS.png')}
            alt="Logo Resmi IRMAS Masjid Jamie Al-Ikhlas Jatibaru"
            className="w-full h-full object-cover rounded-full"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-Definition Vector Recreation of IRMAS Al-Ikhlas Jatibaru Emblem */
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full rounded-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Circle */}
            <circle cx="120" cy="120" r="120" fill="#FFFFFF" />
            
            {/* Inner Green Dome Circle Background */}
            <circle cx="120" cy="98" r="68" fill="url(#greenSkyGrad)" />
            <defs>
              <linearGradient id="greenSkyGrad" x1="120" y1="30" x2="120" y2="166" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22C55E" />
                <stop offset="0.6" stopColor="#16A34A" />
                <stop offset="1" stopColor="#15803D" />
              </linearGradient>
            </defs>

            {/* Glowing Stars in Sky */}
            <circle cx="92" cy="62" r="2" fill="#FEF08A" />
            <circle cx="145" cy="56" r="1.5" fill="#FEF08A" />
            <circle cx="152" cy="74" r="1.5" fill="#FEF08A" />
            <circle cx="85" cy="80" r="1.5" fill="#FEF08A" />

            {/* Golden Crescent Moon */}
            <path
              d="M102 46C96 52 94 65 99 76C103 86 112 92 120 94C111 96 98 90 92 78C86 66 88 52 96 44C98 42 100 44 102 46Z"
              fill="#FEF08A"
              opacity="0.95"
            />

            {/* Mosque Minaret (Right Side) */}
            <rect x="136" y="60" width="10" height="42" rx="2" fill="#E2E8F0" stroke="#0F766E" strokeWidth="1" />
            <rect x="134" y="68" width="14" height="3" rx="1" fill="#047857" />
            <path d="M136 60L141 48L146 60H136Z" fill="#15803D" stroke="#FEF08A" strokeWidth="1" />
            <circle cx="141" cy="46" r="2" fill="#FBBF24" />

            {/* Main Mosque Dome */}
            <path
              d="M120 48C108 58 92 74 92 98H148C148 74 132 58 120 48Z"
              fill="#14532D"
              stroke="#86EFAC"
              strokeWidth="2"
            />
            {/* Secondary Dome Arch & Shading */}
            <path
              d="M120 54C112 62 100 75 100 96H140C140 75 128 62 120 54Z"
              fill="#166534"
            />
            {/* Crescent on top of Dome */}
            <circle cx="120" cy="45" r="3" fill="#FBBF24" />

            {/* Dome Windows / Pillars */}
            <rect x="108" y="84" width="4" height="12" rx="2" fill="#DCFCE7" />
            <rect x="118" y="82" width="4" height="14" rx="2" fill="#DCFCE7" />
            <rect x="128" y="84" width="4" height="12" rx="2" fill="#DCFCE7" />

            {/* Open Al-Qur'an Base */}
            {/* Left Page */}
            <path
              d="M120 134C104 122 72 124 54 135C66 148 94 148 120 144Z"
              fill="#FFFFFF"
              stroke="#047857"
              strokeWidth="2.5"
            />
            <path
              d="M120 138C106 128 78 130 62 140C72 150 96 150 120 147Z"
              fill="#F8FAFC"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Right Page */}
            <path
              d="M120 134C136 122 168 124 186 135C174 148 146 148 120 144Z"
              fill="#FFFFFF"
              stroke="#047857"
              strokeWidth="2.5"
            />
            <path
              d="M120 138C134 128 162 130 178 140C168 150 144 150 120 147Z"
              fill="#F8FAFC"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Book Spine / Binding */}
            <polygon points="117,133 123,133 122,150 118,150" fill="#047857" />

            {/* Organization Typography */}
            {/* IRMAS */}
            <text
              x="120"
              y="172"
              textAnchor="middle"
              fill="#14532D"
              fontSize="18"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="2.5"
            >
              IRMAS
            </text>

            {/* al-ikhlas */}
            <text
              x="120"
              y="196"
              textAnchor="middle"
              fill="#064E3B"
              fontSize="23"
              fontWeight="800"
              fontFamily="'Georgia', serif"
              fontStyle="normal"
              letterSpacing="0.5"
            >
              al-ikhlas
            </text>
          </svg>
        )}
      </div>

      {showText && (
        <div className="text-left flex flex-col justify-center">
          <span className={`text-xs sm:text-sm font-bold tracking-tight leading-tight ${lightText ? 'text-white' : 'text-slate-900'}`}>
            Ikatan Remaja Masjid
          </span>
          <span className={`text-xs sm:text-sm font-extrabold tracking-tight leading-tight ${lightText ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Masjid Jamie Al-Ikhlas
          </span>
          <p className={`text-[10px] sm:text-[11px] font-medium leading-tight mt-0.5 ${lightText ? 'text-emerald-200/70' : 'text-slate-500'}`}>
            Jatibaru, Cikarang Timur
          </p>
        </div>
      )}
    </div>
  );
};
