import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneWorkflow } from './useSceneWorkflow';

vi.mock('../../../services/aiService', () => ({
  generateSingleVideoPrompt: vi.fn(),
  summarizeScriptForScenes: vi.fn(),
}));

import * as aiService from '../../../services/aiService';

describe('useSceneWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('summarize cập nhật state thành công', async () => {
    (aiService.summarizeScriptForScenes as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { partTitle: 'P1', scenes: [{ sceneNumber: 1, summary: 's', imagePrompt: 'i', videoPrompt: 'v' }] },
    ]);
    const { result } = renderHook(() => useSceneWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.summarize('script', { numberOfPrompts: 'auto', includeNarration: false, scenarioType: 'finance' });
    });
    expect(result.current.summarizedScript).toHaveLength(1);
    expect(result.current.isSummarizing).toBe(false);
  });

  it('summarize truyền rỗng → state vẫn null', async () => {
    const { result } = renderHook(() => useSceneWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.summarize('', { numberOfPrompts: 'auto', includeNarration: false, scenarioType: 'finance' });
    });
    expect(result.current.summarizedScript).toBeNull();
    expect(aiService.summarizeScriptForScenes).not.toHaveBeenCalled();
  });

  it('summarize lỗi → set summarizationError', async () => {
    (aiService.summarizeScriptForScenes as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useSceneWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.summarize('script', { numberOfPrompts: 'auto', includeNarration: false, scenarioType: 'finance' });
    });
    expect(result.current.summarizedScript).toBeNull();
    expect(result.current.summarizationError).toBe('network down');
    expect(result.current.isSummarizing).toBe(false);
  });

  it('clearAll reset state', async () => {
    (aiService.summarizeScriptForScenes as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { partTitle: 'P1', scenes: [{ sceneNumber: 1, summary: 's', imagePrompt: 'i', videoPrompt: 'v' }] },
    ]);
    const { result } = renderHook(() => useSceneWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.summarize('script', { numberOfPrompts: 'auto', includeNarration: false, scenarioType: 'finance' });
    });
    expect(result.current.summarizedScript).toHaveLength(1);
    act(() => result.current.clearAll());
    expect(result.current.summarizedScript).toBeNull();
  });
});
