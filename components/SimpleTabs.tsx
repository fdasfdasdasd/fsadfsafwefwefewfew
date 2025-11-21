
import * as React from 'react';
import { useState } from 'react';
import { AppState, SubView, DailyStats } from '../types';
import { FITNESS_SCHEDULE, MEMORIZE_CONTENT, PARAH_NAMES, MASTER_ACHIEVEMENTS, getGrowthStage } from '../constants';
import { Check, Droplets, RotateCcw, Cigarette, ShieldAlert, CheckCircle2, ChevronLeft, BarChart2, Trophy, Dumbbell, Brain, Activity } from 'lucide-react';
import { LineChart, BarChart } from './Charts';

// --- SHARED LAYOUT ---
const TabWrapper: React.FC<{ children: React.ReactNode; subView: SubView; setSubView: any; headerGradient?: string }> = ({ children, subView, setSubView, headerGradient }) => (
  <div className="pb-32 animate-fade-in px-2 relative">
     {/* Subtle Header Gradient for Day Mode */}
     <div className={`absolute top-0 left-0 right-0 h-64 opacity-10 pointer-events-none rounded-b-[3rem] bg-gradient-to-b ${headerGradient || 'from-gray-500/20 to-transparent'}`} />
     
     <div className="flex items-center justify-center pt-4 mb-6 relative z-10">
        <div className="flex bg-black/5 dark:bg-black/40 rounded-full p-1 border border-black/5 dark:border-white/10 backdrop-blur-md">
           <button onClick={() => setSubView('DAILY')} className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'DAILY' ? 'bg-white text-black shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>Daily</button>
           <button onClick={() => setSubView('STATS')} className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'STATS' ? 'bg-white text-black shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>Stats</button>
           <button onClick={() => setSubView('AWARDS')} className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'AWARDS' ? 'bg-white text-black shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>Awards</button>
        </div>
     </div>
     {children}
  </div>
);

const GrowthCard: React.FC<{ stage: { icon: string, label: string }, streak: number, color: string }> = ({ stage, streak, color }) => (
  <div className={`glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden border-${color}-500/20 shadow-xl mb-6 group`}>
    <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent opacity-50`}></div>
    <div className={`absolute -right-12 -top-12 text-${color}-500/10 transform rotate-12 transition-transform duration-700 group-hover:rotate-0`}>
       <Trophy size={200} />
    </div>
    <div className="relative z-10">
        <div className="text-6xl mb-4 drop-shadow-2xl animate-bounce">{stage.icon}</div>
        <h3 className="text-5xl font-light mb-1 tracking-tighter text-primary">{streak}<span className="text-lg font-normal opacity-50 ml-1">Days</span></h3>
        <p className={`text-[10px] text-${color}-500 font-bold tracking-[0.2em] uppercase`}>Stage: {stage.label}</p>
    </div>
  </div>
);

const AwardsView: React.FC<{ category: string; unlocked: string[] }> = ({ category, unlocked }) => {
  const list = MASTER_ACHIEVEMENTS.filter(a => a.category === category);
  return (
    <div className="space-y-3 pt-2">
      {list.map(ach => {
        const isUnlocked = unlocked.includes(ach.id);
        return (
          <div key={ach.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${isUnlocked ? 'glass-panel border-emerald-500/30 bg-emerald-500/5' : 'glass-panel opacity-50 grayscale'}`}>
             <div className="text-xl">{ach.icon}</div>
             <div className="flex-1">
                <div className="flex justify-between">
                   <h4 className={`font-bold text-xs ${isUnlocked ? 'text-primary' : 'text-gray-500'}`}>{ach.title}</h4>
                   {isUnlocked && <CheckCircle2 size={14} className="text-emerald-500" />}
                </div>
                <p className="text-[9px] text-gray-500 mt-1">{ach.description}</p>
             </div>
          </div>
        );
      })}
    </div>
  );
};

