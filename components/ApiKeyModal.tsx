import React, { useState, useEffect } from 'react';
import { TrashIcon } from './icons/TrashIcon';
import type { AiProvider } from '../types';
import { validateApiKey } from '../services/aiService';
import { CheckIcon } from './icons/CheckIcon';
import { KeyIcon } from './icons/KeyIcon';
import { DEFAULT_KYMA_MODELS } from '../constants';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKeys: Record<AiProvider, string[]>;
  onSaveKeys: (keys: Record<AiProvider, string[]>) => void;
  activeProviders: AiProvider[];
  onSaveActiveProviders: (providers: AiProvider[]) => void;
  models: Record<AiProvider, string>;
  onSaveModels: (models: Record<AiProvider, string>) => void;
  tavilyApiKey: string;
  onSaveTavilyApiKey: (key: string) => void;
}

const KymaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2L2 22h20L12 2zm0 3.8l7.1 14.2H4.9L12 5.8z"/>
    </svg>
);

const OpenAIIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 41 41" fill="none" {...props}>
        <path d="M36.3333 19.4882C36.3333 21.3215 35.8888 23.1348 35.0277 24.7848C34.1667 26.4348 32.9127 27.8848 31.3381 29.0482C28.2748 31.2882 24.5333 32.4882 20.5083 32.4882C18.675 32.4882 16.8617 32.0437 15.2117 31.1826C13.5617 30.3215 12.1117 29.0675 10.9483 27.4929C8.70833 24.4296 7.50833 20.6882 7.50833 16.6632C7.50833 14.8298 7.95278 13.0165 8.81389 11.3665C9.675 9.71651 10.929 8.26651 12.5035 7.10317C15.5668 4.86317 19.3083 3.66317 23.3333 3.66317" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M4.66669 21.5118C4.66669 19.6785 5.11113 17.8652 5.97224 16.2152C6.83335 14.5652 8.08733 13.1152 9.66192 11.9518C12.7252 9.71183 16.4667 8.51183 20.4917 8.51183C22.325 8.51183 24.1384 8.95628 25.7884 9.81739C27.4384 10.6785 28.8884 11.9325 30.0517 13.5071C32.2917 16.5704 33.4917 20.3118 33.4917 24.3368C33.4917 26.1702 33.0472 27.9835 32.1861 29.6335C31.325 31.2835 30.071 32.7335 28.4965 33.8968C25.4332 36.1368 21.6917 37.3368 17.6667 37.3368" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
);

