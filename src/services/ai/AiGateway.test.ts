import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AiGateway, DEFAULT_RETRY_POLICY } from './AiGateway';
import { apiKeyManager } from '../../../services/apiKeyManager';
import { AppError } from '../../lib/errors';

describe('AiGateway - retry policy', () => {
  beforeEach(() => {
    apiKeyManager.updateKeys({ kyma: [], openai: ['k1'] });
  });
  afterEach(() => {
    apiKeyManager.updateKeys({ kyma: [], openai: [] });
  });

  it('retry khi gặp 429 rồi succeed', async () => {
    let calls = 0;
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn(async () => {
      calls++;
      if (calls === 1) {
        return new Response('rate limited', { status: 429 });
      }
      return new Response(
        JSON.stringify({ choices: [{ message: { content: 'ok' } }] }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    }) as typeof fetch;

    const gateway = new AiGateway({ sleep: async () => {} });
    const res = await gateway.execute({
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'hi' }],
    });

    expect(res.content).toBe('ok');
    expect(calls).toBe(2);
    globalThis.fetch = original;
  });

  it('không retry khi 401 (auth)', async () => {
    let calls = 0;
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn(async () => {
      calls++;
      return new Response('unauthorized', { status: 401 });
    }) as typeof fetch;

    const gateway = new AiGateway({ sleep: async () => {} });
    await expect(
      gateway.execute({
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'hi' }],
      }),
    ).rejects.toMatchObject({ code: 'AI_KEY_INVALID' });

    // Chỉ gọi 1 lần vì auth không retry.
    expect(calls).toBe(1);
    globalThis.fetch = original;
  });

  it('throw AppError sau khi hết maxRetries với 5xx', async () => {
    let calls = 0;
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn(async () => {
      calls++;
      return new Response('boom', { status: 500 });
    }) as typeof fetch;

    const gateway = new AiGateway({
      sleep: async () => {},
      retry: { ...DEFAULT_RETRY_POLICY, maxRetries: 1 },
    });
    await expect(
      gateway.execute({
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'hi' }],
      }),
    ).rejects.toMatchObject({ code: 'AI_PROVIDER_FAILED' });

    // 1 initial + 1 retry = 2 lần gọi
    expect(calls).toBe(2);
    globalThis.fetch = original;
  });

  it('aborted signal → AppError AI_ABORTED, không retry', async () => {
    const controller = new AbortController();
    controller.abort(new DOMException('Aborted', 'AbortError'));
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn(async () => {
      throw new DOMException('Aborted', 'AbortError');
    }) as typeof fetch;

    const gateway = new AiGateway({ sleep: async () => {} });
    await expect(
      gateway.execute({
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'hi' }],
        signal: controller.signal,
      }),
    ).rejects.toBeInstanceOf(AppError);

    globalThis.fetch = original;
  });
});
