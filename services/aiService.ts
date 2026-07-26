import type {
  GenerationParams,
  ScriptPartSummary,
  StyleOptions,
  TopicSuggestionItem,
  AiProvider,
  SummarizeConfig,
  SceneSummary,
} from '../types';
import { AppError } from '../src/lib/errors';
import { 
  aiGateway, 
  validateApiKey, 
  callWithPrompt, 
  classifyTopic as internalClassifyTopic, 
  type RouteResult 
} from '../src/services/ai';
import { promptRegistry } from '../src/services/ai/PromptRegistry';
import { parseAiJsonOrThrow, SCHEMAS } from '../src/services/ai/responseParser';
import { parseOutlineIntoSegments as parseOutlineIntoSegmentsImpl } from '../src/services/ai/parseOutlineIntoSegments';
import type { UsageEntryKind } from '../src/services/usage/usageTracker';
// Side-effect import: đăng ký tất cả prompt finance-* vào registry.
import '../src/services/ai/prompts';

const handleApiError = (error: unknown, action: string): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return AppError.from('AI_PROVIDER_FAILED', error.message, { action }, error);
  }
  return AppError.from('AI_PROVIDER_FAILED', `Lỗi khi ${action}`, { action }, error);
};

/**
 * Run một async function với error chuẩn hoá về AppError theo `action`.
 *
 * Tất cả public function trong file này đều dùng helper này để tránh lặp
 * `try { ... } catch (e) { throw handleApiError(e, action) }`. Khi thêm
 * hàm mới, cứ viết logic bên trong, bọc ngoài bằng runPrompt().
 */
async function runPrompt<T>(action: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw handleApiError(e, action);
  }
}

export { validateApiKey };

function getTemperatureForStyle(style?: string): number {
  if (style === 'analytical' || style === 'mythbusting') return 0.4;
  if (style === 'psychology' || style === 'listicle') return 0.75;
  return 0.7;
}

export const generateScriptOutline = async (
  params: GenerationParams,
  provider: AiProvider,
  model: string,
  onChunk?: (chunk: string) => void,
): Promise<string> =>
  runPrompt('tạo dàn ý', async () => {
    const outline = await callWithPrompt(
      provider,
      model,
      'finance.script.outline',
      { params },
      'tạo dàn ý',
      { temperature: getTemperatureForStyle(params.scriptStyle) },
      onChunk,
      'outline',
    );
    return `### Dàn Ý Chi Tiết (Chuẩn bị tạo kịch bản sạch cho TTS)\n\n` + outline;
  });

export const generateScriptPart = async (
  fullOutline: string,
  previousPartsScript: string,
  currentPartOutline: string,
  params: GenerationParams,
  provider: AiProvider,
  model: string,
  onChunk?: (chunk: string, fullStream: string) => void,
): Promise<string> =>
  runPrompt('tạo phần kịch bản', () =>
    callWithPrompt(
      provider,
      model,
      'finance.script.part',
      {
        params,
        fullOutline,
        previousPartsScript,
        currentPartOutline,
      },
      'tạo phần kịch bản',
      { temperature: getTemperatureForStyle(params.scriptStyle) },
      onChunk,
      'script_part',
    ),
  );

export const generateTopicSuggestions = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<TopicSuggestionItem[]> =>
  runPrompt('gợi ý chủ đề', async () => {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.topics.suggest',
      { title },
      'gợi ý chủ đề',
      undefined,
      undefined,
      'idea',
    );
    return parseAiJsonOrThrow<TopicSuggestionItem[]>(content, SCHEMAS.topicSuggestions, 'gợi ý chủ đề');
  });

export const classifyTopic = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<RouteResult> =>
  runPrompt('phân loại kịch bản', () => internalClassifyTopic(title, provider, model));

export const reviseScript = async (
  script: string,
  revisionPrompt: string,
  params: GenerationParams,
  provider: AiProvider,
  model: string,
  onChunk?: (chunk: string) => void,
): Promise<string> =>
  runPrompt('sửa kịch bản', () =>
    callWithPrompt(
      provider,
      model,
      'finance.script.revise',
      {
        script,
        revisionPrompt,
        style: params.styleOptions,
      },
      'sửa kịch bản',
      undefined,
      onChunk,
      'script',
    ),
  );

export const extractDialogue = async (
  script: string,
  provider: AiProvider,
  model: string,
): Promise<Record<string, string>> =>
  runPrompt('tách lời thoại', async () => {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.dialogue.extract',
      { script },
      'tách lời thoại',
      undefined,
      undefined,
      'dialogue',
    );
    return parseAiJsonOrThrow<Record<string, string>>(content, SCHEMAS.dialogue, 'tách lời thoại');
  });

export const generateKeywordSuggestions = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<string[]> =>
  runPrompt('gợi ý từ khóa', async () => {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.keywords.suggest',
      { title },
      'gợi ý từ khóa',
      undefined,
      undefined,
      'idea',
    );
    return content
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  });

export const summarizeScriptForScenes = async (
  script: string,
  config: SummarizeConfig,
  provider: AiProvider,
  model: string,
): Promise<ScriptPartSummary[]> =>
  runPrompt('chuyển thể kịch bản (vui lòng thử lại với model mạnh hơn)', async () => {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.scenes.summarize',
      { script, config },
      'chuyển thể kịch bản',
      undefined,
      undefined,
      'summarize',
    );
    const parsed = parseAiJsonOrThrow<ScriptPartSummary[]>(
      content,
      { kind: 'array', itemFields: { partTitle: 'string', scenes: 'array' } },
      'chuyển thể kịch bản',
    );
    if (!Array.isArray(parsed)) {
      throw AppError.from('AI_PARSE_FAILED', 'Dữ liệu AI trả về không đúng định dạng danh sách', {
        action: 'chuyển thể kịch bản',
      });
    }
    return parsed;
  });

export const suggestStyleOptions = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<StyleOptions> =>
  runPrompt('gợi ý phong cách', async () => {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.style.suggest',
      { title },
      'gợi ý phong cách',
      undefined,
      undefined,
      'idea',
    );
    return parseAiJsonOrThrow<StyleOptions>(content, SCHEMAS.styleOptions, 'gợi ý phong cách');
  });

export const parseIdeasFromFile = async (
  content: string,
  provider: AiProvider,
  model: string,
): Promise<TopicSuggestionItem[]> =>
  runPrompt('phân tích file', async () => {
    const responseContent = await callWithPrompt(
      provider,
      model,
      'finance.ideas.fromFile',
      { content },
      'phân tích file',
      undefined,
      undefined,
      'idea',
    );
    return parseAiJsonOrThrow<TopicSuggestionItem[]>(
      responseContent,
      SCHEMAS.topicSuggestions,
      'phân tích file',
    );
  });

export const scoreScript = async (
  script: string,
  provider: AiProvider,
  model: string,
): Promise<string> =>
  runPrompt('chấm điểm kịch bản', () =>
    callWithPrompt(
      provider,
      model,
      'finance.score',
      { script },
      'chấm điểm kịch bản',
      undefined,
      undefined,
      'score',
    ),
  );

export const generateSingleVideoPrompt = async (
  scene: SceneSummary,
  config: SummarizeConfig,
  provider: AiProvider,
  model: string,
): Promise<string> =>
  runPrompt('tạo prompt video', () =>
    callWithPrompt(
      provider,
      model,
      'finance.video.single',
      { scene, config },
      'tạo prompt video',
      undefined,
      undefined,
      'visual_prompt',
    ),
  );

export const parseOutlineIntoSegments = (outline: string): string[] => {
  return parseOutlineIntoSegmentsImpl(outline);
};
