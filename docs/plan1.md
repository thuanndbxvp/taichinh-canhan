# Dark Frontiers — Phân tích vấn đề và kế hoạch refactor

> Phiên bản: 1.0  
> Ngày lập kế hoạch: 25/07/2026  
> Phạm vi: codebase `D:/Dark-Frontiers` và định hướng xây dựng app viết kịch bản YouTube Tài chính cá nhân

---

## 1. Mục tiêu của tài liệu

Tài liệu này tổng hợp toàn bộ các vấn đề đã khảo sát trong codebase Dark Frontiers, đồng thời chuyển các phát hiện đó thành kế hoạch triển khai theo từng phase.

Mục tiêu cuối cùng không chỉ là làm code dễ bảo trì hơn. App cần tiến hoá từ một công cụ `prompt → script` thành một **Finance Content Studio** có khả năng:

- Biến một brief tài chính thành kịch bản YouTube hoàn chỉnh.
- Kiểm soát nguồn dữ liệu, claim, phép tính và giả định.
- Sinh script theo cấu trúc có thể chỉnh sửa, không phụ thuộc vào Markdown tự do.
- Hỗ trợ scene, narration, visual, audio, TTS và metadata YouTube.
- Review chất lượng, độ chính xác và rủi ro trước khi export.
- Lưu version, resume workflow, retry từng bước và tái sử dụng research.
- Có kiến trúc đủ an toàn để chuyển từ app cá nhân sang production nhiều người dùng.

---

## 2. Tóm tắt codebase hiện tại

### 2.1. Kiến trúc hiện tại

Dark Frontiers hiện là một SPA sử dụng:

- React 19.
- Vite.
- TypeScript.
- `@google/genai` trong dependencies nhưng luồng chính hiện gọi các provider tương thích OpenAI/Kyma qua `fetch`.
- Tailwind CSS runtime thông qua CDN trong `index.html`.
- SheetJS/XLSX thông qua CDN.
- `localStorage` cho dữ liệu cục bộ.
- Không có backend riêng.
- Không có database nghiệp vụ.
- Không có test runner, lint script hoặc typecheck script trong `package.json`.

Build production hiện tại đã thành công. Tuy nhiên Vite cảnh báo bundle chính lớn hơn ngưỡng khuyến nghị:

```text
dist/assets/index-Cvg4MG2Z.js 630.58 kB
```

### 2.2. Các khu vực chính

#### `App.tsx`

Đang là trung tâm của gần như toàn bộ ứng dụng:

- State của content brief.
- State của script và outline.
- Điều phối gọi AI.
- Sinh script theo phần.
- Revision.
- Tách dialogue.
- Đếm word count.
- Sinh image/video prompt.
- Tóm tắt scene.
- Chấm điểm script.
- Lưu library.
- Lưu saved ideas.
- Quản lý API keys.
- Theme và finance mode.
- Import/export.
- Modal state.
- Notification state.

File hiện có khoảng 867 dòng.

#### `services/aiService.ts`

Đang đồng thời chịu trách nhiệm:

- Chọn provider.
- Lấy API key.
- Gọi HTTP API.
- Xử lý error.
- Ghép prompt.
- Parse JSON từ output AI.
- Tạo outline/script/scene/prompt.
- Chấm điểm.
- Đọc `localStorage` cho OpenAI base URL.

#### `services/apiKeyManager.ts`

Có logic:

- Danh sách key theo provider.
- Active key.
- Queue request.
- Release key.
- Đẩy key lỗi xuống cuối danh sách.

Tuy nhiên cơ chế report lỗi chưa được nối đầy đủ vào luồng gọi API.

#### `components/`

Có nhiều feature UI đã hình thành:

- Control panel.
- Output display.
- Side tools.
- Library.
- Saved ideas.
- API key modal.
- Dialogue modal.
- Score modal.
- Summarize modal.
- Visual prompt modal.
- File uploader.

---

## 3. Các điểm mạnh cần giữ lại

Không nên rewrite toàn bộ. Các giá trị hiện tại cần được bảo vệ trong quá trình refactor:

### 3.1. Workflow content đã tương đối đầy đủ

App hiện đã hỗ trợ:

1. Nhập ý tưởng.
2. Brainstorm bằng AI.
3. Gợi ý topic.
4. Gợi ý keyword SEO.
5. Gợi ý style.
6. Tạo outline.
7. Tạo script ngắn hoặc script dài theo từng phần.
8. Auto-continue.
9. Dừng quá trình sinh.
10. Revision script.
11. Tách lời thoại sạch.
12. Đếm word count.
13. Chấm điểm script.
14. Tạo image prompt.
15. Tạo video prompt.
16. Tóm tắt thành scene.
17. Lưu library.
18. Import/export script.

### 3.2. Finance DNA đã có bản sắc

Các nguyên tắc nội dung đang hướng tới là đúng và nên được giữ trong product profile tài chính:

- Nói thẳng, thực dụng và dựa trên logic.
- Bóc tách chi phí ẩn.
- Tính chi phí cơ hội.
- Dùng tâm lý học hành vi.
- Dùng micro-storytelling.
- Chủ động bẻ gãy phản biện.
- Dùng ẩn dụ vật lý.
- Kết thúc bằng bài học hoặc thành ngữ phù hợp.
- Đưa ra giải pháp từng bước.
- Có CTA thực tế.

### 3.3. UI đã có giá trị sử dụng

Giao diện hiện tại đã có mô hình ba vùng hợp lý:

- Bên trái: nhập brief và tuỳ chọn.
- Trung tâm: output script.
- Bên phải: tool, score, library, scene và export.

Refactor nên ưu tiên giữ interaction model này trong các phase đầu để giảm rủi ro.

---

# 4. Toàn bộ vấn đề đã khảo sát

## 4.1. Vấn đề kiến trúc

### A. `App.tsx` là một God Component

`App.tsx` vừa là page component, state store, workflow engine, persistence layer và service coordinator.

Hệ quả:

- Khó đọc và khó định vị logic.
- Mỗi feature mới làm file phình thêm.
- Khó viết unit test.
- Khó mock AI service.
- Khó thay đổi cách lưu trữ.
- Dễ xảy ra lỗi do nhiều state liên kết ngầm.
- UI component nhận quá nhiều props.

