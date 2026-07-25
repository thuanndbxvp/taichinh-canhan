/**
 * AiGateway — tầng duy nhất giao tiếp với AI provider.
 *
 * Trách nhiệm:
 *   1. Lấy API key qua apiKeyManager (rotation tự động).
 *   2. Chọn provider adapter theo AiProvider.
 *   3. Áp dụng retry policy (network, rate_limit, server).
 *   4. Map ProviderError → AppError để UI dùng.
 *   5. Báo cáo key invalid cho apiKeyManager khi bị 401/403.
 *
 * KHÔNG chứa:
 *   - Prompt string (đó là PromptRegistry).
 *   - Response parser/schema (đó là schemas).
 *   - Business logic (đó là hook/service layer).
 */
import type { AiProvider } from '../../../types';
import { AppError } from '../../lib/errors';
import { apiKeyManager } from '../../../services/apiKeyManager';
import { ProviderError } from './ProviderError';
import { getProvider } from './providerRegistry';
import { recordUsage, type UsageEntryKind } from '../usage/usageTracker';
import type {
  ChatMessage,
  ProviderChatContext,
  ProviderChatRequest,
} from './ProviderAdapter';

export interface AiRequest {
  provider: AiProvider;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  /**
   * Override timeout cho request này (ms).
   */
  timeoutMs?: number;
  /**
   * Provider-specific extras (response_format, stop, ...).
   */
  extras?: Record<string, unknown>;
  /**
   * Callback nhận stream delta chunk.
   * @param chunk Đoạn text mới nhất (delta)
   * @param fullStream Toàn bộ text đã nhận được trong lượt (attempt) hiện tại
   */
  onChunk?: (chunk: string, fullStream: string) => void;
  /**
   * Loại call để ghi usage stats (outline, script, ...). Optional.
   */
  usageKind?: UsageEntryKind;
  /**
   * Label tùy chọn cho usage stats.
   */
  usageLabel?: string;
}

export interface AiResponse {
  content: string;
  usage?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
  raw?: unknown;
}

export interface RetryPolicy {
  /**
   * Số lần retry tối đa (không tính attempt đầu).
   */
  maxRetries: number;
  /**
   * Delay cơ sở cho exponential backoff (ms).
   */
  baseDelayMs: number;
  /**
   * Max delay giữa 2 retry (ms).
   */
  maxDelayMs: number;
  /**
   * Có retry khi kind này không.
   */
  retryOn: ProviderError['kind'][];
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 2,
  baseDelayMs: 800,
  maxDelayMs: 5_000,
  retryOn: ['network', 'timeout', 'rate_limit', 'server'],
};

export interface AiGatewayOptions {
  retry?: Partial<RetryPolicy>;
  /**
   * Số ms tối đa cho 1 attempt (timeout tầng gateway).
   * Mặc định 120s, khớp với DEFAULT_TIMEOUT_MS của aiService cũ.
   */
  defaultTimeoutMs?: number;
  /**
   * Inject cho test. Mặc định dùng `setTimeout`.
   */
  sleep?: (ms: number) => Promise<void>;
}

export class AiGateway {
  private retry: RetryPolicy;
  private defaultTimeoutMs: number;
  private sleep: (ms: number) => Promise<void>;

  constructor(opts: AiGatewayOptions = {}) {
    this.retry = { ...DEFAULT_RETRY_POLICY, ...(opts.retry ?? {}) };
    this.defaultTimeoutMs = opts.defaultTimeoutMs ?? 120_000;
    this.sleep =
      opts.sleep ??
      ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  }

