# AUDIT REPORT — MSEW-deep-research (Tier 2 Pre-Audit)

> **Quyết định: TỪ CHỐI CODE — YÊU CẦU TẦNG 1 THIẾT KẾ LẠI**
>
> Sau khi đọc `MSEW-deep-research.md` và đối chiếu với toàn bộ codebase, Tier 2 phát hiện **6 blockers** nghiêm trọng khiến việc thi công theo bản vẽ hiện tại sẽ sinh bug, gãy types, và lệch kiến trúc. Cần Tầng 1 review trước khi gõ code.

---

## Blocker #1 — `[CẦN ĐIỀN ...]` KHÔNG ĐẾN TỪ `generateScriptOutline` MÀ TỪ MICROSERVICE FACTCHECK

**Phát hiện:**
- MSEW BƯỚC 3.3 + 3.6 nói: "AI bị cấm dùng placeholder, BẮT BUỘC pivot".
- Nhưng trong `services/aiService.ts` dòng 78-89, `generateScriptOutline` có **2 bước**:
  1. `callWithPrompt('finance.script.outline', ...)` → sinh outline thô.
  2. `callWithPrompt('finance.script.factcheck', ...)` → kiểm duyệt số liệu. **Đây chính là nơi tạo ra `[CẦN ĐIỀN CHÍNH XÁC ...]`** (xem prompt `finance.script.factcheck` dòng 712: "Thay thế các số liệu bịa đặt bằng biến số cần điền...").
- User prompt `finance.script.outline` (dòng 204) mới ép logic "nếu hệ thống không cung cấp trong DỮ LIỆU VĨ MÔ, bắt buộc phải dùng biến số [CẦN ĐIỀN]" — **prompt gốc vẫn cho phép dùng placeholder**.

**Tác động:** Nếu chỉ đổi prompt `finance.script.outline` mà không sửa `finance.script.factcheck`, placeholder `[CẦN ĐIỀN]` VẪN xuất hiện → KHÔNG đạt acceptance #4.

**Đề xuất:** Tầng 1 cần quyết — (a) bỏ luôn bước factcheck, hoặc (b) viết lại prompt factcheck để KHÔNG chèn `[CẦN ĐIỀN]` và thay bằng pivot instruction. Hiện tại MSEW không đề cập factcheck.

---

## Blocker #2 — BƯỚC 3.4 SAI TÊN TRƯỜNG: `researchContext` KHÔNG TỒN TẠI

**Phát hiện:**
- MSEW BƯỚC 3.4 yêu cầu: "Sửa `finance.script.outline`: Thay tham số `macroContext` bằng `researchContext`."
- **NHƯNG** `types.ts` dòng 73: `macroContext?: string` — đây là field trong `GenerationParams`.
- `finance.script.outline` (dòng 179) build từ `params: GenerationParams` → `buildFinanceSystemPrompt(..., params.macroContext)` (dòng 189).
- `finance.script.factcheck` (dòng 690) nhận `{ outline, macroContext }` — **dùng `macroContext` trực tiếp qua destructuring**, không qua `params`.

**Tác động:** Nếu tôi đổi tên `macroContext` → `researchContext` trong `types.ts`:
- `buildFinanceSystemPrompt` dùng `params.macroContext` → phải sửa → TypeScript sẽ gãy ở 3 chỗ (`finance.script.outline`, `finance.script.part`, `finance.script.revise`).
- `aiService.ts` dòng 166 (`params.macroContext = fetchedMacro`) → phải sửa.
- `aiService.ts` dòng 83 (`{ outline, macroContext: params.macroContext }`) → phải sửa.
- `dataRetrieval.ts` line 37-82 — không có researchContext.
- `OutputDisplay.tsx` dòng 331-345 — render `macroData` (state cũ).

**Tác động blast radius: 5+ files.** MSEW BƯỚC 3.4 chỉ nói "sửa `finance.script.outline`" — không đủ độ rộng.

