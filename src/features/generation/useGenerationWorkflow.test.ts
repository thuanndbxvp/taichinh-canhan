import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGenerationWorkflow } from './useGenerationWorkflow';
import type { ContentBrief } from '../brief/useContentBrief';

vi.mock('../../../services/aiService', () => ({
  generateScript: vi.fn(),
  generateScriptOutline: vi.fn(),
  generateScriptPart: vi.fn(),
  parseOutlineIntoSegments: vi.fn(),
  reviseScript: vi.fn(),
}));

import * as aiService from '../../../services/aiService';

const brief: ContentBrief = {
  title: 'Lãi kép',
  outlineContent: '',
  targetAudience: 'Vietnamese',
  styleOptions: { expression: 'Empathetic', style: 'Storytelling' },
  keywords: '',
  formattingOptions: { headings: true, bullets: true, bold: true, includeIntro: false, includeOutro: false },
  wordCount: '800',
  scriptParts: 'Auto',
  scriptType: 'Video',
  numberOfSpeakers: 'Auto',
  lengthType: 'words',
  videoDuration: '5',
  isFinanceMode: true,
};

describe('useGenerationWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate trả lỗi nếu title rỗng', async () => {
    const { result } = renderHook(() =>
      useGenerationWorkflow({ brief: { ...brief, title: '' }, aiProvider: 'kyma', selectedModel: 'm' }),
    );
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.error).toMatch(/Vui lòng nhập/);
  });

  it('generate script ngắn gọi generateScript', async () => {
    (aiService.generateScript as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async (_params: unknown, _provider: unknown, _model: unknown, onChunk?: (chunk: string) => void) => {
        onChunk?.('script ');
        onChunk?.('content');
        return 'script content';
      },
    );
    const { result } = renderHook(() => useGenerationWorkflow({ brief, aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.generatedScript).toBe('script content');
    expect(result.current.error).toBeNull();
    expect(aiService.generateScript).toHaveBeenCalled();
  });

  it('generate script dài gọi generateScriptOutline', async () => {
    (aiService.generateScriptOutline as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async (_params: unknown, _provider: unknown, _model: unknown, onChunk?: (chunk: string) => void) => {
        onChunk?.('## outline');
        return '## outline';
      },
    );
    const { result } = renderHook(() =>
      useGenerationWorkflow({ brief: { ...brief, wordCount: '1500' }, aiProvider: 'kyma', selectedModel: 'm' }),
    );
    await act(async () => {
      await result.current.generate();
    });
    expect(aiService.generateScriptOutline).toHaveBeenCalled();
    expect(result.current.generatedScript).toBe('## outline');
  });

  it('generate chuyển lỗi AppError thành message', async () => {
    (aiService.generateScript as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useGenerationWorkflow({ brief, aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.error).toBe('boom');
  });

  it('generate lỗi khi wordCount = 0 (lengthType=words)', async () => {
    const { result } = renderHook(() =>
      useGenerationWorkflow({ brief: { ...brief, wordCount: '0' }, aiProvider: 'kyma', selectedModel: 'm' }),
    );
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.error).toMatch(/số từ lớn hơn 0/);
    expect(aiService.generateScript).not.toHaveBeenCalled();
  });

  it('generate lỗi khi videoDuration = 0 (lengthType=duration)', async () => {
    const { result } = renderHook(() =>
      useGenerationWorkflow({ brief: { ...brief, lengthType: 'duration', videoDuration: '0' }, aiProvider: 'kyma', selectedModel: 'm' }),
    );
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.error).toMatch(/thời lượng video lớn hơn 0/);
    expect(aiService.generateScript).not.toHaveBeenCalled();
  });

  it('generate script trả rỗng → set error surface cho user', async () => {
    (aiService.generateScript as unknown as ReturnType<typeof vi.fn>).mockResolvedValue('');
    const { result } = renderHook(() => useGenerationWorkflow({ brief, aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.error).toMatch(/AI provider trả về kịch bản rỗng/);
  });

  it('generate outline trả rỗng → set error surface cho user', async () => {
    (aiService.generateScriptOutline as unknown as ReturnType<typeof vi.fn>).mockResolvedValue('   ');
    const { result } = renderHook(() =>
      useGenerationWorkflow({ brief: { ...brief, wordCount: '1500' }, aiProvider: 'kyma', selectedModel: 'm' }),
    );
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.error).toMatch(/AI provider trả về dàn ý rỗng/);
  });

  it('generate wordCount = 5 phút (lengthType=duration, videoDuration=5) → ~1035 từ (180 WPM + 15% buffer) → gọi generateScript', async () => {
    (aiService.generateScript as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async (
        params: unknown,
        _provider: unknown,
        _model: unknown,
        onChunk?: (chunk: string) => void,
      ) => {
        onChunk?.('script 5 phút');
        // Verify buffer: 5 phút * 180 * 1.15 = 1035
        const wc = (params as { wordCount: string }).wordCount;
        expect(parseInt(wc, 10)).toBe(1035);
        return 'script 5 phút';
      },
    );
    const { result } = renderHook(() =>
      useGenerationWorkflow({
        brief: { ...brief, lengthType: 'duration', videoDuration: '5' },
        aiProvider: 'kyma',
        selectedModel: 'm',
      }),
    );
    await act(async () => {
      await result.current.generate();
    });
    expect(aiService.generateScript).toHaveBeenCalled();
    expect(result.current.generatedScript).toBe('script 5 phút');
    expect(result.current.error).toBeNull();
  });

  it('revise yêu cầu revisionPrompt không rỗng', async () => {
    const { result } = renderHook(() => useGenerationWorkflow({ brief, aiProvider: 'kyma', selectedModel: 'm' }));
    await act(async () => {
      await result.current.revise();
    });
    expect(aiService.reviseScript).not.toHaveBeenCalled();
  });

  it('revise thành công tăng revisionCount', async () => {
    (aiService.reviseScript as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async (
        _script: unknown,
        _prompt: unknown,
        _params: unknown,
        _provider: unknown,
        _model: unknown,
        onChunk?: (chunk: string) => void,
      ) => {
        onChunk?.('revised');
        return 'revised';
      },
    );
    const { result } = renderHook(() => useGenerationWorkflow({ brief, aiProvider: 'kyma', selectedModel: 'm' }));
    act(() => result.current.setRevisionPrompt('làm gọn hơn'));
    act(() => result.current.setGeneratedScript('initial'));
    await act(async () => {
      await result.current.revise();
    });
    expect(result.current.generatedScript).toBe('revised');
    expect(result.current.revisionCount).toBe(1);
    expect(result.current.revisionPrompt).toBe('');
  });
});
