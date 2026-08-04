# MASTER REFACTOR PLAN: Dark-Frontiers → Multi-Niche Script Platform

> **Version:** 1.0.0  
> **Created:** 2026-08-04  
> **Status:** Draft — Pending Tier 1 Approval  
> **Objective:** Transform the hardcoded "Chú Que Tài Chính" app into a multi-tenant, multi-niche script generation platform where users can upload their own DNA and create script tools for any niche.

---

## EXECUTIVE SUMMARY

### Current State
The app is a **single-niche, single-tenant** application hardcoded for the "Chú Que Tài Chính" finance channel. All DNA files are statically imported at compile-time. There is no multi-niche support, no user-customizable DNA, and no multi-tenant isolation beyond user-based script storage.

### Target State
A **multi-niche platform** where:
- The "Chú Que Tài Chính" finance niche is a **built-in system niche**
- Users can upload their own DNA files and create custom niches (health, psychology, family, etc.)
- Each user gets isolated storage for their own niches and scripts
- The platform is a **SaaS tool** with freemium monetization potential

### Transformation Approach: Incremental 3-Phase

| Phase | Name | Goal | Timeline | Risk |
|:-----:|------|------|:--------:|:----:|
| **A** | Abstract | Extract hardcoded finance DNA into dynamic NicheConfig objects | 2-3 weeks | Low |
| **B** | Multi-Niche Data | Build Supabase schema + load NicheConfig from DB | 4-6 weeks | Medium |
| **C** | User-Upload DNA | DNA import UI + validation + versioning | 6-8 weeks | High |

---

## PART I: CURRENT ARCHITECTURE ANALYSIS

## 1.1. The 5 Hardcoded Layers

The current architecture has **5 layers of hardcoding** for "finance" niche:

```
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 1: DNA FILES (Compile-time Static Imports)                  │
├────────────────────────────────────────────────────────────────────┤
│ src/services/ai/prompts/index.ts (line 17-23):                    │
│                                                                    │
│ import coreRaw from '../../../../docs/dna/finance-core.md?raw';    │
│ import analyticalRaw from '../../../../docs/dna/finance-analytical.md?raw';│
│ import psychologyRaw from '../../../../docs/dna/finance-psychology.md?raw';│
│ import mythbustingRaw from '../../../../docs/dna/finance-mythbusting.md?raw';│
│ import listicleRaw from '../../../../docs/dna/finance-listicle.md?raw';   │
│ import fundamentalRaw from '../../../../docs/dna/finance-fundamental.md?raw';│
│ import hooksRaw from '../../../../docs/dna/finance-hooks.md?raw';         │
│                                                                    │
│ → Vite's ?raw syntax = compile-time import, CANNOT change at runtime│
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 2: BRANCH SELECTION (Switch/Case Hardcoded)                │
├────────────────────────────────────────────────────────────────────┤
│ src/services/ai/prompts/index.ts (line 25-34):                    │
│                                                                    │
│ function getBranchDna(branch?: string): string {                 │
│   switch (branch) {                                              │
│     case 'analytical': return analyticalRaw;                       │
│     case 'psychology': return psychologyRaw;                       │
│     case 'mythbusting': return mythbustingRaw;                    │
│     case 'listicle': return listicleRaw;                          │
│     case 'fundamental': return fundamentalRaw;                    │
│     default: return analyticalRaw;  // HARD FALLBACK                │
│   }                                                               │
│ }                                                                 │
│                                                                    │
│ → 5 cases for 5 branches. Adding a 6th branch = code change.      │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 3: PROMPT REGISTRY (21 Hardcoded Prompts)                  │
├────────────────────────────────────────────────────────────────────┤
│ src/services/ai/PromptRegistry.ts:                               │
│                                                                    │
│ export type PromptId =                                            │
│   | 'finance.script'                                              │
│   | 'finance.script.outline'                                      │
│   | 'finance.script.part'                                         │
│   | 'finance.script.revise'                                       │
│   | 'finance.router.classify'                                      │
│   // ... (21 finance-specific prompts, ALL hardcoded)               │
│   | 'default.script';                                             │
│                                                                    │
│ → Every prompt has 'finance.' prefix. No dynamic niche support.    │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 4: TOPIC CLASSIFICATION (Single-Niche Router)               │
├────────────────────────────────────────────────────────────────────┤
│ src/services/ai/router.ts (line 18-45):                          │
│                                                                    │
│ export const classifyTopic = async (title, provider, model) => {  │
│   const content = await callWithPrompt(                           │
│     provider, model,                                              │
│     'finance.router.classify',  // HARDCODED                    │
│     { title },                                                   │
│     'phân loại kịch bản',                                        │
│     { response_format: { type: 'json_object' } },                 │
│   );                                                             │
│   // Returns: { branch, hook } from finance-specific prompt       │
│ };                                                               │
│                                                                    │
│ → The classification prompt itself is finance-specific.            │
│   Cannot route to non-finance niches without code changes.        │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 5: TYPE SYSTEM (Finance-Mode Flag)                         │
├────────────────────────────────────────────────────────────────────┤
│ src/domain/ContentBrief.ts:                                       │
│                                                                    │
│ export interface ContentBrief {                                   │
│   isFinanceMode?: boolean;  // ← The ONLY niche indicator         │
│   title: string;                                                 │
│   audience: string;                                             │
│   // ... no niche_id, no branch flexibility                       │
│ }                                                                 │
│                                                                    │
│ → "isFinanceMode" is a boolean flag, not a proper niche_id.      │
└────────────────────────────────────────────────────────────────────┘
```

## 1.2. Current Data Flow

```
[User Input: Title + Outline]
        ↓
[classifyTopic()] → 'finance.router.classify' prompt
        ↓ (returns { branch, hook })
[performDeepResearch()] → 'finance.research.*' prompts
        ↓
[generateScriptOutline()] → 'finance.script.outline' prompt
        ↓
[parseOutlineIntoSegments()]
        ↓
[generateScriptPart() × N] → 'finance.script.part' × N
        ↓
[reviseScript()] → 'finance.script.revise'
        ↓
[reviseScriptPartial()] → 'finance.script.revise.partial'
        ↓
[OutputDisplay]
```

### Key Problem: `reviseScript` Does NOT Use `buildFinanceSystemPrompt`

In `src/services/ai/prompts/index.ts`, the `finance.script.revise` prompt:

```
System prompt: 
  [BỐI CẢNH THỜI GIAN: ...]
  + coreRaw (finance-core.md)
  + === LỆNH DNA v3 BẮT BUỘC ===  ← Only ~10 lines
    - Người kể = người phân tích
    - Anti-Flowery
    - Anti-Labeling
    - Tỷ lệ câu
    - Slogan 2 lần
  === KẾT THÚC LỆNH ===

User prompt:
  Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt}"
```

But `buildFinanceSystemPrompt` (used for generation) has:

```
[BỐI CẢNH THỜI GIAN]
+ coreRaw
+ branchDna (getBranchDna)
+ hookDna (getHookDna)
+ [macroContext if any]
+ === LỆNH THỰC THI BẮT BUỘC ===  ← ~40 lines, FULL DNA enforcement
  1. XÁC ĐỊNH GÓC NHÌN NGƯỜI KỂ
  2. CẤU TRÚC LUẬN ĐIỂM CHUẨN (5 bước)
  3. ANTI-FLOWERY PROSE
  4. TỰ KIỂM TRA CHECKLIST
  5. NẾU VI PHẠM: TRẢ VỀ để viết lại
=== KẾT THÚC LỆNH ===
```

**→ 80% of DNA enforcement is MISSING from Rewrite mode.** This is why scripts still feel robotic after revision.

## 1.3. What Already Exists (That We Can Reuse)

| Component | Location | Can Reuse For |
|-----------|----------|---------------|
| `niche-finance.md` §6.3 | `docs/dna/` | Schema for `niches` table + `NicheProfile` type |
| `buildFinanceSystemPrompt` | `src/services/ai/prompts/index.ts:40-84` | Template for `NichePromptBuilder` factory |
| Supabase Auth | `src/contexts/AuthContext.tsx` | User isolation + `auth.uid()` |
| Supabase Projects table | `supabase` | Template for `niches` table schema |
| PromptRegistry pattern | `src/services/ai/PromptRegistry.ts` | Template for `DynamicPromptRegistry` |
| `classifyTopic` | `src/services/ai/router.ts` | Template for `DynamicRouter` |
| Finance DNA files (6 files) | `docs/dna/finance-*.md` | Seed data for system niche |
| 21 finance prompts | `src/services/ai/prompts/index.ts` | Templates for dynamic prompt variants |
| `niche-finance.md` §2.8 | Hard constraints schema | Template for `niche_hard_constraints` table |

## 1.4. What Needs To Be Built From Scratch

| Component | Why New |
|-----------|--------|
| `src/config/niches.ts` | Does NOT exist — planned but never implemented |
| `NicheService` class | Runtime DNA loading (vs. current compile-time imports) |
| `DynamicPromptBuilder` | Generic prompt assembly (vs. current hardcoded `buildFinanceSystemPrompt`) |
| `DynamicRouter` | Generic topic classification (vs. current `classifyTopic`) |
| Supabase `niches` table | System-level niche registry |
| Supabase `niche_dna_files` table | Per-niche DNA storage |
| Supabase `niche_routing_rules` table | Per-niche routing patterns |
| Supabase `niche_hard_constraints` table | Per-niche enforcement rules |
| Supabase `user_niches` table | User × Niche assignments |
| DNA Import UI | Upload markdown files + AI validation |
| Niche Switcher UI | Select active niche in app shell |
| Niche Editor UI | Edit DNA files in-app |

