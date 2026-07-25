/**
 * Unit tests for usageTracker.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  clearUsage,
  getUsageEntries,
  getUsageTotals,
  recordUsage,
} from './usageTracker';

describe('usageTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns empty totals when storage empty', () => {
    const t = getUsageTotals();
    expect(t.calls).toBe(0);
    expect(t.totalTokens).toBe(0);
    expect(t.totalCost).toBe(0);
    expect(getUsageEntries()).toEqual([]);
  });

  it('records a call and updates totals', () => {
    const e = recordUsage({
      provider: 'kyma',
      model: 'gpt-4o-mini',
      kind: 'outline',
      promptTokens: 100,
      completionTokens: 50,
      label: 'test',
    });

    expect(e.provider).toBe('kyma');
    expect(e.kind).toBe('outline');
    expect(e.promptTokens).toBe(100);
    expect(e.completionTokens).toBe(50);
    expect(e.totalTokens).toBe(150);
    expect(e.cost).toBeGreaterThan(0);
    expect(e.label).toBe('test');

    const t = getUsageTotals();
    expect(t.calls).toBe(1);
    expect(t.totalPromptTokens).toBe(100);
    expect(t.totalCompletionTokens).toBe(50);
    expect(t.totalTokens).toBe(150);
  });

  it('handles negative or NaN token values as 0', () => {
    recordUsage({
      provider: 'kyma',
      model: 'gpt-4o-mini',
      kind: 'other',
      promptTokens: -10,
      completionTokens: NaN,
    });
    const t = getUsageTotals();
    expect(t.totalPromptTokens).toBe(0);
    expect(t.totalCompletionTokens).toBe(0);
    expect(t.totalTokens).toBe(0);
  });

  it('keeps entries ordered newest-first', () => {
    recordUsage({ provider: 'kyma', model: 'x', kind: 'other', promptTokens: 1 });
    recordUsage({ provider: 'kyma', model: 'y', kind: 'other', promptTokens: 2 });
    const entries = getUsageEntries();
    expect(entries[0].promptTokens).toBe(2);
    expect(entries[1].promptTokens).toBe(1);
  });

  it('caps entries to 100 most recent', () => {
    for (let i = 0; i < 150; i++) {
      recordUsage({ provider: 'p', model: 'm', kind: 'other', promptTokens: i });
    }
    expect(getUsageEntries().length).toBe(100);
  });

  it('uses zero cost for unknown models', () => {
    const e = recordUsage({
      provider: 'kyma',
      model: 'unknown-model-xyz',
      kind: 'other',
      promptTokens: 1000,
      completionTokens: 500,
    });
    expect(e.cost).toBe(0);
  });

  it('clearUsage resets state', () => {
    recordUsage({ provider: 'p', model: 'm', kind: 'other', promptTokens: 10 });
    expect(getUsageTotals().calls).toBe(1);
    clearUsage();
    expect(getUsageTotals().calls).toBe(0);
    expect(getUsageEntries()).toEqual([]);
  });

  it('persists across calls', () => {
    recordUsage({ provider: 'p', model: 'm', kind: 'outline', promptTokens: 5 });
    // second read from same localStorage instance
    const t = getUsageTotals();
    expect(t.totalPromptTokens).toBe(5);
    expect(getUsageEntries().length).toBe(1);
  });
});
