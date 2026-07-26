# plan4.md — Production Hardening + Content Studio (Phase 6 + 7) — Supabase variant

> Tách riêng Phase 6 + 7 từ `plan1.md`. Mục tiêu: biến Dark Frontiers từ "tool viết script cá nhân chạy thuần client" thành "content studio production-grade có auth, lưu trữ cloud, tích hợp YouTube và analytics feedback loop".
>
> **Stack quyết định (variant này):** Supabase (Postgres + Auth + Realtime + Storage + Edge Functions all-in-one) + YouTube Data API + YouTube Analytics API. Lý do: Supabase tích hợp 5 dịch vụ (Auth, DB, Realtime, Storage, Functions) trong 1 platform, Studio UI cực mạnh để debug data, free tier rộng (50k MAU + 1 GB storage + 200 concurrent realtime). Phù hợp khi cần ship nhanh + nhiều UI realtime (calendar drag-drop, presence) + upload file (thumbnail, audio, video).
>
> **So sánh với `plan3.md` (Neon variant):** Cùng kiến trúc, cùng scope Phase 6/7/8. Khác biệt chính ở schema syntax (Supabase dùng `auth.users` thay vì `neon_auth.users`), RLS helper (`auth.uid()` thay vì `current_setting('app.current_user_id')`), và bổ sung Edge Functions + Realtime + Storage built-in (Neon plan3 phải ghép Vercel + tự build).

---

## 0. Tổng quan kiến trúc

### Hiện tại (Phase 0-5 đã xong)
```
Browser ──(API key trong localStorage)──> OpenAI / Kyma
Browser ──(localStorage)──> Library + Usage
```

### Phase 6 + 7 target (Supabase)
```
Browser ──(JWT Supabase Auth)──> React/Vite SPA
                                    │
                                    ├──> Supabase Postgres (RLS auto)
                                    │      ├── auth.users (Supabase Auth)
                                    │      ├── projects / scripts / jobs
                                    │      ├── usage_events / app_logs
                                    │      ├── niche_profiles / user_installed_niches
                                    │      ├── publish_jobs / analytics_snapshots
                                    │      └── ai_insights
                                    │
                                    ├──> Supabase Realtime
                                    │      ├── publish_jobs table CDC → calendar drag-drop
                                    │      ├── jobs progress → live generation UI
                                    │      └── presence (ai đang edit script)
                                    │
                                    ├──> Supabase Storage
                                    │      ├── thumbnails/ (public, RLS)
                                    │      ├── brand-assets/{user_id}/logos/
                                    │      ├── audio-renders/{user_id}/podcast.mp3
                                    │      └── niche-samples/{niche_id}/preview.png
                                    │
                                    ├──> Supabase Edge Functions (Deno)
                                    │      ├── proxyAI() — gọi OpenAI/Kyma, KHÔNG lộ key
                                    │      ├── proxyYouTube() — OAuth refresh + API call
                                    │      ├── syncAnalytics() — cron daily pull
                                    │      ├── optimizePrompt() — feedback loop
                                    │      └── embedNicheSamples() — pgvector ingestion
                                    │
                                    └──> External
                                           ├── OpenAI / Kyma
                                           ├── YouTube Data API (metadata + publish)
                                           └── YouTube Analytics API (CTR/retention)
```

### Phân biệt Phase 6 vs 7

| | Phase 6 — Production Hardening | Phase 7 — Content Studio |
|---|---|---|
| **Mục tiêu** | An toàn + scale + observable | Content workflow + analytics feedback |
| **Cần Supabase?** | ✅ (DB + Auth + Edge Functions) | ✅ (thêm Realtime + Storage) |
| **Cần YouTube OAuth?** | ❌ | ✅ |
| **Cần Realtime?** | ❌ (Phase 6 polling đủ) | ✅ (calendar drag-drop, job progress) |
| **Cần Storage?** | ❌ | ✅ (thumbnail, brand logo, audio) |
| **Có analytics feedback loop?** | ❌ | ✅ |
| **Effort ước tính** | 3-4 tuần (nhanh hơn Neon vì ít ghép dịch vụ) | 6-7 tuần (nhanh hơn vì Realtime/Storage built-in) |

---

## 1. Phase 6 — Production Hardening

*(Lưu ý: Ngay trước Phase 6, chúng ta có **Phase 5.5: Supabase Revision Tracking** để lưu lịch sử sửa kịch bản dựa trên AI Feedback, bảng `script_revisions` đã được gộp chung vào Schema bên dưới).*

### 1.1. Lý do dùng Supabase (không phải Neon, Firebase, Atlas)

| Tiêu chí | Supabase | Neon | Firebase | Mongo Atlas |
|---|---|---|---|---|
| Schema | Postgres (relational) | Postgres (relational) | Firestore (NoSQL) | Document |
| Auth tích hợp | ✅ GoTrue (mature từ 2020) | ⚠️ Neon Auth (Stack Auth, GA 2025) | ✅ Firebase Auth | ❌ (cần Auth0) |
| Realtime | ✅ Postgres CDC built-in | ❌ (tự build) | ✅ Firestore listener | ⚠️ Change Streams |
| Storage | ✅ S3-compatible + RLS | ❌ (dùng S3/R2 riêng) | ✅ Firebase Storage | ⚠️ Atlas App Services |
| Edge Functions | ✅ Deno-based built-in | ❌ (dùng Vercel) | ✅ Cloud Functions | ⚠️ Atlas Functions |
| Vector (pgvector) | ✅ Built-in + dashboard | ⚠️ Tự setup | ❌ | ❌ |
| Studio UI | ⭐ Mạnh nhất (SQL editor, RLS visual, table editor) | ⚠️ Console cơ bản | ⚠️ Console riêng | ⚠️ Compass |
| Branch DB | ⚠️ Qua CLI | ✅ Tính năng cốt lõi | ❌ | ❌ |
| Vendor lock-in | ⚠️ Cao (Auth/Storage/Realtime SDK riêng) | ✅ Thấp (Postgres thuần) | ⚠️ Cao | ⚠️ Cao |
| Free tier | 50k MAU + 1 GB DB + 1 GB Storage + 200 realtime + 500k functions | 191h compute + 0.5 GB | 50k reads/day | 512 MB |

**Chốt:** Supabase thắng cho use case này vì:
1. **Realtime + Storage built-in** → calendar drag-drop, thumbnail upload không cần thêm service.
2. **Studio UI** → debug data, RLS policy, Auth user cực nhanh (click-and-edit thay vì SQL).
3. **Vector search sẵn** → Phase 8 RAG cho multi-niche không cần setup pgvector riêng.
4. **Auth mature** → GoTrue production từ 2020, không sợ bug non-track-record.
5. **Edge Functions tích hợp** → AI proxy + YouTube proxy không cần Vercel riêng.

