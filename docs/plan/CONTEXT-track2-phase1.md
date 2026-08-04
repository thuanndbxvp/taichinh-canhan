# CONTEXT: Track 2 - Phase 1: Niche Abstraction Layer

### 1. Bối Cảnh Dự Án
Hiện tại ứng dụng được gắn cứng (hardcoded) cho một kênh duy nhất là "Chú Que Tài Chính" (từ các file Markdown trong `docs/dna/` đến các hàm tạo prompt trong `src/services/ai/prompts/index.ts`).
Để mở rộng thành một nền tảng hỗ trợ đa ngách (Multi-Niche Platform) cho phép sáng tạo nhiều loại nội dung khác nhau (Kinh doanh, Lịch sử, Khoa học, Tâm lý...) mà không làm xáo trộn UX hiện tại, ta cần trừu tượng hóa toàn bộ dữ liệu DNA thành các đối tượng `NicheConfig` độc lập.

### 2. Mục Đích Của Task (Track 2 - Phase 1)
1. **Thiết kế Domain Interfaces:** Tạo `src/services/niche/NicheConfig.ts` định nghĩa cấu trúc chuẩn của một Niche (`nicheId`, `coreDna`, `branches`, `hooks`, `routingRules`, `hardConstraints`, `metadata`).
2. **Tạo Hardcoded Default Niche:** Tạo `src/config/niches.ts` đóng gói toàn bộ DNA của "Chú Que Tài Chính" thành `FINANCE_VN_CONFIG`.
3. **Xây dựng NicheService:** Tạo `src/services/niche/NicheService.ts` quản lý việc tải và truy xuất Niche Config.
4. **Xây dựng Dynamic Prompt Engine:**
   - Tạo `src/services/ai/DynamicPromptBuilder.ts` để sinh prompt linh hoạt dựa trên `NicheConfig` đang hoạt động (kết hợp các quy tắc Humanizer từ Track 1).
   - Tạo `src/services/ai/DynamicRouter.ts` để phân loại nhánh và hook theo routing rules động.
5. **State Management & UI Integration:**
   - Tạo `src/contexts/NicheContext.tsx` và `src/features/niche/NicheSwitcher.tsx`.
   - Tích hợp `NicheProvider` vào `App.tsx` (mặc định chọn `finance-vn`, không làm thay đổi luồng làm việc hiện có của người dùng).
