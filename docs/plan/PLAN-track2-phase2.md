# PLAN: Track 2 - Phase 2: Database Architecture & Supabase Persistence

### 1. Kiến Trúc Cơ Sở Dữ Liệu (Supabase PostgreSQL)
```
                    ┌─────────────────────────┐
                    │         niches          │
                    │  id (PK, UUID)          │
                    │  niche_id (UK, TEXT)    │
                    │  name, brand, is_system │
                    │  owner_id (FK -> users) │
                    └───────────┬─────────────┘
                                │ 1 : N
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────┐
│ niche_dna_files  │  │niche_routing_rule│  │niche_hard_constraints  │
│ - file_type      │  │ - rule_id        │  │ - constraint_id        │
│ - file_name      │  │ - keywords []    │  │ - description          │
│ - content        │  │ - branch, hook   │  │ - enforcement, severity│
└──────────────────┘  └──────────────────┘  └────────────────────────┘
```

### 2. Danh Sách File Cần Tạo & Cập Nhật
1. `supabase/migrations/20260804_multi_niche_schema.sql` [NEW]
2. `src/services/niche/NicheSeeder.ts` [NEW]
3. `src/services/niche/NicheService.ts` [MODIFY]
4. Unit Tests cho Supabase integration: `src/services/niche/NicheService.supabase.test.ts` [NEW]
