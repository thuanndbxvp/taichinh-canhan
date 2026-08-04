# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 1 - Phase 1 (Word Count Engine)

---

### BƯỚC 1: Cập Nhật Domain Logic `src/domain/wordCount.ts`
- **File:** `src/domain/wordCount.ts`
- **Nhiệm vụ:** Thay thế toàn bộ nội dung file bằng code TypeScript chuẩn mực dưới đây (giữ nguyên các hàm `minutesToTargetWords`, `wordsToMinutes`, `splitWordCountAcrossParts` để đảm bảo tương thích ngược, đồng thời bổ sung đầy đủ engine mới):

```typescript
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
```

---

### BƯỚC 2: Tạo Bộ Unit Tests `src/domain/wordCount.test.ts`
- **File:** `src/domain/wordCount.test.ts` (Tạo mới)
- **Nhiệm vụ:** Viết toàn bộ test suites kiểm tra đầy đủ các hàm:

```typescript
import { describe, it, expect } from 'vitest';
import {
  getWordCountTolerance,
  isWithinTolerance,
  rebalanceRemainingParts,
  countWords,
  formatWordCount,
  detectConciseRequest,
  determineToleranceMode,
  MIN_PART_FLOOR,
  minutesToTargetWords,
  wordsToMinutes,
  splitWordCountAcrossParts,
} from './wordCount';

describe('wordCount domain engine', () => {
  describe('getWordCountTolerance', () => {
    it('1800 words standard (±5%) -> min=1710, max=1890', () => {
      const t = getWordCountTolerance(1800, 'standard');
      expect(t.min).toBe(1710);
      expect(t.max).toBe(1890);
      expect(t.target).toBe(1800);
      expect(t.mode).toBe('standard');
    });

    it('1000 words flexible (±20%) -> min=800, max=1200', () => {
      const t = getWordCountTolerance(1000, 'flexible');
      expect(t.min).toBe(800);
      expect(t.max).toBe(1200);
      expect(t.target).toBe(1000);
      expect(t.mode).toBe('flexible');
    });
  });

  describe('isWithinTolerance', () => {
    it('standard mode boundaries', () => {
      const t = getWordCountTolerance(1800, 'standard');
      expect(isWithinTolerance(1710, t)).toBe(true);
      expect(isWithinTolerance(1890, t)).toBe(true);
      expect(isWithinTolerance(1709, t)).toBe(false);
      expect(isWithinTolerance(1891, t)).toBe(false);
    });

    it('flexible mode boundaries', () => {
      const t = getWordCountTolerance(1000, 'flexible');
      expect(isWithinTolerance(800, t)).toBe(true);
      expect(isWithinTolerance(1200, t)).toBe(true);
      expect(isWithinTolerance(799, t)).toBe(false);
      expect(isWithinTolerance(1201, t)).toBe(false);
    });
  });

  describe('rebalanceRemainingParts', () => {
    it('target 1800, 1 part (600), 4 remaining -> 300/part', () => {
      const parts = ['từ '.repeat(600).trim()];
      const result = rebalanceRemainingParts(1800, parts, 4);
      expect(result.newPartTarget).toBe(300);
      expect(result.totalEstimate).toBe(1800);
    });

    it('target 1800, 1 part (1600), 4 remaining -> MIN_PART_FLOOR (250) enforced', () => {
      const parts = ['từ '.repeat(1600).trim()];
      const result = rebalanceRemainingParts(1800, parts, 4);
      expect(result.newPartTarget).toBe(MIN_PART_FLOOR);
      expect(result.totalEstimate).toBe(1600 + (250 * 4));
    });

    it('all parts generated, 0 remaining -> 0', () => {
      const parts = ['từ '.repeat(1800).trim()];
      const result = rebalanceRemainingParts(1800, parts, 0);
      expect(result.newPartTarget).toBe(0);
    });
  });

  describe('detectConciseRequest', () => {
    it('detects concise keywords', () => {
      expect(detectConciseRequest('Hãy viết ngắn gọn thôi')).toBe(true);
      expect(detectConciseRequest('Tóm tắt ý chính')).toBe(true);
      expect(detectConciseRequest('Chỉ cần 800 từ')).toBe(true);
      expect(detectConciseRequest('Phân tích chuyên sâu về lãi suất')).toBe(false);
    });
  });

  describe('determineToleranceMode', () => {
    it('normal description + above recommended -> standard', () => {
      expect(determineToleranceMode('phân tích chi tiết', 2000, 1500)).toBe('standard');
    });

    it('concise description -> flexible', () => {
      expect(determineToleranceMode('viết ngắn gọn', 800, 1500)).toBe('flexible');
    });

    it('normal description + below recommended -> flexible', () => {
      expect(determineToleranceMode('phân tích', 1000, 1500)).toBe('flexible');
    });
  });

  describe('countWords', () => {
    it('counts Vietnamese and English text', () => {
      expect(countWords('đây là một kịch bản hay')).toBe(6);
      expect(countWords('## Heading **đậm** và [link](url)')).toBe(4);
      expect(countWords('')).toBe(0);
    });
  });

  describe('formatWordCount', () => {
    it('formats standard display string correctly', () => {
      const t = getWordCountTolerance(1800, 'standard');
      const formatted = formatWordCount(1830, t);
      expect(formatted).toContain('1830 / 1800 từ (±5%)');
      expect(formatted).toContain('+1.7% — ✅');
    });
  });

  describe('legacy helpers compatibility', () => {
    it('minutesToTargetWords converts correctly', () => {
      expect(minutesToTargetWords(10)).toBeGreaterThan(1500);
      expect(minutesToTargetWords(0)).toBe(0);
    });

    it('wordsToMinutes converts correctly', () => {
      expect(wordsToMinutes(1800)).toBe(10);
    });

    it('splitWordCountAcrossParts splits evenly', () => {
      expect(splitWordCountAcrossParts(1000, 3)).toEqual([334, 333, 333]);
    });
  });
});
```

---

### BƯỚC 3: Chạy Kiểm Thử (Testing)
- Chạy lệnh test trên terminal:
  ```bash
  npm test src/domain/wordCount.test.ts
  ```
- Đảm bảo 100% test cases đều pass (xanh lá).
- Chạy `npm run typecheck` để đảm bảo không gãy type bất kỳ file nào khác trong dự án.
