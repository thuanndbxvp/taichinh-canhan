/**
 * partKeywords — shared keyword mapping cho 5 phần của Finance DNA.
 *
 * Cả `arcInstructionFor` (prompts/index.ts) và `parseOutlineIntoSegments`
 * đều cần nhận diện phần 1–5 từ text outline. Trước đây 2 nơi tự khai báo
 * keyword → dễ drift khi rename.
 *
 * Module này là single source of truth. Khi muốn thêm/đổi keyword,
 * sửa 1 chỗ duy nhất.
 */

export type PartNumber = 1 | 2 | 3 | 4 | 5;

export interface PartKeywords {
  /** Tên phần theo số (PHẦN 1, PHẦN 2, ...). */
  readonly partNumber: readonly string[];
  /** Tên phần theo arc (MỞ ĐẦU, BỐI CẢNH, GIẢI PHẪU, GIẢI PHÁP, ĐÚC KẾT). */
  readonly arcKeywords: readonly string[];
}

export const PART_KEYWORDS: Readonly<Record<PartNumber, PartKeywords>> = {
  1: {
    partNumber: ['PHẦN 1'],
    arcKeywords: ['MỞ ĐẦU', 'HOOK & SETUP', 'HOOK'],
  },
  2: {
    partNumber: ['PHẦN 2'],
    arcKeywords: ['BỐI CẢNH', 'VẤN ĐỀ', 'PROBLEM'],
  },
  3: {
    partNumber: ['PHẦN 3'],
    arcKeywords: ['GIẢI PHẪU', 'PHÂN TÍCH', 'ANALYSIS'],
  },
  4: {
    partNumber: ['PHẦN 4'],
    arcKeywords: ['GIẢI PHÁP', 'HÀNH ĐỘNG', 'ACTIONABLE'],
  },
  5: {
    partNumber: ['PHẦN 5'],
    arcKeywords: ['ĐÚC KẾT', 'TRIẾT LÝ', 'CTA', 'TAKEAWAY'],
  },
} as const;

/**
 * Nhận diện phần (1–5) từ text. Trả về phần nhỏ nhất match đầu tiên,
 * hoặc null nếu không khớp. So khớp case-insensitive.
 *
 * Quy tắc ưu tiên: PHẦN N (rõ ràng nhất) > arc keyword.
 */
export function detectPart(text: string): PartNumber | null {
  if (!text) return null;
  const upper = text.toUpperCase();
  for (const n of [1, 2, 3, 4, 5] as const) {
    for (const k of PART_KEYWORDS[n].partNumber) {
      if (upper.includes(k.toUpperCase())) return n;
    }
  }
  for (const n of [1, 2, 3, 4, 5] as const) {
    for (const k of PART_KEYWORDS[n].arcKeywords) {
      if (upper.includes(k.toUpperCase())) return n;
    }
  }
  return null;
}

/**
 * Trả về regex dùng để match phần N (cho parser — tìm vị trí trong text).
 * Ưu tiên PHẦN N trước, fallback arc keyword.
 */
export function partRegex(n: PartNumber): RegExp {
  const k = PART_KEYWORDS[n];
  const partRe = k.partNumber.map((p) => p.replace(/\s+/g, '\\s+')).join('|');
  const arcRe = k.arcKeywords.map((p) => p.replace(/\s+/g, '\\s+')).join('|');
  return new RegExp(`(?:${partRe})|(?:${arcRe})`, 'i');
}
