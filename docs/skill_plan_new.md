# SKILL_plan_new.md — Phân tích kỹ thuật: Tích hợp Humanizer & Kiểm soát Số Từ

> **Mục đích:** Phân tích chi tiết kế hoạch tích hợp từ SKILL.md vào hệ thống hiện tại. Đánh giá khả thi, phát hiện conflict, và đề xuất kiến trúc cuối cùng.
>
> **Ghi chú:** Đây là phân tích, CHƯA phải MSEW. Sẽ viết MSEW sau khi Tier 1 duyệt kiến trúc.

---

## 1. TỔNG QUAN SKILL.md — 33 Patterns, Phân Loại Theo Độ Phù Hợp

### 1.1. Bảng đánh giá từng pattern

| # | Pattern | § | Đã có trong DNA? | Phù hợp? | Ghi chú |
|---|---------|---|:----------------:|:-------:|---------|
| 1 | Undue Emphasis (Significance) | §1 | ✅ Có (§4.1 hard constraints) | ✅ | DNA cấm hứa lợi nhuận + fake số liệu → đã cover |
| 2 | Undue Emphasis (Media Coverage) | §2 | ❌ Không cần | ⚠️ | Không liên quan kịch bản tài chính |
| 3 | Superficial -ing Analyses | §3 | ✅ Gần có (Anti-Flowery §9.4) | ✅ | Anti-Flowery đã nghiêm hơn |
| 4 | Promotional Language | §4 | ✅ Có (hard constraints) | ✅ | DNA cấm shilling |
| 5 | Vague Attributions | §5 | ⚠️ Một phần | 🟡 | DNA bắt buộc ghi nguồn, nhưng không cụ thể |
| 6 | Challenges/Future Sections | §6 | ❌ Không cần | ❌ | Template structure đặc thù |
| 7 | AI Vocabulary Words | §7 | ❌ Chưa đủ | 🟡 | DNA có anti-flowery, nhưng KHÔNG list cụ thể từ |
| 8 | Copula Avoidance | §8 | ❌ Chưa có | 🟡 | "là" vs "serves as" — chưa rule |
| 9 | Negative Parallelisms | §9 | ❌ Chưa có | ✅ | "Không chỉ... mà còn..." → cần thêm |
| 10 | Rule of Three Overuse | §10 | ❌ Chưa có | ⚠️ | DNA đã có anti-labeling, nhưng cần bổ sung |
| 11 | Elegant Variation | §11 | ✅ Có (Diversity §9) | ✅ | DNA §9 có bảng thay thế từ |
| 12 | False Ranges | §12 | ✅ Có (hard constraints) | ✅ | DNA bắt buộc có nguồn |
| 13 | Passive Voice | §13 | ❌ Không cần | ⚠️ | Vietnamese không phân biệt active/passive rõ |
| 14 | **Em-dash Overuse** | §14 | ❌ Chưa có | ✅⚠️ | **CONFLICT với app hiện tại** (xem §3.2) |
| 15 | Overuse of Boldface | §15 | ❌ Chưa có | ⚠️ | Script không dùng bold — chỉ plain text |
| 16 | Inline-Header Lists | §16 | ❌ Chưa có | ⚠️ | Không dùng trong script thực tế |
| 17 | Title Case Headings | §17 | ❌ Không cần | ❌ | Markdown script không dùng heading |
| 18 | **Emojis** | §18 | ❌ Chưa có | ❌⚠️ | **CONFLICT với UI app** (xem §3.2) |
| 19 | Curly Quotation Marks | §19 | ❌ Không cần | ⚠️ | Vietnamese dùng `"` thẳng mặc định |
| 20 | Collaborative Artifacts | §20 | ✅ Có (hard constraints) | ✅ | DNA cấm promotional language |
| 21 | Knowledge-Cutoff Disclaimers | §21 | ❌ Không cần | ⚠️ | Không relevant cho script |
| 22 | Sycophantic Tone | §22 | ✅ Có (voice §2.2) | ✅ | "không giáo điều" trong DNA §2.2 |
| 23 | Filler Phrases | §23 | ❌ Chưa đủ | ✅ | DNA anti-flowery cover phần nào |
| 24 | Excessive Hedging | §24 | ❌ Chưa có | 🟡 | Vietnamese hedging khác tiếng Anh |
| 25 | Generic Positive Conclusions | §25 | ✅ Có (CTA §3.2) | ✅ | DNA đã có CTA rules |
| 26 | Hyphenated Word Pairs | §26 | ❌ Không cần | ⚠️ | Vietnamese ít dùng hyphenated words |
| 27 | Persuasive Authority Tropes | §27 | ✅ Gần có (Anti-Formula) | 🟡 | Finance-hooks.md §7 đã anti-formula hook |
| 28 | **Signposting/Announcements** | §28 | ❌ Chưa có | ✅ | "Hãy cùng tôi đi sâu..." → cấm |
| 29 | Fragmented Headers | §29 | ❌ Không cần | ⚠️ | Không dùng heading trong script |
| 30 | Diff-Anchored Writing | §30 | ❌ Không cần | ⚠️ | Không phải changelog |
| 31 | **Staccato Drama** | §31 | ❌ Chưa có | ✅ | Câu cộc lốc giả tạo drama |
| 32 | **Aphorism Formulas** | §32 | ❌ Chưa có | ✅ | "Tiền bạc không phải là đích đến..." |
| 33 | Conversational Rhetorical Openers | §33 | ✅ Có (Hook §28) | ✅ | Finance-hooks.md §7 anti-formula |

