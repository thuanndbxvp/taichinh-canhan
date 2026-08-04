# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 1 - Phase 2 (Prompt Engine & Humanizer)

---

### BƯỚC 1: Xây dựng các hàm Humanizer và Rewriting Prompt trong `src/services/ai/prompts/index.ts`
- **File:** `src/services/ai/prompts/index.ts`
- **Thực hiện:** Thêm các hàm `buildGenerationHumanizerBlock`, `buildRewritingHumanizerBlock`, và `buildRewritingSystemPrompt` vào phần đầu file (dưới các hàm getBranchDna/getHookDna):

```typescript
export function buildGenerationHumanizerBlock(): string {
  return `
=== BỘ LỌC TẨY RỬA MÙI VĂN AI (HUMANIZER RULES — 11 QUY TẮC CỐT LÕI) ===
1. CẤM TỪ VỰNG AI (§7): Cấm dùng "cực kỳ", "vô cùng", "tuyệt đối", "đáng chú ý", "bức tranh toàn cảnh", "minh chứng rõ nét", "chìa khóa vàng", "ngọn hải đăng", "cột mốc quan trọng".
2. CẤM ĐIỆP TỪ MÁY MÓC (§9): Cấm cấu trúc "Không chỉ... mà còn...", "Không những... mà còn...". Thay bằng 2 câu độc lập hoặc nối tự nhiên.
3. GIỚI HẠN DẤU EM-DASH (§14): Tối đa 2 dấu gạch ngang (—) trong toàn bộ 1 phần kịch bản. Ưu tiên dùng dấu phẩy hoặc tách câu.
4. CẤM 100% EMOJI (§18): Tuyệt đối KHÔNG chứa emoji (🚀, 💡, ⚠️, 📊...) trong lời thoại kịch bản.
5. CẤM FILLER PHRASES (§23): Cấm "Cần lưu ý rằng", "Điều quan trọng là", "Như chúng ta đã biết", "Có thể nói rằng". Cắt thẳng vào vấn đề.
6. CẤM SIGNPOSTING (§28): Cấm "Ở phần này tôi sẽ nói về...", "Tiếp theo chúng ta cùng tìm hiểu...". Chuyển ý tự nhiên bằng logic.
7. CẤM STACCATO DRAMA (§31): Cấm chuỗi 3+ câu ngắn liên tiếp cụt lủn cố tạo drama (Ví dụ: "Họ sợ. Rất sợ. Nhưng đã muộn."). Viết câu tự nhiên, mạch lạc, có chủ vị đầy đủ.
8. CẤM ĐẠO LÝ SÁO RỖNG (§32): Cấm câu chốt đạo lý chung chung ("Hãy là nhà đầu tư thông minh"). Mọi lời khuyên phải gắn liền với hành động tài chính cụ thể.
9. CẤM BẢN MẪU RULE-OF-THREE GƯỢNG ÉP (§10): Không ép mọi thứ phải thành đúng 3 ý nếu thực tế chỉ có 2 hoặc 4 ý.
10. KHÔNG BỊA SỐ LIỆU: Chỉ sử dụng số liệu thực tế từ dữ liệu nghiên cứu hoặc nêu rõ "ước tính / giả định".
11. TỪ XƯNG HÔ: Luôn xưng "Tôi" và gọi người nghe là "Anh em" hoặc "Bạn", tối đa 8 lần "anh em"/phần.
=== KẾT THÚC BỘ LỌC HUMANIZER ===`;
}

export function buildRewritingHumanizerBlock(level: 'light' | 'deep' = 'light'): string {
  if (level === 'light') {
    return buildGenerationHumanizerBlock();
  }

  return `
=== BỘ LỌC TẨY RỬA VĂN PHONG AI TOÀN DIỆN (FULL 33 HUMANIZER RULES) ===
[NHÓM I — TỪ VỰNG & CỤM TỪ CẤM]:
1. §7: Cấm từ sáo rỗng: "cực kỳ", "vô cùng", "bức tranh toàn cảnh", "chìa khóa", "cột mốc", "minh chứng", "ngọn hải đăng", "cửa tử", "ngã rẽ".
2. §23: Cấm filler: "Cần lưu ý rằng", "Điều quan trọng là", "Như đã biết", "Thực tế cho thấy rằng".
3. §28: Cấm signposting: "Trong phần này", "Tiếp theo chúng ta sẽ", "Dưới đây là".
4. §18: Cấm 100% Emoji trong toàn bộ nội dung.

