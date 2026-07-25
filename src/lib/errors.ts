/**
 * AppError — mô hình lỗi chuẩn hoá cho toàn bộ app.
 * Mục tiêu Phase 0: chuẩn hoá provider/action để dễ log, telemetry và retry.
 * Cách dùng:
 *   throw new AppError('AI_PROVIDER_FAILED', 'Kyma trả 429', { provider: 'kyma', action: 'generate-script', cause: err })
 *   hoặc AppError.from('AI_PROVIDER_FAILED', '...', meta, err)
 */
export type AppErrorCode =
  | 'AI_PROVIDER_FAILED'
  | 'AI_KEY_MISSING'
  | 'AI_KEY_INVALID'
  | 'AI_RATE_LIMITED'
  | 'AI_ABORTED'
  | 'AI_PARSE_FAILED'
  | 'AI_TIMEOUT'
  | 'NETWORK_OFFLINE'
  | 'STORAGE_CORRUPT'
  | 'STORAGE_QUOTA'
  | 'IO_FILE_READ'
  | 'IO_FILE_WRITE'
  | 'VALIDATION_FAILED'
  | 'UNKNOWN';

export interface AppErrorMeta {
  provider?: string;
  action?: string;
  status?: number;
  retryable?: boolean;
  [key: string]: unknown;
}

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly meta: AppErrorMeta;
  public readonly cause?: unknown;
  public readonly timestamp: number;

  constructor(code: AppErrorCode, message: string, meta: AppErrorMeta = {}, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.meta = { ...meta };
    this.cause = cause;
    this.timestamp = Date.now();
  }

  static from(
    code: AppErrorCode,
    message: string,
    meta: AppErrorMeta = {},
    cause?: unknown,
  ): AppError {
    return new AppError(code, message, meta, cause);
  }

  /**
   * Phân loại lỗi HTTP fetch thành AppError tương ứng.
   */
  static fromHttp(
    provider: string,
    action: string,
    status: number,
    bodyText: string,
    cause?: unknown,
  ): AppError {
    if (status === 401 || status === 403) {
      return AppError.from('AI_KEY_INVALID', `API key bị từ chối (${status})`, {
        provider,
        action,
        status,
        retryable: false,
      }, cause);
    }
    if (status === 429) {
      return AppError.from('AI_RATE_LIMITED', `Provider ${provider} đang quá tải (429)`, {
        provider,
        action,
        status,
        retryable: true,
      }, cause);
    }
    if (status >= 500) {
      return AppError.from('AI_PROVIDER_FAILED', `Provider ${provider} lỗi ${status}`, {
        provider,
        action,
        status,
        retryable: true,
      }, cause);
    }
    return AppError.from(
      'AI_PROVIDER_FAILED',
      `Lỗi gọi ${provider}: ${status} ${bodyText.slice(0, 200)}`.trim(),
      { provider, action, status, retryable: false },
      cause,
    );
  }

  /**
   * Phân loại lỗi khi fetch bị reject (network, abort, ...).
   */
  static fromFetch(provider: string, action: string, err: unknown): AppError {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return AppError.from('AI_ABORTED', 'Yêu cầu đã bị huỷ', {
        provider,
        action,
        retryable: false,
      }, err);
    }
    if (err instanceof Error && /timeout/i.test(err.message)) {
      return AppError.from('AI_TIMEOUT', `Timeout khi gọi ${provider}`, {
        provider,
        action,
        retryable: true,
      }, err);
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return AppError.from('NETWORK_OFFLINE', 'Mất kết nối mạng', {
        provider,
        action,
        retryable: true,
      }, err);
    }
    return AppError.from('AI_PROVIDER_FAILED', `Lỗi gọi ${provider}`, {
      provider,
      action,
      retryable: true,
    }, err);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      meta: this.meta,
      timestamp: this.timestamp,
      cause: this.cause instanceof Error ? this.cause.message : undefined,
    };
  }
}