---

## PART II: TARGET ARCHITECTURE

## 2.1. The Platform Stack (3-Layer Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LAYER 1: PLATFORM SHELL                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│   │   Auth        │     │  User Mgmt   │     │  Billing / Plans          │ │
│   │  Supabase    │     │  Tenant IDs  │     │  Quota enforcement        │ │
│   │  Auth + RLS  │     │  User prefs  │     │  Free / Pro / Team        │ │
│   └──────────────┘     └──────────────┘     └──────────────────────────────┘ │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  Niche Switcher UI (Top navigation or sidebar)                       │  │
│   │  ├── "Chú Que Tài Chính" (System niche, cannot delete)             │  │
│   │  ├── "HealthQue" (User-uploaded niche)                              │  │
│   │  ├── "+ Create New Niche"                                           │  │
│   │  └── "Import Niche" → DNA Upload flow                                │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LAYER 2: NICHE REGISTRY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  NicheService.load(nicheId, userId?) → NicheConfig                  │  │
│   │                                                                       │  │
│   │  Interface NicheConfig {                                             │  │
│   │    nicheId: string;           // 'finance-vn', 'health-vn', etc.     │  │
│   │    name: string;              // Display name                        │  │
│   │    brand: string;             // Brand voice                        │  │
│   │    coreDna: string;           // finance-core.md content            │  │
│   │    branches: Record<string, string>;  // { psychology: '...md' }   │  │
│   │    hooks: string;              // hooks.md content                  │  │
│   │    examples: Example[];        // Few-shot examples                │  │
│   │    routingRules: RoutingRule[];                                │  │
│   │    hardConstraints: HardConstraint[];                            │  │
│   │    metadata: NicheMetadata;                                     │  │
│   │  }                                                               │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                       │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  Cache Layer (In-memory + localStorage)                              │  │
│   │  Key: `${nicheId}:${userId}` → TTL: 5 minutes                      │  │
│   │  Invalidate on: niche update, DNA upload, branch change              │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LAYER 3: GENERATION PIPELINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │  DynamicRouter.route(title, NicheConfig) → { branch, hook }       │   │
│   │                                                                       │   │
│   │  For each RoutingRule in NicheConfig.routingRules (priority desc): │   │
│   │    if (title matches any keyword regex)                             │   │
│   │      return { branch, hook } from that rule                         │   │
│   │  Return default: { branch: 'default', hook: 'story' }             │   │
│   └────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                       │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │  DynamicPromptBuilder.build(promptId, NicheConfig, params)        │   │
│   │                                                                       │   │
│   │  System prompt = [                                                   │   │
│   │    BỐI CẢNH THỜI GIAN,                                             │   │
│   │    NicheConfig.coreDna,                                             │   │
│   │    NicheConfig.branches[selectedBranch],                            │   │
│   │    NicheConfig.hooks,                                               │   │
│   │    ENFORCEMENT_BLOCK (from hardConstraints),                        │   │
│   │    HUMANIZER_BLOCK (from SKILL.md integration — Phase later),       │   │
│   │  ].join('\n\n')                                                    │   │
│   │                                                                       │   │
│   │  User prompt = params + dynamic instructions                        │   │
│   └────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                       │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │  GENERATION PIPELINE (unchanged flow, dynamic prompts)             │   │
│   │                                                                       │   │
│   │  classifyTopic(title) → DynamicRouter                               │   │
│   │       ↓                                                             │   │
│   │  performDeepResearch(title, outline) → DynamicPromptBuilder         │   │
│   │       ↓                                                             │   │
│   │  generateScriptOutline() → 'script.outline' (dynamic)              │   │
│   │       ↓                                                             │   │
│   │  generateScriptPart() × N → 'script.part' (dynamic) × N            │   │
│   │       ↓                                                             │   │
│   │  reviseScript() → 'script.revise' (dynamic + Humanizer)            │   │
│   │       ↓                                                             │   │
│   │  OutputDisplay                                                     │   │
│   └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2. Database Schema (Supabase PostgreSQL)

### Schema Overview

```
┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│     niches       │       │  niche_dna_files   │       │ niche_routing_rules │
├─────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ id (PK)         │──┐    │ id (PK)            │       │ id (PK)             │
│ niche_id (UK)   │  │    │ niche_id (FK)      │←──────│ niche_id (FK)       │
│ name            │  │    │ file_type           │       │ rule_id             │
│ brand           │  │    │ file_name           │       │ keywords[]          │
│ is_system       │  │    │ content             │       │ branch              │
│ owner_id (FK)   │──┴───→│ file_type           │       │ hook                │
│ version         │       │ version             │       │ must_haves[]        │
│ status          │       │ checksum            │       │ priority            │
│ metadata (JSONB) │       │ created_at          │       │ created_at          │
│ created_at      │       │ updated_at          │       └─────────────────────┘
│ updated_at      │       └─────────────────────┘
└─────────────────┘                │
        │                          │
        │ (user × niche)           │
        ↓                          ↓
┌─────────────────────┐   ┌─────────────────────────────┐
│    user_niches      │   │  niche_hard_constraints    │
├─────────────────────┤   ├─────────────────────────────┤
│ id (PK)            │   │ id (PK)                    │
│ user_id (FK)       │   │ niche_id (FK)              │
│ niche_id (FK)      │   │ constraint_id              │
│ is_active          │   │ description                │
│ settings (JSONB)   │   │ enforcement                │
│ created_at         │   │ severity                   │
└─────────────────────┘   │ created_at                │
                          └─────────────────────────────┘
```

### Table: `niches`

```sql
-- System-level niche registry
-- is_system = true: built-in niches (finance), cannot be deleted by users
-- is_system = false: user-uploaded niches

CREATE TABLE niches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id      TEXT UNIQUE NOT NULL,           -- 'finance-vn', 'user-abc123-health'
  name          TEXT NOT NULL,                  -- 'Chú Que Tài Chính'
  brand         TEXT NOT NULL,                  -- Brand voice / tagline
  is_system     BOOLEAN NOT NULL DEFAULT false, -- true = built-in
  owner_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  version       TEXT NOT NULL DEFAULT '1.0.0',
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'deprecated')),
  metadata      JSONB NOT NULL DEFAULT '{}' CHECK (
    jsonb_typeof(metadata) = 'object' AND
    metadata ? 'language' AND
    metadata ? 'target_audience' AND
    metadata ? 'script_length_words'
  ),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraint: unique niche_id per owner (NULL owner = system niche)
  CONSTRAINT unique_niche_per_owner UNIQUE (niche_id, owner_id)
);

-- Index for fast lookup
CREATE INDEX idx_niches_owner_id ON niches(owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX idx_niches_is_system ON niches(is_system) WHERE is_system = true;
CREATE INDEX idx_niches_status ON niches(status) WHERE status != 'deprecated';

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_niches_updated_at
  BEFORE UPDATE ON niches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Table: `niche_dna_files`

```sql
-- Stores DNA content per niche (core, branches, hooks, examples)

CREATE TABLE niche_dna_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id    TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  file_type   TEXT NOT NULL CHECK (file_type IN ('core', 'branch', 'hook', 'example', 'fundamental', 'meta')),
  file_name   TEXT NOT NULL,                  -- 'finance-core.md', 'psychology.md'
  content     TEXT NOT NULL,
  version     TEXT NOT NULL DEFAULT '1.0.0',
  checksum    TEXT,                           -- SHA256(content) for change detection
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- One file per niche + type + name
  CONSTRAINT unique_dna_file UNIQUE (niche_id, file_type, file_name)
);

CREATE INDEX idx_dna_files_niche_id ON niche_dna_files(niche_id);
CREATE INDEX idx_dna_files_file_type ON niche_dna_files(file_type);

CREATE TRIGGER set_dna_files_updated_at
  BEFORE UPDATE ON niche_dna_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Table: `niche_routing_rules`

```sql
-- Topic → Branch + Hook routing rules per niche
-- Mirrors niche-finance.md §2.6 Routing Rules

CREATE TABLE niche_routing_rules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id      TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  rule_id       TEXT NOT NULL,                -- 'rule-listicle-numbers'
  keywords      TEXT[] NOT NULL,              -- ARRAY of regex patterns
  branch        TEXT NOT NULL,                -- 'analytical', 'psychology', 'mythbusting', 'listicle'
  hook          TEXT,                          -- 'story', 'data', 'myth', 'question' (nullable = any)
  must_haves    TEXT[],                        -- Required sections for this branch
  notes         TEXT,
  priority      INTEGER NOT NULL DEFAULT 0,    -- Higher = checked first
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_rule_per_niche UNIQUE (niche_id, rule_id)
);

CREATE INDEX idx_routing_rules_niche_id ON niche_routing_rules(niche_id);
CREATE INDEX idx_routing_rules_priority ON niche_routing_rules(priority DESC);
```

### Table: `niche_hard_constraints`

```sql
-- Hard enforcement rules per niche
-- Mirrors niche-finance.md §2.8 Hard Constraints

CREATE TABLE niche_hard_constraints (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id      TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  constraint_id TEXT NOT NULL,               -- 'no-fake-numbers', 'no-profit-promise'
  description   TEXT NOT NULL,               -- Human-readable rule
  enforcement   TEXT NOT NULL,               -- AI instruction for enforcement
  severity      TEXT NOT NULL DEFAULT 'error' CHECK (severity IN ('error', 'warning')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_constraint_per_niche UNIQUE (niche_id, constraint_id)
);

CREATE INDEX idx_constraints_niche_id ON niche_hard_constraints(niche_id);
```

