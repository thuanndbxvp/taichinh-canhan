/**
 * LocalStorageSettingsRepository — adapter cho AppSettings.
 * Single value, không list. Key: 'yt-app-settings-v1'.
 */
import type { SettingsRepository } from './Repository';
import { RepositoryError } from './Repository';
import type { AppSettings } from './AppSettings';
import { APP_SETTINGS_SCHEMA_VERSION, createDefaultAppSettings, isAppSettings } from './AppSettings';

const SETTINGS_KEY = 'yt-app-settings-v1';

export class LocalStorageSettingsRepository implements SettingsRepository {
  async get(): Promise<AppSettings> {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(SETTINGS_KEY) : null;
      if (!raw) return createDefaultAppSettings();
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // JSON corrupt → fallback default để không crash app.
        return createDefaultAppSettings();
      }
      if (!isAppSettings(parsed)) {
        return createDefaultAppSettings();
      }
      return { ...parsed, schemaVersion: APP_SETTINGS_SCHEMA_VERSION };
    } catch (e) {
      if (e instanceof RepositoryError) throw e;
      throw RepositoryError.fromKind('IO', 'Không đọc được settings', e);
    }
  }

  async save(settings: AppSettings): Promise<void> {
    const normalized: AppSettings = {
      ...settings,
      schemaVersion: APP_SETTINGS_SCHEMA_VERSION,
    };
    this.writeRaw(JSON.stringify(normalized));
  }

  async patch(patch: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get();
    const merged: AppSettings = {
      ...current,
      ...patch,
      schemaVersion: APP_SETTINGS_SCHEMA_VERSION,
      // Deep-merge apiKeys để không ghi đè provider khác.
      apiKeys: patch.apiKeys
        ? { ...current.apiKeys, ...patch.apiKeys }
        : current.apiKeys,
    };
    await this.save(merged);
    return merged;
  }

  private writeRaw(value: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, value);
      }
    } catch (e) {
      if (e instanceof Error && /quota/i.test(e.message)) {
        throw RepositoryError.fromKind('STORAGE_QUOTA', 'localStorage đầy', e);
      }
      throw RepositoryError.fromKind('IO', 'Không ghi được settings', e);
    }
  }
}