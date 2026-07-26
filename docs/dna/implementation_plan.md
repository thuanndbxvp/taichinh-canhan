# Phân Tích & Đề Xuất Tích Hợp DNA Nhánh

Mục tiêu: Đánh giá 5 file DNA nhánh vừa tạo và đề xuất phương án tối ưu để ghép nối các file này vào logic code hiện tại của ứng dụng, giúp hệ thống tạo ra kịch bản sắc bén và đúng định hướng nhất.

## 1. Đánh giá 5 file DNA nhánh

Sau khi đọc lướt qua cấu trúc và nội dung của 5 file (`finance-analytical.md`, `finance-psychology.md`, `finance-mythbusting.md`, `finance-listicle.md`, `finance-hooks.md`), tôi có thể khẳng định: **Bạn đã bóc tách cực kỳ xuất sắc!** Các file này không chỉ kế thừa hoàn hảo `finance-core.md` mà còn giải quyết triệt để vấn đề "AI bị lặp kịch bản" mà bạn phàn nàn trước đây.

*   **Sự kế thừa:** Các nhánh đều tôn trọng tuyệt đối văn phong "Tôi - Anh em", cấu trúc [Mở - Thân - Kết] linh hoạt, và đặc biệt là né tránh việc dùng từ ngữ sáo rỗng.
*   **Sự phát triển đột phá:**
    *   **Analytical:** Bắt buộc AI phải dùng "phép tính", "so sánh A vs B", và "chi phí cơ hội" thay vì nói đạo lý suông.
    *   **Psychology:** Nhấn mạnh sự thấu cảm, hạ tông giọng "dạy đời", và tập trung 50-60% vào câu chuyện đời thật.
    *   **Myth-busting:** Áp dụng chuẩn kỹ thuật "Rào trước phản biện" (Không kích động, không vu khống, dùng bằng chứng).
    *   **Listicle:** Phá vỡ *Anti-Listicle Pattern* bằng cấu trúc 4 phần (Tên -> Ví dụ -> Hành động -> Cảnh báo) cực kỳ thực chiến.
    *   **Hooks:** Đảm bảo 4 kiểu mở đầu xoay vòng để 50 video không có cái nào bắt đầu giống cái nào.

> [!TIP]
> Việc chia nhỏ như thế này giúp System Prompt gửi cho AI ngắn gọn, tập trung hơn. Thay vì bắt AI đọc 1 file khổng lồ và bị "loãng" ngữ cảnh, ta chỉ đút cho nó phần Lõi + đúng Nhánh nó cần.

---

## 2. Ý tưởng Tích hợp vào Logic (Kiến trúc Router)

Để kết hợp các file này, chúng ta đối mặt với 2 lựa chọn: **Người dùng tự chọn** hay **AI tự phân loại**? Dưới đây là 3 phương án và đề xuất của tôi.

### Phương án A: Người dùng tự chọn (Manual Selection)
Thêm 2 Dropdown trên giao diện UI:
- **Thể loại kịch bản:** Phân tích / Tâm lý / Bóc phốt / Listicle
- **Kiểu mở đầu (Hook):** Kể chuyện / Số liệu / Hỏi đáp / Phá vỡ lầm tưởng
- **Ưu điểm:** Dễ code, người dùng toàn quyền kiểm soát.
- **Nhược điểm:** Trải nghiệm người dùng (UX) bị nặng nề. Đôi khi người dùng có 1 chủ đề (VD: *"Vì sao thu nhập 30 triệu vẫn thiếu trước hụt sau"*) nhưng không biết nên chọn nhánh *Tâm lý* hay *Phân tích* sẽ hay hơn.

### Phương án B: AI tự động điều phối (Auto-Routing Pattern)
Sử dụng một mô hình AI nhẹ và nhanh (như Haiku/Flash) đóng vai trò làm **"Cảnh sát giao thông" (Router AI)**.
- Khi user nhập Chủ đề, Router AI phân tích ý định và trả về 1 chuỗi JSON: `{"branch": "finance-psychology", "hook": "story-hook"}`.
- Backend đọc kết quả này, nối các file tương ứng: `finance-core.md` + `finance-psychology.md` + `finance-hooks.md`.
- Gửi Prompt tổng hợp này cho AI chính (Sonnet/Pro) để viết kịch bản.
- **Ưu điểm:** Trải nghiệm cực mượt (Magic UX). AI tự biết bài toán nào cần dùng bảng tính (Analytical), bài nào cần xoa dịu (Psychology).
- **Nhược điểm:** Tốn thêm 1 nhịp gọi API (delay khoảng 1-2 giây) trước khi bắt đầu viết.

### Phương án C: Kết hợp (Hybrid) - 🔥 KHUYẾN NGHỊ
Chúng ta cung cấp sự tiện lợi tối đa nhưng vẫn cho phép kiểm soát sâu:
1.  **Mặc định (Auto):** Trên UI có nút gạt "✨ Để AI tự chọn phong cách". Khi bật, hệ thống dùng **Router AI** (Phương án B) để quyết định.
2.  **Tùy chỉnh (Advanced):** Nếu user tắt nút gạt, một bảng Tùy chọn sẽ hiện ra cho phép user ép AI viết theo nhánh Listicle, Analytical, v.v., và ép dùng loại Hook cụ thể.

## 3. Kiến trúc Code Đề Xuất (Implementation)

Nếu bạn đồng ý với **Phương án C**, lộ trình code sẽ như sau:

1.  **Cập nhật UI (`ControlPanel.tsx`):**
    *   Thêm phần thiết lập (Settings) cho **Phong cách Kịch bản** (Tự động / 4 Nhánh) và **Kiểu Hook** (Tự động / 4 Kiểu).
2.  **Tạo Router Agent (`services/ai/router.ts`):**
    *   Viết 1 prompt nhỏ: *"Bạn là chuyên gia phân loại nội dung. Dựa vào chủ đề User đưa, hãy xếp nó vào 1 trong 4 nhánh (A, B, C, D) và chọn 1 loại Hook phù hợp. Trả về JSON."*
3.  **Hệ thống Prompt Builder (`prompts/index.ts`):**
    *   Tạo hàm `buildSystemPrompt(core, branch, hooks, options)`. Hàm này sẽ đọc file markdown (.md) tương ứng và nối chúng lại với nhau.
    *   Inject các tham số động từ UI (như Độ dài từ) vào đoạn text cuối.
4.  **Cập nhật Luồng Generator (`services/ai/generator.ts`):**
    *   Bước 1: Gọi Router AI (nếu user chọn Auto).
    *   Bước 2: Gọi Prompt Builder.
    *   Bước 3: Gọi AI chính để generate kịch bản.

## Open Questions

> [!IMPORTANT]
> 1. Bạn đánh giá thế nào về **Phương án C (Hybrid)**? Bạn muốn làm Auto hoàn toàn cho gọn nhẹ hay có tùy chọn Advanced?
> 2. Các file markdown `.md` này nên được import trực tiếp vào code dưới dạng chuỗi string trong TypeScript (như chúng ta đang làm), hay bạn muốn cấu hình Vite để đọc trực tiếp file `.md` trong thư mục `docs/dna/` lúc runtime? (Đọc file thì tách biệt content và code, nhưng import string thì dễ bundle hơn).
