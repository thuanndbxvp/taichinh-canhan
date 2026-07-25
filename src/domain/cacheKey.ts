/**
 * cacheKey — sinh key ổn định cho asset cache.
 *
 * Phase 3.5 yêu cầu cache key phải gắn với:
 *   - documentId
 *   - documentVersion (schemaVersion hiện tại của ScriptDocument)
 *   - sceneId (nếu asset là per-scene)
 *   - provider
 *   - model
 *   - promptVersion
 *   - contentHash (hash của input dùng để generate asset)
 *
 * Không phụ thuộc vào:
 *   - section string không ổn định (vd: "## PHẦN 1" có thể thay đổi khi
 *     người dùng edit outline).
 *   - timestamp.
 *
 * Cú pháp key: `kind:docId:v:scene:provider:model:prompt:hash`
 * Hash dùng FNV-1a 32-bit (đủ rẻ, không cần crypto subtle).
 */
import type { AssetKind } from '../domain/AssetRecord';
import { SCRIPT_DOCUMENT_SCHEMA_VERSION } from '../domain/ScriptDocument';

export interface CacheKeyInput {
  kind: AssetKind;
  documentId: string;
  /**
   * Nếu không truyền, dùng SCRIPT_DOCUMENT_SCHEMA_VERSION hiện tại.
   */
  documentVersion?: number;
  sceneId?: string;
  provider: string;
  model: string;
  promptVersion: string;
  /**
   * String input dùng để generate asset (script section, scene description, ...).
   */
  content: string;
}

/**
 * FNV-1a 32-bit hash. Đơn giản, deterministic, không cần crypto API.
 */
export function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // hash *= 16777619 với overflow 32-bit unsigned
    hash = Math.imul(hash, 0x01000193);
  }
  // Convert sang unsigned hex 8-char.
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Build cache key ổn định.
 */
export function buildCacheKey(input: CacheKeyInput): string {
  const docVersion = input.documentVersion ?? SCRIPT_DOCUMENT_SCHEMA_VERSION;
  const scene = input.sceneId ?? '-';
  const contentHash = fnv1a(input.content);
  return [
    input.kind,
    input.documentId,
    `v${docVersion}`,
    scene,
    input.provider,
    input.model,
    input.promptVersion,
    contentHash,
  ].join(':');
}

/**
 * Parse cache key thành các field. Trả về null nếu key sai format.
 */
export function parseCacheKey(key: string): {
  kind: AssetKind;
  documentId: string;
  documentVersion: number;
  sceneId: string | null;
  provider: string;
  model: string;
  promptVersion: string;
  contentHash: string;
} | null {
  const parts = key.split(':');
  if (parts.length !== 8) return null;
  const [kind, documentId, versionRaw, scene, provider, model, promptVersion, contentHash] = parts;
  const version = versionRaw.startsWith('v')
    ? Number(versionRaw.slice(1))
    : NaN;
  if (Number.isNaN(version)) return null;
  return {
    kind: kind as AssetKind,
    documentId,
    documentVersion: version,
    sceneId: scene === '-' ? null : scene,
    provider,
    model,
    promptVersion,
    contentHash,
  };
}