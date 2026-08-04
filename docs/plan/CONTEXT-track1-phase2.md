# CONTEXT: Track 1 - Phase 2: Prompt Engine & Humanizer Integration

### 1. Bối Cảnh Dự Án
Kịch bản sinh ra hiện tại vẫn còn vương vấn "mùi văn AI" (từ ngữ sáo rỗng như "cực kỳ", "bức tranh toàn cảnh", "không chỉ... mà còn...", câu ngắn cộc lốc staccato drama, dùng emoji bừa bãi và thiếu bài toán số liệu chi tiết ở Phần 3 & 4).
Đồng thời, hàm `finance.script.revise` hiện tại bị lỗi nghiêm trọng khi nạp chuỗi rỗng thay vì nạp đầy đủ DNA nhánh và Hook DNA, làm mất bản sắc thương hiệu Chú Que khi người dùng yêu cầu sửa kịch bản.

### 2. Mục Đích Của Task (Phase 2)
1. **Nâng cấp `finance.script.revise` và `finance.script.revise.partial`:** Xây dựng `buildRewritingSystemPrompt()` nạp 100% DNA (`coreRaw`, `Branch DNA`, `Hook DNA`) kèm bộ lọc Humanizer.
2. **Tích hợp Humanizer Engine:**
   - Level 1 (Light - 11 rules cốt lõi): Tích hợp vào System Prompt cho luồng Generation và Rewrite Level 1 để tối ưu token.
   - Level 2 (Deep - 33 rules đầy đủ đã nén gọn): Dành riêng cho luồng Rewrite Level 2 (tẩy sạch 100% mùi văn AI).
3. **Cập nhật `finance.script.outline`:** Bắt buộc dàn ý có Cơ chế ngầm, Phản biện và **Khối JSON metadata AI Dynamic Estimation** trả về số từ tối thiểu & tối ưu.
4. **Cập nhật `finance.script.part`:** Bắt buộc Phần 3 & 4 phải có **1 bài toán giả định mô phỏng bằng số liệu cụ thể** (lãi suất, tiền gốc, thời gian, so sánh phương án).
5. **Cập nhật `docs/dna/finance-core.md`:** Đồng bộ các nguyên tắc Humanizer và bài toán mô phỏng vào tài liệu DNA chuẩn.
