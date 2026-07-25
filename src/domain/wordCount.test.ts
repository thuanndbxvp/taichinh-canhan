import { describe, it, expect } from 'vitest';
import {
  minutesToTargetWords,
  wordsToMinutes,
  splitWordCountAcrossParts,
  WORDS_PER_MINUTE_BUFFERED,
} from './wordCount';

describe('wordCount', () => {
  it('WORDS_PER_MINUTE_BUFFERED = 180 * 1.15 = 207', () => {
    expect(WORDS_PER_MINUTE_BUFFERED).toBe(207);
  });

  it('minutesToTargetWords: 5 phút = 1035 từ', () => {
    expect(minutesToTargetWords(5)).toBe(1035);
  });

  it('minutesToTargetWords: 8 phút = 1656 từ', () => {
    expect(minutesToTargetWords(8)).toBe(1656);
  });

  it('minutesToTargetWords: 1 phút = đúng 207 từ', () => {
    expect(minutesToTargetWords(1)).toBe(207);
  });

  it('minutesToTargetWords: input không hợp lệ → 0', () => {
    expect(minutesToTargetWords(0)).toBe(0);
    expect(minutesToTargetWords(-5)).toBe(0);
    expect(minutesToTargetWords(NaN)).toBe(0);
  });

  it('minutesToTargetWords: < 100 giây phút → min 100', () => {
    // guard: input rất nhỏ nhưng phải có tối thiểu 100 từ để AI không viết 1 dòng
    expect(minutesToTargetWords(0.4)).toBe(100);
  });

  it('wordsToMinutes: nghịch đảo của minutesToTargetWords', () => {
    expect(wordsToMinutes(1035)).toBe(5.8); // 1035 / 180 = 5.75 → round to 5.8
    expect(wordsToMinutes(0)).toBe(0);
  });

  it('splitWordCountAcrossParts: chia đều + remainder về phần đầu', () => {
    expect(splitWordCountAcrossParts(1000, 4)).toEqual([250, 250, 250, 250]);
    expect(splitWordCountAcrossParts(1003, 4)).toEqual([251, 250, 251, 251]);
  });

  it('splitWordCountAcrossParts: 0 phần → []', () => {
    expect(splitWordCountAcrossParts(1000, 0)).toEqual([]);
  });

  it('splitWordCountAcrossParts: total=0 → toàn 0', () => {
    expect(splitWordCountAcrossParts(0, 3)).toEqual([0, 0, 0]);
  });
});
