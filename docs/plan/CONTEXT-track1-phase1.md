# CONTEXT: Track 1 - Phase 1: Word Count Engine & Unit Tests

### 1. Bối Cảnh Dự Án
Ứng dụng viết kịch bản "Chú Que Tài Chính" đang bước vào chiến dịch nâng cấp toàn diện (Master Refactor Track 1).
Trước đây, ứng dụng không kiểm soát được số lượng từ thực tế của kịch bản, input số từ bị disable và không có cơ chế bù trừ giữa các phần, dẫn đến việc kịch bản sinh ra hoặc quá dài hoặc quá ngắn làm mất đi bài toán số liệu chi tiết.

### 2. Mục Đích Của Task (Phase 1)
Xây dựng nền tảng Domain Logic thuần túy (Word Count Engine) chịu trách nhiệm:
1. Tính toán biên độ sai số linh hoạt theo 2 chế độ: Chuẩn (`standard` ±5%) và Linh hoạt (`flexible` ±20%).
2. Nhận diện tự động yêu cầu tóm tắt/ngắn gọn từ người dùng (`detectConciseRequest`).
3. Cân bằng động số từ giữa các phần (`rebalanceRemainingParts`) nhưng **bảo vệ ngưỡng sàn tối thiểu `MIN_PART_FLOOR = 250 từ`** để chống hiện tượng bóp nghẹt dung lượng bài toán tài chính ở các phần sau.
4. Đếm từ chính xác cho cả Tiếng Việt và Tiếng Anh sau khi bóc tách Markdown.
5. Tạo bộ Unit Tests Vitest bao phủ 100% các kịch bản biên để làm móng vững chắc cho các Phase UI và Workflow tiếp theo.
