
import React from 'react';
import { WordCountCheck } from './WordCountCheck';
import { ScriptTools } from './ScriptTools';
import { BookOpenIcon } from './icons/BookOpenIcon';
import type { WordCountStats } from '../types';
import { SaveIcon } from './icons/SaveIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TrophyIcon } from './icons/TrophyIcon';

// Combine all props needed for the side panel
interface SideToolsPanelProps {
  script: string;
  targetWordCount: string;
  revisionPrompt: string;
  setRevisionPrompt: (prompt: string) => void;
  onRevise: () => void;
  onSummarizeScript: () => void;
  isLoading: boolean;
  isSummarizing: boolean;
  hasSummarizedScript: boolean;
  onOpenLibrary: () => void;
  onExtractAndCount: () => void;
  onOpenDialogueModal: () => void;
  wordCountStats: WordCountStats | null;
  isExtracting: boolean;
  onScoreScript: () => void;
  isScoring: boolean;
  isOutlinePhase?: boolean;
}

export const SideToolsPanel: React.FC<SideToolsPanelProps> = ({
    script,
    targetWordCount,
    revisionPrompt,
    setRevisionPrompt,
    onRevise,
    onSummarizeScript,
    isLoading,
    isSummarizing,
    hasSummarizedScript,
    onOpenLibrary,
    onExtractAndCount,
    onOpenDialogueModal,
    wordCountStats,
    isExtracting,
    onScoreScript,
    isScoring,
    isOutlinePhase,
}) => {

    return (
        <div className="w-full space-y-6 sticky top-[98px]">
            <div className="bg-secondary p-4 rounded-lg border border-border space-y-3">
                 <h3 className="text-md font-semibold text-text-primary text-center">Tiện ích & Cài đặt</h3>
                 <div className="flex items-center gap-3">
                    <button 
                        onClick={onOpenLibrary}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/70 text-text-primary font-semibold rounded-lg transition-colors border border-border"
                        aria-label="Mở thư viện"
                    >
                        <BookOpenIcon className="w-5 h-5"/>
                        <span>Thư viện</span>
                    </button>
                </div>
                 <button
                    onClick={onScoreScript}
                    disabled={!script || isLoading || isScoring}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/70 text-text-primary font-semibold rounded-lg transition-colors border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Chấm điểm kịch bản"
                >
                    <TrophyIcon className="w-5 h-5 text-amber-400" />
                    <span>{isScoring ? 'Đang chấm điểm...' : 'Chấm điểm kịch bản'}</span>
                </button>
            </div>

            {script && (
                <>
                    <WordCountCheck
                        stats={wordCountStats}
                        targetWordCount={targetWordCount}
                        onExtractAndCount={onExtractAndCount}
                        onOpenDialogueModal={onOpenDialogueModal}
                        isLoading={isExtracting}
                    />
                    <ScriptTools 
                        revisionPrompt={revisionPrompt}
                        setRevisionPrompt={setRevisionPrompt}
                        onRevise={onRevise}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    );
};
