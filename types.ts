
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SALAH = 'SALAH',
  DHIKR = 'DHIKR',
  QURAN = 'QURAN',
  MDF = 'MDF',
  FITNESS = 'FITNESS',
  HYGIENE = 'HYGIENE', 
  MEMORIZE = 'MEMORIZE',
  RAMADAN = 'RAMADAN',
  SETTINGS = 'SETTINGS'
}

export type SubView = 'DAILY' | 'STATS' | 'AWARDS';

export type ThemeMode = 'AUTO' | 'DAY' | 'NIGHT';

export interface Prayer {
  id: string;
  name: string;
  urduName: string;
  completed: boolean;
  completedAt: string | null;
  isJamaah: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  icon: string;
  category: 'SALAH' | 'DHIKR' | 'QURAN' | 'MDF' | 'HYGIENE' | 'HABITS' | 'DUA' | 'RAMADAN' | 'FITNESS';
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  prayers: Prayer[];
  
  // Dhikr split
  dhikrAstaghfirullah: number;
  dhikrRabbiInni: number;
  
  // Quran
  quranParts: {
    rub: boolean;
    nisf: boolean;
    thalatha: boolean;
    kamil: boolean;
  };
  surahMulk: boolean;
  surahBaqarah: boolean;
  
  // Hygiene & Habits
  hygiene: {
    shower: boolean;
    brush: boolean;
    waterGlasses: number;
  };
  habits: {
    smokingCount: number; // Limit 2
    nicotineCount: number; // Limit 3
    failedToday: boolean;
  };
  
  fitness: {
    type: string; 
    log: { exercise: string; reps: number }[];
    weight: number | null;
  };
  
  // Ramadan
  ramadan: {
    fasting: boolean;
    salah: boolean; // 5 prayers + Taraweeh
    quran: boolean;
    charity: boolean;
    spiritual: boolean;
    taraweehCount: boolean;
  };
  
  imanScore: number;
  completedDuaReview: boolean;
}

export interface GlobalStats {
  level: number;
  xp: number;
  streaks: {
    salah: number;
    dhikr: number; // Requires both 2100
    mdf: number; 
    fitness: number;
    hygiene: number; // Shower + Brush + Water(8)
    habits: number; // Smoking<=2 + Nicotine<=3
    quranSurah: number; // Mulk + Baqarah
    ramadan: number;
    
    maxSalah: number;
    maxDhikr: number;
    maxMdf: number;
  };
  streakFreezes: number; // Inventory for streak protection
  qadaBank: number;
  quransRecited: number;
  currentParah: number;
  lastRelapseDate: number | null; 
  memorizeWeek: number;
  memorizeProgress: number;
  name: string;
  ramadanMode: boolean;
  theme: ThemeMode;
  hasSeenOnboarding: boolean; // NEW: For Welcome Tour
  unlockedAchievements: string[]; // IDs of unlocked achievements
  history: DailyStats[]; // Store last 30 days for graphs
}

export interface AppState {
  daily: DailyStats;
  global: GlobalStats;
}

export const INITIAL_DAILY_STATE: DailyStats = {
  date: new Date().toISOString().split('T')[0],
  prayers: [
    { id: 'tahajjud', name: 'Tahajjud', urduName: 'تہجد', completed: false, completedAt: null, isJamaah: false },
    { id: 'fajr', name: 'Fajr', urduName: 'فجر', completed: false, completedAt: null, isJamaah: false },
    { id: 'dhuhr', name: 'Dhuhr', urduName: 'ظہر', completed: false, completedAt: null, isJamaah: false },
    { id: 'asr', name: 'Asr', urduName: 'عصر', completed: false, completedAt: null, isJamaah: false },
    { id: 'maghrib', name: 'Maghrib', urduName: 'مغرب', completed: false, completedAt: null, isJamaah: false },
    { id: 'isha', name: 'Isha', urduName: 'عشاء', completed: false, completedAt: null, isJamaah: false },
  ],
  dhikrAstaghfirullah: 0,
  dhikrRabbiInni: 0,
  quranParts: { rub: false, nisf: false, thalatha: false, kamil: false },
  surahMulk: false,
  surahBaqarah: false,
  hygiene: { shower: false, brush: false, waterGlasses: 0 },
  habits: { smokingCount: 0, nicotineCount: 0, failedToday: false },
  fitness: { type: 'Rest', log: [], weight: null },
  ramadan: { fasting: false, salah: false, quran: false, charity: false, spiritual: false, taraweehCount: false },
  imanScore: 0,
  completedDuaReview: false,
};

export const INITIAL_GLOBAL_STATE: GlobalStats = {
  level: 1,
  xp: 0,
  streaks: {
    salah: 0, dhikr: 0, mdf: 0, fitness: 0, hygiene: 0, habits: 0, quranSurah: 0, ramadan: 0,
    maxSalah: 0, maxDhikr: 0, maxMdf: 0
  },
  streakFreezes: 1, // Start with 1 freebie
  qadaBank: 0,
  quransRecited: 0,
  currentParah: 1,
  // Initialize to 24 hours ago so Day 1 counts as a clean day (Iman Score 20)
  lastRelapseDate: Date.now() - (1000 * 60 * 60 * 24),
  memorizeWeek: 1,
  memorizeProgress: 0,
  name: 'Zohaib',
  ramadanMode: false,
  theme: 'AUTO',
  hasSeenOnboarding: false,
  unlockedAchievements: [],
  history: []
};
