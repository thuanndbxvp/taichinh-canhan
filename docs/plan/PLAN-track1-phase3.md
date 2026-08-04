# PLAN: Track 1 - Phase 3: Workflow & AI Outline Dynamic Estimation Parsing

### 1. Kiến Trúc & Luồng Dữ Liệu
1. **Phân tích Outline Estimation:**
   - Sau khi AI sinh Dàn ý xong, hàm `parseOutlineEstimation(outlineText)` dùng regex quét thẻ `<!-- WORD_COUNT_ESTIMATION: ({...}) -->` hoặc JSON block.
   - Kết quả được lưu vào `outlineEstimation` state.
2. **Rebalance trong Sequential Generation:**
   - Khi chuẩn bị sinh phần thứ `index`:
     - Tách các phần kịch bản đã sinh trước đó từ `scriptRef.current`.
     - Tính số phần còn lại: `remainingCount = parts.length - index`.
     - Xác định `toleranceMode = determineToleranceMode(brief.outlineContent, targetTotal, outlineEstimation?.minRecommendedWords ?? 0)`.
     - Tính mục tiêu số từ mới: `const { newPartTarget } = rebalanceRemainingParts(targetTotal, generatedPartList, remainingCount, toleranceMode)`.
     - Cập nhật tham số `params.wordCount = (newPartTarget * parts.length).toString()` hoặc truyền trực tiếp vào `generateScriptPart`.

### 2. Danh Sách File Sửa Đổi
- `src/features/generation/useGenerationWorkflow.ts`
