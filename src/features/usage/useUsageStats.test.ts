/**
 * Unit tests for useUsageStats hook.
 */

import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUsageStats } from './useUsageStats';
import { recordUsage } from '../../services/usage/usageTracker';

describe('useUsageStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns empty stats initially', () => {
    const { result } = renderHook(() => useUsageStats());
    expect(result.current.totals.calls).toBe(0);
    expect(result.current.entries).toEqual([]);
  });

  it('refresh picks up new entries', () => {
    const { result } = renderHook(() => useUsageStats());
    recordUsage({ provider: 'kyma', model: 'gpt-4o-mini', kind: 'outline', promptTokens: 5 });
    act(() => result.current.refresh());
    expect(result.current.totals.calls).toBe(1);
    expect(result.current.entries.length).toBe(1);
  });

  it('clear resets state', () => {
    const { result } = renderHook(() => useUsageStats());
    recordUsage({ provider: 'p', model: 'm', kind: 'other', promptTokens: 1 });
    act(() => result.current.refresh());
    expect(result.current.totals.calls).toBe(1);

    // Spy on window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    act(() => result.current.clear());
    confirmSpy.mockRestore();

    expect(result.current.totals.calls).toBe(0);
    expect(result.current.entries).toEqual([]);
  });
});
