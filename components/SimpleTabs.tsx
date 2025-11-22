
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AppState, SubView, DailyStats, Friend, ThemeMode } from '../types';
import { FITNESS_SCHEDULE, MEMORIZE_CONTENT, PARAH_NAMES, MASTER_ACHIEVEMENTS, getGrowthStage } from '../constants';
import { Check, Droplets, RotateCcw, Cigarette, ShieldAlert, CheckCircle2, ChevronLeft, BarChart2, Trophy, Dumbbell, Brain, Activity, Users, UserPlus, Radio, Cloud, Download, Upload, Smartphone, Moon, Sun, Monitor, LogOut, HeartHandshake, ShieldCheck, BookOpen, Tent, Calendar, Flame, Plus, Minus, Zap, Maximize2, X, ShoppingBag, Snowflake, AlertTriangle, Star, Scan, Trash2 } from 'lucide-react';
import { LineChart, BarChart } from './Charts';

// Robust Theme Mapping
const THEME_STYLES: Record<string, any> = {
  amber: { color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-amber-500', bgSoft: 'bg-amber-500/10', gradient: 'from-amber-500/10', fill: 'fill-amber-500', stroke: 'stroke-amber-500' },
  cyan: { color: 'text-cyan-500', border: 'border-cyan-500/20', bg: 'bg-cyan-500', bgSoft: 'bg-cyan-500/10', gradient: 'from-cyan-500/10', fill: 'fill-cyan-500', stroke: 'stroke-cyan-500' },
  purple: { color: 'text-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-500', bgSoft: 'bg-purple-500/10', gradient: 'from-purple-500/10', fill: 'fill-purple-500', stroke: 'stroke-purple-500' },
  rose: { color: 'text-rose-500', border: 'border-rose-500/20', bg: 'bg-rose-500', bgSoft: 'bg-rose-500/10', gradient: 'from-rose-500/10', fill: 'fill-rose-500', stroke: 'stroke-rose-500' },
  orange: { color: 'text-orange-500', border: 'border-orange-500/20', bg: 'bg-orange-500', bgSoft: 'bg-orange-500/10', gradient: 'from-orange-500/10', fill: 'fill-orange-500', stroke: 'stroke-orange-500' },
  pink: { color: 'text-pink-500', border: 'border-pink-500/20', bg: 'bg-pink-500', bgSoft: 'bg-pink-500/10', gradient: 'from-pink-500/10', fill: 'fill-pink-500', stroke: 'stroke-pink-500' },
  emerald: { color: 'text-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500', bgSoft: 'bg-emerald-500/10', gradient: 'from-emerald-500/10', fill: 'fill-emerald-500', stroke: 'stroke-emerald-500' },
  blue: { color: 'text-blue-500', border: 'border-blue-500/20', bg: 'bg-blue-500', bgSoft: 'bg-blue-500/10', gradient: 'from-blue-500/10', fill: 'fill-blue-500', stroke: 'stroke-blue-500' },
  gray: { color: 'text-gray-500', border: 'border-gray-500/20', bg: 'bg-gray-500', bgSoft: 'bg-gray-500/10', gradient: 'from-gray-500/10', fill: 'fill-gray-500', stroke: 'stroke-gray-500' },
  teal: { color: 'text-teal-500', border: 'border-teal-500/20', bg: 'bg-teal-500', bgSoft: 'bg-teal-500/10', gradient: 'from-teal-500/10', fill: 'fill-teal-500', stroke: 'stroke-teal-500' },
};

// --- VISUAL ASSETS GENERATOR ---
export const TabVisuals: React.FC<{ type: string }> = ({ type }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* === RAMADAN: Floating Lanterns & Moon === */}
      {type === 'RAMADAN' && (
        <>
          <div className="absolute top-[-10%] right-[10%] text-amber-500/10 animate-float" style={{ animationDuration: '18s' }}><Tent size={140} /></div>
          <div className="absolute top-[20%] left-[5%] text-amber-500/5 animate-float" style={{ animationDuration: '25s', animationDelay: '2s' }}><Moon size={80} /></div>
          {[...Array(6)].map((_, i) => (
             <div key={i} className="absolute top-[-20px] w-[2px] h-40 bg-gradient-to-b from-amber-500/20 to-transparent flex flex-col items-center animate-pulse-slow" 
                  style={{ 
                      left: `${10 + i * 16}%`, 
                      animationDelay: `${i * 1.5}s`, 
                      transform: `translateY(${Math.sin(i)*15}px)` 
                  }}>
                 <div className="w-6 h-8 border border-amber-500/30 rounded-b-lg bg-amber-500/10 mt-auto shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-float" style={{ animationDuration: `${5 + i}s` }} />
             </div>
          ))}
        </>
      )}

      {/* === SALAH: Clouds & Stars === */}
      {type === 'SALAH' && (
        <>
           <div className="absolute top-10 right-10 text-emerald-500/10 animate-float" style={{ animationDuration: '20s' }}><Moon size={100} /></div>
           <div className="absolute top-40 left-[-10%] text-emerald-500/5 animate-float" style={{ animationDuration: '30s' }}><Cloud size={150} /></div>
           {[...Array(15)].map((_, i) => (
              <div key={i} className="absolute text-emerald-200/20 animate-pulse-slow" 
                   style={{ 
                      top: Math.random() * 60 + '%', 
                      left: Math.random() * 100 + '%', 
                      animationDelay: Math.random() + 's',
                      transform: `scale(${Math.random() + 0.5})`
                   }}>
                  <Star size={Math.random() * 10 + 5} fill="currentColor" />
              </div>
           ))}
        </>
      )}

      {/* === HYGIENE: Rising Bubbles === */}
      {type === 'HYGIENE' && (
        <>
           {[...Array(15)].map((_, i) => (
             <div key={i} className="absolute rounded-full border border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_10px_rgba(34,211,238,0.1)]" 
                  style={{ 
                    width: Math.random() * 40 + 10 + 'px', 
                    height: Math.random() * 40 + 10 + 'px', 
                    left: Math.random() * 100 + '%', 
                    bottom: -60 + 'px',
                    animation: `float ${Math.random() * 15 + 15}s linear infinite`, // Slower
                    animationDelay: Math.random() * 10 + 's'
                  }} 
             />
           ))}
           <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cyan-900/20 to-transparent animate-pulse-slow" />
        </>
      )}

      {/* === QURAN: Rotating Geometry === */}
      {type === 'QURAN' && (
        <>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>
           <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] border-2 border-purple-500/5 rounded-full border-dashed animate-[spin_120s_linear_infinite]"></div>
           <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] border-2 border-purple-500/5 rounded-full border-dotted animate-[spin_100s_linear_infinite_reverse]"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
                <div className="w-60 h-60 border border-purple-500/20 rotate-45 animate-pulse-slow"></div>
                <div className="w-60 h-60 border border-purple-500/20 rotate-12 absolute top-0 left-0 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
           </div>
        </>
      )}

      {/* === FITNESS: Pulse & Energy === */}
      {type === 'FITNESS' && (
         <>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent animate-[pulse_6s_ease-in-out_infinite]"></div>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500/30 to-transparent animate-slide-up"
                     style={{ top: `${30 + i * 20}%`, animationDuration: `${5 + i}s` }} />
            ))}
         </>
      )}

      {/* === DHIKR: Floating Beads === */}
      {type === 'DHIKR' && (
          <>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-4 h-4 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm shadow-sm"
                   style={{ 
                      top: (Math.sin(i / 3) * 30 + 50) + '%', 
                      left: (i * 5) + '%', 
                      animation: `float ${10 + i % 4}s ease-in-out infinite`, 
                      animationDelay: `${i * 0.5}s` 
                   }}
              />
            ))}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
          </>
      )}
      
      {/* === MDF: Security Scan === */}
      {type === 'MDF' && (
         <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(244,63,94,0.05),transparent_70%)] animate-pulse-slow"></div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-[slideUp_8s_linear_infinite]"></div>
            {[...Array(5)].map((_, i) => (
               <div key={i} className="absolute text-rose-500/5 animate-float" 
                    style={{ left: Math.random()*80 + 10 + '%', top: Math.random()*80 + 10 + '%', animationDuration: Math.random()*5 + 10 + 's' }}>
                  <ShieldCheck size={Math.random()*40 + 20} />
               </div>
            ))}
         </>
      )}

      {/* === SOCIAL === */}
      {type === 'SOCIAL' && (
        <>
           {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-blue-500/5 animate-pulse-slow" style={{ width: Math.random()*50+'px', height: Math.random()*50+'px', left: Math.random()*100+'%', top: Math.random()*100+'%', animationDelay: i+'s' }} />
           ))}
        </>
      )}

      {/* === SETTINGS === */}
      {type === 'SETTINGS' && (
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      )}
    </div>
  );
};

