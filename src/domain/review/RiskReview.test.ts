import { describe, it, expect } from 'vitest';
import { runFinancialRiskReview } from './RiskReview';
import { createScriptDocument } from '../ScriptDocument';
import type { Scene } from '../Scene';
import { createBlankScene } from '../Scene';

function mkScript(scenes: Scene[]): ReturnType<typeof createScriptDocument> {
  return createScriptDocument({
    title: 'Tài chính cá nhân',
    outlineContent: '',
    script: scenes.map((s) => s.narration).join('\n'),
    scenes,
  });
}

describe('RiskReview', () => {
  it('cam kết lợi nhuận → critical', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'analysis'), narration: 'Chắc chắn lãi 100% trong 1 năm.' },
    ]);
    const r = runFinancialRiskReview({ document: doc });
    expect(r.issues.some((i) => i.message.includes('cam kết lợi nhuận'))).toBe(true);
  });

  it('xúi giục mua ngay → major', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'analysis'), narration: 'Mua ngay cổ phiếu này, đừng chần chừ.' },
    ]);
    const r = runFinancialRiskReview({ document: doc });
    expect(r.issues.some((i) => i.message.includes('xúi giục'))).toBe(true);
  });

  it('thiếu disclaimer → major', () => {
    const doc = mkScript([
      { ...createBlankScene(0, 'analysis'), narration: 'Một số thông tin hữu ích.' },
    ]);
    const r = runFinancialRiskReview({ document: doc });
    expect(r.issues.some((i) => i.issueId.includes('no-disclaimer'))).toBe(true);
    expect(r.hasDisclaimer).toBe(false);
  });

  it('có disclaimer + có rủi ro → pass', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'analysis'),
        narration: 'Số liệu 5%/năm, có rủi ro mất vốn. Disclaimer: chỉ mang tính chia sẻ.',
      },
    ]);
    const r = runFinancialRiskReview({ document: doc });
    expect(r.hasDisclaimer).toBe(true);
    expect(r.hasRiskWarning).toBe(true);
    expect(r.issues.some((i) => i.issueId.includes('no-disclaimer'))).toBe(false);
  });

  it('có số liệu nhưng không nhắc rủi ro → issue', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'analysis'),
        narration: 'Bạn có thể đạt 8%/năm. Disclaimer: chỉ chia sẻ.',
      },
    ]);
    const r = runFinancialRiskReview({ document: doc });
    expect(r.issues.some((i) => i.issueId.includes('no-warning'))).toBe(true);
  });

  it('cá nhân hoá quá mạnh → minor', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'analysis'),
        narration: 'Chỉ có bạn mới làm được điều này. Disclaimer: chỉ chia sẻ.',
      },
    ]);
    const r = runFinancialRiskReview({ document: doc });
    expect(r.issues.some((i) => i.message.toLowerCase().includes('cá nhân hoá'))).toBe(true);
  });

  it('score 100 khi sạch', () => {
    const doc = mkScript([
      {
        ...createBlankScene(0, 'analysis'),
        narration: 'Có thể đạt 8%/năm, có rủi ro mất vốn. Disclaimer: không phải tư vấn đầu tư.',
      },
    ]);
    const r = runFinancialRiskReview({ document: doc });
    expect(r.score).toBe(100);
  });
});