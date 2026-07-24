import { useCallback, useEffect, useState } from 'react';
import type { AiProvider, SavedIdea, TopicSuggestionItem } from '../../../types';
import { generateKeywordSuggestions, generateTopicSuggestions, parseIdeasFromFile, suggestStyleOptions } from '../../../services/aiService';

const STORAGE_KEY = 'yt-script-saved-ideas';

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
  saveIdea: (idea: TopicSuggestionItem) => void;
  deleteSavedIdea: (id: number) => void;
  loadSavedIdea: (idea: SavedIdea) => { title: string; outlineContent: string };
  clearAll: () => void;
}

export function useIdeaWorkflow({ aiProvider, selectedModel }: UseIdeaWorkflowArgs): UseIdeaWorkflowReturn {
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
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedIdeas(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load saved ideas', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIdeas));
  }, [savedIdeas]);

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
    (idea: TopicSuggestionItem) => {
      setSavedIdeas((prev) => {
        if (prev.some((i) => i.title === idea.title)) return prev;
        return [
          { id: Date.now(), title: idea.title, vietnameseTitle: idea.vietnameseTitle, outline: idea.outline },
          ...prev,
        ];
      });
    },
    [],
  );

  const deleteSavedIdea = useCallback((id: number) => {
    setSavedIdeas((prev) => prev.filter((i) => i.id !== id));
  }, []);

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
  };
}
