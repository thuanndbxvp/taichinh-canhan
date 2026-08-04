# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 2 - Phase 1 (Niche Abstraction Layer)

---

### BƯỚC 1: Tạo Interface `src/services/niche/NicheConfig.ts`
- **File:** `src/services/niche/NicheConfig.ts` (Tạo mới)
- **Nội dung:**

```typescript
export interface NicheMetadata {
  language: string;
  targetAudience: string;
  scriptLengthWords: string;
  scriptLengthMinutes: string;
}

export interface RoutingRule {
  ruleId: string;
  keywords: string[];
  branch: string;
  hook?: string;
  mustHaves?: string[];
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
}

export interface NicheConfig {
  nicheId: string;
  name: string;
  brand: string;
  isSystem: boolean;
  ownerId?: string;
  coreDna: string;
  branches: Record<string, string>;
  hooks: string;
  examples: NicheExample[];
  routingRules: RoutingRule[];
  hardConstraints: HardConstraint[];
  metadata: NicheMetadata;
  version: string;
  status: 'active' | 'draft' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}
```

---

### BƯỚC 2: Tạo Default Niche Config trong `src/config/niches.ts`
- **File:** `src/config/niches.ts` (Tạo mới)
- **Nội dung:**

```typescript
import coreRaw from '../../docs/dna/finance-core.md?raw';
import analyticalRaw from '../../docs/dna/finance-analytical.md?raw';
import psychologyRaw from '../../docs/dna/finance-psychology.md?raw';
import mythbustingRaw from '../../docs/dna/finance-mythbusting.md?raw';
import listicleRaw from '../../docs/dna/finance-listicle.md?raw';
import fundamentalRaw from '../../docs/dna/finance-fundamental.md?raw';
import hooksRaw from '../../docs/dna/finance-hooks.md?raw';

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
      ruleId: 'rule-analytical',
      keywords: ['lãi suất', 'đầu tư', 'bất động sản', 'chứng khoán', 'lạm phát', 'vĩ mô', 'dòng tiền'],
      branch: 'analytical',
      hook: 'data',
      priority: 10,
    },
    {
      ruleId: 'rule-psychology',
      keywords: ['tâm lý', 'thói quen', 'tiêu tiền', 'nghiện mua sắm', 'áp lực', 'FOMO'],
      branch: 'psychology',
      hook: 'story',
      priority: 9,
    },
    {
      ruleId: 'rule-mythbusting',
      keywords: ['lừa đảo', 'sự thật', 'lầm tưởng', 'cạm bẫy', 'dối trá', 'bóc phốt'],
      branch: 'mythbusting',
      hook: 'myth',
      priority: 8,
    },
    {
      ruleId: 'rule-listicle',
      keywords: ['cách', 'sai lầm', 'bước', 'bí quyết', 'nguyên tắc', 'top'],
      branch: 'listicle',
      hook: 'question',
      priority: 7,
    },
  ],
  hardConstraints: [
    {
      constraintId: 'no-flowery-prose',
      description: 'Cấm từ ngữ sáo rỗng, hoa mỹ, staccato drama',
      enforcement: 'Tự kiểm tra và viết lại nếu vi phạm',
      severity: 'error',
    },
    {
      constraintId: 'math-simulation-required',
      description: 'Phần 3 & 4 bắt buộc có bài toán mô phỏng số liệu',
      enforcement: 'Luôn đưa số liệu giả định nếu không có dữ liệu thực',
      severity: 'error',
    },
  ],
  metadata: {
    language: 'vi-VN',
    targetAudience: 'Người đi làm, nhà đầu tư cá nhân 20-40 tuổi',
    scriptLengthWords: '1,800-2,400',
    scriptLengthMinutes: '10-15',
  },
  version: '3.0.0',
  status: 'active',
  createdAt: new Date('2026-07-26'),
  updatedAt: new Date('2026-08-04'),
};

export const ALL_NICHES: NicheConfig[] = [FINANCE_VN_CONFIG];
```

---

### BƯỚC 3: Tạo `src/services/niche/NicheService.ts`
- **File:** `src/services/niche/NicheService.ts` (Tạo mới)
- **Nội dung:**

```typescript
import { ALL_NICHES, FINANCE_VN_CONFIG } from '../../config/niches';
import type { NicheConfig } from './NicheConfig';

class NicheService {
  private cache = new Map<string, NicheConfig>();

  async load(nicheId: string): Promise<NicheConfig> {
    const cached = this.cache.get(nicheId);
    if (cached) return cached;

    const config = ALL_NICHES.find((n) => n.nicheId === nicheId);
    if (!config) {
      console.warn(`Niche not found: ${nicheId}. Falling back to default.`);
      return FINANCE_VN_CONFIG;
    }

    this.cache.set(nicheId, config);
    return config;
  }

  async listAccessible(): Promise<NicheConfig[]> {
    return ALL_NICHES;
  }

  invalidateCache(nicheId: string): void {
    this.cache.delete(nicheId);
  }
}

export const nicheService = new NicheService();
```

