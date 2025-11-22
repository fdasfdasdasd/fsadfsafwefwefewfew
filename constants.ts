
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

// --- MASTER ACHIEVEMENT LIST (100+ ITEMS) ---
export const MASTER_ACHIEVEMENTS: Achievement[] = [
  // ==========================================
  // SALAH (PRAYER) - ID Prefix: s_
  // ==========================================
  createAch('s_1', 'The First Step', '1 day perfect Salah.', 'SALAH', 'BRONZE', '🌱'),
  createAch('s_3', 'The Foundation', '3 days perfect Salah.', 'SALAH', 'BRONZE', '🧱'),
  createAch('s_7', 'The Weekly Warrior', '7 days perfect Salah.', 'SALAH', 'SILVER', '⚔️'),
  createAch('s_14', 'The Fortnight Fighter', '14 days perfect Salah.', 'SALAH', 'SILVER', '🏰'),
  createAch('s_30', 'The Monthly Master', '30 days perfect Salah.', 'SALAH', 'GOLD', '🌙'),
  createAch('s_40', 'The Forty Faithful', '40 days perfect Salah (Istiqamah).', 'SALAH', 'GOLD', '🛡️'),
  createAch('s_60', 'The Bi-Monthly Believer', '60 days perfect Salah.', 'SALAH', 'GOLD', '🎗️'),
  createAch('s_90', 'The Quarterly Queen', '90 days perfect Salah.', 'SALAH', 'PLATINUM', '👑'),
  createAch('s_100', 'The Centurion', '100 days perfect Salah.', 'SALAH', 'PLATINUM', '💯'),
  createAch('s_180', 'The Half-Year Hero', '180 days perfect Salah.', 'SALAH', 'PLATINUM', '🦅'),
  createAch('s_365', 'The Annual Anchor', '1 Year perfect Salah.', 'SALAH', 'DIAMOND', '💎'),
  createAch('s_500', 'The 500 Club', '500 days perfect Salah.', 'SALAH', 'DIAMOND', '🚀'),
  createAch('s_730', 'The Two-Year Titan', '2 Years perfect Salah.', 'SALAH', 'DIAMOND', '🌌'),
  createAch('s_1000', 'The Millennium Mu\'min', '1000 days perfect Salah.', 'SALAH', 'DIAMOND', '🕋'),

  // Tahajjud & Extras
  createAch('s_tahajjud_1', 'The Night Caller', 'Pray Tahajjud once.', 'SALAH', 'BRONZE', '🕯️'),
  createAch('s_tahajjud_10', 'The Night Pledge', '10 total Tahajjud prayers.', 'SALAH', 'SILVER', '🌙'),
  createAch('s_tahajjud_30', 'The Night Watchman', '30 total Tahajjud prayers.', 'SALAH', 'GOLD', '🌠'),
  createAch('s_tahajjud_100', 'The Midnight Master', '100 total Tahajjud prayers.', 'SALAH', 'PLATINUM', '🔭'),
  createAch('s_fajr_7', 'The Early Bird', '7 consecutive days of Fajr on time.', 'SALAH', 'SILVER', '🌅'),
  createAch('s_fajr_40', 'The Fajr Fortress', '40 consecutive days of Fajr.', 'SALAH', 'GOLD', '🏰'),
  createAch('s_qada_0', 'The Punctual Pledge', 'No Qada prayers for 10 days.', 'SALAH', 'GOLD', '⏱️'),

  // ==========================================
  // DHIKR (REMEMBRANCE) - ID Prefix: d_
  // ==========================================
  // Streaks (Based on hitting daily goal of 2100)
  createAch('d_1', 'The First Bead', '1 day meeting Dhikr goal.', 'DHIKR', 'BRONZE', '📿'),
  createAch('d_3', 'The String Starts', '3 days meeting Dhikr goal.', 'DHIKR', 'BRONZE', '🧵'),
  createAch('d_7', 'The Weekly Wārid', '7 days meeting Dhikr goal.', 'DHIKR', 'SILVER', '✨'),
  createAch('d_14', 'The Glowing Heart', '14 days meeting Dhikr goal.', 'DHIKR', 'SILVER', '💓'),
  createAch('d_30', 'The Monthly Mudāwamah', '30 days meeting Dhikr goal.', 'DHIKR', 'GOLD', '🌙'),
  createAch('d_40', 'The Spiritual Shield', '40 days meeting Dhikr goal.', 'DHIKR', 'GOLD', '🛡️'),
  createAch('d_90', 'The River of Light', '90 days meeting Dhikr goal.', 'DHIKR', 'PLATINUM', '🌊'),
  createAch('d_100', 'The Centurion of Dhikr', '100 days meeting Dhikr goal.', 'DHIKR', 'PLATINUM', '💫'),
  createAch('d_365', 'The Annual Al-Dhakir', '365 days meeting Dhikr goal.', 'DHIKR', 'DIAMOND', '💎'),
  createAch('d_1000', 'The Eternal Remembrance', '1000 days meeting Dhikr goal.', 'DHIKR', 'DIAMOND', '👑'),

  // Volume Goals
  createAch('d_vol_1k', 'The Kilo', '1,000 total Dhikr count.', 'DHIKR', 'BRONZE', '📦'),
  createAch('d_vol_10k', 'The Ten Grand', '10,000 total Dhikr count.', 'DHIKR', 'SILVER', '💰'),
  createAch('d_vol_50k', 'The Fifty Fold', '50,000 total Dhikr count.', 'DHIKR', 'GOLD', '🏆'),
  createAch('d_vol_100k', 'The One Hundred K', '100,000 total Dhikr count.', 'DHIKR', 'PLATINUM', '🚀'),
  createAch('d_vol_500k', 'The Half Million', '500,000 total Dhikr count.', 'DHIKR', 'DIAMOND', '🪐'),
  createAch('d_vol_1m', 'The Millionaire', '1,000,000 total Dhikr count.', 'DHIKR', 'DIAMOND', '🌌'),

  // ==========================================
  // MDF (NO FAP) - ID Prefix: m_
  // ==========================================
  createAch('m_1', 'The Awakening', '1 Day Clean.', 'MDF', 'BRONZE', '🌱'),
  createAch('m_3', 'The Clarity', '3 Days Clean.', 'MDF', 'BRONZE', '👁️'),
  createAch('m_7', 'The Weekly Warrior', '7 Days Clean.', 'MDF', 'SILVER', '⚔️'),
  createAch('m_14', 'The Two Week Titan', '14 Days Clean.', 'MDF', 'SILVER', '🦾'),
  createAch('m_21', 'The Habit Breaker', '21 Days Clean.', 'MDF', 'GOLD', '⛓️‍💥'),
  createAch('m_30', 'The Monthly Master', '30 Days Clean.', 'MDF', 'GOLD', '🛡️'),
  createAch('m_40', 'The Brain Healer', '40 Days Clean (Dopamine Reset).', 'MDF', 'GOLD', '🧠'),
  createAch('m_60', 'The Monk Mode', '60 Days Clean.', 'MDF', 'PLATINUM', '🧘'),
  createAch('m_90', 'The Reboot Complete', '90 Days Clean.', 'MDF', 'PLATINUM', '🦋'),
  createAch('m_100', 'The Centurion of Purity', '100 Days Clean.', 'MDF', 'PLATINUM', '💯'),
  createAch('m_180', 'The Iron Will', '180 Days Clean.', 'MDF', 'DIAMOND', '🏗️'),
  createAch('m_365', 'The New Man', '1 Year Clean.', 'MDF', 'DIAMOND', '🦸'),
  createAch('m_500', 'The Unshakable', '500 Days Clean.', 'MDF', 'DIAMOND', '🏔️'),
  createAch('m_1000', 'The Pure Soul', '1000 Days Clean.', 'MDF', 'DIAMOND', '💎'),

  // ==========================================
  // QURAN - ID Prefix: q_
  // ==========================================
  // Surah Streaks
  createAch('q_mulk_1', 'The Grave Protector', 'Read Mulk 1 night.', 'QURAN', 'BRONZE', '🛡️'),
  createAch('q_mulk_7', 'The Weekly Guard', 'Read Mulk 7 nights.', 'QURAN', 'SILVER', '🏰'),
  createAch('q_mulk_30', 'The Monthly Shield', 'Read Mulk 30 nights.', 'QURAN', 'GOLD', '⚔️'),
  createAch('q_mulk_100', 'The Centurion Reader', 'Read Mulk 100 nights.', 'QURAN', 'PLATINUM', '📜'),
  createAch('q_mulk_365', 'The Annual Guardian', 'Read Mulk 365 nights.', 'QURAN', 'DIAMOND', '👑'),
  
  // Reading Progress
  createAch('q_parah_1', 'The First Juz', 'Complete Juz 1.', 'QURAN', 'BRONZE', '📖'),
  createAch('q_parah_5', 'The Fifth Juz', 'Complete Juz 5.', 'QURAN', 'BRONZE', '🖐️'),
  createAch('q_parah_15', 'The Halfway Mark', 'Complete Juz 15.', 'QURAN', 'SILVER', '🌗'),
  createAch('q_parah_30', 'The Completion', 'Complete Juz 30.', 'QURAN', 'GOLD', '🌕'),
  
  // Khatams
  createAch('q_khatam_1', 'The First Seal', '1 Full Quran Completion.', 'QURAN', 'PLATINUM', '🌟'),
  createAch('q_khatam_3', 'The Triple Seal', '3 Full Quran Completions.', 'QURAN', 'PLATINUM', '✨'),
  createAch('q_khatam_5', 'The High Five', '5 Full Quran Completions.', 'QURAN', 'DIAMOND', '🖐️'),
  createAch('q_khatam_10', 'The Master of Seals', '10 Full Quran Completions.', 'QURAN', 'DIAMOND', '🏵️'),

  // ==========================================
  // HYGIENE - ID Prefix: h_
  // ==========================================
  createAch('h_1', 'The Fresh Start', '1 Perfect Hygiene Day.', 'HYGIENE', 'BRONZE', '🧼'),
  createAch('h_3', 'The Triple Clean', '3 Perfect Hygiene Days.', 'HYGIENE', 'BRONZE', '🧴'),
  createAch('h_7', 'The Weekly Wash', '7 Perfect Hygiene Days.', 'HYGIENE', 'SILVER', '🚿'),
  createAch('h_30', 'The Monthly Maintenance', '30 Perfect Hygiene Days.', 'HYGIENE', 'GOLD', '✨'),
  createAch('h_100', 'The Immaculate', '100 Perfect Hygiene Days.', 'HYGIENE', 'PLATINUM', '💎'),
  createAch('h_365', 'The Pristine Year', '365 Perfect Hygiene Days.', 'HYGIENE', 'DIAMOND', '🌊'),
  
  // Hydration Specific
  createAch('h_water_streak_7', 'The Hydro Homie', '7 Days of 8 cups.', 'HYGIENE', 'SILVER', '💧'),
  createAch('h_water_streak_30', 'The Aqua Master', '30 Days of 8 cups.', 'HYGIENE', 'GOLD', '🚰'),

  // ==========================================
  // HABITS (SMOKING/NICOTINE) - ID Prefix: hb_
  // ==========================================
  createAch('hb_1', 'The Controlled Start', '1 day within limits.', 'HABITS', 'BRONZE', '🚭'),
  createAch('hb_3', 'The Willpower', '3 days within limits.', 'HABITS', 'BRONZE', '✊'),
  createAch('hb_7', 'The Weekly Balance', '7 days within limits.', 'HABITS', 'SILVER', '⚖️'),
  createAch('hb_14', 'The Fortnight Fix', '14 days within limits.', 'HABITS', 'SILVER', '🩺'),
  createAch('hb_30', 'The Monthly Monitor', '30 days within limits.', 'HABITS', 'GOLD', '🛡️'),
  createAch('hb_90', 'The Quarterly Quota', '90 days within limits.', 'HABITS', 'PLATINUM', '🦁'),
  createAch('hb_365', 'The Annual Achievement', '365 days within limits.', 'HABITS', 'DIAMOND', '👑'),
  createAch('hb_strict_7', 'The Cold Turkey', '7 days ZERO usage.', 'HABITS', 'GOLD', '🧊'),
  createAch('hb_strict_30', 'The Clean Lungs', '30 days ZERO usage.', 'HABITS', 'PLATINUM', '🫁'),

  // ==========================================
  // FITNESS - ID Prefix: f_
  // ==========================================
  createAch('f_1', 'The First Rep', '1 Workout Logged.', 'FITNESS', 'BRONZE', '💪'),
  createAch('f_7', 'The Active Week', '7 Workouts Logged.', 'FITNESS', 'SILVER', '👟'),
  createAch('f_30', 'The Consistent Month', '30 Workouts Logged.', 'FITNESS', 'GOLD', '🏋️'),
  createAch('f_100', 'The Gym Rat', '100 Workouts Logged.', 'FITNESS', 'PLATINUM', '🦍'),
  createAch('f_365', 'The Athlete', '365 Workouts Logged.', 'FITNESS', 'DIAMOND', '🏅'),
  createAch('f_streak_7', 'The Non-Stop', '7 Day Workout Streak.', 'FITNESS', 'SILVER', '🔥'),

  // ==========================================
  // RAMADAN - ID Prefix: r_
  // ==========================================
  createAch('r_1', 'The First Iftar', 'Perfect fast on Day 1.', 'RAMADAN', 'BRONZE', '🍲'),
  createAch('r_10', 'The First Ashra', '10 Days of Fasting.', 'RAMADAN', 'SILVER', '🌙'),
  createAch('r_20', 'The Second Ashra', '20 Days of Fasting.', 'RAMADAN', 'GOLD', '🌔'),
  createAch('r_30', 'The Completed Month', '30 Days of Fasting.', 'RAMADAN', 'DIAMOND', '🕌'),
  createAch('r_taraweeh_30', 'The Night Standing', '30 Nights of Taraweeh.', 'RAMADAN', 'PLATINUM', '👣'),
  createAch('r_khatam', 'The Ramadan Seal', 'Complete Quran in Ramadan.', 'RAMADAN', 'DIAMOND', '📖'),
  
  // ==========================================
  // SOCIAL/MISC - ID Prefix: soc_
  // ==========================================
  createAch('soc_1', 'The Friend', 'Add 1 Friend.', 'SOCIAL', 'BRONZE', '👋'),
  createAch('soc_5', 'The Squad', 'Add 5 Friends.', 'SOCIAL', 'SILVER', '🤝'),
  createAch('soc_10', 'The Community', 'Add 10 Friends.', 'SOCIAL', 'GOLD', '🌐'),
];

