# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 2 - Phase 3 (User DNA Import Wizard & Custom Niches)

---

### BƯỚC 1: Xây dựng AI DNA Validator `src/services/ai/DnaValidator.ts`
- **File:** `src/services/ai/DnaValidator.ts` (Tạo mới)
- **Thực hiện:**
  - Viết module gọi AI phân tích nội dung DNA Markdown tải lên.
  - Tự động bóc tách các nhánh (branches), gợi ý kiểu mở đầu (hooks), và tạo danh sách `RoutingRule[]` từ các từ khóa nhận diện.

---

### BƯỚC 2: Xây dựng DNA Import Wizard `src/features/niche/DnaImportWizard.tsx`
- **File:** `src/features/niche/DnaImportWizard.tsx` (Tạo mới)
- **Thực hiện:**
  - Tạo Modal giao diện wizard 5 bước:
    1. Nhập Tên Niche, Tên Kênh/Brand, Đối tượng khán giả mục tiêu.
    2. Kéo thả file Markdown hoặc paste trực tiếp Core DNA & Branch DNA.
    3. Nhấn "AI Phân Tích & Thẩm Định DNA" để nhận phản hồi và đánh giá chất lượng.
    4. Xác nhận các Routing Rules và Hard Constraints.
    5. Nhấn "Hoàn Tất & Lưu Niche" → Lưu vào bảng `niches` & `niche_dna_files` trên Supabase.

---

### BƯỚC 3: Xây dựng Niche Editor Modal `src/features/niche/NicheEditorModal.tsx`
- **File:** `src/features/niche/NicheEditorModal.tsx` (Tạo mới)
- **Thực hiện:**
  - Cung cấp trình soạn thảo Markdown trực tiếp cho từng file DNA của các Niche do người dùng sở hữu.
  - Cho phép thêm, xóa, cập nhật các nhánh phân tích.

---

### BƯỚC 4: Hoàn Thiện `NicheSwitcher.tsx` & Gắn Vào Header
- **File:** `src/features/niche/NicheSwitcher.tsx`
- **Thực hiện:**
  - Hiển thị danh sách tất cả các Niches có thể truy cập (System Niches + Custom Niches).
  - Có nút "+ Tạo Niche Mới" mở `DnaImportWizard`.
  - Có icon bánh răng để mở `NicheEditorModal` cho Niche hiện tại.
  - Khi chọn Niche khác: Cập nhật `activeNiche` trong `NicheContext`, kích hoạt `DynamicPromptBuilder` cập nhật toàn bộ prompt theo Niche mới.

---

### BƯỚC 5: Kiểm Thử Toàn Diện (End-to-End Test)
- Thử tạo 1 Niche mẫu mới (Ví dụ: "Lịch Sử Chiến Tranh").
- Chuyển đổi giữa "Chú Que Tài Chính" và Niche mới, xác nhận kịch bản sinh ra đổi giọng văn và phong cách 100%.
- Chạy `npm test`, `npm run typecheck`, và `npm run build`.