### Table: `user_niches`

```sql
-- User × Niche assignments
-- Maps users to their accessible niches (system + owned)

CREATE TABLE user_niches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  niche_id    TEXT NOT NULL REFERENCES niches(niche_id) ON DELETE CASCADE,
  is_active   BOOLEAN NOT NULL DEFAULT true,  -- Can deactivate without deleting
  settings    JSONB NOT NULL DEFAULT '{}' CHECK (
    jsonb_typeof(settings) = 'object'
  ),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_niche UNIQUE (user_id, niche_id)
);

CREATE INDEX idx_user_niches_user_id ON user_niches(user_id);
CREATE INDEX idx_user_niches_niche_id ON user_niches(niche_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_dna_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_hard_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_niches ENABLE ROW LEVEL SECURITY;

-- niches: Users see system niches + their own niches
CREATE POLICY niches_select ON niches
  FOR SELECT USING (
    is_system = true
    OR owner_id = auth.uid()
  );

CREATE POLICY niches_insert ON niches
  FOR INSERT WITH CHECK (
    is_system = false  -- Users cannot create system niches
    AND owner_id = auth.uid()
  );

CREATE POLICY niches_update ON niches
  FOR UPDATE USING (
    owner_id = auth.uid()
  );

CREATE POLICY niches_delete ON niches
  FOR DELETE USING (
    is_system = false
    AND owner_id = auth.uid()
  );

-- niche_dna_files: Users manage DNA for their own niches
CREATE POLICY dna_files_select ON niche_dna_files
  FOR SELECT USING (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = true OR owner_id = auth.uid()
    )
  );

CREATE POLICY dna_files_insert ON niche_dna_files
  FOR INSERT WITH CHECK (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = false AND owner_id = auth.uid()
    )
  );

CREATE POLICY dna_files_update ON niche_dna_files
  FOR UPDATE USING (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = false AND owner_id = auth.uid()
    )
  );

CREATE POLICY dna_files_delete ON niche_dna_files
  FOR DELETE USING (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = false AND owner_id = auth.uid()
    )
  );

-- routing_rules & constraints: Same as dna_files
CREATE POLICY routing_rules_select ON niche_routing_rules
  FOR SELECT USING (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = true OR owner_id = auth.uid()
    )
  );

CREATE POLICY routing_rules_manage ON niche_routing_rules
  FOR ALL USING (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = false AND owner_id = auth.uid()
    )
  );

CREATE POLICY constraints_select ON niche_hard_constraints
  FOR SELECT USING (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = true OR owner_id = auth.uid()
    )
  );

CREATE POLICY constraints_manage ON niche_hard_constraints
  FOR ALL USING (
    niche_id IN (
      SELECT niche_id FROM niches
      WHERE is_system = false AND owner_id = auth.uid()
    )
  );

-- user_niches: Users manage their own niche assignments
CREATE POLICY user_niches_select ON user_niches
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY user_niches_insert ON user_niches
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY user_niches_update ON user_niches
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY user_niches_delete ON user_niches
  FOR DELETE USING (user_id = auth.uid());
```

---

## PART III: CODE ARCHITECTURE

## 3.1. New File Structure

```
src/
├── services/
│   ├── niche/
│   │   ├── NicheService.ts          # Load/save niche configs
│   │   ├── NicheConfig.ts           # NicheConfig interface
│   │   ├── NicheValidator.ts        # DNA validation on upload
│   │   └── NicheSeeder.ts          # Seed finance niche to DB
│   │
│   ├── ai/
│   │   ├── DynamicRouter.ts         # Replace classifyTopic
│   │   ├── DynamicPromptBuilder.ts  # Replace buildFinanceSystemPrompt
│   │   ├── DynamicPromptRegistry.ts # Replace PromptRegistry
│   │   └── prompts/
│   │       ├── index.ts             # Keep finance prompts for Phase A/B
│   │       └── finance/             # Finance-specific prompts (backward compat)
│   │
│   ├── supabase/
│   │   ├── client.ts                # Existing
│   │   ├── niches.ts                # Niche CRUD operations
│   │   └── types.ts                 # Supabase generated types
│   │
│   ├── aiService.ts                 # REFACTOR: accept dynamic prompts
│   └── ai/
│       ├── router.ts                 # REFACTOR: delegate to DynamicRouter
│       └── prompts/
│           └── index.ts              # REFACTOR: DynamicPromptBuilder factory
│
├── features/
│   ├── generation/
│   │   ├── useGenerationWorkflow.ts  # REFACTOR: nicheId param
│   │   ├── useNicheGeneration.ts     # NEW: generic generation hook
│   │   └── NicheAwarePipeline.ts     # NEW: orchestration layer
│   │
│   ├── niche/
│   │   ├── NicheSwitcher.tsx         # NEW: Select active niche
│   │   ├── DNAImport.tsx             # NEW: Upload DNA files
│   │   ├── NicheEditor.tsx           # NEW: Edit DNA in-app
│   │   ├── NicheValidator.tsx         # NEW: AI-powered validation
│   │   └── useNicheManagement.ts      # NEW: CRUD operations
│   │
│   └── brief/
│       ├── useContentBrief.ts         # REFACTOR: add nicheId
│       └── ContentBriefForm.tsx       # REFACTOR: niche selector
│
├── domain/
│   ├── ContentBrief.ts               # REFACTOR: nicheId field
│   ├── NicheProfile.ts               # NEW: domain model
│   └── Script.ts                     # Update if needed
│
├── contexts/
│   ├── AuthContext.tsx               # Keep as-is
│   └── NicheContext.tsx              # NEW: active niche state
│
├── components/
│   ├── ControlPanel.tsx              # REFACTOR: word count + niche
│   ├── SideToolsPanel.tsx             # REFACTOR: niche-aware tools
│   ├── NicheAwareProvider.tsx         # NEW: wrap app with niche context
│   └── common/
│       └── NicheBadge.tsx            # NEW: niche indicator
│
└── config/
    └── niches.ts                     # NEW: hardcoded niche configs (Phase A)
```

## 3.2. Core Interfaces

### `NicheConfig` — The Universal Niche Representation

```typescript
// src/services/niche/NicheConfig.ts

export interface NicheMetadata {
  language: string;                    // 'vi-VN', 'en-US'
  targetAudience: string;              // 'Người Việt 20-40 tuổi'
  scriptLengthWords: string;          // '2,500-4,500'
  scriptLengthMinutes: string;         // '8-15'
  frequency?: string;                 // '3-4 video/tuần'
}

export interface RoutingRule {
  ruleId: string;
  keywords: string[];                 // Regex patterns
  branch: string;
  hook?: string;
  mustHaves?: string[];
  notes?: string;
  priority: number;
}

export interface HardConstraint {
  constraintId: string;
  description: string;
  enforcement: string;
  severity: 'error' | 'warning';
}

export interface NicheExample {
  id: string;
  title: string;
  branch: string;
  hook: string;
  targetAudience: string;
  structure: string;
  tone: string;
  keyPhrases: string[];
  cta: string;
  fileRef: string;
}

export interface NicheConfig {
  // Identity
  nicheId: string;
  name: string;
  brand: string;
  isSystem: boolean;
  ownerId?: string;
  
  // DNA Content (markdown strings)
  coreDna: string;
  branches: Record<string, string>;   // { 'psychology': '...md', ... }
  hooks: string;
  examples: NicheExample[];
  
  // Rules
  routingRules: RoutingRule[];
  hardConstraints: HardConstraint[];
  
  // Metadata
  metadata: NicheMetadata;
  version: string;
  status: 'active' | 'draft' | 'deprecated';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### `NicheService` — The DNA Loader

```typescript
// src/services/niche/NicheService.ts

import { supabase } from '@/lib/supabase';
import type { NicheConfig, RoutingRule, HardConstraint, NicheExample } from './NicheConfig';

