import { describe, it, expect } from 'vitest';
import { ProviderError } from './ProviderError';

describe('ProviderError.fromHttp', () => {
  it('401 → auth, not retryable', () => {
    const e = ProviderError.fromHttp(401, 'unauthorized');
    expect(e.kind).toBe('auth');
    expect(e.retryable).toBe(false);
    expect(e.status).toBe(401);
  });

  it('403 → auth, not retryable', () => {
    const e = ProviderError.fromHttp(403, 'forbidden');
    expect(e.kind).toBe('auth');
    expect(e.retryable).toBe(false);
  });

  it('429 → rate_limit, retryable', () => {
    const e = ProviderError.fromHttp(429, '');
    expect(e.kind).toBe('rate_limit');
    expect(e.retryable).toBe(true);
  });

  it('500 → server, retryable', () => {
    const e = ProviderError.fromHttp(500, 'oops');
    expect(e.kind).toBe('server');
    expect(e.retryable).toBe(true);
  });

  it('400 → unknown, not retryable', () => {
    const e = ProviderError.fromHttp(400, 'bad req');
    expect(e.kind).toBe('unknown');
    expect(e.retryable).toBe(false);
  });
});

describe('ProviderError.fromFetch', () => {
  it('AbortError → aborted, not retryable', () => {
    const err = new DOMException('Aborted', 'AbortError');
    const e = ProviderError.fromFetch(err);
    expect(e.kind).toBe('aborted');
    expect(e.retryable).toBe(false);
  });

  it('timeout Error → timeout, retryable', () => {
    const err = new Error('Request timeout exceeded');
    const e = ProviderError.fromFetch(err);
    expect(e.kind).toBe('timeout');
    expect(e.retryable).toBe(true);
  });

  it('plain Error → network, retryable', () => {
    const err = new Error('DNS failure');
    const e = ProviderError.fromFetch(err);
    expect(e.kind).toBe('network');
    expect(e.retryable).toBe(true);
  });
});

describe('ProviderError.isProviderError', () => {
  it('true với ProviderError', () => {
    expect(ProviderError.isProviderError(new ProviderError({ kind: 'unknown', message: 'x', retryable: false }))).toBe(true);
  });
  it('false với Error thường', () => {
    expect(ProviderError.isProviderError(new Error('x'))).toBe(false);
  });
});
