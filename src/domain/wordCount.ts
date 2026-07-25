/**
 * Word count — single source of truth cho mọi chỗ quy đổi
 * duration ↔ wordCount trong toàn bộ app.
 *
 * Lý do tách riêng:
 *   - Trước đây hệ số WPM rải rác ở 3 nơi (useContentBrief, useGenerationWorkflow,
 *     ContentBrief.deriveWordCount) → DRY violation, dễ drift.
 *   - WPM = 150 từ/phút ban đầu QUÁ THẤP so với TTS tiếng Việt pace chuẩn
 *     (Google TTS tiếng Việt ~170–200 WPM ở tốc độ 1.0x). Với style "Chú
 *     Que Tài Chính" (kể chuyện + số liệu) cần pacing chậm hơn TTS tối đa
 *     → 180 WPM là baseline chuẩn.
 *   - Khi lọc bỏ Markdown overhead (heading, bullet, SFX, bold) để TTS đọc,
 *     số từ spoken thực tế giảm ~15%. Vì vậy target wordCount phải LỚN HƠN
 *     raw WPM để bù hao hụt.
 */

const WORDS_PER_MINUTE = 180;
const TTS_MARKDOWN_LEAKAGE_PCT = 0.15;

export const WORDS_PER_MINUTE_BUFFERED = Math.round(
  WORDS_PER_MINUTE * (1 + TTS_MARKDOWN_LEAKAGE_PCT),
);

const MIN_TARGET_WORDS = 100;

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
