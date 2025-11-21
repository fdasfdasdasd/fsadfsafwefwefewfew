
import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Moon, Activity, Droplets, Flame, Lock, Calendar, Sparkles, Tent, ShieldCheck, Snowflake
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
    <div className="pb-32 space-y-4 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex justify-between items-end px-2 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            <p className="text-emerald-500 text-[10px] font-bold tracking-[0.2em] uppercase">Online</p>
          </div>
          <h1 className="text-3xl font-light text-primary tracking-tight transition-colors">
            {greeting}, <span className="font-medium">{state.global.name}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Freeze Indicator */}
           {(state.global.streakFreezes || 0) > 0 && (
              <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
                 <Snowflake size={12} className="text-blue-400" />
                 <span className="text-[10px] font-bold text-blue-300">{state.global.streakFreezes}</span>
              </div>
           )}

           <div onClick={() => changeView(ViewState.SETTINGS)} className="w-11 h-11 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shadow-lg cursor-pointer active:scale-95 transition-all">
             <span className="font-bold text-sm text-primary/80">{state.global.name.charAt(0)}</span>
           </div>
        </div>
      </div>

      {/* Hero Card - Forced Dark Mode for Premium Contrast */}
      <div className="relative overflow-hidden group rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border border-white/10 text-white">
        <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
           <Sparkles size={140} className="text-white" />
        </div>
        
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/60 font-medium text-xs uppercase tracking-wider">{currentTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
                <span className="bg-white/10 px-3 py-0.5 rounded-full text-[10px] border border-white/10 text-emerald-200 tracking-wider font-bold uppercase">🎯 {badgeText}</span>
              </div>
              <h2 className="text-6xl font-light tracking-tighter font-sans text-white drop-shadow-xl">
                {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </h2>
            </div>
            <div className="text-center bg-white/5 p-3 rounded-2xl backdrop-blur-md border border-white/5 min-w-[80px]">
               <div className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Iman</div>
               <div className={`text-2xl font-bold ${state.daily.imanScore >= 80 ? 'text-emerald-400' : state.daily.imanScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                 {Math.round(state.daily.imanScore)}
               </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-xl p-4 border border-white/5 mb-4 relative overflow-hidden">
            <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-emerald-500 rounded-full"></div>
            <div className="pl-3">
                <p className="text-right text-lg mb-1 font-serif leading-loose text-white/90" dir="rtl">{dailyDua.arabic}</p>
                <p className="text-left text-[10px] text-white/50 leading-relaxed font-medium">{dailyDua.english}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-white/40 w-12">LVL {state.global.level}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-1000 ease-out rounded-full" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="text-[10px] font-bold text-white/40 w-12 text-right">{state.global.xp} XP</span>
          </div>
        </div>
      </div>

      {/* RAMADAN WIDGET */}
      {state.global.ramadanMode && (
        <div onClick={() => changeView(ViewState.RAMADAN)} className="bg-gradient-to-r from-emerald-900/60 to-emerald-800/60 border border-emerald-500/30 p-5 rounded-[1.5rem] flex items-center justify-between shadow-lg cursor-pointer active:scale-95 transition-all relative overflow-hidden">
           <div className="absolute -right-5 -bottom-5 opacity-10 text-emerald-200"><Tent size={100} /></div>
           <div className="relative z-10">
              <h4 className="font-bold text-emerald-100 text-lg flex items-center gap-2"><Moon size={18} className="fill-emerald-200" /> Ramadan Mode</h4>
              <p className="text-xs text-emerald-200/60 mt-1">Track Fasting, Taraweeh & Goals</p>
           </div>
           <div className="relative z-10 text-center">
              <div className="text-2xl font-bold text-white">{state.global.streaks.ramadan}</div>
              <div className="text-[9px] uppercase tracking-widest text-emerald-200/50">Streak</div>
           </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Widget 
          title="Salah" status={state.daily.prayers.every(p => p.completed) ? "Complete" : "Tracking"} statusColor={state.daily.prayers.every(p => p.completed) ? "text-emerald-500" : "text-blue-500"}
          icon={<Moon size={20} />} bgIcon={<Moon size={80} />} value={`${state.daily.prayers.filter(p => p.completed).length}/6`} label="Prayers" streak={state.global.streaks.salah} onClick={() => changeView(ViewState.SALAH)} gradient="from-emerald-500/10 to-emerald-900/5"
        />

        <Widget 
          title="Dhikr" status="Active" statusColor="text-amber-500"
          icon={<Activity size={20} />} bgIcon={<Activity size={80} />} value={`${state.daily.dhikrAstaghfirullah + state.daily.dhikrRabbiInni}`} label="Total" streak={state.global.streaks.dhikr} onClick={() => changeView(ViewState.DHIKR)} gradient="from-amber-500/10 to-amber-900/5"
        />

        <Widget 
          title="MDF" status="Guarded" statusColor="text-rose-500"
          icon={<Lock size={20} />} bgIcon={<Lock size={80} />} value={`${Math.floor((Date.now() - (state.global.lastRelapseDate || 0)) / (1000 * 60 * 60 * 24))}d`} label="Streak" streak={state.global.streaks.mdf} onClick={() => changeView(ViewState.MDF)} gradient="from-rose-500/10 to-rose-900/5"
        />

        <Widget 
          title="Quran" status="Reading" statusColor="text-purple-500"
          icon={<Calendar size={20} />} bgIcon={<Calendar size={80} />} value={`Parah ${state.global.currentParah}`} label="Progress" streak={state.global.streaks.quranSurah} onClick={() => changeView(ViewState.QURAN)} gradient="from-purple-500/10 to-purple-900/5"
        />

         <Widget 
          title="Hygiene" status="Clean" statusColor="text-cyan-500"
          icon={<Droplets size={20} />} bgIcon={<Droplets size={80} />} value={`${(state.daily.hygiene.waterGlasses)}/8`} label="Water" streak={state.global.streaks.hygiene} onClick={() => changeView(ViewState.HYGIENE)} gradient="from-cyan-500/10 to-cyan-900/5"
        />

        <Widget 
          title="Habits" status={state.daily.habits.failedToday ? "Failed" : "Control"} statusColor={state.daily.habits.failedToday ? "text-red-500" : "text-emerald-500"}
          icon={<ShieldCheck size={20} />} bgIcon={<ShieldCheck size={80} />} value={state.daily.habits.failedToday ? "Reset" : "Safe"} label="Discipline" streak={state.global.streaks.habits} onClick={() => changeView(ViewState.HYGIENE)} gradient="from-gray-500/10 to-gray-900/5"
        />
      </div>
    </div>
  );
};

const Widget: React.FC<any> = ({ title, status, statusColor, icon, bgIcon, value, label, streak, onClick, gradient }) => (
  <div onClick={onClick} className="glass-panel p-4 rounded-[1.5rem] relative overflow-hidden group cursor-pointer transition-all duration-300 active:scale-[0.97] flex flex-col justify-between h-40 border-white/5 hover:border-white/10">
    {/* Dynamic gradient background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    
    <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transform rotate-12 group-hover:scale-110 transition-all ${statusColor}`}>{bgIcon}</div>
    
    <div className="flex justify-between items-start z-10">
      <div className={`p-2 rounded-xl bg-primary/5 backdrop-blur-md ${statusColor} shadow-sm border border-primary/5`}>{icon}</div>
      <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg border border-primary/5"><span className={`text-[9px] font-bold uppercase tracking-wider ${statusColor}`}>{status}</span></div>
    </div>
    
    <div className="z-10 mt-auto">
      <h3 className="text-2xl font-bold text-primary tracking-tight mb-0.5">{value}</h3>
      <div className="flex justify-between items-end">
        <span className="text-[10px] text-secondary font-medium uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-1 text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded-md"><Flame size={10} className="text-orange-400" /><span className="text-[10px] font-bold font-mono">{streak}</span></div>
      </div>
    </div>
  </div>
);
