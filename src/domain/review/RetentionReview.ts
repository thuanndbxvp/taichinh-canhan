/**
 * RetentionReview — kiểm tra cấu trúc giữ chân người xem.
 *
 * Phase 5.4 (plan1.md):
 *   - Hook xuất hiện sớm (≤ 30s đầu).
 *   - Có câu chuyển đoạn (transition words: "tiếp theo", "vậy thì", ...).
 *   - Có micro-storytelling (câu chuyện nhỏ: "năm đó", "hôm qua", "câu chuyện").
 *   - Có luận điểm rõ (ít nhất 1 scene kind=analysis).
 *   - Có payoff (takeaway) đúng promise hook (cùng keyword).
 *   - CTA cụ thể.
 *
 * Ước lượng vị trí scene theo narration length: 2.5 word/sec.
 */
import type { ScriptDocument } from '../ScriptDocument';
import type { Scene, SceneKind } from '../Scene';

export interface RetentionIssue {
  issueId: string;
  category: 'retention';
  severity: 'critical' | 'major' | 'minor';
  message: string;
  sceneId?: string;
  suggestedFix?: string;
}

export interface RetentionReviewResult {
  issues: RetentionIssue[];
  hasHookEarly: boolean;
  hasStorytelling: boolean;
  hasPayoff: boolean;
  hasCta: boolean;
  hasAnalysis: boolean;
  sceneCount: number;
  score: number;
}

const TRANSITION_WORDS = [
  'tiếp theo',
  'vậy thì',
  'bây giờ',
  'sau đó',
  'tiếp đến',
  'chuyển sang',
  'trước khi',
  'đầu tiên',
  'cuối cùng',
];

const STORYTELLING_INDICATORS = [
  'năm đó',
  'hôm qua',
  'tuần trước',
  'câu chuyện',
  'hồi đó',
  'ngày xưa',
  'lúc đó',
  'một ngày',
  'có người',
  'chú tôi',
  'cô tôi',
];

const STOPWORDS_VI = new Set([
  'có',
  'là',
  'của',
  'và',
  'thì',
  'mà',
  'ở',
  'để',
  'đến',
  'từ',
  'với',
  'trong',
  'trên',
  'dưới',
  'này',
  'kia',
  'đó',
  'đây',
  'bạn',
  'tôi',
  'chúng',
  'ta',
  'mình',
  'nhé',
  'nhỉ',
  'thế',
  'thôi',
  'rồi',
  'sẽ',
  'đã',
  'đang',
  'không',
  'chưa',
  'nên',
  'cần',
  'muốn',
  'được',
  'phải',
  'hay',
  'hoặc',
  'nhưng',
  'vì',
  'nếu',
  'khi',
  'lúc',
  'sau',
  'trước',
  'bạn',
  'các',
  'những',
  'một',
  'hai',
  'ba',
  'bốn',
  'năm',
  'mấy',
  'gì',
  'nào',
  'sao',
  'thế',
  'vậy',
  'thì',
  'mới',
  'cũng',
  'rất',
  'quá',
]);

const CTA_INDICATORS = [
  'đăng ký',
  'subscribe',
  'like',
  'bình luận',
  'comment',
  'chia sẻ',
  'nhấn nút',
  'follow',
  'ấn chuông',
];

/**
 * Ước lượng thời điểm scene bắt đầu (giây).
 */
function sceneStartSec(scene: Scene, doc: ScriptDocument): number {
  const scenes = doc.scenes ?? [];
  let sec = 0;
  for (const s of scenes) {
    if (s.id === scene.id) break;
    // 2.5 word/sec.
    sec += (s.narration.split(/\s+/).filter(Boolean).length) / 2.5;
  }
  return sec;
}

