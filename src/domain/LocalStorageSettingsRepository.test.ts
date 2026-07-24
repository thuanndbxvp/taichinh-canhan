import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageSettingsRepository } from './LocalStorageSettingsRepository';
import { APP_SETTINGS_SCHEMA_VERSION, createDefaultAppSettings } from './AppSettings';

describe('LocalStorageSettingsRepository', () => {
  let repo: LocalStorageSettingsRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageSettingsRepository();
  });

  it('get trả default khi localStorage trống', async () => {
    const s = await repo.get();
    expect(s.schemaVersion).toBe(APP_SETTINGS_SCHEMA_VERSION);
    expect(s.aiProvider).toBe('kyma');
    expect(s.apiKeys).toEqual({ kyma: [], openai: [] });
  });

  it('save + get roundtrip đúng', async () => {
    const def = createDefaultAppSettings();
    await repo.save({
      ...def,
      aiProvider: 'openai',
      selectedModel: 'gpt-4o',
      themeColor: '#abc',
      apiKeys: { kyma: ['k1'], openai: ['o1', 'o2'] },
    });
    const s = await repo.get();
    expect(s.aiProvider).toBe('openai');
    expect(s.selectedModel).toBe('gpt-4o');
    expect(s.themeColor).toBe('#abc');
    expect(s.apiKeys.openai).toEqual(['o1', 'o2']);
  });

  it('patch deep-merge apiKeys', async () => {
    await repo.save({
      ...createDefaultAppSettings(),
      apiKeys: { kyma: ['k1'], openai: [] },
    });
    const merged = await repo.patch({ apiKeys: { kyma: ['k1'], openai: ['o1'] } });
    expect(merged.apiKeys.kyma).toEqual(['k1']);
    expect(merged.apiKeys.openai).toEqual(['o1']);
  });

  it('patch top-level field', async () => {
    const merged = await repo.patch({ themeColor: '#fff' });
    expect(merged.themeColor).toBe('#fff');
    expect(merged.aiProvider).toBe('kyma'); // giữ nguyên
  });

  it('corrupt JSON → fallback default', async () => {
    localStorage.setItem('yt-app-settings-v1', '{invalid');
    const s = await repo.get();
    expect(s.schemaVersion).toBe(APP_SETTINGS_SCHEMA_VERSION);
    expect(s.aiProvider).toBe('kyma');
  });
});