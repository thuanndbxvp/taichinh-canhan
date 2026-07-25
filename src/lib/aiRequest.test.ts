import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aiRequest } from './aiRequest';
import { AppError } from './errors';

describe('aiRequest', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('trả về ok=true khi fetch 200 + JSON hợp lệ', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    const result = await aiRequest('https://test', { provider: 'kyma', action: 'test', body: { a: 1 } });
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ ok: true });
  });

  it('throw AppError AI_KEY_INVALID khi 401', async () => {
    global.fetch = vi.fn(async () => new Response('Unauthorized', { status: 401 })) as unknown as typeof fetch;

    await expect(
      aiRequest('https://test', { provider: 'kyma', action: 'test' }),
    ).rejects.toBeInstanceOf(AppError);
    try {
      await aiRequest('https://test', { provider: 'kyma', action: 'test' });
    } catch (err) {
      expect((err as AppError).code).toBe('AI_KEY_INVALID');
    }
  });

  it('throw AppError AI_RATE_LIMITED khi 429', async () => {
    global.fetch = vi.fn(async () => new Response('Too many', { status: 429 })) as unknown as typeof fetch;
    await expect(
      aiRequest('https://test', { provider: 'kyma', action: 'test' }),
    ).rejects.toMatchObject({ code: 'AI_RATE_LIMITED', meta: { retryable: true } });
  });

  it('throw AppError AI_TIMEOUT khi quá thời gian', async () => {
    global.fetch = vi.fn((_url, opts) =>
      new Promise((_resolve, reject) => {
        const signal: AbortSignal | undefined = (opts as RequestInit | undefined)?.signal as AbortSignal | undefined;
        signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      }),
    ) as unknown as typeof fetch;

    const promise = aiRequest('https://test', { provider: 'kyma', action: 'test', timeoutMs: 50 });
    promise.catch(() => undefined);
    await vi.advanceTimersByTimeAsync(60);
    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('throw AppError AI_ABORTED khi external signal abort', async () => {
    const controller = new AbortController();
    global.fetch = vi.fn((_url, opts) =>
      new Promise((_resolve, reject) => {
        const signal: AbortSignal | undefined = (opts as RequestInit | undefined)?.signal as AbortSignal | undefined;
        signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      }),
    ) as unknown as typeof fetch;

    const promise = aiRequest('https://test', { provider: 'kyma', action: 'test', signal: controller.signal });
    promise.catch(() => undefined);
    controller.abort();
    await expect(promise).rejects.toMatchObject({ code: 'AI_ABORTED' });
  });
});
