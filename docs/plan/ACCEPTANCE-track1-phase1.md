# ACCEPTANCE CRITERIA: Track 1 - Phase 1 (Word Count Engine)

- [ ] File `src/domain/wordCount.ts` được cập nhật đầy đủ các types, constants, và functions mới (`ToleranceMode`, `WordCountTolerance`, `MIN_PART_FLOOR = 250`, `getWordCountTolerance`, `isWithinTolerance`, `countWords`, `rebalanceRemainingParts`, `detectConciseRequest`, `determineToleranceMode`, `formatWordCount`).
- [ ] Các hàm cũ (`minutesToTargetWords`, `wordsToMinutes`, `splitWordCountAcrossParts`) vẫn hoạt động bình thường, không gây lỗi cho các module đang import.
- [ ] File `src/domain/wordCount.test.ts` được tạo mới và chạy lệnh `npm test src/domain/wordCount.test.ts` đạt kết quả PASS 100%.
- [ ] Hàm `rebalanceRemainingParts` luôn chặn sàn `MIN_PART_FLOOR = 250 từ` khi còn phần chưa sinh.
- [ ] Chạy `npm run typecheck` hoàn toàn sạch sẽ, không có lỗi TypeScript.
