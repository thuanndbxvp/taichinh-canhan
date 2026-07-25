import React, { useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { OutputDisplay } from './components/OutputDisplay';
import { LibraryModal } from './components/LibraryModal';
import { DialogueModal } from './components/DialogueModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import GuideModal from './components/GuideModal';
import { VisualPromptModal } from './components/VisualPromptModal';
import { AllVisualPromptsModal } from './components/AllVisualPromptsModal';
import { SummarizeModal } from './components/SummarizeModal';
import { SavedIdeasModal } from './components/SavedIdeasModal';
import { SideToolsPanel } from './components/SideToolsPanel';
import { ScoreModal } from './components/ScoreModal';
import { APP_BRAND } from './constants';
import { BoltIcon } from './components/icons/BoltIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import { useContentBrief } from './src/features/brief/useContentBrief';
import { useAiSettings } from './src/features/settings/useAiSettings';
import { useGenerationWorkflow } from './src/features/generation/useGenerationWorkflow';
import { useDialogueWorkflow } from './src/features/dialogue/useDialogueWorkflow';
import { useSceneWorkflow } from './src/features/scenes/useSceneWorkflow';
import { useReviewWorkflow } from './src/features/review/useReviewWorkflow';
import { useLibrary } from './src/features/library/useLibrary';
import { useIdeaWorkflow } from './src/features/ideas/useIdeaWorkflow';
import { useModalState } from './src/features/modals/useModalState';

const YoutubeLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 28 20" fill="none" {...props}>
    <path d="M27.42 3.033a3.51 3.51 0 0 0-2.483-2.483C22.768 0 14 0 14 0S5.232 0 3.063.55A3.51 3.51 0 0 0 .58 3.033C0 5.2 0 10 0 10s0 4.8.58 6.967a3.51 3.51 0 0 0 2.483 2.483C5.232 20 14 20 14 20s8.768 0 10.937-.55a3.51 3.51 0 0 0 2.483-2.483C28 14.8 28 10 28 10s0-4.8-.58-6.967z" fill="#FF0000"/>
    <path d="M11.2 14.286V5.714L18.453 10 11.2 14.286z" fill="#FFFFFF"/>
  </svg>
);