class NicheService {
  private cache = new Map<string, { config: NicheConfig; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Load a niche config by ID.
   * For system niches (is_system=true), userId is ignored.
   * For user niches, returns user's version if userId provided.
   */
  async load(nicheId: string, userId?: string): Promise<NicheConfig> {
    const cacheKey = `${nicheId}:${userId ?? 'system'}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expiresAt > Date.now()) {
      return cached.config;
    }

    // 1. Fetch niche metadata
    const { data: niche, error: nicheError } = await supabase
      .from('niches')
      .select('*')
      .eq('niche_id', nicheId)
      .single();

    if (nicheError || !niche) {
      throw new Error(`Niche not found: ${nicheId}`);
    }

    // 2. Fetch all DNA files
    const { data: files } = await supabase
      .from('niche_dna_files')
      .select('file_type, file_name, content')
      .eq('niche_id', nicheId);

    // 3. Fetch routing rules (sorted by priority desc)
    const { data: rules } = await supabase
      .from('niche_routing_rules')
      .select('*')
      .eq('niche_id', nicheId)
      .order('priority', { ascending: false });

    // 4. Fetch hard constraints
    const { data: constraints } = await supabase
      .from('niche_hard_constraints')
      .select('*')
      .eq('niche_id', nicheId);

    // 5. Assemble into NicheConfig
    const config = this.assemble(niche, files, rules, constraints);
    
    // 6. Cache
    this.cache.set(cacheKey, {
      config,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });

    return config;
  }

  /**
   * Upload a new user niche.
   * Creates niche + DNA files + routing rules + constraints.
   */
  async uploadNiche(
    userId: string,
    config: {
      name: string;
      brand: string;
      coreDna: string;
      branches: Record<string, string>;
      hooks: string;
      routingRules: RoutingRule[];
      hardConstraints: HardConstraint[];
      metadata: NicheMetadata;
    }
  ): Promise<string> {
    const nicheId = `user-${userId}-${Date.now().toString(36)}`;

    // 1. Create niche record
    const { error: nicheError } = await supabase.from('niches').insert({
      niche_id: nicheId,
      name: config.name,
      brand: config.brand,
      is_system: false,
      owner_id: userId,
      metadata: config.metadata,
    });

    if (nicheError) throw new Error(`Failed to create niche: ${nicheError.message}`);

    // 2. Insert DNA files
    const dnaFiles = [
      { niche_id: nicheId, file_type: 'core', file_name: `${nicheId}-core.md`, content: config.coreDna },
      { niche_id: nicheId, file_type: 'hook', file_name: `${nicheId}-hooks.md`, content: config.hooks },
      ...Object.entries(config.branches).map(([name, content]) => ({
        niche_id: nicheId,
        file_type: 'branch',
        file_name: `${name}.md`,
        content,
      })),
    ];

    const { error: filesError } = await supabase
      .from('niche_dna_files')
      .insert(dnaFiles);

    if (filesError) throw new Error(`Failed to insert DNA files: ${filesError.message}`);

    // 3. Insert routing rules
    const routingRows = config.routingRules.map(r => ({
      niche_id: nicheId,
      rule_id: r.ruleId,
      keywords: r.keywords,
      branch: r.branch,
      hook: r.hook,
      must_haves: r.mustHaves,
      notes: r.notes,
      priority: r.priority,
    }));

    const { error: rulesError } = await supabase
      .from('niche_routing_rules')
      .insert(routingRows);

    if (rulesError) throw new Error(`Failed to insert routing rules: ${rulesError.message}`);

    // 4. Insert hard constraints
    const constraintRows = config.hardConstraints.map(c => ({
      niche_id: nicheId,
      constraint_id: c.constraintId,
      description: c.description,
      enforcement: c.enforcement,
      severity: c.severity,
    }));

    const { error: constraintsError } = await supabase
      .from('niche_hard_constraints')
      .insert(constraintRows);

    if (constraintsError) {
      throw new Error(`Failed to insert constraints: ${constraintsError.message}`);
    }

    // 5. Assign to user
    await supabase.from('user_niches').insert({
      user_id: userId,
      niche_id: nicheId,
      is_active: true,
    });

    return nicheId;
  }

  /**
   * List all niches accessible by a user (system + owned).
   */
  async listAccessible(userId: string): Promise<NicheConfig[]> {
    const { data, error } = await supabase
      .from('niches')
      .select(`
        *,
        niche_dna_files(file_type, file_name, content),
        niche_routing_rules(*),
        niche_hard_constraints(*)
      `)
      .or(`is_system.eq.true,owner_id.eq.${userId}`)
      .eq('status', 'active');

    if (error) throw new Error(`Failed to list niches: ${error.message}`);

    return (data ?? []).map(niche => this.assemble(
      niche,
      niche.niche_dna_files ?? [],
      niche.niche_routing_rules ?? [],
      niche.niche_hard_constraints ?? []
    ));
  }

  /**
   * Invalidate cache for a niche (call after update/upload).
   */
  invalidateCache(nicheId: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${nicheId}:`)) {
        this.cache.delete(key);
      }
    }
  }

  // ── Private ──────────────────────────────────────────────────────────────

  private assemble(
    niche: Record<string, unknown>,
    files: Array<{ file_type: string; file_name: string; content: string }>,
    rules: Array<Record<string, unknown>>,
    constraints: Array<Record<string, unknown>>
  ): NicheConfig {
    // Parse DNA files
    const branches: Record<string, string> = {};
    let coreDna = '';
    let hooks = '';

    for (const file of files) {
      if (file.file_type === 'core') {
        coreDna = file.content;
      } else if (file.file_type === 'branch') {
        // file_name like 'psychology.md' → extract 'psychology'
        const name = file.file_name.replace(/\.md$/, '');
        branches[name] = file.content;
      } else if (file.file_type === 'hook') {
        hooks = file.content;
      }
    }

    // Parse routing rules
    const routingRules: RoutingRule[] = rules.map(r => ({
      ruleId: r.rule_id as string,
      keywords: r.keywords as string[],
      branch: r.branch as string,
      hook: r.hook as string | undefined,
      mustHaves: r.must_haves as string[] | undefined,
      notes: r.notes as string | undefined,
      priority: r.priority as number,
    }));

    // Parse hard constraints
    const hardConstraints: HardConstraint[] = constraints.map(c => ({
      constraintId: c.constraint_id as string,
      description: c.description as string,
      enforcement: c.enforcement as string,
      severity: c.severity as 'error' | 'warning',
    }));

    return {
      nicheId: niche.niche_id as string,
      name: niche.name as string,
      brand: niche.brand as string,
      isSystem: niche.is_system as boolean,
      ownerId: niche.owner_id as string | undefined,
      coreDna,
      branches,
      hooks,
      examples: [], // TODO: parse from examples files
      routingRules,
      hardConstraints,
      metadata: niche.metadata as NicheConfig['metadata'],
      version: niche.version as string,
      status: niche.status as NicheConfig['status'],
      createdAt: new Date(niche.created_at as string),
      updatedAt: new Date(niche.updated_at as string),
    };
  }
}

export const nicheService = new NicheService();
```

### `DynamicPromptBuilder` — Generic Prompt Assembly

```typescript
// src/services/ai/DynamicPromptBuilder.ts

import type { NicheConfig, RoutingRule } from '../niche/NicheConfig';

export interface PromptParams {
  title?: string;
  outlineContent?: string;
  targetAudience?: string;
  styleOptions?: { expression: string; style: string };
  wordCount?: string;
  scriptStyle?: string;
  scriptHook?: string;
  macroContext?: string;
  currentPartOutline?: string;
  fullOutline?: string;
  previousPartsScript?: string;
  script?: string;
  revisionPrompt?: string;
  style?: { expression: string; style: string };
  params?: Record<string, unknown>;
  [key: string]: unknown;
}

export class DynamicPromptBuilder {
  /**
   * Build the system prompt for a niche.
   * This replaces the hardcoded buildFinanceSystemPrompt().
   */
  buildSystemPrompt(nicheConfig: NicheConfig, selectedBranch?: string): string {
    const { coreDna, branches, hooks, hardConstraints } = nicheConfig;
    
    const parts: string[] = [
      `[BỐI CẢNH THỜI GIAN: Năm ${new Date().getFullYear()}]`,
      coreDna,
    ];

    // Add active branches
    for (const [name, content] of Object.entries(branches)) {
      if (!selectedBranch || name === selectedBranch) {
        parts.push(`## BRANCH DNA: ${name}\n${content}`);
      }
    }

    // Add hooks
    parts.push(hooks);

    // Build enforcement block from hard constraints
    const enforcementBlock = this.buildEnforcementBlock(hardConstraints);
    parts.push(enforcementBlock);

    return parts.join('\n\n');
  }

  /**
   * Build enforcement block from hard constraints.
   */
  private buildEnforcementBlock(constraints: NicheConfig['hardConstraints']): string {
    if (!constraints || constraints.length === 0) {
      return '=== NO ENFORCEMENT RULES DEFINED ===';
    }

    const lines = constraints.map(c => {
      const severity = c.severity === 'error' ? 'BẮT BUỘC' : 'KHUYẾN NGHỊ';
      return `- [${severity}] ${c.description}\n  Hướng dẫn: ${c.enforcement}`;
    });

    return [
      '=== LỆNH THỰC THI BẮT BUỘC ===',
      '',
      'TRƯỚC KHI VIẾT bất kỳ nội dung kịch bản nào, AI phải:',
      '',
      '1. XÁC ĐỊNH GÓC NHÌN NGƯỜI KỂ:',
      '   - Tuân thủ brand voice và tone giọng của kênh.',
      '   - Ưu tiên GIẢI THÍCH hơn kể chuyện. Kể chuyện chỉ là MINH HỌA.',
      '',
      '2. CẤU TRÚC LUẬN ĐIỂM CHUẨN (mỗi luận điểm chính):',
      '   Bước 1: NÊU vấn đề → Bước 2: GIẢI THÍCH → Bước 3: VÍ DỤ/số liệu',
      '   → Bước 4: HỆ QUẢ → Bước 5: CHUYỂN Ý (câu mở nút/gài).',
      '',
      '3. KIỂM TRA RÀNG BUỘC CỨNG:',
      ...lines,
      '',
      '4. TỰ KIỂM TRA CHECKLIST:',
      '   [ ] Lập luận đứng không? (bỏ tính từ cảm xúc, logic vẫn rõ?)',
      '   [ ] Có dùng "Bước 1", "Nguyên nhân thứ 1"? → Thay bằng "trước hết...".',
      '   [ ] Câu văn có nối kết mạch lạc và dẫn dắt trôi chảy không?',
      '   [ ] Mỗi phần kết thúc bằng câu "mở nút" chưa?',
      '',
      '5. NẾU VI PHẠM: script sẽ bị TRẢ VỀ để viết lại. Không có ngoại lệ.',
      '',
      '=== KẾT THÚC LỆNH THỰC THI ===',
    ].join('\n');
  }

