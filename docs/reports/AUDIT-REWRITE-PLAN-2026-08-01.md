# 🔍 AUDIT `docs/rewrite_plan.md` — Từ Tier 2 (Engineer)

> **Ngày:** 2026-08-01  
> **Người review:** Tier 2 (Engineer)  
> **Mục đích:** Trả lời 3 câu hỏi Tier 1 cần biết trước khi chốt plan: (1) Plan có khả thi không? (2) `finance.script.revise` có dùng được không? (3) Cần bổ sung gì để Tier 2 cầm lên code?  
> **Phạm vi review:** Plan, các prompt liên quan, test hiện có, system DNA.

---

## 1. TL;DR — Tier 2 verdict

| Câu hỏi Tier 1 | Trả lời |
|----------------|---------|
| Plan có khả thi không? | ✅ **Có — hướng đi đúng**, nhưng cần bổ sung 5-7 thứ trước khi Tier 2 code. |
| `finance.script.revise` có dùng được cho Rewrite Mode không? | ⚠️ **Dùng được 70%** — bugs encoding nghiêm trọng + DNA không ép cấu trúc 5 phần. |
| Cần prompt mới không? | ✅ **Có 1 prompt mới** cho Mức 3 (tóm tắt + viết lại). |
| Plan có sẵn sàng để code? | 🟡 **CHƯA** — thiếu BƯỚC X.Y, blast radius, acceptance criteria. |

→ **Đề xuất:** Tier 1 nâng cấp plan thành MSEW (hoặc ít nhất bổ sung §8 ở dưới) → Tier 2 mới cầm lên code.

---

## 2. Điểm mạnh của plan (giữ lại)

| # | Điểm mạnh | Tại sao tốt |
|---|------------|-------------|
| 1 | **Chiến lược cốt lõi rõ ràng** (plan line 7-10) | Phân tách "Tạo Mới" vs "Viết Lại" là quyết định kiến trúc đúng. Mỗi workflow có ngữ nghĩa + ràng buộc khác nhau → tách riêng là hợp lý. |
| 2 | **Kết hợp Phương án B + C** (plan line 26) | Thay vì chọn 1, Tier 1 lấy "prompt engineering" (B) làm ruột + "UI limits" (C) làm áo. Đúng tinh thần "vừa đủ, không thừa". |
| 3 | **Block "User Review Required" tách riêng** (plan line 12-18) | Tier 1 đặt đúng 2 câu hỏi cần sếp quyết trước khi code (maxLength 1500 + mức độ can thiệp Rewrite). |
| 4 | **Tái sử dụng `finance.script.revise`** (plan line 56) | Prompt đã có sẵn trong `prompts/index.ts:288-314` — không phát sinh prompt mới cho Mức 1, 2. |
| 5 | **Verification có cả automated + manual** (plan line 60-67) | Có test case xung đột thực tế (Vàng vs BĐS) ở line 66 — đúng tinh thần typist-mindset. |

---

## 3. Điểm yếu / Rủi ro Tier 2 phát hiện

### 3.1. Plan thiếu cấu trúc MSEW — 5 thứ quan trọng

| Thiếu | Tác động | Mức ưu tiên |
|-------|----------|:-----------:|
| **Số bước cụ thể** (BƯỚC 1, 2, 3...) | Tier 2 không biết thứ tự thi công | 🔴 Bắt buộc |
| **Tên file tuyệt đối** (`src/...` thay vì `components/...`) | `ControlPanel.tsx` ở `src/components/` hay `src/features/`? | 🔴 Bắt buộc |
| **Diff mẫu / code snippet tham khảo** | Tier 2 phải tự nghĩ cách implement | 🟡 Khuyến nghị |
| **Acceptance Criteria** ("Done khi...") | Không biết khi nào "đủ" | 🟡 Khuyến nghị |
| **Blast radius check** | Có thể đụng file ngoài danh sách | 🟡 Khuyến nghị |

### 3.2. Rủi ro kỹ thuật đã verify trực tiếp từ code

#### 🐛 Finding #1 — System prompt `finance.script.revise` bị lỗi encoding ký tự tiếng Việt

**File:** `src/services/ai/prompts/index.ts:298-306` (DNA v3 của `finance.script.revise`)

**Bằng chứng** (đã đọc trực tiếp):

