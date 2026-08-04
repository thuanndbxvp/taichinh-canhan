# PLAN: Track 1 - Phase 5: End-to-End Verification & Quality Audit

### 1. Chiến Lược Kiểm Định (Testing Strategy)
1. **Automated Unit & Integration Testing:**
   - Chạy `npm test` để kiểm tra 100% test cases của Word Count Engine.
   - Chạy `npm run typecheck` để đảm bảo hệ thống types đồng bộ toàn diện.
   - Chạy `npm run build` để kiểm tra bundling không có broken imports.
2. **Quality Audit Checklist (Kiểm Định Thực Tế):**
   - **Độ dài kịch bản:** Kiểm tra test kịch bản mục tiêu 1.800 từ đạt trong khoảng 1.710 – 1.890 từ.
   - **Bài toán số liệu:** Phần 3 & 4 có số liệu cụ thể (lãi suất %, tiền triệu/tỷ, năm) thay vì nói chung chung.
   - **Tẩy rửa mùi văn AI:** Không xuất hiện "cực kỳ", "vô cùng", "bức tranh toàn cảnh", không có emoji, không có staccato drama cụt lủn.
   - **Chức năng Sửa Kịch bản (Revise):** Khi yêu cầu sửa kịch bản, AI giữ đúng giọng văn Chú Que và tuân thủ các quy tắc Humanizer.

### 2. Danh Sách Các Mục Kiểm Thử
- Chạy test suite `src/domain/wordCount.test.ts`.
- Chạy build pipeline Vite.
- Tổng kết báo cáo nghiệm thu vào `docs/plan/ACCEPTANCE-track1-phase5.md`.