### 1.2. Schema Supabase (Phase 6 scope)

```sql
-- Users (Supabase Auth tự quản lý qua auth schema)
-- auth.users (id UUID, email, raw_user_meta_data, created_at) — Supabase Auth tự sinh

-- Projects (workspace)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  niche TEXT,                           -- 'finance', 'tech', ... (string cho Phase 6, FK trong Phase 8)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);
CREATE INDEX idx_projects_user ON public.projects(user_id, archived_at);

-- Scripts (1 project có nhiều script)
CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brief JSONB NOT NULL,                -- ContentBrief raw
  outline TEXT,
  content TEXT,
  schema_version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'in_review', 'approved', 'published'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_scripts_project ON public.scripts(project_id, status);

-- Script Revisions (Lịch sử chỉnh sửa kịch bản theo AI Feedback - Phase 5.5)
CREATE TABLE public.script_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  old_content TEXT NOT NULL,
  new_content TEXT NOT NULL,
  applied_feedback JSONB NOT NULL,     -- Lưu lại mảng các góp ý đã chọn để sửa
  user_comment TEXT,                   -- Lời dặn dò thêm của người dùng
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_script_revisions_script ON public.script_revisions(script_id, created_at DESC);

-- Usage events (mỗi AI call = 1 row)
CREATE TABLE public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  script_id UUID REFERENCES public.scripts(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,              -- 'openai', 'kyma'
  model TEXT NOT NULL,
  prompt_tokens INT NOT NULL,
  completion_tokens INT NOT NULL,
  cost_usd NUMERIC(10, 6) NOT NULL,
  usage_kind TEXT NOT NULL,            -- 'outline', 'script_part', 'dialogue', ...
  request_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_usage_user_time ON public.usage_events(user_id, created_at DESC);
CREATE INDEX idx_usage_project ON public.usage_events(project_id, created_at DESC);

-- Jobs (long-running generation)
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,                  -- 'generate_outline', 'generate_parts', 'revise'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'cancelled'
  progress JSONB NOT NULL DEFAULT '{}',  -- { currentPart, totalParts, lastChunk }
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);
CREATE INDEX idx_jobs_user_status ON public.jobs(user_id, status, created_at DESC);

-- RLS policies (Supabase style — dùng auth.uid() helper)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- User chỉ thấy project của mình
CREATE POLICY projects_owner ON public.projects
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Script: thấy qua project (RLS chain)
CREATE POLICY scripts_owner ON public.scripts
  FOR ALL TO authenticated
  USING (project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  ))
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  ));

-- Script Revisions: thấy qua script -> project
CREATE POLICY script_revisions_owner ON public.script_revisions
  FOR ALL TO authenticated
  USING (script_id IN (
    SELECT id FROM public.scripts WHERE project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (script_id IN (
    SELECT id FROM public.scripts WHERE project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY usage_owner ON public.usage_events
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY jobs_owner ON public.jobs
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Service role bypass RLS cho Edge Functions (không dùng anon key để ghi usage)
-- Edge Functions dùng SUPABASE_SERVICE_ROLE_KEY để insert usage_events fire-and-forget.

-- Realtime: enable cho các bảng cần listener
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.publish_jobs;
```

**Khác biệt schema so với Neon plan3:**
- `auth.users` thay vì `neon_auth.users`
- `auth.uid()` thay vì `current_setting('app.current_user_id')` — Supabase tự inject session var
- RLS syntax khác (`TO authenticated` + `WITH CHECK`)
- Có thêm `ALTER PUBLICATION supabase_realtime ADD TABLE ...` để enable CDC

### 1.3. Supabase Auth

```ts
// src/services/auth/supabaseAuth.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,         // lưu session trong localStorage (JWT + refresh)
      autoRefreshToken: true,       // tự refresh khi gần hết hạn
      detectSessionInUrl: true,     // OAuth callback tự detect
    },
  }
);

// useAuth() hook cung cấp: user, signIn, signOut, session
```

**Flow:**
1. User click "Login with Google" → `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. Supabase Auth redirect → Google OAuth → callback về app
3. Supabase tự lưu JWT + refresh token trong localStorage
4. Mỗi request → Supabase client tự gắn JWT vào header
5. Postgres verify JWT qua RLS policy `auth.uid()` — **không cần backend tự verify**
6. Edge Functions dùng `SUPABASE_SERVICE_ROLE_KEY` để bypass RLS khi cần (vd: ghi usage, insert insight)

**Ưu điểm:** Auth hoàn toàn ở client + DB. Edge Function chỉ cần verify JWT qua `supabase.auth.getUser(jwt)`.

### 1.4. Backend proxy (Supabase Edge Functions — Deno)

**Tại sao cần proxy:**
- OpenAI API key KHÔNG được lộ ra browser.
- Kyma cần auth token per-org.
- Rate limit server-side.
- Ẩn cost tính toán.
- Ghi usage_events cần service role key (không lộ client).

**Endpoint (Supabase Edge Functions):**
```
POST /functions/v1/proxy-ai          → proxy OpenAI/Kyma, ghi usage_events
GET  /functions/v1/usage-summary     → tổng cost/tháng
GET  /functions/v1/usage-history     → 100 events gần nhất
POST /functions/v1/jobs-start        → tạo job row
POST /functions/v1/jobs-cancel       → cancel job
GET  /functions/v1/jobs/:id          → poll progress (hoặc dùng Realtime thay)
```

**Code skeleton:**
```ts
// supabase/functions/proxy-ai/index.ts
import { createClient } from '@supabase/supabase-js';
import { streamOpenAI } from './_providers/openai';
import { streamKyma } from './_providers/kyma';

