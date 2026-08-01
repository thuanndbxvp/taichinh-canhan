# MICRO-STEP EXECUTION WORKFLOW (MSEW): Deep Research Pipeline & Đập bỏ Logic Missing Data (V2)

## 1. YÊU CẦU KỸ NĂNG (REQUIRED SKILLS)
- **React & TypeScript:** Tháo gỡ các component an toàn, không để lại dead code.
- **State Management:** Gỡ bỏ mượt mà các states dư thừa trong `OutputDisplay`, `App`.
- **Prompt Engineering & Type Safety:** Thêm 4 PromptId vào Registry. Căn chỉnh Prompt 4 bước.

## 2. BỐI CẢNH & MỤC TIÊU (CONTEXT & OBJECTIVES)
Mục tiêu: Đập bỏ toàn bộ UI/Logic "Interactive Missing Data". Áp dụng RAG pipeline (Deep Research 4 bước) qua Tavily để cào dữ liệu trước. Bắt buộc AI sử dụng dữ liệu cào được để tự động xoay trục (pivot) Dàn ý, TUYỆT ĐỐI KHÔNG DÙNG placeholder.
*Lưu ý (Từ Planner): Giữ nguyên tên biến `macroContext` ở mọi nơi để giảm blast radius. Chỉ thay đổi nội dung (nguồn dữ liệu) nạp vào nó.*

## 3. CÁC BƯỚC THỰC THI CHI TIẾT (EXECUTION STEPS)

### BƯỚC 3.1: Xóa bỏ `MissingDataModal`
- **File:** `components/MissingDataModal.tsx`
- **Hành động:** Xoá hoàn toàn file này.

### BƯỚC 3.2: Gỡ bỏ UI Missing Data khỏi các Component
- **File:** `components/OutputDisplay.tsx`
  - Xoá import `MissingDataModal`, `extractPlaceholders`.
  - Xoá Component `InteractiveBadge`.
  - Xoá hàm `renderHighlightedScript`.
  - Xoá Component `MissingDataBanner` và block render của nó.
  - Xoá block render của `MissingDataModal`.
  - Xoá các props khỏi interface: `onChangeScript`, `onResolveMissingData`, `resolvingStrategy`.
  - Xoá state: `isEditingOutline`, `showMissingDataModal`.
  - Trong hàm `renderContent`, xoá lệnh gọi `renderHighlightedScript` và thay bằng `<ReactMarkdown>{script}</ReactMarkdown>` thuần tuý.
- **File:** `App.tsx`
  - Xoá việc truyền prop `onResolveMissingData` vào `<OutputDisplay>`.
- **File:** `src/features/generation/useGenerationWorkflow.ts`
  - Xoá hàm `handleResolveMissingData` và state `missingDataItems`.

### BƯỚC 3.3: Sửa Registry & Cập nhật Prompts
- **File:** `src/services/ai/PromptRegistry.ts`
  - Thêm 4 key mới vào type `PromptId`: `'finance.research.facet'`, `'finance.research.synthesis'`, `'finance.research.factcheck'`, `'finance.research.revise'`.
- **File:** `src/services/ai/prompts/index.ts`
  - Thêm object `research` vào object `finance` chứa 4 string prompt tương ứng với 4 key trên.
  - **Sửa `finance.script.outline`:** Sửa dòng hướng dẫn người dùng (dòng ~204). Xoá luật `[CẦN ĐIỀN]`. Thêm luật PIVOT: "CHỈ SỬ DỤNG dữ liệu có thật trong DỮ LIỆU VĨ MÔ/NGHIÊN CỨU. CẤM BỊA SỐ LIỆU. CẤM SỬ DỤNG placeholder như [CẦN ĐIỀN...]. Nếu thiếu số liệu cho một ý nào đó, BẮT BUỘC TỰ XOAY TRỤC DÀN Ý sang một hướng khác khả thi hơn dựa trên data đang có."
  - **Sửa `finance.script.factcheck`:** Sửa dòng ~712. Xoá luật "Thay thế các số liệu bịa đặt bằng biến số cần điền...". Sửa thành: "Tuyệt đối không chèn thẻ CẦN ĐIỀN. Nếu phát hiện số liệu mâu thuẫn hoặc thiếu căn cứ, hãy tự động XÓA luận điểm đó và VIẾT LẠI câu văn theo một hướng xoay trục (pivot) dựa trên dữ liệu an toàn có sẵn."

### BƯỚC 3.4: Xây dựng AI Service `performDeepResearch`
- **File:** `src/services/dataRetrieval.ts` (hoặc tạo mới `deepResearch.ts`)
  - Xoá hàm `fetchMacroData`.
  - Tạo hàm `performDeepResearch(title, outlineContent, aiProvider, model, onProgress)`
  - Triển khai logic gọi tuần tự 4 prompt (Facet -> Search bằng `performTavilySearch` -> Synthesis -> Factcheck/Revise). Gọi hàm `onProgress` với các text loading tương ứng ở mỗi chặng. Trả về String tổng hợp cuối cùng.

### BƯỚC 3.5: Tích hợp vào Workflow
- **File:** `src/features/generation/useGenerationWorkflow.ts`
  - Trong hàm `generate()`, thay thế lệnh gọi `fetchMacroData` bằng `performDeepResearch(..., (msg) => setCurrentAiAction(msg))`.
  - Gán kết quả research vào `params.macroContext` (Vẫn giữ tên field này để không làm vỡ types, chỉ là ruột của nó giờ đây là kết quả của Deep Research).

## 4. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)
- [ ] Mất hoàn toàn Banner cảnh báo dữ liệu thiếu và nút Cây bút.
- [ ] Type an toàn: Không làm gãy `types.ts` vì vẫn giữ field `macroContext`.
- [ ] Prompt Cấm Placeholder: Cả outline và factcheck (bước sinh kịch bản) đều không còn tì vết của luật sinh thẻ `[CẦN ĐIỀN]`.
- [ ] Pipeline chạy mượt 4 bước trước khi sinh dàn ý.
