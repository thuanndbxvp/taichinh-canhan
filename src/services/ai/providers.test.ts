import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { KymaProvider } from './providers/KymaProvider';
import { OpenAiCompatibleProvider } from './providers/OpenAiCompatibleProvider';
import { ProviderError } from './ProviderError';

describe('KymaProvider.validateKey', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('trả true khi /models trả 200', async () => {
    globalThis.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as typeof fetch;
    const result = await KymaProvider.validateKey('k');
    expect(result).toBe(true);
  });

  it('trả string error khi 401', async () => {
    globalThis.fetch = vi.fn(async () => new Response('no', { status: 401 })) as typeof fetch;
    const result = await KymaProvider.validateKey('k');
    expect(typeof result).toBe('string');
    if (typeof result === 'string') expect(result).toMatch(/401/);
  });

  it('trả string error khi fetch throw', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network down');
    }) as typeof fetch;
    const result = await KymaProvider.validateKey('k');
    expect(typeof result).toBe('string');
  });
});

describe('KymaProvider.chat', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('throw ProviderError auth khi 401', async () => {
    globalThis.fetch = vi.fn(async () => new Response('unauth', { status: 401 })) as typeof fetch;
    await expect(
      KymaProvider.chat(
        { model: 'g', messages: [{ role: 'user', content: 'x' }] },
        { apiKey: 'k' },
      ),
    ).rejects.toMatchObject({ kind: 'auth' });
  });

  it('parse content đúng từ OpenAI-shape JSON', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 'hello' } }],
          usage: { prompt_tokens: 5, completion_tokens: 7, total_tokens: 12 },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    ) as typeof fetch;

    const res = await KymaProvider.chat(
      { model: 'g', messages: [{ role: 'user', content: 'x' }] },
      { apiKey: 'k' },
    );
    expect(res.content).toBe('hello');
    expect(res.usage?.total).toBe(12);
  });

  it('throw parse khi body không phải JSON', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response('not json', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ) as typeof fetch;

    await expect(
      KymaProvider.chat(
        { model: 'g', messages: [{ role: 'user', content: 'x' }] },
        { apiKey: 'k' },
      ),
    ).rejects.toBeInstanceOf(ProviderError);
  });
});

describe('OpenAiCompatibleProvider', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = globalThis.fetch;
    localStorage.removeItem('openai-base-url');
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    localStorage.removeItem('openai-base-url');
  });

  it('dùng baseUrl từ localStorage khi có', async () => {
    localStorage.setItem('openai-base-url', 'https://custom.example/v1');
    let calledUrl = '';
    globalThis.fetch = vi.fn(async (input) => {
      calledUrl = typeof input === 'string' ? input : input.toString();
      return new Response(
        JSON.stringify({ choices: [{ message: { content: 'ok' } }] }),
        { status: 200 },
      );
    }) as typeof fetch;

    await OpenAiCompatibleProvider.chat(
      { model: 'g', messages: [{ role: 'user', content: 'x' }] },
      { apiKey: 'k' },
    );
    expect(calledUrl).toContain('https://custom.example/v1/chat/completions');
  });

  it('fallback baseUrl mặc định khi localStorage trống', async () => {
    let calledUrl = '';
    globalThis.fetch = vi.fn(async (input) => {
      calledUrl = typeof input === 'string' ? input : input.toString();
      return new Response(
        JSON.stringify({ choices: [{ message: { content: 'ok' } }] }),
        { status: 200 },
      );
    }) as typeof fetch;

    await OpenAiCompatibleProvider.chat(
      { model: 'g', messages: [{ role: 'user', content: 'x' }] },
      { apiKey: 'k' },
    );
    expect(calledUrl).toContain('api.openai.com/v1/chat/completions');
  });
});
