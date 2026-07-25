/**
 * Render ScriptDocument sang nhiều format khác nhau.
 * Phase 4.6: Markdown, TTS-clean text, JSON backup, Excel, Scene board,
 * Visual prompt file, YouTube metadata.
 *
 * Mỗi renderer là pure function. Trả về string cho text formats, object cho
 * structured formats.
 */
import type { ScriptDocument } from './ScriptDocument';
import type { Calculation } from './Calculator';
import { renderCalculationNarration } from './Calculator';
import type { ResearchPack } from './ResearchPack';

// --- Markdown (preview) ---

export function renderMarkdown(doc: ScriptDocument): string {
  if (doc.scenes && doc.scenes.length > 0) {
    // Render từ scenes có cấu trúc.
    return doc.scenes
      .map((s) => {
        const title = s.title || `Phần ${s.order + 1}`;
        const lines: string[] = [];
        lines.push(`## ${title}`);
        if (s.onScreenText) lines.push(`> **${s.onScreenText}**`);
        if (s.narration) lines.push(s.narration);
        if (s.visualNotes) lines.push(`*Visual:* ${s.visualNotes}`);
        if (s.audioNotes) lines.push(`*Audio:* ${s.audioNotes}`);
        return lines.join('\n\n');
      })
      .join('\n\n');
  }
  // Fallback: dùng script field (Markdown cũ).
  return doc.script;
}

// --- TTS-clean text ---

/**
 * Strip tất cả metadata cho TTS: chỉ giữ narration, xoá visual/audio notes,
 * on-screen text, claim IDs, markdown syntax.
 */
