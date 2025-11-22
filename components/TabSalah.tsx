
import * as React from 'react';
import { useState } from 'react';
import { Moon, CheckCircle2, Users, ChevronLeft, Clock, Trophy, BarChart2, Cloud, Star } from 'lucide-react';
import { AppState, SubView } from '../types';
import { MASTER_ACHIEVEMENTS, getGrowthStage } from '../constants';
import { BarChart } from './Charts';
import { TabVisuals } from './SimpleTabs'; // Import the visuals

interface Props {
  state: AppState;
  updatePrayer: (id: string, isComplete: boolean, isJamaah: boolean) => void;
  updateQada: (amount: number) => void;
  onBack: () => void;
}

export const TabSalah: React.FC<Props> = ({ state, updatePrayer, updateQada, onBack }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');
  const stage = getGrowthStage('SALAH', state.global.streaks.salah);

  const renderStats = () => {
    // Calculate last 7 days history
    const history = state.global.history.slice(-7);
    const paddedHistory = [...Array(Math.max(0, 7 - history.length)).fill(0).map(() => ({ prayers: [] })), ...history];
    
    const data = paddedHistory.map((day: any) => {
        if (!day.prayers) return 0;
        return day.prayers.filter((p: any) => p.completed).length;
    });
    
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="glass-panel p-6 rounded-[2rem]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><BarChart2 size={18} className="text-emerald-500"/> Weekly Performance</h3>
                <BarChart data={data} labels={labels} color="emerald" maxVal={6} />
                <p className="text-center text-[10px] text-secondary mt-4">Prayers Completed per Day</p>
            </div>
            
            <div className="glass-panel p-6 rounded-[2rem] flex justify-between items-center">
                <div>
                    <h4 className="text-sm font-bold text-secondary">Completion Rate</h4>
                    <p className="text-3xl font-light text-primary">{Math.round((state.global.streaks.salah / (state.global.streaks.maxSalah || 1)) * 100)}%</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                    {state.global.streaks.salah}d
                </div>
            </div>
        </div>
    );
  };

  const renderDaily = () => (
    <div className="space-y-4 animate-slide-up pb-10">
      {/* Streak Card */}
      <div className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] group">
        <div className="absolute -right-12 -top-12 text-emerald-500/5 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
           <Moon size={200} />
        </div>
        <div className="text-6xl mb-4 drop-shadow-2xl animate-bounce">{stage.icon}</div>
        <h3 className="text-5xl font-light mb-1 tracking-tighter text-primary">{state.global.streaks.salah}<span className="text-lg font-normal opacity-50 ml-1">Days</span></h3>
        <p className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase">Stage: {stage.label}</p>
      </div>

      {/* Prayers List */}
      <div className="space-y-3">
        {state.daily.prayers.map((prayer, idx) => {
           // Simple check for "Next Prayer" to add pulse effect
           const isNext = !prayer.completed && (idx === 0 || state.daily.prayers[idx-1].completed);
           
           return (
          <div 
            key={prayer.id} 
            onClick={() => !prayer.completed && updatePrayer(prayer.id, true, prayer.isJamaah)}
            className={`relative group overflow-hidden rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              prayer.completed 
                ? 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/10 border-emerald-500/20' 
                : 'glass-panel hover:border-emerald-500/20'
            } ${isNext ? 'ring-1 ring-emerald-500/30' : ''}`}
          >
             {/* Pulse Effect for Next Prayer */}
            {isNext && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />}

            <div className="flex flex-row-reverse justify-between items-center p-5 relative z-10">
              {/* Right side (Urdu & Check) */}
              <div className="flex items-center flex-row-reverse gap-5">
                 <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  prayer.completed 
                    ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                    : 'border-secondary/20 group-hover:border-emerald-500/40'
                }`}>
                  {prayer.completed && <CheckCircle2 size={20} className="text-white animate-fade-in" strokeWidth={3} />}
                </div>
                
                <div className="flex flex-col items-end">
                     <span className={`text-4xl font-serif font-bold drop-shadow-sm transition-colors ${prayer.completed ? 'text-emerald-500' : 'text-primary'}`}>{prayer.urduName}</span>
                  {prayer.completedAt && (
                    <p className="text-[10px] text-emerald-500/80 flex items-center gap-1 font-mono uppercase mt-1" dir="ltr">
                      <Clock size={10} /> {prayer.completedAt}
                    </p>
                  )}
                </div>
              </div>

              {/* Left side (Jamaah Toggle) */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (prayer.completed) updatePrayer(prayer.id, prayer.completed, !prayer.isJamaah);
                }}
                disabled={!prayer.completed}
                className={`px-3 py-1.5 rounded-lg transition-all duration-300 border flex items-center gap-2 ${
                  prayer.isJamaah 
                    ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
                    : 'bg-black/5 dark:bg-white/5 text-secondary border-transparent hover:bg-black/10 dark:hover:bg-white/10'
                } ${!prayer.completed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <Users size={14} />
                <span className="text-[10px] font-bold uppercase">{prayer.isJamaah ? 'Jama\'ah' : 'Solo'}</span>
              </button>
            </div>
          </div>
        );})}
      </div>
       
      {/* Qada */}
      <div className="glass-panel p-6 rounded-[2rem] border-red-500/10 bg-gradient-to-br from-red-900/5 to-transparent mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="font-bold text-red-500 text-sm">Qada Bank</h3>
             <p className="text-[10px] text-red-500/50 uppercase tracking-wide">Missed Prayers</p>
          </div>
          <span className="text-3xl font-mono font-bold text-red-500">{state.global.qadaBank}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => updateQada(1)} className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 active:scale-95 transition-all font-bold text-sm">
            + I Missed One
          </button>
          <button onClick={() => updateQada(-1)} className="py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 active:scale-95 transition-all font-bold text-sm">
            - I Prayed Qada
          </button>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => {
     const list = MASTER_ACHIEVEMENTS.filter(a => a.category === 'SALAH');
     const unlockedCount = list.filter(a => state.global.unlockedAchievements.includes(a.id)).length;
     
     return (
       <div className="space-y-3 pt-2 animate-slide-up">
         <div className="glass-panel p-4 rounded-2xl flex justify-between items-center bg-white/5 border-white/5 mb-4">
            <span className="text-xs font-bold uppercase text-secondary tracking-widest">Total Unlocked</span>
            <span className="text-lg font-mono font-bold text-primary">{unlockedCount} <span className="text-secondary text-xs font-sans opacity-50">/ {list.length}</span></span>
         </div>
         
         {list.map((ach, i) => {
           const isUnlocked = state.global.unlockedAchievements.includes(ach.id);
           return (
             <div key={ach.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${isUnlocked ? 'glass-panel border-emerald-500/30 bg-emerald-500/5' : 'glass-panel opacity-40'}`} style={{ animationDelay: `${i * 20}ms` }}>
                <div className="text-xl">{ach.icon}</div>
                <div className="flex-1">
                   <div className="flex justify-between">
                      <h4 className={`font-bold text-xs ${isUnlocked ? 'text-primary' : 'text-secondary'}`}>{ach.title}</h4>
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

  return (
    <div className="pb-32 animate-fade-in px-2 relative min-h-screen overflow-hidden">
      {/* Background Visuals - Salah Theme (Stars & Moons) via TabVisuals */}
      <TabVisuals type="SALAH" />

      {/* Ambient Header Glow */}
      <div className="absolute top-0 left-0 right-0 h-[35rem] pointer-events-none rounded-b-[4rem] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20 transition-all duration-1000 opacity-60" />
      
      <div className="flex items-center justify-center pt-4 mb-6 relative z-10">
         <div className="flex bg-white/50 dark:bg-black/40 rounded-full p-1 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-sm">
           <button onClick={() => setSubView('DAILY')} className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'DAILY' ? 'bg-white text-black shadow-md transform scale-105' : 'text-secondary hover:text-primary'}`}>Daily</button>
           <button onClick={() => setSubView('STATS')} className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'STATS' ? 'bg-white text-black shadow-md transform scale-105' : 'text-secondary hover:text-primary'}`}>Stats</button>
           <button onClick={() => setSubView('AWARDS')} className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'AWARDS' ? 'bg-white text-black shadow-md transform scale-105' : 'text-secondary hover:text-primary'}`}>Awards</button>
        </div>
      </div>
      <div className="relative z-10">
        {subView === 'DAILY' && renderDaily()}
        {subView === 'STATS' && renderStats()}
        {subView === 'AWARDS' && renderAchievements()}
      </div>
    </div>
  );
};
