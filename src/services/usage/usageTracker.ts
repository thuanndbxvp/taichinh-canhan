/**
 * usageTracker — theo dõi lượng token đã tiêu thụ cho AI calls.
 *
 * Lưu trong localStorage (đơn giản, không cần IndexedDB bootstrap).
 * Mỗi call được ghi vào ring buffer (giữ 100 entry gần nhất) + totals.
 *
 * Phase 6: Sync to Supabase `usage_events` table automatically.
 */
import { supabase } from '../../lib/supabase';

const STORAGE_KEY = 'dark-frontiers:usage';
const MAX_ENTRIES = 100;

export type UsageEntryKind =
  | 'outline'
  | 'script'
  | 'script_part'
  | 'dialogue'
  | 'summarize'
  | 'visual_prompt'
  | 'score'
  | 'idea'
  | 'factcheck'
  | 'planner'
  | 'other';

export interface UsageEntry {
  id: string;
  timestamp: number;
  provider: string;
  model: string;
  kind: UsageEntryKind;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  /** Approx USD cost (optional, dựa trên bảng giá hardcoded đơn giản). */
  cost: number;
  /** Optional label để user dễ tra cứu. */
  label?: string;
}

export interface UsageTotals {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalCost: number;
  calls: number;
}

interface PersistedState {
  entries: UsageEntry[];
  totals: UsageTotals;
}

/**
 * Bảng giá đơn giản (USD per 1K tokens) — chỉ mang tính tham khảo.
 * Có thể cấu hình sau nếu cần.
 */
const PRICE_TABLE: Record<string, { prompt: number; completion: number }> = {
  // OpenAI (giá công khai, có thể lỗi thời)
  'gpt-4o-mini': { prompt: 0.00015, completion: 0.0006 },
  'gpt-4o': { prompt: 0.005, completion: 0.015 },
  'gpt-3.5-turbo': { prompt: 0.0005, completion: 0.0015 },
  // Anthropic
  'claude-3-haiku': { prompt: 0.00025, completion: 0.00125 },
  'claude-3-sonnet': { prompt: 0.003, completion: 0.015 },
  // Default fallback: zero (free / custom)
  default: { prompt: 0, completion: 0 },
};

function estimateCost(model: string, prompt: number, completion: number): number {
  const price = PRICE_TABLE[model] ?? PRICE_TABLE.default;
  return (prompt / 1000) * price.prompt + (completion / 1000) * price.completion;
}

const EMPTY_TOTALS: UsageTotals = {
  totalPromptTokens: 0,
  totalCompletionTokens: 0,
  totalTokens: 0,
  totalCost: 0,
  calls: 0,
};

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [], totals: { ...EMPTY_TOTALS } };
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      totals: { ...EMPTY_TOTALS, ...(parsed.totals ?? {}) },
    };
  } catch {
    return { entries: [], totals: { ...EMPTY_TOTALS } };
  }
}

function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded hoặc private mode — ignore silently.
  }
}

function makeId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function safeInt(n: unknown): number {
  const v = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.floor(v);
}

/**
 * Record một AI call. Token values có thể là 0 nếu provider không trả usage.
 */
export function recordUsage(input: {
  provider: string;
  model: string;
  kind: UsageEntryKind;
  promptTokens?: number;
  completionTokens?: number;
  label?: string;
}): UsageEntry {
  const prompt = safeInt(input.promptTokens);
  const completion = safeInt(input.completionTokens);
  const total = prompt + completion;
  const cost = estimateCost(input.model, prompt, completion);

  const entry: UsageEntry = {
    id: makeId(),
    timestamp: Date.now(),
    provider: input.provider,
    model: input.model,
    kind: input.kind,
    promptTokens: prompt,
    completionTokens: completion,
    totalTokens: total,
    cost,
    label: input.label,
  };

  const state = loadState();
  state.entries.unshift(entry);
  if (state.entries.length > MAX_ENTRIES) {
    state.entries.length = MAX_ENTRIES;
  }
  state.totals = {
    totalPromptTokens: state.totals.totalPromptTokens + prompt,
    totalCompletionTokens: state.totals.totalCompletionTokens + completion,
    totalTokens: state.totals.totalTokens + total,
    totalCost: state.totals.totalCost + cost,
    calls: state.totals.calls + 1,
  };

  saveState(state);

  // Async log to Supabase
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (user) {
      supabase.from('usage_events').insert({
        user_id: user.id,
        project_id: null, // Default to null for now if we don't have project context in AiGateway
        provider: entry.provider,
        model: entry.model,
        prompt_tokens: entry.promptTokens,
        completion_tokens: entry.completionTokens,
        total_tokens: entry.totalTokens,
        cost_usd: entry.cost,
        usage_kind: entry.kind,
        request_id: entry.id
      }).then(({ error }) => {
        if (error) console.error('Failed to log usage_events to Supabase:', error);
      });
    }
  });

  return entry;
}

export function getUsageTotals(): UsageTotals {
  return loadState().totals;
}

export function getUsageEntries(): UsageEntry[] {
  return loadState().entries;
}

export function clearUsage(): void {
  saveState({ entries: [], totals: { ...EMPTY_TOTALS } });
}
