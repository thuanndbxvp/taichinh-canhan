/**
 * IndexedDbResearchRepository — adapter cho ResearchPack.
 * Key là scriptId, value là ResearchPack.
 */
import type { ResearchRepository } from './Repository';
import { RepositoryError } from './Repository';
import type { ScriptId } from './ScriptDocument';
import type { ResearchPack } from './ResearchPack';
import {
  STORE_RESEARCH,
  runTxn,
  reqToPromise,
} from './idb';

export class IndexedDbResearchRepository implements ResearchRepository {
  async get(scriptId: ScriptId): Promise<ResearchPack | null> {
    try {
      const pack = await runTxn<ResearchPack | undefined>(STORE_RESEARCH, 'readonly', (store) =>
        reqToPromise<ResearchPack | undefined>(store.get(scriptId) as IDBRequest<ResearchPack | undefined>),
      );
      return pack ?? null;
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không đọc được research pack', e);
    }
  }

  async save(scriptId: ScriptId, pack: ResearchPack): Promise<void> {
    try {
      await runTxn(STORE_RESEARCH, 'readwrite', (store) =>
        reqToPromise(store.put({ scriptId, ...pack })),
      );
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không ghi được research pack', e);
    }
  }

  async delete(scriptId: ScriptId): Promise<void> {
    try {
      await runTxn(STORE_RESEARCH, 'readwrite', (store) =>
        reqToPromise(store.delete(scriptId)),
      );
    } catch (e) {
      throw RepositoryError.fromKind('IO', 'Không xoá được research pack', e);
    }
  }
}