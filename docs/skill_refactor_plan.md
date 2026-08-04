# KẾ HOẠCH TRIỂN KHAI TỔNG HỢP: Humanizer Engine + Multi-Niche Platform

> **Version:** 1.0.0  
> **Created:** 2026-08-04  
> **Status:** Draft — Pending Tier 1 Approval  
> **Related Documents:** `PLATFORM_REFACTOR_PLAN.md`, `skill_plan_new2.md`  
> **Objective:** Nâng cấp "Chú Que Tài Chính" thành multi-niche script generation platform với chất lượng Human-level Copywriting.

---

## TÓM TẮT ĐIỀU HÀNH

### Bức Tranh Lớn

Dự án này chia thành **2 master tracks** chạy song song với dependencies rõ ràng:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TRACK 1: HUMANIZER ENGINE (skill_plan_new2.md)                            │
│ Goal: Đạt chuẩn Human-level Copywriting cho finance niche                 │
│ Scope: Prompt changes + Word Count control + UI                           │
│ Timeline: Phase 0 (3-4 weeks)                                             │
│ Dependency: NONE — có thể bắt đầu ngay                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ TRACK 2: MULTI-NICHE PLATFORM (PLATFORM_REFACTOR_PLAN.md)                  │
│ Goal: Transform thành SaaS platform cho phép upload DNA tùy ý              │
│ Scope: Full-stack architecture refactor                                    │
│ Timeline: Phase A → B → C (Q3 2026 → Q1 2027)                            │
│ Dependency: TRACK 1 hoàn tất TRƯỚC khi mở rộng platform                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mối Quan Hệ 2 Tracks

```
TRACK 1: Humanizer Engine (Phase 0)
├── Priority: CAO NHẤT — fix quality ngay
├── Phase A: Prompt Engine & Humanizer
│   └── Sửa lỗi reviseScript (80% DNA missing)
├── Phase B: Word Count ±5% & UI
│   └── Preset buttons, badge, rebalance
├── Phase C: Verification & DNA Update
│   └── Audit, tests, finance-core.md update
└── ✅ OUTPUT: Finance niche đạt chuẩn professional
                                    │
                                    ↓ (Sau khi Track 1 hoàn tất)
TRACK 2: Multi-Niche Platform (Phase A → C)
├── Phase A: Abstract (Week 1-3)
│   └── Extract NicheConfig, DynamicPromptBuilder, DynamicRouter
├── Phase B: Multi-Niche Data (Week 4-8)
│   └── Supabase schema, seeding, CRUD UI
├── Phase C: User-Upload DNA (Week 9-16)
│   └── Import wizard, AI validator, versioning
└── ✅ OUTPUT: Platform cho phép user upload DNA tùy ý
```

### Tại Sao Phải Tách Track?

| Lý do | Giải thích |
|-------|------------|
| **Risk management** | Humanizer là pure prompt/UI change — reversible, testable. Platform refactor là full-stack — irreversible, high-risk. Không nên đánh đổi cả hai cùng lúc. |
| **User value** | Humanizer fix mang lại value NGAY cho user hiện tại. Platform expansion là business growth — không ảnh hưởng user hiện tại. |
| **Technical debt** | Track 1 là self-contained. Track 2 cần kiến trúc mới (Supabase, NicheService). Gộp lại tạo ra migration phức tạp không cần thiết. |
| **Testing** | Track 1: So sánh output trước/sau dễ dàng. Track 2: Cần regression tests cho cả 2 tracks. |

---

## PHẦN I: TRACK 1 — HUMANIZER ENGINE

### 1.1. Mục Tiêu

Đưa kịch bản kênh "Chú Que Tài Chính" đạt đẳng cấp **Human-level Copywriting** thông qua:

1. **Kiểm soát số từ linh hoạt** (±5% chuẩn, ±20% linh hoạt) với UI mới
2. **Nâng cấp chiều sâu kịch bản** (Chống hời hợt — bài toán mô phỏng số liệu)
3. **Tẩy sạch 100% dấu hiệu AI** (Humanizer Engine — 33 rules)
4. **Sửa dứt điểm lỗi `finance.script.revise`** (thiếu 80% DNA enforcement)

**Lưu ý về Word Count:**
- User KHÔNG nhập số từ ở bước đầu (Title + Description)
- Chỉ nhập số từ SAU KHI xem dàn ý
- User có thể yêu cầu "ngắn gọn" trong Description → tự động áp dụng ±20% tolerance

### 1.2. Known Issues Đã Xác Định

#### Issue #1: `reviseScript` Thiếu 80% DNA Enforcement

**Vấn đề:** `finance.script.revise` prompt hiện tại chỉ dùng:
- `coreRaw` (finance-core.md)
- Block cứng ~10 dòng (Anti-Flowery, Tỷ lệ câu, Slogan 2 lần)

Nhưng `buildFinanceSystemPrompt()` (dùng cho generation) có:
- `coreRaw`
- Branch DNA (analytical/psychology/mythbusting/listicle)
- Hook DNA
- Enforcement Block ~40 dòng (5 bước kiểm tra, Lệnh thực thi bắt buộc)

**→ 80% DNA hoàn toàn KHÔNG có hiệu lực trong Rewrite mode.**

**Tác động:** Scripts sau khi rewrite vẫn còn mùi AI vì Branch DNA và Hook DNA không được áp dụng.

**Cần sửa:** Tạo `buildRewritingSystemPrompt()` — system prompt đầy đủ cho vai trò "Script Doctor / Senior Financial Editor."

#### Issue #2: Outline Prompt Yêu Cầu "Siêu Ngắn Gọn" Nhưng Cần Chiều Sâu

**Vấn đề hiện tại:**
```
"mỗi gạch đầu dòng chỉ viết 1-2 câu siêu NGẮN GỌN"
```

**Nhưng yêu cầu mới:**
```
"(1) Cơ chế ngầm, (2) Bài toán mô phỏng giả định, (3) Góc nhìn phản biện"
```

**→ Xung đột:** Không thể vừa "1-2 câu siêu ngắn" vừa chứa bài toán số liệu.

**Cần tách:**
- **Dàn ý (Outline):** Mỗi bullet nêu ý + gợi ý bài toán (không cần giải)
- **Script Part 3 & 4:** Bắt buộc có 1 bài toán giả định cụ thể

#### Issue #3: Word Count Không Kiểm Soát Được

**Vấn đề hiện tại:**
- Input `wordCount` bị `disabled` trong ControlPanel
- Không có cơ chế bù trừ khi phần trước lệch
- Không có badge hiển thị độ lệch thực tế

**Cần xây dựng:**
- UI: Word count input CHỈ hiển thị SAU KHI tạo dàn ý
- Logic: `rebalanceRemainingParts()` với 2 modes (±5% standard, ±20% flexible)
- Detection: `detectConciseRequest()` để tự động chọn mode
- Feedback: Badge hiển thị tolerance mode (+/-5% hoặc +/-20%)

### 1.3. Humanizer Patterns — 11 Rules Cho Generation

Áp dụng **11/33 rules** từ `SKILL.md` cho Generation mode:

| # | Rule | Mô tả | Status |
|---|------|-------|:------:|
| §7 | AI Vocabulary | Cấm: "bức tranh toàn cảnh", "minh chứng sống động", "then chốt", "vô cùng" | Mới |
| §8 | Copula Avoidance | Cấm: "là", "có", "được" thay bằng động từ mạnh | Mới |
| §9 | Negative Parallelisms | Cấm: "Không chỉ... mà còn..." liên tiếp | Mới |
| §10 | Rule of Three | Hạn chế pattern "một là... hai là... ba là..." | Mới |
| §14 | Em-dash Limit | **Tối đa 2 em-dash (`—`) mỗi phần** — chỉ dramatic pause, không decoration | Mới |
| §18 | Emoji Ban | **Cấm 100% emoji trong script** — UI có emoji là styling | Mới |
| §23 | Filler Phrases | Cấm: "thực ra", "đơn giản là", "nói cách khác" | Mới |
| §27 | Authority Tropes | Hạn chế: "theo nghiên cứu", "các chuyên gia cho rằng" | Mới |
| §28 | Signposting | **Cấm:** "Hãy cùng tôi đi sâu...", "Để tôi chia sẻ...", "Hôm nay tôi sẽ..." | Mới |
| §31 | Staccato Drama | **Cấm:** Hàng loạt câu cộc lốc liên tiếp (1-2 lần cho điểm nhấn thật sự) | Mới |
| §32 | Aphorism Formulas | **Cấm:** "X là Y của Z" rỗng tuếch, đạo lý sáo rỗng | Mới |

**Cho Rewrite mode:** Áp dụng đầy đủ **33 rules** (bao gồm cả trên + 22 rules còn lại).

### 1.4. Humanizer Patterns — 3 Xung Đột Đã Xử Lý

| # | Conflict | Resolution |
|---|----------|------------|
| §14 | "Không giới hạn em-dash" vs "Giữ nhịp tự nhiên" | **Giới hạn tối đa 2 em-dash mỗi phần** — chỉ dùng cho dramatic pause thật sự |
| §18 | "Script không có emoji" vs "UI có emoji" | **Cấm 100% emoji trong script** — UI emoji là styling, không phải nội dung |
| §21 | "Không cấm disclaimer" | **Giữ nguyên disclaimer tài chính bắt buộc** — không xóa |

---

## PHẦN II: TRACK 1 — IMPLEMENTATION DETAIL

### 2.1. Phase A: Prompt Engine & Humanizer (Week 1-2)

#### A1. Sửa Lỗi `reviseScript` — Tạo `buildRewritingSystemPrompt()`

**File:** `src/services/ai/prompts/index.ts`

```typescript
// NEW: buildRewritingSystemPrompt — đầy đủ DNA cho Rewrite mode
// Role: "Script Doctor / Senior Financial Editor"

export function buildRewritingSystemPrompt(
  branch?: string,
  level: 'light' | 'deep' = 'light'
): string {
  const year = new Date().getFullYear();
  const coreDna = getCoreDna();
  const branchDna = getBranchDna(branch);
  const hookDna = getHookDna(hook ?? 'story');

  const base = [
    `[BỐI CẢNH THỜI GIAN: Năm ${year}]`,
    coreDna,
    branchDna,
    hookDna,
  ].join('\n\n');

  const humanizer = buildRewritingHumanizerBlock(level);

  return `${base}\n\n${humanizer}`;
}

function buildRewritingHumanizerBlock(
  level: 'light' | 'deep'
): string {
  // 33 rules — đầy đủ cho Rewrite
  const baseRules = `
=== BỘ LỌC TẨY RỬA MÙI VĂN AI (HUMANIZER ENGINE) ===

§7 TỪ VỰNG AI — CẤM TUYỆT ĐỐI:
- "bức tranh toàn cảnh", "minh chứng sống động", "then chốt", "vô cùng", "tấm thảm"
- "bản hòa ca", "tầng lớp", "hệ thống", "đích đến", "nền tảng"
- "giải mã", "bí ẩn", "khám phá", "mở khóa", "chìa khóa"

§8 COPULA AVOIDANCE — TRÁNH:
- Thay "X là Y" bằng động từ cụ thể: "X tạo ra Y", "X dẫn đến Y"
- Thay "có thể" bằng "cho phép", "mang lại"

§9 NEGATIVE PARALLELISMS — CẤM:
- "Không chỉ... mà còn..." liên tiếp trong cùng đoạn
- "Không phải vì A, cũng không phải vì B..."

§10 RULE OF THREE — HẠN CHẾ:
- Pattern "một là... hai là... ba là..." chỉ dùng khi thực sự cần list
- Ưu tiên viết tự nhiên, không áp công thức

§14 EM-DASH LIMIT — GIỚI HẠN NGHIÊM NGẶT:
- Tối đa 2 em-dash (—) mỗi phần
- Chỉ dùng cho dramatic pause THẬT SỰ, không phải decoration
- Thay bằng: dấu phẩy, hai chấm, hoặc liên từ tự nhiên

§18 EMOJI — CẤM TUYỆT ĐỐI TRONG SCRIPT:
- Kịch bản không dùng emoji
- UI có emoji là styling, không phải nội dung

§23 FILLER PHRASES — CẤM:
- "thực ra", "đơn giản là", "nói cách khác", "nói chung là"
- "điều quan trọng là", "điều cần lưu ý là"

§27 AUTHORITY TROPEs — HẠN CHẾ:
- "theo nghiên cứu", "các chuyên gia cho rằng" — chỉ dùng khi có nguồn cụ thể
- Nếu không có nguồn: thay bằng "một số người tin rằng" hoặc bỏ

§28 SIGNPOSTING — CẤM TUYỆT ĐỐI:
- "Hãy cùng tôi đi sâu...", "Để tôi chia sẻ...", "Hôm nay tôi sẽ..."
- "Như tôi đã đề cập...", "Như chúng ta đã biết..."
- "Trước tiên, thứ hai, cuối cùng..." — dùng tự nhiên hơn

§31 STACCATO DRAMA — CẤM:
- Hàng loạt câu cộc lốc liên tiếp: "Lan nghỉ việc. Không kế hoạch. Mất trắng."
- Câu ngắn chỉ dùng 1-2 lần cho điểm nhấn thật sự, không phải phong cách

§32 APHORISM FORMULAS — CẤM TUYỆT ĐỐI:
- "X không phải là đích đến mà là tấm gương..."
- "X là Y của Z" rỗng tuếch
- Đạo lý sáo rỗng: "Hãy sống hết mình", "Đừng để mai sau..."

=== KIỂM TRA TRƯỚC KHI TRẢ VỀ ===
[ ] Không có từ vựng AI (§7)?
[ ] Không "Không chỉ... mà còn..." liên tiếp (§9)?
[ ] Em-dash không quá 2/phần (§14)?
[ ] Không emoji trong script (§18)?
[ ] Không filler phrases (§23)?
[ ] Không signposting (§28)?
[ ] Không staccato drama hàng loạt (§31)?
[ ] Không aphorism rỗng (§32)?

=== KẾT THÚC HUMANIZER ENGINE ===`;

  if (level === 'deep') {
    return baseRules + `

