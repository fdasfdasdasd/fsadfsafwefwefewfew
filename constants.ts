
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

// --- ACHIEVEMENT SYSTEM ---
// We define templates, then generating levels programmatically to simulate hundreds of achievements.

const TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'] as const;

const generateAchievements = () => {
  const achievements: Omit<Achievement, 'unlockedAt'>[] = [];

  // 1. Salah Streaks (5 Levels)
  [3, 7, 30, 100, 365].forEach((days, i) => {
    achievements.push({
      id: `salah_streak_${days}`,
      title: `Prayer Guardian ${['I', 'II', 'III', 'IV', 'V'][i]}`,
      description: `Maintain a prayer streak of ${days} days.`,
      tier: TIERS[i],
      icon: '🕌',
      category: 'SALAH'
    });
  });

  // 2. Dhikr Counts (5 Levels)
  [1000, 10000, 50000, 100000, 1000000].forEach((count, i) => {
    achievements.push({
      id: `dhikr_total_${count}`,
      title: `Remembrance Master ${['I', 'II', 'III', 'IV', 'V'][i]}`,
      description: `Reach a total lifetime Dhikr count of ${count.toLocaleString()}.`,
      tier: TIERS[i],
      icon: '📿',
      category: 'DHIKR'
    });
  });

  // 3. Tahajjud Warrior (5 Levels)
  [5, 20, 50, 100, 300].forEach((count, i) => {
    achievements.push({
      id: `tahajjud_total_${count}`,
      title: `Night Walker ${['I', 'II', 'III', 'IV', 'V'][i]}`,
      description: `Pray Tahajjud ${count} times.`,
      tier: TIERS[i],
      icon: '🌙',
      category: 'SALAH'
    });
  });

  // 4. Fitness Reps (Generic for illustration)
  [100, 500, 1000, 5000, 10000].forEach((xp, i) => {
    achievements.push({
      id: `fitness_xp_${xp}`,
      title: `Iron Body ${['I', 'II', 'III', 'IV', 'V'][i]}`,
      description: `Gain ${xp} XP from workouts.`,
      tier: TIERS[i],
      icon: '💪',
      category: 'FITNESS'
    });
  });

  return achievements;
};

export const MASTER_ACHIEVEMENTS = generateAchievements();