**Tổng kết:**
- ✅ Phù hợp hoàn toàn: ~12 patterns
- 🟡 Phù hợp một phần / cần bổ sung: ~8 patterns
- ❌ Không phù hợp / conflict: ~4 patterns (Emoji, §14, §17, §18, §21, §26, §29, §30)
- ⚠️ Không cần cho context này: ~8 patterns

### 1.2. Patterns cần bổ sung MỚI (chưa có trong DNA)

| # | Pattern | Priority | Lý do |
|---|---------|:---------:|-------|
| §7 | AI Vocabulary Words | Cao | "bức tranh toàn cảnh", "then chốt", "vô cùng", "tấm thảm" — chưa list cụ thể |
| §9 | Negative Parallelisms | Cao | "Không chỉ... mà còn..." — phổ biến trong AI writing |
| §28 | Signposting Announcements | Cao | "Hãy cùng tôi đi sâu...", "Để tôi chia sẻ..." |
| §31 | Staccato Drama | Cao | Câu cộc lốc giả tạo drama |
| §32 | Aphorism Formulas | Cao | Đạo lý rỗng tuếch |
| §8 | Copula Avoidance | Trung | "là" vs "serves as" — tinh tế |
| §10 | Rule of Three | Trung | "3 nguyên nhân, 4 yếu tố" |
| §27 | Authority Tropes | Trung | "Câu hỏi thực sự là..." |

---

## 2. KIẾN TRÚC HIỆN TẠI — Phân Tích Chi Tiết

### 2.1. Pipeline viết kịch bản (hiện có)

```
User nhập title + outline
        ↓
classifyTopic()     [finance.router.classify]
        ↓
performDeepResearch()  [finance.research.* — 4 bước]
        ↓
generateScriptOutline() [finance.script.outline]
        ↓
startSequential() → parseOutlineIntoSegments()
        ↓
generateScriptPart() × N  [finance.script.part — mỗi phần]
        ↓
revise()  ←  GỌI reviseScript [finance.script.revise — viết lại toàn bộ]
        ↓
revise2() ←  GỌI reviseScriptPartial [finance.script.revise.partial — chỉ partial]

RewriteModal (vừa xong — BƯỚC 3-5)
        ↓
rewriteScript()  ←  GỌI reviseScript với revisionPrompt tự sinh (Level 1/2)
        ↓
OutputDisplay / Library
```

### 2.2. Prompt hiện tại cho `finance.script.revise` (BƯỚC 1 — đã sửa encoding)