const App: React.FC = () => {
  const brief = useContentBrief();
  const aiSettings = useAiSettings();
  const generation = useGenerationWorkflow({
    brief: brief.brief,
    aiProvider: aiSettings.aiProvider,
    selectedModel: aiSettings.selectedModel,
  });
  const dialogue = useDialogueWorkflow({
    aiProvider: aiSettings.aiProvider,
    selectedModel: aiSettings.selectedModel,
  });
  const scenes = useSceneWorkflow({
    aiProvider: aiSettings.aiProvider,
    selectedModel: aiSettings.selectedModel,
  });
  const review = useReviewWorkflow({
    aiProvider: aiSettings.aiProvider,
    selectedModel: aiSettings.selectedModel,
  });
  const library = useLibrary();
  const ideas = useIdeaWorkflow({
    aiProvider: aiSettings.aiProvider,
    selectedModel: aiSettings.selectedModel,
  });
  const modals = useModalState();

  // Khi bắt đầu generate mới, clear các cache downstream
  const handleGenerate = useCallback(async () => {
    if (!brief.brief.title.trim()) return;
    scenes.clearAll();
    dialogue.clear();
    review.clear();
    library.setHasSaved(false);
    await generation.generate();
  }, [brief.brief.title, scenes, dialogue, review, library, generation]);

  // Load script từ library: cập nhật brief + script + reset caches
  const handleLoadLibraryItem = useCallback(
    (item: ReturnType<typeof library.loadItem> extends infer T ? Parameters<typeof library.loadItem>[0] : never) => {
      const loaded = library.loadItem(item);
      brief.setTitle(loaded.title);
      brief.setOutlineContent(loaded.outlineContent);
      generation.setGeneratedScript(loaded.script);
      scenes.clearAll();
      dialogue.clear();
      review.clear();
      modals.close('library');
    },
    [library, brief, generation, scenes, dialogue, review, modals],
  );

  const handleLoadSavedIdea = useCallback(
    (idea: Parameters<typeof ideas.loadSavedIdea>[0]) => {
      const loaded = ideas.loadSavedIdea(idea);
      brief.setTitle(loaded.title);
      brief.setOutlineContent(loaded.outlineContent);
      modals.close('savedIdeas');
    },
    [ideas, brief, modals],
  );

  // Score dialog
  const handleScoreClick = useCallback(async () => {
    modals.open('score');
    await review.score2(generation.generatedScript);
  }, [modals, review, generation.generatedScript]);

  // Summarize dialog
  const handleSummarizeClick = useCallback((config: Parameters<typeof scenes.summarize>[1]) => {
    scenes.summarize(generation.generatedScript, config);
  }, [scenes, generation.generatedScript]);

  // Extract dialogue: mở modal + chạy
  const handleOpenDialogue = useCallback(async () => {
    modals.open('dialogue');
    await dialogue.extract(generation.generatedScript);
  }, [modals, dialogue, generation.generatedScript]);

  // Khi generation.generatedScript thay đổi do user import, sync dialogue stats
  useEffect(() => {
    if (generation.generatedScript && dialogue.dialogue === null) {
      // no-op: chỉ chạy khi user explicitly gọi extract
    }
  }, [generation.generatedScript, dialogue.dialogue]);

  const hasApiKey = aiSettings.hasApiKey;

  return (
    <div className={`min-h-screen ${brief.brief.isFinanceMode ? 'bg-black text-slate-300' : 'bg-primary text-text-primary'}`}>
      {aiSettings.notification && (
        <div className="fixed top-5 right-5 bg-secondary border border-accent text-text-primary p-4 rounded-lg shadow-lg z-[100] flex items-center gap-4">
          <CheckIcon className="w-6 h-6 text-green-400" />
          <p className="text-sm">{aiSettings.notification}</p>
        </div>
      )}
      <header className={`bg-secondary/60 border-b border-border p-4 shadow-sm flex justify-between items-center sticky top-0 z-20 backdrop-blur-sm ${brief.brief.isFinanceMode ? 'border-amber-900/30' : ''}`}>
        <div className="flex-1 flex gap-4 items-center">
          <button
            onClick={() => brief.setIsFinanceMode(!brief.brief.isFinanceMode)}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 border ${brief.brief.isFinanceMode ? 'bg-amber-900/40 text-amber-500 border-amber-500 shadow-lg shadow-amber-900/20' : 'bg-secondary text-text-secondary border-border hover:text-text-primary'}`}
          >
            <BoltIcon className="w-4 h-4" />
            {brief.brief.isFinanceMode ? 'CHÚ QUE TÀI CHÍNH: ON' : 'CHÚ QUE TÀI CHÍNH: OFF'}
          </button>
        </div>
        <div className="flex-1 text-center">
          <a href="/" className="inline-flex justify-center items-center gap-3 no-underline">
            <YoutubeLogoIcon />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
              {brief.brief.isFinanceMode ? APP_BRAND.name : 'YouTube Script Generator'}
            </h1>
          </a>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
          <button onClick={() => modals.open('guide')} className="px-3 md:px-4 py-1.5 text-sm font-semibold rounded-md border border-border text-yellow-400 hover:bg-yellow-400/10 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.82 1.507-2.098a5.981 5.981 0 1 0-7.514 0C9.092 15.988 9.75 16.825 9.75 17.808v.192" />
            </svg>
            <span className="hidden md:inline">Hướng dẫn</span>
          </button>
          <button onClick={() => modals.open('apiKey')} className="px-4 py-1.5 text-sm font-semibold rounded-md border border-border text-text-secondary">API</button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-[96rem] mx-auto">
        <div className="lg:col-span-3">
          <ControlPanel
            title={brief.brief.title}
            setTitle={brief.setTitle}
            outlineContent={brief.brief.outlineContent}
            setOutlineContent={brief.setOutlineContent}
            onGenerateSuggestions={() => ideas.generateSuggestions(brief.brief.title)}
            isSuggesting={ideas.isSuggesting}
            suggestions={ideas.topicSuggestions}
            suggestionError={ideas.suggestionError}
            hasGeneratedTopicSuggestions={ideas.hasGeneratedTopicSuggestions}
            targetAudience={brief.brief.targetAudience}
            setTargetAudience={brief.setTargetAudience}
            styleOptions={brief.brief.styleOptions}
            setStyleOptions={brief.setStyleOptions}
            keywords={brief.brief.keywords}
            setKeywords={brief.setKeywords}
            formattingOptions={brief.brief.formattingOptions}
            setFormattingOptions={brief.setFormattingOptions}
            wordCount={brief.brief.wordCount}
            setWordCount={brief.setWordCount}
            scriptParts={brief.brief.scriptParts}
            setScriptParts={brief.setScriptParts}
            onGenerate={handleGenerate}
            isLoading={generation.isLoading || !hasApiKey}
            onGenerateKeywordSuggestions={() => ideas.generateKeywordSuggestions(brief.brief.title)}
            isSuggestingKeywords={ideas.isSuggestingKeywords}
            keywordSuggestions={ideas.keywordSuggestions}
            keywordSuggestionError={ideas.keywordSuggestionError}
            hasGeneratedKeywordSuggestions={ideas.hasGeneratedKeywordSuggestions}
            scriptType={brief.brief.scriptType}
            setScriptType={brief.setScriptType}
            numberOfSpeakers={brief.brief.numberOfSpeakers}
            setNumberOfSpeakers={brief.setNumberOfSpeakers}
            onSuggestStyle={() => ideas.suggestStyle(brief.brief.title)}
            isSuggestingStyle={ideas.isSuggestingStyle}
            styleSuggestionError={ideas.styleSuggestionError}
            hasSuggestedStyle={ideas.hasSuggestedStyle}
            lengthType={brief.brief.lengthType}
            setLengthType={brief.setLengthType}
            videoDuration={brief.brief.videoDuration}
            setVideoDuration={brief.setVideoDuration}
            savedIdeas={ideas.savedIdeas}
            onSaveIdea={ideas.saveIdea}
            onOpenSavedIdeasModal={() => modals.open('savedIdeas')}
            onParseFile={ideas.parseFile}
            isParsingFile={ideas.isParsing}
            parsingFileError={ideas.parsingError}
            uploadedIdeas={ideas.uploadedIdeas}
            aiProvider={aiSettings.aiProvider}
            setAiProvider={aiSettings.setAiProvider}
            selectedModel={aiSettings.selectedModel}
            setSelectedModel={aiSettings.setSelectedModel}
            isFinanceMode={brief.brief.isFinanceMode}
            apiKeys={aiSettings.apiKeys}
          />
        </div>
        <div className="lg:col-span-6">
          <OutputDisplay
            title={brief.brief.title}
            script={generation.generatedScript}
            isLoading={generation.isLoading}
            error={generation.error}
            onStartSequentialGenerate={generation.startSequential}
            onStopSequentialGenerate={generation.stopSequential}
            isGeneratingSequentially={generation.isGeneratingSequentially}
            onGenerateNextPart={() => generation.generateNextPart()}
            currentPart={generation.currentPartIndex}
            totalParts={generation.totalParts}
            revisionCount={generation.revisionCount}
            onGenerateVisualPrompt={(scene) => {
              modals.open('visualPrompt');
              return scenes.generateVisualPromptForScene(scene).then(() => undefined);
            }}
            onGenerateAllVisualPrompts={() => {
              modals.open('allVisualPrompts');
              return scenes.generateAllVisualPromptsForScript(generation.generatedScript);
            }}
            isGeneratingAllVisualPrompts={scenes.isGeneratingAllVisualPrompts}
            scriptType={brief.brief.scriptType}
            hasGeneratedAllVisualPrompts={!!scenes.allVisualPrompts}
            visualPromptsCache={scenes.visualPromptsCache}
            loadingVisualPromptsParts={scenes.loadingVisualPromptsParts}
            onImportScript={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => generation.setGeneratedScript((e.target?.result as string) ?? '');
              reader.readAsText(file);
            }}
            autoContinue={generation.autoContinue}
            setAutoContinue={generation.setAutoContinue}
          />
        </div>
        <div className="lg:col-span-3">
          <SideToolsPanel
            script={generation.generatedScript}
            targetWordCount={brief.effectiveTargetWordCount}
            revisionPrompt={generation.revisionPrompt}
            setRevisionPrompt={generation.setRevisionPrompt}
            onRevise={generation.revise}
            onSummarizeScript={() => modals.open('summarize')}
            isLoading={generation.isLoading}
            isSummarizing={scenes.isSummarizing}
            hasSummarizedScript={!!scenes.summarizedScript}
            onOpenLibrary={() => modals.open('library')}
            onSaveToLibrary={() => library.saveCurrent({
              title: brief.brief.title,
              outlineContent: brief.brief.outlineContent,
              script: generation.generatedScript,
            })}
            hasSavedToLibrary={library.hasSaved}
            onExtractAndCount={handleOpenDialogue}
            onOpenDialogueModal={() => modals.open('dialogue')}
            wordCountStats={dialogue.stats}
            isExtracting={dialogue.isExtracting}
            onScoreScript={handleScoreClick}
            isScoring={review.isScoring}
            onGenerateAllPrompts={() => scenes.generateAllSegmentPrompts(generation.generatedScript)}
            onDownloadAllPrompts={() => {
              if (scenes.visualPromptsCache.size === 0) {
                generation.setExternalError('Chưa có prompt nào được tạo để tải về.');
                return;
              }
              const all: string[] = [];
              scenes.visualPromptsCache.forEach((prompts) => {
                prompts.forEach((p) => {
                  const flat = p.english.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
                  all.push(flat);
                });
              });
              if (all.length === 0) return;
              const blob = new Blob([all.join('\n')], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `All_Prompts_${brief.brief.title.replace(/\s+/g, '_')}.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            isGeneratingAllPrompts={scenes.isGeneratingAllSegmentPrompts}
          />
        </div>
      </main>

      <ApiKeyModal
        isOpen={modals.isOpen('apiKey')}
        onClose={() => modals.close('apiKey')}
        currentApiKeys={aiSettings.apiKeys}
        onSaveKeys={aiSettings.saveApiKeys}
      />
      <GuideModal
        isOpen={modals.isOpen('guide')}
        onClose={() => modals.close('guide')}
      />
      <LibraryModal
        isOpen={modals.isOpen('library')}
        onClose={() => modals.close('library')}
        library={library.library}
        onLoad={handleLoadLibraryItem}
        onDelete={library.removeItem}
        onExport={library.exportAll}
        onImport={async (content) => {
          try {
            const result = await library.importFromText(content);
            aiSettings.setLocalNotification(
              result.warnings.length > 0
                ? `Đã nhập ${result.imported} mục. Cảnh báo: ${result.warnings.join(' ')}`
                : `Đã nhập ${result.imported} mục vào thư viện.`,
            );
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể đọc file thư viện.';
            generation.setExternalError(message);
          }
        }}
      />
      <SavedIdeasModal
        isOpen={modals.isOpen('savedIdeas')}
        onClose={() => modals.close('savedIdeas')}
        ideas={ideas.savedIdeas}
        onLoad={handleLoadSavedIdea}
        onDelete={ideas.deleteSavedIdea}
      />
      <DialogueModal
        isOpen={modals.isOpen('dialogue')}
        onClose={() => modals.close('dialogue')}
        dialogue={dialogue.dialogue}
        isLoading={dialogue.isExtracting}
        error={dialogue.error}
        onReExtract={handleOpenDialogue}
      />
      <ScoreModal
        isOpen={modals.isOpen('score')}
        onClose={() => modals.close('score')}
        score={review.score}
        isLoading={review.isScoring}
        error={review.error}
      />
      <VisualPromptModal
        isOpen={modals.isOpen('visualPrompt')}
        onClose={() => modals.close('visualPrompt')}
        prompts={scenes.visualPrompts}
        isLoading={scenes.isGeneratingVisualPrompt}
        error={scenes.visualPromptError}
      />
      <AllVisualPromptsModal
        isOpen={modals.isOpen('allVisualPrompts')}
        onClose={() => modals.close('allVisualPrompts')}
        prompts={scenes.allVisualPrompts}
        isLoading={scenes.isGeneratingAllVisualPrompts}
        error={scenes.allVisualPromptsError}
      />
      <SummarizeModal
        isOpen={modals.isOpen('summarize')}
        onClose={() => modals.close('summarize')}
        summary={scenes.summarizedScript}
        isLoading={scenes.isSummarizing}
        error={scenes.summarizationError}
        scriptType={brief.brief.scriptType}
        title={brief.brief.title}
        onGenerate={handleSummarizeClick}
        onGenerateVideoPrompt={scenes.generateVideoPrompt}
      />
    </div>
  );
};

export default App;
