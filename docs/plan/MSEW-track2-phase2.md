# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 2 - Phase 2 (Supabase Persistence)

---

### BƯỚC 1: Tạo Migration File `supabase/migrations/20260804_multi_niche_schema.sql`
- **File:** `supabase/migrations/20260804_multi_niche_schema.sql` (Tạo mới)
- **Nội dung:**

```sql
-- 1. Table: niches
CREATE TABLE IF NOT EXISTS niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table: niche_dna_files
CREATE TABLE IF NOT EXISTS niche_dna_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  file_type TEXT NOT NULL, -- 'core' | 'branch' | 'hook' | 'example'
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_dna_file UNIQUE (niche_id, file_type, file_name)
);

-- 3. Table: niche_routing_rules
CREATE TABLE IF NOT EXISTS niche_routing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  branch TEXT NOT NULL,
  hook TEXT,
  must_haves TEXT[],
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_rule_per_niche UNIQUE (niche_id, rule_id)
);

-- 4. Table: niche_hard_constraints
CREATE TABLE IF NOT EXISTS niche_hard_constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  constraint_id TEXT NOT NULL,
  description TEXT NOT NULL,
  enforcement TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'error',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_constraint_per_niche UNIQUE (niche_id, constraint_id)
);

-- 5. Table: user_niches
CREATE TABLE IF NOT EXISTS user_niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  niche_id TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_niche UNIQUE (user_id, niche_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_niches_owner ON niches(owner_id);
CREATE INDEX IF NOT EXISTS idx_dna_files_niche ON niche_dna_files(niche_id);
CREATE INDEX IF NOT EXISTS idx_routing_niche ON niche_routing_rules(niche_id);

-- Enable RLS
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_dna_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_hard_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_niches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY niches_select ON niches FOR SELECT USING (is_system = true OR owner_id = auth.uid());
CREATE POLICY niches_insert ON niches FOR INSERT WITH CHECK (is_system = false AND owner_id = auth.uid());
CREATE POLICY niches_update ON niches FOR UPDATE USING (is_system = false AND owner_id = auth.uid());
CREATE POLICY niches_delete ON niches FOR DELETE USING (is_system = false AND owner_id = auth.uid());

CREATE POLICY dna_select ON niche_dna_files FOR SELECT USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = true OR owner_id = auth.uid())
);
CREATE POLICY dna_manage ON niche_dna_files FOR ALL USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = false AND owner_id = auth.uid())
);

CREATE POLICY routing_select ON niche_routing_rules FOR SELECT USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = true OR owner_id = auth.uid())
);
CREATE POLICY routing_manage ON niche_routing_rules FOR ALL USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = false AND owner_id = auth.uid())
);

CREATE POLICY constraints_select ON niche_hard_constraints FOR SELECT USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = true OR owner_id = auth.uid())
);
CREATE POLICY constraints_manage ON niche_hard_constraints FOR ALL USING (
  niche_id IN (SELECT niche_id FROM niches WHERE is_system = false AND owner_id = auth.uid())
);

CREATE POLICY user_niches_all ON user_niches FOR ALL USING (user_id = auth.uid());
```

---

### BƯỚC 2: Tạo `src/services/niche/NicheSeeder.ts`
- **File:** `src/services/niche/NicheSeeder.ts` (Tạo mới)
- **Nội dung:**

```typescript
import { supabase } from '../../lib/supabase';
import { FINANCE_VN_CONFIG } from '../../config/niches';

export async function seedFinanceNiche(): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from('niches')
      .select('niche_id')
      .eq('niche_id', FINANCE_VN_CONFIG.nicheId)
      .maybeSingle();

    if (existing) return;

    // 1. Insert Niche
    await supabase.from('niches').insert({
      niche_id: FINANCE_VN_CONFIG.nicheId,
      name: FINANCE_VN_CONFIG.name,
      brand: FINANCE_VN_CONFIG.brand,
      is_system: true,
      version: FINANCE_VN_CONFIG.version,
      status: FINANCE_VN_CONFIG.status,
      metadata: FINANCE_VN_CONFIG.metadata,
    });

    // 2. Insert Core DNA
    await supabase.from('niche_dna_files').insert({
      niche_id: FINANCE_VN_CONFIG.nicheId,
      file_type: 'core',
      file_name: 'finance-core.md',
      content: FINANCE_VN_CONFIG.coreDna,
    });

    // 3. Insert Branches
    for (const [branchName, content] of Object.entries(FINANCE_VN_CONFIG.branches)) {
      await supabase.from('niche_dna_files').insert({
        niche_id: FINANCE_VN_CONFIG.nicheId,
        file_type: 'branch',
        file_name: `finance-${branchName}.md`,
        content,
      });
    }

    // 4. Insert Hooks
    await supabase.from('niche_dna_files').insert({
      niche_id: FINANCE_VN_CONFIG.nicheId,
      file_type: 'hook',
      file_name: 'finance-hooks.md',
      content: FINANCE_VN_CONFIG.hooks,
    });

    // 5. Insert Routing Rules
    for (const rule of FINANCE_VN_CONFIG.routingRules) {
      await supabase.from('niche_routing_rules').insert({
        niche_id: FINANCE_VN_CONFIG.nicheId,
        rule_id: rule.ruleId,
        keywords: rule.keywords,
        branch: rule.branch,
        hook: rule.hook,
        priority: rule.priority,
      });
    }

    // 6. Insert Hard Constraints
    for (const constraint of FINANCE_VN_CONFIG.hardConstraints) {
      await supabase.from('niche_hard_constraints').insert({
        niche_id: FINANCE_VN_CONFIG.nicheId,
        constraint_id: constraint.constraintId,
        description: constraint.description,
        enforcement: constraint.enforcement,
        severity: constraint.severity,
      });
    }

    console.log('✅ Đã seed thành công Niche Hệ Thống: finance-vn');
  } catch (error) {
    console.warn('Lỗi khi seed Niche vào Supabase (dùng in-memory fallback):', error);
  }
}
```

---

### BƯỚC 3: Cập nhật `src/services/niche/NicheService.ts`
- **File:** `src/services/niche/NicheService.ts`
- Bổ sung logic load từ Supabase và lắp ghép đối tượng `NicheConfig`, kết hợp In-Memory Cache (TTL = 5 phút) và fallback về `FINANCE_VN_CONFIG` nếu offline.
