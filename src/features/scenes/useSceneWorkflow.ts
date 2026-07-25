import { useCallback, useState } from 'react';
import type { AiProvider, AllVisualPromptsResult, SceneSummary, ScriptPartSummary, SummarizeConfig, VisualPrompt } from '../../../types';
import {
  generateAllVisualPrompts,
  generateSingleVideoPrompt,
  generateVisualPrompt,
  summarizeScriptForScenes,
} from '../../../services/aiService';

export interface UseSceneWorkflowArgs {
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseSceneWorkflowReturn {
  // Cached + ephemeral
  visualPromptsCache: Map<string, VisualPrompt[]>;
  loadingVisualPromptsParts: Set<string>;
  allVisualPrompts: AllVisualPromptsResult[] | null;
  isGeneratingAllVisualPrompts: boolean;
  allVisualPromptsError: string | null;
  visualPrompts: VisualPrompt[] | null;
  isGeneratingVisualPrompt: boolean;
  visualPromptError: string | null;
  summarizedScript: ScriptPartSummary[] | null;
  isSummarizing: boolean;
  summarizationError: string | null;
  isGeneratingAllSegmentPrompts: boolean;
  generateVisualPromptForScene: (scene: string) => Promise<VisualPrompt[] | null>;
  generateAllVisualPromptsForScript: (script: string) => Promise<void>;
  generateAllSegmentPrompts: (script: string) => Promise<void>;
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
  const [visualPromptsCache, setVisualPromptsCache] = useState<Map<string, VisualPrompt[]>>(new Map());
  const [loadingVisualPromptsParts, setLoadingVisualPromptsParts] = useState<Set<string>>(new Set());
  const [allVisualPrompts, setAllVisualPrompts] = useState<AllVisualPromptsResult[] | null>(null);
  const [isGeneratingAllVisualPrompts, setIsGeneratingAllVisualPrompts] = useState<boolean>(false);
  const [allVisualPromptsError, setAllVisualPromptsError] = useState<string | null>(null);
  const [visualPrompts, setVisualPrompts] = useState<VisualPrompt[] | null>(null);
  const [isGeneratingVisualPrompt, setIsGeneratingVisualPrompt] = useState<boolean>(false);
  const [visualPromptError, setVisualPromptError] = useState<string | null>(null);
  const [summarizedScript, setSummarizedScript] = useState<ScriptPartSummary[] | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summarizationError, setSummarizationError] = useState<string | null>(null);
  const [isGeneratingAllSegmentPrompts, setIsGeneratingAllSegmentPrompts] = useState<boolean>(false);

  const generateVisualPromptForScene = useCallback(
    async (scene: string) => {
      if (visualPromptsCache.has(scene)) {
        const cached = visualPromptsCache.get(scene) || null;
        setVisualPrompts(cached);
        return cached;
      }
      setIsGeneratingVisualPrompt(true);
      setVisualPromptError(null);
      setVisualPrompts(null);
      setLoadingVisualPromptsParts((prev) => new Set(prev).add(scene));
      try {
        const prompts = await generateVisualPrompt(scene, aiProvider, selectedModel);
        setVisualPromptsCache((prev) => {
          const next = new Map(prev);
          next.set(scene, prompts);
          return next;
        });
        setVisualPrompts(prompts);
        return prompts;
      } catch (err) {
        setVisualPromptError(err instanceof Error ? err.message : 'Lỗi tạo prompt hình ảnh.');
        return null;
      } finally {
        setIsGeneratingVisualPrompt(false);
        setLoadingVisualPromptsParts((prev) => {
          const next = new Set(prev);
          next.delete(scene);
          return next;
        });
      }
    },
    [aiProvider, selectedModel, visualPromptsCache],
  );

  const generateAllVisualPromptsForScript = useCallback(
    async (script: string) => {
      if (!script) return;
      setIsGeneratingAllVisualPrompts(true);
      setAllVisualPromptsError(null);
      try {
        const prompts = await generateAllVisualPrompts(script, aiProvider, selectedModel);
        setAllVisualPrompts(prompts);
      } catch (err) {
        setAllVisualPromptsError(err instanceof Error ? err.message : 'Lỗi tạo toàn bộ prompt.');
      } finally {
        setIsGeneratingAllVisualPrompts(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const generateAllSegmentPrompts = useCallback(
    async (script: string) => {
      if (!script) return;
      const sections = chunkScript(script);
      setIsGeneratingAllSegmentPrompts(true);
      for (const section of sections) {
        if (visualPromptsCache.has(section)) continue;
        setLoadingVisualPromptsParts((prev) => new Set(prev).add(section));
        try {
          const prompts = await generateVisualPrompt(section, aiProvider, selectedModel);
          setVisualPromptsCache((prev) => {
            const next = new Map(prev);
            next.set(section, prompts);
            return next;
          });
        } catch (err) {
          console.error('Lỗi khi tạo prompt cho đoạn:', section.substring(0, 50), err);
        } finally {
          setLoadingVisualPromptsParts((prev) => {
            const next = new Set(prev);
            next.delete(section);
            return next;
          });
        }
      }
      setIsGeneratingAllSegmentPrompts(false);
    },
    [aiProvider, selectedModel, visualPromptsCache],
  );

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
    setVisualPromptsCache(new Map());
    setAllVisualPrompts(null);
    setSummarizedScript(null);
    setVisualPrompts(null);
    setIsGeneratingAllSegmentPrompts(false);
  }, []);

  return {
    visualPromptsCache,
    loadingVisualPromptsParts,
    allVisualPrompts,
    isGeneratingAllVisualPrompts,
    allVisualPromptsError,
    visualPrompts,
    isGeneratingVisualPrompt,
    visualPromptError,
    summarizedScript,
    isSummarizing,
    summarizationError,
    isGeneratingAllSegmentPrompts,
    generateVisualPromptForScene,
    generateAllVisualPromptsForScript,
    generateAllSegmentPrompts,
    summarize,
    generateVideoPrompt,
    clearAll,
  };
}