`ControlPanel` hiện nhận hơn 50 props. Đây là tín hiệu rõ ràng rằng state cần được nhóm theo feature.

### B. Chưa có ranh giới domain

Script hiện chỉ được coi là một chuỗi Markdown:

- Không có `Episode`.
- Không có `ContentBrief` rõ ràng.
- Không có `ResearchPack`.
- Không có `SourceReference`.
- Không có `FinanceClaim`.
- Không có `Calculation`.
- Không có `ReviewReport` dạng cấu trúc.
- Không có `AssetPack`.
- Không có version history đáng tin cậy.

### C. Service layer không tách trách nhiệm

`aiService.ts` đang làm quá nhiều việc. Provider, prompt, parser, retry, domain validation và error mapping cần tách thành các module riêng.

### D. Không có abstraction cho persistence

Component gọi trực tiếp:

```text
localStorage.getItem(...)
localStorage.setItem(...)
```

Nếu chuyển sang IndexedDB/backend sẽ phải sửa nhiều component và handler cùng lúc.

### E. Chưa có state machine cho workflow

Sinh script theo từng phần hiện dùng nhiều state React, `setTimeout` và `useRef`. Đây không phải một job model có thể resume, retry hoặc audit.

---

## 4.2. Vấn đề định vị sản phẩm và domain

### A. Finance mode còn sót logic của Dark Frontiers cũ

Khi bật finance mode, app vẫn set các giá trị không phù hợp:

- `Ominous`.
- `Cinematic Horror`.
- Theme và copy liên quan đến Dark Frontiers cũ.
- Placeholder SpaceX/du hành vũ trụ.
- Label “chọn chủ đề kinh dị dã sử”.

Đây là lỗi nghiệp vụ, không chỉ là lỗi text.

### B. `isFinanceMode` đang được dùng như một toggle theme

Finance mode hiện vừa thay đổi:

- Theme.
- Tone.
- Style.
- Ngôn ngữ.
- Word count.
- Duration.
- Formatting.

Nên chuyển từ boolean sang `ContentProfile` hoặc `ChannelProfile` có cấu trúc rõ ràng.

### C. Brand name không thống nhất

Trong code và tài liệu xuất hiện nhiều tên khác nhau:

- `Chú Que Tài Chính`.
- `Chú Béo Tài Chính`.
- `Dark Frontiers AI`.
- `Youtube Script Generator`.

Cần quyết định một brand name chính, sau đó đưa vào cấu hình profile thay vì hard-code rải rác.

### D. Tài liệu prompt và prompt thực tế bị lệch

`docs/System-prompt.md` và `FINANCE_DNA` trong `services/aiService.ts` có khác biệt về:

- Brand name.
- Số lượng quy tắc.
- Cấu trúc script.
- Cách viết disclaimer.
- Mức độ yêu cầu micro-storytelling.

Cần có một nguồn sự thật duy nhất và version prompt rõ ràng.

---

## 4.3. Vấn đề AI integration

### A. Prompt được ghép tự do trong từng function

Mỗi function tự nối các template string riêng. Điều này dẫn đến:

- Inconsistent output giữa full generation và part generation.
- Khó kiểm soát policy.
- Khó version prompt.
- Khó A/B test prompt.
- Khó biết model nào đang dùng policy nào.

### B. AI output chưa có contract chặt

Một số function trả string tự do, một số function parse JSON bằng regex rồi `JSON.parse` trực tiếp.

`cleanJsonResponse` chỉ cố gắng tìm dấu `[` hoặc `{`. Nó không bảo đảm:

- Đúng schema.
- Đúng kiểu dữ liệu.
- Có đủ field.
- Không có field thừa nguy hiểm.
- Nội dung JSON hợp lệ trong mọi tình huống.

### C. Không có schema validation

Các output nên có schema rõ ràng:

- Topic suggestions.
- Scene summary.
- Visual prompt.
- Review report.
- Dialogue extraction.
- Style suggestion.

Nếu parse lỗi, app nên có retry có hướng dẫn thay vì chỉ báo lỗi chung.

### D. Error handling còn chung chung

Nhiều handler trong `App.tsx` biến mọi lỗi thành một message đơn giản như:

```text
Lỗi tạo gợi ý.
Lỗi gợi ý từ khóa.
Lỗi đọc file ý tưởng.
```

Người dùng không biết:

- Provider nào lỗi.
- Model nào lỗi.
- Có bị rate limit không.
- Có hết quota không.
- Có thể retry không.
- Key nào bị lỗi.
- Request có đang bị timeout không.

### E. Chưa có timeout, retry và cancellation đầy đủ

Stop generation hiện chỉ ngăn nối kết quả sau khi request xong. Nó chưa chắc chắn huỷ network request đang chạy.

### F. Không kiểm soát chi phí AI

Chưa có:

- Token usage.
- Ước tính chi phí.
- Chi phí theo provider/model.
- Cảnh báo khi bulk generation tốn nhiều request.
- Hạn mức theo episode.

---

## 4.4. Vấn đề API key và bảo mật

### A. Raw API key lưu trong `localStorage`

Đây là thiết kế chỉ phù hợp với prototype cá nhân. Nếu deploy production nhiều người dùng, key có thể bị đọc bởi:

- XSS.
- Extension độc hại.
- Máy dùng chung.
- Backup browser.
- DevTools hoặc script chạy trong origin.

### B. Browser gọi trực tiếp provider

Luồng hiện tại là:

```text
Browser → Kyma/OpenAI-compatible provider
```

Production nên chuyển thành:

```text
Browser → Backend API → Provider adapter → AI provider
```

### C. Key rotation chưa nối hoàn chỉnh

`ApiKeyManager` có `reportError`, nhưng luồng request hiện tại chưa phân loại lỗi và chưa gọi report theo từng loại lỗi.

### D. Không có credential lifecycle

Chưa có:

- Disable key.
- Cooldown key.
- Key health status.
- Last used timestamp.
- Error count.
- Quota status.
- Provider fallback.

### E. Base URL OpenAI-compatible chưa được kiểm soát

Người dùng có thể nhập custom base URL. Cần có:

- Validate URL.
- Chặn scheme không an toàn.
- Hiển thị cảnh báo dữ liệu sẽ được gửi tới endpoint nào.
- Không gửi dữ liệu nhạy cảm nếu endpoint chưa được tin cậy.

---