export type GrowthStage = { icon: string; label: string; threshold: number };

export const GROWTH_LEVELS: Record<string, GrowthStage[]> = {
  SALAH: [
    { threshold: 0, icon: '🌱', label: 'Seed' },
    { threshold: 7, icon: '🌿', label: 'Sprout' },
    { threshold: 30, icon: '🪴', label: 'Sapling' },
    { threshold: 90, icon: '🌳', label: 'Tree' },
    { threshold: 365, icon: '🌲', label: 'Forest' },
    { threshold: 1000, icon: '🏞️', label: 'Ecosystem' }
  ],
  DHIKR: [
    { threshold: 0, icon: '📿', label: 'Bead' },
    { threshold: 7, icon: '🧵', label: 'Thread' },
    { threshold: 40, icon: '✨', label: 'Tasbeeh' },
    { threshold: 100, icon: '💡', label: 'Noor' },
    { threshold: 365, icon: '☀️', label: 'Sun' },
    { threshold: 1000, icon: '🌌', label: 'Galaxy' }
  ],
  MDF: [
    { threshold: 0, icon: '🧱', label: 'Brick' },
    { threshold: 7, icon: '🚧', label: 'Wall' },
    { threshold: 30, icon: '🏯', label: 'Tower' },
    { threshold: 90, icon: '🏰', label: 'Fortress' },
    { threshold: 365, icon: '👑', label: 'Kingdom' },
    { threshold: 1000, icon: '🛡️', label: 'Titan' }
  ],
  QURAN: [
    { threshold: 0, icon: '✍️', label: 'Ink' },
    { threshold: 7, icon: '📄', label: 'Page' },
    { threshold: 30, icon: '📜', label: 'Scroll' },
    { threshold: 100, icon: '📖', label: 'Book' },
    { threshold: 365, icon: '📚', label: 'Library' }
  ],
  HYGIENE: [
    { threshold: 0, icon: '✨', label: 'Spark' },
    { threshold: 7, icon: '🌟', label: 'Glow' },
    { threshold: 30, icon: '☀️', label: 'Sun' },
    { threshold: 100, icon: '💎', label: 'Diamond' }
  ],
  FITNESS: [
    { threshold: 0, icon: '🪨', label: 'Pebble' },
    { threshold: 7, icon: '🗿', label: 'Rock' },
    { threshold: 30, icon: '⛰️', label: 'Hill' },
    { threshold: 90, icon: '🏔️', label: 'Mountain' },
    { threshold: 365, icon: '🌋', label: 'Volcano' }
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
