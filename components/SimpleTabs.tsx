import * as React from 'react';
import { useState, useEffect } from 'react';
import { AppState } from '../types';
import { FITNESS_SCHEDULE, MEMORIZE_CONTENT } from '../constants';
import { Check, ChevronRight } from 'lucide-react';

// --- DHIKR TAB ---
export const TabDhikr: React.FC<{ state: AppState; updateDhikr: (amount: number) => void }> = ({ state, updateDhikr }) => {
  const percentage = Math.min((state.daily.dhikrCount / 2100) * 100, 100);
  
  return (
    <div className="animate-fade-in space-y-8 pb-32 flex flex-col items-center pt-6">
       
       <div className="relative w-72 h-72 flex items-center justify-center">
         <svg className="transform -rotate-90 w-full h-full filter drop-shadow-2xl">
           <circle cx="144" cy="144" r="130" stroke="rgba(255,255,255,0.05)" strokeWidth="20" fill="transparent" />
           <circle 
             cx="144" cy="144" r="130" 
             stroke="url(#gradient)" strokeWidth="20" fill="transparent" 
             strokeDasharray={817} 
             strokeDashoffset={817 - (817 * percentage) / 100}
             strokeLinecap="round"
             className="transition-all duration-1000 ease-out"
           />
           <defs>
             <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#fbbf24" />
               <stop offset="100%" stopColor="#d97706" />
             </linearGradient>
           </defs>
         </svg>
         
         <div className="absolute inset-4 rounded-full glass-panel flex flex-col items-center justify-center border-white/5">
           <div className="text-6xl font-bold text-amber-400 tracking-tighter">{state.daily.dhikrCount}</div>
           <div className="text-amber-200/50 text-sm uppercase tracking-widest mt-1">Target: 2100</div>
         </div>
       </div>

       {/* Haptic Buttons */}
       <div className="grid grid-cols-2 gap-4 w-full px-4">
         <button 
           onClick={() => updateDhikr(1)} 
           className="glass-panel py-10 rounded-3xl text-3xl font-bold active:scale-95 transition-all duration-200 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/20"
         >
           +1
         </button>
         <button 
           onClick={() => updateDhikr(100)} 
           className="glass-panel py-10 rounded-3xl text-3xl font-bold active:scale-95 transition-all duration-200 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/20"
         >
           +100
         </button>
       </div>

       <div className="w-full px-4">
        <div className="glass-panel p-6 rounded-2xl border-white/5">
          <h3 className="font-bold text-gray-300 mb-4 text-sm uppercase tracking-wider">Suggested Adhkar</h3>
          <ul className="space-y-3">
            {["Astaghfirullah", "SubhanAllah", "Alhamdulillah", "Allahu Akbar"].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                {text}
              </li>
            ))}
          </ul>
        </div>
       </div>
    </div>
  );
};

// --- HEALTH TAB ---
export const TabHealth: React.FC<{ state: AppState; addWater: () => void; toggleFasting: () => void }> = ({ state, addWater, toggleFasting }) => {
  const cupHeight = 10; 
  const totalHeight = Math.min(state.daily.waterCups * cupHeight, 100);
  const isFastingDay = [1, 4].includes(new Date().getDay());

  return (
    <div className="animate-fade-in space-y-6 pb-32 pt-4">
      <h2 className="text-2xl font-bold text-cyan-400 px-2">Hydration Monitor</h2>

      {isFastingDay && (
        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 flex justify-between items-center mx-2">
          <div>
             <h4 className="font-bold text-cyan-100">Sunnah Fasting</h4>
             <p className="text-xs text-cyan-400/60">Are you fasting today?</p>
          </div>
          <button 
            onClick={toggleFasting}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${state.daily.isSunnahFasting ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {state.daily.isSunnahFasting ? 'Yes' : 'No'}
          </button>
        </div>
      )}

      {/* Liquid Tank Animation */}
      <div className={`glass-panel h-96 mx-4 rounded-[3rem] relative overflow-hidden flex items-end justify-center border-cyan-500/20 transition-all duration-500 ${state.daily.isSunnahFasting ? 'opacity-40' : ''}`}>
        
        {/* Bubbles effect */}
        <div className="absolute inset-0 z-0">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="absolute bottom-0 w-4 h-4 bg-white/10 rounded-full animate-float" style={{ left: `${Math.random() * 100}%`, animationDelay: `${i}s`, animationDuration: `${5 + i}s` }} />
           ))}
        </div>

        <div 
          className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 absolute bottom-0 transition-all duration-1000 ease-in-out flex items-start justify-center pt-10 shadow-[0_0_50px_rgba(6,182,212,0.4)]"
          style={{ height: `${totalHeight}%` }}
        >
           <div className="text-white font-bold text-6xl drop-shadow-xl z-10">{state.daily.waterCups}</div>
        </div>
        
        {/* Glass Shine Reflection */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
      </div>

      <div className="px-4">
        <button 
          onClick={addWater} 
          disabled={state.daily.isSunnahFasting}
          className="w-full py-6 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-2xl font-bold text-xl shadow-xl shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add 250ml
        </button>
      </div>
    </div>
  );
};

