
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface Props {
  mode: ThemeMode;
}

export const Atmosphere: React.FC<Props> = ({ mode }) => {
  const [bgClass, setBgClass] = useState('bg-gray-900');

  useEffect(() => {
    const updateAtmosphere = () => {
      if (mode === 'DAY') {
        // Professional Executive Day: Soft Slate/White/Blue-Grey
        setBgClass('bg-gradient-to-br from-slate-50 via-white to-blue-50');
        return;
      }
      if (mode === 'NIGHT') {
        // Midnight Void
        setBgClass('bg-gradient-to-br from-[#000000] via-[#020617] to-[#0f172a]');
        return;
      }

      // AUTO MODE
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 7) {
        // Fajr - Spiritual Deep Purple/Indigo
        setBgClass('bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]');
      } else if (hour >= 7 && hour < 18) {
        // Day - Professional Executive
        setBgClass('bg-gradient-to-br from-slate-50 via-white to-blue-50');
      } else if (hour >= 18 && hour < 20) {
        // Maghrib - Sunset Vibes
        setBgClass('bg-gradient-to-br from-[#271a10] via-[#7c2d12] to-[#4c0519]');
      } else {
        // Night - Midnight Void
        setBgClass('bg-gradient-to-br from-[#000000] via-[#020617] to-[#0f172a]');
      }
    };

    updateAtmosphere();
    // Update every minute only if in AUTO
    if (mode === 'AUTO') {
      const interval = setInterval(updateAtmosphere, 60000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <div className={`fixed inset-0 -z-50 transition-all duration-[1500ms] ease-in-out ${bgClass}`}>
      {/* Enhanced Noise Texture - lighter in Day mode */}
      <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none ${mode === 'DAY' ? 'opacity-20' : 'opacity-30'}`}></div>

      {/* Floating Orbs */}
      <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow transition-opacity duration-1000 ${mode === 'DAY' ? 'opacity-20' : 'opacity-100'}`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-float transition-opacity duration-1000 ${mode === 'DAY' ? 'opacity-30' : 'opacity-100'}`} />
    </div>
  );
};
