# plan3.md — Production Hardening + Content Studio (Phase 6 + 7)

> Tách riêng Phase 6 + 7 từ `plan1.md`. Mục tiêu: biến Dark Frontiers từ "tool viết script cá nhân chạy thuần client" thành "content studio production-grade có auth, lưu trữ cloud, tích hợp YouTube và analytics feedback loop".
>
> **Stack quyết định:** Neon (serverless Postgres + Neon Auth) + Vercel/Netlify Functions + YouTube Data API + YouTube Analytics API. Lý do: Postgres quen thuộc, Neon scale-to-zero + branching DB cực rẻ, Neon Auth (Stack Auth dưới hood) tích hợp OAuth + row-level security không cần backend riêng.

---

## 0. Tổng quan kiến trúc

### Hiện tại (Phase 0-5 đã xong)
```
Browser ──(API key trong localStorage)──> OpenAI / Kyma
Browser ──(localStorage)──> Library + Usage
```

### Phase 6 + 7 target
```
Browser ──(JWT)──> Next.js / Vite SPA
                          │
                          ├──> Neon Postgres ──── Auth (Neon Auth)
                          │      ├── users
                          │      ├── projects
                          │      ├── scripts
                          │      ├── series
                          │      ├── brand_bibles
                          │      ├── usage_events
                          │      └── publish_jobs
                          │
                          ├──> Functions (Vercel/Netlify)
                          │      ├── proxyAI() — gọi OpenAI/Kyma, KHÔNG lộ key
                          │      ├── proxyYouTube() — OAuth refresh + API call
                          │      ├── syncAnalytics() — pull mỗi 24h
                          │      └── optimizePrompt() — feedback loop
                          │
                          └──> External
                                 ├── OpenAI
                                 ├── Kyma
                                 ├── YouTube Data API (metadata + publish)
                                 └── YouTube Analytics API (CTR/retention)
```

### Phân biệt Phase 6 vs 7

| | Phase 6 — Production Hardening | Phase 7 — Content Studio |
|---|---|---|
| **Mục tiêu** | An toàn + scale + observable | Content workflow + analytics feedback |
| **Cần Neon?** | ✅ (lưu user, project, usage) | ✅ (thêm series, brand_bible, publish_job) |
| **Cần YouTube OAuth?** | ❌ | ✅ |
| **Cần Functions?** | ✅ (proxyAI để giấu key) | ✅ (thêm proxyYouTube, syncAnalytics) |
| **Có analytics feedback loop?** | ❌ | ✅ |
| **Effort ước tính** | 4-5 tuần | 6-8 tuần |

---

## 1. Phase 6 — Production Hardening

### 1.1. Lý do dùng Neon (không phải Firebase, Supabase, hay Atlas)

| Tiêu chí | Neon | Firebase | Supabase | Mongo Atlas |
|---|---|---|---|---|
| Schema | Postgres (relational) | Firestore (NoSQL) | Postgres | Document |
| Auth tích hợp | ✅ Neon Auth (Stack Auth) | ✅ Firebase Auth | ✅ Supabase Auth | ❌ (cần Auth0) |
| Branch DB (dev/test DB riêng) | ✅ Tính năng cốt lõi | ❌ | ❌ (qua CLI) | ❌ |
| Scale-to-zero (rẻ khi dev) | ✅ | ❌ (luôn tính) | ✅ Pro plan | ✅ Tier rẻ |
| Serverless-friendly | ✅ HTTP driver | ✅ | ✅ | ✅ |
| RLS (row-level security) | ✅ | ✅ (Firestore rules) | ✅ | ❌ |
| Quen thuộc với dev | ✅ SQL quen thuộc | ⚠️ NoSQL pattern | ✅ | ⚠️ |

**Chốt:** Neon thắng vì:
1. **Branch DB** — tạo `dev/thuann/feature-xyz` branch tự sinh DB riêng cho PR, xóa khi merge. Không tốn $0.
2. **Neon Auth** (GA cuối 2025) — tích hợp OAuth Google + email/password, RLS auto, không cần backend riêng cho auth.
3. **Serverless driver** — `@neondatabase/serverless` query qua HTTP, không cần TCP, dùng được trong edge functions.
4. **Postgres quen thuộc** — schema, migration, SQL chuẩn.

### 1.2. Schema Neon (Phase 6 scope)

```sql
-- Users (Neon Auth tự quản lý, chỉ tham chiếu)
-- user_id, email, oauth_provider, created_at — Neon Auth tự sinh

-- Projects (workspace)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  niche TEXT,                           -- 'finance', 'tech', ...
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);
CREATE INDEX idx_projects_user ON projects(user_id, archived_at);

-- Scripts (1 project có nhiều script)
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brief JSONB NOT NULL,                -- ContentBrief raw
  outline TEXT,
  content TEXT,
  schema_version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'in_review', 'approved', 'published'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_scripts_project ON scripts(project_id, status);

-- Usage events (mỗi AI call = 1 row)
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,              -- 'openai', 'kyma'
  model TEXT NOT NULL,
  prompt_tokens INT NOT NULL,
  completion_tokens INT NOT NULL,
  cost_usd NUMERIC(10, 6) NOT NULL,
  usage_kind TEXT NOT NULL,            -- 'outline', 'script_part', 'dialogue', ...
  request_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_usage_user_time ON usage_events(user_id, created_at DESC);
CREATE INDEX idx_usage_project ON usage_events(project_id, created_at DESC);

-- Jobs (long-running generation)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth.users(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,                  -- 'generate_outline', 'generate_parts', 'revise'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'cancelled'
  progress JSONB NOT NULL DEFAULT '{}',  -- { currentPart, totalParts, lastChunk }
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);
CREATE INDEX idx_jobs_user_status ON jobs(user_id, status, created_at DESC);

-- RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_owner ON projects
  USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY scripts_owner ON scripts
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = current_setting('app.current_user_id')::UUID
  ));

-- (tương tự cho usage_events, jobs)
```

