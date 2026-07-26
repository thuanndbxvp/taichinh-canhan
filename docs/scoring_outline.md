# Phương án chấm điểm Dàn ý (Outline Scoring)

Tính năng chấm điểm dàn ý (Outline Review) khác biệt hoàn toàn với chấm điểm kịch bản. Ở giai đoạn này, nội dung thường được trình bày dưới dạng gạch đầu dòng (bullet points), ý chính, và các từ khóa. Do đó, AI không được phép trừ điểm các lỗi về "văn phong chưa mượt" hay "định dạng liệt kê".

## 1. Mục tiêu cốt lõi
- Thẩm định tính khả thi của ý tưởng tổng thể trước khi tốn thời gian viết toàn bộ kịch bản.
- Đánh giá tính logic, luồng tư duy (flow) của các luận điểm.
- Phát hiện sớm các lỗ hổng trong lập luận hoặc dữ liệu cần bổ sung.

## 2. Tiêu chí đánh giá (Criteria)

Vẫn sử dụng khung 5 tiêu chí để đồng bộ với UI, nhưng định nghĩa chấm điểm thay đổi hoàn toàn:

1. **Cấu trúc (Structure)**
   - Các phần (Mở bài - Thân bài - Kết bài) có được phân chia hợp lý không?
   - *Lưu ý AI:* Chấp nhận hoàn toàn format listicle, gạch đầu dòng. Đánh giá tính logic của trật tự các luận điểm.

2. **Dữ liệu & Logic (Research & Logic)**
   - Dàn ý có vạch ra được các con số hoặc ví dụ thực tế cần có không?
   - Có nguy cơ lập luận bị thiếu thuyết phục nếu khai triển thành kịch bản không?

3. **Góc nhìn (Voice & Perspective)**
   - Góc nhìn tiếp cận vấn đề có sắc sảo, thực tế và phù hợp với định hướng "Chú Que Tài Chính" không?
   - Lựa chọn đề tài có đủ sức hấp dẫn với người xem mục tiêu không?

4. **Chiều sâu (Insight)**
   - Ý tưởng cốt lõi (Core message) có thực sự đọng lại giá trị không?
   - Các luận điểm có đi sâu vào vấn đề hay chỉ hời hợt trên bề mặt?

5. **Tiềm năng thị giác (Cinematic Potential)**
   - Dàn ý có gợi ra các hình ảnh, biểu đồ, hay ẩn dụ thị giác nào dễ thực hiện trên video không?

## 3. Hệ thống phạt điểm (Penalties) KHÔNG ÁP DỤNG
- Không phạt việc liệt kê listicle.
- Không phạt việc câu văn cụt lủn hoặc gạch đầu dòng.
- Không phạt việc thiếu các câu chuyển ý mượt mà.

## 4. Format đầu ra
Giống với Kịch bản (để tái sử dụng UI ScoreModal), nhưng nội dung phân tích (analysis) sẽ nhấn mạnh vào "Tính logic của luồng ý tưởng" thay vì "Cách hành văn".
