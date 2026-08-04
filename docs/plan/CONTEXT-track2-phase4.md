# CONTEXT: Track 2 - Phase 4: Dynamic Workflow Integration

### 1. Bối Cảnh Dự Án
Ở các Phase 1-3 của Track 2, chúng ta đã xây dựng thành công:
- Domain Interfaces (`NicheConfig`), Configs (`niches.ts`), Service (`NicheService`), Context (`NicheContext`).
- Dynamic Prompt Builder (`DynamicPromptBuilder`), Dynamic Router (`DynamicRouter`).
- UI Components (`NicheSwitcher`, `NicheEditorModal`, `DnaImportWizard`).

Tuy nhiên, `useGenerationWorkflow.ts` và `aiService.ts` hiện tại vẫn đang gọi trực tiếp các prompt tĩnh dạng `'finance.script.outline'`, `'finance.script.part'`, `'finance.script.revise'`.
Để hoàn tất mục tiêu Multi-Niche, quy trình sinh kịch bản (Workflow) cần nạp trực tiếp `activeNiche` từ `NicheContext` và chuyển giao cho `aiService` & `DynamicPromptBuilder`.

### 2. Mục Đích Của Task (Track 2 - Phase 4)
1. **Cập nhật `services/aiService.ts`:**
   - Hỗ trợ truyền `nicheConfig?: NicheConfig` vào các hàm `generateScriptOutline`, `generateScriptPart`, `reviseScript`, `classifyTopic`.
   - Nếu có `nicheConfig`, sử dụng `dynamicPromptBuilder` và `dynamicRouter` để sinh prompt động tương ứng với Niche đang chọn; nếu không, fallback về `finance-vn`.
2. **Cập nhật `src/features/generation/useGenerationWorkflow.ts`:**
   - Nhận `activeNiche` từ `NicheContext` (hoặc qua argument) và truyền xuống `aiService`.
3. **Cập nhật `App.tsx` / `ControlPanel.tsx`:**
   - Hiển thị các Style/Branch động theo `activeNiche.branches` thay vì 4 nhánh cứng của Tài Chính.
