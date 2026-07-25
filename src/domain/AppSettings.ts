/**
 * AppSettings — domain model cho cấu hình app.
 * Phase 3 tách riêng khỏi ScriptDocument vì settings là global, không gắn
 * với document cụ thể.
 *
 * Khác với `useAiSettings` hook (chỉ làm việc với state React):
 *   - AppSettings = pure data, dùng để persist qua SettingsRepository.
 *   - useAiSettings đọc/ghi AppSettings nhưng thêm listeners, side-effects.
 */
import type { AiProvider } from '../../types';

export const APP_SETTINGS_SCHEMA_VERSION = 1;

export interface AppSettings {
  schemaVersion: number;
  /**
   * Provider đang chọn (mặc định 'kyma').
   */
  aiProvider: AiProvider;
  /**
   * Model hiện tại (vd: 'gpt-4o-mini', 'gemini-1.5-flash').
   */
  selectedModel: string;
  /**
   * Theme color CSS variable.
   */
  themeColor: string;
  /**
   * API keys theo provider.
   */
  apiKeys: Record<AiProvider, string[]>;
  /**
   * Saved ideas (user-curated, không phải AI suggestions).
   */
  savedIdeas: Array<{
    id: string;
    title: string;
    outline: string;
    savedAt: number;
  }>;
  /**
   * Cờ chuyển sang "Finance Content Studio".
   */
  isFinanceMode?: boolean;
}

export function createDefaultAppSettings(): AppSettings {
  return {
    schemaVersion: APP_SETTINGS_SCHEMA_VERSION,
    aiProvider: 'kyma',
    selectedModel: '',
    themeColor: '',
    apiKeys: { kyma: [], openai: [] },
    savedIdeas: [],
    isFinanceMode: false,
  };
}

/**
 * Type guard.
 */
export function isAppSettings(v: unknown): v is AppSettings {
  if (!v || typeof v !== 'object') return false;
  const s = v as Partial<AppSettings>;
  return (
    typeof s.schemaVersion === 'number' &&
    typeof s.aiProvider === 'string' &&
    typeof s.apiKeys === 'object'
  );
}