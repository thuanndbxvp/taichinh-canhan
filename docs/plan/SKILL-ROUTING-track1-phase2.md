# SKILL ROUTING: Track 1 - Phase 2 (Prompt Engine & Humanizer)

### Được phép sử dụng:
- **TypeScript:** Chỉnh sửa file `src/services/ai/prompts/index.ts`.
- **Markdown:** Cập nhật file tài liệu DNA `docs/dna/finance-core.md`.

### KHÔNG được phép sử dụng:
- Không sửa UI trong Phase này (`components/ControlPanel.tsx`, `components/OutputDisplay.tsx`... để dành cho Phase 4).
- Không sửa logic workflow React Hooks trong Phase này (`src/features/generation/useGenerationWorkflow.ts` để dành cho Phase 3).
- Không tự ý xóa các prompt keys hiện có trong `PromptRegistry` để tránh làm vỡ các module khác gọi tới.
