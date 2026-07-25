/**
 * Promise wrapper cho IndexedDB. Đơn giản hoá việc mở DB, transaction.
 *
 * Schema mặc định:
 *   - DB: 'yt-script-studio'
 *   - Stores:
 *     - 'scripts' (keyPath: 'id') — ScriptDocument
 *     - 'assets' (keyPath: 'id', index: 'cacheKey' unique) — AssetRecord
 *     - 'research' (keyPath: 'scriptId') — ResearchPack
 *
 * Mỗi store có schemaVersion lưu trong record để Phase 4+ migrate.
 */
export const DB_NAME = 'yt-script-studio';
export const DB_VERSION = 1;

export const STORE_SCRIPTS = 'scripts';
export const STORE_ASSETS = 'assets';
export const STORE_RESEARCH = 'research';

export type StoreName =
  | typeof STORE_SCRIPTS
  | typeof STORE_ASSETS
  | typeof STORE_RESEARCH;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Mở DB với Promise wrapper. Singleton — chỉ mở 1 lần.
 */
export function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB không khả dụng trong môi trường này'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_SCRIPTS)) {
        db.createObjectStore(STORE_SCRIPTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_ASSETS)) {
        const assetStore = db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
        // Index cho cacheKey lookup (Phase 3.5).
        assetStore.createIndex('cacheKey', 'cacheKey', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_RESEARCH)) {
        db.createObjectStore(STORE_RESEARCH, { keyPath: 'scriptId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
  });
  return dbPromise;
}

/**
 * Reset singleton (chỉ dùng cho test).
 */
export function _resetDbForTest(): void {
  dbPromise = null;
}

/**
 * Promise wrapper cho IDBRequest.
 */
export function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IDBRequest failed'));
  });
}

/**
 * Promise wrapper cho transaction oncomplete.
 */
export function txnToPromise(txn: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    txn.oncomplete = () => resolve();
    txn.onerror = () => reject(txn.error ?? new Error('IDBTransaction failed'));
    txn.onabort = () => reject(txn.error ?? new Error('IDBTransaction aborted'));
  });
}

/**
 * Helper: thực thi 1 transaction đơn giản (readwrite).
 */
export async function runTxn<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDb();
  const txn = db.transaction(storeName, mode);
  const store = txn.objectStore(storeName);
  const result = await fn(store);
  await txnToPromise(txn);
  return result;
}