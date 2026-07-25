import { describe, it, expect } from 'vitest';
import {
  parseIdeaFromBrainstorm,
  parseScoringReport,
  stripMarkdownForWordCount,
  countWords,
  extractFirstLineTitle,
  promptErrorKey,
  PROMPT_PLACEHOLDER_PREFIX,
  PROMPT_ERROR_PREFIX,
} from './markdown';

describe('parseIdeaFromBrainstorm', () => {
  it('trích title + outline khi có marker', () => {
    const content = '**[Idea]: Tiết kiệm 30% thu nhập**\n- Bước 1\n- Bước 2';
    const result = parseIdeaFromBrainstorm(content);
    expect(result).toEqual({
      title: 'Tiết kiệm 30% thu nhập',
      outline: '- Bước 1\n- Bước 2',
    });
  });

  it('loại bỏ cả dòng trước marker nếu chứa marker', () => {
    const content = 'Mở đầu: **[Idea]: Quỹ dự phòng**\n- Bước 1\n- Bước 2';
    const result = parseIdeaFromBrainstorm(content);
    expect(result).toEqual({
      title: 'Quỹ dự phòng',
      outline: '- Bước 1\n- Bước 2',
    });
  });

  it('trả về null nếu không có marker', () => {
    expect(parseIdeaFromBrainstorm('Chào bạn, bạn thế nào?')).toBeNull();
  });

  it('trả về null nếu input rỗng', () => {
    expect(parseIdeaFromBrainstorm('')).toBeNull();
  });
});

describe('parseScoringReport', () => {
  it('chia thành các section theo heading', () => {
    const md = `# Tổng quan
Kịch bản ổn.

## Hooks
Mạnh.

## CTA
Cần rõ hơn.`;
    const sections = parseScoringReport(md);
    expect(sections).toHaveLength(3);
    expect(sections[0]).toEqual({ title: 'Tổng quan', body: 'Kịch bản ổn.' });
    expect(sections[2].title).toBe('CTA');
  });

  it('trả về 1 section nếu không có heading', () => {
    const sections = parseScoringReport('Đoạn văn không có heading.');
    expect(sections).toHaveLength(1);
    expect(sections[0].body).toContain('Đoạn văn');
  });

  it('trả về [] nếu input rỗng', () => {
    expect(parseScoringReport('')).toEqual([]);
  });
});

describe('stripMarkdownForWordCount', () => {
  it('bỏ heading, bold, link, code', () => {
    const md = '# Tiêu đề\nĐây là **in đậm** với [link](https://example.com) và `code`.';
    const cleaned = stripMarkdownForWordCount(md);
    expect(cleaned).not.toContain('#');
    expect(cleaned).not.toContain('*');
    expect(cleaned).not.toContain('`');
    expect(cleaned).not.toContain('https://');
    // visible text "link" được giữ lại sau khi parse markdown
    expect(cleaned).toContain('link');
    expect(cleaned).toContain('Tiêu đề');
  });

  it('bỏ code fence nhiều dòng', () => {
    const md = 'Trước\n```ts\nconst x = 1;\n```\nSau';
    const cleaned = stripMarkdownForWordCount(md);
    expect(cleaned).not.toContain('const');
    expect(cleaned).toContain('Trước');
    expect(cleaned).toContain('Sau');
  });

  it('trả về chuỗi rỗng nếu input rỗng', () => {
    expect(stripMarkdownForWordCount('')).toBe('');
  });
});

describe('countWords', () => {
  it('đếm từ chính xác không tính markdown', () => {
    expect(countWords('Một hai ba bốn')).toBe(4);
    expect(countWords('**Một** **hai**')).toBe(2);
    expect(countWords('')).toBe(0);
  });
});

describe('extractFirstLineTitle', () => {
  it('lấy dòng đầu, bỏ heading marker', () => {
    expect(extractFirstLineTitle('## Cảnh 1: Mở đầu\nNội dung...')).toBe('Cảnh 1: Mở đầu');
  });

  it('rút gọn nếu quá dài', () => {
    const long = 'x'.repeat(200);
    const out = extractFirstLineTitle(long, 30);
    expect(out.length).toBeLessThanOrEqual(30);
  });

  it('trả về rỗng nếu input rỗng', () => {
    expect(extractFirstLineTitle('')).toBe('');
  });
});

describe('promptErrorKey', () => {
  it('ghép partIndex-sceneNumber', () => {
    expect(promptErrorKey(0, 3)).toBe('0-3');
  });
});

describe('prefix constants', () => {
  it('đảm bảo prefix ổn định', () => {
    expect(PROMPT_PLACEHOLDER_PREFIX).toBe('Prompt chưa được tạo.');
    expect(PROMPT_ERROR_PREFIX).toBe('LỖI:');
  });
});