// --- DHIKR TAB ---
export const TabDhikr: React.FC<{ state: AppState; updateDhikr: (type: 'astaghfirullah' | 'rabbiInni', amt: number) => void }> = ({ state, updateDhikr }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('DHIKR', state.global.streaks.dhikr);
  
  const renderStats = () => {
      const history = state.global.history.slice(-7);
      // Create dummy data if history is empty for visualization
      const data = history.length ? history.map(d => d.dhikrAstaghfirullah + d.dhikrRabbiInni) : [0, 0, 0, 0, 0, 0, 0];
      return (
          <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><Activity size={18} className="text-amber-500"/> Dhikr Volume</h3>
             <LineChart data={data} color="amber" />
             <p className="text-center text-[10px] text-gray-500 mt-4">Total Recitations per Day</p>
          </div>
      );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} headerGradient="from-amber-500/20 to-transparent">
      {subView === 'DAILY' && (
        <div className="space-y-6">
          <GrowthCard stage={stage} streak={state.global.streaks.dhikr} color="amber" />
          
          <div className="grid grid-cols-1 gap-6">
              <DhikrTasbeeh 
                title="Astaghfirullah" 
                arabic="أَسْتَغْفِرُ ٱللَّهَ" 
                count={state.daily.dhikrAstaghfirullah} 
                target={2100} 
                onTap={(amt: number) => updateDhikr('astaghfirullah', amt)} 
                color="amber" 
              />
              <DhikrTasbeeh 
                title="Dua of Yunus" 
                arabic="رَبِّ إِنِّي لِمَآ أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ" 
                count={state.daily.dhikrRabbiInni} 
                target={2100} 
                onTap={(amt: number) => updateDhikr('rabbiInni', amt)} 
                color="yellow" 
              />
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

  return (
    <div className={`glass-panel p-6 rounded-[2.5rem] border-${color}-500/20 relative overflow-hidden active:scale-[0.98] transition-all duration-100 cursor-pointer group shadow-lg`} onClick={() => onTap(1)}>
       <div className="absolute top-6 right-6 z-10">
          <button onClick={(e) => { e.stopPropagation(); onTap(100); }} className="bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-black/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/5 text-primary">+100</button>
       </div>
       
       <div className="flex flex-col items-center justify-center gap-6 pt-4">
           <div className="relative w-40 h-40 flex-shrink-0">
              <div className={`absolute inset-0 bg-${color}-500/10 blur-2xl rounded-full scale-75 animate-pulse-slow`}></div>
              <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                 <circle cx="50%" cy="50%" r="45" className="stroke-black/5 dark:stroke-white/5 fill-transparent" strokeWidth="8" />
                 <circle 
                    cx="50%" cy="50%" r="45" 
                    className={`stroke-${color}-500 fill-transparent transition-all duration-300 ease-out`} 
                    strokeWidth="8" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset} 
                    strokeLinecap="round"
                 />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-mono font-bold tracking-tighter text-primary">{count}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">/ {target}</span>
              </div>
           </div>
           <div className="text-center pb-2">
              <p className="text-3xl font-arabic leading-relaxed drop-shadow-md mb-2 text-primary" dir="rtl">{arabic}</p>
              <h3 className="text-xs text-gray-500 uppercase tracking-[0.2em]">{title}</h3>
           </div>
       </div>
    </div>
  );
};

// --- HYGIENE & HABITS TAB ---
export const TabHygiene: React.FC<{ state: AppState; updateHygiene: any; updateHabit: any }> = ({ state, updateHygiene, updateHabit }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('HYGIENE', state.global.streaks.hygiene);
  
  const renderStats = () => {
      const history = state.global.history.slice(-7);
      const data = history.length ? history.map(d => (d.hygiene.shower ? 1 : 0) + (d.hygiene.brush ? 1 : 0) + (d.hygiene.waterGlasses >= 8 ? 1 : 0)) : [0,0,0,0,0,0,0];
      return (
          <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><Droplets size={18} className="text-cyan-500"/> Hygiene Score</h3>
             <BarChart data={data} labels={['M','T','W','T','F','S','S']} color="cyan" maxVal={3} />
             <p className="text-center text-[10px] text-gray-500 mt-4">Tasks Completed (Max 3)</p>
          </div>
      );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} headerGradient="from-cyan-500/20 to-transparent">
       {subView === 'DAILY' && (
         <div className="space-y-6">
            <GrowthCard stage={stage} streak={state.global.streaks.hygiene} color="cyan" />
            <div className="glass-panel p-6 rounded-[2rem] border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-500 mb-6">Hygiene</h2>
              <div className="space-y-4">
                 <button onClick={() => updateHygiene('shower')} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-95 ${state.daily.hygiene.shower ? 'bg-cyan-500 text-white shadow-lg' : 'bg-black/5 dark:bg-white/5 text-gray-400'}`}>
                    <span className="font-bold">Shower</span>
                    {state.daily.hygiene.shower && <Check size={18} />}
                 </button>
                 <button onClick={() => updateHygiene('brush')} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-95 ${state.daily.hygiene.brush ? 'bg-cyan-500 text-white shadow-lg' : 'bg-black/5 dark:bg-white/5 text-gray-400'}`}>
                    <span className="font-bold">Brush Teeth</span>
                    {state.daily.hygiene.brush && <Check size={18} />}
                 </button>
                 <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl">
                    <div className="flex justify-between text-sm mb-2">
                       <span className="text-gray-500">Water Intake</span>
                       <span className="font-bold text-cyan-500">{state.daily.hygiene.waterGlasses} / 8</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-black/40 rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-cyan-400 transition-all" style={{ width: `${(state.daily.hygiene.waterGlasses / 8) * 100}%` }} />
                    </div>
                    <button onClick={() => updateHygiene('water')} className="w-full py-2 bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 rounded-lg text-sm font-bold active:scale-95">+ Add Cup</button>
                 </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-[2rem] border-red-500/20">
              <h2 className="text-xl font-bold text-red-500 mb-6">Habit Control</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className={`p-4 rounded-xl border active:scale-[0.98] transition-transform ${state.daily.habits.smokingCount > 2 ? 'bg-red-900/20 border-red-500' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
                    <div className="flex justify-between mb-2">
                       <Cigarette size={18} className="text-gray-400" />
                       <span className={`font-bold ${state.daily.habits.smokingCount > 2 ? 'text-red-500' : 'text-primary'}`}>{state.daily.habits.smokingCount} / 2</span>
                    </div>
                    <button onClick={() => updateHabit('smoking')} className="w-full py-2 mt-2 bg-white/50 dark:bg-white/5 rounded-lg text-xs font-bold hover:bg-white/80 dark:hover:bg-white/10 active:scale-95 text-primary">+ Log</button>
                 </div>
                 <div className={`p-4 rounded-xl border active:scale-[0.98] transition-transform ${state.daily.habits.nicotineCount > 3 ? 'bg-red-900/20 border-red-500' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
                    <div className="flex justify-between mb-2">
                       <ShieldAlert size={18} className="text-gray-400" />
                       <span className={`font-bold ${state.daily.habits.nicotineCount > 3 ? 'text-red-500' : 'text-primary'}`}>{state.daily.habits.nicotineCount} / 3</span>
                    </div>
                    <button onClick={() => updateHabit('nicotine')} className="w-full py-2 mt-2 bg-white/50 dark:bg-white/5 rounded-lg text-xs font-bold hover:bg-white/80 dark:hover:bg-white/10 active:scale-95 text-primary">+ Log</button>
                 </div>
              </div>
              {state.daily.habits.failedToday && <div className="mt-4 text-center text-xs text-red-500 font-bold bg-red-500/10 p-2 rounded-lg">LIMIT EXCEEDED - STREAK RESET</div>}
            </div>
         </div>
       )}
       {subView === 'STATS' && renderStats()}
       {subView === 'AWARDS' && (
         <div className="space-y-6">
            <div><h3 className="text-cyan-500 font-bold px-2 mb-2">Hygiene Awards</h3><AwardsView category="HYGIENE" unlocked={state.global.unlockedAchievements} /></div>
            <div><h3 className="text-red-500 font-bold px-2 mb-2">Habit Awards</h3><AwardsView category="HABITS" unlocked={state.global.unlockedAchievements} /></div>
         </div>
       )}
    </TabWrapper>
  );
};

// --- QURAN TAB ---
export const TabQuran: React.FC<{ state: AppState; updatePart: any; updateSurah: any }> = ({ state, updatePart, updateSurah }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('QURAN', state.global.streaks.quranSurah);
  
  const renderStats = () => {
      const history = state.global.history.slice(-7);
      const data = history.length ? history.map(d => (d.quranParts.rub ? 1 : 0) + (d.quranParts.nisf ? 1 : 0) + (d.quranParts.thalatha ? 1 : 0) + (d.quranParts.kamil ? 1 : 0)) : [0,0,0,0,0,0,0];
      return (
          <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><Brain size={18} className="text-purple-500"/> Reading Intensity</h3>
             <BarChart data={data} labels={['M','T','W','T','F','S','S']} color="purple" maxVal={4} />
             <p className="text-center text-[10px] text-gray-500 mt-4">Parts Completed per Day</p>
          </div>
      );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} headerGradient="from-purple-500/20 to-transparent">
      {subView === 'DAILY' && (
        <div className="space-y-6">
          <GrowthCard stage={stage} streak={state.global.streaks.quranSurah} color="purple" />

          <div className="glass-panel p-8 rounded-[2rem] text-center border-purple-500/20 bg-gradient-to-br from-purple-600/10 to-transparent relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 text-[10px] bg-purple-500/20 text-purple-500 font-bold px-2 py-1 rounded">PARAH {state.global.currentParah}</div>
            <h1 className="text-5xl font-arabic mb-2 pt-4 drop-shadow-lg text-primary" dir="rtl">{PARAH_NAMES[state.global.currentParah - 1]}</h1>
            <p className="text-purple-400 uppercase tracking-[0.3em] text-[10px] mb-8">Current Parah</p>
            
            <div className="relative w-56 h-56 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-black/5 dark:border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.1)]"></div>
                {/* Arabic Labels: Rub (Quarter), Nisf (Half), Thalatha (3/4), Kamil (Full) */}
                <div onClick={() => updatePart('rub')} className={`absolute top-0 left-0 w-1/2 h-1/2 bg-purple-500 rounded-tl-full cursor-pointer transition-all duration-300 border-[1px] border-black/20 active:scale-[0.95] hover:brightness-110 flex items-center justify-center ${state.daily.quranParts.rub ? 'opacity-100 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'opacity-10 hover:opacity-20'}`}><span className="text-white font-bold font-arabic text-xl transform translate-x-3 translate-y-3">رُبُع</span></div>
                <div onClick={() => updatePart('nisf')} className={`absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-tr-full cursor-pointer transition-all duration-300 border-[1px] border-black/20 active:scale-[0.95] hover:brightness-110 flex items-center justify-center ${state.daily.quranParts.nisf ? 'opacity-100 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'opacity-10 hover:opacity-20'}`}><span className="text-white font-bold font-arabic text-xl transform -translate-x-3 translate-y-3">نِصْف</span></div>
                <div onClick={() => updatePart('thalatha')} className={`absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-br-full cursor-pointer transition-all duration-300 border-[1px] border-black/20 active:scale-[0.95] hover:brightness-110 flex items-center justify-center ${state.daily.quranParts.thalatha ? 'opacity-100 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'opacity-10 hover:opacity-20'}`}><span className="text-white font-bold font-arabic text-lg transform -translate-x-3 -translate-y-3">ثَلَاثَة</span></div>
                <div onClick={() => updatePart('kamil')} className={`absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500 rounded-bl-full cursor-pointer transition-all duration-300 border-[1px] border-black/20 active:scale-[0.95] hover:brightness-110 flex items-center justify-center ${state.daily.quranParts.kamil ? 'opacity-100 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'opacity-10 hover:opacity-20'}`}><span className="text-white font-bold font-arabic text-xl transform translate-x-3 -translate-y-3">كَامِل</span></div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 shadow-inner flex items-center justify-center z-20 pointer-events-none">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Read</span>
                </div>
            </div>
            <p className="text-xs text-gray-500">Tap sections to mark progress</p>
          </div>

          <div className="space-y-3">
             <h3 className="text-xs text-gray-500 uppercase tracking-widest px-2">Daily Protection</h3>
             <button onClick={() => updateSurah('mulk')} className={`w-full p-4 rounded-xl flex justify-between items-center transition-all active:scale-95 ${state.daily.surahMulk ? 'bg-purple-600 text-white shadow-lg' : 'glass-panel text-gray-500 dark:text-gray-400'}`}>
                <span className="font-bold">Surah Al-Mulk</span>
                {state.daily.surahMulk && <Check size={16} />}
             </button>
             <button onClick={() => updateSurah('baqarah')} className={`w-full p-4 rounded-xl flex justify-between items-center transition-all active:scale-95 ${state.daily.surahBaqarah ? 'bg-purple-600 text-white shadow-lg' : 'glass-panel text-gray-500 dark:text-gray-400'}`}>
                <span className="font-bold">Last 2 Ayah of Baqarah</span>
                {state.daily.surahBaqarah && <Check size={16} />}
             </button>
          </div>
        </div>
      )}
      {subView === 'STATS' && renderStats()}
      {subView === 'AWARDS' && <AwardsView category="QURAN" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

// --- MDF TAB ---
export const TabMDF: React.FC<{ state: AppState; resetRelapse: () => void }> = ({ state, resetRelapse }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('MDF', state.global.streaks.mdf);
  const [timeString, setTimeString] = useState("");
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - (state.global.lastRelapseDate || Date.now());
      setTimeString(`${Math.floor(diff / (1000 * 60 * 60 * 24))}d ${Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h`);
    }, 1000);
    return () => clearInterval(interval);
  }, [state.global.lastRelapseDate]);

  const renderStats = () => {
    const history = state.global.history.slice(-7);
    const data = history.length ? history.map(d => !d.habits.failedToday ? 1 : 0) : [0,0,0,0,0,0,0];
    return (
        <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><ShieldAlert size={18} className="text-rose-500"/> Clean Days</h3>
             <BarChart data={data} labels={['','','','','','','']} color="rose" maxVal={1} />
             <p className="text-center text-[10px] text-gray-500 mt-4">Last 7 Days Consistency</p>
        </div>
    );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} headerGradient="from-rose-500/20 to-transparent">
      {subView === 'DAILY' && (
        <div className="space-y-8 flex flex-col h-full pt-6">
           <GrowthCard stage={stage} streak={state.global.streaks.mdf} color="rose" />

           <div className="flex-1 flex flex-col items-center justify-center">
             <div className="w-72 h-72 rounded-full glass-panel border border-rose-500/20 flex flex-col items-center justify-center relative shadow-[0_0_60px_rgba(244,63,94,0.1)]">
               <div className="absolute inset-0 rounded-full border border-rose-500/10 animate-ping opacity-20"></div>
               <div className="text-[10px] text-rose-500 uppercase tracking-[0.3em] mb-4">Clean Streak</div>
               <div className="text-4xl font-mono font-bold tracking-tighter text-center px-4 text-primary">{timeString}</div>
             </div>
           </div>
           <div className="px-4 space-y-4">
            <button onClick={resetRelapse} className="w-full py-5 bg-rose-600 hover:bg-rose-700 rounded-2xl font-bold text-white shadow-lg shadow-rose-500/30 active:scale-95 transition-all text-lg tracking-wide">🚨 PANIC BUTTON / RELAPSE</button>
            <p className="text-center text-gray-500 text-xs">Only click if you failed.</p>
           </div>
        </div>
      )}
      {subView === 'STATS' && renderStats()}
      {subView === 'AWARDS' && <AwardsView category="MDF" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

// --- FITNESS TAB ---
export const TabFitness: React.FC<{ state: AppState; logWeight: (w: number) => void }> = ({ state, logWeight }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('FITNESS', state.global.streaks.fitness);
  const todayIdx = new Date().getDay();
  
  const renderStats = () => {
     const history = state.global.history.slice(-7);
     const data = history.length ? history.map(d => d.fitness.type !== 'Rest' ? 1 : 0) : [0,0,0,0,0,0,0];
     return (
         <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><Dumbbell size={18} className="text-orange-500"/> Workout Frequency</h3>
             <BarChart data={data} labels={['M','T','W','T','F','S','S']} color="orange" maxVal={1} />
             <p className="text-center text-[10px] text-gray-500 mt-4">Active Days</p>
         </div>
     );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} headerGradient="from-orange-500/20 to-transparent">
       {subView === 'DAILY' && (
         <div className="space-y-6">
            <GrowthCard stage={stage} streak={state.global.streaks.fitness} color="orange" />
            
            <div className="glass-panel p-6 rounded-[2rem] border-orange-500/20 relative overflow-hidden">
               <div className="absolute -right-10 -top-10 opacity-10 rotate-12 text-orange-500"><Dumbbell size={150} /></div>
               <h2 className="text-xl font-bold text-orange-500 mb-1">Today's Plan</h2>
               <p className="text-4xl font-light mb-6 text-primary">{FITNESS_SCHEDULE[todayIdx]}</p>
               
               <div className="space-y-3">
                  <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5">
                     <div className="flex justify-between mb-2"><span className="font-bold text-sm text-primary">Pushups</span><span className="text-orange-500 font-mono">0</span></div>
                     <div className="flex gap-2">
                        <button className="flex-1 bg-black/5 dark:bg-white/10 py-2 rounded-lg active:scale-95 text-primary">-</button>
                        <button className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-lg active:scale-95">+</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}
       {subView === 'STATS' && renderStats()}
       {subView === 'AWARDS' && <div className="text-center text-gray-500 text-xs py-10">No Fitness Awards Yet</div>}
    </TabWrapper>
  );
};

// --- MEMORIZE TAB ---
export const TabMemorize: React.FC<{ state: AppState; completeReview: () => void }> = ({ state, completeReview }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const [isFlipped, setIsFlipped] = useState(false);
  const currentDua = MEMORIZE_CONTENT[state.global.memorizeWeek - 1] || MEMORIZE_CONTENT[0];
  
  const renderStats = () => {
     const history = state.global.history.slice(-7);
     const data = history.length ? history.map(d => d.completedDuaReview ? 1 : 0) : [0,0,0,0,0,0,0];
     return (
         <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><Brain size={18} className="text-pink-500"/> Study Consistency</h3>
             <BarChart data={data} labels={['M','T','W','T','F','S','S']} color="pink" maxVal={1} />
             <p className="text-center text-[10px] text-gray-500 mt-4">Days Reviewed</p>
         </div>
     );
  };

  return (
    <TabWrapper subView={subView} setSubView={setSubView} headerGradient="from-pink-500/20 to-transparent">
      {subView === 'DAILY' && (
        <div className="space-y-8 py-10 px-4">
           <div className="text-center">
              <h2 className="text-xl font-bold text-pink-500 mb-1">Weekly Memorization</h2>
              <p className="text-xs text-gray-500">Week {state.global.memorizeWeek}</p>
           </div>
           
           <div className="perspective-1000 w-full h-80 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                 {/* Front */}
                 <div className="absolute inset-0 backface-hidden glass-panel rounded-[2rem] border-pink-500/30 flex flex-col items-center justify-center p-6 shadow-xl bg-gradient-to-br from-pink-500/5 to-transparent">
                    <div className="text-pink-500/50 mb-4"><Brain size={40} /></div>
                    <p className="text-3xl font-arabic text-center leading-loose text-primary" dir="rtl">{currentDua.arabic}</p>
                    <p className="text-[10px] text-pink-400 mt-8 uppercase tracking-widest">Tap to Flip</p>
                 </div>
                 {/* Back */}
                 <div className="absolute inset-0 backface-hidden glass-panel rounded-[2rem] border-pink-500/30 flex flex-col items-center justify-center p-6 rotate-y-180 bg-pink-900/10">
                    <p className="text-lg text-center font-light text-primary">{currentDua.english}</p>
                    <p className="text-[10px] text-pink-400 mt-8 uppercase tracking-widest">Tap to Flip Back</p>
                 </div>
              </div>
           </div>

           <button onClick={() => { if(navigator.vibrate) navigator.vibrate(20); completeReview(); }} disabled={state.daily.completedDuaReview} className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest transition-all active:scale-95 ${state.daily.completedDuaReview ? 'bg-green-500/20 text-green-500 cursor-default' : 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20'}`}>
             {state.daily.completedDuaReview ? 'REVIEWED TODAY' : 'MARK AS REVIEWED'}
           </button>
        </div>
      )}
       {subView === 'STATS' && renderStats()}
       {subView === 'AWARDS' && <AwardsView category="DUA" unlocked={state.global.unlockedAchievements} />}
    </TabWrapper>
  );
};

// --- RAMADAN TAB ---
export const TabRamadan: React.FC<{ state: AppState; updateTask: any }> = ({ state, updateTask }) => {
    const stage = getGrowthStage('RAMADAN', state.global.streaks.ramadan);
    return (
        <div className="pb-32 animate-fade-in px-2 pt-6 space-y-6 relative">
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-500/20 to-transparent opacity-30 pointer-events-none rounded-b-[3rem]" />
            <div className="flex items-center gap-3 text-emerald-500 mb-4 px-2 relative z-10">
                <ChevronLeft className="opacity-0" /> 
                <h2 className="text-2xl font-bold">Ramadan Mubarak</h2>
            </div>
            <GrowthCard stage={stage} streak={state.global.streaks.ramadan} color="emerald" />
            <div className="glass-panel p-6 rounded-[2rem] border-emerald-500/20 space-y-3">
                {[
                    { key: 'fasting', label: 'Fasting (Sawm)' },
                    { key: 'salah', label: '5 Prayers + Taraweeh' },
                    { key: 'quran', label: 'Quran Read Today' },
                    { key: 'charity', label: 'Charity (Sadaqah)' },
                    { key: 'spiritual', label: 'No Anger / Backbiting' }
                ].map((task: any) => (
                    <button key={task.key} onClick={() => updateTask(task.key)} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-95 ${state.daily.ramadan[task.key as keyof typeof state.daily.ramadan] ? 'bg-emerald-600 text-white shadow-lg' : 'bg-black/5 dark:bg-white/5 text-gray-400'}`}>
                        <span className="font-bold">{task.label}</span>
                        {state.daily.ramadan[task.key as keyof typeof state.daily.ramadan] && <Check size={20} />}
                    </button>
                ))}
            </div>
        </div>
    );
};
