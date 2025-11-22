
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { Dashboard } from './components/Dashboard';
import { BottomNav } from './components/BottomNav';
import { TabSalah } from './components/TabSalah';
import { TabDhikr, TabHygiene, TabMDF, TabFitness, TabMemorize, TabQuran, TabRamadan, TabSocial, TabSettings } from './components/SimpleTabs';
import { AppState, INITIAL_DAILY_STATE, INITIAL_GLOBAL_STATE, ViewState, DailyStats, ThemeMode } from './types';
import { STREAK_MILESTONES, MASTER_ACHIEVEMENTS } from './constants'; // Import
import { X, AlertTriangle, CheckCircle2, Snowflake, Trophy } from 'lucide-react';

// --- SOUND ENGINE ---
const useSound = () => {
  const play = (type: 'click' | 'success' | 'error' | 'pop') => {
    try {
      if (navigator.vibrate) {
         if (type === 'click') navigator.vibrate(5);
         if (type === 'success') navigator.vibrate([50, 50, 50]);
         if (type === 'error') navigator.vibrate(300);
         if (type === 'pop') navigator.vibrate(10);
      }
    } catch (e) { }
  };
  return play;
};

// --- NOTIFICATION SYSTEM ---
interface Toast {
  id: string;
  msg: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed top-6 left-0 right-0 z-[9999] flex flex-col items-center gap-3 pointer-events-none px-4">
    {toasts.map(t => (
      <div key={t.id} className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-slide-up flex items-center gap-3 pointer-events-auto min-w-[200px] justify-center ${
        t.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/50 text-white shadow-emerald-900/50' : 
        t.type === 'error' ? 'bg-rose-600/90 border-rose-400/50 text-white shadow-rose-900/50' :
        'bg-blue-600/90 border-blue-400/50 text-white shadow-blue-900/50'
      }`}>
        {t.type === 'success' && <Trophy size={20} className="text-emerald-100" />}
        {t.type === 'error' && <AlertTriangle size={20} className="text-rose-100" />}
        {t.type === 'info' && <Snowflake size={20} className="text-blue-100" />}
        <span className="text-sm font-bold uppercase tracking-wide">{t.msg}</span>
      </div>
    ))}
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center space-y-6 bg-black">
    <div className="w-20 h-20 rounded-full skeleton" />
    <div className="w-48 h-6 rounded-lg skeleton" />
  </div>
);

// --- WIDGET VIEW (STANDBY MODE) ---
const WidgetView = ({ state, onClose }: { state: AppState; onClose: () => void }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nextPrayer = state.daily.prayers.find(p => !p.completed);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white p-8 animate-fade-in cursor-pointer" onClick={onClose}>
        <button onClick={onClose} className="absolute top-8 right-8 opacity-50 hover:opacity-100"><X size={32} /></button>
        
        <div className="text-[10rem] font-bold leading-none tracking-tighter tabular-nums select-none">
           {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-2xl opacity-50 font-light uppercase tracking-[0.5em] mt-4 select-none">
           {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>

        <div className="grid grid-cols-3 gap-12 mt-20 w-full max-w-4xl">
             <div className="text-center">
                <div className="text-6xl font-bold text-emerald-500">{Math.round(state.daily.imanScore)}</div>
                <div className="text-sm uppercase tracking-widest opacity-50 mt-2">Iman Score</div>
             </div>
             <div className="text-center border-x border-white/10">
                <div className="text-4xl font-bold">{nextPrayer ? nextPrayer.name : 'Done'}</div>
                <div className="text-sm uppercase tracking-widest opacity-50 mt-4">Next Prayer</div>
             </div>
             <div className="text-center">
                <div className="text-4xl font-bold text-rose-500">{Math.floor((Date.now() - (state.global.lastRelapseDate || 0)) / (1000 * 60 * 60 * 24))}d</div>
                <div className="text-sm uppercase tracking-widest opacity-50 mt-4">Clean Streak</div>
             </div>
        </div>
        <p className="absolute bottom-8 opacity-20 text-sm uppercase tracking-widest">Tap to exit</p>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [state, setState] = useState<AppState>({ daily: INITIAL_DAILY_STATE, global: INITIAL_GLOBAL_STATE });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const playSound = useSound();

  const addToast = (msg: string, type: Toast['type']) => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Load Data & Streak Logic
  useEffect(() => {
    const saved = localStorage.getItem('zohaib_tracker_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        
        const safeGlobal = { ...INITIAL_GLOBAL_STATE, ...parsed.global, streaks: { ...INITIAL_GLOBAL_STATE.streaks, ...parsed.global.streaks } };
        const safeDaily = parsed.daily.date === today ? { ...INITIAL_DAILY_STATE, ...parsed.daily } : { ...INITIAL_DAILY_STATE, date: today };

        // Streak Logic
        if (parsed.daily.date !== today) {
          const prevDay = parsed.daily;
          const prevImanScore = prevDay.imanScore || 0;
          const isSuccessfulDay = prevImanScore >= 40; 
          
          let newStreaks = { ...safeGlobal.streaks };
          let newFreezes = safeGlobal.streakFreezes;

          if (!isSuccessfulDay) {
              if (newFreezes > 0) {
                  newFreezes -= 1;
                  setTimeout(() => addToast("Streak Freeze Activated!", "info"), 2000);
              } else {
                  newStreaks.salah = 0;
                  newStreaks.dhikr = 0;
                  newStreaks.hygiene = 0;
                  newStreaks.habits = 0;
                  setTimeout(() => addToast("Streaks Reset.", "error"), 2000);
              }
          }

          const history = [...(safeGlobal.history || []), prevDay];
          
          setState({
             daily: safeDaily,
             global: { 
                 ...safeGlobal, 
                 history, 
                 streaks: newStreaks,
                 streakFreezes: newFreezes,
                 lastRelapseDate: safeGlobal.lastRelapseDate || Date.now() 
             }
          });
        } else {
          setState({ daily: safeDaily, global: safeGlobal });
        }
      } catch (e) {
        console.error("Save file corrupted", e);
        setState({ daily: INITIAL_DAILY_STATE, global: INITIAL_GLOBAL_STATE });
      }
    }
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Save Data
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('zohaib_tracker_v3', JSON.stringify(state));
    }
  }, [state, isLoading]);

  // Theme Engine
  useEffect(() => {
    const applyTheme = () => {
       const root = document.body;
       root.classList.remove('theme-day', 'theme-night');
       if (state.global.theme === 'DAY') root.classList.add('theme-day');
       else if (state.global.theme === 'NIGHT') root.classList.add('theme-night');
       else {
         const hour = new Date().getHours();
         if (hour >= 7 && hour < 18) root.classList.add('theme-day');
         else root.classList.add('theme-night');
       }
    };
    applyTheme();
    const interval = setInterval(applyTheme, 60000);
    return () => clearInterval(interval);
  }, [state.global.theme]);

  const calculateImanScore = (daily: DailyStats) => {
    let score = 0;
    const fardh = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const completedFardh = daily.prayers.filter(p => fardh.includes(p.id) && p.completed).length;
    score += (completedFardh * 8); 
    
    const quranDone = daily.quranParts.rub || daily.quranParts.nisf || daily.quranParts.thalatha || daily.quranParts.kamil || daily.surahMulk || daily.surahBaqarah;
    if (quranDone) score += 20;
    
    const totalDhikr = daily.dhikrAstaghfirullah + daily.dhikrRabbiInni;
    if (totalDhikr >= 2100) score += 20; 
    
    if (daily.mdfCheckIn) score += 20;
    
    return Math.min(100, score);
  };

  // --- SMART ACHIEVEMENT CHECKER (Optimized) ---
  const checkAchievements = (current: AppState) => {
      const unlockedSet = new Set(current.global.unlockedAchievements);
      let newUnlock = false;
      const newUnlockedList = [...current.global.unlockedAchievements];

      const unlock = (id: string, msg: string) => {
          if (!unlockedSet.has(id)) {
              unlockedSet.add(id);
              newUnlockedList.push(id);
              addToast(msg, 'success');
              playSound('success');
              newUnlock = true;
          }
      };

      // Helper for Streaks using generated milestones
      const checkStreak = (metric: number, prefix: string, label: string) => {
          STREAK_MILESTONES.forEach(day => {
              if (metric >= day) unlock(`${prefix}_streak_${day}`, `${label} Streak: ${day} Days`);
          });
      };

      // 1. Salah
      checkStreak(current.global.streaks.salah, 's', 'Salah');
      if (current.global.qadaBank === 0) unlock('s_qada_0', 'Unlocked: Zero Qada Pledge');

      // 2. Dhikr
      checkStreak(current.global.streaks.dhikr, 'd', 'Dhikr');
      const totalDhikr = current.global.history.reduce((acc, day) => acc + (day.dhikrAstaghfirullah || 0) + (day.dhikrRabbiInni || 0), 0) 
                       + current.daily.dhikrAstaghfirullah + current.daily.dhikrRabbiInni;
      if (totalDhikr >= 1000) unlock('d_vol_1000', '1k Dhikr');
      if (totalDhikr >= 10000) unlock('d_vol_10000', '10k Dhikr');
      if (totalDhikr >= 100000) unlock('d_vol_100000', '100k Dhikr');
      if (totalDhikr >= 1000000) unlock('d_vol_1000000', '1 Million Dhikr');

      // 3. MDF & Hygiene & Fitness & Habits
      checkStreak(current.global.streaks.mdf, 'm', 'Purity');
      checkStreak(current.global.streaks.hygiene, 'h', 'Hygiene');
      checkStreak(current.global.streaks.fitness, 'f', 'Fitness');
      checkStreak(current.global.streaks.habits, 'hb', 'Discipline');

      // 4. Quran & Ramadan (Added new streak checks)
      checkStreak(current.global.streaks.quranSurah, 'q', 'Quran');
      checkStreak(current.global.streaks.ramadan, 'r', 'Ramadan');

      // 5. Social / XP (Custom Logic for XP Achievements)
      // We loop through MASTER_ACHIEVEMENTS looking for XP ones
      const xp = current.global.xp;
      MASTER_ACHIEVEMENTS.filter(a => a.category === 'SOCIAL' && a.id.startsWith('xp_')).forEach(a => {
          const required = parseInt(a.id.split('_')[1]);
          if (xp >= required) unlock(a.id, `Unlocked: ${a.title}`);
      });

      // 6. Memorize (Week Checks)
      const memWeek = current.global.memorizeWeek || 1;
      MASTER_ACHIEVEMENTS.filter(a => a.id.startsWith('mem_wk_')).forEach(a => {
         const w = parseInt(a.id.split('_')[2]);
         // Unlock previous weeks if we are ahead
         if (memWeek > w) unlock(a.id, `Memorized: Week ${w}`);
      });

      // Specifics
      const totalWorkouts = current.global.history.filter(d => d.fitness.type !== 'Rest').length + (current.daily.fitness.type !== 'Rest' ? 1 : 0);
      if (totalWorkouts >= 1) unlock('f_1', 'First Workout Logged');
      
      if (current.global.currentParah >= 30) unlock('q_parah_30', 'Juz 30 Completed');
      if (current.global.quransRecited >= 1) unlock('q_khatam_1', 'Quran Completed');
      
      if (newUnlock) {
          return { ...current, global: { ...current.global, unlockedAchievements: newUnlockedList } };
      }
      return current;
  };

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
       const next = updater(prev);
       next.daily.imanScore = calculateImanScore(next.daily);
       const withAchievements = checkAchievements(next);
       return withAchievements;
    });
  };

  // --- ACTIONS ---
  const buyFreeze = () => {
    if (state.global.xp >= 500) {
        playSound('success');
        updateState(prev => ({
            ...prev,
            global: {
                ...prev.global,
                xp: prev.global.xp - 500,
                streakFreezes: (prev.global.streakFreezes || 0) + 1
            }
        }));
        addToast("Freeze Purchased!", "success");
    } else {
        playSound('error');
        addToast("Need 500 XP", "error");
    }
  };
  
  const hardReset = () => {
      if(confirm("Are you sure? This will wipe ALL data permanently.")) {
          localStorage.removeItem('zohaib_tracker_v3');
          window.location.reload();
      }
  }

  const handleUpdatePrayer = (id: string, completed: boolean, isJamaah: boolean) => {
    playSound('click');
    updateState(prev => {
      const newState = {
        ...prev,
        daily: {
          ...prev.daily,
          prayers: prev.daily.prayers.map(p => p.id === id ? { ...p, completed, isJamaah, completedAt: completed ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null } : p)
        }
      };
      const allDone = newState.daily.prayers.filter(p => ['fajr','dhuhr','asr','maghrib','isha'].includes(p.id) && p.completed).length === 5;
      const prevAllDone = prev.daily.prayers.filter(p => ['fajr','dhuhr','asr','maghrib','isha'].includes(p.id) && p.completed).length === 5;
      
      if (allDone && !prevAllDone) {
          const newStreak = newState.global.streaks.salah + 1;
          newState.global.streaks.salah = newStreak;
          newState.global.streaks.maxSalah = Math.max(newState.global.streaks.maxSalah || 0, newStreak);
          newState.global.xp += 50;
          addToast("Daily Salah Complete!", "success");
      }
      return newState;
    });
  };

  const handleDhikr = (type: 'astaghfirullah' | 'rabbiInni', amt: number) => {
     if (amt === 1) playSound('pop');
     updateState(prev => {
        const newState = {
           ...prev,
           daily: {
              ...prev.daily,
              dhikrAstaghfirullah: type === 'astaghfirullah' ? prev.daily.dhikrAstaghfirullah + amt : prev.daily.dhikrAstaghfirullah,
              dhikrRabbiInni: type === 'rabbiInni' ? prev.daily.dhikrRabbiInni + amt : prev.daily.dhikrRabbiInni
           }
        };
        
        const currentCount = type === 'astaghfirullah' ? newState.daily.dhikrAstaghfirullah : newState.daily.dhikrRabbiInni;
        const prevCount = type === 'astaghfirullah' ? prev.daily.dhikrAstaghfirullah : prev.daily.dhikrRabbiInni;

        if (currentCount >= 2100 && prevCount < 2100) {
            const newStreak = newState.global.streaks.dhikr + 1; 
            newState.global.streaks.maxDhikr = Math.max(newState.global.streaks.maxDhikr || 0, newStreak);
            newState.global.xp += 30;
            addToast("Dhikr Goal (2100) Reached!", "success");
        }
        return newState;
     });
  };
  
  const handleHygiene = (key: 'shower' | 'brush' | 'water' | 'reset_water') => {
      playSound('click');
      updateState(prev => {
          const updatedHygiene = { ...prev.daily.hygiene };
          
          if (key === 'reset_water') {
              updatedHygiene.waterGlasses = 0;
              addToast("Water Reset", "info");
          } else if (key === 'water') {
              updatedHygiene.waterGlasses = (updatedHygiene.waterGlasses || 0) + 1;
          } else if (key === 'shower') {
              updatedHygiene.shower = !updatedHygiene.shower;
          } else if (key === 'brush') {
              updatedHygiene.brush = !updatedHygiene.brush;
          }

          const newState = {
              ...prev,
              daily: { ...prev.daily, hygiene: updatedHygiene }
          };
          
          if (key === 'water' && updatedHygiene.waterGlasses === 8) {
             addToast("Hydration Goal Met!", "success");
          }

          const isComplete = newState.daily.hygiene.shower && newState.daily.hygiene.brush && newState.daily.hygiene.waterGlasses >= 8;
          const wasComplete = prev.daily.hygiene.shower && prev.daily.hygiene.brush && prev.daily.hygiene.waterGlasses >= 8;
          
          if (isComplete && !wasComplete) {
              newState.global.streaks.hygiene += 1;
              newState.global.xp += 40;
              addToast("Hygiene Streak +1", "success");
          }

          return newState;
      });
  };

  const handleMDFCheckIn = () => {
    playSound('success');
    updateState(prev => {
        const newState = { ...prev, daily: { ...prev.daily, mdfCheckIn: true } };
        const newStreak = newState.global.streaks.mdf + 1;
        newState.global.streaks.mdf = newStreak;
        newState.global.streaks.maxMdf = Math.max(newState.global.streaks.maxMdf || 0, newStreak);
        newState.global.xp += 20;
        addToast("Pledge Secured!", "success");
        return newState;
    });
  };

  // Refactored with Type Safety
  const handleQuranProgress = (part: string) => {
    // Safely checking if the string matches the keys of quranParts
    if (!['rub', 'nisf', 'thalatha', 'kamil'].includes(part)) return;

    const p = part as keyof typeof state.daily.quranParts;
    playSound('click');
    setState(prev => {
        const newParts = { ...prev.daily.quranParts, [p]: !prev.daily.quranParts[p] };
        const allDone = newParts.rub && newParts.nisf && newParts.thalatha && newParts.kamil;

        if (allDone) {
            playSound('success');
            let newParah = prev.global.currentParah + 1;
            let newQurans = prev.global.quransRecited;

            if (newParah > 30) {
                newParah = 1;
                newQurans += 1;
            }
            
            addToast("Juz Completed! +100 XP", "success");

            return {
                ...prev,
                global: {
                    ...prev.global,
                    currentParah: newParah,
                    quransRecited: newQurans,
                    streaks: { ...prev.global.streaks, quranSurah: prev.global.streaks.quranSurah + 1 },
                    xp: prev.global.xp + 100,
                    unlockedAchievements: [...prev.global.unlockedAchievements] 
                },
                daily: {
                    ...prev.daily,
                    quranParts: { rub: false, nisf: false, thalatha: false, kamil: false }
                }
            };
        } else {
            return { ...prev, daily: { ...prev.daily, quranParts: newParts } };
        }
    });
  };

  const handleSurahUpdate = (surah: string) => {
    playSound('click');
    const key = surah === 'mulk' ? 'surahMulk' : 'surahBaqarah';
    updateState(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        [key]: !prev.daily[key]
      }
    }));
  };

  const handleHabitUpdate = (habit: string) => {
    const key = habit === 'smoking' ? 'smokingCount' : 'nicotineCount';
    updateState(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        habits: {
          ...prev.daily.habits,
          [key]: prev.daily.habits[key] + 1
        }
      }
    }));
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const node = document.createElement('a');
    node.setAttribute("href", dataStr);
    node.setAttribute("download", "zohaib_backup_" + new Date().toISOString().slice(0,10) + ".json");
    document.body.appendChild(node);
    node.click();
    node.remove();
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
       const file = (e.target as HTMLInputElement).files?.[0];
       if (!file) return;
       const reader = new FileReader();
       reader.onload = r => {
          try {
             const parsed = JSON.parse(r.target?.result as string);
             setState(parsed);
             addToast("Data Restored", "success");
          } catch (err) { addToast("Invalid File", "error"); }
       }
       reader.readAsText(file);
    }
    input.click();
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Atmosphere mode={state.global.theme} />
      <ToastContainer toasts={toasts} />
      
      {view === ViewState.WIDGET && (
         <WidgetView state={state} onClose={() => setView(ViewState.DASHBOARD)} />
      )}

      {view !== ViewState.WIDGET && (
        <div className="min-h-screen relative z-10 max-w-md mx-auto">
          {view === ViewState.DASHBOARD && <Dashboard state={state} changeView={setView} />}
          {view === ViewState.SALAH && <TabSalah state={state} updatePrayer={handleUpdatePrayer} updateQada={(amt) => updateState(prev => ({ ...prev, global: { ...prev.global, qadaBank: Math.max(0, prev.global.qadaBank + amt) } }))} onBack={() => setView(ViewState.DASHBOARD)} />}
          {view === ViewState.DHIKR && <TabDhikr state={state} updateDhikr={handleDhikr} />}
          
          {view === ViewState.QURAN && (
              <TabQuran 
                state={state} 
                updatePart={handleQuranProgress} 
                updateSurah={handleSurahUpdate} 
              />
          )}
          
          {view === ViewState.MDF && <TabMDF state={state} resetRelapse={() => updateState(prev => ({...prev, global: {...prev.global, lastRelapseDate: Date.now(), streaks: {...prev.global.streaks, mdf: 0}}, daily: {...prev.daily, habits: {...prev.daily.habits, failedToday: true}}}))} checkIn={handleMDFCheckIn} />}
          {view === ViewState.SOCIAL && <TabSocial state={state} />}
          {view === ViewState.HYGIENE && <TabHygiene state={state} updateHygiene={handleHygiene} updateHabit={handleHabitUpdate} />}
          
          {view === ViewState.FITNESS && <TabFitness state={state} updateType={(t) => updateState(prev => ({...prev, daily: {...prev.daily, fitness: {...prev.daily.fitness, type: t}}}))} />}
          {view === ViewState.MEMORIZE && <TabMemorize state={state} />}
          {view === ViewState.RAMADAN && <TabRamadan state={state} />}
          
          {view === ViewState.SETTINGS && <TabSettings state={state} setTheme={(t) => updateState(prev => ({...prev, global: {...prev.global, theme: t}}))} toggleRamadan={() => updateState(prev => ({...prev, global: {...prev.global, ramadanMode: !prev.global.ramadanMode}}))} exportData={exportData} importData={importData} enterWidgetMode={() => setView(ViewState.WIDGET)} onBack={() => setView(ViewState.DASHBOARD)} buyFreeze={buyFreeze} resetApp={hardReset} />}

          <BottomNav currentView={view} changeView={setView} ramadanMode={state.global.ramadanMode} />
        </div>
      )}
    </>
  );
};

export default App;
