/**
 * Scene — cấu trúc 1 scene trong ScriptDocument.
 *
 * Phase 4.5: thay vì chỉ narration + imagePrompt + videoPrompt, mỗi scene
 * có:
 *   - kind: hook / context / analysis / scenario / solution / takeaway /
 *           cta / disclaimer (theo plan1.md 4.5).
 *   - narration: text đọc thành lời.
 *   - visualNotes: ghi chú cho visual.
 *   - audioNotes: ghi chú cho audio (BGM, SFX).
 *   - onScreenText: text overlay (text hiện trên màn hình).
 *   - claimIds: claim references từ Claim Ledger.
 *   - calculationIds: calculation references từ Finance Calculator.
 */
export type SceneKind =
  | 'hook'
  | 'context'
  | 'analysis'
  | 'scenario'
  | 'solution'
  | 'takeaway'
  | 'cta'
  | 'disclaimer';

export interface Scene {
  id: string;
  kind: SceneKind;
  /**
   * Thứ tự scene trong document.
   */
  order: number;
  /**
   * Tiêu đề ngắn (vd: "PHẦN 1: HOOK").
   */
  title: string;
  /**
   * Lời narration đọc thành tiếng.
   */
  narration: string;
  /**
   * Ghi chú cho visual (mô tả bối cảnh, góc quay).
   */
  visualNotes: string;
  /**
   * Ghi chú cho audio (BGM, SFX).
   */
  audioNotes: string;
  /**
   * Text hiển thị trên màn hình (overlay).
   */
  onScreenText: string;
  /**
   * Visual prompt đã generate (cache asset).
   */
  imagePrompt?: string;
  /**
   * Video prompt đã generate (cache asset).
   */
  videoPrompt?: string;
  /**
   * ID các claim sử dụng trong scene này.
   */
  claimIds: string[];
  /**
   * ID các calculation sử dụng trong scene này.
   */
  calculationIds: string[];
}

export function createBlankScene(order: number, kind: SceneKind = 'context'): Scene {
  return {
    id: newSceneId(),
    kind,
    order,
    title: '',
    narration: '',
    visualNotes: '',
    audioNotes: '',
    onScreenText: '',
    claimIds: [],
    calculationIds: [],
  };
}

export function newSceneId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `sc-${crypto.randomUUID()}`;
  }
  return `sc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}