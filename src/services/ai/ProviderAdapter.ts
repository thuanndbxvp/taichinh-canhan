/**
 * Provider adapter — interface thống nhất cho mọi AI provider.
 *
 * Mỗi adapter chịu trách nhiệm:
 *   - Build request body theo schema riêng của provider.
 *   - Parse response trả về string content (đã strip wrapper).
 *   - Ném ProviderError nếu HTTP/parse fail.
 *
 * Provider KHÔNG ném AppError — đó là trách nhiệm của gateway khi map ra ngoài.
 */
import type { ProviderError } from './ProviderError';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  /**
   * Provider-specific extras (response_format, stop, ...).
   * Mỗi adapter tự quyết định field nào được dùng.
   */
  extras?: Record<string, unknown>;
}

export interface ProviderChatResponse {
  /**
   * Text thuần từ assistant (đã strip wrapper JSON).
   */
  content: string;
  /**
   * Số token sử dụng nếu provider trả về.
   */
  usage?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
  /**
   * Raw response (cho debug/log).
   */
  raw: unknown;
}

export interface ProviderChatContext {
  apiKey: string;
  signal?: AbortSignal;
  /**
   * Timeout cho 1 lần gọi provider (gateway có thể override).
   */
  timeoutMs?: number;
}

export interface ProviderAdapter {
  readonly id: string;
  /**
   * Validate key trước khi lưu vào apiKeyManager.
   * Trả về true nếu key hợp lệ.
   * Trả về string error để UI hiển thị.
   */
  validateKey(apiKey: string, signal?: AbortSignal): Promise<true | string>;
  chat(
    request: ProviderChatRequest,
    ctx: ProviderChatContext,
  ): Promise<ProviderChatResponse>;
}

/**
 * Helper: fetch với timeout + abort signal + body parse.
 * Trả về raw response object để provider tự parse theo schema riêng.
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const { timeoutMs, ...rest } = init;
  const controller = new AbortController();
  const timeoutId = timeoutMs
    ? setTimeout(() => controller.abort(new DOMException('Timeout', 'AbortError')), timeoutMs)
    : null;

  // Nếu caller đã có signal, link nó
  const onCallerAbort = () => controller.abort(rest.signal?.reason);
  if (rest.signal) {
    if (rest.signal.aborted) {
      controller.abort(rest.signal.reason);
    } else {
      rest.signal.addEventListener('abort', onCallerAbort, { once: true });
    }
  }

  try {
    const res = await fetch(url, { ...rest, signal: controller.signal });
    return res;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    if (rest.signal) rest.signal.removeEventListener('abort', onCallerAbort);
  }
}

export type { ProviderError };
