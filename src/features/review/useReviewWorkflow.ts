import { useCallback, useState } from 'react';
import type { AiProvider } from '../../../types';
import { scoreScript, scoreOutline, reviseScriptPartial, type ScoreResult, type ScriptReplacement } from '../../../services/aiService';

export interface UseReviewWorkflowArgs {
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseReviewWorkflowReturn {
  score: ScoreResult | null;
  isScoring: boolean;
  error: string | null;
  rawStream: string;
  score2: (script: string) => Promise<void>;
  scoreOutline2: (script: string) => Promise<void>;
  revise2: (script: string, revisionPrompt: string) => Promise<ScriptReplacement[]>;
  isRevising: boolean;
  clear: () => void;
}

export function useReviewWorkflow({ aiProvider, selectedModel }: UseReviewWorkflowArgs): UseReviewWorkflowReturn {
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [isScoring, setIsScoring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rawStream, setRawStream] = useState<string>('');

  const score2 = useCallback(
    async (script: string) => {
      if (!script) return;
      setIsScoring(true);
      setError(null);
      setRawStream('');
      try {
        const result = await scoreScript(script, aiProvider, selectedModel, (chunk, full) => {
          setRawStream(full);
        });
        setScore(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi chấm điểm.');
      } finally {
        setIsScoring(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const scoreOutline2 = useCallback(
    async (script: string) => {
      if (!script) return;
      setIsScoring(true);
      setError(null);
      setRawStream('');
      try {
        const result = await scoreOutline(script, aiProvider, selectedModel, (chunk, full) => {
          setRawStream(full);
        });
        setScore(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi chấm điểm.');
      } finally {
        setIsScoring(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const [isRevising, setIsRevising] = useState<boolean>(false);

  const revise2 = useCallback(
    async (script: string, revisionPrompt: string) => {
      if (!script || !revisionPrompt) return [];
      setIsRevising(true);
      setError(null);
      setRawStream('');
      try {
        const result = await reviseScriptPartial(script, revisionPrompt, aiProvider, selectedModel, (chunk, full) => {
          setRawStream(full);
        });
        return result.replacements;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi sửa kịch bản.');
        return [];
      } finally {
        setIsRevising(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const clear = useCallback(() => {
    setScore(null);
    setError(null);
    setRawStream('');
  }, []);

  return { score, isScoring, isRevising, error, rawStream, score2, scoreOutline2, revise2, clear };
}
