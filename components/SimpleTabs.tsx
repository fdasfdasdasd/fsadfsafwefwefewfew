
import * as React from 'react';
import { useState } from 'react';
import { AppState, SubView, DailyStats, Friend, ThemeMode } from '../types';
import { FITNESS_SCHEDULE, MEMORIZE_CONTENT, PARAH_NAMES, MASTER_ACHIEVEMENTS, getGrowthStage } from '../constants';
import { Check, Droplets, RotateCcw, Cigarette, ShieldAlert, CheckCircle2, ChevronLeft, BarChart2, Trophy, Dumbbell, Brain, Activity, Users, UserPlus, Radio, Cloud, Download, Upload, Smartphone, Moon, Sun, Monitor, LogOut, HeartHandshake, ShieldCheck, BookOpen, Tent, Calendar, Flame } from 'lucide-react';
import { LineChart, BarChart } from './Charts';

// Robust Theme Mapping
const THEME_STYLES: Record<string, any> = {
  amber: { color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-amber-500', bgSoft: 'bg-amber-500/10', gradient: 'from-amber-500/10', fill: 'fill-amber-500' },
  cyan: { color: 'text-cyan-500', border: 'border-cyan-500/20', bg: 'bg-cyan-500', bgSoft: 'bg-cyan-500/10', gradient: 'from-cyan-500/10', fill: 'fill-cyan-500' },
  purple: { color: 'text-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-500', bgSoft: 'bg-purple-500/10', gradient: 'from-purple-500/10', fill: 'fill-purple-500' },
  rose: { color: 'text-rose-500', border: 'border-rose-500/20', bg: 'bg-rose-500', bgSoft: 'bg-rose-500/10', gradient: 'from-rose-500/10', fill: 'fill-rose-500' },
  orange: { color: 'text-orange-500', border: 'border-orange-500/20', bg: 'bg-orange-500', bgSoft: 'bg-orange-500/10', gradient: 'from-orange-500/10', fill: 'fill-orange-500' },
  pink: { color: 'text-pink-500', border: 'border-pink-500/20', bg: 'bg-pink-500', bgSoft: 'bg-pink-500/10', gradient: 'from-pink-500/10', fill: 'fill-pink-500' },
  emerald: { color: 'text-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500', bgSoft: 'bg-emerald-500/10', gradient: 'from-emerald-500/10', fill: 'fill-emerald-500' },
  blue: { color: 'text-blue-500', border: 'border-blue-500/20', bg: 'bg-blue-500', bgSoft: 'bg-blue-500/10', gradient: 'from-blue-500/10', fill: 'fill-blue-500' },
  gray: { color: 'text-gray-500', border: 'border-gray-500/20', bg: 'bg-gray-500', bgSoft: 'bg-gray-500/10', gradient: 'from-gray-500/10', fill: 'fill-gray-500' },
  teal: { color: 'text-teal-500', border: 'border-teal-500/20', bg: 'bg-teal-500', bgSoft: 'bg-teal-500/10', gradient: 'from-teal-500/10', fill: 'fill-teal-500' },
};

// --- SHARED LAYOUT ---
const TabWrapper: React.FC<{ children: React.ReactNode; subView?: SubView; setSubView?: any; themeColor: string }> = ({ children, subView, setSubView, themeColor }) => {
  const theme = THEME_STYLES[themeColor] || THEME_STYLES['emerald'];
  
  return (
    <div className="pb-32 animate-fade-in px-2 relative min-h-screen">
       <div className={`absolute top-0 left-0 right-0 h-[35rem] pointer-events-none rounded-b-[4rem] bg-gradient-to-b ${theme.gradient} via-transparent to-transparent transition-all duration-1000 opacity-60`} />
       
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

const GrowthCard: React.FC<{ stage: { icon: string, label: string }, streak: number, color: string }> = ({ stage, streak, color }) => {
  const theme = THEME_STYLES[color] || THEME_STYLES['emerald'];
  return (
    <div className={`glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden ${theme.border} shadow-xl mb-6 group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} to-transparent opacity-50`}></div>
      <div className={`absolute -right-12 -top-12 opacity-10 transform rotate-12 transition-transform duration-700 group-hover:rotate-0 ${theme.color}`}>
         <Trophy size={200} />
      </div>
      <div className="relative z-10">
          <div className="text-6xl mb-4 drop-shadow-2xl animate-scale-in">{stage.icon}</div>
          <h3 className="text-5xl font-light mb-1 tracking-tighter text-primary">{streak}<span className="text-lg font-normal opacity-50 ml-1">Days</span></h3>
          <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${theme.color}`}>Stage: {stage.label}</p>
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
          <div key={ach.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${isUnlocked ? 'glass-panel border-emerald-500/30 bg-emerald-500/5' : 'glass-panel opacity-50 grayscale'}`} style={{ animationDelay: `${i * 50}ms` }}>
             <div className="text-xl">{ach.icon}</div>
             <div className="flex-1">
                <div className="flex justify-between">
                   <h4 className={`font-bold text-xs ${isUnlocked ? 'text-primary' : 'text-gray-500'}`}>{ach.title}</h4>
                   {isUnlocked && <CheckCircle2 size={14} className="text-emerald-500" />}
                </div>
                <p className="text-[9px] text-secondary mt-1">{ach.description}</p>
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
}> = ({ state, setTheme, toggleRamadan, exportData, importData, enterWidgetMode }) => {
  return (
    <TabWrapper themeColor="gray">
       <div className="space-y-6 pt-6">
          <div className="px-2">
             <h2 className="text-3xl font-light text-primary">Settings</h2>
             <p className="text-xs text-secondary">Preferences & Data</p>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-gray-500/10">
             <h3 className="text-lg font-bold text-primary mb-4">Appearance</h3>
             <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setTheme('AUTO')} className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${state.global.theme === 'AUTO' ? 'bg-white text-black shadow-lg scale-105' : 'bg-black/5 dark:bg-white/5 text-secondary hover:bg-black/10'}`}>
                   <Monitor size={20} />
                   <span className="text-[10px] font-bold uppercase">Auto</span>
                </button>
                <button onClick={() => setTheme('DAY')} className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${state.global.theme === 'DAY' ? 'bg-white text-black shadow-lg scale-105' : 'bg-black/5 dark:bg-white/5 text-secondary hover:bg-black/10'}`}>
                   <Sun size={20} />
                   <span className="text-[10px] font-bold uppercase">Day</span>
                </button>
                <button onClick={() => setTheme('NIGHT')} className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${state.global.theme === 'NIGHT' ? 'bg-white text-black shadow-lg scale-105' : 'bg-black/5 dark:bg-white/5 text-secondary hover:bg-black/10'}`}>
                   <Moon size={20} />
                   <span className="text-[10px] font-bold uppercase">Night</span>
                </button>
             </div>
          </div>
          
          <div className="glass-panel p-6 rounded-[2rem] border-teal-500/20 bg-teal-500/5 flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-teal-500 flex items-center gap-2"><Tent size={18} /> Ramadan Mode</h3>
               <p className="text-xs text-secondary">Enable Fasting & Taraweeh Tracker</p>
             </div>
             <div onClick={toggleRamadan} className={`w-12 h-7 rounded-full flex items-center transition-colors cursor-pointer ${state.global.ramadanMode ? 'bg-teal-500' : 'bg-gray-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${state.global.ramadanMode ? 'translate-x-6' : 'translate-x-1'}`} />
             </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-blue-500/10 bg-blue-500/5">
             <h3 className="text-lg font-bold text-blue-500 mb-4 flex items-center gap-2"><Cloud size={18} /> Data & Backup</h3>
             <p className="text-xs text-secondary mb-4">Your data is secure on this device. Create a backup file to save it externally or move to a new phone.</p>
             <div className="flex gap-3">
                <button onClick={exportData} className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-500/20">
                   <Download size={16} /> Export
                </button>
                <button onClick={importData} className="flex-1 py-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-blue-500/20">
                   <Upload size={16} /> Import
                </button>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-emerald-500/10 bg-emerald-500/5">
             <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2"><Smartphone size={18} /> StandBy Widget</h3>
             <p className="text-xs text-secondary mb-4">Transform your screen into a minimalist spiritual desk clock.</p>
             <button onClick={enterWidgetMode} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
                Enter Widget View
             </button>
          </div>
       </div>
    </TabWrapper>
  );
};

// --- SOCIAL TAB ---
export const TabSocial: React.FC<{ state: AppState }> = ({ state }) => {
  return (
    <TabWrapper themeColor="blue">
       <div className="space-y-6 pt-6">
          <div className="flex justify-between items-end px-2">
             <div>
                <h2 className="text-3xl font-light text-primary">Friends</h2>
                <p className="text-xs text-secondary">Accountability Circle</p>
             </div>
             <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform hover:bg-blue-600"><UserPlus size={20}/></button>
          </div>

          <div className="space-y-3">
            {state.global.friends.map((friend) => (
               <div key={friend.id} className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-blue-500/10">
                  <div className="relative">
                     <div className={`w-12 h-12 rounded-full ${friend.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-md`}>{friend.name.charAt(0)}</div>
                     {friend.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black animate-pulse"></div>}
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-primary">{friend.name}</h4>
                     <p className="text-[10px] text-secondary">{friend.status === 'online' ? 'Online' : `Active ${friend.lastActive}`}</p>
                  </div>
                  <div className="text-right">
                     <div className={`flex items-center justify-end gap-1 font-bold text-xs ${friend.fajrDone ? 'text-emerald-500' : 'text-secondary'}`}>
                        <span className={`w-2 h-2 rounded-full ${friend.fajrDone ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                        {friend.fajrDone ? 'Fajr Done' : 'Pending'}
                     </div>
                     <p className="text-[10px] text-secondary mt-1">🔥 {friend.streak}d Streak</p>
                  </div>
               </div>
            ))}
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-blue-500/10 text-center bg-blue-500/5">
             <div className="inline-block p-3 bg-blue-500/20 rounded-full text-blue-500 mb-3 animate-pulse-slow"><Radio size={24} /></div>
             <h3 className="text-lg font-bold text-primary">Live Accountability</h3>
             <p className="text-xs text-secondary mb-4">Your status is visible to friends. Missed prayers will send an alert.</p>
             <div className="flex gap-1 justify-center">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-50 animate-bounce" style={{ animationDelay: `${i * 200}ms` }}></div>)}
             </div>
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
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="rose">
       {subView === 'DAILY' && (
         <div className="space-y-6">
            <GrowthCard stage={stage} streak={streakDays} color="rose" />
            {!state.daily.mdfCheckIn && (
               <button onClick={checkIn} className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 animate-pulse-slow">
                  <ShieldCheck size={24} /> I Pledge Purity Today (+20 pts)
               </button>
            )}
            {state.daily.mdfCheckIn && (
               <div className="w-full py-4 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Pledge Secured
               </div>
            )}
            <div className="glass-panel p-6 rounded-[2rem] border-rose-500/20 bg-rose-900/5">
               <h3 className="text-lg font-bold text-rose-500 mb-2 flex items-center gap-2"><ShieldAlert size={18}/> Emergency Zone</h3>
               <p className="text-xs text-secondary mb-6">If you fall, get back up immediately. Resetting the streak is honest and necessary for growth.</p>
               <button onClick={resetRelapse} className="w-full py-4 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl font-bold text-sm active:scale-95 hover:bg-rose-500/20 transition-colors">
                 I Relapsed (Reset Streak)
               </button>
            </div>
         </div>
       )}
       {subView === 'STATS' && <div className="text-center text-secondary py-10">Stats coming soon...</div>}
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
          <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><Activity size={18} className="text-amber-500"/> Dhikr Volume</h3>
             <LineChart data={data} color="amber" />
             <p className="text-center text-[10px] text-secondary mt-4">Total Recitations per Day</p>
          </div>
      );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="amber">
      {subView === 'DAILY' && (
        <div className="space-y-6">
          <GrowthCard stage={stage} streak={state.global.streaks.dhikr} color="amber" />
          <div className="grid grid-cols-1 gap-6">
              <DhikrTasbeeh title="Astaghfirullah" arabic="أَسْتَغْفِرُ ٱللَّهَ" count={state.daily.dhikrAstaghfirullah} target={2100} onTap={(amt: number) => updateDhikr('astaghfirullah', amt)} color="amber" />
              <DhikrTasbeeh title="Dua of Yunus" arabic="رَبِّ إِنِّي لِمَآ أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ" count={state.daily.dhikrRabbiInni} target={2100} onTap={(amt: number) => updateDhikr('rabbiInni', amt)} color="amber" />
          </div>
        </div>
      )}
      {subView === 'STATS' && renderStats()}
      {subView === 'AWARDS' && <AwardsView category="DHIKR" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

const DhikrTasbeeh = ({ title, arabic, count, target, onTap, color }: any) => {
  const percentage = Math.min((count / target) * 100, 100);
  const circumference = 2 * Math.PI * 45; 
  const offset = circumference - (percentage / 100) * circumference;
  const theme = THEME_STYLES[color];

  return (
    <div className={`glass-panel p-6 rounded-[2.5rem] ${theme.border} relative overflow-hidden active:scale-[0.98] transition-all duration-100 cursor-pointer group shadow-lg bg-white/60 dark:bg-black/20`} onClick={() => onTap(1)}>
       <div className="absolute top-6 right-6 z-10">
          <button onClick={(e) => { e.stopPropagation(); onTap(100); }} className="bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-black/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/5 text-primary transition-colors">+100</button>
       </div>
       <div className="flex flex-col items-center justify-center gap-6 pt-4">
           <div className="relative w-40 h-40 flex-shrink-0">
              <div className={`absolute inset-0 ${theme.bgSoft} blur-2xl rounded-full scale-75 animate-pulse-slow`}></div>
              <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                 <circle cx="50%" cy="50%" r="45" className="stroke-black/5 dark:stroke-white/5 fill-transparent" strokeWidth="8" />
                 <circle cx="50%" cy="50%" r="45" className={`${theme.color.replace('text-', 'stroke-')} fill-transparent transition-all duration-300 ease-out`} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-mono font-bold tracking-tighter text-primary">{count}</span>
                  <span className="text-[10px] text-secondary uppercase tracking-widest">/ {target}</span>
              </div>
           </div>
           <div className="text-center pb-2">
              <p className="text-3xl font-arabic leading-relaxed drop-shadow-md mb-2 text-primary" dir="rtl">{arabic}</p>
              <h3 className="text-xs text-secondary uppercase tracking-[0.2em]">{title}</h3>
           </div>
       </div>
    </div>
  );
};

// --- HYGIENE & HABITS ---
export const TabHygiene: React.FC<{ state: AppState; updateHygiene: any; updateHabit: any }> = ({ state, updateHygiene, updateHabit }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('HYGIENE', state.global.streaks.hygiene);
  
  return (
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="cyan">
       {subView === 'DAILY' && (
         <div className="space-y-6">
            <GrowthCard stage={stage} streak={state.global.streaks.hygiene} color="cyan" />
            <div className="glass-panel p-6 rounded-[2rem] border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-500 mb-6">Hygiene</h2>
              <div className="space-y-4">
                 <button onClick={() => updateHygiene('shower')} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-95 ${state.daily.hygiene.shower ? 'bg-cyan-500 text-white shadow-lg' : 'bg-black/5 dark:bg-white/5 text-secondary hover:bg-black/10'}`}>
                    <span className="font-bold">Shower</span>{state.daily.hygiene.shower && <Check size={18} />}
                 </button>
                 <button onClick={() => updateHygiene('brush')} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-95 ${state.daily.hygiene.brush ? 'bg-cyan-500 text-white shadow-lg' : 'bg-black/5 dark:bg-white/5 text-secondary hover:bg-black/10'}`}>
                    <span className="font-bold">Brush Teeth</span>{state.daily.hygiene.brush && <Check size={18} />}
                 </button>
                 <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl">
                    <div className="flex justify-between text-sm mb-2"><span className="text-secondary">Water Intake</span><span className="font-bold text-cyan-500">{state.daily.hygiene.waterGlasses} / 8</span></div>
                    <div className="h-2 bg-gray-200 dark:bg-black/40 rounded-full overflow-hidden mb-4"><div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${(state.daily.hygiene.waterGlasses / 8) * 100}%` }} /></div>
                    <button onClick={() => updateHygiene('water')} className="w-full py-2 bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 rounded-lg text-sm font-bold active:scale-95 hover:bg-cyan-500/20 transition-colors">+ Add Cup</button>
                 </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-[2rem] border-red-500/20">
              <h2 className="text-xl font-bold text-red-500 mb-6">Habit Control</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className={`p-4 rounded-xl border active:scale-[0.98] transition-transform ${state.daily.habits.smokingCount > 2 ? 'bg-red-900/20 border-red-500' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
                    <div className="flex justify-between mb-2"><Cigarette size={18} className="text-gray-400" /><span className={`font-bold ${state.daily.habits.smokingCount > 2 ? 'text-red-500' : 'text-primary'}`}>{state.daily.habits.smokingCount} / 2</span></div>
                    <button onClick={() => updateHabit('smoking')} className="w-full py-2 mt-2 bg-white/50 dark:bg-white/5 rounded-lg text-xs font-bold hover:bg-white/80 dark:hover:bg-white/10 active:scale-95 text-primary transition-colors">+ Log</button>
                 </div>
                 <div className={`p-4 rounded-xl border active:scale-[0.98] transition-transform ${state.daily.habits.nicotineCount > 3 ? 'bg-red-900/20 border-red-500' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
                    <div className="flex justify-between mb-2"><ShieldAlert size={18} className="text-gray-400" /><span className={`font-bold ${state.daily.habits.nicotineCount > 3 ? 'text-red-500' : 'text-primary'}`}>{state.daily.habits.nicotineCount} / 3</span></div>
                    <button onClick={() => updateHabit('nicotine')} className="w-full py-2 mt-2 bg-white/50 dark:bg-white/5 rounded-lg text-xs font-bold hover:bg-white/80 dark:hover:bg-white/10 active:scale-95 text-primary transition-colors">+ Log</button>
                 </div>
              </div>
            </div>
         </div>
       )}
       {subView === 'STATS' && <div className="text-center text-secondary py-10">Stats coming soon...</div>}
       {subView === 'AWARDS' && <AwardsView category="HYGIENE" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

// --- TAB QURAN ---
export const TabQuran: React.FC<{ state: AppState; updatePart: (part: string) => void; updateSurah: (surah: string) => void }> = ({ state, updatePart, updateSurah }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('QURAN', state.global.streaks.quranSurah);
  
  return (
    <TabWrapper subView={subView} setSubView={setSubView} themeColor="purple">
      {subView === 'DAILY' && (
        <div className="space-y-6">
           <GrowthCard stage={stage} streak={state.global.streaks.quranSurah} color="purple" />
           
           <div className="glass-panel p-6 rounded-[2rem] border-purple-500/20">
              <h3 className="text-lg font-bold text-purple-500 mb-4 flex items-center gap-2"><BookOpen size={18}/> Daily Protection</h3>
              <div className="space-y-3">
                 <button onClick={() => updateSurah('mulk')} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${state.daily.surahMulk ? 'bg-purple-500 text-white' : 'bg-black/5 dark:bg-white/5 text-secondary'}`}>
                    <span className="font-bold">Surah Mulk</span>
                    {state.daily.surahMulk && <CheckCircle2 size={20} />}
                 </button>
                 <button onClick={() => updateSurah('baqarah')} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${state.daily.surahBaqarah ? 'bg-purple-500 text-white' : 'bg-black/5 dark:bg-white/5 text-secondary'}`}>
                    <span className="font-bold">Last 2 Ayats (Baqarah)</span>
                    {state.daily.surahBaqarah && <CheckCircle2 size={20} />}
                 </button>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-[2rem] border-purple-500/20">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-purple-500">Recitation</h3>
                 <span className="text-xs font-bold bg-purple-500/10 text-purple-500 px-2 py-1 rounded-lg">Juz {state.global.currentParah}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                  {['rub', 'nisf', 'thalatha', 'kamil'].map((part, idx) => (
                      <button key={part} onClick={() => updatePart(part)} className={`p-3 rounded-xl border text-xs font-bold uppercase transition-all ${state.daily.quranParts[part as keyof typeof state.daily.quranParts] ? 'bg-purple-500 text-white border-purple-500' : 'border-purple-500/20 text-purple-500/60'}`}>
                         {['¼ Rub', '½ Nisf', '¾ Thalatha', 'Full'][idx]}
                      </button>
                  ))}
              </div>
           </div>
        </div>
      )}
      {subView === 'STATS' && <div className="text-center text-secondary py-10">Stats coming soon...</div>}
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
        <TabWrapper subView={subView} setSubView={setSubView} themeColor="orange">
            {subView === 'DAILY' && (
                <div className="space-y-6">
                    <GrowthCard stage={stage} streak={state.global.streaks.fitness} color="orange" />
                    
                    <div className="glass-panel p-6 rounded-[2rem] border-orange-500/20 text-center">
                        <Dumbbell size={48} className="mx-auto text-orange-500 mb-4" />
                        <h3 className="text-2xl font-bold text-primary mb-2">{state.daily.fitness.type}</h3>
                        <p className="text-xs text-secondary uppercase tracking-widest mb-6">Today's Focus</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                           {workoutTypes.map(type => (
                              <button key={type} onClick={() => updateType(type)} className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${state.daily.fitness.type === type ? 'bg-orange-500 text-white' : 'bg-black/5 dark:bg-white/5 text-secondary hover:bg-orange-500/20 hover:text-orange-500'}`}>
                                 {type}
                              </button>
                           ))}
                        </div>
                    </div>
                </div>
            )}
            {subView === 'STATS' && <div className="text-center text-secondary py-10">Stats coming soon...</div>}
            {subView === 'AWARDS' && <AwardsView category="FITNESS" unlocked={state.global.unlockedAchievements} />}
        </TabWrapper>
    )
}

// --- TAB MEMORIZE ---
export const TabMemorize: React.FC<{ state: AppState }> = ({ state }) => {
    const week = state.global.memorizeWeek || 1;
    const content = MEMORIZE_CONTENT[week - 1] || MEMORIZE_CONTENT[0];
    
    return (
        <TabWrapper themeColor="pink">
            <div className="space-y-6 pt-6">
                <div className="px-2">
                    <h2 className="text-3xl font-light text-primary">Memorize</h2>
                    <p className="text-xs text-secondary">Week {week}</p>
                </div>
                <div className="glass-panel p-8 rounded-[2rem] border-pink-500/20 text-center min-h-[60vh] flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-pink-500/20"><div className="h-full bg-pink-500 w-1/4"></div></div>
                    <Brain size={64} className="mx-auto text-pink-500 mb-8 opacity-80" />
                    <p className="text-3xl font-serif leading-loose text-primary mb-8 drop-shadow-sm" dir="rtl">{content.arabic}</p>
                    <p className="text-lg text-secondary/80 font-light">{content.english}</p>
                    <div className="mt-12 flex justify-center">
                       <button className="px-8 py-3 rounded-full border border-pink-500/30 text-pink-500 hover:bg-pink-500 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">Mark as Learned</button>
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
        <TabWrapper subView={subView} setSubView={setSubView} themeColor="teal">
            {subView === 'DAILY' && (
                <div className="space-y-6">
                     <GrowthCard stage={stage} streak={state.global.streaks.ramadan} color="teal" />
                     <div className="grid grid-cols-2 gap-4">
                         <div className="glass-panel p-6 rounded-[2rem] border-teal-500/20 flex flex-col items-center justify-center">
                             <Flame size={32} className="text-teal-500 mb-2" />
                             <span className="text-2xl font-bold text-primary">{state.global.streaks.ramadan}</span>
                             <span className="text-[10px] text-secondary uppercase">Fast Streak</span>
                         </div>
                         <div className="glass-panel p-6 rounded-[2rem] border-teal-500/20 flex flex-col items-center justify-center">
                             <Moon size={32} className="text-teal-500 mb-2" />
                             <span className="text-2xl font-bold text-primary">0</span>
                             <span className="text-[10px] text-secondary uppercase">Taraweeh</span>
                         </div>
                     </div>
                     <div className="glass-panel p-6 rounded-[2rem] border-teal-500/20">
                        <h3 className="font-bold text-teal-500 mb-4">Daily Checklist</h3>
                        <div className="space-y-3">
                           {['Suhoor', 'Iftar', 'Taraweeh', 'Charity'].map(item => (
                              <div key={item} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl">
                                 <span className="font-medium text-primary">{item}</span>
                                 <div className="w-6 h-6 rounded-full border-2 border-teal-500/30 cursor-pointer hover:bg-teal-500/20"></div>
                              </div>
                           ))}
                        </div>
                     </div>
                </div>
            )}
            {subView === 'STATS' && <div className="text-center text-secondary py-10">Stats coming soon...</div>}
            {subView === 'AWARDS' && <AwardsView category="RAMADAN" unlocked={state.global.unlockedAchievements} />}
        </TabWrapper>
    )
}
