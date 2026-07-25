import { useCallback, useState } from 'react';
import type { AiProvider } from '../../../types';
import { scoreScript } from '../../../services/aiService';

export interface UseReviewWorkflowArgs {
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseReviewWorkflowReturn {
  score: string | null;
  isScoring: boolean;
  error: string | null;
  score2: (script: string) => Promise<void>;
  clear: () => void;
}

export function useReviewWorkflow({ aiProvider, selectedModel }: UseReviewWorkflowArgs): UseReviewWorkflowReturn {
  const [score, setScore] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const score2 = useCallback(
    async (script: string) => {
      if (!script) return;
      setIsScoring(true);
      setError(null);
      try {
        const result = await scoreScript(script, aiProvider, selectedModel);
        setScore(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi chấm điểm.');
      } finally {
        setIsScoring(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const clear = useCallback(() => {
    setScore(null);
    setError(null);
  }, []);

  return { score, isScoring, error, score2, clear };
}
