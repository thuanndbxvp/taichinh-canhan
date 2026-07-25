import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDialogueWorkflow } from './useDialogueWorkflow';

vi.mock('../../../services/aiService', () => ({
  extractDialogue: vi.fn(),
}));

import { extractDialogue } from '../../../services/aiService';

describe('useDialogueWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('extract offline không gọi AI khi parse đủ sạch', async () => {
    const script = '## PHẦN 1\nĐây là lời thoại dòng 1.\nĐây là lời thoại dòng 2.';
    const { result } = renderHook(() => useDialogueWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.extract(script);
    });
    expect(extractDialogue).not.toHaveBeenCalled();
    expect(result.current.dialogue).toBeTruthy();
    expect(result.current.stats?.total).toBeGreaterThan(0);
  });

  it('extract fallback AI khi output còn nhiều marker', async () => {
    (extractDialogue as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      'PHẦN 1': 'Sạch không marker',
    });
    // Cần: Object.keys(result).length > 0 (đã có 1 section) AND totalChars > 100 AND hasMarkers.
    const script = '## PHẦN 1\n' + Array.from({ length: 10 }, (_, i) => `**[Visual]**: ${i}`).join('\n');
    const { result } = renderHook(() => useDialogueWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.extract(script);
    });
    expect(extractDialogue).toHaveBeenCalled();
  });

  it('clear xoá state', async () => {
    const script = '## PHẦN 1\nXin chào các bạn.';
    const { result } = renderHook(() => useDialogueWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.extract(script);
    });
    act(() => result.current.clear());
    expect(result.current.dialogue).toBeNull();
    expect(result.current.stats).toBeNull();
  });

  it('extract với script rỗng không làm gì', async () => {
    const { result } = renderHook(() => useDialogueWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.extract('');
    });
    expect(result.current.dialogue).toBeNull();
  });
});