[NHÓM II — CẤU TRÚC CÂU & NGỮ PHÁP]:
5. §9: Cấm cấu trúc song song phủ định: "Không chỉ... mà còn...", "Không phải A, mà là B" lặp lại.
6. §14: Giới hạn tối đa 2 dấu em-dash (—) trên mỗi phần kịch bản.
7. §31: Cấm Staccato Drama: Tuyệt đối không ngắt dòng cụt lủn cố ý tạo kịch tính vô lý.
8. §32: Cấm Aphorism: Không đúc kết đạo lý rỗng tuếch.
9. §10: Phá vỡ Rule-of-three gượng ép: Đa dạng hóa số lượng luận điểm.
10. §12: Giảm tỷ lệ câu hỏi tu từ (Rhetorical Questions) xuống tối đa 1-2 câu/phần.

[NHÓM III — NỘI DUNG & SỐ LIỆU]:
11. §1: Xóa bỏ 100% phần giới thiệu lan man, cắt ngay vào tình huống/số liệu.
12. §2: Xóa bỏ kết luận tóm tắt lặp lại ("Tóm lại là...", "Như vậy chúng ta đã thấy...").
13. §3 & §4: BẮT BUỘC giữ hoặc bổ sung bài toán mô phỏng số liệu thực tế (tiền, lãi, thời gian).
14. §8: Biến các luận điểm chung chung thành ví dụ đời thường sống động.
=== KẾT THÚC BỘ LỌC HUMANIZER TOÀN DIỆN ===`;
}

export function buildRewritingSystemPrompt(branch?: string, level: 'light' | 'deep' = 'light'): string {
  return [
    `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]`,
    coreRaw.trim(),
    getBranchDna(branch),
    getHookDna(),
    buildRewritingHumanizerBlock(level),
  ].join('\n\n');
}
```

---

### BƯỚC 2: Cập nhật `buildFinanceSystemPrompt`
- Nhúng `buildGenerationHumanizerBlock()` vào cuối hàm `buildFinanceSystemPrompt()` để tự động kích hoạt 11 rules Humanizer cho toàn bộ luồng sinh kịch bản.

---

### BƯỚC 3: Cập nhật `finance.script.revise` và `finance.script.revise.partial`
- Trong `finance.script.revise`: Thay thế khối system prompt cũ bằng `buildRewritingSystemPrompt(style?.branch, 'light')`.
- Trong `finance.script.revise.partial`: Thay thế khối system prompt cũ bằng `buildRewritingSystemPrompt(style?.branch, 'light')`.

---

### BƯỚC 4: Cập nhật `finance.script.outline`
- **File:** `src/services/ai/prompts/index.ts`
- Cập nhật prompt `finance.script.outline` bổ sung yêu cầu:
  1. Gợi ý bài toán số liệu mô phỏng cho Phần 3 & Phần 4.
  2. BẮT BUỘC trả về khối JSON metadata ở cuối dàn ý theo đúng cấu trúc:
```
<!-- WORD_COUNT_ESTIMATION: {"minRecommendedWords": 1650, "optimalWords": 1900, "reason": "Dàn ý có 2 bài toán mô phỏng dòng tiền và so sánh phương án tài chính, cần tối thiểu 1.650 từ để giải trình chi tiết."} -->
```

---

### BƯỚC 5: Cập nhật `finance.script.part`
- **File:** `src/services/ai/prompts/index.ts`
- Bổ sung yêu cầu:
  1. Phần 3 & 4 BẮT BUỘC có 1 bài toán mô phỏng số liệu cụ thể (lãi suất, tiền gốc, thời gian, phương án A vs phương án B).
  2. Nhúng mục tiêu số từ và biên độ cho phép:
```
MỤC TIÊU DUNG LƯỢNG PHẦN NÀY: ${perPart} từ spoken.
(Biên độ cho phép: từ ${minSpoken} đến ${Math.round(perPart * 1.05)} từ)
```

---

### BƯỚC 6: Cập nhật `docs/dna/finance-core.md`
- Thêm mục `## 10. BỘ LỌC TẨY RỬA MÙI VĂN AI & BÀI TOÁN MÔ PHỎNG` nêu rõ 11 quy tắc Humanizer và cấu trúc bài toán 3 tầng.