```
System prompt:
  [BỐI CẢNH THỜI GIAN: ...]
  + coreRaw (finance-core.md)
  + === LỆNH DNA v3 BẮT BUỘC ===
    - Người kể = người phân tích bằng dữ liệu và lập luận
    - Cấu trúc luận điểm: Nêu → Giải thích (nhiều nhất) → Ví dụ → Hệ quả → Chuyển
    - Anti-Flowery: KHÔNG "cực kỳ", "vô cùng"
    - Tỷ lệ câu: <15% ngắn / 50-65% TB / 20-35% dài
    - Anti-Labeling: KHÔNG "Bước 1", "Nguyên nhân thứ 1"
    - "anh em" tối đa 8 lần/đoạn
    - Slogan chỉ 2 lần: đầu + cuối
  === KẾT THÚC LỆNH ===

User prompt:
  Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt}"
```

### 2.3. Nhận xét quan trọng

**❌ System prompt của `revise` KHÔNG dùng `buildFinanceSystemPrompt`** — đây là lỗi thiết kế lớn.

`buildFinanceSystemPrompt` có đầy đủ:
- `coreRaw` (finance-core.md)
- Branch DNA (`getBranchDna`)
- Hook DNA (`getHookDna`)
- Enforcement block đầy đủ (§6B narrator persona, §6C 5-step structure, §9 anti-flowery, checklist)

Nhưng `finance.script.revise` chỉ dùng `coreRaw` + 1 block cứng (~10 dòng) → **thiếu 80% DNA enforcement**.

→ **Đây là lý do chính script AI vẫn có mùi máy móc.**

---

## 3. ĐÁNH GIÁ SKILL_plan.md GỐC — Các Vấn Đề Kỹ Thuật

### 3.1. Vấn đề kiến trúc

| # | Vấn đề | Tác động | Độ nghiêm trọng |
|---|---------|----------|:--------------:|
| A | `finance.script.revise` KHÔNG dùng `buildFinanceSystemPrompt` | 80% DNA không có hiệu lực trong Rewrite | 🔴 Cao |
| B | `finance.script.revise` KHÔNG dùng Branch DNA | Nhánh (psychology/analytical/...) không được enforce | 🔴 Cao |
| C | `finance.script.rewriteLevel1/2` KHÔNG TỒN TẠI | Plan gọi nhắc tên 2 prompt này, nhưng chỉ có `revise` chung | 🔴 Cao |
| D | `buildFinanceSystemPrompt` KHÔNG có Humanizer blocks | Generation (outline + part) chưa có §7, §9, §28, §31, §32 | 🔴 Cao |

### 3.2. Conflict nghiêm trọng

#### Conflict 1: §14 (Em-dash) vs Thực tế AI Writing

`SKILL.md §14` yêu cầu **tuyệt đối cấm em-dash** trong mọi output.

Nhưng trong thực tế AI writing cho Vietnamese, em-dash (`—`) là công cụ tạo rhythm rất hiệu quả để:
- Tạo dramatic pause tự nhiên ("Hùng mua xe — 8 tháng sau, cậu ấy mất hết tiền tiết kiệm")
- Thay thế cho dấu phẩy khi cần nhấn mạnh

**Khuyến nghị:** Thay vì cấm hoàn toàn, nên giới hạn: **tối đa 2 em-dash mỗi phần**, và chỉ trong ngữ cảnh tạo dramatic pause, không phải decoration.

#### Conflict 2: §18 (Emojis) vs UI App

`SKILL.md §18` cấm emoji trong mọi output.

Nhưng app hiện tại dùng emoji khắp nơi:
- Slogan pattern: `"Chú Que Tài Chính — kênh nói thật về tiền bạc"`
- SideToolsPanel: `⚡ Tạo kịch bản`
- FAB button: `♻️ Tẩy rửa kịch bản`
- Hooks: `"✨ AI Tự Động Chọn"`

**Khuyến nghị:** Rule rõ: **"Cấm emoji trong kịch bản script. UI có emoji là styling, không phải nội dung."**

