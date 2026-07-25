import { describe, it, expect } from 'vitest';
import { parseAiJson, parseAiJsonOrThrow, SCHEMAS } from './responseParser';

describe('parseAiJson - array schema', () => {
  it('parse JSON array đúng schema', () => {
    const r = parseAiJson(
      '[{"title":"A","outline":"o"}]',
      SCHEMAS.topicSuggestions,
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toEqual([{ title: 'A', outline: 'o' }]);
    }
  });

  it('parse được khi có markdown fence', () => {
    const r = parseAiJson(
      '```json\n[{"title":"A","outline":"o"}]\n```',
      SCHEMAS.topicSuggestions,
    );
    expect(r.ok).toBe(true);
  });

  it('fail khi không phải JSON', () => {
    const r = parseAiJson('không phải JSON', SCHEMAS.topicSuggestions);
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.message).toMatch(/JSON/);
  });

  it('fail khi thiếu field bắt buộc', () => {
    const r = parseAiJson(
      '[{"title":"A"}]',
      SCHEMAS.topicSuggestions,
    );
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.message).toMatch(/outline/);
  });

  it('fail khi field sai kiểu', () => {
    const r = parseAiJson(
      '[{"title":123,"outline":"o"}]',
      SCHEMAS.topicSuggestions,
    );
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.message).toMatch(/sai kiểu/);
  });

  it('fail khi root không phải array', () => {
    const r = parseAiJson(
      '{"title":"A"}',
      SCHEMAS.topicSuggestions,
    );
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.message).toMatch(/array/);
  });
});

describe('parseAiJson - object schema', () => {
  it('parse StyleOptions đúng', () => {
    const r = parseAiJson(
      '{"expression":"Empathetic","style":"Storytelling"}',
      SCHEMAS.styleOptions,
    );
    expect(r.ok).toBe(true);
  });

  it('fail khi thiếu field', () => {
    const r = parseAiJson(
      '{"expression":"E"}',
      SCHEMAS.styleOptions,
    );
    expect(r.ok).toBe(false);
  });
});

describe('parseAiJsonOrThrow', () => {
  it('throw AppError nếu parse fail', () => {
    expect(() =>
      parseAiJsonOrThrow('xxx', SCHEMAS.topicSuggestions, 'test'),
    ).toThrow();
  });

  it('trả data nếu parse ok', () => {
    const out = parseAiJsonOrThrow<Array<{ title: string }>>(
      '[{"title":"A"}]',
      { kind: 'array', itemFields: { title: 'string' }, required: ['title'] },
      'test',
    );
    expect(out).toEqual([{ title: 'A' }]);
  });
});