### 1.3. Neon Auth

Sử dụng Neon Auth (Stack Auth wrapper) thay vì tự build:

```ts
// src/services/auth/neonAuth.ts
import { StackClientApp } from '@stackframe/js';

export const auth = new StackClientApp({
  projectId: import.meta.env.VITE_NEON_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_NEON_PUBLISHABLE_KEY,
});

// useAuth() hook cung cấp: user, signIn, signOut, oauthCallback
```

**Flow:**
1. User click "Login with Google" → redirect đến Neon Auth OAuth
2. Callback → JWT lưu httpOnly cookie (Set bởi Neon Auth)
3. Mỗi request từ client → kèm JWT
4. Backend verify JWT, set `app.current_user_id` cho Postgres session
5. RLS policy tự động filter

**Ưu điểm:** Không cần backend riêng cho auth, OAuth refresh, session management.

### 1.4. Backend proxy (Functions trên Vercel/Netlify)

**Tại sao cần proxy:**
- OpenAI API key KHÔNG được lộ ra browser (đã có ở Phase 0-5 nhưng là localStorage).
- Kyma cần auth token per-org.
- Cho phép rate limit server-side.
- Ẩn cost tính toán.

**Endpoint:**
```
POST /api/ai/chat          → proxy OpenAI/Kyma, ghi usage_events
GET  /api/usage/summary    → tổng cost/tháng cho user
GET  /api/usage/history    → 100 events gần nhất
POST /api/jobs/start       → tạo job row
POST /api/jobs/cancel      → cancel job
GET  /api/jobs/:id         → poll progress
```

**Code skeleton:**
```ts
// api/ai/chat.ts (Vercel function)
import { neon } from '@neondatabase/serverless';
import { verifyJwt } from './_auth';

export default async function handler(req: Request) {
  const userId = await verifyJwt(req);
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { provider, model, messages, usageKind } = await req.json();

  // 1. Gọi provider thật (key từ env var, KHÔNG lộ)
  const apiKey = provider === 'openai'
    ? process.env.OPENAI_API_KEY
    : process.env.KYMA_API_KEY;

  const res = await fetch(providerEndpoint(provider), {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  // 2. Stream response về client + capture usage
  const [clientStream, usage] = await streamWithUsage(res);

  // 3. Ghi usage (fire-and-forget, không block stream)
  const sql = neon(process.env.DATABASE_URL!);
  sql`
    INSERT INTO usage_events
      (user_id, provider, model, prompt_tokens, completion_tokens, cost_usd, usage_kind, request_id)
    VALUES
      (${userId}, ${provider}, ${model}, ${usage.prompt}, ${usage.completion},
       ${costOf(provider, model, usage)}, ${usageKind}, ${usage.requestId})
  `.catch(console.error); // log error nếu DB write fail, không fail user

  return new Response(clientStream, { headers: { 'Content-Type': 'text/event-stream' } });
}
```

### 1.5. Observability

```ts
// src/lib/logger.ts — gửi log lên /api/logs
export const logger = {
  info: (event: string, meta: object) =>
    fetch('/api/logs', { method: 'POST', body: JSON.stringify({
      level: 'info', event, meta, userId: getUserId(), timestamp: Date.now(),
    })}),
  error: (event: string, err: Error, meta: object) =>
    fetch('/api/logs', { method: 'POST', body: JSON.stringify({
      level: 'error', event, error: { message: err.message, stack: err.stack }, meta,
    })}),
};
```

Mọi AI call, job state change, auth event → log qua logger → backend ghi vào table `app_logs` hoặc Datadog/Vercel Logs.

### 1.6. Job persistence

**Vấn đề hiện tại:** Generate 5 phút refresh = mất hết.

**Giải pháp:**
1. Client gọi `POST /api/jobs/start` → server tạo `jobs` row (status=pending)
2. Function worker (queue hoặc cron trigger) đọc job → gọi AI → update `progress` JSONB
3. Client poll `GET /api/jobs/:id` mỗi 2s → update UI
4. User close tab → job vẫn chạy
5. User mở lại → poll job cũ → resume UI

**Queue chọn:** Vercel Cron + Postgres SKIP LOCKED (không cần Redis cho MVP).

```sql
-- Worker poll job pending
SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;
```

### 1.7. Migration path từ localStorage

**Không break user hiện tại.** Plan:
1. Phase 6.1: Neon schema + auth (chưa wire app)
2. Phase 6.2: Migration tool `src/services/migrate/localStorageToNeon.ts`:
   - User login lần đầu → detect localStorage data → upload lên Neon → xóa localStorage
   - Idempotent (skip nếu already migrated)
3. Phase 6.3: App đọc/ghi qua Neon, fallback localStorage nếu chưa login

