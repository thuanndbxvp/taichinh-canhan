# WORKFLOW STATUS — cleanup-pre-existing

## BƯỚC 3.1: Fix lỗi TopicSuggestionItem (Missing fields)
- [x] done — Thêm `branch?: string` và `hook?: string` vào `TopicSuggestionItem` trong `types.ts`.

## BƯỚC 3.2: Fix lỗi đường dẫn import trong UsagePanel.tsx
- [x] done — Sửa `'../services/usage/usageTracker'` → `'../src/services/usage/usageTracker'`.

## BƯỚC 3.3: Fix lỗi import `?raw` trong TSC
- [x] done — Thêm `declare module '*?raw'` ở cuối `types.ts`.

## Self-Audit
- [x] done — `npm run typecheck` giảm từ ~63 lỗi xuống còn **17 lỗi pre-existing** (KHÔNG thuộc MSEW). 7 lỗi `?raw`, ~50 lỗi constants.ts, 5 lỗi ControlPanel.tsx, 1 lỗi UsagePanel.tsx — đã sạch 100%. CodeGraph không báo errors.
