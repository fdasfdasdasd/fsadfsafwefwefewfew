
import * as React from 'react';
import { Home, Moon, Activity, BookOpen, ShieldAlert, Droplets, Dumbbell, Brain, Settings, Tent, Users } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  currentView: ViewState;
  changeView: (view: ViewState) => void;
  ramadanMode: boolean;
}

export const BottomNav: React.FC<Props> = ({ currentView, changeView, ramadanMode }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, icon: <Home size={22} />, activeClass: 'bg-slate-800 text-white dark:bg-white dark:text-black', shadow: 'shadow-slate-500/30' },
    { id: ViewState.SALAH, icon: <Moon size={22} />, activeClass: 'bg-emerald-500 text-white', shadow: 'shadow-emerald-500/40' },
    { id: ViewState.DHIKR, icon: <Activity size={22} />, activeClass: 'bg-amber-500 text-white', shadow: 'shadow-amber-500/40' },
    { id: ViewState.QURAN, icon: <BookOpen size={22} />, activeClass: 'bg-purple-500 text-white', shadow: 'shadow-purple-500/40' },
    { id: ViewState.MDF, icon: <ShieldAlert size={22} />, activeClass: 'bg-rose-500 text-white', shadow: 'shadow-rose-500/40' },
    { id: ViewState.SOCIAL, icon: <Users size={22} />, activeClass: 'bg-blue-500 text-white', shadow: 'shadow-blue-500/40' },
    { id: ViewState.HYGIENE, icon: <Droplets size={22} />, activeClass: 'bg-cyan-500 text-white', shadow: 'shadow-cyan-500/40' },
    { id: ViewState.FITNESS, icon: <Dumbbell size={22} />, activeClass: 'bg-orange-500 text-white', shadow: 'shadow-orange-500/40' },
    { id: ViewState.MEMORIZE, icon: <Brain size={22} />, activeClass: 'bg-pink-500 text-white', shadow: 'shadow-pink-500/40' },
    ...(ramadanMode ? [{ id: ViewState.RAMADAN, icon: <Tent size={22} />, activeClass: 'bg-teal-500 text-white', shadow: 'shadow-teal-500/40' }] : []),
    { id: ViewState.SETTINGS, icon: <Settings size={22} />, activeClass: 'bg-gray-600 text-white', shadow: 'shadow-gray-500/40' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="glass-nav px-2 py-3 rounded-[2.5rem] w-full max-w-md shadow-2xl pointer-events-auto transform transition-transform duration-500 ease-out hover:scale-[1.01]">
        <div className="flex overflow-x-auto gap-3 no-scrollbar scroll-smooth items-center px-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => changeView(item.id)}
                className={`flex-shrink-0 relative group transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? 'w-16' : 'w-12'}`}
              >
                <div className={`
                  flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ease-out
                  ${isActive 
                    ? `${item.activeClass} ${item.shadow} shadow-lg scale-110 -translate-y-3 border border-white/10` 
                    : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/10'
                  }
                `}>
                  {item.icon}
                </div>
                {isActive && (
                  <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-500 bg-current opacity-50`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