### 1.8. Sprint breakdown cho Phase 6

| Sprint | Thời gian | Output |
|---|---|---|
| **S6.1 — Neon setup** | 3 ngày | Project Neon + schema + RLS + Auth wired, `users`/`projects`/`scripts`/`usage_events`/`jobs` tables live |
| **S6.2 — Auth integration** | 3 ngày | Login/logout UI, JWT middleware, RLS verified qua test |
| **S6.3 — AI proxy** | 4 ngày | `/api/ai/chat` function, ghi usage, stream response, rate limit per user |
| **S6.4 — Job persistence** | 4 ngày | `jobs` table + worker, client poll UI, cancel button |
| **S6.5 — Observability** | 2 ngày | Logger → /api/logs → table, basic dashboard (success/failure rate per user) |
| **S6.6 — Migration + cleanup** | 3 ngày | localStorage → Neon migration tool, remove localStorage code path, full E2E test |

**Tổng Phase 6: ~4-5 tuần**

---

## 2. Phase 7 — Content Studio

### 2.1. Schema mở rộng (thêm vào Neon)

```sql
-- Series
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template JSONB NOT NULL,             -- { hook, intro, body_structure, outro }
  frequency TEXT,                      -- 'weekly', 'biweekly', 'monthly'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Brand bible (1 project có 1 active)
CREATE TABLE brand_bibles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  voice TEXT NOT NULL,                 -- 'humorous', 'serious', 'empathetic'
  tone TEXT NOT NULL,                  -- 'như 2 người bạn café'
  primary_color TEXT,                  -- '#FFB800'
  font TEXT,
  logo_url TEXT,
  must_include TEXT[],                -- ['disclaimer đầu video', 'CTA subscribe']
  must_avoid TEXT[],                  -- ['từ crypto', 'lời hứa lợi nhuận']
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Publish jobs (YouTube)
CREATE TABLE publish_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES neon_auth.users(id) ON DELETE CASCADE,
  youtube_video_id TEXT,              -- set sau khi publish
  title TEXT NOT NULL,
  description TEXT,
  chapters JSONB,                     -- [{ time: '0:00', title: 'Intro' }]
  pinned_comment TEXT,
  thumbnail_concepts JSONB,            -- [{ concept: '...', score_estimate: 0.8 }]
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Analytics (cache từ YouTube Analytics API)
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_video_id TEXT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  views INT,
  ctr NUMERIC(5, 4),                   -- 0.0543 = 5.43%
  avg_view_duration_seconds INT,
  retention_curve JSONB,               -- [{ second: 0, retention: 1.0 }, ...]
  subscriber_gain INT,
  top_comments JSONB                   -- [{ author, text, like_count }]
);
CREATE INDEX idx_analytics_video ON analytics_snapshots(youtube_video_id, fetched_at DESC);

-- AI learning (feedback loop output)
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,                  -- 'hook_pattern', 'length_sweet_spot', 'topic_ctr'
  insight TEXT NOT NULL,               -- 'Hook dạng câu hỏi có CTR cao hơn 23%'
  evidence JSONB,                     -- { sample_size: 12, p_value: 0.04, baseline: 0.05 }
  confidence NUMERIC(3, 2),            -- 0.85
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.2. YouTube OAuth + API

**OAuth flow:**
1. User vào Settings → "Connect YouTube"
2. Redirect đến Google OAuth scope: `youtube.upload` + `youtube.readonly` + `yt-analytics.readonly`
3. Callback → server lưu refresh_token (encrypted) vào `user_integrations`
4. Mỗi YouTube API call dùng refresh_token để lấy access_token mới

```ts
// src/services/youtube/auth.ts
export async function getYouTubeAccessToken(userId: string): Promise<string> {
  const refreshToken = await db.query(
    'SELECT encrypted_refresh_token FROM user_integrations WHERE user_id = $1 AND provider = $2',
    [userId, 'youtube']
  );
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: decrypt(refreshToken),
      grant_type: 'refresh_token',
    }),
  });
  const { access_token } = await res.json();
  return access_token;
}
```

**Quota tracking:**
YouTube Data API free tier = 10,000 units/day. Mỗi `videos.insert` = 1,600 units. → Max ~6 publish/ngày. Phase 7 cần cache aggressively, không poll nhiều.

### 2.3. Calendar view

**Data model:**
- Mỗi `publish_jobs.scheduled_at` = 1 entry trên calendar.
- Drag-drop để reschedule.
- Filter theo series.

**UI:**
```tsx
<Calendar
  view="month"
  events={publishJobs}
  onEventDrop={(job, newDate) => updateScheduledAt(job.id, newDate)}
  onDateClick={(date) => createNewScriptAt(date)}
  colorBy="series"
