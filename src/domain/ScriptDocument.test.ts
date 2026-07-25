import { describe, it, expect } from 'vitest';
import {
  createScriptDocument,
  isScriptDocument,
  migrateLibraryItemToDocument,
  SCRIPT_DOCUMENT_SCHEMA_VERSION,
} from './ScriptDocument';

describe('ScriptDocument factory', () => {
  it('createScriptDocument set schemaVersion đúng', () => {
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: 'O',
      script: 'S',
    });
    expect(doc.schemaVersion).toBe(SCRIPT_DOCUMENT_SCHEMA_VERSION);
    expect(doc.id).toBeTruthy();
    expect(typeof doc.id).toBe('string');
    expect(doc.createdAt).toBeGreaterThan(0);
    expect(doc.updatedAt).toBeGreaterThan(0);
  });
});

describe('migrateLibraryItemToDocument', () => {
  it('null nếu thiếu title', () => {
    expect(migrateLibraryItemToDocument({ script: 'x' })).toBeNull();
  });

  it('null nếu thiếu script', () => {
    expect(migrateLibraryItemToDocument({ title: 'x' })).toBeNull();
  });

  it('null nếu input không phải object', () => {
    expect(migrateLibraryItemToDocument('string')).toBeNull();
    expect(migrateLibraryItemToDocument(null)).toBeNull();
  });

  it('migrate LibraryItem number id → string "lib-{id}"', () => {
    const doc = migrateLibraryItemToDocument({
      id: 1700000000000,
      savedAt: 1700000000000,
      title: 'old',
      outlineContent: 'o',
      script: 's',
    });
    expect(doc).not.toBeNull();
    expect(doc?.id).toBe('lib-1700000000000');
    expect(doc?.schemaVersion).toBe(SCRIPT_DOCUMENT_SCHEMA_VERSION);
    expect(doc?.createdAt).toBe(1700000000000);
  });

  it('migrate LibraryItem string id → giữ nguyên', () => {
    const doc = migrateLibraryItemToDocument({
      id: 'custom-id',
      title: 't',
      script: 's',
    });
    expect(doc?.id).toBe('custom-id');
  });

  it('migrate không có savedAt → dùng Date.now()', () => {
    const doc = migrateLibraryItemToDocument({ title: 't', script: 's' });
    expect(doc?.createdAt).toBeGreaterThan(0);
  });

  it('giữ cachedData cũ', () => {
    const cachedData = { visualPrompts: {}, allVisualPrompts: null };
    const doc = migrateLibraryItemToDocument({
      title: 't',
      script: 's',
      cachedData,
    });
    expect(doc?.cachedData).toBe(cachedData);
  });
});

describe('isScriptDocument', () => {
  it('true với doc hợp lệ', () => {
    const doc = createScriptDocument({ title: 't', outlineContent: '', script: 's' });
    expect(isScriptDocument(doc)).toBe(true);
  });

  it('false nếu thiếu schemaVersion', () => {
    expect(isScriptDocument({ id: '1', title: 't', script: 's' })).toBe(false);
  });

  it('false nếu id không phải string', () => {
    expect(
      isScriptDocument({ schemaVersion: 2, id: 123, title: 't', script: 's' }),
    ).toBe(false);
  });
});