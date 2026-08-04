# ACCEPTANCE CRITERIA: Track 1 - Phase 2 (Prompt Engine & Humanizer)

- [ ] File `src/services/ai/prompts/index.ts` export đầy đủ `buildGenerationHumanizerBlock`, `buildRewritingHumanizerBlock`, `buildRewritingSystemPrompt`.
- [ ] `buildFinanceSystemPrompt` nhúng đầy đủ 11 quy tắc Humanizer cho luồng Generation.
- [ ] `finance.script.revise` và `finance.script.revise.partial` nạp 100% DNA (`coreRaw`, `Branch DNA`, `Hook DNA`) kèm bộ lọc Humanizer thông qua `buildRewritingSystemPrompt`.
- [ ] `finance.script.outline` yêu cầu bài toán mô phỏng và trả về khối metadata `<!-- WORD_COUNT_ESTIMATION: {...} -->`.
- [ ] `finance.script.part` yêu cầu bắt buộc có bài toán mô phỏng số liệu cho Phần 3 & 4 và truyền biên độ số từ rõ ràng.
- [ ] File `docs/dna/finance-core.md` được cập nhật đồng bộ các quy tắc Humanizer.
- [ ] Chạy `npm run typecheck` không có bất kỳ lỗi TypeScript nào.
