import { useCallback, useEffect, useRef, useState } from 'react';
import type { AiProvider, SavedIdea, TopicSuggestionItem } from '../../../types';
import { generateKeywordSuggestions, generateTopicSuggestions, parseIdeasFromFile, suggestStyleOptions } from '../../../services/aiService';
import type { SettingsRepository } from '../../domain/Repository';
import { getRepositoryBundle } from '../../domain/repositoryBundle';

const LEGACY_STORAGE_KEY = 'yt-script-saved-ideas';

export interface UseIdeaWorkflowArgs {
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseIdeaWorkflowReturn {
  topicSuggestions: TopicSuggestionItem[];
  isSuggesting: boolean;
  suggestionError: string | null;
  hasGeneratedTopicSuggestions: boolean;
  uploadedIdeas: TopicSuggestionItem[];
  isParsing: boolean;
  parsingError: string | null;
  keywordSuggestions: string[];
  isSuggestingKeywords: boolean;
  keywordSuggestionError: string | null;
  hasGeneratedKeywordSuggestions: boolean;
  isSuggestingStyle: boolean;
  styleSuggestionError: string | null;
  hasSuggestedStyle: boolean;
  savedIdeas: SavedIdea[];
  generateSuggestions: (title: string) => Promise<void>;
  parseFile: (content: string) => Promise<void>;
  generateKeywordSuggestions: (title: string) => Promise<void>;
  suggestStyle: (title: string) => Promise<void>;
  saveIdea: (idea: TopicSuggestionItem) => Promise<void>;
  deleteSavedIdea: (id: number) => Promise<void>;
  loadSavedIdea: (idea: SavedIdea) => { title: string; outlineContent: string };
  clearAll: () => void;
  /**
   * Phase 3: truy cập SettingsRepository (cho component cần patch).
   */
  settings: SettingsRepository;
}

export function useIdeaWorkflow({ aiProvider, selectedModel }: UseIdeaWorkflowArgs): UseIdeaWorkflowReturn {
  const settingsRef = useRef<SettingsRepository | null>(null);
  if (!settingsRef.current) {
    settingsRef.current = getRepositoryBundle().settings;
  }
  const settings = settingsRef.current;

  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestionItem[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [hasGeneratedTopicSuggestions, setHasGeneratedTopicSuggestions] = useState<boolean>(false);

  const [uploadedIdeas, setUploadedIdeas] = useState<TopicSuggestionItem[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsingError, setParsingError] = useState<string | null>(null);

  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [isSuggestingKeywords, setIsSuggestingKeywords] = useState<boolean>(false);
  const [keywordSuggestionError, setKeywordSuggestionError] = useState<string | null>(null);
  const [hasGeneratedKeywordSuggestions, setHasGeneratedKeywordSuggestions] = useState<boolean>(false);

  const [isSuggestingStyle, setIsSuggestingStyle] = useState<boolean>(false);
  const [styleSuggestionError, setStyleSuggestionError] = useState<string | null>(null);
  const [hasSuggestedStyle, setHasSuggestedStyle] = useState<boolean>(false);

  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Phase 3: thử đọc từ SettingsRepository trước (schema mới),
      // fallback legacy localStorage.
      try {
        const appSettings = await settings.get();
        if (appSettings.savedIdeas && appSettings.savedIdeas.length > 0) {
          if (!cancelled) {
            setSavedIdeas(
              appSettings.savedIdeas.map((s) => ({
                id: hashIdToNumber(s.id),
                title: s.title,
                outline: s.outline,
              })),
            );
          }
          return;
        }
      } catch (e) {
        console.error('[useIdeaWorkflow] load settings failed:', e);
      }
      // Fallback: legacy localStorage.
      try {
        const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed: unknown = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSavedIdeas(parsed as SavedIdea[]);
          }
        }
      } catch (e) {
        console.error('[useIdeaWorkflow] legacy load failed:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [settings]);

  const persistSavedIdeas = useCallback(
    async (ideas: SavedIdea[]) => {
      // Phase 3: persist qua SettingsRepository (id là string).
      try {
        await settings.patch({
          savedIdeas: ideas.map((i) => ({
            id: hashNumberToId(i.id),
            title: i.title,
            outline: i.outline,
            savedAt: Date.now(),
          })),
        });
      } catch (e) {
        console.error('[useIdeaWorkflow] persist failed:', e);
      }
    },
    [settings],
  );

  const generateSuggestions = useCallback(
    async (title: string) => {
      if (!title.trim()) return;
      setIsSuggesting(true);
      setSuggestionError(null);
      try {
        const items = await generateTopicSuggestions(title, aiProvider, selectedModel);
        setTopicSuggestions(items);
        setHasGeneratedTopicSuggestions(true);
      } catch (err) {
        setSuggestionError(err instanceof Error ? err.message : 'Lỗi tạo gợi ý.');
      } finally {
        setIsSuggesting(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const parseFile = useCallback(
    async (content: string) => {
      setIsParsing(true);
      setParsingError(null);
      try {
        const items = await parseIdeasFromFile(content, aiProvider, selectedModel);
        setUploadedIdeas(items);
      } catch (err) {
        setParsingError(err instanceof Error ? err.message : 'Lỗi đọc file ý tưởng.');
      } finally {
        setIsParsing(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const generateKeywordSuggestionsLocal = useCallback(
    async (title: string) => {
      if (!title.trim()) return;
      setIsSuggestingKeywords(true);
      setKeywordSuggestionError(null);
      try {
        const items = await generateKeywordSuggestions(title, aiProvider, selectedModel);
        setKeywordSuggestions(items);
        setHasGeneratedKeywordSuggestions(true);
      } catch (err) {
        setKeywordSuggestionError(err instanceof Error ? err.message : 'Lỗi gợi ý từ khóa.');
      } finally {
        setIsSuggestingKeywords(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const suggestStyle = useCallback(
    async (title: string) => {
      if (!title.trim()) return;
      setIsSuggestingStyle(true);
      setStyleSuggestionError(null);
      try {
        await suggestStyleOptions(title, aiProvider, selectedModel);
        setHasSuggestedStyle(true);
      } catch (err) {
        setStyleSuggestionError(err instanceof Error ? err.message : 'Lỗi gợi ý phong cách.');
      } finally {
        setIsSuggestingStyle(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const saveIdea = useCallback(
    async (idea: TopicSuggestionItem) => {
      let next: SavedIdea[] = [];
      setSavedIdeas((prev) => {
        if (prev.some((i) => i.title === idea.title)) {
          next = prev;
          return prev;
        }
        next = [
          { id: Date.now(), title: idea.title, vietnameseTitle: idea.vietnameseTitle, outline: idea.outline },
          ...prev,
        ];
        return next;
      });
      await persistSavedIdeas(next);
    },
    [persistSavedIdeas],
  );

  const deleteSavedIdea = useCallback(
    async (id: number) => {
      let next: SavedIdea[] = [];
      setSavedIdeas((prev) => {
        next = prev.filter((i) => i.id !== id);
        return next;
      });
      await persistSavedIdeas(next);
    },
    [persistSavedIdeas],
  );

  const loadSavedIdea = useCallback((idea: SavedIdea) => {
    return { title: idea.title, outlineContent: idea.outline };
  }, []);

  const clearAll = useCallback(() => {
    setTopicSuggestions([]);
    setUploadedIdeas([]);
    setKeywordSuggestions([]);
    setHasGeneratedTopicSuggestions(false);
    setHasGeneratedKeywordSuggestions(false);
    setHasSuggestedStyle(false);
  }, []);

  return {
    topicSuggestions,
    isSuggesting,
    suggestionError,
    hasGeneratedTopicSuggestions,
    uploadedIdeas,
    isParsing,
    parsingError,
    keywordSuggestions,
    isSuggestingKeywords,
    keywordSuggestionError,
    hasGeneratedKeywordSuggestions,
    isSuggestingStyle,
    styleSuggestionError,
    hasSuggestedStyle,
    savedIdeas,
    generateSuggestions,
    parseFile,
    generateKeywordSuggestions: generateKeywordSuggestionsLocal,
    suggestStyle,
    saveIdea,
    deleteSavedIdea,
    loadSavedIdea,
    clearAll,
    settings,
  };
}

// Helper: convert giữa string id (SettingsRepository) và number id (UI cũ).
function hashIdToNumber(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function hashNumberToId(num: number): string {
  return `idea-${num.toString(36)}`;
}
