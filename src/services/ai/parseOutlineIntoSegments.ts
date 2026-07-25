/**
 * parseOutlineIntoSegments — tách dàn ý thành các phần để generate kịch bản tuần tự.
 *
 * AI có thể trả dàn ý theo nhiều format khác nhau. Thay vì chỉ match 1 regex
 * `^## .*?$`, ta nhận 4 format phổ biến + fallback bằng keyword:
 *
 *   1. Markdown heading:  `## PHẦN 1: MỞ ĐẦU`   hoặc   `### PHẦN 1`
 *   2. Bold marker:       `**PHẦN 1: MỞ ĐẦU**`
 *   3. Plain line:        `PHẦN 1: MỞ ĐẦU`      (chỉ khi dòng đứng đầu file/dòng mới)
 *   4. Keyword (cuối):    nếu không tìm thấy header nào, dùng từ khóa
 *      MỞ ĐẦU / BỐI CẢNH / GIẢI PHẪU / GIẢI PHÁP / ĐÚC KẾT làm ranh giới.
 *
 * Lý do cần fallback: nếu parser trả [] thì workflow phải dừng và báo
 * "Không tìm thấy cấu trúc phần". Fallback keyword đảm bảo hầu hết outline
 * dù viết hơi khác format vẫn tách được, không bị mất content.
 *
 * Quy tắc chung:
 * - Bỏ phần header `### Dàn Ý Chi Tiết...` (do code add vào).
 * - Trim mỗi segment; bỏ segment rỗng.
 * - Mỗi segment bắt đầu từ header của nó (giữ nguyên) cho tới trước header kế tiếp.
 * - Nếu chỉ match được 1 segment duy nhất (tức AI viết nguyên outline 1 khối),
 *   trả về [toàn bộ outline] để user vẫn proceed được 1 phần.
 */

const MAX_AUTO_PARTS = 5;

const PART_KEYWORDS: { key: string; regex: RegExp }[] = [
  { key: 'PHẦN 1', regex: /PHẦN\s*1\b[^\n]*/i },
  { key: 'PHẦN 2', regex: /PHẦN\s*2\b[^\n]*/i },
  { key: 'PHẦN 3', regex: /PHẦN\s*3\b[^\n]*/i },
  { key: 'PHẦN 4', regex: /PHẦN\s*4\b[^\n]*/i },
  { key: 'PHẦN 5', regex: /PHẦN\s*5\b[^\n]*/i },
];

const ARC_KEYWORDS: { key: string; regex: RegExp }[] = [
  { key: 'PHẦN 1', regex: /\bMỞ\s*ĐẦU\b[^\n]*HOOK|HOK[^\n]*SETUP|\bHOOK\b[^\n]*SETUP/i },
  { key: 'PHẦN 2', regex: /\bBỐI\s*CẢNH\b[^\n]*VẤN\s*ĐỀ|\bVẤN\s*ĐỀ\b|\bPROBLEM\b/i },
  { key: 'PHẦN 3', regex: /\bGIẢI\s*PHẪU\b[^\n]*TOÁN|\bANALYSIS\b/i },
  { key: 'PHẦN 4', regex: /\bGIẢI\s*PHÁP\b[^\n]*THỰC\s*TẾ|\bACTIONABLE\b/i },
  { key: 'PHẦN 5', regex: /\bĐÚC\s*KẾT\b[^\n]*CTA|\bTAKEAWAY\b[^\n]*CTA/i },
];

function findHeaderPositions(text: string): { index: number; label: string }[] {
  /**
   * Tìm vị trí các header candidate. Mỗi vị trí có label để debug/log.
   * Chỉ chấp nhận header ở đầu dòng (line start).
   */
  const lines = text.split('\n');
  const positions: { index: number; label: string }[] = [];
  let cursor = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    const headerMatch = /^(#{1,6})\s+(.*?)$/.exec(trimmed);
    if (headerMatch) {
      const content = headerMatch[2].trim();
      if (/(?:^|\s)PHẦN\s+[1-5]\b/i.test(content)) {
        positions.push({ index: cursor, label: `heading:${content}` });
      }
    } else {
      const boldMatch = /^\*\*\s*(PHẦN\s+[1-5][^*]*?)\*\*\s*$/i.exec(trimmed);
      if (boldMatch) {
        positions.push({ index: cursor, label: `bold:${boldMatch[1]}` });
      }
    }
    cursor += line.length + 1; // +1 cho '\n'
  }
  return positions;
}

function findKeywordPositions(text: string): { index: number; label: string }[] {
  /**
   * Fallback: tìm vị trí các keyword PHẦN 1...5 / MỞ ĐẦU / BỐI CẢNH / ...
   * dùng indexOf, không yêu cầu line start.
   */
  const positions: { index: number; label: string }[] = [];
  const seen = new Set<string>();
  for (const { key, regex } of PART_KEYWORDS) {
    const m = regex.exec(text);
    if (m && !seen.has(key)) {
      positions.push({ index: m.index, label: `part:${key}` });
      seen.add(key);
    }
  }
  if (positions.length < 2) {
    for (const { key, regex } of ARC_KEYWORDS) {
      if (seen.has(key)) continue;
      const m = regex.exec(text);
      if (m) {
        positions.push({ index: m.index, label: `arc:${key}` });
        seen.add(key);
      }
    }
  }
  positions.sort((a, b) => a.index - b.index);
  return positions;
}

export function parseOutlineIntoSegments(outline: string): string[] {
  if (!outline || !outline.trim()) return [];

  // Bỏ header do code tự thêm: "### Dàn Ý Chi Tiết (...)"
  const cleaned = outline.replace(/^###\s+Dàn\s*Ý[^\n]*\n*/i, '').trim();

  let positions = findHeaderPositions(cleaned);
  if (positions.length < 2) {
    positions = findKeywordPositions(cleaned);
  }

  // Không tìm thấy header nào → trả toàn bộ outline làm 1 phần
  // (user vẫn generate được thay vì bị chặn).
  if (positions.length === 0) {
    return [cleaned];
  }

  // Có ≥1 header. Cắt theo từng vị trí.
  const segments: string[] = [];
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index;
    const end = i + 1 < positions.length ? positions[i + 1].index : cleaned.length;
    const segment = cleaned.slice(start, end).trim();
    if (segment) segments.push(segment);
  }

  // An toàn: nếu AI viết "PHẦN 1" trong dòng diễn giải → có thể match nhầm.
  // Cap tối đa 10 segments để tránh AI phá vỡ logic.
  if (segments.length > MAX_AUTO_PARTS * 2) {
    return segments.slice(0, MAX_AUTO_PARTS);
  }

  return segments;
}
