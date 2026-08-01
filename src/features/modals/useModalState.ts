import { useCallback, useState } from 'react';

export type ModalKey =
  | 'library'
  | 'savedIdeas'
  | 'apiKey'
  | 'guide'
  | 'visualPrompt'
  | 'allVisualPrompts'
  | 'summarize'
  | 'score'
  | 'dialogue'
  | 'usage'
  | 'admin'
  | 'rewrite';

const ALL_MODALS: ModalKey[] = [
  'library',
  'savedIdeas',
  'apiKey',
  'guide',
  'visualPrompt',
  'allVisualPrompts',
  'summarize',
  'score',
  'dialogue',
  'usage',
  'admin',
  'rewrite',
];

type ModalState = Record<ModalKey, boolean>;

function initial(): ModalState {
  return ALL_MODALS.reduce((acc, k) => {
    acc[k] = false;
    return acc;
  }, {} as ModalState);
}

export interface UseModalStateReturn {
  isOpen: (k: ModalKey) => boolean;
  open: (k: ModalKey) => void;
  close: (k: ModalKey) => void;
  toggle: (k: ModalKey) => void;
  closeAll: () => void;
}

/**
 * Quản lý trạng thái mở/đóng của tất cả modal.
 * Thay vì truyền từng `isXModalOpen` xuống component, ta cho component con
 * hoặc hook khác gọi `open('library')` / `close('library')`.
 */
export function useModalState(): UseModalStateReturn {
  const [state, setState] = useState<ModalState>(initial);

  const isOpen = useCallback((k: ModalKey) => !!state[k], [state]);
  const open = useCallback((k: ModalKey) => setState((prev) => ({ ...prev, [k]: true })), []);
  const close = useCallback((k: ModalKey) => setState((prev) => ({ ...prev, [k]: false })), []);
  const toggle = useCallback((k: ModalKey) => setState((prev) => ({ ...prev, [k]: !prev[k] })), []);
  const closeAll = useCallback(() => setState(initial()), []);

  return { isOpen, open, close, toggle, closeAll };
}
