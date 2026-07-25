/**
 * aiRequest — wrapper fetch với timeout, AbortController, error model chuẩn.
 * Phase 0: dùng cho IdeaBrainstorm; phase 1 sẽ chuyển callApi sang đây.
 */
import { AppError } from './errors';

export interface AIRequestOptions {
  provider: string;
  action: string;
  timeoutMs?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  body?: unknown;
  method?: 'POST' | 'GET';
}

export interface AIRequestResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
  rawText: string;
}

const DEFAULT_TIMEOUT_MS = 90_000;

export async function aiRequest<T = unknown>(
  url: string,
  options: AIRequestOptions,
): Promise<AIRequestResult<T>> {
  const { provider, action, timeoutMs = DEFAULT_TIMEOUT_MS, signal: externalSignal, headers = {}, body, method = 'POST' } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error('timeout')), timeoutMs);

  // Kết nối signal bên ngoài (nếu có) để hỗ trợ cancel
  const onExternalAbort = () => controller.abort(externalSignal?.reason);
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const rawText = await res.text();
    let data: T;
    try {
      data = rawText ? (JSON.parse(rawText) as T) : (undefined as unknown as T);
    } catch {
      data = rawText as unknown as T;
    }

    if (!res.ok) {
      throw AppError.fromHttp(provider, action, res.status, rawText);
    }

    return { ok: true, status: res.status, data, rawText };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.fromFetch(provider, action, err);
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}
