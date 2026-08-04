# CONTEXT: Track 1 - Phase 4: UI Updates (Word Count Calibration & Badges)

### 1. Bối Cảnh Dự Án
Sau khi Domain Logic (Phase 1), Prompt Engine (Phase 2), và Workflow Integration (Phase 3) đã hoàn tất, giao diện người dùng cần được cập nhật để:
1. Mở khóa ô nhập `Tổng số từ` và cung cấp các nút chọn nhanh (Presets 600, 1200, 1800*, 2400 từ).
2. Hiển thị gợi ý động từ AI (`minRecommendedWords`, `optimalWords`) khi Dàn ý đã được tạo xong.
3. Hiển thị trực quan Badge kiểm soát số từ thực tế với độ lệch phần trăm (±5% hoặc ±20%) trên màn hình hiển thị kịch bản.

### 2. Mục Đích Của Task (Phase 4)
Cập nhật `components/ControlPanel.tsx`, `components/OutputDisplay.tsx`, và truyền dữ liệu tương ứng trong `App.tsx`.
