# CONTEXT: Tính năng Rewrite Script & Tái cấu trúc Trọng số

Dự án hiện tại gặp vấn đề với luồng "Tạo Mới" (khi người dùng nhập Dàn ý quá dài, AI sẽ bỏ qua Tiêu đề).
Đồng thời, cần một luồng mới hoàn toàn để "Tẩy rửa/Viết lại" (Rewrite) một kịch bản có sẵn theo DNA của Chú Que.
Task này yêu cầu giới hạn độ dài của Dàn ý ở luồng Tạo mới, và xây dựng một Modal Side-by-side chuyên dụng cho luồng Rewrite.
Đã thống nhất 2 mức độ Rewrite: (1) Sửa văn phong, (2) Đập đi gò lại 5 phần.
Ngoài ra, cần fix gấp bug Mojibake (lỗi font) trong file `src/services/ai/prompts/index.ts`.
