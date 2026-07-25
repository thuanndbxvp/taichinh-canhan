import { describe, it, expect } from 'vitest';
import { runRetentionReview } from './RetentionReview';
import { createScriptDocument } from '../ScriptDocument';
import type { Scene } from '../Scene';
import { createBlankScene } from '../Scene';

function mkScript(scenes: Scene[]): ReturnType<typeof createScriptDocument> {
  return createScriptDocument({
    title: 'T',
    outlineContent: '',
    script: '',
    scenes,
  });
}

describe('RetentionReview', () => {
  it('hook xuất hiện sớm (≤30s) → hasHookEarly', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'hook'), narration: 'Bạn có biết lãi kép là gì không?' },
      { ...createBlankScene(1, 'context'), narration: 'Lãi kép rất quan trọng.' },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.hasHookEarly).toBe(true);
  });

  it('không có hook scene → issue', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'context'), narration: 'Lãi kép là gì.' },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.issues.some((i) => i.issueId.includes('no-hook'))).toBe(true);
  });

  it('hook xuất hiện sau 30s → hook-late', () => {
    // Tạo 1 scene dài trước hook.
    const longNarration = 'word '.repeat(120).trim(); // 120 words / 2.5 = 48s
    const doc = mkScript([
      { ...createBlankScene(0, 'context'), narration: longNarration },
      { ...createBlankScene(1, 'hook'), narration: 'Hook xuất hiện sau.' },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.hasHookEarly).toBe(false);
    expect(r.issues.some((i) => i.issueId.includes('hook-late'))).toBe(true);
  });

  it('có micro-storytelling', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'context'), narration: 'Năm đó tôi đã đầu tư sai cách.' },
      { ...createBlankScene(1, 'analysis'), narration: 'Phân tích vấn đề.' },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.hasStorytelling).toBe(true);
  });

  it('không có analysis → issue', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'context'), narration: 'Chỉ có context thôi.' },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.issues.some((i) => i.issueId.includes('no-analysis'))).toBe(true);
  });

  it('takeaway mirror hook → hasPayoff', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'hook'),
        narration: 'Bạn có biết lãi kép sẽ thay đổi cuộc đời bạn?',
      },
      {
        ...createBlankScene(1, 'takeaway'),
        narration: 'Lãi kép thay đổi cuộc đời thật.',
      },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.hasPayoff).toBe(true);
  });

  it('CTA cụ thể', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'cta'),
        narration: 'Đăng ký kênh để xem thêm video nhé.',
      },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.hasCta).toBe(true);
  });

  it('CTA vague → issue', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'cta'),
        narration: 'Cảm ơn các bạn đã xem.',
      },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.issues.some((i) => i.issueId.includes('cta-vague'))).toBe(true);
  });

  it('ít transitions với nhiều scene → issue', () => {
    const scenes = Array.from({ length: 5 }, (_, i) => ({
      ...createBlankScene(i, 'context' as const),
      narration: `Scene ${i} nội dung.`,
    }));
    const doc = mkScript(scenes);
    const r = runRetentionReview({ document: doc });
    expect(r.issues.some((i) => i.issueId.includes('few-transitions'))).toBe(true);
  });

  it('score cao với script đầy đủ', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'hook'), narration: 'Bạn có biết lãi kép thay đổi cuộc đời không?' },
      { ...createBlankScene(1, 'context'), narration: 'Năm đó tôi không biết đến lãi kép. Tiếp theo hãy xem.' },
      { ...createBlankScene(2, 'analysis'), narration: 'Phân tích lãi kép trong 10 năm.' },
      { ...createBlankScene(3, 'takeaway'), narration: 'Lãi kép thay đổi cuộc đời thật sự.' },
      { ...createBlankScene(4, 'cta'), narration: 'Đăng ký kênh để xem tiếp.' },
    ]);
    const r = runRetentionReview({ document: doc });
    expect(r.score).toBeGreaterThanOrEqual(85);
  });
});