/**
 * ContentBrief — structured brief cho 1 finance video.
 *
 * Mục tiêu Phase 4: thay vì chỉ lưu title/outline/wordCount, lưu đầy đủ
 * metadata (đối tượng, quốc gia, mục tiêu, góc nhìn, CTA, chuyên môn).
 *
 * Backward compat: fields `title/outlineContent/keywords` khớp với
 * GenerationParams.title/outlineContent/keywords cũ → GenerationParams có
 * thể derive từ ContentBrief.
 */
export const CONTENT_BRIEF_SCHEMA_VERSION = 1;

export type ExpertiseLevel = 'beginner' | 'intermediate' | 'advanced';
export type VideoGoal =
  | 'awareness'
  | 'education'
  | 'action'
  | 'persuasion'
  | 'review';
export type Perspective = 'first_person' | 'second_person' | 'third_person';

export interface ContentBrief {
  schemaVersion: number;
  /**
   * Chủ đề.
   */
  title: string;
  /**
   * Đối tượng mục tiêu (text mô tả).
   */
  audience: string;
  /**
   * Quốc gia / thị trường (vd: 'Vietnam', 'US').
   */
  market: string;
  /**
   * Ngôn ngữ (vd: 'Vietnamese').
   */
  language: string;
  /**
   * Mục tiêu video.
   */
  goal: VideoGoal;
  /**
   * Thời lượng ước lượng (giây). Mapping sang wordCount = duration * 2.5
   * (150 từ/phút cho narration tiếng Việt).
   */
  durationSec: number;
  /**
   * Góc nhìn narrration.
   */
  perspective: Perspective;
  /**
   * Từ khoá SEO, comma-separated.
   */
  keywords: string;
  /**
   * CTA mong muốn (text mô tả).
   */
  cta: string;
  /**
   * Mức độ chuyên môn.
   */
  expertise: ExpertiseLevel;
  /**
   * Outline ban đầu (text). Có thể trống nếu dùng AI để generate outline.
   */
  outlineContent: string;
  /**
   * Flag Finance mode (Chú Que Tài Chính persona).
   */
  isFinanceMode?: boolean;
}

export function createDefaultBrief(): ContentBrief {
  return {
    schemaVersion: CONTENT_BRIEF_SCHEMA_VERSION,
    title: '',
    audience: '',
    market: 'Vietnam',
    language: 'Vietnamese',
    goal: 'education',
    durationSec: 480, // 8 phút.
    perspective: 'second_person',
    keywords: '',
    cta: '',
    expertise: 'beginner',
    outlineContent: '',
    isFinanceMode: true,
  };
}

/**
 * Derive wordCount từ durationSec.
 * Quy ước: 2.5 từ/giây = 150 từ/phút.
 */
export function deriveWordCount(durationSec: number): string {
  return Math.max(100, Math.round(durationSec * 2.5)).toString();
}

/**
 * Type guard.
 */
export function isContentBrief(v: unknown): v is ContentBrief {
  if (!v || typeof v !== 'object') return false;
  const b = v as Partial<ContentBrief>;
  return (
    typeof b.schemaVersion === 'number' &&
    typeof b.title === 'string' &&
    typeof b.audience === 'string' &&
    typeof b.language === 'string' &&
    typeof b.outlineContent === 'string'
  );
}