## 4.5. Vấn đề dữ liệu và persistence

### A. `localStorage` không phù hợp với script lớn

Script dài, cache scene, prompt và library đều có thể nhanh chóng làm dữ liệu lớn.

### B. Cache không có version/key ổn định

Visual prompt cache hiện dựa nhiều vào nội dung section dạng string. Khi script sửa một chút, cache có thể không còn match.

Nên dùng:

- `documentId`.
- `documentVersion`.
- `sceneId`.
- `contentHash`.
- `provider`.
- `model`.
- `promptVersion`.

### C. Library save có thể lưu snapshot chưa đầy đủ

`handleSaveToLibrary` chỉ lưu title, outline và script. Các dữ liệu liên quan như:

- Prompt.
- Dialogue.
- Review.
- Scene summary.
- Visual cache.
- Provider/model.
- Revision history.

chưa được gắn đầy đủ vào một document version.

### D. Import/export Library chưa hoàn thiện

`LibraryModal` có props `onExport` và `onImport`, nhưng trong `App.tsx` đang truyền handler rỗng:

```tsx
onExport={() => {} }
 onImport={() => {} }
```

Đây là tính năng hiển thị có nhưng chưa hoàn tất nghiệp vụ.

### E. Không có migration schema

Khi type dữ liệu thay đổi, app chưa có:

- `schemaVersion`.
- Migration function.
- Fallback khi dữ liệu cũ hỏng.
- Backup trước migration.

---

## 4.6. Vấn đề parsing và output

### A. Nhiều parser cho cùng một script

Các parser khác nhau đang xuất hiện ở:

- `App.tsx`.
- `OutputDisplay.tsx`.
- Dialogue extraction.
- Excel export.
- Outline segment parsing.
- Visual prompt generation.

Mỗi parser dùng regex hơi khác nhau.

### B. UI phụ thuộc vào format Markdown AI

Nếu model trả:

- `## PHẦN 1`.
- `### PHẦN 1`.
- `**## PHẦN 1**`.
- `# Part 1`.

thì mỗi feature có thể xử lý khác nhau.

### C. Tách TTS bằng regex có rủi ro

Các pattern loại bỏ `Scene`, `Visual`, `Audio`, `Voice` và Markdown có thể vô tình xoá câu thoại thật nếu câu đó có pattern tương tự.

### D. Không có canonical representation

Cần một representation chuẩn của script. Markdown, TTS text, Excel và visual prompt chỉ nên là các output format được render từ canonical document.

---

## 4.7. Vấn đề workflow và concurrency

### A. Sequential generation dùng closure state

`handleGenerateNextPart` phụ thuộc vào nhiều state trong dependency array. Với request dài và auto-continue, có rủi ro dùng state cũ.

### B. `setTimeout` không phải job scheduler

Nếu tab chuyển trạng thái, component unmount hoặc người dùng đổi settings, callback có thể chạy với context không còn phù hợp.

### C. Bulk visual prompt chạy tuần tự

Ưu điểm là tránh quá tải API, nhưng:

- Chậm.
- Không có retry từng section có cấu trúc.
- Không có resume sau refresh.
- Không có progress chi tiết.
- Không có concurrency limit cấu hình được.

### D. Không có idempotency

Người dùng có thể bấm lại và tạo trùng request. Cần `jobId`, `stepId` và idempotency key.

### E. Không có history

Revision hiện chỉ tăng `revisionCount`, chưa lưu diff hoặc các bản cũ.

---

## 4.8. Vấn đề chất lượng dự án và frontend

### A. Thiếu kiểm tra tự động

`package.json` hiện chưa có:

- `typecheck`.
- `test`.
- `lint`.
- `format`.

### B. Bundle lớn

Bundle chính khoảng 630 kB sau minification. Cần:

- Lazy-load modal.
- Code splitting.
- Đưa XLSX thành import động.
- Xem lại CDN runtime.
- Tách feature ít dùng.

### C. Phụ thuộc CDN trong `index.html`

Tailwind runtime, XLSX CDN và import map làm runtime phụ thuộc vào mạng bên ngoài. Cần cân nhắc đưa dependencies vào build pipeline.

### D. Type safety chưa đủ

Một số nơi dùng `any`, đặc biệt:

- AI API response.
- Model list response.
- `reviseScript` params.
- Global XLSX.

### E. README chưa phản ánh sản phẩm

README vẫn là template AI Studio và chưa mô tả:

- Dark Frontiers là gì.
- Luồng sử dụng finance.
- Cảnh báo API key.
- Cấu trúc app.
- Cách backup/import.
- Roadmap.

---

# 5. Mục tiêu sản phẩm sau refactor

## 5.1. Định vị

Dark Frontiers nên trở thành:

> Công cụ sản xuất nội dung YouTube Tài chính cá nhân có cấu trúc, có kiểm chứng và sẵn sàng cho voice-over, visual production và publish.

## 5.2. Workflow mục tiêu

```text
Content Brief
    ↓
Research Pack
    ↓
Claims & Calculations
    ↓
Title / Hook Options
    ↓
Outline
    ↓
Scene Draft
    ↓
Fact-check / Math-check / Risk-check
    ↓
Retention Review
    ↓
Dialogue / TTS / Visual / B-roll
    ↓
YouTube Metadata
    ↓
Export / Publish
```

## 5.3. Output package mục tiêu

Một episode hoàn chỉnh nên có:

- Brief.
- 3–5 title options.
- Hook options.
- Thumbnail angle.
- Outline.
- Full narration.
- Scene breakdown.
- Visual direction.
- Image prompt.
- Video prompt.
- TTS-clean dialogue.
- B-roll checklist.
- Disclaimer.
- SEO keywords.
- Description.
- Chapters.
- Pinned comment.
- Review report.
- Research sources.
- Calculation sheet.
- Version history.

---

# 6. Domain model mục tiêu

## 6.1. `ChannelProfile`

```ts
interface ChannelProfile {
  id: string;
  name: string;
  contentProfile: 'personal-finance';
  brandName: string;
  language: string;
  defaultAudience: string;
  defaultTone: string;
  defaultStyle: string;
  brandRules: BrandRule[];
}
```

## 6.2. `ContentBrief`

```ts
interface ContentBrief {
  topic: string;
  audience: string;
  market: string;
  language: string;
  objective: 'education' | 'comparison' | 'warning' | 'story';
  targetDurationSeconds: number;
  keywords: string[];
  angle: string;
  cta?: string;
}
```

