
import React, { useState } from 'react';
import { OptionSelector } from './OptionSelector';
import { SparklesIcon } from './icons/SparklesIcon';
import type { StyleOptions, ScriptType, NumberOfSpeakers, TopicSuggestionItem, SavedIdea, AiProvider } from '../types';
import { LANGUAGE_OPTIONS, SCRIPT_TYPE_OPTIONS, NUMBER_OF_SPEAKERS_OPTIONS, FINANCE_IDEAS } from '../constants';

import { Tooltip } from './Tooltip';
import { FORMATTING_EXPLANATIONS } from '../constants/explanations';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { IdeaFileUploader } from './IdeaFileUploader';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BoltIcon } from './icons/BoltIcon';
import { determineToleranceMode, type ToleranceMode } from '../src/domain/wordCount';
import type { OutlineEstimation } from '../src/features/generation/useGenerationWorkflow';


interface ControlPanelProps {
  title: string;
  setTitle: (title: string) => void;
  outlineContent: string;
  setOutlineContent: (content: string) => void;

  targetAudience: string;
  setTargetAudience: (audience: string) => void;
  styleOptions: StyleOptions;
  setStyleOptions: (options: StyleOptions) => void;
  wordCount: string;
  setWordCount: (count: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  scriptType: ScriptType;
  setScriptType: (type: ScriptType) => void;
  numberOfSpeakers: NumberOfSpeakers;
  setNumberOfSpeakers: (num: NumberOfSpeakers) => void;
  scriptStyle: string;
  setScriptStyle: (style: string) => void;
  scriptHook: string;
  setScriptHook: (hook: string) => void;
  onSuggestStyle: () => void;
  isSuggestingStyle: boolean;
  styleSuggestionError: string | null;
  hasSuggestedStyle: boolean;
  lengthType: 'words' | 'duration';
  setLengthType: (type: 'words' | 'duration') => void;
  videoDuration: string;
  setVideoDuration: (duration: string) => void;
  savedIdeas: SavedIdea[];
  onSaveIdea: (idea: TopicSuggestionItem) => void | Promise<void>;

  onParseFile: (content: string) => void | Promise<void>;
  isParsingFile: boolean;
  parsingFileError: string | null;
  uploadedIdeas: TopicSuggestionItem[];
  apiKeys: Record<AiProvider, string[]>;
  getNextAiConfig: () => { provider: AiProvider; model: string } | null;
  // MSEW-track1-phase4: Word count estimation from outline
  outlineEstimation?: OutlineEstimation | null;
}

const ControlSection: React.FC<{title: string; children: React.ReactNode; isDark?: boolean}> = ({ title, children, isDark }) => (
  <div className={`${isDark ? 'bg-zinc-900 border-emerald-900/40' : 'bg-secondary border-border'} p-4 rounded-lg border`}>
    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-emerald-500/80' : 'text-text-primary'}`}>{title}</label>
    {children}
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  title, setTitle,
  outlineContent, setOutlineContent,

  targetAudience, setTargetAudience,
  styleOptions, setStyleOptions,
  wordCount, setWordCount,
  onGenerate, isLoading,
  scriptType, setScriptType,
  numberOfSpeakers, setNumberOfSpeakers,
  scriptStyle, setScriptStyle,
  scriptHook, setScriptHook,
  onSuggestStyle, isSuggestingStyle, styleSuggestionError, hasSuggestedStyle,
  lengthType, setLengthType, videoDuration, setVideoDuration,
  savedIdeas, onSaveIdea,
  onParseFile, isParsingFile, parsingFileError, uploadedIdeas,
  getNextAiConfig,
  apiKeys,
  outlineEstimation,
}) => {

  const WORD_COUNT_PRESETS = [
    { label: '600 từ (Ngắn - 3\')', value: '600', duration: '~3 phút' },
    { label: '1200 từ (Chuẩn - 6-7\')', value: '1200', duration: '~6-7 phút' },
    { label: '1800 từ (Chuyên sâu - 10\')', value: '1800', duration: '~10 phút', recommended: true },
    { label: '2400 từ (Chi tiết - 13-14\')', value: '2400', duration: '~13-14 phút' },
  ];


  
  const isIdeaSaved = (idea: TopicSuggestionItem) => {
    return savedIdeas.some(saved => saved.title === idea.title && saved.outline === idea.outline);
  };

  const handleSaveAll = (ideasToSave: TopicSuggestionItem[]) => {
      ideasToSave.forEach(idea => {
          if (!isIdeaSaved(idea)) {
              onSaveIdea(idea);
          }
      });
  };


  const handleSelectDarkFrontiersIdea = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    if (!selectedTitle) return;
    
    const idea = FINANCE_IDEAS.find(i => i.title === selectedTitle);
    if (idea) {
        const cleanedTitle = idea.title.replace(/^\d+\.\s*/, '');
        setTitle(cleanedTitle);
        setOutlineContent(idea.outline);
        
        let targetBranch = 'auto';
        if (idea.branch) {
            targetBranch = idea.branch;
            setScriptStyle(idea.branch);
        } else {
            setScriptStyle('auto');
        }

        // Tự động gán Hook để bỏ qua bước gọi AI phân loại
        if (idea.hook) {
            setScriptHook(idea.hook);
        } else if (targetBranch !== 'auto') {
            const branchToHookMap: Record<string, string> = {
                'psychology': 'story',
                'mythbusting': 'myth',
                'analytical': 'data',
                'listicle': 'question',
                'fundamental': 'question'
            };
            setScriptHook(branchToHookMap[targetBranch] || 'auto');
        } else {
            setScriptHook('auto');
        }
    }
  };


  const IdeaList: React.FC<{
    ideaList: TopicSuggestionItem[], 
    listTitle: string,
  }> = ({ ideaList, listTitle }) => (
    <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-text-secondary">{listTitle}:</p>
            {ideaList.length > 0 && (
                <button 
                    onClick={() => handleSaveAll(ideaList)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40`}
                >
                    <BookmarkIcon className="w-3 h-3"/>
                    <span>Lưu tất cả</span>
                </button>
            )}
        </div>
        <div className={`h-48 min-h-[10rem] resize-y overflow-auto border rounded-md space-y-2 p-2 bg-black border-emerald-900/50`}>
            {ideaList.map((idea, index) => (
                <div key={`${listTitle}-${idea.title}-${index}`} className={`text-left text-sm w-full p-3 rounded-md bg-zinc-900/50 border border-emerald-900/20`}>
                  <strong className={`text-emerald-100 block`}>{idea.title}</strong>
                  {idea.vietnameseTitle && idea.vietnameseTitle !== idea.title && <span className="text-xs mt-1 block text-accent/80">{idea.vietnameseTitle}</span>}
                  <span className="text-xs mt-1 block text-text-secondary">{idea.outline}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => {
                        setTitle(idea.title);
                        setOutlineContent(idea.outline);
                      }}
                      className={`text-xs px-2 py-1 rounded-md transition bg-emerald-700 text-white hover:bg-emerald-600`}
                    >
                        Sử dụng
                    </button>
                    <button 
                        onClick={() => onSaveIdea(idea)}
                        disabled={isIdeaSaved(idea)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-800 text-emerald-500 hover:bg-zinc-700`}
                      >
                          {isIdeaSaved(idea) ? (
                              <>
                                  <CheckIcon className="w-3.5 h-3.5 text-green-400" />
                                  <span className="text-text-secondary">Đã lưu</span>
                              </>
                          ) : (
                              <>
                                  <BookmarkIcon className="w-3 h-3"/>
                                  <span>Lưu</span>
                              </>
                          )}
                      </button>
                  </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
        <ControlSection title="1. Ý tưởng chính" isDark>
            <input
              id="title"
              type="text"
              className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="Nhập Tiêu đề (Móng của Kịch bản), VD: 'Lương 20 triệu vẫn thiếu'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              id="outline"
              rows={4}
              maxLength={800}
              className={`mt-2 w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="Yêu cầu từ Đạo diễn (Gia vị), VD: 'Nhấn mạnh bẫy mua sắm trả góp, bắt buộc nhắc quỹ dự phòng'"
              value={outlineContent}
              onChange={(e) => setOutlineContent(e.target.value)}
            />
            <p className="mt-1 text-xs text-amber-500/80 italic">
              Tối đa 800 ký tự. Để viết lại kịch bản dài, hãy dùng tính năng Tẩy rửa kịch bản gốc.
            </p>

            <div className="mt-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">
                        <BoltIcon className="w-4 h-4" />
                        Chủ đề Tài chính Cá nhân Gợi ý
                    </label>
                    <select
                        onChange={handleSelectDarkFrontiersIdea}
                        className="w-full bg-black border border-emerald-500/50 rounded-md p-2 text-emerald-200 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        defaultValue=""
                    >
                        <option value="" disabled>-- Chọn chủ đề tài chính --</option>
                        <optgroup label="Chú béo gợi ý">
                            {FINANCE_IDEAS.filter(i => i.category === 'Chú béo gợi ý').map(idea => (
                                <option key={idea.title} value={idea.title}>{idea.title}</option>
                            ))}
                        </optgroup>
                        <optgroup label="AI gợi ý">
                            {FINANCE_IDEAS.filter(i => i.category === 'AI gợi ý').map(idea => (
                                <option key={idea.title} value={idea.title}>{idea.title}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>



            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Tooltip text="Chọn phong cách cho kịch bản. Mặc định AI sẽ tự động phân loại dựa vào chủ đề.">
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">Phong cách Kịch bản</label>
                        <select 
                            value={scriptStyle} 
                            onChange={e => setScriptStyle(e.target.value)} 
                            className="w-full bg-black border border-emerald-900/50 rounded-md p-2 text-emerald-100 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                            <option value="auto">✨ AI Tự Động Phân Loại</option>
                            <option value="analytical">Phân tích Số liệu (Analytical)</option>
                            <option value="psychology">Tâm lý Xã hội (Psychology)</option>
                            <option value="mythbusting">Bóc phốt lầm tưởng (Myth-busting)</option>
                            <option value="listicle">Danh sách thực chiến (Listicle)</option>
                            <option value="fundamental">Kỹ năng & Kiến thức nền tảng (Fundamental)</option>
                        </select>
                    </div>
                </Tooltip>
                
                <Tooltip text="Chọn kiểu Hook mở đầu. Mặc định AI sẽ tự động chọn để tạo sự đa dạng.">
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">Kiểu Mở Đầu (Hook)</label>
                        <select 
                            value={scriptHook} 
                            onChange={e => setScriptHook(e.target.value)} 
                            className="w-full bg-black border border-emerald-900/50 rounded-md p-2 text-emerald-100 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                            <option value="auto">✨ AI Tự Động Chọn</option>
                            <option value="story">Kể chuyện cá nhân (Story)</option>
                            <option value="data">Số liệu gây sốc (Data)</option>
                            <option value="myth">Đập tan lầm tưởng (Myth)</option>
                            <option value="question">Câu hỏi tương tác (Question)</option>
                        </select>
                    </div>
                </Tooltip>
            </div>


            {uploadedIdeas.length > 0 && <IdeaList ideaList={uploadedIdeas} listTitle="Ý tưởng từ File của bạn" />}
        </ControlSection>

        <ControlSection title="2. Cấu trúc & Dung lượng Kịch bản" isDark>
          <div className="space-y-3">
            {/* Khung Gợi Ý Từ AI khi có Outline Estimation */}
            {outlineEstimation && (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-200">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                  <span>Gợi ý AI:</span>
                  <span>Tối thiểu {outlineEstimation.minRecommendedWords.toLocaleString()} từ (Lý tưởng: {outlineEstimation.optimalWords.toLocaleString()} từ)</span>
                </div>
                <p className="text-emerald-300/80">{outlineEstimation.reason}</p>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="wordCount" className="text-xs font-medium text-text-secondary">
                  Tổng số từ mục tiêu
                </label>
                {outlineContent && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-900/40">
                    {determineToleranceMode(outlineContent, parseInt(wordCount, 10) || 1800, outlineEstimation?.minRecommendedWords ?? 0) === 'flexible'
                      ? 'Linh hoạt (±20%)'
                      : 'Chuẩn mực (±5%)'}
                  </span>
                )}
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                {WORD_COUNT_PRESETS.map((preset) => {
                  const isSelected = wordCount === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setWordCount(preset.value)}
                      className={`px-2.5 py-1.5 text-xs rounded-md border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold shadow-sm'
                          : 'border-emerald-900/30 bg-black/40 text-emerald-100/70 hover:bg-emerald-950/40 hover:text-emerald-200'
                      }`}
                      title={preset.duration}
                    >
                      <div className="flex items-center justify-between">
                        <span>{preset.label}</span>
                        {preset.recommended && <span className="text-amber-400 text-[10px]">*</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Input số từ tùy chỉnh */}
              <input
                id="wordCount"
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                min={100}
                max={10000}
                step={100}
                className="w-full border rounded-md p-2 text-sm bg-black border-emerald-900/50 text-emerald-100 focus:ring-1 focus:ring-emerald-500 outline-none"
                placeholder="VD: 1800"
              />

              {/* Ước tính thời lượng đọc */}
              {parseInt(wordCount, 10) > 0 && (
                <div className="mt-1.5 text-[11px] text-emerald-400/60 flex items-center justify-between">
                  <span>Thoi luong uoc tinh: ~{Math.round((parseInt(wordCount, 10) || 0) / 180)} phut</span>
                  <span>(Toc do 180 WPM)</span>
                </div>
              )}

              {/* Cảnh báo nếu nhập dưới mức tối thiểu mà không có yêu cầu ngắn */}
              {outlineEstimation && parseInt(wordCount, 10) < outlineEstimation.minRecommendedWords && (
                <div className="mt-2 p-2 rounded bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90">
                  Ban dang dat so tu thap hon muc khuyen nghi ({outlineEstimation.minRecommendedWords} tu). Noi dung bai toan so lieu co the bi rut gon.
                </div>
              )}
            </div>
          </div>
        </ControlSection>
        <Tooltip text="Tạo ra kịch bản hoàn chỉnh dựa trên tất cả các thiết lập bạn đã chọn ở trên.">
          <button
              onClick={onGenerate}
              disabled={isLoading || !title}
              className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Tạo kịch bản
                </>
              )}
          </button>
        </Tooltip>
    </div>
  );
};


