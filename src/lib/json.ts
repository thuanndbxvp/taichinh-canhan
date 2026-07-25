/**
 * Tiện ích trích JSON từ output AI có thể lẫn văn xuôi.
 * Ưu tiên code fence ```json ... ```, fallback quét bracket.
 */
export const cleanJsonResponse = (text: string): string => {
  if (!text) return '';

  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
  if (fenced && fenced[1]) return fenced[1].trim();

  const firstBracket = text.indexOf('[');
  const firstBrace = text.indexOf('{');
  const start =
    firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace) ? firstBracket : firstBrace;
  const lastBracket = text.lastIndexOf(']');
  const lastBrace = text.lastIndexOf('}');
  const end = Math.max(lastBracket, lastBrace);

  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1).trim();
  }

  return text.trim();
};

/**
 * Parse JSON an toàn, trả về undefined nếu lỗi.
 */
export function tryParseJson<T = unknown>(text: string): T | undefined {
  try {
    const cleaned = cleanJsonResponse(text);
    return JSON.parse(cleaned) as T;
  } catch {
    return undefined;
  }
}