=== DEEP REWRITE MODE — BỔ SUNG ===
Ngoài các rules trên, áp dụng thêm:
- §11: Chuyển câu bị động → chủ động
- §12: Loại bỏ hedged language ("có vẻ", "có thể là", "tương đối")
- §15: Thay thế generic quantifiers ("nhiều", "một số", "rất nhiều") bằng con số cụ thể
- §24: Tránh "Điều thú vị là...", "Đáng ngạc nhiên là..."
- §26: Loại bỏ redundant intensifiers ("rất", "cực kỳ", "vô cùng")
`;
  }

  return baseRules;
}
```

**Sau đó cập nhật `finance.script.revise`:**

```typescript
// Trong index.ts, thay đổi phần system prompt của revise
const reviseSystemPrompt = buildRewritingSystemPrompt(selectedBranch, 'light');
// thay vì chỉ dùng coreRaw + block cứng 10 dòng
```

#### A2. Cập Nhật `buildFinanceSystemPrompt()` — Nhúng Humanizer Generation Rules

**Bổ sung 11 rules vào generation system prompt:**

```typescript
// Thêm vào cuối buildFinanceSystemPrompt() — sau enforcement block

function buildGenerationHumanizerBlock(): string {
  return `
=== HUMANIZER GENERATION RULES (11 PATTERNS) ===

RÈ RÀNG BUỘC KHI VIẾT KỊCH BẢN MỚI:

1. §7 TỪ VỰNG AI — TUYỆT ĐỐI CẤM:
   KHÔNG dùng: "bức tranh toàn cảnh", "minh chứng sống động", "then chốt",
   "vô cùng", "tấm thảm", "bản hòa ca", "tầng lớp", "hệ thống"

2. §8 COPULA — HẠN CHẾ:
   Ưu tiên động từ mạnh thay vì "là", "có", "được"

3. §9 NEGATIVE PARALLELISMS — CẤM:
   "Không chỉ... mà còn..." — KHÔNG lặp trong cùng đoạn

4. §10 RULE OF THREE — HẠN CHẾ:
   "Một là... hai là... ba là..." — chỉ khi cần list thật sự

5. §14 EM-DASH — GIỚI HẠN:
   Tối đa 2 em-dash (—) mỗi phần. Chỉ cho dramatic pause THẬT SỰ.

6. §18 EMOJI — CẤM TUYỆT ĐỐI:
   Kịch bản không có emoji. UI có emoji là styling.

7. §23 FILLER — CẤM:
   "thực ra", "đơn giản là", "nói cách khác", "điều quan trọng là"

8. §27 AUTHORITY — HẠN CHẾ:
   "theo nghiên cứu", "chuyên gia cho rằng" — chỉ khi có nguồn

9. §28 SIGNPOSTING — CẤM TUYỆT ĐỐI:
   "Hãy cùng tôi đi sâu...", "Để tôi chia sẻ...", "Hôm nay tôi sẽ..."

10. §31 STACCATO DRAMA — CẤM:
    Hàng loạt câu cộc lốc liên tiếp — KHÔNG làm phong cách

11. §32 APHORISM — CẤM TUYỆT ĐỐI:
    "X là Y của Z" rỗng tuếch, đạo lý sáo rỗng

TỰ KIỂM TRA TRƯỚC KHI VIẾT:
[ ] Không có từ vựng AI (§7)?
[ ] Không negative parallelism liên tiếp (§9)?
[ ] Em-dash ≤ 2/phần (§14)?
[ ] Không emoji (§18)?
[ ] Không filler phrases (§23)?
[ ] Không signposting (§28)?
[ ] Không staccato drama hàng loạt (§31)?
[ ] Không aphorism rỗng (§32)?
`;
}
```

#### A3. Cập Nhật `finance.script.outline` — Bài Toán Mô Phỏng & AI Ước Lượng Số Từ Tối Thiểu

**Thay đổi trong prompt:**

```
CŨ:
- "mỗi gạch đầu dòng chỉ viết 1-2 câu siêu NGẮN GỌN"

MỚI:
YÊU CẦU DÀN Ý MỖI PHẦN:
1. Nêu rõ CƠ CHẾ NGẦM: Tại sao điều này xảy ra?
2. GỢI Ý BÀI TOÁN MÔ PHỎNG: Phần 3 & 4 phải có bài toán tính toán cụ thể
   (VD: Lãi suất 9.5%/năm, giá nhà 2.5 tỷ, thuê nhà 8 triệu/tháng...)
3. Nêu góc nhìn PHẢN BIỆN: Có ai không đồng ý không? Tại sao?
4. ĐÁNH GIÁ DUNG LƯỢNG KỊCH BẢN (AI DYNAMIC ESTIMATION):
   Ở cuối Dàn ý, AI bắt buộc trả về một khối metadata JSON:
   ```json
   {
     "minRecommendedWords": 1650,
     "optimalWords": 1900,
     "reason": "Dàn ý có 2 bài toán mô phỏng lãi suất và chi phí cơ hội tại Phần 3 & 4, cần tối thiểu 1.650 từ để giải phẫu số liệu trọn vẹn."
   }
   ```

LƯU Ý: Dàn ý có thể dài hơn 1-2 câu nếu cần giải thích bài toán.
Kịch bản chi tiết sẽ viết trong Part generation.
```

**Workflow Hiệu Chỉnh Số Từ (Word Count Calibration Workflow):**

**Quy tắc cốt lõi:**
- Word count input KHÔNG hiển thị ở bước nhập Title + Description
- Chỉ hiển thị SAU KHI dàn ý được tạo
- User có thể yêu cầu "ngắn gọn, khoảng X từ" trong Description

**Hai Flow Song Song:**

**Flow A — User yêu cầu "ngắn gọn" trong Description:**
1. User nhập Title + Description có ghi "khoảng X từ" hoặc "ngắn gọn thôi"
2. Tạo dàn ý → AI trả về outline + `minRecommendedWords`
3. UI hiển thị word count input (default = minRecommendedWords)
4. User nhập số từ tùy ý → Áp dụng **±20% tolerance** (linh hoạt)
5. Generate script với ±20% tolerance

**Flow B — User muốn đầy đủ chiều sâu:**
1. User nhập Title + Description (không yêu cầu ngắn)
2. Tạo dàn ý → AI trả về outline + `minRecommendedWords` + `optimalWords`
3. UI hiển thị word count input (default = optimalWords)
4. User nhập số từ → Áp dụng **±5% tolerance** (chuẩn)
5. Generate script với ±5% tolerance

**Tolerance Logic:**
| User Request | Tolerance | Use case |
|-------------|:---------:|----------|
| Mặc định (đầy đủ) | ±5% | Standard professional script |
| Yêu cầu "ngắn gọn" | ±20% | Condensed version |

**UI Feedback:**
- 💡 Gợi ý từ AI: "Để triển khai dàn ý này với đầy đủ bài toán số liệu, cần tối thiểu **1.650 từ** (Khuyên dùng: **1.900 từ**)."
- ⚠️ Nếu user nhập thấp hơn minRecommendedWords + yêu cầu ngắn → Auto áp dụng ±20%
- ⚠️ Nếu user nhập thấp hơn minRecommendedWords + KHÔNG yêu cầu ngắn → Warning "Nội dung có thể bị rút gọn"

