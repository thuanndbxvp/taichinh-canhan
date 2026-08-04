# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 2 - Phase 5 (Full Persistence & Verification)

---

### BƯỚC 1: Hoàn thiện CRUD trong `src/services/niche/NicheService.ts`
- **File:** `src/services/niche/NicheService.ts`
- **Thực hiện:**
  - Bổ sung hàm `saveCustomNiche(niche: NicheConfig)`:
    + Insert vào bảng `niches`.
    + Insert các file DNA vào `niche_dna_files`.
    + Insert các routing rules vào `niche_routing_rules`.
    + Insert các constraints vào `niche_hard_constraints`.
    + Gọi `invalidateCache(niche.nicheId)`.
  - Bổ sung hàm `updateNiche(niche: NicheConfig)`:
    + Cập nhật bảng `niches`, ghi đè các file DNA trong `niche_dna_files`.
    + Gọi `invalidateCache(niche.nicheId)`.
  - Bổ sung hàm `deleteCustomNiche(nicheId: string)`:
    + Kiểm tra `is_system` (nếu true thì cấm xóa).
    + Delete từ bảng `niches`.

---

### BƯỚC 2: Nối dây UI trong `DnaImportWizard.tsx` và `NicheEditorModal.tsx`
- **File:** `src/features/niche/DnaImportWizard.tsx`
  + Khi nhấn "Xác nhận & Lưu", gọi `await nicheService.saveCustomNiche(builtNiche)` và refresh danh sách niches trong `NicheContext`.
- **File:** `src/features/niche/NicheEditorModal.tsx`
  + Khi nhấn "Lưu thay đổi", gọi `await nicheService.updateNiche(editedNiche)` và refresh context.

---

### BƯỚC 3: Chạy Kiểm Thử Toàn Bộ (Verification & Build)
- Chạy lệnh:
  ```bash
  npm test
  npm run typecheck
  npm run build
  ```
- Xác nhận 100% tests pass và build thành công không có bất kỳ warning/error nào.
