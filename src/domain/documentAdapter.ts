/**
 * Adapter: convert ScriptDocument → format UI cũ dùng.
 *
 * Phase 4: nếu ScriptDocument có scenes (cấu trúc mới), render Markdown
 * từ scenes. Nếu không, fallback script field (Markdown cũ).
 *
 * Đây là điểm kết nối giữa document domain mới và UI hiện tại — cho phép
 * Phase 4 ship mà không cần rewrite OutputDisplay.
 */
import type { ScriptDocument } from './ScriptDocument';
import { renderMarkdown, renderTtsClean } from './renderers';

/**
 * Render ScriptDocument ra Markdown để hiển thị.
 */
export function documentToMarkdown(doc: ScriptDocument): string {
  return renderMarkdown(doc);
}

/**
 * Lấy text đã strip để dùng cho TTS / dialogue.
 */
export function documentToTtsText(doc: ScriptDocument): string {
  return renderTtsClean(doc);
}

/**
 * Lấy title an toàn (ưu tiên brief.title nếu có).
 */
export function documentTitle(doc: ScriptDocument): string {
  return doc.brief?.title || doc.title;
}

/**
 * Lấy scenes an toàn (fallback [] nếu doc cũ không có).
 */
export function documentScenes(doc: ScriptDocument) {
  return doc.scenes ?? [];
}