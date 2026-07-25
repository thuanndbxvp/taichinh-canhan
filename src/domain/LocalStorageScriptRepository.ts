/**
 * LocalStorageScriptRepository — adapter localStorage cho ScriptRepository.
 *
 * Phase 3.2: tách interface trước khi thay backend. LocalStorage đủ cho data
 * < 5MB và test dễ. Production sẽ dùng IndexedDbScriptRepository.
 *
 * Định dạng lưu:
 *   - Key: 'yt-script-library-v2' (mới) hoặc 'yt-script-library' (legacy)
 *   - Value: ScriptDocument[] (JSON)
 *
 * Migration: tự động convert từ LibraryItem[] cũ sang ScriptDocument[] lần
 * load đầu. Có backup key 'yt-script-library-backup'.
 */
import type { ScriptRepository } from './Repository';
import { RepositoryError } from './Repository';
import type { ScriptDocument, ScriptId } from './ScriptDocument';
import {
  migrateLibraryItemToDocument,
  isScriptDocument,
} from './ScriptDocument';

const LEGACY_KEY = 'yt-script-library';
const CURRENT_KEY = 'yt-script-library-v2';
const BACKUP_KEY = 'yt-script-library-backup';

export class LocalStorageScriptRepository implements ScriptRepository {
  async list(): Promise<ScriptDocument[]> {
    const raw = this.readRaw();
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        throw RepositoryError.fromKind('STORAGE_CORRUPT', 'Library list không phải array');
      }
      const docs = parsed.filter(isScriptDocument);
      return docs;
    } catch (e) {
      if (e instanceof RepositoryError) throw e;
      throw RepositoryError.fromKind('STORAGE_CORRUPT', 'Không parse được library JSON', e);
    }
  }

  async get(id: ScriptId): Promise<ScriptDocument | null> {
    const docs = await this.list();
    return docs.find((d) => d.id === id) ?? null;
  }

  async save(doc: ScriptDocument): Promise<ScriptDocument> {
    const docs = await this.list();
    const idx = docs.findIndex((d) => d.id === doc.id);
    const updated: ScriptDocument = { ...doc, updatedAt: Date.now() };
    if (idx >= 0) {
      docs[idx] = updated;
    } else {
      docs.unshift(updated);
    }
    this.writeRaw(JSON.stringify(docs));
    return updated;
  }

  async delete(id: ScriptId): Promise<void> {
    const docs = await this.list();
    const filtered = docs.filter((d) => d.id !== id);
    this.writeRaw(JSON.stringify(filtered));
  }

  async migrateFromLegacy(rawList: unknown[]): Promise<number> {
    let count = 0;
    const existing = await this.list();
    const existingIds = new Set(existing.map((d) => d.id));
    for (const raw of rawList) {
      const doc = migrateLibraryItemToDocument(raw);
      if (doc && !existingIds.has(doc.id)) {
        existing.unshift(doc);
        existingIds.add(doc.id);
        count++;
      }
    }
    if (count > 0) {
      this.writeRaw(JSON.stringify(existing));
    }
    return count;
  }

  /**
   * Đọc raw string. Tự động migrate legacy key → current key.
   * Backup key được giữ để rollback nếu migration lỗi.
   */
  private readRaw(): string | null {
    try {
      const current = typeof localStorage !== 'undefined' ? localStorage.getItem(CURRENT_KEY) : null;
      if (current) return current;
      const legacy = typeof localStorage !== 'undefined' ? localStorage.getItem(LEGACY_KEY) : null;
      if (legacy) {
        // Backup legacy trước khi migrate.
        try {
          localStorage.setItem(BACKUP_KEY, legacy);
          // Thử parse + migrate.
          const parsed: unknown = JSON.parse(legacy);
          if (Array.isArray(parsed)) {
            const migrated: ScriptDocument[] = parsed
              .map(migrateLibraryItemToDocument)
              .filter((d): d is ScriptDocument => d !== null);
            const serialized = JSON.stringify(migrated);
            localStorage.setItem(CURRENT_KEY, serialized);
            // Xoá legacy key sau khi thành công.
            localStorage.removeItem(LEGACY_KEY);
            return serialized;
          }
        } catch (e) {
          throw RepositoryError.fromKind('STORAGE_CORRUPT', 'Migration từ legacy thất bại', e);
        }
      }
      return null;
    } catch (e) {
      if (e instanceof RepositoryError) throw e;
      throw RepositoryError.fromKind('IO', 'Không đọc được localStorage', e);
    }
  }

  private writeRaw(value: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CURRENT_KEY, value);
      }
    } catch (e) {
      if (e instanceof Error && /quota/i.test(e.message)) {
        throw RepositoryError.fromKind('STORAGE_QUOTA', 'localStorage đầy', e);
      }
      throw RepositoryError.fromKind('IO', 'Không ghi được localStorage', e);
    }
  }
}