import { UsagePanel } from './UsagePanel';
import { useUsageStats } from '../src/features/usage/useUsageStats';

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsageModal({ isOpen, onClose }: UsageModalProps) {
  const { totals, entries, refresh, clear } = useUsageStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-700 px-5 py-3">
          <h2 className="text-base font-semibold">Thống kê sử dụng AI</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-300 hover:bg-slate-700"
            aria-label="Đóng"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-auto p-5">
          <UsagePanel totals={totals} entries={entries} onRefresh={refresh} onClear={clear} />
        </div>
      </div>
    </div>
  );
}
