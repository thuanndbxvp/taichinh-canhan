import { describe, it, expect } from 'vitest';
import {
  renderMarkdown,
  renderTtsClean,
  buildJsonBackup,
  renderSceneBoard,
  buildVisualPromptFile,
  buildYouTubeMetadata,
  buildScenesCsv,
  renderAll,
  bindCalculationsToNarration,
} from './renderers';
import { createScriptDocument } from './ScriptDocument';
import { createBlankScene } from './Scene';
import { buildCalculation } from './Calculator';
import { createEmptyResearchPack } from './ResearchPack';

function makeDoc() {
  const scenes = [
    { ...createBlankScene(0, 'hook'), title: 'HOOK', narration: 'Chào mừng bạn!', visualNotes: 'zoom in', audioNotes: 'BGM upbeat', onScreenText: 'Subtitle test' },
    { ...createBlankScene(1, 'analysis'), title: 'PHÂN TÍCH', narration: 'Số liệu cho thấy...', visualNotes: 'chart', audioNotes: '', onScreenText: '' },
    { ...createBlankScene(2, 'takeaway'), title: 'BÀI HỌC', narration: 'Hãy nhớ rằng...', visualNotes: '', audioNotes: '', onScreenText: '' },
  ];
  return createScriptDocument({
    title: 'Lãi kép',
    outlineContent: '',
    script: '## HOOK\nChào mừng!',
    scenes,
  });
}

describe('renderMarkdown', () => {
  it('render từ scenes có cấu trúc', () => {
    const md = renderMarkdown(makeDoc());
    expect(md).toContain('## HOOK');
    expect(md).toContain('Chào mừng bạn!');
    expect(md).toContain('*Visual:* zoom in');
  });

  it('fallback script field khi không có scenes', () => {
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: 'plain markdown',
    });
    expect(renderMarkdown(doc)).toBe('plain markdown');
  });
});

describe('renderTtsClean', () => {
  it('chỉ giữ narration từ scenes', () => {
    const tts = renderTtsClean(makeDoc());
    expect(tts).toContain('Chào mừng bạn!');
    expect(tts).not.toContain('zoom in');
    expect(tts).not.toContain('BGM');
    expect(tts).not.toContain('Subtitle test');
  });

  it('strip markdown syntax khi fallback', () => {
    const doc = createScriptDocument({
      title: 'T',
      outlineContent: '',
      script: '## HOOK\n**Bold text** và [Visual] ghi chú\n[SFX] ding',
    });
    const tts = renderTtsClean(doc);
    expect(tts).not.toContain('##');
    expect(tts).not.toContain('**');
    expect(tts).not.toContain('[Visual]');
    expect(tts).not.toContain('[SFX]');
  });
});

describe('buildJsonBackup', () => {
  it('roundtrip có đủ field', () => {
    const doc = makeDoc();
    const research = createEmptyResearchPack();
    const calcs = [buildCalculation('compound-interest', 'test', { principal: 1, annualRate: 1, years: 1 })];
    const backup = buildJsonBackup({ document: doc, research, calculations: calcs });
    expect(backup.format).toBe('json-backup');
    expect(backup.document.id).toBe(doc.id);
    expect(backup.research).toBe(research);
    expect(backup.calculations).toHaveLength(1);
  });
});

describe('renderSceneBoard', () => {
  it('trả về metadata cho mỗi scene', () => {
    const board = renderSceneBoard(makeDoc());
    expect(board).toHaveLength(3);
    expect(board[0].kind).toBe('hook');
    expect(board[0].title).toBe('HOOK');
    expect(board[0].hasVisualNotes).toBe(true);
    expect(board[0].claimCount).toBe(0);
  });

  it('empty nếu doc không có scenes', () => {
    const doc = createScriptDocument({ title: 'T', outlineContent: '', script: '' });
    expect(renderSceneBoard(doc)).toEqual([]);
  });
});

describe('buildVisualPromptFile', () => {
  it('chỉ gồm scene có imagePrompt hoặc visualNotes', () => {
    const file = buildVisualPromptFile(makeDoc());
    expect(file.prompts).toHaveLength(2); // hook + analysis có visualNotes, takeaway không
  });
});

describe('buildYouTubeMetadata', () => {
  it('format đúng với keywords + disclaimer', () => {
    const meta = buildYouTubeMetadata({
      document: makeDoc(),
      keywordsCsv: 'tài chính, lãi kép, đầu tư',
    });
    expect(meta.title).toBe('Lãi kép');
    expect(meta.tags).toEqual(['tài chính', 'lãi kép', 'đầu tư']);
    expect(meta.description).toContain('Disclaimer');
    expect(meta.description).toContain('#taichinhcanhan');
  });
});

describe('buildScenesCsv', () => {
  it('header + rows', () => {
    const csv = buildScenesCsv(makeDoc());
    expect(csv.split('\n')[0]).toBe('Order,Kind,Title,Narration,Visual Notes,Audio Notes,On-Screen Text');
    expect(csv.split('\n')).toHaveLength(4); // 1 header + 3 scenes
  });

  it('escape quotes/comma/newlines', () => {
    const scenes = [
      { ...createBlankScene(0, 'hook'), title: 'Có, dấu "phẩy"', narration: 'có\nnewline' },
    ];
    const doc = createScriptDocument({ title: 'T', outlineContent: '', script: '', scenes });
    const csv = buildScenesCsv(doc);
    expect(csv).toContain('"Có, dấu ""phẩy"""');
    expect(csv).toContain('"có\nnewline"');
  });
});

describe('renderAll', () => {
  it('build đủ 7 output', () => {
    const outputs = renderAll({ document: makeDoc() });
    expect(outputs.markdown).toBeTruthy();
    expect(outputs.ttsClean).toBeTruthy();
    expect(outputs.jsonBackup.format).toBe('json-backup');
    expect(outputs.sceneBoard).toBeDefined();
    expect(outputs.visualPromptFile).toBeDefined();
    expect(outputs.youtubeMetadata).toBeDefined();
    expect(outputs.scenesCsv).toBeTruthy();
  });
});

describe('bindCalculationsToNarration', () => {
  it('replace {{calc:id}} bằng rendered text', () => {
    const calc = buildCalculation('compound-interest', 'Lãi kép', {
      principal: 100_000_000,
      annualRate: 8,
      years: 10,
    });
    const narration = 'Số tiền sau 10 năm là {{calc:' + calc.id + '}}';
    const bound = bindCalculationsToNarration(narration, { [calc.id]: calc });
    expect(bound).toContain('**Lãi kép**');
    expect(bound).not.toContain('{{calc:');
  });

  it('fallback khi calc id không tồn tại', () => {
    const out = bindCalculationsToNarration('Xem {{calc:abc}}', {});
    expect(out).toContain('[calc:abc not found]');
  });
});