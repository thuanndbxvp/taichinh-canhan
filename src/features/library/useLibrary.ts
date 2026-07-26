import { useCallback, useEffect, useRef, useState } from 'react';
import type { LibraryItem } from '../../../types';
import { downloadLibrary, parseLibraryImport } from '../../lib/libraryIo';
import type { ScriptRepository } from '../../domain/Repository';
import { RepositoryError } from '../../domain/Repository';
import {
  createScriptDocument,
  migrateLibraryItemToDocument,
  type ScriptDocument,
  type ScriptId,
} from '../../domain/ScriptDocument';
import { getRepositoryBundle } from '../../domain/repositoryBundle';

export interface UseLibraryReturn {
  /**
   * ScriptDocument[] — superset của LibraryItem[].
   * Giữ type LibraryItem[] để không phá UI, nhưng mỗi item có schemaVersion.
   */
  library: LibraryItem[];
  saveCurrent: (input: { title: string; outlineContent: string; script: string, brief?: any }) => Promise<boolean>;
  loadItem: (item: LibraryItem) => { title: string; outlineContent: string; script: string };
  removeItem: (id: number) => Promise<void>;
  exportAll: () => void;
  importFromText: (text: string) => Promise<ImportResult>;
  importFromFile: (file: File) => Promise<ImportResult>;
  hasSaved: boolean;
  setHasSaved: (v: boolean) => void;
  /**
   * Phase 3: truy cập trực tiếp repository (cho component cần load theo id).
   */
  repository: ScriptRepository;
}

export interface ImportResult {
  imported: number;
  warnings: string[];
}

/**
 * Convert ScriptDocument → LibraryItem để tương thích UI cũ (OutputDisplay, ...).
 */
function documentToLibraryItem(doc: ScriptDocument): LibraryItem {
  return {
    id: hashIdToNumber(doc.id),
    savedAt: doc.createdAt,
    title: doc.title,
    outlineContent: doc.outlineContent,
    script: doc.script,
    cachedData: doc.cachedData,
    brief: doc.brief,
  };
}

/**
 * Hash string id → number để giữ field `id: number` của LibraryItem.
 * Không dùng cho ID thật — chỉ để UI không vỡ.
 */
function hashIdToNumber(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function useLibrary(): UseLibraryReturn {
  const repoRef = useRef<ScriptRepository | null>(null);
  if (!repoRef.current) {
    repoRef.current = getRepositoryBundle().scripts;
  }
  const repository = repoRef.current;

  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const docs = await repository.list();
        if (!cancelled) setLibrary(docs.map(documentToLibraryItem));
      } catch (e) {
        if (e instanceof RepositoryError) {
          console.error('[useLibrary] load failed:', e.kind, e.message);
        } else {
          console.error('[useLibrary] unexpected error:', e);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [repository]);

  const saveCurrent = useCallback(
    async (input: { title: string; outlineContent: string; script: string; brief?: any }) => {
      if (!input.script.trim() || !input.title.trim()) return false;
      try {
        const doc = createScriptDocument({
          title: input.title,
          outlineContent: input.outlineContent,
          script: input.script,
          brief: input.brief,
        });
        await repository.save(doc);
        // Refresh list từ repo để tránh race condition.
        const docs = await repository.list();
        setLibrary(docs.map(documentToLibraryItem));
        setHasSaved(true);
        return true;
      } catch (e) {
        console.error('[useLibrary] save failed:', e);
        return false;
      }
    },
    [repository],
  );

  const loadItem = useCallback((item: LibraryItem) => {
    setHasSaved(true);
    return {
      title: item.title,
      outlineContent: item.outlineContent,
      script: item.script,
    };
  }, []);

  const removeItem = useCallback(
    async (id: number) => {
      // Tìm doc tương ứng trong state.
      const target = library.find((it) => it.id === id);
      if (!target) return;
      // Reconstruct scriptId từ hash (chỉ match hash, vì hash có collision).
      // An toàn hơn: query repo theo các doc có hash = id.
      try {
        const docs = await repository.list();
        const match = docs.find((d) => hashIdToNumber(d.id) === id);
        if (!match) return;
        await repository.delete(match.id as ScriptId);
        const fresh = await repository.list();
        setLibrary(fresh.map(documentToLibraryItem));
      } catch (e) {
        console.error('[useLibrary] remove failed:', e);
      }
      void target;
    },
    [library, repository],
  );

  const exportAll = useCallback(() => {
    downloadLibrary(library);
  }, [library]);

  const importFromText = useCallback(
    async (text: string): Promise<ImportResult> => {
      const result = parseLibraryImport(text);
      // Migration LibraryItem[] → ScriptDocument[] qua repo.
      const rawList = (result as unknown as { items?: unknown[] }).items ?? [];
      let migrated = 0;
      try {
        migrated = await repository.migrateFromLegacy(rawList);
      } catch (e) {
        console.error('[useLibrary] import migration failed:', e);
      }
      // Refresh.
      const docs = await repository.list();
      setLibrary(docs.map(documentToLibraryItem));
      setHasSaved(true);
      return {
        imported: migrated || result.items.length,
        warnings: result.warnings,
      };
    },
    [repository],
  );

  const importFromFile = useCallback(
    async (file: File): Promise<ImportResult> => {
      const text = await file.text();
      return importFromText(text);
    },
    [importFromText],
  );

  return {
    library,
    saveCurrent,
    loadItem,
    removeItem,
    exportAll,
    importFromText,
    importFromFile,
    hasSaved,
    setHasSaved,
    repository,
  };
}

// Export helper cho component cần convert LibraryItem → ScriptDocument.
export { migrateLibraryItemToDocument };