// --- SHARED LAYOUT ---
const TabWrapper: React.FC<{ children: React.ReactNode; subView?: SubView; setSubView?: any; themeColor: string; visualType?: any }> = ({ children, subView, setSubView, themeColor, visualType }) => {
  const theme = THEME_STYLES[themeColor] || THEME_STYLES['emerald'];
  
  return (
    <div className="pb-32 animate-fade-in px-2 relative min-h-screen overflow-hidden">
       {/* Professional Ambient Backlight */}
       <div className={`absolute top-0 left-0 right-0 h-[35rem] pointer-events-none rounded-b-[4rem] bg-gradient-to-b ${theme.gradient} via-transparent to-transparent transition-all duration-1000 opacity-60`} />
       
       {/* Custom Animated Visuals */}
       {visualType && <TabVisuals type={visualType} />}

       {setSubView && (
        <div className="flex items-center justify-center pt-4 mb-6 relative z-10">
            <div className="flex bg-white/50 dark:bg-black/40 rounded-full p-1 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-sm">
                <button onClick={() => setSubView('DAILY')} className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${subView === 'DAILY' ? 'bg-white text-black shadow-lg transform scale-105' : 'text-secondary hover:text-primary'}`}>Daily</button>
                <button onClick={() => setSubView('STATS')} className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${subView === 'STATS' ? 'bg-white text-black shadow-lg transform scale-105' : 'text-secondary hover:text-primary'}`}>Stats</button>
                <button onClick={() => setSubView('AWARDS')} className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${subView === 'AWARDS' ? 'bg-white text-black shadow-lg transform scale-105' : 'text-secondary hover:text-primary'}`}>Awards</button>
            </div>
        </div>
       )}
       <div className="animate-slide-up relative z-10">
          {children}
       </div>
    </div>
  );
};

// Enhanced Modern Growth Card with Colored Circular Progress
const GrowthCard: React.FC<{ stage: { icon: string, label: string }, streak: number, color: string }> = ({ stage, streak, color }) => {
  const theme = THEME_STYLES[color] || THEME_STYLES['emerald'];
  const percentage = Math.min(100, (streak / (stage.label === 'Forest' ? 100 : 30)) * 100);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`glass-panel p-0 rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden ${theme.border} shadow-xl mb-6 group transition-transform hover:scale-[1.01]`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} to-transparent opacity-30`}></div>
      
      <div className="relative z-10 py-10 w-full flex flex-col items-center">
          {/* Circular Progress Engine */}
          <div className="relative w-40 h-40 mb-6">
              {/* Outer Glow */}
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${theme.bg}`}></div>
              
              <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                  {/* Track */}
                  <circle cx="50%" cy="50%" r={radius} className="stroke-white/10 fill-transparent" strokeWidth="4" />
                  {/* Progress - USES THEME COLOR */}
                  <circle 
                    cx="50%" cy="50%" r={radius} 
                    className={`transition-all duration-1000 ease-out ${theme.stroke}`} 
                    strokeWidth="8" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset} 
                    strokeLinecap="round"
                  />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl mb-1 animate-float drop-shadow-md">{stage.icon}</div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${theme.color}`}>{stage.label}</div>
              </div>
          </div>

          <h3 className="text-5xl font-light mb-1 tracking-tighter text-primary flex items-baseline gap-2">
             {streak} <span className="text-sm font-normal opacity-50 uppercase tracking-widest">Days</span>
          </h3>
      </div>
    </div>
  );
};