  /**
   * Build the user prompt for script.outline.
   */
  buildOutlinePrompt(
    nicheConfig: NicheConfig,
    params: PromptParams
  ): string {
    const { title, outlineContent, targetAudience, styleOptions, wordCount } = params;
    const style = `Tone: ${styleOptions?.expression ?? 'default'}, Style: ${styleOptions?.style ?? 'default'}`;
    
    const userRequirements = outlineContent
      ? `\n\nYÊU CẦU NỘI DUNG TỪ ĐẠO DIỄN (CHỈ LÀ Ý PHỤ):\n"${outlineContent}"\nHƯỚNG DẪN: 1. Lấy Chủ đề làm XƯƠNG SỐNG duy nhất. 2. Lồng ghép Yêu cầu nhưng KHÔNG làm lệch Chủ đề. 3. Nếu xung đột -> ƯU TIÊN Chủ đề.`
      : '';

    return [
      `Tạo dàn ý đúng cấu trúc 5 phần bắt buộc.`,
      `QUY TẮC ĐỊNH DẠNG BẮT BUỘC (không tuân thủ = output vô dụng):`,
      `- Mỗi phần PHẢI bắt đầu bằng heading markdown cấp 2:`,
      `  ## PHẦN 1: MỞ ĐẦU (HOOK & SETUP)`,
      `  ## PHẦN 2: BỐI CẢNH & VẤN ĐỀ (PROBLEM)`,
      `  ## PHẦN 3: GIẢI PHẪU BẰNG TOÁN HỌC & DỮ LIỆU (ANALYSIS)`,
      `  ## PHẦN 4: GIẢI PHÁP THỰC TẾ (ACTIONABLE STEPS)`,
      `  ## PHẦN 5: ĐÚC KẾT TRIẾT LÝ & KÊU GỌI HÀNH ĐỘNG (TAKEAWAY & CTA)`,
      `- KHÔNG dùng heading cấp 3 (###) hay cấp 1 (#) cho phần.`,
      `- Mỗi phần có ÍT NHẤT 3 gạch đầu dòng mô tả ý chính.`,
      `QUY TẮC VỀ ĐỘ DÀI:`,
      `- Kịch bản dự kiến dài ${wordCount ?? '1500'} từ.`,
      `- ĐÂY LÀ DÀN Ý, KHÔNG PHẢI KỊCH BẢN.`,
      `- Mỗi gạch đầu dòng chỉ viết 1-2 câu siêu NGẮN GỌN.`,
      `CHỦ ĐỀ CHÍNH: "${title ?? ''}"`,
      `NGÔN NGỮ: ${targetAudience ?? 'Tiếng Việt'}`,
      `PHONG CÁCH: ${style}${userRequirements}`,
    ].join('\n');
  }

  /**
   * Build the user prompt for script.part.
   */
  buildPartPrompt(
    nicheConfig: NicheConfig,
    params: PromptParams
  ): string {
    const {
      targetAudience,
      title,
      styleOptions,
      wordCount,
      currentPartOutline,
      fullOutline,
      previousPartsScript,
    } = params;

    const style = `DUY TRÌ TÔNG GIỌNG (Tone): ${styleOptions?.expression ?? 'default'} VÀ PHONG CÁCH (Style): ${styleOptions?.style ?? 'default'}.`;
    
    // Calculate per-part word count
    const matchParts = (fullOutline ?? '').match(/## PHẦN \d+/gi);
    const totalParts = matchParts ? Math.max(1, matchParts.length) : 5;
    const totalNum = parseInt(wordCount ?? '1500', 10) || 1500;
    const perPart = Math.max(50, Math.round(totalNum / totalParts));
    const minSpoken = Math.max(50, Math.round(perPart * 0.95));

    return [
      `DÀN Ý TỔNG THỂ CỦA VIDEO:`,
      fullOutline ?? '(Chưa có)',
      ``,
      `KỊCH BẢN CÁC PHẦN TRƯỚC (Để tiếp nối mạch văn. Bỏ qua nếu đây là phần 1):`,
      previousPartsScript || '(Chưa có)',
      ``,
      `=====================`,
      `NHIỆM VỤ: VIẾT TIẾP PHẦN KỊCH BẢN DƯỚI ĐÂY:`,
      `"${currentPartOutline ?? ''}"`,
      ``,
      `CHỦ ĐỀ: ${title ?? ''}.`,
      `TỔNG VIDEO: ${totalNum} từ spoken (chia đều ${totalParts} phần, mỗi phần ≈ ${perPart} từ).`,
      ``,
      `${style}`,
      `NGÔN NGỮ: ${targetAudience ?? 'Tiếng Việt'}.`,
      ``,
      `ĐỘ DÀI PHẦN NÀY: ${perPart} từ spoken (đã bao gồm buffer 15% cho Markdown overhead — khi TTS lọc bỏ heading/bullet/SFX, phần spoken text thực tế phải CÒN LẠI ÍT NHẤT ${minSpoken} từ).`,
      ``,
      `QUY TẮC ĐỊNH DẠNG TỐI THƯỢNG (Bắt buộc tuân thủ 100%):`,
      `1. TRẢ VỀ TRỰC TIẾP NỘI DUNG KỊCH BẢN. TUYỆT ĐỐI KHÔNG giải thích, KHÔNG dạo đầu, KHÔNG suy luận.`,
      `2. VĂN XUÔI CHUYÊN NGHIỆP: Tuyệt đối KHÔNG dùng gạch đầu dòng (-) hoặc đánh số (1. 2. 3.). Phải viết thành các đoạn văn liên tục.`,
      `3. NHỊP ĐIỆU (Pacing): Viết câu tự nhiên, mạch lạc, có tính dẫn dắt. TUYỆT ĐỐI KHÔNG viết các câu ngắn cụt lủn, ngắt quãng.`,
      `4. TỪ VỰNG ĐA DẠNG: Thay bằng tên nhân vật hoặc "mọi người". KHÔNG lặp từ.`,
      `5. SLOGAN: Chỉ xuất hiện 2 lần — đầu và cuối. KHÔNG lặp slogan ở giữa script.`,
    ].join('\n');
  }

  /**
   * Build the user prompt for script.revise.
   */
  buildRevisePrompt(
    nicheConfig: NicheConfig,
    params: PromptParams
  ): string {
    const { script, revisionPrompt, style } = params;
    const styleLine = style
      ? `Giữ vững Tone: ${style.expression} và Style: ${style.style}.`
      : '';

    return [
      `Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt ?? ''}".`,
      `${styleLine}`,
      ``,
      `Kịch bản gốc:`,
      script ?? '',
    ].join('\n');
  }

  /**
   * Build the system prompt for the router.
   */
  buildRouterSystemPrompt(nicheConfig: NicheConfig): string {
    const { branches, hooks, routingRules } = nicheConfig;

    // Build branch descriptions for the router
    const branchDescriptions = Object.entries(branches)
      .map(([name, content]) => {
        // Extract first 200 chars as description
        const desc = content.substring(0, 200).replace(/\n/g, ' ');
        return `- "${name}": ${desc}...`;
      })
      .join('\n');

    // Build hook descriptions
    const hookDescriptions = hooks
      .substring(0, 500)
      .replace(/\n/g, ' ');

    return [
      `Bạn là một AI phân loại chủ đề kịch bản.`,
      `Nhiệm vụ: Đọc tiêu đề (title) và quyết định branch + hook phù hợp.`,
      ``,
      `Các branch được phép trong niche "${nicheConfig.name}":`,
      branchDescriptions,
      ``,
      `Các hook được phép:`,
      hookDescriptions,
      ``,
      `Routing rules (theo priority):`,
      ...routingRules.map(
        r => `- rule "${r.ruleId}" (priority ${r.priority}): match keywords ${JSON.stringify(r.keywords)} → branch "${r.branch}", hook "${r.hook ?? 'any'}"`
      ),
      ``,
      `BẮT BUỘC TRẢ VỀ DẠNG JSON:`,
      `{ "branch": "branch_name", "hook": "hook_name" }`,
    ].join('\n');
  }

  /**
   * Build the router user prompt.
   */
  buildRouterUserPrompt(nicheConfig: NicheConfig, title: string): string {
    return `Chủ đề kịch bản: "${title}"`;
  }
}

export const dynamicPromptBuilder = new DynamicPromptBuilder();
```

### `DynamicRouter` — Generic Topic Classification

```typescript
// src/services/ai/DynamicRouter.ts

import { supabase } from '@/lib/supabase';
import { nicheService } from '../niche/NicheService';
import { dynamicPromptBuilder } from './DynamicPromptBuilder';
import { callWithPrompt } from './aiService';
import type { NicheConfig } from '../niche/NicheConfig';

export interface RouteResult {
  branch: string;
  hook: string;
  matchedRule?: string;
}

export class DynamicRouter {
  /**
   * Route a title to branch + hook using niche routing rules.
   * Falls back to AI classification if no rules match.
   */
  async route(
    title: string,
    nicheConfig: NicheConfig,
    aiProvider?: string,
    aiModel?: string
  ): Promise<RouteResult> {
    // 1. Try rule-based routing first (fast, deterministic)
    for (const rule of nicheConfig.routingRules) {
      const matched = rule.keywords.some(keyword => {
        try {
          const regex = new RegExp(keyword, 'i');
          return regex.test(title);
        } catch {
          // Invalid regex, skip
          return false;
        }
      });

      if (matched) {
        return {
          branch: rule.branch,
          hook: rule.hook ?? this.getDefaultHook(rule.branch, nicheConfig),
          matchedRule: rule.ruleId,
        };
      }
    }

    // 2. No rules matched → fallback to AI classification
    if (aiProvider && aiModel) {
      try {
        const systemPrompt = dynamicPromptBuilder.buildRouterSystemPrompt(nicheConfig);
        const userPrompt = dynamicPromptBuilder.buildRouterUserPrompt(nicheConfig, title);

        const content = await callWithPrompt(
          aiProvider,
          aiModel,
          'dynamic.router.classify',  // Generic router prompt
          { systemPrompt, userPrompt },
          'phân loại kịch bản',
          { response_format: { type: 'json_object' } }
        );

        const parsed = JSON.parse(content);
        return {
          branch: parsed.branch ?? this.getDefaultBranch(nicheConfig),
          hook: parsed.hook ?? this.getDefaultHook(parsed.branch, nicheConfig),
        };
      } catch {
        // AI fallback failed → return defaults
      }
    }

    // 3. Ultimate fallback
    return {
      branch: this.getDefaultBranch(nicheConfig),
      hook: this.getDefaultHook(this.getDefaultBranch(nicheConfig), nicheConfig),
    };
  }

