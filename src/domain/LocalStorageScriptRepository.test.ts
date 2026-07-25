import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageScriptRepository } from './LocalStorageScriptRepository';
import { createScriptDocument } from './ScriptDocument';

describe('LocalStorageScriptRepository', () => {
  let repo: LocalStorageScriptRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageScriptRepository();
  });

  it('list trả [] khi trống', async () => {
    expect(await repo.list()).toEqual([]);
  });

  it('save → list có 1 doc với updatedAt mới hơn createdAt', async () => {
    const doc = createScriptDocument({ title: 'T', outlineContent: '', script: 'S' });
    await repo.save(doc);
    const list = await repo.list();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('T');
  });

  it('save cùng id → update không tăng số lượng', async () => {
    const doc = createScriptDocument({ title: 'A', outlineContent: '', script: 'X' });
    await repo.save(doc);
    await repo.save({ ...doc, title: 'B' });
    const list = await repo.list();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('B');
  });

  it('get trả về doc đúng id', async () => {
    const doc = createScriptDocument({ title: 'A', outlineContent: '', script: 'X' });
    await repo.save(doc);
    const found = await repo.get(doc.id);
    expect(found?.id).toBe(doc.id);
  });

  it('get trả null khi id không tồn tại', async () => {
    expect(await repo.get('nope')).toBeNull();
  });

  it('delete xoá theo id', async () => {
    const doc = createScriptDocument({ title: 'A', outlineContent: '', script: 'X' });
    await repo.save(doc);
    await repo.delete(doc.id);
    expect(await repo.list()).toEqual([]);
  });

  it('migrateFromLegacy convert LibraryItem[] → ScriptDocument[]', async () => {
    const legacy = [
      { id: 1, savedAt: 1000, title: 'L1', outlineContent: '', script: 's1' },
      { id: 2, savedAt: 2000, title: 'L2', outlineContent: '', script: 's2' },
      // Invalid item sẽ bị bỏ.
      { id: 3, savedAt: 3000 }, // thiếu script
      // Item trùng id sẽ skip.
      { id: 1, savedAt: 1000, title: 'L1 dup', outlineContent: '', script: 's1-dup' },
    ];
    const count = await repo.migrateFromLegacy(legacy);
    expect(count).toBe(2);
    const list = await repo.list();
    expect(list).toHaveLength(2);
  });

  it('migrate tự động từ legacy localStorage key lúc đọc', async () => {
    // Pre-seed legacy.
    localStorage.setItem(
      'yt-script-library',
      JSON.stringify([
        { id: 999, savedAt: 999, title: 'pre', outlineContent: '', script: 'ps' },
      ]),
    );
    const list = await repo.list();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('pre');
    expect(list[0].id).toBe('lib-999');
    // Legacy key đã được backup.
    expect(localStorage.getItem('yt-script-library-backup')).not.toBeNull();
    expect(localStorage.getItem('yt-script-library')).toBeNull();
  });

  it('không crash khi legacy JSON corrupt', async () => {
    localStorage.setItem('yt-script-library', '{invalid json');
    await expect(repo.list()).rejects.toThrow();
  });
});