type ValidationState = 'idle' | 'checking' | 'valid' | 'invalid';
type ValidationStatus = {
    state: ValidationState;
    message: string | null;
};

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ 
    isOpen, 
    onClose, 
    currentApiKeys, 
    onSaveKeys,
    activeProviders,
    onSaveActiveProviders,
    models,
    onSaveModels,
    tavilyApiKey,
    onSaveTavilyApiKey
}) => {
    const [localApiKeys, setLocalApiKeys] = useState<Record<AiProvider, string[]>>(currentApiKeys);
    const [newKeyInputs, setNewKeyInputs] = useState<Record<AiProvider, string>>({ kyma: '', openai: '' });
    const [localActiveProviders, setLocalActiveProviders] = useState<AiProvider[]>(activeProviders);
    const [localModels, setLocalModels] = useState<Record<AiProvider, string>>(models);
    
    // Custom settings for OpenAI compatible
    // Khởi tạo openAiBaseUrl từ localStorage để không ghi đè config đã lưu mỗi lần mở modal.
    const [openAiBaseUrl, setOpenAiBaseUrl] = useState<string>(() => {
        try {
            return localStorage.getItem('openai-base-url') || 'https://openrouter.ai/api/v1';
        } catch {
            return 'https://openrouter.ai/api/v1';
        }
    });
    const [kymaModelOptions, setKymaModelOptions] = useState<{value: string, label: string}[]>([]);
    const [localTavilyKey, setLocalTavilyKey] = useState<string>(tavilyApiKey);

    const [validationStatus, setValidationStatus] = useState<Record<AiProvider, ValidationStatus>>({
        kyma: { state: 'idle', message: null },
        openai: { state: 'idle', message: null }
    });

    useEffect(() => {
        if (isOpen) {
            const safeCurrentKeys = {
                kyma: currentApiKeys?.kyma || [],
                openai: currentApiKeys?.openai || []
            };
            setLocalApiKeys(JSON.parse(JSON.stringify(safeCurrentKeys)));
            setNewKeyInputs({ kyma: '', openai: '' });
            setValidationStatus({
                kyma: { state: 'idle', message: null },
                openai: { state: 'idle', message: null }
            });
            setLocalActiveProviders([...activeProviders]);
            setLocalModels({ ...models });
            
            // Load custom OpenAI settings
            const savedBaseUrl = localStorage.getItem('openai-base-url');
            if (savedBaseUrl) setOpenAiBaseUrl(savedBaseUrl);
            setLocalTavilyKey(tavilyApiKey);
        }
    }, [isOpen, currentApiKeys, activeProviders, models, tavilyApiKey]);

    useEffect(() => {
        if (isOpen && localApiKeys.kyma?.[0]) {
            fetch('https://kymaapi.com/v1/models', {
                headers: { 'Authorization': `Bearer ${localApiKeys.kyma[0]}` }
            })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data?.data) {
                    const fetchedModels = data.data.map((m: any) => ({ value: m.id, label: m.name || m.id }));
                    setKymaModelOptions(fetchedModels);
                    if (!fetchedModels.find((m: any) => m.value === localModels.kyma)) {
                        setLocalModels(prev => ({ ...prev, kyma: fetchedModels[0]?.value || '' }));
                    }
                }
            })
            .catch(err => console.error('[ApiKeyModal] Failed to fetch Kyma models:', err));
        }
    }, [isOpen, localApiKeys.kyma, localModels.kyma]);

    const handleAddKey = async (provider: AiProvider) => {
        const rawInput = (newKeyInputs[provider] || '').trim();
        if (!rawInput) return;

        const keysToProcess = rawInput
            .split('\n')
            .map(k => k.trim())
            .filter(k => k && !localApiKeys[provider].includes(k));

        if (keysToProcess.length === 0) {
            setValidationStatus(prev => ({
                ...prev,
                [provider]: { state: 'invalid', message: "Tất cả các key này đều đã tồn tại hoặc không hợp lệ." }
            }));
            return;
        }

        setValidationStatus(prev => ({ ...prev, [provider]: { state: 'checking', message: null } }));
        
        try {
            const isValid = await validateApiKey(provider, keysToProcess[0]);
            
            setLocalApiKeys(prev => {
                const updatedKeys = [...prev[provider], ...keysToProcess];
                return { ...prev, [provider]: updatedKeys };
            });

            if (!isValid) {
                setValidationStatus(prev => ({ 
                    ...prev, 
                    [provider]: { state: 'valid', message: `Đã thêm ${keysToProcess.length} key, nhưng kiểm tra (ping) thất bại (có thể do mạng).` } 
                }));
            } else {
                setValidationStatus(prev => ({ 
                    ...prev, 
                    [provider]: { state: 'valid', message: `Đã thêm ${keysToProcess.length} key thành công!` } 
                }));
            }

            setNewKeyInputs(prev => ({ ...prev, [provider]: '' }));
            setTimeout(() => setValidationStatus(prev => ({ ...prev, [provider]: { state: 'idle', message: null } })), 4000);

        } catch (error) {
            setLocalApiKeys(prev => {
                const updatedKeys = [...prev[provider], ...keysToProcess];
                return { ...prev, [provider]: updatedKeys };
            });
            setValidationStatus(prev => ({
                ...prev,
                [provider]: { state: 'valid', message: `Đã thêm ${keysToProcess.length} key, nhưng kiểm tra lỗi.` }
            }));
            setNewKeyInputs(prev => ({ ...prev, [provider]: '' }));
            setTimeout(() => setValidationStatus(prev => ({ ...prev, [provider]: { state: 'idle', message: null } })), 4000);
        }
    };

    const handleDeleteKey = (provider: AiProvider, index: number) => {
        setLocalApiKeys(prev => ({ ...prev, [provider]: prev[provider].filter((_, i) => i !== index) }));
    };

    const handleActivateKey = (provider: AiProvider, index: number) => {
        setLocalApiKeys(prev => {
            const keys = [...prev[provider]];
            if (index > 0) {
                const [itemToMove] = keys.splice(index, 1);
                keys.unshift(itemToMove);
            }
            return { ...prev, [provider]: keys };
        });
    };

    const toggleActiveProvider = (provider: AiProvider) => {
        setLocalActiveProviders(prev => {
            if (prev.includes(provider)) {
                return prev.filter(p => p !== provider);
            } else {
                return [...prev, provider];
            }
        });
    };
    
    const handleSave = () => {
        localStorage.setItem('openai-base-url', openAiBaseUrl);
        
        const finalKeys = { ...localApiKeys };
        (['kyma', 'openai'] as AiProvider[]).forEach(provider => {
            const raw = (newKeyInputs[provider] || '').trim();
            if (raw) {
                const keysToProcess = raw.split('\n').map(k => k.trim()).filter(k => k && !finalKeys[provider].includes(k));
                if (keysToProcess.length > 0) {
                    finalKeys[provider] = [...(finalKeys[provider] || []), ...keysToProcess];
                }
            }
        });

        onSaveKeys(finalKeys);
        onSaveActiveProviders(localActiveProviders);
        onSaveModels({
            kyma: (localModels.kyma || '').trim(),
            openai: (localModels.openai || '').trim()
        });
        onSaveTavilyApiKey(localTavilyKey);
        onClose();
    };

    if (!isOpen) return null;

    const renderKeyPanel = (provider: AiProvider) => {
        const isKyma = provider === 'kyma';
        const title = isKyma ? 'Kyma API' : 'Chuẩn Tương Thích OpenAI';
        const icon = isKyma ? <KymaIcon className="text-yellow-400"/> : <OpenAIIcon className="text-white"/>;
        const description = isKyma 
            ? "Nhập các API Keys lấy từ hệ thống Kyma."
            : "Tương thích với hệ thống chuẩn OpenAI (ví dụ: OpenRouter).";
        
        const status = validationStatus[provider];
        const displayedKeys = localApiKeys[provider] || [];
        const isActive = localActiveProviders.includes(provider);

        return (
            <div className={`p-4 rounded-lg border flex flex-col h-full transition-colors ${isActive ? 'bg-primary border-accent/50' : 'bg-primary/50 border-border opacity-75 grayscale-[50%]'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h3 className="font-semibold text-text-primary text-lg">{title}</h3>
                    </div>
                    <label className="flex items-center cursor-pointer gap-2">
                        <span className="text-xs font-semibold text-text-secondary">{isActive ? 'Đang bật' : 'Tắt'}</span>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={isActive} 
                                onChange={() => toggleActiveProvider(provider)} 
                            />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-accent' : 'bg-zinc-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                </div>
                <p className="text-xs text-text-secondary/80 mb-4">{description}</p>
                
                <div className="flex flex-col gap-2 mb-4 p-3 bg-secondary rounded-md border border-border">
                    {isKyma ? (
                        <div>
                            <label className="text-xs font-semibold text-text-secondary block mb-1">Chọn Model</label>
                            <select
                                className="w-full bg-primary border border-border rounded-md p-1.5 text-text-primary text-xs focus:border-accent"
                                value={localModels.kyma}
                                onChange={e => setLocalModels(prev => ({ ...prev, kyma: e.target.value }))}
                            >
                                {(kymaModelOptions.length > 0 ? kymaModelOptions : DEFAULT_KYMA_MODELS).map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Base URL</label>
                                <input 
                                    type="text"
                                    className="w-full bg-primary border border-border rounded-md p-1.5 text-text-primary text-xs focus:border-accent"
                                    value={openAiBaseUrl}
                                    onChange={(e) => setOpenAiBaseUrl(e.target.value)}
                                    placeholder="https://openrouter.ai/api/v1"
                                />
                                <p className="text-[10px] text-text-secondary/60 mt-1">Dùng <b>https://openrouter.ai/api/v1</b> nếu sử dụng OpenRouter.</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Custom Model Name</label>
                                <input 
                                    type="text"
                                    className="w-full bg-primary border border-border rounded-md p-1.5 text-text-primary text-xs focus:border-accent"
                                    value={localModels.openai}
                                    onChange={(e) => setLocalModels(prev => ({ ...prev, openai: e.target.value }))}
                                    placeholder="anthropic/claude-4.5-sonnet"
                                />
                                <p className="text-[10px] text-text-secondary/60 mt-1">Ví dụ: <b>anthropic/claude-4.5-sonnet</b></p>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <KeyIcon className="w-4 h-4 absolute left-2.5 top-3 text-text-secondary"/>
                            <textarea
                            className="w-full bg-secondary border border-border rounded-md p-2 pl-8 text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition font-mono text-xs h-24"
                            value={newKeyInputs[provider]}
                            onChange={(e) => setNewKeyInputs(prev => ({ ...prev, [provider]: e.target.value }))}
                            placeholder={"Dán API keys tại đây...\nKey_1\nKey_2"}
                        />
                    </div>
                    <button
                        onClick={() => handleAddKey(provider)}
                        disabled={status.state === 'checking' || !(newKeyInputs[provider] || '').trim()}
                        className="w-full bg-accent hover:brightness-110 text-white font-bold py-2 px-3 rounded-md transition disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
                    >
                        {status.state === 'checking' ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : 'Thêm danh sách'}
                    </button>
                </div>
                {status.message && (
                    <p className={`text-xs mt-1.5 ${status.state === 'valid' ? 'text-green-400' : 'text-red-400'}`}>
                        {status.message}
                    </p>
                )}

                <div className="mt-4 flex-grow space-y-2 min-h-[8rem] overflow-y-auto pr-1">
                    <h4 className="text-xs font-semibold text-text-secondary/80">Keys đã lưu:</h4>
                    {displayedKeys.length === 0 ? (
                        <div className="text-center text-sm text-text-secondary pt-6">Chưa có key nào.</div>
                    ) : (
                        displayedKeys.map((key, index) => (
                            <div key={`${provider}-${index}`} className="bg-secondary p-2 rounded-md flex justify-between items-center text-sm transition-all group border border-transparent hover:border-border">
                                <div className="flex items-center gap-2 overflow-hidden">
                                        <KeyIcon className="w-4 h-4 text-text-secondary flex-shrink-0"/>
                                    <span className="font-mono text-text-secondary truncate">{`...${key.slice(-8)}`}</span>
                                    {index === 0 && <span className="text-[10px] font-bold text-accent bg-primary px-1.5 py-0.5 rounded-full flex-shrink-0">ACTIVE</span>}
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {index > 0 && (
                                        <button 
                                            onClick={() => handleActivateKey(provider, index)}
                                            className="text-xs font-semibold text-text-secondary hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            aria-label="Kích hoạt key"
                                        >
                                            Kích hoạt
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteKey(provider, index)}
                                        className="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                        aria-label="Xóa key"
                                    >
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-secondary rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col border border-border" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-accent">Quản lý AI & API Keys</h2>
                        <p className="text-sm text-text-secondary mt-1">Cấu hình nhà cung cấp AI. Nếu chọn cả 2, hệ thống sẽ xoay vòng (Round-Robin) cho mỗi lượt tạo kịch bản.</p>
                    </div>
                    {localActiveProviders.length === 2 && (
                        <div className="flex items-center gap-2 bg-accent/20 border border-accent/50 text-accent px-3 py-1.5 rounded-md">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">Đang bật Round-Robin</span>
                        </div>
                    )}
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-grow">
                    {renderKeyPanel('kyma')}
                    {renderKeyPanel('openai')}
                </div>
                <div className="px-5 pb-5">
                    <div className="bg-secondary rounded-lg p-5 border border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">Tavily Search API</h3>
                                <p className="text-xs text-text-secondary">Dùng để AI tra cứu số liệu vĩ mô trên Web</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-text-secondary block mb-1">
                                Tavily API Key
                            </label>
                            <input
                                type="password"
                                value={localTavilyKey}
                                onChange={(e) => setLocalTavilyKey(e.target.value)}
                                placeholder="tvly-..."
                                className="w-full bg-primary border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-primary border-t border-border flex flex-col sm:flex-row justify-end items-center gap-3">
                     <button onClick={onClose} className="w-full sm:w-auto text-sm bg-secondary hover:bg-primary/50 text-text-secondary font-semibold py-2 px-4 rounded-md transition border border-border">
                        Hủy
                    </button>
                    <button onClick={handleSave} className="w-full sm:w-auto text-sm bg-accent hover:brightness-110 text-white font-bold py-2 px-4 rounded-md transition">
                        Lưu & Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
