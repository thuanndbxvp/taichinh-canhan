# WORKFLOW STATUS — cleanup-pre-existing-2

## BƯỚC 3.1: Fix Test Data
- [x] done — Thêm `scriptStyle: 'analytical'` và `scriptHook: 'story'` vào `brief` mock ở `useGenerationWorkflow.test.ts`.

## BƯỚC 3.2: Thêm brief?: any vào LibraryItem
- [x] done — Thêm `brief?: any` vào `LibraryItem` trong `types.ts`.

## BƯỚC 3.3: Fix AppErrorCode (sửa AiGateway dùng AI_GENERATION_FAILED)
- [x] done — Sửa `AiGateway.ts:299` từ `'ai_generation_failed'` → `'AI_GENERATION_FAILED'`. Thêm `'AI_GENERATION_FAILED'` vào `AppErrorCode` union trong `errors.ts`.

## BƯỚC 3.4: Thêm 'http'/'provider' vào ProviderErrorKind
- [x] done — Thêm `'http'` và `'provider'` vào `ProviderErrorKind` union trong `ProviderError.ts`.

## BƯỚC 3.5: Fix import trong router.ts
- [x] done — Sửa `import { parseAiJsonOrThrow } from './schemas'` → `'./responseParser'`.

## BƯỚC 3.6: Exclude supabase/functions trong tsconfig.json
- [x] done — Thêm field `exclude` vào `tsconfig.json`.

## Self-Audit
- [x] done — `tsc --noEmit` exit 0, **0 lỗi TypeScript** (từ 17 lỗi xuống 0). CodeGraph index re-run sạch.