/>
```

### 2.4. Brand bible enforcement

Khi generate script, prepend brand bible context vào system prompt:

```ts
// src/services/ai/promptBuilder.ts
function buildSystemPrompt(brief: ContentBrief, brandBible: BrandBible) {
  return `
You write in ${brandBible.voice} voice, ${brandBible.tone} tone.

MUST INCLUDE in every script:
${brandBible.must_include.map(s => `- ${s}`).join('\n')}

MUST AVOID:
${brandBible.must_avoid.map(s => `- ${s}`).join('\n')}

Topic: ${brief.title}
Audience: ${brief.targetAudience}
...
`;
}
```

**Post-generation check:** Validate output có chứa must_include, không chứa must_avoid → block export nếu fail.

### 2.5. Multi-format repurposing

```ts
// src/services/exporter/index.ts
export const exporters = {
  youtubeLong: (script: ScriptDocument) => ({
    title: truncate(script.title, 100),
    description: renderDescription(script),  // + hashtags + disclaimer
    chapters: extractChapters(script),        // [{ time, title }]
    tags: extractKeywords(script),
  }),
  youtubeShort: (script) => ({
    title: script.title,
    script: extractHookAndFirst60s(script),
    pinned_comment: 'Câu hỏi kéo engagement?',
  }),
  tiktok: (script) => ({ ...same as short but with hashtags }),
  blogPost: (script) => ({
    html: renderBlogHtml(script),
    meta_description: script.summary,
  }),
  linkedIn: (script) => ({
    post: renderLinkedInPost(script),
    hashtags: ['#Finance', '#Vietnam'],
  }),
  podcastScript: (script) => ({
    audio: renderForTTS(script),
    intro_outro: renderIntroOutro(script),
  }),
};
```

Mỗi exporter test với 10 script thật để đảm bảo format đúng.

### 2.6. Analytics feedback loop

**Cron job hàng ngày (3 AM UTC):**
```
For each video published > 48h ago:
  1. Pull YouTube Analytics API (views, CTR, retention, subscriber_gain)
  2. Insert into analytics_snapshots
  3. Trigger optimizePrompt() job
```

**`optimizePrompt()` logic:**
```ts
// Lấy N video gần nhất
const videos = await db.query(`
  SELECT s.*, a.ctr, a.avg_view_duration_seconds
  FROM scripts s
  JOIN publish_jobs pj ON pj.script_id = s.id
  JOIN analytics_snapshots a ON a.youtube_video_id = pj.youtube_video_id
  WHERE pj.published_at > now() - interval '90 days'
  ORDER BY pj.published_at DESC
  LIMIT 50
`);

// Phân tích: hook type → CTR
const hookCtr = groupBy(videos, v => v.outline_first_paragraph)
  .map(g => ({ hook: g.key, avgCtr: avg(g.values.map(v => v.ctr)) }));

// Tìm pattern
if (hookCtr.find(h => h.hook.startsWith('Câu hỏi')).avgCtr > baseline) {
  await db.query(`
    INSERT INTO ai_insights (project_id, kind, insight, evidence, confidence)
    VALUES ($1, 'hook_pattern', $2, $3, $4)
  `, [
    projectId,
    'Hook dạng câu hỏi có CTR cao hơn 23% (12 videos)',
    { sample: 12, baseline: 0.05, treatment: 0.0615, p_value: 0.04 },
    0.85,
  ]);
}

// Prepend insight vào prompt lần sau
```

**Guardrail:** Insight chỉ apply nếu `confidence > 0.7` VÀ `sample_size >= 5`. Tránh overfit.

### 2.7. Sprint breakdown cho Phase 7

| Sprint | Thời gian | Output |
|---|---|---|
| **S7.1 — Series + Brand bible** | 1 tuần | CRUD UI cho series + brand_bible, system prompt injection, post-gen validation |
| **S7.2 — YouTube OAuth** | 1 tuần | Settings → Connect YouTube, refresh token encrypted, helper `getYouTubeAccessToken()` |
| **S7.3 — YouTube publish** | 1 tuần | `publish_jobs` flow, upload video + metadata, chapters, pinned comment |
| **S7.4 — Calendar** | 1 tuần | Month/week view, drag-drop reschedule, color by series |
| **S7.5 — Multi-format export** | 1.5 tuần | 5 exporter (YouTube long/short, TikTok, blog, LinkedIn, podcast), 10 test scripts mỗi format |
| **S7.6 — Analytics pull** | 1 tuần | Cron daily, fetch YouTube Analytics API, store snapshot, basic dashboard |
| **S7.7 — Feedback loop** | 1.5 tuần | optimizePrompt() engine, ai_insights table, prompt auto-update, guardrail |
| **S7.8 — Thumbnail A/B** | 1 tuần | Sinh 5 concept variants, A/B test framework, track winner |

**Tổng Phase 7: ~8-9 tuần**

---

## 3. Rủi ro + Mitigation

| Rủi ro | Tác động | Mitigation |
|---|---|---|
| **YouTube quota exhaustion** | 10k units/day → max 6 publish/ngày | Cache aggressively, batch analytics fetch, warn user ở 80% |
| **OAuth token revoke** (user đổi password Google) | Mất quyền publish | Detect 401 → re-auth flow, clear cached data |
| **Neon cold start latency** (500ms cold) | UX chậm lần đầu | Pre-warm connection ở app boot, dùng pooled connection |
| **Neon Auth GA scope** (còn mới) | Bugs chưa document | Có escape hatch: tự build JWT nếu cần |
| **Analytics data delayed 24-48h** | User expect real-time | UI ghi rõ "Data có thể delay 48h", dùng ước lượng từ initial 2h |
| **Feedback loop overfit** | AI viết script generic hóa quá mức | Guardrail: confidence > 0.7, sample >= 5, manual review insight trước apply |
| **Migration data loss** (localStorage → Neon) | User mất scripts | Backup localStorage 30 ngày sau migrate, export to JSON nút luôn available |
| **Cost Neon** (khi nhiều user) | $0.5/GB-month storage + compute | Branch DB tự động cleanup sau merge, set retention 90 ngày cho usage_events |
| **Phase 6 chưa xong mà làm Phase 7** | Build trên nền chưa ổn định | **Bắt buộc Phase 6 xong trước Phase 7** |

---

## 4. Cost estimate (Neon + YouTube API + Functions)

| Service | Free tier | Estimated cost (1 user active/ngày) |
|---|---|---|
| Neon Compute | 191.9 hours/month | $0 (dưới ngưỡng) |
| Neon Storage | 0.5 GB | $0 (dưới ngưỡng) |
| Vercel Functions | 100 GB-hours | $0 (dưới ngưỡng cho 1 user) |
| YouTube Data API | 10,000 units/day | $0 |
| YouTube Analytics API | 10,000 units/day | $0 |
| **Total** | | **$0 cho MVP đến 100 user** |

Sau 100 user → Neon Pro $19/month + Vercel Pro $20/month. ~$40/month cho full studio.

---

## 5. Định nghĩa Done cho Phase 6 + 7

### Phase 6 Done khi:
- [ ] User login Google qua Neon Auth thành công.
- [ ] localStorage data migrate sang Neon không mất mát.
- [ ] API key KHÔNG còn trong browser bundle.
- [ ] Generate 10 phút refresh tab → resume được.
- [ ] Usage dashboard show chính xác cost từ server-side tracking.
- [ ] Có logs cho mọi AI call (requestId, latency, status).
- [ ] Rate limit 100 calls/giờ per user hoạt động.

### Phase 7 Done khi:
- [ ] Tạo series + brand bible → AI script tuân thủ must_include/must_avoid.
- [ ] Publish YouTube qua OAuth, video lên kênh thành công.
- [ ] Calendar show scheduled jobs, drag-drop reschedule.
- [ ] 5 format export (YouTube long/short, TikTok, blog, LinkedIn, podcast) đều cho output đúng format.
- [ ] Cron pull YouTube Analytics mỗi ngày, dashboard show CTR/retention.
- [ ] Sau 10 videos, feedback loop sinh được insight đầu tiên (vd: "Hook dạng câu hỏi CTR cao hơn X%").
- [ ] Insight apply vào prompt lần generate sau.
- [ ] Thumbnail A/B test framework: sinh 5 concepts, track winner.

### Phase 8 Done khi:
- [ ] (xem Section 7.9 đầy đủ)

---

## 6. Phụ thuộc & Thứ tự thực hiện

```
Phase 6.1 — Neon setup (3 ngày)
    ↓
