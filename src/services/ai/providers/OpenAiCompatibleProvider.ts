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
      const stored = localStorage.getItem('openai-base-url');
      if (stored) {
        return stored.trim().replace(/\/+$/, '');
      }
    }
  } catch {
    /* SSR / no localStorage */
  }
  return DEFAULT_BASE_URL.trim().replace(/\/+$/, '');
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
        max_tokens: request.maxTokens ?? 8000,
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
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('text/event-stream')) {
        const text = await res.text().catch(() => '');
        throw new ProviderError({
          kind: 'http',
          message: `Provider không trả về stream. Response: ${text.slice(0, 500)}`,
          retryable: false,
          statusCode: res.status,
          raw: text,
        });
      }
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
          if (t.startsWith('data:')) {
            const data = t.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                // Return error to UI instead of silently failing
                throw new ProviderError({
                  kind: 'provider',
                  message: parsed.error.message || JSON.stringify(parsed.error),
                  retryable: false,
                  raw: parsed,
                });
              }
              const delta = parsed.choices?.[0]?.delta;
              if (delta) {
                const text = delta.content || delta.reasoning_content || '';
                if (text) {
                  fullContent += text;
                  ctx.onChunk(text, fullContent);
                }
              }
            } catch (e) {
              if (e instanceof ProviderError) throw e;
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
