# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 1 - Phase 3 (Workflow Integration)

---

### BƯỚC 1: Cập nhật Interface và State trong `src/features/generation/useGenerationWorkflow.ts`
- **File:** `src/features/generation/useGenerationWorkflow.ts`
- **Thực hiện:**
  1. Thêm interface:
     ```typescript
     export interface OutlineEstimation {
       minRecommendedWords: number;
       optimalWords: number;
       reason: string;
     }
     ```
  2. Thêm vào `UseGenerationWorkflowReturn`:
     ```typescript
     outlineEstimation: OutlineEstimation | null;
     setOutlineEstimation: (est: OutlineEstimation | null) => void;
     ```
  3. Thêm state và helper bóc tách JSON metadata:
     ```typescript
     import {
       rebalanceRemainingParts,
       determineToleranceMode,
       ToleranceMode,
     } from '../../domain/wordCount';

     export function parseOutlineEstimation(text: string): OutlineEstimation | null {
       if (!text) return null;
       // Tìm dạng comment: <!-- WORD_COUNT_ESTIMATION: {...} -->
       const commentMatch = text.match(/<!--\s*WORD_COUNT_ESTIMATION:\s*(\{[\s\S]*?\})\s*-->/i);
       if (commentMatch) {
         try {
           const parsed = JSON.parse(commentMatch[1]);
           if (parsed.minRecommendedWords && parsed.optimalWords) return parsed;
         } catch {
           // ignore error
         }
       }
       // Fallback tìm JSON block chứa minRecommendedWords
       const jsonBlockMatch = text.match(/\{[\s\S]*?"minRecommendedWords"[\s\S]*?\}/i);
       if (jsonBlockMatch) {
         try {
           return JSON.parse(jsonBlockMatch[0]);
         } catch {
           // ignore error
         }
       }
       return null;
     }
     ```
  4. Trong `useGenerationWorkflow()` component hook:
     ```typescript
     const [outlineEstimation, setOutlineEstimation] = useState<OutlineEstimation | null>(null);
     ```
  5. Trong `resetAllCaches()`: Thêm `setOutlineEstimation(null);`.

---

### BƯỚC 2: Parse Estimation sau khi sinh Dàn Ý
- Trong hàm `generate()`:
  Sau dòng `const outline = await generateScriptOutline(...)`:
  ```typescript
  setFullOutlineText(outline);
  const estimation = parseOutlineEstimation(outline);
  if (estimation) {
    setOutlineEstimation(estimation);
  }
  ```

---

### BƯỚC 3: Tích Hợp `rebalanceRemainingParts` vào `generateNextPart()`
- Trong hàm `generateNextPart()`:
  Thay thế đoạn tính toán target cứng cũ bằng cơ chế rebalance động:
  ```typescript
  const totalNum = parseInt(finalWordCount, 10) || 1800;
  const remainingCount = parts.length - index;

  // Tách các phần đã sinh trước đó từ scriptRef.current
  const generatedPartsList = baseScript
    .replace(PARTS_HEADER, '')
    .split(/\n\n---\n\n/)
    .map(p => p.trim())
    .filter(Boolean);

  const toleranceMode = determineToleranceMode(
    brief.outlineContent,
    totalNum,
    outlineEstimation?.minRecommendedWords ?? 0
  );

  const { newPartTarget } = rebalanceRemainingParts(
    totalNum,
    generatedPartsList,
    remainingCount,
    toleranceMode
  );

  // Ép dung lượng cho phần hiện tại
  params.wordCount = (newPartTarget * parts.length).toString();
  ```

---

### BƯỚC 4: Export `outlineEstimation` trong Hook Return Object
- Return `{ ..., outlineEstimation, setOutlineEstimation }`.
