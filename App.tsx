
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { Dashboard } from './components/Dashboard';
import { BottomNav } from './components/BottomNav';
import { TabSalah } from './components/TabSalah';
import { TabDhikr, TabHygiene, TabMDF, TabFitness, TabMemorize, TabQuran, TabRamadan, TabSocial, TabSettings } from './components/SimpleTabs';
import { AppState, INITIAL_DAILY_STATE, INITIAL_GLOBAL_STATE, ViewState, DailyStats, ThemeMode } from './types';
import { X } from 'lucide-react';

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
      // Simple audio API logic would go here
    } catch (e) { }
  };
  return play;
};

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
  const playSound = useSound();

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('zohaib_tracker_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        // Reset daily stats if new day
        if (parsed.daily.date !== today) {
          const history = [...parsed.global.history, parsed.daily];
          const newDaily = { ...INITIAL_DAILY_STATE, date: today };
          setState({
             daily: newDaily,
             global: { ...parsed.global, history, lastRelapseDate: parsed.global.lastRelapseDate || Date.now() }
          });
        } else {
          setState(parsed);
        }
      } catch (e) {
        console.error("Save file corrupted", e);
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

  // --- STRICT IMAN SCORE LOGIC (0-100) ---
  const calculateImanScore = (daily: DailyStats) => {
    let score = 0;
    
    // 1. Salah (40 pts) - 5 Fardh prayers * 8pts
    const fardh = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const completedFardh = daily.prayers.filter(p => fardh.includes(p.id) && p.completed).length;
    score += (completedFardh * 8);

    // 2. Quran (20 pts) - Any progress
    const quranDone = daily.quranParts.rub || daily.quranParts.nisf || daily.quranParts.thalatha || daily.quranParts.kamil || daily.surahMulk || daily.surahBaqarah;
    if (quranDone) score += 20;

    // 3. Dhikr (20 pts) - >=100 Total
    const totalDhikr = daily.dhikrAstaghfirullah + daily.dhikrRabbiInni;
    if (totalDhikr >= 100) score += 20;

    // 4. MDF Pledge (20 pts) - Manual Check-in
    if (daily.mdfCheckIn) score += 20;

    return Math.min(100, score);
  };

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
       const next = updater(prev);
       next.daily.imanScore = calculateImanScore(next.daily); // Auto-calc score
       return next;
    });
  };

  // --- HANDLERS ---
  const handleUpdatePrayer = (id: string, completed: boolean, isJamaah: boolean) => {
    playSound('click');
    updateState(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        prayers: prev.daily.prayers.map(p => p.id === id ? { ...p, completed, isJamaah, completedAt: completed ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null } : p)
      }
    }));
  };

  const handleDhikr = (type: 'astaghfirullah' | 'rabbiInni', amt: number) => {
     if (amt === 1) playSound('pop');
     updateState(prev => ({
        ...prev,
        daily: {
           ...prev.daily,
           dhikrAstaghfirullah: type === 'astaghfirullah' ? prev.daily.dhikrAstaghfirullah + amt : prev.daily.dhikrAstaghfirullah,
           dhikrRabbiInni: type === 'rabbiInni' ? prev.daily.dhikrRabbiInni + amt : prev.daily.dhikrRabbiInni
        }
     }));
  };

  const handleMDFCheckIn = () => {
    playSound('success');
    updateState(prev => ({ ...prev, daily: { ...prev.daily, mdfCheckIn: true } }));
  };

  // --- BACKUP ---
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
             alert('Data restored successfully!');
          } catch (err) { alert('Invalid file.'); }
       }
       reader.readAsText(file);
    }
    input.click();
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Atmosphere mode={state.global.theme} />
      
      {view === ViewState.WIDGET && (
         <WidgetView state={state} onClose={() => setView(ViewState.DASHBOARD)} />
      )}

      {view !== ViewState.WIDGET && (
        <div className="min-h-screen relative z-10 max-w-md mx-auto">
          {view === ViewState.DASHBOARD && <Dashboard state={state} changeView={setView} />}
          {view === ViewState.SALAH && <TabSalah state={state} updatePrayer={handleUpdatePrayer} updateQada={(amt) => updateState(prev => ({ ...prev, global: { ...prev.global, qadaBank: Math.max(0, prev.global.qadaBank + amt) } }))} onBack={() => setView(ViewState.DASHBOARD)} />}
          {view === ViewState.DHIKR && <TabDhikr state={state} updateDhikr={handleDhikr} />}
          {view === ViewState.QURAN && <TabQuran state={state} updatePart={(p:any) => updateState(prev => ({...prev, daily: {...prev.daily, quranParts: {...prev.daily.quranParts, [p]: !prev.daily.quranParts[p as keyof typeof prev.daily.quranParts]}}}))} updateSurah={(s:any) => updateState(prev => ({...prev, daily: {...prev.daily, [s === 'mulk' ? 'surahMulk' : 'surahBaqarah']: !prev.daily[s === 'mulk' ? 'surahMulk' : 'surahBaqarah' as keyof DailyStats]}}))} />}
          {view === ViewState.MDF && <TabMDF state={state} resetRelapse={() => updateState(prev => ({...prev, global: {...prev.global, lastRelapseDate: Date.now(), streaks: {...prev.global.streaks, mdf: 0}}, daily: {...prev.daily, habits: {...prev.daily.habits, failedToday: true}}}))} checkIn={handleMDFCheckIn} />}
          {view === ViewState.SOCIAL && <TabSocial state={state} />}
          {view === ViewState.HYGIENE && <TabHygiene state={state} updateHygiene={(k:any) => updateState(prev => ({...prev, daily: {...prev.daily, hygiene: {...prev.daily.hygiene, [k]: k === 'water' ? prev.daily.hygiene.waterGlasses + 1 : !prev.daily.hygiene[k as 'shower'|'brush']}}}))} updateHabit={(k:any) => updateState(prev => ({...prev, daily: {...prev.daily, habits: {...prev.daily.habits, [k === 'smoking' ? 'smokingCount' : 'nicotineCount']: (prev.daily.habits[k === 'smoking' ? 'smokingCount' : 'nicotineCount' as keyof typeof prev.daily.habits] as number) + 1}}}))} />}
          
          {/* Fitness and Memorize tabs were previously missing update logic */}
          {view === ViewState.FITNESS && <TabFitness state={state} updateType={(t) => updateState(prev => ({...prev, daily: {...prev.daily, fitness: {...prev.daily.fitness, type: t}}}))} />}
          {view === ViewState.MEMORIZE && <TabMemorize state={state} />}
          {view === ViewState.RAMADAN && <TabRamadan state={state} />}
          
          {/* Added Toggle for Ramadan Mode */}
          {view === ViewState.SETTINGS && <TabSettings state={state} setTheme={(t) => updateState(prev => ({...prev, global: {...prev.global, theme: t}}))} toggleRamadan={() => updateState(prev => ({...prev, global: {...prev.global, ramadanMode: !prev.global.ramadanMode}}))} exportData={exportData} importData={importData} enterWidgetMode={() => setView(ViewState.WIDGET)} />}

          <BottomNav currentView={view} changeView={setView} ramadanMode={state.global.ramadanMode} />
        </div>
      )}
    </>
  );
};

export default App;
