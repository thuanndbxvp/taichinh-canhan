# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 2 - Phase 4 (Dynamic Workflow Integration)

---

### BƯỚC 1: Cập nhật `services/aiService.ts`
- **File:** `services/aiService.ts`
- **Thực hiện:**
  1. Thêm import:
     ```typescript
     import type { NicheConfig } from '../src/services/niche/NicheConfig';
     import { dynamicPromptBuilder } from '../src/services/ai/DynamicPromptBuilder';
     import { dynamicRouter } from '../src/services/ai/DynamicRouter';
     import { FINANCE_VN_CONFIG } from '../src/config/niches';
     ```
  2. Cập nhật `classifyTopic`:
     ```typescript
     export const classifyTopic = async (
       title: string,
       niche?: NicheConfig | null
     ): Promise<RouteResult> => {
       const effectiveNiche = niche || FINANCE_VN_CONFIG;
       return dynamicRouter.route(title, effectiveNiche);
     };
     ```
  3. Cập nhật các hàm `generateScriptOutline`, `generateScriptPart`, `reviseScript` nhận thêm tham số `niche?: NicheConfig | null`.
     - Nếu truyền `niche` (hoặc fallback `FINANCE_VN_CONFIG`), gọi `dynamicPromptBuilder` để sinh system prompt và user prompt tương ứng.

---

### BƯỚC 2: Cập nhật `src/features/generation/useGenerationWorkflow.ts`
- **File:** `src/features/generation/useGenerationWorkflow.ts`
- **Thực hiện:**
  1. Thêm vào `UseGenerationWorkflowArgs`:
     ```typescript
     activeNiche?: NicheConfig | null;
     ```
  2. Trong các cuộc gọi `generateScriptOutline`, `generateScriptPart`, `reviseScript`, `classifyTopic`: Truyền `activeNiche` tương ứng.

---

### BƯỚC 3: Cập nhật `components/ControlPanel.tsx`
- **File:** `components/ControlPanel.tsx`
- **Thực hiện:**
  1. Nhận thêm prop `activeNiche?: NicheConfig | null`.
  2. Phần chọn Phong cách (Style / Branch): Thay vì 4 nút hardcoded (Phân tích, Tâm lý, Bóc phốt, Liệt kê), map qua `Object.keys(activeNiche?.branches || {})`.

---

### BƯỚC 4: Truyền `activeNiche` trong `App.tsx`
- **File:** `App.tsx`
- **Thực hiện:**
  1. Lấy `const { activeNiche } = useNiche();`
  2. Truyền `activeNiche` vào `useGenerationWorkflow` và `<ControlPanel />`.
