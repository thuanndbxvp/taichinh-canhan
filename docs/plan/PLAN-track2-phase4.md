# PLAN: Track 2 - Phase 4: Dynamic Workflow Integration

### 1. Kiến Trúc Tích Hợp Workflow
```
[NicheContext: activeNiche]
            │
            ▼
[useGenerationWorkflow(brief, aiProvider, selectedModel, activeNiche)]
            │
            ├──> classifyTopic(title, activeNiche)
            │         └──> DynamicRouter.route(title, activeNiche)
            │
            ├──> generateScriptOutline(params, ..., activeNiche)
            │         └──> DynamicPromptBuilder.buildOutlinePrompt(activeNiche)
            │
            ├──> generateScriptPart(partIndex, params, ..., activeNiche)
            │         └──> DynamicPromptBuilder.buildPartPrompt(activeNiche)
            │
            └──> reviseScript(original, prompt, ..., activeNiche)
                      └──> DynamicPromptBuilder.buildRewritingSystemPrompt(activeNiche)
```

### 2. Danh Sách File Sửa Đổi
1. `services/aiService.ts` [MODIFY]
2. `src/features/generation/useGenerationWorkflow.ts` [MODIFY]
3. `components/ControlPanel.tsx` [MODIFY] (Hiển thị Style selector động theo `activeNiche.branches`)
4. `App.tsx` [MODIFY] (Truyền `activeNiche` vào `useGenerationWorkflow`)
