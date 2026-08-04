# SKILL ROUTING: Track 2 - Phase 2 (Supabase Persistence)

### Được phép sử dụng:
- **SQL:** Tạo file migration SQL trong `supabase/migrations/`.
- **TypeScript:** Cập nhật `src/services/niche/NicheService.ts` và tạo `src/services/niche/NicheSeeder.ts`.
- **Supabase Client:** Sử dụng `@supabase/supabase-js` hiện có trong repo.

### KHÔNG được phép sử dụng:
- Không được làm mất dữ liệu người dùng hay vô hiệu hóa Row Level Security.
- Không cho phép tài khoản thông thường chỉnh sửa hoặc xóa System Niches (`is_system = true`).
