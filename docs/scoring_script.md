# Phương án chấm điểm Kịch bản (Script Scoring)

Tính năng chấm điểm kịch bản (Script Doctor) được thiết kế để đóng vai trò như một Biên tập viên cấp cao (Senior Editor). Thay vì chỉ kiểm tra chính tả hay ngữ pháp, hệ thống phân tích sâu vào tính thuyết phục, cấu trúc nhịp điệu và mức độ tuân thủ thương hiệu (Brand DNA).

## 1. Mục tiêu cốt lõi
- Đảm bảo kịch bản thu hút người xem từ giây đầu tiên (Hook mạnh).
- Duy trì tỷ lệ giữ chân (Retention) thông qua nhịp điệu (Pacing) và cấu trúc gãy gọn.
- Kiểm tra tính xác thực và logic của các luận điểm tài chính.
- Đảm bảo tính nhất quán với DNA của nhân vật "Chú Que Tài Chính".

## 2. Tiêu chí đánh giá (Criteria)

Hệ thống chấm điểm trên thang điểm 10 cho 5 tiêu chí độc lập:

1. **Cấu trúc & Nhịp điệu (Structure & Pacing)**
   - Kịch bản có mở đầu (hook), thân bài và kết luận rõ ràng không?
   - Nhịp điệu có bị chùng xuống ở giữa video không?
   - Các đoạn chuyển ý (transition) có mượt mà không?

2. **Dữ liệu & Xác thực (Research & Logic)**
   - Các con số, thống kê đưa ra có thực tế không?
   - Có vi phạm nguyên tắc "cam kết làm giàu" hoặc hứa hẹn lợi nhuận ảo không?
   - Lập luận có chặt chẽ và thuyết phục người xem không?

3. **Giọng văn (Voice & Tone)**
   - Có giữ được phong cách "Chú Que Tài Chính" (thực tế, hơi phũ, sắc sảo) không?
   - Ngôn từ có phù hợp với tệp khán giả mục tiêu không?

4. **Chiều sâu & Giá trị (Insight & Value)**
   - Kịch bản có đưa ra góc nhìn mới mẻ nào không, hay chỉ lặp lại kiến thức cơ bản?
   - Khán giả có học được điều gì thực tế sau khi xem không?

5. **Tính điện ảnh (Cinematic)**
   - Kịch bản có dễ dàng hình ảnh hoá (visualize) không?
   - Lời thoại có tự nhiên khi đọc thành tiếng không?

## 3. Hệ thống phạt điểm (Penalties)
Hệ thống sẽ tự động trừ điểm nghiêm khắc nếu kịch bản vi phạm các quy tắc cốt lõi:
- Dùng văn phong ChatGPT (vd: "Tóm lại", "Trong video này tôi sẽ chia sẻ..."): -1 đến -2 điểm.
- Hứa hẹn lợi nhuận ảo tưởng, đa cấp: -3 điểm.
- Hook yếu, kể lể rườm rà ở 10 giây đầu: -2 điểm.
- Thiếu Call to Action (CTA) ở cuối: -1 điểm.

## 4. Format đầu ra
AI sẽ trả về một báo cáo JSON chi tiết gồm:
- Điểm chi tiết 5 tiêu chí kèm theo phân tích và dẫn chứng cụ thể.
- Danh sách các lỗi bị trừ điểm (nếu có).
- Ưu điểm (Pros) và Nhược điểm (Cons) chính.
- Lời nhận xét tổng quan (Overall Review) mang tính xây dựng.
- Thời lượng ước tính khi thu âm.
