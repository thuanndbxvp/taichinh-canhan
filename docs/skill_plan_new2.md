# Kế Hoạch Triển Khai: Kiểm Soát Số Từ (±5%), Nâng Tầm Chiều Sâu & Tẩy Sạch Mùi Văn AI (Humanizer Engine)

## Mục Tiêu Tổng Thể
Giải quyết triệt để 3 vấn đề lớn để đưa kịch bản kênh "Chú Que Tài Chính" đạt đẳng cấp người viết chuyên nghiệp (Human-level Copywriting):
1. **Kiểm soát số từ chính xác (Sai số ±5%) & Nâng cấp UI:** Mở khóa ô nhập `Tổng số từ`, bổ sung Preset chọn nhanh cho video tài chính kèm ước tính thời lượng phút, cơ chế bù trừ động (`rebalanceRemainingParts`) giữa các phần.
2. **Nâng cấp chiều sâu kịch bản (Chống hời hợt):** Bắt buộc bài toán giả định mô phỏng bằng con số thực tế (Simulated Calculation) tại Phần 3 & 4, phân tích theo cấu trúc 3 tầng: *Hiện tượng (What) → Cơ chế & Bẫy ngầm (Why) → Hành động định lượng (How)*.
3. **Tích hợp Humanizer Engine từ [SKILL.md](file:///D:/Dark-Frontiers/docs/SKILL.md) & Tái Cấu Trúc Rewrite:** 
   - Đồng bộ System Prompt cho cả Generation và Rewrite (sửa dứt điểm lỗi `finance.script.revise` dùng block cứng thiếu 80% DNA).
   - Xây dựng `buildRewritingSystemPrompt()` riêng cho vai trò "Script Doctor / Senior Financial Editor".
   - Triệt tiêu 100% các dấu hiệu AI: Staccato drama cụt lủn (§31), Đạo lý rỗng tuếch (§32), Điệp từ máy móc (§9), Khởi động sân khấu hóa (§28, §33), Từ vựng AI tiếng Việt (§7).
   - Xử lý xung đột thực tế: Giới hạn tối đa 2 dấu gạch ngang (`—`) mỗi phần cho nhịp ngắt kịch tính (§14), cấm 100% emoji trong script nhưng giữ nguyên trên UI (§18), giữ bắt buộc disclaimer tài chính (§21).

---

## User Review Required

> [!IMPORTANT]
> **1. Giao diện & Presets Số Từ ([ControlPanel.tsx](file:///D:/Dark-Frontiers/components/ControlPanel.tsx)):**
> - Mở khóa ô `Tổng số từ` (bỏ `disabled`, gỡ thông báo "đang phát triển").
> - Thêm 4 nút Preset chuẩn: `600 từ (Ngắn - 3')`, `1200 từ (Chuẩn - 6-7')`, `1800 từ (Chuyên sâu - 10' ⭐ Khuyên dùng)`, `2400 từ (Chi tiết - 13-14')`.
> - Hiển thị nhãn ước tính thời lượng tự động theo thời gian thực (180 WPM).
>
> **2. Kiểm soát Số Từ & Bù Trừ Động ([wordCount.ts](file:///D:/Dark-Frontiers/src/domain/wordCount.ts) & [useGenerationWorkflow.ts](file:///D:/Dark-Frontiers/src/features/generation/useGenerationWorkflow.ts)):**
> - Áp dụng cơ chế **Dynamic Rebalance per part** cho Sequential Generation: Nếu phần trước viết lệch trong biên độ cho phép, phần sau tự động co giãn chỉ tiêu để tổng kịch bản cuối cùng nằm đúng trong khoảng `[Target * 0.95, Target * 1.05]`.
> - Rewrite Mode: Không ép cứng co kéo số từ để tránh phá hỏng văn bản gốc từ người dùng.
>
> **3. UI Feedback Badge ([OutputDisplay.tsx](file:///D:/Dark-Frontiers/components/OutputDisplay.tsx)):**
> - Hiển thị badge kiểm soát số từ thực tế: `📊 1.830 / 1.800 từ (Lệch +1.6% — Đạt chuẩn ±5% ✅)`.
>
> **4. Humanizer Engine & Tái Cấu Trúc Prompts ([index.ts](file:///D:/Dark-Frontiers/src/services/ai/prompts/index.ts)):**
> - Thêm `buildRewritingSystemPrompt(branch, level)` chuyên biệt cho Rewrite/Tẩy Rửa.
> - Cập nhật `buildFinanceSystemPrompt` với 10 quy tắc Humanizer cốt lõi cho Generation.
> - Ép bài toán giả định mô phỏng số liệu (Simulated Calculation) vào Dàn ý và Prompt Part 3 & 4.

---

## Proposed Changes

### Component 1: Giao Diện Người Dùng (UI / UX)

#### [MODIFY] [ControlPanel.tsx](file:///D:/Dark-Frontiers/components/ControlPanel.tsx)
- Mở khóa input `wordCount` (`disabled={false}`).
- Bổ sung cụm Preset Buttons (600, 1200, 1800, 2400 từ) có highlight nút đang chọn.
- Hiển thị ước tính thời lượng: `~X phút đọc`.
- Thêm gợi ý: *"Kịch bản tài chính cần tối thiểu 1.800 từ để có đủ không gian giải phẫu số liệu & cơ chế ngầm."*

#### [MODIFY] [OutputDisplay.tsx](file:///D:/Dark-Frontiers/components/OutputDisplay.tsx)
- Bổ sung thanh hiển thị số từ thực tế so với mục tiêu kèm badge trạng thái (Xanh lá nếu nằm trong ±5%, Vàng nếu vượt ngưỡng).

---

### Component 2: Logic Kiểm Soát Số Từ (Domain & Workflow)

#### [MODIFY] [wordCount.ts](file:///D:/Dark-Frontiers/src/domain/wordCount.ts)
- Bổ sung hàm tính biên độ cho phép: `getWordCountTolerance(target: number): { min: number; max: number; target: number }` (±5%).
- Bổ sung hàm bù trừ động: `rebalanceRemainingParts(totalTarget: number, generatedParts: string[], remainingCount: number): number`.

#### [NEW] [wordCount.test.ts](file:///D:/Dark-Frontiers/src/domain/wordCount.test.ts)
- Viết unit tests kiểm tra:
  + Biên độ sai số ±5% cho các mức target (600, 1200, 1800, 2400).
  + Logic bù trừ số từ chính xác khi các phần trước thừa/thiếu.

#### [MODIFY] [useGenerationWorkflow.ts](file:///D:/Dark-Frontiers/src/features/generation/useGenerationWorkflow.ts)
- Tích hợp `rebalanceRemainingParts` vào `generateNextPart` để điều chỉnh target từng phần theo tiến độ thực tế.

---

### Component 3: Prompt Engine & Hệ Thống DNA

#### [MODIFY] [index.ts](file:///D:/Dark-Frontiers/src/services/ai/prompts/index.ts)
- **Tạo mới `buildRewritingSystemPrompt(branch, level)`:**
  - Nạp đầy đủ `coreRaw`, `Branch DNA`, `Hook DNA`.
  - Nhúng vai trò "Script Doctor & Senior Editor".
  - Nhúng bảng kiểm tra 33 quy tắc Humanizer từ `SKILL.md`.
- **Cập nhật `finance.script.revise` & `finance.script.revise.partial`:**
  - Thay thế khối lệnh cứng cũ bằng `buildRewritingSystemPrompt()`.
- **Cập nhật `buildFinanceSystemPrompt()`:**
  - Nhúng khối **Humanizer Generation Rules** (10 patterns cốt lõi: Cấm Staccato drama, Cấm Đạo lý sáo rỗng, Cấm Điệp từ máy móc, Cấm Từ vựng AI, Giới hạn tối đa 2 dấu `—`/phần, Cấm 100% emoji trong script).
- **Cập nhật `finance.script.outline` (Dàn ý):**
  - Bỏ lệnh "viết siêu ngắn gọn 1-2 câu".
  - Bắt buộc dàn ý từng phần phải nêu rõ: (1) Cơ chế ngầm, (2) Bài toán mô phỏng giả định, (3) Góc nhìn phản biện.
- **Cập nhật `finance.script.part` (Từng phần):**
  - Ràng buộc biên độ số từ chặt chẽ: `Mục tiêu: ${target} từ (Cho phép trong khoảng từ ${min} đến ${max} từ, sai số tối đa ±5%).`
  - Bắt buộc Phần 3 & 4 phải có **1 bài toán giả định mô phỏng bằng số liệu cụ thể** (lương, nợ, lãi suất, so sánh phương án...).

#### [MODIFY] [finance-core.md](file:///D:/Dark-Frontiers/docs/dna/finance-core.md)
- Cập nhật chương **§10: BỘ LỌC TẨY RỬA MÙI VĂN AI (HUMANIZER ENGINE)** tổng hợp các nguyên tắc cốt lõi đã qua xử lý xung đột.
- Thêm nguyên tắc bài toán mô phỏng giả định vào cấu trúc luận điểm.

---

## Kế Hoạch Thực Hiện Theo 3 Phase

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE A: Prompt Engine & Humanizer (Ưu tiên cao nhất)        │
│ 1. Sửa index.ts: Tạo buildRewritingSystemPrompt()           │
│ 2. Cập nhật finance.script.revise & partial                 │
│ 3. Nhúng Humanizer Generation Rules vào buildFinancePrompt  │
│ 4. Thêm bài toán mô phỏng giả định vào outline & part       │
├─────────────────────────────────────────────────────────────┤
│ PHASE B: Kiểm Soát Số Từ ±5% & Giao Diện UI                 │
│ 1. Cập nhật wordCount.ts (tolerance & rebalance function)   │
│ 2. Viết unit tests wordCount.test.ts                        │
│ 3. Mở khóa ô Tổng số từ & Thêm Preset buttons (ControlPanel)│
│ 4. Tích hợp rebalance vào useGenerationWorkflow.ts          │
│ 5. Bổ sung Badge Word Count vào OutputDisplay.tsx           │
├─────────────────────────────────────────────────────────────┤
│ PHASE C: Xác Minh, Audit & Cập Nhật Tài Liệu DNA            │
│ 1. Chạy npm run typecheck & npm test                        │
│ 2. Test sinh kịch bản 1.800 từ thực tế & đo sai số          │
│ 3. Audit chất lượng giọng văn (diệt sạch mùi bot AI)         │
│ 4. Cập nhật finance-core.md hoàn tất                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Verification Plan

### Automated Tests
- Chạy kiểm tra toàn bộ TypeScript compilation:
  ```powershell
  npm run typecheck
  ```
- Chạy bộ unit tests (bao gồm `wordCount.test.ts` và `PromptRegistry.test.ts`):
  ```powershell
  npm test
  ```

### Manual Verification
1. **Kiểm tra UI Input & Presets:**
   - Mở giao diện ứng dụng, gõ số từ tùy ý vào ô `Tổng số từ`.
   - Bấm lần lượt 4 nút Preset (600, 1200, 1800, 2400) xem input và số phút ước tính có cập nhật mượt mà không.
2. **Kiểm tra Tạo Kịch Bản 1.800 từ (Target 1800):**
   - Tạo kịch bản chủ đề tài chính (VD: *"Nên mua nhà trả góp 20 năm hay thuê nhà rồi đem tiền đi đầu tư?"*).
   - Kiểm tra tổng số từ thực tế: Đảm bảo nằm trong khoảng `[1710, 1890]` từ (sai số ≤ 5%).
   - Kiểm tra UI Badge hiển thị chính xác % sai lệch.
   - Kiểm tra chiều sâu nội dung: Phần 3 & 4 có bài toán tính tiền thực tế (VD: Lãi suất 9.5%/năm, giá nhà 2.5 tỷ, thuê nhà 8 triệu/tháng...) chứng minh rõ ràng thay vì nói lý thuyết suông.
3. **Kiểm tra Humanizer Audit (Giọng văn AI):**
   - Quét kịch bản: Tuyệt đối không còn câu cộc lốc giả drama (Staccato drama), không có điệp từ máy móc ("không chỉ... mà còn..."), tối đa 2 dấu `—`/phần, không có emoji trong kịch bản.
4. **Kiểm tra Tính năng Tẩy Rửa (Rewrite Mode):**
   - Mở modal Tẩy Rửa, chạy thử Mức 1 và Mức 2 trên một đoạn văn bản mẫu bị sặc mùi AI xem kết quả trả về có được lột xác thành giọng văn người viết hay không.
