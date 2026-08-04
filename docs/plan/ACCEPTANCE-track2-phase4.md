# ACCEPTANCE CRITERIA: Track 2 - Phase 4 (Dynamic Workflow Integration)

- [ ] `useGenerationWorkflow` nhận `activeNiche` từ `NicheContext` và truyền xuyên suốt xuống `aiService`.
- [ ] Khi chuyển đổi Niche (VD: sang một Niche Lịch sử hoặc Niche tùy chỉnh), toàn bộ quá trình sinh Dàn ý, từng Phần kịch bản, và Sửa kịch bản đều dùng đúng DNA của Niche đó.
- [ ] Selector Phong cách trong `ControlPanel` tự động cập nhật danh sách các nhánh theo `activeNiche.branches`.
- [ ] Chạy `npm test` và `npm run typecheck` thành công không có lỗi.
