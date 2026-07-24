/**
 * IndexedDbAssetRepository — adapter cho AssetRecord + cacheKey lookup.
 *
 * Phase 3.5: cache key ổn định. Tra cứu nhanh qua index 'cacheKey' (non-unique
 * vì 1 input có thể sinh nhiều asset version với provider khác nhau).
 *
 * Tuy nhiên index không có sẵn trong record. Ta tự thêm field `cacheKey` vào
 * AssetRecord (xem `AssetRecord` interface). Nếu cần, có thể promote thành
 * unique index ở Phase 4+ với composite key.
 */
import type { AssetRepository } from './Repository';
import { RepositoryError } from './Repository';
import type { AssetRecord, AssetKind } from './AssetRecord';
import type { ScriptId } from './ScriptDocument';
import {
  STORE_ASSETS,
  runTxn,
  reqToPromise,
} from './idb';

export class IndexedDbAssetRepository implements AssetRepository {
  async list(filter?: { scriptId?: ScriptId; kind?: AssetKind }): Promise<AssetRecord[]> {
    try {
      const all = await runTxn<AssetRecord[]>(STORE_ASSETS, 'readonly', (store) =>
        reqToPromise<AssetRecord[]>(store.getAll() as IDBRequest<AssetRecord[]>),
      );
      let result = all;
      if (filter?.scriptId) {
        result = result.filter((a) => a.scriptId === filter.scriptId);
      }
      if (filter?.kind) {
        result = result.filter((a) => a.kind === filter.kind);
      }
      return result;
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không đọc được assets', e);
    }
  }

  async get(id: string): Promise<AssetRecord | null> {
    try {
      const asset = await runTxn<AssetRecord | undefined>(STORE_ASSETS, 'readonly', (store) =>
        reqToPromise<AssetRecord | undefined>(store.get(id) as IDBRequest<AssetRecord | undefined>),
      );
      return asset ?? null;
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không đọc được asset', e);
    }
  }

  async findByCacheKey(cacheKey: string): Promise<AssetRecord | null> {
    try {
      // Dùng cursor để scan vì index chưa được tạo trong version 1 của store.
      // Phase 4+ sẽ promote cacheKey thành index để tra cứu O(log n).
      const all = await runTxn<AssetRecord[]>(STORE_ASSETS, 'readonly', (store) =>
        reqToPromise<AssetRecord[]>(store.getAll() as IDBRequest<AssetRecord[]>),
      );
      return all.find((a) => (a as unknown as { cacheKey?: string }).cacheKey === cacheKey) ?? null;
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không tra cứu được cacheKey', e);
    }
  }

  async save(asset: AssetRecord): Promise<AssetRecord> {
    try {
      await runTxn(STORE_ASSETS, 'readwrite', (store) =>
        reqToPromise(store.put(asset)),
      );
      return asset;
    } catch (e) {
      if (e instanceof Error && /quota/i.test(e.message)) {
        throw RepositoryError.fromKind('STORAGE_QUOTA', 'IndexedDB đầy', e);
      }
      throw RepositoryError.fromKind('IO', 'Không ghi được asset', e);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await runTxn(STORE_ASSETS, 'readwrite', (store) =>
        reqToPromise(store.delete(id)),
      );
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không xoá được asset', e);
    }
  }
}