---

### BƯỚC 4: Tạo `src/services/ai/DynamicPromptBuilder.ts` và `DynamicRouter.ts`
- **File:** `src/services/ai/DynamicPromptBuilder.ts` (Tạo mới)
- **Nội dung:**

```typescript
import type { NicheConfig, HardConstraint } from '../niche/NicheConfig';
import {
  buildGenerationHumanizerBlock,
  buildRewritingHumanizerBlock,
} from './prompts';

export class DynamicPromptBuilder {
  private buildEnforcementBlock(constraints: HardConstraint[]): string {
    const items = constraints.map(
      (c, i) => `${i + 1}. [${c.severity.toUpperCase()}] ${c.description} -> Thực thi: ${c.enforcement}`
    );
    return `=== LỆNH THỰC THI BẮT BUỘC TỪ HỆ THỐNG ===\n${items.join('\n')}\n=== KẾT THÚC LỆNH ===`;
  }

  buildSystemPrompt(nicheConfig: NicheConfig, branch?: string, hook?: string, macroContext?: string): string {
    const branchContent = branch && nicheConfig.branches[branch]
      ? nicheConfig.branches[branch]
      : Object.values(nicheConfig.branches)[0] || '';

    const hookContent = hook
      ? `${nicheConfig.hooks}\n\n[LỆNH BẮT BUỘC]: BẮT BUỘC sử dụng kiểu mở đầu (Hook): "${hook}".`
      : nicheConfig.hooks;

    const parts = [
      `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]`,
      nicheConfig.coreDna,
      branchContent,
      hookContent,
    ];

    if (macroContext) {
      parts.push(`[DỮ LIỆU BỔ TRỢ / NGHIÊN CỨU]:\n${macroContext}`);
    }

    parts.push(this.buildEnforcementBlock(nicheConfig.hardConstraints));
    parts.push(buildGenerationHumanizerBlock());

    return parts.join('\n\n');
  }

  buildRewritingSystemPrompt(nicheConfig: NicheConfig, branch?: string, level: 'light' | 'deep' = 'light'): string {
    const branchContent = branch && nicheConfig.branches[branch]
      ? nicheConfig.branches[branch]
      : Object.values(nicheConfig.branches)[0] || '';

    return [
      `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]`,
      nicheConfig.coreDna,
      branchContent,
      nicheConfig.hooks,
      this.buildEnforcementBlock(nicheConfig.hardConstraints),
      buildRewritingHumanizerBlock(level),
    ].join('\n\n');
  }
}

export const dynamicPromptBuilder = new DynamicPromptBuilder();
```

- **File:** `src/services/ai/DynamicRouter.ts` (Tạo mới)
- **Nội dung:**

```typescript
import type { NicheConfig } from '../niche/NicheConfig';

export interface RouteResult {
  branch: string;
  hook: string;
  matchedRule?: string;
}

export class DynamicRouter {
  route(title: string, nicheConfig: NicheConfig): RouteResult {
    const sortedRules = [...nicheConfig.routingRules].sort((a, b) => b.priority - a.priority);
    for (const rule of sortedRules) {
      const matched = rule.keywords.some((kw) => new RegExp(kw, 'i').test(title));
      if (matched) {
        return {
          branch: rule.branch,
          hook: rule.hook || 'story',
          matchedRule: rule.ruleId,
        };
      }
    }

    const firstBranch = Object.keys(nicheConfig.branches)[0] || 'analytical';
    return {
      branch: firstBranch,
      hook: 'story',
    };
  }
}

export const dynamicRouter = new DynamicRouter();
```

---

### BƯỚC 5: Tạo `src/contexts/NicheContext.tsx` và `src/features/niche/NicheSwitcher.tsx`
- **File:** `src/contexts/NicheContext.tsx` (Tạo mới)
- **File:** `src/features/niche/NicheSwitcher.tsx` (Tạo mới UI Switcher component)
- **Tích hợp:** Bọc `<NicheProvider>` trong `App.tsx`.

---

### BƯỚC 6: Viết Unit Tests & Kiểm Tra
- **File:** `src/services/niche/NicheService.test.ts`
- **File:** `src/services/ai/DynamicPromptBuilder.test.ts`
- Chạy `npm test` và `npm run typecheck`.
