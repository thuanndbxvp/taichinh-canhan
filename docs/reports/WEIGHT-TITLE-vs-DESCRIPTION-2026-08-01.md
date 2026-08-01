# 📊 Báo cáo Phân tích: Trọng lượng Tiêu đề vs Mô tả khi truyền vào AI viết kịch bản

> **Ngày:** 2026-08-01  
> **Tier:** 2 (Engineer) — Phân tích ad-hoc theo yêu cầu Planner  
> **Phạm vi:** Cơ chế truyền tham số `title` (Tiêu đề) và `outlineContent` (Mô tả / Yêu cầu nội dung từ đạo diễn) vào các prompt AI sinh kịch bản tài chính.  
> **Source of truth:** `src/services/ai/prompts/index.ts` (đã đọc trực tiếp, không qua cache), `types.ts`, `AUDIT-REPORT.md`.

---

## 1. Ánh xạ: "Tiêu đề" và "Mô tả" trong codebase là gì?

Hệ thống KHÔNG có 2 field song song như mô hình YouTube Title/Description. Thay vào đó, dữ liệu đầu vào của AI gồm 5 trường trong `GenerationParams` (`types.ts:65-78`):

| Tên sếp quen gọi | Tên trong code | `types.ts` | Loại dữ liệu | Bắt buộc? | Đường đi vào AI |
|------------------|----------------|------------|----------------|-----------|----------------|
| **Tiêu đề** | `title` | dòng 66 | `string` (~5-80 ký tự) | ✅ Bắt buộc | User prompt mọi prompt |
| **Mô tả** | `outlineContent` | dòng 67 | `string` (0-2000+ ký tự, optional) | ⬜ Tự nguyện | Block riêng có nhãn "TRỌNG SỐ CAO NHẤT" |
| *(ẩn)* Style | `styleOptions` | dòng 69 | `{expression, style}` | ✅ | User prompt + system prompt |
| *(ẩn)* Ngôn ngữ | `targetAudience` | dòng 68 | `string` | ✅ | User prompt |
| *(ẩn)* Macro data | `macroContext` | dòng 77 | `string` (kết quả research) | ⬜ (qua deep research) | System prompt (`buildFinanceSystemPrompt`) |

→ Khi sếp hỏi "Tiêu đề vs Mô tả", em hiểu là `title` vs `outlineContent`.

---

## 2. Trọng số hiện tại theo prompt `finance.script.outline`

> File: `src/services/ai/prompts/index.ts:177-230` — đây là prompt **outline** quan trọng nhất (sinh dàn ý 5 phần trước khi viết kịch bản).

### 2.1. Trường hợp KHÔNG có `outlineContent` (rỗng)

User prompt line 223-225:

```
CHỦ ĐỀ CHÍNH: "${title}"
NGÔN NGỮ: ${targetAudience}
PHONG CÁCH: ${style}
```

→ AI nhận `title` làm **neo duy nhất**, tự do sáng tạo 5 phần theo template cứng (PHẦN 1 → PHẦN 5, line 195-199).

### 2.2. Trường hợp CÓ `outlineContent` (người dùng nhập)

User prompt line 183-185 (đoạn **dynamic** chèn vào giữa template và biến `${userRequirements}`):

```typescript
const userRequirements = outlineContent
  ? `\n\nYÊU CẦU NỘI DUNG TỪ ĐẠO DIỄN (TRỌNG SỐ CAO NHẤT):
"${outlineContent}"
-> HƯỚNG DẪN: Lấy "Chủ đề" làm móng, nhưng BẮT BUỘC phải lồng ghép 
   tất cả các ý trong "Yêu cầu nội dung" này vào các phần của Dàn ý 
   sao cho mạch lạc và hợp lý nhất.`
  : '';
```

→ AI nhận:
- `title` = **móng** (xương sống 5 phần).
- `outlineContent` = **lệnh bắt buộc lồng ghép** (mọi ý trong đây phải xuất hiện ở đâu đó trong dàn ý).

→ Nhãn **"TRỌNG SỐ CAO NHẤT"** được đặt ngay đầu block → kỹ thuật prompt engineering: nhấn mạnh priority ngay dòng đầu để LLM attention tốt hơn.

---

## 3. Thứ tự ưu tiên (ranking trọng số thực tế)

