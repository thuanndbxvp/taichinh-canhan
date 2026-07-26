import { useCallback, useEffect, useRef, useState } from 'react';
import type { AiProvider, GenerationParams } from '../../../types';
import {
  generateScriptOutline,
  generateScriptPart,
  parseOutlineIntoSegments,
  reviseScript,
  classifyTopic,
} from '../../../services/aiService';
import type { ContentBrief } from '../brief/useContentBrief';
import { AppError } from '../../lib/errors';
import { minutesToTargetWords } from '../../domain/wordCount';
import { fetchMacroData } from '../../services/dataRetrieval';

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
  startSequential: (providedOutline?: string) => void;
  resumeSequential: () => void;
  stopSequential: () => void;
  generateNextPart: () => Promise<void>;
  revise: () => Promise<void>;
  resetAllCaches: () => void;
  setExternalError: (msg: string | null) => void;
  currentAiAction: string | null;
}

function buildParams(brief: ContentBrief, finalWordCount: string): GenerationParams {
  return {
    title: brief.title,
    outlineContent: brief.outlineContent,
    targetAudience: brief.targetAudience,
    styleOptions: brief.styleOptions,
    keywords: brief.keywords,
    wordCount: finalWordCount,
    scriptType: brief.scriptType,
    numberOfSpeakers: brief.numberOfSpeakers,
    isFinanceMode: brief.isFinanceMode,
    scriptStyle: brief.scriptStyle,
    scriptHook: brief.scriptHook,
  };
}

