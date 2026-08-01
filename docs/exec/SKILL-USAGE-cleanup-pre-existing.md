## Pre-Audit for MSEW-cleanup-pre-existing
- Reviewed MSEW vs codebase on 2026-08-01.
- MSEW fully actionable, no blockers detected.
- Verified: `TopicSuggestionItem` (types.ts:28) currently lacks `branch`/`hook`; `UsagePanel.tsx:1` uses wrong path `../services/...` (file is at `src/services/...`); 7 imports `?raw` are TypeScript-untyped.
- All 3 steps are safe type-level changes with no behavior impact.
- Approval: PROCEED.

## BƯỚC 3.3 (Audit Fix)
- Cú pháp `declare module '*?raw'` ban đầu không pass TypeScript vì tsc complain "Invalid module name in augmentation".
- Đã chuyển sang `/// <reference types="vite/client" />` ở đầu `types.ts` — đây là cách Vite khuyến nghị chính thức, pull `vite/client.d.ts` chứa sẵn declaration cho `*?raw`. Đã verify linter sạch 7 lỗi `?raw` sau fix.