| # | Nguồn dữ liệu | Vai trò ngữ nghĩa | Prompt tag (literal) | Trọng số ước lượng |
|---|----------------|--------------------|----------------------|-------------------:|
| 1 | `outlineContent` (nếu có) | **Lệnh tối cao** — AI PHẢI lồng ghép | `"YÊU CẦU NỘI DUNG TỪ ĐẠO DIỄN (TRỌNG SỐ CAO NHẤT)"` | **90%** |
| 2 | `title` | **Móng luận điểm** — chủ đề xuyên suốt | `"CHỦ ĐỀ CHÍNH"` | **80%** |
| 3 | `macroContext` (qua system prompt) | **Bằng chứng số liệu** — luật thép cấm bịa | `"DỮ LIỆU VĨ MÔ/NGHIÊN CỨU"` (line 205) | **100% cứng** |
| 4 | `styleOptions` | Tông giọng + phong cách viết | `"PHONG CÁCH"` | **40%** |
| 5 | `targetAudience` | Ngôn ngữ + đối tượng khán giả | `"NGÔN NGỮ"` | **30%** |
| 6 | `wordCount` | Độ dài kịch bản (tham chiếu) | `"Kịch bản dự kiến dài ${wordCount} từ"` (line 212) | **20%** |

> **Lưu ý:** Trọng số ước lượng là đánh giá theo **vị trí** trong prompt + **cường độ ngôn ngữ** ("BẮT BUỘC", "TRỌNG SỐ CAO NHẤT", "LUẬT THÉP"). LLM không có khái niệm "phần trăm", nhưng vị trí trên cùng + ngôn ngữ mệnh lệnh → attention cao hơn.

---

## 4. Phân tích phân bố: Có lệch không?

**Trả lời ngắn: CÓ LỆCH — nghiêng về `outlineContent` khi người dùng nhập dài.**

### 4.1. `title` hiện đang được dùng như "anchor" mỏng

- Chỉ xuất hiện **1 lần** trong user prompt của outline (line 223).
- **Không có hướng dẫn diễn giải title** — AI phải tự suy luận khía cạnh, branch, hook.
- Nếu title mơ hồ (VD: `"Lãi kép"`) → AI phải tự chọn branch (analytical / psychology / mythbusting) qua prompt khác (`finance.topic.classify`, line 121-153), hook tự chọn (story / data / myth / question).
- Title không có **"quyền phủ quyết"** khi xung đột với outlineContent.

### 4.2. `outlineContent` hiện "nuốt" gần hết nội dung

- Cả block 6 dòng hướng dẫn AI cách dùng outlineContent (line 184) → **dài hơn cả title block**.
- Nếu user copy-paste nguyên 1 bài báo 5000 từ → prompt phình to, AI "đọc" hết nhưng phải ép vào 5 phần ngắn → **mất chiều sâu, dàn ý nông**.
- Nếu outlineContent là 1 câu ngắn → AI bị "thiếu neo", bơi giữa các cách diễn giải.
- **Không có giới hạn ký tự** ở tầng UI hay backend — user có thể nhập tùy ý.

### 4.3. Không có cơ chế "tỉ lệ vàng"

Hiện tại `outlineContent` nếu tồn tại sẽ **áp đảo** `title` (do có cả block hướng dẫn riêng + nhãn "TRỌNG SỐ CAO NHẤT"). Không có câu nào trong prompt nói: *"Nếu outlineContent xung đột với title → ưu tiên title"*.

---

## 5. Ma trận rủi ro thực tế

| Tình huống | Trọng số `title` | Trọng số `outlineContent` | Hệ quả | Mức rủi ro |
|------------|------------------:|--------------------------:|--------|:----------:|
| Title rõ + Outline **rỗng** | 100% | 0% | AI tự do, chất lượng phụ thuộc vào title | 🟢 Thấp |
| Title rõ + Outline **ngắn** (1-2 câu) | ~60% | ~40% | Outline "xiên" title theo hướng người dùng | 🟡 Trung bình |
| Title rõ + Outline **dài** (đoạn văn 500-2000 từ) | ~20% | ~80% | Outline nuốt title; dàn ý bám sát bài user paste | 🟠 Cao |
| Title mơ hồ + Outline dài | ~10% | ~90% | Title bị bỏ qua hoàn toàn; AI chỉ viết về outline | 🔴 Rất cao |
| Title và Outline **xung đột** (hiếm) | không rõ | không rõ | Không có quy tắc giải quyết → AI tự chọn | 🔴 Rất cao |

---

## 6. So sánh với prompt `finance.research.*` (deep research pipeline)

Cùng pattern "title + outlineContent" lặp lại ở 3 prompt khác:

- **`finance.research.synthesis`** (`prompts/index.ts:749-762`): `title` + `outlineContent` được chèn vào user prompt khi tổng hợp dữ liệu web.
- **`finance.research.factcheck`** (line 767-780): chỉ có `title` + `researchSummary`.
- **`finance.research.revise`** (line 785-798): chỉ có `title` + `researchSummary` + `critique`.

