
import * as React from 'react';
import { useState } from 'react';
import { Moon, CheckCircle2, Users, ArrowLeft, Clock, Trophy, BarChart2, Calendar } from 'lucide-react';
import { AppState, SubView, GlobalStats } from '../types';
import { BarChart } from './Charts';
import { MASTER_ACHIEVEMENTS } from '../constants';

interface Props {
  state: AppState;
  updatePrayer: (id: string, isComplete: boolean, isJamaah: boolean) => void;
  updateQada: (amount: number) => void;
  onBack: () => void;
}

export const TabSalah: React.FC<Props> = ({ state, updatePrayer, updateQada, onBack }) => {
  const [subView, setSubView] = useState<SubView>('DAILY');

  const getGrowthIcon = () => {
    const streak = state.global.streaks.salah;
    if (streak < 7) return "🌱";
    if (streak < 30) return "🌿";
    return "🌳";
  };

  // --- VIEW: DAILY ---
  const renderDaily = () => (
    <div className="space-y-4 animate-fade-in">
      {/* Streak Card */}
      <div className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden border-emerald-500/20">
        <div className="absolute -right-12 -top-12 text-emerald-500/5 transform rotate-12">
           <Moon size={200} />
        </div>
        <div className="text-6xl mb-4 drop-shadow-lg animate-bounce">{getGrowthIcon()}</div>
        <h3 className="text-4xl font-bold text-white mb-1">{state.global.streaks.salah} <span className="text-lg font-normal text-gray-400">Days</span></h3>
        <p className="text-sm text-emerald-300/80 font-medium tracking-wide uppercase">Consistency is Key</p>
      </div>

      {/* Prayers List */}
      <div className="space-y-3">
        {state.daily.prayers.map((prayer) => (
          <div 
            key={prayer.id} 
            onClick={() => !prayer.completed && updatePrayer(prayer.id, true, prayer.isJamaah)}
            className={`relative group overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer ${
              prayer.completed 
                ? 'bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border-emerald-500/30' 
                : 'glass-panel border-white/5 hover:border-white/20 active:scale-[0.98]'
            }`}
          >
            <div 
              className={`absolute left-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-700 ease-out ${prayer.completed ? 'w-full' : 'w-0'}`} 
            />

            <div className="flex justify-between items-center p-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  prayer.completed 
                    ? 'bg-emerald-500 border-emerald-500 scale-110' 
                    : 'border-white/20 group-hover:border-emerald-400/50'
                }`}>
                  {prayer.completed && <CheckCircle2 size={18} className="text-white animate-fade-in" />}
                </div>
                <div>
                  <h4 className={`text-lg font-bold transition-colors ${prayer.completed ? 'text-emerald-200' : 'text-white'}`}>{prayer.name}</h4>
                  {prayer.completedAt ? (
                    <p className="text-xs text-emerald-300/60 flex items-center gap-1">
                      <Clock size={10} /> {prayer.completedAt}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Tap to mark done</p>
                  )}
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (prayer.completed) updatePrayer(prayer.id, prayer.completed, !prayer.isJamaah);
                }}
                disabled={!prayer.completed}
                className={`p-3 rounded-xl transition-all duration-300 border ${
                  prayer.isJamaah 
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                    : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'
                } ${!prayer.completed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <Users size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
       
       {/* Qada */}
      <div className="glass-panel p-6 rounded-[2rem] border-red-500/20 bg-red-900/5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-red-100">Qada Bank (Missed)</h3>
          <span className="text-2xl font-bold text-red-400">{state.global.qadaBank}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => updateQada(1)} className="py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 active:scale-95 transition-all font-bold">
            + Missed
          </button>
          <button onClick={() => updateQada(-1)} className="py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all font-bold">
            - Made Up
          </button>
        </div>
      </div>
    </div>
  );

  // --- VIEW: PROGRESS ---
  const renderProgress = () => {
    // Extract data from history
    const last7Days = state.global.history.slice(-7);
    const data = last7Days.map(day => day.prayers.filter(p => p.completed).length);
    const labels = last7Days.map(day => {
      const d = new Date(day.date);
      return d.toLocaleDateString('en-US', { weekday: 'narrow' });
    });

    // Fill if empty (new user)
    if (data.length === 0) {
       return <div className="p-10 text-center text-gray-500">Use the app for a few days to see graphs!</div>
    }

    return (
      <div className="space-y-6 animate-fade-in pt-4">
        <div className="glass-panel p-6 rounded-[2rem]">
          <h3 className="text-emerald-400 font-bold mb-6 flex items-center gap-2">
            <BarChart2 size={18} />
            Weekly Consistency
          </h3>
          <BarChart data={data} labels={labels} maxVal={6} color="emerald" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="glass-panel p-5 rounded-2xl">
             <div className="text-xs text-gray-500 uppercase mb-1">Completion Rate</div>
             <div className="text-2xl font-bold text-white">
                {Math.round((data.reduce((a,b) => a+b, 0) / (data.length * 6)) * 100) || 0}%
             </div>
           </div>
           <div className="glass-panel p-5 rounded-2xl">
             <div className="text-xs text-gray-500 uppercase mb-1">Total Prayed</div>
             <div className="text-2xl font-bold text-white">
                {state.global.history.reduce((acc, day) => acc + day.prayers.filter(p => p.completed).length, 0)}
             </div>
           </div>
        </div>
      </div>
    );
  };

  // --- VIEW: ACHIEVEMENTS ---
  const renderAchievements = () => {
     const myAchievements = MASTER_ACHIEVEMENTS.filter(a => a.category === 'SALAH');
     return (
       <div className="space-y-4 animate-fade-in pt-4">
         <div className="grid grid-cols-1 gap-3">
            {myAchievements.map(achievement => {
              const isUnlocked = state.global.unlockedAchievements.includes(achievement.id);
              const tierColor = {
                'BRONZE': 'text-orange-700 border-orange-900/30',
                'SILVER': 'text-gray-300 border-gray-500/30',
                'GOLD': 'text-yellow-400 border-yellow-500/30',
                'PLATINUM': 'text-cyan-400 border-cyan-500/30',
                'DIAMOND': 'text-blue-400 border-blue-500/30'
              }[achievement.tier];

              return (
                <div key={achievement.id} className={`p-4 rounded-2xl border flex items-center gap-4 ${isUnlocked ? 'glass-panel ' + tierColor : 'bg-white/5 border-white/5 opacity-50'}`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isUnlocked ? 'bg-white/10' : 'grayscale'}`}>
                      {achievement.icon}
                   </div>
                   <div>
                     <h4 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{achievement.title}</h4>
                     <p className="text-xs text-gray-400">{achievement.description}</p>
                   </div>
                   {isUnlocked && <div className="ml-auto"><CheckCircle2 size={16} className={tierColor.split(' ')[0]} /></div>}
                </div>
              );
            })}
         </div>
       </div>
     );
  };

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 mb-6">
        <button onClick={onBack} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
           <button onClick={() => setSubView('DAILY')} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${subView === 'DAILY' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}>Daily</button>
           <button onClick={() => setSubView('PROGRESS')} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${subView === 'PROGRESS' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}>Stats</button>
           <button onClick={() => setSubView('ACHIEVEMENTS')} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${subView === 'ACHIEVEMENTS' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}>Awards</button>
        </div>
        <div className="w-10" />
      </div>

      {subView === 'DAILY' && renderDaily()}
      {subView === 'PROGRESS' && renderProgress()}
      {subView === 'ACHIEVEMENTS' && renderAchievements()}
    </div>
  );
};
