# Kế Hoạch Kiểm Soát Số Từ Kịch Bản (Word Count Control Strategy)

Mục tiêu của kế hoạch này là khắc phục tình trạng AI tạo ra kịch bản vượt quá (hallucinate) số từ yêu cầu (ví dụ: yêu cầu 1200 từ nhưng sinh ra > 2000 từ). Các Large Language Models (LLMs) đếm theo token thay vì từ, do đó việc ép một giới hạn số từ chính xác thường kém hiệu quả nếu không kết hợp với các giới hạn cấu trúc.

## Phân tích nguyên nhân
1. **Xung đột chỉ thị (Prompt Conflict):** AI được yêu cầu số từ thấp (~240 từ/phần) nhưng lại kèm theo lệnh *"Hãy phân tích cặn kẽ từng ý, tuyệt đối không viết tóm tắt hời hợt"*. AI sẽ ưu tiên phân tích sâu, dẫn đến dôi dư câu chữ.
2. **Dàn ý quá chi tiết:** Bước tạo dàn ý đang bắt buộc *"Mỗi phần có ÍT NHẤT 3 gạch đầu dòng"*. Với 3-4 ý sâu sắc, AI bung ra thành văn xuôi chắc chắn sẽ vượt mức 400-500 từ.
3. **Bản chất của LLMs:** AI khó hình dung "240 từ" dài bao nhiêu, nhưng lại rất hiểu "tối đa 2 đoạn văn".

---

## Giải pháp đề xuất (Proposed Changes)

### 1. Thay đổi cách truyền ĐỘ DÀI vào Prompt Viết Kịch Bản (`finance.script.part`)
Thay vì chỉ truyền `ĐỘ DÀI PHẦN NÀY: 240 từ`, chúng ta sẽ tính toán và truyền "Định lượng cấu trúc".
*   Quy đổi số từ thành số Đoạn Văn (Paragraphs). Ví dụ: 240 từ ≈ Tối đa 2-3 đoạn văn.
*   **Prompt mới:** 
    `GIỚI HẠN ĐỘ DÀI: Tối đa {perPart} từ. Chỉ được phép viết TỐI ĐA {Math.ceil(perPart / 100)} ĐOẠN VĂN. Tuyệt đối không dài dòng. Dừng lại ngay khi vừa đủ ý.`

### 2. Phân nhánh câu lệnh (Dynamic Prompting) theo Target Số Từ
Sẽ chia làm 2 trạng thái thái độ của AI dựa trên độ dài người dùng yêu cầu:
*   **Nếu `perPart < 300` từ (Kịch bản ngắn/TikTok/Shorts):**
    *   Xóa câu lệnh: *"Phân tích cặn kẽ, sâu sắc..."*
    *   Thêm câu lệnh: *"Viết súc tích, nhịp điệu nhanh, đi thẳng vào trọng tâm. Mỗi ý trong dàn ý chỉ diễn đạt bằng 1-2 câu ngắn gọn. TUYỆT ĐỐI KHÔNG phân tích dông dài."*
*   **Nếu `perPart >= 300` từ (Kịch bản Podcast/Video dài):**
    *   Giữ nguyên câu lệnh phân tích cặn kẽ để nội dung có chiều sâu.

### 3. Sửa đổi Prompt tạo Dàn Ý (`finance.script.outline`)
Giới hạn số lượng gạch đầu dòng dựa trên tổng số từ yêu cầu ban đầu.
*   Kịch bản ngắn (VD: Dưới 1500 từ): Ép AI tạo dàn ý thật gọn, tối đa 1-2 gạch đầu dòng cho mỗi phần.
*   Kịch bản dài (VD: Trên 2000 từ): Cho phép tạo 3-4 gạch đầu dòng chi tiết.

---

## Tạm thời (Hiện tại)
Như thỏa thuận, tôi đã:
- **Tạm ẩn/Vô hiệu hóa** ô nhập số từ trên giao diện (UI) và thêm chú thích *"Tính năng đang phát triển"*.
- Bỏ hẳn option "Theo số phút" để tránh phức tạp hóa.
- Chúng ta sẽ tập trung sang việc thiết lập và kết nối Database (Supabase) trước khi quay lại thực hiện kế hoạch này.