export function runRetentionReview(input: { document: ScriptDocument }): RetentionReviewResult {
  const issues: RetentionIssue[] = [];
  const scenes = input.document.scenes ?? [];

  // 1. Hook xuất hiện sớm (≤ 30s) và là scene kind=hook.
  const hookScene = scenes.find((s) => s.kind === 'hook');
  const hasHookEarly = !!hookScene && sceneStartSec(hookScene, input.document) <= 30;
  if (!hookScene) {
    issues.push({
      issueId: 'retention-no-hook',
      category: 'retention',
      severity: 'major',
      message: 'Script không có scene kind=hook.',
      suggestedFix: 'Thêm scene "hook" ở đầu (3-7 giây đầu).',
    });
  } else if (!hasHookEarly) {
    issues.push({
      issueId: 'retention-hook-late',
      category: 'retention',
      severity: 'major',
      message: `Hook xuất hiện sau 30s (~${Math.round(sceneStartSec(hookScene, input.document))}s).`,
      sceneId: hookScene.id,
      suggestedFix: 'Hook cần ở 3-7s đầu. Tách hook ra scene đầu tiên.',
    });
  }

  // 2. Có micro-storytelling.
  const hasStorytelling = scenes.some((s) =>
    STORYTELLING_INDICATORS.some((ind) => s.narration.toLowerCase().includes(ind)),
  );
  if (!hasStorytelling && scenes.length > 0) {
    issues.push({
      issueId: 'retention-no-storytelling',
      category: 'retention',
      severity: 'minor',
      message: 'Không phát hiện micro-storytelling (câu chuyện nhỏ).',
      suggestedFix: 'Chèn 1 micro-story ở scene context/analysis (vd: "năm đó, ...").',
    });
  }

  // 3. Có transition words giữa các scene.
  const transitionCount = scenes.filter((s) =>
    TRANSITION_WORDS.some((w) => s.narration.toLowerCase().includes(w)),
  ).length;
  if (scenes.length >= 3 && transitionCount < Math.ceil(scenes.length / 3)) {
    issues.push({
      issueId: 'retention-few-transitions',
      category: 'retention',
      severity: 'minor',
      message: `Ít transition words (${transitionCount}/${scenes.length} scenes có).`,
      suggestedFix: 'Thêm câu chuyển đoạn giữa các scene.',
    });
  }

  // 4. Có analysis scene.
  const hasAnalysis = scenes.some((s) => s.kind === 'analysis');
  if (!hasAnalysis && scenes.length > 0) {
    issues.push({
      issueId: 'retention-no-analysis',
      category: 'retention',
      severity: 'minor',
      message: 'Không có scene kind=analysis (luận điểm rõ).',
      suggestedFix: 'Thêm scene analysis để làm rõ luận điểm chính.',
    });
  }

  // 5. Payoff: takeaway có keyword trùng hook.
  const takeawayScene = scenes.find((s) => s.kind === 'takeaway');
  const hookWords = hookScene
    ? hookScene.narration.toLowerCase().split(/\s+/).filter((w) => w.length >= 3)
    : [];
  const hookUniqueWords = Array.from(new Set(hookWords)).filter(
    (w) => !STOPWORDS_VI.has(w),
  );
  const hasPayoff =
    !!takeawayScene &&
    hookUniqueWords.some((w) => takeawayScene.narration.toLowerCase().includes(w));
  if (takeawayScene && !hasPayoff) {
    issues.push({
      issueId: 'retention-no-payoff',
      category: 'retention',
      severity: 'minor',
      message: 'Takeaway không đề cập keyword hook.',
      sceneId: takeawayScene.id,
      suggestedFix: 'Payoff nên mirror hook (đáp lại promise ban đầu).',
    });
  }

  // 6. CTA cụ thể.
  const ctaScene = scenes.find((s) => s.kind === 'cta');
  const hasCta = !!ctaScene && CTA_INDICATORS.some((ind) =>
    (ctaScene?.narration ?? '').toLowerCase().includes(ind),
  );
  if (!ctaScene) {
    issues.push({
      issueId: 'retention-no-cta-scene',
      category: 'retention',
      severity: 'minor',
      message: 'Không có scene kind=cta.',
      suggestedFix: 'Thêm scene cta ở cuối với hành động cụ thể.',
    });
  } else if (!hasCta) {
    issues.push({
      issueId: 'retention-cta-vague',
      category: 'retention',
      severity: 'minor',
      message: 'CTA không cụ thể (không chứa "đăng ký", "like", ...).',
      sceneId: ctaScene.id,
      suggestedFix: 'CTA cần hành động cụ thể: "Đăng ký kênh", "Nhấn like", ...',
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
    hasHookEarly,
    hasStorytelling,
    hasPayoff,
    hasCta,
    hasAnalysis,
    sceneCount: scenes.length,
    score,
  };
}

export type { SceneKind };