#### A4. Cập Nhật `finance.script.part` — Bắt Buộc Bài Toán Số Liệu

**Thêm vào Part 3 & 4:**

```
YÊU CẦU ĐẶC BIỆT CHO PHẦN 3 & 4:
- BẮT BUỘC có 1 BÀI TOÁN GIẢ ĐỊNH MÔ PHỎNG bằng số liệu cụ thể:
  * Ví dụ Phần 3: "Nếu bạn đầu tư 50 triệu với lãi suất 9.5%/năm trong 5 năm,
    tổng cộng bạn nhận được bao nhiêu? [Tính compound interest]"
  * Ví dụ Phần 4: "So sánh 2 phương án: Mua nhà 2.5 tỷ trả góp 20 năm vs
    thuê nhà 8 triệu/tháng + đầu tư chênh lệch"

- SỐ LIỆU PHẢI CỤ THỂ: Lãi suất, số tiền, thời gian, phần trăm — không nói chung chung
- NẾU KHÔNG CÓ SỐ LIỆU THỰC: Ghi rõ "ước tính" hoặc "giả định"
```

### 2.2. Phase B: Word Count ±5% & Giao Diện UI (Week 2-3)

#### B1. Cập Nhật `wordCount.ts`

```typescript
// src/domain/wordCount.ts

export type ToleranceMode = 'standard' | 'flexible';

export interface WordCountTolerance {
  min: number;
  max: number;
  target: number;
  mode: ToleranceMode;
}

/**
 * Tolerance percentages by mode
 */
const TOLERANCE_PERCENTAGES: Record<ToleranceMode, number> = {
  standard: 0.05,  // ±5%
  flexible: 0.20,  // ±20%
};

/**
 * Tính biên độ cho phép theo mode
 */
export function getWordCountTolerance(
  target: number,
  mode: ToleranceMode = 'standard'
): WordCountTolerance {
  const tolerance = TOLERANCE_PERCENTAGES[mode];
  return {
    min: Math.round(target * (1 - tolerance)),
    max: Math.round(target * (1 + tolerance)),
    target,
    mode,
  };
}

/**
 * Kiểm tra số từ có nằm trong biên độ không
 */
export function isWithinTolerance(actual: number, tolerance: WordCountTolerance): boolean {
  return actual >= tolerance.min && actual <= tolerance.max;
}

const MIN_PART_FLOOR = 250; // Ngưỡng sàn tối thiểu để mỗi phần đủ dung lượng giải phẫu số liệu

/**
 * Hybrid rebalance approach (Có Floor Protection):
 * - Generation: Truyền target ±5% hoặc ±20% vào prompt, tự động cân đối
 * - Đảm bảo không bao giờ ép target xuống dưới MIN_PART_FLOOR (250 từ)
 * - Rewrite: Không ép số từ, giữ cấu trúc gốc
 *
 * @param totalTarget Tổng số từ mục tiêu cho cả kịch bản
 * @param generatedParts Các phần đã sinh (để tính tổng thực tế)
 * @param remainingCount Số phần còn lại chưa sinh
 * @param mode Tolerance mode: 'standard' (±5%) hoặc 'flexible' (±20%)
 */
export function rebalanceRemainingParts(
  totalTarget: number,
  generatedParts: string[],
  remainingCount: number,
  mode: ToleranceMode = 'standard'
): { newPartTarget: number; totalEstimate: number } {
  const generatedTotal = generatedParts.reduce((sum, part) => sum + countWords(part), 0);
  const remainingTarget = totalTarget - generatedTotal;

  let rawPartTarget = remainingCount > 0
    ? Math.round(remainingTarget / remainingCount)
    : remainingTarget;

  // BẢO VỆ NỢ KỸ THUẬT: Đảm bảo không bao giờ ép dưới mức sàn 250 từ nếu còn phần chưa sinh
  const newPartTarget = remainingCount > 0
    ? Math.max(MIN_PART_FLOOR, rawPartTarget)
    : 0;

  return {
    newPartTarget,
    totalEstimate: generatedTotal + (newPartTarget * remainingCount),
  };
}

/**
 * Kiểm tra xem user có yêu cầu "ngắn gọn" trong description không
 */
export function detectConciseRequest(description: string): boolean {
  const conciseKeywords = [
    'ngắn gọn', 'ngắn', 'tóm tắt', 'brief', 'condensed',
    'khoảng', 'chỉ', 'thôi', 'tối thiểu',
  ];

  const hasConciseKeyword = conciseKeywords.some(kw =>
    new RegExp(kw, 'i').test(description)
  );

  // Kiểm tra số cụ thể: "khoảng 1000 từ", "chỉ 800 từ"
  const hasSpecificNumber = /\d+\s*(từ|words?)/i.test(description);

  return hasConciseKeyword || hasSpecificNumber;
}

/**
 * Xác định tolerance mode dựa trên description và word count
 */
export function determineToleranceMode(
  description: string,
  userWordCount: number,
  minRecommendedWords: number
): ToleranceMode {
  const isConcise = detectConciseRequest(description);
  const isBelowRecommended = userWordCount < minRecommendedWords;

  // Nếu user yêu cầu ngắn gọn HOẶC nhập thấp hơn recommended → flexible
  if (isConcise || isBelowRecommended) {
    return 'flexible';
  }

  return 'standard';
}

/**
 * Đếm số từ trong text (tiếng Việt + tiếng Anh)
 */
export function countWords(text: string): number {
  // Loại bỏ markdown formatting
  const clean = text
    .replace(/[#*_\[\]()]/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  if (!clean) return 0;

  // Tách từ: Tiếng Việt (mỗi âm tiết) + Tiếng Anh (mỗi word)
  const words = clean.split(/\s+/).filter(w => w.length > 0);

  // Đếm word tokens (approximation cho tiếng Việt)
  return words.length;
}

/**
 * Format số từ thành display string
 */
export function formatWordCount(actual: number, tolerance: WordCountTolerance): string {
  const deviation = ((actual - tolerance.target) / tolerance.target * 100).toFixed(1);
  const sign = deviation.startsWith('-') ? '' : '+';
  const within = isWithinTolerance(actual, tolerance) ? '✅' : '⚠️';
  const modeLabel = tolerance.mode === 'flexible' ? '(linh hoạt ±20%)' : '(±5%)';

  return `${actual} / ${tolerance.target} từ ${modeLabel} (${sign}${deviation}% — ${within})`;
}
```

#### B2. Viết Unit Tests `wordCount.test.ts`

