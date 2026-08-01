# WORKFLOW STATUS — deep-research

## BƯỚC 3.1: Xóa MissingDataModal.tsx
- [x] done — File `components/MissingDataModal.tsx` deleted (4866 bytes).

## BƯỚC 3.2: Gỡ UI Missing Data khỏi OutputDisplay, App, useGenerationWorkflow
- [x] done — OutputDisplay sạch MissingData UI, App không truyền prop, useGenerationWorkflow xoá handleResolveMissingData (giữ stub).

## BƯỚC 3.3: Sửa PromptRegistry + thêm 4 research prompts + sửa outline/factcheck
- [x] done — 4 PromptId mới đã thêm vào union + map, 4 builder prompts đã đăng ký, outline/factcheck đã cấm placeholder.

## BƯỚC 3.4: Xây dựng performDeepResearch trong dataRetrieval.ts
- [x] done — `performDeepResearch` đã triển khai 4 bước với onProgress callback, `fetchMacroData` đã xoá.

## BƯỚC 3.5: Tích hợp performDeepResearch vào useGenerationWorkflow
- [x] done — `generate()` đã gọi `performDeepResearch` thay cho `fetchMacroData`.

## Self-Audit
- [x] done — TypeScript check sạch tại 6 file đã sửa (App.tsx, OutputDisplay.tsx, useGenerationWorkflow.ts, PromptRegistry.ts, prompts/index.ts, dataRetrieval.ts). Lỗi pre-existing không thuộc MSEW-deep-research.
