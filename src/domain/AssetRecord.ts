/**
 * AssetRecord — domain model cho asset sinh ra từ AI (visual prompt, video
 * prompt, scene summary, dialogue).
 *
 * Tách khỏi ScriptDocument.assets (in-document) để có thể:
 *   - Chia sẻ asset giữa nhiều document (vd: 1 visual prompt cho nhiều video).
 *   - Lưu vào IndexedDB riêng (cache lớn, không phình document).
 *   - Cache key ổn định (Phase 3.5).
 */
import type { ScriptId } from './ScriptDocument';

export const ASSET_SCHEMA_VERSION = 1;

export type AssetKind =
  | 'visual-prompt'
  | 'video-prompt'
  | 'all-visual-prompts'
  | 'scene-summary'
  | 'dialogue';

export interface AssetRecord {
  schemaVersion: number;
  id: string;
  kind: AssetKind;
  /**
   * Document gốc. Optional — asset có thể là global cache.
   */
  scriptId?: ScriptId;
  /**
   * Scene id nếu asset là per-scene. Bắt buộc cho visual-prompt/video-prompt.
   */
  sceneId?: string;
  /**
   * Provider/model/promptVersion đã dùng.
   */
  provider: string;
  model: string;
  promptVersion: string;
  /**
   * Hash của input để cache key ổn định.
   */
  contentHash: string;
  /**
   * Payload JSON-serializable.
   */
  payload: unknown;
  createdAt: number;
}

export function newAssetId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `a-${crypto.randomUUID()}`;
  }
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}