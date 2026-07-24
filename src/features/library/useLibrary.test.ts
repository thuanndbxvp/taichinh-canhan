import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLibrary } from './useLibrary';

describe('useLibrary', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('saveCurrent yêu cầu title + script không rỗng', () => {
    const { result } = renderHook(() => useLibrary());
    let ok: boolean = true;
    act(() => {
      ok = result.current.saveCurrent({ title: '', outlineContent: '', script: '' });
    });
    expect(ok).toBe(false);
    expect(result.current.library).toHaveLength(0);
  });

  it('saveCurrent thêm item và đánh dấu hasSaved', () => {
    const { result } = renderHook(() => useLibrary());
    let ok: boolean = false;
    act(() => {
      ok = result.current.saveCurrent({ title: 'T', outlineContent: 'O', script: 'S' });
    });
    expect(ok).toBe(true);
    expect(result.current.library).toHaveLength(1);
    expect(result.current.library[0].title).toBe('T');
    expect(result.current.hasSaved).toBe(true);
  });

  it('removeItem xoá item theo id', () => {
    const { result } = renderHook(() => useLibrary());
    let firstId = 0;
    let secondId = 0;
    act(() => {
      vi.setSystemTime(new Date(1700000000000));
      result.current.saveCurrent({ title: 'B', outlineContent: '', script: 's2' });
    });
    act(() => {
      vi.setSystemTime(new Date(1700000001000));
      result.current.saveCurrent({ title: 'A', outlineContent: '', script: 's1' });
    });
    firstId = result.current.library[0].id;
    secondId = result.current.library[1].id;
    act(() => result.current.removeItem(firstId));
    expect(result.current.library).toHaveLength(1);
    expect(result.current.library[0].id).toBe(secondId);
    expect(result.current.library[0].title).toBe('B');
    vi.useRealTimers();
  });

  it('importFromText thêm items lên đầu', async () => {
    const { result } = renderHook(() => useLibrary());
    const json = JSON.stringify({
      schema: 1,
      items: [
        { id: 1, savedAt: 1, title: 'imp', outlineContent: '', script: 'is' },
      ],
    });
    let res!: { imported: number; warnings: string[] };
    await act(async () => {
      res = await result.current.importFromText(json);
    });
    expect(res.imported).toBe(1);
    expect(result.current.library[0].title).toBe('imp');
  });

  it('loadItem trả về fields và set hasSaved', () => {
    const { result } = renderHook(() => useLibrary());
    const item = { id: 1, savedAt: 1, title: 'X', outlineContent: 'o', script: 's' };
    let loaded!: { title: string; outlineContent: string; script: string };
    act(() => {
      loaded = result.current.loadItem(item);
    });
    expect(loaded).toEqual({ title: 'X', outlineContent: 'o', script: 's' });
    expect(result.current.hasSaved).toBe(true);
  });

  it('persist vào localStorage', () => {
    const { result } = renderHook(() => useLibrary());
    act(() => {
      result.current.saveCurrent({ title: 'T', outlineContent: '', script: 'S' });
    });
    const stored = JSON.parse(localStorage.getItem('yt-script-library') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('T');
  });
});