## 6.3. `ResearchPack`

```ts
interface ResearchPack {
  id: string;
  sources: SourceReference[];
  claims: FinanceClaim[];
  createdAt: number;
  updatedAt: number;
}
```

## 6.4. `SourceReference`

```ts
interface SourceReference {
  id: string;
  title: string;
  url?: string;
  publisher?: string;
  publishedAt?: string;
  accessedAt: string;
  excerpt?: string;
  reliability: 'high' | 'medium' | 'low' | 'unknown';
}
```

## 6.5. `FinanceClaim`

```ts
interface FinanceClaim {
  id: string;
  text: string;
  sourceIds: string[];
  dataType: 'verified-data' | 'user-input' | 'illustrative-example' | 'assumption' | 'unknown';
  status: 'verified' | 'needs-review' | 'unsupported' | 'outdated';
  risk: 'low' | 'medium' | 'high';
}
```

## 6.6. `Calculation`

```ts
interface Calculation {
  id: string;
  label: string;
  inputs: Record<string, number>;
  formula: string;
  assumptions: string[];
  result: number;
  unit: string;
  scenario: 'low' | 'base' | 'high';
}
```

## 6.7. `ScriptDocument`

```ts
interface ScriptDocument {
  id: string;
  version: number;
  title: string;
  profileId: string;
  brief: ContentBrief;
  sections: ScriptSection[];
  researchPackId?: string;
  calculationIds: string[];
  reviewReport?: ReviewReport;
  status: ScriptStatus;
  createdAt: number;
  updatedAt: number;
}
```

## 6.8. `ScriptSection` và `ScriptScene`

```ts
interface ScriptSection {
  id: string;
  order: number;
  type: 'hook' | 'context' | 'analysis' | 'solution' | 'takeaway' | 'cta';
  title: string;
  scenes: ScriptScene[];
}

interface ScriptScene {
  id: string;
  order: number;
  narration: string;
  visualNotes: string[];
  audioNotes: string[];
  onScreenText?: string;
  durationSeconds?: number;
  claimIds: string[];
  calculationIds: string[];
  assets?: AssetPack;
}
```

## 6.9. `ReviewReport`

```ts
interface ReviewReport {
  overallScore: number;
  retentionScore: number;
  clarityScore: number;
  factualRiskScore: number;
  mathScore: number;
  brandScore: number;
  blockingIssues: ReviewIssue[];
  issues: ReviewIssue[];
  recommendedFixes: string[];
  createdAt: number;
}
```

---

# 7. Kiến trúc mục tiêu

## 7.1. Cấu trúc thư mục đề xuất

```text
src/
  app/
    App.tsx
    routes.ts

  domain/
    brief/
    research/
    script/
    review/
    assets/
    settings/

  features/
    workspace/
    generation/
    ideas/
    research/
    script-editor/
    review/
    scenes/
    library/
    settings/

  services/
    ai/
      aiGateway.ts
      providerTypes.ts
      kymaProvider.ts
      openAiCompatibleProvider.ts
      retryPolicy.ts
      responseParser.ts
      schemas.ts
    prompts/
      promptRegistry.ts
      financeScriptPrompt.ts
      financeOutlinePrompt.ts
      financeReviewPrompt.ts
      scenePrompt.ts
    repositories/
      scriptRepository.ts
      settingsRepository.ts
      localStorageRepository.ts
      indexedDbRepository.ts
    export/
      txtExporter.ts
      xlsxExporter.ts
      jsonExporter.ts

  shared/
    parsing/
    validation/
    errors/
    ids/
    formatting/
```

## 7.2. Luồng phụ thuộc

```text
UI components
    ↓
Feature hooks / use cases
    ↓
Domain services
    ↓
Repositories + AI gateway
    ↓
External providers / IndexedDB / backend
```

UI không nên gọi trực tiếp `localStorage`, `fetch` provider hoặc parse output AI.

---

# 8. Kế hoạch thực hiện theo phase

## Phase 0 — Ổn định và làm sạch nghiệp vụ

### Mục tiêu

Tạo baseline an toàn trước khi refactor lớn. Không thay đổi kiến trúc chính, nhưng sửa các lỗi định vị, lỗi copy và lỗi dễ gây hiểu nhầm cho người dùng.

### Phụ thuộc

Không phụ thuộc phase nào.

### Phạm vi công việc

#### 0.1. Chuẩn hoá Finance mode

- Thay `isFinanceMode` bằng tên rõ hơn ở mức tối thiểu, hoặc tạo mapping profile mà chưa cần di chuyển toàn bộ state.
- Xoá `Ominous` khỏi finance default.
- Xoá `Cinematic Horror` khỏi finance default.
- Đặt ngôn ngữ mặc định là Tiếng Việt.
- Sửa word count/duration phù hợp với YouTube finance.
- Sửa label “kinh dị dã sử”.
- Sửa placeholder SpaceX và các copy còn sót.

#### 0.2. Chốt brand identity

- Quyết định một brand name.
- Đồng bộ `FINANCE_DNA`.
- Đồng bộ `docs/System-prompt.md`.
- Đồng bộ title trong `index.html`.
- Đồng bộ header và output copy.

#### 0.3. Thêm kiểm tra dự án