  private getDefaultBranch(nicheConfig: NicheConfig): string {
    // Return first branch or 'analytical'
    const branches = Object.keys(nicheConfig.branches);
    return branches[0] ?? 'analytical';
  }

  private getDefaultHook(branch: string, nicheConfig: NicheConfig): string {
    // Try to find a routing rule for this branch that specifies a hook
    const rule = nicheConfig.routingRules.find(r => r.branch === branch && r.hook);
    return rule?.hook ?? 'story';
  }
}

export const dynamicRouter = new DynamicRouter();
```

## 3.3. NicheContext — Active Niche State

```typescript
// src/contexts/NicheContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { nicheService } from '@/services/niche/NicheService';
import type { NicheConfig } from '@/services/niche/NicheConfig';

interface NicheContextValue {
  activeNiche: NicheConfig | null;
  accessibleNiches: NicheConfig[];
  isLoading: boolean;
  error: Error | null;
  setActiveNiche: (nicheId: string) => Promise<void>;
  refreshNiches: () => Promise<void>;
  invalidateCache: (nicheId: string) => void;
}

const NicheContext = createContext<NicheContextValue | null>(null);

export const NicheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNiche, setActiveNicheState] = useState<NicheConfig | null>(null);
  const [accessibleNiches, setAccessibleNiches] = useState<NicheConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const userId = useUserId(); // from AuthContext

  const refreshNiches = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const niches = await nicheService.listAccessible(userId);
      setAccessibleNiches(niches);
      
      // Set default if none active
      if (!activeNiche && niches.length > 0) {
        // Prefer 'finance-vn' if system niche exists
        const finance = niches.find(n => n.nicheId === 'finance-vn');
        setActiveNicheState(finance ?? niches[0]);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load niches'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const setActiveNiche = useCallback(async (nicheId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const config = await nicheService.load(nicheId, userId);
      setActiveNicheState(config);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load niche'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      refreshNiches();
    }
  }, [userId, refreshNiches]);

  return (
    <NicheContext.Provider
      value={{
        activeNiche,
        accessibleNiches,
        isLoading,
        error,
        setActiveNiche,
        refreshNiches,
        invalidateCache: (id) => nicheService.invalidateCache(id),
      }}
    >
      {children}
    </NicheContext.Provider>
  );
};

export const useNiche = (): NicheContextValue => {
  const ctx = useContext(NicheContext);
  if (!ctx) throw new Error('useNiche must be used within NicheProvider');
  return ctx;
};

export const useUserId = (): string | null => {
  // Implementation depends on AuthContext
  const { user } = useAuth(); // from existing AuthContext
  return user?.id ?? null;
};
```

## 3.4. Refactored `useGenerationWorkflow`

```typescript
// src/features/generation/useNicheGeneration.ts
// Replaces useGenerationWorkflow.ts for niche-aware generation

import { useState, useCallback, useRef } from 'react';
import { useNiche } from '@/contexts/NicheContext';
import { dynamicRouter } from '@/services/ai/DynamicRouter';
import { dynamicPromptBuilder } from '@/services/ai/DynamicPromptBuilder';
import { performDeepResearch, generateScriptOutline, generateScriptPart } from '@/services/aiService';
import type { GenerationParams, GenerationProgress } from '@/domain/GenerationTypes';

export function useNicheGeneration() {
  const { activeNiche } = useNiche();
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (params: GenerationParams) => {
    if (!activeNiche) {
      throw new Error('No active niche selected');
    }

    setIsGenerating(true);
    setProgress({ stage: 'initializing', currentPart: 0, totalParts: 0, status: 'in_progress' });

    try {
      // 1. Route topic to branch + hook
      setProgress(p => ({ ...p!, stage: 'routing', status: 'in_progress' }));
      const route = await dynamicRouter.route(
        params.title,
        activeNiche,
        params.aiProvider,
        params.aiModel
      );

      // 2. Deep research (if enabled)
      if (params.enableDeepResearch) {
        setProgress(p => ({ ...p!, stage: 'researching', status: 'in_progress' }));
        await performDeepResearch(params.title, activeNiche);
      }

      // 3. Generate outline
      setProgress(p => ({ ...p!, stage: 'outlining', status: 'in_progress' }));
      const systemPrompt = dynamicPromptBuilder.buildSystemPrompt(activeNiche, route.branch);
      const outlineUserPrompt = dynamicPromptBuilder.buildOutlinePrompt(activeNiche, {
        title: params.title,
        outlineContent: params.outlineContent,
        targetAudience: params.targetAudience,
        styleOptions: params.styleOptions,
        wordCount: params.wordCount,
      });

      const outline = await generateScriptOutline(
        activeNiche.nicheId,
        systemPrompt,
        outlineUserPrompt,
        params.aiProvider,
        params.aiModel
      );

      // 4. Parse outline into segments
      const segments = parseOutlineIntoSegments(outline);

      // 5. Sequential part generation
      setProgress(p => ({ ...p!, stage: 'writing', totalParts: segments.length, status: 'in_progress' }));
      const fullScript: string[] = [];
      let previousScript = '';

      for (let i = 0; i < segments.length; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Generation cancelled');
        }

        setProgress(p => ({ ...p!, stage: 'writing', currentPart: i + 1 }));

        const partSystemPrompt = dynamicPromptBuilder.buildSystemPrompt(activeNiche, route.branch);
        const partUserPrompt = dynamicPromptBuilder.buildPartPrompt(activeNiche, {
          title: params.title,
          targetAudience: params.targetAudience,
          styleOptions: params.styleOptions,
          wordCount: params.wordCount,
          currentPartOutline: segments[i],
          fullOutline: outline,
          previousPartsScript: previousScript,
        });

        const partScript = await generateScriptPart(
          activeNiche.nicheId,
          partSystemPrompt,
          partUserPrompt,
          params.aiProvider,
          params.aiModel
        );

        fullScript.push(partScript);
        previousScript = fullScript.join('\n\n');
      }

      setProgress(p => ({ ...p!, stage: 'complete', status: 'success' }));
      return {
        outline,
        script: fullScript.join('\n\n'),
        route,
      };

    } catch (error) {
      setProgress(p => ({ ...p!, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }));
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [activeNiche]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    generate,
    cancel,
    progress,
    isGenerating,
    activeNiche,
  };
}
```

---

## PART IV: IMPLEMENTATION ROADMAP

## 4.1. Phase A: Abstract (Week 1-3)

**Goal:** Extract hardcoded finance DNA into dynamic `NicheConfig` objects WITHOUT changing UX.

### Deliverables

| # | Deliverable | Description | File |
|---|-------------|-------------|------|
| A1 | `NicheConfig` interface | Universal niche representation | `src/services/niche/NicheConfig.ts` |
| A2 | Hardcoded finance config | `NicheConfig` object with all finance DNA data | `src/config/niches.ts` |
| A3 | `NicheService` (Phase A) | Load from hardcoded config, in-memory cache | `src/services/niche/NicheService.ts` |
| A4 | `DynamicPromptBuilder` | Generic prompt assembly | `src/services/ai/DynamicPromptBuilder.ts` |
| A5 | `DynamicRouter` | Generic topic routing | `src/services/ai/DynamicRouter.ts` |
| A6 | `NicheContext` | React context for active niche | `src/contexts/NicheContext.tsx` |
| A7 | `useNicheGeneration` | Niche-aware generation hook | `src/features/generation/useNicheGeneration.ts` |
| A8 | `NicheSwitcher` UI | Simple dropdown to select niche | `src/features/niche/NicheSwitcher.tsx` |
| A9 | App shell update | Wrap app with NicheProvider | `App.tsx` |
| A10 | Backward compatibility | Finance prompts still work exactly as before | — |

### Code Changes Detail

**`src/config/niches.ts` (NEW):**

```typescript
// Hardcoded finance niche config for Phase A
// In Phase B, this will be replaced by DB loading

import coreRaw from '../../../docs/dna/finance-core.md?raw';
import analyticalRaw from '../../../docs/dna/finance-analytical.md?raw';
import psychologyRaw from '../../../docs/dna/finance-psychology.md?raw';
import mythbustingRaw from '../../../docs/dna/finance-mythbusting.md?raw';
import listicleRaw from '../../../docs/dna/finance-listicle.md?raw';
import fundamentalRaw from '../../../docs/dna/finance-fundamental.md?raw';
import hooksRaw from '../../../docs/dna/finance-hooks.md?raw';
import type { NicheConfig } from '../services/niche/NicheConfig';

