
import * as React from 'react';
import { Home, Moon, Activity, BookOpen, ShieldAlert, Droplets, Dumbbell, Brain, Settings, Tent } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  currentView: ViewState;
  changeView: (view: ViewState) => void;
  ramadanMode: boolean;
}

export const BottomNav: React.FC<Props> = ({ currentView, changeView, ramadanMode }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, icon: <Home size={22} /> },
    { id: ViewState.SALAH, icon: <Moon size={22} /> },
    { id: ViewState.DHIKR, icon: <Activity size={22} /> },
    { id: ViewState.QURAN, icon: <BookOpen size={22} /> },
    { id: ViewState.MDF, icon: <ShieldAlert size={22} /> },
    { id: ViewState.HYGIENE, icon: <Droplets size={22} /> },
    { id: ViewState.FITNESS, icon: <Dumbbell size={22} /> },
    { id: ViewState.MEMORIZE, icon: <Brain size={22} /> },
    ...(ramadanMode ? [{ id: ViewState.RAMADAN, icon: <Tent size={22} /> }] : []),
    { id: ViewState.SETTINGS, icon: <Settings size={22} /> },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center">
      <div className="glass-nav px-2 py-3 rounded-[2rem] w-full max-w-md shadow-2xl border border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="flex overflow-x-auto gap-2 no-scrollbar scroll-smooth items-center px-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => changeView(item.id)}
                className={`flex-shrink-0 relative group transition-all duration-300 ${isActive ? 'w-14' : 'w-12'}`}
              >
                <div className={`
                  flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-b from-white/20 to-white/5 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/20 scale-110 -translate-y-2' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }
                `}>
                  {item.icon}
                </div>
                {isActive && <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white mt-2"></div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