```typescript
// src/domain/wordCount.test.ts

import { describe, it, expect } from 'vitest';
import {
  getWordCountTolerance,
  isWithinTolerance,
  rebalanceRemainingParts,
  countWords,
  formatWordCount,
  detectConciseRequest,
  determineToleranceMode,
} from './wordCount';

describe('getWordCountTolerance', () => {
  it('1800 words → min=1710, max=1890', () => {
    const t = getWordCountTolerance(1800);
    expect(t.min).toBe(1710);
    expect(t.max).toBe(1890);
    expect(t.target).toBe(1800);
  });

  it('600 words → min=570, max=630', () => {
    const t = getWordCountTolerance(600);
    expect(t.min).toBe(570);
    expect(t.max).toBe(630);
  });

  it('2400 words → min=2280, max=2520', () => {
    const t = getWordCountTolerance(2400);
    expect(t.min).toBe(2280);
    expect(t.max).toBe(2520);
  });
});

describe('isWithinTolerance', () => {
  it('1710 → true (min boundary)', () => {
    const t = getWordCountTolerance(1800);
    expect(isWithinTolerance(1710, t)).toBe(true);
  });

  it('1890 → true (max boundary)', () => {
    const t = getWordCountTolerance(1800);
    expect(isWithinTolerance(1890, t)).toBe(true);
  });

  it('1709 → false (below min)', () => {
    const t = getWordCountTolerance(1800);
    expect(isWithinTolerance(1709, t)).toBe(false);
  });

  it('1891 → false (above max)', () => {
    const t = getWordCountTolerance(1800, 'standard');
    expect(isWithinTolerance(1891, t)).toBe(false);
  });

  // Flexible mode tests (±20%)
  it('800 true min boundary flexible', () => {
    const t = getWordCountTolerance(1000, 'flexible');
    expect(isWithinTolerance(800, t)).toBe(true);
  });

  it('1200 true max boundary flexible', () => {
    const t = getWordCountTolerance(1000, 'flexible');
    expect(isWithinTolerance(1200, t)).toBe(true);
  });
});

describe('rebalanceRemainingParts', () => {
  it('target 1800, 1 part generated (600), 4 remaining → 300/part', () => {
    const parts = ['word '.repeat(600).trim()];
    const result = rebalanceRemainingParts(1800, parts, 4);
    // remainingTarget = 1800 - 600 = 1200
    // rawPartTarget = 1200 / 4 = 300
    // MIN_PART_FLOOR = 250 → 300 > 250 → keep 300
    expect(result.newPartTarget).toBe(300);
  });

  it('target 1800, 1 part generated (1600), 4 remaining → MIN_PART_FLOOR enforced', () => {
    const parts = ['word '.repeat(1600).trim()];
    const result = rebalanceRemainingParts(1800, parts, 4);
    // remainingTarget = 1800 - 1600 = 200
    // rawPartTarget = 200 / 4 = 50
    // MIN_PART_FLOOR = 250 → 250 > 50 → floor enforced
    expect(result.newPartTarget).toBe(250);
  });

  it('target 1800, all parts generated, 0 remaining → 0', () => {
    const parts = ['x '.repeat(1800).trim()];
    const result = rebalanceRemainingParts(1800, parts, 0);
    expect(result.newPartTarget).toBe(0);
  });

  it('mode=flexible: target 1000, 1 part (400), 3 remaining → 200/part', () => {
    const parts = ['word '.repeat(400).trim()];
    const result = rebalanceRemainingParts(1000, parts, 3, 'flexible');
    expect(result.newPartTarget).toBe(200);
  });
});

describe('detectConciseRequest', () => {
  it('detects "ngắn gọn"', () => {
    expect(detectConciseRequest('Hãy viết ngắn gọn thôi')).toBe(true);
  });

  it('detects specific number', () => {
    expect(detectConciseRequest('Khoảng 1000 từ thôi')).toBe(true);
  });

  it('does not trigger on normal description', () => {
    expect(detectConciseRequest('Hãy phân tích về đầu tư chứng khoán')).toBe(false);
  });
});

describe('determineToleranceMode', () => {
  it('normal description + above recommended → standard', () => {
    const mode = determineToleranceMode('phân tích đầu tư', 2000, 1500);
    expect(mode).toBe('standard');
  });

  it('concise description → flexible', () => {
    const mode = determineToleranceMode('viết ngắn gọn khoảng 800 từ', 800, 1500);
    expect(mode).toBe('flexible');
  });

  it('normal description + below recommended → flexible', () => {
    const mode = determineToleranceMode('phân tích đầu tư', 800, 1500);
    expect(mode).toBe('flexible');
  });
});

describe('countWords', () => {
  it('counts Vietnamese text', () => {
    expect(countWords('đây là một câu tiếng việt')).toBe(5);
  });

  it('counts mixed Vietnamese and English', () => {
    expect(countWords('I love tiền bạc')).toBe(4);
  });

  it('strips markdown formatting', () => {
    expect(countWords('## Tiêu **đề** với [link](url)')).toBe(4);
  });
});
```

#### B3. Cập Nhật `ControlPanel.tsx`

```tsx
// components/ControlPanel.tsx — CHỈ thay đổi phần wordCount

// Thêm Preset buttons
const WORD_COUNT_PRESETS = [
  { label: '600 từ (Ngắn - 3\')', value: 600, duration: '~3 phút' },
  { label: '1200 từ (Chuẩn - 6-7\')', value: 1200, duration: '~6-7 phút' },
  { label: '1800 từ (Chuyên sâu - 10\')', value: 1800, duration: '~10 phút', recommended: true },
  { label: '2400 từ (Chi tiết - 13-14\')', value: 2400, duration: '~13-14 phút' },
];

// Trong JSX:
<div className="space-y-2">
  <label className="text-sm font-medium">
    Tổng số từ
    <span className="ml-2 text-xs text-muted-foreground">
      (Kịch bản tài chính cần tối thiểu 1.800 từ)
    </span>
  </label>

  {/* Preset buttons */}
  <div className="flex flex-wrap gap-2 mb-2">
    {WORD_COUNT_PRESETS.map(preset => (
      <button
        key={preset.value}
        type="button"
        onClick={() => setWordCount(preset.value)}
        className={cn(
          'px-3 py-1.5 text-sm rounded-md border transition-colors',
          wordCount === preset.value
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-border hover:bg-muted'
        )}
        title={preset.duration}
      >
        {preset.label}
        {preset.recommended && <span className="ml-1 text-xs">⭐</span>}
      </button>
    ))}
  </div>

  {/* Word count input */}
  <Input
    type="number"
    value={wordCount}
    onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
    min={100}
    max={10000}
    step={100}
    className="w-full"
    placeholder="Nhập số từ mong muốn"
  />

  {/* Duration estimate */}
  {wordCount > 0 && (
    <div className="text-xs text-muted-foreground">
      Ước tính thời lượng: ~{Math.round(wordCount / 180)} phút (tốc độ 180 WPM)
    </div>
  )}
</div>
```

#### B4. Cập Nhật `OutputDisplay.tsx`

```tsx
// components/OutputDisplay.tsx — Thêm Word Count Badge

// Trong component, thêm state:
const { getWordCountTolerance, isWithinTolerance, formatWordCount } = useWordCount();

// Sau khi có script, hiển thị badge:
{script && (
  <div className={cn(
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
    isWithinTolerance(wordCount)
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  )}>
    <span className="text-base">📊</span>
    <span>
      {formatWordCount(wordCount, getWordCountTolerance(targetWordCount))}
    </span>
  </div>
)}
```

