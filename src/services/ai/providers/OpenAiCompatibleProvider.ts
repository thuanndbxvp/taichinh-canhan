/**
 * OpenAiCompatibleProvider — provider tổng quát cho mọi endpoint theo schema OpenAI.
 * baseUrl lấy từ localStorage('openai-base-url') để tương thích ngược với code cũ.
 *
 * Lý do tách khỏi KymaProvider:
 *   - Kyma có endpoint cố định.
 *   - OpenAI/LocalAI/Ollama-compatible có thể đổi baseUrl, nên cần adapter riêng.
 */
import { ProviderError } from '../ProviderError';
import type {
  ProviderAdapter,
  ProviderChatContext,
  ProviderChatRequest,
  ProviderChatResponse,
} from '../ProviderAdapter';
import { fetchWithTimeout } from '../ProviderAdapter';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

function getBaseUrl(): string {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('openai-base-url') || DEFAULT_BASE_URL;
    }
  } catch {
    /* SSR / no localStorage */
  }
  return DEFAULT_BASE_URL;
}

export const OpenAiCompatibleProvider: ProviderAdapter = {
  id: 'openai',

  async validateKey(apiKey, signal) {
    const baseUrl = getBaseUrl();
    try {
      const res = await fetchWithTimeout(`${baseUrl}/models`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
        signal,
        timeoutMs: 15_000,
      });
      return res.ok ? true : `Endpoint từ chối key (HTTP ${res.status})`;
    } catch (e) {
      return ProviderError.fromFetch(e).message;
    }
  },

  async chat(
    request: ProviderChatRequest,
    ctx: ProviderChatContext,
  ): Promise<ProviderChatResponse> {
    const baseUrl = getBaseUrl();
    const res = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
        ...(request.maxTokens !== undefined ? { max_tokens: request.maxTokens } : {}),
        ...(request.extras ?? {}),
      }),
      signal: ctx.signal,
      timeoutMs: ctx.timeoutMs,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw ProviderError.fromHttp(res.status, text);
    }

    const raw = await res.json().catch(() => null);
    if (!raw || typeof raw !== 'object') {
      throw new ProviderError({
        kind: 'parse',
        message: 'Provider trả response không phải JSON',
        retryable: false,
        raw,
      });
    }

    const content =
      (raw as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ??
      '';

    const usage = (raw as { usage?: Record<string, number | undefined> }).usage;

    return {
      content,
      usage: usage
        ? {
            prompt: usage.prompt_tokens,
            completion: usage.completion_tokens,
            total: usage.total_tokens,
          }
        : undefined,
      raw,
    };
  },
};
