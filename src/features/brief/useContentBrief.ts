import { useCallback, useMemo, useState } from 'react';
import type {
  Expression,
  NumberOfSpeakers,
  ScriptType,
  Style,
  StyleOptions,
} from '../../../types';
import { APP_BRAND } from '../../../constants';

export interface ContentBrief {
  title: string;
  outlineContent: string;
  targetAudience: string;
  styleOptions: StyleOptions;
  keywords: string;
  wordCount: string;
  scriptType: ScriptType;
  numberOfSpeakers: NumberOfSpeakers;
  lengthType: 'words' | 'duration';
  videoDuration: string;
  isFinanceMode: boolean;
}

export interface ContentBriefPatch {
  title?: string;
  outlineContent?: string;
  targetAudience?: string;
  styleOptions?: StyleOptions;
  keywords?: string;
  wordCount?: string;
  scriptType?: ScriptType;
  numberOfSpeakers?: NumberOfSpeakers;
  lengthType?: 'words' | 'duration';
  videoDuration?: string;
  isFinanceMode?: boolean;
}

// Chú Que Tài Chính — chỉ một style mặc định phục vụ nhân vật.
const FINANCE_STYLE: StyleOptions = { expression: 'Empathetic', style: 'Storytelling' };

const DEFAULT_BRIEF: ContentBrief = {
  title: '',
  outlineContent: '',
  targetAudience: APP_BRAND.defaultLanguage,
  styleOptions: FINANCE_STYLE,
  keywords: '',
  wordCount: '1200',
  scriptType: 'Video',
  numberOfSpeakers: 'Auto',
  lengthType: 'words',
  videoDuration: '8',
  isFinanceMode: true,
};

/**
 * useContentBrief — gom state brief đầu vào và các setter tương ứng.
 * Một đối tượng brief duy nhất thay vì rải state trên App.tsx.
 *
 * Phase 1: tinh gọn state, chưa đụng vào schema domain.
 */
export function useContentBrief(initial?: ContentBriefPatch) {
  const [brief, setBrief] = useState<ContentBrief>({ ...DEFAULT_BRIEF, ...initial });

  const patch = useCallback((p: ContentBriefPatch) => {
    setBrief((prev) => ({ ...prev, ...p }));
  }, []);

  const setTitle = useCallback((title: string) => patch({ title }), [patch]);
  const setOutlineContent = useCallback((outlineContent: string) => patch({ outlineContent }), [patch]);
  const setTargetAudience = useCallback((targetAudience: string) => patch({ targetAudience }), [patch]);
  const setStyleOptions = useCallback((styleOptions: StyleOptions) => patch({ styleOptions }), [patch]);
  const setKeywords = useCallback((keywords: string) => patch({ keywords }), [patch]);
  const setWordCount = useCallback((wordCount: string) => patch({ wordCount }), [patch]);
  const setScriptType = useCallback((scriptType: ScriptType) => patch({ scriptType }), [patch]);
  const setNumberOfSpeakers = useCallback((numberOfSpeakers: NumberOfSpeakers) => patch({ numberOfSpeakers }), [patch]);
  const setLengthType = useCallback((lengthType: 'words' | 'duration') => patch({ lengthType }), [patch]);
  const setVideoDuration = useCallback((videoDuration: string) => patch({ videoDuration }), [patch]);
  const setIsFinanceMode = useCallback(() => {
    // App chỉ phục vụ "Chú Que Tài Chính" — finance mode là cố định.
    // Giữ API để tương thích component cũ nhưng luôn ép về true.
    setBrief((prev) => ({
      ...prev,
      isFinanceMode: true,
      styleOptions: FINANCE_STYLE,
      targetAudience: 'Vietnamese',
      wordCount: '1200',
      videoDuration: '8',
    }));
  }, []);

  const reset = useCallback(() => setBrief(DEFAULT_BRIEF), []);

  const effectiveTargetWordCount = useMemo(() => {
    if (brief.lengthType === 'duration') {
      const minutes = Math.max(0, parseInt(brief.videoDuration || '0', 10));
      return (minutes * 150).toString();
    }
    return brief.wordCount;
  }, [brief.lengthType, brief.videoDuration, brief.wordCount]);

  return {
    brief,
    patch,
    reset,
    setTitle,
    setOutlineContent,
    setTargetAudience,
    setStyleOptions,
    setKeywords,
    setWordCount,
    setScriptType,
    setNumberOfSpeakers,
    setLengthType,
    setVideoDuration,
    setIsFinanceMode,
    effectiveTargetWordCount,
  };
}

export type { Expression, Style };
