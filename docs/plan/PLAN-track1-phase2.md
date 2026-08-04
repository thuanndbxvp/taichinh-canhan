# PLAN: Track 1 - Phase 2: Cập Nhật Prompt Engine & Humanizer Integration

### 1. Kiến Trúc & Lý Do Thiết Kế
1. **Khắc phục DNA Leakage trong `reviseScript`:**
   - Trước đây `finance.script.revise` chỉ truyền `coreRaw` thô sơ mà thiếu toàn bộ `Branch DNA` và `Hook DNA`. Cần tạo hàm dùng chung `buildRewritingSystemPrompt(branch, level)` gom toàn bộ DNA và bổ sung Humanizer Block.
2. **Token-Optimized Humanizer Matrix:**
   - **Generation Mode & Rewrite Level 1 (Light):** Tích hợp 11 quy tắc Humanizer cốt lõi (Cấm Staccato drama §31, Cấm đạo lý rỗng §32, Cấm điệp từ máy móc §9, Cấm từ vựng AI §7, Giới hạn ≤ 2 em-dash/phần §14, Cấm 100% emoji trong script §18, Cấm filler phrases §23, Cấm signposting §28, Cấm giật tít vô nghĩa).
   - **Rewrite Level 2 (Deep):** Áp dụng toàn bộ 33 quy tắc Humanizer từ `docs/SKILL.md` (được nén súc tích dạng token-optimized) để đại tu toàn diện văn phong bài viết.
3. **Ép Buộc Bài Toán Số Liệu Trong Outline & Part Prompts:**
   - `finance.script.outline`: Bắt buộc gợi ý bài toán mô phỏng ở Phần 3 & 4 + trả về khối JSON metadata:
     `<!-- WORD_COUNT_ESTIMATION: {"minRecommendedWords": 1650, "optimalWords": 1900, "reason": "..."} -->`
   - `finance.script.part`: Yêu cầu số liệu cụ thể (lãi suất, tiền gốc, thời gian) và đưa ra bài toán mô phỏng 3 tầng.

### 2. Danh Sách File Sửa Đổi
- `src/services/ai/prompts/index.ts`
- `docs/dna/finance-core.md`
