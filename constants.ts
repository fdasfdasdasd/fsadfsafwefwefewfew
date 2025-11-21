
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

const createAch = (id: string, title: string, desc: string, cat: Achievement['category'], tier: Achievement['tier'], icon: string): Achievement => ({
  id, title, description: desc, category: cat, tier, icon
});

export const MASTER_ACHIEVEMENTS: Achievement[] = [
  // --- SALAH ---
  createAch('s_1', 'The Intentional', '1 consecutive perfect day.', 'SALAH', 'BRONZE', '🕌'),
  createAch('s_3', 'Pillar Setter', '3 consecutive perfect days.', 'SALAH', 'BRONZE', '🧱'),
  createAch('s_7', 'The Weekly Warrior', '7 consecutive perfect days.', 'SALAH', 'SILVER', '⚔️'),
  createAch('s_14', 'The Fortified Fourteen', '14 consecutive perfect days.', 'SALAH', 'SILVER', '🏰'),
  createAch('s_40', 'The Forty Faithful', '40 consecutive perfect days.', 'SALAH', 'GOLD', '🛡️'),
  createAch('s_100', 'The Centurion', '100 consecutive perfect days.', 'SALAH', 'PLATINUM', '💯'),
  createAch('s_365', 'The Annual Mu\'min', '365 consecutive perfect days.', 'SALAH', 'DIAMOND', '👑'),
  createAch('s_730', 'The Two-Year Trooper', '730 consecutive perfect days.', 'SALAH', 'DIAMOND', '🚀'),
  createAch('s_1000', 'The 1000 Diamond', '1000 consecutive perfect days.', 'SALAH', 'DIAMOND', '💎'),
  
  createAch('s_tahajjud_10', 'The Night\'s Pledge', '10 total Tahajjud prayers.', 'SALAH', 'BRONZE', '🌙'),
  createAch('s_tahajjud_30', 'The Night Watch', '30 total Tahajjud prayers.', 'SALAH', 'SILVER', '🕯️'),
  createAch('s_tahajjud_100', 'The Tahajjud Centurion', '100 consecutive Tahajjud.', 'SALAH', 'PLATINUM', '🌠'),
  
  createAch('s_fajr_7', 'The Early Bird', '7 consecutive days of Fajr on time.', 'SALAH', 'SILVER', '🌅'),
  createAch('s_witr_365', 'The Witr Guardian', '1 year streak of never skipping Witr.', 'SALAH', 'GOLD', '🤲'),
  createAch('s_qada_0', 'The Punctual Pledge', '10 days without Qada.', 'SALAH', 'GOLD', '⏱️'),

  // --- DHIKR ---
  createAch('d_1', 'The Intentional Reciter', '1 perfect day (Both 2100).', 'DHIKR', 'BRONZE', '📿'),
  createAch('d_7', 'The Weekly Wārid', '7 consecutive perfect days.', 'DHIKR', 'SILVER', '✨'),
  createAch('d_30', 'The Monthly Mudāwamah', '30 consecutive perfect days.', 'DHIKR', 'GOLD', '🌙'),
  createAch('d_100', 'The Centurion of Dhikr', '100 consecutive perfect days.', 'DHIKR', 'PLATINUM', '💫'),
  createAch('d_180', 'Half-Year Hero', '180 consecutive perfect days.', 'DHIKR', 'PLATINUM', '🏆'),
  createAch('d_1000', 'The 1000 Diamond', '1,000 total perfect days.', 'DHIKR', 'DIAMOND', '💎'),
  createAch('d_recovery', 'The Fast Restart', '7-day streak immediately after breaking 30-day.', 'DHIKR', 'SILVER', '🩹'),

  // --- QURAN ---
  createAch('q_mulk_1', 'The Daily Reader', '1 day Mulk + Baqarah.', 'QURAN', 'BRONZE', '📖'),
  createAch('q_mulk_7', 'The Weekly Guard', '7 consecutive days Mulk + Baqarah.', 'QURAN', 'SILVER', '🛡️'),
  createAch('q_mulk_30', 'The Monthly Memorizer', '30 days Mulk + Baqarah.', 'QURAN', 'GOLD', '🏰'),
  createAch('q_mulk_365', 'The Annual Muḥāfiẓ', '365 days Mulk + Baqarah.', 'QURAN', 'DIAMOND', '👑'),
  
  createAch('q_khatam_1', 'The First Seal', '1 Completion of Quran.', 'QURAN', 'PLATINUM', '🌟'),
  createAch('q_khatam_10', 'The Decade of Seals', '10 Completions of Quran.', 'QURAN', 'DIAMOND', '🏵️'),
  createAch('q_parah_streak_30', 'The Full Parah Habit', '30 days reading 1 Parah.', 'QURAN', 'GOLD', '📚'),

  // --- MDF ---
  createAch('m_1', 'The First Step', '1 Day Streak.', 'MDF', 'BRONZE', '🌱'),
  createAch('m_7', 'The Weekly Warrior', '7 Day Streak.', 'MDF', 'SILVER', '⚔️'),
  createAch('m_30', 'The First Month Master', '30 Day Streak.', 'MDF', 'GOLD', '🛡️'),
  createAch('m_90', 'The Quarterly King', '90 Day Streak.', 'MDF', 'PLATINUM', '👑'),
  createAch('m_365', 'The Annual Anchor', '1 Year Streak.', 'MDF', 'DIAMOND', '⚓'),
  createAch('m_1000', 'The 1000 Diamond', '1,000 Day Streak.', 'MDF', 'DIAMOND', '💎'),

  // --- HYGIENE ---
  createAch('h_1', 'The Triple Starter', '1 day Shower, Brush, 8 Water.', 'HYGIENE', 'BRONZE', '💧'),
  createAch('h_3', 'The Three-Day Cleanse', '3 consecutive days All 3.', 'HYGIENE', 'BRONZE', '🧼'),
  createAch('h_7', 'The Weekly Ritual', '7 days Shower, Brush, 8 Water.', 'HYGIENE', 'SILVER', '🚿'),
  createAch('h_30', 'The Monthly Maintenance', '30 days All 3.', 'HYGIENE', 'GOLD', '✨'),
  createAch('h_100', 'The Centurion Streak', '100 days All 3.', 'HYGIENE', 'PLATINUM', '💎'),
  createAch('h_clean_500', 'The Clean 500', '500 total days All 3.', 'HYGIENE', 'DIAMOND', '🌊'),

  // --- HABITS ---
  createAch('hb_1', 'The Controlled Start', '1 day Smoking<=2 & Nicotine<=3.', 'HABITS', 'BRONZE', '🚭'),
  createAch('hb_7', 'The Weekly Balance', '7 days controlled.', 'HABITS', 'SILVER', '⚖️'),
  createAch('hb_30', 'The Monthly Monitor', '30 days controlled.', 'HABITS', 'GOLD', '🛡️'),
  createAch('hb_90', 'The Quarterly Quota', '90 days controlled.', 'HABITS', 'PLATINUM', '🦁'),
  createAch('hb_365', 'The Annual Achievement', '365 days controlled.', 'HABITS', 'DIAMOND', '👑'),
  createAch('hb_strict_7', 'The Strict Follower', '7 days ZERO smoking/nicotine.', 'HABITS', 'GOLD', '🚫'),

  // --- DUA ---
  createAch('dua_1', 'The First Memorizer', 'Memorize 1 Dua.', 'DUA', 'BRONZE', '🤲'),
  createAch('dua_5', 'The Monthly Memorizer', 'Memorize 5 Duas.', 'DUA', 'SILVER', '📜'),
  createAch('dua_10', 'The Double Digit', 'Memorize 10 Duas.', 'DUA', 'GOLD', '🧠'),
  createAch('dua_50', 'The Annual Achiever', 'Memorize 50 Duas.', 'DUA', 'PLATINUM', '🎓'),
  createAch('dua_streak_5', 'The Consecutive Five', 'Memorize 5 Duas consecutively.', 'DUA', 'SILVER', '🔗'),

  // --- RAMADAN ---
  createAch('r_1', 'The First Iftar', 'Perfect fast on day 1.', 'RAMADAN', 'BRONZE', '🍲'),
  createAch('r_7', 'The Weekly Witness', '7 consecutive perfect fasts.', 'RAMADAN', 'SILVER', '📅'),
  createAch('r_30', 'The Complete Challenge', '30 perfect fasts.', 'RAMADAN', 'DIAMOND', '🌙'),
  createAch('r_tarawih_30', 'The Tarawih Master', '30 nights of Tarawih.', 'RAMADAN', 'PLATINUM', '🕌'),
  createAch('r_khatam', 'The Single Seal', 'Complete Quran in Ramadan.', 'RAMADAN', 'GOLD', '📖'),
  createAch('r_last10', 'The Final Ten Finish', 'Perfect Last 10 Days.', 'RAMADAN', 'DIAMOND', '🌌'),
];