Phase 6.2 — Auth integration (3 ngày)
    ↓
Phase 6.3 — AI proxy (4 ngày)
    ↓
    ├──> Phase 6.4 — Job persistence (4 ngày)
    ├──> Phase 6.5 — Observability (2 ngày)
    ↓
Phase 6.6 — Migration + cleanup (3 ngày)
    ↓ (BẮT BUỘC xong Phase 6 trước)
Phase 7.1 — Series + Brand bible (1 tuần)
    ↓
Phase 7.2 — YouTube OAuth (1 tuần)
    ↓
    ├──> Phase 7.3 — Publish (1 tuần)
    ├──> Phase 7.4 — Calendar (1 tuần)
    ↓
Phase 7.5 — Multi-format export (1.5 tuần)
    ↓
    ├──> Phase 7.6 — Analytics pull (1 tuần)
    ↓
Phase 7.7 — Feedback loop (1.5 tuần)
    ↓
Phase 7.8 — Thumbnail A/B (1 tuần)
```

---

## 7. Multi-Niche Architecture — cho phép mở app theo từng ngách

> **Bối cảnh:** Hiện tại app hardcode ngách tài chính (`docs/FINANCE_DNA_PROMPT.md`, prompt registry trong `src/services/ai/prompts/index.ts`). Muốn bán cho khách hàng làm ngách kinh dị, kể truyện, du lịch, công nghệ,... → cần tách "DNA ngách" ra khỏi code, biến thành **data người dùng nạp vào** (DNA prompt + 100 tiêu đề mẫu + mô tả mẫu).
>
> Mục tiêu: khi cần mở ngách mới, **không cần đụng code** — chỉ cần tạo 1 profile mới chứa DNA + sample corpus, app tự adapt.

### 7.1. Khái niệm "Niche Profile"

Một Niche Profile = **DNA ngách** + **corpus mẫu** + **schema domain-specific**. Đóng gói thành 1 package có thể import/export (JSON + assets).

**Ví dụ:**
- `niche-finance.json` (đã có sẵn ở MVP)
- `niche-horror.json` (mở thêm)
- `niche-storytelling.json` (mở thêm)
- `niche-tech-review.json` (mở thêm)

Mỗi profile chứa:

```jsonc
{
  "id": "horror",
  "version": "1.0.0",
  "name": "Kinh dị Việt",
  "description": "Kể chuyện ma, true crime hư cấu, creepypasta Việt hóa",
  "dna": {
    "systemPrompt": "...",                    // phong cách + giọng + taboo
    "systemPromptFor": {                       // theo usage_kind
      "outline": "...",                        // cách viết outline kinh dị
      "script_part": "...",                    // cách viết từng phần
      "title": "...",                          // cách brainstorm tiêu đề
      "description": "...",
      "thumbnail_concept": "..."
    },
    "voice": "creepy_whisper",                 // enum từ app
    "tone": "hồi hộp, hơi thở nặng",
    "language": "vi-VN",
    "forbiddenTopics": ["chính trị", "tôn giáo cụ thể"],
    "mustInclude": ["disclaimer giả", "ambiguous ending"]
  },
  "sampleCorpus": {
    "titles": [                                 // 100 tiêu đề mẫu
      "Căn phòng số 13 tầng 6",
      "Tiếng gõ lúc 3 giờ sáng",
      "..."
    ],
    "descriptions": [                           // 50 mô tả mẫu
      "Câu chuyện dựa trên sự kiện có thật tại...",
      "..."
    ],
    "outlines": [                               // 20 outline mẫu (optional)
      "## PHẦN 1: Setup\n- Hook:...\n- Introduce character...",
      "..."
    ],
    "scripts": [                                // 5 script full mẫu (optional)
      "...",
      "..."
    ]
  },
  "domainSchema": {                             // extension point
    "additionalFields": [
      { "key": "intensity", "label": "Mức độ rùng rợn (1-10)", "type": "slider", "default": 7 },
      { "key": "subgenre", "label": "Thể loại phụ", "type": "select",
        "options": ["ma quán", "true crime", "creepypasta", "dân gian VN"] }
    ],
    "titlePatterns": [                          // regex validate tiêu đề
      "^[A-ZÀ-ỹ].{10,80}$"                      // bắt đầu HOA, 10-80 ký tự
    ]
  },
  "ui": {
    "theme": "dark",                            // override theme mặc định
    "primaryColor": "#8B0000",
    "iconUrl": "/niches/horror/icon.png",
    "previewImages": ["/niches/horror/preview1.png", "..."]
  }
}
```

### 7.2. Refactor code để data-driven

**Nguyên tắc:** Tách "logic chung" (viết outline, sinh tiêu đề,...) ra khỏi "đặc thù tài chính". Tất cả thứ đặc thù → config trong Niche Profile.

**Trước (Phase 0-5 — hardcode):**
```ts
// src/services/ai/prompts/index.ts
export const FINANCE_DNA_PROMPT = `
Bạn là chuyên gia tài chính cá nhân với 15 năm kinh nghiệm...
LUÔN LUÔN: thêm disclaimer "Đây không phải lời khuyên đầu tư"
KHÔNG BAO GIỜ: hứa lợi nhuận cụ thể
...`;
```

**Sau (Phase 8 — data-driven):**
```ts
// src/services/niche/registry.ts
import type { NicheProfile } from './types';

