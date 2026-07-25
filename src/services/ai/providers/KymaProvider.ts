/**
 * KymaProvider — OpenAI-compatible endpoint tại kymaapi.com.
 * Theo code hiện tại: chat completion trả về JSON chuẩn OpenAI.
 */
import { ProviderError } from '../ProviderError';
import type {
  ProviderAdapter,
  ProviderChatContext,
  ProviderChatRequest,
  ProviderChatResponse,
} from '../ProviderAdapter';
import { fetchWithTimeout } from '../ProviderAdapter';

const KYMA_ENDPOINT = 'https://kymaapi.com/v1/chat/completions';
const KYMA_MODELS_ENDPOINT = 'https://kymaapi.com/v1/models';

export const KymaProvider: ProviderAdapter = {
  id: 'kyma',

  async validateKey(apiKey, signal) {
    try {
      const res = await fetchWithTimeout(KYMA_MODELS_ENDPOINT, {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
        signal,
        timeoutMs: 15_000,
      });
      return res.ok ? true : `Kyma từ chối key (HTTP ${res.status})`;
    } catch (e) {
      return ProviderError.fromFetch(e).message;
    }
  },

  async chat(
    request: ProviderChatRequest,
    ctx: ProviderChatContext,
  ): Promise<ProviderChatResponse> {
    const res = await fetchWithTimeout(KYMA_ENDPOINT, {
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
        message: 'Kyma trả response không phải JSON',
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
