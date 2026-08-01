# MICRO-STEP EXECUTION WORKFLOW (MSEW): Rewrite Script

### BƯỚC 1: Sửa bug lõi AI & Update Prompt
- **File:** `src/services/ai/prompts/index.ts`
- Tìm hàm `finance.script.revise` (dòng 298-306). Sửa hết chữ lỗi: `LDNA` -> `LỆNH`, `BÐT BUỘC` -> `BẮT BUỘC`, `phân tíchn` -> `phân tích`, `lập luạn` -> `lập luận`, `Ưu tién` -> `Ưu tiên`, `Ví dụe` -> `Ví dụ`, `chíchn` -> `chính`, `Tở lệ` -> `Tỷ lệ`, `Bớc` -> `Bước`, `tối đđa` -> `tối đa`, `KÐT THÚC LÖNH ===ẾT THÚC LỆNH ===` -> `KẾT THÚC LỆNH ===`.
- Tại `finance.script.outline` (dòng 184), sửa đoạn `userRequirements`: "HƯỚNG DẪN: 1. Lấy Chủ đề làm XƯƠNG SỐNG duy nhất. 2. Lồng ghép Yêu cầu nhưng KHÔNG làm lệch Chủ đề. 3. Nếu xung đột -> ƯU TIÊN Chủ đề."

### BƯỚC 2: Ràng buộc UI Control Panel
- **File:** `components/ControlPanel.tsx`
- Tìm textarea `outlineContent`. Thêm `maxLength={800}`.
- Thêm helper text bên dưới: "Tối đa 800 ký tự. Để viết lại kịch bản dài, hãy dùng tính năng Tẩy rửa kịch bản gốc."

### BƯỚC 3: Tạo Modal Rewrite
- **File:** `components/RewriteModal.tsx` (Tạo mới)
- Modal có layout Flex Row (chia 2 cột 50-50).
- Cột trái: `<textarea>` to để nhập "Kịch bản gốc".
- Header/Toolbar: Input "Chủ đề (để nhận diện phong cách)", Select "Mức độ can thiệp" (Value: 1 và 2), Nút "Bắt đầu tẩy rửa".
- Cột phải: Khung hiển thị text kết quả.

### BƯỚC 4: Logic Gọi AI
- **File:** `src/features/generation/useGenerationWorkflow.ts`
- Thêm hàm `const rewriteScript = async (title: string, originalScript: string, level: number)`
- Logic:
  1. Gọi `classifyTopic(title)` để lấy branch.
  2. Tạo `revisionPrompt`:
     - Level 1: "Giữ nguyên cấu trúc, chỉ sửa văn phong và từ vựng theo DNA."
     - Level 2: "Đập đi gò lại toàn bộ bài viết thành đúng 5 phần tiêu chuẩn của DNA. Giữ luận điểm chính."
     - NẾU Level 2: Append thêm đoạn "BẮT BUỘC phân bổ lại nội dung thành 5 phần rõ rệt: MỞ ĐẦU (HOOK) -> BỐI CẢNH & VẤN ĐỀ -> GIẢI PHẪU DỮ LIỆU -> GIẢI PHÁP THỰC TẾ -> ĐÚC KẾT & KÊU GỌI." vào `revisionPrompt`.
  3. Gọi `finance.script.revise({ script, revisionPrompt, style: getStyleByBranch(branch) })`. Lưu kết quả.

### BƯỚC 5: Gắn nút gọi Modal
- **File:** `App.tsx`
- Import `RewriteModal`. Cài đặt state `isRewriteModalOpen`.
- Thêm một FAB button hoặc nút to ở góc với nhãn "♻️ Tẩy rửa kịch bản" để mở Modal.
