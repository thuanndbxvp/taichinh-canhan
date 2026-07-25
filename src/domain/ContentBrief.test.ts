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

  it('deriveWordCount: 480s → 1200 từ', () => {
    expect(deriveWordCount(480)).toBe('1200');
  });

  it('deriveWordCount: minimum 100', () => {
    expect(deriveWordCount(0)).toBe('100');
    expect(deriveWordCount(-100)).toBe('100');
  });

  it('isContentBrief: true/false', () => {
    expect(isContentBrief(createDefaultBrief())).toBe(true);
    expect(isContentBrief(null)).toBe(false);
    expect(isContentBrief({ schemaVersion: 1, title: 'x', audience: '', language: '', outlineContent: '' })).toBe(true);
    expect(isContentBrief({})).toBe(false);
  });
});