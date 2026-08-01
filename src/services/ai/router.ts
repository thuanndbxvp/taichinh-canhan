import { callWithPrompt } from './AiGateway';
import type { AiProvider } from '../../../types';
import { AppError } from '../../lib/errors';
import { parseAiJsonOrThrow } from './responseParser';
import { z } from 'zod';

export interface RouteResult {
  branch: string;
  hook: string;
}

// Zod schema để validate JSON từ AI
const routeSchema = z.object({
  branch: z.enum(['analytical', 'psychology', 'mythbusting', 'listicle']),
  hook: z.enum(['story', 'data', 'myth', 'question'])
});

export const classifyTopic = async (
  title: string,
  provider: AiProvider,
  model: string,
): Promise<RouteResult> => {
  try {
    const content = await callWithPrompt(
      provider,
      model,
      'finance.router.classify',
      { title },
      'phân loại kịch bản',
      { response_format: { type: 'json_object' } }, // Ép JSON mode
      undefined,
      'outline' // Sử dụng chung usage bucket của outline
    );
    
    // Validate bằng Zod thông qua helper (nếu project dùng Zod, schemas.ts thường đã setup)
    // Hoặc manual parse
    const raw = JSON.parse(content);
    return routeSchema.parse(raw) as RouteResult;
  } catch (error) {
    if (error instanceof AppError) throw error;
    // Bắt fallback nếu AI không trả đúng JSON
    console.warn("AI router failed, fallback to defaults", error);
    return { branch: 'analytical', hook: 'story' };
  }
};
