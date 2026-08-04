# SKILL ROUTING: Track 1 - Phase 3 (Workflow Integration)

### Được phép sử dụng:
- **TypeScript & React Hooks:** Cập nhật file `src/features/generation/useGenerationWorkflow.ts`.
- **Domain imports:** Import các hàm từ `src/domain/wordCount.ts` (`rebalanceRemainingParts`, `determineToleranceMode`, `ToleranceMode`, `MIN_PART_FLOOR`).

### KHÔNG được phép sử dụng:
- Không sửa UI components (`ControlPanel.tsx`, `OutputDisplay.tsx`... để dành cho Phase 4).
- Không phá vỡ các luồng `resetAllCaches`, `stopSequential`, `resumeSequential` hiện tại.