const AwardsView: React.FC<{ category: string; unlocked: string[] }> = ({ category, unlocked }) => {
  const list = MASTER_ACHIEVEMENTS.filter(a => a.category === category);
  return (
    <div className="space-y-3 pt-2">
      {list.map((ach, i) => {
        const isUnlocked = unlocked.includes(ach.id);
        return (
          <div key={ach.id} className={`p-5 rounded-3xl border flex items-center gap-4 transition-all duration-500 ${isUnlocked ? 'glass-panel border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'glass-panel opacity-50 grayscale'}`} style={{ animationDelay: `${i * 50}ms` }}>
             <div className={`text-2xl w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${isUnlocked ? 'animate-bounce' : ''}`}>{ach.icon}</div>
             <div className="flex-1">
                <div className="flex justify-between items-start">
                   <h4 className={`font-bold text-sm ${isUnlocked ? 'text-primary' : 'text-gray-500'}`}>{ach.title}</h4>
                   {isUnlocked && <div className="bg-emerald-500/20 p-1 rounded-full"><CheckCircle2 size={12} className="text-emerald-500" /></div>}
                </div>
                <p className="text-[10px] text-secondary mt-1 leading-relaxed">{ach.description}</p>
             </div>
          </div>
        );
      })}
    </div>
  );
};

