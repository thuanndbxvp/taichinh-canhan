import { useCallback, useEffect, useState } from 'react';
import type { AiProvider } from '../../../types';
import { DEFAULT_KYMA_MODELS } from '../../../constants';
import { apiKeyManager } from '../../../services/apiKeyManager';

const STORAGE_KEY = 'ai-api-keys';
const THEME_KEY = 'yt-script-theme';

const DEFAULT_KEYS: Record<AiProvider, string[]> = { kyma: [], openai: [] };
const DEFAULT_THEME = '#ef4444';

export interface UseAiSettingsReturn {
  apiKeys: Record<AiProvider, string[]>;
  setApiKeys: (keys: Record<AiProvider, string[]>) => void;
  saveApiKeys: (keys: Record<AiProvider, string[]>) => void;
  aiProvider: AiProvider;
  setAiProvider: (provider: AiProvider) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  hasApiKey: boolean;
  notification: string | null;
  clearNotification: () => void;
  setLocalNotification: (msg: string) => void;
}

/**
 * Quản lý: api keys, provider, model, theme color, notification.
 * - Tự load localStorage + lắng nghe `apiKeyRotated`.
 * - Persist vào localStorage mỗi khi keys/theme đổi.
 * - Public notification cục bộ (không dùng AI thì set thông báo khác).
 */
export function useAiSettings(): UseAiSettingsReturn {
  const [apiKeys, setApiKeys] = useState<Record<AiProvider, string[]>>(DEFAULT_KEYS);
  const [aiProvider, setAiProvider] = useState<AiProvider>('kyma');
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_KYMA_MODELS[0].value);
  const [themeColor, setThemeColor] = useState<string>(DEFAULT_THEME);
  const [notification, setNotification] = useState<string | null>(null);

  // Load ban đầu
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_KEYS;
      setApiKeys(parsed);
      apiKeyManager.updateKeys(parsed);
      const theme = localStorage.getItem(THEME_KEY);
      if (theme) setThemeColor(theme);
    } catch (e) {
      console.error('Failed to load ai settings', e);
    }

    const onRotate = (event: Event) => {
      const detail = (event as CustomEvent).detail as { provider: AiProvider };
      setNotification(`API key ${detail.provider} đã tự động chuyển đổi.`);
      const latest = localStorage.getItem(STORAGE_KEY);
      if (latest) setApiKeys(JSON.parse(latest));
    };
    window.addEventListener('apiKeyRotated', onRotate);
    return () => window.removeEventListener('apiKeyRotated', onRotate);
  }, []);

  // Persist apiKeys
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys));
    apiKeyManager.updateKeys(apiKeys);
  }, [apiKeys]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeColor);
    document.documentElement.style.setProperty('--color-accent', themeColor);
  }, [themeColor]);

  // Auto-clear notification
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 6000);
    return () => clearTimeout(timer);
  }, [notification]);

  const saveApiKeys = useCallback((keys: Record<AiProvider, string[]>) => setApiKeys(keys), []);
  const clearNotification = useCallback(() => setNotification(null), []);
  const setLocalNotification = useCallback((msg: string) => setNotification(msg), []);

  const hasApiKey = (apiKeys[aiProvider]?.length ?? 0) > 0;

  return {
    apiKeys,
    setApiKeys,
    saveApiKeys,
    aiProvider,
    setAiProvider,
    selectedModel,
    setSelectedModel,
    themeColor,
    setThemeColor,
    hasApiKey,
    notification,
    clearNotification,
    setLocalNotification,
  };
}
