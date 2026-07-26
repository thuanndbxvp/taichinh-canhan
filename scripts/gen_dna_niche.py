#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate niche-finance.md — Niche Profile tổng cho kênh Chú Que Tài Chính."""
import os

OUT_DIR = r'D:\Dark-Frontiers\docs\dna'

CONTENT = r'''# niche-finance.md — NICHE PROFILE TỔNG (Kênh Chú Que Tài Chính)

> **Mục đích:** Định nghĩa NicheProfile đầy đủ cho niche **Tài chính cá nhân Việt Nam** (kênh Chú Que Tài Chính). File này là **hợp đồng** giữa 6 file DNA (core + 4 nhánh + hooks) với phần còn lại của hệ thống.
>
> **Tại sao cần file này?** Để sau này muốn thêm niche mới (kinh dị, kể chuyện, review phim...) chỉ cần tạo thêm 1 bộ DNA tương tự + 1 file `niche-{ten-niche}.md` — KHÔNG cần sửa code app.
>
> **Đọc file này sau khi đã đọc:** `finance-core.md` (DNA Lõi) và tối thiểu 1 file nhánh để hiểu cấu trúc.

---

## 1. KHÁI NIỆM NICHE

### 1.1. Niche là gì?

**Niche** = một phân khúc nội dung YouTube cụ thể, có:
- **Đối tượng** riêng (Vietnamese 20-40 tuổi, thu nhập tầm trung)
- **Văn phong** riêng (giọng "Chú Que", xưng "tôi - anh em")
- **Quy tắc** riêng (cấm bịa số liệu, cấm hứa làm giàu nhanh)
- **Cấu trúc** riêng (4 nhánh: Listicle / Analytical / Psychology / Myth-busting)
- **Hook patterns** riêng (4 kiểu: Story / Data / Myth / Question)

→ Một niche = **một bộ DNA đầy đủ** (core + branches + hooks + examples).

### 1.2. Ví dụ các niche có thể mở rộng

| Niche | Slogan | Core DNA files | Đặc trưng |
|---|---|---|---|
| **Finance** (hiện tại) | "Nói thật về tiền bạc" | `finance-{core,listicle,analytical,psychology,mythbusting,hooks}.md` | Tài chính cá nhân, đầu tư, tâm lý tiền |
| **Horror / Kể chuyện ma** | "Câu chuyện kinh dị có thật" | `horror-{core,story-driven,psychological,urban-legend,hooks}.md` | SCP, đô thị huyền bí, có người thật |
| **Storytelling / Kể chuyện** | "Mỗi video là một câu chuyện" | `storytelling-{core,narrative,character-arch,plot,hooks}.md` | Người thật việc thật, lifestyle |
| **Review sản phẩm** | "Review khách quan" | `review-{core,comparison,pros-cons,value,hooks}.md` | Đánh giá theo tiêu chí rõ ràng |
| **Travel / Du lịch** | "Đi ít, trải nhiều" | `travel-{core,budget,destination,experience,hooks}.md` | Du lịch tiết kiệm, hidden gems |

→ Khi muốn thêm niche mới → **copy cấu trúc này**, không cần sửa code app.

### 1.3. Niche này (Finance) — Thông số chính

```yaml
niche_id: "finance-vn"
version: "1.0.0"
channel_name: "Chú Que Tài Chính"
target_audience: "Người Việt 20-40 tuổi, thu nhập 10-30 triệu"
niche_tone: "Ngang tàng, nói thật, không bán mơ"
frequency: "3-4 video/tuần"
script_length_minutes: "8-15"
script_length_words: "2,500-4,500"
primary_brand: "Chú Que Tài Chính"
pronouns:
  self: "tôi"
  audience: "anh em"
language: "vi-VN"
```

---

## 2. SCHEMA NICHE PROFILE (Cấu trúc đầy đủ)

Mỗi niche cần định nghĩa **đầy đủ 7 thành phần** sau. Đây là schema template — Finance là instance đầu tiên.

### 2.1. Sơ đồ tổng

```
┌─────────────────────────────────────────────┐
│         NICHE PROFILE (finance-vn)          │
├─────────────────────────────────────────────┤
│  1. metadata         (id, version, brand)   │
│  2. core_dna         (ref file: core)       │
│  3. branches         (4 file: listicle,     │
│                       analytical,           │
│                       psychology,           │
│                       mythbusting)          │
│  4. hooks            (ref file: hooks)      │
│  5. routing_rules    (topic → branch)       │
│  6. few_shot         (3-5 ví dụ mẫu)       │
│  7. constraints      (hard rules)           │
└─────────────────────────────────────────────┘
```

### 2.2. Thành phần 1 — Metadata

```yaml
metadata:
  niche_id: "finance-vn"
  version: "1.0.0"
  created_at: "2026-07-26"
  updated_at: "2026-07-26"
  status: "active"  # active | draft | deprecated
  authors:
    - "Chú Que Tài Chính Team"
  based_on:
    - "50 scripts thực tế kênh Chú Que Tài Chính (2024-2026)"
```

### 2.3. Thành phần 2 — Core DNA (BẮT BUỘC)

```yaml
core_dna:
  file: "finance-core.md"
  purpose: "Định nghĩa văn phong, xưng hô, slogan, quy tắc chung áp dụng cho MỌI script"
  applies_to: "Mọi script trong niche, không phân biệt branch"
  key_constraints:
    - "Xưng 'tôi' gọi 'anh em'"
    - "Slogan mở: Chú Que Tài Chính"
    - "CẤM bịa số liệu tài chính"
    - "CẤM hứa lợi nhuận cụ thể"
    - "LUÔN có disclaimer cho video đầu tư"
  pronouns:
    self: "tôi"
    audience: "anh em"
    third_person_replacements:
      - "người nghe → anh em"
      - "một người bạn → Minh/Hùng/Lan"
```

### 2.4. Thành phần 3 — Branches (4 file nhánh)

```yaml
branches:
  listicle:
    file: "finance-listicle.md"
    name_vi: "Top 5 / Top 10 / N điều"
    usage_percent: "~46%"  # 23/50 script
    structure: "Hook → Why → N mục (Story→Phân tích→Action) → Summary"
    best_hook: [story, data, question]
    examples_titles:
      - "10 Nghề Nông Thôn Vốn Ít Kiếm Tiền Tỷ Năm 2026"
      - "7 Thứ Người Giàu Thực Sự Không Bao Giờ Mua"
      - "10 Điều Tôi Ước Mình Biết Về Tiền Từ Năm 20 Tuổi"

  analytical:
    file: "finance-analytical.md"
    name_vi: "Phân tích tài chính / Kinh doanh"
    usage_percent: "~28%"  # 14/50 script
    structure: "Hook (Data) → Bối cảnh → Root Cause → Chi tiết → Rủi ro → Action"
    best_hook: [data, myth, question]
    examples_titles:
      - "Lạm Phát 2026: 5 Tài Sản Nên Sở Hữu Ngay"
      - "Mua Xe Trả Góp Hay Mua Đứt? Tôi Đã Tính Ra Con Số Thật"
      - "Sự Thật Về Ngành Bán Khóa Học Làm Giàu"

  psychology:
    file: "finance-psychology.md"
    name_vi: "Tâm lý xã hội / Áp lực đồng trang lứa"
    usage_percent: "~18%"  # 9/50 script
    structure: "Hook (Question/Story) → Câu chuyện → Đặt tên vấn đề → Root → Góc nhìn mới → Hành động nhẹ nhàng"
    best_hook: [question, story, myth]
    examples_titles:
      - "Làm Gì Khi Bạn Bè Đều Đã Giàu?"
      - "Làn Sóng Bỏ Việc Văn Phòng: Tại Sao Người Trẻ Việt Nam Đang Từ Chối?"
      - "Vì Sao Người Giàu Không Sợ Thất Bại?"

  mythbusting:
    file: "finance-mythbusting.md"
    name_vi: "Bóc phốt / Đập tan lầm tưởng"
    usage_percent: "~36%"  # 18/50 script (kết hợp)
    structure: "Hook (Myth/Reverse) → Lầm tưởng → Bằng chứng ngược → Cơ chế → Hệ quả → Giải pháp đúng"
    best_hook: [myth, data, story]
    examples_titles:
      - "6 Khoản CHI TIÊU Ai Cũng Gọi Là Đầu Tư Nhưng Thực Ra Là Lãng Phí"
      - "Vì Sao Tiết Kiệm 100 TRIỆU Đầu Tiên Lại Là Thử Thách Khó Nhất"
      - "Vì Sao NGÂN HÀNG Sợ Những Khách Hàng Am Hiểu Tài Chính?"
```

> **Lưu ý:** Tổng % > 100% vì 1 script có thể vừa là Myth-busting vừa có yếu tố Listicle (vd: "6 khoản chi tiêu lãng phí"). Đây là composite pattern — KHÔNG phải lỗi.

### 2.5. Thành phần 4 — Hook Library

```yaml
hooks:
  file: "finance-hooks.md"
  total_types: 4
  types:
    story:
      name_vi: "Kể chuyện cá nhân"
      ratio_target: 25
      description: "Mở bằng câu chuyện Minh/Hùng/Lan hoặc chính tôi"
    data:
      name_vi: "Số liệu sốc"
      ratio_target: 30
      description: "Mở bằng con số có nguồn, gây tò mò"
    myth:
      name_vi: "Đập tan lầm tưởng"
      ratio_target: 25
      description: "Mở bằng quan niệm phổ biến rồi phản bác ngay"
    question:
      name_vi: "Câu hỏi / Tưởng tượng"
      ratio_target: 20
      description: "Mở bằng câu hỏi trực tiếp hoặc scenario"
  rotation_strategy: "4 tuần, mỗi tuần có đủ 4 kiểu, không lặp >30%"
```

### 2.6. Thành phần 5 — Routing Rules (Topic → Branch + Hook)

```yaml
routing_rules:
  # Rule format: match_keywords → branch + hook + must_have_sections

  - id: "rule-listicle-numbers"
    match_keywords:
      - "(\\d+)\\s*(nghề|cách|điều|thứ|thói quen|nguyên tắc|tài sản|khoản)"
      - "top\\s*\\d+"
      - "^\\d+\\s+"
    branch: "listicle"
    hook_priority: [story, data, question]
    must_have_sections: [N mục với 4 phần: Tên + Ví dụ + Cách làm + Cảnh báo]
    notes: "Tiêu đề dạng số đầu câu → Listicle gần như chắc chắn"

  - id: "rule-vs-comparison"
    match_keywords:
      - "(mua|nên|vay|đầu tư)\\s+.{1,40}\\s+(hay|nên|vs|hoặc)"
      - "(trả góp|mua đứt|thuê mua)"
      - "(nhật|hàn|nhật bản|hàn quốc)"
    branch: "analytical"
    hook_priority: [data, myth, question]
    must_have_sections: [Phân tích A, Phân tích B, So sánh trực tiếp, Phù hợp với ai, Disclaimer]
    notes: "Câu hỏi dạng A vs B, hoặc lựa chọn 2-3 phương án"

  - id: "rule-vì-sao-phenomenon"
    match_keywords:
      - "^vì sao\\s+.{3,60}\\s+(đóng cửa|đang|không|mất|giảm|tăng|cháy|sập|sợ|thất bại|giàu|nghèo)"
      - "^sự thật về\\s+.{3,60}"
    branch: "mythbusting"
    hook_priority: [myth, data]
    must_have_sections: [Lầm tưởng, Bằng chứng ngược, Cơ chế, Hệ quả, Giải pháp đúng, Disclaimer cân bằng]
    notes: "Câu hỏi 'Vì Sao + hiện tượng' thường là Myth-busting hoặc Analytical"

  - id: "rule-question-emotional"
    match_keywords:
      - "^(làm gì khi|tại sao)\\s+.{3,80}"
      - "(áp lực|cảm giác|mệt mỏi|sợ|stress|khủng hoảng|đuối|bế tắc)"
      - "(bạn bè|gia đình|bố mẹ|chồng|vợ).{1,40}(giàu|nghèo|ly hôn|ra đi)"
    branch: "psychology"
    hook_priority: [question, story]
    must_have_sections: [Câu chuyện dài, Đặt tên cảm xúc, Root cause, Góc nhìn mới, Hành động nhẹ nhàng]
    notes: "Câu hỏi cảm xúc / áp lực → Psychology"

  - id: "rule-default"
    branch: "analytical"
    hook_priority: [data, question]
    notes: "Mặc định — khi không match rule nào ở trên. Analytical là generalist."
```

> **Sử dụng:** Routing rules được dùng bởi AI gateway / script generator. Khi user nhập title/topic, hệ thống check match_keywords → chọn branch + hook phù hợp.

### 2.7. Thành phần 6 — Few-shot Examples (Ví dụ mẫu để AI học)

```yaml
few_shot:
  # Mỗi example là 1 input-output pair để AI học pattern
  # 3-5 example là đủ cho niche này

  examples:
    - id: "ex-001-listicle"
      input:
        title: "7 Thứ Người Giàu Thực Sự Không Bao Giờ Mua"
        branch: "listicle"
        hook: "story"
        target_audience: "Người đi làm 25-40 tuổi"
      output_summary:
        structure: "Hook (câu hỏi) → Vì sao cần xem → 7 mục (mỗi mục: tên + câu chuyện + cách làm + lưu ý) → Đúc kết"
        tone: "Sắc, dứt khoát"
        key_phrases:
          - "Ngược lại hoàn toàn"
          - "Mấu chốt là"
          - "Anh em cảm thấy không"
        cta: "Anh em ơi, tiền bạc không phải để chứng minh mình giàu..."
      file_ref: "finance-listicle.md §11.1"

    - id: "ex-002-analytical"
      input:
        title: "Mua Xe Trả Góp Hay Mua Đứt?"
        branch: "analytical"
        hook: "data"
      output_summary:
        structure: "Hook (câu hỏi A vs B) → Bối cảnh (Hùng) → Phân tích Option A → Option B → So sánh → Phù hợp với ai → Disclaimer"
        tone: "Sắc lạnh, logic, nói thẳng"
        key_phrases:
          - "Tôi cầm bút ra tính"
          - "Con số thật là"
          - "Chênh lệch ~700-800 triệu"
        cta: "Mua xe là quyết định tài chính, không phải cảm xúc"
      file_ref: "finance-analytical.md §11"

    - id: "ex-003-psychology"
      input:
        title: "Làm Gì Khi Bạn Bè Đều Đã Giàu?"
        branch: "psychology"
        hook: "question"
      output_summary:
        structure: "Hook (câu hỏi cảm xúc) → Câu chuyện dài (bản thân tôi) → Đặt tên cảm xúc (Social Comparison Theory) → Root cause (3 yếu tố) → Góc nhìn mới (so với mình 1 năm trước) → Hành động nhẹ nhàng (tắt thông báo Facebook 1 tuần)"
        tone: "Thấu cảm, mềm, không dạy đời"
        key_phrases:
          - "Tôi hiểu"
          - "Tôi từng là bạn ấy"
          - "Anh em không cô đơn"
          - "Không có giải pháp đơn giản"
        cta: "Mình cần - mỗi ngày, một chút - sống cuộc đời mình MUỐN"
      file_ref: "finance-psychology.md §11"
```

### 2.8. Thành phần 7 — Hard Constraints (BẮT BUỘC)

```yaml
constraints:
  hard_rules:
    # Các quy tắc BẮT BUỘC, vi phạm → từ chối generate
    - id: "no-fake-numbers"
      description: "KHÔNG bịa số liệu tài chính"
      enforcement: "Mọi con số phải có nguồn HOẶC ghi 'ước tính', 'theo kinh nghiệm'"
    - id: "no-profit-promise"
      description: "KHÔNG hứa lợi nhuận cụ thể (X%, Y đồng)"
      enforcement: "Từ chối nếu script chứa: 'đầu tư X sẽ được Y%', 'kiếm Z triệu dễ dàng'"
    - id: "no-moralize"
      description: "KHÔNG dạy đời, lên lớp"
      enforcement: "Từ chối các câu: 'phải tỉnh táo', 'đừng có mơ mộng', 'ngu sao không hiểu'"
    - id: "no-shilling"
      description: "KHÔNG quảng cáo sản phẩm (trừ có ghi rõ sponsored)"
      enforcement: "Từ chối nếu script PR app/khóa học/mentor mà không có disclosure"
    - id: "no-discrimination"
      description: "KHÔNG phân biệt vùng miền, tôn giáo, giới tính"
      enforcement: "Từ chối ngôn từ gây chia rẽ"
    - id: "no-borrow-to-invest"
      description: "KHÔNG khuyên vay nợ để đầu tư"
      enforcement: "Từ chối nếu script khuyên vay tiền để đầu tư cá nhân"
    - id: "investment-disclaimer"
      description: "PHẢI có disclaimer đầu tư cho mọi video về đầu tư"
      enforcement: "Tự động thêm disclaimer nếu topic match: cổ phiếu, vàng, BĐS, crypto, quỹ mở..."

  soft_rules:
    # Các quy tắc KHUYẾN NGHỊ, không bắt buộc
    - id: "story-persona"
      description: "Mỗi script có ít nhất 1 nhân vật cụ thể (Minh/Hùng/Lan)"
    - id: "actionable-cta"
      description: "Mỗi script có ít nhất 1 hành động cụ thể người xem có thể làm"
    - id: "memorable-quote"
      description: "Mỗi script có ít nhất 1 câu vàng memorable"
    - id: "question-rhythm"
      description: "Câu hỏi tu từ mỗi 45-60 giây"
```

---

## 3. CÁCH GHÉP PROMPT HOÀN CHỈNH (Template)

Khi generate script, ghép theo thứ tự:

### 3.1. Công thức ghép

```
[DNA Core] + [DNA Branch X] + [Hook từ Hook Library] + [Few-shot Example]
        + [Hard constraints check] + [Output format]
```

### 3.2. Template prompt hoàn chỉnh

```markdown
# PROMPT — Generate YouTube Script (Finance Niche)

## ROLE
Bạn là một chuyên gia viết kịch bản YouTube tài chính theo phong cách
kênh Chú Que Tài Chính. Bạn nói thẳng, không bán mơ, dùng số liệu
chắc chắn.

## CORE DNA (BẮT BUỘC)
{Toàn bộ nội dung file finance-core.md}

## BRANCH DNA — {Branch Name}
{Dựa theo routing rules, chọn 1 trong 4 file nhánh}
- Nếu topic dạng "N Nghề/Cách/Điều" → finance-listicle.md
- Nếu topic dạng "A vs B", "Phân tích" → finance-analytical.md
- Nếu topic dạng "Làm Gì Khi...", "Áp lực..." → finance-psychology.md
- Nếu topic dạng "Vì Sao...", "Sự Thật Về..." → finance-mythbusting.md

## HOOK — {Hook Type}
{Dựa theo hook_priority trong branch đã chọn, chọn 1 kiểu từ
finance-hooks.md và viết câu hook mẫu}

## FEW-SHOT EXAMPLE
{Dựa theo branch, lấy 1 ví dụ tương tự từ finance-{branch}.md §11}
{2-3 đoạn quan trọng nhất của example}

## HARD CONSTRAINTS (BẮT BUỘC)
{Copy từ section 2.8 ở trên — 7 quy tắc hard}

## INPUT
- Title: "{input.title}"
- Target audience: {input.audience}
- Số từ mong muốn: {input.word_count}
- Branch đã chọn: {input.branch}
- Hook đã chọn: {input.hook_type}

## OUTPUT FORMAT
```yaml
title: "..."
hook: "Câu hook 5-7 giây đầu"
slogan_mo: "Chào mừng anh em đến với Chú Que Tài Chính"
outline: ["Phần 1", "Phần 2", ...]
script_full: |
  [Toàn bộ script markdown]
sections: # checklist output
  - story_persona: true/false
  - actionable_cta: true/false
  - memorable_quote: true/false
  - question_rhythm: true/false
constraints_check: # hard constraints
  - no_fake_numbers: pass/fail
  - no_profit_promise: pass/fail
  ...
```

## INSTRUCTION
Viết script theo tất cả DNA ở trên. Đảm bảo:
1. Mở bằng Hook đã chọn
2. Slogan mở xuất hiện trong 5-7 giây đầu
3. Cấu trúc theo Branch DNA
4. Hành động cụ thể cho người xem
5. Đúc kết + slogan đóng
6. Pass tất cả Hard Constraints

Nếu không pass được Hard Constraint → viết lại phần đó,
KHÔNG bỏ qua.
```

### 3.3. Ví dụ ghép cụ thể

**Input:**
```yaml
title: "7 Thứ Người Giàu Thực Sự Không Bao Giờ Mua"
topic_keywords: ["7 Thứ", "Người Giàu", "Không Bao Giờ"]
```

**Routing match:** Rule `rule-listicle-numbers` (regex `(\\d+)\\s*(thứ)` match) → branch = `listicle`, hook = `story`

**Prompt ghép:**

```
[finance-core.md - toàn bộ] +
[finance-listicle.md - toàn bộ] +
[finance-hooks.md - §2 Story Hook + Pattern A,B,C,D,E] +
[few_shot ex-001-listicle] +
[hard constraints]
+ Input: title, audience, word_count
```

---

## 4. ROUTING DECISION TREE

### 4.1. Quy trình 4 bước

```
Step 1: Topic → Detect keywords
   ↓
Step 2: Match routing rule (5 rules ở §2.6)
   ↓
Step 3: Nếu match → chọn branch + hook priority
   Nếu không match → default = analytical + [data, question]
   ↓
Step 4: Validate đầu vào + Generate
```

### 4.2. Ví dụ routing

| Title | Match rule | Branch | Hook priority |
|---|---|---|---|
| "10 Nghề Nông Thôn Vốn Ít..." | rule-listicle-numbers (10 + Nghề) | listicle | [story, data, question] |
| "Mua Xe Trả Góp Hay Mua Đứt?" | rule-vs-comparison (mua...hay) | analytical | [data, myth, question] |
| "Làm Gì Khi Bạn Bè Đều Đã Giàu?" | rule-question-emotional (Làm Gì Khi) | psychology | [question, story] |
| "Vì Sao 80% Quán Cà Phê Đóng Cửa?" | rule-vì-sao-phenomenon (Vì Sao + đóng cửa) | mythbusting | [myth, data] |
| "5 Cách Người Giàu Dùng AI..." | rule-listicle-numbers (5 + Cách) | listicle | [story, data, question] |
| "Tâm Lý Gỡ Gạc Kinh Điểm..." | rule-question-emotional (Tâm Lý) | psychology | [story, myth] |
| "Sự Thật Về Ngành Bán Khóa Học..." | rule-vì-sao-phenomenon (Sự Thật Về) | mythbusting | [myth, data] |

### 4.3. Khi 2 rules cùng match → Ưu tiên

1. **Pattern cụ thể > Pattern chung**: "10 Nghề..." match listicle mạnh hơn "Vì Sao..."
2. **Branch theo loại hỏi**: Câu hỏi cảm xúc → psychology, câu hỏi so sánh → analytical
3. **Default cuối cùng**: analytical

---

## 5. WORKFLOW THỰC TẾ TRONG APP

### 5.1. Luồng từ user input → output

```
[User nhập title + topic]
        ↓
[Routing engine check routing_rules]
        ↓
[Chọn branch + hook]
        ↓
[Load DNA files: core + branch + hook]
        ↓
[Build prompt theo template §3.2]
        ↓
[Gọi AI gateway]
        ↓
[Validate output qua hard constraints]
        ↓
[Nếu pass → Trả về script]
[Nếu fail → Retry với feedback, tối đa 2 lần]
        ↓
[User review/edit/lưu]
```

### 5.2. Validate output (hard constraints check)

| Constraint | Cách check |
|---|---|
| `no-fake-numbers` | Regex tìm: `\\d+(\\.\\d+)?%`, `\\d+ (triệu|tỷ|tỉ)` — flag nếu không có "theo", "ước tính", "nguồn" gần đó |
| `no-profit-promise` | Từ khóa: "đảm bảo", "chắc chắn", "100%", "lợi nhuận cao" — flag |
| `no-moralize` | Từ khóa: "phải tỉnh táo", "đừng có mơ" — flag |
| `no-shilling` | Từ khóa: "tải app", "đăng ký khóa học" — flag nếu không có "sponsored", "tài trợ" |
| `no-borrow-to-invest` | Pattern: "vay.*để.*đầu tư" — flag |
| `investment-disclaimer` | Nếu match topic tài chính → bắt buộc có "disclaimer", "lời khuyên đầu tư" |

### 5.3. Hook rotation 4 tuần

| Tuần | Video 1 | Video 2 | Video 3 | Video 4 |
|---|---|---|---|---|
| Tuần 1 | Story | Data | Myth | Question |
| Tuần 2 | Data | Myth | Question | Story |
| Tuần 3 | Myth | Question | Story | Data |
| Tuần 4 | Question | Story | Data | Myth |

→ Lưu trong session/localStorage để rotation đúng.

---

## 6. HƯỚNG DẪN THÊM NICHE MỚI (KHÔNG CẦN SỬA CODE)

### 6.1. Bước 1 — Tạo bộ DNA files

Tạo folder `docs/dna/` (đã có) với cấu trúc:

```
docs/dna/
├── niche-{ten-niche}.md          ← Profile tổng (copy file này)
├── {ten-niche}-core.md          ← DNA Lõi
├── {ten-niche}-{branch1}.md     ← Nhánh 1
├── {ten-niche}-{branch2}.md     ← Nhánh 2
├── {ten-niche}-{branch3}.md     ← Nhánh 3
└── {ten-niche}-hooks.md         ← Thư viện Hook
```

**Số lượng branches: 3-5 là đủ.** Mỗi niche có thể có branches khác Finance.

### 6.2. Bước 2 — Điền schema (copy từ file này)

Trong `niche-{ten-niche}.md`, điền các section:
1. Metadata (id, brand, audience)
2. Core DNA reference
3. Branches (định nghĩa từng nhánh + patterns + examples)
4. Hooks (định nghĩa các kiểu hook riêng)
5. Routing rules (keywords → branch)
6. Few-shot examples
7. Hard constraints

### 6.3. Bước 3 — Đăng ký niche trong code

Trong `src/config/niches.ts` (hoặc tương tự):

```typescript
export const NICHES = {
  'finance-vn': {
    id: 'finance-vn',
    name: 'Tài chính cá nhân Việt Nam',
    brand: 'Chú Que Tài Chính',
    profiles: {
      core: loadDNA('finance-core.md'),
      branches: {
        listicle: loadDNA('finance-listicle.md'),
        analytical: loadDNA('finance-analytical.md'),
        psychology: loadDNA('finance-psychology.md'),
        mythbusting: loadDNA('finance-mythbusting.md'),
      },
      hooks: loadDNA('finance-hooks.md'),
      routing: loadRoutingRules(),
      constraints: loadHardConstraints(),
    },
  },
  'horror-vn': {
    id: 'horror-vn',
    name: 'Kể chuyện kinh dị Việt Nam',
    brand: 'Chuyện Ma Đêm Khuya',
    // ... tương tự
  },
};
```

→ **KHÔNG cần sửa core app logic** — chỉ add config mới.

### 6.4. Bước 4 — Test routing với 5-10 title mẫu

```
- Manual check 5-10 title đầu tiên
- Kiểm tra routing rules có match đúng branch không
- Tinh chỉnh regex/keyword nếu cần
```

### 6.5. Ví dụ thêm niche "Horror Việt Nam"

**Bộ DNA sẽ là:**

```
docs/dna/
├── horror-core.md             ← Tone u ám, sfx, buildup
├── horror-story-driven.md     ← Kể chuyện SCP, đô thị huyền bí
├── horror-psychological.md    ← Tâm lý nhân vật, paranoia
├── horror-urban-legend.md     ← Truyền thuyết đô thị
└── horror-hooks.md            ← Hook kể chuyện ma
```

**Routing rules đặc trưng horror:**
- "Câu chuyện có thật về..." → story-driven
- "SCP-[0-9]+" → story-driven
- "Nếu bạn nghe thấy tiếng..." → psychological

**Hard constraints riêng horror:**
- CẤM bịa địa điểm thật là "có ma" gây hoang mang
- CẤM khuyến khích trả thù, bạo lực
- LUÔN disclaimer "câu chuyện có thật/không có thật đều mang tính giải trí"

→ Đây là pattern. Áp dụng tương tự cho storytelling, review, travel,...

---

## 7. CHECKLIST TRIỂN KHAI

### 7.1. Cho niche hiện tại (Finance)

- [ ] Đã đọc `finance-core.md`
- [ ] Đã đọc tối thiểu 2/4 file nhánh
- [ ] Đã đọc `finance-hooks.md`
- [ ] Đã test routing với 5-10 title từ dataset 50 script
- [ ] Đã validate hard constraints với 5-10 script có sẵn
- [ ] Đã chạy thử 1-2 title qua AI gateway, output pass constraints

### 7.2. Cho niche mới (Horror / Storytelling / ...)

- [ ] Đã đặt tên niche + brand
- [ ] Đã viết core DNA (tương tự finance-core.md)
- [ ] Đã viết 3-5 branch DNA
- [ ] Đã viết hook library
- [ ] Đã viết niche profile (file này)
- [ ] Đã đăng ký trong `src/config/niches.ts`
- [ ] Đã test routing với 5-10 title mẫu
- [ ] Đã test end-to-end (UI → AI → output)

### 7.3. Kiểm tra chất lượng định kỳ

Mỗi tháng nên check:
- [ ] Có đủ 4 kiểu Hook trong lịch phát hành không?
- [ ] Có script nào fail hard constraints không? (sửa ngay)
- [ ] Few-shot examples có còn phù hợp không? (update khi xu hướng đổi)
- [ ] Routing rules còn match đúng không? (kiểm tra trên 20-30 title mới)

---

## 8. TÓM TẮT — FILE NÀY LÀ GÌ

**Mục đích:**
- Là hợp đồng giữa 6 file DNA (core + 4 nhánh + hooks) với phần còn lại của hệ thống
- Là template cho mọi niche sau này (chỉ copy schema, đổi nội dung)
- Là reference cho AI engineer khi tích hợp vào code

**Không phải:**
- File prompt có thể gửi thẳng cho AI → file này là **schema + hướng dẫn**
- File documentation marketing → đây là **technical reference**

**Khi nào dùng:**
- AI engineer: đọc §2 để hiểu schema, §5 để integrate vào code
- Product: đọc §6 để biết cách thêm niche mới
- Content team: đọc §4 để biết routing + §3 để tạo prompt thủ công khi cần

---

**Phiên bản:** 1.0.0
**Cập nhật:** 2026-07-26
**Phụ thuộc:**
- BẮT BUỘC đọc trước: `finance-core.md`
- KHUYẾN NGHỊ đọc: `finance-{branch}.md` tương ứng
- Tham chiếu: `finance-hooks.md`
'''

with open(os.path.join(OUT_DIR, 'niche-finance.md'), 'w', encoding='utf-8') as f:
    f.write(CONTENT)
print("OK: niche-finance.md")