**Đề xuất:** Tầng 1 cần quyết — (a) GIỮ tên `macroContext` trên `GenerationParams` (chỉ đổi nội dung) để giảm blast radius, hoặc (b) chính thức đổi tên và liệt kê TẤT CẢ files cần sửa (types.ts, aiService.ts, prompts/index.ts, useGenerationWorkflow.ts, OutputDisplay.tsx).

---

## Blocker #3 — BƯỚC 3.4 CẤM PLACEHOLDER NHƯNG DNA LÕI VẪN DÙNG

**Phát hiện:**
- MSEW BƯỚC 3.3 yêu cầu thêm quy tắc CẤM placeholder vào `docs/dna/finance-core.md`.
- DNA hiện tại **không quy định** placeholder (đã search — không có từ `[CẦN ĐIỀN` trong `docs/dna/`).
- **NHƯNG** `finance.script.outline` user prompt (dòng 204) CHÍNH LÀ nơi đang ép dùng `[CẦN ĐIỀN GIÁ VÀNG NĂM 2004]`. Prompt này nằm ngoài DNA.

**Tác động:** Đụng DNA là cảm giác "an toàn", nhưng vô hiệu hóa logic placeholder đòi hỏi sửa PROMPT, không phải DNA. MSEW BƯỚC 3.3 chỉ nói DNA — không đủ.

**Đề xuất:** Tầng 1 cần update thêm BƯỚC 3.4.1: "Sửa prompt `finance.script.outline` dòng 204: thay quy tắc '[CẦN ĐIỀN]' bằng 'PIVOT' instruction."

---

## Blocker #4 — BƯỚC 3.5 `performDeepResearch` THIẾU 4 PROMPT ID

**Phát hiện:**
- MSEW BƯỚC 3.5 triển khai 4 bước: facet → search → synthesis → factcheck/revise.
- BƯỚC 3.4 mới chỉ nói "Thêm Object `research` vào object `finance`" — KHÔNG liệt kê 4 prompt ID cụ thể.
- `PromptRegistry.ts` dòng 27-45 — `PromptId` type KHÔNG có `finance.research.facet`, `finance.research.synthesis`, `finance.research.factcheck`, `finance.research.revise`.
- Để compile được, Tầng 2 phải thêm 4 PromptId mới (đụng PromptRegistry.ts).

**Tác động:** MSEW BƯỚC 3.4 che giấu việc phải sửa `PromptRegistry.ts` (theo docs/skills/typist-mindset.md, sửa type registry cũng là thay đổi kiến trúc).

**Đề xuất:** Tầng 1 cần liệt kê TƯỜNG MINH 4 PromptId mới:
- `finance.research.facet`
- `finance.research.synthesis`
- `finance.research.factcheck`
- `finance.research.revise`

Và cho phép Tier 2 sửa `PromptRegistry.ts` để thêm type union.

---

## Blocker #5 — BƯỚC 3.2 XOÁ `MissingDataBanner` KHÔNG TỒN TẠI

**Phát hiện:**
- MSEW BƯỚC 3.2 nói: "File `components/ControlPanel.tsx` → Xoá import `<MissingDataBanner>` → Xoá các props và state liên quan: `onResolveMissingData`, `missingDataCount`."
- **ControlPanel.tsx KHÔNG import `MissingDataBanner`** (đã đọc — chỉ import `OptionSelector`, `SparklesIcon`, `Tooltip`, `BookmarkIcon`, `IdeaFileUploader`, `LightbulbIcon`, `CheckIcon`, `BoltIcon`).
- **ControlPanel.tsx KHÔNG có prop `onResolveMissingData` hay `missingDataCount`** (đã đọc toàn bộ interface dòng 17-60).
- `MissingDataBanner` THỰC TẾ nằm trong `OutputDisplay.tsx` (dòng 522-598), cùng với logic `onResolveMissingData`, `resolvingStrategy`, `showMissingDataModal`, `MissingDataModal`.

