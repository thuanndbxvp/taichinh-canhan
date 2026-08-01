# Tái cấu trúc Input & Xây dựng Tính năng Viết lại Kịch bản (Rewrite Mode)

Bản kế hoạch này giải quyết 2 vấn đề lớn được nêu ra: 
1. Khắc phục tình trạng "Mô tả" nuốt chửng "Tiêu đề" (theo báo cáo của Tier 2).
2. Xây dựng một luồng (workflow) hoàn toàn mới và độc lập để "Tẩy rửa/Viết lại" kịch bản gốc dựa trên DNA của Chú Que.

> [!NOTE]
> Chiến lược cốt lõi: Phân tách rạch ròi 2 luồng thao tác. 
> - **Luồng Tạo Mới:** Nhập Tiêu đề + Dàn ý ngắn -> Sinh kịch bản.
> - **Luồng Viết Lại:** Dán Kịch bản gốc siêu dài -> Tẩy rửa văn phong.

## User Review Required

> [!IMPORTANT]
> **Giới hạn độ dài ô Mô tả:** Để ép luồng "Tạo mới" đi đúng hướng, tôi đề xuất khóa cứng độ dài ô "Mô tả" (Outline Content) tối đa **1500 ký tự**. Nếu sếp có 1 bài báo 5000 chữ, sếp sẽ phải dùng luồng "Viết lại" (Rewrite Mode) thay vì dán vào ô "Mô tả". Sếp có đồng ý với giới hạn này không?

> [!QUESTION]
> **Mức độ can thiệp của AI khi Viết lại:** Chế độ Rewrite nên mặc định AI tự quyết định (vừa sửa từ ngữ, vừa gò lại cấu trúc 5 bước), HAY sếp muốn có một thanh trượt/dropdown để chọn mức độ: (1) Chỉ sửa từ ngữ/văn phong, (2) Đập đi xây lại hoàn toàn cấu trúc?

## Proposed Changes

---

### Phân định Trọng số (Luồng Tạo Mới)

Sẽ kết hợp cả Phương án B (Prompt Engineering) và Phương án C (UI Limits) từ báo cáo của Tier 2.

#### [MODIFY] `components/ControlPanel.tsx`
- Giới hạn `maxLength={1500}` cho ô nhập liệu "Mô tả / Yêu cầu đạo diễn".
- Thêm một câu text nhỏ (helper text) bên dưới ô Mô tả: *"Tối đa 1500 ký tự. Để viết lại một kịch bản có sẵn dài hơn, vui lòng sử dụng tính năng Tẩy rửa kịch bản"*.

#### [MODIFY] `src/services/ai/prompts/index.ts`
- Sửa hàm `finance.script.outline`: Cập nhật block `userRequirements` để đưa ra chỉ thị cứng:
  1. Title là XƯƠNG SỐNG duy nhất.
  2. Outline Content chỉ là Ý PHỤ, không được làm lệch Title.
  3. Nếu xung đột, bắt buộc ưu tiên Title.

---

### Xây dựng Rewrite Mode (Luồng Viết Lại)

Đi theo Option B đã thống nhất: Giao diện Side-by-side độc lập để mang lại cảm giác premium.

#### [NEW] `components/RewriteModal.tsx`
- Tạo một Modal tràn viền (Full-screen Modal) với layout chia đôi (Split-pane).
- **Trái:** Textarea cực lớn để dán Kịch bản gốc (Original Script).
- **Phải:** Khung hiển thị Kịch bản sau khi tẩy (Rewritten Script).
- **Thanh công cụ ở giữa (hoặc trên cùng):** Nút "Tẩy rửa DNA", Chọn phong cách, Nút Copy.

#### [MODIFY] `App.tsx` (hoặc `ControlPanel.tsx`)
- Thêm một nút nổi bật (ví dụ: Nút có icon ♻️) với nhãn "Tẩy rửa kịch bản gốc". Nút này dùng để mở `RewriteModal`.

#### [MODIFY] `src/features/generation/useGenerationWorkflow.ts`
- Viết thêm hàm `rewriteScript(originalText: string, options: ...)`.
- Hàm này sẽ **bỏ qua** bước `classifyTopic`, `deepResearch` và `generateOutline`.
- Nó sẽ gọi thẳng vào bộ prompt `finance.script.revise` (đã có sẵn) để AI xử lý toàn bộ đoạn text đầu vào theo DNA lõi.
- *Lưu ý:* Nếu text quá dài, có thể cần áp dụng cơ chế chia nhỏ (chunking) hoặc yêu cầu LLM model hỗ trợ context dài.

## Verification Plan

### Automated Tests
- Chạy `npm run typecheck` để đảm bảo các component và hàm mới tạo không phá vỡ Type của `GenerationParams`.
- Chạy các test case hiện có của AI Prompts.

### Manual Verification
- **Test Trọng số:** Nhập một Tiêu đề rõ ràng (VD: "Đầu tư Vàng 2026") và một Mô tả xung đột (VD: "Hãy nói về Bất động sản"). Đảm bảo AI vẫn ra dàn ý về Vàng và chỉ mượn yếu tố BĐS làm ví dụ phụ.
- **Test Rewrite Mode:** Mở tính năng Tẩy rửa, dán một bài báo hoa mỹ đầy tính từ ("Thị trường rực rỡ như một đóa hoa..."). Bấm nút và kiểm tra xem AI ở bên phải có cắt sạch tính từ, gò vào cấu trúc logic hay không. Đảm bảo giao diện Side-by-side hoạt động mượt mà.
