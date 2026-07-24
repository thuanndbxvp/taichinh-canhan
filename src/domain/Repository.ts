/**
 * Repository interface — tách persistence khỏi UI/hook.
 *
 * Mọi adapter (LocalStorage, IndexedDB, future HTTP, ...) phải implement
 * các interface này. Component/hook chỉ phụ thuộc vào interface, không quan
 * tâm backend.
 */
import type {
  ScriptDocument,
  ScriptId,
} from './ScriptDocument';
import type { AppSettings } from './AppSettings';
import type { AssetRecord, AssetKind } from './AssetRecord';
import type { ResearchPack } from './ResearchPack';

/**
 * Kết quả list. Backend có thể trả page metadata; phase 3 chỉ cần all.
 */
export interface ListResult<T> {
  items: T[];
}

/**
 * Lỗi chuẩn từ repository. UI nên wrap AppError nếu cần telemetry.
 */
export type RepositoryErrorKind =
  | 'NOT_FOUND'
  | 'STORAGE_QUOTA'
  | 'STORAGE_CORRUPT'
  | 'IO'
  | 'UNKNOWN';

export class RepositoryError extends Error {
  public readonly kind: RepositoryErrorKind;
  public readonly cause?: unknown;

  constructor(message: string, kind: RepositoryErrorKind, cause?: unknown) {
    super(message);
    this.name = 'RepositoryError';
    this.kind = kind;
    this.cause = cause;
  }

  static fromKind(
    kind: RepositoryErrorKind,
    message: string,
    cause?: unknown,
  ): RepositoryError {
    return new RepositoryError(message, kind, cause);
  }
}

export interface ScriptRepository {
  list(): Promise<ScriptDocument[]>;
  get(id: ScriptId): Promise<ScriptDocument | null>;
  save(doc: ScriptDocument): Promise<ScriptDocument>;
  delete(id: ScriptId): Promise<void>;
  /**
   * Migration từ dữ liệu cũ (LibraryItem[]). Trả về số document đã migrate.
   */
  migrateFromLegacy(rawList: unknown[]): Promise<number>;
}

export interface SettingsRepository {
  get(): Promise<AppSettings>;
  save(settings: AppSettings): Promise<void>;
  /**
   * Merge một phần settings. Hữu ích khi hook chỉ update 1 field.
   */
  patch(patch: Partial<AppSettings>): Promise<AppSettings>;
}

export interface AssetRepository {
  list(filter?: { scriptId?: ScriptId; kind?: AssetKind }): Promise<AssetRecord[]>;
  get(id: string): Promise<AssetRecord | null>;
  /**
   * Lookup asset bằng cacheKey (Phase 3.5).
   */
  findByCacheKey(cacheKey: string): Promise<AssetRecord | null>;
  save(asset: AssetRecord): Promise<AssetRecord>;
  delete(id: string): Promise<void>;
}

export interface ResearchRepository {
  get(scriptId: ScriptId): Promise<ResearchPack | null>;
  save(scriptId: ScriptId, pack: ResearchPack): Promise<void>;
  delete(scriptId: ScriptId): Promise<void>;
}

/**
 * Aggregate root — điểm truy cập duy nhất cho app.
 */
export interface RepositoryBundle {
  scripts: ScriptRepository;
  settings: SettingsRepository;
  assets: AssetRepository;
  research: ResearchRepository;
}