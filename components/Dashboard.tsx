
import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Moon, Activity, Droplets, Flame, Lock, Calendar, Sparkles, Tent, ShieldCheck, Snowflake, Maximize2, ArrowRight
} from 'lucide-react';
import { AppState, ViewState } from '../types';
import { DUAS } from '../constants';

interface Props {
  state: AppState;
  changeView: (view: ViewState) => void;
}

export const Dashboard: React.FC<Props> = ({ state, changeView }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const hour = new Date().getHours();
    if (hour < 5) setGreeting('Tahajjud Time');
    else if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else if (hour < 21) setGreeting('Good Evening');
    else setGreeting('Rest Well');
    return () => clearInterval(timer);
  }, []);

  const isOddDay = currentTime.getDate() % 2 !== 0;
  const badgeText = isOddDay ? "Sabar" : "Tawaqqal";
  const duaIndex = currentTime.getDate() % DUAS.length;
  const dailyDua = DUAS[duaIndex];
  const xpProgress = (state.global.xp % 1000) / 10; 

  return (
    <div className="pb-32 space-y-5 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex justify-between items-end px-4 pt-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
            <p className="text-emerald-500 text-[10px] font-bold tracking-[0.25em] uppercase">System Online</p>
          </div>
          <h1 className="text-3xl font-light text-primary tracking-tight transition-colors">
            {greeting}, <span className="font-medium block text-4xl mt-1 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">{state.global.name}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Streak Freeze Count Indicator */}
           {state.global.streakFreezes > 0 && (
             <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse-slow cursor-pointer" onClick={() => changeView(ViewState.SETTINGS)}>
                <div className="relative">
                   <Snowflake size={20} />
                   <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-black">{state.global.streakFreezes}</div>
                </div>
             </div>
           )}

           {/* Zen / Widget Mode (Free Mode) */}
           <button onClick={() => changeView(ViewState.WIDGET)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 active:scale-95 shadow-lg group">
              <Maximize2 size={20} className="group-hover:scale-110 transition-transform" />
           </button>

           <div onClick={() => changeView(ViewState.SETTINGS)} className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 border border-white/10 flex items-center justify-center shadow-xl cursor-pointer active:scale-95 transition-all group overflow-hidden">
             {state.global.ramadanMode ? (
                <Moon size={20} className="text-amber-400 fill-amber-400 animate-pulse-slow" />
             ) : (
                <span className="font-bold text-lg text-primary/80 group-hover:text-primary">{state.global.name.charAt(0)}</span>
             )}
           </div>
        </div>
      </div>

      {/* Hero Card - Premium Dark */}
      <div className="mx-2 relative overflow-hidden group rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl border border-white/10 text-white min-h-[280px] flex flex-col justify-between p-8 transition-all hover:shadow-emerald-900/20">
        <div className="absolute top-0 right-0 p-10 opacity-5 transform rotate-12 group-hover:rotate-0 transition-transform duration-1000">
           <Sparkles size={180} className="text-white" />
        </div>
        
        {/* Top Row */}
        <div className="relative z-10 flex justify-between items-start">
           <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white/60 font-medium text-xs uppercase tracking-wider">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                <span className="bg-emerald-500/20 px-3 py-1 rounded-full text-[10px] border border-emerald-500/30 text-emerald-300 tracking-wider font-bold uppercase backdrop-blur-sm animate-pulse-slow">🎯 {badgeText}</span>
              </div>
              <h2 className="text-6xl font-light tracking-tighter font-sans text-white drop-shadow-2xl tabular-nums">
                {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </h2>
           </div>
           
           <div className="text-center bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/5 min-w-[90px] shadow-lg group-hover:bg-white/10 transition-colors">
               <div className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Iman Score</div>
               <div className={`text-3xl font-bold ${state.daily.imanScore >= 80 ? 'text-emerald-400' : state.daily.imanScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                 {Math.round(state.daily.imanScore)}
               </div>
            </div>
        </div>

        {/* Middle: Dua */}
        <div className="relative z-10 my-6 pl-4 border-l-2 border-white/10">
             <p className="text-2xl font-serif leading-relaxed text-white/90 drop-shadow-md text-right" dir="rtl">{dailyDua.arabic}</p>
             <p className="text-xs text-white/50 leading-relaxed font-medium mt-2 max-w-[90%] italic">{dailyDua.english}</p>
        </div>

        {/* Bottom: XP Bar */}
        <div className="relative z-10 flex items-center gap-4">
            <span className="text-[10px] font-bold text-white/40 w-12">LVL {state.global.level}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out rounded-full" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="text-[10px] font-bold text-white/40 w-14 text-right">{state.global.xp} XP</span>
        </div>
      </div>

      {/* RAMADAN WIDGET - Shows when mode enabled */}
      {state.global.ramadanMode && (
        <div onClick={() => changeView(ViewState.RAMADAN)} className="mx-2 bg-gradient-to-r from-[#0f172a] to-[#020617] border border-teal-500/30 p-0 rounded-[2.5rem] relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all group shadow-lg shadow-teal-900/10">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>
           <div className="absolute right-0 top-0 p-6 opacity-20 text-teal-500 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-700"><Tent size={100} /></div>
           
           <div className="p-6 flex items-center justify-between relative z-10">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <Moon size={16} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-amber-400 uppercase tracking-[0.2em] font-bold">Ramadan Live</span>
                  </div>
                  <h3 className="text-2xl font-serif text-white">Day {state.global.streaks.ramadan}</h3>
                  <p className="text-xs text-slate-400 mt-1">Tap to track Iftar & Taraweeh</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-black transition-all">
                  <ArrowRight size={20} />
              </div>
           </div>
           
           {/* Progress Line */}
           <div className="h-1 w-full bg-white/5">
              <div className="h-full bg-gradient-to-r from-teal-600 to-amber-400 w-[30%] shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
           </div>
        </div>
      )}

      {/* Bento Grid - Modernized */}
      <div className="grid grid-cols-2 gap-3 px-2">
        <Widget 
          title="Salah" 
          status={state.daily.prayers.every(p => p.completed) ? "Complete" : "Tracking"} 
          statusColor={state.daily.prayers.every(p => p.completed) ? "text-emerald-400" : "text-blue-400"}
          icon={<Moon size={18} />} 
          bgIcon={<Moon size={80} />} 
          value={`${state.daily.prayers.filter(p => p.completed).length}/6`} 
          label="Prayers" 
          streak={state.global.streaks.salah} 
          onClick={() => changeView(ViewState.SALAH)} 
          gradient="from-emerald-500/20 to-emerald-900/10" 
          border="border-emerald-500/20"
          progress={state.daily.prayers.filter(p => p.completed).length / 6}
        />

        <Widget 
          title="Dhikr" 
          status="Active" 
          statusColor="text-amber-400"
          icon={<Activity size={18} />} 
          bgIcon={<Activity size={80} />} 
          value={`${state.daily.dhikrAstaghfirullah + state.daily.dhikrRabbiInni}`} 
          label="Total" 
          streak={state.global.streaks.dhikr} 
          onClick={() => changeView(ViewState.DHIKR)} 
          gradient="from-amber-500/20 to-amber-900/10" 
          border="border-amber-500/20"
          progress={Math.min(1, (state.daily.dhikrAstaghfirullah + state.daily.dhikrRabbiInni) / 4200)}
        />

        <Widget 
          title="MDF" 
          status="Guarded" 
          statusColor="text-rose-400"
          icon={<Lock size={18} />} 
          bgIcon={<Lock size={80} />} 
          value={`${Math.floor((Date.now() - (state.global.lastRelapseDate || 0)) / (1000 * 60 * 60 * 24))}d`} 
          label="Streak" 
          streak={state.global.streaks.mdf} 
          onClick={() => changeView(ViewState.MDF)} 
          gradient="from-rose-500/20 to-rose-900/10" 
          border="border-rose-500/20"
          progress={1}
        />

        <Widget 
          title="Quran" 
          status="Reading" 
          statusColor="text-purple-400"
          icon={<Calendar size={18} />} 
          bgIcon={<Calendar size={80} />} 
          value={`Parah ${state.global.currentParah}`} 
          label="Progress" 
          streak={state.global.streaks.quranSurah} 
          onClick={() => changeView(ViewState.QURAN)} 
          gradient="from-purple-500/20 to-purple-900/10" 
          border="border-purple-500/20"
          progress={Object.values(state.daily.quranParts).filter(Boolean).length / 4}
        />

         <Widget 
          title="Hygiene" 
          status="Clean" 
          statusColor="text-cyan-400"
          icon={<Droplets size={18} />} 
          bgIcon={<Droplets size={80} />} 
          value={`${(state.daily.hygiene.waterGlasses)}/8`} 
          label="Cups" 
          streak={state.global.streaks.hygiene} 
          onClick={() => changeView(ViewState.HYGIENE)} 
          gradient="from-cyan-500/20 to-cyan-900/10" 
          border="border-cyan-500/20"
          progress={Math.min(1, state.daily.hygiene.waterGlasses / 8)}
        />

        <Widget 
          title="Habits" 
          status={state.daily.habits.failedToday ? "Failed" : "Control"} 
          statusColor={state.daily.habits.failedToday ? "text-red-500" : "text-slate-400"}
          icon={<ShieldCheck size={18} />} 
          bgIcon={<ShieldCheck size={80} />} 
          value={state.daily.habits.failedToday ? "Reset" : "Safe"} 
          label="Discipline" 
          streak={state.global.streaks.habits} 
          onClick={() => changeView(ViewState.HYGIENE)} 
          gradient="from-slate-500/20 to-slate-900/10" 
          border="border-slate-500/20"
          progress={state.daily.habits.failedToday ? 0 : 1}
        />
      </div>
    </div>
  );
};

const Widget: React.FC<any> = ({ title, status, statusColor, icon, bgIcon, value, label, streak, onClick, gradient, border, progress }) => (
  <div onClick={onClick} className={`glass-panel p-5 rounded-[2.2rem] relative overflow-hidden group cursor-pointer transition-all duration-300 active:scale-[0.96] flex flex-col justify-between h-44 ${border} shadow-lg hover:shadow-2xl hover:border-opacity-50`}>
    {/* Dynamic gradient background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 transition-opacity duration-500 group-hover:opacity-60`} />
    <div className={`absolute -right-6 -bottom-6 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-all duration-700 ${statusColor}`}>{bgIcon}</div>
    
    <div className="flex justify-between items-start z-10">
      <div className={`p-2.5 rounded-2xl bg-white/5 backdrop-blur-md ${statusColor} shadow-inner border border-white/5 group-hover:bg-white/10 transition-colors`}>{icon}</div>
      <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg border border-white/5 backdrop-blur-sm"><span className={`text-[9px] font-bold uppercase tracking-wider ${statusColor}`}>{status}</span></div>
    </div>
    
    <div className="z-10 mt-auto">
      <h3 className="text-3xl font-bold text-primary tracking-tighter mb-2 flex items-baseline gap-1">{value}</h3>
      
      {/* Modern Progress Bar */}
      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden mb-2 backdrop-blur-sm">
         <div className={`h-full rounded-full transition-all duration-1000 ease-out ${statusColor.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`} style={{ width: `${progress * 100}%` }}></div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] text-secondary font-medium uppercase tracking-widest opacity-70">{label}</span>
        <div className="flex items-center gap-1 text-primary/80"><Flame size={12} className="text-orange-400 fill-orange-400 animate-pulse" /><span className="text-[10px] font-bold font-mono">{streak}</span></div>
      </div>
    </div>
  </div>
);