// --- SETTINGS TAB ---
export const TabSettings: React.FC<{ 
  state: AppState; 
  setTheme: (t: ThemeMode) => void;
  toggleRamadan: () => void;
  exportData: () => void;
  importData: () => void;
  enterWidgetMode: () => void;
  onBack: () => void;
  buyFreeze: () => void;
  resetApp: () => void;
}> = ({ state, setTheme, toggleRamadan, exportData, importData, enterWidgetMode, onBack, buyFreeze, resetApp }) => {
  return (
    <TabWrapper themeColor="gray" visualType="SETTINGS">
       <div className="space-y-6 pt-6">
          <div className="px-2 flex items-center gap-3 mb-4">
             <button onClick={onBack} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/5 shadow-lg">
                <ChevronLeft size={22} className="text-primary" />
             </button>
             <div>
                <h2 className="text-3xl font-light text-primary">Settings</h2>
                <p className="text-xs text-secondary uppercase tracking-widest">System & Preferences</p>
             </div>
          </div>
          
          {/* FREEZE SHOP */}
          <div className="glass-panel p-6 rounded-[2.5rem] border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 p-6 text-blue-500/20"><Snowflake size={100} /></div>
              
              <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2"><ShoppingBag size={18} /> Item Shop</h3>
                      <div className="bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/20">
                          {state.global.xp} XP Available
                      </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                             <Snowflake size={24} />
                          </div>
                          <div>
                              <h4 className="font-bold text-primary">Streak Freeze</h4>
                              <p className="text-[10px] text-secondary">Auto-protects all streaks if you miss a day.</p>
                              <p className="text-[10px] text-blue-400 font-bold mt-1">In Inventory: {state.global.streakFreezes}</p>
                          </div>
                      </div>
                      <button 
                        onClick={buyFreeze}
                        className="px-4 py-2 bg-white text-black rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all flex flex-col items-center shadow-lg"
                      >
                          <span>Buy</span>
                          <span className="text-[9px] opacity-60">500 XP</span>
                      </button>
                  </div>
              </div>
          </div>

          {/* Focus Mode Card */}
          <div className="glass-panel p-6 rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group cursor-pointer" onClick={enterWidgetMode}>
             <div className="absolute right-0 top-0 p-6 text-emerald-500/20 transform rotate-12 group-hover:scale-110 transition-transform"><Maximize2 size={60} /></div>
             <h3 className="text-lg font-bold text-emerald-500 mb-2 flex items-center gap-2"><Smartphone size={18} /> Standby Mode</h3>
             <p className="text-xs text-secondary mb-4 max-w-[70%]">Transform your device into a minimalist spiritual clock.</p>
             <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                Launch Widget
             </button>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border-gray-500/10">
             <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest opacity-70">Appearance</h3>
             <div className="grid grid-cols-3 gap-3">
                {['AUTO', 'DAY', 'NIGHT'].map((mode) => (
                    <button key={mode} onClick={() => setTheme(mode as ThemeMode)} className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 border ${state.global.theme === mode ? 'bg-white text-black shadow-xl border-white scale-105' : 'bg-black/5 dark:bg-white/5 text-secondary border-transparent hover:bg-black/10'}`}>
                        {mode === 'AUTO' && <Monitor size={24} />}
                        {mode === 'DAY' && <Sun size={24} />}
                        {mode === 'NIGHT' && <Moon size={24} />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{mode}</span>
                    </button>
                ))}
             </div>
          </div>
          
          <div className="glass-panel p-6 rounded-[2.5rem] border-teal-500/20 bg-gradient-to-r from-teal-900/10 to-black/20 flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-teal-500 flex items-center gap-2"><Tent size={18} /> Ramadan Mode</h3>
               <p className="text-xs text-secondary mt-1">Show Ramadan Dashboard Widget</p>
             </div>
             <div onClick={toggleRamadan} className={`w-14 h-8 rounded-full flex items-center transition-colors cursor-pointer shadow-inner ${state.global.ramadanMode ? 'bg-teal-500' : 'bg-gray-700'}`}>
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${state.global.ramadanMode ? 'translate-x-7' : 'translate-x-1'}`} />
             </div>
          </div>
          
          {/* DANGER ZONE - RESET */}
          <div className="glass-panel p-6 rounded-[2.5rem] border-red-500/30 bg-gradient-to-r from-red-950/40 to-black/40 mt-4 shadow-lg shadow-red-900/10 animate-pulse-slow">
              <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-4"><AlertTriangle size={18} /> Danger Zone</h3>
              <p className="text-xs text-secondary mb-4">This action cannot be undone. It will permanently erase all streaks, history, and achievements.</p>
              <button 
                onClick={resetApp}
                className="w-full py-4 bg-red-600/20 border border-red-500/50 rounded-xl text-red-400 font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                 <Trash2 size={16} /> Reset All Data
              </button>
          </div>
       </div>
    </TabWrapper>
  );
};

// --- SOCIAL TAB ---
export const TabSocial: React.FC<{ state: AppState }> = ({ state }) => {
  return (
    <TabWrapper themeColor="blue" visualType="SOCIAL">
       <div className="space-y-6 pt-6">
          <div className="flex justify-between items-end px-2">
             <div>
                <h2 className="text-3xl font-light text-primary">Friends</h2>
                <p className="text-xs text-secondary uppercase tracking-widest">Accountability Circle</p>
             </div>
             <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 active:scale-95 transition-transform hover:bg-blue-400"><UserPlus size={22}/></button>
          </div>

          <div className="space-y-3">
            {state.global.friends.map((friend) => (
               <div key={friend.id} className="glass-panel p-5 rounded-3xl flex items-center gap-5 border-blue-500/10 relative overflow-hidden group transition-all hover:border-blue-500/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                     <div className={`w-14 h-14 rounded-full ${friend.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white/5`}>{friend.name.charAt(0)}</div>
                     {friend.status === 'online' && <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse shadow-lg"></div>}
                  </div>
                  <div className="flex-1 relative z-10">
                     <h4 className="font-bold text-lg text-primary">{friend.name}</h4>
                     <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">{friend.status === 'online' ? 'Online Now' : `Active ${friend.lastActive}`}</p>
                  </div>
                  <div className="text-right relative z-10 bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
                     <div className={`flex items-center justify-end gap-1 font-bold text-xs ${friend.fajrDone ? 'text-emerald-400' : 'text-secondary'}`}>
                        {friend.fajrDone && <CheckCircle2 size={12} />}
                        {friend.fajrDone ? 'Fajr Done' : 'Pending'}
                     </div>
                     <p className="text-[10px] text-secondary mt-1 font-mono">🔥 {friend.streak}d</p>
                  </div>
               </div>
            ))}
          </div>
       </div>
    </TabWrapper>
  );
};

// --- MDF TAB ---
export const TabMDF: React.FC<{ state: AppState; resetRelapse: () => void; checkIn: () => void }> = ({ state, resetRelapse, checkIn }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const streakDays = Math.floor((Date.now() - (state.global.lastRelapseDate || 0)) / (1000 * 60 * 60 * 24));
  const stage = getGrowthStage('MDF', streakDays);
  
  return (
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="rose" visualType="MDF">
       {subView === 'DAILY' && (
         <div className="space-y-6">
            <GrowthCard stage={stage} streak={streakDays} color="rose" />
            
            {/* Pledge Button with Heartbeat */}
            {!state.daily.mdfCheckIn ? (
               <button onClick={checkIn} className="w-full py-8 rounded-[2.5rem] bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold text-xl shadow-2xl shadow-rose-900/50 active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden group hover:brightness-110">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                  <ShieldCheck size={28} className="animate-pulse" /> 
                  <span>I Pledge Purity Today</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs">+20 pts</span>
               </button>
            ) : (
               <div className="w-full py-6 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-center flex items-center justify-center gap-3 shadow-lg">
                  <div className="bg-emerald-500 text-white p-1 rounded-full"><Check size={16} /></div>
                  Pledge Secured
               </div>
            )}

            <div className="glass-panel p-8 rounded-[2.5rem] border-rose-500/20 bg-gradient-to-b from-rose-950/30 to-black/20 relative overflow-hidden">
               <div className="absolute -right-6 -bottom-6 opacity-10 text-rose-500 animate-pulse-slow"><ShieldAlert size={120} /></div>
               <h3 className="text-lg font-bold text-rose-500 mb-2 flex items-center gap-2"><ShieldAlert size={20}/> Emergency Zone</h3>
               <p className="text-xs text-secondary mb-6 z-10 relative leading-relaxed">Failure is not the end. Honesty is the beginning of redemption.</p>
               <button onClick={resetRelapse} className="w-full py-4 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-2xl font-bold text-sm active:scale-95 hover:bg-rose-500/20 transition-colors z-10 relative shadow-inner">
                 I Relapsed (Reset Streak)
               </button>
            </div>
         </div>
       )}
       {subView === 'STATS' && <div className="text-center text-secondary py-20 opacity-50">Detailed analytics coming soon...</div>}
       {subView === 'AWARDS' && <AwardsView category="MDF" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

// --- DHIKR TAB ---
export const TabDhikr: React.FC<{ state: AppState; updateDhikr: (type: 'astaghfirullah' | 'rabbiInni', amt: number) => void }> = ({ state, updateDhikr }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('DHIKR', state.global.streaks.dhikr);
  
  const renderStats = () => {
      const history = state.global.history.slice(-7);
      const data = history.length ? history.map(d => d.dhikrAstaghfirullah + d.dhikrRabbiInni) : [0, 0, 0, 0, 0, 0, 0];
      return (
          <div className="glass-panel p-6 rounded-[2.5rem]">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary"><Activity size={18} className="text-amber-500"/> Dhikr Volume</h3>
             <LineChart data={data} color="amber" />
             <p className="text-center text-[10px] text-secondary mt-4 uppercase tracking-widest">Total Recitations per Day</p>
          </div>
      );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="amber" visualType="DHIKR">
      {subView === 'DAILY' && (
        <div className="space-y-6">
          <GrowthCard stage={stage} streak={state.global.streaks.dhikr} color="amber" />
          <div className="grid grid-cols-1 gap-5">
              {/* Target set to 2100 */}
              <DhikrTasbeeh title="Astaghfirullah" arabic="أَسْتَغْفِرُ ٱللَّهَ" count={state.daily.dhikrAstaghfirullah} target={100} onTap={(amt: number) => updateDhikr('astaghfirullah', amt)} color="amber" goal={2100} />
              <DhikrTasbeeh title="Dua of Yunus" arabic="رَبِّ إِنِّي لِمَآ أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ" count={state.daily.dhikrRabbiInni} target={100} onTap={(amt: number) => updateDhikr('rabbiInni', amt)} color="teal" goal={2100} />
          </div>
        </div>
      )}
      {subView === 'STATS' && renderStats()}
      {subView === 'AWARDS' && <AwardsView category="DHIKR" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

const DhikrTasbeeh = ({ title, arabic, count, target, onTap, color, goal }: any) => {
  const percentage = Math.min((count % target) / target * 100, 100); // Cycle visual (default 100 for ring)
  const theme = THEME_STYLES[color] || THEME_STYLES['amber'];
  const isGoalReached = count >= (goal || 100);

  return (
    <div className={`glass-panel p-0 rounded-[2.5rem] ${theme.border} relative overflow-hidden active:scale-[0.98] transition-all duration-100 cursor-pointer group shadow-lg bg-black/20`} onClick={() => onTap(1)}>
       {/* Progress Bar Background */}
       <div className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r ${theme.gradient.replace('from-', 'from-').replace('/10', '')} to-transparent transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
       
       <div className="absolute top-5 right-5 z-10 flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onTap(10); }} className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold hover:bg-white/10 border border-white/5 text-primary transition-all shadow-lg active:scale-90">+10</button>
       </div>

       <div className="p-8 flex items-center gap-6 relative z-10">
           <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                 <circle cx="50%" cy="50%" r="40" className="stroke-white/5 fill-transparent" strokeWidth="6" />
                 <circle cx="50%" cy="50%" r="40" className={`${theme.stroke} transition-all duration-300 ease-out`} strokeWidth="6" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - percentage/100)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-mono font-bold tracking-tighter text-white">{count}</span>
              </div>
           </div>
           
           <div>
              <p className="text-3xl font-arabic leading-tight drop-shadow-md mb-2 text-primary" dir="rtl">{arabic}</p>
              <h3 className={`text-xs uppercase tracking-[0.2em] font-bold ${theme.color}`}>{title}</h3>
              <p className="text-[9px] text-secondary mt-1 uppercase tracking-widest">Daily Goal: {goal}</p>
              {isGoalReached && <div className="mt-1 text-[9px] font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={10} /> Target Reached</div>}
           </div>
       </div>
    </div>
  );
};

// --- HYGIENE & HABITS ---
export const TabHygiene: React.FC<{ state: AppState; updateHygiene: any; updateHabit: any }> = ({ state, updateHygiene, updateHabit }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('HYGIENE', state.global.streaks.hygiene);
  const waterCount = state.daily.hygiene.waterGlasses || 0;
  
  return (
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="cyan" visualType="HYGIENE">
       {subView === 'DAILY' && (
         <div className="space-y-6">
            <GrowthCard stage={stage} streak={state.global.streaks.hygiene} color="cyan" />
            
            {/* FIXED WATER TRACKER */}
            <div className="glass-panel p-0 rounded-[2.5rem] border-cyan-500/20 relative overflow-hidden h-[360px] flex flex-col justify-between group shadow-2xl shadow-cyan-900/20">
              
              {/* Background Liquid Animation */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] opacity-80"
                    style={{ height: `${Math.min(100, (waterCount / 8) * 100)}%` }}
                  >
                     <div className="absolute top-0 left-0 w-full h-4 bg-white/30 skew-y-2 animate-shimmer"></div>
                  </div>
              </div>

              <div className="relative z-10 p-8 flex justify-between items-start pointer-events-none">
                  <div>
                    <h2 className="text-3xl font-light text-white mb-1 drop-shadow-md">Hydration</h2>
                    <p className="text-xs text-cyan-100/80 font-medium uppercase tracking-widest">Daily Goal: 8 Cups</p>
                  </div>
                  <div className="text-6xl font-mono font-bold text-white drop-shadow-lg flex items-baseline">
                    {waterCount}<span className="text-lg opacity-60 text-cyan-100 font-light">/8</span>
                  </div>
              </div>

              {/* Buttons Container - FORCE Z-INDEX TO BE CLICKABLE */}
              <div className="relative z-50 p-6 grid grid-cols-4 gap-3 pointer-events-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateHygiene('reset_water'); }} 
                    className="col-span-1 py-5 bg-black/40 hover:bg-red-500/40 backdrop-blur-md border border-white/10 rounded-[2rem] text-white/70 hover:text-red-100 font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer hover:shadow-lg"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateHygiene('water'); }} 
                    className="col-span-3 py-5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-[2rem] text-white font-bold text-lg uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 cursor-pointer hover:shadow-xl"
                  >
                    <Plus size={24} /> Add Cup
                  </button>
              </div>
            </div>

             {/* Hygiene Toggles */}
             <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => updateHygiene('shower')} className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 active:scale-[0.97] overflow-hidden ${state.daily.hygiene.shower ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/40' : 'glass-panel hover:border-cyan-500/30'}`}>
                    <div className="flex flex-col items-center gap-4 relative z-10">
                       <div className={`p-3 rounded-full ${state.daily.hygiene.shower ? 'bg-white/20' : 'bg-cyan-500/10'}`}>
                           <Droplets size={32} className={state.daily.hygiene.shower ? 'text-white' : 'text-cyan-500'} />
                       </div>
                       <span className={`text-xs font-bold uppercase tracking-widest ${state.daily.hygiene.shower ? 'text-white' : 'text-secondary'}`}>Shower</span>
                    </div>
                    {state.daily.hygiene.shower && <div className="absolute top-4 right-4"><CheckCircle2 size={20} className="text-white" /></div>}
                 </button>
                 
                 <button onClick={() => updateHygiene('brush')} className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 active:scale-[0.97] overflow-hidden ${state.daily.hygiene.brush ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-400 shadow-lg shadow-cyan-500/40' : 'glass-panel hover:border-cyan-500/30'}`}>
                    <div className="flex flex-col items-center gap-4 relative z-10">
                       <div className={`p-3 rounded-full ${state.daily.hygiene.brush ? 'bg-white/20' : 'bg-cyan-500/10'}`}>
                           <Activity size={32} className={`rotate-45 ${state.daily.hygiene.brush ? 'text-white' : 'text-cyan-500'}`} />
                       </div>
                       <span className={`text-xs font-bold uppercase tracking-widest ${state.daily.hygiene.brush ? 'text-white' : 'text-secondary'}`}>Brush</span>
                    </div>
                    {state.daily.hygiene.brush && <div className="absolute top-4 right-4"><CheckCircle2 size={20} className="text-white" /></div>}
                 </button>
              </div>

            {/* Professional Habit Control */}
            <div className="glass-panel p-8 rounded-[2.5rem] border-red-500/20 relative overflow-hidden">
               <h2 className="text-lg font-bold text-red-500 mb-6 relative z-10 flex items-center gap-2"><ShieldAlert size={20}/> Substance Limits</h2>
               
               <div className="space-y-4 relative z-10">
                  {/* Smoking Control */}
                  <div className="flex items-center justify-between p-6 rounded-[2rem] bg-black/20 border border-white/5 backdrop-blur-md">
                     <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${state.daily.habits.smokingCount > 2 ? 'bg-red-500 text-white shadow-red-500/50 animate-pulse' : 'bg-white/5 text-secondary'}`}><Cigarette size={24} /></div>
                        <div>
                           <h4 className="font-bold text-primary text-base">Smoking</h4>
                           <p className="text-[10px] text-secondary uppercase tracking-wider opacity-70">Daily Limit: 2</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={`text-3xl font-mono font-bold ${state.daily.habits.smokingCount > 2 ? 'text-red-500' : 'text-white'}`}>{state.daily.habits.smokingCount}</span>
                        <button onClick={() => updateHabit('smoking')} className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-primary transition-all active:scale-90 shadow-lg"><Plus size={18} /></button>
                     </div>
                  </div>

                  {/* Nicotine Control */}
                  <div className="flex items-center justify-between p-6 rounded-[2rem] bg-black/20 border border-white/5 backdrop-blur-md">
                     <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${state.daily.habits.nicotineCount > 3 ? 'bg-red-500 text-white shadow-red-500/50 animate-pulse' : 'bg-white/5 text-secondary'}`}><Zap size={24} /></div>
                        <div>
                           <h4 className="font-bold text-primary text-base">Nicotine</h4>
                           <p className="text-[10px] text-secondary uppercase tracking-wider opacity-70">Daily Limit: 3</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={`text-3xl font-mono font-bold ${state.daily.habits.nicotineCount > 3 ? 'text-red-500' : 'text-white'}`}>{state.daily.habits.nicotineCount}</span>
                        <button onClick={() => updateHabit('nicotine')} className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-primary transition-all active:scale-90 shadow-lg"><Plus size={18} /></button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}
       {subView === 'STATS' && <div className="text-center text-secondary py-20 opacity-50">Analytics coming soon...</div>}
       {subView === 'AWARDS' && <AwardsView category="HYGIENE" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

// --- TAB QURAN ---
export const TabQuran: React.FC<{ state: AppState; updatePart: (part: string) => void; updateSurah: (surah: string) => void }> = ({ state, updatePart, updateSurah }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('QURAN', state.global.streaks.quranSurah);
  const currentParahName = PARAH_NAMES[state.global.currentParah - 1] || "الم";
  const parts = ['rub', 'nisf', 'thalatha', 'kamil'];
  const completedCount = parts.filter(p => state.daily.quranParts[p as keyof typeof state.daily.quranParts]).length;
  
  return (
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="purple" visualType="QURAN">
      {subView === 'DAILY' && (
        <div className="space-y-6">
           <GrowthCard stage={stage} streak={state.global.streaks.quranSurah} color="purple" />
           
           {/* Extraordinary Parah Visualizer */}
           <div className="glass-panel p-10 rounded-[3rem] border-purple-500/20 relative overflow-hidden flex flex-col items-center justify-center min-h-[420px] shadow-2xl shadow-purple-900/20">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-transparent to-black/40" />
              
              {/* Central Progress Engine */}
              <div className="relative w-72 h-72 mb-10">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full animate-pulse-slow"></div>
                  
                  {/* Rings */}
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                     <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-transparent" strokeWidth="2" />
                     <circle cx="50%" cy="50%" r="38%" className="stroke-white/5 fill-transparent" strokeWidth="24" />
                     
                     {/* Dynamic Progress Stroke */}
                     <circle 
                        cx="50%" cy="50%" r="38%" 
                        className="stroke-purple-500 fill-transparent transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
                        strokeWidth="24" 
                        strokeDasharray={`${2 * Math.PI * 38}%`} 
                        strokeDashoffset={`${2 * Math.PI * 38 * (1 - completedCount / 4)}%`}
                        strokeLinecap="round"
                     />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <span className="text-[10px] font-bold text-purple-300 uppercase tracking-[0.3em] mb-4 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Juz {state.global.currentParah}</span>
                      <h1 className="text-6xl font-arabic text-white drop-shadow-lg mb-2 transition-all hover:scale-105">{currentParahName}</h1>
                      <div className="text-xs text-purple-200/60 font-mono tracking-widest">{Math.round((completedCount/4)*100)}%</div>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full relative z-10">
                 {['rub', 'nisf', 'thalatha', 'kamil'].map((part, idx) => {
                    // Correct Arabic Labels as requested
                    const labels = ['رُبُع', 'نِصْف', 'ثَلاثَةُ أَرْبَاع', 'كَامِل'];
                    const isDone = state.daily.quranParts[part as keyof typeof state.daily.quranParts];
                    return (
                        <button 
                            key={part} 
                            onClick={() => updatePart(part)}
                            className={`
                                py-4 rounded-2xl border text-center transition-all duration-300 active:scale-95 relative overflow-hidden group
                                ${isDone ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-white/5 border-white/5 text-secondary hover:bg-white/10'}
                            `}
                        >
                            <span className="relative z-10 text-xl font-arabic font-bold leading-none">{labels[idx]}</span>
                        </button>
                    );
                 })}
              </div>
           </div>

           {/* Daily Protection */}
           <div className="glass-panel p-6 rounded-[2.5rem] border-purple-500/20">
              <h3 className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2 uppercase tracking-widest"><ShieldCheck size={16}/> Daily Protection</h3>
              <div className="grid grid-cols-1 gap-3">
                 <button onClick={() => updateSurah('mulk')} className={`w-full p-6 rounded-3xl flex items-center justify-between transition-all active:scale-[0.98] ${state.daily.surahMulk ? 'bg-gradient-to-r from-purple-900/60 to-purple-800/40 border border-purple-500/50' : 'bg-black/5 dark:bg-white/5 border border-transparent hover:bg-white/10'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${state.daily.surahMulk ? 'bg-purple-500 text-white' : 'bg-white/10 text-secondary'}`}><BookOpen size={20} /></div>
                        <span className={`font-bold text-sm ${state.daily.surahMulk ? "text-purple-100" : "text-secondary"}`}>Surah Al-Mulk</span>
                    </div>
                    {state.daily.surahMulk && <Check size={16} className="text-white" />}
                 </button>
                 <button onClick={() => updateSurah('baqarah')} className={`w-full p-6 rounded-3xl flex items-center justify-between transition-all active:scale-[0.98] ${state.daily.surahBaqarah ? 'bg-gradient-to-r from-purple-900/60 to-purple-800/40 border border-purple-500/50' : 'bg-black/5 dark:bg-white/5 border border-transparent hover:bg-white/10'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${state.daily.surahBaqarah ? 'bg-purple-500 text-white' : 'bg-white/10 text-secondary'}`}><BookOpen size={20} /></div>
                        <span className={`font-bold text-sm ${state.daily.surahBaqarah ? "text-purple-100" : "text-secondary"}`}>Last 2 Ayats (Baqarah)</span>
                    </div>
                    {state.daily.surahBaqarah && <Check size={16} className="text-white" />}
                 </button>
              </div>
           </div>
        </div>
      )}
      {subView === 'STATS' && <div className="text-center text-secondary py-20 opacity-50">Analytics coming soon...</div>}
      {subView === 'AWARDS' && <AwardsView category="QURAN" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

// --- TAB FITNESS ---
export const TabFitness: React.FC<{ state: AppState; updateType: (type: string) => void }> = ({ state, updateType }) => {
    const [subView, setSubView] = useState<SubView>('DAILY');
    const stage = getGrowthStage('FITNESS', state.global.streaks.fitness);
    const workoutTypes = ['Push', 'Pull', 'Legs', 'Cardio', 'Rest', 'Sport'];

    return (
        <TabWrapper subView={subView} setSubView={setSubView} themeColor="orange" visualType="FITNESS">
            {subView === 'DAILY' && (
                <div className="space-y-6">
                    <GrowthCard stage={stage} streak={state.global.streaks.fitness} color="orange" />
                    
                    {/* Modern Muscle Card */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border-orange-500/20 text-center relative overflow-hidden min-h-[350px] flex flex-col justify-center items-center group shadow-2xl shadow-orange-900/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-black/50 to-orange-950 opacity-80" />
                        
                        <div className="relative z-10 p-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-[0_0_40px_rgba(249,115,22,0.4)] mb-8 transform group-hover:scale-110 transition-transform duration-500">
                            <Dumbbell size={60} className="text-white" />
                        </div>

                        <h3 className="text-5xl font-bold text-white mb-2 relative z-10 drop-shadow-lg tracking-tight">{state.daily.fitness.type}</h3>
                        <p className="text-xs text-orange-300 uppercase tracking-[0.4em] mb-10 relative z-10 font-bold">Today's Protocol</p>
                        
                        <div className="grid grid-cols-3 gap-3 w-full relative z-10">
                           {workoutTypes.map(type => (
                              <button key={type} onClick={() => updateType(type)} className={`py-4 rounded-2xl text-[10px] font-bold uppercase transition-all duration-300 border ${state.daily.fitness.type === type ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105' : 'bg-white/5 border-white/5 text-secondary hover:bg-white/10'}`}>
                                 {type}
                              </button>
                           ))}
                        </div>
                    </div>
                </div>
            )}
            {subView === 'STATS' && <div className="text-center text-secondary py-20 opacity-50">Analytics coming soon...</div>}
            {subView === 'AWARDS' && <AwardsView category="FITNESS" unlocked={state.global.unlockedAchievements} />}
        </TabWrapper>
    )
}

// --- TAB MEMORIZE ---
export const TabMemorize: React.FC<{ state: AppState }> = ({ state }) => {
    const week = state.global.memorizeWeek || 1;
    const content = MEMORIZE_CONTENT[week - 1] || MEMORIZE_CONTENT[0];
    
    return (
        <TabWrapper themeColor="pink" visualType="QURAN">
            <div className="space-y-6 pt-6">
                <div className="px-2">
                    <h2 className="text-3xl font-light text-primary">Memorize</h2>
                    <p className="text-xs text-secondary uppercase tracking-widest">Week {week} Challenge</p>
                </div>
                
                {/* Flashcard Visual */}
                <div className="perspective-1000">
                    <div className="glass-panel p-8 rounded-[2.5rem] border-pink-500/20 text-center min-h-[55vh] flex flex-col justify-center relative overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.01] bg-gradient-to-b from-pink-950/30 to-black/40">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500" />
                        
                        <div className="absolute top-8 right-8 opacity-10 text-pink-500 animate-float"><Brain size={100} /></div>

                        <div className="relative z-10">
                            <p className="text-4xl md:text-5xl font-arabic leading-loose text-white mb-8 drop-shadow-lg" dir="rtl">{content.arabic}</p>
                            <div className="w-20 h-1 bg-pink-500/30 mx-auto rounded-full mb-8"></div>
                            <p className="text-xl text-pink-100/80 font-light italic px-6 leading-relaxed">"{content.english}"</p>
                        </div>

                        <div className="mt-16 relative z-10">
                           <button className="w-full py-5 rounded-2xl bg-pink-500 text-white shadow-lg shadow-pink-500/30 hover:bg-pink-400 transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95">
                               <CheckCircle2 size={20} /> Mark as Learned
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </TabWrapper>
    );
}

// --- TAB RAMADAN ---
export const TabRamadan: React.FC<{ state: AppState }> = ({ state }) => {
    const [subView, setSubView] = useState<SubView>('DAILY');
    const stage = getGrowthStage('RAMADAN', state.global.streaks.ramadan);

    return (
        <TabWrapper subView={subView} setSubView={setSubView} themeColor="teal" visualType="RAMADAN">
            {subView === 'DAILY' && (
                <div className="space-y-6">
                     {/* Hero Card with Midnight & Gold Theme */}
                     <div className="glass-panel p-0 rounded-[3rem] border-amber-500/20 relative overflow-hidden group bg-[#020617] shadow-2xl shadow-amber-900/20 min-h-[450px] flex flex-col">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse-slow"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/10 to-black/50"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center pt-12 flex-1">
                           <Moon size={64} className="text-amber-200 mb-4 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]" strokeWidth={1} />
                           <h2 className="text-5xl font-serif text-amber-50 mb-2 tracking-wide drop-shadow-xl">Ramadan</h2>
                           <p className="text-xs text-amber-200/60 uppercase tracking-[0.4em] mb-12">Kareem Mubarak</p>
                           
                           <div className="grid grid-cols-2 w-full border-t border-white/10 bg-black/40 backdrop-blur-md mt-auto">
                               <div className="p-6 border-r border-white/10 flex flex-col items-center">
                                   <span className="text-4xl font-bold text-white mb-1">{state.global.streaks.ramadan}</span>
                                   <span className="text-[9px] uppercase tracking-widest text-amber-400/60">Fasts Completed</span>
                               </div>
                               <div className="p-6 flex flex-col items-center">
                                   <span className="text-4xl font-bold text-white mb-1">0</span>
                                   <span className="text-[9px] uppercase tracking-widest text-amber-400/60">Taraweeh Nights</span>
                               </div>
                           </div>
                        </div>
                     </div>
                     
                     {/* Premium Checklist Cards */}
                     <div className="glass-panel p-8 rounded-[2.5rem] border-amber-500/20">
                        <h3 className="font-bold text-amber-500 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest"><Tent size={18}/> Daily Deeds</h3>
                        <div className="space-y-4">
                           {[
                              { id: 'Suhoor', icon: <Sun size={20}/>, time: 'Pre-Dawn' },
                              { id: 'Iftar', icon: <Moon size={20}/>, time: 'Sunset' },
                              { id: 'Taraweeh', icon: <Users size={20}/>, time: 'Night' },
                              { id: 'Charity', icon: <HeartHandshake size={20}/>, time: 'Anytime' }
                           ].map(item => (
                              <div key={item.id} className="group flex items-center justify-between p-5 bg-black/20 dark:bg-white/5 rounded-3xl border border-transparent hover:border-amber-500/30 hover:bg-amber-500/10 transition-all cursor-pointer active:scale-[0.98]">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-lg">{item.icon}</div>
                                    <div>
                                       <span className="block font-bold text-base text-primary group-hover:text-amber-400 transition-colors">{item.id}</span>
                                       <span className="text-[10px] text-secondary font-medium uppercase tracking-wider">{item.time}</span>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                </div>
            )}
            {subView === 'STATS' && <div className="text-center text-secondary py-20 opacity-50">Analytics coming soon...</div>}
            {subView === 'AWARDS' && <AwardsView category="RAMADAN" unlocked={state.global.unlockedAchievements} />}
        </TabWrapper>
    )
}
