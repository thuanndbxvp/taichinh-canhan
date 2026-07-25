/**
 * IndexedDbScriptRepository — adapter IndexedDB cho ScriptDocument.
 * Phase 3.3: thay thế LocalStorage khi data > 5MB hoặc khi cần cache asset.
 */
import type { ScriptRepository } from './Repository';
import { RepositoryError } from './Repository';
import type { ScriptDocument, ScriptId } from './ScriptDocument';
import {
  isScriptDocument,
  migrateLibraryItemToDocument,
} from './ScriptDocument';
import {
  STORE_SCRIPTS,
  openDb,
  reqToPromise,
  runTxn,
} from './idb';

export class IndexedDbScriptRepository implements ScriptRepository {
  async list(): Promise<ScriptDocument[]> {
    try {
      const docs = await runTxn<ScriptDocument[]>(STORE_SCRIPTS, 'readonly', (store) =>
        reqToPromise<ScriptDocument[]>(store.getAll() as IDBRequest<ScriptDocument[]>),
      );
      // Sắp xếp theo updatedAt desc để UI hiển thị mới nhất trước.
      return docs.filter(isScriptDocument).sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không đọc được IndexedDB scripts', e);
    }
  }

  async get(id: ScriptId): Promise<ScriptDocument | null> {
    try {
      const doc = await runTxn<ScriptDocument | undefined>(STORE_SCRIPTS, 'readonly', (store) =>
        reqToPromise<ScriptDocument | undefined>(store.get(id) as IDBRequest<ScriptDocument | undefined>),
      );
      if (!doc) return null;
      return isScriptDocument(doc) ? doc : null;
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không đọc được script', e);
    }
  }

  async save(doc: ScriptDocument): Promise<ScriptDocument> {
    const updated: ScriptDocument = { ...doc, updatedAt: Date.now() };
    try {
      await runTxn(STORE_SCRIPTS, 'readwrite', (store) =>
        reqToPromise(store.put(updated)),
      );
      return updated;
    } catch (e) {
      if (e instanceof Error && /quota/i.test(e.message)) {
        throw RepositoryError.fromKind('STORAGE_QUOTA', 'IndexedDB đầy', e);
      }
      throw RepositoryError.fromKind('IO', 'Không ghi được script', e);
    }
  }

  async delete(id: ScriptId): Promise<void> {
    try {
      await runTxn(STORE_SCRIPTS, 'readwrite', (store) =>
        reqToPromise(store.delete(id)),
      );
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không xoá được script', e);
    }
  }

  async migrateFromLegacy(rawList: unknown[]): Promise<number> {
    const existing = await this.list();
    const existingIds = new Set(existing.map((d) => d.id));
    let count = 0;
    for (const raw of rawList) {
      const doc = migrateLibraryItemToDocument(raw);
      if (doc && !existingIds.has(doc.id)) {
        await this.save(doc);
        count++;
      }
    }
    return count;
  }
}

// Cần openDb trong scope để dùng cho test teardown.
export { openDb };