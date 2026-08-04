# CONTEXT: Track 2 - Phase 2: Database Architecture & Supabase Persistence

### 1. Bối Cảnh Dự Án
Sau khi đã trừu tượng hóa Niche thành các module TypeScript (Phase 1), các Niche vẫn đang được gắn cứng trong code client.
Để người dùng có thể lưu trữ, đồng bộ trên Cloud và quản trị nhiều ngách nội dung khác nhau, hệ thống cần chuyển sang lưu trữ bền vững trên cơ sở dữ liệu Supabase PostgreSQL với phân quyền RLS (Row Level Security) chặt chẽ.

### 2. Mục Đích Của Task (Track 2 - Phase 2)
1. **Thiết kế Database Schema & Migration:**
   - Tạo các bảng: `niches`, `niche_dna_files`, `niche_routing_rules`, `niche_hard_constraints`, `user_niches`.
   - Thiết lập các Indexes tối ưu hóa tốc độ truy vấn.
   - Thiết lập các chính sách bảo mật Supabase RLS (System Niches công khai / User Niches riêng tư).
2. **Xây dựng NicheSeeder:**
   - Tự động nạp Niche hệ thống (`finance-vn` — Chú Que Tài Chính) vào Supabase nếu chưa tồn tại.
3. **Cập nhật NicheService:**
   - Chuyển `NicheService` sang truy vấn trực tiếp từ Supabase kèm bộ nhớ đệm In-Memory Cache (TTL 5 phút) để tối ưu hiệu năng và giảm tải request.
