# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 1 - Phase 5 (Verification & Audit)

---

### BƯỚC 1: Chạy Bộ Unit Tests
- Chạy lệnh:
  ```bash
  npm test
  ```
- Yêu cầu: 100% tests trong `src/domain/wordCount.test.ts` và các test suites khác đều pass.

---

### BƯỚC 2: Kiểm Tra Type Toàn Dự Án
- Chạy lệnh:
  ```bash
  npm run typecheck
  ```
- Yêu cầu: Không có bất kỳ lỗi TypeScript nào.

---

### BƯỚC 3: Kiểm Tra Build Sản Phẩm
- Chạy lệnh:
  ```bash
  npm run build
  ```
- Yêu cầu: Build thành công ra thư mục `dist/` mà không có warning nghiêm trọng hay broken dependencies.

---

### BƯỚC 4: Tự Động Kiểm Tra Chất Lượng Kịch Bản Mẫu (Script Quality Audit)
- Kiểm tra lại các file sinh ra hoặc các test strings:
  1. Kiểm tra không chứa các từ cấm: `cực kỳ`, `vô cùng`, `tuyệt đối`, `bức tranh toàn cảnh`, `minh chứng rõ nét`, `chìa khóa vàng`.
  2. Kiểm tra không chứa emoji trong phần script text.
  3. Kiểm tra số từ nằm trong dung lượng chỉ định.
- Đánh dấu hoàn tất checklist trong `ACCEPTANCE-track1-phase5.md`.
