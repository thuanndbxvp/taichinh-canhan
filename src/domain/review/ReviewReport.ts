/**
 * ReviewReport — JSON structured output gộp 4 review engines.
 *
 * Phase 5.5 (plan1.md):
 *   - 7 dimension: overall, retention, clarity, factual, math, brand, actionability.
 *   - Issues có category, severity, message, sectionId, claimId/calculationId, suggestedFix.
 *   - Blocking issues: critical severity hoặc score < threshold.
 *
 * Score aggregation:
 *   - overall = weighted average(fact 0.2, math 0.25, risk 0.2, retention 0.15, clarity 0.1, brand 0.05, actionability 0.05).
 *   - clarity: derived từ fact+math (no narrative-mismatch).
 *   - brand: stub cho Phase 6 (Chú Que Tài Chính persona).
 *   - actionability: derived từ CTA + scenario có trong Calculator.
 */
import type { ScriptDocument } from '../ScriptDocument';
import type { Calculation } from '../Calculator';
import type { ResearchClaim, ResearchSource } from '../ResearchPack';
import { runFactReview, type FactReviewResult, type FactIssue } from './FactReview';
import { runMathReview, type MathReviewResult, type MathIssue } from './MathReview';
import { runFinancialRiskReview, type RiskReviewResult, type RiskIssue } from './RiskReview';
import { runRetentionReview, type RetentionReviewResult, type RetentionIssue } from './RetentionReview';

export const REVIEW_REPORT_SCHEMA_VERSION = 1;

export type ReviewCategory =
  | 'fact'
  | 'math'
  | 'risk'
  | 'retention'
  | 'clarity'
  | 'brand'
  | 'actionability';

export type ReviewSeverity = 'critical' | 'major' | 'minor';

export interface ReviewIssue {
  issueId: string;
  category: ReviewCategory;
  severity: ReviewSeverity;
  message: string;
  sceneId?: string;
  claimId?: string;
  calculationId?: string;
  sourceId?: string;
  suggestedFix?: string;
}

export interface ReviewScores {
  overall: number;
  retention: number;
  clarity: number;
  factual: number;
  math: number;
  brand: number;
  actionability: number;
  fact: number;
  risk: number;
}

export interface ReviewReport {
  schemaVersion: number;
  reportId: string;
  documentId: string;
  documentVersion: number;
  generatedAt: number;
  scores: ReviewScores;
  issues: ReviewIssue[];
  blockingIssueCount: number;
  passed: boolean;
  summary: {
    totalIssues: number;
    bySeverity: Record<ReviewSeverity, number>;
    byCategory: Record<ReviewCategory, number>;
  };
  engine: {
    fact: FactReviewResult;
    math: MathReviewResult;
    risk: RiskReviewResult;
    retention: RetentionReviewResult;
  };
}

export const PASS_THRESHOLD = 70;
export const BLOCKING_SEVERITY: ReviewSeverity[] = ['critical'];