```typescript
// Từ prompts/index.ts:298-306
content: `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]\n\n` + coreRaw.trim() + `\n\n=== L�DNA v3 BÐT BUỘC ===
- Người kể = người phân tíchn bằng dữ liệu và lập luạn. Giọng bình tĩnh, logic. Ưu tién GIảI THÍCH hơn kể chuyện.
- Cấu trúc luận điểm: Nêu → Giải thích (nhiều nhất) → Ví dụe → Hệ quả → Chuyển.
- Anti-Flowery: KHÔNG "cực kỳ", "vô cùng". Lập luạn là món chíchn.
- Tở lệ câu: <15% ngắn / 50-65% TB / 20-35% dài.
- Anti-Labeling: KHÔNG "Bớc 1", "Nguyên nhân thứ 1".
- "anh em" tối đđa 8 lần/đoạn.
- Slogan chỉ 2 lần: đầu + cuối.
=== KÐT THÚC LÖNH ===ẾT THÚC LỆNH ===`
```

**Các ký tự mojibake bị phát hiện:**

| Vị trí | Ký tự lỗi | Phải là |
|--------|-----------|---------|
| line 298 | `L�DNA` | `LỆNH` |
| line 298 | `BÐT BUỘC` | `BẮT BUỘC` |
| line 299 | `phân tíchn` | `phân tích` |
| line 299 | `lập luạn` | `lập luận` |
| line 299 | `Ưu tién` | `Ưu tiên` |
| line 299 | `tiến chuyện` | `trước chuyện` (hoặc tương tự) |
| line 300 | `Ví dụe` | `Ví dụ` |
| line 301 | `chíchn` | `chính` |
| line 302 | `Tở lệ` | `Tỷ lệ` |
| line 303 | `Bớc` | `Bước` |
| line 304 | `tối đđa` | `tối đa` |
| line 306 | `KÐT THÚC LÖNH ===ẾT THÚC LỆNH ===` | `KẾT THÚC LỆNH ===` (lặp + sai) |

**Tác động nghiêm trọng:**

- 🔴 **Product experience:** Nếu user mở DevTools → Network → xem request body → thấy prompt gửi đi dính ký tự rác → **mất niềm tin vào sản phẩm**.
- 🟡 **AI behavior:** LLM vẫn hiểu ngữ nghĩa (vì nội dung xung quanh rõ) NHƯNG confidence có thể giảm. Một số model inference engine có thể trả về text có cùng lỗi (copy-paste).
- 🟡 **Debugging:** Khi AI output sai DNA, mở prompt log lên sẽ không biết lỗi ở dòng nào.

**Verdict:** 🔴 **BẮT BUỘC SỬA** trước khi ship bất kỳ rewrite mode nào.

> **Câu hỏi cho Tier 1:** Bug này có nằm trong phạm vi của MSEW này, hay tách thành bug fix riêng? Tier 2 đề xuất: sửa trong MSEW này, vì Rewrite Mode sẽ làm lộ bug rõ nhất.

---

#### 🐛 Finding #2 — DNA system prompt của `revise` KHÔNG ép cấu trúc 5 phần

**So sánh:**

| Prompt | Có ép `## PHẦN 1-5 ##`? | Line |
|--------|-------------------------|------|
| `finance.script.outline` | ✅ CÓ (line 195-199) | `prompts/index.ts:195-199` |
| `finance.script.revise` | ❌ KHÔNG | `prompts/index.ts:298-306` |

**Tác động:**

