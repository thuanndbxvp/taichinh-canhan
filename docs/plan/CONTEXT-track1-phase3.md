# CONTEXT: Track 1 - Phase 3: Workflow & AI Outline Dynamic Estimation Parsing

### 1. Bối Cảnh Dự Án
Sau khi Dàn ý được sinh ra kèm theo khối JSON ước lượng số từ (Phase 2), Workflow cần bóc tách metadata này để:
1. Lưu trữ vào state `outlineEstimation` (`minRecommendedWords`, `optimalWords`, `reason`).
2. Tự động xác định chế độ sai số (`ToleranceMode`: 'standard' ±5% hoặc 'flexible' ±20%).
3. Thực hiện cân bằng động số từ giữa các phần (`rebalanceRemainingParts`) trong suốt chu trình sinh kịch bản tuần tự (Sequential Generation), đảm bảo không bao giờ bị nghẹt dưới 250 từ.

### 2. Mục Đích Của Task (Phase 3)
Cập nhật React Hook `src/features/generation/useGenerationWorkflow.ts` để kết nối Domain Logic `wordCount.ts` (Phase 1) với Prompt Engine (Phase 2).
