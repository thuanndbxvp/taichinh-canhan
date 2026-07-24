import { describe, it, expect } from 'vitest';
import {
  buildExportPayload,
  parseLibraryImport,
  LIBRARY_SCHEMA_VERSION,
} from './libraryIo';
import type { LibraryItem } from '../../types';

const sample = (id: number): LibraryItem => ({
  id,
  savedAt: 1700000000000,
  title: `Item ${id}`,
  outlineContent: 'outline',
  script: 'script',
});

describe('buildExportPayload', () => {
  it('serialize items kèm schema + metadata', () => {
    const items = [sample(1), sample(2)];
    const json = buildExportPayload(items);
    expect(json).toContain(`"schema": ${LIBRARY_SCHEMA_VERSION}`);
    expect(json).toContain('"items"');
    const parsed = JSON.parse(json);
    expect(parsed.items).toHaveLength(2);
  });

  it('bỏ qua item null/undefined', () => {
    const items = [sample(1), null, undefined, sample(2)] as unknown as LibraryItem[];
    const json = buildExportPayload(items);
    const parsed = JSON.parse(json);
    expect(parsed.items).toHaveLength(2);
  });
});

describe('parseLibraryImport', () => {
  it('đọc file hợp lệ (schema v1)', () => {
    const exportJson = buildExportPayload([sample(1)]);
    const result = parseLibraryImport(exportJson);
    expect(result.items).toHaveLength(1);
    expect(result.warnings).toHaveLength(0);
    expect(result.migrated).toBe(false);
  });

  it('cảnh báo khi schema lạ', () => {
    const json = JSON.stringify({
      schema: 99,
      generator: 'legacy',
      items: [sample(1)],
    });
    const result = parseLibraryImport(json);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.migrated).toBe(true);
  });

  it('hỗ trợ mảng trần (legacy)', () => {
    const json = JSON.stringify([sample(1), sample(2)]);
    const result = parseLibraryImport(json);
    expect(result.items).toHaveLength(2);
    expect(result.migrated).toBe(true);
  });

  it('ném lỗi nếu JSON không hợp lệ', () => {
    expect(() => parseLibraryImport('not json')).toThrow();
  });

  it('ném lỗi nếu thiếu items', () => {
    expect(() => parseLibraryImport(JSON.stringify({ foo: 'bar' }))).toThrow();
  });

  it('lọc bỏ item không hợp lệ', () => {
    const json = JSON.stringify({
      schema: 1,
      items: [sample(1), { id: 'wrong' }, null, sample(2)],
    });
    const result = parseLibraryImport(json);
    expect(result.items).toHaveLength(2);
  });
});