export class NicheRegistry {
  private profiles = new Map<string, NicheProfile>();

  register(profile: NicheProfile) {
    this.profiles.set(profile.id, profile);
  }

  get(id: string): NicheProfile | undefined {
    return this.profiles.get(id);
  }

  list(): NicheProfile[] {
    return Array.from(this.profiles.values());
  }

  active(userId: string): NicheProfile {
    const userPreferred = this.getPreferred(userId);
    return userPreferred ?? this.profiles.get('finance')!;
  }
}

// src/services/ai/promptBuilder.ts (rewrite)
function buildSystemPrompt(brief: ContentBrief, niche: NicheProfile, usageKind: string) {
  // 1. Lấy DNA theo usage kind
  const dna = niche.dna.systemPromptFor[usageKind] ?? niche.dna.systemPrompt;

  // 2. Inject brand bible (project-specific)
  const brandBible = loadBrandBible(brief.projectId);

  // 3. Inject domain-specific fields từ brief
  const domainFields = niche.domainSchema.additionalFields
    .map(f => `${f.label}: ${brief[f.key] ?? f.default}`)
    .join('\n');

  // 4. RAG few-shot từ sample corpus
  const examples = sampleNicheExamples(niche, brief.topic, 3);

  return `
${dna}

${brandBible.toPromptSection()}

Domain-specific:
${domainFields}

Few-shot examples:
${examples.map(ex => `### Ví dụ:\n${ex}`).join('\n\n')}
`;
}
```

### 7.3. Storage & distribution Niche Profiles

**3 cách user lấy profile:**

1. **Built-in** (đóng gói sẵn trong app): `finance`, `horror`, `storytelling` — đi kèm app.
2. **Marketplace** (Phase 8.5): user mua/gắn profile từ cộng đồng (vd: "Profile kinh dị học đường của tác giả X").
3. **Custom** (Phase 8.6): user tự tạo — paste DNA prompt + paste 100 tiêu đề mẫu → app build profile.

**Lưu trữ ở đâu:**
- Built-in: bundle trong app (`src/niches/*/profile.json`).
- Custom + Marketplace: lưu trong Neon table `niche_profiles` (đa tenant).

```sql
-- Schema Neon (thêm vào Phase 6 schema)
CREATE TABLE niche_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES neon_auth.users(id) ON DELETE CASCADE,  -- null = built-in
  name TEXT NOT NULL,
  description TEXT,
  dna JSONB NOT NULL,
  sample_corpus JSONB NOT NULL,
  domain_schema JSONB NOT NULL DEFAULT '{}',
  ui_config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,           -- true = marketplace
  price_cents INT DEFAULT 0,                          -- 0 = free
  install_count INT NOT NULL DEFAULT 0,
  rating NUMERIC(3, 2),                                -- user rating
  schema_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_niche_user ON niche_profiles(user_id);
CREATE INDEX idx_niche_public_rating ON niche_profiles(is_public, rating DESC)
  WHERE is_public = true;

-- User installed profiles (many-to-many)
CREATE TABLE user_installed_niches (
  user_id UUID NOT NULL REFERENCES neon_auth.users(id) ON DELETE CASCADE,
  niche_id UUID NOT NULL REFERENCES niche_profiles(id) ON DELETE CASCADE,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT false,           -- 1 active tại 1 thời điểm
  custom_overrides JSONB NOT NULL DEFAULT '{}',       -- user tinh chỉnh DNA
  PRIMARY KEY (user_id, niche_id)
);
CREATE UNIQUE INDEX idx_user_active_niche
  ON user_installed_niches(user_id) WHERE is_active = true;

-- Project thuộc về niche nào (1 project = 1 niche)
ALTER TABLE projects ADD COLUMN niche_id UUID REFERENCES niche_profiles(id);
```

### 7.4. Multi-tenancy & Marketplace economics

**Model kinh doanh 2 lớp:**

**Lớp 1 — SaaS cho cá nhân (B2C):**
- User đăng ký → free tier 1 niche (built-in finance).
- Pro tier ($9/tháng): mở khóa tất cả built-in niches + unlimited custom.
- Creator tier ($29/tháng): đăng profile lên marketplace, nhận 70% revenue.

**Lớp 2 — White-label cho doanh nghiệp (B2B):**
- Agency mua gói white-label ($299/tháng): deploy app riêng với branding + niche của họ.
- Mỗi agency = 1 `tenant` riêng trong DB (Postgres row + RLS scope theo tenant_id).

```sql
-- Tenants (white-label deploys)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,                    -- acme.darkfrontiers.app
  custom_domain TEXT,                                -- script.acme.vn
  branding JSONB NOT NULL DEFAULT '{}',               -- logo, color, favicon
  plan TEXT NOT NULL DEFAULT 'starter',               -- 'starter' | 'pro' | 'enterprise'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User thuộc tenant nào
ALTER TABLE neon_auth.users ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- RLS scope theo tenant
CREATE POLICY projects_tenant ON projects
  USING (user_id IN (
    SELECT id FROM neon_auth.users
    WHERE tenant_id = current_setting('app.current_tenant_id')::UUID
  ));
```

### 7.5. Few-shot RAG cho từng niche

**Vấn đề:** DNA prompt dài + 100 tiêu đề mẫu → vượt token limit. Cần RAG.

**Giải pháp:**

```ts
// src/services/niche/rag.ts
import { embed } from './embeddings';

export async function buildFewShotContext(
  niche: NicheProfile,
  topic: string,
  limit: number = 3
): Promise<string> {
  // 1. Embed topic + tất cả samples
  const topicEmbedding = await embed(topic);
  const samplesWithEmbedding = await Promise.all(
    niche.sampleCorpus.titles.map(async (t, i) => ({
      text: t,
      embedding: await embed(t),
      index: i,
    }))
  );

  // 2. Cosine similarity → lấy top K
  const topK = samplesWithEmbedding
    .map(s => ({
      ...s,
      similarity: cosine(topicEmbedding, s.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return topK.map(s => s.text).join('\n');
}
```

**Embedding provider:**
- OpenAI `text-embedding-3-small` ($0.02/1M tokens, rẻ)
- Cache embeddings trong DB (`niche_sample_embeddings`) — tính 1 lần lúc install niche, dùng mãi.

```sql
CREATE TABLE niche_sample_embeddings (
  niche_id UUID NOT NULL REFERENCES niche_profiles(id) ON DELETE CASCADE,
  sample_index INT NOT NULL,
  sample_type TEXT NOT NULL,                          -- 'title' | 'description' | 'outline'
  embedding VECTOR(1536),                             -- pgvector extension
  PRIMARY KEY (niche_id, sample_type, sample_index)
);
-- Index cho similarity search
CREATE INDEX ON niche_sample_embeddings
  USING ivfflat (embedding vector_cosine_ops);
```

### 7.6. UI/UX cho multi-niche

**Switch niche:**
- Sidebar: dropdown chọn niche active
- Mỗi niche có icon + primary color → theme thay đổi
- Project mới mặc định thuộc niche đang active

**Brief form:**
- Field cố định (title, audience, style, length) — chung mọi niche
- Field dynamic từ `niche.domainSchema.additionalFields` — riêng mỗi niche
  - Finance: `lãi suất dự kiến`, `kỳ hạn`, `số vốn ban đầu`
  - Horror: `intensity (1-10)`, `subgenre`, `first-person?`
  - Storytelling: `số nhân vật chính`, `setting (thời đại)`, `twist ending?`

**Marketplace UI:**
- Grid card hiển thị preview profile
- Filter: niche category, rating, price
- Click → xem chi tiết (DNA + sample tiêu đề + rating) → Install

**Custom creator:**
- Wizard 3 bước: (1) Paste DNA prompt, (2) Paste 100 tiêu đề mẫu (textarea bulk), (3) Preview test → Save.

### 7.7. Sprint breakdown cho Phase 8

| Sprint | Thời gian | Output |
|---|---|---|
| **S8.1 — Tách DNA khỏi code** | 1 tuần | Tạo `NicheProfile` type, refactor `promptBuilder.ts` nhận `NicheProfile`, migrate finance profile ra JSON, regression test (verify script tài chính giống cũ) |
| **S8.2 — Storage + Registry** | 1 tuần | Schema `niche_profiles` + `user_installed_niches`, `NicheRegistry` class, switch active niche UI, fallback built-in |
| **S8.3 — Dynamic brief schema** | 1 tuần | Render form fields từ `domainSchema.additionalFields`, validate theo `titlePatterns`, persist vào brief JSON |
| **S8.4 — Sample corpus + RAG** | 1 tuần | pgvector setup, embed + store samples, `buildFewShotContext()` retrieval, A/B test (with/without RAG) |
| **S8.5 — Marketplace UI + economy** | 1 tuần | Marketplace page, install/uninstall flow, Stripe cho paid profiles, rating UI |
| **S8.6 — Custom profile creator** | 0.5 tuần | Wizard 3 bước (DNA + samples + preview), validation, save → user_installed_niches |
| **S8.7 — Tenants + white-label** | 0.5 tuần | `tenants` table, subdomain routing, custom branding, RLS scope |

**Tổng Phase 8: ~6 tuần**

### 7.8. Tại sao Phase 8 đặt CUỐI cùng

**Lý do:** Refactor multi-tenant khi đang build MVP dễ tạo ra over-abstraction. Cần ít nhất 1 niche (finance) chạy production ổn định + analytics data thật + ít nhất 1 ngách thứ 2 (horror) pilot → mới biết **đâu là invariant** (phải giữ trong code) và **đâu là variant** (đẩy ra config).

**Cụ thể Phase 8 dựa trên:**
- **Phase 6**: Persistence đa user (cần thiết cho marketplace nhiều user).
- **Phase 7.1 (Series + Brand bible)**: cho thấy DNA injection là pattern tốt → generalize thành NicheProfile.
- **Phase 7.7 (Feedback loop)**: ai_insights có thể share giữa các niche hoặc scope theo niche.
- **1 niche thứ 2 pilot** (sau Phase 7): chứng minh refactor đúng hướng.

### 7.9. Definition of Done cho Phase 8

- [ ] Refactor: app không còn reference trực tiếp `FINANCE_DNA_PROMPT` ở code path — tất cả qua `NicheProfile`.
- [ ] Regression: script tài chính generated từ Phase 8 chất lượng tương đương Phase 0-5 (blind test 10 script).
- [ ] Thêm được 1 niche mới (vd: horror) bằng cách paste JSON, KHÔNG sửa code TypeScript.
- [ ] Dynamic brief fields render đúng cho mỗi niche.
- [ ] RAG few-shot giảm hallucination (đo bằng: % script có claim ngoài domain giảm).
- [ ] Marketplace: 1 profile free + 1 profile trả phí flow install hoàn chỉnh.
- [ ] Custom creator: user tạo được profile mới trong ≤ 5 phút (paste → preview → save).
- [ ] White-label: deploy 1 tenant mới với branding riêng trong ≤ 30 phút.

---

## 9. Tài liệu tham khảo

- [Neon Auth docs](https://neon.tech/docs/guides/auth) — Stack Auth under the hood
- [Neon branching](https://neon.tech/docs/guides/branching) — dev DB per PR
- [YouTube Data API v3](https://developers.google.com/youtube/v3) — upload + metadata
- [YouTube Analytics API](https://developers.google.com/youtube/analytics) — CTR + retention
- [Stack Auth React SDK](https://docs.stack-auth.com/) — used by Neon Auth
- [Vercel Postgres templates](https://vercel.com/templates/data) — alternative nếu không dùng Neon

---

## 10. Kết luận

**Neon là lựa chọn đúng** cho Phase 6-7 vì:
1. **Schema relational** phù hợp với domain (projects → scripts → publish_jobs → analytics có quan hệ chặt).
2. **Neon Auth** giải quyết auth + RLS trong 1 package, không cần backend riêng.
3. **Branch DB** cho phép dev/test cách ly hoàn toàn, miễn phí.
4. **Scale-to-zero** → chi phí cực thấp cho MVP.

**Thứ tự tối ưu:**
1. Phase 6.1-6.3 (Neon + Auth + AI proxy) = **nền tảng bắt buộc** cho mọi thứ sau.
2. Phase 6.4-6.6 (Job + Observability + Migration) = **production-ready**.
3. Phase 7.1-7.3 (Series + Brand + Publish) = **content workflow cốt lõi**.
4. Phase 7.4-7.8 (Calendar + Export + Analytics + Feedback) = **studio tier**.

**Multi-Niche (Phase 8) là đòn bẩy scale:**
- Một codebase phục vụ N ngách (finance, horror, storytelling, tech-review, du lịch, giáo dục,...).
- DNA prompt + 100 tiêu đề mẫu + dynamic brief fields = **data người dùng nạp vào**, không cần đụng code.
- Marketplace cho phép creator bán profile → network effect (càng nhiều niche → càng hấp dẫn user).
- White-label cho agency → B2B revenue stream ổn định.

**Không nên làm Phase 7 trước Phase 6** — sẽ phải rewrite khi Phase 6 thay đổi auth/persistence layer.
**Không nên làm Phase 8 trước Phase 7** — refactor multi-tenant khi chưa có 1 niche chạy production ổn → over-abstraction, lãng phí effort.
