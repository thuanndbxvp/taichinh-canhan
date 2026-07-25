import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScriptRepository } from '../../domain/Repository';
import type { Scene, SceneKind } from '../../domain/Scene';
import { createBlankScene, newSceneId } from '../../domain/Scene';
import type { ScriptDocument, ScriptId } from '../../domain/ScriptDocument';
import { getRepositoryBundle } from '../../domain/repositoryBundle';

export interface UseSceneEditorArgs {
  scriptId: ScriptId | null;
  /**
   * Initial scenes (nếu chưa load từ repo).
   */
  initialScenes?: Scene[];
}

export interface UseSceneEditorReturn {
  scenes: Scene[];
  isLoading: boolean;
  error: string | null;
  addScene: (kind?: SceneKind) => Promise<void>;
  updateScene: (id: string, patch: Partial<Scene>) => Promise<void>;
  deleteScene: (id: string) => Promise<void>;
  reorderScene: (id: string, newOrder: number) => Promise<void>;
  linkClaim: (sceneId: string, claimId: string) => Promise<void>;
  unlinkClaim: (sceneId: string, claimId: string) => Promise<void>;
  linkCalculation: (sceneId: string, calcId: string) => Promise<void>;
  unlinkCalculation: (sceneId: string, calcId: string) => Promise<void>;
  reload: () => Promise<void>;
}

export function useSceneEditor({ scriptId, initialScenes }: UseSceneEditorArgs): UseSceneEditorReturn {
  const repoRef = useRef<ScriptRepository | null>(null);
  if (!repoRef.current) {
    repoRef.current = getRepositoryBundle().scripts;
  }
  const repository = repoRef.current;

  const [scenes, setScenes] = useState<Scene[]>(initialScenes ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!scriptId) {
      setScenes(initialScenes ?? []);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const doc: ScriptDocument | null = await repository.get(scriptId);
      setScenes(doc?.scenes ?? initialScenes ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi đọc scenes');
    } finally {
      setIsLoading(false);
    }
  }, [repository, scriptId, initialScenes]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const persist = useCallback(
    async (nextScenes: Scene[]) => {
      if (!scriptId) {
        setScenes(nextScenes);
        return;
      }
      try {
        const doc = await repository.get(scriptId);
        if (!doc) return;
        await repository.save({ ...doc, scenes: nextScenes });
        setScenes(nextScenes);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Lỗi lưu scenes');
      }
    },
    [repository, scriptId],
  );

  const addScene = useCallback(
    async (kind: SceneKind = 'context') => {
      const order = scenes.length;
      const next = [...scenes, createBlankScene(order, kind)];
      await persist(next);
    },
    [scenes, persist],
  );

  const updateScene = useCallback(
    async (id: string, patch: Partial<Scene>) => {
      const next = scenes.map((s) => (s.id === id ? { ...s, ...patch } : s));
      await persist(next);
    },
    [scenes, persist],
  );

  const deleteScene = useCallback(
    async (id: string) => {
      const next = scenes.filter((s) => s.id !== id);
      // Re-number order để liên tục 0..n-1.
      const renumbered = next.map((s, idx) => ({ ...s, order: idx }));
      await persist(renumbered);
    },
    [scenes, persist],
  );

  const reorderScene = useCallback(
    async (id: string, newOrder: number) => {
      const target = scenes.find((s) => s.id === id);
      if (!target) return;
      const others = scenes.filter((s) => s.id !== id);
      const clamped = Math.max(0, Math.min(others.length, newOrder));
      const reordered = [
        ...others.slice(0, clamped),
        { ...target, order: clamped },
        ...others.slice(clamped),
      ].map((s, idx) => ({ ...s, order: idx }));
      await persist(reordered);
    },
    [scenes, persist],
  );

  const linkClaim = useCallback(
    async (sceneId: string, claimId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      if (scene.claimIds.includes(claimId)) return;
      await updateScene(sceneId, { claimIds: [...scene.claimIds, claimId] });
    },
    [scenes, updateScene],
  );

  const unlinkClaim = useCallback(
    async (sceneId: string, claimId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      await updateScene(sceneId, { claimIds: scene.claimIds.filter((c) => c !== claimId) });
    },
    [scenes, updateScene],
  );

  const linkCalculation = useCallback(
    async (sceneId: string, calcId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      if (scene.calculationIds.includes(calcId)) return;
      await updateScene(sceneId, { calculationIds: [...scene.calculationIds, calcId] });
    },
    [scenes, updateScene],
  );

  const unlinkCalculation = useCallback(
    async (sceneId: string, calcId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      await updateScene(sceneId, {
        calculationIds: scene.calculationIds.filter((c) => c !== calcId),
      });
    },
    [scenes, updateScene],
  );

  return {
    scenes,
    isLoading,
    error,
    addScene,
    updateScene,
    deleteScene,
    reorderScene,
    linkClaim,
    unlinkClaim,
    linkCalculation,
    unlinkCalculation,
    reload,
  };
}

// Export helper để UI tạo scene inline nếu cần.
export { createBlankScene, newSceneId };