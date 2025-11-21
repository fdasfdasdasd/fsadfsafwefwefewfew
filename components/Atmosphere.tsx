
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface Props {
  mode: ThemeMode;
}

export const Atmosphere: React.FC<Props> = ({ mode }) => {
  const [gradients, setGradients] = useState({
    bg: 'bg-black',
    orb1: 'bg-blue-500',
    orb2: 'bg-purple-500',
    orb3: 'bg-emerald-500'
  });

  useEffect(() => {
    const updateAtmosphere = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const isFriday = day === 5;

      if (mode === 'DAY') {
         // Premium Day: Ice White / Soft Blue / Gold
         setGradients({
           bg: 'bg-[#f8fafc]',
           orb1: isFriday ? 'bg-amber-200' : 'bg-blue-200',
           orb2: 'bg-indigo-100',
           orb3: 'bg-cyan-100'
         });
         return;
      }
      
      if (mode === 'NIGHT') {
         // Premium Night: Deep Void / Purple / Emerald
         setGradients({
           bg: 'bg-[#020617]',
           orb1: isFriday ? 'bg-amber-900' : 'bg-indigo-900',
           orb2: 'bg-slate-900',
           orb3: 'bg-emerald-900'
         });
         return;
      }

      // Auto Mode Logic
      if (hour >= 5 && hour < 18) {
         // Day Auto
         setGradients({
           bg: 'bg-[#f8fafc]',
           orb1: isFriday ? 'bg-amber-200' : 'bg-sky-200',
           orb2: 'bg-indigo-100',
           orb3: 'bg-slate-100'
         });
      } else {
         // Night Auto
         setGradients({
           bg: 'bg-[#000000]',
           orb1: isFriday ? 'bg-amber-800/40' : 'bg-indigo-900/40',
           orb2: 'bg-violet-900/30',
           orb3: 'bg-emerald-900/20'
         });
      }
    };

    updateAtmosphere();
    if (mode === 'AUTO') {
      const i = setInterval(updateAtmosphere, 60000);
      return () => clearInterval(i);
    }
  }, [mode]);

  return (
    <div className={`fixed inset-0 -z-50 transition-colors duration-[2000ms] ease-in-out overflow-hidden ${gradients.bg}`}>
      {/* Mesh Gradient Orbs */}
      <div className={`absolute top-[-20%] left-[-10%] w-[80vh] h-[80vh] rounded-full blur-[120px] opacity-40 animate-float ${gradients.orb1} transition-colors duration-[2000ms]`} />
      
      <div className={`absolute bottom-[-10%] right-[-20%] w-[70vh] h-[70vh] rounded-full blur-[100px] opacity-30 animate-pulse-slow ${gradients.orb2} transition-colors duration-[2000ms]`} style={{ animationDelay: '1s' }} />
      
      <div className={`absolute top-[40%] left-[30%] w-[50vh] h-[50vh] rounded-full blur-[90px] opacity-20 animate-float ${gradients.orb3} transition-colors duration-[2000ms]`} style={{ animationDelay: '2s' }} />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};