**Tác động:** Tier 2 không tìm thấy code để xoá theo MSEW. Bám theo MSEW sẽ KHÔNG xoá được UI Missing Data.

**Đề xuất:** Tầng 1 cần sửa lại BƯỚC 3.2 — dời toàn bộ phần xoá sang `OutputDisplay.tsx` (xem Blocker #6).

---

## Blocker #6 — BƯỚC 3.2 XOÁ LOGIC `isEditing`/`handleSaveEdit`/`editContent` KHÔNG TỒN TẠI TRONG `OutputDisplay.tsx`

**Phát hiện:**
- MSEW BƯỚC 3.2 nói: "Gỡ bỏ logic liên quan đến `isEditing`, `handleSaveEdit`, `editContent`."
- **OutputDisplay.tsx có `isEditingOutline` (dòng 206)**, KHÔNG có `isEditing`/`handleSaveEdit`/`editContent`. Logic này nằm trong sub-component `InteractiveBadge` (dòng 115-164) — dùng cho `[KIỂM TRA LẠI: ...]` inline edit.
- `setIsEditingOutline` (dòng 207, 536) — vẫn phải xoá vì nó toggle chế độ edit outline.

**Tác động:** Tier 2 phải tự quyết:
- Xoá `InteractiveBadge` component (dòng 115-164).
- Xoá `renderHighlightedScript` (dòng 166-183) — vì nó gọi `InteractiveBadge` và dùng cho `[CẦN ĐIỀN]` filtering.
- Xoá `isEditingOutline` state + mọi chỗ dùng.
- Xoá `onChangeScript` logic (vì không còn badge cần save).
- Xoá `MissingDataBanner` (dòng 522-598).
- Xoá `MissingDataModal` render (dòng 615-623).
- Xoá `showMissingDataModal` state.

**Đề xuất:** Tầng 1 cần chốt:
- (a) Xoá HẾT `onChangeScript` (vì sao render phải có callback change khi user không sửa gì nữa?) → KHÔNG dùng ReactMarkdown thuần tuý theo mệnh đề "Dàn ý bây giờ chỉ render qua thẻ `<ReactMarkdown>` thuần tuý".
- (b) Xác nhận `OutputDisplay` phải GIỮ `macroData` slot (vì BƯỚC 3.6 nói truyền `researchContext` vào `params` — tức là vẫn có data retrieval layer, chỉ là tên đổi).

---

## Blocker #TỔNG — KHẢ NĂNG DEPENDENCIES

**Quét nhanh:**
- Đã có `performTavilySearch` đang hoạt động (dataRetrieval.ts) → có sẵn integration Tavily.
- Các model LLM (gemini/openai) đã có qua `callWithPrompt`.
- **KHÔNG cần cài thêm npm/pip package mới.** ✅

---

## KIẾN NGHỊ TẦNG 1

Tầng 2 đề xuất Tầng 1 cập nhật MSEW với các bước cụ thể hơn:

1. **BƯỚC 3.4 (mở rộng):** Sửa `finance.script.outline` dòng 204 để cấm hoàn toàn placeholder, thay bằng "PIVOT" instruction. Sửa `finance.script.factcheck` dòng 712 để KHÔNG chèn `[CẦN ĐIỀN]` mà tự viết lại câu dựa trên dữ liệu (hoặc xoá luôn bước factcheck).

2. **BƯỚC 3.4 (mở rộng - đăng ký 4 prompt):** Đăng ký TƯỜNG MINH:
   - `finance.research.facet` (Facet Generator)
   - `finance.research.synthesis` (Tổng hợp từ Tavily)
   - `finance.research.factcheck` (Đánh giá lỗ hổng research)
   - `finance.research.revise` (Sửa research summary)
   - Cho phép Tier 2 sửa `PromptRegistry.ts` để thêm vào `PromptId` union.

3. **BƯỚC 3.2 (sửa lại file):** Chuyển các action xoá từ `ControlPanel.tsx` → `OutputDisplay.tsx`. Liệt kê cụ thể:
   - Xoá import `MissingDataModal`, `extractPlaceholders` (dòng 15).
   - Xoá `InteractiveBadge` component (dòng 115-164).
   - Xoá `renderHighlightedScript` (dòng 166-183).
   - Xoá state `isEditingOutline`, `showMissingDataModal` (dòng 205-207).
   - Xoá `MissingDataBanner` block (dòng 522-598).
   - Xoá `MissingDataModal` render (dòng 615-623).
   - Xoá props `onChangeScript`, `onResolveMissingData`, `resolvingStrategy` khỏi interface (dòng 39-41).
   - Xoá `renderContent` gọi `renderHighlightedScript` (dòng 357) → thay bằng `<ReactMarkdown>{script}</ReactMarkdown>`.
   - Cập nhật `App.tsx` xoá prop `onResolveMissingData` (dòng 326) sau khi xoá interface.

4. **BƯỚC 3.4 (quyết định tên field):** Chốt một trong hai:
   - **Phương án A (khuyến nghị):** Giữ `macroContext` làm tên field trong `types.ts`. Chỉ đổi tên hàm `fetchMacroData` → `performDeepResearch`. Tránh blast radius.
   - **Phương án B:** Đổi sang `researchContext` → chấp nhận sửa 5+ files.

5. **BƯỚC 3.6 (làm rõ):** Xác nhận `useGenerationWorkflow`:
   - State `macroData` → đổi thành `researchSummary`?
   - `params.macroContext` → giữ nguyên tên hay đổi?
   - Nếu giữ `params.macroContext` → code trong BƯỚC 3.3 (DNA) + BƯỚC 3.4 (prompt outline) vẫn dùng `macroContext` được. Chỉ cần đổi **nguồn dữ liệu** từ `fetchMacroData` → `performDeepResearch`.

---

## TRẠNG THÁI

- **Code đã gõ:** 0 file (đã dừng trước khi sửa).
- **Commits:** 0 commit.
- **Hành động tiếp theo:** Chờ Tầng 1 cập nhật MSEW và xác nhận 5 đề xuất trên.

— Tier 2, kết thúc Pre-Audit.

---

## QUYẾT ĐỊNH CỦA PLANNER (TIER 1)
Chào Tier 2, cậu làm Pre-Audit quá xuất sắc. Tôi đã chốt các phương án xử lý như sau:
1. **Blocker #1 & #3 (Prompt logic):** Đồng ý. Tôi đã cập nhật MSEW để sửa triệt để `finance.script.outline` (xoá luật CẦN ĐIỀN dòng 204, thay bằng luật PIVOT) và `finance.script.factcheck` (xoá luật sinh CẦN ĐIỀN dòng 712, bắt nó tự xoay trục).
2. **Blocker #4 (Prompt Registry):** Đã bổ sung danh sách 4 PromptId mới vào MSEW và cho phép sửa `PromptRegistry.ts`.
3. **Blocker #5 & #6 (UI Teardown):** Đồng ý. Đã gom toàn bộ danh sách UI cần xoá chuẩn xác sang `OutputDisplay.tsx` và `App.tsx`. Xoá toàn bộ logic `onChangeScript` và render bằng `ReactMarkdown` thuần túy.
4. **Blocker #2 & Tổng số 5 (Tên field `macroContext`):** Chọn **Phương án A**. Giữ nguyên tên biến `macroContext` ở mọi nơi (`types.ts`, `params`, `useGenerationWorkflow`) để giảm blast radius. Chúng ta chỉ đổi cái "ruột" (dữ liệu nạp vào nó) từ `fetchMacroData` sang `performDeepResearch`.

Bản vẽ MSEW đã được tôi nâng cấp. Cậu bắt tay vào thi công được rồi đấy!
