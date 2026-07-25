import { useCallback, useState } from 'react';
import type { AiProvider, SceneSummary, ScriptPartSummary, SummarizeConfig } from '../../../types';
import {
  generateSingleVideoPrompt,
  summarizeScriptForScenes,
} from '../../../services/aiService';

export interface UseSceneWorkflowArgs {
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseSceneWorkflowReturn {
  summarizedScript: ScriptPartSummary[] | null;
  isSummarizing: boolean;
  summarizationError: string | null;
  summarize: (script: string, config: SummarizeConfig) => Promise<void>;
  generateVideoPrompt: (scene: SceneSummary, partIndex: number, config: SummarizeConfig) => Promise<void>;
  clearAll: () => void;
}

function chunkScript(script: string): string[] {
  return script
    .split(/(?=^## .*?$|^### .*?$)/m)
    .filter((s) => s.trim() !== '' && s.trim().length > 50 && !s.includes('Dàn Ý Chi Tiết') && !s.includes('BẮT ĐẦU TẠO'));
}

export function useSceneWorkflow({ aiProvider, selectedModel }: UseSceneWorkflowArgs): UseSceneWorkflowReturn {
  const [summarizedScript, setSummarizedScript] = useState<ScriptPartSummary[] | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summarizationError, setSummarizationError] = useState<string | null>(null);

  const summarize = useCallback(
    async (script: string, config: SummarizeConfig) => {
      if (!script) return;
      setIsSummarizing(true);
      setSummarizationError(null);
      try {
        const sum = await summarizeScriptForScenes(script, config, aiProvider, selectedModel);
        setSummarizedScript(sum);
      } catch (err) {
        setSummarizationError(err instanceof Error ? err.message : 'Lỗi khi tóm tắt.');
      } finally {
        setIsSummarizing(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const generateVideoPrompt = useCallback(
    async (scene: SceneSummary, partIndex: number, config: SummarizeConfig) => {
      const videoPrompt = await generateSingleVideoPrompt(scene, config, aiProvider, selectedModel);
      setSummarizedScript((prev) => {
        if (!prev) return null;
        const next = [...prev];
        next[partIndex].scenes = next[partIndex].scenes.map((s) =>
          s.sceneNumber === scene.sceneNumber ? { ...s, videoPrompt } : s,
        );
        return next;
      });
    },
    [aiProvider, selectedModel],
  );

  const clearAll = useCallback(() => {
    setSummarizedScript(null);
  }, []);

  return {
    summarizedScript,
    isSummarizing,
    summarizationError,
    summarize,
    generateVideoPrompt,
    clearAll,
  };
}
