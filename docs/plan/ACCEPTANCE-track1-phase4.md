# ACCEPTANCE CRITERIA: Track 1 - Phase 4 (UI Components)

- [ ] Ô nhập `Tổng số từ` trong `ControlPanel.tsx` không còn bị disable, người dùng có thể nhập số từ tùy ý hoặc click chọn 4 Presets (600, 1200, 1800, 2400 từ).
- [ ] Khi có `outlineEstimation`, box gợi ý số từ tối thiểu & lý tưởng của AI hiển thị trực quan, bắt mắt.
- [ ] Nhãn chế độ dung lượng (`🎯 Chuẩn mực ±5%` vs `⚡ Linh hoạt ±20%`) tự động cập nhật mượt mà theo nội dung mô tả của người dùng.
- [ ] `OutputDisplay.tsx` hiển thị Badge số từ chính xác với icon trạng thái ✅/⚠️ và độ lệch phần trăm.
- [ ] File `App.tsx` truyền đầy đủ props giữa workflow state và các UI components.
- [ ] Chạy `npm run typecheck` và `npm run build` thành công, không có lỗi linter/compiler.
