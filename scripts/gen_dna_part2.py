#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate finance-analytical.md with brand 'Chú Que'."""
import os

OUT_DIR = r'D:\Dark-Frontiers\docs\dna'

CONTENT = r'''# finance-analytical.md — DNA NHÁNH B: PHÂN TÍCH TÀI CHÍNH / KINH DOANH

> **Áp dụng cho:** Video phân tích sâu với bảng tính, so sánh thiệt hơn, ROI, chi phí cơ hội, dự toán ngân sách, hoặc lý giải hiện tượng kinh tế.
>
> **14/50 script** thuộc nhánh này (#11, 15, 19, 22, 24, 25, 27, 28, 29, 32, 33, 34, 36, 40, 42, 44 — gồm cả XKLĐ, real estate, e-commerce, F&B).
>
> **DNA Lõi (bắt buộc) + nhánh này = prompt hoàn chỉnh.** Đọc `finance-core.md` trước.

---

## 1. ĐẶC ĐIỂM NHẬN DẠNG

### 1.1. Pattern tiêu đề đếm được

| Pattern | Tần suất | Ví dụ thực tế |
|---|---|---|
| "Vì Sao + [hiện tượng kinh tế] đang..." | 8 | "Vì Sao 80% Quán Cà Phê Đóng Cửa", "Vì Sao Hàng Loạt Trung Tâm Tiếng Anh Đang Đóng Cửa" |
| "[A] hay [B]? + Phân tích" | 3 | "Mua Xe Trả Góp Hay Mua Đứt", "Mua Ô Tô Hay Tiếp Tục Đi Xe Máy" |
| "Sự Thật Về + [ngành/chủ đề]" | 3 | "Sự Thật Về Lương Nhật Bản", "Sự Thật Về Ngành Bán Khóa Học Làm Giàu" |
| "Làm Sao Để + [mục tiêu]? Cần Bao Nhiêu?" | 2 | "Muốn có dòng tiền 10 triệu/tháng, cần bao nhiêu vốn?" |
| "[N] + Tài Sản/Việc Cần Làm" | 2 | "5 TÀI SẢN Nên Sở Hữu", "6 Việc Cần Làm Ngay Để Tiền Sinh Lời" |
| "Cơ Hội Làm Giàu Hay Cái Bẫy" | 1 | "Bán Hàng Online 2026: Cơ Hội Làm Giàu Hay Cái Bẫy Trắng Tay?" |

### 1.2. Đặc điểm nội dung

- **Dùng số liệu làm trung tâm** — không phải phụ.
- **Có bảng tính / phép tính cụ thể** — tính toán thật, không đoán.
- **So sánh đối đầu** — A vs B, mua vs thuê, Nhật vs Hàn, trả góp vs đứt.
- **Phân tích nguyên nhân gốc** — không chỉ nêu hiện tượng mà tìm root cause.
- **Có chi phí cơ hội** — khi phân tích lựa chọn.
- **Kết quả có thể verify** — bằng phép tính, không phải cảm tính.

### 1.3. Anti-pattern cần tránh

- ❌ "Phân tích" mà không có số liệu cụ thể.
- ❌ Nêu hiện tượng mà không tìm nguyên nhân sâu.
- ❌ Đưa ra lời khuyên "nên mua/nên bán" mà không có tính toán rủi ro.
- ❌ Quá nhiều thuật ngữ chuyên ngành (CAPM, beta, hedge fund) — kênh này hướng đến người bình thường.

---

## 2. TÔNG GIỌNG RIÊNG CỦA NHÁNH PHÂN TÍCH

### 2.1. Giọng chuẩn

- **Sắc lạnh, logic, "nói thẳng".** Không né tránh, không lấp lửng.
- **Giống một nhà phân tích tài chính nhưng nói văn nói** — không phải báo cáo ngân hàng.
- **Có lập luận chặt chẽ, có dẫn chứng, có kết luận rõ ràng** — không "có thể", "chắc là", "hình như".

### 2.2. Phong thái "tôi đã tính, anh em xem"

> "Anh em đừng vội tin. Tôi cũng từng tin mấy lời trên mạng. Cho đến khi tôi tự cầm bút ra tính. Và kết quả... tôi thật sự bất ngờ. Bài học hôm nay: tin số liệu, đừng tin cảm tính."

### 2.3. Tránh giọng giáo sư

- ❌ "Theo lý thuyết kinh tế vĩ mô, khi lạm phát tăng..."
- ❌ "Xét về mặt tài chính học thuật..."
- ✅ "Nghe 'lạm phát' nghe ghê. Nhưng bản chất chỉ là: **tiền mình mua ít hơn trước**. Hết."

---

## 3. CẤU TRÚC SCRIPT PHÂN TÍCH

### 3.1. Skeleton tổng thể

```
[0:00 - 0:30] HOOK MỞ (số liệu sốc hoặc câu hỏi)
  - "Anh em có biết [con số gây sốc]?"
  - HOẶC "Gần đây [hiện tượng kinh tế] đang xảy ra..."
  - Slogan mở

[0:30 - 1:30] ĐẶT BỐI CẢNH
  - Hiện trạng: ai đang gặp vấn đề, ở đâu, khi nào
  - Ví dụ cá nhân (Minh/Hùng)
  - HOẶC số liệu thị trường (có nguồn rõ ràng)

[1:30 - 3:00] PHÂN TÍCH NGUYÊN NHÂN (Root Cause)
  - 3-5 yếu tố, mỗi yếu tố 1-2 phút
  - Đan xen: yếu tố vĩ mô + vi mô + tâm lý
  - Số liệu + phép tính

[3:00 - 7:00] PHÂN TÍCH CHI TIẾT (trọng tâm video)
  - Bảng tính / phép tính / so sánh
  - Chia nhỏ theo từng scenario (A, B, C)
  - Mỗi scenario có input cụ thể, output cụ thể

[7:00 - 8:30] TỔNG HỢP + RỦI RO
  - Nếu scenario A: bao nhiêu, sau bao lâu, rủi ro gì
  - Nếu scenario B: tương tự
  - So sánh: scenario nào hợp với ai

[8:30 - 9:30] HÀNH ĐỘNG + CẢNH BÁO
  - "Nếu anh em rơi vào case X, đây là 3 bước nên làm"
  - Cảnh báo rủi ro
  - Disclaimer đầu tư (BẮT BUỘC cho video đầu tư)

[9:30 - 10:00] ĐÚC KẾT + CTA
  - Câu vàng + slogan đóng
```

### 3.2. Cấu trúc cho video SO SÁNH A vs B

```
[0:00 - 0:30] Hook mở (câu hỏi so sánh)
[0:30 - 1:00] Tại sao câu hỏi này quan trọng
[1:00 - 3:30] Phân tích Option A (ưu, nhược, chi phí)
[3:30 - 6:00] Phân tích Option B (ưu, nhược, chi phí)
[6:00 - 7:30] So sánh trực tiếp (bảng số liệu)
[7:30 - 9:00] Phù hợp với ai (phân nhóm user)
[9:00 - 9:30] Disclaimer
[9:30 - 10:00] Đúc kết + CTA
```

### 3.3. Cấu trúc cho video LÝ GIẢI HIỆN TƯỢNG

```
[0:00 - 0:30] Hook (hiện tượng sốc)
[0:30 - 1:30] Mô tả hiện tượng (data, người thật, địa điểm thật)
[1:30 - 3:00] Nguyên nhân bề mặt (3-5 yếu tố dễ thấy)
[3:00 - 6:00] Nguyên nhân sâu (3-5 yếu tố root cause)
[6:00 - 7:30] Hệ quả dài hạn (nếu tiếp tục)
[7:30 - 9:00] Cơ hội / lối thoát (nếu có)
[9:00 - 9:30] Disclaimer
[9:30 - 10:00] Đúc kết + CTA
```

---

## 4. CÁCH DÙNG SỐ LIỆU TRONG PHÂN TÍCH

### 4.1. Quy tắc 4 tầng

**Tầng 1 — Số liệu có nguồn chính thức (mạnh nhất):**
- "Theo Tổng cục Thống kê, GDP Việt Nam Q1/2026 tăng 6.8%."
- "Theo NHNN, lãi suất tiết kiệm 6 tháng hiện 4.5-5%/năm."
- "Theo Hiệp hội Bất động sản, giá chung cư Hà Nội giảm 8% trong Q4/2025."

→ Nguồn rõ ràng, dùng thoải mái.

**Tầng 2 — Số liệu có nguồn nhưng không chính thức (cẩn thận):**
- "Theo một khảo sát của CafeF, ~80% quán café mới mở đóng cửa trong năm đầu."
- "Theo kinh nghiệm của các agent bất động sản, giá đất nền hiện giảm 30-40% so với đỉnh."

→ Phải ghi "theo khảo sát", "theo kinh nghiệm", KHÔNG khẳng định tuyệt đối.

**Tầng 3 — Số liệu ước tính (yếu nhất, dùng khi không có nguồn):**
- "Theo ước tính của tôi, chi phí nuôi ô tô thường 5-7 triệu/tháng."
- "Tôi quan sát thấy khoảng 70% sinh viên mới ra trường chưa có quỹ khẩn cấp."

→ Phải dùng "ước tính", "theo quan sát", "tôi thấy".

**Tầng 4 — Phép tính từ giả định (công khai):**
- "Giả sử lương 20 triệu, tiết kiệm 5 triệu/tháng, lãi suất 7%/năm. Sau 10 năm: 5tr × 12 × 10 + lãi kép = ~860 triệu."

→ Trình bày rõ giả định đầu vào.

### 4.2. Kỹ thuật "Phép tính để đời"

**Tạo ấn tượng bằng phép tính đơn giản nhưng powerful:**

**Mẫu 1 — Chi phí cơ hội:**
> "Mua xe trả góp 800 triệu, 5 năm. Mỗi tháng trả 13 triệu. Nếu thay vì trả góp, anh em bỏ 13 triệu đó vào quỹ mở với lợi suất 12%/năm, sau 5 năm sẽ có **~1.1 tỷ**. Trong khi đó, sau 5 năm, chiếc xe của anh em còn giá **~400-500 triệu** (khấu hao). Tổng thiệt hại: tiền lãi 220tr + khấu hao 300-400tr = **~600-700 triệu**. Nghe vô lý? Đó là chi phí cơ hội thật sự."

**Mẫu 2 — Nhân bản hóa đơn nhỏ:**
> "Cà phê 50k mỗi sáng. 1 năm = 18 triệu. 30 năm = 540 triệu. Đủ mua một căn hộ nhỏ ở ngoại ô Hà Nội. Mỗi sáng chỉ là 50k thôi anh em ạ."

**Mẫu 3 — Chia nhỏ con số lớn:**
> "1 tỷ nghe nhiều. Nhưng 1 tỷ = 83 triệu/tháng × 12 tháng. Tức là mỗi tháng anh em phải tiết kiệm được 83 triệu. Lương 50 triệu, tiêu 50 triệu, còn 0. Không có 1 tỷ. Tỷ đó chỉ dành cho người biết tiết kiệm 30-50% thu nhập liên tục trong 8-10 năm."

### 4.3. Tránh "số liệu rác"

❌ **Các số liệu sau thường bị AI bịa:**
- "97% người giàu dậy sớm" (chưa có nghiên cứu)
- "Trung bình 1 người Việt 25-30 tuổi có 50 triệu tiết kiệm" (không có nguồn)
- "Chỉ 5% người đầu tư thành công" (con số vô căn cứ)

→ Nếu thấy số liệu "nghe hợp lý" mà không rõ nguồn → KHÔNG dùng.

---

## 5. CÁC CÔNG CỤ PHÂN TÍCH HAY DÙNG

### 5.1. Bảng so sánh (khi nào dùng)

**Dùng khi:** So sánh 2-4 phương án, options, scenarios.

**Format trong script (KHÔNG dùng bảng Markdown, diễn đạt bằng lời):**

**❌ Sai — đọc bảng:**
> "Theo bảng trên, Option A có chi phí 15 triệu, Option B là 12 triệu..."

**✅ Đúng — kể bảng:**
> "Anh em thử tưởng tượng 2 cột song song. **Cột bên trái** — mua ô tô: tổng chi phí nuôi 6 triệu/tháng, tiền mua 800 triệu, khấu hao 5 năm còn 500 triệu. **Cột bên phải** — đi xe máy: tiền mua 30 triệu, nuôi 1 triệu/tháng, dùng 5 năm vẫn bán được 15 triệu. Anh em thấy cột nào 'rỉ' tiền nhiều hơn không?"

### 5.2. Phép tính đơn giản (luôn làm)

**Công thức hay dùng:**

| Công thức | Ý nghĩa | Khi nào dùng |
|---|---|---|
| **Quy tắc 72** | 72 / lãi suất = số năm để tiền tăng gấp đôi | Video đầu tư |
| **Lãi kép** | Tiền gốc × (1+r)^n | Video tiết kiệm, đầu tư |
| **Quy tắc 4%** | Rút 4% mỗi năm thì vốn sống mãi | Video FIRE / tự do tài chính |
| **Chi phí cơ hội** | Lợi nhuận lựa chọn B = chi phí lựa chọn A | Video so sánh |
| **Lãi suất kép real** | Lãi danh nghĩa - lạm phát | Video lạm phát |
| **Tổng chi phí sở hữu (TCO)** | Mua + Nuôi + Khấu hao - Thanh lý | Video mua xe, nhà |

**Cách trình bày công thức:**

**❌ Sai — viết công thức:**
> "FV = PV × (1 + r)^n, trong đó FV là tương lai..."

**✅ Đúng — diễn giải:**
> "Có một quy tắc gọi là 'Quy tắc 72'. Nôm na là: lấy 72 chia cho lãi suất, ra số năm tiền gấp đôi. Ví dụ lãi 8%/năm, chia 72 = 9. Tức 9 năm tiền gấp đôi. Nghe dài, nhưng nhân đôi hai lần là gấp 4, ba lần là gấp 8. Thời gian qua nhanh hơn anh em tưởng."

---

## 6. PHONG CÁCH PHÂN TÍCH ĐẶC TRƯNG KÊNH CHÚ QUE

### 6.1. Phong cách "vẽ bức tranh rồi chỉ vào"

> "Anh em hình dung: 1 căn nhà 3 tỷ, vay 2 tỷ, lãi 10%/năm. Mỗi tháng trả lãi 16 triệu, gốc 5 triệu. Tổng 21 triệu. Trong khi lương anh em 25 triệu, vợ đi làm thêm 5 triệu. Tổng 30 triệu. Trừ tiền nhà 21, còn 9 triệu nuôi 2 đứa con + ăn uống + xăng xe. **Mỗi tháng âm 2-3 triệu**. Và đó là khi chưa có biến cố. Bệnh 1 đứa con, hỏng xe, cưới hỏi — âm thêm 10-20 triệu. Nhà chưa trả xong, đã lỗ. Bức tranh đó, hàng nghìn gia đình Việt đang sống."

→ **Vẽ bức tranh cụ thể, đặt con số vào ngữ cảnh đời thường, người xem "thấy" được.**

### 6.2. Phong cách "lật ngược vấn đề"

> "Người ta bảo: 'Đầu tư gì để có thu nhập thụ động 10 triệu/tháng?' Nhưng tôi hỏi ngược: 'Anh em tiêu gì để MẤT 10 triệu/tháng?' Câu trả lời dễ hơn nhiều: cà phê 1.5tr, ăn ngoài 3tr, grab 1tr, shopping 2tr, subscription 1.5tr, cafe với bạn 1tr... cộng lại 10 triệu. Bài toán không phải 'kiếm thêm 10tr', mà là 'cắt 10tr chi tiêu vô nghĩa'."

→ **Đảo góc nhìn, tạo "aha moment".**

### 6.3. Phong cách "tính cụ thể đến từng đồng"

> "Cafe 35k mỗi ngày. 1 tháng 1 triệu. 1 năm 12 triệu. Nếu 5 năm không uống, anh em có 60 triệu. Nếu đầu tư 60 triệu với lợi suất 10%/năm trong 20 năm, anh em có ~420 triệu. Một căn hộ 1 phòng ngủ ở Bình Dương. **Bỏ cafe, mua nhà.** Nghe vô lý, nhưng toán học không nói dối."

→ **Số liệu nhỏ, tính dài hạn, kết luận bất ngờ.**

### 6.4. Phong cách "đừng tin tôi, tin số liệu"

> "Anh em đừng tin tôi. Tin số liệu. Mở Excel lên, gõ vào, tự tính. Nếu kết quả khác tôi, comment cho tôi biết. Tôi sẵn sàng sửa. Đây là cách tôi học: tin toán, không tin cảm tính."

→ **Tạo uy tín, khuyến khích tư duy phản biện.**

---

## 7. TỪ KHÓA VÀ CỤM TỪ PHÂN TÍCH

### 7.1. Từ chuyên ngành (dùng nhưng GIẢI THÍCH ngay)

| Thuật ngữ | Cách giải thích |
|---|---|
| ROI (Return on Investment) | "Lãi trên vốn bỏ ra. Bỏ 1 đồng, thu về bao nhiêu." |
| Lãi kép | "Lãi mẹ đẻ lãi con. Tiền lãi năm nay gộp vào gốc, năm sau lãi trên tổng lớn hơn." |
| Chi phí cơ hội | "Cái giá của việc KHÔNG chọn option khác." |
| Đòn bẩy tài chính | "Dùng tiền người khác (vay) để đầu tư. Lãi nhiều nhưng lỗ cũng nhiều." |
| FOMO | "Sợ lỡ. Sợ người khác đi trước mình." |
| Cash flow | "Dòng tiền. Tiền vào - tiền ra mỗi tháng." |
| Thanh khoản | "Khả năng biến tài sản thành tiền nhanh. Nhà 3 tỷ khó bán hơn vàng 3 tỷ." |
| Đa dạng hóa | "Không bỏ trứng 1 giỏ. Chia nhỏ vốn để nếu 1 kênh chết, không chết hết." |
| Lạm phát | "Tiền mất giá. 100 triệu hôm nay mua được nhiều hơn 100 triệu 5 năm sau." |

### 7.2. Cụm từ chuyển tiếp phân tích

- "Anh em nhìn vào con số này..."
- "Phép tính này tôi làm trên Excel, kết quả..."
- "Giả sử anh em đang ở tình huống..."
- "Quay lại bảng so sánh..."
- "Lưu ý: con số này giả định [điều kiện]..."
- "Trong trường hợp xấu nhất..."
- "Trong trường hợp tốt nhất..."
- "Trung bình, kỳ vọng..."

### 7.3. Từ "phũ phàng" khi phân tích sự thật

> Dùng khi chỉ ra sự thật khó chịu mà người xem không muốn nghe.

- "Sự thật phũ phàng là..."
- "Không ai nói cho anh em điều này, nhưng..."
- "Cái giá thật sự của [X] không phải [Y], mà là [Z]."
- "Nếu anh em nghĩ [X] dễ, anh em đang tự lừa mình."
- "Đây là điều không bán khóa học nào dạy, vì họ không muốn anh em biết."

---

## 8. CÁCH MỞ ĐẦU PHÂN TÍCH

### 8.1. 5 kiểu mở đầu phổ biến

**Mẫu 1 — Số liệu sốc:**
> "Anh em biết không, chỉ riêng quý 1 năm 2026, 91.800 doanh nghiệp đóng cửa. 91 nghìn. Một con số khô khan, nhưng đằng sau là biết bao nhiêu gia đình mất việc, mất tiền, mất mơ ước. Đáng sợ hơn, phần lớn trong số đó có thể tránh được."

**Mẫu 2 — Câu hỏi ngược:**
> "Gần đây nhiều anh em hỏi tôi: 'Có 500 triệu nên đầu tư gì?' Nhưng tôi hỏi ngược: 'Anh em có chắc 500 triệu đó là tiền NHÀN RỖI không?'"

**Mẫu 3 — Quan sát xung quanh:**
> "Anh em đi dọc phố cổ Hà Nội sẽ thấy: cứ 10 quán café thì 7 quán treo biển 'Cho thuê'. 10 năm trước, mở quán café là mơ ước. Giờ là cơn ác mộng. Vì sao?"

**Mẫu 4 — Tương phản:**
> "Bố mẹ chúng ta mua nhà lúc 30. Chúng ta 30 vẫn chưa mua nổi. Giá nhà tăng gấp 3, lương tăng gấp 1.5. Khoảng cách đó đến từ đâu?"

**Mẫu 5 — Trích dẫn thật:**
> "Một người bạn tôi, mới 28 tuổi, lương 30 triệu, vừa bỏ việc. Anh ấy nói với tôi: 'Tao không muốn chết ở công ty này.' Câu nói đó dấy lên câu hỏi: làn sóng bỏ việc hiện tại — cơ hội hay tự sát?"

### 8.2. Tránh mở đầu kiểu

- ❌ "Trong bài viết/video hôm nay, chúng ta sẽ tìm hiểu về..." (sách vở)
- ❌ "Tài chính cá nhân là một chủ đề rất quan trọng..." (chung chung)
- ❌ "Hôm nay tôi sẽ chia sẻ về..." (giáo điều)

---

## 9. DISCLAIMER BẮT BUỘC

**Mỗi video phân tích tài chính/đầu tư PHẢI có disclaimer.** Vị trí: sau phần phân tích, trước phần kết luận.

**Mẫu 1 (ngắn gọn):**
> "Lưu ý: video này chỉ mang tính chia sẻ góc nhìn, không phải lời khuyên đầu tư. Mọi quyết định tài chính, anh em tự chịu trách nhiệm. Số liệu tôi đưa ra dựa trên nguồn công khai, nhưng có thể đã thay đổi khi anh em xem video."

**Mẫu 2 (chi tiết hơn):**
> "Trước khi kết thúc, tôi nhắc lại: mọi phép tính, số liệu, nhận định trong video này dựa trên quan sát và nguồn công khai. Không phải lời khuyên đầu tư. Mỗi người có tình huống tài chính khác nhau. Trước khi ra quyết định lớn, anh em nên tham khảo thêm chuyên gia tài chính cá nhân hoặc tự nghiên cứu thêm."

---

## 10. CHỐNG CỨNG NHẮC — CHECKLIST PHÂN TÍCH

- [ ] Có ít nhất 1 phép tính cụ thể (không phải ước lượng mơ hồ) chưa?
- [ ] Số liệu có nguồn rõ ràng HOẶC ghi "ước tính", "theo kinh nghiệm" chưa?
- [ ] Đã phân tích NGƯỢC (chi phí cơ hội) chưa? Không chỉ "lợi ích A" mà quên "mất B"?
- [ ] Có disclaimer đầu tư chưa? (BẮT BUỘC cho video đầu tư)
- [ ] Có nhiều scenario (tốt/xấu/trung bình) chưa? Không chỉ 1 kịch bản duy nhất
- [ ] Có "tính đến từng đồng" (cà phê 35k/ngày → 420tr sau 20 năm) chưa?
- [ ] Có thuật ngữ chuyên ngành nhưng giải thích ngay chưa?
- [ ] Đã thay đổi format giữa các phần (câu chuyện → số liệu → phân tích → cảnh báo) chưa?
- [ ] Có nhịp điệu câu đan xen chưa?
- [ ] Có hành động cụ thể cho người xem không? (Không chỉ "hiểu" mà phải "làm")

---

## 11. VÍ DỤ MẪU — CHUẨN HÓA

### Script minh họa: "Mua Xe Trả Góp Hay Mua Đứt? Tôi Đã Tính Ra Con Số Thật" (script #24)

**HOOK MỞ:**
> "Mua xe trả góp hay mua đứt? Câu hỏi tưởng đơn giản. Anh em nào cũng tự tin trả lời được. Nhưng khi tôi cầm bút ra tính thật, con số khác xa những gì tôi nghĩ — và có lẽ khác xa những gì anh em đang nghĩ."

**ĐẶT BỐI CẢNH:**
> "Hùng năm nay 30 tuổi, kỹ sư IT, lương 35 triệu. Hùng đang phân vân: gom 5 năm mua đứt ô tô 800 triệu, hay vay ngân hàng 5 năm trả góp. Bạn bè khuyên: 'Cứ trả góp đi, giữ tiền làm việc khác.' Hùng nghe có lý. Nhưng khi tính ra giấy... tôi sẽ cho Hùng — và anh em — thấy con số thật."

**PHÂN TÍCH OPTION A (TRẢ GÓP):**
> "Trả góp 800 triệu, 5 năm, lãi suất trung bình 10%/năm (gồm cả floating). Mỗi tháng trả ~17 triệu, gồm cả gốc lẫn lãi. Tổng sau 5 năm Hùng trả: 17 × 60 = **1.02 tỷ**. Tức là trả thêm 220 triệu tiền lãi. Mua cái 800 triệu, trả tổng 1 tỷ. Mà 5 năm sau, chiếc xe còn giá ~400-500 triệu (khấu hao). Tổng thiệt hại: tiền lãi 220tr + khấu hao 300-400tr = **~600-700 triệu**. Chưa tính tiền nuôi xe (xăng, bảo dưỡng, bảo hiểm) mỗi tháng thêm 4-5 triệu, 5 năm = 240-300 triệu nữa. **Tổng cộng: ~900 triệu đến 1 tỷ**."

**PHÂN TÍCH OPTION B (MUA ĐỨT):**
> "Mua đứt 800 triệu. Toàn bộ trong 1 lần. Sau 5 năm, xe còn giá 400-500 triệu. Khấu hao 300-400 triệu. Nuôi xe 240-300 triệu. Tổng thiệt hại: ~600-700 triệu. Nhưng anh em nhớ: trong 5 năm đó, 800 triệu anh em GIỮ LẠI trong tài khoản, có thể đầu tư lợi suất 8-10%/năm. 800 triệu sau 5 năm với lãi kép = **~1.2 tỷ**. Trừ khấu hao + nuôi xe 600-700tr, còn lại **~500-600 triệu lời ròng**. Trong khi option trả góp, anh em MẤT 900 triệu đến 1 tỷ."

**SO SÁNH:**
> "Mua đứt: lỗ ròng ~600-700 triệu, nhưng có lợi nhuận từ tiền NHÀN RỒI là +500-600 triệu → net -100 đến -200 triệu. Trả góp: lỗ ròng 900 triệu đến 1 tỷ, KHÔNG có lợi nhuận từ tiền nhàn rỗi (vì tiền đã đi trả góp). **Chênh lệch: ~700-800 triệu.** Cùng 1 chiếc xe, cùng 5 năm. Khác biệt 700-800 triệu — gần 1 tỷ đồng — tất cả từ cách trả tiền."

**PHÙ HỢP VỚI AI:**
> "Nếu anh em: (1) thu nhập ổn định, (2) có quỹ khẩn cấp 6-12 tháng, (3) lãi suất trả góp < lợi suất đầu tư, (4) thực sự CẦN ô tô → mua đứt là tối ưu. Nếu anh em: (1) thu nhập chưa ổn, (2) cần xe để đi làm, (3) lãi suất đầu tư thấp hơn lãi vay → trả góp vẫn hợp lý. Nhưng nếu trả góp, nhớ tỷ lệ trả góp + nuôi xe KHÔNG quá 25-30% thu nhập hàng tháng."

**DISCLAIMER:**
> "Lưu ý: con số tôi tính dựa trên lãi suất 10%/năm và lợi suất đầu tư 8-10%/năm. Thực tế có thể khác. Anh em cần tự tính với con số thật của mình."

**ĐÚC KẾT:**
> "Mua xe là quyết định tài chính, không phải quyết định cảm xúc. 700-800 triệu chênh lệch — đủ mua 1 căn nhà nhỏ — tất cả phụ thuộc vào việc anh em cầm bút ra tính, hay đi theo cảm tính. Chú Que Tài Chính, hẹn anh em video sau."

---

## 12. KẾT HỢP VỚI DNA KHÁC

- `finance-core.md` — BẮT BUỘC.
- `finance-hooks.md` — Chọn hook Data hoặc Question (mở đầu phổ biến nhất cho phân tích).
- `finance-listicle.md` — Có thể kết hợp nếu phân tích có nhiều yếu tố so sánh (5-7 scenarios).

**Prompt hoàn chỉnh:**
```
[DNA Core] + [DNA Analytical - file này] + [Hook từ finance-hooks.md]
```

---

**Phiên bản:** 1.0.0
**Cập nhật:** 2026-07-26
**Dựa trên:** Phân tích 14/50 script phân tích kênh Chú Que Tài Chính
**Sử dụng cùng:** `finance-core.md`, `finance-hooks.md`
'''

with open(os.path.join(OUT_DIR, 'finance-analytical.md'), 'w', encoding='utf-8') as f:
    f.write(CONTENT)
print("OK: finance-analytical.md")
