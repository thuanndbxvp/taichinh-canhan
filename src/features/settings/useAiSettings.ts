import { useCallback, useEffect, useState, useRef } from 'react';
import type { AiProvider } from '../../../types';
import { DEFAULT_KYMA_MODELS } from '../../../constants';
import { apiKeyManager } from '../../../services/apiKeyManager';

const STORAGE_KEY = 'ai-api-keys';
const ACTIVE_PROVIDERS_KEY = 'ai-active-providers';
const MODELS_KEY = 'ai-models';
const THEME_KEY = 'yt-script-theme';

const DEFAULT_KEYS: Record<AiProvider, string[]> = { kyma: [], openai: [] };
const DEFAULT_THEME = '#ef4444';

export interface UseAiSettingsReturn {
  apiKeys: Record<AiProvider, string[]>;
  setApiKeys: (keys: Record<AiProvider, string[]>) => void;
  saveApiKeys: (keys: Record<AiProvider, string[]>) => void;
  activeProviders: AiProvider[];
  setActiveProviders: (providers: AiProvider[]) => void;
  models: Record<AiProvider, string>;
  setModels: (models: Record<AiProvider, string>) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  hasAnyApiKey: boolean;
  notification: string | null;
  clearNotification: () => void;
  setLocalNotification: (msg: string) => void;
  getNextAiConfig: () => { provider: AiProvider; model: string } | null;
}

/**
 * Quản lý: api keys, active providers, models, theme color, notification.
 */
export function useAiSettings(): UseAiSettingsReturn {
  const [apiKeys, setApiKeys] = useState<Record<AiProvider, string[]>>(DEFAULT_KEYS);
  const [activeProviders, setActiveProviders] = useState<AiProvider[]>(['kyma']);
  const [models, setModels] = useState<Record<AiProvider, string>>({
    kyma: DEFAULT_KYMA_MODELS[0].value,
    openai: 'anthropic/claude-3.5-sonnet'
  });
  const [themeColor, setThemeColor] = useState<string>(DEFAULT_THEME);
  const [notification, setNotification] = useState<string | null>(null);
  
  const roundRobinIndex = useRef(0);

  // Load ban đầu
  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem(STORAGE_KEY);
      const parsedKeys = savedKeys ? JSON.parse(savedKeys) : DEFAULT_KEYS;
      setApiKeys(parsedKeys);
      apiKeyManager.updateKeys(parsedKeys);
      
      const savedProviders = localStorage.getItem(ACTIVE_PROVIDERS_KEY);
      let parsedProviders = savedProviders ? JSON.parse(savedProviders) : null;
      
      if (!parsedProviders || parsedProviders.length === 0) {
          // Tự động nhận diện nếu chưa lưu active provider
          if ((parsedKeys.kyma?.length ?? 0) === 0 && (parsedKeys.openai?.length ?? 0) > 0) {
              parsedProviders = ['openai'];
          } else {
              parsedProviders = ['kyma'];
          }
      }
      setActiveProviders(parsedProviders);

      const savedModels = localStorage.getItem(MODELS_KEY);
      if (savedModels) {
        const parsedModels = JSON.parse(savedModels);
        setModels({
          kyma: (parsedModels.kyma || DEFAULT_KYMA_MODELS[0].value).trim(),
          openai: (parsedModels.openai || 'anthropic/claude-3.5-sonnet').trim()
        });
      } else {
          // Backward compatibility for openai model
          const oldOpenAiModel = localStorage.getItem('openai-custom-model');
          if (oldOpenAiModel) {
              setModels(prev => ({ ...prev, openai: oldOpenAiModel }));
          }
      }

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

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys));
    apiKeyManager.updateKeys(apiKeys);
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_PROVIDERS_KEY, JSON.stringify(activeProviders));
  }, [activeProviders]);

  useEffect(() => {
    localStorage.setItem(MODELS_KEY, JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeColor);
    document.documentElement.style.setProperty('--color-accent', themeColor);
  }, [themeColor]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 6000);
    return () => clearTimeout(timer);
  }, [notification]);

  const saveApiKeys = useCallback((keys: Record<AiProvider, string[]>) => {
    setApiKeys(keys);
    setActiveProviders(prev => {
        // Auto enable a provider if we just added a key and the current active ones have no keys
        const validActive = prev.filter(p => (keys[p]?.length ?? 0) > 0);
        if (validActive.length === 0) {
            if ((keys['kyma']?.length ?? 0) > 0) return ['kyma'];
            if ((keys['openai']?.length ?? 0) > 0) return ['openai'];
        }
        return prev;
    });
  }, []);

  const clearNotification = useCallback(() => setNotification(null), []);
  const setLocalNotification = useCallback((msg: string) => setNotification(msg), []);

  const hasAnyApiKey = activeProviders.some(p => (apiKeys[p]?.length ?? 0) > 0);

  const getNextAiConfig = useCallback(() => {
      // Chỉ lấy các provider đã kích hoạt VÀ có key
      const availableProviders = activeProviders.filter(p => (apiKeys[p]?.length ?? 0) > 0);
      
      if (availableProviders.length === 0) return null;
      if (availableProviders.length === 1) {
          const provider = availableProviders[0];
          return { provider, model: models[provider] };
      }

      // Round robin
      const provider = availableProviders[roundRobinIndex.current % availableProviders.length];
      roundRobinIndex.current += 1;
      return { provider, model: models[provider] };
  }, [activeProviders, apiKeys, models]);

  return {
    apiKeys,
    setApiKeys,
    saveApiKeys,
    activeProviders,
    setActiveProviders,
    models,
    setModels,
    themeColor,
    setThemeColor,
    hasAnyApiKey,
    notification,
    clearNotification,
    setLocalNotification,
    getNextAiConfig,
  };
}
