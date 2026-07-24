/**
 * Library I/O — schema-versioned import/export cho LibraryItem.
 * Phase 0 chỉ thêm version field + helper, không thay đổi hành vi gọi.
 * Migration dần ở các phase sau.
 */
import { AppError } from './errors';
import type { LibraryItem } from '../../types';

export const LIBRARY_SCHEMA_VERSION = 1;
export const LIBRARY_FILE_PREFIX = 'chu-que-library';

interface ExportPayload {
  schema: typeof LIBRARY_SCHEMA_VERSION;
  generator: string;
  exportedAt: number;
  items: LibraryItem[];
}

export interface ImportResult {
  items: LibraryItem[];
  warnings: string[];
  migrated: boolean;
}

function isLibraryItem(value: unknown): value is LibraryItem {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.savedAt === 'number' &&
    typeof v.title === 'string' &&
    typeof v.outlineContent === 'string' &&
    typeof v.script === 'string'
  );
}

export function buildExportPayload(items: LibraryItem[]): string {
  const payload: ExportPayload = {
    schema: LIBRARY_SCHEMA_VERSION,
    generator: LIBRARY_FILE_PREFIX,
    exportedAt: Date.now(),
    items: items.filter((it) => it && typeof it === 'object'),
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadLibrary(items: LibraryItem[], filename?: string): void {
  const json = buildExportPayload(items);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${LIBRARY_FILE_PREFIX}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseLibraryImport(text: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw AppError.from('IO_FILE_READ', 'File không phải JSON hợp lệ', {}, err);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw AppError.from('VALIDATION_FAILED', 'Cấu trúc file không hợp lệ');
  }

  const obj = parsed as Record<string, unknown>;
  const warnings: string[] = [];
  let items: LibraryItem[] = [];
  let migrated = false;

  // Trường hợp 1: payload có version (chuẩn mới)
  if ('schema' in obj && 'items' in obj && Array.isArray(obj.items)) {
    const schema = obj.schema;
    if (schema !== LIBRARY_SCHEMA_VERSION) {
      warnings.push(`Schema ${schema} khác phiên bản hiện tại (${LIBRARY_SCHEMA_VERSION}). App sẽ thử import ở chế độ best-effort.`);
      migrated = true;
    }
    items = (obj.items as unknown[]).filter(isLibraryItem);
  } else if (Array.isArray(parsed)) {
    // Trường hợp 2: file cũ, mảng trần các item
    warnings.push('File thiếu schema. Đang thử diễn dịch ở chế độ legacy.');
    items = parsed.filter(isLibraryItem);
    migrated = true;
  } else {
    throw AppError.from('VALIDATION_FAILED', 'Không tìm thấy mảng items trong file');
  }

  if (items.length === 0) {
    warnings.push('Không tìm thấy item hợp lệ nào trong file.');
  }

  return { items, warnings, migrated };
}
