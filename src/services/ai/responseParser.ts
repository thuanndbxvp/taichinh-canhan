/**
 * responseParser — trích xuất + validate JSON từ AI response.
 *
 * Mục tiêu Phase 2: thay vì tryParseJson (chỉ parse), ta validate theo schema
 * typed để bắt lỗi sớm (sai shape, thiếu field, sai kiểu).
 *
 * Thiết kế:
 *   - Schema = object đơn giản { fields: { name: 'string'|'number'|'boolean'|'array'|'object' } }.
 *   - Validate depth-1 (đủ cho output AI hiện tại).
 *   - KHÔNG dùng Zod để tránh thêm dep nặng. Phase 3+ có thể migrate nếu cần.
 */
import { tryParseJson, cleanJsonResponse } from '../../lib/json';
import { AppError } from '../../lib/errors';

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface ResponseSchema {
  /**
   * Nếu 'array': root là array of objects theo itemFields.
   * Nếu 'object': root là object theo fields.
   */
  kind: 'object' | 'array';
  fields?: Record<string, FieldType>;
  itemFields?: Record<string, FieldType>;
  /**
   * Field nào là bắt buộc (mặc định: tất cả).
   */
  required?: string[];
}

export interface ParseResult<T> {
  ok: true;
  data: T;
}

export interface ParseError {
  ok: false;
  message: string;
  raw?: unknown;
}

export type ParseOutcome<T> = ParseResult<T> | ParseError;

function typeOf(v: unknown): FieldType {
  if (v === null || v === undefined) return 'string';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return 'number';
  if (typeof v === 'boolean') return 'boolean';
  if (typeof v === 'object') return 'object';
  return 'string';
}

/**
 * Validate 1 object theo schema (depth-1).
 */
function validateObject(
  obj: unknown,
  fields: Record<string, FieldType>,
  required: string[] | undefined,
): string | null {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return 'Không phải object';
  }
  const o = obj as Record<string, unknown>;
  const requiredKeys = required ?? Object.keys(fields);
  for (const key of requiredKeys) {
    if (!(key in o)) {
      return `Thiếu field bắt buộc: "${key}"`;
    }
    const expected = fields[key];
    if (!expected) continue;
    const actual = typeOf(o[key]);
    if (expected === 'object' && actual === 'object') continue;
    if (expected !== actual) {
      return `Field "${key}" sai kiểu: mong ${expected}, thấy ${actual}`;
    }
  }
  return null;
}

/**
 * Parse + validate response từ AI.
 * Tự strip markdown fences và nội dung ngoài JSON.
 */
export function parseAiJson<T = unknown>(
  rawContent: string,
  schema: ResponseSchema,
): ParseOutcome<T> {
  const cleaned = cleanJsonResponse(rawContent);
  const parsed = tryParseJson<T>(cleaned);

  if (parsed === undefined) {
    return {
      ok: false,
      message: 'AI trả về không phải JSON hợp lệ',
      raw: rawContent,
    };
  }

  if (schema.kind === 'array') {
    if (!Array.isArray(parsed)) {
      return {
        ok: false,
        message: 'Kết quả mong đợi là array nhưng nhận được thứ khác',
        raw: parsed,
      };
    }
    if (schema.itemFields) {
      for (let i = 0; i < parsed.length; i++) {
        const err = validateObject(
          parsed[i],
          schema.itemFields,
          schema.required,
        );
        if (err) {
          return {
            ok: false,
            message: `Phần tử [${i}] không hợp lệ: ${err}`,
            raw: parsed,
          };
        }
      }
    }
    return { ok: true, data: parsed as T };
  }

  // kind === 'object'
  const err = validateObject(parsed, schema.fields ?? {}, schema.required);
  if (err) {
    return {
      ok: false,
      message: `Object không hợp lệ: ${err}`,
      raw: parsed,
    };
  }
  return { ok: true, data: parsed as T };
}

/**
 * Helper: parse + throw AppError nếu lỗi. Dùng trong service layer.
 */
export function parseAiJsonOrThrow<T = unknown>(
  rawContent: string,
  schema: ResponseSchema,
  action: string,
): T {
  const result = parseAiJson<T>(rawContent, schema);
  if (result.ok === false) {
    throw AppError.from('AI_PARSE_FAILED', result.message, {
      action,
      schema: schema.kind,
    });
  }
  return result.data;
}

// --- Schemas thường dùng cho prompt finance ---

import type {
  TopicSuggestionItem,
  VisualPrompt,
  AllVisualPromptsResult,
  StyleOptions,
} from '../../../types';

export const SCHEMAS: Record<string, ResponseSchema> = {
  topicSuggestions: {
    kind: 'array',
    itemFields: {
      title: 'string',
      outline: 'string',
    },
    required: ['title', 'outline'],
  },
  visualPrompts: {
    kind: 'array',
    itemFields: {
      english: 'string',
      vietnamese: 'string',
    },
    required: ['english', 'vietnamese'],
  },
  allVisualPrompts: {
    kind: 'array',
    itemFields: {
      scene: 'string',
      english: 'string',
      vietnamese: 'string',
    },
    required: ['scene', 'english', 'vietnamese'],
  },
  styleOptions: {
    kind: 'object',
    fields: {
      expression: 'string',
      style: 'string',
    },
    required: ['expression', 'style'],
  },
  dialogue: {
    // Dialogue = object có nhiều cặp key/value string. Để đơn giản, validate chỉ cần object.
    kind: 'object',
    fields: {},
  },
};

export type ParsedTopicSuggestion = TopicSuggestionItem;
export type ParsedVisualPrompt = VisualPrompt;
export type ParsedAllVisualPrompts = AllVisualPromptsResult;
export type ParsedStyleOptions = StyleOptions;
export type ParsedDialogue = Record<string, string>;
