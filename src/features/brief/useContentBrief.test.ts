import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContentBrief } from './useContentBrief';

describe('useContentBrief', () => {
  it('mặc định là Chú Que Tài Chính mode', () => {
    const { result } = renderHook(() => useContentBrief());
    expect(result.current.brief.title).toBe('');
    expect(result.current.brief.targetAudience).toBe('Vietnamese');
    expect(result.current.brief.isFinanceMode).toBe(true);
    expect(result.current.brief.styleOptions).toEqual({ expression: 'Empathetic', style: 'Storytelling' });
  });

  it('setTitle cập nhật title', () => {
    const { result } = renderHook(() => useContentBrief());
    act(() => result.current.setTitle('Lãi kép'));
    expect(result.current.brief.title).toBe('Lãi kép');
  });

  it('effectiveTargetWordCount dùng wordCount khi lengthType=words', () => {
    const { result } = renderHook(() => useContentBrief({ wordCount: '1200' }));
    expect(result.current.effectiveTargetWordCount).toBe('1200');
  });

  it('effectiveTargetWordCount = duration * 150 khi lengthType=duration', () => {
    const { result } = renderHook(() => useContentBrief({ videoDuration: '8', lengthType: 'duration' }));
    expect(result.current.effectiveTargetWordCount).toBe('1200');
  });

  it('setIsFinanceMode luôn ép về finance mode (cố định)', () => {
    const { result } = renderHook(() => useContentBrief({ isFinanceMode: false }));
    expect(result.current.brief.isFinanceMode).toBe(false);
    act(() => result.current.setIsFinanceMode());
    expect(result.current.brief.isFinanceMode).toBe(true);
    expect(result.current.brief.styleOptions).toEqual({ expression: 'Empathetic', style: 'Storytelling' });
    expect(result.current.brief.wordCount).toBe('1200');
    expect(result.current.brief.targetAudience).toBe('Vietnamese');
  });

  it('reset trả về default', () => {
    const { result } = renderHook(() => useContentBrief({ title: 'something' }));
    act(() => result.current.reset());
    expect(result.current.brief.title).toBe('');
  });

  it('patch hỗ trợ cập nhật nhiều field', () => {
    const { result } = renderHook(() => useContentBrief());
    act(() => result.current.patch({ title: 'A', keywords: 'B' }));
    expect(result.current.brief.title).toBe('A');
    expect(result.current.brief.keywords).toBe('B');
  });
});