export const FINANCE_VN_CONFIG: NicheConfig = {
  nicheId: 'finance-vn',
  name: 'Chú Que Tài Chính',
  brand: 'Chú Que Tài Chính',
  isSystem: true,
  coreDna: coreRaw,
  branches: {
    analytical: analyticalRaw,
    psychology: psychologyRaw,
    mythbusting: mythbustingRaw,
    listicle: listicleRaw,
    fundamental: fundamentalRaw,
  },
  hooks: hooksRaw,
  examples: [],
  routingRules: [
    {
      ruleId: 'rule-listicle-numbers',
      keywords: ['(\\d+)\\s*(nghề|cách|điều|thứ|thói quen|nguyên tắc|tài sản|khoản)', 'top\\s*\\d+'],
      branch: 'listicle',
      hook: 'story',
      mustHaves: ['N mục với 4 phần: Tên + Ví dụ + Cách làm + Cảnh báo'],
      priority: 100,
    },
    // ... more rules
  ],
  hardConstraints: [
    {
      constraintId: 'no-fake-numbers',
      description: 'KHÔNG bịa số liệu tài chính',
      enforcement: 'Mọi con số phải có nguồn HOẶC ghi "ước tính"',
      severity: 'error',
    },
    // ... more constraints
  ],
  metadata: {
    language: 'vi-VN',
    targetAudience: 'Người Việt 20-40 tuổi, thu nhập 10-30 triệu',
    scriptLengthWords: '2,500-4,500',
    scriptLengthMinutes: '8-15',
    frequency: '3-4 video/tuần',
  },
  version: '3.0.0',
  status: 'active',
  createdAt: new Date('2026-07-27'),
  updatedAt: new Date('2026-07-27'),
};

export const ALL_NICHES: NicheConfig[] = [FINANCE_VN_CONFIG];
```

**`src/services/niche/NicheService.ts` (Phase A version):**

```typescript
// Phase A: Load from hardcoded config
// Phase B: Replace with Supabase loading

import { FINANCE_VN_CONFIG, ALL_NICHES } from '@/config/niches';
import type { NicheConfig } from './NicheConfig';

class NicheService {
  private cache = new Map<string, NicheConfig>();

  async load(nicheId: string, _userId?: string): Promise<NicheConfig> {
    const cached = this.cache.get(nicheId);
    if (cached) return cached;

    const config = ALL_NICHES.find(n => n.nicheId === nicheId);
    if (!config) throw new Error(`Niche not found: ${nicheId}`);

    this.cache.set(nicheId, config);
    return config;
  }

  async listAccessible(_userId?: string): Promise<NicheConfig[]> {
    // Phase A: Everyone gets finance (system niche)
    return ALL_NICHES;
  }

  invalidateCache(nicheId: string): void {
    this.cache.delete(nicheId);
  }
}

export const nicheService = new NicheService();
```

### Testing Strategy

1. **Unit test:** `DynamicPromptBuilder.buildSystemPrompt()` output matches `buildFinanceSystemPrompt()` byte-for-byte for finance niche
2. **Integration test:** Generate a script using `useNicheGeneration` with finance niche → compare output with existing pipeline
3. **Regression test:** All 21 existing prompts produce identical output before and after refactor

## 4.2. Phase B: Multi-Niche Data (Week 4-8)

**Goal:** Move niche configs from hardcoded objects to Supabase database.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| B1 | Supabase migration | Run SQL schema from §2.2 |
| B2 | `NicheSeeder` | Seed finance niche into DB (convert markdown files to DB rows) |
| B3 | `NicheService` (Phase B) | Load from Supabase instead of hardcoded config |
| B4 | `NicheCRUD` UI | Create/Edit/Delete niche (admin only for system) |
| B5 | `DNAFileEditor` | Edit core/branch/hook files in-app |
| B6 | `RoutingRuleEditor` | Visual routing rule editor |
| B7 | `ConstraintEditor` | Hard constraint manager |
| B8 | 2nd system niche | Seed a 2nd built-in niche (e.g., "HealthQue") |
| B9 | Backward compat | Existing finance scripts still work |

### Supabase Migration

```bash
# Run in Supabase SQL Editor
# File: supabase/migrations/001_multi_niche_schema.sql
```

### NicheSeeder Implementation

```typescript
// src/services/niche/NicheSeeder.ts

/**
 * Seeds the finance-vn system niche into Supabase.
 * Run once on migration or first app load.
 */

import { supabase } from '@/lib/supabase';
import { FINANCE_VN_CONFIG } from '@/config/niches';

