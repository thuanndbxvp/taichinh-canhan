# CONTEXT: Track 2 - Phase 3: User-Custom Niches & DNA Import Wizard

### 1. Bối Cảnh Dự Án
Sau khi đã có lớp trừu tượng Niche (Phase 1) và cơ sở dữ liệu Supabase (Phase 2), giai đoạn cuối cùng của Track 2 là trao quyền cho người dùng tự tạo ngách mới thông qua UI DNA Import Wizard (tải file .md hoặc nhập trực tiếp), sử dụng AI để tự động thẩm định và phân tích DNA (AI DNA Validator), chỉnh sửa trong Niche Editor và chuyển đổi qua lại giữa các ngách trên toàn app.

### 2. Mục Đích Của Task (Track 2 - Phase 3)
1. **DNA Import Wizard (5 Bước):**
   - Bước 1: Thông tin cơ bản (Tên ngách, Thương hiệu, Mô tả).
   - Bước 2: Upload tài liệu DNA (Core DNA, các file Nhánh Markdown, Hooks).
   - Bước 3: AI DNA Validator (AI phân tích và gợi ý Routing Rules, kiểm định chất lượng DNA).
   - Bước 4: Cấu hình Routing Rules & Ràng buộc (Constraints).
   - Bước 5: Xem lại & Xuất bản (Lưu lên Supabase).
2. **Niche Management & Editor Modal:**
   - Cho phép xem, chỉnh sửa trực tiếp nội dung Markdown của từng file DNA.
3. **Niche Switcher Toàn Cục:**
   - Cho phép người dùng chuyển đổi tức thì giữa các ngách (VD: "Chú Que Tài Chính" ↔ "Kênh Lịch Sử Quân Sự" ↔ "Review Công Nghệ"). Toàn bộ Tone, Prompt và Kiến trúc kịch bản sẽ tự động chuyển đổi theo ngách được chọn.
