
import * as React from 'react';
import { useState } from 'react';
import { Moon, CheckCircle2, Users, ChevronLeft, Clock, Trophy, BarChart2 } from 'lucide-react';
import { AppState, SubView } from '../types';
import { MASTER_ACHIEVEMENTS, getGrowthStage } from '../constants';
import { BarChart } from './Charts';

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
    // If less than 7 days, fill with zeros
    const paddedHistory = [...Array(Math.max(0, 7 - history.length)).fill(0).map(() => ({ prayers: [] })), ...history];
    
    const data = paddedHistory.map((day: any) => {
        if (!day.prayers) return 0;
        return day.prayers.filter((p: any) => p.completed).length;
    });
    
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Simplified for demo, ideally dynamic based on date

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6 rounded-[2rem]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-emerald-400"/> Weekly Performance</h3>
                <BarChart data={data} labels={labels} color="emerald" maxVal={6} />
                <p className="text-center text-[10px] text-gray-500 mt-4">Prayers Completed per Day</p>
            </div>
            
            <div className="glass-panel p-6 rounded-[2rem] flex justify-between items-center">
                <div>
                    <h4 className="text-sm font-bold text-gray-400">Completion Rate</h4>
                    <p className="text-3xl font-light text-white">{Math.round((state.global.streaks.salah / (state.global.streaks.maxSalah || 1)) * 100)}%</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {state.global.streaks.salah}d
                </div>
            </div>
        </div>
    );
  };

  const renderDaily = () => (
    <div className="space-y-4 animate-fade-in pb-10">
      {/* Streak Card */}
      <div className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div className="absolute -right-12 -top-12 text-emerald-500/5 transform rotate-12">
           <Moon size={200} />
        </div>
        <div className="text-6xl mb-4 drop-shadow-2xl animate-bounce">{stage.icon}</div>
        <h3 className="text-5xl font-light mb-1 tracking-tighter">{state.global.streaks.salah}<span className="text-lg font-normal text-emerald-500/50 ml-1">Days</span></h3>
        <p className="text-[10px] text-emerald-300/40 font-bold tracking-[0.2em] uppercase">Stage: {stage.label}</p>
      </div>

      {/* Prayers List */}
      <div className="space-y-3">
        {state.daily.prayers.map((prayer) => (
          <div 
            key={prayer.id} 
            onClick={() => !prayer.completed && updatePrayer(prayer.id, true, prayer.isJamaah)}
            className={`relative group overflow-hidden rounded-2xl border transition-all duration-100 cursor-pointer active:scale-95 ${
              prayer.completed 
                ? 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/10 border-emerald-500/20' 
                : 'glass-panel hover:border-white/10'
            }`}
          >
            <div className="flex flex-row-reverse justify-between items-center p-5 relative z-10">
              {/* Right side (Urdu & Check) */}
              <div className="flex items-center flex-row-reverse gap-5">
                 <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  prayer.completed 
                    ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                    : 'border-white/10 group-hover:border-white/30'
                }`}>
                  {prayer.completed && <CheckCircle2 size={20} className="text-black animate-fade-in" strokeWidth={3} />}
                </div>
                
                <div className="flex flex-col items-end">
                     <span className="text-4xl font-serif font-bold drop-shadow-sm">{prayer.urduName}</span>
                  {prayer.completedAt && (
                    <p className="text-[10px] text-emerald-400/60 flex items-center gap-1 font-mono uppercase mt-1" dir="ltr">
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
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                } ${!prayer.completed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <Users size={14} />
                <span className="text-[10px] font-bold uppercase">{prayer.isJamaah ? 'Jama\'ah' : 'Solo'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
       
      {/* Qada */}
      <div className="glass-panel p-6 rounded-[2rem] border-red-500/10 bg-gradient-to-br from-red-900/10 to-transparent mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="font-bold text-red-200 text-sm">Qada Bank</h3>
             <p className="text-[10px] text-red-400/50 uppercase tracking-wide">Missed Prayers</p>
          </div>
          <span className="text-3xl font-mono font-bold text-red-400">{state.global.qadaBank}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => updateQada(1)} className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 active:scale-95 transition-all font-bold text-sm">
            + I Missed One
          </button>
          <button onClick={() => updateQada(-1)} className="py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all font-bold text-sm">
            - I Prayed Qada
          </button>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => {
     const list = MASTER_ACHIEVEMENTS.filter(a => a.category === 'SALAH');
     return (
       <div className="space-y-3 pt-2">
         {list.map(ach => {
           const isUnlocked = state.global.unlockedAchievements.includes(ach.id);
           return (
             <div key={ach.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${isUnlocked ? 'bg-white/5 border-emerald-500/30' : 'glass-panel border-white/5 opacity-40'}`}>
                <div className="text-xl">{ach.icon}</div>
                <div className="flex-1">
                   <div className="flex justify-between">
                      <h4 className={`font-bold text-xs ${isUnlocked ? 'text-primary' : 'text-gray-500'}`}>{ach.title}</h4>
                      {isUnlocked && <CheckCircle2 size={14} className="text-emerald-400" />}
                   </div>
                   <p className="text-[9px] text-gray-500 mt-1">{ach.description}</p>
                </div>
             </div>
           );
         })}
       </div>
     );
  };

  return (
    <div className="pb-32 animate-fade-in px-2">
      <div className="flex items-center justify-between pt-2 mb-6">
        <button onClick={onBack} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors active:scale-95"><ChevronLeft size={20} /></button>
        <div className="flex bg-black/40 rounded-full p-1 border border-white/10 backdrop-blur-md">
           <button onClick={() => setSubView('DAILY')} className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'DAILY' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Daily</button>
           <button onClick={() => setSubView('STATS')} className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'STATS' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Stats</button>
           <button onClick={() => setSubView('AWARDS')} className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${subView === 'AWARDS' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Awards</button>
        </div>
        <div className="w-10" />
      </div>
      {subView === 'DAILY' && renderDaily()}
      {subView === 'STATS' && renderStats()}
      {subView === 'AWARDS' && renderAchievements()}
    </div>
  );
};
