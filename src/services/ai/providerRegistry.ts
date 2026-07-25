/**
 * Provider registry — ánh xạ AiProvider id → adapter tương ứng.
 * Đây là entry point duy nhất cho gateway lấy adapter.
 */
import type { ProviderAdapter } from './ProviderAdapter';
import type { AiProvider } from '../../../types';
import { KymaProvider } from './providers/KymaProvider';
import { OpenAiCompatibleProvider } from './providers/OpenAiCompatibleProvider';

const REGISTRY: Record<AiProvider, ProviderAdapter> = {
  kyma: KymaProvider,
  openai: OpenAiCompatibleProvider,
};

export function getProvider(id: AiProvider): ProviderAdapter {
  const adapter = REGISTRY[id];
  if (!adapter) {
    throw new Error(`Provider không tồn tại: ${id}`);
  }
  return adapter;
}
