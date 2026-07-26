
import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { TrophyIcon } from './icons/TrophyIcon';

import type { ScoreResult } from '../services/aiService';

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: ScoreResult | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i}>
                <div className="h-6 bg-primary rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-primary rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-primary rounded w-full"></div>
            </div>
        ))}
        <div className="h-16 bg-primary rounded w-full mt-8"></div>
    </div>
);


export const ScoreModal: React.FC<ScoreModalProps> = ({ isOpen, onClose, score, isLoading, error }) => {
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        if (copySuccess) {
            const timer = setTimeout(() => setCopySuccess(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [copySuccess]);

    const handleCopy = () => {
        if (!score) return;
        const text = `Điểm: ${score.score}/10\n\nĐiểm mạnh:\n${score.pros.map(p => `- ${p}`).join('\n')}\n\nĐiểm cần cải thiện:\n${score.cons.map(c => `- ${c}`).join('\n')}\n\nTổng quan:\n${score.overallReview}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Đã chép!');
        }, () => {
            setCopySuccess('Lỗi sao chép');
        });
    };
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-secondary rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-border"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-border">
                     <div className="flex items-center gap-3">
                        <TrophyIcon className="w-6 h-6 text-amber-400" />
                        <h2 className="text-xl font-bold text-accent">Đánh giá Kịch bản</h2>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl font-bold">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    {isLoading && <LoadingSkeleton />}
                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
                    {!isLoading && !error && score && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center p-6 bg-primary rounded-xl border border-border">
                                <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Điểm Đánh Giá</span>
                                <div className="text-5xl font-bold text-amber-400">
                                    {score.score}<span className="text-2xl text-text-secondary">/10</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-primary p-4 rounded-lg border border-border border-l-4 border-l-green-500">
                                    <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Điểm Làm Tốt
                                    </h3>
                                    <ul className="space-y-2">
                                        {score.pros.map((pro, idx) => (
                                            <li key={idx} className="text-text-secondary text-sm flex gap-2">
                                                <span className="text-green-500 mt-0.5">•</span>
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-primary p-4 rounded-lg border border-border border-l-4 border-l-red-500">
                                    <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        Cần Cải Thiện
                                    </h3>
                                    <ul className="space-y-2">
                                        {score.cons.map((con, idx) => (
                                            <li key={idx} className="text-text-secondary text-sm flex gap-2">
                                                <span className="text-red-500 mt-0.5">•</span>
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-primary p-5 rounded-lg border border-border">
                                <h3 className="font-bold text-text-primary mb-2">Nhận Xét Tổng Quan</h3>
                                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                                    {score.overallReview}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-border flex justify-end items-center gap-4">
                    {isLoading && (
                        <p className="text-xs text-accent flex-grow">Chuyên gia đang đọc kịch bản, vui lòng chờ...</p>
                    )}
                    <button 
                        onClick={handleCopy}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary/70 text-text-secondary px-4 py-2 rounded-md font-semibold transition border border-border"
                        disabled={!!copySuccess || isLoading || !!error || !score}
                    >
                        <ClipboardIcon className="w-5 h-5" />
                        <span>{copySuccess || 'Sao chép'}</span>
                    </button>
                    <button onClick={onClose} className="bg-accent hover:brightness-110 text-white font-bold py-2 px-4 rounded-md transition">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
