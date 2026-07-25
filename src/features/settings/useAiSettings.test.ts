import { beforeEach, describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiSettings } from './useAiSettings';

describe('useAiSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty('--color-accent');
  });

  it('init với default keys khi localStorage trống', () => {
    const { result } = renderHook(() => useAiSettings());
    expect(result.current.apiKeys).toEqual({ kyma: [], openai: [] });
    expect(result.current.hasAnyApiKey).toBe(false);
  });

  it('saveApiKeys cập nhật state và persist vào localStorage', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.saveApiKeys({ kyma: ['abc'], openai: [] }));
    expect(result.current.apiKeys.kyma).toEqual(['abc']);
    expect(result.current.hasAnyApiKey).toBe(true);
    expect(JSON.parse(localStorage.getItem('ai-api-keys') || '{}')).toEqual({ kyma: ['abc'], openai: [] });
  });

  it('setThemeColor cập nhật CSS variable', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.setThemeColor('#abcdef'));
    expect(result.current.themeColor).toBe('#abcdef');
    expect(document.documentElement.style.getPropertyValue('--color-accent')).toBe('#abcdef');
    expect(localStorage.getItem('yt-script-theme')).toBe('#abcdef');
  });

  it('setActiveProviders toggle provider', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.setActiveProviders(['openai']));
    expect(result.current.activeProviders).toEqual(['openai']);
  });

  it('setLocalNotification + clearNotification không ném', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.setLocalNotification('hello'));
    expect(result.current.notification).toBe('hello');
    act(() => result.current.clearNotification());
    expect(result.current.notification).toBeNull();
  });

  it('reload keys từ localStorage khi apiKeyRotated được dispatch', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.saveApiKeys({ kyma: ['key1'], openai: [] }));
    act(() => {
      localStorage.setItem('ai-api-keys', JSON.stringify({ kyma: ['key1', 'key2'], openai: [] }));
      window.dispatchEvent(new CustomEvent('apiKeyRotated', { detail: { provider: 'kyma' } }));
    });
    expect(result.current.apiKeys.kyma).toEqual(['key1', 'key2']);
    expect(result.current.notification).toContain('kyma');
  });

  describe('getNextAiConfig round-robin', () => {
    it('trả về null khi không có key nào', () => {
      const { result } = renderHook(() => useAiSettings());
      act(() => result.current.setActiveProviders(['kyma', 'openai']));
      expect(result.current.getNextAiConfig()).toBeNull();
    });

    it('luôn trả về provider duy nhất khi chỉ bật 1 (không tăng roundRobinIndex)', () => {
      const { result } = renderHook(() => useAiSettings());
      act(() => result.current.saveApiKeys({ kyma: ['k1'], openai: [] }));
      act(() => result.current.setActiveProviders(['kyma']));
      const c1 = result.current.getNextAiConfig();
      const c2 = result.current.getNextAiConfig();
      const c3 = result.current.getNextAiConfig();
      expect(c1?.provider).toBe('kyma');
      expect(c2?.provider).toBe('kyma');
      expect(c3?.provider).toBe('kyma');
    });

    it('xoay vòng kyma ↔ openai khi cả 2 active và có key', () => {
      const { result } = renderHook(() => useAiSettings());
      act(() => result.current.saveApiKeys({ kyma: ['k1'], openai: ['o1'] }));
      act(() => result.current.setActiveProviders(['kyma', 'openai']));
      const seq = Array.from({ length: 4 }, () => result.current.getNextAiConfig()?.provider);
      expect(seq).toEqual(['kyma', 'openai', 'kyma', 'openai']);
    });

    it('bỏ qua provider không có key khi xoay vòng', () => {
      const { result } = renderHook(() => useAiSettings());
      act(() => result.current.saveApiKeys({ kyma: ['k1'], openai: [] }));
      act(() => result.current.setActiveProviders(['kyma', 'openai']));
      const seq = Array.from({ length: 4 }, () => result.current.getNextAiConfig()?.provider);
      expect(seq).toEqual(['kyma', 'kyma', 'kyma', 'kyma']);
    });

    it('saveApiKeys tự động enable provider nếu active hiện tại không có key', () => {
      const { result } = renderHook(() => useAiSettings());
      act(() => result.current.setActiveProviders(['kyma']));
      act(() => result.current.saveApiKeys({ kyma: [], openai: ['o1'] }));
      expect(result.current.activeProviders).toEqual(['openai']);
    });
  });
});
