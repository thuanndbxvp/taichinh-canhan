import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneWorkflow } from './useSceneWorkflow';

vi.mock('../../../services/aiService', () => ({
  generateVisualPrompt: vi.fn(),
  generateAllVisualPrompts: vi.fn(),
  generateSingleVideoPrompt: vi.fn(),
  summarizeScriptForScenes: vi.fn(),
}));

import * as aiService from '../../../services/aiService';

describe('useSceneWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generateVisualPromptForScene trả về cached khi có', async () => {
    (aiService.generateVisualPrompt as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([{ english: 'p1', vietnamese: 'v1' }]);
    const { result } = renderHook(() => useSceneWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.generateVisualPromptForScene('scene A');
    });
    await act(async () => {
      await result.current.generateVisualPromptForScene('scene A');
    });
    expect(aiService.generateVisualPrompt).toHaveBeenCalledTimes(1);
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

  it('clearAll reset state', async () => {
    (aiService.summarizeScriptForScenes as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const { result } = renderHook(() => useSceneWorkflow({ aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.summarize('script', { numberOfPrompts: 'auto', includeNarration: false, scenarioType: 'finance' });
    });
    act(() => result.current.clearAll());
    expect(result.current.summarizedScript).toBeNull();
    expect(result.current.visualPromptsCache.size).toBe(0);
  });
});
