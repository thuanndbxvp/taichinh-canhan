import { useCallback, useEffect, useRef, useState } from 'react';
import type { AiProvider, GenerationParams } from '../../../types';
import {
  generateScript,
  generateScriptOutline,
  generateScriptPart,
  parseOutlineIntoSegments,
  reviseScript,
} from '../../../services/aiService';
import type { ContentBrief } from '../brief/useContentBrief';
import { AppError } from '../../lib/errors';

const PARTS_HEADER = '--- BẮT ĐẦU TẠO KỊCH BẢN CHI TIẾT ---\n\n';

export interface UseGenerationWorkflowArgs {
  brief: ContentBrief;
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseGenerationWorkflowReturn {
  generatedScript: string;
  setGeneratedScript: (s: string) => void;
  isLoading: boolean;
  error: string | null;
  revisionPrompt: string;
  setRevisionPrompt: (s: string) => void;
  revisionCount: number;
  isGeneratingSequentially: boolean;
  currentPartIndex: number;
  totalParts: number;
  outlineParts: string[];
  autoContinue: boolean;
  setAutoContinue: (v: boolean) => void;
  generate: () => Promise<void>;
  startSequential: () => void;
  stopSequential: () => void;
  generateNextPart: () => Promise<void>;
  revise: () => Promise<void>;
  resetAllCaches: () => void;
  setExternalError: (msg: string | null) => void;
}

function buildParams(brief: ContentBrief, finalWordCount: string): GenerationParams {
  return {
    title: brief.title,
    outlineContent: brief.outlineContent,
    targetAudience: brief.targetAudience,
    styleOptions: brief.styleOptions,
    keywords: brief.keywords,
    formattingOptions: brief.formattingOptions,
    wordCount: finalWordCount,
    scriptParts: brief.scriptParts,
    scriptType: brief.scriptType,
    numberOfSpeakers: brief.numberOfSpeakers,
    isFinanceMode: brief.isFinanceMode,
  };
}

function effectiveWordCount(brief: ContentBrief): string {
  if (brief.lengthType === 'duration') {
    const minutes = Math.max(0, parseInt(brief.videoDuration || '0', 10));
    return (minutes * 150).toString();
  }
  return brief.wordCount;
}

/**
 * Quản lý toàn bộ workflow generate:
 * - generate: outline (khi dài) hoặc script trực tiếp.
 * - startSequential / generateNextPart / stopSequential: auto-next.
 * - revise: yêu cầu sửa kịch bản.
 * - resetAllCaches: clear cache trước khi generate mới.
 */
export function useGenerationWorkflow({
  brief,
  aiProvider,
  selectedModel,
}: UseGenerationWorkflowArgs): UseGenerationWorkflowReturn {
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [revisionPrompt, setRevisionPrompt] = useState<string>('');
  const [revisionCount, setRevisionCount] = useState<number>(0);
  const [isGeneratingSequentially, setIsGeneratingSequentially] = useState<boolean>(false);
  const [outlineParts, setOutlineParts] = useState<string[]>([]);
  const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
  const [fullOutlineText, setFullOutlineText] = useState<string>('');
  const [autoContinue, setAutoContinue] = useState<boolean>(true);
  const isStoppingRef = useRef<boolean>(false);

  const resetAllCaches = useCallback(() => {
    setGeneratedScript('');
    setRevisionCount(0);
    setIsGeneratingSequentially(false);
    setOutlineParts([]);
    setCurrentPartIndex(0);
    setFullOutlineText('');
    isStoppingRef.current = false;
  }, []);

  const generate = useCallback(async () => {
    if (!brief.title.trim()) {
      setError('Vui lòng nhập hoặc chọn một tiêu đề video.');
      return;
    }
    const finalWordCount = effectiveWordCount(brief);
    const wcNum = parseInt(finalWordCount, 10);
    if (!Number.isFinite(wcNum) || wcNum <= 0) {
      setError(
        brief.lengthType === 'duration'
          ? 'Vui lòng nhập thời lượng video lớn hơn 0 phút.'
          : 'Vui lòng nhập tổng số từ lớn hơn 0.',
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedScript('');
    resetAllCaches();

    const params = buildParams(brief, finalWordCount);

    try {
      const isLongScript = parseInt(finalWordCount, 10) >= 1000;
      if (isLongScript) {
        const outline = await generateScriptOutline(params, aiProvider, selectedModel);
        setGeneratedScript(outline);
        setFullOutlineText(outline);
        if (!outline || !outline.trim()) {
          setError('AI provider trả về dàn ý rỗng. Vui lòng thử lại hoặc đổi model.');
        }
      } else {
        const script = await generateScript(params, aiProvider, selectedModel);
        setGeneratedScript(script);
        if (!script || !script.trim()) {
          setError('AI provider trả về kịch bản rỗng. Vui lòng thử lại hoặc đổi model.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  }, [brief, aiProvider, selectedModel, resetAllCaches]);

  const generateNextPart = useCallback(async () => {
    if (!isGeneratingSequentially || currentPartIndex >= outlineParts.length || isStoppingRef.current) {
      if (isStoppingRef.current) setIsGeneratingSequentially(false);
      return;
    }

    setIsLoading(true);
    const currentOutlinePart = outlineParts[currentPartIndex];
    const finalWordCount = effectiveWordCount(brief);
    const params = buildParams(brief, finalWordCount);

    try {
      const partContent = await generateScriptPart(
        fullOutlineText,
        generatedScript,
        currentOutlinePart,
        params,
        aiProvider,
        selectedModel,
      );
      if (isStoppingRef.current) return;

      setGeneratedScript((prev) => prev + partContent + '\n\n---\n\n');
      const nextIndex = currentPartIndex + 1;
      setCurrentPartIndex(nextIndex);

      if (autoContinue && nextIndex < outlineParts.length && !isStoppingRef.current) {
        setTimeout(() => generateNextPart(), 100);
      } else if (nextIndex >= outlineParts.length) {
        setIsGeneratingSequentially(false);
      }
    } catch (err) {
      const message = err instanceof AppError ? err.message : err instanceof Error ? err.message : 'Lỗi khi tạo phần tiếp theo.';
      setError(message);
      setIsGeneratingSequentially(false);
    } finally {
      setIsLoading(false);
    }
  }, [isGeneratingSequentially, currentPartIndex, outlineParts, brief, aiProvider, selectedModel, fullOutlineText, generatedScript, autoContinue]);

  const startSequential = useCallback(() => {
    if (!generatedScript) return;
    const parts = parseOutlineIntoSegments(generatedScript);
    if (parts.length === 0) {
      setError('Không tìm thấy cấu trúc phần trong dàn ý. Vui lòng thử lại.');
      return;
    }
    isStoppingRef.current = false;
    setOutlineParts(parts);
    setCurrentPartIndex(0);
    setIsGeneratingSequentially(true);
    setGeneratedScript(PARTS_HEADER);
  }, [generatedScript]);

  const stopSequential = useCallback(() => {
    isStoppingRef.current = true;
    setIsLoading(false);
    setIsGeneratingSequentially(false);
  }, []);

  // Trigger first part
  useEffect(() => {
    if (
      isGeneratingSequentially &&
      currentPartIndex === 0 &&
      outlineParts.length > 0 &&
      !isLoading &&
      generatedScript.includes('BẮT ĐẦU') &&
      !isStoppingRef.current
    ) {
      generateNextPart();
    }
  }, [isGeneratingSequentially, currentPartIndex, outlineParts.length, isLoading, generatedScript, generateNextPart]);

  const revise = useCallback(async () => {
    if (!generatedScript || !revisionPrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    const params = buildParams(brief, effectiveWordCount(brief));
    try {
      const revised = await reviseScript(generatedScript, revisionPrompt, params, aiProvider, selectedModel);
      setGeneratedScript(revised);
      setRevisionCount((prev) => prev + 1);
      setRevisionPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi sửa kịch bản.');
    } finally {
      setIsLoading(false);
    }
  }, [generatedScript, revisionPrompt, brief, aiProvider, selectedModel]);

  return {
    generatedScript,
    setGeneratedScript,
    isLoading,
    error,
    revisionPrompt,
    setRevisionPrompt,
    revisionCount,
    isGeneratingSequentially,
    currentPartIndex,
    totalParts: outlineParts.length,
    outlineParts,
    autoContinue,
    setAutoContinue,
    generate,
    startSequential,
    stopSequential,
    generateNextPart,
    revise,
    resetAllCaches,
    setExternalError: setError,
  };
}
