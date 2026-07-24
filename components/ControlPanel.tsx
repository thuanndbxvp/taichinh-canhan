
import React, { useEffect, useState } from 'react';
import { OptionSelector } from './OptionSelector';
import { SparklesIcon } from './icons/SparklesIcon';
import type { StyleOptions, FormattingOptions, Expression, Style, ScriptType, NumberOfSpeakers, TopicSuggestionItem, SavedIdea, AiProvider } from '../types';
import { EXPRESSION_OPTIONS, STYLE_OPTIONS, LANGUAGE_OPTIONS, SCRIPT_TYPE_OPTIONS, NUMBER_OF_SPEAKERS_OPTIONS, AI_PROVIDER_OPTIONS, DEFAULT_KYMA_MODELS, OPENAI_MODELS, FINANCE_IDEAS } from '../constants';
import { IdeaBrainstorm } from './IdeaBrainstorm';
import { Tooltip } from './Tooltip';
import { EXPRESSION_EXPLANATIONS, STYLE_EXPLANATIONS, FORMATTING_EXPLANATIONS } from '../constants/explanations';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { IdeaFileUploader } from './IdeaFileUploader';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BoltIcon } from './icons/BoltIcon';


interface ControlPanelProps {
  title: string;
  setTitle: (title: string) => void;
  outlineContent: string;
  setOutlineContent: (content: string) => void;
  onGenerateSuggestions: () => void;
  isSuggesting: boolean;
  suggestions: TopicSuggestionItem[];
  suggestionError: string | null;
  hasGeneratedTopicSuggestions: boolean;
  targetAudience: string;
  setTargetAudience: (audience: string) => void;
  styleOptions: StyleOptions;
  setStyleOptions: (options: StyleOptions) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
  formattingOptions: FormattingOptions;
  setFormattingOptions: (options: FormattingOptions) => void;
  wordCount: string;
  setWordCount: (count: string) => void;
  scriptParts: string;
  setScriptParts: (parts: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onGenerateKeywordSuggestions: () => void;
  isSuggestingKeywords: boolean;
  keywordSuggestions: string[];
  keywordSuggestionError: string | null;
  hasGeneratedKeywordSuggestions: boolean;
  scriptType: ScriptType;
  setScriptType: (type: ScriptType) => void;
  numberOfSpeakers: NumberOfSpeakers;
  setNumberOfSpeakers: (num: NumberOfSpeakers) => void;
  onSuggestStyle: () => void;
  isSuggestingStyle: boolean;
  styleSuggestionError: string | null;
  hasSuggestedStyle: boolean;
  lengthType: 'words' | 'duration';
  setLengthType: (type: 'words' | 'duration') => void;
  videoDuration: string;
  setVideoDuration: (duration: string) => void;
  savedIdeas: SavedIdea[];
  onSaveIdea: (idea: TopicSuggestionItem) => void;
  onOpenSavedIdeasModal: () => void;
  onParseFile: (content: string) => void;
  isParsingFile: boolean;
  parsingFileError: string | null;
  uploadedIdeas: TopicSuggestionItem[];
  aiProvider: AiProvider;
  setAiProvider: (provider: AiProvider) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isFinanceMode?: boolean;
  apiKeys?: Record<AiProvider, string[]>;
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
  onGenerateSuggestions, isSuggesting, suggestions, suggestionError, hasGeneratedTopicSuggestions,
  targetAudience, setTargetAudience,
  styleOptions, setStyleOptions,
  keywords, setKeywords,
  formattingOptions, setFormattingOptions,
  wordCount, setWordCount,
  scriptParts, setScriptParts,
  onGenerate, isLoading,
  onGenerateKeywordSuggestions, isSuggestingKeywords, keywordSuggestions, keywordSuggestionError, hasGeneratedKeywordSuggestions,
  scriptType, setScriptType,
  numberOfSpeakers, setNumberOfSpeakers,
  onSuggestStyle, isSuggestingStyle, styleSuggestionError, hasSuggestedStyle,
  lengthType, setLengthType, videoDuration, setVideoDuration,
  savedIdeas, onSaveIdea, onOpenSavedIdeasModal,
  onParseFile, isParsingFile, parsingFileError, uploadedIdeas,
  aiProvider, setAiProvider, selectedModel, setSelectedModel,
  isFinanceMode, apiKeys
}) => {
  const [kymaModels, setKymaModels] = useState<{value: string, label: string}[]>([]);
  const [openAiModels, setOpenAiModels] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    if (aiProvider === 'kyma' && apiKeys?.kyma?.[0]) {
        fetch('https://kymaapi.com/v1/models', { headers: { 'Authorization': `Bearer ${apiKeys.kyma[0]}` } })
        .then(res => res.json())
        .then(data => {
            if (data?.data) {
                const models = data.data.map((m: any) => ({ value: m.id, label: m.name || m.id }));
                setKymaModels(models);
                if (!models.find((m: any) => m.value === selectedModel)) {
                    setSelectedModel(models[0]?.value || '');
                }
            }
        })
        .catch(console.error);
    } else if (aiProvider === 'openai') {
        const customModel = localStorage.getItem('openai-custom-model') || 'gpt-4o-mini';
        setOpenAiModels([{ value: customModel, label: `Custom: ${customModel}` }]);
        if (selectedModel !== customModel) setSelectedModel(customModel);
    }
  }, [aiProvider, apiKeys?.kyma]);
  const handleCheckboxChange = (key: keyof FormattingOptions, value: boolean) => {
    setFormattingOptions({ ...formattingOptions, [key]: value });
  };

  const handleAddKeyword = (keyword: string) => {
    setKeywords(keywords ? `${keywords}, ${keyword}` : keyword);
  };
  
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

  const handleProviderChange = (provider: AiProvider) => {
    setAiProvider(provider);
    if (provider === 'kyma') {
        setSelectedModel(kymaModels.length > 0 ? kymaModels[0].value : DEFAULT_KYMA_MODELS[0].value);
    } else {
        const customModel = localStorage.getItem('openai-custom-model') || 'gpt-4o-mini';
        setSelectedModel(customModel);
    }
  };

  const handleSelectDarkFrontiersIdea = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    if (!selectedTitle) return;
    
    const idea = FINANCE_IDEAS.find(i => i.title === selectedTitle);
    if (idea) {
        const cleanedTitle = idea.title.replace(/^\d+\.\s*/, '');
        setTitle(cleanedTitle);
        setOutlineContent(idea.outline);
    }
  };

  const modelOptions = aiProvider === 'kyma' 
    ? (kymaModels.length > 0 ? kymaModels : DEFAULT_KYMA_MODELS)
    : (openAiModels.length > 0 ? openAiModels : OPENAI_MODELS);

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
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition ${isFinanceMode ? 'bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40' : 'bg-secondary hover:bg-border text-text-secondary hover:text-text-primary'}`}
                >
                    <BookmarkIcon className="w-3 h-3"/>
                    <span>Lưu tất cả</span>
                </button>
            )}
        </div>
        <div className={`h-48 min-h-[10rem] resize-y overflow-auto border rounded-md space-y-2 p-2 ${isFinanceMode ? 'bg-black border-emerald-900/50' : 'bg-primary border-border'}`}>
            {ideaList.map((idea, index) => (
                <div key={`${listTitle}-${idea.title}-${index}`} className={`text-left text-sm w-full p-3 rounded-md ${isFinanceMode ? 'bg-zinc-900/50 border border-emerald-900/20' : 'bg-secondary'}`}>
                  <strong className={`${isFinanceMode ? 'text-emerald-100' : 'text-text-primary'} block`}>{idea.title}</strong>
                  {idea.vietnameseTitle && idea.vietnameseTitle !== idea.title && <span className="text-xs mt-1 block text-accent/80">{idea.vietnameseTitle}</span>}
                  <span className="text-xs mt-1 block text-text-secondary">{idea.outline}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => {
                        setTitle(idea.title);
                        setOutlineContent(idea.outline);
                      }}
                      className={`text-xs px-2 py-1 rounded-md transition ${isFinanceMode ? 'bg-emerald-700 text-white hover:bg-emerald-600' : 'bg-accent/80 hover:bg-accent text-white'}`}
                    >
                        Sử dụng
                    </button>
                    <button 
                        onClick={() => onSaveIdea(idea)}
                        disabled={isIdeaSaved(idea)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed ${isFinanceMode ? 'bg-zinc-800 text-emerald-500 hover:bg-zinc-700' : 'bg-primary hover:bg-secondary text-text-secondary'}`}
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
        <ControlSection title="1. Ý tưởng chính" isDark={isFinanceMode}>
            <input
              id="title"
              type="text"
              className={`w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent'}`}
              placeholder="Nhập Tiêu đề Video, VD: 'Tương lai của du hành vũ trụ'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              id="outline"
              rows={4}
              className={`mt-2 w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent'}`}
              placeholder="Phác họa nội dung (tùy chọn), VD: 'Đề cập đến lãi kép, quỹ dự phòng, bẫy tâm lý chi tiêu. Tầm nhìn 5 năm tới.'"
              value={outlineContent}
              onChange={(e) => setOutlineContent(e.target.value)}
            />
            
            <Tooltip text="Sử dụng AI để thảo luận và phát triển ý tưởng của bạn một cách tương tác.">
              <IdeaBrainstorm 
                  setTitle={setTitle} 
                  setOutlineContent={setOutlineContent}
                  aiProvider={aiProvider}
                  selectedModel={selectedModel}
              />
            </Tooltip>

            {isFinanceMode && (
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
                        {FINANCE_IDEAS.map(idea => (
                            <option key={idea.title} value={idea.title}>{idea.title}</option>
                        ))}
                    </select>
                </div>
            )}

            <Tooltip text="Tải lên một file .txt chứa danh sách các ý tưởng để AI tự động phân tích và thêm vào danh sách gợi ý.">
              <IdeaFileUploader 
                  onParse={onParseFile}
                  isLoading={isParsingFile}
                  error={parsingFileError}
              />
            </Tooltip>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <Tooltip text="Dựa trên tiêu đề bạn nhập, AI sẽ đề xuất 5 ý tưởng video khác nhau với tiêu đề và dàn ý sơ bộ.">
                  <button 
                    onClick={onGenerateSuggestions} 
                    disabled={isSuggesting || !title}
                    className={`w-full flex items-center justify-center font-bold py-2 px-4 rounded-lg transition border ${isFinanceMode ? 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500 hover:bg-emerald-900/40' : 'bg-secondary hover:bg-secondary/70 text-text-primary border-border'} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {isSuggesting ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        <span>Gợi ý AI</span>
                        {!isSuggesting && hasGeneratedTopicSuggestions && <CheckIcon className="w-5 h-5 ml-2 text-green-400" />}
                      </>
                    )}
                  </button>
                </Tooltip>
                <Tooltip text="Xem và quản lý tất cả các ý tưởng video bạn đã lưu trước đó.">
                  <button 
                    onClick={onOpenSavedIdeasModal} 
                    className={`w-full flex items-center justify-center font-bold py-2 px-4 rounded-lg transition border ${isFinanceMode ? 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500 hover:bg-emerald-900/40' : 'bg-secondary hover:bg-secondary/70 text-text-primary border-border'}`}
                  >
                    Kho Ý Tưởng
                  </button>
                </Tooltip>
            </div>

            {suggestionError && <p className="text-red-400 text-sm mt-2">{suggestionError}</p>}
            {suggestions.length > 0 && <IdeaList ideaList={suggestions} listTitle="Gợi ý từ AI" />}
            {uploadedIdeas.length > 0 && <IdeaList ideaList={uploadedIdeas} listTitle="Ý tưởng từ File của bạn" />}
        </ControlSection>

        <ControlSection title="2. Nhà cung cấp AI & Model" isDark={isFinanceMode}>
            <div className={`flex rounded-lg p-1 mb-3 ${isFinanceMode ? 'bg-black' : 'bg-primary'}`}>
                {AI_PROVIDER_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => handleProviderChange(option.value)}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                            aiProvider === option.value 
                            ? (isFinanceMode ? 'bg-emerald-700 text-white shadow-sm' : 'bg-accent text-white shadow-sm') 
                            : (isFinanceMode ? 'text-emerald-500/60 hover:text-emerald-500' : 'text-text-primary hover:bg-secondary')
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
             <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent'}`}
            >
              {modelOptions.map(model => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
        </ControlSection>

        <ControlSection title="3. Từ khóa SEO (Tùy chọn)" isDark={isFinanceMode}>
            <input
              id="keywords"
              type="text"
              className={`w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent'}`}
              placeholder="VD: AI, sáng tạo, tương lai"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <Tooltip text="AI sẽ gợi ý các từ khóa SEO liên quan đến chủ đề của bạn để tăng khả năng được tìm thấy.">
              <button 
                onClick={onGenerateKeywordSuggestions} 
                disabled={isSuggestingKeywords || !title}
                className={`w-full mt-2 flex items-center justify-center transition text-sm py-2 px-4 rounded-lg border ${isFinanceMode ? 'bg-emerald-900/10 border-emerald-900/30 text-emerald-500 hover:bg-emerald-900/20' : 'bg-secondary/70 hover:bg-secondary text-text-primary border-border'} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isSuggestingKeywords ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gợi ý...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    <span>Gợi ý từ khóa</span>
                    {!isSuggestingKeywords && hasGeneratedKeywordSuggestions && <CheckIcon className="w-4 h-4 ml-2 text-green-400" />}
                  </>
                )}
              </button>
            </Tooltip>
            {keywordSuggestionError && <p className="text-red-400 text-sm mt-2">{keywordSuggestionError}</p>}
            {keywordSuggestions.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs font-medium text-text-secondary mb-2">Gợi ý:</p>
                    <div className="flex flex-wrap gap-2">
                        {keywordSuggestions.map((suggestion, index) => (
                            <button key={index} onClick={() => handleAddKeyword(suggestion)} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${isFinanceMode ? 'bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40' : 'bg-secondary hover:bg-primary/50 text-text-primary'}`}>
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </ControlSection>

        <ControlSection title="4. Định dạng Kịch bản" isDark={isFinanceMode}>
            <div className={`flex rounded-lg p-1 ${isFinanceMode ? 'bg-black' : 'bg-primary'}`}>
                {SCRIPT_TYPE_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setScriptType(option.value)}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                            scriptType === option.value 
                            ? (isFinanceMode ? 'bg-emerald-700 text-white shadow-sm' : 'bg-accent text-white shadow-sm') 
                            : (isFinanceMode ? 'text-emerald-500/60 hover:text-emerald-500' : 'text-text-primary hover:bg-secondary')
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </ControlSection>

        {scriptType === 'Podcast' && (
          <ControlSection title="5. Số lượng người nói" isDark={isFinanceMode}>
            <OptionSelector<NumberOfSpeakers>
                options={NUMBER_OF_SPEAKERS_OPTIONS}
                selectedOption={numberOfSpeakers}
                onSelect={setNumberOfSpeakers}
            />
          </ControlSection>
        )}

        <ControlSection title={`${scriptType === 'Podcast' ? '6' : '5'}. Ngôn ngữ`} isDark={isFinanceMode}>
            <select
              id="language"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className={`w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent'}`}
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
        </ControlSection>

        <ControlSection title={`${scriptType === 'Podcast' ? '7' : '6'}. Cấu trúc & Định dạng`} isDark={isFinanceMode}>
            <div className={`flex rounded-lg p-1 mb-4 ${isFinanceMode ? 'bg-black' : 'bg-primary'}`}>
                <button
                    onClick={() => setLengthType('words')}
                    className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                        lengthType === 'words' 
                        ? (isFinanceMode ? 'bg-emerald-700 text-white shadow-sm' : 'bg-accent text-white shadow-sm') 
                        : (isFinanceMode ? 'text-emerald-500/60 hover:text-emerald-500' : 'text-text-primary hover:bg-secondary')
                    }`}
                >
                    Theo số từ
                </button>
                <button
                    onClick={() => setLengthType('duration')}
                    className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                        lengthType === 'duration' 
                        ? (isFinanceMode ? 'bg-emerald-700 text-white shadow-sm' : 'bg-accent text-white shadow-sm') 
                        : (isFinanceMode ? 'text-emerald-500/60 hover:text-emerald-500' : 'text-text-primary hover:bg-secondary')
                    }`}
                >
                    Theo thời lượng
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lengthType === 'words' ? (
                    <Tooltip text={FORMATTING_EXPLANATIONS.wordCount}>
                        <div>
                            <label htmlFor="wordCount" className="block text-xs font-medium text-text-secondary mb-1">Tổng số từ</label>
                            <input id="wordCount" type="number" value={wordCount} onChange={e => setWordCount(e.target.value)} className={`w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent'}`} placeholder="VD: 800"/>
                        </div>
                    </Tooltip>
                ) : (
                    <Tooltip text={FORMATTING_EXPLANATIONS.videoDuration}>
                        <div>
                            <label htmlFor="videoDuration" className="block text-xs font-medium text-text-secondary mb-1">Thời lượng video (phút)</label>
                            <input id="videoDuration" type="number" value={videoDuration} onChange={e => setVideoDuration(e.target.value)} className={`w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent'}`} placeholder="VD: 5"/>
                        </div>
                    </Tooltip>
                )}

                {scriptType === 'Video' && (
                  <Tooltip text={FORMATTING_EXPLANATIONS.scriptParts}>
                      <div>
                          <label htmlFor="scriptParts" className="block text-xs font-medium text-text-secondary mb-1">Số phần</label>
                          <div className="flex items-center space-x-2">
                              <input 
                                  id="scriptParts" 
                                  type="number" 
                                  value={scriptParts === 'Auto' ? '' : scriptParts} 
                                  onChange={e => setScriptParts(e.target.value)} 
                                  disabled={scriptParts === 'Auto'}
                                  className={`w-full border rounded-md p-2 transition focus:ring-2 ${isFinanceMode ? 'bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-40' : 'bg-primary border-border text-text-primary focus:ring-accent focus:border-accent disabled:bg-primary/50'} disabled:cursor-not-allowed`} 
                                  placeholder="3"
                              />
                              <label className="flex items-center space-x-2 cursor-pointer whitespace-nowrap">
                                  <input 
                                      type="checkbox" 
                                      className={`h-4 w-4 rounded border-border focus:ring-accent ${isFinanceMode ? 'text-emerald-600 bg-zinc-900' : 'text-accent bg-secondary'}`} 
                                      checked={scriptParts === 'Auto'} 
                                      onChange={(e) => setScriptParts(e.target.checked ? 'Auto' : '3')} 
                                  />
                                  <span className={`text-sm ${isFinanceMode ? 'text-emerald-200/80' : 'text-text-primary'}`}>Tự động</span>
                              </label>
                          </div>
                      </div>
                  </Tooltip>
                )}
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
                <Tooltip text={FORMATTING_EXPLANATIONS.includeIntro} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent ${isFinanceMode ? 'text-emerald-600 bg-zinc-900' : 'text-accent bg-secondary'}`} checked={formattingOptions.includeIntro} onChange={(e) => handleCheckboxChange('includeIntro', e.target.checked)} />
                        <span className={`${isFinanceMode ? 'text-emerald-200/80' : 'text-text-primary'}`}>Intro</span>
                    </label>
                </Tooltip>
                 <Tooltip text={FORMATTING_EXPLANATIONS.includeOutro} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent ${isFinanceMode ? 'text-emerald-600 bg-zinc-900' : 'text-accent bg-secondary'}`} checked={formattingOptions.includeOutro} onChange={(e) => handleCheckboxChange('includeOutro', e.target.checked)} />
                        <span className={`${isFinanceMode ? 'text-emerald-200/80' : 'text-text-primary'}`}>Outro</span>
                    </label>
                </Tooltip>
                <Tooltip text={FORMATTING_EXPLANATIONS.headings} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent ${isFinanceMode ? 'text-emerald-600 bg-zinc-900' : 'text-accent bg-secondary'}`} checked={formattingOptions.headings} onChange={(e) => handleCheckboxChange('headings', e.target.checked)} />
                        <span className={`${isFinanceMode ? 'text-emerald-200/80' : 'text-text-primary'}`}>Tiêu đề</span>
                    </label>
                </Tooltip>
                <Tooltip text={FORMATTING_EXPLANATIONS.bullets} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent ${isFinanceMode ? 'text-emerald-600 bg-zinc-900' : 'text-accent bg-secondary'}`} checked={formattingOptions.bullets} onChange={(e) => handleCheckboxChange('bullets', e.target.checked)} />
                        <span className={`${isFinanceMode ? 'text-emerald-200/80' : 'text-text-primary'}`}>Gạch đầu dòng</span>
                    </label>
                </Tooltip>
                 <Tooltip text={FORMATTING_EXPLANATIONS.bold} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent ${isFinanceMode ? 'text-emerald-600 bg-zinc-900' : 'text-accent bg-secondary'}`} checked={formattingOptions.bold} onChange={(e) => handleCheckboxChange('bold', e.target.checked)} />
                        <span className={`${isFinanceMode ? 'text-emerald-200/80' : 'text-text-primary'}`}>In đậm/nghiêng</span>
                    </label>
                </Tooltip>
            </div>
        </ControlSection>
        <Tooltip text="Tạo ra kịch bản hoàn chỉnh dựa trên tất cả các thiết lập bạn đã chọn ở trên.">
          <button
              onClick={onGenerate}
              disabled={isLoading || !title}
              className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg ${isFinanceMode ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 text-white' : 'bg-accent hover:brightness-110 shadow-accent/20 text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
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
