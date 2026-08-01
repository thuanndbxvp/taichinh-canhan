| Step | File | Lines Changed | Status |
|------|------|---------------|--------|
| 3.1  | src/features/generation/useGenerationWorkflow.test.ts | +2 (scriptStyle, scriptHook) | DONE |
| 3.2  | types.ts | +1 (brief?: any on LibraryItem) | DONE |
| 3.3  | src/services/ai/AiGateway.ts | ~1 ('ai_generation_failed' → 'AI_GENERATION_FAILED') | DONE |
| 3.3  | src/lib/errors.ts | +1 ('AI_GENERATION_FAILED' in AppErrorCode union) | DONE |
| 3.4  | src/services/ai/ProviderError.ts | +2 ('http', 'provider' in ProviderErrorKind union) | DONE |
| 3.5  | src/services/ai/router.ts | ~1 (./schemas → ./responseParser) | DONE |
| 3.6  | tsconfig.json | +3 (exclude field) | DONE |
| EXTRA | src/services/ai/providers/KymaProvider.ts | ~1 (statusCode → status) | DONE (audit fix, sếp duyệt) |
| EXTRA | src/services/ai/providers/OpenAiCompatibleProvider.ts | ~1 (statusCode → status) | DONE (audit fix, sếp duyệt) |