→ **Pattern nhất quán**: `title` luôn là "anchor ngắn", và mọi field có nội dung dài đều được đưa vào kèm nhãn mệnh lệnh.

→ Đây là **chủ đích thiết kế**: title là input cố định (user phải nhập), outlineContent là optional extension (user có thể bỏ trống hoặc viết dài tùy ý).

---

## 7. Khuyến nghị (3 phương án)

### Phương án A — Giữ nguyên (Recommended nếu intent là "OutlineContent = chỉ đạo của đạo diễn")

Không thay đổi gì. Hệ thống đang đúng với intent:
- Title = **khung chủ đề cố định**.
- OutlineContent = **đạo diễn viết kịch bản trước, AI chỉ lồng ghép**.

### Phương án B — Cân bằng lại bằng prompt engineering

Sửa `finance.script.outline` line 184 (chỉ thêm vài câu):

```typescript
// Trước:
const userRequirements = outlineContent
  ? `\n\nYÊU CẦU NỘI DUNG TỪ ĐẠO DIỄN (TRỌNG SỐ CAO NHẤT):
"${outlineContent}"
-> HƯỚNG DẪN: Lấy "Chủ đề" làm móng, nhưng BẮT BUỘC phải lồng ghép 
   tất cả các ý trong "Yêu cầu nội dung" này vào các phần của Dàn ý 
   sao cho mạch lạc và hợp lý nhất.`
  : '';

// Sau (thêm 3 câu):
const userRequirements = outlineContent
  ? `\n\nYÊU CẦU NỘI DUNG TỪ ĐẠO DIỄN (TRỌNG SỐ CAO NHẤT):
"${outlineContent}"
-> HƯỚNG DẪN:
   1. Lấy "Chủ đề" (title) làm XƯƠNG SỐNG duy nhất xuyên suốt 5 phần.
   2. Lồng ghép các ý trong "Yêu cầu nội dung" vào các phần, 
      nhưng KHÔNG ĐƯỢC phép làm lệch luận điểm chính của "Chủ đề".
   3. Nếu "Yêu cầu nội dung" xung đột với "Chủ đề" → ƯU TIÊN "Chủ đề".
   4. Giữ outlineContent dưới 800 ký tự (khuyến nghị); nếu dài hơn 
      → chỉ lấy 3 ý chính nhất.`
  : '';
```

**Ưu điểm:** Không đổi API, không đổi UI, không đổi `types.ts`. Chỉ 1 file sửa.  
**Nhược điểm:** Vẫn không có giới hạn cứng ở UI — user có thể paste 5000 từ.

### Phương án C — Phân chia zone rõ ràng + giới hạn cứng

- **Title** → quyết định `branch` (analytical/psychology/mythbusting/listicle) + `hook` (story/data/myth/question).
- **OutlineContent** → quyết định **dàn ý chi tiết từng phần**, không đụng vào nhánh/hook.
- **UI:** thêm `maxLength={800}` cho textarea `outlineContent` ở `ControlPanel.tsx`.
- **Backend:** thêm guard ở `useGenerationWorkflow.ts` cắt `outlineContent.length > 1500` + cảnh báo.

**Ưu điểm:** Có "hợp đồng" rõ ràng giữa 2 field. Không có rủi ro "outline nuốt title".  
**Nhược điểm:** Đụng 3-4 file, cần plan riêng, có thể ảnh hưởng UX (giới hạn ký tự).

---

## 8. Đề xuất hành động tiếp theo

1. **Trước mắt:** Không sửa — chờ Planner quyết phương án.
2. **Nếu chọn B:** 1 file sửa (`prompts/index.ts:184`), không cần MSEW riêng.
3. **Nếu chọn C:** cần MSEW mới (đụng `ControlPanel.tsx`, `useGenerationWorkflow.ts`, `prompts/index.ts`, có thể đụng `types.ts`).
4. **Đo lường:** Sau khi sửa, cần test thực tế với 4 case trong ma trận §5 để xác nhận trọng số đã cân bằng.

---

## 9. Evidence

- Đã đọc trực tiếp `src/services/ai/prompts/index.ts:177-230` (prompt outline), `:749-799` (research pipeline).
- Đã đọc `types.ts:65-78` (interface `GenerationParams`).
- Đã đọc `AUDIT-REPORT.md:9-176` để hiểu ngữ cảnh (đổi `macroContext` từ `fetchMacroData` → `performDeepResearch`, xóa `[CẦN ĐIỀN]`).
- Đã xác nhận `finance.script.outline` chưa có cơ chế "ưu tiên title khi xung đột".

---

**— Tier 2, kết thúc phân tích ad-hoc. Chờ Planner quyết phương án trước khi code.**