/**
 * FactReview — kiểm tra claim & source.
 *
 * Phase 5.1: phát hiện
 *   - Claim không có source.
 *   - Source quá cũ (>24 tháng).
 *   - Claim mâu thuẫn (verified vs contested cùng text ngắn).
 *   - Dữ liệu không rõ thời điểm (dataDate trống với claim kiểu "hiện tại").
 *   - Ví dụ giả định ("ví dụ", "giả sử") trình bày như dữ kiện thật
 *     (claim status=verified nhưng text chứa indicator giả định).
 *
 * Pure function, không phụ thuộc React.
 */
import type { ResearchClaim, ResearchSource } from '../ResearchPack';

/** Cảnh báo: nguồn >24 tháng. */
export const STALE_SOURCE_MONTHS = 24;

/** Thời điểm "now" cho test. Có thể inject qua `now`. */
const DEFAULT_NOW = () => Date.now();

export interface FactIssue {
  issueId: string;
  category: 'fact';
  severity: 'critical' | 'major' | 'minor';
  message: string;
  /** Claim ID nếu liên quan. */
  claimId?: string;
  /** Source ID nếu liên quan. */
  sourceId?: string;
  /** Gợi ý fix. */
  suggestedFix?: string;
}

export interface FactReviewResult {
  issues: FactIssue[];
  /**
   * Số claim đã verify (status=verified + có ≥1 source).
   */
  verifiedClaimCount: number;
  /**
   * Số claim unverified.
   */
  unverifiedClaimCount: number;
  /**
   * Điểm 0-100. Trừ điểm theo severity.
   */
  score: number;
}

/**
 * Indicators cho ngôn ngữ giả định.
 * Nếu claim status=verified mà chứa indicator này → flag.
 */
const ASSUMPTION_INDICATORS = [
  'ví dụ',
  'giả sử',
  'ví dụ như',
  'thử tưởng tượng',
  'giả định',
  'giả lập',
];

/**
 * Check 1 claim có source không.
 */
function claimHasSource(claim: ResearchClaim, sources: ResearchSource[]): boolean {
  return claim.sourceIds.some((sid) => sources.some((s) => s.id === sid));
}

/**
 * Check source có quá cũ không.
 */
function isStaleSource(source: ResearchSource, now: number): boolean {
  if (!source.dataDate) return false; // không có date thì không stale mà là missing (handled separately)
  const ts = Date.parse(source.dataDate);
  if (Number.isNaN(ts)) return false;
  const monthsOld = (now - ts) / (1000 * 60 * 60 * 24 * 30.44);
  return monthsOld > STALE_SOURCE_MONTHS;
}

/**
 * Check dataDate trống cho claim nói về hiện tại.
 */
function claimAboutCurrentWithoutDataDate(text: string, claim: ResearchClaim): boolean {
  if (claim.status !== 'unverified') return false;
  const lower = text.toLowerCase();
  const currentIndicators = ['hiện tại', 'hiện nay', 'năm nay', 'đang', 'vừa qua', 'gần đây'];
  return currentIndicators.some((ind) => lower.includes(ind));
}

/**
 * Check claim verified nhưng có assumption indicator.
 */
function verifiedButSoundsAssumption(text: string, claim: ResearchClaim): boolean {
  if (claim.status !== 'verified') return false;
  const lower = text.toLowerCase();
  return ASSUMPTION_INDICATORS.some((ind) => lower.includes(ind));
}

/**
 * Phát hiện mâu thuẫn: 2 claim trùng text ngắn nhưng khác status.
 */
function findContradictions(claims: ResearchClaim[]): Array<[string, string]> {
  const contradictions: Array<[string, string]> = [];
  const byText: Record<string, ResearchClaim[]> = {};
  for (const c of claims) {
    const key = c.text.trim().toLowerCase().slice(0, 60);
    if (!byText[key]) byText[key] = [];
    byText[key].push(c);
  }
  for (const arr of Object.values(byText)) {
    if (arr.length < 2) continue;
    const statuses = new Set(arr.map((c) => c.status));
    if (statuses.size > 1) {
      contradictions.push([arr[0].id, arr[1].id]);
    }
  }
  return contradictions;
}

export function runFactReview(input: {
  claims: ResearchClaim[];
  sources: ResearchSource[];
  now?: number;
}): FactReviewResult {
  const now = input.now ?? DEFAULT_NOW();
  const issues: FactIssue[] = [];
  let verified = 0;
  let unverified = 0;

  // Per-claim checks.
  for (const claim of input.claims) {
    const hasSource = claimHasSource(claim, input.sources);
    if (claim.status === 'verified') verified++;
    if (claim.status === 'unverified') unverified++;

    if (!hasSource && claim.status !== 'outdated') {
      issues.push({
        issueId: `fact-no-source-${claim.id}`,
        category: 'fact',
        severity: claim.status === 'verified' ? 'critical' : 'major',
        message: claim.status === 'verified'
          ? 'Claim đánh dấu verified nhưng không có nguồn.'
          : 'Claim chưa có nguồn đính kèm.',
        claimId: claim.id,
        suggestedFix: 'Thêm ít nhất 1 source có URL/author/date.',
      });
    }

    if (claimAboutCurrentWithoutDataDate(claim.text, claim)) {
      issues.push({
        issueId: `fact-current-no-date-${claim.id}`,
        category: 'fact',
        severity: 'minor',
        message: 'Claim nói về hiện tại nhưng không ghi dataDate.',
        claimId: claim.id,
        suggestedFix: 'Bổ sung dataDate (ngày công bố/niên độ thống kê).',
      });
    }

    if (verifiedButSoundsAssumption(claim.text, claim)) {
      issues.push({
        issueId: `fact-assumption-marked-verified-${claim.id}`,
        category: 'fact',
        severity: 'major',
        message: 'Claim marked verified nhưng ngôn ngữ nghe giả định (ví dụ/giả sử).',
        claimId: claim.id,
        suggestedFix: 'Đổi sang unverified hoặc dùng claim khác.',
      });
    }
  }

  // Source staleness.
  for (const source of input.sources) {
    if (isStaleSource(source, now)) {
      issues.push({
        issueId: `fact-stale-source-${source.id}`,
        category: 'fact',
        severity: 'minor',
        message: `Nguồn đã cũ hơn ${STALE_SOURCE_MONTHS} tháng.`,
        sourceId: source.id,
        suggestedFix: 'Cập nhật nguồn mới hơn hoặc ghi chú "tại thời điểm X".',
      });
    }
  }

  // Contradictions.
  const contradictions = findContradictions(input.claims);
  for (const [a, b] of contradictions) {
    issues.push({
      issueId: `fact-contradiction-${a}-${b}`,
      category: 'fact',
      severity: 'major',
      message: 'Hai claim trùng nội dung nhưng khác trạng thái xác minh.',
      claimId: a,
      suggestedFix: 'Đối chiếu lại nguồn và chọn 1 trạng thái.',
    });
  }

  // Scoring: 100 - critical*25 - major*10 - minor*3, floor 0.
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === 'critical') score -= 25;
    else if (issue.severity === 'major') score -= 10;
    else score -= 3;
  }
  score = Math.max(0, score);

  return {
    issues,
    verifiedClaimCount: verified,
    unverifiedClaimCount: unverified,
    score,
  };
}