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
    expect(result.current.hasApiKey).toBe(false);
  });

  it('saveApiKeys cập nhật state và persist vào localStorage', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.saveApiKeys({ kyma: ['abc'], openai: [] }));
    expect(result.current.apiKeys.kyma).toEqual(['abc']);
    expect(result.current.hasApiKey).toBe(true);
    expect(JSON.parse(localStorage.getItem('ai-api-keys') || '{}')).toEqual({ kyma: ['abc'], openai: [] });
  });

  it('setThemeColor cập nhật CSS variable', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.setThemeColor('#abcdef'));
    expect(result.current.themeColor).toBe('#abcdef');
    expect(document.documentElement.style.getPropertyValue('--color-accent')).toBe('#abcdef');
    expect(localStorage.getItem('yt-script-theme')).toBe('#abcdef');
  });

  it('sửa provider khi switch', () => {
    const { result } = renderHook(() => useAiSettings());
    act(() => result.current.setAiProvider('openai'));
    expect(result.current.aiProvider).toBe('openai');
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
});