  /**
   * Thực thi 1 request với retry policy + key rotation.
   */
  async execute(req: AiRequest): Promise<AiResponse> {
    if (!req.provider || !req.model) {
      throw AppError.from(
        'VALIDATION_FAILED',
        'Thiếu provider hoặc model',
        { action: 'ai.execute' },
      );
    }

    const adapter = getProvider(req.provider);
    const providerReq: ProviderChatRequest = {
      model: req.model,
      messages: req.messages,
      temperature: req.temperature,
      maxTokens: req.maxTokens,
      extras: req.extras,
    };

    let lastError: ProviderError | undefined;
    const maxAttempts = this.retry.maxRetries + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Lấy key mới mỗi attempt để nếu key lỗi thì rotation tự nhiên.
      const { apiKey, releaseKey } = await apiKeyManager.getAvailableKey(
        req.provider,
      );

      const ctx: ProviderChatContext = {
        apiKey,
        signal: req.signal,
        timeoutMs: req.timeoutMs ?? this.defaultTimeoutMs,
        onChunk: req.onChunk,
      };

      try {
        const res = await adapter.chat(providerReq, ctx);
        // Ghi usage stats (no-op nếu provider không trả token count).
        if (res.usage) {
          recordUsage({
            provider: req.provider,
            model: req.model,
            kind: req.usageKind ?? 'other',
            promptTokens: res.usage.prompt,
            completionTokens: res.usage.completion,
            label: req.usageLabel,
          });
        }
        return {
          content: res.content,
          usage: res.usage,
          raw: res.raw,
        };
      } catch (err) {
        // Domain error từ adapter: phân tích và quyết định retry.
        const providerErr =
          err instanceof ProviderError ? err : ProviderError.fromFetch(err);

        // 401/403 → rotate key rồi retry (nếu còn quota attempt).
        if (providerErr.kind === 'auth') {
          apiKeyManager.reportInvalidKey(req.provider, apiKey);
        }

        lastError = providerErr;

        // Không retry nếu lỗi không retryable.
        const canRetry =
          providerErr.retryable &&
          this.retry.retryOn.includes(providerErr.kind) &&
          attempt < maxAttempts - 1;

        if (!canRetry) break;

        // Tính delay với exponential backoff + jitter.
        const delay = this.computeBackoff(attempt);
        await this.sleep(delay);
      } finally {
        releaseKey();
      }
    }

    // Hết attempt → map ProviderError → AppError.
    throw this.toAppError(lastError, req.provider);
  }

  /**
   * Exponential backoff với jitter. Công thức:
   *   delay = min(base * 2^attempt + random(0..base), max)
   */
  private computeBackoff(attempt: number): number {
    const expo = this.retry.baseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * this.retry.baseDelayMs;
    return Math.min(expo + jitter, this.retry.maxDelayMs);
  }

  /**
   * Map ProviderError.kind → AppErrorCode.
   */
  private toAppError(
    err: ProviderError | undefined,
    provider: AiProvider,
  ): AppError {
    if (!err) {
      return AppError.from(
        'AI_PROVIDER_FAILED',
        'Không rõ lỗi từ provider',
        { provider, action: 'ai.execute' },
      );
    }
    const meta = {
      provider,
      action: 'ai.execute',
      status: err.status,
      retryable: err.retryable,
      kind: err.kind,
    };
    switch (err.kind) {
      case 'auth':
        return AppError.from('AI_KEY_INVALID', err.message, meta, err);
      case 'rate_limit':
        return AppError.from('AI_RATE_LIMITED', err.message, meta, err);
      case 'timeout':
        return AppError.from('AI_TIMEOUT', err.message, meta, err);
      case 'aborted':
        return AppError.from('AI_ABORTED', err.message, meta, err);
      case 'parse':
        return AppError.from('AI_PARSE_FAILED', err.message, meta, err);
      case 'validation':
        return AppError.from('VALIDATION_FAILED', err.message, meta, err);
      case 'network':
      case 'server':
      case 'unknown':
      default:
        return AppError.from('AI_PROVIDER_FAILED', err.message, meta, err);
    }
  }
}

/**
 * Singleton gateway với policy mặc định.
 * Phase 3+ có thể inject policy khác qua DI nếu cần.
 */
export const aiGateway = new AiGateway();

/**
 * Validate key qua gateway (cho UI). Dùng đúng provider adapter.
 */
export async function validateApiKey(
  provider: AiProvider,
  apiKey: string,
  signal?: AbortSignal,
): Promise<boolean> {
  const result = await getProvider(provider).validateKey(apiKey, signal);
  return result === true;
}
