# PLAN: Track 2 - Phase 5: Full Supabase Persistence & E2E Verification

### 1. Kiến Trúc Luồng Dữ Liệu Hoàn Thiện
```
[DnaImportWizard] / [NicheEditorModal]
                │
                ▼
      [NicheService CRUD]
        ├── saveCustomNiche() ──> [Supabase DB: niches, dna_files, rules, constraints]
        ├── updateNiche() ──────> [Supabase DB Update]
        └── deleteCustomNiche() ─> [Supabase DB Delete (User Only)]
                │
                ▼
       [Cache Invalidation]
                │
                ▼
  [NicheContext: accessibleNiches updated]
```

### 2. Danh Sách File Sửa Đổi
1. `src/services/niche/NicheService.ts` [MODIFY]
2. `src/features/niche/DnaImportWizard.tsx` [MODIFY] (Gọi `saveCustomNiche`)
3. `src/features/niche/NicheEditorModal.tsx` [MODIFY] (Gọi `updateNiche`)
4. Verification & Audit tổng kết vào `ACCEPTANCE-track2-phase5.md`.
