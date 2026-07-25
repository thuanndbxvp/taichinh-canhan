import { describe, it, expect } from 'vitest';
import { createDefaultBrief, deriveWordCount, isContentBrief } from './ContentBrief';

describe('ContentBrief', () => {
  it('createDefaultBrief trả schema v1 + defaults', () => {
    const b = createDefaultBrief();
    expect(b.schemaVersion).toBe(1);
    expect(b.language).toBe('Vietnamese');
    expect(b.market).toBe('Vietnam');
    expect(b.durationSec).toBe(480);
  });

  it('deriveWordCount: 480s (8 phút) → 1656 từ (180 WPM + 15% buffer)', () => {
    // 8 phút * 180 WPM * 1.15 = 1656 từ
    expect(deriveWordCount(480)).toBe('1656');
  });

  it('deriveWordCount: minimum 100', () => {
    expect(deriveWordCount(0)).toBe('100');
    expect(deriveWordCount(-100)).toBe('100');
  });

  it('deriveWordCount: 300s (5 phút) → 1035 từ', () => {
    // 5 phút * 180 WPM * 1.15 = 1035 từ
    expect(deriveWordCount(300)).toBe('1035');
  });

  it('isContentBrief: true/false', () => {
    expect(isContentBrief(createDefaultBrief())).toBe(true);
    expect(isContentBrief(null)).toBe(false);
    expect(isContentBrief({ schemaVersion: 1, title: 'x', audience: '', language: '', outlineContent: '' })).toBe(true);
    expect(isContentBrief({})).toBe(false);
  });
});