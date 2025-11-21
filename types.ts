
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
  HEALTH = 'HEALTH',
  MEMORIZE = 'MEMORIZE',
  RAMADAN = 'RAMADAN',
  SETTINGS = 'SETTINGS'
}

export type SubView = 'DAILY' | 'PROGRESS' | 'ACHIEVEMENTS';

export interface Prayer {
  id: string;
  name: string;
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
  unlockedAt: string | null; // Date string
  category: 'SALAH' | 'DHIKR' | 'GENERAL' | 'FITNESS';
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  prayers: Prayer[];
  dhikrCount: number; 
  quranParts: {
    rub: boolean;
    nisf: boolean;
    thalatha: boolean;
    kamil: boolean;
  };
  waterCups: number;
  isSunnahFasting: boolean;
  fitness: {
    type: string; 
    log: { exercise: string; reps: number }[];
    weight: number | null;
  };
  habits: {
    smoking: number;
    nicotine: number;
  };
  imanScore: number;
  completedDuaReview: boolean;
}

export interface GlobalStats {
  level: number;
  xp: number;
  streaks: {
    salah: number;
    dhikr: number;
    mdf: number; 
    fitness: number;
    water: number;
    maxSalah: number;
    maxDhikr: number;
    maxMdf: number;
  };
  qadaBank: number;
  quransCompleted: number;
  currentParah: number;
  lastRelapseDate: number | null; 
  memorizeWeek: number;
  memorizeProgress: number;
  name: string;
  ramadanMode: boolean;
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
    { id: 'tahajjud', name: 'Tahajjud', completed: false, completedAt: null, isJamaah: false },
    { id: 'fajr', name: 'Fajr', completed: false, completedAt: null, isJamaah: false },
    { id: 'dhuhr', name: 'Dhuhr', completed: false, completedAt: null, isJamaah: false },
    { id: 'asr', name: 'Asr', completed: false, completedAt: null, isJamaah: false },
    { id: 'maghrib', name: 'Maghrib', completed: false, completedAt: null, isJamaah: false },
    { id: 'isha', name: 'Isha', completed: false, completedAt: null, isJamaah: false },
  ],
  dhikrCount: 0,
  quranParts: { rub: false, nisf: false, thalatha: false, kamil: false },
  waterCups: 0,
  isSunnahFasting: false,
  fitness: { type: 'Rest', log: [], weight: null },
  habits: { smoking: 0, nicotine: 0 },
  imanScore: 0,
  completedDuaReview: false,
};

export const INITIAL_GLOBAL_STATE: GlobalStats = {
  level: 1,
  xp: 0,
  streaks: {
    salah: 0, dhikr: 0, mdf: 0, fitness: 0, water: 0,
    maxSalah: 0, maxDhikr: 0, maxMdf: 0
  },
  qadaBank: 0,
  quransCompleted: 0,
  currentParah: 1,
  lastRelapseDate: Date.now(),
  memorizeWeek: 1,
  memorizeProgress: 0,
  name: 'Zohaib',
  ramadanMode: false,
  unlockedAchievements: [],
  history: []
};
