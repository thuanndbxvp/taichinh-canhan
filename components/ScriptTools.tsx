import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';

interface ScriptToolsProps {
  revisionPrompt: string;
  setRevisionPrompt: (prompt: string) => void;
  onRevise: () => void;
  isLoading: boolean;
  isOutlinePhase?: boolean;
}

export const ScriptTools: React.FC<ScriptToolsProps> = ({
  revisionPrompt,
  setRevisionPrompt,
  onRevise,
  isLoading,
  isOutlinePhase,
}) => {
  return (
    <div className="pt-2">
        <textarea
            rows={4}
            className="w-full bg-primary border border-border rounded-md p-2 text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition"
            placeholder={isOutlinePhase ? "Nhập yêu cầu sửa đổi, VD: 'Làm cho phần mở đầu kịch tính hơn'" : "Nhập yêu cầu sửa đổi, VD: 'Làm cho phần 2 kịch tính hơn, thêm ví dụ thực tế'"}
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
                {isOutlinePhase ? 'Sửa Dàn ý' : 'Sửa Kịch bản'}
            </button>
        </div>
    </div>
  );
};