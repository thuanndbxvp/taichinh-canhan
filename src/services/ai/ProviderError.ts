/**
 * ProviderErrorKind — phân loại lỗi mức provider, dùng nội bộ tầng AI gateway.
 * Khác với AppErrorCode: đây là kết quả của provider adapter (HTTP + business).
 * AiGateway sẽ map sang AppErrorCode khi ném ra ngoài.
 *
 * Lý do tách:
 *   - Provider adapter không nên phụ thuộc AppError (giữ nó là pure utility).
 *   - AppError là public contract của app — provider có thể thay đổi mà không
 *     ảnh hưởng UI.
 */
export type ProviderErrorKind =
  | 'auth' // 401/403 → key invalid
  | 'rate_limit' // 429
  | 'server' // 5xx
  | 'network' // offline / DNS / socket
  | 'timeout' // timeout từ AbortController
  | 'aborted' // user abort
  | 'parse' // response không parse được
  | 'validation' // schema không khớp
  | 'unknown'; // còn lại

export interface ProviderErrorPayload {
  kind: ProviderErrorKind;
  status?: number;
  message: string;
  retryable: boolean;
  raw?: unknown;
}

export class ProviderError extends Error {
  public readonly kind: ProviderErrorKind;
  public readonly status?: number;
  public readonly retryable: boolean;
  public readonly raw?: unknown;

  constructor(payload: ProviderErrorPayload) {
    super(payload.message);
    this.name = 'ProviderError';
    this.kind = payload.kind;
    this.status = payload.status;
    this.retryable = payload.retryable;
    this.raw = payload.raw;
  }

  static isProviderError(err: unknown): err is ProviderError {
    return err instanceof ProviderError;
  }

  /**
   * Phân loại lỗi HTTP thành ProviderError. Trả về retryable đúng với từng kind
   * để gateway quyết định retry.
   */
  static fromHttp(
    status: number,
    bodyText: string,
    raw?: unknown,
  ): ProviderError {
    if (status === 401 || status === 403) {
      return new ProviderError({
        kind: 'auth',
        status,
        message: `Auth failed (${status}): ${bodyText.slice(0, 200)}`.trim(),
        retryable: false,
        raw,
      });
    }
    if (status === 429) {
      return new ProviderError({
        kind: 'rate_limit',
        status,
        message: `Rate limited (429)`,
        retryable: true,
        raw,
      });
    }
    if (status >= 500) {
      return new ProviderError({
        kind: 'server',
        status,
        message: `Server error (${status}): ${bodyText.slice(0, 200)}`.trim(),
        retryable: true,
        raw,
      });
    }
    return new ProviderError({
      kind: 'unknown',
      status,
      message: `HTTP ${status}: ${bodyText.slice(0, 200)}`.trim(),
      retryable: false,
      raw,
    });
  }

  /**
   * Phân loại lỗi tầng fetch (network/abort/timeout).
   */
  static fromFetch(err: unknown): ProviderError {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return new ProviderError({
        kind: 'aborted',
        message: 'Aborted',
        retryable: false,
        raw: err,
      });
    }
    if (err instanceof Error && /timeout/i.test(err.message)) {
      return new ProviderError({
        kind: 'timeout',
        message: err.message,
        retryable: true,
        raw: err,
      });
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return new ProviderError({
        kind: 'network',
        message: 'Network offline',
        retryable: true,
        raw: err,
      });
    }
    return new ProviderError({
      kind: 'network',
      message: err instanceof Error ? err.message : 'Unknown fetch error',
      retryable: true,
      raw: err,
    });
  }
}
