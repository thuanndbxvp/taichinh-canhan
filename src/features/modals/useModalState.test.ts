import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalState } from './useModalState';

describe('useModalState', () => {
  it('mặc định tất cả modal đóng', () => {
    const { result } = renderHook(() => useModalState());
    expect(result.current.isOpen('library')).toBe(false);
    expect(result.current.isOpen('summarize')).toBe(false);
  });

  it('open / close hoạt động', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.open('library'));
    expect(result.current.isOpen('library')).toBe(true);
    act(() => result.current.close('library'));
    expect(result.current.isOpen('library')).toBe(false);
  });

  it('toggle đảo trạng thái', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.toggle('score'));
    expect(result.current.isOpen('score')).toBe(true);
    act(() => result.current.toggle('score'));
    expect(result.current.isOpen('score')).toBe(false);
  });

  it('closeAll đóng tất cả', () => {
    const { result } = renderHook(() => useModalState());
    act(() => {
      result.current.open('library');
      result.current.open('score');
      result.current.open('summarize');
    });
    act(() => result.current.closeAll());
    expect(result.current.isOpen('library')).toBe(false);
    expect(result.current.isOpen('score')).toBe(false);
    expect(result.current.isOpen('summarize')).toBe(false);
  });
});
