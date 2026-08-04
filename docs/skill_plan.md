# Kế Hoạch Nâng Cấp Kịch Bản: Kiểm Soát Số Từ (±5%), Tăng Chiều Sâu & Tẩy Sạch Mùi Văn AI (Humanizer)

## Mục Tiêu Tổng Thể
Giải quyết trọn gói 3 vấn đề lớn để kịch bản đạt chất lượng chuẩn người viết (Human-level Copywriting) cho kênh "Chú Que Tài Chính":
1. **Kiểm soát số từ chính xác (±5%) & Tối ưu UI:** Mở khóa ô nhập `Tổng số từ`, bổ sung các Preset gợi ý thời lượng cho video tài chính, cơ chế bù trừ động giữa các phần.
2. **Tăng cường chiều sâu nội dung (Depth & Mechanism):** Chấm dứt tình trạng viết "hời hợt, lý thuyết suông"; bắt buộc có bài toán mô phỏng giả định cụ thể và lập luận 3 tầng (What → Why → How).
3. **Tích hợp bộ quy tắc Humanizer từ [SKILL.md](file:///D:/Dark-Frontiers/docs/SKILL.md):** Triệt tiêu hoàn toàn các dấu hiệu "văn mẫu AI" (Staccato drama, Aphorism formulas, Negative parallelisms, Em-dash overuse, Vague attributions, AI vocabulary).

---

## User Review Required

> [!IMPORTANT]
> **1. UI & Presets số từ:**
> - Mở khóa ô `Tổng số từ` (`wordCount`) trên [ControlPanel.tsx](file:///D:/Dark-Frontiers/components/ControlPanel.tsx).
> - Thêm các nút Preset nhanh: `600 từ (Ngắn)`, `1200 từ (Chuẩn)`, `1800 từ (Chuyên sâu - Khuyên dùng ⭐)`, `2400 từ (Chi tiết)`.
> - Hiển thị ước tính thời lượng tự động (VD: `1800 từ ≈ 10 phút đọc`).
> 
> **2. Cơ chế kiểm soát số từ (Sai số ±5%):**
> - Prompt từng phần kèm giới hạn cứng `[Target * 0.95, Target * 1.05]`.
> - Cơ chế **Dynamic Word Count Redistribution**: Tự động bù trừ số từ thừa/thiếu giữa các phần để tổng bài luôn khớp mục tiêu ban đầu.
>
> **3. Tích hợp Humanizer từ [SKILL.md](file:///D:/Dark-Frontiers/docs/SKILL.md) vào DNA & Prompts:**
> - **Cấm Staccato Drama (§31):** Nghiêm cấm giật cục hàng loạt câu cộc lốc để làm màu ("Lan nghỉ việc. Không kế hoạch. Mất trắng.").
> - **Cấm Aphorism Formulas (§32):** Nghiêm cấm đạo lý rỗng tuếch kiểu "Tiền bạc không phải là đích đến mà là tấm gương...".
> - **Cấm Negative Parallelisms (§9):** Nghiêm cấm điệp từ máy móc "Không chỉ... mà còn...", "Không phải vì A, cũng không phải vì B, mà là vì C...".
> - **Cấm Khởi động sân khấu hóa (§28, §33):** Cấm "Hãy cùng tôi đi sâu...", "Nói thật nhé...", "Bạn có bao giờ tự hỏi...". Đi thẳng vào câu chuyện và số liệu thật.
> - **Cấm Từ vựng AI tiếng Việt (§7):** Cấm "bức tranh toàn cảnh", "minh chứng sống động", "then chốt", "vô cùng", "tấm thảm", "bản hòa ca".
> - **Cấm Lạm dụng Dấu gạch ngang Em Dash `—` (§14):** Thay bằng dấu phẩy, hai chấm hoặc liên từ tự nhiên.

---

## Proposed Changes

### 1. Giao Diện Người Dùng (UI / UX)

#### [MODIFY] [ControlPanel.tsx](file:///D:/Dark-Frontiers/components/ControlPanel.tsx)
- Mở khóa input `wordCount` (bỏ `disabled`, gỡ thông báo "đang phát triển").
- Bổ sung bộ nút Preset chọn nhanh số từ chuẩn tài chính kèm nhãn ước tính thời lượng.
- Thêm chú thích gợi ý: *"Kịch bản tài chính cần tối thiểu 1.800 từ để đảm bảo phân tích số liệu và tâm lý có chiều sâu."*

---

### 2. Logic Kiểm Soát Số Từ & Phân Bổ (Domain & Workflow)

#### [MODIFY] [wordCount.ts](file:///D:/Dark-Frontiers/src/domain/wordCount.ts)
- Bổ sung hàm tính biên độ `getWordCountTolerance(target: number)` (±5%).
- Bổ sung hàm tính bù trừ động `rebalanceRemainingParts(totalTarget: number, generatedParts: string[], remainingCount: number)`.

#### [MODIFY] [useGenerationWorkflow.ts](file:///D:/Dark-Frontiers/src/features/generation/useGenerationWorkflow.ts)
- Áp dụng bù trừ động khi chạy Sequential Generation: Tự động cân chỉnh chỉ tiêu từ của các phần tiếp theo dựa trên số từ thực tế của các phần đã sinh.

---

### 3. Tích Hợp Humanizer & Nâng Cấp Chiều Sâu Prompt Engine

#### [MODIFY] [finance-core.md](file:///D:/Dark-Frontiers/docs/dna/finance-core.md)
- Bổ sung chương **§10: BỘ LỌC TẨY RỬA MÙI VĂN AI (HUMANIZER ENGINE - Dựa trên Wikipedia AI Cleanup & SKILL.md)**:
  - 8 luật cấm văn phong AI (Staccato drama, Aphorisms, Negative parallelisms, Vague attributions, Em dash, AI vocabulary...).
  - Bổ sung nguyên tắc **Bài toán mô phỏng giả định (Simulated Calculation)**: Bắt buộc mổ xẻ con số cụ thể thay vì lý thuyết chung chung.

#### [MODIFY] [index.ts](file:///D:/Dark-Frontiers/src/services/ai/prompts/index.ts)
- **`buildFinanceSystemPrompt`:** Nhúng các điều luật Humanizer vào phần Enforcement Block bắt buộc.
- **`finance.script.outline` (Dàn ý):** Bỏ lệnh "viết siêu ngắn gọn"; bắt buộc Dàn ý phải xác định: (1) Cơ chế ngầm, (2) Bài toán mô phỏng giả định, (3) Góc nhìn phản biện.
- **`finance.script.part` (Từng phần kịch bản):**
  - Giao chỉ tiêu số từ với biên độ ±5%: `Từ ${minWords} đến ${maxWords} từ`.
  - Ép cấu trúc 3 tầng: Hiện tượng (What) → Cơ chế & Bẫy ngầm (Why) → Hành động định lượng (How).
  - Ép Phần 3 & 4 phải có bài toán giả định giải phẫu cụ thể.
- **`finance.script.rewriteLevel1` & `finance.script.rewriteLevel2` (Tẩy Rửa / Rewrite Mode):**
  - Nhúng đầy đủ checklist Humanizer từ `SKILL.md` để phát hiện và thanh lọc mọi câu văn robot từ kịch bản gốc.

---

## Verification Plan

### Automated Tests
- Kiểm tra TypeScript compilation:
  ```powershell
  npm run typecheck
  ```
- Chạy unit tests cho `wordCount`:
  ```powershell
  npm test
  ```

### Manual Verification
1. **Kiểm tra UI Input & Presets:**
   - Thao tác gõ số từ tự do trong ô `Tổng số từ`.
   - Bấm thử các nút Preset (600, 1200, 1800, 2400) xem input và số phút ước tính có đổi theo không.
2. **Kiểm tra Tạo Kịch Bản Mới (1.800 từ):**
   - Sinh kịch bản chủ đề tài chính (VD: *"Nghỉ việc văn phòng khi lương 25 triệu"*).
   - Đo tổng số từ thực tế: Kiểm tra sai số có nằm trong khoảng `1.710 - 1.890 từ` (±5%) không.
   - Đo chiều sâu nội dung: Kiểm tra Phần 3 & 4 có bài toán giả định mô phỏng số tiền, quỹ dự phòng, chi phí cơ hội thực tế không.
3. **Kiểm tra Giọng Văn AI (Humanizer Audit):**
   - Quét kịch bản xem có bị dính: Staccato drama cụt lủn, Negative parallelisms ("không chỉ... mà còn..."), Em dash (`—`), hay từ ngữ sáo rỗng ("bức tranh toàn cảnh", "then chốt") hay không.
