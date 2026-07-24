import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLibrary } from './useLibrary';

describe('useLibrary', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('saveCurrent yêu cầu title + script không rỗng', async () => {
    const { result } = renderHook(() => useLibrary());
    let ok: boolean = true;
    await act(async () => {
      ok = await result.current.saveCurrent({ title: '', outlineContent: '', script: '' });
    });
    expect(ok).toBe(false);
    expect(result.current.library).toHaveLength(0);
  });

  it('saveCurrent thêm item và đánh dấu hasSaved', async () => {
    const { result } = renderHook(() => useLibrary());
    let ok: boolean = false;
    await act(async () => {
      ok = await result.current.saveCurrent({ title: 'T', outlineContent: 'O', script: 'S' });
    });
    expect(ok).toBe(true);
    expect(result.current.library).toHaveLength(1);
    expect(result.current.library[0].title).toBe('T');
    expect(result.current.hasSaved).toBe(true);
  });

  it('removeItem xoá item theo id', async () => {
    const { result } = renderHook(() => useLibrary());
    await act(async () => {
      vi.setSystemTime(new Date(1700000000000));
      await result.current.saveCurrent({ title: 'B', outlineContent: '', script: 's2' });
    });
    await act(async () => {
      vi.setSystemTime(new Date(1700000001000));
      await result.current.saveCurrent({ title: 'A', outlineContent: '', script: 's1' });
    });
    const firstId = result.current.library[0].id;
    const secondId = result.current.library[1].id;
    await act(async () => {
      await result.current.removeItem(firstId);
    });
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

  it('loadItem trả về fields và set hasSaved', async () => {
    const { result } = renderHook(() => useLibrary());
    // Đợi effect load xong để khỏi bị React warning về update ngoài act().
    await act(async () => {
      await Promise.resolve();
    });
    const item = { id: 1, savedAt: 1, title: 'X', outlineContent: 'o', script: 's' };
    let loaded!: { title: string; outlineContent: string; script: string };
    act(() => {
      loaded = result.current.loadItem(item);
    });
    expect(loaded).toEqual({ title: 'X', outlineContent: 'o', script: 's' });
    expect(result.current.hasSaved).toBe(true);
  });

  it('persist vào localStorage (key v2)', async () => {
    const { result } = renderHook(() => useLibrary());
    await act(async () => {
      await result.current.saveCurrent({ title: 'T', outlineContent: '', script: 'S' });
    });
    const stored = JSON.parse(localStorage.getItem('yt-script-library-v2') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('T');
    expect(stored[0].schemaVersion).toBe(2);
  });

  it('migrate từ legacy key (yt-script-library) sang v2', async () => {
    // Pre-seed legacy data.
    localStorage.setItem(
      'yt-script-library',
      JSON.stringify([
        { id: 1700000000000, savedAt: 1700000000000, title: 'legacy1', outlineContent: '', script: 'ls' },
      ]),
    );

    const { result } = renderHook(() => useLibrary());
    // Đợi effect load xong.
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.library).toHaveLength(1);
    expect(result.current.library[0].title).toBe('legacy1');
    // Legacy key đã được backup + xoá.
    expect(localStorage.getItem('yt-script-library')).toBeNull();
    expect(localStorage.getItem('yt-script-library-backup')).not.toBeNull();
  });
});