- Mức 1 (chỉ chỉnh văn phong): ✅ OK — không cần ép cấu trúc.
- Mức 2 (gò 5 phần): 🔴 **SAI** — `revise` không có cơ chế ép, AI sẽ tự do rewrite.
- Mức 3 (tóm tắt + viết lại): 🔴 **SAI** — cần prompt mới (xem Finding #5).

**Verdict:** 🟡 Cần **append** block "cấu trúc 5 phần" vào `revise` user prompt hoặc đăng ký prompt mới cho Mức 2.

> **Câu hỏi cho Tier 1:** Có chấp nhận sửa `finance.script.revise` (ảnh hưởng đến tất cả caller đang dùng prompt này) hay đăng ký prompt mới `finance.script.revise.structured`?

---

#### 🐛 Finding #3 — `RewriteModal` không truyền `branch` DNA → sai giọng khi rewrite

**Bằng chứng signature** (`PromptRegistry.ts:68-72`):

```typescript
'finance.script.revise': {
  script: string;
  revisionPrompt: string;
  style: StyleOptions | null;
};
```

**Vấn đề:** Khi user dán bài báo tâm lý ("Lương 20tr vẫn thiếu tháng cuối năm") vào Rewrite Mode, plan nói gọi `finance.script.revise` → AI chỉ thấy `coreRaw` (DNA lõi) → KHÔNG biết phải dùng DNA `finance-psychology.md`. → Sai giọng.

**Tác động:**

- Output sẽ mang giọng analytical (mặc định `coreRaw`) thay vì psychology.
- Không khớp với "DNA Chú Que" mà user mong đợi.

**Verdict:** 🟡 Cần `rewriteScript()` gọi `classifyTopic` TRƯỚC khi gọi `revise` để xác định branch → chọn DNA file tương ứng.

> **Câu hỏi cho Tier 1:** Có chấp nhận thêm 1 step "phân loại trước khi rewrite" không? (Tốn thêm 1 API call nhưng tăng chất lượng.)

---

#### 🐛 Finding #4 — `revisionPrompt` rỗng → AI không biết làm gì

**Bằng chứng user prompt** (`prompts/index.ts:309`):

```typescript
content: `Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt}".\n${financeGuard}\n${styleLine}\n\nKịch bản gốc:\n${script}`,
```

**Tác động:**

- `RewriteModal` (theo plan) chỉ có: paste text + bấm nút → không có ô "Yêu cầu chỉnh sửa".
- `revisionPrompt = ""` → AI nhận: `Chỉnh sửa kịch bản theo yêu cầu: "".` → **hỏi lại** hoặc **tự đoán** → hành vi không lường trước được.

**Verdict:** 🟡 Cần:
- **Option A:** Thêm ô "Yêu cầu chỉnh sửa" vào `RewriteModal` (textarea phụ).
- **Option B:** Auto-fill `revisionPrompt` dựa trên Mức can thiệp đã chọn (đề xuất — đơn giản hơn).

> **Câu hỏi cho Tier 1:** Chốt Option A hay B? Tier 2 đề xuất **B** vì UX gọn hơn.

---

#### 🐛 Finding #5 — KHÔNG có prompt nào phù hợp Mức 3 (tóm tắt + viết lại)

**Bằng chứng:**

- `finance.script.revise` chỉ đơn giản là "rewrite fullscript" — không có cơ chế summarize first.
- `finance.script.revise.partial` chỉ trả về JSON replacements — không phải summarize.

**Tác động:** Nếu user paste bài 5000 từ → `revise` phải xử lý 5000+ tokens input → có thể vượt context window → **truncation** → mất nội dung.

**Verdict:** 🔴 Cần đăng ký prompt mới `finance.script.rewrite.fromSource` với 2-step:
1. Summarize to 5 key points (gọi `finance.script.outline` hoặc prompt mới).
2. Rewrite each point theo DNA Chú Que.

**Ước lượng files đụng (nếu Tier 1 chọn làm):**

- `src/services/ai/PromptRegistry.ts` (line 31-47) — thêm PromptId mới.
- `src/services/ai/prompts/index.ts` — đăng ký prompt mới.
- `src/services/ai/PromptRegistry.test.ts` — thêm test.

> **Câu hỏi cho Tier 1:** Có làm Mức 3 không, hay MVP chỉ cần Mức 1 + Mức 2? Tier 2 đề xuất: **MVP chỉ làm Mức 1 + Mức 2** trước, Mức 3 để follow-up.

---

#### 🐛 Finding #6 — Test coverage mỏng

**Bằng chứng** (`src/services/ai/PromptRegistry.test.ts:49-57`):

```typescript
it('finance.script.revise với style null vẫn build được', () => {
  const p = promptRegistry.get('finance.script.revise');
  const out = p.build({
    script: 'abc',
    revisionPrompt: 'shorten',
    style: null,
  });
  expect(out.messages[1].content).toContain('shorten');
});
```

**Vấn đề:**

- Chỉ check **build được** + chứa `revisionPrompt` trong output.
- KHÔNG check:
  - System prompt có chứa DNA không?
  - System prompt có bị encoding lỗi không? (sẽ bắt được Finding #1)
  - Tone/Style đúng format?
  - `finance.script.revise.partial` có trả về JSON hợp lệ không?

**Verdict:** 🟡 Cần bổ sung test để bắt bug trước khi ship.

---

### 3.3. Rủi ro UX plan chưa đề cập

| # | Rủi ro | Gợi ý giải quyết |
|---|--------|-------------------|
| 1 | **Vị trí nút "Tẩy rửa kịch bản gốc"** chưa chốt (plan line 50-51) | Header? Menu? FAB? Ảnh hưởng lớn đến discoverability. Tier 2 đề xuất: **FAB** (floating action button) góc phải — khớp với "tính năng premium" mà plan nói. |
| 2 | **Responsive** chưa nói | Side-by-side sẽ vỡ trên mobile. Cần responsive (stack dọc trên < 768px). |
| 3 | **Auto-save draft** chưa nói | User paste 5000 từ → lỡ F5 → mất. Cần `localStorage` draft. |
| 4 | **Loading state** | Rewrite có thể tốn 30-60s. Cần spinner + progress bar. |
| 5 | **Copy button** | Plan có nói "Nút Copy" ở line 48 — OK. Nhưng chưa nói format copy (markdown? plain text? HTML?). |

---

## 4. Trả lời 2 câu hỏi Tier 1 cần sếp quyết (plan line 15, 18)

### Câu hỏi 1: maxLength = 1500 cho ô Mô tả?

> **Tier 2 đề xuất: 800 ký tự** (giảm từ 1500).
>
> Lý do:
> - 800 ≈ 1 đoạn văn ~150 từ — đủ để mô tả "ý chính" mà không thể paste nguyên bài báo.
> - 1500 cho phép paste gần 1 trang A4 → outlineContent vẫn có thể nuốt tiêu đề (theo báo cáo `WEIGHT-TITLE-vs-DESCRIPTION-2026-08-01.md`).
> - Phương án C ở báo cáo Tier 2 đề xuất 800.
>
> **Tuy nhiên:** Nếu sếp muốn UX rộng rãi hơn, 1500 vẫn **chấp nhận được** — không phải sai, chỉ là ít aggressive hơn.

### Câu hỏi 2: Mức độ can thiệp Rewrite?

> **Tier 2 đề xuất: 3 mức** (thay vì 2 như plan gợi ý):
>
> | Mức | Tên | Prompt dùng | Ghi chú |
> |-----|-----|-------------|---------|
> | 1 | **Chỉ chỉnh văn phong** | `finance.script.revise.partial` (JSON replacements) | Khi user đã có outline chuẩn, chỉ cần AI "Việt hóa DNA" |
> | 2 | **Gò lại 5 phần** | `finance.script.revise` (full rewrite) + append block ép 5 phần | Khi user paste bài báo 2000-3000 từ |
> | 3 | **Tóm tắt + Viết lại** | `finance.script.rewrite.fromSource` (MỚI) | Khi user paste bài 5000+ từ mà không muốn AI lặp lại hết |
>
> **Lý do 3 mức thay vì 2:**
> - Mức 3 giải quyết được bài toán "user paste nguyên bài báo mà không muốn AI lặp lại hết" — use-case mà Tier 1 chưa đề cập.
> - Dropdown 3 mức không phức tạp hơn 2 mức trong UI.
>
> **MVP khuyến nghị:** Làm Mức 1 + Mức 2 trước (dùng prompt có sẵn + sửa bug encoding). Mức 3 để follow-up vì cần prompt mới.

---

## 5. Đề xuất bổ sung cho Tier 1 (trước khi Tier 2 code)

### 🔴 Bắt buộc (block Tier 2 code)

| # | Bổ sung | Lý do |
|---|---------|-------|
| 1 | **Chốt phạm vi sửa bug encoding** ở `prompts/index.ts:298-306` | Tier 2 cần biết sửa trong MSEW này hay tách bug fix |
| 2 | **Chốt maxLength** (800 hay 1500) | Block UI implementation |
| 3 | **Chốt số mức can thiệp** (2 hay 3) | Block prompt design |
| 4 | **Chốt Option A hay B** cho `revisionPrompt` (user nhập hay auto-fill) | Block logic trong `RewriteModal` |
| 5 | **Bổ sung BƯỚC X.Y** chi tiết | Tier 2 cần thứ tự code |
| 6 | **Dùng path tuyệt đối** cho tất cả file references | Tier 2 cần biết chính xác file ở đâu |

### 🟡 Khuyến nghị (Tier 2 có thể tự quyết nếu Tier 1 im lặng)

| # | Bổ sung | Tier 2 sẽ làm gì nếu thiếu |
|---|---------|---------------------------|
| 7 | **Stack modal** (Radix / Headless UI / native `<dialog>`) | Tier 2 sẽ check `package.json` và dùng stack đã có |
| 8 | **Acceptance Criteria** cho mỗi task | Tier 2 sẽ tự định nghĩa dựa trên Verification Plan |
| 9 | **Test file location** | Tier 2 sẽ tạo `RewriteModal.test.tsx` cùng folder |
| 10 | **Blast radius** (files cần đọc) | Tier 2 sẽ tự `codegraph_context` |

### ⬜ Nice-to-have (out of scope MVP)

| # | Bổ sung |
|---|---------|
| 11 | Responsive design cho `RewriteModal` |
| 12 | Auto-save draft (localStorage) |
| 13 | Loading state cho rewrite action |
| 14 | Copy button format (markdown vs plain text) |

---

## 6. Files đã đọc để verify (evidence)

| File | Dòng | Mục đích |
|------|------|---------|
| `src/services/ai/prompts/index.ts` | 169-230 | `finance.script.outline` — pipeline ép 5 phần |
| `src/services/ai/prompts/index.ts` | 288-314 | `finance.script.revise` (full) — DNA v3 + encoding bug |
| `src/services/ai/prompts/index.ts` | 316-347 | `finance.script.revise.partial` — JSON replacements |
| `src/services/ai/PromptRegistry.ts` | 31-47 | PromptId union |
| `src/services/ai/PromptRegistry.ts` | 68-77 | `revise` + `revise.partial` signatures |
| `src/services/ai/PromptRegistry.test.ts` | 49-57 | Test mỏng duy nhất |
| `docs/rewrite_plan.md` | 1-68 | Plan Tier 1 gửi |
| `docs/reports/WEIGHT-TITLE-vs-DESCRIPTION-2026-08-01.md` | 1-198 | Báo cáo Tier 2 trước |

---

## 7. Kết luận — Đề xuất quy trình tiếp theo

### Phương án 1 (Khuyến nghị): Tier 1 update plan → Tier 2 review lại → Code

1. Tier 1 trả lời 4 câu hỏi bắt buộc ở §5.
2. Tier 1 nâng cấp `rewrite_plan.md` thành MSEW (thêm BƯỚC X.Y, Acceptance, Blast radius).
3. Tier 2 review lại MSEW (5-10 phút).
4. Tier 2 code theo MSEW.

### Phương án 2 (Nhanh): Tier 1 tạo MSEW mới song song

1. Tier 1 dùng plan hiện tại + findings ở audit này để tạo MSEW mới.
2. Tier 2 review MSEW.

### Phương án 3 (Rủi ro): Tier 2 cầm plan code luôn

- 🔴 **Không khuyến nghị** — thiếu thông tin, Tier 2 phải tự quyết nhiều thứ → dễ sai hướng.

---

## 8. Open questions cho Tier 1

Tier 2 cần câu trả lời rõ cho 6 câu hỏi sau:

1. **Bug encoding** (`prompts/index.ts:298-306`): sửa trong MSEW này hay tách bug fix?
2. **maxLength**: 800 hay 1500?
3. **Mức can thiệp**: 2 mức (plan gợi ý) hay 3 mức (Tier 2 đề xuất)?
4. **`revisionPrompt`**: user nhập (Option A) hay auto-fill (Option B)?
5. **MVP scope**: Mức 1+2 thôi (khuyến nghị) hay đủ cả 3 mức?
6. **`rewriteScript()` có gọi `classifyTopic`** trước để biết branch DNA không?

→ Trả lời 6 câu này + áp dụng findings vào MSEW → Tier 2 code ngay.

---

**— Kết thúc audit. Tier 2 chờ Tier 1 chốt phạm vi.**