Thêm các script tối thiểu:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "lint": "eslint ."
}
```

Nếu chưa muốn cài Vitest/ESLint ngay, có thể triển khai `typecheck` trước, sau đó thêm test và lint trong Phase 1.

#### 0.4. Chuẩn hoá error cơ bản

- Tạo error type chung.
- Hiển thị provider/model/action.
- Phân biệt lỗi thiếu key, timeout, network, quota và parse.
- Không nuốt lỗi bằng message quá chung.

#### 0.5. Hoàn tất Library import/export

- Implement export toàn bộ library thành JSON.
- Implement import JSON.
- Thêm `schemaVersion`.
- Validate file trước khi import.
- Backup dữ liệu hiện tại trước khi import.

#### 0.6. Gom parser tạm thời

- Tạo một module parser Markdown dùng chung.
- Thay các regex trùng lặp trong `App.tsx` và `OutputDisplay.tsx`.
- Giữ output cũ để không phá UI.

### Deliverables

- Finance mode không còn logic horror/space.
- Brand name thống nhất.
- `typecheck` chạy được.
- Library import/export hoạt động.
- Parser dùng chung bước đầu.
- Error có ngữ cảnh tốt hơn.

### Definition of Done

- `npm run build` pass.
- `npm run typecheck` pass.
- Bật/tắt finance mode không tạo style sai.
- Export library rồi import lại không mất title, outline và script.
- Import file không hợp lệ không làm crash app.
- Các copy cũ được tìm và xử lý hết.

### Rủi ro

- Có thể phát hiện nhiều dữ liệu cũ trong localStorage.
- Sửa type `Style` có thể ảnh hưởng component cũ.
- Cần giữ backward compatibility với library đã lưu.

---

## Phase 1 — Tách state và orchestration khỏi `App.tsx`

### Mục tiêu

Giảm trách nhiệm của `App.tsx` nhưng chưa thay đổi sâu domain model. Tách logic theo feature để code dễ test và làm nền cho các phase sau.

### Phụ thuộc

Phase 0 hoàn thành.

### Phạm vi công việc

#### 1.1. Tạo workspace state

Tạo `useScriptWorkspace` quản lý:

- Title.
- Outline.
- Target audience.
- Style.
- Keywords.
- Formatting.
- Script type.
- Duration/word count.
- Active script.
- Active profile.

#### 1.2. Tạo generation workflow hook

Tạo `useGenerationWorkflow` quản lý:

- Generate outline.
- Generate script.
- Generate từng part.
- Auto-continue.
- Stop.
- Retry.
- Progress.
- Error.

#### 1.3. Tạo hooks riêng

- `useIdeaWorkflow`.
- `useDialogueWorkflow`.
- `useSceneWorkflow`.
- `useReviewWorkflow`.
- `useLibrary`.
- `useAiSettings`.

#### 1.4. Giảm props của component

Thay vì truyền hơn 50 props, có thể truyền các object theo nhóm:

```ts
interface WorkspaceActions {
  setBrief: (brief: ContentBrief) => void;
  generate: () => Promise<void>;
  revise: (instruction: string) => Promise<void>;
}
```

Hoặc cho feature component gọi hook trực tiếp nếu kiến trúc cho phép.

#### 1.5. Tách modal state

Tạo modal manager hoặc feature-level state để `App.tsx` không phải quản lý toàn bộ `isXModalOpen`.

### Deliverables

- `App.tsx` chủ yếu compose layout.
- Các workflow có hook riêng.
- Không thay đổi hành vi chính của UI.
- Có thể test từng workflow độc lập.

### Definition of Done

- `App.tsx` giảm đáng kể số lượng state và handler.
- Không còn logic AI request trực tiếp trong component.
- Có test cho ít nhất generation workflow và library workflow.
- Build và typecheck pass.
- Sequential generation vẫn hoạt động với auto-next và stop.

### Rủi ro

- Dependency array của callback có thể thay đổi hành vi.
- Cần tránh di chuyển quá nhiều logic cùng lúc.
- Nên refactor theo từng feature nhỏ, build sau mỗi bước.

---

## Phase 2 — Tách AI gateway, prompt registry và response schema

### Mục tiêu

Tạo một lớp AI integration có thể thay provider, validate output, retry và theo dõi lỗi mà không làm UI biết chi tiết provider.

### Phụ thuộc

Phase 1 nên hoàn thành phần generation hook trước.

### Phạm vi công việc

#### 2.1. Tạo `AiGateway`

```ts
interface AiRequest {
  provider: AiProvider;
  model: string;
  messages: AiMessage[];
  temperature?: number;
  responseFormat?: 'text' | 'json';
  signal?: AbortSignal;
}

interface AiResponse<T = unknown> {
  data: T;
  provider: AiProvider;
  model: string;
  requestId?: string;
  usage?: TokenUsage;
}
```

#### 2.2. Tách provider adapter

- `KymaProvider`.
- `OpenAiCompatibleProvider`.
- Interface provider chung.
- Chuẩn hoá response.
- Chuẩn hoá error.

#### 2.3. Tạo prompt registry

Các prompt cần version:

- `finance-topic-v1`.
- `finance-outline-v1`.
- `finance-script-v1`.
- `finance-script-part-v1`.
- `finance-revision-v1`.
- `finance-dialogue-v1`.
- `finance-scene-v1`.
- `finance-review-v1`.
- `finance-metadata-v1`.

#### 2.4. Tạo schema validation

Validate các output:

- Topic suggestion.
- Style suggestion.
- Dialogue extraction.
- Scene summary.
- Visual prompt.
- Review report.

#### 2.5. Retry/timeout/cancellation

- Timeout theo request.
- Retry có giới hạn.
- Exponential backoff.
- Không retry lỗi invalid request.
- Abort signal từ UI.
- Request ID.

#### 2.6. Chuẩn hoá provider error

```ts
type ProviderErrorKind =
  | 'invalid-key'
  | 'rate-limited'
  | 'quota-exceeded'
  | 'model-unavailable'
  | 'timeout'
  | 'network'
  | 'invalid-response'
  | 'unknown';
```

### Deliverables

- UI gọi use case, không gọi provider trực tiếp.
- Prompt có version.
- JSON AI được validate.
- Error có loại và khả năng retry.
- Có usage metadata nếu provider trả về.

### Definition of Done

- Test mock provider pass.
- Response sai schema được báo lỗi rõ.
- Request timeout không treo UI.
- Abort request hoạt động.
- Retry không tạo request vô hạn.
- Provider có thể thay bằng mock trong test.

### Rủi ro

- Các model khác nhau có format response khác nhau.
- JSON output có thể vẫn chứa Markdown fence.
- Cần giữ fallback cho model yếu trong giai đoạn chuyển tiếp.

---

## Phase 3 — Tách persistence và chuyển sang document storage

### Mục tiêu

Không để component phụ thuộc trực tiếp vào `localStorage`, đồng thời chuẩn bị lưu ScriptDocument, cache và version lớn hơn.

### Phụ thuộc

Phase 1 hoàn thành. Phase 2 nên hoàn thành để xác định output model.

### Phạm vi công việc

#### 3.1. Tạo repository interface

```ts
interface ScriptRepository {
  list(): Promise<ScriptDocument[]>;
  get(id: string): Promise<ScriptDocument | null>;
  save(document: ScriptDocument): Promise<void>;
  delete(id: string): Promise<void>;
}

