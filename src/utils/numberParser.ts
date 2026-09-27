/**
 * Utility functions for parsing numbers entered in Kurdish/Arabic or Latin script,
 * and calculations for student grades.
 */

export function parseKurdishNumber(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;

  const trimmed = val.trim();
  if (trimmed === '') return null;

  // Convert Eastern Arabic / Kurdish / Persian numerals to standard Latin digits
  const normalized = trimmed
    .replace(/[٠۰]/g, '0')
    .replace(/[١۱]/g, '1')
    .replace(/[٢۲]/g, '2')
    .replace(/[٣۳]/g, '3')
    .replace(/[٤۴]/g, '4')
    .replace(/[٥۵]/g, '5')
    .replace(/[٦۶]/g, '6')
    .replace(/[٧۷]/g, '7')
    .replace(/[٨۸]/g, '8')
    .replace(/[٩۹]/g, '9')
    .replace(/[٫,]/g, '.');

  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function formatNum(n: number | null | undefined, decimals: number = 1): string {
  if (n === null || n === undefined || isNaN(n)) return '—';
  // If it's a whole number, don't show decimals
  if (n % 1 === 0) return String(Math.round(n));
  return Number(n.toFixed(decimals)).toString();
}

/**
 * Calculates Activity score (out of 10):
 * - hw (toggle): % good of hwCount * hwTarget
 * - quiz (numeric out of quizMax): sum / (count * quizMax) * quizTarget
 * - behavior (toggle): % good of behaviorCount * behaviorTarget
 * - participation (toggle): % good of participationCount * participationTarget
 */
export function calculateActivity10(
  grades: {
    hw?: (0 | 1 | 2)[];
    quiz?: (number | null)[];
    behavior?: (0 | 1 | 2)[];
    participation?: (0 | 1 | 2)[];
  } | null | undefined,
  config: {
    hwTarget: number;
    quizTarget: number;
    behaviorTarget: number;
    participationTarget: number;
    quizMax: number;
  }
): {
  hwScore: number;
  quizScore: number;
  behaviorScore: number;
  participationScore: number;
  total10: number;
} {
  const hwList = Array.isArray(grades?.hw) ? grades.hw : [];
  const quizList = Array.isArray(grades?.quiz) ? grades.quiz : [];
  const behList = Array.isArray(grades?.behavior) ? grades.behavior : [];
  const partList = Array.isArray(grades?.participation) ? grades.participation : [];

  // Homework
  const hwTotalSlots = hwList.length || 1;
  const hwGoodCount = hwList.filter(v => v === 1).length;
  const hwScore = (hwGoodCount / hwTotalSlots) * (config?.hwTarget ?? 2);

  // Quiz
  const quizTotalSlots = quizList.length || 1;
  const quizSum = quizList.reduce<number>((acc, v) => acc + (v !== null && v !== undefined ? v : 0), 0);
  const quizMaxPossible = quizTotalSlots * (config?.quizMax ?? 10);
  const quizScore = quizMaxPossible > 0 ? (quizSum / quizMaxPossible) * (config?.quizTarget ?? 4) : 0;

  // Behavior
  const behTotalSlots = behList.length || 1;
  const behGoodCount = behList.filter(v => v === 1).length;
  const behaviorScore = (behGoodCount / behTotalSlots) * (config?.behaviorTarget ?? 2);

  // Participation
  const partTotalSlots = partList.length || 1;
  const partGoodCount = partList.filter(v => v === 1).length;
  const participationScore = (partGoodCount / partTotalSlots) * (config?.participationTarget ?? 2);

  const rawTotal = hwScore + quizScore + behaviorScore + participationScore;
  const total10 = Math.min(10, Math.max(0, Math.round(rawTotal * 10) / 10));

  return {
    hwScore: Math.round(hwScore * 10) / 10,
    quizScore: Math.round(quizScore * 10) / 10,
    behaviorScore: Math.round(behaviorScore * 10) / 10,
    participationScore: Math.round(participationScore * 10) / 10,
    total10,
  };
}

/**
 * Calculates Exam average (out of examMax, usually 20)
 * and total exam sum
 */
export function calculateExamScore(
  exams: (number | null)[] | null | undefined,
  _examMax: number = 20
): {
  sum: number;
  average: number;
  filledCount: number;
} {
  const examList = Array.isArray(exams) ? exams : [];
  const filled = examList.filter((e): e is number => e !== null && e !== undefined);
  const sum = filled.reduce((acc, v) => acc + v, 0);
  const average = filled.length > 0 ? Math.round((sum / filled.length) * 10) / 10 : 0;
  return {
    sum: Math.round(sum * 10) / 10,
    average,
    filledCount: filled.length,
  };
}

/**
 * Total monthly score (out of 30):
 * Activity (10) + Exam Average (20)
 */
export function calculateMonthlyTotal30(activity10: number, examAverage20: number): number {
  return Math.round((activity10 + examAverage20) * 10) / 10;
}
