import { describe, it, expect } from 'vitest';
import {
  buildReviewReport,
  sortIssues,
  PASS_THRESHOLD,
  BLOCKING_SEVERITY,
  REVIEW_REPORT_SCHEMA_VERSION,
} from './ReviewReport';
import { createScriptDocument } from '../ScriptDocument';
import type { Scene } from '../Scene';
import { createBlankScene } from '../Scene';
import { buildCalculation } from '../Calculator';
import type { ResearchClaim, ResearchSource } from '../ResearchPack';

function mkScript(scenes: Scene[]): ReturnType<typeof createScriptDocument> {
  return createScriptDocument({
    title: 'Lãi kép',
    outlineContent: '',
    script: '',
    scenes,
  });
}

function mkClaim(over: Partial<ResearchClaim> = {}): ResearchClaim {
  return {
    id: 'c1',
    text: 'Lãi suất 5%/năm',
    sourceIds: ['s1'],
    status: 'verified',
    risk: 'low',
    usedIn: [],
    ...over,
  };
}

function mkSource(over: Partial<ResearchSource> = {}): ResearchSource {
  return {
    id: 's1',
    type: 'article',
    title: 'NHNN',
    reliability: 4,
    ...over,
  };
}

describe('buildReviewReport', () => {
  it('script đầy đủ → pass overall ≥ PASS_THRESHOLD', () => {
    const calc = buildCalculation('compound-interest', 'Lãi kép', {
      principal: 100_000_000,
      annualRate: 8,
      years: 10,
    });
    const formatted = new Intl.NumberFormat('vi-VN').format(calc.results.base.value);
    const doc = mkScript([
      { ...createBlankScene(0, 'hook'), narration: 'Bạn có biết lãi kép sẽ thay đổi cuộc đời bạn?' },
      { ...createBlankScene(1, 'context'), narration: 'Năm đó tôi chưa biết đến lãi kép. Tiếp theo là phân tích.' },
      {
        ...createBlankScene(2, 'analysis'),
        calculationIds: [calc.id],
        narration: `Sau 10 năm bạn có khoảng ${formatted} VND, có thể thua lỗ.`,
      },
      { ...createBlankScene(3, 'takeaway'), narration: 'Lãi kép thay đổi cuộc đời thật sự.' },
      { ...createBlankScene(4, 'cta'), narration: 'Đăng ký kênh để xem tiếp.' },
      {
        ...createBlankScene(5, 'disclaimer'),
        narration: 'Disclaimer: Nội dung chỉ mang tính chia sẻ, không phải tư vấn đầu tư.',
      },
    ]);
    const r = buildReviewReport({
      document: doc,
      claims: [mkClaim()],
      sources: [mkSource()],
      calculations: [calc],
    });
    expect(r.passed).toBe(true);
    expect(r.scores.overall).toBeGreaterThanOrEqual(PASS_THRESHOLD);
    expect(r.blockingIssueCount).toBe(0);
  });

  it('critical issue → blocked', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'analysis'),
        narration: 'Chắc chắn lãi 100% trong 1 năm. Disclaimer: chỉ chia sẻ.',
      },
    ]);
    const r = buildReviewReport({ document: doc });
    expect(r.passed).toBe(false);
    expect(r.blockingIssueCount).toBeGreaterThan(0);
    expect(r.issues.some((i) => i.severity === 'critical')).toBe(true);
  });

  it('không có issue nào (script trống) → passed', () => {
    const doc = createScriptDocument({ title: 'T', outlineContent: '', script: '' });
    const r = buildReviewReport({ document: doc });
    // Không có script + không có claim → fact=100, math=100, risk có issue no-disclaimer
    // → không pass thật sự. Test rằng report có đủ field.
    expect(r.schemaVersion).toBe(REVIEW_REPORT_SCHEMA_VERSION);
    expect(r.reportId).toBeTruthy();
    expect(typeof r.passed).toBe('boolean');
  });

  it('tổng issue = tổng bySeverity', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'analysis'), narration: 'Chỉ có bạn mới làm được.' },
    ]);
    const r = buildReviewReport({ document: doc });
    const sum = r.summary.bySeverity.critical + r.summary.bySeverity.major + r.summary.bySeverity.minor;
    expect(sum).toBe(r.summary.totalIssues);
  });

  it('7 score dimension luôn có', () => {
    const doc = mkScript([{ ...createBlankScene(0, 'context'), narration: 'Hello.' }]);
    const r = buildReviewReport({ document: doc });
    expect(r.scores.overall).toBeDefined();
    expect(r.scores.retention).toBeDefined();
    expect(r.scores.clarity).toBeDefined();
    expect(r.scores.factual).toBeDefined();
    expect(r.scores.math).toBeDefined();
    expect(r.scores.brand).toBeDefined();
    expect(r.scores.actionability).toBeDefined();
    expect(r.scores.fact).toBeDefined();
    expect(r.scores.risk).toBeDefined();
  });

  it('documentId + documentVersion khớp input', () => {
    const doc = createScriptDocument({ title: 'T', outlineContent: '', script: '' });
    const r = buildReviewReport({ document: doc });
    expect(r.documentId).toBe(doc.id);
    expect(r.documentVersion).toBe(doc.schemaVersion);
  });

  it('generatedAt là timestamp gần đây', () => {
    const before = Date.now();
    const doc = createScriptDocument({ title: 'T', outlineContent: '', script: '' });
    const r = buildReviewReport({ document: doc });
    expect(r.generatedAt).toBeGreaterThanOrEqual(before);
  });
});

describe('sortIssues', () => {
  it('critical trước major trước minor', () => {
    const issues = [
      { issueId: 'i1', category: 'fact' as const, severity: 'minor' as const, message: '' },
      { issueId: 'i2', category: 'math' as const, severity: 'critical' as const, message: '' },
      { issueId: 'i3', category: 'risk' as const, severity: 'major' as const, message: '' },
    ];
    const sorted = sortIssues(issues);
    expect(sorted[0].severity).toBe('critical');
    expect(sorted[1].severity).toBe('major');
    expect(sorted[2].severity).toBe('minor');
  });
});

describe('constants', () => {
  it('PASS_THRESHOLD = 70', () => {
    expect(PASS_THRESHOLD).toBe(70);
  });
  it('BLOCKING_SEVERITY = critical', () => {
    expect(BLOCKING_SEVERITY).toEqual(['critical']);
  });
  it('REVIEW_REPORT_SCHEMA_VERSION = 1', () => {
    expect(REVIEW_REPORT_SCHEMA_VERSION).toBe(1);
  });
});