import { describe, it, expect } from 'vitest';
import { promptRegistry } from './PromptRegistry';
// Side-effect import: đăng ký prompt finance-*
import './prompts';

describe('PromptRegistry', () => {
  it('đã đăng ký finance.script', () => {
    const p = promptRegistry.get('finance.script');
    expect(p.version.version).toBeDefined();
    const out = p.build({
      params: {
        title: 'Lãi kép',
        outlineContent: '',
        targetAudience: 'Vietnamese',
        keywords: '',
        formattingOptions: {} as never,
        wordCount: '1000',
        scriptParts: '5',
        scriptType: 'standard' as never,
        numberOfSpeakers: 'one_narrator' as never,
        styleOptions: { expression: 'Empathetic', style: 'Storytelling' },
        isFinanceMode: true,
      },
    });
    expect(out.messages).toHaveLength(2);
    expect(out.messages[0].role).toBe('system');
    expect(out.messages[1].content).toContain('Lãi kép');
  });

  it('đã đăng ký finance.script.part và gán arcInstruction đúng', () => {
    const p = promptRegistry.get('finance.script.part');
    const out = p.build({
      params: {
        title: 'Quỹ dự phòng',
        outlineContent: '',
        targetAudience: 'Vietnamese',
        keywords: '',
        formattingOptions: {} as never,
        wordCount: '800',
        scriptParts: '5',
        scriptType: 'standard' as never,
        numberOfSpeakers: 'one_narrator' as never,
        styleOptions: { expression: 'Empathetic', style: 'Storytelling' },
        isFinanceMode: true,
      },
      fullOutline: '',
      previousPartsScript: '',
      currentPartOutline: '## PHẦN 3: GIẢI PHẪU BẰNG TOÁN HỌC',
    });
    expect(out.messages[1].content).toContain('PHẦN QUAN TRỌNG NHẤT');
  });

  it('finance.script.revise với style null vẫn build được', () => {
    const p = promptRegistry.get('finance.script.revise');
    const out = p.build({
      script: 'abc',
      revisionPrompt: 'shorten',
      style: null,
    });
    expect(out.messages[1].content).toContain('shorten');
  });

  it('list() trả về tất cả prompt kèm version', () => {
    const all = promptRegistry.list();
    expect(all.length).toBeGreaterThan(5);
    for (const entry of all) {
      expect(entry.id).toBeDefined();
      expect(entry.version.version).toBeDefined();
    }
  });

  it('throw nếu truy cứu prompt không tồn tại', () => {
    // @ts-expect-error - intentional bad id
    expect(() => promptRegistry.get('does.not.exist')).toThrow();
  });
});
