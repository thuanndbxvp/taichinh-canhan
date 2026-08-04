# SKILL ROUTING: Track 2 - Phase 1 (Niche Abstraction Layer)

### Được phép sử dụng:
- **TypeScript:** Tạo các interfaces, services và dynamic builders trong `src/services/niche/`, `src/services/ai/`, và `src/config/`.
- **React & Context API:** Tạo `src/contexts/NicheContext.tsx` và `src/features/niche/NicheSwitcher.tsx`.
- **Vitest:** Viết unit tests kiểm tra `NicheService`, `DynamicPromptBuilder`, và `DynamicRouter`.

### KHÔNG được phép sử dụng:
- Không được làm gãy các tính năng kịch bản tài chính hiện có (kênh Chú Que Tài Chính vẫn phải hoạt động 100% trơn tru).
- Chưa đụng đến Database Supabase trong Phase này (việc kết nối Supabase sẽ thực hiện ở Phase 2).
- Không cài thêm thư viện quản lý state cồng kềnh ngoài React Context có sẵn.