#### B5. Tích Hợp `rebalanceRemainingParts` vào `useGenerationWorkflow`

```typescript
// src/features/generation/useGenerationWorkflow.ts

// Trong generateNextPart():
const generatedParts: string[] = [];
let remainingCount = TOTAL_PARTS;

// ... sau khi sinh part thứ i:
generatedParts.push(partScript);
remainingCount--;

// Tính target cho part tiếp theo
if (remainingCount > 0) {
  const { newPartTarget } = rebalanceRemainingParts(
    targetWordCount,
    generatedParts,
    remainingCount
  );

  // Truyền vào prompt cho part tiếp theo
  nextPartTarget = newPartTarget;
}

// Prompt cho part:
`
MỤC TIÊU: ${nextPartTarget} từ spoken
(Cho phép trong khoảng từ ${Math.round(nextPartTarget * 0.95)} đến ${Math.round(nextPartTarget * 1.05)} từ, sai số tối đa ±5%)
`
```

### 2.3. Phase C: Verification & DNA Update (Week 3-4)

#### C1. Chạy Tests

```bash
npm run typecheck
npm test
```

#### C2. Manual Verification Checklist

| # | Test | Expected | Status |
|---|------|----------|:------:|
| 1 | Preset 1800 từ | Input update + badge hiển thị ~10 phút | ⬜ |
| 2 | Generate 1800 từ | Thực tế nằm trong [1710, 1890] | ⬜ |
| 3 | Badge hiển thị % lệch | `+1.6%` hoặc `-2.3%` | ⬜ |
| 4 | Phần 3 & 4 có bài toán số | Có con số cụ thể (lãi, tiền, %) | ⬜ |
| 5 | Humanizer Audit | Không còn §7, §9, §14, §28, §31, §32 | ⬜ |
| 6 | Rewrite Mode | Kết quả có branch DNA + hook DNA | ⬜ |
| 7 | Rewrite Level 2 | 33 rules được áp dụng đầy đủ | ⬜ |

---

## PHẦN III: TRACK 2 — MULTI-NICHE PLATFORM

> **Bắt đầu SAU KHI Track 1 hoàn tất và stable**

### 3.1. Phase A: Abstract (Week 1-3 sau Track 1)

**Goal:** Extract hardcoded finance DNA thành `NicheConfig` objects — KHÔNG thay đổi UX.

#### A1. Tạo `src/config/niches.ts`

```typescript
// Hardcoded finance niche cho Phase A
// Phase B sẽ thay bằng Supabase loading

import coreRaw from '../../../docs/dna/finance-core.md?raw';
import analyticalRaw from '../../../docs/dna/finance-analytical.md?raw';
// ... import all finance DNA files

import type { NicheConfig } from '../services/niche/NicheConfig';

export const FINANCE_VN_CONFIG: NicheConfig = {
  nicheId: 'finance-vn',
  name: 'Chú Que Tài Chính',
  brand: 'Chú Que Tài Chính',
  isSystem: true,
  coreDna,
  branches: { analytical: analyticalRaw, ... },
  hooks: hooksRaw,
  examples: [],
  routingRules: [/* từ niche-finance.md §2.6 */],
  hardConstraints: [/* từ niche-finance.md §2.8 */],
  metadata: {
    language: 'vi-VN',
    targetAudience: 'Người Việt 20-40 tuổi',
    scriptLengthWords: '2,500-4,500',
    scriptLengthMinutes: '8-15',
  },
  version: '3.0.0',
  status: 'active',
};

export const ALL_NICHES: NicheConfig[] = [FINANCE_VN_CONFIG];
```

#### A2. Tạo `src/services/niche/NicheConfig.ts`

```typescript
// Interface cho universal niche representation

export interface NicheMetadata {
  language: string;
  targetAudience: string;
  scriptLengthWords: string;
  scriptLengthMinutes: string;
}

export interface RoutingRule {
  ruleId: string;
  keywords: string[];
  branch: string;
  hook?: string;
  mustHaves?: string[];
  priority: number;
}

export interface HardConstraint {
  constraintId: string;
  description: string;
  enforcement: string;
  severity: 'error' | 'warning';
}

export interface NicheExample {
  id: string;
  title: string;
  branch: string;
  hook: string;
  targetAudience: string;
  structure: string;
}

export interface NicheConfig {
  nicheId: string;
  name: string;
  brand: string;
  isSystem: boolean;
  ownerId?: string;
  coreDna: string;
  branches: Record<string, string>;
  hooks: string;
  examples: NicheExample[];
  routingRules: RoutingRule[];
  hardConstraints: HardConstraint[];
  metadata: NicheMetadata;
  version: string;
  status: 'active' | 'draft' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}
```

#### A3. Tạo `src/services/niche/NicheService.ts`

```typescript
// Phase A: Load từ hardcoded config
// Phase B: Thay bằng Supabase loading

import { ALL_NICHES } from '@/config/niches';
import type { NicheConfig } from './NicheConfig';

class NicheService {
  private cache = new Map<string, NicheConfig>();

  async load(nicheId: string): Promise<NicheConfig> {
    const cached = this.cache.get(nicheId);
    if (cached) return cached;

    const config = ALL_NICHES.find(n => n.nicheId === nicheId);
    if (!config) throw new Error(`Niche not found: ${nicheId}`);

    this.cache.set(nicheId, config);
    return config;
  }

  async listAccessible(): Promise<NicheConfig[]> {
    return ALL_NICHES;
  }

  invalidateCache(nicheId: string): void {
    this.cache.delete(nicheId);
  }
}

export const nicheService = new NicheService();
```

#### A4. Tạo `src/services/ai/DynamicPromptBuilder.ts`

Thay thế `buildFinanceSystemPrompt()` bằng factory generic:

```typescript
export class DynamicPromptBuilder {
  buildSystemPrompt(nicheConfig: NicheConfig, branch?: string): string {
    const { coreDna, branches, hooks, hardConstraints } = nicheConfig;

    return [
      `[BỐI CẢNH THỜI GIAN: Năm ${new Date().getFullYear()}]`,
      coreDna,
      // Only include requested branch (or all for full system prompt)
      ...Object.entries(branches)
        .filter(([name]) => !branch || name === branch)
        .map(([name, content]) => `## BRANCH DNA: ${name}\n${content}`),
      hooks,
      this.buildEnforcementBlock(hardConstraints),
      buildGenerationHumanizerBlock(), // From Track 1
    ].join('\n\n');
  }

  buildOutlinePrompt(nicheConfig: NicheConfig, params: OutlineParams): string {
    // Generic outline prompt với bài toán mô phỏng
    return `...`;
  }

  buildPartPrompt(nicheConfig: NicheConfig, params: PartParams): string {
    // Generic part prompt với rebalance
    return `...`;
  }

  buildRewritingSystemPrompt(nicheConfig: NicheConfig, branch?: string): string {
    // Từ Track 1 — đã có sẵn
    return buildRewritingSystemPrompt(branch);
  }
}
```

#### A5. Tạo `src/services/ai/DynamicRouter.ts`

```typescript
export class DynamicRouter {
  async route(title: string, nicheConfig: NicheConfig): Promise<RouteResult> {
    // Try rule-based routing first
    for (const rule of nicheConfig.routingRules.sort((a, b) => b.priority - a.priority)) {
      const matched = rule.keywords.some(kw => new RegExp(kw, 'i').test(title));
      if (matched) {
        return { branch: rule.branch, hook: rule.hook ?? 'story', matchedRule: rule.ruleId };
      }
    }

    // Fallback to default
    return { branch: 'default', hook: 'story' };
  }
}
```

#### A6. Tạo `src/contexts/NicheContext.tsx`

```typescript
export const NicheProvider: React.FC<{ children }> = ({ children }) => {
  const [activeNiche, setActiveNiche] = useState<NicheConfig | null>(null);
  const [accessibleNiches, setAccessibleNiches] = useState<NicheConfig[]>([]);

  useEffect(() => {
    nicheService.listAccessible().then(setAccessibleNiches);
  }, []);

  return (
    <NicheContext.Provider value={{ activeNiche, setActiveNiche, accessibleNiches }}>
      {children}
    </NicheContext.Provider>
  );
};

