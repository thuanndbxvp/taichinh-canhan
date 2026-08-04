# ACCEPTANCE CRITERIA: Track 2 - Phase 1 (Niche Abstraction Layer)

- [ ] File `src/services/niche/NicheConfig.ts` định nghĩa đầy đủ các interfaces của Niche Architecture.
- [ ] File `src/config/niches.ts` xuất bản `FINANCE_VN_CONFIG` chứa 100% dữ liệu DNA Chú Que Tài Chính.
- [ ] `NicheService` tải config chính xác, có fallback an toàn và in-memory caching.
- [ ] `DynamicPromptBuilder` và `DynamicRouter` hoạt động chính xác theo unit tests.
- [ ] `NicheContext` và `NicheSwitcher` tích hợp mượt mà trong `App.tsx` mà không làm gián đoạn luồng làm việc hiện tại của người dùng.
- [ ] Toàn bộ unit tests mới pass 100%, `npm run typecheck` không có lỗi.
