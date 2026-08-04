# PLAN: Track 2 - Phase 1: Niche Abstraction Layer

### 1. Kiến Trúc Tổng Thể (Universal Niche Architecture)
```
┌────────────────────────────────────────────────────────┐
│                      NicheConfig                       │
│  - nicheId, name, brand, metadata                     │
│  - coreDna, branches { ... }, hooks                   │
│  - routingRules [ ... ], hardConstraints [ ... ]      │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
  DynamicPromptBuilder                DynamicRouter
  - buildSystemPrompt()               - route(title, niche)
  - buildOutlinePrompt()
  - buildPartPrompt()
  - buildRewritingPrompt()
            │                               │
            └───────────────┬───────────────┘
                            ▼
                      NicheContext
                            ▼
                    React UI / Workflow
```

### 2. Danh Sách File Cần Tạo & Cập Nhật
1. `src/services/niche/NicheConfig.ts` [NEW]
2. `src/config/niches.ts` [NEW]
3. `src/services/niche/NicheService.ts` [NEW]
4. `src/services/ai/DynamicPromptBuilder.ts` [NEW]
5. `src/services/ai/DynamicRouter.ts` [NEW]
6. `src/contexts/NicheContext.tsx` [NEW]
7. `src/features/niche/NicheSwitcher.tsx` [NEW]
8. `App.tsx` [MODIFY]
9. Unit Tests: `src/services/niche/NicheService.test.ts` & `src/services/ai/DynamicPromptBuilder.test.ts` [NEW]
