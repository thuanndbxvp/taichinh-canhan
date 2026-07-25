import React, { useState } from 'react';
import type { ResearchSource, SourceType } from '../src/domain/ResearchPack';
import type { UseResearchReturn } from '../src/features/research/useResearch';

interface ResearchPanelProps {
  research: UseResearchReturn;
}

const SOURCE_TYPES: SourceType[] = ['article', 'report', 'data', 'expert', 'book', 'other'];

export const ResearchPanel: React.FC<ResearchPanelProps> = ({ research }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<SourceType>('article');
  const [author, setAuthor] = useState('');
  const [dataDate, setDataDate] = useState('');
  const [reliability, setReliability] = useState<1 | 2 | 3 | 4 | 5>(3);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await research.addSource({
      type,
      title: title.trim(),
      url: url.trim() || undefined,
      author: author.trim() || undefined,
      dataDate: dataDate.trim() || undefined,
      reliability,
    });
    setTitle('');
    setUrl('');
    setAuthor('');
    setDataDate('');
  };

  const sources: ResearchSource[] = research.pack?.sources ?? [];

  return (
    <div className="research-panel">
      <h3>Research Pack</h3>
      {research.error && <div className="error">{research.error}</div>}
      <div className="add-source-form">
        <input
          placeholder="Tiêu đề nguồn"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="URL (tuỳ chọn)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value as SourceType)}>
          {SOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          placeholder="Tác giả"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="date"
          value={dataDate}
          onChange={(e) => setDataDate(e.target.value)}
        />
        <label>
          Độ tin cậy:
          <select
            value={reliability}
            onChange={(e) => setReliability(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleAdd}>
          Thêm nguồn
        </button>
      </div>
      <ul>
        {sources.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong> [{s.type}] (tin cậy: {s.reliability}/5)
            {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer"> link</a>}
            {s.author && <span> — {s.author}</span>}
            {s.dataDate && <span> ({s.dataDate})</span>}
            <button type="button" onClick={() => research.deleteSource(s.id)}>Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};