export function renderTtsClean(doc: ScriptDocument): string {
  if (doc.scenes && doc.scenes.length > 0) {
    return doc.scenes
      .filter((s) => s.narration.trim().length > 0)
      .map((s) => s.narration)
      .join('\n\n');
  }
  // Fallback: best-effort strip markdown từ script field.
  return doc.script
    .replace(/^#+\s+.*$/gm, '') // tiêu đề
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/\[Visual\].*$/gm, '')
    .replace(/\[Audio\].*$/gm, '')
    .replace(/\[Camera\].*$/gm, '')
    .replace(/\[SFX\].*$/gm, '')
    .replace(/^>.*$/gm, '') // blockquote
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// --- JSON backup ---

export interface ScriptDocumentBackup {
  format: 'json-backup';
  schemaVersion: number;
  exportedAt: number;
  document: ScriptDocument;
  /**
   * Snapshot research + claims + calculations.
   */
  research?: ResearchPack;
  calculations?: Calculation[];
}

export function buildJsonBackup(input: {
  document: ScriptDocument;
  research?: ResearchPack;
  calculations?: Calculation[];
}): ScriptDocumentBackup {
  return {
    format: 'json-backup',
    schemaVersion: input.document.schemaVersion,
    exportedAt: Date.now(),
    document: input.document,
    research: input.research,
    calculations: input.calculations,
  };
}

// --- Scene board (cho editor/preview) ---

export interface SceneBoardItem {
  sceneId: string;
  order: number;
  kind: SceneKind;
  title: string;
  narrationPreview: string;
  hasVisualNotes: boolean;
  hasAudioNotes: boolean;
  hasOnScreenText: boolean;
  claimCount: number;
  calculationCount: number;
}

export function renderSceneBoard(doc: ScriptDocument): SceneBoardItem[] {
  if (!doc.scenes) return [];
  return doc.scenes.map((s) => ({
    sceneId: s.id,
    order: s.order,
    kind: s.kind,
    title: s.title || `Phần ${s.order + 1}`,
    narrationPreview: s.narration.slice(0, 120),
    hasVisualNotes: s.visualNotes.length > 0,
    hasAudioNotes: s.audioNotes.length > 0,
    hasOnScreenText: s.onScreenText.length > 0,
    claimCount: s.claimIds.length,
    calculationCount: s.calculationIds.length,
  }));
}

import type { SceneKind } from './Scene';

// --- Visual prompt file ---

export interface VisualPromptFile {
  format: 'visual-prompts';
  schemaVersion: number;
  documentTitle: string;
  prompts: Array<{
    sceneId: string;
    sceneTitle: string;
    englishPrompt: string;
    visualNotes: string;
  }>;
}

export function buildVisualPromptFile(doc: ScriptDocument): VisualPromptFile {
  const prompts = (doc.scenes ?? [])
    .filter((s) => s.imagePrompt || s.visualNotes)
    .map((s) => ({
      sceneId: s.id,
      sceneTitle: s.title || `Phần ${s.order + 1}`,
      englishPrompt: s.imagePrompt ?? s.visualNotes,
      visualNotes: s.visualNotes,
    }));
  return {
    format: 'visual-prompts',
    schemaVersion: 1,
    documentTitle: doc.title,
    prompts,
  };
}

// --- YouTube metadata ---

export interface YouTubeMetadata {
  format: 'youtube-metadata';
  schemaVersion: number;
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
  categoryId: string;
  language: string;
  defaultAudioLanguage: string;
}

export function buildYouTubeMetadata(input: {
  document: ScriptDocument;
  keywordsCsv: string;
  briefDescription?: string;
}): YouTubeMetadata {
  const { document, keywordsCsv, briefDescription } = input;
  const tags = keywordsCsv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const descriptionLines: string[] = [];
  descriptionLines.push(document.brief?.cta || 'Chú Que Tài Chính — nơi chúng ta nói về tiền bạc theo cách thẳng thật và dễ hiểu nhất.');
  if (briefDescription) descriptionLines.push('');
  if (briefDescription) descriptionLines.push(briefDescription);
  descriptionLines.push('');
  descriptionLines.push('#taichinhcanhan #chutaichinh #tailonnhat');
  descriptionLines.push('');
  descriptionLines.push('—');
  descriptionLines.push('Disclaimer: Nội dung chỉ mang tính chia sẻ kiến thức, không phải tư vấn đầu tư. Mọi quyết định tài chính cần được đánh giá kỹ lưỡng theo hoàn cảnh cá nhân.');

  return {
    format: 'youtube-metadata',
    schemaVersion: 1,
    title: document.title,
    description: descriptionLines.join('\n'),
    tags,
    hashtags: ['#taichinhcanhan', '#chutaichinh', '#tailonnhat'],
    categoryId: '27', // Education
    language: 'vi',
    defaultAudioLanguage: 'vi-VN',
  };
}

// --- Excel/CSV (đơn giản: scene + narration cho upload lên Sheets) ---

export function buildScenesCsv(doc: ScriptDocument): string {
  const scenes = doc.scenes ?? [];
  const headers = ['Order', 'Kind', 'Title', 'Narration', 'Visual Notes', 'Audio Notes', 'On-Screen Text'];
  const rows = scenes.map((s) => [
    String(s.order),
    s.kind,
    escapeCsv(s.title),
    escapeCsv(s.narration),
    escapeCsv(s.visualNotes),
    escapeCsv(s.audioNotes),
    escapeCsv(s.onScreenText),
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function escapeCsv(s: string): string {
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Helper: build tất cả output formats cho 1 document, trả về object.
 */
export function renderAll(input: {
  document: ScriptDocument;
  research?: ResearchPack;
  calculations?: Calculation[];
  keywordsCsv?: string;
  briefDescription?: string;
}): {
  markdown: string;
  ttsClean: string;
  jsonBackup: ScriptDocumentBackup;
  sceneBoard: SceneBoardItem[];
  visualPromptFile: VisualPromptFile;
  youtubeMetadata: YouTubeMetadata;
  scenesCsv: string;
} {
  const { document, research, calculations, keywordsCsv = '', briefDescription } = input;
  return {
    markdown: renderMarkdown(document),
    ttsClean: renderTtsClean(document),
    jsonBackup: buildJsonBackup({ document, research, calculations }),
    sceneBoard: renderSceneBoard(document),
    visualPromptFile: buildVisualPromptFile(document),
    youtubeMetadata: buildYouTubeMetadata({ document, keywordsCsv, briefDescription }),
    scenesCsv: buildScenesCsv(document),
  };
}

/**
 * Helper: build narration với calculation binding (Phase 4.4).
 * Thay thế {{calc:ID}} bằng text đã render từ calculation.
 */
export function bindCalculationsToNarration(
  narration: string,
  calculationsById: Record<string, Calculation>,
): string {
  return narration.replace(/\{\{calc:([^}]+)\}\}/g, (_, id: string) => {
    const calc = calculationsById[id];
    if (!calc) return `[calc:${id} not found]`;
    return renderCalculationNarration(calc);
  });
}