export async function seedFinanceNiche(): Promise<void> {
  // Check if already seeded
  const { data: existing } = await supabase
    .from('niches')
    .select('niche_id')
    .eq('niche_id', 'finance-vn')
    .single();

  if (existing) {
    console.log('Finance niche already seeded');
    return;
  }

  // 1. Insert niche record
  await supabase.from('niches').insert({
    niche_id: 'finance-vn',
    name: 'Chú Que Tài Chính',
    brand: 'Chú Que Tài Chính',
    is_system: true,
    owner_id: null,
    version: '3.0.0',
    status: 'active',
    metadata: {
      language: 'vi-VN',
      target_audience: 'Người Việt 20-40 tuổi, thu nhập 10-30 triệu',
      script_length_words: '2,500-4,500',
      script_length_minutes: '8-15',
      frequency: '3-4 video/tuần',
    },
  });

  // 2. Insert DNA files
  const dnaFiles = [
    { niche_id: 'finance-vn', file_type: 'core', file_name: 'finance-core.md', content: FINANCE_VN_CONFIG.coreDna },
    { niche_id: 'finance-vn', file_type: 'hook', file_name: 'finance-hooks.md', content: FINANCE_VN_CONFIG.hooks },
    ...Object.entries(FINANCE_VN_CONFIG.branches).map(([name, content]) => ({
      niche_id: 'finance-vn',
      file_type: 'branch',
      file_name: `${name}.md`,
      content,
    })),
  ];
  await supabase.from('niche_dna_files').insert(dnaFiles);

  // 3. Insert routing rules
  const routingRows = FINANCE_VN_CONFIG.routingRules.map(r => ({
    niche_id: 'finance-vn',
    rule_id: r.ruleId,
    keywords: r.keywords,
    branch: r.branch,
    hook: r.hook,
    must_haves: r.mustHaves,
    notes: r.notes,
    priority: r.priority,
  }));
  await supabase.from('niche_routing_rules').insert(routingRows);

  // 4. Insert hard constraints
  const constraintRows = FINANCE_VN_CONFIG.hardConstraints.map(c => ({
    niche_id: 'finance-vn',
    constraint_id: c.constraintId,
    description: c.description,
    enforcement: c.enforcement,
    severity: c.severity,
  }));
  await supabase.from('niche_hard_constraints').insert(constraintRows);

  console.log('Finance niche seeded successfully');
}
```

## 4.3. Phase C: User-Upload DNA (Week 9-16)

**Goal:** Allow users to upload their own DNA and create custom niches.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| C1 | DNA Import Wizard | Upload .md files + validate |
| C2 | AI DNA Validator | Use AI to suggest branches/hooks/routing from uploaded DNA |
| C3 | Niche Templates | Pre-built niche templates (health, psychology, family) |
| C4 | Niche Versioning | Track DNA changes over time |
| C5 | Niche Diff Viewer | Visual compare between versions |
| C6 | Niche Marketplace | (Future) Share niches between users |
| C7 | Niche Analytics | Track usage per niche |

### DNA Import Wizard Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Step 1: Basic Info                                                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Niche Name: [________________________]                                   │
│  Brand Voice: [________________________]                                │
│  Language: [vi-VN ▼]                                                    │
│  Target Audience: [________________________]                             │
│                                                                          │
│                                         [Next →]                        │
└──────────────────────────────────────────────────────────────────────────┘
                                  ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ Step 2: Upload DNA Files                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  📁 Drop your .md files here or click to browse                   │   │
│  │                                                                   │   │
│  │  Required: core.md (or equivalent)                               │   │
│  │  Optional: branch files (psychology.md, analytical.md, etc.)     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Detected files:                                                        │
│  ✓ core.md (2.4 KB)                                                    │
│  ✓ psychology.md (1.8 KB)                                              │
│  ✓ analytical.md (2.1 KB)                                              │
│                                                                          │
│                                         [Next →]                        │
└──────────────────────────────────────────────────────────────────────────┘
                                  ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ Step 3: AI Validation (Auto)                                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔄 Analyzing your DNA files...                                         │
│                                                                          │
│  ✓ Core DNA detected: Voice, tone, slogan, hard constraints             │
│  ✓ Branch detected: "psychology" (Tâm lý học)                          │
│  ✓ Branch detected: "analytical" (Phân tích)                           │
│  ⚠ Hooks: No hooks.md detected. Suggested: Add a hooks.md file.        │
│                                                                          │
│  AI Suggestions:                                                        │
│  → Your DNA looks like a "Psychology" niche. Recommended branches:     │
│    • psychology (primary)                                              │
│    • analytical (secondary)                                            │
│                                                                          │
│  [Accept Suggestions] or [Edit Manually]                                │
│                                                                          │
│                                         [Next →]                        │
└──────────────────────────────────────────────────────────────────────────┘
                                  ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ Step 4: Routing Rules (Optional)                                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Auto-detected rules:                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Pattern: "làm gì khi" → branch: psychology, hook: question       │   │
│  │ Pattern: "áp lực|sợ|stress" → branch: psychology, hook: story    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [+ Add Rule]                                                           │
│                                                                          │
│                                         [Next →]                        │
└──────────────────────────────────────────────────────────────────────────┘
                                  ↓
┌──────────────────────────────────────────────────────────────────────────┐
│ Step 5: Review & Create                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Summary:                                                               │
│  • Niche ID: user-abc123-psychology                                    │
│  • Name: Psychology Insights                                           │
│  • Brand: Psychology Insights                                          │
│  • Files: 3 (core, psychology, analytical)                              │
│  • Rules: 2 auto-detected                                              │
│                                                                          │
│  ⚠ This niche will be private to you. Upgrade to Pro to share.         │
│                                                                          │
│                                         [Create Niche]                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## PART V: HUMANIZER INTEGRATION (Separate Track)

### Relationship to Multi-Niche Refactor

Humanizer integration (from `skill_plan_new.md`) is a **separate track** that runs parallel to Phase A/B/C. It affects prompt content, not architecture.

```
Timeline:
────────────────────────────────────────────────────────────────────────────
Week 1-3:  Phase A (Abstract)          Humanizer: Integrate into Phase A prompts
Week 4-8:  Phase B (Multi-niche DB)    Humanizer: Apply to DynamicPromptBuilder
Week 9-16: Phase C (User-upload DNA)    Humanizer: Auto-detect + remove patterns
────────────────────────────────────────────────────────────────────────────
```

### Humanizer Blocks

Add to `DynamicPromptBuilder.buildEnforcementBlock()`:

```typescript
private buildHumanizerBlock(): string {
  return `
=== BỘ LỌC TẨY RỬA MÙI VĂN AI (HUMANIZER) ===

§7 TỪ VỰNG AI — CẤM:
- "bức tranh toàn cảnh", "minh chứng sống động", "then chốt", "vô cùng"
- "tấm thảm", "bản hòa ca", "tầng lớp", "hệ thống"

§9 NEGATIVE PARALLELISMS — CẤM:
- "Không chỉ... mà còn...", "Không phải vì A, cũng không phải vì B..."

§14 EM-DASH — GIỚI HẠN:
- Tối đa 2 em-dash (—) mỗi phần. Chỉ dùng cho dramatic pause, không phải decoration.
- Thay bằng: dấu phẩy, hai chấm, hoặc liên từ tự nhiên.

§28 SIGNPOSTING — CẤM:
- "Hãy cùng tôi đi sâu...", "Để tôi chia sẻ...", "Hôm nay tôi sẽ..."

§31 STACCATO DRAMA — CẤM:
- Hàng loạt câu cộc lốc liên tiếp: "Lan nghỉ việc. Không kế hoạch. Mất trắng."
- Câu ngắn chỉ dùng 1-2 lần cho điểm nhấn thật sự.

§32 APHORISM FORMULAS — CẤM:
- "Tiền bạc không phải là đích đến mà là tấm gương..."
- "X là Y của Z" formulas rỗng tuếch

§18 EMOJIS — CẤM TRONG SCRIPT:
- Script không dùng emoji. UI có emoji là styling, không phải nội dung.

TỰ KIỂM TRA:
[ ] Không có "bức tranh", "then chốt", "vô cùng", "tấm thảm"?
[ ] Không có "Không chỉ... mà còn..." liên tiếp?
[ ] Em-dash không quá 2/phần?
[ ] Không có "Hãy cùng tôi..." hay "Để tôi chia sẻ..."?
[ ] Không có hàng loạt câu cộc lốc?
[ ] Không có đạo lý rỗng tuếch?

=== KẾT THÚC HUMANIZER ===`;
}
```

---

## PART VI: FREEMIUM MODEL & MONETIZATION

### 6.1. Plan Tiers

| Feature | Free | Pro (99k/tháng) | Team (299k/tháng) | Agency (799k/tháng) |
|---------|:----:|:----------------:|:------------------:|:-------------------:|
| System niches | 1 (finance) | 1 | 1 | 1 |
| Custom niches | 0 | 5 | 20 | Unlimited |
| DNA files/niche | — | 10 | 50 | Unlimited |
| Branches/niche | 3 | 10 | Unlimited | Unlimited |
| Script generations/month | 30 | 200 | 1000 | Unlimited |
| Team members | 1 | 1 | 5 | 20 |
| API access | ❌ | ❌ | ❌ | ✅ |
| White-label | ❌ | ❌ | ❌ | ✅ |
| Priority support | ❌ | ✅ | ✅ | ✅ |

### 6.2. Revenue Projection

| Month | Free Users | Pro Users | MRR |
|-------|:----------:|:---------:|:---:|
| 1 | 100 | 5 | 495k |
| 3 | 500 | 30 | 2,970k |
| 6 | 2,000 | 150 | 14,850k |
| 12 | 10,000 | 800 | 79,200k |

---

## PART VII: RISK ANALYSIS

### 7.1. Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|:-----------:|:------:|------------|
| Finance scripts degrade after Phase A refactor | Low | High | Byte-for-byte comparison tests |
| Supabase RLS misconfigured → data leak | Medium | Critical | Security audit + penetration test |
| AI validation gives bad suggestions for user DNA | Medium | Medium | Always allow manual override |
| User uploads malicious/illegal content in DNA | Medium | High | Content filter + moderation queue |
| Performance regression from DB vs. hardcoded | Low | Low | Cache aggressively, benchmark before/after |

### 7.2. Business Risks

| Risk | Probability | Impact | Mitigation |
|------|:-----------:|:------:|------------|
| Users don't understand DNA concept | High | High | Better onboarding + template marketplace |
| Competitor clones the platform | Medium | Medium | Network effects (user DNA library) |
| Open-source fork removes monetization | Medium | Low | Focus on platform features (API, white-label) |

---

## APPENDIX A: FILE CHANGE SUMMARY

### Files to CREATE (NEW)

```
src/
├── services/niche/
│   ├── NicheService.ts          # Dynamic DNA loader
│   ├── NicheConfig.ts           # Interfaces
│   ├── NicheValidator.ts        # DNA validation
│   └── NicheSeeder.ts          # DB seeding
├── services/ai/
│   ├── DynamicRouter.ts         # Generic routing
│   ├── DynamicPromptBuilder.ts   # Generic prompt assembly
│   └── DynamicPromptRegistry.ts # Dynamic prompt registry
├── contexts/
│   └── NicheContext.tsx         # React context
├── features/
│   ├── niche/
│   │   ├── NicheSwitcher.tsx
│   │   ├── DNAImport.tsx
│   │   ├── NicheEditor.tsx
│   │   └── useNicheManagement.ts
│   └── generation/
│       └── useNicheGeneration.ts
├── config/
│   └── niches.ts               # Hardcoded niche configs (Phase A)
└── components/
    └── common/
        └── NicheBadge.tsx
```

### Files to REFACTOR (EXISTING)

```
src/
├── services/ai/
│   ├── prompts/index.ts          # Extract to DynamicPromptBuilder
│   └── router.ts                # Delegate to DynamicRouter
├── services/aiService.ts         # Accept dynamic prompts
├── features/generation/
│   └── useGenerationWorkflow.ts  # Add nicheId, delegate to useNicheGeneration
├── features/brief/
│   ├── useContentBrief.ts       # Add nicheId field
│   └── ContentBriefForm.tsx     # Add niche selector
├── domain/
│   └── ContentBrief.ts          # Add nicheId field
└── App.tsx                      # Wrap with NicheProvider
```

### Files to DELETE (DEPRECATED)

```
src/services/ai/prompts/index.ts  # Replaced by DynamicPromptBuilder + finance/ prompts
# (Keep finance/ subfolder for backward compat in Phase A/B)
```

---

## APPENDIX B: TEST PLAN

### Unit Tests

| Test | File | What to Test |
|------|------|-------------|
| `DynamicPromptBuilder` | `__tests__/DynamicPromptBuilder.test.ts` | Output matches `buildFinanceSystemPrompt()` for finance |
| `DynamicRouter` | `__tests__/DynamicRouter.test.ts` | Routing rules match `niche-finance.md` §2.6 |
| `NicheService.load` | `__tests__/NicheService.test.ts` | Returns correct config from hardcoded Phase A |
| `NicheService.listAccessible` | `__tests__/NicheService.test.ts` | Returns all system niches |

### Integration Tests

| Test | What to Test |
|------|-------------|
| Generate with `useNicheGeneration` (finance) | Output is byte-identical to old `useGenerationWorkflow` |
| Switch niche → generate | Correct branch DNA + hooks used |
| Upload niche → generate | User DNA is used correctly |

### E2E Tests

| Test | Scenario |
|------|---------|
| Free user creates script | Only finance niche available |
| Pro user creates custom niche | Can upload DNA, generate scripts |
| Team user shares niche | Niche visible to team members |
| Agency user white-labels | Custom domain + branding |

---

## APPENDIX C: DEPENDENCIES

### Phase A Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| React | UI | 18.x |
| TypeScript | Type safety | 5.x |
| Supabase Client | Database | @supabase/supabase-js |
| Vite | Build | 5.x |
| Vitest | Testing | 1.x |
| MSW | API mocking in tests | (optional) |

### No New Dependencies for Phase A

Phase A is a pure refactor — no new npm packages needed. All functionality is achieved by reorganizing existing code.

---

*Document status: DRAFT — Pending Tier 1 review*  
*Next action: Tier 1 answers 5 open questions → MSEW implementation*
