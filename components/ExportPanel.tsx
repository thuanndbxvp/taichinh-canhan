import React, { useState } from 'react';
import { renderAll, type ScriptDocumentBackup, type VisualPromptFile, type YouTubeMetadata, type SceneBoardItem } from '../src/domain/renderers';
import type { ScriptDocument } from '../src/domain/ScriptDocument';
import type { ResearchPack } from '../src/domain/ResearchPack';
import type { Calculation } from '../src/domain/Calculator';

type ExportFormat = 'markdown' | 'tts' | 'json' | 'csv' | 'visual' | 'youtube' | 'scene-board';

interface ExportPanelProps {
  document: ScriptDocument;
  research?: ResearchPack;
  calculations?: Calculation[];
  keywordsCsv?: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  document,
  research,
  calculations,
  keywordsCsv = '',
}) => {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const outputs = renderAll({
    document,
    research,
    calculations,
    keywordsCsv,
  });

  const textContent = (() => {
    switch (format) {
      case 'markdown':
        return outputs.markdown;
      case 'tts':
        return outputs.ttsClean;
      case 'csv':
        return outputs.scenesCsv;
      default:
        return '';
    }
  })();

  const jsonContent = (() => {
    switch (format) {
      case 'json':
        return JSON.stringify(outputs.jsonBackup as ScriptDocumentBackup, null, 2);
      case 'visual':
        return JSON.stringify(outputs.visualPromptFile as VisualPromptFile, null, 2);
      case 'youtube':
        return JSON.stringify(outputs.youtubeMetadata as YouTubeMetadata, null, 2);
      case 'scene-board':
        return JSON.stringify(outputs.sceneBoard as SceneBoardItem[], null, 2);
      default:
        return '';
    }
  })();

  const handleDownload = () => {
    const isJson = format === 'json' || format === 'visual' || format === 'youtube' || format === 'scene-board';
    const ext = isJson ? 'json' : format === 'csv' ? 'csv' : 'md';
    const filename = `${document.title.replace(/\s+/g, '_')}_${format}.${ext}`;
    const content = isJson ? jsonContent : textContent;
    if (!content) return;
    const blob = new Blob([content], { type: isJson ? 'application/json' : 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-panel">
      <h3>Export</h3>
      <div className="format-picker">
        {(['markdown', 'tts', 'json', 'csv', 'visual', 'youtube', 'scene-board'] as ExportFormat[]).map((f) => (
          <button
            key={f}
            type="button"
            className={f === format ? 'active' : ''}
            onClick={() => setFormat(f)}
          >
            {f}
          </button>
        ))}
        <button type="button" onClick={handleDownload}>Download</button>
      </div>
      <pre className="export-preview">
        {format === 'markdown' || format === 'tts' || format === 'csv'
          ? textContent
          : jsonContent}
      </pre>
    </div>
  );
};