export function newReportId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `rpt-${crypto.randomUUID()}`;
  }
  return `rpt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tính brand score stub: kiểm tra có mention brand "Chú Que Tài Chính"
 * hoặc persona keywords ("Chú", "Que", "tài chính").
 */
function brandScore(input: { document: ScriptDocument }): number {
  const text = (input.document.scenes ?? [])
    .map((s) => `${s.title}\n${s.narration}`)
    .join('\n');
  const lower = text.toLowerCase();
  const indicators = ['chú que', 'tài chính cá nhân', 'tài chính gia đình'];
  let score = 60; // base
  if (indicators.some((i) => lower.includes(i))) score += 30;
  if (lower.includes('chú ')) score += 10;
  return Math.min(100, score);
}

/**
 * Actionability: có CTA + có ít nhất 1 calculation có scenario thì cao.
 */
function actionabilityScore(input: { document: ScriptDocument }): number {
  const scenes = input.document.scenes ?? [];
  const hasCta = scenes.some((s) => s.kind === 'cta');
  const hasSolution = scenes.some((s) => s.kind === 'solution');
  const hasCalc = scenes.some((s) => s.calculationIds.length > 0);
  let score = 40;
  if (hasCta) score += 25;
  if (hasSolution) score += 20;
  if (hasCalc) score += 15;
  return Math.min(100, score);
}

function clarityScore(fact: FactReviewResult, math: MathReviewResult): number {
  // Clarity = 100 - deduction từ fact/math mismatch.
  let score = 100;
  for (const issue of [...fact.issues, ...math.issues]) {
    if (issue.severity === 'critical') score -= 10;
    else if (issue.severity === 'major') score -= 5;
    else score -= 2;
  }
  return Math.max(0, score);
}

export interface BuildReportInput {
  document: ScriptDocument;
  claims?: ResearchClaim[];
  sources?: ResearchSource[];
  calculations?: Calculation[];
  now?: number;
}

export function buildReviewReport(input: BuildReportInput): ReviewReport {
  const claims = input.claims ?? [];
  const sources = input.sources ?? [];
  const calculations = input.calculations ?? [];

  const fact = runFactReview({ claims, sources, now: input.now });
  const math = runMathReview({ document: input.document, calculations });
  const risk = runFinancialRiskReview({ document: input.document });
  const retention = runRetentionReview({ document: input.document });

  const brand = brandScore({ document: input.document });
  const actionability = actionabilityScore({ document: input.document });
  const clarity = clarityScore(fact, math);

  // Weighted overall.
  const overall = Math.round(
    fact.score * 0.2 +
      math.score * 0.25 +
      risk.score * 0.2 +
      retention.score * 0.15 +
      clarity * 0.1 +
      brand * 0.05 +
      actionability * 0.05,
  );

  // Merge issues.
  const allIssues: ReviewIssue[] = [
    ...(fact.issues as FactIssue[]).map((i) => ({
      ...i,
      category: 'fact' as ReviewCategory,
    })),
    ...(math.issues as MathIssue[]).map((i) => ({
      ...i,
      category: 'math' as ReviewCategory,
    })),
    ...(risk.issues as RiskIssue[]).map((i) => ({
      ...i,
      category: 'risk' as ReviewCategory,
    })),
    ...(retention.issues as RetentionIssue[]).map((i) => ({
      ...i,
      category: 'retention' as ReviewCategory,
    })),
  ];

  // Add a brand issue nếu score < 50.
  if (brand < 50) {
    allIssues.push({
      issueId: 'brand-low',
      category: 'brand',
      severity: 'minor',
      message: 'Script ít đề cập brand "Chú Que Tài Chính".',
      suggestedFix: 'Thêm mention persona ở hook hoặc takeaway.',
    });
  }
  if (actionability < 50) {
    allIssues.push({
      issueId: 'actionability-low',
      category: 'actionability',
      severity: 'minor',
      message: 'Script thiếu giải pháp/CTA cụ thể.',
      suggestedFix: 'Thêm scene solution và cta.',
    });
  }

  // Severity / category counts.
  const bySeverity: Record<ReviewSeverity, number> = { critical: 0, major: 0, minor: 0 };
  const byCategory: Record<ReviewCategory, number> = {
    fact: 0,
    math: 0,
    risk: 0,
    retention: 0,
    clarity: 0,
    brand: 0,
    actionability: 0,
  };
  let blockingCount = 0;
  for (const issue of allIssues) {
    bySeverity[issue.severity]++;
    byCategory[issue.category]++;
    if (BLOCKING_SEVERITY.includes(issue.severity)) blockingCount++;
  }

  const passed = blockingCount === 0 && overall >= PASS_THRESHOLD;

  return {
    schemaVersion: REVIEW_REPORT_SCHEMA_VERSION,
    reportId: newReportId(),
    documentId: input.document.id,
    documentVersion: input.document.schemaVersion,
    generatedAt: Date.now(),
    scores: {
      overall,
      retention: retention.score,
      clarity,
      factual: fact.score,
      math: math.score,
      brand,
      actionability,
      fact: fact.score,
      risk: risk.score,
    },
    issues: allIssues,
    blockingIssueCount: blockingCount,
    passed,
    summary: {
      totalIssues: allIssues.length,
      bySeverity,
      byCategory,
    },
    engine: {
      fact,
      math,
      risk,
      retention,
    },
  };
}

/**
 * Sort issues: critical → major → minor, rồi theo category.
 */
export function sortIssues(issues: ReviewIssue[]): ReviewIssue[] {
  const order: Record<ReviewSeverity, number> = { critical: 0, major: 1, minor: 2 };
  return [...issues].sort((a, b) => {
    const sev = order[a.severity] - order[b.severity];
    if (sev !== 0) return sev;
    return a.category.localeCompare(b.category);
  });
}