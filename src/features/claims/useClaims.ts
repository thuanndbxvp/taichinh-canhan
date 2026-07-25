import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResearchRepository } from '../../domain/Repository';
import type { ResearchClaim, ClaimStatus, ClaimRisk } from '../../domain/ResearchPack';
import { createEmptyResearchPack } from '../../domain/ResearchPack';
import type { ScriptId } from '../../domain/ScriptDocument';
import { getRepositoryBundle } from '../../domain/repositoryBundle';

export interface UseClaimsArgs {
  scriptId: ScriptId | null;
}

export interface UseClaimsReturn {
  claims: ResearchClaim[];
  isLoading: boolean;
  error: string | null;
  addClaim: (input: Omit<ResearchClaim, 'id'>) => Promise<void>;
  updateClaim: (id: string, patch: Partial<ResearchClaim>) => Promise<void>;
  deleteClaim: (id: string) => Promise<void>;
  reload: () => Promise<void>;
  /**
   * Phase 4: claim lookup helper — dùng cho scene editor (resolve claimIds).
   */
  getClaim: (id: string) => ResearchClaim | undefined;
}

function newClaimId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `cl-${crypto.randomUUID()}`;
  }
  return `cl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useClaims({ scriptId }: UseClaimsArgs): UseClaimsReturn {
  const repoRef = useRef<ResearchRepository | null>(null);
  if (!repoRef.current) {
    repoRef.current = getRepositoryBundle().research;
  }
  const repository = repoRef.current;

  const [claims, setClaims] = useState<ResearchClaim[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!scriptId) {
      setClaims([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const pack = await repository.get(scriptId);
      setClaims(pack?.claims ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi đọc claims');
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  }, [repository, scriptId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const persist = useCallback(
    async (nextClaims: ResearchClaim[]) => {
      if (!scriptId) return;
      try {
        const current = (await repository.get(scriptId)) ?? createEmptyResearchPack();
        await repository.save(scriptId, { ...current, claims: nextClaims });
        setClaims(nextClaims);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Lỗi lưu claims');
      }
    },
    [repository, scriptId],
  );

  const addClaim = useCallback(
    async (input: Omit<ResearchClaim, 'id'>) => {
      const next = [...claims, { ...input, id: newClaimId() }];
      await persist(next);
    },
    [claims, persist],
  );

  const updateClaim = useCallback(
    async (id: string, patch: Partial<ResearchClaim>) => {
      const next = claims.map((c) => (c.id === id ? { ...c, ...patch } : c));
      await persist(next);
    },
    [claims, persist],
  );

  const deleteClaim = useCallback(
    async (id: string) => {
      const next = claims.filter((c) => c.id !== id);
      await persist(next);
    },
    [claims, persist],
  );

  const getClaim = useCallback(
    (id: string) => claims.find((c) => c.id === id),
    [claims],
  );

  return {
    claims,
    isLoading,
    error,
    addClaim,
    updateClaim,
    deleteClaim,
    reload,
    getClaim,
  };
}

/**
 * Helper: validate claim status/risk input.
 */
export function isValidClaimStatus(s: string): s is ClaimStatus {
  return ['unverified', 'verified', 'contested', 'outdated'].includes(s);
}

export function isValidClaimRisk(s: string): s is ClaimRisk {
  return ['low', 'medium', 'high'].includes(s);
}