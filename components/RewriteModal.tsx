
import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { RewriteLevel } from '../src/features/generation/useGenerationWorkflow';

interface RewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialScript: string;
  rewrittenScript: string;
  isLoading: boolean;
  error: string | null;
  level: RewriteLevel;
  setLevel: (level: RewriteLevel) => void;
  onStart: (script: string, title: string) => void;
  onApply: () => void;
}

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = 'Sao chép' }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => setCopied(true));
  };
  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className="mt-2 flex items-center space-x-2 bg-secondary/70 hover:bg-secondary text-text-secondary px-3 py-1.5 rounded-md text-xs font-semibold transition border border-border disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ClipboardIcon className="w-4 h-4" />
      <span>{copied ? 'Đã chép!' : label}</span>
    </button>
  );
};

export const RewriteModal: React.FC<RewriteModalProps> = ({
  isOpen,
  onClose,
  title,
  initialScript,
  rewrittenScript,
  isLoading,
  error,
  level,
  setLevel,
  onStart,
  onApply,
}) => {
  const [originalScript, setOriginalScript] = useState(initialScript);
  const [localTitle, setLocalTitle] = useState(title);

  useEffect(() => {
    if (isOpen) {
      setOriginalScript(initialScript);
      setLocalTitle(title);
    }
  }, [isOpen, initialScript, title]);

  if (!isOpen) return null;

  const charCount = originalScript.length;
  const canStart = !isLoading && originalScript.trim().length > 0;

  const handleStartClick = () => {
    onStart(originalScript, localTitle);
  };

  const levelDescription =
    level === 1
      ? 'Mức 1 — Giữ nguyên cấu trúc, chỉ sửa văn phong và từ vựng theo DNA.'
      : 'Mức 2 — Đập đi gò lại toàn bộ bài viết thành đúng 5 phần tiêu chuẩn của DNA. Giữ luận điểm chính.';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-2 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-lg shadow-2xl w-full max-w-[96rem] h-[95vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3 p-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-accent flex items-center gap-2">
              <span aria-hidden>♻️</span>
              <span>Tẩy rửa kịch bản gốc</span>
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary text-2xl font-bold"
              aria-label="Đóng"
            >
              &times;
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Chủ đề (để nhận diện phong cách)
              </label>
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                disabled={isLoading}
                className="w-full bg-primary border border-border rounded-md p-2 text-text-primary text-sm focus:ring-2 focus:ring-accent focus:border-accent transition disabled:opacity-50"
                placeholder="Nhập Chủ đề để AI nhận diện phong cách"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Mức độ can thiệp
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10) as RewriteLevel)}
                disabled={isLoading}
                className="bg-primary border border-border rounded-md p-2 text-text-primary text-sm focus:ring-2 focus:ring-accent focus:border-accent transition disabled:opacity-50"
              >
                <option value={1}>Mức 1 — Sửa văn phong</option>
                <option value={2}>Mức 2 — Gò lại 5 phần</option>
              </select>
            </div>

            <button
              onClick={handleStartClick}
              disabled={!canStart}
              className="bg-accent hover:brightness-110 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang tẩy rửa...</span>
                </>
              ) : (
                <>
                  <span aria-hidden>♻️</span>
                  <span>Bắt đầu tẩy rửa</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-text-secondary italic">{levelDescription}</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
          <div className="flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-text-primary">Kịch bản gốc</h3>
              <span className="text-xs text-text-secondary">{charCount.toLocaleString()} ký tự</span>
            </div>
            <textarea
              value={originalScript}
              onChange={(e) => setOriginalScript(e.target.value)}
              disabled={isLoading}
              placeholder="Dán kịch bản gốc vào đây..."
              className="flex-1 w-full bg-primary border border-border rounded-md p-3 text-text-primary text-sm font-mono resize-none focus:ring-2 focus:ring-accent focus:border-accent transition disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-text-primary">Kết quả sau tẩy rửa</h3>
              {rewrittenScript && (
                <CopyButton text={rewrittenScript} label="Sao chép kết quả" />
              )}
            </div>
            <div className="flex-1 w-full bg-primary border border-border rounded-md p-3 overflow-y-auto">
              {error ? (
                <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm">{error}</p>
              ) : isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-secondary rounded w-3/4"></div>
                  <div className="h-4 bg-secondary rounded w-full"></div>
                  <div className="h-4 bg-secondary rounded w-5/6"></div>
                  <div className="h-4 bg-secondary rounded w-2/3"></div>
                </div>
              ) : rewrittenScript ? (
                <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary">
                  {rewrittenScript}
                </pre>
              ) : (
                <p className="text-text-secondary italic text-sm">
                  Kết quả sẽ hiện ở đây sau khi bạn bấm "Bắt đầu tẩy rửa".
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary/70 text-text-secondary font-bold py-2 px-4 rounded-md transition border border-border"
          >
            Đóng
          </button>
          <button
            onClick={onApply}
            disabled={!rewrittenScript || isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Áp dụng kết quả
          </button>
        </div>
      </div>
    </div>
  );
};
