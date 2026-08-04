# PLAN: Track 2 - Phase 3: User-Custom Niches & DNA Import Wizard

### 1. Kiến Trúc Luồng Người Dùng (User Workflow)
```
[Nút "+ Tạo Niche Mới" trên UI]
              ↓
[DNA Import Wizard (5 Bước)]
  ├─ Bước 1: Thông tin cơ bản (Tên, Brand, Audience)
  ├─ Bước 2: Tải lên / Nhập Markdown (Core DNA, Nhánh, Hooks)
  ├─ Bước 3: AI Thẩm Định (Phát hiện Rules, Kiểm tra chất lượng DNA)
  ├─ Bước 4: Tinh chỉnh Routing Rules & Ràng buộc
  └─ Bước 5: Lưu & Kích hoạt lên Supabase
              ↓
[Niche Switcher: Tự động đổi Persona & Kịch bản toàn app]
```

### 2. Danh Sách File Cần Tạo & Cập Nhật
1. `src/features/niche/DnaImportWizard.tsx` [NEW]
2. `src/services/ai/DnaValidator.ts` [NEW]
3. `src/features/niche/NicheEditorModal.tsx` [NEW]
4. `src/features/niche/NicheSwitcher.tsx` [MODIFY]
5. `components/Navbar.tsx` hoặc header area [MODIFY]
