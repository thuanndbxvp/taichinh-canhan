import type {
  GenerationParams,
  VisualPrompt,
  AllVisualPromptsResult,
  ScriptPartSummary,
  StyleOptions,
  TopicSuggestionItem,
  AiProvider,
  SummarizeConfig,
  SceneSummary,
} from '../types';
import { AppError } from '../src/lib/errors';
import { aiGateway, validateApiKey } from '../src/services/ai';
import { promptRegistry } from '../src/services/ai/PromptRegistry';
import { parseAiJsonOrThrow, SCHEMAS } from '../src/services/ai/responseParser';
// Side-effect import: đăng ký tất cả prompt finance-* vào registry.
import '../src/services/ai/prompts';

/**
 * Helper: gọi gateway với messages từ prompt registry, map lỗi về AppError.
 */
async function callWithPrompt(
  provider: AiProvider,
  model: string,
  promptId: Parameters<typeof promptRegistry.build>[0],
  input: Parameters<typeof promptRegistry.build>[1],
  action: string,
  signal?: AbortSignal,
): Promise<string> {
  const { messages } = promptRegistry.build(promptId, input);
  try {
    const res = await aiGateway.execute({
      provider,
      model,
      messages,
      signal,
    });
    return res.content;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw AppError.from('AI_PROVIDER_FAILED', `Lỗi khi ${action}`, { action }, error);
  }
}

const handleApiError = (error: unknown, action: string): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return AppError.from('AI_PROVIDER_FAILED', error.message, { action }, error);
  }
  return AppError.from('AI_PROVIDER_FAILED', `Lỗi khi ${action}`, { action }, error);
};

export { validateApiKey };

export const generateScript = async (
  params: GenerationParams,
  provider: AiProvider,
  model: string,
): Promise<string> => {
  try {
    return await callWithPrompt(
      provider,
      model,
      'finance.script',
      { params },
      'tạo kịch bản',
    );
  } catch (e) {
    throw handleApiError(e, 'tạo kịch bản');
  }
};

export const generateScriptOutline = async (
  params: GenerationParams,
  provider: AiProvider,
  model: string,
): Promise<string> => {
  try {
    const outline = await callWithPrompt(
      provider,
      model,
      'finance.script.outline',
      { params },
      'tạo dàn ý',
    );
    return `### Dàn Ý Chi Tiết (Chuẩn bị tạo kịch bản sạch cho TTS)\n\n` + outline;
  } catch (e) {
    throw handleApiError(e, 'tạo dàn ý');
  }
};

export const generateScriptPart = async (
  fullOutline: string,
  previousPartsScript: string,
  currentPartOutline: string,
  params: GenerationParams,
  provider: AiProvider,
  model: string,
): Promise<string> => {
  try {
    return await callWithPrompt(
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
    );
  } catch (e) {
    throw handleApiError(e, 'tạo phần kịch bản');
  }
};

export const generateTopicSuggestions = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<TopicSuggestionItem[]> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.topics.suggest',
      { title },
      'gợi ý chủ đề',
    );
    return parseAiJsonOrThrow<TopicSuggestionItem[]>(content, SCHEMAS.topicSuggestions, 'gợi ý chủ đề');
  } catch (e) {
    throw handleApiError(e, 'gợi ý chủ đề');
  }
};

export const reviseScript = async (
  script: string,
  revisionPrompt: string,
  params: GenerationParams,
  provider: AiProvider,
  model: string,
): Promise<string> => {
  try {
    return await callWithPrompt(
      provider,
      model,
      'finance.script.revise',
      {
        script,
        revisionPrompt,
        style: params.styleOptions,
      },
      'sửa kịch bản',
    );
  } catch (e) {
    throw handleApiError(e, 'sửa kịch bản');
  }
};

export const extractDialogue = async (
  script: string,
  provider: AiProvider,
  model: string,
): Promise<Record<string, string>> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.dialogue.extract',
      { script },
      'tách lời thoại',
    );
    return parseAiJsonOrThrow<Record<string, string>>(content, SCHEMAS.dialogue, 'tách lời thoại');
  } catch (e) {
    throw handleApiError(e, 'tách lời thoại');
  }
};

export const generateKeywordSuggestions = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<string[]> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.keywords.suggest',
      { title },
      'gợi ý từ khóa',
    );
    return content
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  } catch (e) {
    handleApiError(e, 'gợi ý từ khóa');
    return [];
  }
};

export const generateVisualPrompt = async (
  sceneDescription: string,
  provider: AiProvider,
  model: string,
): Promise<VisualPrompt[]> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.visual.single',
      { sceneDescription },
      'tạo prompt hình ảnh',
    );
    return parseAiJsonOrThrow<VisualPrompt[]>(content, SCHEMAS.visualPrompts, 'tạo prompt hình ảnh');
  } catch (e) {
    throw handleApiError(e, 'tạo prompt hình ảnh');
  }
};

export const generateAllVisualPrompts = async (
  script: string,
  provider: AiProvider,
  model: string,
): Promise<AllVisualPromptsResult[]> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.visual.bulk',
      { script },
      'tạo tất cả prompt',
    );
    return parseAiJsonOrThrow<AllVisualPromptsResult[]>(
      content,
      SCHEMAS.allVisualPrompts,
      'tạo tất cả prompt',
    );
  } catch (e) {
    throw handleApiError(e, 'tạo tất cả prompt');
  }
};

export const summarizeScriptForScenes = async (
  script: string,
  config: SummarizeConfig,
  provider: AiProvider,
  model: string,
): Promise<ScriptPartSummary[]> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.scenes.summarize',
      { script, config },
      'chuyển thể kịch bản',
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
  } catch (e) {
    throw handleApiError(e, 'chuyển thể kịch bản (vui lòng thử lại với model mạnh hơn)');
  }
};

export const suggestStyleOptions = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<StyleOptions> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.style.suggest',
      { title },
      'gợi ý phong cách',
    );
    return parseAiJsonOrThrow<StyleOptions>(content, SCHEMAS.styleOptions, 'gợi ý phong cách');
  } catch (e) {
    throw handleApiError(e, 'gợi ý phong cách');
  }
};

export const parseIdeasFromFile = async (
  content: string,
  provider: AiProvider,
  model: string,
): Promise<TopicSuggestionItem[]> => {
  try {
    const responseContent = await callWithPrompt(
      provider,
      model,
      'finance.ideas.fromFile',
      { content },
      'phân tích file',
    );
    return parseAiJsonOrThrow<TopicSuggestionItem[]>(
      responseContent,
      SCHEMAS.topicSuggestions,
      'phân tích file',
    );
  } catch (e) {
    throw handleApiError(e, 'phân tích file');
  }
};

export const scoreScript = async (
  script: string,
  provider: AiProvider,
  model: string,
): Promise<string> => {
  try {
    return await callWithPrompt(
      provider,
      model,
      'finance.score',
      { script },
      'chấm điểm kịch bản',
    );
  } catch (e) {
    throw handleApiError(e, 'chấm điểm kịch bản');
  }
};

export const generateSingleVideoPrompt = async (
  scene: SceneSummary,
  config: SummarizeConfig,
  provider: AiProvider,
  model: string,
): Promise<string> => {
  try {
    return await callWithPrompt(
      provider,
      model,
      'finance.video.single',
      { scene, config },
      'tạo prompt video',
    );
  } catch (e) {
    throw handleApiError(e, 'tạo prompt video');
  }
};

export const parseOutlineIntoSegments = (outline: string): string[] => {
  return outline
    .split(/(?=^## .*?$)/m)
    .filter((s) => s.trim() !== '' && !s.includes('### Dàn Ý'));
};
