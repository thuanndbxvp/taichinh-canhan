# PLAN: Track 1 - Phase 1: Xây Dựng Word Count Engine & Unit Tests

### 1. Kiến Trúc & Lý Do Thiết Kế
Để kịch bản đạt chuẩn độ dài và chất lượng, hệ thống cần một "trái tim toán học" độc lập với UI và AI.
Domain layer `src/domain/wordCount.ts` sẽ chịu trách nhiệm:
1. **Quản lý 2 chế độ Tolerance (Dual Mode):**
   - `standard`: Biên độ ±5% (cho kịch bản chuyên sâu 1.800 - 2.400 từ).
   - `flexible`: Biên độ ±20% (cho kịch bản ngắn gọn, tóm tắt).
2. **Cơ chế chống bóp nghẹt dung lượng (Floor Protection):**
   - Khi phần trước sinh quá dài, hàm `rebalanceRemainingParts` sẽ tự động dồn số từ cho các phần còn lại, nhưng KHÔNG BAO GIỜ hạ mục tiêu của 1 phần xuống dưới `MIN_PART_FLOOR = 250 từ`. Điều này đảm bảo Phần 3 & 4 luôn đủ đất diễn cho bài toán mô phỏng số liệu.
3. **Phát hiện ý đồ người dùng (Intent Detection):**
   - Tự động quét từ khóa "ngắn gọn", "tóm tắt", "khoảng X từ" trong Description để chọn mode phù hợp.

### 2. Luồng Dữ Liệu (Data Flow)
```
User Description + Target Word Count
                ↓
    detectConciseRequest() 
                ↓
    determineToleranceMode() → ('standard' | 'flexible')
                ↓
    getWordCountTolerance() → { min, max, target, mode }
                ↓
    [Vòng lặp sinh từng phần]
                ↓
    rebalanceRemainingParts() [Max(250, target)] → newPartTarget
                ↓
    countWords(partScript) → actualWords
                ↓
    formatWordCount() → Chuỗi hiển thị độ lệch %
```

### 3. Danh Sách File Cần Tác Động
- `src/domain/wordCount.ts` (Nâng cấp & thay thế toàn bộ logic cũ)
- `src/domain/wordCount.test.ts` (Tạo mới bộ unit test Vitest)
