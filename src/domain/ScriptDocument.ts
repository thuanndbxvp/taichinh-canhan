/**
 * ScriptDocument — domain model cho 1 kịch bản đã lưu.
 * Đây là superset của LibraryItem cũ:
 *   - Thêm schemaVersion + id dạng string (UUID-friendly).
 *   - Thêm metadata (tags, language, audience, wordCount).
 *   - Thêm cache slots gắn với cacheKey ổn định (Phase 3.5).
 *   - Lưu được cả ScriptDocument lớn trong IndexedDB.
 *   - Phase 4: thêm brief (ContentBrief), scenes (Scene[]), claims (link),
 *     calculations (link), research (link).
 *
 * Migration: LibraryItem cũ → ScriptDocument qua `migrateLibraryItemToDocument`.
 * Không phá tương thích: load file JSON cũ vẫn đọc được.
 */
import type { CachedData, StyleOptions } from '../../types';
import type { ContentBrief } from './ContentBrief';
import type { Scene } from './Scene';

export const SCRIPT_DOCUMENT_SCHEMA_VERSION = 3;

/**
 * Domain id: dùng crypto.randomUUID() trong browser, fallback Date.now() cho test.
 */
export type ScriptId = string;

/**
 * Cache slot gắn với cacheKey (Phase 3.5) — không phụ thuộc vào section string
 * không ổn định nữa.
 */
export interface ScriptAssetSlot {
  /**
   * cacheKey ổn định: hash của (documentId + documentVersion + sceneId +
   * provider + model + promptVersion + contentHash).
   */
  cacheKey: string;
  /**
   * Loại asset: 'visual-prompt' | 'video-prompt' | 'all-visual-prompts' |
   * 'scene-summary' | 'dialogue'.
   */
  kind: 'visual-prompt' | 'video-prompt' | 'all-visual-prompts' | 'scene-summary' | 'dialogue';
  /**
   * Payload JSON-serializable.
   */
  payload: unknown;
  /**
   * Provider + model + promptVersion đã dùng để sinh asset.
   */
  provider: string;
  model: string;
  promptVersion: string;
  createdAt: number;
}

export interface ScriptDocumentMetadata {
  language?: string;
  audience?: string;
  wordCount?: string;
  scriptType?: string;
  tags?: string[];
  /**
   * Snapshot styleOptions lúc save — để reproducibility / cache key derivation.
   */
  styleOptions?: StyleOptions;
}

export interface ScriptDocument {
  schemaVersion: number;
  id: ScriptId;
  title: string;
  outlineContent: string;
  script: string;
  /**
   * Optional cache cũ (LibraryItem.cachedData) — giữ để tương thích ngược.
   */
  cachedData?: CachedData;
  /**
   * Cache slots mới (Phase 3) — gắn cacheKey ổn định.
   */
  assets?: ScriptAssetSlot[];
  /**
   * Metadata tuỳ chọn.
   */
  metadata?: ScriptDocumentMetadata;
  /**
   * Phase 4: ContentBrief có cấu trúc. Optional để giữ tương thích với
   * LibraryItem cũ không có brief.
   */
  brief?: ContentBrief;
  /**
   * Phase 4: danh sách scene có cấu trúc. Optional.
   */
  scenes?: Scene[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Sinh id ổn định. Trong browser dùng crypto.randomUUID, fallback cho test.
 */
export function newScriptId(): ScriptId {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random.
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Factory tạo ScriptDocument mới từ input người dùng.
 */
export function createScriptDocument(input: {
  title: string;
  outlineContent: string;
  script: string;
  metadata?: ScriptDocumentMetadata;
  cachedData?: CachedData;
  brief?: ContentBrief;
  scenes?: Scene[];
}): ScriptDocument {
  const now = Date.now();
  return {
    schemaVersion: SCRIPT_DOCUMENT_SCHEMA_VERSION,
    id: newScriptId(),
    title: input.title,
    outlineContent: input.outlineContent,
    script: input.script,
    cachedData: input.cachedData,
    assets: [],
    metadata: input.metadata,
    brief: input.brief,
    scenes: input.scenes,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Shape của LibraryItem cũ (schemaVersion: 1 hoặc undefined).
 * Dùng để migration.
 */
interface LegacyLibraryItem {
  id?: number | string;
  savedAt?: number;
  title?: string;
  outlineContent?: string;
  script?: string;
  cachedData?: CachedData;
  // Cho phép một số field bổ sung nếu người dùng tự save từ code cũ
  [k: string]: unknown;
}

/**
 * Migration: bất kỳ object nào có title/script hợp lệ → ScriptDocument v2.
 *
 * Quy tắc:
 *   - id cũ (number) → wrap thành string "lib-{id}".
 *   - savedAt → createdAt/updatedAt nếu có.
 *   - cachedData được giữ nguyên trong `cachedData`.
 *   - assets = [] (sẽ được tính lại khi user mở document).
 *
 * Trả về null nếu input không hợp lệ (thiếu title/script).
 */
export function migrateLibraryItemToDocument(
  raw: unknown,
): ScriptDocument | null {
  if (!raw || typeof raw !== 'object') return null;
  const legacy = raw as LegacyLibraryItem;
  if (typeof legacy.title !== 'string' || typeof legacy.script !== 'string') {
    return null;
  }
  const now = Date.now();
  const legacyId =
    typeof legacy.id === 'number'
      ? `lib-${legacy.id}`
      : typeof legacy.id === 'string'
        ? legacy.id
        : newScriptId();
  const createdAt =
    typeof legacy.savedAt === 'number' ? legacy.savedAt : now;
  return {
    schemaVersion: SCRIPT_DOCUMENT_SCHEMA_VERSION,
    id: legacyId,
    title: legacy.title,
    outlineContent: legacy.outlineContent ?? '',
    script: legacy.script,
    cachedData: legacy.cachedData,
    assets: [],
    metadata: undefined,
    brief: undefined,
    scenes: undefined,
    createdAt,
    updatedAt: createdAt,
  };
}

/**
 * Type guard đơn giản cho ScriptDocument.
 */
export function isScriptDocument(v: unknown): v is ScriptDocument {
  if (!v || typeof v !== 'object') return false;
  const d = v as Partial<ScriptDocument>;
  return (
    typeof d.schemaVersion === 'number' &&
    typeof d.id === 'string' &&
    typeof d.title === 'string' &&
    typeof d.script === 'string'
  );
}