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

    it('detects specific word count', () => {
      expect(detectConciseRequest('khoảng 1000 từ')).toBe(true);
      expect(detectConciseRequest('chỉ 500 words')).toBe(true);
    });

    it('returns false for empty string', () => {
      expect(detectConciseRequest('')).toBe(false);
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

    it('zero minRecommended -> defaults to standard if above', () => {
      expect(determineToleranceMode('phân tích', 2000, 0)).toBe('standard');
    });
  });

  describe('countWords', () => {
    it('counts Vietnamese and English text', () => {
      expect(countWords('đây là một kịch bản hay')).toBe(6);
      expect(countWords('## Heading **đậm** và [link](url)')).toBe(5);
      expect(countWords('')).toBe(0);
    });

    it('strips markdown formatting', () => {
      expect(countWords('**bold** và *italic* với (paren)')).toBe(5);
    });

    it('handles null/undefined gracefully', () => {
      expect(countWords('')).toBe(0);
    });
  });

  describe('formatWordCount', () => {
    it('formats standard display string correctly', () => {
      const t = getWordCountTolerance(1800, 'standard');
      const formatted = formatWordCount(1830, t);
      expect(formatted).toContain('1830 / 1800 từ (±5%)');
      expect(formatted).toContain('+1.7%');
      expect(formatted).toContain('✅');
    });

    it('formats flexible display string correctly', () => {
      const t = getWordCountTolerance(1000, 'flexible');
      const formatted = formatWordCount(850, t);
      expect(formatted).toContain('850 / 1000 từ (linh hoạt ±20%)');
      expect(formatted).toContain('✅');
    });

    it('shows warning for out of tolerance', () => {
      const t = getWordCountTolerance(1000, 'standard');
      const formatted = formatWordCount(1100, t);
      expect(formatted).toContain('⚠️');
    });
  });

  describe('legacy helpers compatibility', () => {
    it('minutesToTargetWords converts correctly', () => {
      expect(minutesToTargetWords(10)).toBeGreaterThan(1500);
      expect(minutesToTargetWords(0)).toBe(0);
      expect(minutesToTargetWords(-5)).toBe(0);
    });

    it('wordsToMinutes converts correctly', () => {
      expect(wordsToMinutes(1800)).toBe(10);
      expect(wordsToMinutes(0)).toBe(0);
    });

    it('splitWordCountAcrossParts splits evenly', () => {
      expect(splitWordCountAcrossParts(1000, 3)).toEqual([334, 333, 333]);
    });

    it('splitWordCountAcrossParts handles edge cases', () => {
      expect(splitWordCountAcrossParts(0, 3)).toEqual([0, 0, 0]);
      expect(splitWordCountAcrossParts(1000, 0)).toEqual([]);
    });
  });
});
