
import { Achievement } from './types';

export const DUAS = [
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", english: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire." },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", english: "My Lord, expand for me my breast [with assurance] and ease for me my task." },
  { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", english: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency." },
];

export const MEMORIZE_CONTENT = [
  { week: 1, arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", english: "O Allah, help me to remember You, to thank You, and to worship You in the best of manners." },
  { week: 2, arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", english: "O Turner of the hearts, make my heart firm upon Your religion." }
];

export const FITNESS_SCHEDULE: Record<number, string> = {
  0: "Rest Day", // Sunday
  1: "Upper Body", // Monday
  2: "Lower Body", // Tuesday
  3: "Rest Day", // Wednesday
  4: "Upper Body", // Thursday
  5: "Lower Body", // Friday
  6: "Active Recovery" // Saturday
};

export const PARAH_NAMES = [
  "الم", "سيقول السفهاء", "تلك الرسل", "لن تنالوا", "المحصنات", "لا يحب الله", "وإذا سمعوا", "ولو أننا", "قال الملأ", "واعلموا",
  "يعتذرون", "وما من دابة", "وما أبرئ", "ربما", "سبحان الذي", "قال ألم", "اقترب للناس", "قد أفلح", "وقال الذين", "أمن خلق",
  "اتل ما أوحي", "ومن يقنت", "وما لي", "فمن أظلم", "إليه يرد", "حم", "قال فما خطبكم", "قد سمع الله", "تبارك الذي", "عم يتساءلون"
];

// --- MASSIVE ACHIEVEMENT GENERATOR ---

// 1. Generate Milestones Sequence (Logarithmic to Linear)
// Returns array like [1, 2... 90, 95... 365, 390... 1000, 1100... 10000]
const generateMilestones = () => {
  const m: number[] = [];
  // 1 to 90 days (Hook phase: Every day)
  for (let i = 1; i <= 90; i++) m.push(i);
  // 91 to 365 (Habit phase: Every 5 days)
  for (let i = 95; i <= 365; i+=5) m.push(i);
  // 366 to 1000 (Commitment phase: Every 25 days)
  for (let i = 390; i <= 1000; i+=25) m.push(i);
  // 1001 to 25000 (Lifetime phase: Every 100 days - approx 68 years)
  for (let i = 1100; i <= 25000; i+=100) m.push(i);
  return m;
};

export const STREAK_MILESTONES = generateMilestones();

const getTier = (day: number): Achievement['tier'] => {
  if (day < 7) return 'BRONZE';
  if (day < 30) return 'SILVER';
  if (day < 90) return 'GOLD';
  if (day < 365) return 'PLATINUM';
  if (day < 1000) return 'DIAMOND';
  if (day < 5000) return 'LEGEND';
  return 'ETERNAL';
};

const createStreakAchievements = (
  category: Achievement['category'], 
  prefix: string, 
  icon: string, 
  label: string
): Achievement[] => {
  return STREAK_MILESTONES.map(day => ({
    id: `${prefix}_streak_${day}`,
    title: `${day} Day ${label}`,
    description: `You have maintained a perfect ${day} day streak in ${label}.`,
    category: category,
    tier: getTier(day),
    icon: icon
  }));
};

// Generate Base Lists (250+ each)
const achSalah = createStreakAchievements('SALAH', 's', '🕋', 'Salah');
const achDhikr = createStreakAchievements('DHIKR', 'd', '📿', 'Dhikr');
const achMDF = createStreakAchievements('MDF', 'm', '🛡️', 'Purity');
const achHygiene = createStreakAchievements('HYGIENE', 'h', '🧼', 'Hygiene');
const achFitness = createStreakAchievements('FITNESS', 'f', '💪', 'Fitness');
const achHabits = createStreakAchievements('HABITS', 'hb', '🚭', 'Discipline');

// NEW: 100+ Achievements for missing tabs
const achQuran = createStreakAchievements('QURAN', 'q', '📖', 'Quran');
const achRamadan = createStreakAchievements('RAMADAN', 'r', '🌙', 'Ramadan');

// NEW: Social / XP Achievements (100+ items)
const createXPAchievements = () => {
  const m: number[] = [];
  // 100 - 1000: steps of 100 (10 items)
  for (let i = 100; i <= 1000; i+=100) m.push(i);
  // 1500 - 10000: steps of 500 (18 items)
  for (let i = 1500; i <= 10000; i+=500) m.push(i);
  // 12000 - 100000: steps of 2000 (~45 items)
  for (let i = 12000; i <= 100000; i+=2000) m.push(i);
  // 125000 - 1000000: steps of 25000 (~36 items)
  for (let i = 125000; i <= 1000000; i+=25000) m.push(i);
  
  return m.map(xp => ({
    id: `xp_${xp}`,
    title: `${xp >= 1000 ? (xp/1000) + 'k' : xp} XP Legend`,
    description: `Accumulated a total of ${xp.toLocaleString()} XP points.`,
    category: 'SOCIAL' as const,
    tier: (xp < 5000 ? 'BRONZE' : xp < 20000 ? 'SILVER' : xp < 100000 ? 'GOLD' : xp < 500000 ? 'PLATINUM' : 'LEGEND') as Achievement['tier'],
    icon: '👑'
  }));
};
const achSocial = createXPAchievements();

// NEW: Memorize Achievements (100 items)
const createMemorizeAchievements = () => {
  const m = [];
  for (let i = 1; i <= 100; i++) m.push(i);
  return m.map(week => ({
    id: `mem_wk_${week}`,
    title: `Week ${week} Hafiz`,
    description: `Successfully memorized Week ${week} content.`,
    category: 'MEMORIZE' as const, // Changed to separate category
    tier: (week < 10 ? 'BRONZE' : week < 30 ? 'SILVER' : week < 60 ? 'GOLD' : 'PLATINUM') as Achievement['tier'],
    icon: '🧠'
  }));
};
const achMemorize = createMemorizeAchievements();


// Special Manual Achievements (Volume & Specifics)
const achSpecial: Achievement[] = [
  // Quran Volume
  { id: 'q_parah_1', title: 'The First Juz', description: 'Complete Juz 1.', category: 'QURAN', tier: 'BRONZE', icon: '📖' },
  { id: 'q_parah_30', title: 'The Completion', description: 'Complete Juz 30.', category: 'QURAN', tier: 'GOLD', icon: '🌕' },
  ...[1, 5, 10, 25, 50, 100].map(n => ({
      id: `q_khatam_${n}`,
      title: `${n} Quran Khatams`,
      description: `Completed the Holy Quran ${n} times.`,
      category: 'QURAN' as const,
      tier: (n < 5 ? 'PLATINUM' : n < 25 ? 'DIAMOND' : n < 50 ? 'LEGEND' : 'ETERNAL') as Achievement['tier'],
      icon: '🌟'
  })),

  // Dhikr Volume
  ...[1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000].map(n => ({
      id: `d_vol_${n}`,
      title: `${(n/1000)}k Dhikr Total`,
      description: `Total lifetime Dhikr count reached ${n.toLocaleString()}.`,
      category: 'DHIKR' as const,
      tier: (n < 10000 ? 'SILVER' : n < 100000 ? 'GOLD' : n < 1000000 ? 'PLATINUM' : n < 5000000 ? 'DIAMOND' : 'ETERNAL') as Achievement['tier'],
      icon: '✨'
  })),

  // Social Manual
  { id: 'soc_1', title: 'The Friend', description: 'Add 1 Friend.', category: 'SOCIAL', tier: 'BRONZE', icon: '👋' },
  { id: 'soc_10', title: 'The Community', description: 'Add 10 Friends.', category: 'SOCIAL', tier: 'GOLD', icon: '🌐' },
];

export const MASTER_ACHIEVEMENTS: Achievement[] = [
  ...achSalah,
  ...achDhikr,
  ...achMDF,
  ...achHygiene,
  ...achFitness,
  ...achHabits,
  ...achQuran,    // NEW
  ...achRamadan,  // NEW
  ...achSocial,   // NEW
  ...achMemorize, // NEW
  ...achSpecial
];

export type GrowthStage = { icon: string; label: string; threshold: number };

export const GROWTH_LEVELS: Record<string, GrowthStage[]> = {
  SALAH: [
    { threshold: 0, icon: '🌱', label: 'Seed' },
    { threshold: 7, icon: '🌿', label: 'Sprout' },
    { threshold: 30, icon: '🪴', label: 'Sapling' },
    { threshold: 90, icon: '🌳', label: 'Tree' },
    { threshold: 365, icon: '🌲', label: 'Forest' },
    { threshold: 1000, icon: '🏞️', label: 'Ecosystem' },
    { threshold: 5000, icon: '🌍', label: 'Biosphere' }
  ],
  DHIKR: [
    { threshold: 0, icon: '📿', label: 'Bead' },
    { threshold: 7, icon: '🧵', label: 'Thread' },
    { threshold: 40, icon: '✨', label: 'Tasbeeh' },
    { threshold: 100, icon: '💡', label: 'Noor' },
    { threshold: 365, icon: '☀️', label: 'Sun' },
    { threshold: 1000, icon: '🌌', label: 'Galaxy' },
    { threshold: 5000, icon: '✨', label: 'Infinite' }
  ],
  MDF: [
    { threshold: 0, icon: '🧱', label: 'Brick' },
    { threshold: 7, icon: '🚧', label: 'Wall' },
    { threshold: 30, icon: '🏯', label: 'Tower' },
    { threshold: 90, icon: '🏰', label: 'Fortress' },
    { threshold: 365, icon: '👑', label: 'Kingdom' },
    { threshold: 1000, icon: '🛡️', label: 'Titan' },
    { threshold: 5000, icon: '⚔️', label: 'Legend' }
  ],
  QURAN: [
    { threshold: 0, icon: '✍️', label: 'Ink' },
    { threshold: 7, icon: '📄', label: 'Page' },
    { threshold: 30, icon: '📜', label: 'Scroll' },
    { threshold: 100, icon: '📖', label: 'Book' },
    { threshold: 365, icon: '📚', label: 'Library' },
    { threshold: 1000, icon: '🏛️', label: 'Archive' }
  ],
  HYGIENE: [
    { threshold: 0, icon: '✨', label: 'Spark' },
    { threshold: 7, icon: '🌟', label: 'Glow' },
    { threshold: 30, icon: '☀️', label: 'Sun' },
    { threshold: 100, icon: '💎', label: 'Diamond' },
    { threshold: 1000, icon: '💠', label: 'Ethereal' }
  ],
  FITNESS: [
    { threshold: 0, icon: '🪨', label: 'Pebble' },
    { threshold: 7, icon: '🗿', label: 'Rock' },
    { threshold: 30, icon: '⛰️', label: 'Hill' },
    { threshold: 90, icon: '🏔️', label: 'Mountain' },
    { threshold: 365, icon: '🌋', label: 'Volcano' },
    { threshold: 1000, icon: '🪐', label: 'Planet' }
  ],
  RAMADAN: [
    { threshold: 0, icon: '🌑', label: 'New Moon' },
    { threshold: 5, icon: '🌙', label: 'Crescent' },
    { threshold: 15, icon: '🌗', label: 'Half Moon' },
    { threshold: 20, icon: '🏮', label: 'Lantern' },
    { threshold: 29, icon: '🕌', label: 'Eid Ready' }
  ]
};

export const getGrowthStage = (category: keyof typeof GROWTH_LEVELS, streak: number) => {
  const stages = GROWTH_LEVELS[category];
  let current = stages[0];
  for (const stage of stages) {
    if (streak >= stage.threshold) {
      current = stage;
    } else {
      break;
    }
  }
  return current;
};
