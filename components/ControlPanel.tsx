
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
  onSaveIdea: (idea: TopicSuggestionItem) => void | Promise<void>;
  onOpenSavedIdeasModal: () => void;
  onParseFile: (content: string) => void;
  isParsingFile: boolean;
  parsingFileError: string | null;
  uploadedIdeas: TopicSuggestionItem[];
  aiProvider: AiProvider;
  setAiProvider: (provider: AiProvider) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
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
  apiKeys
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
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40`}
                >
                    <BookmarkIcon className="w-3 h-3"/>
                    <span>LÆ°u táº¥t cáº£</span>
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
                        Sá»­ dá»¥ng
                    </button>
                    <button 
                        onClick={() => onSaveIdea(idea)}
                        disabled={isIdeaSaved(idea)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-800 text-emerald-500 hover:bg-zinc-700`}
                      >
                          {isIdeaSaved(idea) ? (
                              <>
                                  <CheckIcon className="w-3.5 h-3.5 text-green-400" />
                                  <span className="text-text-secondary">ÄÃ£ lÆ°u</span>
                              </>
                          ) : (
                              <>
                                  <BookmarkIcon className="w-3 h-3"/>
                                  <span>LÆ°u</span>
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
        <ControlSection title="1. Ã tÆ°á»Ÿng chÃ­nh" isDark>
            <input
              id="title"
              type="text"
              className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="Nháº­p TiÃªu Ä‘á» Video, VD: 'TÆ°Æ¡ng lai cá»§a du hÃ nh vÅ© trá»¥'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              id="outline"
              rows={4}
              className={`mt-2 w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="PhÃ¡c há»a ná»™i dung (tÃ¹y chá»n), VD: 'Äá» cáº­p Ä‘áº¿n lÃ£i kÃ©p, quá»¹ dá»± phÃ²ng, báº«y tÃ¢m lÃ½ chi tiÃªu. Táº§m nhÃ¬n 5 nÄƒm tá»›i.'"
              value={outlineContent}
              onChange={(e) => setOutlineContent(e.target.value)}
            />
            
            <Tooltip text="Sá»­ dá»¥ng AI Ä‘á»ƒ tháº£o luáº­n vÃ  phÃ¡t triá»ƒn Ã½ tÆ°á»Ÿng cá»§a báº¡n má»™t cÃ¡ch tÆ°Æ¡ng tÃ¡c.">
              <IdeaBrainstorm 
                  setTitle={setTitle} 
                  setOutlineContent={setOutlineContent}
                  aiProvider={aiProvider}
                  selectedModel={selectedModel}
              />
            </Tooltip>

            <div className="mt-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">
                        <BoltIcon className="w-4 h-4" />
                        Chúố đè Tài chính Cá nhân Gợi ý
                    </label>
                    <select
                        onChange={handleSelectDarkFrontiersIdea}
                        className="w-full bg-black border border-emerald-500/50 rounded-md p-2 text-emerald-200 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        defaultValue=""
                    >
                        <option value="" disabled>-- Chọn chúố đè tài chính --</option>
                        {FINANCE_IDEAS.map(idea => (
                            <option key={idea.title} value={idea.title}>{idea.title}</option>
                        ))}
                    </select>
                </div>

            <Tooltip text="Tải lên một file .txt chứa danh sách các ý tưởng để AI tự động phân tích và thêm vào danh sách gợi ý.">
              <IdeaFileUploader 
                  onParse={onParseFile}
                  isLoading={isParsingFile}
                  error={parsingFileError}
              />
            </Tooltip>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <Tooltip text="Dá»±a trÃªn tiÃªu Ä‘á» báº¡n nháº­p, AI sáº½ Ä‘á» xuáº¥t 5 Ã½ tÆ°á»Ÿng video khÃ¡c nhau vá»›i tiÃªu Ä‘á» vÃ  dÃ n Ã½ sÆ¡ bá»™.">
                  <button 
                    onClick={onGenerateSuggestions} 
                    disabled={isSuggesting || !title}
                    className={`w-full flex items-center justify-center font-bold py-2 px-4 rounded-lg transition border bg-emerald-900/20 border-emerald-900/40 text-emerald-500 hover:bg-emerald-900/40 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {isSuggesting ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        <span>Gá»£i Ã½ AI</span>
                        {!isSuggesting && hasGeneratedTopicSuggestions && <CheckIcon className="w-5 h-5 ml-2 text-green-400" />}
                      </>
                    )}
                  </button>
                </Tooltip>
                <Tooltip text="Xem vÃ  quáº£n lÃ½ táº¥t cáº£ cÃ¡c Ã½ tÆ°á»Ÿng video báº¡n Ä‘Ã£ lÆ°u trÆ°á»›c Ä‘Ã³.">
                  <button 
                    onClick={onOpenSavedIdeasModal} 
                    className={`w-full flex items-center justify-center font-bold py-2 px-4 rounded-lg transition border bg-emerald-900/20 border-emerald-900/40 text-emerald-500 hover:bg-emerald-900/40`}
                  >
                    Kho Ã TÆ°á»Ÿng
                  </button>
                </Tooltip>
            </div>

            {suggestionError && <p className="text-red-400 text-sm mt-2">{suggestionError}</p>}
            {suggestions.length > 0 && <IdeaList ideaList={suggestions} listTitle="Gá»£i Ã½ tá»« AI" />}
            {uploadedIdeas.length > 0 && <IdeaList ideaList={uploadedIdeas} listTitle="Ã tÆ°á»Ÿng tá»« File cá»§a báº¡n" />}
        </ControlSection>

        <ControlSection title="2. NhÃ  cung cáº¥p AI & Model" isDark>
            <div className={`flex rounded-lg p-1 mb-3 bg-black`}>
                {AI_PROVIDER_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => handleProviderChange(option.value)}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                            aiProvider === option.value 
                            ? 'bg-emerald-700 text-white shadow-sm' 
                            : 'text-emerald-500/60 hover:text-emerald-500'
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
              className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`}
            >
              {modelOptions.map(model => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
        </ControlSection>

        <ControlSection title="3. Tá»« khÃ³a SEO (TÃ¹y chá»n)" isDark>
            <input
              id="keywords"
              type="text"
              className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="VD: AI, sÃ¡ng táº¡o, tÆ°Æ¡ng lai"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <Tooltip text="AI sáº½ gá»£i Ã½ cÃ¡c tá»« khÃ³a SEO liÃªn quan Ä‘áº¿n chá»§ Ä‘á» cá»§a báº¡n Ä‘á»ƒ tÄƒng kháº£ nÄƒng Ä‘Æ°á»£c tÃ¬m tháº¥y.">
              <button 
                onClick={onGenerateKeywordSuggestions} 
                disabled={isSuggestingKeywords || !title}
                className={`w-full mt-2 flex items-center justify-center transition text-sm py-2 px-4 rounded-lg border bg-emerald-900/10 border-emerald-900/30 text-emerald-500 hover:bg-emerald-900/20 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isSuggestingKeywords ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Äang gá»£i Ã½...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    <span>Gá»£i Ã½ tá»« khÃ³a</span>
                    {!isSuggestingKeywords && hasGeneratedKeywordSuggestions && <CheckIcon className="w-4 h-4 ml-2 text-green-400" />}
                  </>
                )}
              </button>
            </Tooltip>
            {keywordSuggestionError && <p className="text-red-400 text-sm mt-2">{keywordSuggestionError}</p>}
            {keywordSuggestions.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs font-medium text-text-secondary mb-2">Gá»£i Ã½:</p>
                    <div className="flex flex-wrap gap-2">
                        {keywordSuggestions.map((suggestion, index) => (
                            <button key={index} onClick={() => handleAddKeyword(suggestion)} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40`}>
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </ControlSection>

        <ControlSection title="4. Äá»‹nh dáº¡ng Ká»‹ch báº£n" isDark>
            <div className={`flex rounded-lg p-1 bg-black`}>
                {SCRIPT_TYPE_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setScriptType(option.value)}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                            scriptType === option.value 
                            ? 'bg-emerald-700 text-white shadow-sm' 
                            : 'text-emerald-500/60 hover:text-emerald-500'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </ControlSection>

        {scriptType === 'Podcast' && (
          <ControlSection title="5. Sá»‘ lÆ°á»£ng ngÆ°á»i nÃ³i" isDark>
            <OptionSelector<NumberOfSpeakers>
                options={NUMBER_OF_SPEAKERS_OPTIONS}
                selectedOption={numberOfSpeakers}
                onSelect={setNumberOfSpeakers}
            />
          </ControlSection>
        )}

        <ControlSection title={`${scriptType === 'Podcast' ? '6' : '5'}. NgÃ´n ngá»¯`} isDark>
            <select
              id="language"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`}
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
        </ControlSection>

        <ControlSection title={`${scriptType === 'Podcast' ? '7' : '6'}. Cáº¥u trÃºc & Äá»‹nh dáº¡ng`} isDark>
            <div className={`flex rounded-lg p-1 mb-4 bg-black`}>
                <button
                    onClick={() => setLengthType('words')}
                    className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                        lengthType === 'words' 
                        ? 'bg-emerald-700 text-white shadow-sm' 
                        : 'text-emerald-500/60 hover:text-emerald-500'
                    }`}
                >
                    Theo sá»‘ tá»«
                </button>
                <button
                    onClick={() => setLengthType('duration')}
                    className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                        lengthType === 'duration' 
                        ? 'bg-emerald-700 text-white shadow-sm' 
                        : 'text-emerald-500/60 hover:text-emerald-500'
                    }`}
                >
                    Theo thá»i lÆ°á»£ng
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lengthType === 'words' ? (
                    <Tooltip text={FORMATTING_EXPLANATIONS.wordCount}>
                        <div>
                            <label htmlFor="wordCount" className="block text-xs font-medium text-text-secondary mb-1">Tá»•ng sá»‘ tá»«</label>
                            <input id="wordCount" type="number" value={wordCount} onChange={e => setWordCount(e.target.value)} className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`} placeholder="VD: 800"/>
                        </div>
                    </Tooltip>
                ) : (
                    <Tooltip text={FORMATTING_EXPLANATIONS.videoDuration}>
                        <div>
                            <label htmlFor="videoDuration" className="block text-xs font-medium text-text-secondary mb-1">Thá»i lÆ°á»£ng video (phÃºt)</label>
                            <input id="videoDuration" type="number" value={videoDuration} onChange={e => setVideoDuration(e.target.value)} className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500`} placeholder="VD: 5"/>
                        </div>
                    </Tooltip>
                )}

                {scriptType === 'Video' && (
                  <Tooltip text={FORMATTING_EXPLANATIONS.scriptParts}>
                      <div>
                          <label htmlFor="scriptParts" className="block text-xs font-medium text-text-secondary mb-1">Sá»‘ pháº§n</label>
                          <div className="flex items-center space-x-2">
                              <input 
                                  id="scriptParts" 
                                  type="number" 
                                  value={scriptParts === 'Auto' ? '' : scriptParts} 
                                  onChange={e => setScriptParts(e.target.value)} 
                                  disabled={scriptParts === 'Auto'}
                                  className={`w-full border rounded-md p-2 transition focus:ring-2 bg-black border-emerald-900/50 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed`} 
                                  placeholder="3"
                              />
                              <label className="flex items-center space-x-2 cursor-pointer whitespace-nowrap">
                                  <input 
                                      type="checkbox" 
                                      className={`h-4 w-4 rounded border-border focus:ring-accent text-emerald-600 bg-zinc-900`} 
                                      checked={scriptParts === 'Auto'} 
                                      onChange={(e) => setScriptParts(e.target.checked ? 'Auto' : '3')} 
                                  />
                                  <span className={`text-sm text-emerald-200/80`}>Tá»± Ä‘á»™ng</span>
                              </label>
                          </div>
                      </div>
                  </Tooltip>
                )}
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
                <Tooltip text={FORMATTING_EXPLANATIONS.includeIntro} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent text-emerald-600 bg-zinc-900`} checked={formattingOptions.includeIntro} onChange={(e) => handleCheckboxChange('includeIntro', e.target.checked)} />
                        <span className={`text-emerald-200/80`}>Intro</span>
                    </label>
                </Tooltip>
                 <Tooltip text={FORMATTING_EXPLANATIONS.includeOutro} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent text-emerald-600 bg-zinc-900`} checked={formattingOptions.includeOutro} onChange={(e) => handleCheckboxChange('includeOutro', e.target.checked)} />
                        <span className={`text-emerald-200/80`}>Outro</span>
                    </label>
                </Tooltip>
                <Tooltip text={FORMATTING_EXPLANATIONS.headings} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent text-emerald-600 bg-zinc-900`} checked={formattingOptions.headings} onChange={(e) => handleCheckboxChange('headings', e.target.checked)} />
                        <span className={`text-emerald-200/80`}>TiÃªu Ä‘á»</span>
                    </label>
                </Tooltip>
                <Tooltip text={FORMATTING_EXPLANATIONS.bullets} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent text-emerald-600 bg-zinc-900`} checked={formattingOptions.bullets} onChange={(e) => handleCheckboxChange('bullets', e.target.checked)} />
                        <span className={`text-emerald-200/80`}>Gáº¡ch Ä‘áº§u dÃ²ng</span>
                    </label>
                </Tooltip>
                 <Tooltip text={FORMATTING_EXPLANATIONS.bold} className="block">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className={`h-4 w-4 rounded border-border focus:ring-accent text-emerald-600 bg-zinc-900`} checked={formattingOptions.bold} onChange={(e) => handleCheckboxChange('bold', e.target.checked)} />
                        <span className={`text-emerald-200/80`}>In Ä‘áº­m/nghiÃªng</span>
                    </label>
                </Tooltip>
            </div>
        </ControlSection>
        <Tooltip text="Táº¡o ra ká»‹ch báº£n hoÃ n chá»‰nh dá»±a trÃªn táº¥t cáº£ cÃ¡c thiáº¿t láº­p báº¡n Ä‘Ã£ chá»n á»Ÿ trÃªn.">
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
                  Äang táº¡o...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Táº¡o ká»‹ch báº£n
                </>
              )}
          </button>
        </Tooltip>
    </div>
  );
};