export const useNiche = () => useContext(NicheContext);
```

#### A7. Tạo `src/features/niche/NicheSwitcher.tsx`

```tsx
// Simple dropdown — Phase A chỉ show finance
// Phase C sẽ có full functionality

export const NicheSwitcher: React.FC = () => {
  const { activeNiche, accessibleNiches, setActiveNiche } = useNiche();

  return (
    <Select value={activeNiche?.nicheId} onValueChange={setActiveNiche}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {accessibleNiches.map(niche => (
          <SelectItem key={niche.nicheId} value={niche.nicheId}>
            {niche.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
```

#### A8. Update `App.tsx`

```tsx
export default function App() {
  return (
    <AuthProvider>
      <NicheProvider>
        {/* Existing app structure */}
      </NicheProvider>
    </AuthProvider>
  );
}
```

### 3.2. Phase B: Multi-Niche Data (Week 4-8)

**Goal:** Move niche configs từ hardcoded → Supabase database.

#### B1. Supabase Migration

```sql
-- supabase/migrations/001_multi_niche_schema.sql

CREATE TABLE niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_niche_per_owner UNIQUE (niche_id, owner_id)
);

CREATE TABLE niche_dna_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  checksum TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_dna_file UNIQUE (niche_id, file_type, file_name)
);

CREATE TABLE niche_routing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  branch TEXT NOT NULL,
  hook TEXT,
  must_haves TEXT[],
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_rule_per_niche UNIQUE (niche_id, rule_id)
);

CREATE TABLE niche_hard_constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  constraint_id TEXT NOT NULL,
  description TEXT NOT NULL,
  enforcement TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'error',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_constraint_per_niche UNIQUE (niche_id, constraint_id)
);

CREATE TABLE user_niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_niche UNIQUE (user_id, niche_id)
);

-- Indexes
CREATE INDEX idx_niches_owner ON niches(owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX idx_dna_files_niche ON niche_dna_files(niche_id);
CREATE INDEX idx_routing_niche ON niche_routing_rules(niche_id);
CREATE INDEX idx_routing_priority ON niche_routing_rules(priority DESC);

-- RLS
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_dna_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_hard_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_niches ENABLE ROW LEVEL SECURITY;

-- Policies: Users see system + own niches
CREATE POLICY niches_select ON niches FOR SELECT USING (
  is_system = true OR owner_id = auth.uid()
);

CREATE POLICY niches_insert ON niches FOR INSERT WITH CHECK (
  is_system = false AND owner_id = auth.uid()
);

CREATE POLICY niches_update ON niches FOR UPDATE USING (is_system = false AND owner_id = auth.uid());
CREATE POLICY niches_delete ON niches FOR DELETE USING (is_system = false AND owner_id = auth.uid());

-- DNA files: Users manage their own niche's DNA
CREATE POLICY dna_select ON niche_dna_files FOR SELECT USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = true OR owner_id = auth.uid())
);

CREATE POLICY dna_manage ON niche_dna_files FOR ALL USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = false AND owner_id = auth.uid())
);

-- Routing & constraints: Same as DNA
CREATE POLICY routing_select ON niche_routing_rules FOR SELECT USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = true OR owner_id = auth.uid())
);

CREATE POLICY routing_manage ON niche_routing_rules FOR ALL USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = false AND owner_id = auth.uid())
);

CREATE POLICY constraints_select ON niche_hard_constraints FOR SELECT USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = true OR owner_id = auth.uid())
);

CREATE POLICY constraints_manage ON niche_hard_constraints FOR ALL USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = false AND owner_id = auth.uid())
);

-- User niches
CREATE POLICY user_niches_all ON user_niches FOR ALL USING (user_id = auth.uid());
```

#### B2. Update `NicheService.ts` — Load từ Supabase

```typescript
// src/services/niche/NicheService.ts — Phase B

import { supabase } from '@/lib/supabase';

