import { describe, it, expect } from 'vitest';
import { cleanJsonResponse, tryParseJson } from './json';

describe('cleanJsonResponse', () => {
  it('trích từ code fence ```json', () => {
    const out = cleanJsonResponse('Đây là:\n```json\n{"a":1}\n```\nXong.');
    expect(out).toBe('{"a":1}');
  });

  it('trích từ code fence không có json', () => {
    const out = cleanJsonResponse('```\n{"a":1}\n```');
    expect(out).toBe('{"a":1}');
  });

  it('fallback bracket khi không có fence', () => {
    const out = cleanJsonResponse('AI nói: {"a": 1, "b": [2,3]} nhé');
    expect(out).toBe('{"a": 1, "b": [2,3]}');
  });

  it('fallback array khi không có fence', () => {
    const out = cleanJsonResponse('Đáp án: [1,2,3]');
    expect(out).toBe('[1,2,3]');
  });

  it('trả về text.trim() khi không có gì', () => {
    expect(cleanJsonResponse('  abc  ')).toBe('abc');
  });

  it('trả về rỗng khi input rỗng', () => {
    expect(cleanJsonResponse('')).toBe('');
  });
});

describe('tryParseJson', () => {
  it('parse JSON hợp lệ', () => {
    expect(tryParseJson<{ a: number }>('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it('trả về undefined khi JSON lỗi', () => {
    expect(tryParseJson('not json')).toBeUndefined();
  });
});