Deno.serve(async (req) => {
  // 1. Verify JWT
  const authHeader = req.headers.get('Authorization');
  const supabaseUser = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader! } } }
  );
  const { data: { user }, error } = await supabaseUser.auth.getUser();
  if (error || !user) return new Response('Unauthorized', { status: 401 });

  // 2. Parse request
  const { provider, model, messages, usageKind } = await req.json();

  // 3. Gọi provider thật
  const apiKey = provider === 'openai'
    ? Deno.env.get('OPENAI_API_KEY')!
    : Deno.env.get('KYMA_API_KEY')!;

  const stream = provider === 'openai'
    ? await streamOpenAI(apiKey, model, messages)
    : await streamKyma(apiKey, model, messages);

  // 4. Stream response + capture usage
  const [clientStream, usage] = await wrapStreamWithUsage(stream);

  // 5. Ghi usage (fire-and-forget qua service role)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // bypass RLS
  );
  supabaseAdmin.from('usage_events').insert({
    user_id: user.id,
    provider,
    model,
    prompt_tokens: usage.prompt,
    completion_tokens: usage.completion,
    cost_usd: costOf(provider, model, usage),
    usage_kind: usageKind,
    request_id: usage.requestId,
  }).then(({ error }) => error && console.error('usage log fail:', error));

  return new Response(clientStream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
});
```

**Khác biệt với plan3 (Neon):**
- Dùng Deno runtime thay vì Node — nhanh hơn cold start (~50ms vs 500ms Neon)
- `SUPABASE_SERVICE_ROLE_KEY` bypass RLS cho admin operations (ghi usage, insert insight)
- Edge Function deploy qua `supabase functions deploy proxy-ai` — không cần Vercel CLI

### 1.5. Realtime cho job progress (bonus vs plan3)

Supabase Realtime qua Postgres CDC — push progress update không cần polling:

```ts
// src/services/jobs/realtime.ts
const channel = supabase
  .channel('job-progress')
  .on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'jobs',
      filter: `id=eq.${jobId}`,
    },
    (payload) => {
      const { status, progress, error } = payload.new;
      if (status === 'completed') {
        onComplete(payload.new);
        channel.unsubscribe();
      } else if (status === 'failed') {
        onError(error);
        channel.unsubscribe();
      } else {
        onProgress(progress);
      }
    }
  )
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
```

**Plan3 (Neon) phải polling 2s. Plan4 (Supabase) push realtime — UX tốt hơn nhiều.**

### 1.6. Observability

```ts
// src/lib/logger.ts — gửi log lên Edge Function /functions/v1/log
export const logger = {
  info: (event: string, meta: object) =>
    supabase.functions.invoke('log', {
      body: { level: 'info', event, meta, userId: getUserId(), timestamp: Date.now() },
    }),
  error: (event: string, err: Error, meta: object) =>
    supabase.functions.invoke('log', {
      body: { level: 'error', event, error: { message: err.message, stack: err.stack }, meta },
    }),
};
```

Mọi AI call, job state change, auth event → log qua Edge Function → ghi vào table `app_logs`.

```sql
CREATE TABLE public.app_logs (
  id BIGSERIAL PRIMARY KEY,
  level TEXT NOT NULL,
  event TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  meta JSONB,
  error JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_app_logs_user_time ON public.app_logs(user_id, created_at DESC);
```

### 1.7. Job persistence với Realtime

**Vấn đề hiện tại:** Generate 5 phút refresh = mất hết.

**Giải pháp:**
1. Client gọi `POST /functions/v1/jobs-start` → tạo `jobs` row (status=pending)
2. Edge Function worker đọc job → gọi AI → update `progress` JSONB → Postgres CDC broadcast
3. Client subscribe Realtime channel → update UI tức thì
4. User close tab → job vẫn chạy (worker là server-side)
5. User mở lại → subscribe lại channel → resume UI

**Queue chọn:** Postgres SKIP LOCKED + Edge Function cron trigger (không cần Redis cho MVP).

```sql
-- Worker poll job pending
SELECT * FROM public.jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;
```

```ts
// supabase/functions/job-worker/index.ts
// Trigger bằng Supabase Cron: chạy mỗi 30 giây
Deno.serve(async () => {
  const supabase = createClient(/* service role */);
  const { data: job } = await supabase.rpc('claim_next_pending_job'); // SQL function SKIP LOCKED
  if (!job) return new Response('No jobs');
  // Gọi AI, update progress, broadcast qua Realtime
  ...
});
```

### 1.8. Storage buckets setup

Supabase Storage buckets setup song song Phase 6 (dùng cho Phase 7):

```sql
-- Buckets (tạo qua Dashboard hoặc SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('thumbnails', 'thumbnails', true),
  ('brand-assets', 'brand-assets', false),
  ('audio-renders', 'audio-renders', false),
  ('niche-samples', 'niche-samples', true);

-- RLS policies cho Storage
CREATE POLICY "Users can upload thumbnails to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view public thumbnails"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'thumbnails');
```

### 1.9. Migration path từ localStorage

**Không break user hiện tại.** Plan:
1. Phase 6.1: Supabase schema + auth (chưa wire app)
2. Phase 6.2: Migration tool `src/services/migrate/localStorageToSupabase.ts`:
   - User login lần đầu → detect localStorage data → upload lên Supabase → xóa localStorage
   - Idempotent (skip nếu already migrated)
3. Phase 6.3: App đọc/ghi qua Supabase, fallback localStorage nếu chưa login

### 1.10. Sprint breakdown cho Phase 6

| Sprint | Thời gian | Output |
|---|---|---|
| **S6.1 — Supabase setup** | 2 ngày | Project Supabase + schema + RLS + Auth wired, `users`/`projects`/`scripts`/`usage_events`/`jobs` tables live |
| **S6.2 — Auth integration** | 2 ngày | Login/logout UI, OAuth Google, RLS verified qua test |
| **S6.3 — Edge Function AI proxy** | 3 ngày | `proxy-ai` function, ghi usage, stream response, rate limit per user |
| **S6.4 — Job persistence + Realtime** | 3 ngày | `jobs` table + worker cron, Realtime subscribe UI, cancel button |
| **S6.5 — Observability** | 2 ngày | Logger → Edge Function → table, basic dashboard |
| **S6.6 — Migration + cleanup** | 2 ngày | localStorage → Supabase migration tool, remove localStorage code path, full E2E test |

**Tổng Phase 6: ~3-4 tuần** (nhanh hơn Neon plan3 ~1 tuần vì Storage/Realtime built-in)

---

## 2. Phase 7 — Content Studio

### 2.1. Schema mở rộng (thêm vào Supabase)

```sql
-- Series
CREATE TABLE public.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template JSONB NOT NULL,             -- { hook, intro, body_structure, outro }
  frequency TEXT,                      -- 'weekly', 'biweekly', 'monthly'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Brand bible (1 project có 1 active)
CREATE TABLE public.brand_bibles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  voice TEXT NOT NULL,                 -- 'humorous', 'serious', 'empathetic'
  tone TEXT NOT NULL,                  -- 'như 2 người bạn café'
  primary_color TEXT,                  -- '#FFB800'
  font TEXT,
  logo_url TEXT,                       -- path trong storage bucket 'brand-assets'
  must_include TEXT[],                -- ['disclaimer đầu video', 'CTA subscribe']
  must_avoid TEXT[],                  -- ['từ crypto', 'lời hứa lợi nhuận']
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User integrations (YouTube OAuth tokens)
CREATE TABLE public.user_integrations (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,              -- 'youtube'
  encrypted_refresh_token TEXT NOT NULL,
  scopes TEXT[],
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, provider)
);

