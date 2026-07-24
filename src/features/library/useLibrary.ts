import { useCallback, useEffect, useState } from 'react';
import type { LibraryItem } from '../../../types';
import { downloadLibrary, parseLibraryImport } from '../../lib/libraryIo';

const STORAGE_KEY = 'yt-script-library';

export interface UseLibraryReturn {
  library: LibraryItem[];
  saveCurrent: (input: { title: string; outlineContent: string; script: string }) => boolean;
  loadItem: (item: LibraryItem) => { title: string; outlineContent: string; script: string };
  removeItem: (id: number) => void;
  exportAll: () => void;
  importFromText: (text: string) => Promise<ImportResult>;
  importFromFile: (file: File) => Promise<ImportResult>;
  hasSaved: boolean;
  setHasSaved: (v: boolean) => void;
}

export interface ImportResult {
  imported: number;
  warnings: string[];
}

export function useLibrary(): UseLibraryReturn {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLibrary(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load library', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  const saveCurrent = useCallback(
    (input: { title: string; outlineContent: string; script: string }) => {
      if (!input.script.trim() || !input.title.trim()) return false;
      const now = Date.now();
      const newItem: LibraryItem = {
        id: now,
        savedAt: now,
        title: input.title,
        outlineContent: input.outlineContent,
        script: input.script,
      };
      setLibrary((prev) => [newItem, ...prev]);
      setHasSaved(true);
      return true;
    },
    [],
  );

  const loadItem = useCallback((item: LibraryItem) => {
    setHasSaved(true);
    return {
      title: item.title,
      outlineContent: item.outlineContent,
      script: item.script,
    };
  }, []);

  const removeItem = useCallback((id: number) => {
    setLibrary((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const exportAll = useCallback(() => {
    downloadLibrary(library);
  }, [library]);

  const importFromText = useCallback(async (text: string): Promise<ImportResult> => {
    const result = parseLibraryImport(text);
    setLibrary((prev) => [...result.items, ...prev]);
    setHasSaved(true);
    return { imported: result.items.length, warnings: result.warnings };
  }, []);

  const importFromFile = useCallback(async (file: File): Promise<ImportResult> => {
    const text = await file.text();
    return importFromText(text);
  }, [importFromText]);

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
  };
}
