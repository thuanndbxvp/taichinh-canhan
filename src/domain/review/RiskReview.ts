/**
 * FinancialRiskReview — phát hiện ngôn ngữ rủi ro trong script tài chính.
 *
 * Phase 5.3 (plan1.md):
 *   - Cam kết lợi nhuận ("chắc chắn lãi", "100% thắng").
 *   - Khẳng định chắc chắn ("chắc chắn", "không thể thua", "đảm bảo").
 *   - Xúi giục mua/bán ("mua ngay", "bán tháo", "không nên bỏ qua").
 *   - Bỏ qua rủi ro (thiếu từ khóa "rủi ro", "có thể thua").
 *   - Ngôn ngữ cá nhân hoá quá mạnh ("chỉ có bạn", "không ai làm được").
 *   - Thiếu disclaimer.
 *
 * Pure function.
 */
import type { ScriptDocument } from '../ScriptDocument';
import type { Scene } from '../Scene';

export interface RiskIssue {
  issueId: string;
  category: 'risk';
  severity: 'critical' | 'major' | 'minor';
  message: string;
  sceneId?: string;
  suggestedFix?: string;
}

export interface RiskReviewResult {
  issues: RiskIssue[];
  score: number;
  /**
   * Có disclaimer không.
   */
  hasDisclaimer: boolean;
  /**
   * Có cảnh báo rủi ro (rủi ro/có thể thua/thua lỗ) không.
   */
  hasRiskWarning: boolean;
}

interface RiskPattern {
  pattern: RegExp;
  severity: RiskIssue['severity'];
  type: 'commitment' | 'certainty' | 'urgency' | 'personalization';
  message: string;
  fix: string;
}

const RISK_PATTERNS: RiskPattern[] = [
  // Cam kết lợi nhuận.
  {
    pattern: /(chắc chắn lãi|chắc chắn thắng|chắc chắn sinh lời|100\s*%\s*(lợi\s*nhận|lãi|thắng)|lãi\s*chắc\s*chắn)/iu,
    severity: 'critical',
    type: 'commitment',
    message: 'Câu cam kết lợi nhuận tuyệt đối.',
    fix: 'Thay bằng ngôn ngữ "có thể", "kỳ vọng", minh hoạ scenario.',
  },
  // Khẳng định chắc chắn.
  {
    pattern: /(đảm\s*bảo\s+(lãi|thắng|có\s*lợi)|không\s*thể\s*thua|không\s*bao\s*giờ\s*thua|chắc\s*100\s*%)/iu,
    severity: 'critical',
    type: 'certainty',
    message: 'Câu khẳng định chắc chắn về lợi nhuận.',
    fix: 'Bỏ tuyệt đối. Thay bằng "có khả năng", "trong điều kiện X".',
  },
  // Xúi giục mua/bán.
  {
    pattern: /(mua\s*ngay|bán\s*tháo|bán\s*ngay|mua\s*gấp|không\s*nên\s*bỏ\s*qua|cơ\s*hội\s*cuối|sốt\s*đất|sốt\s*vàng)/iu,
    severity: 'major',
    type: 'urgency',
    message: 'Ngôn ngữ xúi giục mua/bán cấp bách.',
    fix: 'Tránh urgency/pressure. Thay bằng "cân nhắc", "tham khảo".',
  },
  // Ngôn ngữ cá nhân hoá quá mạnh.
  {
    pattern: /(chỉ\s*có\s*bạn|chỉ\s*mình\s*bạn|chỉ\s*bạn\s*mới|không\s*ai\s*làm\s*được|bạn\s*là\s*người\s*duy\s*nhất|bạn\s*là\s*duy\s*nhất)/iu,
    severity: 'minor',
    type: 'personalization',
    message: 'Cá nhân hoá quá mạnh.',
    fix: 'Dùng "bạn đọc", "người quan tâm", tránh phân biệt nhóm.',
  },
];

const RISK_WARNING_KEYWORDS = ['rủi ro', 'có thể thua', 'thua lỗ', 'mất vốn', 'không đảm bảo'];

const DISCLAIMER_KEYWORDS = [
  'disclaimer',
  'miễn trừ trách nhiệm',
  'không phải tư vấn đầu tư',
  'chỉ mang tính chia sẻ',
  'không phải lời khuyên tài chính',
];

function gatherText(doc: ScriptDocument): string {
  if (doc.scenes && doc.scenes.length > 0) {
    return doc.scenes.map((s) => `${s.title}\n${s.narration}`).join('\n');
  }
  return doc.script;
}

function findDisclaimerScene(scenes: Scene[] | undefined): Scene | null {
  if (!scenes) return null;
  return (
    scenes.find((s) => s.kind === 'disclaimer') ??
    scenes.find((s) =>
      DISCLAIMER_KEYWORDS.some((k) => s.narration.toLowerCase().includes(k)),
    ) ??
    null
  );
}

export function runFinancialRiskReview(input: { document: ScriptDocument }): RiskReviewResult {
  const issues: RiskIssue[] = [];
  const fullText = gatherText(input.document);
  const lower = fullText.toLowerCase();
  const scenes = input.document.scenes;

  // Scan toàn văn cho các pattern nguy hiểm.
  if (scenes) {
    for (const scene of scenes) {
      const sceneLower = scene.narration.toLowerCase();
      for (const rp of RISK_PATTERNS) {
        if (rp.pattern.test(scene.narration) || rp.pattern.test(sceneLower)) {
          issues.push({
            issueId: `risk-${rp.type}-${scene.id}-${rp.pattern.source.slice(0, 12)}`,
            category: 'risk',
            severity: rp.severity,
            message: rp.message,
            sceneId: scene.id,
            suggestedFix: rp.fix,
          });
        }
      }
    }
  } else {
    // Fallback: scan toàn document script field.
    for (const rp of RISK_PATTERNS) {
      if (rp.pattern.test(fullText)) {
        issues.push({
          issueId: `risk-${rp.type}-script-${rp.pattern.source.slice(0, 12)}`,
          category: 'risk',
          severity: rp.severity,
          message: rp.message,
          suggestedFix: rp.fix,
        });
      }
    }
  }

  // Check disclaimer.
  const hasDisclaimer = DISCLAIMER_KEYWORDS.some((k) => lower.includes(k));
  if (!hasDisclaimer) {
    const disclaimerScene = findDisclaimerScene(scenes);
    issues.push({
      issueId: 'risk-no-disclaimer',
      category: 'risk',
      severity: 'major',
      message: 'Script không có disclaimer / miễn trừ trách nhiệm.',
      ...(disclaimerScene ? {} : { sceneId: undefined }),
      suggestedFix:
        'Thêm scene `disclaimer` hoặc dòng "Nội dung chỉ mang tính chia sẻ, không phải tư vấn đầu tư."',
    });
  }

  // Check có cảnh báo rủi ro (nếu có con số/kịch bản).
  const hasRiskWarning = RISK_WARNING_KEYWORDS.some((k) => lower.includes(k));
  const hasNumbers =
    /\d+\s*(%|triệu|tỷ|đồng|vnd)/iu.test(lower) ||
    (input.document.scenes ?? []).some((s) => s.calculationIds.length > 0);
  if (hasNumbers && !hasRiskWarning) {
    issues.push({
      issueId: 'risk-no-warning',
      category: 'risk',
      severity: 'major',
      message: 'Script có số liệu/kịch bản nhưng không đề cập rủi ro.',
      suggestedFix: 'Bổ sung "rủi ro", "có thể thua", "không đảm bảo" trong takeaway.',
    });
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
    score,
    hasDisclaimer,
    hasRiskWarning,
  };
}