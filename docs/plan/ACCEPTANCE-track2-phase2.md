# ACCEPTANCE CRITERIA: Track 2 - Phase 2 (Supabase Persistence)

- [ ] File migration `supabase/migrations/20260804_multi_niche_schema.sql` tạo đầy đủ 5 bảng với khóa ngoại và RLS bảo mật chặt chẽ.
- [ ] Hàm `seedFinanceNiche()` tự động khởi tạo dữ liệu Chú Que Tài Chính lên Cloud an toàn khi khởi chạy app.
- [ ] `NicheService` truy vấn dữ liệu từ Supabase mượt mà, hỗ trợ In-Memory Cache TTL 5 phút và tự động fallback về client config khi offline.
- [ ] Chính sách RLS chỉ cho phép user xem các niche hệ thống + niche do chính mình tạo ra.
- [ ] Chạy `npm test` và `npm run typecheck` thành công 100%.