export type GrowthStage = { icon: string; label: string; threshold: number };

export const GROWTH_LEVELS: Record<string, GrowthStage[]> = {
  SALAH: [
    { threshold: 0, icon: '🌱', label: 'Seed' },
    { threshold: 5, icon: '🌿', label: 'Sprout' },
    { threshold: 10, icon: '🪴', label: 'Sapling' },
    { threshold: 20, icon: '🌳', label: 'Tree' },
    { threshold: 40, icon: '🌲', label: 'Forest' }
  ],
  DHIKR: [
    { threshold: 0, icon: '📿', label: 'Bead' },
    { threshold: 7, icon: '🧵', label: 'Thread' },
    { threshold: 30, icon: '✨', label: 'Tasbeeh' },
    { threshold: 100, icon: '🕋', label: 'Noor' }
  ],
  MDF: [
    { threshold: 0, icon: '🧱', label: 'Brick' },
    { threshold: 3, icon: '🚧', label: 'Wall' },
    { threshold: 14, icon: '🏯', label: 'Tower' },
    { threshold: 40, icon: '🏰', label: 'Fortress' },
    { threshold: 100, icon: '👑', label: 'Kingdom' }
  ],
  QURAN: [
    { threshold: 0, icon: '✍️', label: 'Ink' },
    { threshold: 7, icon: '📄', label: 'Page' },
    { threshold: 30, icon: '📜', label: 'Scroll' },
    { threshold: 100, icon: '📖', label: 'Golden Book' }
  ],
  HYGIENE: [
    { threshold: 0, icon: '✨', label: 'Spark' },
    { threshold: 3, icon: '🌟', label: 'Glow' },
    { threshold: 14, icon: '☀️', label: 'Sun' },
    { threshold: 30, icon: '🎇', label: 'Radiance' }
  ],
  FITNESS: [
    { threshold: 0, icon: '🪨', label: 'Pebble' },
    { threshold: 7, icon: '🗿', label: 'Rock' },
    { threshold: 30, icon: '⛰️', label: 'Hill' },
    { threshold: 90, icon: '🏔️', label: 'Mountain' }
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
  // Find the highest threshold met
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
