# PLAN: Track 1 - Phase 4: UI Updates (Word Count Calibration & Badges)

### 1. Kiến Trúc Giao Diện
1. **ControlPanel.tsx — Khối Cấu Trúc & Định Dạng (Word Count):**
   - Bỏ thuộc tính `disabled` và dòng chữ *"Tính năng kiểm soát số từ chính xác đang được phát triển"*.
   - Tạo danh sách `WORD_COUNT_PRESETS`:
     - 600 từ (Ngắn - 3')
     - 1200 từ (Chuẩn - 6-7')
     - 1800 từ (Chuyên sâu - 10' - Khuyên dùng)
     - 2400 từ (Chi tiết - 13-14')
   - Nhận prop `outlineEstimation?: OutlineEstimation | null`.
   - Nếu có `outlineEstimation`: Hiển thị box thông báo nổi bật chứa `minRecommendedWords` và `optimalWords`.
   - Tự động hiển thị nhãn Mode: `⚡ Chế độ Linh hoạt (±20%)` hoặc `🎯 Chế độ Chuẩn (±5%)`.
   - Hiển thị ước lượng thời lượng đọc: `~Math.round(wordCount / 180)` phút.
2. **OutputDisplay.tsx — Word Count Badge:**
   - Khi có kịch bản (giai đoạn sequential hoặc hoàn tất), tính toán `actualWords = countWords(script)`.
   - Hiển thị Badge:
     - Xanh lá nếu nằm trong biên độ `isWithinTolerance`.
     - Vàng cam nếu lệch ra ngoài biên độ.
     - Hiển thị chuỗi format: `formatWordCount(actualWords, tolerance)`.

### 2. Danh Sách File Sửa Đổi
- `components/ControlPanel.tsx`
- `components/OutputDisplay.tsx`
- `App.tsx` (Truyền props kết nối)