class NicheService {
  private cache = new Map<string, { config: NicheConfig; expiresAt: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  async load(nicheId: string, userId?: string): Promise<NicheConfig> {
    const cacheKey = `${nicheId}:${userId ?? 'system'}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.config;

    // 1. Fetch niche metadata
    const { data: niche } = await supabase
      .from('niches').select('*').eq('niche_id', nicheId).single();

    // 2. Fetch DNA files
    const { data: files } = await supabase
      .from('niche_dna_files')
      .select('file_type, file_name, content')
      .eq('niche_id', nicheId);

    // 3. Fetch routing rules
    const { data: rules } = await supabase
      .from('niche_routing_rules')
      .select('*').eq('niche_id', nicheId)
      .order('priority', { ascending: false });

    // 4. Fetch constraints
    const { data: constraints } = await supabase
      .from('niche_hard_constraints')
      .select('*').eq('niche_id', nicheId);

    const config = this.assemble(niche, files, rules, constraints);
    this.cache.set(cacheKey, { config, expiresAt: Date.now() + this.CACHE_TTL });
    return config;
  }

  async listAccessible(userId: string): Promise<NicheConfig[]> {
    const { data } = await supabase
      .from('niches')
      .select('*, niche_dna_files(*), niche_routing_rules(*), niche_hard_constraints(*)')
      .or(`is_system.eq.true,owner_id.eq.${userId}`)
      .eq('status', 'active');

    return (data ?? []).map(niche => this.assemble(
      niche,
      niche.niche_dna_files ?? [],
      niche.niche_routing_rules ?? [],
      niche.niche_hard_constraints ?? []
    ));
  }
}
```

#### B3. Tạo `NicheSeeder.ts`

```typescript
// Seed finance-vn system niche vào Supabase

export async function seedFinanceNiche(): Promise<void> {
  const { data: existing } = await supabase
    .from('niches').select('niche_id').eq('niche_id', 'finance-vn').single();

  if (existing) return;

  // Insert niche + all DNA files + routing rules + constraints
  // from FINANCE_VN_CONFIG
}
```

### 3.3. Phase C: User-Upload DNA (Week 9-16)

**Goal:** Allow users to upload their own DNA and create custom niches.

#### C1. DNA Import Wizard UI

```
Step 1: Basic Info → Step 2: Upload DNA → Step 3: AI Validation → Step 4: Routing → Step 5: Review
```

#### C2. AI DNA Validator

```typescript
// Use AI to analyze uploaded DNA and suggest:
interface DnaAnalysis {
  detectedBranches: string[];
  suggestedHooks: string[];
  detectedRules: RoutingRule[];
  quality: 'good' | 'needs_improvement';
  suggestions: string[];
}

// AI prompt:
// "Analyze this DNA content and suggest:
//  1. What type of content niche is this?
//  2. What branches should this niche have?
//  3. What routing rules should be used?"
```

#### C3. Niche Editor

Full in-app editor for DNA files with:
- Markdown preview
- Syntax highlighting
- Validation feedback

#### C4. Niche Versioning

```sql
-- Track DNA changes
CREATE TABLE niche_versions (
  id UUID PRIMARY KEY,
  niche_id TEXT REFERENCES niches(niche_id),
  version TEXT,
  changed_by UUID REFERENCES auth.users(id),
  changes JSONB, -- { added: [], removed: [], modified: [] }
  created_at TIMESTAMPTZ
);
```

---

## PHẦN IV: TIMELINE TỔNG HỢP

```
2026
├── AUG (Month 1-2)
│   ├── Track 1: Phase A — Prompt Engine & Humanizer
│   │   ├── A1: Sửa reviseScript (buildRewritingSystemPrompt)
│   │   ├── A2: Cập nhật buildFinanceSystemPrompt (11 Humanizer rules)
│   │   ├── A3: Cập nhật outline prompt (bài toán mô phỏng)
│   │   └── A4: Cập nhật part prompt (bắt buộc số liệu)
│   │
│   └── Track 1: Phase B — Word Count UI
│       ├── B1: wordCount.ts (tolerance + rebalance)
│       ├── B2: wordCount.test.ts
│       ├── B3: ControlPanel presets + duration
│       ├── B4: OutputDisplay badge
│       └── B5: useGenerationWorkflow rebalance
│
├── SEP (Month 3)
│   ├── Track 1: Phase C — Verification
│   │   ├── C1: Run tests
│   │   └── C2: Manual verification checklist
│   │
│   └── Track 2: Phase A — Abstract
│       ├── A1-A4: NicheConfig, NicheService, DynamicPromptBuilder, DynamicRouter
│       └── A5-A8: NicheContext, NicheSwitcher, App.tsx
│
└── OCT-DEC (Month 4-6)
    └── Track 2: Phase B — Multi-Niche Data
        ├── B1: Supabase migration
        ├── B2: Update NicheService (Supabase)
        └── B3: NicheSeeder

2027
├── JAN-MAR (Month 7-9)
    └── Track 2: Phase C — User-Upload DNA
        ├── C1: Import Wizard
        ├── C2: AI Validator
        ├── C3: Niche Editor
        └── C4: Niche Versioning
```

---

## PHẦN V: VERIFICATION MASTER PLAN

### Track 1: Humanizer Engine

#### Automated Tests

```bash
npm run typecheck
npm test
# wordCount.test.ts phải pass 100%
```

#### Manual Verification

| # | Test | Expected | Priority |
|---|------|----------|:--------:|
| 1 | Preset 1800 → Generate | Word count in [1710, 1890] | P0 |
| 2 | Badge ±5% display | Shows deviation % | P0 |
| 3 | Phần 3 & 4 bài toán số | Has concrete numbers | P0 |
| 4 | Humanizer: AI vocabulary | No §7 words | P1 |
| 5 | Humanizer: Negative parallelism | No §9 patterns | P1 |
| 6 | Humanizer: Em-dash ≤ 2 | Count dashes | P1 |
| 7 | Humanizer: No emoji | 0 emoji in script | P1 |
| 8 | Rewrite: Branch DNA applied | Branch-specific style | P1 |
| 9 | Rewrite Level 2: 33 rules | Full Humanizer | P2 |

### Track 2: Multi-Niche Platform

#### Automated Tests

```bash
npm run typecheck
npm test
# NicheService.test.ts, DynamicRouter.test.ts, DynamicPromptBuilder.test.ts
```

#### Integration Tests

| # | Test | Expected |
|---|------|----------|
| 1 | Load finance niche | Returns correct config |
| 2 | Switch niche → generate | Uses correct DNA |
| 3 | Upload niche → generate | Uses uploaded DNA |

---

## PHẦN VI: FREEMIUM MODEL

| Feature | Free | Pro (99k) | Team (299k) | Agency (799k) |
|---------|:----:|:---------:|:-----------:|:-------------:|
| System niches | 1 (finance) | 1 | 1 | 1 |
| Custom niches | 0 | 5 | 20 | Unlimited |
| Script generations/month | 30 | 200 | 1000 | Unlimited |
| Team members | 1 | 1 | 5 | 20 |
| API access | ❌ | ❌ | ❌ | ✅ |
| White-label | ❌ | ❌ | ❌ | ✅ |

---

## PHẦN VII: OPEN QUESTIONS — CHO TIER 1

| # | Câu hỏi | Tác động |
|---|---------|----------|
| 1 | **Tech stack:** Supabase đủ cho DNA queries phức tạp không? | Database design |
| 2 | **DNA format:** Markdown (.md) hay JSON structured input? | Import UI |
| 3 | **AI validation:** Tự động suggest branches/hooks khi upload? | UX |
| 4 | **Default niche:** User mới thấy finance hay empty? | Onboarding |
| 5 | **Revenue model:** Freemium như trên hay khác? | Business |
| 6 | **Humanizer priority:** Track 1 có cần hoàn tất TRƯỚC Track 2? | Timeline |

---

## APPENDIX: FILE CHANGE SUMMARY

### Files to CREATE (Track 1)

```
src/
├── domain/
│   └── wordCount.test.ts          # Unit tests
└── (Modify existing files — no new files)
```

### Files to MODIFY (Track 1)

```
src/
├── services/ai/prompts/index.ts    # A1, A2, A3, A4
├── domain/wordCount.ts             # B1
├── features/generation/useGenerationWorkflow.ts  # B5
components/
├── ControlPanel.tsx               # B3
└── OutputDisplay.tsx               # B4
```

### Files to CREATE (Track 2)

```
src/
├── config/niches.ts               # A1
├── services/niche/
│   ├── NicheConfig.ts             # A2
│   └── NicheService.ts            # A3
├── services/ai/
│   ├── DynamicPromptBuilder.ts    # A4
│   └── DynamicRouter.ts           # A5
├── contexts/NicheContext.tsx     # A6
└── features/niche/
    └── NicheSwitcher.tsx         # A7
supabase/migrations/
└── 001_multi_niche_schema.sql      # B1
```

### Files to MODIFY (Track 2)

```
src/
├── App.tsx                        # A8
├── services/niche/NicheService.ts # B2 (update to Supabase)
└── services/ai/prompts/index.ts   # B3 (NicheSeeder)
```

---

*Document status: DRAFT — Pending Tier 1 Approval*  
*Next action: Tier 1 answers 6 open questions → Begin Track 1 Phase A*
