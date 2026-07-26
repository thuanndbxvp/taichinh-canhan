#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate 5 DNA branch files with brand 'Chú Que' using Python UTF-8."""
import os

OUT_DIR = r'D:\Dark-Frontiers\docs\dna'

# ============================================
# FILE 1: finance-listicle.md
# ============================================
LISTICLE = r'''# finance-listicle.md — DNA NHÁNH A: LISTICLE ACTIONABLE (Top 5, Top 10, ...)

> **Áp dụng cho:** Video có cấu trúc "N điều/nghề/cách/nguyên tắc/thói quen". Đây là nhánh phổ biến nhất kênh Chú Que Tài Chính.
>
> **23/50 script** thuộc nhánh này (#1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 17, 18, 26, 27, 49 + một số ngụy trang).
>
> **DNA Lõi (bắt buộc) + nhánh này = prompt hoàn chỉnh.** Đọc `finance-core.md` trước.

---

## 1. ĐẶC ĐIỂM NHẬN DẠNG

### 1.1. Pattern tiêu đề đếm được

| Pattern | Tần suất | Ví dụ thực tế |
|---|---|---|
| `N + Nghề/Cách/Điều/Thứ/Thói quen/Nguyên tắc` | **16 script** | "10 Nghề Nông Thôn...", "7 Cách Dùng AI...", "5 Khoản CHI TIÊU..." |
| `N + Tài Sản/Điều Nên...` | 3 | "5 TÀI SẢN Nên Sở Hữu", "6 Việc Cần Làm Ngay" |
| `TOP + N + ...` | 2 | "Top 5..." |

### 1.2. Đặc điểm nội dung

- **Đi thẳng vào vấn đề** — không dạo đầu dài dòng.
- **Mỗi mục = 1 thứ cụ thể** có thể đếm được, dùng được, áp dụng được.
- **Nhịp độ nhanh** — không phân tích quá sâu mỗi mục, chuyển ý gọn.
- **Có tính ứng dụng** — mỗi mục phải HƯỚNG DẪN hành động cụ thể, không chỉ lý thuyết.
- **Có trật tự** — sắp xếp theo tác động, độ quan trọng, hoặc dễ-làm-trước.

### 1.3. Anti-pattern cần tránh

- ❌ List mà không có hành động: "5 thói quen của người giàu" → chỉ liệt kê, không hướng dẫn cách làm.
- ❌ List quá nhiều (15+ mục) → loãng, người xem không nhớ gì.
- ❌ List mục nào cũng giống nhau → không phân biệt được tầm quan trọng.

---

## 2. CẤU TRÚC SCRIPT RIÊNG CHO LISTICLE

### 2.1. Skeleton tổng thể

```
[0:00 - 0:30] HOOK MỞ
  - Hook kiểu "Anh em biết không, chỉ cần N thứ này..."
  - HOẶC "Hôm nay tôi chia sẻ N [nghề/cách/điều]..."
  - Slogan mở

[0:30 - 1:30] VÌ SAO ANH EM CẦN ĐỌC/XEM
  - Vấn đề thực tế (Minh, Hùng, hoặc số liệu)
  - Hứa hẹn "sau video này anh em sẽ biết..."

[1:30 - 8:00] N MỤC (phần chính)
  - Mỗi mục: 1-1.5 phút
  - Pattern cho mỗi mục (xem 2.2)

[8:00 - 9:30] TỔNG HỢP + ƯU TIÊN
  - Nếu chỉ làm được 1-2 thứ → tôi khuyên chọn cái nào
  - "Cái nào quan trọng nhất" → nhấn mạnh

[9:30 - 10:00] ĐÚC KẾT + CTA
  - Câu vàng + slogan đóng
```

### 2.2. Pattern cho MỖI MỤC trong list (CỰC KỲ QUAN TRỌNG)

**Mỗi mục PHẢI có đủ 4 phần sau:**

```
[1. TÊN MỤC — NGẮN GỌN, GỢI HÌNH]
  Câu mở dẫn dắt (1-2 câu văn nói, giải thích mục này là gì)

[2. VÍ DỤ THỰC TẾ]
  Câu chuyện Minh/Hùng HOẶC số liệu
  → Minh họa cụ thể, đời thường

[3. CÁCH LÀM / HÀNH ĐỘNG]
  Hướng dẫn cụ thể bước 1, bước 2, bước 3
  → Có thể làm NGAY hôm nay

[4. CẢNH BÁO HOẶC LƯU Ý]
  Nếu có rủi ro → nói rõ
  → 1-2 câu ngắn
```

**Ví dụ thực tế — Mục 3 trong script "10 Thứ Đáng Mua Nhất 2026":**

> **Mục 3: Khóa học AI thực chiến**
>
> [Dẫn dắt] Hùng năm ngoái bỏ 4 triệu mua khóa học AI, nhưng học xong vứt xó. Còn Lan cũng bỏ 4 triệu, nhưng cuối ngày đã làm được 1 con chatbot bán hàng cho shop của Lan. Một năm sau, Lan kiếm thêm 8 triệu/tháng. Hùng vẫn ở điểm xuất phát.
>
> [Ví dụ] Tôi thấy nhiều người rơi vào trường hợp của Hùng hơn của Lan. Vì sao? Vì chọn khóa học theo PR, không theo nhu cầu.
>
> [Hành động] Trước khi mua bất kỳ khóa học nào, anh em tự hỏi 3 câu: (1) Khóa học này giải quyết vấn đề gì cho mình? (2) Mình có thực sự sẽ áp dụng không? (3) Trong 30 ngày tới, mình sẽ làm gì cụ thể? Nếu không trả lời được, đừng mua.
>
> [Lưu ý] Khóa học AI thực chiến = dạy cách dùng AI giải quyết vấn đề thực, không phải chỉ lý thuyết "AI là gì". Tránh khóa học dạy không có demo.

### 2.3. Kỹ thuật chuyển tiếp giữa các mục

**Mở đầu mỗi mục phải có:**
- Câu dẫn dắt ngắn (1-2 câu, không lặp lại mục trước)
- Câu chuyện hoặc ví dụ cụ thể
- (Tùy chọn) "Đây là mục thứ [N], và tôi nghĩ nó quan trọng không kém gì mục đầu tiên."

**Các câu chuyển tiếp hay dùng:**
- "Tiếp theo, cái này tôi nghĩ nhiều anh em đang làm sai..."
- "Đến mục thứ [N] rồi. Mục này tôi tâm đắc nhất."
- "Quay lại câu chuyện đời thường một chút..."
- "Anh em đang nghĩ: 'Cái này dễ quá, ai cũng biết'. Nhưng không, đa số đều không làm."

**Cấm chuyển tiếp kiểu:**
- "Tiếp theo là mục 2..." (khô khan)
- "Mục tiếp theo..." (lặp từ)
- "Bây giờ chúng ta đến phần..." (giáo điều)

---

## 3. NHỊP ĐIỆU RIÊNG CHO LISTICLE

### 3.1. Số mục khuyến nghị

| Số mục | Phù hợp | Ghi chú |
|---|---|---|
| **5** | Video 5-7 phút, ngắn gọn | Khi mỗi mục cần phân tích sâu |
| **7** | Video 8-10 phút, cân bằng | "Sweet spot" cho kênh |
| **10** | Video 10-13 phút, listicle kinh điển | Mỗi mục ngắn, đi nhanh |
| **15+** | Tránh — loãng, người xem mất tập trung | |

### 3.2. Phân bổ thời lượng

- **Mục quan trọng nhất:** 1.5-2 phút (thường là mục 1, 2, hoặc mục chốt)
- **Mục thường:** 1-1.5 phút
- **Mục bổ sung:** 30-60 giây

### 3.3. Thứ tự sắp xếp mục

**3 kiểu sắp xếp phổ biến:**

**Kiểu 1 — Quan trọng trước (khuyến nghị cho kênh Chú Que):**
- Mục 1: Thứ tác động lớn nhất, dễ làm nhất
- Mục 2-N: Tăng dần độ khó hoặc độ ưu tiên
- Mục cuối: "Viên ngọc ẩn" — ít người để ý nhưng giá trị cao

**Kiểu 2 — Dễ trước → Khó sau:**
- Phù hợp người mới, video "first step"
- Mục 1: Ai cũng làm được
- Mục cuối: Cần kỷ luật cao

**Kiểu 3 — Sốc trước → Logic sau:**
- Mục 1: Đập tan lầm tưởng (dùng Myth-busting narrator)
- Mục 2-N: Phân tích và giải pháp

---

## 4. XƯNG HÔ & CÁCH MỞ ĐẦU MỤC

### 4.1. Mở đầu MỖI mục (template)

**Template 1 — Kể chuyện:**
> "**[Tên mục]**. Có một cô gái tên Linh, 26 tuổi, đang làm marketing lương 12 triệu. Linh mua..."

**Template 2 — Số liệu:**
> "**[Tên mục]**. Nghe con số này: 80% người trẻ Việt không có quỹ khẩn cấp. Tức là cứ 10 người thì 8 người..."

**Template 3 — Đặt câu hỏi:**
> "**[Tên mục]**. Anh em đã bao giờ tự hỏi vì sao tiền cứ 'bốc hơi' mỗi tháng không?"

**Template 4 — Thừa nhận sai lầm:**
> "**[Tên mục]**. Tôi cũng từng sai cái này. Hồi mới đi làm, tôi tưởng..."

### 4.2. Cấm mở đầu mục kiểu

- ❌ "Mục tiếp theo: [Tên]" — lặp từ, khô khan
- ❌ "Tiếp theo là..." — đã cấm ở Core
- ❌ "Bây giờ chúng ta sẽ tìm hiểu về..." — sách giáo khoa
- ❌ "Một điều quan trọng nữa là..." — generic

---

## 5. CÂU CHUYỆN CÁ NHÂN — DÙNG KHI NÀO?

### 5.1. Trong Listicle, câu chuyện cá nhân KHÔNG bắt buộc cho mỗi mục

**Quy tắc:**
- **Mỗi mục:** Có thể dùng 1-2 câu chuyện NGẮN (30-60 giây) hoặc 1 số liệu cụ thể.
- **Mỗi video:** NÊN có 1-2 câu chuyện dài hơn (1-2 phút) ở mục quan trọng nhất.

### 5.2. Pattern nhân vật cho Listicle

Dùng đa dạng nhân vật để người xem thấy relatable:
- **Minh (30, lương 18tr, mua xe trả góp)** — đại diện tầng lớp lao động
- **Lan (26, marketing, freelance)** — đại diện gen Z
- **Anh Bảy (40, chủ quán café)** — đại diện F0 kinh doanh
- **Hùng (35, kỹ sư IT, lương 40tr)** — đại diện tầng lớp kỹ thuật
- **Chị Hoa (45, single mom)** — đại diện nhóm đặc biệt
- **Ông Sáu (60, về hưu)** — đại diện thế hệ trước

→ Xoay vòng nhân vật, không lặp lại quá nhiều trong cùng video.

---

## 6. CẤU TRÚC CÂU TRONG MỖI MỤC

### 6.1. Quy tắc chia nhỏ (mỗi mục ~30-40% câu ngắn)

**Trong 1 đoạn văn ~80-100 chữ, nên có:**
- 2-3 câu ngắn (3-8 chữ) — chốt, nhấn mạnh
- 2-3 câu trung bình (15-25 chữ) — dẫn dắt
- 1-2 câu dài (30-50 chữ) — phân tích

**Ví dụ đúng văn phong:**

> **[Mục 4: Tự động hóa tài chính]**
>
> Hùng quen tiêu tiền mỗi tối. Xem story thấy quán mới, đặt đồ ăn. Mỗi tháng âm 2-3 triệu. Không phải Hùng không kiếm được tiền. Hùng lương 22 triệu. Nhưng tiền "rỉ" qua mỗi tối. Cho đến khi Hùng làm một việc: **tự động chuyển 5 triệu vào tài khoản tiết kiệm ngay khi lương về**. Không nghĩ, không cân nhắc. Bot nó chuyển. Mình chỉ sống với 17 triệu còn lại. Và đời sống... vừa đủ. Sau 1 năm, Hùng có 60 triệu. Anh em nghe có vẻ ít. Nhưng so với 0 đồng như trước, 60 triệu là khác biệt giữa "có lựa chọn" và "không có lựa chọn nào".

→ 4 câu ngắn (15-20% từ), 4 câu trung bình (40% từ), 2 câu dài (40% từ). Nhịp đa dạng.

### 6.2. Câu chốt mỗi mục (MUST HAVE)

**Mỗi mục cần 1 câu chốt memorable.** Dùng để recap hoặc dẫn sang mục sau.

**Mẫu:**
- "Mấu chốt là: [1 câu tinh hoa của mục này]."
- "Tôi tóm lại: [1 câu ngắn gọn]."
- "Anh em nhớ cụm từ này nhé: [1 câu gợi nhớ]."

**Ví dụ:**
- "Mấu chốt là: tiền tiết kiệm đầu tiên chưa bao giờ nhỏ, chỉ là anh em chưa quyết tâm."
- "Anh em nhớ cụm từ này nhé: **trả cho mình trước, trả cho người khác sau**."

---

## 7. PHONG CÁCH HÀNH ĐỘNG (Actionable Style)

### 7.1. Khác biệt với video lý thuyết

| Listicle Actionable | Video Lý thuyết |
|---|---|
| "Hãy làm X ngay hôm nay" | "X là gì, vì sao quan trọng" |
| Có số liệu cụ thể, có bước rõ ràng | Phân tích sâu, khái niệm trừu tượng |
| Người xem biết phải làm gì sau video | Người xem hiểu vấn đề nhưng chưa biết làm gì |
| **Verbs hành động:** "mở", "tải", "chuyển", "ghi", "đặt" | **Verbs mô tả:** "là", "có", "trở thành" |

### 7.2. Template hành động cụ thể

**Mỗi mục nên có 1 trong các pattern sau:**

**Pattern A — Quy trình 3 bước:**
> "Anh em làm theo 3 bước này:
> 1. **[Bước 1]** — mất khoảng 15 phút.
> 2. **[Bước 2]** — tôi thường làm vào Chủ nhật.
> 3. **[Bước 3]** — tự động, không cần làm lại."

**Pattern B — Quy tắc ngón tay cái:**
> "Nhớ cụm từ này: **Nếu mất hơn 30 giây để quyết định, đừng mua.** Áp dụng là xong."

**Pattern C — Check-list inline:**
> "Trước khi kết thúc video, anh em tự kiểm: mình đã có [A] chưa? [B] chưa? [C] chưa? Thiếu cái nào, note lại, cuối tuần làm."

**Pattern D — Câu nói truyền cảm:**
> "Tôi không nói tôi đúng. Nhưng tôi nói: tháng tới, nếu anh em chưa bắt đầu, anh em sẽ ở đúng chỗ này thôi. Năm sau cũng vậy."

---

## 8. CÁC "MẸO" LISTICLE TỪ KÊNH CHÚ QUE

### 8.1. Mẹo 1 — Kết mỗi mục bằng tương lai

> "Sáu tháng nữa, khi anh em nhìn lại tài khoản, anh em sẽ cảm ơn anh em hôm nay."

→ Tạo động lực, kết nối cảm xúc.

### 8.2. Mẹo 2 — Lặp lại nhân vật qua các mục

**Ví dụ cùng 1 video "10 Nghề Tay Trái":**
- Mục 1: Lan chọn gia sư online
- Mục 4: Lan sau 3 tháng tăng thu nhập 5 triệu
- Mục 7: Lan 6 tháng sau có 30 triệu/tháng
- Mục cuối: So sánh Lan với Hùng (anh trai Lan, chọn nghề khác)

→ Tạo "câu chuyện dài" xuyên suốt video, người xem theo dõi.

### 8.3. Mẹo 3 — "Mục 0" làm quen mắt

> Trước khi vào mục 1, nói 1 đoạn ngắn **"Trước khi vào chuyện chính, tôi note nhanh..."** để giới thiệu bối cảnh, tạo cảm giác "có thứ gì đó bonus".

**Ví dụ:**
> "Trước khi vào 10 mục chính, tôi note nhanh một thứ. Nhiều anh em hỏi tôi: 'Anh ơi, danh sách này anh lấy đâu ra?' Thì 80% là từ kinh nghiệm bản thân tôi và anh em trong cộng đồng gửi về. Nên đừng hỏi nguồn, cứ thử rồi cho tôi biết kết quả."

### 8.4. Mẹo 4 — Đếm ngược cuối

> "Anh em ơi, chỉ còn 2 mục nữa thôi. Tôi giữ mấy cái quan trọng cho cuối."

→ Tạo anticipation, giữ người xem.

### 8.5. Mẹo 5 — "Cái này tôi thích nhất"

> "Trong 10 mục, đây là mục tôi thích nhất. Tại sao? Vì nó ít người nhắc, nhưng tác động thì cực kỳ lớn."

→ Tạo curiosity, người xem tò mò mục đó.

---

## 9. CHỮ "THẦN THÁNH" HAY DÙNG TRONG LISTICLE

Từ phân tích 50 script, các từ khóa xuất hiện nhiều trong listicle:

| Từ/cụm từ | Công dụng |
|---|---|
| "Quan trọng", "Cốt lõi", "Then chốt" | Nhấn mạnh |
| "Bắt đầu từ đâu", "Bước đầu tiên" | Hướng dẫn hành động |
| "Đừng làm thế này", "Tránh sai lầm" | Cảnh báo |
| "Anh em thấy có quen không", "Ai cũng biết" | Tạo kết nối |
| "Ít người để ý", "Thứ ít ai nói" | Tạo giá trị độc đáo |
| "Cái giá phải trả", "Đánh đổi" | Phân tích sâu |
| "Sự thật là", "Thực tế phũ phàng" | Đánh vào lầm tưởng |

---

## 10. CHỐNG CỨNG NHẮC — CHECKLIST

- [ ] Mỗi mục có câu chuyện, số liệu, HOẶC ví dụ cụ thể chưa?
- [ ] Mỗi mục có hành động cụ thể (bước 1, 2, 3) chưa?
- [ ] Đã thay đổi format giữa các mục chưa? (kể chuyện → phân tích → cảnh báo → hành động)
- [ ] Có 1-2 nhân vật xuyên suốt chưa? (Minh ở mục 1, 4, 7 chẳng hạn)
- [ ] Có câu chốt memorable ở mỗi mục chưa?
- [ ] Đã BỎ hết từ "Tiếp theo/Bây giờ chúng ta đến/Mục tiếp" chưa?
- [ ] Có đa dạng hóa Hook mở đầu chưa? (xem `finance-hooks.md`)
- [ ] Có nhịp điệu câu đan xen (ngắn-trung-dài) chưa?

---

## 11. VÍ DỤ MẪU — CHUẨN HÓA

### Script minh họa: "7 Thứ Người Giàu Thực Sự Không Bao Giờ Mua" (script #12)

**HOOK MỞ:**
> "Anh em có bao giờ tự hỏi: tiền của người giàu đi đâu hết không? Ô tô đắt tiền? Đồ hiệu? Hóa ra **ngược lại hoàn toàn**. Hôm nay tôi chia sẻ 7 thứ người giàu thật sự không bao giờ chạm vào. Tin tôi, mục số 4 tôi cũng phải ngỡ ngàng khi tìm hiểu."

**VÌ SAO CẦN XEM:**
> "Mỗi tháng anh em chi tiêu bao nhiêu cho những thứ KHÔNG cần thiết? 1 triệu? 3 triệu? 5 triệu? Có khi 10 triệu. Số tiền đó, nếu biết cách dùng, 10 năm sau anh em có thêm 1 căn nhà. Nghe vô lý, nhưng tôi sẽ chứng minh ở mục cuối."

**7 MỤC:**

> **[Mục 1: Xe mới trả góp vượt khả năng]**
> Hùng, 32 tuổi, kỹ sư IT, lương 35 triệu. Hùng mua ô tô trả góp 800 triệu. Mỗi tháng trả 12 triệu. Nhưng nuôi xe mỗi tháng thêm 6 triệu nữa. Tổng 18 triệu, hơn 50% lương. Hùng tưởng mình sướng. Thực ra Hùng đang bị "sướng" giam lỏng. Mỗi sáng Hùng phải đi làm, không dám nghỉ, không dám đổi việc. Tự do bị mất. Đó chính là cái giá của chiếc xe. Người giàu? Họ chờ đủ tiền mua đứt, hoặc mua xe cũ nhưng còn tốt. Tiền tiết kiệm sinh lời, không chôn vào khấu hao.

> *(Chuyển tiếp)* "Cái này tôi nghĩ nhiều anh em đang mắc. Nhưng mục tiếp theo còn 'nhức nhối' hơn."

> **[Mục 2: Đồ để gây ấn tượng]**
> ... (tương tự pattern)

**TỔNG HỢP:**
> "7 mục tôi vừa nói, anh em thấy điểm chung là gì? Tất cả đều là MUA ĐỂ ĐƯỢC NHÌN THẤY. Người giàu thật sự mua để GIẢI QUYẾT VẤN ĐỀ, không phải để gây ấn tượng. Khác biệt này nhỏ thôi, nhưng 10 năm sau nó là cả một gia tài."

**KẾT:**
> "Anh em ơi, tiền bạc không phải để chứng minh mình giàu. Tiền bạc là để anh em không bao giờ phải lo lắng. Chú Que Tài Chính, hẹn anh em video sau."

---

## 12. KẾT HỢP VỚI DNA KHÁC

- `finance-core.md` — BẮT BUỘC áp dụng trước.
- `finance-hooks.md` — Chọn 1 hook mở đầu cho video.
- `finance-mythbusting.md` — Có thể kết hợp nếu listicle có yếu tố "bóc phốt" (vd: "10 thứ KHÔNG nên mua").

**Prompt hoàn chỉnh:**
```
[DNA Core] + [DNA Listicle - file này] + [Hook từ finance-hooks.md]
```

---

**Phiên bản:** 1.0.0
**Cập nhật:** 2026-07-26
**Dựa trên:** Phân tích 23/50 script listicle kênh Chú Que Tài Chính
**Sử dụng cùng:** `finance-core.md`, `finance-hooks.md`
'''

# ============================================
# Write File 1
# ============================================
with open(os.path.join(OUT_DIR, 'finance-listicle.md'), 'w', encoding='utf-8') as f:
    f.write(LISTICLE)
print("OK: finance-listicle.md")
