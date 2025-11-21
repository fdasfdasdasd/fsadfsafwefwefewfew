import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Moon, Star, Droplets, Flame, Activity, ChevronRight, Calendar, Lock,
  Zap, Award
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
  const badgeText = isOddDay ? "🎯 Sabar" : "🎯 Tawaqqal";
  const duaIndex = currentTime.getDate() % DUAS.length;
  const dailyDua = DUAS[duaIndex];
  const xpProgress = (state.global.xp % 1000) / 10; 
  const isFriday = currentTime.getDay() === 5;

  return (
    <div className="pb-32 space-y-5 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div>
          <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Online • {state.global.name}
          </p>
          <h1 className="text-3xl font-light text-white">
            {greeting}
          </h1>
        </div>
        <div 
          onClick={() => changeView(ViewState.SETTINGS)}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 border-2 border-white/10 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <span className="font-bold text-sm">{state.global.name.charAt(0)}</span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-20">
           <Zap size={100} className="text-yellow-200" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/60 font-medium text-sm">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                </span>
                <span className="bg-yellow-500/20 px-2.5 py-0.5 rounded-full text-[10px] border border-yellow-500/30 text-yellow-200 tracking-wider font-bold uppercase">
                  {badgeText}
                </span>
              </div>
              <h2 className="text-5xl font-bold tracking-tighter font-sans text-white drop-shadow-lg">
                {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                <span className="text-lg font-normal text-white/50 ml-2">
                   {currentTime.toLocaleTimeString('en-US', { second: '2-digit' })}
                </span>
              </h2>
            </div>
            
            <div className="text-center bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/5">
               <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Iman</div>
               <div className={`text-2xl font-black ${state.daily.imanScore >= 80 ? 'text-emerald-400' : state.daily.imanScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                 {Math.round(state.daily.imanScore)}
               </div>
            </div>
          </div>

          {/* Daily Dua Pill */}
          <div className="bg-black/30 backdrop-blur-xl rounded-xl p-5 border border-white/10 mb-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
            <p className="text-center text-xl mb-3 font-serif leading-relaxed text-white/90" dir="rtl">{dailyDua.arabic}</p>
            <p className="text-center text-xs text-gray-400 leading-relaxed">{dailyDua.english}</p>
          </div>

          {/* XP Bar */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/60">LVL {state.global.level}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-blue-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-white/60">{state.global.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Friday Special */}
      {isFriday && (
        <div className="bg-gradient-to-r from-emerald-900/80 to-emerald-800/80 border border-emerald-500/30 p-5 rounded-2xl flex items-center justify-between shadow-lg animate-pulse-slow cursor-pointer active:scale-95 transition-transform">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-400/20 rounded-full text-emerald-300">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-50 text-lg">Jumu'ah Mubarak</h4>
              <p className="text-xs text-emerald-200/80">Read Surah Kahf for light until next Friday.</p>
            </div>
          </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Widget 
          title="Salah" 
          status={state.daily.prayers.every(p => p.completed) ? "Complete" : "Tracking"}
          statusColor={state.daily.prayers.every(p => p.completed) ? "text-emerald-400" : "text-blue-400"}
          icon={<Moon size={24} />}
          bgIcon={<Moon size={80} />}
          value={`${state.daily.prayers.filter(p => p.completed).length}/6`}
          label="Prayers"
          streak={state.global.streaks.salah}
          onClick={() => changeView(ViewState.SALAH)}
          gradient="from-emerald-500/20 to-emerald-900/5"
        />

        <Widget 
          title="Dhikr" 
          status="Active"
          statusColor="text-amber-400"
          icon={<Activity size={24} />}
          bgIcon={<Activity size={80} />}
          value={state.daily.dhikrCount.toString()}
          label="Count"
          streak={state.global.streaks.dhikr}
          onClick={() => changeView(ViewState.DHIKR)}
          gradient="from-amber-500/20 to-amber-900/5"
        />

        <Widget 
          title="MDF" 
          status="Guarded"
          statusColor="text-rose-400"
          icon={<Lock size={24} />}
          bgIcon={<Lock size={80} />}
          value={`${Math.floor((Date.now() - (state.global.lastRelapseDate || 0)) / (1000 * 60 * 60 * 24))}d`}
          label="Streak"
          streak={state.global.streaks.mdf}
          onClick={() => changeView(ViewState.MDF)}
          gradient="from-rose-500/20 to-rose-900/5"
        />

        <Widget 
          title="Quran" 
          status="Reading"
          statusColor="text-purple-400"
          icon={<Calendar size={24} />}
          bgIcon={<Calendar size={80} />}
          value={`Juz ${state.global.currentParah}`}
          label="Current"
          streak={state.global.quransCompleted}
          onClick={() => changeView(ViewState.QURAN)}
          isKhatam
          gradient="from-purple-500/20 to-purple-900/5"
        />

         <Widget 
          title="Health" 
          status="Hydration"
          statusColor="text-cyan-400"
          icon={<Droplets size={24} />}
          bgIcon={<Droplets size={80} />}
          value={`${(state.daily.waterCups * 0.25).toFixed(1)}L`}
          label="Intake"
          streak={state.global.streaks.water}
          onClick={() => changeView(ViewState.HEALTH)}
          gradient="from-cyan-500/20 to-cyan-900/5"
        />

        <Widget 
          title="Fitness" 
          status="Training"
          statusColor="text-orange-400"
          icon={<Flame size={24} />}
          bgIcon={<Flame size={80} />}
          value={state.daily.fitness.type}
          label="Focus"
          streak={state.global.streaks.fitness}
          onClick={() => changeView(ViewState.FITNESS)}
          gradient="from-orange-500/20 to-orange-900/5"
        />
      </div>
    </div>
  );
};

interface WidgetProps {
  title: string;
  status: string;
  statusColor: string;
  icon: React.ReactNode;
  bgIcon: React.ReactNode;
  value: string;
  label: string;
  streak: number;
  isKhatam?: boolean;
  onClick: () => void;
  gradient: string;
}

const Widget: React.FC<WidgetProps> = ({ 
  title, status, statusColor, icon, bgIcon, value, label, streak, isKhatam, onClick, gradient 
}) => (
  <div 
    onClick={onClick} 
    className="glass-panel p-5 rounded-[20px] relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 active:opacity-80 flex flex-col justify-between h-44 border-white/5 hover:border-white/20"
  >
    {/* Subtle Gradient Background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

    {/* Background Icon */}
    <div className={`absolute -right-4 -bottom-4 opacity-5 transform rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${statusColor}`}>
      {bgIcon}
    </div>
    
    {/* Top Row */}
    <div className="flex justify-between items-start z-10">
      <div className={`p-2.5 rounded-xl bg-white/5 backdrop-blur-md ${statusColor} shadow-inner border border-white/5`}>
         {icon}
      </div>
      <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
        <span className="text-[10px] text-white/60 font-medium">{status}</span>
      </div>
    </div>

    {/* Bottom Row */}
    <div className="z-10 mt-auto">
      <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{value}</h3>
      <div className="flex justify-between items-end">
        <span className="text-xs text-white/40 font-medium uppercase tracking-wide">{label}</span>
        <div className="flex items-center gap-1 text-yellow-400">
           {isKhatam ? <Award size={14} /> : <Flame size={14} />}
           <span className="text-xs font-bold">{streak}</span>
        </div>
      </div>
    </div>
  </div>
);