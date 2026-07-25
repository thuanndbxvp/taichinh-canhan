import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResearchRepository } from '../../domain/Repository';
import type {
  ResearchPack,
  ResearchSource,
  SourceType,
} from '../../domain/ResearchPack';
import { createEmptyResearchPack } from '../../domain/ResearchPack';
import type { ScriptId } from '../../domain/ScriptDocument';
import { getRepositoryBundle } from '../../domain/repositoryBundle';

export interface UseResearchArgs {
  scriptId: ScriptId | null;
}

export interface UseResearchReturn {
  pack: ResearchPack | null;
  isLoading: boolean;
  error: string | null;
  addSource: (input: Omit<ResearchSource, 'id'>) => Promise<void>;
  updateSource: (id: string, patch: Partial<ResearchSource>) => Promise<void>;
  deleteSource: (id: string) => Promise<void>;
  save: (pack: ResearchPack) => Promise<void>;
  reload: () => Promise<void>;
}

function newSourceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `src-${crypto.randomUUID()}`;
  }
  return `src-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useResearch({ scriptId }: UseResearchArgs): UseResearchReturn {
  const repoRef = useRef<ResearchRepository | null>(null);
  if (!repoRef.current) {
    repoRef.current = getRepositoryBundle().research;
  }
  const repository = repoRef.current;

  const [pack, setPack] = useState<ResearchPack | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!scriptId) {
      setPack(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const loaded = await repository.get(scriptId);
      setPack(loaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi đọc research pack');
      setPack(null);
    } finally {
      setIsLoading(false);
    }
  }, [repository, scriptId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (next: ResearchPack) => {
      if (!scriptId) return;
      try {
        await repository.save(scriptId, next);
        setPack(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Lỗi lưu research pack');
      }
    },
    [repository, scriptId],
  );

  const addSource = useCallback(
    async (input: Omit<ResearchSource, 'id'>) => {
      const current: ResearchPack = pack ?? createEmptyResearchPack();
      const next: ResearchPack = {
        ...current,
        sources: [...current.sources, { ...input, id: newSourceId() }],
      };
      await save(next);
    },
    [pack, save],
  );

  const updateSource = useCallback(
    async (id: string, patch: Partial<ResearchSource>) => {
      const current: ResearchPack = pack ?? createEmptyResearchPack();
      const next: ResearchPack = {
        ...current,
        sources: current.sources.map((s) =>
          s.id === id ? { ...s, ...patch } : s,
        ),
      };
      await save(next);
    },
    [pack, save],
  );

  const deleteSource = useCallback(
    async (id: string) => {
      const current: ResearchPack = pack ?? createEmptyResearchPack();
      const next: ResearchPack = {
        ...current,
        sources: current.sources.filter((s) => s.id !== id),
        // Cleanup claim sourceIds.
        claims: current.claims.map((c) => ({
          ...c,
          sourceIds: c.sourceIds.filter((sid) => sid !== id),
        })),
      };
      await save(next);
    },
    [pack, save],
  );

  return {
    pack,
    isLoading,
    error,
    addSource,
    updateSource,
    deleteSource,
    save,
    reload,
  };
}

/**
 * Helper: validate source input.
 */
export function isValidSourceType(s: string): s is SourceType {
  return ['article', 'report', 'data', 'expert', 'book', 'other'].includes(s);
}