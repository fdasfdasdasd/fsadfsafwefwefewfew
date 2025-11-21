import * as React from 'react';
import { useEffect, useState } from 'react';

export const Atmosphere: React.FC = () => {
  const [bgClass, setBgClass] = useState('bg-gray-900');

  useEffect(() => {
    const updateAtmosphere = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 7) {
        // Fajr - Spiritual Deep Purple/Indigo
        setBgClass('bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]');
      } else if (hour >= 7 && hour < 16) {
        // Day - Professional Navy/Blue (Not too bright)
        setBgClass('bg-gradient-to-br from-[#020617] via-[#0c4a6e] to-[#0369a1]');
      } else if (hour >= 16 && hour < 19) {
        // Maghrib - Sunset Vibes (Deep Amber/Purple)
        setBgClass('bg-gradient-to-br from-[#271a10] via-[#7c2d12] to-[#4c0519]');
      } else {
        // Night - Midnight Void
        setBgClass('bg-gradient-to-br from-[#000000] via-[#020617] to-[#0f172a]');
      }
    };

    updateAtmosphere();
    const interval = setInterval(updateAtmosphere, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 -z-50 transition-all duration-[3000ms] ease-in-out ${bgClass}`}>
      {/* Enhanced Noise Texture for "Film Grain" look */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none"></div>

      {/* Floating Orbs - Slower, more majestic animation */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] animate-pulse delay-1000" />
    </div>
  );
};