// --- MDF TAB ---
export const TabMDF: React.FC<{ state: AppState; resetRelapse: () => void }> = ({ state, resetRelapse }) => {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - (state.global.lastRelapseDate || Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeString(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [state.global.lastRelapseDate]);

  return (
    <div className="animate-fade-in space-y-8 pb-32 pt-6 flex flex-col h-full">
       <h2 className="text-2xl font-bold text-rose-500 px-4">Discipline Protocol</h2>
       
       <div className="flex-1 flex flex-col items-center justify-center">
         <div className="w-72 h-72 rounded-full glass-panel border-4 border-rose-500/20 flex flex-col items-center justify-center relative shadow-[0_0_40px_rgba(244,63,94,0.15)] animate-pulse-slow">
           <div className="absolute inset-0 rounded-full border border-rose-500/30 animate-ping opacity-20"></div>
           <div className="text-xs text-rose-300 uppercase tracking-widest mb-4">Clean Streak</div>
           <div className="text-3xl font-mono font-bold text-white tracking-tight text-center px-4">{timeString}</div>
         </div>
       </div>

       <div className="px-4 space-y-4">
        <button className="w-full py-5 bg-rose-600 hover:bg-rose-700 rounded-2xl font-bold text-white shadow-lg shadow-rose-500/30 active:scale-95 transition-all text-xl">
            🚨 PANIC BUTTON
        </button>

        <button onClick={resetRelapse} className="w-full py-4 glass-panel rounded-xl text-xs text-red-400/60 hover:text-red-400 hover:bg-red-900/20 transition-colors">
            Reset Counter (I Relapsed)
        </button>
       </div>
    </div>
  );
};

// --- FITNESS TAB ---
export const TabFitness: React.FC<{ state: AppState; logWeight: (w: number) => void }> = ({ state, logWeight }) => {
  const dayOfWeek = new Date().getDay();
  const workout = FITNESS_SCHEDULE[dayOfWeek];
  const [weightInput, setWeightInput] = useState("");

  return (
    <div className="animate-fade-in space-y-6 pb-32 pt-4">
       <h2 className="text-2xl font-bold text-orange-500 px-4">Fitness & Body</h2>
       
       <div className="glass-panel p-8 rounded-[2rem] border-orange-500/20 mx-4 relative overflow-hidden bg-gradient-to-br from-orange-900/20 to-transparent">
         <div className="absolute -right-10 -bottom-10 opacity-10">
            {/* Abstract Shape */}
            <div className="w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
         </div>
         <h3 className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-2">Today's Protocol</h3>
         <h1 className="text-4xl font-black text-white italic">{workout}</h1>
         <div className="mt-4 inline-block px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/20">
            High Intensity
         </div>
       </div>

       <div className="glass-panel p-6 rounded-2xl mx-4">
         <h3 className="font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
            Log Weight
         </h3>
         <div className="flex gap-3">
           <input 
             type="number" 
             placeholder="00.0" 
             value={weightInput}
             onChange={(e) => setWeightInput(e.target.value)}
             className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 w-full text-white text-lg focus:outline-none focus:border-orange-500 transition-colors"
           />
           <button 
            onClick={() => {
              if(weightInput) {
                logWeight(parseFloat(weightInput));
                setWeightInput("");
              }
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white px-8 rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
           >
             Log
           </button>
         </div>
         {state.daily.fitness.weight && <p className="mt-3 text-xs text-gray-500 text-right">Last recorded: <span className="text-white font-bold">{state.daily.fitness.weight}kg</span></p>}
       </div>
    </div>
  );
};

// --- MEMORIZE TAB ---
export const TabMemorize: React.FC<{ state: AppState; completeReview: () => void }> = ({ state, completeReview }) => {
  const weekData = MEMORIZE_CONTENT.find(w => w.week === state.global.memorizeWeek) || MEMORIZE_CONTENT[0];
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="animate-fade-in space-y-6 pb-32 pt-4">
      <div className="flex justify-between items-end px-4">
        <h2 className="text-2xl font-bold text-pink-500">Flashcards</h2>
        <span className="text-xs font-bold bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">Week {state.global.memorizeWeek}</span>
      </div>
      
      <div className="px-4">
        <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer perspective-1000 h-[26rem] w-full relative group"
        >
            {/* Front */}
            <div className={`w-full h-full glass-panel rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all duration-700 transform-style-3d absolute backface-hidden border-pink-500/20 ${isFlipped ? 'rotate-y-180 opacity-0' : 'opacity-100'}`}>
                <div className="absolute top-6 right-6 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                <p className="text-3xl text-center leading-relaxed font-bold" dir="rtl">{weekData.arabic}</p>
                <div className="absolute bottom-8 text-xs text-gray-500 uppercase tracking-widest animate-bounce">Tap to Flip</div>
            </div>

            {/* Back */}
            <div className={`w-full h-full bg-gradient-to-br from-pink-900/80 to-pink-950/80 glass-panel border-pink-500/40 rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all duration-700 transform-style-3d absolute backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-xl text-center italic text-pink-100 leading-loose font-light">"{weekData.english}"</p>
            </div>
        </div>
      </div>

      <div className="px-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase tracking-wider">
            <span>Weekly Mastery</span>
            <span>{state.global.memorizeProgress} / 7</span>
          </div>
          <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${(state.global.memorizeProgress / 7) * 100}%`}} 
            />
          </div>
      </div>

      <div className="px-4">
        <button 
            onClick={completeReview}
            disabled={state.daily.completedDuaReview}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                state.daily.completedDuaReview 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-default' 
                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20'
            }`}
        >
            {state.daily.completedDuaReview ? "Done for Today" : "Mark Reviewed"}
        </button>
      </div>
    </div>
  );
};

// --- QURAN TAB ---
export const TabQuran: React.FC<{ state: AppState; updatePart: (part: string) => void }> = ({ state, updatePart }) => {
  const parts = ['rub', 'nisf', 'thalatha', 'kamil'] as const;
  const labels = ['Rub (1/4)', 'Nisf (1/2)', 'Thalatha (3/4)', 'Kamil (Full)'];

  return (
    <div className="animate-fade-in space-y-6 pb-32 pt-4">
      <h2 className="text-2xl font-bold text-purple-400 px-4">Quran Progress</h2>
      
      <div className="glass-panel p-8 rounded-[2rem] text-center border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-transparent mx-4 relative">
        <div className="absolute top-4 right-4">
            <div className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-1 rounded-lg">JUZ TRACKER</div>
        </div>
        <h1 className="text-6xl font-black text-white mb-2 drop-shadow-xl">{state.global.currentParah}</h1>
        <p className="text-purple-200/60 uppercase tracking-widest text-xs">Current Juz</p>
        
        <div className="mt-6 flex justify-center gap-2">
            {[...Array(state.global.quransCompleted)].map((_, i) => (
                <span key={i} className="text-xl">🏆</span>
            ))}
            {state.global.quransCompleted === 0 && <span className="text-xs text-gray-500 italic">No Khatams yet</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4">
        {parts.map((part, idx) => {
          const isDone = state.daily.quranParts[part];
          return (
            <button 
              key={part}
              onClick={() => updatePart(part)}
              className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 group active:scale-95 ${
                isDone 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' 
                  : 'glass-panel border-white/5 text-gray-400 hover:border-purple-400/30 hover:bg-purple-900/10'
              }`}
            >
              <span className="font-bold tracking-wide">{labels[idx]}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'border-white bg-white text-purple-600' : 'border-gray-600 group-hover:border-purple-400'}`}>
                 {isDone && <Check size={14} strokeWidth={4} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};