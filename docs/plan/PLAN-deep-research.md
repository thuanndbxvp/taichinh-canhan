# TIER 1 PLAN: Deep Research Pipeline & Đập bỏ Logic Missing Data

## 1. Mục tiêu kiến trúc
- **Thay thế luồng `fetchMacroData` hiện tại:** Bằng một pipeline RAG (Deep Research) chuẩn mực gồm 4 bước: Phân tích Facet -> Tìm kiếm bằng Tavily -> Tổng hợp Research -> Factcheck & Revise. Toàn bộ logic này sẽ nằm trong `src/services/dataRetrieval.ts` hoặc tách thành `src/services/ai/deepResearch.ts`.
- **Đập bỏ hoàn toàn thiết kế UI Missing Data (Safety Net):** UI cũ sử dụng thẻ `[CẦN ĐIỀN...]` và các component tương tác như `MissingDataModal`, `MissingDataBanner` sẽ bị loại bỏ hoàn toàn.
- **Quy tắc mới cho AI (Hard Constraint):** Kể từ bước Lập dàn ý (`finance.script.outline`), AI bị cấm dùng thẻ placeholder và BẮT BUỘC phải TỰ ĐỘNG XOAY TRỤC (PIVOT) cách viết dựa trên những dữ liệu tìm được trong quá trình Deep Research.

## 2. Luồng dữ liệu (Data Flow) thay đổi
- **Cũ:** Nhập Topic -> `classifyTopic` -> `fetchMacroData` -> `generateScriptOutline` -> Sinh thẻ `[CẦN ĐIỀN]` -> Người dùng resolve data qua modal.
- **Mới:** Nhập Topic -> `classifyTopic` -> `performDeepResearch` (4 bước) trả về `researchSummary` -> `generateScriptOutline` (ép luật pivot, cấm placeholder) -> Render thẳng ra Dàn ý tĩnh.

## 3. Danh sách các file cần can thiệp
- **UI/Component:** Xoá `components/MissingDataModal.tsx`. Xoá UI thừa trong `components/ControlPanel.tsx` và `components/OutputDisplay.tsx`.
- **Luồng Workflow:** Cập nhật `src/features/generation/useGenerationWorkflow.ts`.
- **Data Retrieval / AI Service:** Chỉnh sửa `src/services/dataRetrieval.ts`.
- **AI Prompts / DNA:** Cập nhật `src/services/ai/prompts/index.ts` và `docs/dna/finance-core.md`.
