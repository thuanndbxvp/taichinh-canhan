import type { UsageEntry } from '../src/services/usage/usageTracker';

interface UsagePanelProps {
  totals: {
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalTokens: number;
    totalCost: number;
    calls: number;
  };
  entries: UsageEntry[];
  onRefresh: () => void;
  onClear: () => void;
}

const KIND_LABELS: Record<string, string> = {
  outline: 'Dàn ý',
  script: 'Kịch bản',
  script_part: 'Phần kịch bản',
  dialogue: 'Tách thoại',
  summarize: 'Tóm tắt',
  visual_prompt: 'Visual prompt',
  score: 'Chấm điểm',
  idea: 'Ý tưởng',
  other: 'Khác',
};

function fmtNumber(n: number): string {
  return n.toLocaleString('vi-VN');
}

function fmtCost(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

function fmtTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('vi-VN', { hour12: false });
}

export function UsagePanel({ totals, entries, onRefresh, onClear }: UsagePanelProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Lượt gọi" value={fmtNumber(totals.calls)} />
        <Stat label="Prompt tokens" value={fmtNumber(totals.totalPromptTokens)} />
        <Stat label="Completion tokens" value={fmtNumber(totals.totalCompletionTokens)} />
        <Stat label="Tổng chi phí (ước tính)" value={fmtCost(totals.totalCost)} />
      </div>

      <div className="flex items-center justify-between border-t border-slate-700 pt-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Lịch sử gần nhất
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
          >
            Làm mới
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Xóa toàn bộ usage stats?')) onClear();
            }}
            className="rounded border border-red-700 px-2 py-1 text-xs text-red-200 hover:bg-red-900/40"
          >
            Xóa
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-400">
          Chưa có dữ liệu. Usage stats sẽ được ghi sau mỗi lần gọi AI.
        </p>
      ) : (
        <div className="max-h-80 overflow-auto rounded border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-800 text-slate-300">
              <tr>
                <th className="px-2 py-2">Thời gian</th>
                <th className="px-2 py-2">Loại</th>
                <th className="px-2 py-2">Model</th>
                <th className="px-2 py-2 text-right">In</th>
                <th className="px-2 py-2 text-right">Out</th>
                <th className="px-2 py-2 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-slate-700/60">
                  <td className="px-2 py-1.5 font-mono text-[10px] text-slate-400">
                    {fmtTimestamp(e.timestamp)}
                  </td>
                  <td className="px-2 py-1.5">{KIND_LABELS[e.kind] ?? e.kind}</td>
                  <td className="px-2 py-1.5 font-mono text-[10px] text-slate-300">
                    {e.model}
                    {e.label && (
                      <span className="ml-1 text-slate-500">· {e.label}</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-right">{fmtNumber(e.promptTokens)}</td>
                  <td className="px-2 py-1.5 text-right">{fmtNumber(e.completionTokens)}</td>
                  <td className="px-2 py-1.5 text-right">{fmtCost(e.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[10px] text-slate-500">
        Chi phí chỉ mang tính tham khảo dựa trên bảng giá hardcoded trong{' '}
        <code className="rounded bg-slate-800 px-1">usageTracker.ts</code>.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-800/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 font-mono text-base text-slate-100">{value}</div>
    </div>
  );
}
