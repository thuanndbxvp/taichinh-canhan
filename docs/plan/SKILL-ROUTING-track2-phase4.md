# SKILL ROUTING: Track 2 - Phase 4 (Dynamic Workflow Integration)

### Được phép sử dụng:
- **TypeScript:** Cập nhật `services/aiService.ts` và `src/features/generation/useGenerationWorkflow.ts`.
- **React:** Cập nhật `ControlPanel.tsx` để render danh sách nhánh động (`activeNiche.branches`).

### KHÔNG được phép sử dụng:
- Không phá vỡ luồng sequential generation hay backward compatibility đối với kịch bản `finance-vn`.
- Không thay đổi signature các hàm exported public mà không hỗ trợ optional fallback.
