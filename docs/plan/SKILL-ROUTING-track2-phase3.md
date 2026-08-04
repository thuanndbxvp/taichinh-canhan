# SKILL ROUTING: Track 2 - Phase 3 (User DNA Import Wizard & Custom Niches)

### Được phép sử dụng:
- **React Components & Modals:** Xây dựng trong `src/features/niche/` (`DnaImportWizard.tsx`, `NicheEditorModal.tsx`, `NicheManagementModal.tsx`).
- **AI Service:** Gọi LLM qua `aiService.ts` để phân tích và thẩm định DNA.
- **Supabase Client:** Thực hiện các thao tác CRUD Niche do người dùng sở hữu.

### KHÔNG được phép sử dụng:
- Không cho phép người dùng sửa hoặc xóa các Niche hệ thống (`is_system: true`).
- Không lưu các file DNA không hợp lệ vào Database (bắt buộc qua bước thẩm định validation).
