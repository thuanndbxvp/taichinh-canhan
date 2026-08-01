
// Ngôn ngữ/giọng điệu mặc định cho Finance Content Studio (Chú Que persona).
// Chú Que Tài Chính — chỉ giữ 4 tông giọng cốt lõi phục vụ nhân vật.
/// <reference types="vite/client" />
export type Expression =
  | 'Empathetic'
  | 'Conversational'
  | 'Authoritative'
  | 'Analytical';

// Chú Que Tài Chính — 4 phong cách viết gắn với DNA kênh.
export type Style =
  | 'Narrative'
  | 'Analytical'
  | 'Storytelling'
  | 'Educational';
export type ScriptType = 'Video' | 'Podcast';
export type NumberOfSpeakers = 'Auto' | '2' | '3' | '4' | '5';
export type AiProvider = 'kyma' | 'openai';
export type ScenarioType = 'finance';

// Options interfaces
export interface StyleOptions {
  expression: Expression;
  style: Style;
}

// Data structures
export interface TopicSuggestionItem {
    title: string;
    vietnameseTitle?: string;
    outline: string;
    category?: string;
    branch?: string;
    hook?: string;
}

export interface SavedIdea {
  id: number;
  title: string;
  vietnameseTitle?: string;
  outline: string;
}

export interface CachedData {
  visualPrompts: Record<string, VisualPrompt>;
  allVisualPrompts: AllVisualPromptsResult[] | null;
  summarizedScript: ScriptPartSummary[] | null;
  extractedDialogue: Record<string, string> | null;
  hasExtractedDialogue: boolean;
  hasGeneratedAllVisualPrompts: boolean;
  hasSummarizedScript: boolean;
}

export interface LibraryItem {
  id: number;
  savedAt: number;
  title: string;
  outlineContent: string;
  script: string;
  cachedData?: CachedData;
}

export interface GenerationParams {
  title: string;
  outlineContent: string;
  targetAudience: string;
  styleOptions: StyleOptions;
  keywords: string;
  wordCount: string;
  scriptType: ScriptType;
  numberOfSpeakers: NumberOfSpeakers;
  isFinanceMode?: boolean; // Flag for specialized finance mode
  scriptStyle?: string; // e.g. "auto", "analytical", "psychology", "mythbusting", "listicle"
  scriptHook?: string;  // e.g. "auto", "story", "data", "myth", "question"
  macroContext?: string; // Dữ liệu vĩ mô thật lấy từ web
}

export interface VisualPrompt {
    english: string;
    vietnamese: string;
}

export interface AllVisualPromptsResult {
    scene: string;
    english: string;
    vietnamese: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface SceneSummary {
  sceneNumber: number;
  summary: string;
  imagePrompt: string;
  videoPrompt: string;
}

export interface ScriptPartSummary {
  partTitle: string;
  scenes: SceneSummary[];
}

export interface WordCountStats {
  sections: { title: string; count: number }[];
  total: number;
}

export interface SummarizeConfig {
  numberOfPrompts: 'auto' | number;
  includeNarration: boolean;
  scenarioType: ScenarioType;
  referenceImages?: string[];
}

// Vite-specific: khai báo module cho cú pháp import file thô (?raw).
// Đã được xử lý bằng `/// <reference types="vite/client" />` ở đầu file.


