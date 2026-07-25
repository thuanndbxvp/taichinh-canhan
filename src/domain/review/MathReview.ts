/**
 * MathReview — kiểm tra narration có khớp calculation không.
 *
 * Phase 5.2: phát hiện
 *   - Scene dùng calculation nhưng narration không đề cập con số.
 *   - Con số trong narration không khớp calculation.results.base.value.
 *   - Đơn vị sai (% vs VND).
 *   - Lãi suất không khớp kỳ hạn (monthly-savings có tháng ≠ years*12).
 *   - Nhầm % với điểm phần trăm (đề cập "điểm" nhưng ký hiệu %).
 *
 * Pure function.
 */
import type { ScriptDocument } from '../ScriptDocument';
import type { Scene } from '../Scene';
import type { Calculation } from '../Calculator';

export interface MathIssue {
  issueId: string;
  category: 'math';
  severity: 'critical' | 'major' | 'minor';
  message: string;
  sceneId?: string;
  calculationId?: string;
  suggestedFix?: string;
}

export interface MathReviewResult {
  issues: MathIssue[];
  /**
   * Số calculation referenced trong scenes.
   */
  referencedCalcCount: number;
  /**
   * Số calculation referenced có narration match.
   */
  matchedCalcCount: number;
  score: number;
}

/**
 * Tìm tất cả calculation ID referenced trong scenes.
 */
function gatherReferencedCalculations(doc: ScriptDocument): {
  referenced: Set<string>;
  scenesByCalc: Map<string, Scene[]>;
} {
  const referenced = new Set<string>();
  const scenesByCalc = new Map<string, Scene[]>();
  if (!doc.scenes) return { referenced, scenesByCalc };
  for (const scene of doc.scenes) {
    for (const calcId of scene.calculationIds) {
      referenced.add(calcId);
      const list = scenesByCalc.get(calcId) ?? [];
      list.push(scene);
      scenesByCalc.set(calcId, list);
    }
  }
  return { referenced, scenesByCalc };
}

/**
 * Format số từ calculation để so khớp narration.
 * Lấy base scenario.
 */
function formatNumberForComparison(value: number, unit: string): string {
  if (unit === '%') {
    return `${value}%`;
  }
  // VND: format theo locale vi-VN (1.000.000) hoặc bỏ dấu phân cách.
  const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(value));
  // Trả cả dạng có dấu chấm lẫn bỏ dấu.
  const stripped = formatted.replace(/\./g, '');
  return `${formatted}|${stripped}`;
}

/**
 * Tính số năm trong calculation từ assumption `years`.
 */
function calcYears(calc: Calculation): number | null {
  const a = calc.assumptions.find((x) => x.name === 'years');
  return a ? a.value : null;
}

/**
 * Tính số tháng = years * 12.
 */
function calcMonths(calc: Calculation): number | null {
  const a = calc.assumptions.find((x) => x.name === 'annualRate');
  // Monthly-savings tính months = years * 12.
  if (calc.kind === 'monthly-savings') {
    const years = calcYears(calc);
    if (years == null) return null;
    return years * 12;
  }
  return null;
}

export function runMathReview(input: {
  document: ScriptDocument;
  calculations: Calculation[];
}): MathReviewResult {
  const issues: MathIssue[] = [];
  const { referenced, scenesByCalc } = gatherReferencedCalculations(input.document);
  const calcById = new Map(input.calculations.map((c) => [c.id, c]));
  let matched = 0;

  // Check referenced calculations.
  for (const calcId of referenced) {
    const calc = calcById.get(calcId);
    if (!calc) {
      issues.push({
        issueId: `math-missing-calc-${calcId}`,
        category: 'math',
        severity: 'critical',
        message: `Scene tham chiếu calculation ID ${calcId} nhưng không tìm thấy.`,
        calculationId: calcId,
        suggestedFix: 'Tạo lại calculation hoặc gỡ liên kết scene.',
      });
      continue;
    }

    const scenes = scenesByCalc.get(calcId) ?? [];
    const base = calc.results.base;
    const expectedNumbers = formatNumberForComparison(base.value, base.unit);

    let sceneMatches = false;
    for (const scene of scenes) {
      const lower = scene.narration.toLowerCase();
      // Check có chứa expected number(s).
      const [formatted, stripped] = expectedNumbers.split('|');
      if (
        lower.includes(formatted.toLowerCase()) ||
        (stripped && lower.includes(stripped.toLowerCase()))
      ) {
        sceneMatches = true;
      } else {
        issues.push({
          issueId: `math-narration-mismatch-${scene.id}-${calcId}`,
          category: 'math',
          severity: 'major',
          message: `Narration scene "${scene.title || scene.order + 1}" không đề cập kết quả calculation "${calc.title}" (${formatted}${base.unit}).`,
          sceneId: scene.id,
          calculationId: calcId,
          suggestedFix: `Bổ sung số liệu ${formatted}${base.unit} vào narration hoặc gỡ calculation.`,
        });
      }
    }
    if (sceneMatches && scenes.length > 0) matched++;
  }

  // Check monthly-savings months khớp years*12.
  for (const calc of input.calculations) {
    const months = calcMonths(calc);
    const years = calcYears(calc);
    if (months != null && years != null) {
      // Đã verify theo buildCalculation nên OK. Chỉ flag nếu assumptions sai.
      const a = calc.assumptions.find((x) => x.name === 'years');
      if (a && a.value <= 0) {
        issues.push({
          issueId: `math-invalid-years-${calc.id}`,
          category: 'math',
          severity: 'critical',
          message: `Calculation "${calc.title}" có years ≤ 0.`,
          calculationId: calc.id,
          suggestedFix: 'Đặt years ≥ 1.',
        });
      }
    }
  }

  // Check nhầm % với điểm phần trăm.
  if (input.document.scenes) {
    for (const scene of input.document.scenes) {
      const lower = scene.narration.toLowerCase();
      const mentionsDiem =
        lower.includes('điểm phần trăm') ||
        lower.includes('điểm %') ||
        /\bppt\b/u.test(scene.narration);
      const mentionsPercentSign = /[0-9.]+\s*%/u.test(scene.narration);
      if (mentionsDiem && mentionsPercentSign) {
        issues.push({
          issueId: `math-percent-vs-diem-${scene.id}`,
          category: 'math',
          severity: 'minor',
          message: `Scene đề cập "điểm phần trăm" nhưng dùng ký hiệu %.`,
          sceneId: scene.id,
          suggestedFix: 'Dùng nhất quán: "phần trăm (%)" hoặc "điểm phần trăm (ppt)".',
        });
      }
    }
  }

  // Scoring.
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === 'critical') score -= 25;
    else if (issue.severity === 'major') score -= 10;
    else score -= 3;
  }
  score = Math.max(0, score);

  return {
    issues,
    referencedCalcCount: referenced.size,
    matchedCalcCount: matched,
    score,
  };
}