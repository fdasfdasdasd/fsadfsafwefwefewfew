
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { Dashboard } from './components/Dashboard';
import { BottomNav } from './components/BottomNav';
import { TabSalah } from './components/TabSalah';
import { TabDhikr, TabHealth, TabMDF, TabFitness, TabMemorize, TabQuran } from './components/SimpleTabs';
import { AppState, INITIAL_DAILY_STATE, INITIAL_GLOBAL_STATE, ViewState, DailyStats, GlobalStats } from './types';
import { MASTER_ACHIEVEMENTS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [state, setState] = useState<AppState>({
    daily: INITIAL_DAILY_STATE,
    global: INITIAL_GLOBAL_STATE
  });

  // --- PERSISTENCE & INIT ---
  useEffect(() => {
    const saved = localStorage.getItem('zohaib_tracker_v1');
    if (saved) {
      const parsed: AppState = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      
      if (parsed.daily.date !== today) {
        // --- NEW DAY LOGIC ---
        
        // 1. Archive Yesterday
        const yesterdayStats = parsed.daily;
        const newHistory = [...(parsed.global.history || []), yesterdayStats].slice(-30); // Keep last 30 days

        // 2. Calculate Streaks (Simple Logic: If yesterday has data, keep streak, else reset)
        // NOTE: In a production app, we check specific dates. Here we assume if date != today, we check yesterday.
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayString = yesterdayDate.toISOString().split('T')[0];
        
        const missedYesterday = parsed.daily.date !== yesterdayString;

        const newStreaks = { ...parsed.global.streaks };
        
        // Reset logic if user skipped a full day
        if (missedYesterday && parsed.daily.date < yesterdayString) {
            newStreaks.salah = 0;
            newStreaks.dhikr = 0;
            newStreaks.water = 0;
            newStreaks.fitness = 0;
        } else {
            // Increment streaks if criteria met yesterday
            // Salah Streak: Needs 6/6
            if (yesterdayStats.prayers.every(p => p.completed)) newStreaks.salah += 1;
            else newStreaks.salah = 0;

            // Dhikr Streak: > 100
            if (yesterdayStats.dhikrCount > 100) newStreaks.dhikr += 1;
            else newStreaks.dhikr = 0;
        }
        
        // Update Max Streaks
        newStreaks.maxSalah = Math.max(newStreaks.maxSalah, newStreaks.salah);
        newStreaks.maxDhikr = Math.max(newStreaks.maxDhikr, newStreaks.dhikr);

        setState({
          global: { ...parsed.global, history: newHistory, streaks: newStreaks },
          daily: { ...INITIAL_DAILY_STATE, date: today }
        });
      } else {
        // Same Day
        setState(parsed);
      }
    }
  }, []);

  // Auto-save & Achievement Check
  useEffect(() => {
    localStorage.setItem('zohaib_tracker_v1', JSON.stringify(state));
    calculateImanScore();
    checkAchievements();
  }, [state.daily, state.global.xp]); // Trigger on daily changes or XP changes

  // --- LOGIC HELPERS ---

  const calculateImanScore = () => {
    const prayersDone = state.daily.prayers.filter(p => p.completed).length;
    const prayerScore = (prayersDone / 6) * 40;
    const quranScore = state.daily.quranParts.kamil ? 20 : state.daily.quranParts.nisf ? 10 : 0;
    const dhikrScore = Math.min((state.daily.dhikrCount / 2100) * 20, 20);
    const disciplineScore = 20; 

    const total = prayerScore + quranScore + dhikrScore + disciplineScore;
    
    if (total !== state.daily.imanScore) {
      setState(prev => ({
        ...prev,
        daily: { ...prev.daily, imanScore: total }
      }));
    }
  };

  const checkAchievements = () => {
    // Simplified check for performance
    const { streaks, qadaBank } = state.global;
    const unlockedIds = new Set(state.global.unlockedAchievements);
    let newUnlocks: string[] = [];

    MASTER_ACHIEVEMENTS.forEach(ach => {
      if (unlockedIds.has(ach.id)) return;

      // Salah Streak Logic
      if (ach.id.startsWith('salah_streak_')) {
        const target = parseInt(ach.id.split('_')[2]);
        if (streaks.salah >= target) newUnlocks.push(ach.id);
      }

      // Dhikr Logic (Approximate total by daily * streak for demo, ideally track totalDhikr in global)
      // In a real app we add a totalDhikrLifetime field to global stats.
      // Here we check specific achievements just for demo structure.
    });

    if (newUnlocks.length > 0) {
       // Ideally trigger a UI Toast here
       setState(prev => ({
         ...prev,
         global: {
           ...prev.global,
           unlockedAchievements: [...prev.global.unlockedAchievements, ...newUnlocks],
           xp: prev.global.xp + (newUnlocks.length * 100) // 100 XP per achievement
         }
       }));
    }
  };

  // --- ACTIONS ---

  const updatePrayer = (id: string, isComplete: boolean, isJamaah: boolean) => {
    setState(prev => {
      const newPrayers = prev.daily.prayers.map(p => {
        if (p.id === id) {
          return {
            ...p,
            completed: isComplete,
            isJamaah: isJamaah,
            completedAt: isComplete && !p.completed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : p.completedAt
          };
        }
        return p;
      });
      const xpGain = isComplete && !prev.daily.prayers.find(p => p.id === id)?.completed ? (isJamaah ? 20 : 10) : 0;
      return {
        ...prev,
        daily: { ...prev.daily, prayers: newPrayers },
        global: { ...prev.global, xp: prev.global.xp + xpGain }
      };
    });
  };

  const updateQada = (amount: number) => {
    setState(prev => ({
      ...prev,
      global: { ...prev.global, qadaBank: prev.global.qadaBank + amount }
    }));
  };

  const updateDhikr = (amount: number) => {
    setState(prev => ({
      ...prev,
      daily: { ...prev.daily, dhikrCount: prev.daily.dhikrCount + amount },
      global: { ...prev.global, xp: prev.global.xp + (amount > 0 ? 1 : 0) }
    }));
  };

  const addWater = () => {
    setState(prev => ({
      ...prev,
      daily: { ...prev.daily, waterCups: prev.daily.waterCups + 1 }
    }));
  };

  const toggleFasting = () => {
     setState(prev => ({
      ...prev,
      daily: { ...prev.daily, isSunnahFasting: !prev.daily.isSunnahFasting }
    }));
  };

  const resetRelapse = () => {
    setState(prev => ({
      ...prev,
      global: { ...prev.global, lastRelapseDate: Date.now(), streaks: { ...prev.global.streaks, mdf: 0 } }
    }));
  };

  const logWeight = (weight: number) => {
    setState(prev => ({
      ...prev,
      daily: { ...prev.daily, fitness: { ...prev.daily.fitness, weight } }
    }));
  };

  const completeMemorizeReview = () => {
    if (state.daily.completedDuaReview) return;
    setState(prev => {
      const newProgress = prev.global.memorizeProgress + 1;
      let newWeek = prev.global.memorizeWeek;
      let finalProgress = newProgress;
      if (newProgress >= 7) {
        newWeek += 1;
        finalProgress = 0;
      }
      return {
        ...prev,
        daily: { ...prev.daily, completedDuaReview: true },
        global: { ...prev.global, memorizeProgress: finalProgress, memorizeWeek: newWeek, xp: prev.global.xp + 50 }
      };
    });
  };

  const updateQuranPart = (part: string) => {
    setState(prev => {
      const newParts = { ...prev.daily.quranParts, [part]: true };
      let newKhatams = prev.global.quransCompleted;
      let newParah = prev.global.currentParah;

      if (part === 'kamil' && !prev.daily.quranParts.kamil) {
        newParah += 1;
        if (newParah > 30) {
          newParah = 1;
          newKhatams += 1;
        }
      }
      return {
        ...prev,
        daily: { ...prev.daily, quranParts: newParts },
        global: { ...prev.global, currentParah: newParah, quransCompleted: newKhatams, xp: prev.global.xp + 50 }
      };
    });
  };

  // --- RENDER ---

  const renderView = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <Dashboard state={state} changeView={setView} />;
      case ViewState.SALAH:
        return <TabSalah state={state} updatePrayer={updatePrayer} updateQada={updateQada} onBack={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.DHIKR:
        return <TabDhikr state={state} updateDhikr={updateDhikr} />;
      case ViewState.HEALTH:
        return <TabHealth state={state} addWater={addWater} toggleFasting={toggleFasting} />;
      case ViewState.MDF:
        return <TabMDF state={state} resetRelapse={resetRelapse} />;
      case ViewState.FITNESS:
        return <TabFitness state={state} logWeight={logWeight} />;
      case ViewState.MEMORIZE:
        return <TabMemorize state={state} completeReview={completeMemorizeReview} />;
      case ViewState.QURAN:
        return <TabQuran state={state} updatePart={updateQuranPart} />;
      case ViewState.SETTINGS:
        return (
            <div className="glass-panel p-6 rounded-2xl space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <div className="flex justify-between items-center p-4 glass-panel rounded-xl">
                    <span>Ramadan Mode</span>
                    <button 
                        onClick={() => setState(prev => ({...prev, global: {...prev.global, ramadanMode: !prev.global.ramadanMode}}))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${state.global.ramadanMode ? 'bg-emerald-500' : 'bg-gray-600'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.global.ramadanMode ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
                <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }} 
                    className="w-full py-4 bg-red-900/50 text-red-200 rounded-xl border border-red-500/30 hover:bg-red-900"
                >
                    Factory Reset Data
                </button>
                <div className="text-xs text-gray-500 text-center pt-10">
                   ID: {state.global.name} • V 2.0 • Offline Capable
                </div>
            </div>
        );
      default:
        return <div className="p-10 text-center">Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden">
      <Atmosphere />
      
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative z-10">
        <div className="p-4 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg border-2 border-white/20">
                Z
              </div>
              <div>
                 <h3 className="font-bold text-sm">Good Evening, Zohaib</h3>
                 <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SYSTEM ONLINE
                 </div>
              </div>
           </div>
           <button onClick={() => setView(ViewState.SETTINGS)} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
             <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
           </button>
        </div>

        <main className="flex-1 p-4 overflow-y-auto pb-28 no-scrollbar">
           {renderView()}
        </main>

        <BottomNav currentView={view} changeView={setView} ramadanMode={state.global.ramadanMode} />
      </div>
    </div>
  );
};

export default App;
