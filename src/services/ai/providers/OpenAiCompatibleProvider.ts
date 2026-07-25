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

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';

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
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://youtube-script-generator.local',
        'X-Title': 'Chu Que Tai Chinh App',
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
        ...(request.maxTokens !== undefined ? { max_tokens: request.maxTokens } : {}),
        ...(ctx.onChunk ? { stream: true } : {}),
        ...(request.extras ?? {}),
      }),
      signal: ctx.signal,
      timeoutMs: ctx.timeoutMs,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw ProviderError.fromHttp(res.status, text);
    }

    if (ctx.onChunk && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullContent = '';
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const t = line.trim();
          if (t.startsWith('data: ')) {
            const data = t.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                ctx.onChunk(delta);
              }
            } catch (e) {
              // Ignore invalid JSON chunks
            }
          }
        }
      }
      return {
        content: fullContent,
        raw: { stream: true },
      };
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
