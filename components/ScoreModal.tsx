
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
  rawStream?: string;
  isRevising?: boolean;
  onRevise?: (prompt: string) => void;
}

const StreamViewer: React.FC<{ stream: string }> = ({ stream }) => {
    const endRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [stream]);

    return (
        <div className="bg-black/60 text-green-400 font-mono p-5 rounded-xl border border-border h-96 overflow-y-auto whitespace-pre-wrap text-sm shadow-inner relative custom-scrollbar">
            <div className="sticky top-0 right-0 flex justify-end mb-2">
                <div className="flex items-center gap-2 bg-black/80 px-3 py-1 rounded-full border border-green-900/50">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-sans text-green-400 opacity-80">AI đang phân tích & trích xuất JSON...</span>
                </div>
            </div>
            {stream || 'Đang kết nối với Script Doctor...'}
            <div ref={endRef} />
        </div>
    );
};

export const ScoreModal: React.FC<ScoreModalProps> = ({ isOpen, onClose, score, isLoading, error, rawStream, isRevising, onRevise }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
    const [userComment, setUserComment] = useState('');

    const toggleFeedback = (text: string) => {
        setSelectedFeedback(prev => prev.includes(text) ? prev.filter(p => p !== text) : [...prev, text]);
    };

    const handleRevise = () => {
        if (!onRevise) return;
        const promptText = `\n- Phản hồi đã chọn để sửa:\n${selectedFeedback.map(f => `  + ${f}`).join('\n')}\n- Ghi chú thêm: ${userComment}`;
        onRevise(promptText);
    };

    useEffect(() => {
        if (copySuccess) {
            const timer = setTimeout(() => setCopySuccess(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [copySuccess]);

    let finalScore = 0;
    if (score) {
        const rawScore = 
            (score.criteria.structure.score * 0.25) +
            (score.criteria.research.score * 0.20) +
            (score.criteria.voice.score * 0.20) +
            (score.criteria.insight.score * 0.20) +
            (score.criteria.cinematic.score * 0.15) -
            score.penalties.reduce((sum, p) => sum + p.deduction, 0);
        finalScore = Math.max(0, Math.min(10, Number(rawScore.toFixed(2))));
    }

    const handleCopy = () => {
        if (!score) return;
        const text = `🏅 Tổng điểm: ${finalScore}/10\n\n⏱️ Thời lượng: ${score.estimatedTime}\n\n🧩 1. Kết cấu và mạch cảm xúc (25%) - Điểm: ${score.criteria.structure.score}/10\n- Phân tích: ${score.criteria.structure.analysis}\n- Dẫn chứng: "${score.criteria.structure.evidence}"\n\n📚 2. Độ chính xác & nghiên cứu (20%) - Điểm: ${score.criteria.research.score}/10\n- Phân tích: ${score.criteria.research.analysis}\n- Dẫn chứng: "${score.criteria.research.evidence}"\n\n✍️ 3. Giọng văn & phong cách kể (20%) - Điểm: ${score.criteria.voice.score}/10\n- Phân tích: ${score.criteria.voice.analysis}\n- Dẫn chứng: "${score.criteria.voice.evidence}"\n\n💡 4. Ý tưởng và chiều sâu (20%) - Điểm: ${score.criteria.insight.score}/10\n- Phân tích: ${score.criteria.insight.analysis}\n- Dẫn chứng: "${score.criteria.insight.evidence}"\n\n🪶 5. Nhịp & hình ảnh (15%) - Điểm: ${score.criteria.cinematic.score}/10\n- Phân tích: ${score.criteria.cinematic.analysis}\n- Dẫn chứng: "${score.criteria.cinematic.evidence}"\n\n${score.penalties.length > 0 ? `⚠️ Trừ điểm:\n${score.penalties.map(p => `- ${p.reason} (-${p.deduction})`).join('\n')}\n\n` : ''}✅ Điểm mạnh:\n${score.pros.map(p => `- ${p}`).join('\n')}\n\n❌ Cần cải thiện:\n${score.cons.map(c => `- ${c}`).join('\n')}\n\n📝 Nhận xét tổng quan:\n${score.overallReview}`;

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
                className="bg-secondary rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-border">
                     <div className="flex items-center gap-3">
                        <TrophyIcon className="w-6 h-6 text-amber-400" />
                        <h2 className="text-xl font-bold text-accent">Script Doctor - Đánh Giá Chuyên Sâu</h2>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl font-bold">&times;</button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow custom-scrollbar bg-black/20">
                    {isLoading && <StreamViewer stream={rawStream || ''} />}
                    {error && <p className="text-red-400 bg-red-900/50 p-4 rounded-md border border-red-500/30">{error}</p>}
                    
                    {!isLoading && !error && score && (
                        <div className="space-y-8">
                            {/* Header Score */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-primary rounded-xl border border-border shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                                    <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Điểm Tổng</span>
                                    <div className="text-6xl font-bold text-amber-400">
                                        {finalScore}<span className="text-3xl text-text-secondary/50">/10</span>
                                    </div>
                                    <div className="mt-4 text-sm text-text-secondary flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {score.estimatedTime}
                                    </div>
                                </div>
                                
                                {score.penalties.length > 0 && (
                                    <div className="flex-1 bg-red-950/20 p-5 rounded-xl border border-red-900/50">
                                        <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                            Phạm Quy (Trừ điểm)
                                        </h3>
                                        <ul className="space-y-2">
                                            {score.penalties.map((p, idx) => (
                                                <li key={idx} className="text-red-300/80 text-sm flex justify-between items-start bg-black/20 px-3 py-2 rounded gap-2 cursor-pointer hover:bg-black/40 transition-colors" onClick={() => toggleFeedback(p.reason)}>
                                                    <div className="flex items-start gap-2">
                                                        <input type="checkbox" checked={selectedFeedback.includes(p.reason)} onChange={() => {}} className="mt-1 flex-shrink-0" />
                                                        <span>{p.reason}</span>
                                                    </div>
                                                    <span className="font-bold text-red-400 bg-red-900/40 px-2 py-0.5 rounded whitespace-nowrap">-{p.deduction}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* 5 Criteria */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-accent border-b border-border pb-2">Đánh Giá Chi Tiết 5 Tiêu Chí</h3>
                                
                                {[
                                    { id: 'structure', name: '🧩 Kết cấu & Mạch cảm xúc', weight: 25, data: score.criteria.structure },
                                    { id: 'research', name: '📚 Độ chính xác & Nghiên cứu', weight: 20, data: score.criteria.research },
                                    { id: 'voice', name: '✍️ Giọng văn & Phong cách', weight: 20, data: score.criteria.voice },
                                    { id: 'insight', name: '💡 Ý tưởng & Chiều sâu', weight: 20, data: score.criteria.insight },
                                    { id: 'cinematic', name: '🪶 Nhịp & Hình ảnh', weight: 15, data: score.criteria.cinematic }
                                ].map(c => (
                                    <div key={c.id} className="bg-primary rounded-lg border border-border p-5 transition-colors hover:border-accent/30">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-text-primary">{c.name}</h4>
                                                <span className="text-xs font-semibold bg-secondary px-2 py-1 rounded text-text-secondary border border-border">Trọng số {c.weight}%</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className={`font-bold text-lg ${c.data.score >= 8 ? 'text-green-400' : c.data.score >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
                                                    {c.data.score}
                                                </span>
                                                <span className="text-text-secondary text-sm">/10</span>
                                            </div>
                                        </div>
                                        <p className="text-text-secondary text-sm mb-3 leading-relaxed">{c.data.analysis}</p>
                                        <div className="bg-secondary/50 border-l-2 border-accent p-3 rounded-r text-sm text-text-primary/80 italic font-serif">
                                            "{c.data.evidence}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Pros & Cons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-primary p-5 rounded-lg border border-border border-l-4 border-l-green-500">
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

                                <div className="bg-primary p-5 rounded-lg border border-border border-l-4 border-l-amber-500">
                                    <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        Cần Cải Thiện
                                    </h3>
                                    <ul className="space-y-2">
                                        {score.cons.map((con, idx) => (
                                            <li key={idx} className="text-text-secondary text-sm flex gap-2 cursor-pointer hover:bg-black/20 p-2 -mx-2 rounded transition-colors" onClick={() => toggleFeedback(con)}>
                                                <input type="checkbox" checked={selectedFeedback.includes(con)} onChange={() => {}} className="mt-0.5 flex-shrink-0" />
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Overall Review */}
                            <div className="bg-primary p-6 rounded-lg border border-border">
                                <h3 className="font-bold text-text-primary mb-3">Nhận Xét Tổng Quan</h3>
                                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                                    {score.overallReview}
                                </p>
                            </div>

                            {/* Revision Section */}
                            <div className="bg-primary/50 p-6 rounded-lg border border-accent/30 mt-6 relative overflow-hidden">
                                {isRevising && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                        <svg className="animate-spin h-10 w-10 text-accent mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <p className="text-accent font-bold animate-pulse text-lg">Đang tiến hành phẫu thuật kịch bản...</p>
                                        <p className="text-xs text-text-secondary mt-2">Dữ liệu thô đang được xử lý ở màn hình Loading (nếu bật)</p>
                                    </div>
                                )}
                                <h3 className="font-bold text-accent mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                    Tự Động Sửa Kịch Bản Theo Ý Kiến
                                </h3>
                                <p className="text-sm text-text-secondary mb-4">
                                    Tích chọn (Checkbox) các <b>Phạm Quy</b> hoặc <b>Cần Cải Thiện</b> ở trên để AI tự động sửa lại những đoạn văn tương ứng.
                                    AI sẽ chỉ sửa đoạn cần thiết để không làm gãy mạch kịch bản.
                                </p>
                                <textarea 
                                    className="w-full bg-secondary text-text-primary p-3 rounded border border-border focus:border-accent outline-none text-sm min-h-[80px] mb-4 placeholder-text-secondary/50" 
                                    placeholder="Ghi chú thêm cho AI (Ví dụ: Thêm một ví dụ thực tế vào phần 2...)"
                                    value={userComment}
                                    onChange={e => setUserComment(e.target.value)}
                                />
                                <button 
                                    onClick={handleRevise}
                                    disabled={isRevising || (selectedFeedback.length === 0 && !userComment.trim())}
                                    className="w-full bg-accent hover:brightness-110 text-white font-bold py-3 px-6 rounded-md transition shadow-lg shadow-accent/20 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    Tiếp thu & Bắt Đầu Sửa
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-4 border-t border-border flex justify-end items-center gap-4 bg-secondary">
                    {isLoading && (
                        <p className="text-xs text-accent flex-grow animate-pulse">Script Doctor đang thẩm định kịch bản. Quá trình này có thể mất 15-30 giây...</p>
                    )}
                    <button 
                        onClick={handleCopy}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary/70 text-text-secondary px-4 py-2 rounded-md font-semibold transition border border-border"
                        disabled={!!copySuccess || isLoading || !!error || !score}
                    >
                        <ClipboardIcon className="w-5 h-5" />
                        <span>{copySuccess || 'Sao chép báo cáo'}</span>
                    </button>
                    <button onClick={onClose} className="bg-accent hover:brightness-110 text-white font-bold py-2 px-6 rounded-md transition">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