-- Publish jobs (YouTube) — Realtime enabled
CREATE TABLE public.publish_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  youtube_video_id TEXT,              -- set sau khi publish
  title TEXT NOT NULL,
  description TEXT,
  chapters JSONB,                     -- [{ time: '0:00', title: 'Intro' }]
  pinned_comment TEXT,
  thumbnail_concepts JSONB,            -- [{ concept: '...', score_estimate: 0.8 }]
  thumbnail_storage_path TEXT,        -- path trong 'thumbnails' bucket
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER PUBLICATION supabase_realtime ADD TABLE public.publish_jobs;

-- Analytics (cache từ YouTube Analytics API)
CREATE TABLE public.analytics_snapshots (
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
CREATE INDEX idx_analytics_video ON public.analytics_snapshots(youtube_video_id, fetched_at DESC);

-- AI learning (feedback loop output)
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,                  -- 'hook_pattern', 'length_sweet_spot', 'topic_ctr'
  insight TEXT NOT NULL,               -- 'Hook dạng câu hỏi có CTR cao hơn 23%'
  evidence JSONB,                     -- { sample_size: 12, p_value: 0.04, baseline: 0.05 }
  confidence NUMERIC(3, 2),            -- 0.85
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS cho tables mới
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_bibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publish_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY series_owner ON public.series
  FOR ALL TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY brand_bibles_owner ON public.brand_bibles
  FOR ALL TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY user_integrations_owner ON public.user_integrations
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY publish_jobs_owner ON public.publish_jobs
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- analytics_snapshots: đọc theo project (qua publish_jobs → scripts → projects)
CREATE POLICY analytics_owner ON public.analytics_snapshots
  FOR SELECT TO authenticated
  USING (youtube_video_id IN (
    SELECT pj.youtube_video_id FROM public.publish_jobs pj
    JOIN public.scripts s ON s.id = pj.script_id
    JOIN public.projects p ON p.id = s.project_id
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY ai_insights_owner ON public.ai_insights
  FOR ALL TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));
```

### 2.2. YouTube OAuth + API

**OAuth flow:**
1. User vào Settings → "Connect YouTube"
2. Edge Function `youtube-oauth-start` → redirect đến Google OAuth scope `youtube.upload` + `youtube.readonly` + `yt-analytics.readonly`
3. Callback → Edge Function `youtube-oauth-callback` → lưu refresh_token (encrypted bằng pgsodium) vào `user_integrations`
4. Mỗi YouTube API call dùng `getYouTubeAccessToken()` helper

```ts
// supabase/functions/youtube-proxy/index.ts
import { createClient } from '@supabase/supabase-js';
import { getYouTubeAccessToken } from './_youtubeAuth';

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!;
  const supabase = createClient(/* anon + auth header */);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { action, videoId, metadata } = await req.json();

  // 1. Lấy access token (auto refresh)
  const accessToken = await getYouTubeAccessToken(supabase, user.id);

  // 2. Switch action
  if (action === 'upload') {
    const res = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });
    return new Response(JSON.stringify(await res.json()));
  }

  // ... analytics, list videos, etc.
});
```

**Quota tracking:**
YouTube Data API free tier = 10,000 units/day. Mỗi `videos.insert` = 1,600 units. → Max ~6 publish/ngày.

**Edge Function lợi thế:** Deno deploy global (10+ regions) → latency YouTube API thấp hơn Vercel single region.

### 2.3. Calendar view với Realtime

**Data model:**
- Mỗi `publish_jobs.scheduled_at` = 1 entry trên calendar.
- Drag-drop → update `scheduled_at` → Realtime broadcast → tất cả client thấy ngay.

**UI + Realtime:**
```tsx
// src/components/CalendarView.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../services/auth/supabaseAuth';

