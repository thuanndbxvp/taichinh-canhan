/**
 * getRepositoryBundle — trả về aggregate root theo feature flag.
 *
 * Phase 3 chọn LocalStorage làm default để tương thích ngược với dữ liệu
 * cũ. IndexedDB dùng cho assets/research (data lớn, không gắn document).
 *
 * Khi bật `VITE_STORAGE_BACKEND=indexeddb` → toàn bộ dùng IndexedDB.
 * Default: hybrid (script qua localStorage, asset/research qua IndexedDB).
 */
import type { RepositoryBundle } from './Repository';
import { LocalStorageScriptRepository } from './LocalStorageScriptRepository';
import { LocalStorageSettingsRepository } from './LocalStorageSettingsRepository';
import { IndexedDbScriptRepository } from './IndexedDbScriptRepository';
import { IndexedDbAssetRepository } from './IndexedDbAssetRepository';
import { IndexedDbResearchRepository } from './IndexedDbResearchRepository';
import { SupabaseScriptRepository } from './SupabaseScriptRepository';

export type StorageBackend = 'hybrid' | 'indexeddb' | 'localstorage' | 'supabase';

function resolveBackend(): StorageBackend {
  if (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env) {
    const env = (import.meta as unknown as { env: Record<string, string> }).env;
    const flag = env.VITE_STORAGE_BACKEND;
    if (flag === 'indexeddb' || flag === 'localstorage' || flag === 'supabase') return flag;
    
    // Default to supabase if VITE_SUPABASE_URL is present
    if (env.VITE_SUPABASE_URL) return 'supabase';
  }
  return 'hybrid';
}

export function getRepositoryBundle(backend?: StorageBackend): RepositoryBundle {
  const chosen = backend ?? resolveBackend();
  switch (chosen) {
    case 'supabase':
      return {
        scripts: new SupabaseScriptRepository(),
        settings: new LocalStorageSettingsRepository(),
        assets: new IndexedDbAssetRepository(),
        research: new IndexedDbResearchRepository(),
      };
    case 'indexeddb':
      return {
        scripts: new IndexedDbScriptRepository(),
        settings: new LocalStorageSettingsRepository(), // Settings là global, giữ LocalStorage cho đơn giản.
        assets: new IndexedDbAssetRepository(),
        research: new IndexedDbResearchRepository(),
      };
    case 'localstorage':
      return {
        scripts: new LocalStorageScriptRepository(),
        settings: new LocalStorageSettingsRepository(),
        // Khi all-localStorage, asset/research dùng in-memory Map wrapper.
        // Phase 3 đơn giản hoá: nếu không có IDB thì throw để UI biết.
        assets: new IndexedDbAssetRepository(),
        research: new IndexedDbResearchRepository(),
      };
    case 'hybrid':
    default:
      return {
        scripts: new LocalStorageScriptRepository(),
        settings: new LocalStorageSettingsRepository(),
        assets: new IndexedDbAssetRepository(),
        research: new IndexedDbResearchRepository(),
      };
  }
}