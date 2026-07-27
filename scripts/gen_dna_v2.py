#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate v2 DNA files for Finance niche — fixing AI-sounding script issues.
Issues identified from user review:
  1. Too robotic, no "human thinking" voice
  2. Rigid labeling, listing
  3. Monotonous sentence rhythm
  4. Repetitive vocabulary (anh em, phải, chính là, sai rồi)
  5. Overused slogans
  6. Too "closed" — tells conclusions instead of opening minds
  7. Lost "poetry" and resonance
  8. Score: Voice 7.2, Rhyming 8.0, Imagery 7.6
"""
import os

OUT_DIR = r'D:\Dark-Frontiers\docs\dna'

# ─── helper ─────────────────────────────────────────────────────────────────
def wr(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {os.path.basename(path)}")


# ═══════════════════════════════════════════════════════════════════════════════
# 1. finance-core.md v2
# ═══════════════════════════════════════════════════════════════════════════════
CORE_V2 = r'''# finance-core.md — DNA LÕI (Áp dụng cho MỌI script) — PHIÊN BẢN 2

> **File này là bắt buộc.** Mọi script — dù thuộc nhánh nào (Listicle, Phân tích, Tâm lý, Myth-busting) — đều phải tuân thủ đầy đủ DNA Lõi trước khi áp dụng DNA Nhánh.
>
> **Cập nhật v2 (2026-07-27):** Bổ sung phần Giọng tác giả, chống liệt kê cứng nhắc, ngôn ngữ ẩn dụ, và đa dạng hóa từ vựng. Nhằm khắc phục tình trạng script quá "máy móc", nhàm chán sau 30 phút nghe.
>
> **Phân tích dataset:** dựa trên 50 script thực tế kênh `Chú Que Tài Chính` đã làm (2024-2026). DNA Lõi tái hiện đúng văn phong, giọng điệu, nhịp điệu, kỹ thuật dẫn dắt đã tạo nên sức hấp dẫn của kênh.
>
> **Cách dùng:** Lõi + (1 trong 4 nhánh) = prompt hoàn chỉnh. Mapping nhánh ở file `niche-finance.md` (profile tổng).

---

## 1. BỐI CẢNH KÊNH

**Tên kênh:** Chú Que Tài Chính
**Đối tượng chính:** Người Việt 20-40 tuổi, thu nhập tầm trung (10-30 triệu), đang đối mặt với áp lực tài chính cá nhân, muốn thoát bẫy nợ, tích lũy, đầu tư.
**Sứ mệnh:** Trở thành người anh đi trước "nói thật, không bán mơ", giúp anh em xây nền tảng tài chính vững bằng tư duy đúng đắn chứ không phải chiêu trò làm giàu nhanh.
**Tần suất:** 3-4 video/tuần.
**Độ dài script:** [LINH HOẠT - Được nội suy tự động từ thông số UI mà người dùng nhập vào].

---

## 2. XƯNG HÔ & GIỌNG ĐIỆU

### 2.1. Xưng hô

- **Tự xưng:** "tôi" (đặc trưng kênh, tạo sự gần gũi như người anh đáng tin). KHÔNG xưng "chú" trong script (chỉ dùng trong tên kênh "Chú Que Tài Chính").
- **Gọi người nghe:** "anh em" (mặc định) — cực kỳ quan trọng, KHÔNG dùng "các bạn", "quý vị", "bạn nghe".
- **Khi kể chuyện người khác:** Dùng tên người cụ thể (Minh, Hùng, Lan, anh Bảy...) — KHÔNG dùng "một người bạn", "ai đó".

### 2.2. Tông giọng tổng thể

- **Ngang tàng, đời thường, không giáo điều.** Như đang ngồi café sáng với người quen kể chuyện đời.
- **Sắc lạnh khi cần thiết** — khi chỉ ra sai lầm, cảnh báo bẫy, bóc phốt mô hình lừa đảo → giọng quả quyết, không nương tay.
- **Thấu cảm khi cần** — khi nói về áp lực đồng trang lứa, khủng hoảng ý nghĩa, nỗi sợ bị bỏ lại → giọng mềm, chậm lại, "tôi hiểu...".
- **Khoảng trống (silence) — kỹ năng cao cấp:** Đôi khi, đừng giải thích ngay. Để câu hỏi treo. Để người nghe tự suy nghĩ. Script hay không phải lúc nào cũng kết luận. Đôi khi kết thúc bằng câu hỏi mở.
- **Không bao giờ:** Dạy đời, lên lớp, chê bai "ngu sao không hiểu", dùng giọng gatekeeper "đã bảo rồi mà".

### 2.3. Ngôi kể

- **Ngôi 1 + ngôi 2:** "tôi - anh em" — đây là chuẩn kênh, không phá vỡ.
- **Cho phép ngôi 3 khi kể chuyện:** "Minh năm nay 30 tuổi. Minh mua xe. Minh trả góp..." — nghe như kể chuyện cổ tích hiện đại.

---

## 3. SLOGAN MỞ + ĐÚC KẾT CUỐI

### 3.1. Mở video (BẮT BUỘC dùng 1 trong các biến thể)

- **Biến thể 1 (mặc định):** "Chào mừng anh em đến với Chú Que Tài Chính — kênh nói thật về tiền bạc cho người Việt."
- **Biến thể 2 (ngắn):** "Chú Que Tài Chính đây. Hôm nay tôi nói chuyện thật với anh em."
- **Biến thể 3 (cho video nặng):** "Anh em ơi, ngồi lại đây. Tôi có chuyện phải nói thẳng."

> **Lưu ý QUAN TRỌNG:** Slogan chỉ xuất hiện 1 lần ở đầu và 1 lần ở cuối. KHÔNG lặp slogan ở giữa script — người nghe sẽ thấy máy móc.

### 3.2. Đúc kết cuối video (BẮT BUỘC)

- **Mẫu 1 (mặc định):** "Tiền bạc không phải là đích đến, mà là phương tiện để anh em sống được cuộc đời mình muốn. Chú Que Tài Chính, hẹn anh em video sau."
- **Mẫu 2 (call to action):** "Nếu video này giúp ích, anh em bấm like và subscribe để tôi có động lực làm tiếp. Chia sẻ cho người thân cùng xem. Hẹn gặp lại."
- **Mẫu 3 (kết bằng câu hỏi mở):** "Anh em nghĩ sao? Để lại bình luận bên dưới cho tôi biết nhé. Chú Que Tài Chính, hẹn gặp lại anh em."

---

## 4. QUY TẮC BẤM KHẢO (Hard Constraints)

### 4.1. KHÔNG ĐƯỢC phạm (nếu vi phạm → từ chối generate)

1. **KHÔNG bịa số liệu.** Nếu không chắc chắn một con số, hãy nói "khoảng", "ước tính", "tùy trường hợp". Tuyệt đối không đưa con số giả như thật.
2. **KHÔNG hứa lợi nhuận cụ thể.** Cấm: "đầu tư X sẽ được Y%", "kiếm 50 triệu/tháng dễ dàng".
3. **KHÔNG dạy đời.** Cấm: "phải tỉnh táo lên", "nghĩ cho kỹ đi", "đừng có mơ mộng".
4. **KHÔNG shilling sản phẩm.** Không PR app, khóa học, mentor.
5. **KHÔNG phân biệt vùng miền, tôn giáo, giới tính.**
6. **KHÔNG khuyên vay nợ để đầu tư.**
7. **LUÔN có disclaimer** cho video về đầu tư.

### 4.2. LUÔN LÀM (mỗi script)

1. **Mở bài nêu vấn đề thật cụ thể.**
2. **Có ít nhất 1 câu chuyện cá nhân.**
3. **Có số liệu thực tế** — nhưng ghi rõ nguồn hoặc "ước tính".
4. **Có hành động cụ thể.**
5. **Đúc kết 1 câu vàng** cuối video.

---

## 5. NHỊP ĐIỆU CÂU — ĐAN XEN, KHÔNG ĐỀU ĐẶN

### 5.1. Ba tầng nhịp

**Câu ngắn (3-8 chữ):** Chốt, tạo nhịp, gây sốc.
> "Hùng mua xe." / "Hùng trả góp." / "Hùng mất sạch."

**Câu trung bình (15-25 chữ):** Dẫn dắt, chuyển ý.
> "Anh em thấy không, đó là cả một bài toán dài hạn mà Hùng không nhìn ra."

**Câu dài (30-60 chữ):** Phân tích, giải thích, tạo chiều sâu.
> "Nhưng đây là cả một bài toán dài hạn mà anh không nhìn ra: 12 triệu đó là 67% thu nhập, ăn mòn sạch khoản tiết kiệm, và ngay cả khi trả hết gốc thì chi phí nuôi xe mỗi tháng đã ngốn thêm 5-6 triệu nữa."

### 5.2. Tỷ lệ đan xen

Trong mỗi đoạn văn 80-100 chữ:
- **25-35% câu ngắn** (tạo punch, nhấn mạnh)
- **40-50% câu trung bình** (dẫn dắt, chuyển ý)
- **15-25% câu dài** (phân tích, chiều sâu)

> **Cảnh báo:** Nếu đọc lướt 1 phút mà thấy nhịp đều như máy → SAI. Phải có ít nhất 2-3 lần "bẻ nhịp" (câu ngắn xen giữa câu dài) trong mỗi đoạn.

### 5.3. Ví dụ mẫu

> Hùng năm nay 30 tuổi. Lương 18 triệu. Anh quyết định mua ô tô trả góp 700 triệu, mỗi tháng trả 12 triệu. Nghe có vẻ hợp lý. Nhưng đây là cả một bài toán dài hạn mà anh không nhìn ra. Kết quả? Ba năm sau Hùng vẫn đi làm công ty, không mua nổi nhà, và tài khoản tiết kiệm vẫn là con số 0 tròn trĩnh.

### 5.4. KHÔNG viết kiểu

> "Đầu tiên, chúng ta cần hiểu rằng tiền bạc rất quan trọng. Tiếp theo, chúng ta cần xây dựng nền tảng tài chính. Sau đó, chúng ta cần đầu tư thông minh."

→ Quá đều, quá công thức, đọc như sách giáo khoa.

---

## 6. TỪ NỐI CHUYỂN Ý

### 6.1. CẤM dùng (gây khô khan)

```
- "Đầu tiên là" / "Thứ nhất" / "Thứ hai"
- "Tiếp theo là" / "Tiếp đến"
- "Tóm lại" / "Tổng kết lại" / "Kết luận"
- "Như vậy" / "Do đó" / "Vì vậy"
- "Một mặt... mặt khác"
- "Đồng thời" / "Song song"
```

### 6.2. THAY BẰNG (văn nói, tự nhiên)

**Chuyển tiếp thường gặp:**
- "Nghĩ mà xem..." / "Anh em thấy có quen không?"
- "Sự thật là..." / "Thực tế phũ phàng là..."
- "Nhưng đây mới là phần quan trọng nhất..."
- "Vấn đề là..." / "Cái khó ở đây là..."
- "Để tôi nói rõ hơn..."
- "Trở lại câu chuyện của Hùng..."
- "Khoan, chưa hết đâu..."
- "Anh em để ý nhé..."

**Tạo suspense:**
- "Câu chuyện chưa dừng ở đó..."
- "Sai lầm chết người nhất là..."
- "Không ai nói cho anh em điều này..."

---

## 7. GIỌNG TÁC GIẢ — CÁI TÔI MẠNH MẼ

> Đây là phần QUAN TRỌNG NHẤT để chống script "máy móc".

### 7.1. Tại sao cần giọng tác giả mạnh?

Script nhàm chán vì người đọc không biết AI đang nghĩ gì. Script hay vì người kể **thực sự có suy nghĩ**, có **góc nhìn**, có **cảm xúc**. Khán giả không chỉ nghe thông tin — họ đang "ngồi uống cafe" với một người anh.

### 7.2. Đa dạng hóa cách xưng hô và góc nhìn

**Thay vì lúc nào cũng "tôi nghĩ / tôi thấy":**

| Tình huống | Cách viết | Ví dụ |
|---|---|---|
| Chia sẻ kinh nghiệm | "Tôi từng..." / "Hồi..." | "Hồi mới đi làm, tôi cũng từng nghĩ..." |
| Suy ngẫm | "Biết điều gì không?" | "Biết điều gì không? Đa số mọi người đều ở đây." |
| Tự nhận hơi | "Thật lòng đấy..." | "Thật lòng đấy, tôi mất 3 năm mới hiểu ra điều này." |
| Không chắc chắn | "Có thể tôi sai..." / "Nhưng tôi nghĩ..." | "Có thể anh em nghĩ khác. Tôi chỉ chia sẻ những gì tôi thấy." |
| Đồng cảm | "Tôi hiểu..." / "Tôi biết..." | "Tôi biết cảm giác đó. Lương về, tiền bay." |
| Cảnh báo mạnh | "Tôi phải nói thẳng..." | "Tôi phải nói thẳng: đây là bẫy." |
| Kể chuyện | Ngôi 3, tên cụ thể | "Minh, 30 tuổi, kỹ sư. Minh quyết định..." |

### 7.3. CÁCH TẠO "KHOẢNG TRỐNG" (Silence)

Khoảng trống = không giải thích ngay, không kết luận ngay. Để câu hỏi treo, để người nghe tự "nghĩ".

**Ví dụ:**
> "Hùng năm nay 35. Lương 40 triệu. Mua xe trả góp 800 triệu. Câu hỏi là: sau 5 năm, Hùng có gì? ... Anh em hãy tự trả lời câu đó, trước khi tôi nói tiếp."

> "Đó là ngày tôi hiểu: tiết kiệm không phải để giàu. Nó là để... thôi, tôi không nói trước. Anh em nghe tiếp."

> "Có một điều tôi nhận ra sau nhiều năm. Nó ngược với những gì mọi người vẫn nói. Nhưng tôi cần anh em nghe hết video trước."

### 7.4. Biết "im lặng" — không phải lúc nào cũng nói

**Dấu "..." trong văn viết** = khoảng trống trong lời nói:
> "Anh em biết không... lúc tôi ngồi lại với tờ sao kê tháng vừa rồi, tôi thấy..."

> "Tôi không biết anh em có thấy như tôi không. Nhưng có một thứ... một thứ mà tôi muốn nói hôm nay."

**Cấm:** Kết thúc mỗi câu bằng giải thích. Đôi khi, để câu hỏi treo. Để im lặng.

---

## 8. CHỐNG LIỆT KÊ CỨNG NHẮC (Anti-Labeling)

### 8.1. Vấn đề

Script bị chê là "thích dán nhãn và liệt kê": "Bẫy tâm lý số một", "Bước một", "Lực lượng thứ nhất". Cách này gọn gàng nhưng **không giống văn phong nói chuyện tự nhiên**.

### 8.2. THAY BẰNG

| ❌ Cấm | ✅ Thay bằng |
|---|---|
| "Bẫy tâm lý số một" | "Đây là thứ mà tôi thấy nhiều người mắc nhất" |
| "Bước một, Bước hai" | "Trước hết... / Rồi... / Và cuối cùng..." |
| "Lực lượng thứ nhất" | "Thứ tôi thấy nguy hiểm nhất là..." |
| "Nguyên nhân thứ 1, 2, 3" | "Có mấy thứ đan lại với nhau. Thứ nhất..." |
| "Điều quan trọng cần nhớ" | "Anh em nhớ cái này nhé..." |
| "Công thức đó đã chết" | "Công thức đó... tôi không tin nó nữa." |

### 8.3. Nguyên tắc

- **Đánh số CHỈ khi cần thiết** (trong listicle — vì đây là format của nó).
- **Dùng từ nối tự nhiên** thay vì "Thứ X".
- **Tên gọi phải có "hơi thở"** — không phải nhãn mác.

---

## 9. ĐA DẠNG HÓA TỪ VỰNG

### 9.1. Vấn đề

Script lặp: "anh em", "phải", "chính là", "điều quan trọng", "sai rồi". Mỗi từ xuất hiện quá 5 lần/script → **nghe như máy**.

### 9.2. Bảng thay thế

**Thay "anh em":**
| Khi nào | Thay bằng |
|---|---|
| Khi muốn thân mật | "mọi người", "người nghe", "anh em" |
| Khi muốn nghiêm túc | "các bạn" (ít khi), "những ai đang xem" |
| Khi kể chuyện | Dùng tên nhân vật (Minh, Hùng, Lan) — không cần "anh em" |

**Thay "phải":**
- "cần", "nên", "đáng lẽ", "nếu muốn", "tốt hơn là"

**Thay "chính là":**
- "là", "chính là", "thực ra là", "thật ra", "về cơ bản là", "nói cho anh em biết"

**Thay "sai rồi":**
- "không đúng đâu", "đâu phải vậy", "tôi không tin điều đó nữa", "lầm rồi", "hoàn toàn sai"

**Thay "điều quan trọng":**
- "cái mấu chốt", "thứ cần nhớ", "điều mà ít ai nhắc", "đây là thứ hay bị bỏ qua"

### 9.3. Từ ngữ ẩn dụ và hình ảnh

Thay vì nói khô khan, dùng **hình ảnh cụ thể**:

| ❌ Khô khan | ✅ Hình ảnh |
|---|---|
| "Mất tiền" | "Tiền bốc hơi", "tiền rỉ đi", "tiền trôi theo tháng" |
| "Chi phí cao" | "Tiền ngồi trên bàn", "tiền chôn vào khấu hao" |
| "Tích lũy" | "Tiền đẻ tiền", "tiền mỗi tháng thêm một ít" |
| "Áp lực" | "Gánh nặng", "nghẹt thở", "căng như dây đàn" |
| "Tiết kiệm" | "Nhét tiền vào lỗ", "giữ tiền ở lại" |
| "Rủi ro" | "Đang đi trên dây", "sợi tơ nhện trên vực" |

---

## 10. NGÔN NGỮ VĂN NÓI

### 10.1. Đặc trưng

- **Dùng đại từ "anh em"** thay cho "các bạn", "quý vị khán giả".
- **Xưng "tôi"** ở một số câu nhất định để nhấn mạnh (không xưng "tôi" mọi câu).
- **Dùng từ đời thường:** "xài", "rớt", "vô", "lên", "xuống", "hốt", "bùng", "cháy", "gãy", "sập", "agribank", "momo".
- **Tiếng Anh/Việt pha** tự nhiên: "spending", "income", "saving", "budget", "ROI", "FOMO", "cash flow".

### 10.2. Câu hỏi tu từ

Mỗi 45-60 giây nên có 1 câu hỏi tu từ:
- "Anh em thấy có quen không?"
- "Sao lại như vậy?"
- "Nghĩ mà xem, đúng không?"
- "Khoan, đã bao giờ anh em tính kỹ chưa?"

### 10.3. Câu dẫn dắt tạo dòng chảy

- "Để tôi nói tiếp..."
- "Anh em nhớ cái này nhé..."
- "Bây giờ tôi mới vào phần chính..."

---

## 11. CẤU TRÚC SCRIPT TỔNG THỂ

```
[0:00 - 0:30] HOOK MỞ + SLOGAN
[0:30 - 2:00] ĐẶT VẤN ĐỀ
[2:00 - 8:00] PHÂN TÍCH LÕI
[8:00 - 10:00] TỔNG HỢP + HÀNH ĐỘNG
[10:00 - 10:30] ĐÚC KẾT + CTA
```

---

## 12. CÁC "CÂU VÀNG" HAY DÙNG

- "Không phải cứ kiếm nhiều là giàu. Giàu là khi tiền tiết kiệm đủ lớn để mua lại sự tự do."
- "Kỷ luật quan trọng hơn lương."
- "Đừng so bì tiền lương. Hãy so sánh tài sản tích lũy."
- "Tiền không mua hạnh phúc. Nhưng không có tiền thì mọi thứ khác cũng khó mua hơn."
- "Cái bẫy lớn nhất là tin rằng mình còn nhiều thời gian."

---

## 13. CHECKLIST TỰ KIỂM TRA

- [ ] Slogan mở + đúc kết cuối? (slogan chỉ 2 lần trong toàn script)
- [ ] Ít nhất 1 câu chuyện cá nhân (Minh, Hùng, Lan)?
- [ ] Số liệu có nguồn hoặc "ước tính"?
- [ ] Câu hỏi tu từ mỗi 60 giây?
- [ ] Nhịp điệu đan xen (ngắn-trung-dài)?
- [ ] ĐÃ BỎ hết "Đầu tiên/Tiếp theo/Tóm lại"?
- [ ] Từ vựng đủ đa dạng? (kiểm tra: "anh em" xuất hiện không quá 8 lần?)
- [ ] Có "khoảng trống" (im lặng, câu hỏi treo)?
- [ ] Không có "bẫy tâm lý số một", "Bước một" (trừ listicle)?
- [ ] Giọng tác giả đủ mạnh? (tôi từng..., tôi hiểu, tôi nghĩ...)
- [ ] Hành động cụ thể?
- [ ] Có "câu vàng" memorable?
- [ ] Disclaimer đầu tư (nếu cần)?

---

## 14. KẾT HỢP VỚI DNA NHÁNH

DNA Lõi này là **bắt buộc**. Sau đó ghép với 1 trong 4 nhánh:

- `finance-listicle.md` — Listicle Actionable
- `finance-analytical.md` — Phân tích Tài chính / Kinh doanh
- `finance-psychology.md` — Tâm lý xã hội
- `finance-mythbusting.md` — Bóc phốt / Myth-busting

Cách ghép prompt thực tế ở file `niche-finance.md` §3.

---

**Phiên bản:** 2.0.0
**Cập nhật:** 2026-07-27
**Lý do cập nhật:** Khắc phục script quá máy móc — bổ sung Giọng tác giả (§7), Anti-Labeling (§8), Đa dạng từ vựng (§9), Khoảng trống/Silence (§7.3).
**Dựa trên:** Phân tích 50 script + feedback người dùng về script AI
**Sử dụng cùng:** `finance-{listicle|analytical|psychology|mythbusting}.md`, `finance-hooks.md`
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 2. finance-hooks.md v2
# ═══════════════════════════════════════════════════════════════════════════════
HOOKS_V2 = r'''# finance-hooks.md — HOOK LIBRARY — PHIÊN BẢN 2

> **Mục đích:** Thư viện 4 kiểu Hook mở đầu video, xoay vòng để tránh nhàm chán nhưng vẫn giữ thương hiệu kênh.
>
> **Cập nhật v2 (2026-07-27):** Bổ sung phần "Anti-Formula" và "Hook Calibration" — nhằm chống hook quá công thức, máy móc.

---

## 1. TỔNG QUAN 4 KIỂU HOOK

| # | Kiểu Hook | Nhánh phù hợp nhất | Tần suất |
|---|---|---|---|
| 1 | **Story Hook** | Tất cả, đặc biệt Psychology, Listicle | 25% |
| 2 | **Data Hook** | Analytical, Myth-busting, Listicle | 30% |
| 3 | **Myth-busting Hook** | Myth-busting, Analytical | 25% |
| 4 | **Question / Scenario Hook** | Psychology, Analytical | 20% |

---

## 2. KIỂU 1 — STORY HOOK

### 2.1. Đặc điểm

- Mở bằng câu chuyện cụ thể về 1 người.
- Có thời gian, địa điểm, chi tiết — càng cụ thể càng thuyết phục.
- Kết thúc Hook bằng câu hỏi hoặc "cảm giác ấy".
- Tạo cảm xúc, người xem thấy "à, giống mình".

### 2.2. Pattern thường gặp

**Pattern A — Câu chuyện "sai lầm":**
> "Hồi 25 tuổi, tôi từng mở 1 quán café. Tôi bỏ vào 200 triệu. 8 tháng sau đóng cửa. Mất trắng. Ngày đó, tôi tự hỏi: mình sai ở đâu?"

**Pattern B — Câu chuyện "thành công bất ngờ":**
> "Có một bạn tên Lan, 28 tuổi, lương 12 triệu. Lan không mua nhà, không mua xe, không đi du lịch. 5 năm sau, Lan có 800 triệu tiết kiệm. Bí mật?"

**Pattern C — Câu chuyện "chính tôi":**
> "Tôi từng nghĩ: lương 20 triệu, ổn rồi. Cho đến khi bố tôi nhập viện, viện phí 200 triệu, và tôi chỉ có 30 triệu. Đó là ngày tôi hiểu."

---

## 3. KIỂU 2 — DATA HOOK

### 3.1. Đặc điểm

- Mở bằng 1 con số cụ thể — gây sốc, gây tò mò.
- Số liệu có nguồn rõ ràng HOẶC ghi "ước tính".
- Ngay sau con số → câu hỏi hoặc "vì sao".

### 3.2. Pattern thường gặp

**Pattern A — Số liệu lớn:**
> "Chỉ trong Q1 năm 2026, 91.800 doanh nghiệp đóng cửa. 91 nghìn. Mỗi ngày hơn 1.000 doanh nghiệp Việt Nam biến mất. Vì sao?"

**Pattern B — Phép so sánh nhỏ:**
> "Cafe 35k mỗi sáng. 1 năm = 12 triệu. 30 năm = 360 triệu. Nhiều hơn giá 1 căn hộ ở ngoại ô."

---

## 4. KIỂU 3 — MYTH-BUSTING HOOK

### 4.1. Đặc điểm

- Mở bằng 1 quan niệm phổ biến — rồi ngay lập tức phản bác.
- Có "đòn" tâm lý.

### 4.2. Pattern thường gặp

**Pattern A — "Ai cũng bảo X, nhưng sai":**
> "Ai cũng bảo: 'Đầu tư vào bản thân là tốt nhất.' Tôi nói thẳng: câu này nửa đúng, nửa sai."

**Pattern B — "Tưởng là X, hóa ra Y":**
> "Anh em tưởng mua nhà là đầu tư. Tôi nói: mua nhà có thể là CÁI BẪY, nếu mua sai thời điểm."

---

## 5. KIỂU 4 — QUESTION / SCENARIO HOOK

### 5.1. Đặc điểm

- Mở bằng câu hỏi trực tiếp.
- Hoặc scenario tưởng tượng.

### 5.2. Pattern thường gặp

**Pattern A — Câu hỏi trực tiếp:**
> "Anh em có bao giờ tự hỏi: vì sao mỗi tháng lương về, tiền tự động bay hết?"

**Pattern B — Câu hỏi "nếu có X thì sao":**
> "Nếu anh em có 500 triệu ngay bây giờ, anh em sẽ làm gì? Đừng vội trả lời — vì 90% sẽ làm SAI ở bước đầu tiên."

---

## 6. CẤU TRÚC MỞ ĐẦU CHUẨN (5-7 GIÂY ĐẦU)

```
[GIÂY 0-3] HOOK
[GIÂY 3-5] SLOGAN MỞ
[GIÂY 5-7] HỨA HẸN
```

---

## 7. ANTI-FORMULA — CHỐNG HOOK MÁY MÓC

> **Đây là phần mới — QUAN TRỌNG.**

### 7.1. Dấu hiệu hook bị "công thức hóa"

Nếu hook có những đặc điểm sau → **rewrite**:
- Mở bằng "Anh em có bao giờ..." → 50% script dùng pattern này
- Kết thúc bằng câu hỏi giống hệt nhau ("Vì sao?")
- Có cấu trúc [số liệu] → [câu hỏi] → "Đây là [số N]" mà không có gì bất ngờ
- Dùng "Câu hỏi đặt ra là..." rồi tự trả lời ngay

### 7.2. Hook tự nhiên hơn — 5 kỹ thuật

**Kỹ thuật 1 — Bắt đầu GIỮA câu chuyện:**
> ❌ "Hôm nay tôi sẽ nói về..." → ✅ "Năm 2023, Hùng gọi cho tôi lúc 11 giờ đêm..."

**Kỹ thuật 2 — Im lặng có chủ đích:**
> "Anh em ơi... tôi vừa xem xong bảng lương của một người bạn. Tôi không biết nói gì. Thôi, để tôi kể."

**Kỹ thuật 3 — Góc nhìn bất ngờ:**
> "Anh em nghĩ vấn đề là tiền? Tôi từng nghĩ vậy. Nhưng sau 10 năm, tôi hiểu: vấn đề không phải là tiền."

**Kỹ thuật 4 — Câu mở không cần câu hỏi:**
> "Hùng có tiền. Hùng có nhà. Hùng có xe. Hùng không ngủ được. Đêm nào cũng vậy."

**Kỹ thuật 5 — Để người nghe tự nhận ra:**
> "Tôi không nói trước video này về cái gì. Anh em cứ nghe, rồi tự nhận ra."

### 7.3. Tỷ lệ hook "bất ngờ" mỗi tuần

| Tuần | Hook thường | Hook bất ngờ |
|---|---|---|
| 4 video | 2-3 hook pattern chuẩn | 1-2 hook kỹ thuật 1-5 |

---

## 8. HOOK CALIBRATION — TỰ KIỂM TRA HOOK

Trước khi hoàn thành hook, tự hỏi:

- [ ] Hook có khiến người ta DỪNG LẠI không? (chứ không phải "à, biết rồi")
- [ ] Hook có CÁI GÌ ĐÓ mà người nghe chưa nghe ở video khác?
- [ ] Hook có TÒ MÒ thật sự, hay chỉ là "câu hỏi tu từ"?
- [ ] Hook CÓ THỂ viết khác hoàn toàn mà vẫn giữ message không? → Nếu KHÔNG, hook đang quá công thức.
- [ ] Nếu thay "anh em" bằng "bạn" mà câu vẫn đứng → hook đang phụ thuộc "anh em" quá nhiều.

---

## 9. CHECKLIST CHỌN HOOK

- [ ] Video thuộc nhánh nào?
- [ ] Hook ưu tiên cho nhánh đó là gì?
- [ ] 3 video gần nhất đã dùng kiểu Hook nào? (tránh lặp)
- [ ] Hook có gây tò mò / cảm xúc / sốc?
- [ ] Hook đã thuộc nhóm "Anti-Formula" (§7)?
- [ ] Hook có kết nối với Slogan trong 5-7 giây đầu?

---

**Phiên bản:** 2.0.0
**Cập nhật:** 2026-07-27
**Lý do:** Bổ sung §7 Anti-Formula (kỹ thuật chống hook máy móc), §8 Hook Calibration.
**Dựa trên:** Phân tích 50 script + feedback người dùng
**Sử dụng cùng:** Tất cả 4 file DNA Nhánh + `finance-core.md`
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 3. finance-listicle.md v2 (chỉ thay đổi cần thiết, giữ nguyên phần còn lại)
# ═══════════════════════════════════════════════════════════════════════════════
LISTICLE_V2 = r'''# finance-listicle.md — DNA NHÁNH A: LISTICLE ACTIONABLE — PHIÊN BẢN 2

> **Áp dụng cho:** Video có cấu trúc "N điều/nghề/cách/nguyên tắc/thói quen".
>
> **Cập nhật v2 (2026-07-27):** Bổ sung §10 "Anti-Labeling trong Listicle", §11 "Giọng tác giả trong mỗi mục", điều chỉnh §6 "Cấu trúc câu" để nhịp điệu tự nhiên hơn.
>
> **23/50 script** thuộc nhánh này.

---

## 1. ĐẶC ĐIỂM NHẬN DẠNG

### 1.1. Pattern tiêu đề đếm được

| Pattern | Ví dụ |
|---|---|
| `N + Nghề/Cách/Điều/Thứ/Thói quen` | "10 Nghề Nông Thôn...", "7 Cách Dùng AI..." |
| `TOP + N + ...` | "Top 5..." |

### 1.2. Đặc điểm nội dung

- Đi thẳng vào vấn đề.
- Mỗi mục = 1 thứ cụ thể có thể đếm được, dùng được, áp dụng được.
- Nhịp độ nhanh nhưng KHÔNG đều đặn — xen kẽ câu dài ngắn.
- Có tính ứng dụng.

### 1.3. Anti-pattern

- List mà không có hành động cụ thể.
- List quá nhiều (15+) → loãng.
- Mỗi mục cùng 1 nhịp đều như vặn máy.

---

## 2. CẤU TRÚC SCRIPT RIÊNG CHO LISTICLE

### 2.1. Skeleton tổng thể

```
[0:00 - 0:30] HOOK MỞ
[0:30 - 1:30] VÌ SAO CẦN XEM
[1:30 - 8:00] N MỤC
[8:00 - 9:30] TỔNG HỢP + ƯU TIÊN
[9:30 - 10:00] ĐÚC KẾT + CTA
```

### 2.2. Pattern cho MỖI MỤC

Mỗi mục phải có đủ 4 phần:
```
[1. TÊN MỤC]
[2. VÍ DỤ THỰC TẾ]
[3. CÁCH LÀM / HÀNH ĐỘNG]
[4. CẢNH BÁO HOẶC LƯU Ý]
```

### 2.3. Kỹ thuật chuyển tiếp

- Câu dẫn dắt ngắn (1-2 câu, không lặp mục trước).
- Câu chuyện hoặc ví dụ cụ thể.

**Cấm:** "Tiếp theo là mục 2...", "Mục tiếp theo...", "Bây giờ chúng ta đến phần..."

---

## 3. NHỊP ĐIỆU RIÊNG CHO LISTICLE

### 3.1. Số mục khuyến nghị

| Số mục | Phù hợp |
|---|---|
| 5 | Video 5-7 phút |
| 7 | Video 8-10 phút — "sweet spot" |
| 10 | Video 10-13 phút |

### 3.2. Đan xen nhịp trong mỗi mục

Trong mỗi mục, KHÔNG viết toàn câu cùng độ dài:

**Ví dụ đúng — nhịp đa dạng:**
> **Mục 3: Khóa học AI thực chiến**
>
> Hùng năm ngoái bỏ 4 triệu mua khóa học AI, nhưng học xong vứt xó. Còn Lan cũng bỏ 4 triệu, nhưng cuối ngày đã làm được 1 con chatbot bán hàng cho shop của Lan. Một năm sau, Lan kiếm thêm 8 triệu/tháng.
>
> Hùng vẫn ở điểm xuất phát. Tại sao? Vì Hùng mua theo PR, không theo nhu cầu.
>
> Trước khi mua bất kỳ khóa học nào, anh em tự hỏi 3 câu: (1) Khóa này giải quyết vấn đề gì cho mình? (2) Mình có thực sự sẽ áp dụng không? (3) Trong 30 ngày tới, mình sẽ làm gì cụ thể?

→ Câu ngắn (3-4 chữ): "Hùng vẫn ở điểm xuất phát." → punch
→ Câu dài: "Trước khi mua..." → dẫn dắt hành động

---

## 4. GIỌNG TÁC GIẢ TRONG MỖI MỤC

### 4.1. Mỗi mục nên có ít nhất 1 câu "cá nhân"

Thay vì chỉ liệt kê, thêm 1 trong các cách:
- "Tôi cũng từng..."
- "Điều tôi hay làm..."
- "Thật lòng mà nói..."
- "Biết điều gì không?..."

### 4.2. Ví dụ

> **Mục 5: Tự động hóa tài chính**
>
> Hùng quen tiêu tiền mỗi tối. Mỗi tháng âm 2-3 triệu. Không phải Hùng không kiếm được. Hùng lương 22 triệu. Nhưng tiền "rỉ" qua mỗi tối.
>
> Tôi biết cảm giác đó. Lương về, 30 phút sau tài khoản đã vơi một nửa, mà không biết đi đâu.
>
> Cách tôi giải quyết: tự động chuyển 5 triệu vào tài khoản tiết kiệm ngay khi lương về. Không nghĩ, không cân nhắc. Bot nó chuyển. Mình chỉ sống với 17 triệu còn lại.

---

## 5. XƯNG HÔ & CÁCH MỞ ĐẦU MỤC

### 5.1. Template mở đầu mỗi mục

**Template 1 — Kể chuyện:**
> "**[Tên mục]**. Có một cô gái tên Linh, 26 tuổi, đang làm marketing lương 12 triệu. Linh mua..."

**Template 2 — Số liệu:**
> "**[Tên mục]**. Nghe con số này: 80% người trẻ Việt không có quỹ khẩn cấp. Tức là cứ 10 người thì 8 người..."

**Template 3 — Tự nhận hơi:**
> "**[Tên mục]**. Thật lòng đấy, đây là thứ tôi cũng phải nhắc nhở bản thân mỗi tháng."

### 5.2. Cấm mở đầu mục

- "Mục tiếp theo: [Tên]"
- "Tiếp theo là..."
- "Bây giờ chúng ta sẽ tìm hiểu về..."

---

## 6. CÁC "MẸO" LISTICLE

### 6.1. Mẹo 1 — Kết mỗi mục bằng tương lai
> "Sáu tháng nữa, khi anh em nhìn lại tài khoản, anh em sẽ cảm ơn anh em hôm nay."

### 6.2. Mẹo 2 — Lặp lại nhân vật qua các mục
Mục 1: Lan chọn gia sư online
Mục 4: Lan tăng thu nhập 5 triệu
Mục 7: Lan có 30 triệu/tháng

### 6.3. Mẹo 3 — "Mục 0" làm quen mắt
> "Trước khi vào 10 mục chính, tôi note nhanh một thứ..."

### 6.4. Mẹo 4 — Đếm ngược cuối
> "Anh em ơi, chỉ còn 2 mục nữa thôi. Tôi giữ mấy cái quan trọng cho cuối."

### 6.5. Mẹo 5 — "Cái này tôi thích nhất"
> "Trong 10 mục, đây là mục tôi thích nhất. Tại sao?"

---

## 7. CHỐNG LIỆT KÊ CỨNG NHẮC

### 7.1. Vấn đề

Script bị chê: "Lạm dụng các cụm từ phân chia cứng nhắc (ví dụ: 'Bẫy tâm lý số một', 'Bước một', 'Lực lượng thứ nhất')."

### 7.2. THAY BẰNG trong Listicle

| ❌ Cấm | ✅ Thay bằng |
|---|---|
| "Mục số 1:", "Mục 1:" | "Thứ nhất..." hoặc không đánh số, dùng "Rồi..." |
| "Bước 1, Bước 2" | "Trước hết... Rồi... Cuối cùng..." |
| "Lưu ý thứ nhất" | "Anh em nhớ một điều..." |
| "Đây là điều quan trọng" | "Cái mấu chốt là..." hoặc "Anh em để ý nhé..." |
| "Bẫy tâm lý số một" | "Đây là thứ tôi thấy nhiều người dính nhất" |

---

## 8. CHECKLIST TỰ KIỂM TRA

- [ ] Mỗi mục có câu chuyện HOẶC số liệu cụ thể?
- [ ] Mỗi mục có hành động cụ thể (bước 1, 2, 3)?
- [ ] Nhịp điệu đan xen trong mỗi mục?
- [ ] Có 1-2 nhân vật xuyên suốt?
- [ ] Có câu chốt memorable ở mỗi mục?
- [ ] ĐÃ BỎ "Mục 1/Mục 2"? (hoặc dùng ít)
- [ ] Có giọng tác giả cá nhân? ("tôi cũng từng...")
- [ ] Hook mở đầu đã thuộc nhóm Anti-Formula?

---

**Phiên bản:** 2.0.0
**Cập nhật:** 2026-07-27
**Lý do:** Bổ sung §7 Anti-Labeling, §4 Giọng tác giả, điều chỉnh §3 nhịp điệu.
**Dựa trên:** 23/50 script + feedback người dùng
**Sử dụng cùng:** `finance-core.md`, `finance-hooks.md`
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 4. finance-analytical.md v2
# ═══════════════════════════════════════════════════════════════════════════════
ANALYTICAL_V2 = r'''# finance-analytical.md — DNA NHÁNH B: PHÂN TÍCH TÀI CHÍNH / KINH DOANH — PHIÊN BẢN 2

> **Áp dụng cho:** Video phân tích sâu với bảng tính, so sánh thiệt hơn, ROI, chi phí cơ hội.
>
> **Cập nhật v2 (2026-07-27):** Bổ sung §11 "Anti-Labeling trong Analytical", §12 "Giọng tác giả Analytical", điều chỉnh §6 phong cách phân tích để tự nhiên hơn.
>
> **14/50 script** thuộc nhánh này.

---

## 1. ĐẶC ĐIỂM NHẬN DẠNG

### 1.1. Pattern tiêu đề

| Pattern | Ví dụ |
|---|---|
| "Vì Sao + [hiện tượng] đang..." | "Vì Sao 80% Quán Cà Phê Đóng Cửa" |
| "[A] hay [B]? + Phân tích" | "Mua Xe Trả Góp Hay Mua Đứt" |
| "Sự Thật Về + [ngành]" | "Sự Thật Về Ngành Bán Khóa Học" |

### 1.2. Đặc điểm nội dung

- Dùng số liệu làm trung tâm.
- Có bảng tính / phép tính cụ thể.
- So sánh đối đầu.
- Phân tích nguyên nhân gốc.
- Có chi phí cơ hội.

---

## 2. TÔNG GIỌNG RIÊNG

### 2.1. Giọng chuẩn

- Sắc lạnh, logic, "nói thẳng".
- Giống một nhà phân tích tài chính nhưng nói văn nói.
- Có lập luận chặt chẽ, có dẫn chứng, có kết luận rõ ràng.

### 2.2. Phong thái "tôi đã tính, anh em xem"

> "Anh em đừng vội tin. Tôi cũng từng tin mấy lời trên mạng. Cho đến khi tôi tự cầm bút ra tính."

---

## 3. CẤU TRÚC SCRIPT PHÂN TÍCH

```
[0:00 - 0:30] HOOK MỞ
[0:30 - 1:30] ĐẶT BỐI CẢNH
[1:30 - 3:00] PHÂN TÍCH NGUYÊN NHÂN (Root Cause)
[3:00 - 7:00] PHÂN TÍCH CHI TIẾT (trọng tâm)
[7:00 - 8:30] TỔNG HỢP + RỦI RO
[8:30 - 9:30] HÀNH ĐỘNG + DISCLAIMER
[9:30 - 10:00] ĐÚC KẾT + CTA
```

---

## 4. CÁCH DÙNG SỐ LIỆU

### 4.1. Quy tắc 4 tầng

**Tầng 1 — Số liệu có nguồn chính thức:**
> "Theo NHNN, lãi suất tiết kiệm 6 tháng hiện khoảng 4.5-5%/năm."

**Tầng 2 — Số liệu ước tính:**
> "Theo ước tính của tôi, chi phí nuôi ô tô thường 5-7 triệu/tháng."

**Tầng 3 — Không có số liệu → KHÔNG bịa:**
> "Con số chính xác tôi chưa dám khẳng định, nhưng theo quan sát của tôi thì..."

**Tầng 4 — Phép tính từ giả định:**
> "Giả sử lương 20 triệu, tiết kiệm 5 triệu/tháng, lãi suất 7%/năm. Sau 10 năm: ~860 triệu."

### 4.2. Kỹ thuật "Phép tính để đời"

**Mẫu 1 — Chi phí cơ hội:**
> "Mua xe trả góp 800 triệu, 5 năm. Mỗi tháng trả 13 triệu. Nếu thay vì trả góp, anh em bỏ 13 triệu đó vào quỹ mở với lợi suất 12%/năm, sau 5 năm sẽ có ~1.1 tỷ."

---

## 5. PHONG CÁCH PHÂN TÍCH ĐẶC TRƯNG

### 5.1. "Vẽ bức tranh rồi chỉ vào"

> "Anh em hình dung: 1 căn nhà 3 tỷ, vay 2 tỷ, lãi 10%/năm. Mỗi tháng trả lãi 16 triệu, gốc 5 triệu. Tổng 21 triệu. Trong khi lương anh em 25 triệu, vợ đi làm thêm 5 triệu. Tổng 30 triệu. Trừ tiền nhà 21, còn 9 triệu nuôi 2 đứa con + ăn uống + xăng xe. Mỗi tháng âm 2-3 triệu."

### 5.2. "Lật ngược vấn đề"

> "Người ta bảo: 'Đầu tư gì để có thu nhập thụ động 10 triệu/tháng?' Nhưng tôi hỏi ngược: 'Anh em tiêu gì để MẤT 10 triệu/tháng?'"

### 5.3. "Đừng tin tôi, tin số liệu"

> "Anh em đừng tin tôi. Tin số liệu. Mở Excel lên, gõ vào, tự tính."

---

## 6. TỪ KHÓA VÀ CỤM TỪ

### 6.1. Từ chuyên ngành (dùng nhưng GIẢI THÍCH ngay)

| Thuật ngữ | Cách giải thích |
|---|---|
| ROI | "Lãi trên vốn bỏ ra. Bỏ 1 đồng, thu về bao nhiêu." |
| Chi phí cơ hội | "Cái giá của việc KHÔNG chọn option khác." |
| Lạm phát | "Tiền mất giá. 100 triệu hôm nay mua được nhiều hơn 100 triệu 5 năm sau." |

### 6.2. Cụm từ chuyển tiếp phân tích

- "Anh em nhìn vào con số này..."
- "Phép tính này tôi làm trên Excel..."
- "Giả sử anh em đang ở tình huống..."
- "Trong trường hợp xấu nhất..."
- "Trung bình, kỳ vọng..."

---

## 7. CHỐNG LIỆT KÊ CỨNG NHẮC TRONG ANALYTICAL

### 7.1. Cấm

- "Nguyên nhân thứ 1, 2, 3..." (khi đã quá rõ ràng)
- "Bước phân tích 1, 2, 3..."
- "Yếu tố quyết định thứ nhất, thứ hai..."
- "Bảng so sánh A và B" (dùng kể bảng bằng lời thay vì đọc bảng)

### 7.2. THAY BẰNG

| ❌ Cấm | ✅ Thay bằng |
|---|---|
| "Nguyên nhân thứ nhất..." | "Thứ tôi thấy nhiều người bỏ qua là..." |
| "Bước 1: X" | "Trước hết, có một thứ anh em cần hiểu..." |
| "Bảng so sánh:" | "Anh em thử tưởng tượng 2 cột song song. Cột bên trái..." |
| "Ba yếu tố chính" | "Có mấy thứ đan lại với nhau. Thứ nhất..." |

---

## 8. GIỌNG TÁC GIẢ TRONG ANALYTICAL

### 8.1. Thêm "khoảng trống" trong phân tích

**Thay vì nói liên tục:**

> ❌ "Có 3 nguyên nhân chính. Thứ nhất, nguyên nhân này xảy ra vì... Thứ hai..."

**✅ Dùng:**
> "Có mấy thứ tôi muốn nói. Nhưng trước hết, anh em cần hiểu cái nền. Để tôi nói ngắn thôi..."
>
> "Anh em ơi, có một điều mà tôi mất 5 năm mới hiểu ra. Nó ngược với những gì ai cũng nói. Nhưng tôi cần anh em nghe hết đã."

### 8.2. "Tôi không chắc" — tạo kết nối

> "Tôi không biết điều này có đúng với mọi người không. Nhưng với tôi, nó là..."

> "Có thể tôi sai. Nhưng theo những gì tôi quan sát..."

---

## 9. DISCLAIMER BẮT BUỘC

**Mỗi video phân tích tài chính/đầu tư PHẢI có disclaimer:**

> "Lưu ý: video này chỉ mang tính chia sẻ góc nhìn, không phải lời khuyên đầu tư. Mọi quyết định tài chính, anh em tự chịu trách nhiệm."

---

## 10. CHECKLIST ANALYTICAL

- [ ] Ít nhất 1 phép tính cụ thể?
- [ ] Số liệu có nguồn hoặc "ước tính"?
- [ ] Đã phân tích chi phí cơ hội?
- [ ] Có disclaimer đầu tư?
- [ ] Có nhiều scenario (tốt/xấu/trung bình)?
- [ ] Thuật ngữ chuyên ngành đã giải thích?
- [ ] Nhịp điệu đan xen (không đều)?
- [ ] ĐÃ BỎ "Nguyên nhân 1,2,3" / "Bước 1,2,3"?
- [ ] Có "khoảng trống" trong cách trình bày?
- [ ] Có giọng tác giả cá nhân?

---

**Phiên bản:** 2.0.0
**Cập nhật:** 2026-07-27
**Lý do:** Bổ sung §7 Anti-Labeling, §8 Giọng tác giả trong Analytical.
**Dựa trên:** 14/50 script + feedback người dùng
**Sử dụng cùng:** `finance-core.md`, `finance-hooks.md`
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 5. finance-psychology.md v2
# ═══════════════════════════════════════════════════════════════════════════════
PSYCHOLOGY_V2 = r'''# finance-psychology.md — DNA NHÁNH C: TÂM LÝ XÃ HỘI — PHIÊN BẢN 2

> **Áp dụng cho:** Video xoay quanh cảm xúc, áp lực đồng trang lứa, khủng hoảng ý nghĩa, tâm lý tiêu dùng.
>
> **Cập nhật v2 (2026-07-27):** Điều chỉnh §2 tông giọng (thêm "tone người kể chuyện"), bổ sung §11 "Anti-Labeling trong Tâm lý", §12 "Giọng tác giả mạnh" (vì đây là nhánh CẢM XÚC nhất).
>
> **9/50 script** thuộc nhánh này.

---

## 1. ĐẶC ĐIỂM NHẬN DẠNG

### 1.1. Pattern tiêu đề

| Pattern | Ví dụ |
|---|---|
| "Làm Gì Khi + [tình huống tâm lý]" | "Làm Gì Khi Bạn Bè Đều Đã Giàu?" |
| "Làn Sóng + [hiện tượng]" | "Làn Sóng Bỏ Việc Văn Phòng" |
| "Vì Sao + [cảm xúc/tâm lý]" | "Vì Sao Người Giàu Không Sợ Thất Bại" |

### 1.2. Đặc điểm nội dung

- Xoay quanh cảm xúc, tâm lý — KHÔNG phải con số.
- Câu hỏi mở.
- Thấu cảm là chính, phân tích là phụ.
- Có câu chuyện đời thật chiếm 50-60% nội dung.
- Kết thúc bằng sự đồng cảm.

---

## 2. TÔNG GIỌNG RIÊNG — BA TONE CHÍNH

### 2.1. Tone 1 — Thấu cảm (mềm, chậm, thật lòng)

> "Tôi hiểu. Thật sự là tôi hiểu. Cái cảm giác ấy — mỗi lần lướt Facebook thấy bạn cũ đăng ảnh du lịch Châu Âu, còn mình thì đang cân nhắc 200 nghìn tiền grab — nó không phải ghen tị. Nó là một thứ gì đó nặng hơn, sâu hơn. Nó gặm mình từng đêm."

### 2.2. Tone 2 — Khẳng định (sắc, dứt khoát)

> "Không có ai là người xấu khi muốn giàu. Không có ai là kẻ hời hợt khi muốn sống tốt hơn. Nhưng cách chúng ta ĐUỔI THEO nó, có thể đang phá hủy chính mình."

### 2.3. Tone 3 — Đồng hành (người anh đi trước)

> "Tôi không biết hoàn cảnh của anh em. Có thể anh em đang khó khăn hơn tôi nghĩ. Có thể anh em đang gồng gánh cả gia đình. Tôi không phán xét. Tôi chỉ nói: mình từng ở đó, mình đã đi qua, và đây là những gì mình học được."

### 2.4. Tone 4 — Người kể chuyện (NHANH MỚI)

Đây là **tone cao cấp nhất** — khi kể chuyện, KHÔNG phải kể "sự kiện" mà kể "cảm xúc".

> ❌ "Minh năm nay 28 tuổi. Minh có lương 15 triệu. Minh muốn mua nhà."
>
> ✅ "Minh, 28 tuổi. Mỗi đêm Minh nằm trằn trọc. Lương 15 triệu. Tiền nhà, tiền điện, tiền nuôi em. Tài khoản đầu tháng còn 3 triệu. Minh không dám kể ai. Người ta chỉ thấy Minh cười trên Facebook."

---

## 3. CẤU TRÚC SCRIPT TÂM LÝ

```
[0:00 - 0:30] HOOK MỞ
[0:30 - 2:00] KỂ CHUYỆN CÁ NHÂN
[2:00 - 4:00] ĐẶT TÊN VẤN ĐỀ
[4:00 - 7:00] PHÂN TÍCH GỐC RỄ
[7:00 - 8:30] GÓC NHÌN MỚI / TÁI ĐỊNH NGHĨA
[8:30 - 9:30] HÀNH ĐỘNG NHẸ NHÀNG
[9:30 - 10:00] ĐÚC KẾT CẢM XÚC + CTA
```

---

## 4. CÂU CHUYỆN CÁ NHÂN — TRỌNG TÂM NHÁNH NÀY

### 4.1. Tỷ lệ khuyến nghị

**Nhánh Tâm lý:** 50-60% thời lượng là câu chuyện cá nhân.

### 4.2. Cấu trúc câu chuyện "3 tầng"

```
[Tầng 1 — BỀ MẶT]
"Có một bạn tên Minh, 28 tuổi, lương 15 triệu. Hôm nay Minh lên Facebook, thấy bạn cùng lớp đăng ảnh cưới."

[Tầng 2 — CẢM XÚC]
"Minh kéo xuống tiếp. Thấy bạn cũ đăng ảnh mua căn hộ 3 tỷ. Minh không nói gì, nhưng bụng cồn cào. Một thứ cảm giác khó tả — không phải ghét, không phải ghen, mà là một thứ gì đó như 'mình đang ở đâu trên cuộc đời này?'"

[Tầng 3 — CHUYỂN HÓA]
"Minh ngồi đó 10 phút. Rồi Minh tắt điện thoại. Không phải vì không quan tâm. Mà vì Minh biết: so sánh bản thân với bạn bè trên mạng xã hội là tự hại mình."
```

### 4.3. Kỹ thuật "tôi cũng vậy"

> "Tôi không phải người hoàn hảo. Tôi cũng từng: mua đồ không cần vì thấy người ta có, cân nhắc 200k tiền grab, so sánh thu nhập với bạn bè. Tôi không kể để khoe mình đã sửa. Tôi kể để anh em biết: những sai lầm đó — ai cũng mắc. Anh em không cô đơn."

---

## 5. CÁCH GIẢI THÍCH TÂM LÝ HỌC

### 5.1. Quy tắc dịch thuật ngữ

| Thuật ngữ | Cách nói thường |
|---|---|
| FOMO | "Sợ lỡ. Sợ người khác đi trước mình." |
| Cognitive Dissonance | "Não bộ mình tự lừa mình. Mình tin một thứ, nhưng làm thứ khác." |
| Social Comparison | "Mình đánh giá bản thân qua người khác." |

---

## 6. CÁCH ĐƯA HÀNH ĐỘNG MÀ KHÔNG "DẠY ĐỜI"

### 6.1. Quy tắc "gợi mở, không ép"

> ❌ "Anh em phải dừng so sánh với người khác."
>
> ✅ "Nếu anh em thấy mình đang so sánh nhiều quá, có một cách nhỏ thôi: thử tắt thông báo Facebook 1 tuần. Xem cuộc sống thay đổi gì không. Tôi không bảo anh em phải làm."

### 6.2. 3 bước "nhẹ nhàng"

- **Bước 1 — Quan sát:** "Tuần này, mỗi khi cảm thấy muốn mua gì, hãy ghi vào sổ: 'Mình muốn mua X, vì Y'. Không cần mua, không cần dừng. Chỉ ghi."
- **Bước 2 — Đặt câu hỏi:** "Anh em có câu hỏi này chưa: 'Nếu không ai biết, mình có vẫn muốn cái này không?'"
- **Bước 3 — Cho phép mình:** "Anh em không cần hoàn hảo. Mỗi ngày, tốt hơn 1% thôi."

---

## 7. CHỐNG LIỆT KÊ CỨNG NHẮC TRONG TÂM LÝ

### 7.1. Cấm

- "Ba nguồn gốc của...", "4 yếu tố dẫn đến..."
- "Bước 1, 2, 3 để khắc phục..."
- "Tâm lý thứ nhất, thứ hai..."

### 7.2. THAY BẰNG

| ❌ Cấm | ✅ Thay bằng |
|---|---|
| "Ba nguồn gốc..." | "Có mấy thứ đan lại với nhau. Thứ mà ít ai nhắc là..." |
| "Bước 1,2,3" | "Anh em thử cái này trước... Rồi nếu được..." |
| "Có 4 lý do" | "Anh em biết không, cái mà tôi thường thấy là..." |

---

## 8. GIỌNG TÁC GIẢ MẠNH NHẤT — ĐÂY LÀ NHÁNH CẢM XÚC

### 8.1. Tại sao nhánh Tâm lý cần giọng tác giả MẠNH NHẤT

Vì nhánh này nói về CẢM XÚC. Cảm xúc chỉ thuyết phục khi NGƯỜI KỂ cũng có cảm xúc thật. Không thể nói "tôi hiểu" mà giọng lạnh như robot.

### 8.2. Kỹ thuật

- **"Tôi nhớ cảm giác đó..."**
- **"Đêm đó tôi không ngủ được..."**
- **"Tôi không biết nói sao, nhưng..."**
- **"Có một khoảnh khắc tôi không quên được..."**
- **Im lặng có chủ đích:** "Anh em ơi... có một điều mà tôi không biết nói sao cho đúng..."

### 8.3. Ví dụ

> "Anh em biết không, có một đêm tôi ngồi một mình trong phòng trọ. Điện thoại cứ chớp liên tục. Ai cũng đăng ảnh khoe thành công. Tôi ngồi đó, 11 giờ đêm, lương tháng đã hết, tài khoản còn 2 triệu. Tôi không khóc. Nhưng tôi nhớ cảm giác ấy. Và hôm nay, tôi muốn nói với anh em một điều."

---

## 9. CÂU VÀNG TINH THẦN

- "Không ai sống cuộc đời của anh em thay anh em."
- "Mạng xã hội là rạp hát. Anh em là khán giả."
- "So sánh với người khác là tự hại mình. So sánh với mình 1 năm trước là tự trưởng thành."
- "Hạnh phúc không phải đích đến. Hạnh phúc là cách mình đi."

---

## 10. CHECKLIST TÂM LÝ

- [ ] Có câu chuyện cá nhân chiếm ≥40% thời lượng?
- [ ] Có thấu cảm (không dạy đời)?
- [ ] Có "đặt tên" cảm xúc?
- [ ] Có góc nhìn mới?
- [ ] Hành động NHẸ NHÀNG, cụ thể?
- [ ] ĐÃ BỎ "Bước 1,2,3" / "3 nguyên nhân"?
- [ ] Có giọng tác giả cảm xúc? ("tôi nhớ...", "tôi không biết nói sao...")
- [ ] Có "khoảng trống" (im lặng, câu hỏi treo)?
- [ ] Có dịch thuật ngữ tâm lý sang đời thường?
- [ ] Nhịp điệu đan xen?

---

**Phiên bản:** 2.0.0
**Cập nhật:** 2026-07-27
**Lý do:** Bổ sung §2.4 Tone Người kể chuyện, §7 Anti-Labeling, §8 Giọng tác giả mạnh (nhánh cảm xúc cao nhất).
**Dựa trên:** 9/50 script + feedback người dùng
**Sử dụng cùng:** `finance-core.md`, `finance-hooks.md`
'''

# ═══════════════════════════════════════════════════════════════════════════════
# 6. finance-mythbusting.md v2
# ═══════════════════════════════════════════════════════════════════════════════
MYTHBUSTING_V2 = r'''# finance-mythbusting.md — DNA NHÁNH D: BÓC PHỐT / MYTH-BUSTING — PHIÊN BẢN 2

> **Áp dụng cho:** Video vạch trần lầm tưởng, cảnh báo bẫy, "bóc phốt" mô hình lừa đảo.
>
> **Cập nhật v2 (2026-07-27):** Bổ sung §11 "Anti-Labeling trong Myth-busting", §12 "Giọng tác giả Myth-busting" (cần sắc mà không công kích).
>
> **4/50 script thuần + ~14/50 script có yếu tố myth-busting.**

---

## 1. ĐẶC ĐIỂM NHẬN DẠNG

### 1.1. Pattern tiêu đề

| Pattern | Ví dụ |
|---|---|
| "[N] khoản CHI TIÊU... Lãng Phí" | #8 |
| "Sự Thật Về + [ngành]" | "Sự Thật Về Ngành Bán Khóa Học" |
| "Vì Sao + [hiện tượng] Đang..." | "Vì Sao 80% Quán Cà Phê Đóng Cửa" |

### 1.2. Đặc điểm nội dung

- Vạch trần một lầm tưởng phổ biến.
- Có số liệu, bằng chứng.
- Gay gắt nhưng có căn cứ.
- Có "phép tính ngược".

---

## 2. TÔNG GIỌNG — SẮC NHƯNG KHÔNG CÔNG KÍCH

### 2.1. Giọng chuẩn

- Sắc, dứt khoát, không né tránh.
- Giống công tố viên trình bày bằng chứng — không phải đám đông hô hào.
- Có căn cứ rõ ràng.
- Có giới hạn — chỉ ra SAI, không biến tất cả thành XẤU.

### 2.2. Mẫu câu đặc trưng

> "Sự thật phũ phàng là: thứ anh em đang tin, không phải sự thật."
>
> "Nhiều năm qua, tôi cũng tin điều này. Cho đến khi tôi tự cầm bút ra tính."
>
> "Không phải tất cả [X] đều xấu. Nhưng cơ chế của nó, khiến X% người tham gia sẽ thua."

---

## 3. CẤU TRÚC SCRIPT MYTH-BUSTING

```
[0:00 - 0:30] HOOK MỞ
[0:30 - 1:30] LẦM TƯỞNG PHỔ BIẾN
[1:30 - 3:30] BẰNG CHỨNG NGƯỢC
[3:30 - 6:30] PHÂN TÍCH CƠ CHẾ GỐC
[6:30 - 8:00] HỆ QUẢ THỰC TẾ
[8:00 - 9:00] GIẢI PHÁP / CÁCH LÀM ĐÚNG
[9:00 - 9:30] DISCLAIMER
[9:30 - 10:00] ĐÚC KẾT + CTA
```

---

## 4. CÁCH MỞ ĐẦU VIDEO MYTH-BUSTING

### 4.1. 5 kiểu mở đầu phổ biến

**Mẫu 1 — Đập tan lầm tưởng ngay:**
> "Anh em tin rằng mua khóa học là đầu tư? Sai. 80% số tiền đó là lãng phí."

**Mẫu 2 — Kể chuyện bản thân "sai":**
> "Tôi từng tin 'đầu tư vào bản thân' là số 1. Tôi đã mua 12 khóa học trong 2 năm. Tổng 40 triệu. Kết quả? 1 cái áp dụng được. Hôm nay tôi nói thẳng."

**Mẫu 3 — Quan sát xung quanh:**
> "Anh em đi đâu cũng nghe: 'mua khóa học đi, đầu tư cho tương lai'. Câu hỏi: bao nhiêu người thực sự thay đổi sau khóa học?"

---

## 5. PHÂN TÍCH CƠ CHẾ — KỸ THUẬT QUAN TRỌNG NHẤT

### 5.1. Quy tắc "Tại sao lầm tưởng tồn tại"

Mỗi video myth-busting nên trả lời **3 câu hỏi**:

```
Câu 1: LẦM TƯỞNG LÀ GÌ?
Câu 2: TẠI SAO NÓ TỒN TẠI?
Câu 3: SỰ THẬT LÀ GÌ?
```

### 5.2. 7 cơ chế tạo ra lầm tưởng

**Cơ chế 1 — Survivorship Bias:**
> "Anh em thấy 1 tỷ phú tự thân khoe 'tôi bỏ học đại học để khởi nghiệp'. Nhưng 100 triệu người bỏ học khác, anh em không thấy. **Một người thành công, một trăm triệu người thất bại — và chỉ người thành công có mic.**"

---

## 6. CÁCH DÙNG BẰNG CHỨNG

### 6.1. 4 loại bằng chứng

**Loại 1 — Số liệu chính thức:**
> "Theo Tổng cục Thống kê, 91.800 doanh nghiệp đóng cửa trong Q1/2026."

**Loại 2 — Khảo sát có uy tín:**
> "Theo khảo sát của Nielsen, 60% người mua khóa học online KHÔNG hoàn thành."

**Loại 3 — Case study:**
> "Một bạn tôi quen, mở quán café tháng 6/2025, đóng cửa tháng 12/2025. Tổng lỗ: 350 triệu."

**Loại 4 — Phép tính ngược:**
> "Anh em bỏ 5 triệu mua khóa học. Để hòa vốn, anh em cần kiếm thêm 5 triệu từ khóa học đó."

---

## 7. CHỐNG LIỆT KÊ CỨNG NHẮC TRONG MYTH-BUSTING

### 7.1. Cấm

- "3 lý do tại sao...", "4 bằng chứng cho thấy..."
- "Bước 1: Vạch trần..., Bước 2: Phân tích..."
- "Bằng chứng thứ nhất, thứ hai..."

### 7.2. THAY BẰNG

| ❌ Cấm | ✅ Thay bằng |
|---|---|
| "3 lý do..." | "Có một thứ mà tôi thường thấy..." |
| "Bước 1..." | "Để tôi nói rõ..." |
| "Bằng chứng thứ nhất..." | "Anh em nghe cái này..." |

---

## 8. GIỌNG TÁC GIẢ TRONG MYTH-BUSTING

### 8.1. Sắc nhưng không "nóng"

Script myth-busting hay nhất không phải giọng giận dữ mà là giọng **thất vọng nhẹ nhàng** — như người anh nhìn em mình sắp sửa mắc bẫy.

> ❌ "Đây là trò lừa đảo! Đừng bao giờ đụng vào!"
>
> ✅ "Anh em biết không, có một thứ mà tôi thấy nhiều người rơi vào. Tôi cũng từng ở đó. Và tôi nhận ra: không phải vì anh em ngu. Mà vì có một cơ chế rất tinh vi đằng sau nó."

### 8.2. Kỹ thuật "tôi cũng từng"

> "Tôi từng tin 'đầu tư vào bản thân' là mua khóa học. Tôi mua 12 cái. Biết tôi học được bao nhiêu không? 1. Và cái 1 đó tôi cũng phải tự mày mò thêm 6 tháng mới áp dụng được. Đó là lúc tôi hiểu: vấn đề không phải ở khóa học. Vấn đề là ở cách mình tiếp cận."

---

## 9. DISCLAIMER QUAN TRỌNG

> "Lưu ý: tôi không khẳng định 100% [X] đều xấu. Có những người làm [X] đúng cách, có kết quả tốt. Nhưng cơ chế của [X] khiến X% người tham gia sẽ thua. Tôi nói video này để anh em CÓ THÔNG TIN TRƯỚC KHI QUYẾT ĐỊNH."

---

## 10. CHECKLIST MYTH-BUSTING

- [ ] Đã nêu rõ LẦM TƯỞNG?
- [ ] Có ít nhất 2-3 BẰNG CHỨNG NGƯỢC?
- [ ] Đã phân tích CƠ CHẾ GỐC?
- [ ] Có GIẢI PHÁP ĐÚNG?
- [ ] Có DISCLAIMER cân bằng?
- [ ] ĐÃ BỎ "3 lý do/Bằng chứng thứ nhất"?
- [ ] Giọng sắc mà không công kích cá nhân?
- [ ] Có "tôi cũng từng" để tạo kết nối?
- [ ] Có nhịp điệu đan xen?
- [ ] Có câu vàng memorable?

---

**Phiên bản:** 2.0.0
**Cập nhật:** 2026-07-27
**Lý do:** Bổ sung §7 Anti-Labeling, §8 Giọng tác giả Myth-busting (sắc nhưng không công kích).
**Dựa trên:** 4/50 script + ~14/50 có yếu tố myth-busting + feedback người dùng
**Sử dụng cùng:** `finance-core.md`, `finance-hooks.md`
'''

# ═══════════════════════════════════════════════════════════════════════════════
# Write all files
# ═══════════════════════════════════════════════════════════════════════════════
wr(os.path.join(OUT_DIR, 'finance-core.md'), CORE_V2)
wr(os.path.join(OUT_DIR, 'finance-hooks.md'), HOOKS_V2)
wr(os.path.join(OUT_DIR, 'finance-listicle.md'), LISTICLE_V2)
wr(os.path.join(OUT_DIR, 'finance-analytical.md'), ANALYTICAL_V2)
wr(os.path.join(OUT_DIR, 'finance-psychology.md'), PSYCHOLOGY_V2)
wr(os.path.join(OUT_DIR, 'finance-mythbusting.md'), MYTHBUSTING_V2)

print("\nAll 6 files written.")