function CalendarView({ projectId }: { projectId: string }) {
  const [publishJobs, setPublishJobs] = useState<PublishJob[]>([]);

  useEffect(() => {
    // Initial fetch
    supabase.from('publish_jobs')
      .select('*')
      .eq('project_id', projectId)
      .order('scheduled_at')
      .then(({ data }) => setPublishJobs(data ?? []));

    // Realtime subscribe
    const channel = supabase.channel('calendar-' + projectId)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'publish_jobs',
          filter: `project_id=eq.${projectId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPublishJobs(prev => [...prev, payload.new as PublishJob]);
          } else if (payload.eventType === 'UPDATE') {
            setPublishJobs(prev => prev.map(j => j.id === payload.new.id ? payload.new : j));
          } else if (payload.eventType === 'DELETE') {
            setPublishJobs(prev => prev.filter(j => j.id !== payload.old.id));
          }
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  return (
    <Calendar
      events={publishJobs}
      onEventDrop={(job, newDate) =>
        supabase.from('publish_jobs').update({ scheduled_at: newDate })
          .eq('id', job.id)
      }
      colorBy="series"
    />
  );
}
```

**Khác biệt vs plan3 (Neon):**
- Plan3 phải polling mỗi 2s → tốn request + delay
- Plan4 Realtime push tức thì → UX tốt hơn, ít code hơn

### 2.4. Brand bible enforcement

```ts
// src/services/ai/promptBuilder.ts
async function buildSystemPrompt(brief: ContentBrief, projectId: string, usageKind: string) {
  const supabase = createClient(/* anon + auth */);
  const { data: brandBible } = await supabase.from('brand_bibles')
    .select('*').eq('project_id', projectId).single();

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
    description: renderDescription(script),
    chapters: extractChapters(script),
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
    audioUrl: renderForTTS(script),       // upload lên storage bucket 'audio-renders'
    intro_outro: renderIntroOutro(script),
  }),
};
```

**Audio export** (Edge Function `tts-render`):
1. Nhận script text
2. Gọi Google Cloud TTS / OpenAI TTS
3. Upload MP3 lên Storage bucket `audio-renders/{user_id}/{script_id}.mp3`
4. Trả về public URL (signed URL nếu bucket private)

### 2.6. Analytics feedback loop

**Cron job hàng ngày (Edge Function `sync-analytics`):**
```
For each video published > 48h ago:
  1. Pull YouTube Analytics API (views, CTR, retention, subscriber_gain)
  2. Insert into analytics_snapshots
  3. Trigger Edge Function optimize-prompt()
```

```ts
// supabase/functions/optimize-prompt/index.ts
Deno.serve(async () => {
  const supabase = createClient(/* service role */);

  // Lấy N video gần nhất
  const { data: videos } = await supabase.rpc('get_recent_videos_with_ctr', { days: 90 });

  // Phân tích hook pattern
  const hookCtr = groupBy(videos, v => v.outline_first_paragraph)
    .map(g => ({ hook: g.key, avgCtr: avg(g.values.map(v => v.ctr)) }));

  // Tìm pattern đủ statistical significance
  for (const hook of hookCtr) {
    if (hook.avgCtr > baseline * 1.2 && hook.values.length >= 5) {
      await supabase.from('ai_insights').insert({
        project_id: hook.projectId,
        kind: 'hook_pattern',
        insight: `Hook dạng "${hook.hook}" có CTR cao hơn 23% (${hook.values.length} videos)`,
        evidence: { sample: hook.values.length, baseline, treatment: hook.avgCtr },
        confidence: 0.85,
      });
    }
  }
});
```

**Realtime update UI:** Insight mới → Realtime broadcast → dashboard refresh ngay.

### 2.7. Sprint breakdown cho Phase 7

| Sprint | Thời gian | Output |
|---|---|---|
| **S7.1 — Series + Brand bible** | 1 tuần | CRUD UI cho series + brand_bible, system prompt injection, post-gen validation |
| **S7.2 — YouTube OAuth + Storage** | 0.5 tuần | Settings → Connect YouTube, refresh token encrypted qua pgsodium, helper `getYouTubeAccessToken()`, thumbnail upload bucket |
| **S7.3 — YouTube publish** | 1 tuần | `publish_jobs` flow, upload video + metadata qua Edge Function, chapters, pinned comment |
| **S7.4 — Calendar + Realtime** | 0.5 tuần | Month/week view, drag-drop reschedule với Realtime CDC (không polling) |
| **S7.5 — Multi-format export** | 1.5 tuần | 5 exporter (YouTube long/short, TikTok, blog, LinkedIn, podcast), audio upload lên Storage, 10 test scripts mỗi format |
| **S7.6 — Analytics pull** | 0.5 tuần | Edge Function cron daily, fetch YouTube Analytics API, store snapshot, dashboard Realtime |
| **S7.7 — Feedback loop** | 1 tuần | `optimize-prompt` Edge Function, `ai_insights` table, prompt auto-update qua Realtime, guardrail |
| **S7.8 — Thumbnail A/B** | 0.5 tuần | Sinh 5 concept variants, upload lên Storage, A/B test framework, track winner |

**Tổng Phase 7: ~6-7 tuần** (nhanh hơn Neon plan3 ~2 tuần vì Realtime/Storage built-in)

---

## 3. Rủi ro + Mitigation

| Rủi ro | Tác động | Mitigation |
|---|---|---|
| **YouTube quota exhaustion** | 10k units/day → max 6 publish/ngày | Cache aggressively, batch analytics fetch, warn user ở 80% |
| **OAuth token revoke** | Mất quyền publish | Detect 401 → re-auth flow, clear cached data |
| **Supabase cold start** (Edge Function ~50ms Deno spin-up) | Latency nhỏ cho first request | Supabase luôn keep-warm ở regions chính, fallback Edge Function to Vercel nếu cần |
| **Realtime connection limit** (200 concurrent free) | UI freeze khi nhiều user | Pro plan tăng lên 500, hoặc dùng Realtime + Postgres NOTIFY |
| **Storage egress cost** | Truyền file nặng (video raw) tốn $$ | Chỉ lưu thumbnail + audio + logo (≤5 MB) trên Storage. Video raw up thẳng YouTube qua proxy, không qua Storage |
| **Vendor lock-in** (cao hơn Neon) | Khó migrate sang Firebase/RDS sau | Adapter layer cho Storage + Realtime: `src/services/storage/`, `src/services/realtime/` → chỉ swap implementation |
| **Analytics data delayed 24-48h** | User expect real-time | UI ghi rõ "Data có thể delay 48h", dùng ước lượng từ initial 2h |
| **Feedback loop overfit** | AI viết script generic hóa quá mức | Guardrail: confidence > 0.7, sample >= 5, manual review insight trước apply |
| **Migration data loss** (localStorage → Supabase) | User mất scripts | Backup localStorage 30 ngày sau migrate, export to JSON nút luôn available |
| **Cost Supabase** (khi nhiều user) | Pro $25/month khi >500 MB DB | Set retention 90 ngày cho usage_events + app_logs, dùng Storage lifecycle policy |
| **Phase 6 chưa xong mà làm Phase 7** | Build trên nền chưa ổn định | **Bắt buộc Phase 6 xong trước Phase 7** |

---

## 4. Cost estimate (Supabase + YouTube API + Edge Functions)

| Service | Free tier | Estimated cost (1 user active/ngày) |
|---|---|---|
| Supabase Auth | 50,000 MAU | $0 |
| Supabase Database | 500 MB | $0 |
| Supabase Storage | 1 GB + 2 GB egress | $0 |
| Supabase Realtime | 200 concurrent + 2 GB message | $0 |
| Supabase Edge Functions | 500,000 invocations | $0 |
| YouTube Data API | 10,000 units/day | $0 |
| YouTube Analytics API | 10,000 units/day | $0 |
| **Total** | | **$0 cho MVP đến 100 user** |

Sau 100 user → Supabase Pro $25/month. ~$25/month cho full studio (so với Neon plan3 ~$40/month — rẻ hơn 37%).

---

## 5. Định nghĩa Done cho Phase 6 + 7

### Phase 6 Done khi:
- [ ] User login Google qua Supabase Auth thành công.
- [ ] localStorage data migrate sang Supabase không mất mát.
- [ ] API key KHÔNG còn trong browser bundle.
- [ ] Generate 10 phút refresh tab → resume được qua Realtime.
- [ ] Usage dashboard show chính xác cost từ server-side tracking.
- [ ] Có logs cho mọi AI call (requestId, latency, status).
- [ ] Rate limit 100 calls/giờ per user hoạt động.

### Phase 7 Done khi:
- [ ] Tạo series + brand bible → AI script tuân thủ must_include/must_avoid.
- [ ] Publish YouTube qua OAuth, video lên kênh thành công.
- [ ] Calendar show scheduled jobs, drag-drop reschedule **qua Realtime (không polling)**.
- [ ] 5 format export (YouTube long/short, TikTok, blog, LinkedIn, podcast) đều cho output đúng format.
- [ ] Cron pull YouTube Analytics mỗi ngày, dashboard show CTR/retention với Realtime update.
- [ ] Sau 10 videos, feedback loop sinh được insight đầu tiên (vd: "Hook dạng câu hỏi CTR cao hơn X%").
- [ ] Insight apply vào prompt lần generate sau.
- [ ] Thumbnail A/B test framework: sinh 5 concepts, upload lên Storage, track winner.

### Phase 8 Done khi:
- [ ] (xem Section 7.9 đầy đủ)

---

## 6. Phụ thuộc & Thứ tự thực hiện

```
Phase 6.1 — Supabase setup (2 ngày)
    ↓
Phase 6.2 — Auth integration (2 ngày)
    ↓
Phase 6.3 — Edge Function AI proxy (3 ngày)
    ↓
    ├──> Phase 6.4 — Job persistence + Realtime (3 ngày)
    ├──> Phase 6.5 — Observability (2 ngày)
    ↓
Phase 6.6 — Migration + cleanup (2 ngày)
    ↓ (BẮT BUỘC xong Phase 6 trước)
Phase 7.1 — Series + Brand bible (1 tuần)
    ↓
Phase 7.2 — YouTube OAuth + Storage (0.5 tuần)
    ↓
    ├──> Phase 7.3 — Publish (1 tuần)
    ├──> Phase 7.4 — Calendar + Realtime (0.5 tuần)
    ↓
Phase 7.5 — Multi-format export (1.5 tuần)
    ↓
    ├──> Phase 7.6 — Analytics pull (0.5 tuần)
    ↓
Phase 7.7 — Feedback loop (1 tuần)
    ↓
Phase 7.8 — Thumbnail A/B (0.5 tuần)
    ↓ (BẮT BUỘC xong Phase 7 trước)
Phase 8.x — Multi-Niche refactor (5 tuần)
```

> **Phase 8** (Multi-Niche) đặt cuối cùng vì cần Phase 7 (series + brand bible + analytics) chạy ổn trên 1 niche trước, mới biết cần trừu tượng hóa cái gì.

---

## 7. Multi-Niche Architecture — cho phép mở app theo từng ngách

> **Bối cảnh:** Hiện tại app hardcode ngách tài chính (`docs/FINANCE_DNA_PROMPT.md`, prompt registry trong `src/services/ai/prompts/index.ts`). Muốn bán cho khách hàng làm ngách kinh dị, kể truyện, du lịch, công nghệ,... → cần tách "DNA ngách" ra khỏi code, biến thành **data người dùng nạp vào** (DNA prompt + 100 tiêu đề mẫu + mô tả mẫu).
>
> Mục tiêu: khi cần mở ngách mới, **không cần đụng code** — chỉ cần tạo 1 profile mới chứa DNA + sample corpus, app tự adapt.

### 7.1. Khái niệm "Niche Profile"

Một Niche Profile = **DNA ngách** + **corpus mẫu** + **schema domain-specific**. Đóng gói thành 1 package có thể import/export (JSON + assets trong Storage).

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
    "systemPrompt": "...",
    "systemPromptFor": {
      "outline": "...",
      "script_part": "...",
      "title": "...",
      "description": "...",
      "thumbnail_concept": "..."
    },
    "voice": "creepy_whisper",
    "tone": "hồi hộp, hơi thở nặng",
    "language": "vi-VN",
    "forbiddenTopics": ["chính trị", "tôn giáo cụ thể"],
    "mustInclude": ["disclaimer giả", "ambiguous ending"]
  },
  "sampleCorpus": {
    "titles": ["Căn phòng số 13 tầng 6", "Tiếng gõ lúc 3 giờ sáng", "..."],
    "descriptions": ["Câu chuyện dựa trên sự kiện có thật tại...", "..."],
    "outlines": ["## PHẦN 1: Setup\n- Hook:...\n- Introduce character...", "..."],
    "scripts": ["...", "..."]
  },
  "domainSchema": {
    "additionalFields": [
      { "key": "intensity", "label": "Mức độ rùng rợn (1-10)", "type": "slider", "default": 7 },
      { "key": "subgenre", "label": "Thể loại phụ", "type": "select",
        "options": ["ma quán", "true crime", "creepypasta", "dân gian VN"] }
    ],
    "titlePatterns": ["^[A-ZÀ-ỹ].{10,80}$"]
  },
  "ui": {
    "theme": "dark",
    "primaryColor": "#8B0000",
    "iconUrl": "niche-samples/horror/icon.png",         // path trong Storage
    "previewImages": ["niche-samples/horror/preview1.png"]
  }
}
```

### 7.2. Refactor code để data-driven

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
import { supabase } from '../auth/supabaseAuth';

export class NicheRegistry {
  private cache = new Map<string, NicheProfile>();

  async get(id: string): Promise<NicheProfile | undefined> {
    if (this.cache.has(id)) return this.cache.get(id);

    const { data, error } = await supabase.from('niche_profiles')
      .select('*').eq('id', id).single();

    if (error || !data) return undefined;
    this.cache.set(id, data as NicheProfile);
    return data as NicheProfile;
  }

  async active(userId: string): Promise<NicheProfile> {
    const { data: installed } = await supabase.from('user_installed_niches')
      .select('niche_id').eq('user_id', userId).eq('is_active', true).single();
    return (await this.get(installed?.niche_id ?? 'finance'))!;
  }
}

// src/services/ai/promptBuilder.ts (rewrite)
async function buildSystemPrompt(brief: ContentBrief, niche: NicheProfile, usageKind: string) {
  const dna = niche.dna.systemPromptFor[usageKind] ?? niche.dna.systemPrompt;
  const brandBible = await loadBrandBible(brief.projectId);
  const domainFields = niche.domainSchema.additionalFields
    .map(f => `${f.label}: ${brief[f.key] ?? f.default}`)
    .join('\n');
  const examples = await buildFewShotContext(niche, brief.topic, 3);  // dùng pgvector (7.5)

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

1. **Built-in** (đóng gói sẵn trong app): `finance`, `horror`, `storytelling` — đi kèm app, lưu ở `src/niches/*/profile.json` + bundle trong build.
2. **Marketplace** (Phase 8.5): user mua/gắn profile từ cộng đồng (vd: "Profile kinh dị học đường của tác giả X").
3. **Custom** (Phase 8.6): user tự tạo — paste DNA prompt + paste 100 tiêu đề mẫu → app build profile.

**Lưu trữ ở đâu:**
- Built-in: bundle trong app + sync 1 lần vào `niche_profiles` table khi user install.
- Custom + Marketplace: lưu trong Supabase table `niche_profiles` (đa tenant).
- Preview images, icon: Storage bucket `niche-samples` (public).

```sql
-- Schema Supabase (thêm vào Phase 6 schema)
CREATE TABLE public.niche_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- null = built-in
  name TEXT NOT NULL,
  description TEXT,
  dna JSONB NOT NULL,
  sample_corpus JSONB NOT NULL,
  domain_schema JSONB NOT NULL DEFAULT '{}',
  ui_config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  price_cents INT DEFAULT 0,
  install_count INT NOT NULL DEFAULT 0,
  rating NUMERIC(3, 2),
  schema_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_niche_user ON public.niche_profiles(user_id);
CREATE INDEX idx_niche_public_rating ON public.niche_profiles(is_public, rating DESC)
  WHERE is_public = true;

-- User installed profiles (many-to-many)
CREATE TABLE public.user_installed_niches (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  niche_id UUID NOT NULL REFERENCES public.niche_profiles(id) ON DELETE CASCADE,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT false,
  custom_overrides JSONB NOT NULL DEFAULT '{}',
  PRIMARY KEY (user_id, niche_id)
);
CREATE UNIQUE INDEX idx_user_active_niche
  ON public.user_installed_niches(user_id) WHERE is_active = true;

-- Project thuộc về niche nào
ALTER TABLE public.projects ADD COLUMN niche_id UUID REFERENCES public.niche_profiles(id);

-- RLS
ALTER TABLE public.niche_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_installed_niches ENABLE ROW LEVEL SECURITY;

-- Niche profiles: đọc nếu public HOẶC user là owner
CREATE POLICY niche_read ON public.niche_profiles
  FOR SELECT TO authenticated
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY niche_write ON public.niche_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_niches_owner ON public.user_installed_niches
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### 7.4. Multi-tenancy & Marketplace economics

**Model kinh doanh 2 lớp:**

**Lớp 1 — SaaS cho cá nhân (B2C):**
- User đăng ký → free tier 1 niche (built-in finance).
- Pro tier ($9/tháng): mở khóa tất cả built-in niches + unlimited custom.
- Creator tier ($29/tháng): đăng profile lên marketplace, nhận 70% revenue.

**Lớp 2 — White-label cho doanh nghiệp (B2B):**
- Agency mua gói white-label ($299/tháng): deploy app riêng với branding + niche của họ.
- **Supabase hỗ trợ multi-project**: mỗi agency = 1 Supabase project riêng (subdomain routing qua Cloudflare/Vercel). Tận dụng RLS scope theo `tenant_id` nếu muốn share DB.

**Cách A (multi-project — khuyến nghị cho agency):**
```ts
// Cloudflare Worker routing
if (host === 'acme.darkfrontiers.app') {
  const supabase = createClient(
    'https://acme.supabase.co',
    'acme-anon-key'
  );
}
```

**Cách B (single-project + tenant_id — cho white-label rẻ):**
```sql
-- Tenants (white-label deploys)
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  custom_domain TEXT,
  branding JSONB NOT NULL DEFAULT '{}',
  plan TEXT NOT NULL DEFAULT 'starter',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE auth.users ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- RLS scope theo tenant (mở rộng từ policy owner)
CREATE POLICY projects_tenant ON public.projects
  FOR ALL TO authenticated
  USING (user_id IN (
    SELECT id FROM auth.users
    WHERE tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
  ));
```

### 7.5. Few-shot RAG cho từng niche

**Vấn đề:** DNA prompt dài + 100 tiêu đề mẫu → vượt token limit. Cần RAG.

**Giải pháp (Supabase pgvector built-in):**

```sql
-- Extension (Supabase hỗ trợ built-in, không cần setup)
CREATE EXTENSION IF NOT EXISTS vector;

-- Bảng embeddings
CREATE TABLE public.niche_sample_embeddings (
  niche_id UUID NOT NULL REFERENCES public.niche_profiles(id) ON DELETE CASCADE,
  sample_index INT NOT NULL,
  sample_type TEXT NOT NULL,
  embedding VECTOR(1536),
  PRIMARY KEY (niche_id, sample_type, sample_index)
);
CREATE INDEX ON public.niche_sample_embeddings
  USING ivfflat (embedding vector_cosine_ops);

-- Match function
CREATE OR REPLACE FUNCTION match_niche_samples(
  query_embedding VECTOR(1536),
  match_niche_id UUID,
  match_count INT DEFAULT 3
)
RETURNS TABLE(sample_text TEXT, similarity FLOAT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE nse.sample_type
      WHEN 'title' THEN (np.sample_corpus->'titles'->>nse.sample_index)
      WHEN 'description' THEN (np.sample_corpus->'descriptions'->>nse.sample_index)
      WHEN 'outline' THEN (np.sample_corpus->'outlines'->>nse.sample_index)
    END AS sample_text,
    1 - (nse.embedding <=> query_embedding) AS similarity
  FROM public.niche_sample_embeddings nse
  JOIN public.niche_profiles np ON np.id = nse.niche_id
  WHERE nse.niche_id = match_niche_id
  ORDER BY nse.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

```ts
// supabase/functions/embed-niche-samples/index.ts
// Trigger khi user install niche → embed 1 lần, cache mãi
Deno.serve(async (req) => {
  const { nicheId } = await req.json();
  const supabase = createClient(/* service role */);

  const { data: niche } = await supabase.from('niche_profiles')
    .select('sample_corpus').eq('id', nicheId).single();

  // Embed tất cả samples qua OpenAI
  for (const [type, samples] of Object.entries(niche.sample_corpus)) {
    for (let i = 0; i < (samples as string[]).length; i++) {
      const embedding = await openai.embed((samples as string[])[i]);
      await supabase.from('niche_sample_embeddings').insert({
        niche_id: nicheId,
        sample_index: i,
        sample_type: type,
        embedding,
      });
    }
  }

  return new Response('OK');
});
```

```ts
// src/services/niche/rag.ts (client-side)
async function buildFewShotContext(nicheId: string, topic: string, limit = 3) {
  const embedding = await openai.embed(topic);
  const { data } = await supabase.rpc('match_niche_samples', {
    query_embedding: embedding,
    match_niche_id: nicheId,
    match_count: limit,
  });
  return data.map(d => d.sample_text).join('\n');
}
```

**Khác biệt vs plan3 (Neon):**
- Plan3 phải tự setup pgvector extension, viết raw SQL query
- Plan4 dùng `match_documents()`-style RPC function + Studio UI xem embeddings + Vecs.dev playground

### 7.6. UI/UX cho multi-niche

**Switch niche:**
- Sidebar: dropdown chọn niche active
- Mỗi niche có icon (từ Storage `niche-samples`) + primary color → theme thay đổi
- Project mới mặc định thuộc niche đang active

**Brief form:**
- Field cố định (title, audience, style, length) — chung mọi niche
- Field dynamic từ `niche.domainSchema.additionalFields` — riêng mỗi niche
  - Finance: `lãi suất dự kiến`, `kỳ hạn`, `số vốn ban đầu`
  - Horror: `intensity (1-10)`, `subgenre`, `first-person?`
  - Storytelling: `số nhân vật chính`, `setting (thời đại)`, `twist ending?`

**Marketplace UI:**
- Grid card hiển thị preview profile (ảnh từ Storage bucket `niche-samples`)
- Filter: niche category, rating, price
- Click → xem chi tiết (DNA + sample tiêu đề + rating) → Install

**Custom creator:**
- Wizard 3 bước: (1) Paste DNA prompt, (2) Paste 100 tiêu đề mẫu (textarea bulk), (3) Preview test → Save.
- Tự động trigger `embed-niche-samples` Edge Function sau khi save.

### 7.7. Sprint breakdown cho Phase 8

| Sprint | Thời gian | Output |
|---|---|---|
| **S8.1 — Tách DNA khỏi code** | 1 tuần | Tạo `NicheProfile` type, refactor `promptBuilder.ts` nhận `NicheProfile`, migrate finance profile ra JSON, regression test |
| **S8.2 — Storage + Registry** | 1 tuần | Schema `niche_profiles` + `user_installed_niches`, `NicheRegistry` class (dùng Supabase client), switch active niche UI, fallback built-in |
| **S8.3 — Dynamic brief schema** | 0.5 tuần | Render form fields từ `domainSchema.additionalFields`, validate theo `titlePatterns`, persist vào brief JSON |
| **S8.4 — Sample corpus + RAG (pgvector)** | 1 tuần | pgvector extension (built-in), embed + store samples qua `embed-niche-samples` Edge Function, `match_niche_samples()` RPC, A/B test |
| **S8.5 — Marketplace UI + economy** | 1 tuần | Marketplace page, install/uninstall flow, Stripe cho paid profiles, rating UI |
| **S8.6 — Custom profile creator** | 0.5 tuần | Wizard 3 bước (DNA + samples + preview), validation, save → auto-trigger embed |
| **S8.7 — Tenants + white-label** | 0.5 tuần | `tenants` table, subdomain routing qua Cloudflare, custom branding, RLS scope |

**Tổng Phase 8: ~5 tuần** (nhanh hơn Neon plan3 ~1 tuần vì Vector + Storage built-in)

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
- [ ] RAG few-shot qua `match_niche_samples()` RPC giảm hallucination (đo bằng: % script có claim ngoài domain giảm).
- [ ] Marketplace: 1 profile free + 1 profile trả phí flow install hoàn chỉnh.
- [ ] Custom creator: user tạo được profile mới trong ≤ 5 phút (paste → preview → save → auto-embed).
- [ ] White-label: deploy 1 tenant mới với branding riêng trong ≤ 30 phút.

---

## 8. Tài liệu tham khảo

- [Supabase Auth docs](https://supabase.com/docs/guides/auth) — GoTrue, JWT, OAuth
- [Supabase Realtime](https://supabase.com/docs/guides/realtime) — Postgres CDC subscription
- [Supabase Storage](https://supabase.com/docs/guides/storage) — buckets + RLS policies
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions) — Deno runtime
- [Supabase pgvector](https://supabase.com/docs/guides/ai/vector-columns) — embeddings + match functions
- [YouTube Data API v3](https://developers.google.com/youtube/v3) — upload + metadata
- [YouTube Analytics API](https://developers.google.com/youtube/analytics) — CTR + retention
- [Supabase Branching](https://supabase.com/docs/guides/platform/branching) — dev DB per PR (qua CLI)
- [Pgsodium encryption](https://supabase.com/docs/guides/database/extensions/pgsodium) — encrypt YouTube refresh_token

---

## 9. Kết luận

**Supabase là lựa chọn đúng** cho Phase 6-7 vì:
1. **All-in-one platform** — Auth + DB + Realtime + Storage + Edge Functions + pgvector → giảm ~30% effort tích hợp so với Neon plan3.
2. **Realtime built-in** — calendar drag-drop, job progress, insight notification push tức thì, không polling.
3. **Studio UI tốt nhất class** — debug data nhanh, RLS policy editor visual, Auth user manager.
4. **Auth mature** — GoTrue production từ 2020, không sợ bug mới như Neon Auth (GA 2025).
5. **pgvector tích hợp** — Phase 8 RAG few-shot không cần setup extension + viết raw SQL.
6. **Cost rẻ hơn** — $25/tháng cho full studio so với $40/tháng của Neon+Vercel.

**Thứ tự tối ưu:**
1. Phase 6.1-6.3 (Supabase + Auth + AI proxy) = **nền tảng bắt buộc** — ~2 tuần (nhanh hơn Neon).
2. Phase 6.4-6.6 (Job + Realtime + Observability + Migration) = **production-ready** — ~1 tuần.
3. Phase 7.1-7.3 (Series + Brand + Publish) = **content workflow cốt lõi**.
4. Phase 7.4-7.8 (Calendar Realtime + Export + Analytics + Feedback) = **studio tier** — Realtime + Storage giúp nhanh hơn Neon plan3 ~2 tuần.
5. **Phase 8.1-8.7 (Multi-Niche refactor + Marketplace + White-label)** = **biến thành sản phẩm đa ngách bán được**.

**Multi-Niche (Phase 8) là đòn bẩy scale:**
- Một codebase phục vụ N ngách (finance, horror, storytelling, tech-review, du lịch, giáo dục,...).
- DNA prompt + 100 tiêu đề mẫu + dynamic brief fields = **data người dùng nạp vào**, không cần đụng code.
- Marketplace cho phép creator bán profile → network effect (càng nhiều niche → càng hấp dẫn user).
- White-label cho agency → B2B revenue stream ổn định.

**Không nên làm Phase 7 trước Phase 6** — sẽ phải rewrite khi Phase 6 thay đổi auth/persistence layer.
**Không nên làm Phase 8 trước Phase 7** — refactor multi-tenant khi chưa có 1 niche chạy production ổn → over-abstraction, lãng phí effort.

**Trade-off chính so với Neon (plan3):**
- Vendor lock-in cao hơn (Auth + Storage + Realtime SDK riêng). Mitigation: adapter layer `src/services/{auth,storage,realtime}/` để swap implementation.
- Branch DB chậm hơn (qua CLI vs Neon core feature). Mitigation: dùng Supabase branching cho PR quan trọng, không yêu cầu mọi PR cần DB riêng.
