import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';

interface ScriptToolsProps {
  revisionPrompt: string;
  setRevisionPrompt: (prompt: string) => void;
  onRevise: () => void;
  isLoading: boolean;
}

export const ScriptTools: React.FC<ScriptToolsProps> = ({
  revisionPrompt,
  setRevisionPrompt,
  onRevise,
  isLoading,
}) => {
  return (
    <div className="bg-secondary p-4 rounded-lg border border-border">
        <h3 className="text-md font-semibold text-text-primary mb-3">Công cụ Kịch bản</h3>
        <textarea
            rows={4}
            className="w-full bg-primary border border-border rounded-md p-2 text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition"
            placeholder="Nhập yêu cầu sửa đổi, VD: 'Làm cho phần mở đầu kịch tính hơn'"
            value={revisionPrompt}
            onChange={(e) => setRevisionPrompt(e.target.value)}
            disabled={isLoading}
        />
        <div className="mt-3 flex flex-col gap-3">
             <button
                onClick={onRevise}
                disabled={!revisionPrompt.trim() || isLoading}
                className="w-full flex items-center justify-center border border-accent bg-transparent hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed text-accent font-semibold py-2 px-3 rounded-lg transition text-sm"
            >
                Sửa Kịch bản
            </button>
        </div>
    </div>
  );
};