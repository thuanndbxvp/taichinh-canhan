/**
 * Word count — single source of truth cho quy đổi và kiểm soát dung lượng kịch bản.
 */

export const WORDS_PER_MINUTE = 180;
const TTS_MARKDOWN_LEAKAGE_PCT = 0.15;

export const WORDS_PER_MINUTE_BUFFERED = Math.round(
  WORDS_PER_MINUTE * (1 + TTS_MARKDOWN_LEAKAGE_PCT),
);

const MIN_TARGET_WORDS = 100;

export type ToleranceMode = 'standard' | 'flexible';

export interface WordCountTolerance {
  min: number;
  max: number;
  target: number;
  mode: ToleranceMode;
}

const TOLERANCE_PERCENTAGES: Record<ToleranceMode, number> = {
  standard: 0.05,  // ±5%
  flexible: 0.20,  // ±20%
};

export const MIN_PART_FLOOR = 250; // Ngưỡng sàn tối thiểu để mỗi phần đủ dung lượng giải phẫu số liệu

export function minutesToTargetWords(minutes: number): number {
  if (!Number.isFinite(minutes) || minutes <= 0) return 0;
  return Math.max(MIN_TARGET_WORDS, Math.round(minutes * WORDS_PER_MINUTE_BUFFERED));
}

export function wordsToMinutes(words: number): number {
  if (!Number.isFinite(words) || words <= 0) return 0;
  return Math.round((words / WORDS_PER_MINUTE) * 10) / 10;
}

/**
 * Chia target wordCount đều cho các phần. Phần cuối nhận phần dư để tổng khớp.
 *
 * Ví dụ: 1000 từ / 3 phần = [334, 333, 333].
 */
export function splitWordCountAcrossParts(totalWords: number, partCount: number): number[] {
  if (partCount <= 0) return [];
  if (!Number.isFinite(totalWords) || totalWords <= 0) {
    return new Array(partCount).fill(0);
  }
  const base = Math.floor(totalWords / partCount);
  const remainder = totalWords - base * partCount;
  const result = new Array(partCount).fill(base);
  result[0] += remainder;
  return result;
}

/**
 * Tính biên độ cho phép theo mode (standard ±5%, flexible ±20%)
 */
export function getWordCountTolerance(
  target: number,
  mode: ToleranceMode = 'standard'
): WordCountTolerance {
  const tolerance = TOLERANCE_PERCENTAGES[mode];
  return {
    min: Math.round(target * (1 - tolerance)),
    max: Math.round(target * (1 + tolerance)),
    target,
    mode,
  };
}

/**
 * Kiểm tra số từ có nằm trong biên độ không
 */
export function isWithinTolerance(actual: number, tolerance: WordCountTolerance): boolean {
  return actual >= tolerance.min && actual <= tolerance.max;
}

/**
 * Đếm số từ trong text (tiếng Việt + tiếng Anh, loại bỏ markdown formatting)
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const clean = text
    .replace(/[#*_\[\]()]/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  if (!clean) return 0;
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * Hybrid rebalance approach (Có Floor Protection):
 * - Generation: Truyền target ±5% hoặc ±20% vào prompt, tự động cân đối
 * - Đảm bảo không bao giờ ép target xuống dưới MIN_PART_FLOOR (250 từ) nếu còn phần chưa sinh
 * - Rewrite: Không ép số từ, giữ cấu trúc gốc
 */
export function rebalanceRemainingParts(
  totalTarget: number,
  generatedParts: string[],
  remainingCount: number,
  mode: ToleranceMode = 'standard'
): { newPartTarget: number; totalEstimate: number } {
  const generatedTotal = generatedParts.reduce((sum, part) => sum + countWords(part), 0);
  const remainingTarget = totalTarget - generatedTotal;

  let rawPartTarget = remainingCount > 0
    ? Math.round(remainingTarget / remainingCount)
    : remainingTarget;

  // BẢO VỆ NỢ KỸ THUẬT: Đảm bảo không bao giờ ép dưới mức sàn 250 từ nếu còn phần chưa sinh
  const newPartTarget = remainingCount > 0
    ? Math.max(MIN_PART_FLOOR, rawPartTarget)
    : 0;

  return {
    newPartTarget,
    totalEstimate: generatedTotal + (newPartTarget * remainingCount),
  };
}

/**
 * Kiểm tra xem user có yêu cầu "ngắn gọn" trong description không
 */
export function detectConciseRequest(description: string): boolean {
  if (!description) return false;
  const conciseKeywords = [
    'ngắn gọn', 'ngắn', 'tóm tắt', 'brief', 'condensed',
    'khoảng', 'chỉ', 'thôi', 'tối thiểu',
  ];

  const hasConciseKeyword = conciseKeywords.some(kw =>
    new RegExp(kw, 'i').test(description)
  );

  const hasSpecificNumber = /\d+\s*(từ|words?)/i.test(description);
  return hasConciseKeyword || hasSpecificNumber;
}

/**
 * Xác định tolerance mode dựa trên description và word count
 */
export function determineToleranceMode(
  description: string,
  userWordCount: number,
  minRecommendedWords: number
): ToleranceMode {
  const isConcise = detectConciseRequest(description);
  const isBelowRecommended = minRecommendedWords > 0 && userWordCount < minRecommendedWords;

  if (isConcise || isBelowRecommended) {
    return 'flexible';
  }
  return 'standard';
}

/**
 * Format số từ thành display string
 */
export function formatWordCount(actual: number, tolerance: WordCountTolerance): string {
  const deviation = ((actual - tolerance.target) / tolerance.target * 100).toFixed(1);
  const sign = deviation.startsWith('-') ? '' : '+';
  const within = isWithinTolerance(actual, tolerance) ? '✅' : '⚠️';
  const modeLabel = tolerance.mode === 'flexible' ? '(linh hoạt ±20%)' : '(±5%)';

  return `${actual} / ${tolerance.target} từ ${modeLabel} (${sign}${deviation}% — ${within})`;
}
