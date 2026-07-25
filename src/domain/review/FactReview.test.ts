import { describe, it, expect } from 'vitest';
import { runFactReview, STALE_SOURCE_MONTHS } from './FactReview';
import type { ResearchClaim, ResearchSource } from '../ResearchPack';

function mkClaim(over: Partial<ResearchClaim> = {}): ResearchClaim {
  return {
    id: 'c1',
    text: 'Lãi suất tiết kiệm là 5%/năm.',
    sourceIds: [],
    status: 'unverified',
    risk: 'low',
    usedIn: [],
    ...over,
  };
}

function mkSource(over: Partial<ResearchSource> = {}): ResearchSource {
  return {
    id: 's1',
    type: 'article',
    title: 'Ngân hàng Nhà nước',
    reliability: 3,
    ...over,
  };
}

const NOW = Date.parse('2026-06-01T00:00:00Z');

describe('FactReview', () => {
  it('claim verified không có source → critical', () => {
    const r = runFactReview({
      claims: [mkClaim({ status: 'verified' })],
      sources: [],
      now: NOW,
    });
    const issue = r.issues.find((i) => i.issueId.includes('no-source'));
    expect(issue?.severity).toBe('critical');
  });

  it('claim unverified không có source → major', () => {
    const r = runFactReview({
      claims: [mkClaim({ status: 'unverified' })],
      sources: [],
      now: NOW,
    });
    const issue = r.issues.find((i) => i.issueId.includes('no-source'));
    expect(issue?.severity).toBe('major');
  });

  it('claim có source + verified → không có no-source issue', () => {
    const r = runFactReview({
      claims: [mkClaim({ status: 'verified', sourceIds: ['s1'] })],
      sources: [mkSource({ id: 's1' })],
      now: NOW,
    });
    expect(r.issues.some((i) => i.issueId.includes('no-source'))).toBe(false);
  });

  it('source quá cũ → stale issue', () => {
    const oldDate = '2023-01-01'; // >24 tháng trước NOW (2026-06-01).
    const r = runFactReview({
      claims: [],
      sources: [mkSource({ id: 'old', dataDate: oldDate })],
      now: NOW,
    });
    const issue = r.issues.find((i) => i.issueId.includes('stale'));
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('minor');
  });

  it('source mới → không stale', () => {
    const recent = '2026-01-01';
    const r = runFactReview({
      claims: [],
      sources: [mkSource({ id: 'fresh', dataDate: recent })],
      now: NOW,
    });
    expect(r.issues.some((i) => i.issueId.includes('stale'))).toBe(false);
  });

  it('claim "hiện tại" unverified + thiếu dataDate → minor issue', () => {
    const r = runFactReview({
      claims: [mkClaim({ text: 'Hiện tại lãi suất đang tăng.' })],
      sources: [],
      now: NOW,
    });
    const issue = r.issues.find((i) => i.issueId.includes('current-no-date'));
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('minor');
  });

  it('verified nhưng ngôn ngữ giả định → major', () => {
    const r = runFactReview({
      claims: [mkClaim({ status: 'verified', text: 'Ví dụ lãi suất 5% là hợp lý.' })],
      sources: [mkSource()],
      now: NOW,
    });
    const issue = r.issues.find((i) => i.issueId.includes('assumption'));
    expect(issue?.severity).toBe('major');
  });

  it('hai claim trùng text nhưng khác status → contradiction', () => {
    const r = runFactReview({
      claims: [
        mkClaim({ id: 'a', status: 'verified', text: 'Lãi suất 5%' }),
        mkClaim({ id: 'b', status: 'contested', text: 'Lãi suất 5%' }),
      ],
      sources: [],
      now: NOW,
    });
    expect(r.issues.some((i) => i.issueId.includes('contradiction'))).toBe(true);
  });

  it('score giảm theo severity', () => {
    const clean = runFactReview({
      claims: [mkClaim({ sourceIds: ['s1'], status: 'verified' })],
      sources: [mkSource({ id: 's1' })],
      now: NOW,
    });
    expect(clean.score).toBe(100);

    const dirty = runFactReview({
      claims: [
        mkClaim({ status: 'verified', text: 'Ví dụ X' }),
        mkClaim({ id: 'c2', status: 'unverified', text: 'Hiện tại Y' }),
      ],
      sources: [],
      now: NOW,
    });
    expect(dirty.score).toBeLessThan(100);
  });

  it('verifiedClaimCount / unverifiedClaimCount đúng', () => {
    const r = runFactReview({
      claims: [
        mkClaim({ id: 'v', status: 'verified' }),
        mkClaim({ id: 'u', status: 'unverified' }),
        mkClaim({ id: 'u2', status: 'unverified' }),
      ],
      sources: [],
      now: NOW,
    });
    expect(r.verifiedClaimCount).toBe(1);
    expect(r.unverifiedClaimCount).toBe(2);
  });

  it('STALE_SOURCE_MONTHS = 24', () => {
    expect(STALE_SOURCE_MONTHS).toBe(24);
  });
});