#### Conflict 3: §21 (Knowledge-Cutoff) vs Finance Domain

`SKILL.md §21` nói về model knowledge cutoff disclaimers. Nhưng trong domain tài chính cá nhân, disclaimers là **bắt buộc** (xem `niche-finance.md §2.8: investment-disclaimer`). Đây là một trong 7 hard constraints.

**Khuyến nghị:** §21 không áp dụng cho finance domain. Thay vào đó, bổ sung rule: **"Disclaimers đầu tư là BẮT BUỘC, không phải là dấu hiệu AI."**

### 3.3. Vấn đề Word Count ±5%

Plan nói:
- `±5%` cho tổng kịch bản
- `rebalanceRemainingParts()` cho sequential generation

**Phân tích kỹ:**

`reviseScript` trong `aiService.ts` chạy **streaming** (callback `onChunk`):

```typescript
// aiService.ts:147-170
export const reviseScript = async (
  script: string,
  revisionPrompt: string,
  params: GenerationParams,
  provider: AiProvider,
  model: string,
  onChunk?: (chunk: string) => void,
): Promise<string> =>
  runPrompt('sửa kịch bản', () =>
    callWithPrompt(provider, model, 'finance.script.revise', ... onChunk, ...)
  );
```

**Vấn đề:** Khi streaming, AI bắt đầu output TRƯỚC KHI biết kết quả cuối cùng dài bao nhiêu từ. Không thể enforce ±5% trong quá trình streaming.

**Giải pháp khả thi:**

| Phương án | Cách hoạt động | Ưu | Nhược |
|-----------|---------------|-----|-------|
| **A (Post-hoc check)** | Sinh xong → đo word count → nếu sai → gọi lại | Đơn giản, chính xác | Tốn thêm 1 API call, UX delay |
| **B (Target hint)** | Truyền `targetWordCount` vào prompt → AI tự estimate | Không call lại | Không chính xác, model không đếm từ giỏi |
| **C (Hybrid)** | Generation: thử A. Rewrite: bỏ ±5%, chỉ count check | Phân biệt use case | Phức tạp hơn |

**Khuyến nghị:** Phương án **C (Hybrid)**
- **Generation** (sequential): Áp dụng ±5% per part → dùng `rebalanceRemainingParts()` (Post-hoc check)
- **Rewrite** (`reviseScript`): BỎ ±5% → chỉ enforce structure + Humanizer, không enforce word count (vì input là script gốc có sẵn word count)

---

## 4. CÁC CÂU HỎI MỞ CHO TIER 1

| # | Câu hỏi | Ảnh hưởng | Gợi ý |
|---|---------|-----------|-------|
| 1 | **§14 (Em-dash):** Cấm hoàn toàn hay giới hạn 2/đoạn? | Tính tự nhiên của kịch bản | Giới hạn 2/đoạn — phù hợp với dramatic pause style |
| 2 | **§18 (Emojis):** Cấm trong script, UI vẫn dùng? | Không conflict | Thêm rule: "Script không emoji, UI có emoji là styling" |
| 3 | **Word count ±5%:** Áp dụng cho (a) Generation, (b) Rewrite, hay (c) chỉ Generation? | Ảnh hưởng kiến trúc code | Chỉ Generation (sequential) — Rewrite bỏ qua |
| 4 | **Humanizer pass:** Chạy tự động sau Rewrite, hay user phải bấm? | UX | Auto-sau-Rewrite (Pass 2) — user không cần biết |
| 5 | **Patterns nào bắt buộc cho Generation?** (so với Rewrite?) | Độ dài prompt, thời gian parse | Generation: ~10 patterns cần nhất. Rewrite: +3 patterns deep (Humanizer) |

---

## 5. ĐỀ XUẤT KIẾN TRÚC CUỐI CÙNG

### 5.1. Có nên tách module Tẩy AI riêng?

**Trả lời: KHÔNG — tích hợp thông minh vào pipeline hiện có là đủ.**

**Lý do:**

