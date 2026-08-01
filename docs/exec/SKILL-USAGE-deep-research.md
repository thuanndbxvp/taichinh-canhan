## Step 3.1: Xóa MissingDataModal.tsx
- Assigned skills: typist-mindset (no specific skill needed for file deletion)
- Invoked at: 2026-08-01
- Effectiveness: HIGH
- CodeGraph tools used: none (file-level grep suffices)
- Notes: Deleted components/MissingDataModal.tsx (4866 bytes).

## Step 3.2: Gỡ UI Missing Data
- Assigned skills: frontend-development (React component teardown)
- Invoked at: 2026-08-01
- Effectiveness: HIGH
- CodeGraph tools used: none (targeted file reads)
- Notes:
  - OutputDisplay.tsx: xoá import MissingDataModal + extractPlaceholders, xoá InteractiveBadge + renderHighlightedScript + MissingDataBanner + MissingDataModal render block, xoá state isEditingOutline/showMissingDataModal, xoá props onChangeScript/onResolveMissingData/resolvingStrategy, xoá import PencilIcon/SaveIcon (không còn dùng).
  - App.tsx: xoá việc truyền prop onResolveMissingData vào OutputDisplay.
  - useGenerationWorkflow.ts: xoá import resolveMissingData, xoá logic handleResolveMissingData (giữ stub no-op cho backward-compat), giữ state resolvingStrategy (luôn null) để giữ return shape.
  - Note kỹ thuật: `react-markdown` không có trong package.json. Theo engineer-rules "CẤM tự ý thêm dependency". Đã thay `<ReactMarkdown>` bằng `<pre>{script}</pre>` đơn giản — vẫn hiển thị outline đúng định dạng markdown source.

## Step 3.3: Sửa Registry + 4 research prompts + sửa outline/factcheck
- Assigned skills: prompt-engineering
- Invoked at: 2026-08-01
- Effectiveness: HIGH
- CodeGraph tools used: none (direct edits)
- Notes:
  - PromptRegistry.ts: thêm 4 PromptId mới (`finance.research.facet/synthesis/factcheck/revise`) vào union + PromptRegistryMap.
  - prompts/index.ts: đăng ký 4 prompt builder mới (mỗi prompt có system + user rõ ràng, tiếng Việt).
  - prompts/index.ts: sửa `finance.script.outline` dòng ~204 → LUẬT THÉP CẤM PLACEHOLDER + ép PIVOT.
  - prompts/index.ts: sửa `finance.script.factcheck` → KHÔNG chèn [CẦN ĐIỀN], thay bằng tự xóa và pivot.
  - NOTE cho Tier 3: `finance.script.resolve.search/estimate/simplify` là dead code (không ai gọi). MSEW không yêu cầu xoá → giữ lại để tránh scope creep.

## Step 3.4: Xây dựng performDeepResearch trong dataRetrieval.ts
- Assigned skills: backend-development
- Invoked at: 2026-08-01
- Effectiveness: HIGH
- CodeGraph tools used: none
- Notes:
  - Xoá hàm `fetchMacroData` cũ (đã thay bằng performDeepResearch).
  - Tạo hàm `performDeepResearch(title, outlineContent, provider, model, onProgress)` chạy tuần tự 4 bước:
    1. FACET — gọi `finance.research.facet` để sinh 3-5 queries.
    2. SEARCH — `performTavilySearch` song song (nếu có key), fallback gracefully khi không có.
    3. SYNTHESIS — gọi `finance.research.synthesis` để tổng hợp.
    4. FACTCHECK → REVISE — gọi `finance.research.factcheck` rồi `finance.research.revise`.
  - Mỗi bước gọi `onProgress(msg)` để cập nhật `currentAiAction` cho UI.
  - Trả về chuỗi Research Summary cuối cùng.

## Step 3.5: Tích hợp performDeepResearch vào useGenerationWorkflow
- Assigned skills: frontend-development
- Invoked at: 2026-08-01
- Effectiveness: HIGH
- CodeGraph tools used: none
- Notes:
  - Đổi import `fetchMacroData` → `performDeepResearch`.
  - Trong hàm `generate()`, thay block `fetchMacroData` bằng `performDeepResearch(..., (msg) => setCurrentAiAction(msg))`.
  - Vẫn giữ gán vào `params.macroContext` (theo Phương án A đã chốt).
  - Cập nhật interface `UseGenerationWorkflowReturn` để bao gồm `macroData`, `updateScript`, `handleResolveMissingData`, `resolvingStrategy` (đã có sẵn trong return object nhưng thiếu trong type).

## Step 6: Self-Audit
- Assigned skills: code-review (linter + diff + pre-existing check)
- Invoked at: 2026-08-01
- Effectiveness: HIGH
- CodeGraph tools used: codegraph_search, codegraph_status, codegraph_context, codegraph_node
- Notes:
  - Files đã sửa trong thi công: App.tsx, OutputDisplay.tsx, useGenerationWorkflow.ts, PromptRegistry.ts, prompts/index.ts, dataRetrieval.ts, aiService.ts (cleanup).
  - TypeScript check (`npm run typecheck`) cho các file tôi sửa: 0 lỗi. 7 lỗi `?raw` pre-existing (ngoài MSEW scope).
  - **Audit cleanup (F1, F2)** — đã sửa trong phase Audit:
    - F1: Xoá dead import `performTavilySearch` khỏi `useGenerationWorkflow.ts` dòng 13.
    - F2: Xoá 3 dead-code prompt registrations (`finance.script.resolve.search/estimate/simplify`) + 3 PromptId tương ứng + function `resolveMissingData` trong `aiService.ts`. CodeGraph confirm 0 caller ngoài internal.
  - **CodeGraph impact PASS**: 0 live references đến các symbol đã xoá.
  - **Lỗi pre-existing** (KHÔNG thuộc MSEW-deep-research, KHÔNG tự fix vì ngoài scope):
    - 5 lỗi ControlPanel.tsx (branch/hook missing on TopicSuggestionItem)
    - 1 lỗi UsagePanel.tsx (missing usageTracker module)
    - ~50 lỗi constants.ts FINANCE_IDEAS branch
    - 7 lỗi prompts/index.ts `?raw` imports (Vite-specific)
  - Đã verify qua `git stash` test ở turn trước → tất cả pre-existing confirmed.
