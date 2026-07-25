import { describe, it, expect } from 'vitest';
import { runMathReview } from './MathReview';
import { createScriptDocument } from '../ScriptDocument';
import type { Scene } from '../Scene';
import { createBlankScene } from '../Scene';
import { buildCalculation } from '../Calculator';

function mkScene(over: Partial<Scene> = {}): Scene {
  return {
    ...createBlankScene(0, 'analysis'),
    title: 'Scene 1',
    narration: '',
    ...over,
  };
}

describe('MathReview', () => {
  it('scene có calculationId nhưng calc không tồn tại → critical', () => {
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '',
      scenes: [mkScene({ calculationIds: ['missing'] })],
    });
    const r = runMathReview({ document: doc, calculations: [] });
    const issue = r.issues.find((i) => i.issueId.includes('missing-calc'));
    expect(issue?.severity).toBe('critical');
  });

  it('narration match calculation base.value → không có issue', () => {
    const calc = buildCalculation('compound-interest', 'Lãi kép', {
      principal: 100_000_000,
      annualRate: 8,
      years: 10,
    });
    // buildCalculation cho compound 100tr@8%/10y ~ 222tr.
    const formatted = new Intl.NumberFormat('vi-VN').format(calc.results.base.value);
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '',
      scenes: [
        mkScene({
          calculationIds: [calc.id],
          narration: `Sau 10 năm bạn có khoảng ${formatted} VND.`,
        }),
      ],
    });
    const r = runMathReview({ document: doc, calculations: [calc] });
    expect(r.issues.some((i) => i.issueId.includes('narration-mismatch'))).toBe(false);
    expect(r.matchedCalcCount).toBe(1);
  });

  it('narration không nhắc số → mismatch issue', () => {
    const calc = buildCalculation('compound-interest', 'Lãi kép', {
      principal: 100_000_000,
      annualRate: 8,
      years: 10,
    });
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '',
      scenes: [
        mkScene({
          calculationIds: [calc.id],
          narration: 'Lãi kép rất tốt, hãy tìm hiểu nhé.',
        }),
      ],
    });
    const r = runMathReview({ document: doc, calculations: [calc] });
    const issue = r.issues.find((i) => i.issueId.includes('narration-mismatch'));
    expect(issue?.severity).toBe('major');
  });

  it('monthly-savings với years ≤ 0 → critical', () => {
    const calc = buildCalculation('monthly-savings', 'Tiết kiệm', {
      monthly: 500_000,
      annualRate: 8,
      years: 0,
    });
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '',
      scenes: [mkScene({ calculationIds: [calc.id] })],
    });
    const r = runMathReview({ document: doc, calculations: [calc] });
    expect(r.issues.some((i) => i.issueId.includes('invalid-years'))).toBe(true);
  });

  it('đề cập "điểm phần trăm" + ký hiệu % → minor', () => {
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '',
      scenes: [mkScene({ narration: 'Tăng 5 điểm phần trăm (5%) so với năm ngoái.' })],
    });
    const r = runMathReview({ document: doc, calculations: [] });
    expect(r.issues.some((i) => i.issueId.includes('percent-vs-diem'))).toBe(true);
  });

  it('referencedCalcCount và matchedCalcCount', () => {
    const c1 = buildCalculation('compound-interest', 'A', {
      principal: 1_000_000,
      annualRate: 5,
      years: 5,
    });
    const c2 = buildCalculation('simple-interest', 'B', {
      principal: 1_000_000,
      annualRate: 5,
      years: 5,
    });
    const formatted1 = new Intl.NumberFormat('vi-VN').format(c1.results.base.value);
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '',
      scenes: [
        mkScene({
          id: 's1',
          calculationIds: [c1.id, c2.id],
          narration: `Số tiền là ${formatted1}`,
        }),
      ],
    });
    const r = runMathReview({ document: doc, calculations: [c1, c2] });
    expect(r.referencedCalcCount).toBe(2);
    // Cả 2 đều match vì c1 có narration chứa số base.
    expect(r.matchedCalcCount).toBeGreaterThanOrEqual(1);
  });

  it('score 100 khi không có issue', () => {
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '',
      scenes: [],
    });
    const r = runMathReview({ document: doc, calculations: [] });
    expect(r.score).toBe(100);
  });
});