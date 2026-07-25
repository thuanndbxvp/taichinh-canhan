import { useCallback, useMemo, useState } from 'react';
import type { ScriptDocument } from '../../domain/ScriptDocument';
import type { ResearchClaim, ResearchSource } from '../../domain/ResearchPack';
import type { Calculation } from '../../domain/Calculator';
import {
  buildReviewReport,
  sortIssues,
  type ReviewReport,
  type ReviewSeverity,
} from '../../domain/review/ReviewReport';

export interface UseReviewGateArgs {
  document: ScriptDocument;
  claims?: ResearchClaim[];
  sources?: ResearchSource[];
  calculations?: Calculation[];
}

export interface UseReviewGateReturn {
  report: ReviewReport | null;
  isRunning: boolean;
  error: string | null;
  run: () => void;
  clear: () => void;
  sortedIssues: ReturnType<typeof sortIssues>;
  /**
   * Filter issues theo severity.
   */
  filterBySeverity: (severity: ReviewSeverity) => ReviewReport['issues'];
  /**
   * Lấy issues cho 1 scene cụ thể.
   */
  issuesForScene: (sceneId: string) => ReviewReport['issues'];
}

export function useReviewGate({
  document,
  claims,
  sources,
  calculations,
}: UseReviewGateArgs): UseReviewGateReturn {
  const [report, setReport] = useState<ReviewReport | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    setIsRunning(true);
    setError(null);
    try {
      const r = buildReviewReport({
        document,
        claims,
        sources,
        calculations,
      });
      setReport(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi chạy review');
    } finally {
      setIsRunning(false);
    }
  }, [document, claims, sources, calculations]);

  const clear = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);

  const sortedIssues = useMemo(() => (report ? sortIssues(report.issues) : []), [report]);

  const filterBySeverity = useCallback(
    (severity: ReviewSeverity) =>
      report ? report.issues.filter((i) => i.severity === severity) : [],
    [report],
  );

  const issuesForScene = useCallback(
    (sceneId: string) =>
      report ? report.issues.filter((i) => i.sceneId === sceneId) : [],
    [report],
  );

  return {
    report,
    isRunning,
    error,
    run,
    clear,
    sortedIssues,
    filterBySeverity,
    issuesForScene,
  };
}