# CONTEXT: Track 2 - Phase 5: Full Supabase Persistence & E2E Verification

### 1. Bối Cảnh Dự Án
Đây là Phase kết thúc của toàn bộ Track 2.
Sau khi Dynamic Workflow đã được nối dây ở Phase 4, chúng ta cần hoàn thiện kết nối các hành động của người dùng trên UI (Tạo Niche mới qua Wizard, Chỉnh sửa DNA trong Niche Editor, Xóa Niche) trực tiếp với cơ sở dữ liệu Supabase thông qua `NicheService`, đồng thời kiểm thử E2E toàn bộ luồng tạo và sinh kịch bản đa ngách.

### 2. Mục Đích Của Task (Track 2 - Phase 5)
1. **Hoàn thiện CRUD Niche trong `NicheService.ts`:**
   - `saveCustomNiche(niche: NicheConfig)`: Lưu Niche + DNA Files + Routing Rules + Hard Constraints lên Supabase.
   - `updateNiche(niche: NicheConfig)`: Cập nhật dữ liệu Niche và làm mới Cache.
   - `deleteCustomNiche(nicheId: string)`: Xóa Niche người dùng (bảo vệ Niche hệ thống).
2. **Nối dây UI:**
   - Nối nút "Xác nhận & Lưu" trong `DnaImportWizard.tsx` gọi `nicheService.saveCustomNiche()`.
   - Nối nút "Lưu thay đổi" trong `NicheEditorModal.tsx` gọi `nicheService.updateNiche()`.
3. **End-to-End Verification:**
   - Chạy toàn bộ test suites (`npm test`), kiểm tra type (`npm run typecheck`), build production (`npm run build`).