| Điểm | Tách riêng | Tích hợp |
|-------|:---------:|:---------:|
| Effort code | Cao (mới hoàn toàn) | Thấp (bổ sung blocks) |
| Tái sử dụng cho user upload | ✅ Có | ✅ Có (RewriteModal → `rewriteScript`) |
| Conflict với pipeline hiện có | 🔴 Cao (2 pipeline tranh nhau) | ✅ Không |
| Phù hợp Rewrite use case | ✅ Có (đúng context) | ✅ Có |
| Phù hợp Generation use case | ❌ Không cần (sinh từ đầu) | ✅ Có (bổ sung vào system prompt) |
| Phức tạp prompt | 🔴 Quá nhiều block | ✅ Vừa đủ |

**Hệ quả:** Tách module riêng chỉ hợp lý nếu:
1. Có user persona khác (content editor, không phải creator)
2. Muốn Humanizer là standalone tool cho bất kỳ text nào
3. Cần A/B test Humanizer effectiveness

→ **Trong context Chú Que Tài Chính: tích hợp vào pipeline là đủ.**

### 5.2. Kiến trúc đề xuất (Integration Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    GENERATION PIPELINE                        │
│  (Title + Outline → Outline → Part × N → Script)           │
├─────────────────────────────────────────────────────────────┤
│  System Prompt:                                             │
│  buildFinanceSystemPrompt(branch, hook, macroContext)        │
│    ├─ [BỐI CẢNH THỜI GIAN]                               │
│    ├─ finance-core.md (đầy đủ)                             │
│    ├─ Branch DNA (psychology/analytical/mythbusting/...)   │
│    ├─ Hook DNA (story/data/myth/question)                  │
│    ├─ Enforcement Block (hiện có)                          │
│    └─ NEW: Humanizer Block (generation) ←─────── §7, §9,  │
│           §10, §23, §28, §31, §32                          │
│                                                              │
│  Output → OutputDisplay / Library                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    REWRITE PIPELINE                        │
│  (Script gốc → rewriteScript → Revised Script)              │
├─────────────────────────────────────────────────────────────┤
│  System Prompt:                                             │
│  NEW: buildRewritingSystemPrompt(branch)                   │
│    ├─ [BỐI CẢNH THỜI GIAN]                               │
│    ├─ finance-core.md (đầy đủ)                             │
│    ├─ Branch DNA                                           │
│    ├─ Enforcement Block (hiện có)                          │
│    └─ NEW: Humanizer Block (rewrite) ←─────── §7, §8,    │
│           §9, §23, §27, §28, §31, §32 + pattern list     │
│                                                              │
│  User Prompt:                                              │
│  "Chỉnh sửa theo: ${revisionPrompt}"                     │
│  + Auto-fill: Level 1/2 prompts (như BƯỚC 4)             │
│  + NEW: Humanizer checklist appended to revisionPrompt      │
│                                                              │
│  Output → RewriteModal (right panel) → Apply → Generation   │
└─────────────────────────────────────────────────────────────┘
```

### 5.3. 3 Tầng tích hợp

| Tầng | Thành phần | Có trong DNA? | Cần thêm |
|-------|-----------|:-------------:|----------|
| **1. DNA Core** | Voice, narrator persona, §6B-6C, anti-flowery, anti-labeling, word ratio | ✅ Có | Không |
| **2. Enforcement Block** | Hard constraints, §7-13 patterns, §23-28 | 🟡 Một phần | 5-8 patterns mới |
| **3. Humanizer Deep** | Full 33 patterns, Wikipedia audit, Vietnamese adaptations | ❌ Chưa có | Đầy đủ 33 patterns |

**Điều chỉnh quan trọng:**
- **Không cần nhồi 33 patterns vào Generation** (tầng 1+2 đủ cho sinh từ đầu)
- **Cần đầy đủ 33 patterns cho Rewrite** (tầng 3 — vì input đã là text cần audit)
- **Pattern §18 (Emojis) → rule: "Script không, UI có"**
- **Pattern §14 (Em-dash) → rule: "Tối đa 2/đoạn, cho dramatic pause"**
- **Pattern §21 (Cutoff disclaimers) → rule: "Disclaimers đầu tư là BẮT BUỘC trong finance domain"**

### 5.4. Điểm cần sửa trong prompts/index.ts

| File | Prompt | Sửa gì | Tầng |
|------|--------|---------|------|
| `index.ts` | `finance.script.revise` | **THAY THẾ** block cứng bằng `buildFinanceSystemPrompt()` | 🔴 Cao |
| `index.ts` | `finance.script.revise` | Thêm Humanizer deep block (33 patterns) | 🔴 Cao |
| `index.ts` | `buildFinanceSystemPrompt` | Thêm Humanizer generation block (~10 patterns) | 🟡 Trung |
| `index.ts` | `buildFinanceSystemPrompt` | Thêm enforce word count ±5% cho `generateScriptPart` | 🟡 Trung |
| `index.ts` | `finance.script.outline` | Thêm depth requirement (bài toán giả định cho §3-4) | 🟡 Trung |
| `wordCount.ts` | `rebalanceRemainingParts()` | Tạo mới (nếu áp dụng Hybrid-A) | 🟡 Trung |

---

## 6. SCOPE MỚI — Phân chia Phase

### Phase A: Quick Wins (1-2h, không rủi ro) ✅

1. **Sửa `finance.script.revise`** — thay block cứng bằng `buildFinanceSystemPrompt()`
2. **Thêm Humanizer generation block** vào `buildFinanceSystemPrompt`
3. **Thêm Humanizer rewrite block** vào `finance.script.revise` (phần system)
4. **Thêm §18/§14 conflict resolution** — ghi rõ rule exceptions

### Phase B: Kiểm soát số từ (3-4h, rủi ro trung bình)

1. **Unlock UI wordCount** + Preset buttons (ControlPanel)
2. **Implement `rebalanceRemainingParts()`** — post-hoc check per part
3. **Áp dụng ±5% cho sequential generation**

### Phase C: Tối ưu (nếu có thời gian)

1. **Test Humanizer patterns** — tự động parse output check patterns
2. **Cập nhật finance-core.md** — bổ sung Humanizer reference
3. **Cập nhật niche-finance.md** — thêm Humanizer vào schema

---

## 7. DIFF giữa SKILL_plan.md GỐC và SKILL_plan_new.md

| Khía cạnh | SKILL_plan.md gốc | SKILL_plan_new.md |
|-----------|-------------------|-------------------|
| **Vấn đề kiến trúc** | Không thấy | Phát hiện `revise` không dùng `buildFinanceSystemPrompt` |
| **Conflict patterns** | Không đề cập | §14 (Em-dash), §18 (Emojis), §21 (Disclaimer) rõ ràng |
| **Word count ±5%** | Nói chung chung | Phân biệt Generation vs Rewrite + 3 phương án |
| **33 patterns** | Tất cả đều áp dụng | Chỉ ~12 cần thiết, ~8 cần bổ sung, ~4 conflict |
| **Module riêng** | Không đề cập | **Đề xuất KHÔNG tách** — tích hợp đủ |
| **Tách Phase** | Không có | 3 Phase rõ ràng |
| **Kiến trúc** | Liệt kê file | Sơ đồ 3 tầng + điểm cần sửa |

---

## 8. TIẾP THEO — Hành động cần thiết

**Trước khi viết MSEW, Tier 1 cần trả lời 5 câu hỏi ở §4:**
1. §14 Em-dash: Cấm hoàn toàn hay giới hạn?
2. §18 Emojis: Rule exception rõ ràng?
3. Word count: Chỉ Generation hay cả Rewrite?
4. Humanizer: Auto sau Rewrite hay user bấm?
5. Patterns nào cho Generation vs Rewrite?

---

*Phiên bản: 1.0.0*
*Phân tích: Dựa trên đọc toàn bộ DNA (finance-core.md v3, niche-finance.md, finance-hooks.md v2), prompts/index.ts (v3), SKILL.md (v1.6.0), SKILL_plan.md*
