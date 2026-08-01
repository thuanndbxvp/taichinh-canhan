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
import { performDeepResearch } from '../../services/dataRetrieval';

const PARTS_HEADER = '--- BẮT ĐẦU TẠO KỊCH BẢN CHI TIẾT ---\n\n';

export type RewriteLevel = 1 | 2;

export interface UseGenerationWorkflowArgs {
  brief: ContentBrief;
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseGenerationWorkflowReturn {
  generatedScript: string;
  setGeneratedScript: (s: string) => void;
  macroData: string | null;
  updateScript: (newScript: string) => void;
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
  // Rewrite Mode (MSEW-rewrite-script)
  rewriteError: string | null;
  rewriteLevel: RewriteLevel;
  setRewriteLevel: (level: RewriteLevel) => void;
  rewriteScript: (title: string, originalScript: string, level: RewriteLevel) => Promise<string>;
  // Các field sau được giữ lại cho backward-compat (MSEW-deep-research: Missing Data UI đã gỡ).
  handleResolveMissingData: (strategy: 'search' | 'estimate' | 'simplify') => Promise<void>;
  resolvingStrategy: 'search' | 'estimate' | 'simplify' | null;
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
  const [rewriteError, setRewriteError] = useState<string | null>(null);
  const [rewriteLevel, setRewriteLevel] = useState<RewriteLevel>(1);
  // Stubbed for backward-compat với interface (MSEW-deep-research: Missing Data UI đã gỡ).
  const [resolvingStrategy] = useState<'search' | 'estimate' | 'simplify' | null>(null);
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

  const updateScript = useCallback((newScript: string) => {
    setGeneratedScript(newScript);
    scriptRef.current = newScript;
    // Nếu đang ở giai đoạn Dàn ý, đồng bộ sang fullOutlineText
    // (Bởi vì outlineParts.length === 0 && !isGeneratingSequentially nghĩa là chưa bắt đầu sinh kịch bản)
    if (outlineParts.length === 0 && !isGeneratingSequentially) {
      setFullOutlineText(newScript);
    }
  }, [outlineParts.length, isGeneratingSequentially]);

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

      setCurrentAiAction('Đang khởi động quy trình Deep Research (4 bước)...');
      try {
        const researchSummary = await performDeepResearch(
          brief.title,
          brief.outlineContent,
          aiProvider,
          selectedModel,
          (msg) => setCurrentAiAction(msg),
        );
        setMacroData(researchSummary);
        params.macroContext = researchSummary;
      } catch (e) {
        console.warn('Lỗi khi chạy Deep Research, tiếp tục không có context', e);
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

  const handleResolveMissingData = useCallback(async (_strategy: 'search' | 'estimate' | 'simplify') => {
    // No-op: Missing data UI đã được gỡ bỏ trong MSEW-deep-research.
    // Hàm này được giữ lại như stub để tương thích ngược với callers cũ (nếu có).
    return;
  }, []);

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

  // MSEW-rewrite-script BƯỚC 4: Rewrite Mode — gọi `classifyTopic` để lấy branch,
  // sau đó gọi `reviseScript` (đã có sẵn) với `revisionPrompt` được sinh tự động theo level.
  // Level 1: chỉ sửa văn phong. Level 2: ép thành 5 phần.
  const rewriteScript = useCallback(
    async (title: string, originalScript: string, level: RewriteLevel): Promise<string> => {
      if (!originalScript || !originalScript.trim()) {
        const msg = 'Vui lòng dán kịch bản gốc trước khi tẩy rửa.';
        setRewriteError(msg);
        throw new Error(msg);
      }

      setIsLoading(true);
      setRewriteError(null);
      setCurrentAiAction('Đang nhận diện phong cách kịch bản...');

      try {
        const baseParams = buildParams(brief, effectiveWordCount(brief));

        // classifyTopic để biết branch (analytical/psychology/...) — đảm bảo DNA file đúng.
        try {
          const route = await classifyTopic(title, aiProvider, selectedModel);
          if (baseParams.scriptStyle === 'auto') baseParams.scriptStyle = route.branch;
          if (baseParams.scriptHook === 'auto') baseParams.scriptHook = route.hook;
        } catch (e) {
          console.warn('classifyTopic lỗi, dùng style mặc định hiện tại', e);
        }

        const basePrompt =
          level === 1
            ? 'Giữ nguyên cấu trúc, chỉ sửa văn phong và từ vựng theo DNA.'
            : 'Đập đi gò lại toàn bộ bài viết thành đúng 5 phần tiêu chuẩn của DNA. Giữ luận điểm chính.';

        const forcedStructure =
          level === 2
            ? ' BẮT BUỘC phân bổ lại nội dung thành 5 phần rõ rệt: MỞ ĐẦU (HOOK) -> BỐI CẢNH & VẤN ĐỀ -> GIẢI PHẪU DỮ LIỆU -> GIẢI PHÁP THỰC TẾ -> ĐÚC KẾT & KÊU GỌI.'
            : '';

        const revisionPrompt = basePrompt + forcedStructure;

        setCurrentAiAction(
          level === 1
            ? 'Đang tẩy rửa văn phong theo DNA Chú Que...'
            : 'Đang gò lại 5 phần theo DNA Chú Que...',
        );

        const result = await reviseScript(
          originalScript,
          revisionPrompt,
          baseParams,
          aiProvider,
          selectedModel,
        );

        setRevisionCount((prev) => prev + 1);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi khi tẩy rửa kịch bản.';
        setRewriteError(message);
        throw err;
      } finally {
        setIsLoading(false);
        setCurrentAiAction(null);
      }
    },
    [brief, aiProvider, selectedModel],
  );

  return {
    generatedScript,
    setGeneratedScript,
    macroData,
    updateScript,
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
    rewriteError,
    rewriteLevel,
    setRewriteLevel,
    rewriteScript,
    handleResolveMissingData,
    resolvingStrategy,
  };
}
