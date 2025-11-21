
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface Props {
  mode: ThemeMode;
}

export const Atmosphere: React.FC<Props> = ({ mode }) => {
  const [bgClass, setBgClass] = useState('bg-gray-900');
  const [isJummah, setIsJummah] = useState(false);

  useEffect(() => {
    const updateAtmosphere = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const friday = day === 5;
      setIsJummah(friday);

      if (mode === 'DAY') {
        // Professional Navy Day: "Ice & Navy"
        setBgClass(friday 
           ? 'bg-gradient-to-br from-[#fffdf0] via-[#fff8e0] to-[#fff0d0]' // Jummah Gold Day
           : 'bg-gradient-to-br from-[#f0f9ff] via-[#e6f2ff] to-[#dfeeff]' // Standard Ice
        );
        return;
      }
      if (mode === 'NIGHT') {
        // Midnight Void
        setBgClass(friday 
           ? 'bg-gradient-to-br from-[#1a1500] via-[#2e2500] to-[#423500]' // Jummah Gold Night
           : 'bg-gradient-to-br from-[#000000] via-[#020617] to-[#0f172a]'
        );
        return;
      }

      // AUTO MODE
      if (hour >= 4 && hour < 7) {
        // Fajr
        setBgClass('bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]');
      } else if (hour >= 7 && hour < 18) {
        // Day
        setBgClass(friday 
           ? 'bg-gradient-to-br from-[#fffdf0] via-[#fff8e0] to-[#fff0d0]' 
           : 'bg-gradient-to-br from-[#f0f9ff] via-[#e6f2ff] to-[#dfeeff]'
        );
      } else if (hour >= 18 && hour < 20) {
        // Maghrib
        setBgClass('bg-gradient-to-br from-[#271a10] via-[#7c2d12] to-[#4c0519]');
      } else {
        // Night
        setBgClass(friday 
           ? 'bg-gradient-to-br from-[#1a1500] via-[#2e2500] to-[#423500]'
           : 'bg-gradient-to-br from-[#000000] via-[#020617] to-[#0f172a]'
        );
      }
    };

    updateAtmosphere();
    if (mode === 'AUTO') {
      const interval = setInterval(updateAtmosphere, 60000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <div className={`fixed inset-0 -z-50 transition-all duration-[1500ms] ease-in-out ${bgClass}`}>
      {/* Enhanced Noise Texture */}
      <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none ${mode === 'DAY' ? 'opacity-5' : 'opacity-30'}`}></div>

      {/* Ambient Orbs - Gold for Jummah */}
      <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse-slow transition-all duration-1000 ${isJummah ? 'bg-yellow-500/20' : 'bg-blue-500/20'} ${mode === 'DAY' ? 'opacity-5' : 'opacity-100'}`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] animate-float transition-all duration-1000 ${isJummah ? 'bg-amber-600/10' : 'bg-indigo-600/10'} ${mode === 'DAY' ? 'opacity-10' : 'opacity-100'}`} />
    </div>
  );
};