function effectiveWordCount(brief: ContentBrief): string {
  if (brief.lengthType === 'duration') {
    const minutes = Math.max(0, parseInt(brief.videoDuration || '0', 10));
    return minutesToTargetWords(minutes).toString();
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
  const [macroData, setMacroData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [revisionPrompt, setRevisionPrompt] = useState<string>('');
  const [revisionCount, setRevisionCount] = useState<number>(0);
  const [isGeneratingSequentially, setIsGeneratingSequentially] = useState<boolean>(false);
  const [outlineParts, setOutlineParts] = useState<string[]>([]);
  const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
  const [fullOutlineText, setFullOutlineText] = useState<string>('');
  const [autoContinue, setAutoContinue] = useState<boolean>(true);
  const [currentAiAction, setCurrentAiAction] = useState<string | null>(null);
  const isStoppingRef = useRef<boolean>(false);
  // Chặn generateNextPart chạy song song (re-entrancy guard).
  const isGeneratingPartRef = useRef<boolean>(false);
  // Ref mirror của generatedScript để dùng trong callback mà không tạo dependency.
  const scriptRef = useRef<string>('');
  useEffect(() => {
    scriptRef.current = generatedScript;
  }, [generatedScript]);

  const resetAllCaches = useCallback(() => {
    setGeneratedScript('');
    scriptRef.current = '';
    setMacroData(null);
    setRevisionCount(0);
    setIsGeneratingSequentially(false);
    setOutlineParts([]);
    setCurrentPartIndex(0);
    setFullOutlineText('');
    isStoppingRef.current = false;
    isGeneratingPartRef.current = false;
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
    scriptRef.current = '';
    resetAllCaches();

    const params = buildParams(brief, finalWordCount);

    try {
      if (params.scriptStyle === 'auto' || params.scriptHook === 'auto') {
        setCurrentAiAction('Đang phân loại phong cách kịch bản...');
        const route = await classifyTopic(params.title, aiProvider, selectedModel);
        if (params.scriptStyle === 'auto') params.scriptStyle = route.branch;
        if (params.scriptHook === 'auto') params.scriptHook = route.hook;
      }

      setCurrentAiAction('Đang thu thập dữ liệu vĩ mô thực tế...');
      try {
        const fetchedMacro = await fetchMacroData(brief.title, aiProvider, selectedModel);
        setMacroData(fetchedMacro);
        params.macroContext = fetchedMacro;
      } catch (e) {
        console.warn('Lỗi khi fetch dữ liệu vĩ mô, tiếp tục không có context', e);
      }

      setCurrentAiAction('Đang phân tích và lập dàn ý...');
      const outline = await generateScriptOutline(
        params, 
        aiProvider, 
        selectedModel, 
        (chunk) => {
          setGeneratedScript((prev) => {
            const next = prev + chunk;
            scriptRef.current = next;
            return next;
          });
        },
        (phase) => {
          setCurrentAiAction(phase);
        }
      );
      setFullOutlineText(outline);
      if (!outline || !outline.trim()) {
        setError('AI provider trả về dàn ý rỗng. V vui lòng thử lại hoặc đổi model.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
      setCurrentAiAction(null);
    }
  }, [brief, aiProvider, selectedModel, resetAllCaches]);

  // generateNextPart dùng ref cho previousPartsScript & fullOutlineText để
  // không còn phụ thuộc vào `generatedScript` (mỗi chunk sẽ re-create callback,
  // re-fire effect bên dưới, gây chạy song song).
  const generateNextPart = useCallback(async () => {
    if (
      !isGeneratingSequentially ||
      isGeneratingPartRef.current ||
      isStoppingRef.current
    ) {
      return;
    }

    // Snapshot index, parts, autoContinue tại thời điểm bắt đầu. Tránh bị state batch
    // update làm lệch khi effect fire lần thứ 2 trong lúc part trước đang chạy,
    // hoặc user đổi autoContinue giữa chừng.
    const index = currentPartIndex;
    const parts = outlineParts;
    const shouldAutoContinue = autoContinue;
    if (index >= parts.length) {
      setIsGeneratingSequentially(false);
      return;
    }
    const currentOutlinePart = parts[index];

    isGeneratingPartRef.current = true;
    setIsLoading(true);
    const finalWordCount = effectiveWordCount(brief);
    const params = buildParams(brief, finalWordCount);

    try {
      setCurrentAiAction(`Đang viết phần ${index + 1}/${parts.length}...`);
      const baseScript = scriptRef.current;
      const partContent = await generateScriptPart(
        fullOutlineText,
        baseScript,
        currentOutlinePart,
        params,
        aiProvider,
        selectedModel,
        (chunk, fullStream) => {
           setGeneratedScript(() => {
             const next = baseScript + fullStream;
             scriptRef.current = next;
             return next;
           });
        }
      );
      if (isStoppingRef.current) return;

      if (!partContent || !partContent.trim()) {
        throw AppError.from(
          'AI_PROVIDER_FAILED',
          `AI trả về phần ${index + 1} rỗng. Vui lòng thử lại hoặc đổi model.`,
          { action: 'generateNextPart', partIndex: index },
        );
      }

      // Override the final state using baseScript + partContent to avoid duplication
      // and to clean up any garbage from failed stream retries.
      setGeneratedScript(() => {
        const next = baseScript + partContent + '\n\n---\n\n';
        scriptRef.current = next;
        return next;
      });

      const nextIndex = index + 1;
      setCurrentPartIndex(nextIndex);

      if (nextIndex >= parts.length) {
        setIsGeneratingSequentially(false);
      }
    } catch (err) {
      const message = err instanceof AppError ? err.message : err instanceof Error ? err.message : 'Lỗi khi tạo phần tiếp theo.';
      setError(message);
      setIsGeneratingSequentially(false);
    } finally {
      isGeneratingPartRef.current = false;
      setIsLoading(false);
      setCurrentAiAction(null);
    }
  }, [
    isGeneratingSequentially,
    currentPartIndex,
    outlineParts,
    brief,
    aiProvider,
    selectedModel,
    fullOutlineText,
    autoContinue,
  ]);

  const startSequential = useCallback((providedOutline?: string) => {
    const textToParse = typeof providedOutline === 'string' ? providedOutline : generatedScript;
    if (!textToParse) return;
    const parts = parseOutlineIntoSegments(textToParse);
    if (parts.length === 0) {
      setError('Không tìm thấy cấu trúc phần trong dàn ý. Vui lòng thử lại.');
      return;
    }
    isStoppingRef.current = false;
    isGeneratingPartRef.current = false;
    setOutlineParts(parts);
    setCurrentPartIndex(0);
    setIsGeneratingSequentially(true);
    const next = PARTS_HEADER;
    setGeneratedScript(next);
    scriptRef.current = next;
  }, [generatedScript]);

  const stopSequential = useCallback(() => {
    isStoppingRef.current = true;
    isGeneratingPartRef.current = false;
    setIsLoading(false);
    setIsGeneratingSequentially(false);
  }, []);

  const resumeSequential = useCallback(() => {
    isStoppingRef.current = false;
    isGeneratingPartRef.current = false;
    setIsGeneratingSequentially(true);
  }, []);

  // Trigger sequential parts automatically if autoContinue is on.
  useEffect(() => {
    if (
      isGeneratingSequentially &&
      currentPartIndex < outlineParts.length &&
      !isGeneratingPartRef.current &&
      !isStoppingRef.current
    ) {
      // Only auto-continue for index > 0 if autoContinue is true
      if (currentPartIndex === 0 || autoContinue) {
        generateNextPart();
      }
    }
  }, [isGeneratingSequentially, currentPartIndex, outlineParts.length, generateNextPart, autoContinue]);

  const revise = useCallback(async () => {
    if (!generatedScript || !revisionPrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setCurrentAiAction('Đang chỉnh sửa kịch bản theo yêu cầu...');
    const params = buildParams(brief, effectiveWordCount(brief));

    // Backup trước khi clear: nếu request fail, restore để user không mất kịch bản gốc.
    const backupScript = generatedScript;
    setGeneratedScript('');
    scriptRef.current = '';

    try {
      await reviseScript(backupScript, revisionPrompt, params, aiProvider, selectedModel, (chunk) => {
         setGeneratedScript((prev) => {
           const next = prev + chunk;
           scriptRef.current = next;
           return next;
         });
      });
      setRevisionCount((prev) => prev + 1);
      setRevisionPrompt('');
    } catch (err) {
      setGeneratedScript(backupScript);
      scriptRef.current = backupScript;
      setError(err instanceof Error ? err.message : 'Lỗi khi sửa kịch bản.');
    } finally {
      setIsLoading(false);
      setCurrentAiAction(null);
    }
  }, [generatedScript, revisionPrompt, brief, aiProvider, selectedModel]);

  return {
    generatedScript,
    setGeneratedScript,
    macroData,
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
    resumeSequential,
    stopSequential,
    generateNextPart,
    revise,
    resetAllCaches,
    setExternalError: setError,
    currentAiAction,
  };
}
