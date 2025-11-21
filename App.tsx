
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { Dashboard } from './components/Dashboard';
import { BottomNav } from './components/BottomNav';
import { TabSalah } from './components/TabSalah';
import { TabDhikr, TabHygiene, TabMDF, TabFitness, TabMemorize, TabQuran, TabRamadan } from './components/SimpleTabs';
import { AppState, INITIAL_DAILY_STATE, INITIAL_GLOBAL_STATE, ViewState, DailyStats } from './types';
import { MASTER_ACHIEVEMENTS } from './constants';
import { Upload, Download, Trash2, CheckCircle2, FileText, AlertCircle, Sun, Moon, Monitor, ShoppingBag, Snowflake, X } from 'lucide-react';

// --- SOUND ENGINE ---
const useSound = () => {
  const play = (type: 'click' | 'success' | 'error' | 'pop') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'pop') {
         osc.type = 'triangle';
         osc.frequency.setValueAtTime(600, now);
         gain.gain.setValueAtTime(0.05, now);
         gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
         osc.start(now);
         osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        
        // Harmony
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(600, now + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
        gain2.gain.setValueAtTime(0.05, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.6);

      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Silent fail
    }
  };
  return play;
};

// --- COMPONENTS ---

const LoadingScreen = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center space-y-6 bg-black">
    <div className="w-20 h-20 rounded-full skeleton" />
    <div className="w-48 h-6 rounded-lg skeleton" />
    <div className="space-y-2 w-full max-w-xs px-8">
       <div className="w-full h-32 rounded-2xl skeleton" />
       <div className="flex gap-2">
          <div className="w-1/2 h-32 rounded-2xl skeleton" />
          <div className="w-1/2 h-32 rounded-2xl skeleton" />
       </div>
    </div>
  </div>
);

const OnboardingOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Welcome to Zohaib Tracker", text: "Your all-in-one spiritual operating system. Let's take a quick tour." },
    { title: "Bento Dashboard", text: "Your day at a glance. Tiles are interactive. Tap Salah to log prayers, Dhikr to count tasbeeh." },
    { title: "Growth & Stats", text: "Everything you do earns XP. Level up your spiritual tree from Seed to Forest." },
    { title: "Iman Score", text: "A daily score (0-100) based on Prayer, Quran, Dhikr, and Discipline." },
    { title: "Ready?", text: "Let's start building your Akhirah, one day at a time." }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-fade-in">
       <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-2 bg-emerald-500 rounded-full mx-auto mb-10" />
          <h2 className="text-4xl font-bold text-white tracking-tight">{steps[step].title}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{steps[step].text}</p>
          
          <div className="pt-10 flex flex-col gap-3">
            <button 
              onClick={() => {
                if (step < steps.length - 1) setStep(s => s + 1);
                else onComplete();
              }}
              className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
            >
              {step < steps.length - 1 ? "Next" : "Get Started"}
            </button>
            {step < steps.length - 1 && (
               <button onClick={onComplete} className="text-sm text-gray-500 font-bold uppercase tracking-widest py-4">Skip Tour</button>
            )}
          </div>
          <div className="flex justify-center gap-2 mt-4">
             {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-emerald-500 w-6' : 'bg-gray-700'}`} />
             ))}
          </div>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [state, setState] = useState<AppState>({
    daily: INITIAL_DAILY_STATE,
    global: INITIAL_GLOBAL_STATE
  });
  const [showToast, setShowToast] = useState<string | null>(null);
  const playSound = useSound();

  // --- THEME HANDLER ---
  useEffect(() => {
    // Apply class to body for global styling
    const body = document.body;
    body.classList.remove('theme-day', 'theme-night');
    
    if (state.global.theme === 'DAY') {
      body.classList.add('theme-day');
    } else if (state.global.theme === 'NIGHT') {
       body.classList.add('theme-night');
    } else {
       // Auto
       const hour = new Date().getHours();
       if (hour >= 7 && hour < 18) body.classList.add('theme-day');
       else body.classList.add('theme-night');
    }
  }, [state.global.theme]);

  // --- PERSISTENCE & INIT ---
  useEffect(() => {
    // Simulated Loading
    setTimeout(() => setIsLoading(false), 1500);

    const saved = localStorage.getItem('zohaib_tracker_v3');
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        
        if (parsed.daily.date !== today) {
          // --- NEW DAY LOGIC ---
          const yesterdayStats = parsed.daily;
          const newHistory = [...(parsed.global.history || []), yesterdayStats].slice(-30); // Keep 30 days
          const oldStreaks = { ...parsed.global.streaks };
          let currentFreezes = parsed.global.streakFreezes || 0;
          let usedFreeze = false;

          // 1. Determine Failures
          const passedSalah = yesterdayStats.prayers.every(p => p.completed);
          const passedDhikr = yesterdayStats.dhikrAstaghfirullah >= 2100 && yesterdayStats.dhikrRabbiInni >= 2100;
          const passedHygiene = yesterdayStats.hygiene.shower && yesterdayStats.hygiene.brush && yesterdayStats.hygiene.waterGlasses >= 8;
          const passedHabits = !yesterdayStats.habits.failedToday && yesterdayStats.habits.smokingCount <= 2 && yesterdayStats.habits.nicotineCount <= 3;
          const passedQuran = yesterdayStats.surahMulk && yesterdayStats.surahBaqarah;
          const passedRamadan = parsed.global.ramadanMode ? yesterdayStats.ramadan.fasting : true;

          // 2. Check if protection is needed
          const needsProtection = 
             (!passedSalah && oldStreaks.salah > 0) ||
             (!passedDhikr && oldStreaks.dhikr > 0) ||
             (!passedHygiene && oldStreaks.hygiene > 0) ||
             (!passedHabits && oldStreaks.habits > 0) ||
             (!passedQuran && oldStreaks.quranSurah > 0) ||
             (!passedRamadan && oldStreaks.ramadan > 0);

          if (needsProtection && currentFreezes > 0) {
             currentFreezes -= 1;
             usedFreeze = true;
          }

          const newStreaks = {
             salah: passedSalah ? oldStreaks.salah + 1 : (usedFreeze ? oldStreaks.salah : 0),
             dhikr: passedDhikr ? oldStreaks.dhikr + 1 : (usedFreeze ? oldStreaks.dhikr : 0),
             hygiene: passedHygiene ? oldStreaks.hygiene + 1 : (usedFreeze ? oldStreaks.hygiene : 0),
             habits: passedHabits ? oldStreaks.habits + 1 : (usedFreeze ? oldStreaks.habits : 0),
             quranSurah: passedQuran ? oldStreaks.quranSurah + 1 : (usedFreeze ? oldStreaks.quranSurah : 0),
             ramadan: parsed.global.ramadanMode 
                ? (yesterdayStats.ramadan.fasting ? oldStreaks.ramadan + 1 : (usedFreeze ? oldStreaks.ramadan : 0)) 
                : oldStreaks.ramadan,
             mdf: oldStreaks.mdf,
             fitness: oldStreaks.fitness,
             maxSalah: Math.max(oldStreaks.maxSalah, passedSalah ? oldStreaks.salah + 1 : oldStreaks.salah),
             maxDhikr: Math.max(oldStreaks.maxDhikr, passedDhikr ? oldStreaks.dhikr + 1 : oldStreaks.dhikr),
             maxMdf: oldStreaks.maxMdf
          };

          setState({
            global: { ...parsed.global, history: newHistory, streaks: newStreaks, streakFreezes: currentFreezes },
            daily: { ...INITIAL_DAILY_STATE, date: today }
          });

          if (usedFreeze) {
             setTimeout(() => {
                 playSound('pop');
                 setShowToast("❄️ Streak Freeze Used! Stats Saved.");
             }, 2000);
          }

        } else {
          setState(parsed);
        }
      } catch (e) {
        console.error("Save file corrupted");
      }
    }
  }, []);

  // --- DERIVED STATE & AUTOSAVE ---
  useEffect(() => {
    let updates: any = {};
    let hasGlobalUpdates = false;
    let hasDailyUpdates = false;

    // 1. MDF Streak Sync (Time-based)
    const mdfDays = Math.floor((Date.now() - (state.global.lastRelapseDate || Date.now())) / (1000 * 60 * 60 * 24));
    if (state.global.streaks.mdf !== mdfDays) {
        updates.global = { ...(updates.global || state.global), streaks: { ...(updates.global?.streaks || state.global.streaks), mdf: mdfDays } };
        hasGlobalUpdates = true;
    }

    // 2. Iman Score Calculation
    const prayersDone = state.daily.prayers.filter(p => p.completed).length;
    const prayerScore = (prayersDone / 6) * 40;

    const quranPartsCount = (state.daily.quranParts.rub ? 1 : 0) + 
                            (state.daily.quranParts.nisf ? 1 : 0) + 
                            (state.daily.quranParts.thalatha ? 1 : 0) + 
                            (state.daily.quranParts.kamil ? 1 : 0);
    const quranScore = quranPartsCount > 0 ? 20 : 0;

    const dhikrTotal = Math.min(state.daily.dhikrAstaghfirullah, 2100) + Math.min(state.daily.dhikrRabbiInni, 2100);
    const dhikrScore = (dhikrTotal / 4200) * 20;

    const lastRelapse = new Date(state.global.lastRelapseDate || 0);
    const today = new Date();
    const isRelapsedToday = lastRelapse.getDate() === today.getDate() && 
                            lastRelapse.getMonth() === today.getMonth() && 
                            lastRelapse.getFullYear() === today.getFullYear();
    const mdfScore = isRelapsedToday ? 0 : 20;

    const newImanScore = Math.min(100, Math.round(prayerScore + quranScore + dhikrScore + mdfScore));

    if (state.daily.imanScore !== newImanScore) {
        updates.daily = { ...(updates.daily || state.daily), imanScore: newImanScore };
        hasDailyUpdates = true;
    }

    // 3. Achievements Check
    const currentGlobal = hasGlobalUpdates ? updates.global : state.global;
    const unlockedIds = new Set(currentGlobal.unlockedAchievements);
    let newUnlocks: string[] = [];

    MASTER_ACHIEVEMENTS.forEach(ach => {
      if (unlockedIds.has(ach.id)) return;
      
      const checkStreak = (prefix: string, currentStreak: number) => {
          if (ach.id.startsWith(prefix)) {
             const target = parseInt(ach.id.split('_')[1]);
             if (!isNaN(target) && currentStreak >= target) newUnlocks.push(ach.id);
          }
      };

      checkStreak('s_', currentGlobal.streaks.salah);
      checkStreak('d_', currentGlobal.streaks.dhikr);
      checkStreak('m_', currentGlobal.streaks.mdf);
      checkStreak('h_', currentGlobal.streaks.hygiene);
      checkStreak('hb_', currentGlobal.streaks.habits);
      checkStreak('r_', currentGlobal.streaks.ramadan);
      
      if (ach.id === 'q_khatam_1' && currentGlobal.quransRecited >= 1) newUnlocks.push(ach.id);
      if (ach.id === 'q_khatam_10' && currentGlobal.quransRecited >= 10) newUnlocks.push(ach.id);
    });

    if (newUnlocks.length > 0) {
       updates.global = { 
           ...(updates.global || currentGlobal), 
           unlockedAchievements: [...currentGlobal.unlockedAchievements, ...newUnlocks],
           xp: currentGlobal.xp + (newUnlocks.length * 100)
       };
       hasGlobalUpdates = true;
       setTimeout(() => {
          playSound('success');
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          setShowToast(`🏆 ${newUnlocks.length} New Achievement(s)!`);
       }, 500);
    }

    if (hasGlobalUpdates || hasDailyUpdates) {
        setState(prev => ({
            global: hasGlobalUpdates ? updates.global : prev.global,
            daily: hasDailyUpdates ? updates.daily : prev.daily
        }));
    }

    localStorage.setItem('zohaib_tracker_v3', JSON.stringify(state));
  }, [state.daily, state.global.lastRelapseDate, state.global.streaks.mdf]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // --- ACTIONS ---
  const updatePrayer = (id: string, isComplete: boolean, isJamaah: boolean) => {
    playSound(isComplete ? 'success' : 'click');
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
      return {
        ...prev,
        daily: { ...prev.daily, prayers: newPrayers },
        global: { ...prev.global, xp: prev.global.xp + (isComplete ? 10 : 0) }
      };
    });
  };

  const updateQada = (amount: number) => {
    playSound('click');
    setState(prev => ({
      ...prev,
      global: { ...prev.global, qadaBank: prev.global.qadaBank + amount }
    }));
  };

  const updateDhikr = (type: 'astaghfirullah' | 'rabbiInni', amount: number) => {
    playSound('pop');
    if (navigator.vibrate) navigator.vibrate(5); // Micro-haptic
    setState(prev => ({
      ...prev,
      daily: { 
        ...prev.daily, 
        dhikrAstaghfirullah: type === 'astaghfirullah' ? prev.daily.dhikrAstaghfirullah + amount : prev.daily.dhikrAstaghfirullah,
        dhikrRabbiInni: type === 'rabbiInni' ? prev.daily.dhikrRabbiInni + amount : prev.daily.dhikrRabbiInni
      }
    }));
  };

  const updateHygiene = (key: 'shower' | 'brush' | 'water', val?: number) => {
    playSound('click');
    setState(prev => {
      const newHygiene = { ...prev.daily.hygiene };
      if (key === 'water') newHygiene.waterGlasses = (newHygiene.waterGlasses || 0) + (val || 1);
      else if (key === 'shower') newHygiene.shower = !newHygiene.shower;
      else if (key === 'brush') newHygiene.brush = !newHygiene.brush;
      return { ...prev, daily: { ...prev.daily, hygiene: newHygiene }};
    });
  };

  const updateHabit = (type: 'smoking' | 'nicotine') => {
    playSound('error');
    setState(prev => {
      const newHabits = { ...prev.daily.habits };
      if (type === 'smoking') newHabits.smokingCount += 1;
      if (type === 'nicotine') newHabits.nicotineCount += 1;
      if (newHabits.smokingCount > 2 || newHabits.nicotineCount > 3) {
        newHabits.failedToday = true;
      }
      const newStreaks = { ...prev.global.streaks };
      if (newHabits.failedToday && !prev.daily.habits.failedToday) {
        newStreaks.habits = 0;
      }
      return {
        ...prev,
        daily: { ...prev.daily, habits: newHabits },
        global: { ...prev.global, streaks: newStreaks }
      };
    });
  };

  const updateQuranPart = (part: string) => {
    playSound('success');
    setState(prev => {
      const newParts = { ...prev.daily.quranParts, [part]: true };
      let newRecited = prev.global.quransRecited;
      let newParah = prev.global.currentParah;

      if (part === 'kamil' && !prev.daily.quranParts.kamil) {
        newParah += 1;
        if (newParah > 30) {
          newParah = 1;
          newRecited += 1;
        }
      }
      
      return {
        ...prev,
        daily: { ...prev.daily, quranParts: newParts },
        global: { ...prev.global, currentParah: newParah, quransRecited: newRecited }
      };
    });
  };
  
  const updateSurah = (type: 'mulk' | 'baqarah') => {
    playSound('click');
    setState(prev => ({
        ...prev,
        daily: { 
            ...prev.daily, 
            surahMulk: type === 'mulk' ? !prev.daily.surahMulk : prev.daily.surahMulk,
            surahBaqarah: type === 'baqarah' ? !prev.daily.surahBaqarah : prev.daily.surahBaqarah 
        }
    }));
  };

  const updateRamadan = (task: keyof DailyStats['ramadan']) => {
     playSound('click');
     setState(prev => ({
         ...prev,
         daily: { ...prev.daily, ramadan: { ...prev.daily.ramadan, [task]: !prev.daily.ramadan[task] } }
     }));
  };

  const resetRelapse = () => {
    playSound('error');
    if (navigator.vibrate) navigator.vibrate(500);
    setState(prev => ({
      ...prev,
      global: { ...prev.global, lastRelapseDate: Date.now(), streaks: { ...prev.global.streaks, mdf: 0 } }
    }));
  };

  const buyFreeze = () => {
    if (state.global.xp >= 200 && (state.global.streakFreezes || 0) < 3) {
       playSound('success');
       setState(prev => ({
           ...prev,
           global: { 
             ...prev.global, 
             xp: prev.global.xp - 200,
             streakFreezes: (prev.global.streakFreezes || 0) + 1
           }
       }));
       setShowToast("❄️ Freeze Purchased!");
    } else {
      playSound('error');
      if (state.global.xp < 200) setShowToast("Not enough XP!");
      else setShowToast("Max Inventory Reached!");
    }
  };

  const completeOnboarding = () => {
    playSound('success');
    setState(p => ({...p, global: {...p.global, hasSeenOnboarding: true}}));
  };

  // --- RENDER VIEW ---
  const renderView = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <Dashboard state={state} changeView={(v) => { playSound('click'); setView(v); }} />;
      case ViewState.SALAH:
        return <TabSalah state={state} updatePrayer={updatePrayer} updateQada={updateQada} onBack={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.DHIKR:
        return <TabDhikr state={state} updateDhikr={updateDhikr} />;
      case ViewState.HYGIENE:
        return <TabHygiene state={state} updateHygiene={updateHygiene} updateHabit={updateHabit} />;
      case ViewState.MDF:
        return <TabMDF state={state} resetRelapse={resetRelapse} />;
      case ViewState.FITNESS:
        return <TabFitness state={state} logWeight={(w) => setState(p => ({...p, daily: {...p.daily, fitness: {...p.daily.fitness, weight: w}}}))} />;
      case ViewState.MEMORIZE:
        return <TabMemorize state={state} completeReview={() => setState(p => ({...p, daily: {...p.daily, completedDuaReview: true}}))} />;
      case ViewState.QURAN:
        return <TabQuran state={state} updatePart={updateQuranPart} updateSurah={updateSurah} />;
      case ViewState.RAMADAN:
        return <TabRamadan state={state} updateTask={updateRamadan} />;
      case ViewState.SETTINGS:
        return (
            <div className="glass-panel p-6 rounded-[2rem] space-y-6 animate-fade-in pt-10">
                <h2 className="text-2xl font-bold tracking-tight px-2 flex items-center gap-3"><FileText /> Settings</h2>
                
                {/* STORE */}
                <div className="p-5 glass-panel rounded-2xl border border-blue-500/20 bg-blue-900/10 space-y-4 relative overflow-hidden">
                   <div className="absolute -right-5 -top-5 text-blue-500/10 rotate-12"><ShoppingBag size={100} /></div>
                   <h3 className="text-sm text-blue-400 font-bold uppercase tracking-wide flex items-center gap-2 relative z-10"><ShoppingBag size={16}/> Spiritual Shop</h3>
                   <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-white/5 relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Snowflake size={20} /></div>
                         <div>
                            <h4 className="font-bold text-sm text-white">Streak Freeze</h4>
                            <p className="text-[10px] text-gray-400">Auto-protects missed days.</p>
                            <p className="text-[10px] text-blue-300 mt-0.5">Owned: {state.global.streakFreezes || 0} / 3</p>
                         </div>
                      </div>
                      <button onClick={buyFreeze} disabled={state.global.xp < 200 || (state.global.streakFreezes || 0) >= 3} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95 ${state.global.xp >= 200 && (state.global.streakFreezes || 0) < 3 ? 'bg-blue-500 text-white border-blue-400 hover:bg-blue-400' : 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed'}`}>Buy 200 XP</button>
                   </div>
                </div>

                {/* Theme */}
                <div className="p-5 glass-panel rounded-2xl border border-white/5 space-y-3">
                   <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wide">Appearance</h3>
                   <div className="flex p-1 bg-black/40 rounded-xl">
                      <button onClick={() => { playSound('click'); setState(p => ({...p, global: {...p.global, theme: 'AUTO'}})) }} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${state.global.theme === 'AUTO' || !state.global.theme ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}><Monitor size={14} /> Auto</button>
                      <button onClick={() => { playSound('click'); setState(p => ({...p, global: {...p.global, theme: 'DAY'}})) }} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${state.global.theme === 'DAY' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}><Sun size={14} /> Day</button>
                      <button onClick={() => { playSound('click'); setState(p => ({...p, global: {...p.global, theme: 'NIGHT'}})) }} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${state.global.theme === 'NIGHT' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}><Moon size={14} /> Night</button>
                   </div>
                </div>

                {/* Reset */}
                <button onClick={() => { if(window.confirm("Wipe data?")) { localStorage.clear(); window.location.reload(); } }} className="w-full p-5 glass-panel rounded-2xl flex items-center justify-center gap-2 hover:bg-red-900/20 text-red-400 border border-red-500/20 active:scale-95 transition-all"><Trash2 size={16} /> Factory Reset App</button>
                <div className="text-center text-[10px] text-gray-600 pt-10">Zohaib Tracker v4.0 • Pro Edition</div>
            </div>
        );
      default: return null;
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans selection:bg-emerald-500/30">
      <Atmosphere mode={state.global.theme || 'AUTO'} />
      {!state.global.hasSeenOnboarding && <OnboardingOverlay onComplete={completeOnboarding} />}
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in">
          <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-emerald-500/30 backdrop-blur-2xl bg-black/80">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-sm font-bold tracking-wide whitespace-nowrap text-white">{showToast}</span>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative z-10">
        {view !== ViewState.DASHBOARD && <div className="pt-4 px-4" />}
        <main className="flex-1 p-2 overflow-y-auto pb-32 no-scrollbar">{renderView()}</main>
        <BottomNav currentView={view} changeView={(v) => { playSound('click'); setView(v); }} ramadanMode={state.global.ramadanMode} />
      </div>
    </div>
  );
};

export default App;
