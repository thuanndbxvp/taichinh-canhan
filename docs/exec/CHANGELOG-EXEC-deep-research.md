| Step | File | Lines Changed | Status |
|------|------|---------------|--------|
| 3.1  | components/MissingDataModal.tsx | -125 (file deleted) | DONE |
| 3.2  | components/OutputDisplay.tsx | -180 (component teardown) | DONE |
| 3.2  | App.tsx | -3 (prop removal) | DONE |
| 3.2  | src/features/generation/useGenerationWorkflow.ts | -50 (handleResolveMissingData teardown + stub) | DONE |
| 3.3  | src/services/ai/PromptRegistry.ts | +6 (4 PromptId + 4 map entries) | DONE |
| 3.3  | src/services/ai/prompts/index.ts | +140 (4 research prompts + 2 prompt edits) | DONE |
| 3.4  | src/services/dataRetrieval.ts | +110 (performDeepResearch pipeline) / -50 (xoá fetchMacroData) | DONE |
| 3.5  | src/features/generation/useGenerationWorkflow.ts | -7/+5 (đổi call sang performDeepResearch) | DONE |
| 6.0  | src/features/generation/useGenerationWorkflow.ts | -1 (xoá dead import performTavilySearch) | DONE (audit fix F1) |
| 6.0  | src/services/ai/PromptRegistry.ts | -6 (xoá 3 dead PromptId + 3 map entries) | DONE (audit fix F2) |
| 6.0  | src/services/ai/prompts/index.ts | -34 (xoá 3 dead prompt registrations) | DONE (audit fix F2) |
| 6.0  | services/aiService.ts | -34 (xoá resolveMissingData function) | DONE (audit fix F2) |
