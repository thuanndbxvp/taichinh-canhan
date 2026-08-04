# CONTEXT: Track 1 - Phase 5: End-to-End Verification & Quality Audit

### 1. Bối Cảnh Dự Án
Sau khi hoàn thiện toàn bộ mã nguồn của 4 Phase đầu, hệ thống cần một đợt kiểm thử tổng thể (End-to-End Test) và Audit chất lượng kịch bản đầu ra để chứng minh hệ thống thỏa mãn 100% mục tiêu Track 1.

### 2. Mục Đích Của Task (Phase 5)
1. **Kiểm thử tích hợp tự động:** Chạy toàn bộ Unit Tests & Typecheck.
2. **Audit chất lượng kịch bản:**
   - Kiểm tra độ lệch số từ (Standard Mode nằm trong biên độ ±5%, Flexible Mode nằm trong ±20%).
   - Kiểm tra cấu trúc luận điểm 5 phần và sự xuất hiện của bài toán mô phỏng số liệu ở Phần 3 & 4.
   - Kiểm tra bộ lọc Humanizer (Không có từ ngữ AI sáo rỗng, không có emoji, không có staccato drama).
   - Kiểm tra `reviseScript` không bị mất bản sắc DNA Chú Que.
