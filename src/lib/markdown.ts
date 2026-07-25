/**
 * Markdown parser helpers — gom logic parse Markdown phân tán trong App.tsx và
 * OutputDisplay.tsx về một nơi. Phase 0 chỉ phủ các luồng đang dùng:
 *  - parseScoringReport: chia feedback AI thành từng mục
 *  - stripMarkdownForWordCount: bỏ markdown để đếm từ
 *  - parseSummaryKey: trích key cho prompt retry
 *  - extractFirstLine: lấy tiêu đề cảnh từ block
 *
 * Viết đủ nhỏ để không phụ thuộc thư viện ngoài (markdown-it được add ở phase 1).
 */

/**
 * Bỏ các cú pháp Markdown cơ bản để đếm từ chính xác hơn.
 * - Bỏ code fence, link, image, heading marker, bold/italic, bullet.
 */
export function stripMarkdownForWordCount(input: string): string {
  if (!input) return '';
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/^[\s>*+-]+\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(text: string): number {
  const clean = stripMarkdownForWordCount(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

export interface ScoringSection {
  title: string;
  body: string;
}

/**
 * Tách report đánh giá kịch bản thành các section dựa trên heading markdown.
 * Nếu không tìm thấy heading, trả về 1 section duy nhất.
 */
export function parseScoringReport(report: string): ScoringSection[] {
  if (!report) return [];
  const lines = report.split('\n');
  const sections: ScoringSection[] = [];
  let current: ScoringSection | null = null;

  for (const line of lines) {
    const heading = line.match(/^#{1,4}\s+(.+)$/);
    if (heading) {
      if (current) sections.push(current);
      current = { title: (heading[1] ?? '').trim(), body: '' };
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line;
    } else {
      current = { title: 'Tổng quan', body: line };
    }
  }
  if (current) sections.push(current);
  return sections.map((s) => ({ ...s, body: s.body.trim() }));
}

/**
 * Trích tiêu đề gọn từ block nội dung (dòng đầu tiên, sau khi bỏ `#`).
 * Dùng cho AllVisualPromptsModal.
 */
export function extractFirstLineTitle(block: string, maxLength = 80): string {
  if (!block) return '';
  const first = block.split('\n')[0] ?? '';
  const cleaned = first.replace(/^[#\s]+/, '').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 1) + '…';
}

/**
 * Trích key ổn định cho việc đánh dấu "prompt chưa được tạo" / "lỗi".
 */
export function promptErrorKey(partIndex: number, sceneNumber: number): string {
  return `${partIndex}-${sceneNumber}`;
}

export const PROMPT_PLACEHOLDER_PREFIX = 'Prompt chưa được tạo.';
export const PROMPT_ERROR_PREFIX = 'LỖI:';