interface SettingsRepository {
  get(): Promise<AppSettings>;
  save(settings: AppSettings): Promise<void>;
}
```

#### 3.2. Adapter localStorage

Đầu tiên tạo:

- `LocalStorageScriptRepository`.
- `LocalStorageSettingsRepository`.

Mục tiêu là tách interface trước khi thay backend.

#### 3.3. Chuyển sang IndexedDB

Sau khi adapter hoạt động, tạo:

- `IndexedDbScriptRepository`.
- `IndexedDbAssetRepository`.
- `IndexedDbResearchRepository`.

#### 3.4. Migration

- Thêm `schemaVersion`.
- Migration từ `LibraryItem` cũ sang `ScriptDocument`.
- Backup trước migration.
- Fallback nếu dữ liệu không hợp lệ.
- Hiển thị cảnh báo migration nếu cần.

#### 3.5. Cache key ổn định

Cache cần gắn với:

- `documentId`.
- `documentVersion`.
- `sceneId`.
- `provider`.
- `model`.
- `promptVersion`.
- `contentHash`.

### Deliverables

- Component không gọi `localStorage` trực tiếp.
- Library dùng repository.
- Dữ liệu có schema version.
- Script lớn có thể lưu trong IndexedDB.
- Cache không phụ thuộc vào section string không ổn định.

### Definition of Done

- Tạo, load, update, delete document qua repository.
- Refresh trang không mất dữ liệu.
- Migration dữ liệu cũ thành công.
- Import/export JSON có version.
- Test repository pass.

### Rủi ro

- Dữ liệu cũ có thể không cùng format.
- IndexedDB có xử lý async khác localStorage.
- Cần tránh migration làm mất dữ liệu người dùng.

---

## Phase 4 — Đưa ScriptDocument và domain tài chính vào sản phẩm

### Mục tiêu

Chuyển từ Markdown blob sang tài liệu có cấu trúc, đồng thời xây trust layer cho nội dung tài chính.

### Phụ thuộc

Phase 2 và Phase 3.

### Phạm vi công việc

#### 4.1. Content Brief có cấu trúc

Bắt buộc hoặc khuyến nghị các field:

- Chủ đề.
- Đối tượng.
- Quốc gia/thị trường.
- Ngôn ngữ.
- Mục tiêu video.
- Thời lượng.
- Góc nhìn.
- Từ khoá.
- CTA.
- Mức độ chuyên môn.

#### 4.2. Research Pack

Cho phép người dùng:

- Thêm nguồn.
- Thêm URL.
- Thêm trích dẫn.
- Ghi ngày dữ liệu.
- Gán độ tin cậy.
- Liên kết source với claim.

#### 4.3. Finance Claim Ledger

Mỗi claim có:

- Nội dung.
- Nguồn.
- Loại dữ liệu.
- Trạng thái xác minh.
- Mức độ rủi ro.
- Section/scene đang sử dụng.

#### 4.4. Finance Calculator

Hỗ trợ:

- Thu nhập.
- Chi phí cố định.
- Lãi suất.
- Kỳ hạn.
- Phí ẩn.
- Lạm phát.
- Chi phí cơ hội.
- Scenario thấp/cơ sở/cao.
- Kết quả có đơn vị.
- Assumption rõ ràng.

AI không được tự quyết toàn bộ phép tính quan trọng. Calculator phải tạo kết quả chuẩn để AI diễn giải.

#### 4.5. Script sections và scenes

Tối thiểu cần có:

- Hook.
- Context.
- Analysis.
- Scenario.
- Solution.
- Takeaway.
- CTA.
- Disclaimer.

Mỗi scene có narration, visual notes, audio notes, on-screen text, claim IDs và calculation IDs.

#### 4.6. Render nhiều output

Từ cùng một ScriptDocument, tạo:

- Markdown preview.
- TTS-clean text.
- Excel.
- JSON backup.
- Scene board.
- Visual prompt file.
- YouTube metadata.

### Deliverables

- Episode có document schema.
- Có research và claim tracking.
- Có calculator cơ bản.
- Có scene-level editing.
- Không còn phụ thuộc hoàn toàn vào regex Markdown.

### Definition of Done

- Có thể tạo một episode finance từ brief.
- Mọi số liệu trong review được đánh dấu verified/assumption/needs-review.
- Có ít nhất một calculation được liên kết vào scene.
- Sửa narration không làm mất visual/audio metadata.
- Export từ canonical document cho ra các format khác nhau.

### Rủi ro

- Đây là phase có thay đổi domain lớn nhất.
- UI hiện tại cần adapter để hiển thị document cũ.
- Nên cho phép load các LibraryItem cũ ở read-only hoặc migrate tự động.

---

## Phase 5 — Review gate, risk control và scoring có cấu trúc

### Mục tiêu

Đảm bảo script tài chính không chỉ hấp dẫn mà còn minh bạch, nhất quán và giảm rủi ro thông tin sai hoặc lời khuyên quá mức.

### Phụ thuộc

Phase 4 có ScriptDocument, claims và calculations.

### Phạm vi công việc

#### 5.1. Fact review

Kiểm tra:

- Claim chưa có nguồn.
- Nguồn quá cũ.
- Claim mâu thuẫn.
- Dữ liệu không rõ thời điểm.
- Ví dụ giả định trình bày như dữ kiện thật.

#### 5.2. Math review

Kiểm tra:

- Kết quả narration khớp calculation.
- Đơn vị khớp.
- Tổng tiền khớp.
- Lãi suất khớp kỳ hạn.
- Không nhầm % với điểm phần trăm.

#### 5.3. Financial risk review

Phát hiện:

- Cam kết lợi nhuận.
- Khẳng định chắc chắn.
- Xúi giục mua/bán.
- Bỏ qua rủi ro.
- Dùng ngôn ngữ cá nhân hoá quá mạnh.
- Thiếu disclaimer.

#### 5.4. Retention review

Kiểm tra:

- Hook xuất hiện sớm.
- Có câu chuyển đoạn.
- Có micro-storytelling.
- Có luận điểm rõ.
- Có payoff đúng với promise.
- CTA cụ thể.

#### 5.5. Review report dạng JSON

Điểm số đề xuất:

- Overall.
- Retention.
- Clarity.
- Factual risk.
- Math consistency.
- Brand consistency.
- Actionability.

Issue cần có:

- Category.
- Severity.
- Message.
- Section ID.
- Claim ID hoặc calculation ID.
- Suggested fix.

### Deliverables

- Score modal hiển thị dữ liệu có cấu trúc.
- Có blocking issues.
- Có nút đi tới scene bị lỗi.
- Có thể chạy lại review sau revision.
- Có disclaimer theo content type.

### Definition of Done

- Script có claim không nguồn bị flag.
- Calculation sai bị flag.
- Câu cam kết lợi nhuận bị flag.
- Review report có thể lưu cùng document version.
- User biết rõ script đã đạt hay chưa đạt điều kiện export.

---

## Phase 6 — Production readiness và bảo mật

### Mục tiêu

Chuẩn bị để app phục vụ nhiều người dùng hoặc vận hành online an toàn hơn.

### Phụ thuộc

Phase 2, 3, 4 và 5.

### Phạm vi công việc

#### 6.1. Backend proxy

Chuyển luồng thành:

```text
Browser → Backend API → Provider adapter → AI provider
```

#### 6.2. Secret management

- Không lưu raw provider key trong browser production.
- Secret manager ở backend.
- Credential rotation.
- Provider health.
- Disable/re-enable key.
- Cooldown key.

#### 6.3. Usage và cost

- Token input/output.
- Estimated cost.
- Cost theo episode.
- Cost theo function.
- Cảnh báo bulk generation.
- Quota theo user/project.

#### 6.4. Observability

- Request ID.
- Error logs.
- Latency.
- Provider/model.
- Retry count.
- Failure rate.
- Job status.

#### 6.5. Job backend

Nếu generation dài hoặc batch lớn:

- Tạo job.
- Poll hoặc stream progress.
- Resume sau refresh.
- Retry từng step.
- Concurrency limit.
- Idempotency key.

#### 6.6. Bundle optimization

- Lazy-load modal.
- Dynamic import XLSX.
- Code split feature ít dùng.
- Đưa các dependency runtime cần thiết vào build pipeline.
- Giảm phụ thuộc CDN.

### Deliverables

- Provider key không còn nằm raw trong browser production.
- Có usage/cost tracking.
- Có job progress và retry.
- Có logging đủ để debug.
- Bundle được chia nhỏ hơn.

### Definition of Done

- Request production đi qua backend.
- Không lộ credential trong browser bundle.
- Rate limit hoạt động.
- Có thể xem usage theo episode.
- Job dài có thể resume.
- Build không còn chunk warning nghiêm trọng hoặc warning đã được xử lý có chủ đích.

---

## Phase 7 — Content studio và vòng lặp cải tiến từ dữ liệu thực tế

### Mục tiêu

Mở rộng từ việc tạo một video sang quản lý hệ thống nội dung và học từ hiệu quả publish.

### Phụ thuộc

Các phase nền tảng đã ổn định.

### Phạm vi công việc

- Content calendar.
- Series management.
- Brand bible.
- Template theo series.
- Thumbnail angle.
- YouTube description.
- Chapters.
- Pinned comment.
- Multi-channel repurposing.
- Collaboration và approval.
- Theo dõi CTR.
- Theo dõi retention.
- So sánh hook với hiệu quả thực tế.
- Tái sử dụng research pack.
- Tạo nhiều biến thể title/hook.

### Deliverables

- Một topic có thể tạo nhiều asset cho nhiều kênh.
- Có lịch content.
- Có feedback từ video đã publish.
- Có dữ liệu để cải thiện prompt và template.

### Definition of Done

- User quản lý được toàn bộ vòng đời episode.
- Có thể tái sử dụng research và template.
- Có báo cáo hiệu quả sau publish.
- Có cơ chế cải tiến nội dung dựa trên dữ liệu.

---

# 9. Kế hoạch triển khai theo thứ tự ưu tiên

## P0 — Bắt buộc trước khi thêm feature lớn

1. Sửa finance mode còn sót logic horror/space.
2. Chốt brand name.
3. Đồng bộ system prompt và code prompt.
4. Thêm `typecheck`.
5. Chuẩn hoá error.
6. Hoàn tất Library import/export.
7. Gom parser.
8. Thêm timeout và abort request.
9. Kiểm tra key rotation.
10. Thêm test cho parser và persistence.

## P1 — Nền tảng refactor

1. Tách workspace state.
2. Tách generation workflow.
3. Tách library repository.
4. Tách AI gateway.
5. Tạo prompt registry.
6. Tạo schema validation.
7. Thêm retry/cancel/resume cục bộ.
8. Chuyển cache sang key ổn định.

## P2 — Nâng chất lượng nghiệp vụ

1. Content brief.
2. ScriptDocument.
3. Scene model.
4. Research pack.
5. Claim ledger.
6. Finance calculator.
7. Review report.
8. Disclaimer policy.
9. Export từ canonical document.

## P3 — Production

1. Backend proxy.
2. Secret management.
3. Usage/cost tracking.
4. Rate limit.
5. Job queue.
6. Observability.
7. Code splitting.
8. Lazy-load feature.

## P4 — Scale content operation

1. Content calendar.
2. Series.
3. Collaboration.
4. Multi-channel outputs.
5. Analytics feedback loop.
6. Template optimization.

---

# 10. Tiêu chí chất lượng chung cho mọi phase

Mỗi phase chỉ được coi là hoàn thành khi:

- Build pass.
- Typecheck pass.
- Không tạo linter error mới.
- Có test cho logic mới nếu logic có thể test tự động.
- Không phá dữ liệu library cũ.
- Có migration hoặc backward compatibility nếu thay đổi schema.
- Có error message có ngữ cảnh.
- Có thể rollback thay đổi.
- UI vẫn có trạng thái loading, error, empty và success rõ ràng.
- Tính năng AI không tạo request vô hạn.
- Tác vụ dài có thể cancel hoặc báo tiến độ.

---

# 11. Test plan đề xuất

## 11.1. Unit test

- Markdown parser.
- TTS cleaner.
- Word count.
- Duration → word count.
- Finance calculation.
- Claim status.
- JSON response parser.
- Schema validation.
- Retry policy.
- Error normalization.
- Key manager.
- Migration.

## 11.2. Integration test

- Generate outline.
- Generate script.
- Sequential generation.
- Stop generation.
- Retry failed section.
- Save/load document.
- Import/export library.
- Generate scene assets.
- Run review report.

## 11.3. Manual acceptance test

- Người dùng mới tạo episode từ đầu.
- Người dùng load library cũ.
- Người dùng import JSON lỗi.
- Người dùng không có API key.
- Provider trả 401.
- Provider trả 429.
- Provider timeout.
- AI trả JSON không hợp lệ.
- User stop khi request đang chạy.
- User refresh trong quá trình tạo phần.
- User export script chưa review.
- User export script có blocking issue.

---

# 12. Definition of Done cho bản MVP refactor

MVP refactor được coi là đạt khi có đủ các điều kiện sau:

- Finance mode không còn logic cũ không liên quan.
- Brand và system prompt thống nhất.
- `App.tsx` không còn là nơi chứa toàn bộ workflow.
- AI provider được gọi qua gateway.
- AI JSON được validate bằng schema.
- Có timeout, retry hữu hạn và cancellation.
- Library có repository và import/export có version.
- Có `ScriptDocument` cơ bản.
- Script có section/scene thay vì chỉ là string.
- Có source/claim status tối thiểu.
- Có calculator cho một số bài toán tài chính phổ biến.
- Có review report với blocking issues.
- Có disclaimer bắt buộc trước export.
- Có unit test cho parser, calculator, schema và migration.
- Build/typecheck pass.
- Không lưu raw API key trong production architecture.

---

# 13. Nguyên tắc triển khai

## Không rewrite toàn bộ

Refactor theo hướng strangler pattern:

1. Giữ UI cũ.
2. Tạo adapter mới.
3. Chuyển từng handler sang adapter.
4. Chuyển từng feature sang hook.
5. Chuyển từng dữ liệu sang domain model.
6. Xoá code cũ sau khi có test và migration.

## Không thêm feature nếu chưa có domain owner

Mỗi feature mới cần trả lời:

- Dữ liệu này thuộc entity nào?
- Ai là use case xử lý?
- Repository nào lưu?
- Output có schema gì?
- Có version không?
- Có thể retry/cancel không?
- Có ảnh hưởng claim hoặc risk không?

## Không để Markdown là nguồn dữ liệu duy nhất

Markdown là format trình bày/export, không phải canonical model.

## Không để AI tự quyết các phép tính quan trọng

AI có thể giải thích, kể chuyện và chuyển giọng. Calculator và validation phải chịu trách nhiệm về số học.

## Không cho phép export không kiểm soát

Nếu có lỗi rủi ro cao hoặc claim chưa được kiểm tra, app cần cảnh báo rõ trước khi export.

---

# 14. Backlog implementation đề xuất

## Sprint 1 — Baseline

- [ ] Sửa finance identity.
- [ ] Chốt brand name.
- [ ] Sửa copy cũ.
- [ ] Đồng bộ prompt docs/code.
- [ ] Thêm typecheck.
- [ ] Thêm error model cơ bản.
- [ ] Build baseline.

## Sprint 2 — Persistence và parser

- [ ] Tạo Markdown parser chung.
- [ ] Tạo repository interface.
- [ ] Implement localStorage adapter.
- [ ] Hoàn tất library export/import.
- [ ] Thêm schema version.
- [ ] Viết migration test.

## Sprint 3 — Workflow extraction

- [ ] Tách workspace state.
- [ ] Tách generation workflow.
- [ ] Tách scene workflow.
- [ ] Tách review workflow.
- [ ] Giảm props của `ControlPanel`.
- [ ] Giảm handler trong `App.tsx`.

## Sprint 4 — AI gateway

- [ ] Tạo provider interface.
- [ ] Tách Kyma provider.
- [ ] Tách OpenAI-compatible provider.
- [ ] Tạo prompt registry.
- [ ] Tạo schema validation.
- [ ] Thêm retry/timeout/abort.
- [ ] Thêm request metadata.

## Sprint 5 — Finance domain

- [ ] Tạo `ContentBrief`.
- [ ] Tạo `ScriptDocument`.
- [ ] Tạo `ScriptSection`/`ScriptScene`.
- [ ] Tạo `ResearchPack`.
- [ ] Tạo `FinanceClaim`.
- [ ] Tạo `Calculation`.
- [ ] Tạo finance calculator.

## Sprint 6 — Review và export

- [ ] Tạo fact review.
- [ ] Tạo math review.
- [ ] Tạo risk review.
- [ ] Tạo retention review.
- [ ] Tạo `ReviewReport`.
- [ ] Chặn export khi có blocking issue.
- [ ] Render TTS/Excel/JSON từ document.

## Sprint 7 — Production hardening

- [ ] Backend proxy.
- [ ] Secret management.
- [ ] Rate limit.
- [ ] Usage/cost tracking.
- [ ] Job persistence.
- [ ] Observability.
- [ ] Lazy-loading.
- [ ] Bundle optimization.

---

# 15. Kết luận

Dark Frontiers đã có nền tảng tính năng tốt và đúng hướng cho một công cụ sản xuất nội dung tài chính cá nhân. Vấn đề chính hiện tại không phải thiếu thêm prompt hoặc thêm modal, mà là thiếu:

1. Ranh giới kiến trúc.
2. Domain model có cấu trúc.
3. AI contract đáng tin cậy.
4. Persistence có version.
5. Trust layer cho nguồn và số liệu.
6. Workflow có retry/cancel/resume.
7. Bảo mật phù hợp với production.

Thứ tự thực hiện được khuyến nghị là:

```text
Ổn định finance identity
    ↓
Thêm typecheck/test baseline
    ↓
Tách state và workflow
    ↓
Tách AI gateway và prompt registry
    ↓
Tách persistence
    ↓
Đưa vào ScriptDocument
    ↓
Thêm research/claim/calculation
    ↓
Thêm review gate
    ↓
Đưa secret về backend
    ↓
Mở rộng thành content studio
```

Không nên triển khai Phase 4 trước khi Phase 1–3 tạo được nền tảng đủ ổn định. Nếu làm đúng thứ tự, app có thể tiếp tục chạy trong toàn bộ quá trình refactor, giảm rủi ro rewrite và tạo được nền tảng để phát triển các tính năng nghiệp vụ tài chính có giá trị thực sự.
