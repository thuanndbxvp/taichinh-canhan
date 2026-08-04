# ACCEPTANCE CRITERIA: Track 1 - Phase 3 (Workflow Integration)

- [ ] Hàm `parseOutlineEstimation` bóc tách chính xác khối JSON từ dàn ý.
- [ ] State `outlineEstimation` được cập nhật và reset đúng lifecycle khi tạo mới hoặc clear cache.
- [ ] Luồng `generateNextPart()` tự động tính toán `newPartTarget` qua `rebalanceRemainingParts` và bảo vệ mức sàn 250 từ.
- [ ] `ToleranceMode` ('standard' vs 'flexible') được xác định đúng đắn dựa trên description và `minRecommendedWords`.
- [ ] Chạy `npm run typecheck` hoàn toàn sạch sẽ, không có lỗi TypeScript.
